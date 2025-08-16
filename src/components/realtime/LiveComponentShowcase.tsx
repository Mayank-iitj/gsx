"use client";

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Label } from '@/components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { 
  Activity, 
  Users, 
  MousePointer, 
  Search, 
  TrendingUp, 
  AlertTriangle, 
  CheckCircle, 
  XCircle,
  Eye,
  Clock,
  BarChart3,
  Database,
  Zap,
  Target,
  Filter,
  RefreshCw
} from 'lucide-react';

interface RealtimeData {
  id: string;
  type: 'click' | 'hover' | 'form_submit' | 'error' | 'success';
  component: string;
  timestamp: number;
  userId: string;
  value?: any;
}

interface FormMetrics {
  completionRate: number;
  averageTime: number;
  abandonmentPoints: string[];
  validationErrors: { field: string; count: number }[];
}

interface ComponentHealth {
  uptime: number;
  errorRate: number;
  avgResponseTime: number;
  totalInteractions: number;
}

interface User {
  id: string;
  name: string;
  email: string;
  status: 'online' | 'offline';
  lastActive: Date;
}

interface Product {
  id: string;
  name: string;
  price: number;
  stock: number;
  category: string;
  lastUpdated: Date;
}

const mockUsers: User[] = [
  { id: '1', name: 'John Doe', email: 'john@example.com', status: 'online', lastActive: new Date() },
  { id: '2', name: 'Jane Smith', email: 'jane@example.com', status: 'online', lastActive: new Date() },
  { id: '3', name: 'Bob Johnson', email: 'bob@example.com', status: 'offline', lastActive: new Date(Date.now() - 300000) },
];

const mockProducts: Product[] = [
  { id: '1', name: 'Wireless Headphones', price: 99.99, stock: 45, category: 'Electronics', lastUpdated: new Date() },
  { id: '2', name: 'Smart Watch', price: 199.99, stock: 23, category: 'Electronics', lastUpdated: new Date() },
  { id: '3', name: 'Laptop Stand', price: 49.99, stock: 67, category: 'Accessories', lastUpdated: new Date() },
];

