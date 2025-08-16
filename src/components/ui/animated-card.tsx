"use client";

import React, { forwardRef, useState } from 'react';
import { motion, AnimatePresence, useInView } from 'framer-motion';
import { Card, CardHeader, CardContent, CardDescription, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface AnimatedCardProps extends React.ComponentProps<typeof Card> {
  variant?: 'subtle' | 'moderate' | 'dramatic';
  theme?: 'default' | 'primary' | 'secondary' | 'accent' | 'destructive';
  isLoading?: boolean;
  disabled?: boolean;
  onPress?: () => void;
  hoverTransform?: {
    translateY?: number;
    scale?: number;
    rotate?: number;
  };
  entranceAnimation?: boolean;
  glowEffect?: boolean;
}

interface AnimatedCardHeaderProps extends React.ComponentProps<typeof CardHeader> {}
interface AnimatedCardContentProps extends React.ComponentProps<typeof CardContent> {}
interface AnimatedCardDescriptionProps extends React.ComponentProps<typeof CardDescription> {}
interface AnimatedCardTitleProps extends React.ComponentProps<typeof CardTitle> {}

const AnimatedCard = forwardRef<HTMLDivElement, AnimatedCardProps>(({
  children,
  className,
  variant = 'moderate',
  theme = 'default',
  isLoading = false,
  disabled = false,
  onPress,
  hoverTransform = { translateY: -4, scale: 1.02, rotate: 0 },
  entranceAnimation = true,
  glowEffect = false,
  ...props
}, ref) => {
  const [isPressed, setIsPressed] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const cardRef = React.useRef<HTMLDivElement>(null);
  const isInView = useInView(cardRef, { once: true, margin: "-50px" });

  const variants = {
    subtle: {
      hover: {
        y: hoverTransform.translateY ? hoverTransform.translateY * 0.5 : -2,
        scale: hoverTransform.scale ? 1 + (hoverTransform.scale - 1) * 0.5 : 1.01,
        rotate: hoverTransform.rotate ? hoverTransform.rotate * 0.5 : 0,
        boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
        transition: { duration: 0.2, ease: "easeOut" }
      },
      tap: {
        scale: 0.98,
        transition: { duration: 0.1 }
      }
    },
    moderate: {
      hover: {
        y: hoverTransform.translateY || -4,
        scale: hoverTransform.scale || 1.02,
        rotate: hoverTransform.rotate || 0,
        boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
        transition: { duration: 0.25, ease: "easeOut" }
      },
      tap: {
        scale: 0.97,
        transition: { duration: 0.1 }
      }
    },
    dramatic: {
      hover: {
        y: hoverTransform.translateY ? hoverTransform.translateY * 1.5 : -8,
        scale: hoverTransform.scale ? 1 + (hoverTransform.scale - 1) * 1.5 : 1.05,
        rotate: hoverTransform.rotate ? hoverTransform.rotate * 1.5 : 0,
        boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
        transition: { duration: 0.3, ease: "easeOut" }
      },
      tap: {
        scale: 0.95,
        transition: { duration: 0.1 }
      }
    }
  };

  const themeStyles = {
    default: {
      base: "bg-card border-border hover:border-border/80",
      glow: "hover:shadow-primary/20"
    },
    primary: {
      base: "bg-primary/5 border-primary/20 hover:border-primary/40 hover:bg-primary/10",
      glow: "hover:shadow-primary/30"
    },
    secondary: {
      base: "bg-secondary/5 border-secondary/20 hover:border-secondary/40 hover:bg-secondary/10",
      glow: "hover:shadow-secondary/30"
    },
    accent: {
      base: "bg-accent border-accent/20 hover:border-accent/40 hover:bg-accent/80",
      glow: "hover:shadow-accent/30"
    },
    destructive: {
      base: "bg-destructive/5 border-destructive/20 hover:border-destructive/40 hover:bg-destructive/10",
      glow: "hover:shadow-destructive/30"
    }
  };

  const entranceVariants = {
    hidden: {
      opacity: 0,
      y: 50,
      scale: 0.9
    },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.5,
        ease: "easeOut"
      }
    }
  };

  const loadingVariants = {
    animate: {
      opacity: [0.5, 1, 0.5],
      transition: {
        duration: 1.5,
        repeat: Infinity,
        ease: "easeInOut"
      }
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if ((event.key === 'Enter' || event.key === ' ') && onPress && !disabled) {
      event.preventDefault();
      setIsPressed(true);
      onPress();
      setTimeout(() => setIsPressed(false), 150);
    }
  };

  const cardElement = (
    <motion.div
      ref={cardRef}
      variants={entranceAnimation ? entranceVariants : undefined}
      initial={entranceAnimation ? "hidden" : undefined}
      animate={entranceAnimation && isInView ? "visible" : undefined}
    >
      <Card
        ref={ref}
        className={cn(
          "relative overflow-hidden transition-all duration-300 cursor-pointer",
          themeStyles[theme].base,
          glowEffect && themeStyles[theme].glow,
          disabled && "opacity-50 cursor-not-allowed pointer-events-none",
          isFocused && "ring-2 ring-ring ring-offset-2",
          isLoading && "pointer-events-none",
          className
        )}
        tabIndex={onPress && !disabled ? 0 : undefined}
        role={onPress ? "button" : undefined}
        aria-disabled={disabled}
        onKeyDown={handleKeyDown}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        {...props}
      >
        <motion.div
          whileHover={!disabled && !isLoading ? variants[variant].hover : undefined}
          whileTap={!disabled && !isLoading && onPress ? variants[variant].tap : undefined}
          animate={isLoading ? loadingVariants.animate : undefined}
          onClick={onPress && !disabled && !isLoading ? onPress : undefined}
          className="h-full w-full"
        >
          {isLoading && (
            <div className="absolute inset-0 bg-background/50 flex items-center justify-center z-10">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full"
              />
            </div>
          )}
          
          {children}
          
          {glowEffect && (
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-primary/20 via-transparent to-primary/20 opacity-0"
              whileHover={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
              style={{ pointerEvents: 'none' }}
            />
          )}
        </motion.div>
      </Card>
    </motion.div>
  );

  return cardElement;
});

const AnimatedCardHeader = forwardRef<HTMLDivElement, AnimatedCardHeaderProps>(({
  children,
  className,
  ...props
}, ref) => {
  return (
    <CardHeader ref={ref} className={cn("relative", className)} {...props}>
      {children}
    </CardHeader>
  );
});

const AnimatedCardContent = forwardRef<HTMLDivElement, AnimatedCardContentProps>(({
  children,
  className,
  ...props
}, ref) => {
  return (
    <CardContent ref={ref} className={cn("relative", className)} {...props}>
      {children}
    </CardContent>
  );
});

const AnimatedCardDescription = forwardRef<HTMLParagraphElement, AnimatedCardDescriptionProps>(({
  children,
  className,
  ...props
}, ref) => {
  return (
    <CardDescription ref={ref} className={cn("relative", className)} {...props}>
      {children}
    </CardDescription>
  );
});

const AnimatedCardTitle = forwardRef<HTMLHeadingElement, AnimatedCardTitleProps>(({
  children,
  className,
  ...props
}, ref) => {
  return (
    <CardTitle ref={ref} className={cn("relative", className)} {...props}>
      {children}
    </CardTitle>
  );
});

AnimatedCard.displayName = "AnimatedCard";
AnimatedCardHeader.displayName = "AnimatedCardHeader";
AnimatedCardContent.displayName = "AnimatedCardContent";
AnimatedCardDescription.displayName = "AnimatedCardDescription";
AnimatedCardTitle.displayName = "AnimatedCardTitle";

export {
  AnimatedCard,
  AnimatedCardHeader,
  AnimatedCardContent,
  AnimatedCardDescription,
  AnimatedCardTitle
};