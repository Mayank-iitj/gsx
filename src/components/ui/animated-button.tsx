"use client";

import React, { forwardRef, useState, useRef, useEffect } from "react";
import { motion, AnimatePresence, useAnimation } from "framer-motion";
import { Button, ButtonProps } from "@/components/ui/button";
import { Loader2, Check, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

// Animation style types
type AnimationStyle = "bounce" | "scale" | "ripple" | "slide" | "glow";
type LoadingSpinnerStyle = "default" | "dots" | "pulse" | "bars";

// Enhanced button props interface
interface EnhancedButtonProps extends ButtonProps {
  animationStyle?: AnimationStyle;
  isLoading?: boolean;
  loadingText?: string;
  loadingSpinnerStyle?: LoadingSpinnerStyle;
  showSuccess?: boolean;
  successDuration?: number;
  magneticEffect?: boolean;
  iconAnimation?: "none" | "rotate" | "slide" | "bounce";
  enableHaptics?: boolean;
  enableParticles?: boolean;
  gradientBorder?: boolean;
  respectMotion?: boolean;
}

// Particle component for special effects
const Particle = ({ delay }: { delay: number }) => (
  <motion.div
    className="absolute w-1 h-1 bg-primary rounded-full"
    initial={{ scale: 0, x: 0, y: 0 }}
    animate={{
      scale: [0, 1, 0],
      x: Math.random() * 100 - 50,
      y: Math.random() * 100 - 50,
    }}
    transition={{
      duration: 1,
      delay,
      ease: "easeOut",
    }}
  />
);

// Loading spinner variants
const LoadingSpinner = ({ style }: { style: LoadingSpinnerStyle }) => {
  switch (style) {
    case "dots":
      return (
        <div className="flex space-x-1">
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              className="w-1 h-1 bg-current rounded-full"
              animate={{ scale: [1, 1.5, 1] }}
              transition={{
                duration: 0.6,
                repeat: Infinity,
                delay: i * 0.1,
              }}
            />
          ))}
        </div>
      );
    case "pulse":
      return (
        <motion.div
          className="w-4 h-4 border-2 border-current rounded-full"
          animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 1, repeat: Infinity }}
        />
      );
    case "bars":
      return (
        <div className="flex space-x-0.5">
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              className="w-0.5 h-4 bg-current rounded-full"
              animate={{ scaleY: [1, 0.5, 1] }}
              transition={{
                duration: 0.8,
                repeat: Infinity,
                delay: i * 0.1,
              }}
            />
          ))}
        </div>
      );
    default:
      return <Loader2 className="w-4 h-4 animate-spin" />;
  }
};

