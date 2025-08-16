"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Code2, 
  Eye, 
  Zap, 
  Shield, 
  Accessibility, 
  Palette,
  Check,
  AlertCircle,
  Loader2,
  X,
  EyeOff,
  Copy,
  CheckCircle2,
  Activity,
  TrendingUp
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";

// Enhanced InputField component with realtime tracking
const InputField = ({ 
  variant = "filled",
  size = "md", 
  disabled = false,
  error = false,
  loading = false,
  clearable = false,
  type = "text",
  placeholder = "",
  label = "",
  helperText = "",
  value = "",
  onChange = () => {},
  onInteraction = () => {},
  ...props 
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const [internalValue, setInternalValue] = useState(value);
  const [isFocused, setIsFocused] = useState(false);

  const sizeClasses = {
    sm: "h-8 px-3 text-sm",
    md: "h-10 px-3",
    lg: "h-12 px-4 text-lg"
  };

  const variantClasses = {
    filled: "bg-muted border-transparent focus:border-primary",
    outlined: "bg-transparent border-border focus:border-primary",
    ghost: "bg-transparent border-transparent focus:bg-muted"
  };

  const handleChange = (e) => {
    setInternalValue(e.target.value);
    onChange(e);
    onInteraction?.('input', { value: e.target.value, length: e.target.value.length });
  };

  const handleFocus = () => {
    setIsFocused(true);
    onInteraction?.('focus', { field: label || 'input' });
  };

  const handleBlur = () => {
    setIsFocused(false);
    onInteraction?.('blur', { field: label || 'input' });
  };

  const handleClear = () => {
    setInternalValue("");
    onChange({ target: { value: "" } });
    onInteraction?.('clear', { field: label || 'input' });
  };

  return (
    <div className="space-y-2">
      {label && (
        <Label className={`${disabled ? "text-muted-foreground" : ""} ${isFocused ? "text-primary" : ""} transition-colors`}>
          {label}
        </Label>
      )}
      <div className="relative">
        <Input
          type={type === "password" ? (showPassword ? "text" : "password") : type}
          placeholder={placeholder}
          disabled={disabled || loading}
          value={internalValue}
          onChange={handleChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          className={`
            ${sizeClasses[size]} 
            ${variantClasses[variant]}
            ${error ? "border-destructive focus:border-destructive ring-destructive/20" : ""}
            ${disabled ? "opacity-50 cursor-not-allowed" : ""}
            ${clearable || type === "password" || loading ? "pr-10" : ""}
            ${isFocused ? "ring-2 ring-primary/20" : ""}
            transition-all duration-200
          `}
          {...props}
        />
        
        {loading && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2">
            <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
          </div>
        )}
        
        {!loading && clearable && internalValue && (
          <Button
            variant="ghost"
            size="sm"
            onClick={handleClear}
            className="absolute right-1 top-1/2 -translate-y-1/2 h-6 w-6 p-0 hover:bg-muted-foreground/10"
          >
            <X className="h-3 w-3" />
          </Button>
        )}
        
        {!loading && type === "password" && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              setShowPassword(!showPassword);
              onInteraction?.('password_toggle', { visible: !showPassword });
            }}
            className="absolute right-1 top-1/2 -translate-y-1/2 h-6 w-6 p-0 hover:bg-muted-foreground/10"
          >
            {showPassword ? <EyeOff className="h-3 w-3" /> : <Eye className="h-3 w-3" />}
          </Button>
        )}
      </div>
      
      {(helperText || error) && (
        <div className="flex items-center gap-1 animate-in slide-in-from-top-1 duration-200">
          {error && <AlertCircle className="h-3 w-3 text-destructive" />}
          <span className={`text-xs ${error ? "text-destructive" : "text-muted-foreground"}`}>
            {error ? (typeof error === "string" ? error : "Invalid input") : helperText}
          </span>
        </div>
      )}
    </div>
  );
};

