'use client';

import { NavbarComponent } from "@/components/navbars/NavbarComponent";
import { HeroSection } from "@/components/heros/HeroSection";
import { InputFieldShowcase } from "@/components/InputFieldShowcase";
import { DataTableShowcase } from "@/components/DataTableShowcase";
import { RealtimeDashboard } from "@/components/realtime/RealtimeDashboard";
import { RealtimeComponentShowcase } from "@/components/realtime/LiveComponentShowcase";
import { FooterComponent } from "@/components/footers/FooterComponent";
import { DatabaseNotification } from "@/components/DatabaseNotification";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Activity, Database, Zap, BarChart3, Server, Code, Shield, Layers, ArrowRight, Sparkles } from "lucide-react";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { toast } from "sonner";

export default function Home() {
  const [activeTab, setActiveTab] = useState("components");
  const [showWelcome, setShowWelcome] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowWelcome(false);
    }, 3000);
    return () => clearTimeout(timer);
  }, []);

  const handleDatabaseFeatureClick = (featureType: 'apis' | 'studio' | 'security') => {
    const messages = {
      apis: "🚀 Exploring Real-time APIs! Live data synchronization with WebSocket support.",
      studio: "🎨 Opening Visual Database Studio! Manage your data with intuitive interface.",
      security: "🛡️ Security Features! Enterprise-grade protection and validation."
    };
    
    toast.success(messages[featureType]);
    
    // Scroll to relevant section based on feature
    const targetElement = featureType === 'apis' ? 'dashboard' : 
                         featureType === 'studio' ? 'components' : 'inputfield';
    setActiveTab(targetElement);
    
    setTimeout(() => {
      document.getElementById('showcase-section')?.scrollIntoView({ 
        behavior: 'smooth', 
        block: 'start' 
      });
    }, 500);
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 20, scale: 0.95 },
    visible: { 
      opacity: 1, 
      y: 0, 
      scale: 1,
      transition: { 
        duration: 0.5,
        ease: [0.22, 1, 0.36, 1]
      }
    }
  };

  const welcomeVariants = {
    hidden: { opacity: 0, scale: 0.8, y: 50 },
    visible: { 
      opacity: 1, 
      scale: 1, 
      y: 0,
      transition: { 
        duration: 1,
        ease: [0.22, 1, 0.36, 1]
      }
    },
    exit: { 
      opacity: 0, 
      scale: 0.95, 
      y: -20,
      transition: { 
        duration: 0.5,
        ease: [0.22, 1, 0.36, 1]
      }
    }
  };

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Welcome Animation Overlay */}
      {showWelcome && (
        <motion.div
          variants={welcomeVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          className="fixed inset-0 z-50 flex items-center justify-center bg-background/95 backdrop-blur-sm"
        >
          <div className="text-center space-y-6">
            <motion.div
              animate={{ 
                rotate: [0, 360],
                scale: [1, 1.1, 1]
              }}
              transition={{ 
                rotate: { duration: 2, repeat: Infinity, ease: "linear" },
                scale: { duration: 2, repeat: Infinity, ease: "easeInOut" }
              }}
              className="mx-auto w-20 h-20 bg-gradient-to-r from-primary to-blue-600 rounded-full flex items-center justify-center"
            >
              <Sparkles className="h-10 w-10 text-white" />
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.8 }}
            >
              <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
                Welcome to Component Studio
              </h1>
              <p className="text-lg text-muted-foreground mt-4">
                Experience next-generation UI components with realtime capabilities
              </p>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 1, duration: 0.6, ease: "backOut" }}
              className="flex justify-center space-x-2"
            >
              {[0, 1, 2].map((i) => (
                <motion.div
                  key={i}
                  animate={{ 
                    scale: [1, 1.5, 1],
                    opacity: [0.5, 1, 0.5]
                  }}
                  transition={{
                    duration: 1,
                    repeat: Infinity,
                    delay: i * 0.2
                  }}
                  className="w-2 h-2 bg-primary rounded-full"
                />
              ))}
            </motion.div>
          </div>
        </motion.div>
      )}

      <NavbarComponent />
      <main>
        <HeroSection />
        
        {/* Database Features Section */}
        <motion.section 
          id="database-features" 
          className="py-16 bg-gradient-to-br from-primary/5 to-secondary/5 relative overflow-hidden"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={containerVariants}
        >
          {/* Animated background elements */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <motion.div
              animate={{
                rotate: [0, 360],
                scale: [1, 1.2, 1]
              }}
              transition={{
                duration: 20,
                repeat: Infinity,
                ease: "linear"
              }}
              className="absolute -top-10 -right-10 w-40 h-40 bg-primary/10 rounded-full blur-3xl"
            />
            <motion.div
              animate={{
                rotate: [360, 0],
                scale: [1.2, 1, 1.2]
              }}
              transition={{
                duration: 25,
                repeat: Infinity,
                ease: "linear"
              }}
              className="absolute -bottom-10 -left-10 w-60 h-60 bg-blue-500/10 rounded-full blur-3xl"
            />
          </div>

          <div className="container mx-auto px-6 relative z-10">
            <motion.div className="text-center mb-12" variants={cardVariants}>
              <motion.div 
                className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium mb-4"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Database className="h-4 w-4" />
                Database Studio Integration
              </motion.div>
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Powerful Database Management
              </h2>
              <p className="text-lg text-muted-foreground max-w-3xl mx-auto mb-8">
                Complete database integration with real-time updates, comprehensive API routes, 
                and a visual management studio for seamless data operations.
              </p>
            </motion.div>
              
            <motion.div 
              className="grid md:grid-cols-3 gap-6 mt-8"
              variants={containerVariants}
            >
              <motion.div variants={cardVariants}>
                <Card 
                  className="text-center cursor-pointer group transition-all duration-300 hover:shadow-xl hover:shadow-blue-500/25 hover:-translate-y-2 border-0 bg-white/50 backdrop-blur-sm"
                  onClick={() => handleDatabaseFeatureClick('apis')}
                >
                  <CardHeader className="relative overflow-hidden">
                    <motion.div
                      whileHover={{ 
                        rotate: [0, -10, 10, 0],
                        scale: [1, 1.1, 1]
                      }}
                      transition={{ duration: 0.5 }}
                    >
                      <Server className="h-12 w-12 text-blue-600 mx-auto mb-4 group-hover:text-blue-700 transition-colors" />
                    </motion.div>
                    <CardTitle className="text-lg group-hover:text-blue-600 transition-colors">
                      Real-time APIs
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="group-hover:text-gray-700 transition-colors">
                      Complete CRUD operations with WebSocket support for live data synchronization across all components.
                    </CardDescription>
                    <motion.div
                      className="mt-4 flex items-center justify-center text-blue-600 opacity-0 group-hover:opacity-100 transition-all duration-300"
                      initial={{ x: -10 }}
                      whileHover={{ x: 0 }}
                    >
                      <span className="text-sm font-medium mr-2">Explore APIs</span>
                      <ArrowRight className="h-4 w-4" />
                    </motion.div>
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div variants={cardVariants}>
                <Card 
                  className="text-center cursor-pointer group transition-all duration-300 hover:shadow-xl hover:shadow-green-500/25 hover:-translate-y-2 border-0 bg-white/50 backdrop-blur-sm"
                  onClick={() => handleDatabaseFeatureClick('studio')}
                >
                  <CardHeader className="relative overflow-hidden">
                    <motion.div
                      whileHover={{ 
                        rotateY: 180,
                        scale: [1, 1.1, 1]
                      }}
                      transition={{ duration: 0.6 }}
                    >
                      <Layers className="h-12 w-12 text-green-600 mx-auto mb-4 group-hover:text-green-700 transition-colors" />
                    </motion.div>
                    <CardTitle className="text-lg group-hover:text-green-600 transition-colors">
                      Visual Studio
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="group-hover:text-gray-700 transition-colors">
                      Manage your database with an intuitive visual interface. Browse, edit, and monitor your data in real-time.
                    </CardDescription>
                    <motion.div
                      className="mt-4 flex items-center justify-center text-green-600 opacity-0 group-hover:opacity-100 transition-all duration-300"
                      initial={{ x: -10 }}
                      whileHover={{ x: 0 }}
                    >
                      <span className="text-sm font-medium mr-2">Open Studio</span>
                      <ArrowRight className="h-4 w-4" />
                    </motion.div>
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div variants={cardVariants}>
                <Card 
                  className="text-center cursor-pointer group transition-all duration-300 hover:shadow-xl hover:shadow-purple-500/25 hover:-translate-y-2 border-0 bg-white/50 backdrop-blur-sm"
                  onClick={() => handleDatabaseFeatureClick('security')}
                >
                  <CardHeader className="relative overflow-hidden">
                    <motion.div
                      whileHover={{ 
                        scale: [1, 0.9, 1.1, 1],
                        rotateZ: [0, -5, 5, 0]
                      }}
                      transition={{ duration: 0.6 }}
                    >
                      <Shield className="h-12 w-12 text-purple-600 mx-auto mb-4 group-hover:text-purple-700 transition-colors" />
                    </motion.div>
                    <CardTitle className="text-lg group-hover:text-purple-600 transition-colors">
                      Secure & Scalable
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="group-hover:text-gray-700 transition-colors">
                      Built with security best practices, input validation, and optimized queries for production-ready applications.
                    </CardDescription>
                    <motion.div
                      className="mt-4 flex items-center justify-center text-purple-600 opacity-0 group-hover:opacity-100 transition-all duration-300"
                      initial={{ x: -10 }}
                      whileHover={{ x: 0 }}
                    >
                      <span className="text-sm font-medium mr-2">Learn More</span>
                      <ArrowRight className="h-4 w-4" />
                    </motion.div>
                  </CardContent>
                </Card>
              </motion.div>
            </motion.div>
          </div>
        </motion.section>
        
        {/* Enhanced Showcase with Realtime Features */}
        <motion.section 
          id="showcase-section"
          className="py-12 bg-muted/30 relative"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          variants={containerVariants}
        >
          <div className="container mx-auto px-6">
            <motion.div className="text-center mb-8" variants={cardVariants}>
              <motion.div 
                className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium mb-4"
                whileHover={{ scale: 1.05, boxShadow: "0 10px 20px rgba(37, 99, 235, 0.2)" }}
                whileTap={{ scale: 0.95 }}
              >
                <Activity className="h-4 w-4" />
                Live Component Showcase
              </motion.div>
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Realtime Interactive Components
              </h2>
              <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
                Experience our components with live data updates, user interaction tracking, 
                and comprehensive analytics dashboard.
              </p>
            </motion.div>

            <motion.div variants={cardVariants}>
              <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3, duration: 0.5 }}
                >
                  <TabsList className="grid w-full grid-cols-4 mb-8 bg-white/70 backdrop-blur-sm">
                    <TabsTrigger 
                      value="components" 
                      className="flex items-center gap-2 transition-all duration-300 hover:shadow-md data-[state=active]:bg-primary data-[state=active]:text-white"
                    >
                      <Zap className="h-4 w-4" />
                      Live Components
                    </TabsTrigger>
                    <TabsTrigger 
                      value="inputfield" 
                      className="flex items-center gap-2 transition-all duration-300 hover:shadow-md data-[state=active]:bg-primary data-[state=active]:text-white"
                    >
                      <Database className="h-4 w-4" />
                      InputField
                    </TabsTrigger>
                    <TabsTrigger 
                      value="datatable" 
                      className="flex items-center gap-2 transition-all duration-300 hover:shadow-md data-[state=active]:bg-primary data-[state=active]:text-white"
                    >
                      <BarChart3 className="h-4 w-4" />
                      DataTable
                    </TabsTrigger>
                    <TabsTrigger 
                      value="dashboard" 
                      className="flex items-center gap-2 transition-all duration-300 hover:shadow-md data-[state=active]:bg-primary data-[state=active]:text-white"
                    >
                      <Activity className="h-4 w-4" />
                      Analytics
                    </TabsTrigger>
                  </TabsList>
                </motion.div>

                <TabsContent value="components" className="space-y-8">
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5 }}
                  >
                    <RealtimeComponentShowcase />
                  </motion.div>
                </TabsContent>

                <TabsContent value="inputfield" className="space-y-8">
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5 }}
                    className="mb-6"
                  >
                    <div className="flex items-center gap-4 mb-4">
                      <motion.div whileHover={{ scale: 1.05 }}>
                        <Badge variant="secondary" className="gap-1">
                          <Activity className="h-3 w-3" />
                          Realtime Enabled
                        </Badge>
                      </motion.div>
                      <motion.div whileHover={{ scale: 1.05 }}>
                        <Badge variant="outline">Live Analytics</Badge>
                      </motion.div>
                      <motion.div whileHover={{ scale: 1.05 }}>
                        <Badge variant="outline">Database Integration</Badge>
                      </motion.div>
                    </div>
                    <p className="text-muted-foreground">
                      Enhanced InputField components with realtime data integration, 
                      user interaction tracking, and live form validation.
                    </p>
                  </motion.div>
                  <motion.div 
                    id="inputfield" 
                    className="scroll-mt-16"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                  >
                    <InputFieldShowcase />
                  </motion.div>
                </TabsContent>

                <TabsContent value="datatable" className="space-y-8">
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5 }}
                    className="mb-6"
                  >
                    <div className="flex items-center gap-4 mb-4">
                      <motion.div whileHover={{ scale: 1.05 }}>
                        <Badge variant="secondary" className="gap-1">
                          <Activity className="h-3 w-3" />
                          Live Data Updates
                        </Badge>
                      </motion.div>
                      <motion.div whileHover={{ scale: 1.05 }}>
                        <Badge variant="outline">Real-time Stock Tracking</Badge>
                      </motion.div>
                      <motion.div whileHover={{ scale: 1.05 }}>
                        <Badge variant="outline">User Interaction Analytics</Badge>
                      </motion.div>
                    </div>
                    <p className="text-muted-foreground">
                      Powerful DataTable components with live database integration, 
                      realtime updates, and comprehensive interaction tracking.
                    </p>
                  </motion.div>
                  <motion.div 
                    id="datatable" 
                    className="scroll-mt-16"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                  >
                    <DataTableShowcase />
                  </motion.div>
                </TabsContent>

                <TabsContent value="dashboard" className="space-y-8">
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5 }}
                    className="mb-6"
                  >
                    <div className="flex items-center gap-4 mb-4">
                      <motion.div whileHover={{ scale: 1.05 }}>
                        <Badge variant="secondary" className="gap-1">
                          <Activity className="h-3 w-3" />
                          WebSocket Connections
                        </Badge>
                      </motion.div>
                      <motion.div whileHover={{ scale: 1.05 }}>
                        <Badge variant="outline">Live Monitoring</Badge>
                      </motion.div>
                      <motion.div whileHover={{ scale: 1.05 }}>
                        <Badge variant="outline">Performance Metrics</Badge>
                      </motion.div>
                    </div>
                    <p className="text-muted-foreground">
                      Comprehensive realtime dashboard with WebSocket connections, 
                      live data streams, and advanced system monitoring.
                    </p>
                  </motion.div>
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                  >
                    <RealtimeDashboard />
                  </motion.div>
                </TabsContent>
              </Tabs>
            </motion.div>
          </div>
        </motion.section>
      </main>
      <FooterComponent />
      
      {/* Database Management Notification */}
      <DatabaseNotification />
    </div>
  );
}