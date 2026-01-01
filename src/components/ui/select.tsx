"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { ChevronDown } from "lucide-react";

export interface SelectProps
  extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  options?: { value: string; label: string }[];
}

const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, label, error, options, id, children, ...props }, ref) => {
    const selectId = id || React.useId();

    return (
      <div className="w-full">
        {label && (
          <label
            htmlFor={selectId}
            className="block text-sm font-medium text-brand-text-dark mb-1.5"
          >
            {label}
          </label>
        )}
        <div className="relative">
          <select
            id={selectId}
            className={cn(
              "w-full bg-brand-surface border border-brand-border rounded-xl px-4 py-2.5 text-sm text-brand-text-dark appearance-none cursor-pointer",
              "focus:outline-none focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/10",
              "transition-all duration-200 shadow-sm",
              "disabled:opacity-50 disabled:cursor-not-allowed",
              error && "border-brand-error focus:border-brand-error focus:ring-brand-error/20",
              className
            )}
            ref={ref}
            {...props}
          >
            {options
              ? options.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))
              : children}
          </select>
          <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-brand-text-light pointer-events-none" />
        </div>
        {error && (
          <p className="mt-1.5 text-sm text-brand-error">{error}</p>
        )}
      </div>
    );
  }
);

Select.displayName = "Select";

export { Select };


