"use client";

import { useEffect, useRef, useState, useCallback } from 'react';

/**
 * WebSocket connection state enumeration
 */
export type ConnectionState = 'connecting' | 'connected' | 'disconnected' | 'error' | 'reconnecting';

/**
 * Available subscription types for realtime data
 */
export type SubscriptionType = 'users' | 'products' | 'orders' | 'activity_logs' | 'component_interactions' | 'all';

/**
 * WebSocket message structure for incoming data
 */
export interface WebSocketMessage {
  type: 'subscription_data' | 'heartbeat' | 'error' | 'connection_stats';
  subscription?: SubscriptionType;
  data?: any;
  timestamp?: number;
  error?: string;
}

/**
 * Component interaction data structure
 */
export interface ComponentInteraction {
  id: string;
  component: string;
  action: string;
  props?: Record<string, any>;
  timestamp: number;
  userId?: string;
  sessionId?: string;
}

/**
 * Connection statistics and quality metrics
 */
export interface ConnectionStats {
  connectedAt?: number;
  totalMessages: number;
  messagesPerSecond: number;
  latency: number;
  reconnectionCount: number;
  uptime: number;
  quality: 'excellent' | 'good' | 'fair' | 'poor';
}

/**
 * Subscription data organized by type
 */
export interface SubscriptionData {
  users: any[];
  products: any[];
  orders: any[];
  activity_logs: any[];
  component_interactions: ComponentInteraction[];
  all: any[];
}

/**
 * Loading states for each subscription type
 */
export interface LoadingStates {
  users: boolean;
  products: boolean;
  orders: boolean;
  activity_logs: boolean;
  component_interactions: boolean;
  all: boolean;
}

/**
 * Return type for the useRealtime hook
 */
export interface UseRealtimeReturn {
  connectionState: ConnectionState;
  data: SubscriptionData;
  loading: LoadingStates;
  stats: ConnectionStats;
  subscribe: (type: SubscriptionType) => void;
  unsubscribe: (type: SubscriptionType) => void;
  trackInteraction: (interaction: Omit<ComponentInteraction, 'id' | 'timestamp'>) => void;
  reconnect: () => void;
  disconnect: () => void;
  isSubscribed: (type: SubscriptionType) => boolean;
  activeSubscriptions: SubscriptionType[];
}

/**
 * Configuration options for the realtime hook
 */
export interface RealtimeConfig {
  endpoint?: string;
  heartbeatInterval?: number;
  reconnectInterval?: number;
  maxReconnectAttempts?: number;
  autoReconnect?: boolean;
}

/**
 * Comprehensive realtime WebSocket hook for managing connections and subscriptions
 * 
 * @param config Configuration options for the WebSocket connection
 * @returns Object containing connection state, data, and control methods
 * 
 * @example
 * * const { 
 *   connectionState, 
 *   data, 
 *   subscribe, 
 *   trackInteraction 
 * } = useRealtime({
 *   endpoint: '/api/websocket',
 *   autoReconnect: true
 * });
 * 
 * // Subscribe to component interactions
 * useEffect(() => {
 *   subscribe('component_interactions');
 * }, []);
 * 
 * // Track a component interaction
 * const handleButtonClick = () => {
 *   trackInteraction({
 *     component: 'Button',
 *     action: 'click',
 *     props: { variant: 'primary' }
 *   });
 * };
 * */
