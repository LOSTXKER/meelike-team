"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  rightElement?: React.ReactNode;
  variant?: "default" | "filled";
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, hint, leftIcon, rightIcon, rightElement, variant = "default", id, ...props }, ref) => {
    const inputId = id || React.useId();

    const variantStyles = {
      default: "bg-brand-surface",
      filled: "bg-brand-bg/50",
    };

    return (
      <div className="w-full">
        {label && (
          <label
            htmlFor={inputId}
            className="block text-sm font-medium text-brand-text-dark mb-1.5"
          >
            {label}
          </label>
        )}
        <div className="relative">
          {leftIcon && (
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-brand-text-light">
              {leftIcon}
            </div>
          )}
          <input
            id={inputId}
            className={cn(
              "w-full border border-brand-border rounded-lg px-3 py-2.5 text-sm text-brand-text-dark placeholder:text-brand-text-light/60",
              "focus:outline-none focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/10",
              "transition-all duration-200 shadow-sm",
              "disabled:opacity-50 disabled:cursor-not-allowed",
              variantStyles[variant],
              leftIcon && "pl-10",
              (rightIcon || rightElement) && "pr-10",
              error && "border-brand-error focus:border-brand-error focus:ring-brand-error/20",
              className
            )}
            ref={ref}
            {...props}
          />
          {rightIcon && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2 text-brand-text-light">
              {rightIcon}
            </div>
          )}
          {rightElement && (
            <div className="absolute right-2 top-1/2 -translate-y-1/2">
              {rightElement}
            </div>
          )}
        </div>
        {hint && !error && (
          <p className="mt-1.5 text-xs text-brand-text-light">{hint}</p>
        )}
        {error && (
          <p className="mt-1.5 text-sm text-brand-error">{error}</p>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";

export { Input };