export const EnhancedButton = forwardRef<HTMLButtonElement, EnhancedButtonProps>(
  (
    {
      children,
      className,
      animationStyle = "scale",
      isLoading = false,
      loadingText,
      loadingSpinnerStyle = "default",
      showSuccess = false,
      successDuration = 2000,
      magneticEffect = false,
      iconAnimation = "none",
      enableHaptics = false,
      enableParticles = false,
      gradientBorder = false,
      respectMotion = true,
      onClick,
      disabled,
      ...props
    },
    ref
  ) => {
    const [isPressed, setIsPressed] = useState(false);
    const [showSuccessState, setShowSuccessState] = useState(false);
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
    const [showParticles, setShowParticles] = useState(false);
    const buttonRef = useRef<HTMLButtonElement>(null);
    const controls = useAnimation();

    // Check for reduced motion preference
    const prefersReducedMotion = respectMotion && 
      typeof window !== "undefined" && 
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    // Handle success state
    useEffect(() => {
      if (showSuccess) {
        setShowSuccessState(true);
        const timer = setTimeout(() => {
          setShowSuccessState(false);
        }, successDuration);
        return () => clearTimeout(timer);
      }
    }, [showSuccess, successDuration]);

    // Magnetic effect mouse tracking
    const handleMouseMove = (e: React.MouseEvent) => {
      if (!magneticEffect || !buttonRef.current) return;
      
      const rect = buttonRef.current.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      
      setMousePosition({
        x: (e.clientX - centerX) * 0.3,
        y: (e.clientY - centerY) * 0.3,
      });
    };

    const handleMouseLeave = () => {
      setMousePosition({ x: 0, y: 0 });
    };

    // Haptic feedback
    const triggerHaptics = () => {
      if (enableHaptics && navigator.vibrate) {
        navigator.vibrate(50);
      }
    };

    // Handle click with animations and effects
    const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
      if (disabled || isLoading) return;

      triggerHaptics();
      
      if (enableParticles) {
        setShowParticles(true);
        setTimeout(() => setShowParticles(false), 1000);
      }

      onClick?.(e);
    };

    // Animation variants
    const getAnimationVariants = () => {
      if (prefersReducedMotion) {
        return {
          initial: {},
          hover: {},
          tap: {},
        };
      }

      switch (animationStyle) {
        case "bounce":
          return {
            initial: { scale: 1 },
            hover: { scale: 1.05, y: -2 },
            tap: { scale: 0.95, y: 0 },
          };
        case "scale":
          return {
            initial: { scale: 1 },
            hover: { scale: 1.05 },
            tap: { scale: 0.95 },
          };
        case "ripple":
          return {
            initial: { scale: 1 },
            hover: { scale: 1.02 },
            tap: { scale: 0.98 },
          };
        case "slide":
          return {
            initial: { x: 0 },
            hover: { x: 2 },
            tap: { x: 0 },
          };
        case "glow":
          return {
            initial: { scale: 1, boxShadow: "0 0 0 rgba(37, 99, 235, 0)" },
            hover: { 
              scale: 1.02, 
              boxShadow: "0 0 20px rgba(37, 99, 235, 0.4)" 
            },
            tap: { scale: 0.98 },
          };
        default:
          return {
            initial: { scale: 1 },
            hover: { scale: 1.05 },
            tap: { scale: 0.95 },
          };
      }
    };

    const variants = getAnimationVariants();

    // Icon animation variants
    const iconVariants = {
      none: {},
      rotate: {
        hover: { rotate: 180 },
      },
      slide: {
        hover: { x: 4 },
      },
      bounce: {
        hover: { y: -2 },
        tap: { y: 1 },
      },
    };

    return (
      <motion.div
        className="relative inline-block"
        animate={{
          x: magneticEffect ? mousePosition.x : 0,
          y: magneticEffect ? mousePosition.y : 0,
        }}
        transition={{ type: "spring", stiffness: 150, damping: 15 }}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
      >
        <motion.div
          variants={variants}
          initial="initial"
          whileHover="hover"
          whileTap="tap"
          className={cn(
            "relative overflow-hidden",
            gradientBorder && "p-[1px] rounded-lg bg-gradient-to-r from-primary to-primary/50"
          )}
        >
          <Button
            ref={ref || buttonRef}
            className={cn(
              "relative transition-all duration-200",
              gradientBorder && "bg-background border-0",
              showSuccessState && "bg-green-600 hover:bg-green-700 text-white",
              className
            )}
            disabled={disabled || isLoading}
            onClick={handleClick}
            onMouseDown={() => setIsPressed(true)}
            onMouseUp={() => setIsPressed(false)}
            onMouseLeave={() => setIsPressed(false)}
            {...props}
          >
            {/* Ripple effect */}
            {animationStyle === "ripple" && isPressed && !prefersReducedMotion && (
              <motion.div
                className="absolute inset-0 bg-white/20 rounded-full"
                initial={{ scale: 0, opacity: 1 }}
                animate={{ scale: 2, opacity: 0 }}
                transition={{ duration: 0.6 }}
              />
            )}

            {/* Gradient border animation */}
            {gradientBorder && !prefersReducedMotion && (
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-primary via-primary/50 to-primary opacity-0 rounded-lg"
                whileHover={{ opacity: 0.1 }}
                transition={{ duration: 0.3 }}
              />
            )}

            {/* Content */}
            <div className="flex items-center justify-center space-x-2">
              <AnimatePresence mode="wait">
                {isLoading ? (
                  <motion.div
                    key="loading"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    className="flex items-center space-x-2"
                  >
                    <LoadingSpinner style={loadingSpinnerStyle} />
                    {loadingText && <span>{loadingText}</span>}
                  </motion.div>
                ) : showSuccessState ? (
                  <motion.div
                    key="success"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    className="flex items-center space-x-2"
                  >
                    <Check className="w-4 h-4" />
                    <span>Success!</span>
                  </motion.div>
                ) : (
                  <motion.div
                    key="content"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="flex items-center space-x-2"
                  >
                    {React.Children.map(children, (child) => {
                      if (React.isValidElement(child) && child.type === "svg") {
                        return (
                          <motion.div
                            variants={iconVariants[iconAnimation]}
                            transition={{ duration: 0.2 }}
                          >
                            {child}
                          </motion.div>
                        );
                      }
                      return child;
                    })}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Particle effects */}
            {showParticles && !prefersReducedMotion && (
              <div className="absolute inset-0 pointer-events-none">
                {Array.from({ length: 12 }).map((_, i) => (
                  <Particle key={i} delay={i * 0.05} />
                ))}
              </div>
            )}

            {/* Shine effect for special states */}
            {(showSuccessState || enableParticles) && !prefersReducedMotion && (
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12"
                initial={{ x: "-100%" }}
                animate={{ x: "100%" }}
                transition={{ duration: 0.8, ease: "easeInOut" }}
              />
            )}
          </Button>
        </motion.div>
      </motion.div>
    );
  }
);

EnhancedButton.displayName = "EnhancedButton";