export const useRealtime = (config: RealtimeConfig = {}): UseRealtimeReturn => {
  const {
    endpoint = '/api/websocket',
    heartbeatInterval = 30000,
    reconnectInterval = 5000,
    maxReconnectAttempts = 5,
    autoReconnect = true
  } = config;

  // WebSocket connection ref
  const wsRef = useRef<WebSocket | null>(null);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const heartbeatTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const pingTimeRef = useRef<number>(0);

  // Connection state
  const [connectionState, setConnectionState] = useState<ConnectionState>('disconnected');
  const [reconnectAttempts, setReconnectAttempts] = useState(0);

  // Subscriptions management
  const [activeSubscriptions, setActiveSubscriptions] = useState<Set<SubscriptionType>>(new Set());
  
  // Data storage for each subscription type
  const [data, setData] = useState<SubscriptionData>({
    users: [],
    products: [],
    orders: [],
    activity_logs: [],
    component_interactions: [],
    all: []
  });

  // Loading states
  const [loading, setLoading] = useState<LoadingStates>({
    users: false,
    products: false,
    orders: false,
    activity_logs: false,
    component_interactions: false,
    all: false
  });

  // Connection statistics
  const [stats, setStats] = useState<ConnectionStats>({
    totalMessages: 0,
    messagesPerSecond: 0,
    latency: 0,
    reconnectionCount: 0,
    uptime: 0,
    quality: 'good'
  });

  // Message rate tracking
  const messageCountRef = useRef(0);
  const lastMessageTimeRef = useRef(Date.now());

  /**
   * Calculate connection quality based on latency and message rate
   */
  const calculateQuality = useCallback((latency: number, messageRate: number): ConnectionStats['quality'] => {
    if (latency < 50 && messageRate > 0.8) return 'excellent';
    if (latency < 100 && messageRate > 0.6) return 'good';
    if (latency < 200 && messageRate > 0.4) return 'fair';
    return 'poor';
  }, []);

  /**
   * Update connection statistics
   */
  const updateStats = useCallback(() => {
    setStats(prev => {
      const now = Date.now();
      const uptime = prev.connectedAt ? now - prev.connectedAt : 0;
      const messageRate = messageCountRef.current / Math.max(1, (now - lastMessageTimeRef.current) / 1000);
      
      return {
        ...prev,
        uptime,
        messagesPerSecond: messageRate,
        quality: calculateQuality(prev.latency, messageRate)
      };
    });
  }, [calculateQuality]);

  /**
   * Send heartbeat ping to measure latency
   */
  const sendHeartbeat = useCallback(() => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      pingTimeRef.current = Date.now();
      wsRef.current.send(JSON.stringify({ type: 'ping', timestamp: pingTimeRef.current }));
    }
  }, []);

  /**
   * Start heartbeat monitoring
   */
  const startHeartbeat = useCallback(() => {
    if (heartbeatTimeoutRef.current) {
      clearInterval(heartbeatTimeoutRef.current);
    }
    
    heartbeatTimeoutRef.current = setInterval(sendHeartbeat, heartbeatInterval);
  }, [sendHeartbeat, heartbeatInterval]);

  /**
   * Stop heartbeat monitoring
   */
  const stopHeartbeat = useCallback(() => {
    if (heartbeatTimeoutRef.current) {
      clearInterval(heartbeatTimeoutRef.current);
      heartbeatTimeoutRef.current = null;
    }
  }, []);

  /**
   * Handle incoming WebSocket messages
   */
  const handleMessage = useCallback((event: MessageEvent) => {
    try {
      const message: WebSocketMessage = JSON.parse(event.data);
      
      // Update message statistics
      messageCountRef.current++;
      setStats(prev => ({ ...prev, totalMessages: prev.totalMessages + 1 }));

      switch (message.type) {
        case 'subscription_data':
          if (message.subscription && message.data) {
            setData(prev => ({
              ...prev,
              [message.subscription!]: message.data
            }));
            
            // Mark as not loading for this subscription
            setLoading(prev => ({
              ...prev,
              [message.subscription!]: false
            }));
          }
          break;

        case 'heartbeat':
          // Calculate latency from ping response
          if (message.timestamp && pingTimeRef.current) {
            const latency = Date.now() - pingTimeRef.current;
            setStats(prev => ({ ...prev, latency }));
          }
          break;

        case 'error':
          console.error('WebSocket error:', message.error);
          setConnectionState('error');
          break;

        case 'connection_stats':
          if (message.data) {
            setStats(prev => ({ ...prev, ...message.data }));
          }
          break;
      }
    } catch (error) {
      console.error('Failed to parse WebSocket message:', error);
    }
  }, []);

  /**
   * Handle WebSocket connection opening
   */
  const handleOpen = useCallback(() => {
    setConnectionState('connected');
    setReconnectAttempts(0);
    setStats(prev => ({
      ...prev,
      connectedAt: Date.now(),
      reconnectionCount: prev.reconnectionCount + (prev.connectedAt ? 1 : 0)
    }));
    
    startHeartbeat();
    
    // Resubscribe to active subscriptions
    activeSubscriptions.forEach(subscription => {
      if (wsRef.current?.readyState === WebSocket.OPEN) {
        wsRef.current.send(JSON.stringify({
          type: 'subscribe',
          subscription
        }));
      }
    });
  }, [activeSubscriptions, startHeartbeat]);

  /**
   * Handle WebSocket connection closing
   */
  const handleClose = useCallback(() => {
    setConnectionState('disconnected');
    stopHeartbeat();
    
    // Mark all subscriptions as loading
    setLoading({
      users: true,
      products: true,
      orders: true,
      activity_logs: true,
      component_interactions: true,
      all: true
    });

    // Attempt reconnection if enabled
    if (autoReconnect && reconnectAttempts < maxReconnectAttempts) {
      setConnectionState('reconnecting');
      reconnectTimeoutRef.current = setTimeout(() => {
        setReconnectAttempts(prev => prev + 1);
        connect();
      }, reconnectInterval);
    }
  }, [autoReconnect, reconnectAttempts, maxReconnectAttempts, reconnectInterval, stopHeartbeat]);

  /**
   * Handle WebSocket errors
   */
  const handleError = useCallback(() => {
    setConnectionState('error');
    stopHeartbeat();
  }, [stopHeartbeat]);

  /**
   * Establish WebSocket connection
   */
  const connect = useCallback(() => {
    if (wsRef.current?.readyState === WebSocket.CONNECTING || 
        wsRef.current?.readyState === WebSocket.OPEN) {
      return;
    }

    setConnectionState('connecting');
    
    try {
      const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
      const wsUrl = `${protocol}//${window.location.host}${endpoint}`;
      
      wsRef.current = new WebSocket(wsUrl);
      wsRef.current.onopen = handleOpen;
      wsRef.current.onmessage = handleMessage;
      wsRef.current.onclose = handleClose;
      wsRef.current.onerror = handleError;
    } catch (error) {
      console.error('Failed to create WebSocket connection:', error);
      setConnectionState('error');
    }
  }, [endpoint, handleOpen, handleMessage, handleClose, handleError]);

  /**
   * Disconnect from WebSocket
   */
  const disconnect = useCallback(() => {
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
      reconnectTimeoutRef.current = null;
    }
    
    stopHeartbeat();
    
    if (wsRef.current) {
      wsRef.current.close();
      wsRef.current = null;
    }
    
    setConnectionState('disconnected');
    setReconnectAttempts(0);
  }, [stopHeartbeat]);

  /**
   * Manually trigger reconnection
   */
  const reconnect = useCallback(() => {
    disconnect();
    setTimeout(connect, 100);
  }, [disconnect, connect]);

  /**
   * Subscribe to a data type
   */
  const subscribe = useCallback((type: SubscriptionType) => {
    setActiveSubscriptions(prev => new Set(prev).add(type));
    setLoading(prev => ({ ...prev, [type]: true }));
    
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify({
        type: 'subscribe',
        subscription: type
      }));
    }
  }, []);

  /**
   * Unsubscribe from a data type
   */
  const unsubscribe = useCallback((type: SubscriptionType) => {
    setActiveSubscriptions(prev => {
      const newSet = new Set(prev);
      newSet.delete(type);
      return newSet;
    });
    
    setLoading(prev => ({ ...prev, [type]: false }));
    
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify({
        type: 'unsubscribe',
        subscription: type
      }));
    }
  }, []);

  /**
   * Check if subscribed to a data type
   */
  const isSubscribed = useCallback((type: SubscriptionType): boolean => {
    return activeSubscriptions.has(type);
  }, [activeSubscriptions]);

  /**
   * Track a component interaction
   */
  const trackInteraction = useCallback((interaction: Omit<ComponentInteraction, 'id' | 'timestamp'>) => {
    const fullInteraction: ComponentInteraction = {
      ...interaction,
      id: `interaction_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      timestamp: Date.now(),
      sessionId: sessionStorage.getItem('sessionId') || 'anonymous'
    };

    // Update local state immediately
    setData(prev => ({
      ...prev,
      component_interactions: [fullInteraction, ...prev.component_interactions.slice(0, 99)]
    }));

    // Send to server if connected
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify({
        type: 'track_interaction',
        data: fullInteraction
      }));
    }
  }, []);

  // Initialize connection on mount
  useEffect(() => {
    connect();
    
    // Update stats periodically
    const statsInterval = setInterval(updateStats, 1000);
    
    return () => {
      disconnect();
      clearInterval(statsInterval);
    };
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      disconnect();
    };
  }, [disconnect]);

  return {
    connectionState,
    data,
    loading,
    stats,
    subscribe,
    unsubscribe,
    trackInteraction,
    reconnect,
    disconnect,
    isSubscribed,
    activeSubscriptions: Array.from(activeSubscriptions)
  };
};

export default useRealtime;