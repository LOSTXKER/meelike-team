/**
 * FormSelect Component
 * 
 * Enhanced select component with consistent styling
 */

"use client";

import { cn } from "@/lib/utils";
import { forwardRef } from "react";

export interface FormSelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

export interface FormSelectProps
  extends Omit<React.SelectHTMLAttributes<HTMLSelectElement>, "className"> {
  options: FormSelectOption[];
  error?: boolean;
  fullWidth?: boolean;
}

export const FormSelect = forwardRef<HTMLSelectElement, FormSelectProps>(
  ({ options, error = false, fullWidth = true, ...props }, ref) => {
    return (
      <select
        ref={ref}
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
      >
        {options.map((option) => (
          <option
            key={option.value}
            value={option.value}
            disabled={option.disabled}
          >
            {option.label}
          </option>
        ))}
      </select>
    );
  }
);

FormSelect.displayName = "FormSelect";
