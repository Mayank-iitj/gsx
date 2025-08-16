"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  Activity, 
  Users, 
  Package, 
  ShoppingCart, 
  Clock, 
  Wifi, 
  WifiOff, 
  TrendingUp, 
  Download, 
  Filter,
  Bell,
  Zap,
  Eye,
  EyeOff,
  Moon,
  Sun,
  Signal,
  Database,
  MessageSquare,
  BarChart3,
  RefreshCw
} from 'lucide-react';

// Mock realtime hook to demonstrate functionality
const useRealtime = () => {
  const [connected, setConnected] = useState(true);
  const [users, setUsers] = useState([]);
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [activities, setActivities] = useState([]);
  const [interactions, setInteractions] = useState([]);
  const [stats, setStats] = useState({
    messageRate: 0,
    latency: 0,
    uptime: 0,
    totalMessages: 0
  });

  const subscribe = (channel: string) => {
    console.log(`Subscribing to ${channel}`);
  };

  const unsubscribe = (channel: string) => {
    console.log(`Unsubscribing from ${channel}`);
  };

  // Simulate realtime data
  useEffect(() => {
    const interval = setInterval(() => {
      setStats(prev => ({
        messageRate: Math.floor(Math.random() * 100),
        latency: Math.floor(Math.random() * 50) + 10,
        uptime: prev.uptime + 1,
        totalMessages: prev.totalMessages + Math.floor(Math.random() * 10)
      }));

      // Add new activity
      setActivities(prev => [
        {
          id: Date.now(),
          type: ['user_login', 'order_created', 'product_updated'][Math.floor(Math.random() * 3)],
          message: `New activity at ${new Date().toLocaleTimeString()}`,
          timestamp: new Date().toISOString(),
          severity: ['info', 'success', 'warning'][Math.floor(Math.random() * 3)]
        },
        ...prev.slice(0, 9)
      ]);

      // Update users randomly
      if (Math.random() > 0.7) {
        setUsers(prev => [
          {
            id: Date.now(),
            name: `User ${Math.floor(Math.random() * 1000)}`,
            status: Math.random() > 0.5 ? 'online' : 'offline',
            lastSeen: new Date().toISOString()
          },
          ...prev.slice(0, 4)
        ]);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return {
    connected,
    users,
    products,
    orders,
    activities,
    interactions,
    stats,
    subscribe,
    unsubscribe
  };
};

interface Subscription {
  id: string;
  name: string;
  channel: string;
  active: boolean;
  icon: React.ReactNode;
  count: number;
}

export const RealtimeDashboard = () => {
  const { connected, users, activities, stats, subscribe, unsubscribe } = useRealtime();
  const [darkMode, setDarkMode] = useState(false);
  const [notifications, setNotifications] = useState(true);
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  const [subscriptions, setSubscriptions] = useState<Subscription[]>([
    { id: 'users', name: 'Users', channel: 'users', active: true, icon: <Users className="w-4 h-4" />, count: 245 },
    { id: 'products', name: 'Products', channel: 'products', active: true, icon: <Package className="w-4 h-4" />, count: 1024 },
    { id: 'orders', name: 'Orders', channel: 'orders', active: false, icon: <ShoppingCart className="w-4 h-4" />, count: 89 },
    { id: 'activities', name: 'Activities', channel: 'activities', active: true, icon: <Activity className="w-4 h-4" />, count: 156 },
    { id: 'interactions', name: 'Interactions', channel: 'interactions', active: false, icon: <MessageSquare className="w-4 h-4" />, count: 34 }
  ]);

  const toggleSubscription = (id: string) => {
    setSubscriptions(prev => prev.map(sub => {
      if (sub.id === id) {
        const newActive = !sub.active;
        if (newActive) {
          subscribe(sub.channel);
        } else {
          unsubscribe(sub.channel);
        }
        return { ...sub, active: newActive };
      }
      return sub;
    }));
  };

  const exportData = () => {
    const data = {
      timestamp: new Date().toISOString(),
      stats,
      activities: activities.slice(0, 10),
      subscriptions: subscriptions.filter(sub => sub.active)
    };
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `realtime-data-${Date.now()}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const chartData = Array.from({ length: 20 }, (_, i) => ({
    time: new Date(Date.now() - (19 - i) * 1000).toLocaleTimeString(),
    messages: Math.floor(Math.random() * 100),
    latency: Math.floor(Math.random() * 50) + 10
  }));

  return (
    <div className={`min-h-screen p-6 space-y-6 ${darkMode ? 'dark' : ''}`}>
      {/* Header */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div>
          <h1 className="text-3xl font-bold text-foreground">Realtime Dashboard</h1>
          <p className="text-muted-foreground">Monitor live data streams and WebSocket connections</p>
        </div>
        
        <div className="flex items-center gap-4">
          <Button 
            variant="outline" 
            onClick={exportData}
            className="flex items-center gap-2"
          >
            <Download className="w-4 h-4" />
            Export Data
          </Button>
          
          <div className="flex items-center gap-2">
            <Sun className="w-4 h-4" />
            <Switch 
              checked={darkMode} 
              onCheckedChange={setDarkMode}
            />
            <Moon className="w-4 h-4" />
          </div>
        </div>
      </motion.div>

      {/* Connection Status */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="grid grid-cols-1 md:grid-cols-4 gap-6"
      >
        <Card className="relative overflow-hidden">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium">Connection Status</CardTitle>
              {connected ? (
                <motion.div
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="w-3 h-3 bg-green-500 rounded-full"
                />
              ) : (
                <div className="w-3 h-3 bg-red-500 rounded-full" />
              )}
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              {connected ? <Wifi className="w-5 h-5 text-green-500" /> : <WifiOff className="w-5 h-5 text-red-500" />}
              <span className="text-2xl font-bold">{connected ? 'Connected' : 'Disconnected'}</span>
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              WebSocket connection active
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Message Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <Signal className="w-5 h-5 text-blue-500" />
              <span className="text-2xl font-bold">{stats.messageRate}/s</span>
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Real-time messages per second
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Latency</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <Zap className="w-5 h-5 text-yellow-500" />
              <span className="text-2xl font-bold">{stats.latency}ms</span>
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Average response time
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Messages</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <Database className="w-5 h-5 text-purple-500" />
              <span className="text-2xl font-bold">{stats.totalMessages.toLocaleString()}</span>
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Messages processed today
            </p>
          </CardContent>
        </Card>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Subscriptions Control */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="w-5 h-5" />
                Data Streams
              </CardTitle>
              <CardDescription>
                Manage your real-time subscriptions
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {subscriptions.map((sub) => (
                <motion.div
                  key={sub.id}
                  layout
                  className="flex items-center justify-between p-3 rounded-lg border"
                >
                  <div className="flex items-center gap-3">
                    {sub.icon}
                    <div>
                      <p className="font-medium">{sub.name}</p>
                      <p className="text-xs text-muted-foreground">{sub.count} items</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant={sub.active ? "default" : "secondary"}>
                      {sub.active ? "Active" : "Inactive"}
                    </Badge>
                    <Switch
                      checked={sub.active}
                      onCheckedChange={() => toggleSubscription(sub.id)}
                    />
                  </div>
                </motion.div>
              ))}
            </CardContent>
          </Card>
        </motion.div>

        {/* Live Activity Feed */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Clock className="w-5 h-5" />
                  Live Activity Feed
                </CardTitle>
                <div className="flex items-center gap-2">
                  <Bell className="w-4 h-4" />
                  <Switch
                    checked={notifications}
                    onCheckedChange={setNotifications}
                  />
                </div>
              </div>
              <CardDescription>
                Real-time events and updates
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-64">
                <AnimatePresence>
                  {activities.map((activity) => (
                    <motion.div
                      key={activity.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      className="flex items-start gap-3 p-2 rounded-lg mb-2 hover:bg-muted/50"
                    >
                      <div className={`w-2 h-2 rounded-full mt-2 flex-shrink-0 ${
                        activity.severity === 'success' ? 'bg-green-500' :
                        activity.severity === 'warning' ? 'bg-yellow-500' : 'bg-blue-500'
                      }`} />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">{activity.message}</p>
                        <p className="text-xs text-muted-foreground">
                          {new Date(activity.timestamp).toLocaleTimeString()}
                        </p>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </ScrollArea>
            </CardContent>
          </Card>
        </motion.div>

        {/* Real-time Charts */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="w-5 h-5" />
                Performance Metrics
              </CardTitle>
              <CardDescription>
                Live system performance data
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm">
                    <span>CPU Usage</span>
                    <span>65%</span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2 mt-1">
                    <motion.div
                      className="bg-blue-500 h-2 rounded-full"
                      initial={{ width: 0 }}
                      animate={{ width: '65%' }}
                      transition={{ duration: 1 }}
                    />
                  </div>
                </div>
                
                <div>
                  <div className="flex justify-between text-sm">
                    <span>Memory Usage</span>
                    <span>42%</span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2 mt-1">
                    <motion.div
                      className="bg-green-500 h-2 rounded-full"
                      initial={{ width: 0 }}
                      animate={{ width: '42%' }}
                      transition={{ duration: 1, delay: 0.2 }}
                    />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-sm">
                    <span>Network I/O</span>
                    <span>78%</span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2 mt-1">
                    <motion.div
                      className="bg-yellow-500 h-2 rounded-full"
                      initial={{ width: 0 }}
                      animate={{ width: '78%' }}
                      transition={{ duration: 1, delay: 0.4 }}
                    />
                  </div>
                </div>

                <div className="pt-4">
                  <h4 className="text-sm font-medium mb-2">Active Connections</h4>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div className="flex justify-between">
                      <span>WebSocket:</span>
                      <span className="font-mono">1,247</span>
                    </div>
                    <div className="flex justify-between">
                      <span>HTTP:</span>
                      <span className="font-mono">3,891</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Data Tables */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Live Data Tables</CardTitle>
                <CardDescription>Real-time data with filtering and sorting</CardDescription>
              </div>
              
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <Filter className="w-4 h-4" />
                  <Select value={filter} onValueChange={setFilter}>
                    <SelectTrigger className="w-32">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All</SelectItem>
                      <SelectItem value="online">Online</SelectItem>
                      <SelectItem value="offline">Offline</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <Input
                  placeholder="Search users..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-48"
                />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="users" className="space-y-4">
              <TabsList>
                <TabsTrigger value="users">Users</TabsTrigger>
                <TabsTrigger value="activities">Activities</TabsTrigger>
                <TabsTrigger value="metrics">Metrics</TabsTrigger>
              </TabsList>
              
              <TabsContent value="users">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>User</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Last Seen</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <AnimatePresence>
                      {users.slice(0, 5).map((user) => (
                        <motion.tr
                          key={user.id}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          className="border-b"
                        >
                          <TableCell className="font-medium">{user.name}</TableCell>
                          <TableCell>
                            <Badge variant={user.status === 'online' ? 'default' : 'secondary'}>
                              {user.status}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-sm text-muted-foreground">
                            {new Date(user.lastSeen).toLocaleString()}
                          </TableCell>
                          <TableCell>
                            <div className="flex gap-2">
                              <Button size="sm" variant="outline">
                                <Eye className="w-4 h-4" />
                              </Button>
                              <Button size="sm" variant="outline">
                                <RefreshCw className="w-4 h-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </motion.tr>
                      ))}
                    </AnimatePresence>
                  </TableBody>
                </Table>
              </TabsContent>
              
              <TabsContent value="activities">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Type</TableHead>
                      <TableHead>Message</TableHead>
                      <TableHead>Severity</TableHead>
                      <TableHead>Timestamp</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {activities.slice(0, 5).map((activity) => (
                      <TableRow key={activity.id}>
                        <TableCell className="font-medium">{activity.type}</TableCell>
                        <TableCell>{activity.message}</TableCell>
                        <TableCell>
                          <Badge variant={
                            activity.severity === 'success' ? 'default' :
                            activity.severity === 'warning' ? 'destructive' : 'secondary'
                          }>
                            {activity.severity}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-sm text-muted-foreground">
                          {new Date(activity.timestamp).toLocaleString()}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TabsContent>

              <TabsContent value="metrics">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {chartData.slice(-6).map((data, index) => (
                    <Card key={index}>
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm font-medium">{data.time}</p>
                            <p className="text-2xl font-bold">{data.messages}</p>
                          </div>
                          <TrendingUp className="w-8 h-8 text-green-500" />
                        </div>
                        <p className="text-xs text-muted-foreground mt-2">
                          {data.latency}ms latency
                        </p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};