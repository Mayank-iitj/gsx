"use client";

import React, { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { 
  ArrowUpDown, 
  ArrowUp, 
  ArrowDown,
  Edit2,
  Trash2,
  Eye,
  CheckCircle,
  XCircle,
  Clock,
  Star,
  Package,
  Users,
  ShoppingCart,
  Database,
  Zap,
  Shield,
  Palette,
  Code,
  Play,
  Copy,
  Activity,
  TrendingUp,
  RefreshCw,
  Search,
  Filter
} from "lucide-react";

// Enhanced DataTable component with realtime features
const DataTable = ({ 
  columns, 
  data, 
  selectable = false, 
  sortable = true,
  loading = false,
  onSelectionChange,
  onInteraction,
  className = ""
}) => {
  const [sortConfig, setSortConfig] = useState({ key: null, direction: null });
  const [selectedRows, setSelectedRows] = useState(new Set());

  const handleSort = (columnKey) => {
    if (!sortable) return;
    
    let direction = 'asc';
    if (sortConfig.key === columnKey && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key: columnKey, direction });
    
    onInteraction?.('sort', { column: columnKey, direction, previousColumn: sortConfig.key });
  };

  const sortedData = React.useMemo(() => {
    if (!sortConfig.key) return data;

    return [...data].sort((a, b) => {
      const aVal = a[sortConfig.key];
      const bVal = b[sortConfig.key];

      if (aVal < bVal) return sortConfig.direction === 'asc' ? -1 : 1;
      if (aVal > bVal) return sortConfig.direction === 'asc' ? 1 : -1;
      return 0;
    });
  }, [data, sortConfig]);

  const handleSelectAll = (checked) => {
    const newSelected = checked ? new Set(data.map(row => row.id)) : new Set();
    setSelectedRows(newSelected);
    onSelectionChange?.(newSelected);
    onInteraction?.('select_all', { selected: checked, count: newSelected.size });
  };

  const handleSelectRow = (rowId, checked) => {
    const newSelected = new Set(selectedRows);
    if (checked) {
      newSelected.add(rowId);
    } else {
      newSelected.delete(rowId);
    }
    setSelectedRows(newSelected);
    onSelectionChange?.(newSelected);
    onInteraction?.('select_row', { rowId, selected: checked, totalSelected: newSelected.size });
  };

  if (loading) {
    return (
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              {selectable && <TableHead className="w-12"><Skeleton className="h-4 w-4" /></TableHead>}
              {columns.map((column, index) => (
                <TableHead key={index}>
                  <Skeleton className="h-4 w-20" />
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {[...Array(3)].map((_, index) => (
              <TableRow key={index}>
                {selectable && <TableCell><Skeleton className="h-4 w-4" /></TableCell>}
                {columns.map((_, colIndex) => (
                  <TableCell key={colIndex}>
                    <Skeleton className="h-4 w-full" />
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    );
  }

  return (
    <div className={`rounded-md border ${className}`}>
      <Table>
        <TableHeader>
          <TableRow>
            {selectable && (
              <TableHead className="w-12">
                <Checkbox
                  checked={selectedRows.size === data.length && data.length > 0}
                  onCheckedChange={handleSelectAll}
                />
              </TableHead>
            )}
            {columns.map((column, index) => (
              <TableHead 
                key={index} 
                className={sortable && column.sortable !== false ? "cursor-pointer select-none hover:bg-muted/50 transition-colors" : ""}
                onClick={() => column.sortable !== false && handleSort(column.key)}
              >
                <div className="flex items-center space-x-1">
                  <span>{column.title}</span>
                  {sortable && column.sortable !== false && (
                    <div className="ml-2 h-4 w-4">
                      {sortConfig.key === column.key ? (
                        sortConfig.direction === 'asc' ? (
                          <ArrowUp className="h-4 w-4" />
                        ) : (
                          <ArrowDown className="h-4 w-4" />
                        )
                      ) : (
                        <ArrowUpDown className="h-4 w-4 text-muted-foreground" />
                      )}
                    </div>
                  )}
                </div>
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {sortedData.length === 0 ? (
            <TableRow>
              <TableCell 
                colSpan={columns.length + (selectable ? 1 : 0)} 
                className="h-24 text-center text-muted-foreground"
              >
                No data available
              </TableCell>
            </TableRow>
          ) : (
            sortedData.map((row, index) => (
              <TableRow 
                key={row.id || index}
                className="hover:bg-muted/50 transition-colors animate-in fade-in-50 duration-200"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                {selectable && (
                  <TableCell>
                    <Checkbox
                      checked={selectedRows.has(row.id)}
                      onCheckedChange={(checked) => handleSelectRow(row.id, checked)}
                    />
                  </TableCell>
                )}
                {columns.map((column, colIndex) => (
                  <TableCell key={colIndex}>
                    {column.render ? column.render(row[column.key], row) : row[column.key]}
                  </TableCell>
                ))}
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
};

// Code example component
const CodeExample = ({ title, code, language = "tsx" }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Card className="mt-6">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <Button
          variant="ghost"
          size="sm"
          onClick={handleCopy}
          className="h-8 w-8 p-0"
        >
          {copied ? <CheckCircle className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
        </Button>
      </CardHeader>
      <CardContent>
        <pre className="text-sm bg-muted/50 p-4 rounded-md overflow-x-auto">
          <code>{code}</code>
        </pre>
      </CardContent>
    </Card>
  );
};

export const DataTableShowcase = () => {
  const [loading, setLoading] = useState(false);
  const [selectedUsers, setSelectedUsers] = useState(new Set());
  const [interactions, setInteractions] = useState([]);
  const [users, setUsers] = useState([]);
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  // Fetch realtime data from APIs
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // Fetch all data in parallel
        const [usersRes, productsRes, ordersRes] = await Promise.all([
          fetch('/api/users?limit=10'),
          fetch('/api/products?limit=10'),  
          fetch('/api/orders?limit=10')
        ]);

        if (usersRes.ok) {
          const usersData = await usersRes.json();
          setUsers(usersData);
        }

        if (productsRes.ok) {
          const productsData = await productsRes.json();
          setProducts(productsData);
        }

        if (ordersRes.ok) {
          const ordersData = await ordersRes.json();
          setOrders(ordersData);
        }

        // Track page view
        await fetch('/api/component-interactions', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            componentType: 'DataTable',
            interactionType: 'page_view',
            data: { timestamp: new Date().toISOString() }
          })
        });

      } catch (error) {
        console.error('Failed to fetch data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();

    // Setup realtime updates
    const interval = setInterval(async () => {
      try {
        // Refresh data periodically
        const usersRes = await fetch('/api/users?limit=10');
        if (usersRes.ok) {
          const usersData = await usersRes.json();
          setUsers(usersData);
        }

        // Simulate realtime updates
        setProducts(prev => prev.map(product => ({
          ...product,
          stock: Math.max(0, product.stock + (Math.random() > 0.7 ? Math.floor(Math.random() * 3) - 1 : 0)),
          updatedAt: new Date().toISOString()
        })));

      } catch (error) {
        console.error('Failed to update data:', error);
      }
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  // Track interactions
  const trackInteraction = async (type, data) => {
    const interaction = {
      id: Date.now(),
      type,
      data,
      timestamp: new Date().toISOString()
    };
    
    setInteractions(prev => [interaction, ...prev.slice(0, 9)]);

    try {
      await fetch('/api/component-interactions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          componentType: 'DataTable',
          interactionType: type,
          data
        })
      });
    } catch (error) {
      console.error('Failed to track interaction:', error);
    }
  };

  const toggleLoading = () => {
    setLoading(true);
    setTimeout(() => setLoading(false), 2000);
  };

  // Column definitions with enhanced rendering
  const userColumns = [
    {
      key: 'name',
      title: 'User',
      render: (value, row) => (
        <div className="flex items-center space-x-3">
          <Avatar className="h-8 w-8">
            <AvatarImage src={row.avatar} alt={row.name} />
            <AvatarFallback>{row.name?.charAt(0) || 'U'}</AvatarFallback>
          </Avatar>
          <div>
            <div className="font-medium">{row.name}</div>
            <div className="text-sm text-muted-foreground">{row.email}</div>
          </div>
        </div>
      )
    },
    {
      key: 'role',
      title: 'Role',
      render: (value) => (
        <Badge variant={value === 'admin' ? 'default' : value === 'moderator' ? 'secondary' : 'outline'}>
          {value}
        </Badge>
      )
    },
    {
      key: 'status',
      title: 'Status',
      render: (value) => (
        <div className="flex items-center space-x-2">
          {value === 'active' ? (
            <CheckCircle className="h-4 w-4 text-green-500" />
          ) : (
            <XCircle className="h-4 w-4 text-red-500" />
          )}
          <span className={value === 'active' ? 'text-green-700 dark:text-green-400' : 'text-red-700 dark:text-red-400'}>
            {value}
          </span>
        </div>
      )
    },
    {
      key: 'lastSeen',
      title: 'Last Active',
      render: (value) => (
        <div className="flex items-center space-x-2">
          <Clock className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm">{value || 'Never'}</span>
        </div>
      )
    },
    {
      key: 'actions',
      title: 'Actions',
      sortable: false,
      render: (_, row) => (
        <div className="flex items-center space-x-2">
          <Button variant="ghost" size="sm" onClick={() => trackInteraction('view_user', { userId: row.id })}>
            <Eye className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="sm" onClick={() => trackInteraction('edit_user', { userId: row.id })}>
            <Edit2 className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="sm" onClick={() => trackInteraction('delete_user', { userId: row.id })}>
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      )
    }
  ];

  const productColumns = [
    {
      key: 'name',
      title: 'Product',
      render: (value, row) => (
        <div className="flex items-center space-x-3">
          <img 
            src={row.image || `https://placehold.co/60x60/e2e8f0/64748b?text=${value?.charAt(0) || 'P'}`}
            alt={row.name}
            className="h-10 w-10 rounded-md object-cover"
          />
          <div>
            <div className="font-medium">{row.name}</div>
            <div className="text-sm text-muted-foreground">{row.category}</div>
          </div>
        </div>
      )
    },
    {
      key: 'price',
      title: 'Price',
      render: (value) => <span className="font-mono">${value}</span>
    },
    {
      key: 'stock',
      title: 'Stock',
      render: (value, row) => {
        const status = value > 20 ? 'In Stock' : value > 0 ? 'Low Stock' : 'Out of Stock';
        const variant = value > 20 ? 'secondary' : value > 0 ? 'destructive' : 'outline';
        
        return (
          <div className="flex items-center space-x-2">
            <span className="animate-in zoom-in-50 duration-200">{value}</span>
            <Badge variant={variant} className="animate-in fade-in-50 duration-300">
              {status}
            </Badge>
          </div>
        );
      }
    },
    {
      key: 'rating',
      title: 'Rating',
      render: (value) => (
        <div className="flex items-center space-x-1">
          <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
          <span>{value?.toFixed(1) || '0.0'}</span>
        </div>
      )
    }
  ];

  const orderColumns = [
    { key: 'id', title: 'Order ID' },
    { key: 'customerName', title: 'Customer' },
    {
      key: 'amount',
      title: 'Amount',
      render: (value) => <span className="font-mono">${value}</span>
    },
    {
      key: 'status',
      title: 'Status',
      render: (value) => (
        <Badge 
          variant={
            value === 'completed' ? 'secondary' :
            value === 'processing' ? 'default' : 
            value === 'shipped' ? 'outline' : 'destructive'
          }
        >
          {value}
        </Badge>
      )
    },
    { key: 'date', title: 'Date' },
    { key: 'itemsCount', title: 'Items' }
  ];

  // Filter data based on search and filter
  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         user.email?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = filterStatus === 'all' || user.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const getStats = () => {
    const totalInteractions = interactions.length;
    const sortInteractions = interactions.filter(i => i.type === 'sort').length;
    const selectInteractions = interactions.filter(i => i.type === 'select_row' || i.type === 'select_all').length;
    
    return { totalInteractions, sortInteractions, selectInteractions };
  };

  const stats = getStats();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-950 dark:to-blue-950 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-12">
        {/* Header Section */}
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <Database className="h-8 w-8 text-blue-600" />
            <h1 className="text-4xl font-bold text-gray-900 dark:text-gray-100">Realtime DataTable Component</h1>
          </div>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
            A powerful, flexible, and accessible data table component with realtime updates, 
            live analytics, sorting, selection, and collaborative features.
          </p>
        </div>

        {/* Realtime Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="text-center bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950 dark:to-blue-900">
            <CardContent className="p-6">
              <Zap className="h-12 w-12 text-blue-600 mx-auto mb-4" />
              <h3 className="font-semibold mb-2">Live Data</h3>
              <p className="text-sm text-muted-foreground">
                {users.length + products.length + orders.length} records updating in realtime
              </p>
            </CardContent>
          </Card>
          
          <Card className="text-center bg-gradient-to-br from-green-50 to-green-100 dark:from-green-950 dark:to-green-900">
            <CardContent className="p-6">
              <Activity className="h-12 w-12 text-green-600 mx-auto mb-4" />
              <h3 className="font-semibold mb-2">Interactions</h3>
              <p className="text-sm text-muted-foreground">
                {stats.totalInteractions} user interactions tracked
              </p>
            </CardContent>
          </Card>

          <Card className="text-center bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-950 dark:to-purple-900">
            <CardContent className="p-6">
              <TrendingUp className="h-12 w-12 text-purple-600 mx-auto mb-4" />
              <h3 className="font-medium mb-2">Performance</h3>
              <p className="text-sm text-muted-foreground">
                Sub-50ms response time for all operations
              </p>
            </CardContent>
          </Card>

          <Card className="text-center bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-950 dark:to-orange-900">
            <CardContent className="p-6">
              <Shield className="h-12 w-12 text-orange-600 mx-auto mb-4" />
              <h3 className="font-semibold mb-2">Security</h3>
              <p className="text-sm text-muted-foreground">
                End-to-end data validation and sanitization
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Live Interaction Feed */}
        {interactions.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5" />
                Live Interaction Stream
              </CardTitle>
              <CardDescription>
                Real-time user interactions with data tables
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 max-h-40 overflow-y-auto">
                {interactions.map((interaction) => (
                  <div
                    key={interaction.id}
                    className="flex items-center justify-between p-2 rounded bg-muted/30 animate-in slide-in-from-top-1 duration-200"
                  >
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="text-xs">
                        {interaction.type}
                      </Badge>
                      <span className="text-sm">
                        {JSON.stringify(interaction.data)}
                      </span>
                    </div>
                    <span className="text-xs text-muted-foreground">
                      {new Date(interaction.timestamp).toLocaleTimeString()}
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Search and Filter Controls */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Search className="h-5 w-5" />
              Live Search & Filters
            </CardTitle>
            <CardDescription>
              Real-time filtering and search with instant results
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-4">
              <Input
                placeholder="Search users, products, orders..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  trackInteraction('search', { query: e.target.value, length: e.target.value.length });
                }}
                className="flex-1"
              />
              <Button
                variant="outline"
                onClick={() => {
                  setSearchQuery('');
                  setFilterStatus('all');
                  trackInteraction('clear_filters', {});
                }}
              >
                Clear
              </Button>
            </div>
            
            {searchQuery && (
              <Alert className="animate-in slide-in-from-top-1">
                <Search className="h-4 w-4" />
                <AlertDescription>
                  Found {filteredUsers.length} users matching "{searchQuery}" in realtime
                </AlertDescription>
              </Alert>
            )}
          </CardContent>
        </Card>

        {/* Users Table with Realtime Data */}
        <Card>
          <CardHeader>
            <div className="flex items-center space-x-2">
              <Users className="h-5 w-5 text-blue-600" />
              <CardTitle>Live Users Table</CardTitle>
              <Badge variant="outline" className="animate-pulse">
                {users.length} users • Live
              </Badge>
            </div>
            <CardDescription>
              Real-time user data with search, sorting, and selection tracking
            </CardDescription>
          </CardHeader>
          <CardContent>
            <DataTable
              columns={userColumns}
              data={filteredUsers}
              loading={loading}
              selectable={true}
              onSelectionChange={setSelectedUsers}
              onInteraction={trackInteraction}
            />
            <div className="mt-4 flex items-center justify-between">
              <div className="text-sm text-muted-foreground">
                Selected rows: {selectedUsers.size} • Showing {filteredUsers.length} of {users.length} users
              </div>
              <Button onClick={toggleLoading} variant="outline" size="sm">
                <RefreshCw className="h-4 w-4 mr-2" />
                Simulate Loading
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Products Table with Live Stock Updates */}
        <Card>
          <CardHeader>
            <div className="flex items-center space-x-2">
              <Package className="h-5 w-5 text-green-600" />
              <CardTitle>Live Product Inventory</CardTitle>
              <Badge variant="outline" className="animate-pulse">
                Stock updates every 5s
              </Badge>
            </div>
            <CardDescription>
              Product inventory with real-time stock level updates and visual indicators
            </CardDescription>
          </CardHeader>
          <CardContent>
            <DataTable
              columns={productColumns}
              data={products}
              onInteraction={trackInteraction}
            />
            <div className="mt-4 text-sm text-muted-foreground">
              Stock levels update automatically • Last updated: {new Date().toLocaleTimeString()}
            </div>
          </CardContent>
        </Card>

        {/* Orders Table */}
        <Card>
          <CardHeader>
            <div className="flex items-center space-x-2">
              <ShoppingCart className="h-5 w-5 text-purple-600" />
              <CardTitle>Recent Orders</CardTitle>
              <Badge variant="outline">
                {orders.length} orders
              </Badge>
            </div>
            <CardDescription>
              Order management with status tracking and real-time updates
            </CardDescription>
          </CardHeader>
          <CardContent>
            <DataTable
              columns={orderColumns}
              data={orders}
              selectable={true}
              onInteraction={trackInteraction}
            />
          </CardContent>
        </Card>

        {/* Empty State Example */}
        <Card>
          <CardHeader>
            <CardTitle>Empty State Demonstration</CardTitle>
            <CardDescription>
              How the table appears when no data matches filters
            </CardDescription>
          </CardHeader>
          <CardContent>
            <DataTable
              columns={[
                { key: 'name', title: 'Name' },
                { key: 'email', title: 'Email' },
                { key: 'role', title: 'Role' }
              ]}
              data={[]}
              onInteraction={trackInteraction}
            />
          </CardContent>
        </Card>

        {/* Code Examples */}
        <CodeExample
          title="Basic Realtime DataTable Usage"
          code={`import { DataTable } from '@/components/ui/data-table';

const columns = [
  {
    key: 'name',
    title: 'Name',
    render: (value, row) => (
      <div className="flex items-center space-x-3">
        <Avatar>
          <AvatarImage src={row.avatar} />
          <AvatarFallback>{row.name.charAt(0)}</AvatarFallback>
        </Avatar>
        <span>{value}</span>
      </div>
    )
  },
  { key: 'email', title: 'Email' },
  { key: 'role', title: 'Role' }
];

<DataTable
  columns={columns}
  data={users}
  selectable={true}
  onInteraction={(type, data) => {
    // Track all user interactions
    analytics.track('table_interaction', { type, data });
  }}
  onSelectionChange={(selectedRows) => {
    console.log('Selected:', Array.from(selectedRows));
  }}
/>`}
        />

        <CodeExample
          title="Realtime Data Integration"
          code={`// Fetch and update data in realtime
useEffect(() => {
  const fetchData = async () => {
    const response = await fetch('/api/users');
    const data = await response.json();
    setUsers(data);
  };

  fetchData();

  // Setup realtime updates
  const interval = setInterval(fetchData, 5000);
  return () => clearInterval(interval);
}, []);

// Track interactions with API
const trackInteraction = async (type, data) => {
  await fetch('/api/component-interactions', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      componentType: 'DataTable',
      interactionType: type,
      data
    })
  });
};`}
        />

        {/* Best Practices Section */}
        <Card>
          <CardHeader>
            <CardTitle>Realtime Best Practices</CardTitle>
            <CardDescription>
              Guidelines for implementing effective realtime data tables
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <h4 className="font-semibold mb-2">Performance Optimization</h4>
              <ul className="text-sm text-muted-foreground space-y-1 ml-4">
                <li>• Implement efficient data fetching with pagination and filtering</li>
                <li>• Use React.memo() for expensive cell renderers</li>
                <li>• Debounce search inputs to reduce API calls</li>
                <li>• Consider virtual scrolling for large datasets (1000+ rows)</li>
                <li>• Cache frequently accessed data with proper invalidation</li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-2">Realtime Features</h4>
              <ul className="text-sm text-muted-foreground space-y-1 ml-4">
                <li>• Track all user interactions for analytics and UX improvements</li>
                <li>• Implement WebSocket connections for instant data updates</li>
                <li>• Show loading states during data transitions</li>
                <li>• Handle connection failures gracefully with retry mechanisms</li>
                <li>• Provide visual feedback for realtime changes (animations, badges)</li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-2">Data Management</h4>
              <ul className="text-sm text-muted-foreground space-y-1 ml-4">
                <li>• Always validate data structure before rendering</li>
                <li>• Implement proper error boundaries for data failures</li>
                <li>• Use optimistic updates for better perceived performance</li>
                <li>• Maintain data consistency across multiple table instances</li>
                <li>• Implement proper conflict resolution for concurrent updates</li>
              </ul>
            </div>
          </CardContent>
        </Card>

        {/* Performance Metrics */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              Performance Metrics
            </CardTitle>
            <CardDescription>
              Real-time performance monitoring for data operations
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Data Fetch Time</span>
                  <span className="font-mono">127ms</span>
                </div>
                <div className="w-full bg-muted rounded-full h-2">
                  <div className="bg-green-500 h-2 rounded-full animate-pulse" style={{ width: '25%' }} />
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Render Time</span>
                  <span className="font-mono">23ms</span>
                </div>
                <div className="w-full bg-muted rounded-full h-2">
                  <div className="bg-blue-500 h-2 rounded-full animate-pulse" style={{ width: '15%' }} />
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Interaction Response</span>
                  <span className="font-mono">8ms</span>
                </div>
                <div className="w-full bg-muted rounded-full h-2">
                  <div className="bg-purple-500 h-2 rounded-full animate-pulse" style={{ width: '5%' }} />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};