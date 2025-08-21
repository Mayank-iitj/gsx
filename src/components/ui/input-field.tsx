"use client";

import React, { forwardRef, useState, useId, useRef } from "react";
import { Eye, EyeOff, X, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { Input } from "./input";

interface InputFieldProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange' | 'size'> {
  label?: string;
  helperText?: string;
  errorMessage?: string;
  invalid?: boolean;
  loading?: boolean;
  variant?: 'filled' | 'outlined' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  showClearButton?: boolean;
  value?: string;
  onChange?: (value: string) => void;
  className?: string;
  darkMode?: boolean;
}

const InputField = forwardRef<HTMLInputElement, InputFieldProps>(
  ({
    label,
    placeholder,
    helperText,
    errorMessage,
    disabled = false,
    invalid = false,
    loading = false,
    variant = 'outlined',
    size = 'md',
    showClearButton = false,
    type = 'text',
    value,
    onChange,
    className,
    darkMode = false,
    id: providedId,
    ...props
  }, ref) => {
    const [internalValue, setInternalValue] = useState(value || '');
    const [showPassword, setShowPassword] = useState(false);
    const [isFocused, setIsFocused] = useState(false);
    const generatedId = useId();
    const id = providedId || generatedId;
    const inputRef = useRef<HTMLInputElement>(null);
    const actualRef = ref || inputRef;

    const displayValue = value !== undefined ? value : internalValue;
    const isError = invalid || !!errorMessage;
    const isPassword = type === 'password';
    const shouldShowClear = showClearButton && displayValue && !loading && !disabled;

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const newValue = e.target.value;
      if (value === undefined) {
        setInternalValue(newValue);
      }
      onChange?.(newValue);
    };

    const handleClear = () => {
      if (value === undefined) {
        setInternalValue('');
      }
      onChange?.('');
      if (actualRef && 'current' in actualRef && actualRef.current) {
        actualRef.current.focus();
      }
    };

    const togglePasswordVisibility = () => {
      setShowPassword(!showPassword);
    };

    const getVariantStyles = () => {
      const baseStyles = "relative transition-all duration-200 ease-out";
      
      if (variant === 'filled') {
        return cn(
          baseStyles,
          "bg-surface border border-border",
          isFocused && "border-primary bg-background",
          isError && "border-destructive bg-destructive/5",
          disabled && "bg-muted border-muted-foreground/20"
        );
      }
      
      if (variant === 'ghost') {
        return cn(
          baseStyles,
          "bg-transparent border-0 border-b-2 border-border rounded-none",
          isFocused && "border-primary",
          isError && "border-destructive",
          disabled && "border-muted-foreground/20"
        );
      }

      // outlined (default)
      return cn(
        baseStyles,
        "bg-background border border-border",
        isFocused && "border-primary ring-2 ring-primary/20",
        isError && "border-destructive ring-2 ring-destructive/20",
        disabled && "bg-muted border-muted-foreground/20"
      );
    };

    const getSizeStyles = () => {
      if (size === 'sm') {
        return "h-8 px-3 text-sm";
      }
      if (size === 'lg') {
        return "h-12 px-4 text-base";
      }
      return "h-10 px-3 text-sm"; // md
    };

    const getLabelSizeStyles = () => {
      if (size === 'sm') {
        return "text-xs";
      }
      if (size === 'lg') {
        return "text-base";
      }
      return "text-sm"; // md
    };

    const getHelperSizeStyles = () => {
      if (size === 'sm') {
        return "text-xs";
      }
      if (size === 'lg') {
        return "text-sm";
      }
      return "text-xs"; // md
    };

    const inputType = isPassword ? (showPassword ? 'text' : 'password') : type;

    return (
      <div className={cn("w-full space-y-2", className)}>
        {label && (
          <label
            htmlFor={id}
            className={cn(
              "block font-medium text-text-primary",
              getLabelSizeStyles(),
              disabled && "text-muted-foreground"
            )}
          >
            {label}
          </label>
        )}
        
        <div className="relative">
          <Input
            {...props}
            ref={actualRef}
            id={id}
            type={inputType}
            value={displayValue}
            onChange={handleInputChange}
            onFocus={(e) => {
              setIsFocused(true);
              props.onFocus?.(e);
            }}
            onBlur={(e) => {
              setIsFocused(false);
              props.onBlur?.(e);
            }}
            placeholder={placeholder}
            disabled={disabled || loading}
            className={cn(
              getVariantStyles(),
              getSizeStyles(),
              "pr-10", // Space for icons
              isPassword && shouldShowClear && "pr-20", // Extra space for password toggle + clear
              !isPassword && shouldShowClear && "pr-10",
              loading && "pr-10"
            )}
            aria-invalid={isError}
            aria-describedby={
              helperText || errorMessage 
                ? `${id}-description` 
                : undefined
            }
          />

          {/* Loading indicator */}
          {loading && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2">
              <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
            </div>
          )}

          {/* Clear button */}
          {shouldShowClear && !loading && (
            <button
              type="button"
              onClick={handleClear}
              className={cn(
                "absolute top-1/2 -translate-y-1/2 p-1 rounded-full hover:bg-muted transition-colors",
                "text-muted-foreground hover:text-foreground",
                isPassword ? "right-10" : "right-2"
              )}
              tabIndex={-1}
            >
              <X className="h-3 w-3" />
              <span className="sr-only">Clear input</span>
            </button>
          )}

          {/* Password toggle */}
          {isPassword && !loading && (
            <button
              type="button"
              onClick={togglePasswordVisibility}
              className="absolute right-2 top-1/2 -translate-y-1/2 p-1 rounded-full hover:bg-muted transition-colors text-muted-foreground hover:text-foreground"
              tabIndex={-1}
            >
              {showPassword ? (
                <EyeOff className="h-4 w-4" />
              ) : (
                <Eye className="h-4 w-4" />
              )}
              <span className="sr-only">
                {showPassword ? 'Hide password' : 'Show password'}
              </span>
            </button>
          )}
        </div>

        {/* Helper text or error message */}
        {(helperText || errorMessage) && (
          <div
            id={`${id}-description`}
            className={cn(
              "font-medium",
              getHelperSizeStyles(),
              isError ? "text-destructive" : "text-muted-foreground"
            )}
            role={isError ? "alert" : undefined}
          >
            {errorMessage || helperText}
          </div>
        )}
      </div>
    );
  }
);

InputField.displayName = 'InputField';

export default InputField;