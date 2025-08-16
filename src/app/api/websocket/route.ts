import { NextRequest } from 'next/server';
import { db } from '@/db';
import { users, products, orders, activityLogs, componentInteractions } from '@/db/schema';

interface WebSocketMessage {
  type: string;
  data: any;
  timestamp: string;
}

interface SubscriptionMessage {
  subscribe?: string;
  unsubscribe?: string;
}

interface ConnectionData {
  ws: WebSocket;
  subscriptions: Set<string>;
  lastHeartbeat: number;
  messageCount: number;
  lastMessageTime: number;
}

const connections = new Map<string, ConnectionData>();
const HEARTBEAT_INTERVAL = 30000; // 30 seconds
const RATE_LIMIT_WINDOW = 60000; // 1 minute
const MAX_MESSAGES_PER_WINDOW = 100;

export async function GET(request: NextRequest) {
  try {
    const upgrade = request.headers.get('upgrade');
    
    if (upgrade !== 'websocket') {
      return new Response('Expected Upgrade: websocket', { status: 426 });
    }

    const { socket, response } = Deno.upgradeWebSocket(request);
    
    const connectionId = crypto.randomUUID();
    
    socket.onopen = () => {
      console.log(`WebSocket connection opened: ${connectionId}`);
      
      connections.set(connectionId, {
        ws: socket,
        subscriptions: new Set(),
        lastHeartbeat: Date.now(),
        messageCount: 0,
        lastMessageTime: 0
      });

      // Send welcome message
      sendMessage(socket, {
        type: 'connected',
        data: { connectionId },
        timestamp: new Date().toISOString()
      });

      // Start heartbeat
      startHeartbeat(connectionId);
    };

    socket.onmessage = async (event) => {
      try {
        const connection = connections.get(connectionId);
        if (!connection) return;

        // Rate limiting
        const now = Date.now();
        if (now - connection.lastMessageTime < RATE_LIMIT_WINDOW) {
          connection.messageCount++;
          if (connection.messageCount > MAX_MESSAGES_PER_WINDOW) {
            sendMessage(socket, {
              type: 'error',
              data: { message: 'Rate limit exceeded' },
              timestamp: new Date().toISOString()
            });
            return;
          }
        } else {
          connection.messageCount = 1;
          connection.lastMessageTime = now;
        }

        const message: SubscriptionMessage = JSON.parse(event.data);

        if (message.subscribe) {
          await handleSubscribe(connectionId, message.subscribe);
        } else if (message.unsubscribe) {
          handleUnsubscribe(connectionId, message.unsubscribe);
        }
      } catch (error) {
        console.error('WebSocket message error:', error);
        sendMessage(socket, {
          type: 'error',
          data: { message: 'Invalid message format' },
          timestamp: new Date().toISOString()
        });
      }
    };

    socket.onclose = () => {
      console.log(`WebSocket connection closed: ${connectionId}`);
      connections.delete(connectionId);
    };

    socket.onerror = (error) => {
      console.error(`WebSocket error for ${connectionId}:`, error);
      connections.delete(connectionId);
    };

    return response;
  } catch (error) {
    console.error('WebSocket upgrade error:', error);
    return new Response('WebSocket upgrade failed', { status: 500 });
  }
}

function sendMessage(socket: WebSocket, message: WebSocketMessage) {
  if (socket.readyState === WebSocket.OPEN) {
    socket.send(JSON.stringify(message));
  }
}

