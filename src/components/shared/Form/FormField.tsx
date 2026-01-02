/**
 * FormField Component
 * 
 * Wrapper for form inputs with label, error, and required indicator
 */

"use client";

import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

export interface FormFieldProps {
  label?: string;
  error?: string;
  required?: boolean;
  hint?: string;
  children: ReactNode;
  className?: string;
}

export function FormField({
  label,
  error,
  required = false,
  hint,
  children,
  className,
}: FormFieldProps) {
  return (
    <div className={cn("space-y-2", className)}>
      {label && (
        <label className="block text-sm font-medium text-brand-text-dark">
          {label}
          {required && <span className="text-brand-error ml-1">*</span>}
        </label>
      )}
      {children}
      {error && <p className="text-sm text-brand-error">{error}</p>}
      {hint && !error && <p className="text-xs text-brand-text-light">{hint}</p>}
    </div>
  );
}
