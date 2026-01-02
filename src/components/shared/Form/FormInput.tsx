/**
 * FormInput Component
 * 
 * Enhanced input component with consistent styling
 */

"use client";

import { cn } from "@/lib/utils";
import { forwardRef } from "react";

export interface FormInputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "className"> {
  error?: boolean;
  fullWidth?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const FormInput = forwardRef<HTMLInputElement, FormInputProps>(
  (
    {
      error = false,
      fullWidth = true,
      leftIcon,
      rightIcon,
      type = "text",
      ...props
    },
    ref
  ) => {
    const hasIcons = leftIcon || rightIcon;

    if (hasIcons) {
      return (
        <div className={cn("relative", fullWidth && "w-full")}>
          {leftIcon && (
            <div className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none text-brand-text-light">
              {leftIcon}
            </div>
          )}
          <input
            ref={ref}
            type={type}
            className={cn(
              "px-4 py-2.5 rounded-xl border bg-white text-sm transition-colors",
              "focus:outline-none focus:ring-2 focus:ring-brand-primary/20",
              error
                ? "border-brand-error focus:border-brand-error"
                : "border-brand-border/50 focus:border-brand-primary",
              "disabled:bg-brand-bg disabled:cursor-not-allowed disabled:opacity-50",
              leftIcon && "pl-10",
              rightIcon && "pr-10",
              fullWidth && "w-full"
            )}
            {...props}
          />
          {rightIcon && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-brand-text-light">
              {rightIcon}
            </div>
          )}
        </div>
      );
    }

    return (
      <input
        ref={ref}
        type={type}
        className={cn(
          "px-4 py-2.5 rounded-xl border bg-white text-sm transition-colors",
          "focus:outline-none focus:ring-2 focus:ring-brand-primary/20",
          error
            ? "border-brand-error focus:border-brand-error"
            : "border-brand-border/50 focus:border-brand-primary",
          "disabled:bg-brand-bg disabled:cursor-not-allowed disabled:opacity-50",
          fullWidth && "w-full"
        )}
        {...props}
      />
    );
  }
);

FormInput.displayName = "FormInput";