async function handleSubscribe(connectionId: string, subscription: string) {
  const connection = connections.get(connectionId);
  if (!connection) return;

  const validSubscriptions = ['users', 'products', 'orders', 'activity_logs', 'component_interactions', 'all'];
  
  if (!validSubscriptions.includes(subscription)) {
    sendMessage(connection.ws, {
      type: 'error',
      data: { message: 'Invalid subscription type' },
      timestamp: new Date().toISOString()
    });
    return;
  }

  connection.subscriptions.add(subscription);
  
  sendMessage(connection.ws, {
    type: 'subscribed',
    data: { subscription },
    timestamp: new Date().toISOString()
  });

  // Send initial data snapshot
  try {
    if (subscription === 'users' || subscription === 'all') {
      const usersData = await db.select().from(users).limit(50);
      sendMessage(connection.ws, {
        type: 'users_snapshot',
        data: usersData,
        timestamp: new Date().toISOString()
      });
    }

    if (subscription === 'products' || subscription === 'all') {
      const productsData = await db.select().from(products).limit(50);
      sendMessage(connection.ws, {
        type: 'products_snapshot',
        data: productsData,
        timestamp: new Date().toISOString()
      });
    }

    if (subscription === 'orders' || subscription === 'all') {
      const ordersData = await db.select().from(orders).limit(50);
      sendMessage(connection.ws, {
        type: 'orders_snapshot',
        data: ordersData,
        timestamp: new Date().toISOString()
      });
    }

    if (subscription === 'activity_logs' || subscription === 'all') {
      const activityData = await db.select().from(activityLogs).limit(50);
      sendMessage(connection.ws, {
        type: 'activity_logs_snapshot',
        data: activityData,
        timestamp: new Date().toISOString()
      });
    }

    if (subscription === 'component_interactions' || subscription === 'all') {
      const interactionsData = await db.select().from(componentInteractions).limit(50);
      sendMessage(connection.ws, {
        type: 'component_interactions_snapshot',
        data: interactionsData,
        timestamp: new Date().toISOString()
      });
    }
  } catch (error) {
    console.error('Error fetching initial data:', error);
    sendMessage(connection.ws, {
      type: 'error',
      data: { message: 'Failed to fetch initial data' },
      timestamp: new Date().toISOString()
    });
  }
}

function handleUnsubscribe(connectionId: string, subscription: string) {
  const connection = connections.get(connectionId);
  if (!connection) return;

  connection.subscriptions.delete(subscription);
  
  sendMessage(connection.ws, {
    type: 'unsubscribed',
    data: { subscription },
    timestamp: new Date().toISOString()
  });
}

function startHeartbeat(connectionId: string) {
  const interval = setInterval(() => {
    const connection = connections.get(connectionId);
    if (!connection) {
      clearInterval(interval);
      return;
    }

    const now = Date.now();
    if (now - connection.lastHeartbeat > HEARTBEAT_INTERVAL * 2) {
      // Connection is stale, close it
      connection.ws.close();
      connections.delete(connectionId);
      clearInterval(interval);
      return;
    }

    sendMessage(connection.ws, {
      type: 'heartbeat',
      data: { timestamp: now },
      timestamp: new Date().toISOString()
    });

    connection.lastHeartbeat = now;
  }, HEARTBEAT_INTERVAL);
}

// Broadcast functions to be used by other parts of the application
export function broadcastUsersUpdate(data: any) {
  const message: WebSocketMessage = {
    type: 'users_update',
    data,
    timestamp: new Date().toISOString()
  };

  connections.forEach((connection) => {
    if (connection.subscriptions.has('users') || connection.subscriptions.has('all')) {
      sendMessage(connection.ws, message);
    }
  });
}

export function broadcastProductsUpdate(data: any) {
  const message: WebSocketMessage = {
    type: 'products_update',
    data,
    timestamp: new Date().toISOString()
  };

  connections.forEach((connection) => {
    if (connection.subscriptions.has('products') || connection.subscriptions.has('all')) {
      sendMessage(connection.ws, message);
    }
  });
}

export function broadcastOrdersUpdate(data: any) {
  const message: WebSocketMessage = {
    type: 'orders_update',
    data,
    timestamp: new Date().toISOString()
  };

  connections.forEach((connection) => {
    if (connection.subscriptions.has('orders') || connection.subscriptions.has('all')) {
      sendMessage(connection.ws, message);
    }
  });
}

export function broadcastActivityLogsUpdate(data: any) {
  const message: WebSocketMessage = {
    type: 'activity_logs_update',
    data,
    timestamp: new Date().toISOString()
  };

  connections.forEach((connection) => {
    if (connection.subscriptions.has('activity_logs') || connection.subscriptions.has('all')) {
      sendMessage(connection.ws, message);
    }
  });
}

export function broadcastComponentInteractionsUpdate(data: any) {
  const message: WebSocketMessage = {
    type: 'component_interactions_update',
    data,
    timestamp: new Date().toISOString()
  };

  connections.forEach((connection) => {
    if (connection.subscriptions.has('component_interactions') || connection.subscriptions.has('all')) {
      sendMessage(connection.ws, message);
    }
  });
}

// Cleanup function to close all connections
export function closeAllConnections() {
  connections.forEach((connection, connectionId) => {
    connection.ws.close();
    connections.delete(connectionId);
  });
}

// Get connection stats
export function getConnectionStats() {
  return {
    totalConnections: connections.size,
    connections: Array.from(connections.entries()).map(([id, conn]) => ({
      id,
      subscriptions: Array.from(conn.subscriptions),
      lastHeartbeat: conn.lastHeartbeat,
      messageCount: conn.messageCount
    }))
  };
}