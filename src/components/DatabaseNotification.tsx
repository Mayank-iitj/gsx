'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Database, ExternalLink, X, Sparkles, Activity, TrendingUp } from 'lucide-react';
import { toast } from 'sonner';

export const DatabaseNotification = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<'connecting' | 'connected' | 'error'>('connecting');

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 5000);

    // Simulate connection status
    const statusTimer = setTimeout(() => {
      setConnectionStatus('connected');
      toast.success('Database Studio is now available!', {
        description: 'Click the Database tab to start managing your data.',
        action: {
          label: 'Open Studio',
          onClick: () => handleOpenStudio(),
        },
      });
    }, 2000);

    return () => {
      clearTimeout(timer);
      clearTimeout(statusTimer);
    };
  }, []);

  const handleOpenStudio = () => {
    toast.info('🚀 Database Studio Opening...', {
      description: 'Look for the Database tab at the top right of the page!',
    });
    setIsVisible(false);
  };

  const handleDismiss = () => {
    setIsVisible(false);
    toast.info('Database notification dismissed', {
      description: 'You can still access the Database Studio from the top navigation.',
    });
  };

  const handleMinimize = () => {
    setIsMinimized(!isMinimized);
  };

  if (!isVisible) return null;

  const statusConfig = {
    connecting: {
      color: 'bg-yellow-500',
      text: 'Initializing...',
      icon: Activity,
      pulse: true
    },
    connected: {
      color: 'bg-green-500',
      text: 'Active',
      icon: TrendingUp,
      pulse: false
    },
    error: {
      color: 'bg-red-500',
      text: 'Error',
      icon: X,
      pulse: false
    }
  };

  const currentStatus = statusConfig[connectionStatus];

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 100, scale: 0.9 }}
        animate={{ 
          opacity: 1, 
          y: 0, 
          scale: 1,
          rotate: [0, 1, -1, 0]
        }}
        exit={{ 
          opacity: 0, 
          y: 100, 
          scale: 0.8,
          transition: { duration: 0.3 }
        }}
        transition={{ 
          type: "spring",
          stiffness: 300,
          damping: 30,
          rotate: {
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut"
          }
        }}
        className="fixed bottom-6 right-6 z-50 max-w-sm"
      >
        <motion.div
          whileHover={{ 
            scale: 1.02,
            boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)"
          }}
          className="relative"
        >
          {/* Glow effect */}
          <motion.div
            animate={{
              opacity: [0.5, 1, 0.5],
              scale: [1, 1.05, 1]
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className="absolute inset-0 bg-gradient-to-r from-primary/20 to-blue-500/20 rounded-lg blur-xl"
          />

          <Card className="relative bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm border border-primary/20 shadow-xl">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                    className="relative"
                  >
                    <Database className="h-6 w-6 text-primary" />
                    <motion.div
                      animate={currentStatus.pulse ? {
                        scale: [1, 1.5, 1],
                        opacity: [1, 0, 1]
                      } : {}}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        ease: "easeInOut"
                      }}
                      className={`absolute -top-1 -right-1 w-3 h-3 ${currentStatus.color} rounded-full`}
                    />
                  </motion.div>
                  
                  <div>
                    <CardTitle className="text-lg flex items-center gap-2">
                      Database Studio
                      <motion.div
                        animate={{ rotate: [0, 10, -10, 0] }}
                        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                      >
                        <Sparkles className="h-4 w-4 text-yellow-500" />
                      </motion.div>
                    </CardTitle>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge variant="secondary" className="text-xs">
                        <currentStatus.icon className="h-3 w-3 mr-1" />
                        {currentStatus.text}
                      </Badge>
                      <Badge variant="outline" className="text-xs">
                        v2.0.1
                      </Badge>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center gap-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleMinimize}
                    className="h-8 w-8 p-0 hover:bg-primary/10"
                  >
                    <motion.div
                      animate={{ scaleY: isMinimized ? -1 : 1 }}
                      transition={{ duration: 0.2 }}
                    >
                      <span className="text-xs">−</span>
                    </motion.div>
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleDismiss}
                    className="h-8 w-8 p-0 hover:bg-destructive/10 hover:text-destructive"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>

            <AnimatePresence>
              {!isMinimized && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3, ease: "easeInOut" }}
                  className="overflow-hidden"
                >
                  <CardContent className="space-y-4">
                    <CardDescription className="text-sm leading-relaxed">
                      🎉 Your database is ready! Access the visual studio to browse, edit, and monitor your data in real-time.
                    </CardDescription>
                    
                    <motion.div
                      className="bg-gradient-to-r from-primary/5 to-blue-500/5 p-3 rounded-lg border border-primary/10"
                      whileHover={{ scale: 1.02 }}
                    >
                      <div className="flex items-center gap-2 text-sm font-medium text-primary mb-2">
                        <TrendingUp className="h-4 w-4" />
                        Live Features Available
                      </div>
                      <ul className="text-xs text-muted-foreground space-y-1">
                        <li>• Real-time data synchronization</li>
                        <li>• Interactive query builder</li>
                        <li>• Performance monitoring</li>
                        <li>• Data visualization tools</li>
                      </ul>
                    </motion.div>

                    <div className="flex gap-2">
                      <Button
                        onClick={handleOpenStudio}
                        size="sm"
                        className="flex-1 group bg-gradient-to-r from-primary to-blue-600 hover:from-primary/90 hover:to-blue-600/90"
                      >
                        <ExternalLink className="h-4 w-4 mr-2 group-hover:translate-x-1 transition-transform" />
                        Open Studio
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={handleDismiss}
                        className="hover:bg-muted/50"
                      >
                        Later
                      </Button>
                    </div>
                  </CardContent>
                </motion.div>
              )}
            </AnimatePresence>
          </Card>

          {/* Floating particles */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-lg">
            {Array.from({ length: 6 }).map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-1 h-1 bg-primary/40 rounded-full"
                animate={{
                  x: [0, Math.random() * 200 - 100],
                  y: [0, Math.random() * 200 - 100],
                  opacity: [0, 1, 0],
                  scale: [0, 1, 0],
                }}
                transition={{
                  duration: 3 + Math.random() * 2,
                  repeat: Infinity,
                  delay: Math.random() * 2,
                  ease: "easeInOut",
                }}
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                }}
              />
            ))}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};