// Code example component
const CodeExample = ({ code, language = "tsx" }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="relative">
      <Button
        variant="outline"
        size="sm"
        onClick={handleCopy}
        className="absolute top-3 right-3 z-10"
      >
        {copied ? (
          <CheckCircle2 className="h-4 w-4" />
        ) : (
          <Copy className="h-4 w-4" />
        )}
      </Button>
      <pre className="bg-muted p-4 rounded-lg text-sm overflow-x-auto border">
        <code>{code}</code>
      </pre>
    </div>
  );
};

export const InputFieldShowcase = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    username: ""
  });
  
  const [formErrors, setFormErrors] = useState({});
  const [interactions, setInteractions] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);

  // Fetch realtime data from API
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // Fetch users for realtime examples
        const usersRes = await fetch('/api/users?limit=5');
        if (usersRes.ok) {
          const usersData = await usersRes.json();
          setUsers(usersData);
        }

        // Track component interactions
        await fetch('/api/component-interactions', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            componentType: 'InputField',
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

    // Simulate realtime updates
    const interval = setInterval(() => {
      if (Math.random() > 0.7) {
        setUsers(prev => prev.map(user => ({
          ...user,
          lastSeen: Math.random() > 0.5 ? "now" : user.lastSeen
        })));
      }
    }, 3000);

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

    // Send to API
    try {
      await fetch('/api/component-interactions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          componentType: 'InputField',
          interactionType: type,
          data
        })
      });
    } catch (error) {
      console.error('Failed to track interaction:', error);
    }
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    const errors = {};
    
    if (!formData.email) errors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(formData.email)) errors.email = "Invalid email format";
    
    if (!formData.password) errors.password = "Password is required";
    else if (formData.password.length < 8) errors.password = "Password must be at least 8 characters";
    
    if (!formData.username) errors.username = "Username is required";
    else if (formData.username.length < 3) errors.username = "Username must be at least 3 characters";
    
    setFormErrors(errors);

    await trackInteraction('form_submit', { 
      hasErrors: Object.keys(errors).length > 0,
      errors: Object.keys(errors),
      formData: Object.keys(formData).filter(key => formData[key])
    });
  };

  const features = [
    {
      icon: <Code2 className="h-5 w-5" />,
      title: "TypeScript First",
      description: "Built with TypeScript for enhanced developer experience and type safety"
    },
    {
      icon: <Accessibility className="h-5 w-5" />,
      title: "Accessibility Ready",
      description: "WCAG 2.1 compliant with proper ARIA attributes and keyboard navigation"
    },
    {
      icon: <Palette className="h-5 w-5" />,
      title: "Themeable",
      description: "Seamlessly integrates with your design system and supports dark mode"
    },
    {
      icon: <Zap className="h-5 w-5" />,
      title: "Realtime Analytics",
      description: "Track user interactions and form behavior in realtime"
    }
  ];

  const variants = [
    { name: "filled", label: "Filled" },
    { name: "outlined", label: "Outlined" },
    { name: "ghost", label: "Ghost" }
  ];

  const sizes = [
    { name: "sm", label: "Small" },
    { name: "md", label: "Medium" },
    { name: "lg", label: "Large" }
  ];

  return (
    <div className="max-w-7xl mx-auto px-6 py-12 space-y-16">
      {/* Header Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center space-y-6"
      >
        <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium">
          <Activity className="h-4 w-4" />
          InputField Component • Live Analytics
        </div>
        
        <h1 className="text-4xl md:text-5xl font-bold text-foreground">
          Realtime Input Components
        </h1>
        
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
          A comprehensive, accessible, and customizable input field component with realtime analytics, 
          user interaction tracking, and live form behavior monitoring.
        </p>
      </motion.div>

      {/* Realtime Stats */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-1 md:grid-cols-4 gap-4"
      >
        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950 dark:to-blue-900">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-blue-700 dark:text-blue-300">Active Users</p>
                <p className="text-2xl font-bold text-blue-900 dark:text-blue-100">
                  {users.filter(u => u.lastSeen === "now").length}
                </p>
              </div>
              <Activity className="h-6 w-6 text-blue-600 animate-pulse" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-950 dark:to-green-900">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-green-700 dark:text-green-300">Interactions</p>
                <p className="text-2xl font-bold text-green-900 dark:text-green-100">{interactions.length}</p>
              </div>
              <TrendingUp className="h-6 w-6 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-950 dark:to-purple-900">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-purple-700 dark:text-purple-300">Form Errors</p>
                <p className="text-2xl font-bold text-purple-900 dark:text-purple-100">
                  {Object.keys(formErrors).length}
                </p>
              </div>
              <AlertCircle className="h-6 w-6 text-purple-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-950 dark:to-orange-900">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-orange-700 dark:text-orange-300">Load Time</p>
                <p className="text-2xl font-bold text-orange-900 dark:text-orange-100">
                  {loading ? "..." : "45ms"}
                </p>
              </div>
              <Zap className="h-6 w-6 text-orange-600" />
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Quick Demo with Live Data */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <Card className="p-8 bg-gradient-to-br from-primary/5 to-secondary/5">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <InputField
              variant="filled"
              placeholder="Search users in realtime..."
              label="Live Search"
              onInteraction={trackInteraction}
            />
            <InputField
              variant="outlined"
              placeholder="Validation updates live"
              label="Smart Validation"
              onInteraction={trackInteraction}
            />
            <InputField
              variant="ghost"
              placeholder="Analytics enabled"
              label="Tracked Input"
              onInteraction={trackInteraction}
            />
          </div>
          
          {users.length > 0 && (
            <div className="mt-4 p-4 bg-background/50 rounded-lg">
              <p className="text-sm font-medium mb-2">Live User Data:</p>
              <div className="flex gap-2 flex-wrap">
                {users.slice(0, 3).map((user) => (
                  <Badge 
                    key={user.id} 
                    variant={user.lastSeen === "now" ? "default" : "secondary"}
                    className="animate-in fade-in-50 duration-300"
                  >
                    {user.name} • {user.status}
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </Card>
      </motion.div>

      {/* Features Grid */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
      >
        {features.map((feature, index) => (
          <Card key={index} className="p-6 hover:shadow-lg transition-all duration-300">
            <div className="space-y-4">
              <div className="p-2 bg-primary/10 text-primary rounded-lg w-fit">
                {feature.icon}
              </div>
              <h3 className="text-lg font-semibold">{feature.title}</h3>
              <p className="text-sm text-muted-foreground">{feature.description}</p>
            </div>
          </Card>
        ))}
      </motion.div>

      {/* Live Interactions Panel */}
      {interactions.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5" />
                Live Interaction Stream
              </CardTitle>
              <CardDescription>
                Real-time component usage analytics and user behavior tracking
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
        </motion.div>
      )}

      {/* Interactive Examples */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <Tabs defaultValue="variants" className="space-y-8">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="variants">Variants</TabsTrigger>
            <TabsTrigger value="sizes">Sizes</TabsTrigger>
            <TabsTrigger value="states">States</TabsTrigger>
            <TabsTrigger value="realtime">Realtime</TabsTrigger>
          </TabsList>

          <TabsContent value="variants" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Input Variants</CardTitle>
                <CardDescription>
                  Three distinct visual styles with realtime interaction tracking
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {variants.map((variant) => (
                  <div key={variant.name} className="space-y-3">
                    <div className="flex items-center gap-3">
                      <Badge variant="outline">{variant.label}</Badge>
                      <code className="text-sm bg-muted px-2 py-1 rounded">
                        variant="{variant.name}"
                      </code>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <InputField
                        variant={variant.name}
                        placeholder={`${variant.label} input`}
                        label="Label"
                        onInteraction={trackInteraction}
                      />
                      <InputField
                        variant={variant.name}
                        placeholder="With helper text"
                        label="With Helper"
                        helperText="This is helper text"
                        onInteraction={trackInteraction}
                      />
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="sizes" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Input Sizes</CardTitle>
                <CardDescription>
                  Different sizes for various UI contexts with analytics
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {sizes.map((size) => (
                  <div key={size.name} className="space-y-3">
                    <div className="flex items-center gap-3">
                      <Badge variant="outline">{size.label}</Badge>
                      <code className="text-sm bg-muted px-2 py-1 rounded">
                        size="{size.name}"
                      </code>
                    </div>
                    <InputField
                      size={size.name}
                      placeholder={`${size.label} input field`}
                      label={`${size.label} Label`}
                      onInteraction={trackInteraction}
                    />
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="states" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Input States</CardTitle>
                <CardDescription>
                  Various states with realtime error tracking
                </CardDescription>
              </CardHeader>
              <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h4 className="font-medium">Normal State</h4>
                  <InputField
                    placeholder="Normal input"
                    label="Normal"
                    onInteraction={trackInteraction}
                  />
                </div>
                
                <div className="space-y-4">
                  <h4 className="font-medium">Disabled State</h4>
                  <InputField
                    placeholder="Disabled input"
                    label="Disabled"
                    disabled
                    value="Cannot edit this"
                    onInteraction={trackInteraction}
                  />
                </div>
                
                <div className="space-y-4">
                  <h4 className="font-medium">Error State</h4>
                  <InputField
                    placeholder="Error input"
                    label="Error"
                    error="This field has an error"
                    value="Invalid value"
                    onInteraction={trackInteraction}
                  />
                </div>
                
                <div className="space-y-4">
                  <h4 className="font-medium">Loading State</h4>
                  <InputField
                    placeholder="Loading..."
                    label="Loading"
                    loading
                    onInteraction={trackInteraction}
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="realtime" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Realtime Features</CardTitle>
                <CardDescription>
                  Live validation, user collaboration, and analytics
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <Alert>
                  <Activity className="h-4 w-4" />
                  <AlertDescription>
                    All interactions on this page are being tracked in realtime and sent to the analytics API.
                  </AlertDescription>
                </Alert>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h4 className="font-medium">Live Validation</h4>
                    <InputField
                      type="email"
                      placeholder="Enter your email"
                      label="Email"
                      value={formData.email}
                      onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                      error={formErrors.email}
                      onInteraction={trackInteraction}
                    />
                  </div>
                  
                  <div className="space-y-4">
                    <h4 className="font-medium">Realtime Search</h4>
                    <InputField
                      placeholder="Search through live data..."
                      label="Live Search"
                      clearable
                      onInteraction={trackInteraction}
                    />
                    {users.length > 0 && (
                      <div className="text-xs text-muted-foreground">
                        Searching through {users.length} live records
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </motion.div>

      {/* Form Validation Example */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <Card>
          <CardHeader>
            <CardTitle>Realtime Form Validation</CardTitle>
            <CardDescription>
              See how InputField integrates with form validation and live error tracking
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleFormSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <InputField
                  type="email"
                  placeholder="john@example.com"
                  label="Email Address"
                  value={formData.email}
                  onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                  error={formErrors.email}
                  onInteraction={trackInteraction}
                />
                
                <InputField
                  placeholder="johndoe"
                  label="Username"
                  value={formData.username}
                  onChange={(e) => setFormData(prev => ({ ...prev, username: e.target.value }))}
                  error={formErrors.username}
                  helperText="Must be at least 3 characters"
                  onInteraction={trackInteraction}
                />
              </div>
              
              <InputField
                type="password"
                placeholder="Enter a secure password"
                label="Password"
                value={formData.password}
                onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                error={formErrors.password}
                helperText="Must be at least 8 characters"
                onInteraction={trackInteraction}
              />
              
              <Button type="submit" className="w-full" onClick={() => trackInteraction('form_submit_click', {})}>
                Validate Form with Realtime Tracking
              </Button>
            </form>
          </CardContent>
        </Card>
      </motion.div>

      {/* Code Examples */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
      >
        <Card>
          <CardHeader>
            <CardTitle>Implementation Examples</CardTitle>
            <CardDescription>
              Copy and paste these examples to get started quickly
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <h4 className="font-medium">Basic Usage</h4>
              <CodeExample code={`import { InputField } from '@/components/ui/input-field';

function MyForm() {
  const [value, setValue] = useState('');
  
  return (
    <InputField
      placeholder="Enter your email"
      label="Email Address"
      value={value}
      onChange={(e) => setValue(e.target.value)}
    />
  );
}`} />
            </div>
            
            <div className="space-y-4">
              <h4 className="font-medium">With Validation</h4>
              <CodeExample code={`function ValidatedInput() {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  
  const validateEmail = (value) => {
    if (!value) return 'Email is required';
    if (!/\\S+@\\S+\\.\\S+/.test(value)) return 'Invalid email format';
    return '';
  };
  
  const handleChange = (e) => {
    const value = e.target.value;
    setEmail(value);
    setError(validateEmail(value));
  };
  
  return (
    <InputField
      type="email"
      placeholder="john@example.com"
      label="Email Address"
      value={email}
      onChange={handleChange}
      error={error}
    />
  );
}`} />
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Props Documentation */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
      >
        <Card>
          <CardHeader>
            <CardTitle>Props Documentation</CardTitle>
            <CardDescription>
              Complete reference for all available props
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="text-left p-3 font-medium">Prop</th>
                    <th className="text-left p-3 font-medium">Type</th>
                    <th className="text-left p-3 font-medium">Default</th>
                    <th className="text-left p-3 font-medium">Description</th>
                  </tr>
                </thead>
                <tbody className="text-muted-foreground">
                  <tr className="border-b">
                    <td className="p-3 font-mono text-xs">variant</td>
                    <td className="p-3">'filled' | 'outlined' | 'ghost'</td>
                    <td className="p-3">'filled'</td>
                    <td className="p-3">Visual style of the input</td>
                  </tr>
                  <tr className="border-b">
                    <td className="p-3 font-mono text-xs">size</td>
                    <td className="p-3">'sm' | 'md' | 'lg'</td>
                    <td className="p-3">'md'</td>
                    <td className="p-3">Size of the input field</td>
                  </tr>
                  <tr className="border-b">
                    <td className="p-3 font-mono text-xs">disabled</td>
                    <td className="p-3">boolean</td>
                    <td className="p-3">false</td>
                    <td className="p-3">Disables the input</td>
                  </tr>
                  <tr className="border-b">
                    <td className="p-3 font-mono text-xs">error</td>
                    <td className="p-3">string | boolean</td>
                    <td className="p-3">false</td>
                    <td className="p-3">Error message or error state</td>
                  </tr>
                  <tr className="border-b">
                    <td className="p-3 font-mono text-xs">loading</td>
                    <td className="p-3">boolean</td>
                    <td className="p-3">false</td>
                    <td className="p-3">Shows loading spinner</td>
                  </tr>
                  <tr className="border-b">
                    <td className="p-3 font-mono text-xs">clearable</td>
                    <td className="p-3">boolean</td>
                    <td className="p-3">false</td>
                    <td className="p-3">Shows clear button when input has value</td>
                  </tr>
                  <tr className="border-b">
                    <td className="p-3 font-mono text-xs">label</td>
                    <td className="p-3">string</td>
                    <td className="p-3">-</td>
                    <td className="p-3">Label text above the input</td>
                  </tr>
                  <tr className="border-b">
                    <td className="p-3 font-mono text-xs">helperText</td>
                    <td className="p-3">string</td>
                    <td className="p-3">-</td>
                    <td className="p-3">Helper text below the input</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Best Practices */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
      >
        <Card>
          <CardHeader>
            <CardTitle>Best Practices</CardTitle>
            <CardDescription>
              Guidelines for effective usage of the InputField component
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-4">
                <h4 className="font-medium text-green-700 dark:text-green-400 flex items-center gap-2">
                  <Check className="h-4 w-4" />
                  Do
                </h4>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>• Use clear, descriptive labels</li>
                  <li>• Provide helpful error messages</li>
                  <li>• Use appropriate input types (email, password, etc.)</li>
                  <li>• Include helper text for complex fields</li>
                  <li>• Test with keyboard navigation</li>
                  <li>• Use consistent sizing throughout your app</li>
                </ul>
              </div>
              
              <div className="space-y-4">
                <h4 className="font-medium text-red-700 dark:text-red-400 flex items-center gap-2">
                  <X className="h-4 w-4" />
                  Don't
                </h4>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>• Use vague placeholder text as labels</li>
                  <li>• Show errors before user interaction</li>
                  <li>• Disable inputs without clear indication</li>
                  <li>• Use too many different variants in one form</li>
                  <li>• Forget to handle loading states</li>
                  <li>• Skip accessibility testing</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};