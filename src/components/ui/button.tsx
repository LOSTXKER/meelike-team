"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost" | "danger" | "success" | "warning" | "link";
  size?: "sm" | "md" | "lg";
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  fullWidth?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = "primary",
      size = "md",
      isLoading = false,
      leftIcon,
      rightIcon,
      fullWidth = false,
      children,
      disabled,
      ...props
    },
    ref
  ) => {
    const baseStyles =
      "inline-flex items-center justify-center font-medium rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100 disabled:hover:bg-current";

    const variants = {
      primary:
        "bg-brand-primary text-white hover:bg-brand-primary/90 focus:ring-brand-primary shadow-sm",
      secondary:
        "bg-white border border-brand-border text-brand-text-dark hover:bg-brand-secondary focus:ring-brand-border shadow-sm",
      outline:
        "border border-brand-border text-brand-text-dark hover:bg-brand-secondary focus:ring-brand-border",
      ghost:
        "text-brand-text-dark hover:bg-brand-secondary focus:ring-brand-border",
      danger:
        "bg-brand-error text-white hover:bg-brand-error/90 focus:ring-brand-error shadow-sm",
      success:
        "bg-brand-success text-white hover:bg-brand-success/90 focus:ring-brand-success shadow-sm",
      warning:
        "bg-brand-warning text-white hover:bg-brand-warning/90 focus:ring-brand-warning shadow-sm",
      link:
        "text-brand-primary hover:underline focus:ring-brand-primary",
    };

    const sizes = {
      sm: "px-3 py-1.5 text-sm gap-1.5",
      md: "px-4 py-2 text-base gap-2",
      lg: "px-6 py-3 text-lg gap-2.5",
    };

    return (
      <button
        className={cn(
          baseStyles, 
          variants[variant], 
          sizes[size], 
          fullWidth && "w-full",
          className
        )}
        ref={ref}
        disabled={disabled || isLoading}
        {...props}
      >
        {isLoading ? (
          <Loader2 className="w-4 h-4 animate-spin" />
        ) : (
          leftIcon
        )}
        {children}
        {!isLoading && rightIcon}
      </button>
    );
  }
);

Button.displayName = "Button";

export { Button };