// Mock realtime hook
const useRealtime = () => {
  const [data, setData] = useState<RealtimeData[]>([]);
  const [isConnected, setIsConnected] = useState(true);

  const track = (event: Omit<RealtimeData, 'id' | 'timestamp' | 'userId'>) => {
    const newEvent: RealtimeData = {
      ...event,
      id: Math.random().toString(36).substr(2, 9),
      timestamp: Date.now(),
      userId: 'user-' + Math.random().toString(36).substr(2, 5),
    };
    setData(prev => [newEvent, ...prev.slice(0, 99)]);
  };

  useEffect(() => {
    // Simulate realtime data
    const interval = setInterval(() => {
      const eventTypes: RealtimeData['type'][] = ['click', 'hover', 'form_submit', 'error', 'success'];
      const components = ['search-input', 'submit-button', 'data-table', 'filter-select'];
      
      track({
        type: eventTypes[Math.floor(Math.random() * eventTypes.length)],
        component: components[Math.floor(Math.random() * components.length)],
        value: Math.random() > 0.5 ? 'test-value' : null,
      });
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  return { data, isConnected, track };
};

export const RealtimeComponentShowcase = () => {
  const { data: realtimeData, isConnected, track } = useRealtime();
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [searchQuery, setSearchQuery] = useState('');
  const [users, setUsers] = useState(mockUsers);
  const [products, setProducts] = useState(mockProducts);
  const [activeUsers, setActiveUsers] = useState(3);
  const [abTestVariant, setAbTestVariant] = useState<'A' | 'B'>('A');

  const [formMetrics] = useState<FormMetrics>({
    completionRate: 73.5,
    averageTime: 142,
    abandonmentPoints: ['email', 'message'],
    validationErrors: [
      { field: 'email', count: 23 },
      { field: 'name', count: 12 },
    ]
  });

  const [componentHealth] = useState<ComponentHealth>({
    uptime: 99.8,
    errorRate: 0.2,
    avgResponseTime: 45,
    totalInteractions: 12847,
  });

  useEffect(() => {
    // Simulate realtime user updates
    const interval = setInterval(() => {
      setUsers(prev => prev.map(user => ({
        ...user,
        lastActive: user.status === 'online' ? new Date() : user.lastActive,
      })));
      
      setProducts(prev => prev.map(product => ({
        ...product,
        stock: Math.max(0, product.stock + (Math.random() > 0.7 ? Math.floor(Math.random() * 5) - 2 : 0)),
        lastUpdated: new Date(),
      })));

      setActiveUsers(prev => Math.max(1, prev + (Math.random() > 0.6 ? 1 : -1)));
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    track({ type: 'form_submit', component: 'contact-form', value: formData });
    
    // Simulate validation
    if (!formData.email.includes('@')) {
      track({ type: 'error', component: 'email-field', value: 'Invalid email' });
    } else {
      track({ type: 'success', component: 'contact-form', value: 'Form submitted' });
      setFormData({ name: '', email: '', message: '' });
    }
  };

  const filteredUsers = users.filter(user => 
    user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getEventStats = () => {
    const last24h = realtimeData.filter(event => Date.now() - event.timestamp < 24 * 60 * 60 * 1000);
    const clicks = last24h.filter(event => event.type === 'click').length;
    const errors = last24h.filter(event => event.type === 'error').length;
    const formSubmits = last24h.filter(event => event.type === 'form_submit').length;
    
    return { clicks, errors, formSubmits, total: last24h.length };
  };

  const stats = getEventStats();

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Activity className="h-6 w-6 text-primary" />
                <h1 className="text-xl font-semibold">Realtime Component Analytics</h1>
              </div>
              <Badge variant={isConnected ? "default" : "destructive"} className="gap-1">
                <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-400 animate-pulse' : 'bg-red-400'}`} />
                {isConnected ? 'Connected' : 'Disconnected'}
              </Badge>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Users className="h-4 w-4" />
                <span>{activeUsers} active users</span>
              </div>
              <Badge variant="outline" className="gap-1">
                <Target className="h-3 w-3" />
                A/B Test: Variant {abTestVariant}
              </Badge>
            </div>
          </div>
        </div>
      </div>

      {/* Live Stats Bar */}
      <div className="bg-muted/30 border-b">
        <div className="container mx-auto px-6 py-3">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="flex items-center gap-2">
              <MousePointer className="h-4 w-4 text-blue-500" />
              <span className="text-sm">
                <span className="font-medium">{stats.clicks}</span> clicks (24h)
              </span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-500" />
              <span className="text-sm">
                <span className="font-medium">{stats.formSubmits}</span> submissions
              </span>
            </div>
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-red-500" />
              <span className="text-sm">
                <span className="font-medium">{stats.errors}</span> errors
              </span>
            </div>
            <div className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-purple-500" />
              <span className="text-sm">
                <span className="font-medium">{stats.total}</span> total events
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-8">
        <Tabs defaultValue="forms" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="forms">Interactive Forms</TabsTrigger>
            <TabsTrigger value="tables">Live Data Tables</TabsTrigger>
            <TabsTrigger value="analytics">Analytics Dashboard</TabsTrigger>
            <TabsTrigger value="health">System Health</TabsTrigger>
          </TabsList>

          {/* Interactive Forms Tab */}
          <TabsContent value="forms" className="space-y-6">
            <div className="grid lg:grid-cols-3 gap-6">
              {/* Form Section */}
              <div className="lg:col-span-2">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Zap className="h-5 w-5 text-yellow-500" />
                      Realtime Form with Live Validation
                    </CardTitle>
                    <CardDescription>
                      Watch validation happen in realtime and see live metrics
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <form onSubmit={handleFormSubmit} className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="name">Name</Label>
                        <Input
                          id="name"
                          value={formData.name}
                          onChange={(e) => {
                            setFormData(prev => ({ ...prev, name: e.target.value }));
                            track({ type: 'hover', component: 'name-field' });
                          }}
                          onFocus={() => track({ type: 'click', component: 'name-field' })}
                          placeholder="Enter your name"
                          className="transition-all duration-200"
                        />
                        {formData.name && formData.name.length < 2 && (
                          <Alert className="animate-in slide-in-from-top-1">
                            <AlertTriangle className="h-4 w-4" />
                            <AlertDescription>Name must be at least 2 characters</AlertDescription>
                          </Alert>
                        )}
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input
                          id="email"
                          type="email"
                          value={formData.email}
                          onChange={(e) => {
                            setFormData(prev => ({ ...prev, email: e.target.value }));
                            track({ type: 'hover', component: 'email-field' });
                          }}
                          onFocus={() => track({ type: 'click', component: 'email-field' })}
                          placeholder="Enter your email"
                          className="transition-all duration-200"
                        />
                        {formData.email && !formData.email.includes('@') && (
                          <Alert variant="destructive" className="animate-in slide-in-from-top-1">
                            <XCircle className="h-4 w-4" />
                            <AlertDescription>Please enter a valid email address</AlertDescription>
                          </Alert>
                        )}
                        {formData.email && formData.email.includes('@') && (
                          <Alert className="animate-in slide-in-from-top-1 border-green-200 bg-green-50 text-green-800">
                            <CheckCircle className="h-4 w-4 text-green-600" />
                            <AlertDescription>Email format is valid</AlertDescription>
                          </Alert>
                        )}
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="message">Message</Label>
                        <Textarea
                          id="message"
                          value={formData.message}
                          onChange={(e) => {
                            setFormData(prev => ({ ...prev, message: e.target.value }));
                            track({ type: 'hover', component: 'message-field' });
                          }}
                          onFocus={() => track({ type: 'click', component: 'message-field' })}
                          placeholder="Enter your message"
                          rows={4}
                          className="transition-all duration-200"
                        />
                        <div className="flex justify-between text-xs text-muted-foreground">
                          <span>{formData.message.length} characters</span>
                          <span>{formData.message.length < 10 ? 'Too short' : 'Good length'}</span>
                        </div>
                      </div>

                      <Button 
                        type="submit" 
                        className="w-full transition-all duration-200 hover:scale-[1.02]"
                        onClick={() => track({ type: 'click', component: 'submit-button' })}
                      >
                        Submit Form
                      </Button>
                    </form>

                    {/* Realtime Search */}
                    <div className="pt-6 border-t space-y-4">
                      <div className="flex items-center gap-2">
                        <Search className="h-4 w-4" />
                        <Label>Realtime Search</Label>
                      </div>
                      <Input
                        value={searchQuery}
                        onChange={(e) => {
                          setSearchQuery(e.target.value);
                          track({ type: 'hover', component: 'search-input', value: e.target.value });
                        }}
                        placeholder="Search users..."
                        className="transition-all duration-200"
                      />
                      {searchQuery && (
                        <div className="text-xs text-muted-foreground animate-in slide-in-from-top-1">
                          Found {filteredUsers.length} results in realtime
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Live Metrics */}
              <div className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Form Analytics</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Completion Rate</span>
                        <span className="font-medium">{formMetrics.completionRate}%</span>
                      </div>
                      <Progress value={formMetrics.completionRate} className="h-2" />
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Avg. Completion Time</span>
                        <span className="font-medium">{formMetrics.averageTime}s</span>
                      </div>
                      <Progress value={(formMetrics.averageTime / 300) * 100} className="h-2" />
                    </div>

                    <div className="space-y-2">
                      <div className="text-sm font-medium">Validation Errors (24h)</div>
                      {formMetrics.validationErrors.map((error) => (
                        <div key={error.field} className="flex justify-between text-xs">
                          <span className="capitalize">{error.field}</span>
                          <Badge variant="outline" className="text-xs">
                            {error.count}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Live Activity</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2 max-h-60 overflow-y-auto">
                    {realtimeData.slice(0, 10).map((event) => (
                      <div key={event.id} className="flex items-center gap-2 p-2 rounded border text-xs animate-in slide-in-from-top-1">
                        <div className={`w-2 h-2 rounded-full ${
                          event.type === 'click' ? 'bg-blue-500' :
                          event.type === 'error' ? 'bg-red-500' :
                          event.type === 'success' ? 'bg-green-500' :
                          'bg-gray-500'
                        }`} />
                        <span className="flex-1 truncate">
                          {event.component} - {event.type}
                        </span>
                        <span className="text-muted-foreground">
                          {new Date(event.timestamp).toLocaleTimeString()}
                        </span>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          {/* Live Data Tables Tab */}
          <TabsContent value="tables" className="space-y-6">
            <div className="grid lg:grid-cols-2 gap-6">
              {/* Users Table */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="h-5 w-5" />
                    Live Users Data
                  </CardTitle>
                  <CardDescription>
                    Realtime user status and search results
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center gap-2">
                      <Search className="h-4 w-4" />
                      <Input
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Filter users..."
                        className="flex-1"
                      />
                      <Badge variant="outline">
                        {filteredUsers.length} users
                      </Badge>
                    </div>

                    <div className="border rounded-lg">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>User</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Last Active</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {filteredUsers.map((user) => (
                            <TableRow 
                              key={user.id}
                              className="transition-colors hover:bg-muted/50"
                            >
                              <TableCell>
                                <div>
                                  <div className="font-medium">{user.name}</div>
                                  <div className="text-xs text-muted-foreground">{user.email}</div>
                                </div>
                              </TableCell>
                              <TableCell>
                                <Badge 
                                  variant={user.status === 'online' ? 'default' : 'secondary'}
                                  className="gap-1"
                                >
                                  <div className={`w-2 h-2 rounded-full ${
                                    user.status === 'online' ? 'bg-green-400 animate-pulse' : 'bg-gray-400'
                                  }`} />
                                  {user.status}
                                </Badge>
                              </TableCell>
                              <TableCell className="text-xs text-muted-foreground">
                                {user.lastActive.toLocaleTimeString()}
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Products Table */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Database className="h-5 w-5" />
                    Live Product Inventory
                  </CardTitle>
                  <CardDescription>
                    Stock levels update in realtime
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="border rounded-lg">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Product</TableHead>
                          <TableHead>Price</TableHead>
                          <TableHead>Stock</TableHead>
                          <TableHead>Updated</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {products.map((product) => (
                          <TableRow 
                            key={product.id}
                            className="transition-colors hover:bg-muted/50"
                          >
                            <TableCell>
                              <div>
                                <div className="font-medium">{product.name}</div>
                                <div className="text-xs text-muted-foreground">{product.category}</div>
                              </div>
                            </TableCell>
                            <TableCell className="font-medium">
                              ${product.price}
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center gap-2">
                                <Badge 
                                  variant={product.stock > 20 ? 'default' : product.stock > 0 ? 'secondary' : 'destructive'}
                                  className="animate-in zoom-in-50 duration-200"
                                >
                                  {product.stock}
                                </Badge>
                                {product.stock <= 10 && product.stock > 0 && (
                                  <AlertTriangle className="h-3 w-3 text-yellow-500" />
                                )}
                                {product.stock === 0 && (
                                  <XCircle className="h-3 w-3 text-red-500" />
                                )}
                              </div>
                            </TableCell>
                            <TableCell className="text-xs text-muted-foreground">
                              {product.lastUpdated.toLocaleTimeString()}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* A/B Testing Section */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5" />
                  A/B Testing Scenarios
                </CardTitle>
                <CardDescription>
                  Compare different component variants in realtime
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-4">
                  <Button
                    variant={abTestVariant === 'A' ? 'default' : 'outline'}
                    onClick={() => {
                      setAbTestVariant('A');
                      track({ type: 'click', component: 'ab-test-variant-a' });
                    }}
                    className="transition-all duration-200"
                  >
                    Variant A (Blue Theme)
                  </Button>
                  <Button
                    variant={abTestVariant === 'B' ? 'default' : 'outline'}
                    onClick={() => {
                      setAbTestVariant('B');
                      track({ type: 'click', component: 'ab-test-variant-b' });
                    }}
                    className="transition-all duration-200"
                  >
                    Variant B (Green Theme)
                  </Button>
                </div>

                <div className={`p-6 rounded-lg border transition-all duration-300 ${
                  abTestVariant === 'A' 
                    ? 'bg-blue-50 border-blue-200 dark:bg-blue-950 dark:border-blue-800' 
                    : 'bg-green-50 border-green-200 dark:bg-green-950 dark:border-green-800'
                }`}>
                  <h3 className="font-semibold mb-2">Variant {abTestVariant} Preview</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    This section demonstrates how different variants might look with realtime switching.
                  </p>
                  <Button 
                    className={`transition-all duration-200 ${
                      abTestVariant === 'A' 
                        ? 'bg-blue-600 hover:bg-blue-700' 
                        : 'bg-green-600 hover:bg-green-700'
                    }`}
                    onClick={() => track({ type: 'click', component: `variant-${abTestVariant}-button` })}
                  >
                    {abTestVariant === 'A' ? 'Primary Action' : 'Get Started'}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Analytics Dashboard Tab */}
          <TabsContent value="analytics" className="space-y-6">
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Total Interactions</p>
                      <p className="text-2xl font-bold">{componentHealth.totalInteractions.toLocaleString()}</p>
                    </div>
                    <BarChart3 className="h-8 w-8 text-blue-500" />
                  </div>
                  <div className="mt-2">
                    <Badge variant="outline" className="text-xs">
                      +12% from yesterday
                    </Badge>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Active Users</p>
                      <p className="text-2xl font-bold">{activeUsers}</p>
                    </div>
                    <Users className="h-8 w-8 text-green-500" />
                  </div>
                  <div className="mt-2">
                    <Badge variant="outline" className="text-xs animate-pulse">
                      Live count
                    </Badge>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Response Time</p>
                      <p className="text-2xl font-bold">{componentHealth.avgResponseTime}ms</p>
                    </div>
                    <Clock className="h-8 w-8 text-purple-500" />
                  </div>
                  <div className="mt-2">
                    <Badge variant="outline" className="text-xs">
                      Excellent
                    </Badge>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Error Rate</p>
                      <p className="text-2xl font-bold">{componentHealth.errorRate}%</p>
                    </div>
                    <AlertTriangle className="h-8 w-8 text-red-500" />
                  </div>
                  <div className="mt-2">
                    <Badge variant="outline" className="text-xs">
                      Very low
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* User Interaction Heatmap */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Eye className="h-5 w-5" />
                  Component Interaction Heatmap
                </CardTitle>
                <CardDescription>
                  Visual representation of user interactions across components
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-3 gap-4">
                  {['search-input', 'submit-button', 'data-table', 'filter-select', 'name-field', 'email-field'].map((component) => {
                    const interactions = realtimeData.filter(event => event.component === component).length;
                    const intensity = Math.min(100, (interactions / Math.max(1, realtimeData.length)) * 500);
                    
                    return (
                      <div 
                        key={component}
                        className="p-4 rounded border transition-all duration-200 hover:scale-105"
                        style={{ 
                          backgroundColor: `rgba(59, 130, 246, ${intensity / 100})`,
                          borderColor: intensity > 50 ? '#2563eb' : '#e2e8f0'
                        }}
                      >
                        <div className="text-sm font-medium capitalize">
                          {component.replace('-', ' ')}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {interactions} interactions
                        </div>
                        <div className="mt-2">
                          <Progress value={intensity} className="h-1" />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            {/* Live Event Stream */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="h-5 w-5" />
                  Live Event Stream
                </CardTitle>
                <CardDescription>
                  Real-time component events and user interactions
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 max-h-96 overflow-y-auto">
                  {realtimeData.map((event) => (
                    <div 
                      key={event.id} 
                      className="flex items-center gap-3 p-3 rounded border bg-card animate-in slide-in-from-top-1 duration-200"
                    >
                      <div className={`w-3 h-3 rounded-full ${
                        event.type === 'click' ? 'bg-blue-500' :
                        event.type === 'hover' ? 'bg-yellow-500' :
                        event.type === 'form_submit' ? 'bg-green-500' :
                        event.type === 'error' ? 'bg-red-500' :
                        'bg-purple-500'
                      } animate-pulse`} />
                      
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className="text-xs">
                            {event.type}
                          </Badge>
                          <span className="text-sm font-medium capitalize">
                            {event.component.replace('-', ' ')}
                          </span>
                        </div>
                        {event.value && (
                          <div className="text-xs text-muted-foreground mt-1">
                            Value: {typeof event.value === 'string' ? event.value : JSON.stringify(event.value)}
                          </div>
                        )}
                      </div>
                      
                      <div className="text-xs text-muted-foreground">
                        <div>{event.userId}</div>
                        <div>{new Date(event.timestamp).toLocaleTimeString()}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* System Health Tab */}
          <TabsContent value="health" className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              {/* System Status */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Activity className="h-5 w-5" />
                    System Health Status
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">System Uptime</span>
                      <div className="flex items-center gap-2">
                        <Badge variant="default" className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100">
                          {componentHealth.uptime}%
                        </Badge>
                        <CheckCircle className="h-4 w-4 text-green-500" />
                      </div>
                    </div>
                    <Progress value={componentHealth.uptime} className="h-2" />

                    <div className="flex items-center justify-between">
                      <span className="text-sm">Error Rate</span>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="text-green-800">
                          {componentHealth.errorRate}%
                        </Badge>
                        <CheckCircle className="h-4 w-4 text-green-500" />
                      </div>
                    </div>
                    <Progress value={componentHealth.errorRate} className="h-2" />

                    <div className="flex items-center justify-between">
                      <span className="text-sm">Avg Response Time</span>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline">
                          {componentHealth.avgResponseTime}ms
                        </Badge>
                        <CheckCircle className="h-4 w-4 text-green-500" />
                      </div>
                    </div>
                    <Progress value={(componentHealth.avgResponseTime / 100) * 100} className="h-2" />
                  </div>
                </CardContent>
              </Card>

              {/* Component Performance */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="h-5 w-5" />
                    Component Performance
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {['InputField', 'DataTable', 'SearchInput', 'FormSubmit'].map((component) => {
                    const performance = Math.floor(Math.random() * 40) + 60; // 60-100%
                    const status = performance > 80 ? 'excellent' : performance > 60 ? 'good' : 'needs attention';
                    
                    return (
                      <div key={component} className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium">{component}</span>
                          <div className="flex items-center gap-2">
                            <Badge 
                              variant={performance > 80 ? 'default' : performance > 60 ? 'secondary' : 'destructive'}
                              className="text-xs"
                            >
                              {performance}%
                            </Badge>
                            {performance > 80 ? 
                              <CheckCircle className="h-3 w-3 text-green-500" /> :
                              performance > 60 ?
                              <AlertTriangle className="h-3 w-3 text-yellow-500" /> :
                              <XCircle className="h-3 w-3 text-red-500" />
                            }
                          </div>
                        </div>
                        <Progress value={performance} className="h-1" />
                        <div className="text-xs text-muted-foreground capitalize">
                          Status: {status}
                        </div>
                      </div>
                    );
                  })}
                </CardContent>
              </Card>
            </div>

            {/* Error Tracking */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5" />
                  Error Tracking & Monitoring
                </CardTitle>
                <CardDescription>
                  Real-time error detection and component health alerts
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {realtimeData
                    .filter(event => event.type === 'error')
                    .slice(0, 5)
                    .map((error) => (
                      <Alert key={error.id} variant="destructive" className="animate-in slide-in-from-top-1">
                        <AlertTriangle className="h-4 w-4" />
                        <AlertDescription className="flex items-center justify-between">
                          <div>
                            <div className="font-medium">
                              Error in {error.component.replace('-', ' ')}
                            </div>
                            <div className="text-xs mt-1">
                              {error.value || 'Component error detected'}
                            </div>
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {new Date(error.timestamp).toLocaleTimeString()}
                          </div>
                        </AlertDescription>
                      </Alert>
                    ))}
                  
                  {realtimeData.filter(event => event.type === 'error').length === 0 && (
                    <Alert className="border-green-200 bg-green-50 text-green-800 dark:border-green-800 dark:bg-green-950 dark:text-green-100">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <AlertDescription>
                        No errors detected in the last 24 hours. All systems operating normally.
                      </AlertDescription>
                    </Alert>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Collaborative Features */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Collaborative Features Demo
                </CardTitle>
                <CardDescription>
                  Multiple users interacting with components simultaneously
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-2 mb-4">
                  <RefreshCw className="h-4 w-4 animate-spin" />
                  <span className="text-sm">Live collaboration active</span>
                  <Badge variant="outline">{activeUsers} users online</Badge>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Collaborative Input Field</Label>
                    <Input 
                      placeholder="Multiple users can edit this..."
                      className="transition-all duration-200"
                      onChange={() => track({ type: 'hover', component: 'collaborative-input' })}
                    />
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <div className="flex -space-x-1">
                        {Array.from({ length: Math.min(activeUsers, 3) }, (_, i) => (
                          <div 
                            key={i}
                            className={`w-4 h-4 rounded-full border-2 border-background ${
                              i === 0 ? 'bg-blue-500' : i === 1 ? 'bg-green-500' : 'bg-purple-500'
                            }`}
                          />
                        ))}
                      </div>
                      <span>{activeUsers} users currently editing</span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Shared Selection</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Team members can see selections..." />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="option1">Option 1</SelectItem>
                        <SelectItem value="option2">Option 2</SelectItem>
                        <SelectItem value="option3">Option 3</SelectItem>
                      </SelectContent>
                    </Select>
                    <div className="text-xs text-muted-foreground">
                      Last updated by User #{Math.floor(Math.random() * 100)} • {new Date().toLocaleTimeString()}
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t">
                  <div className="text-sm font-medium mb-2">Recent Collaborative Actions</div>
                  <div className="space-y-1">
                    {realtimeData.slice(0, 3).map((event) => (
                      <div key={event.id} className="text-xs text-muted-foreground flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-blue-500" />
                        <span className="font-medium">{event.userId}</span>
                        <span>performed {event.type} on {event.component}</span>
                        <span>{new Date(event.timestamp).toLocaleTimeString()}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};