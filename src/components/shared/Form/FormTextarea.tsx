/**
 * FormTextarea Component
 * 
 * Enhanced textarea component with consistent styling
 */

"use client";

import { cn } from "@/lib/utils";
import { forwardRef } from "react";

export interface FormTextareaProps
  extends Omit<React.TextareaHTMLAttributes<HTMLTextAreaElement>, "className"> {
  error?: boolean;
  fullWidth?: boolean;
  showCharCount?: boolean;
  maxCharacters?: number;
}

export const FormTextarea = forwardRef<HTMLTextAreaElement, FormTextareaProps>(
  (
    {
      error = false,
      fullWidth = true,
      showCharCount = false,
      maxCharacters,
      value,
      ...props
    },
    ref
  ) => {
    const charCount = typeof value === "string" ? value.length : 0;

    return (
      <div className={cn("relative", fullWidth && "w-full")}>
        <textarea
          ref={ref}
          value={value}
          maxLength={maxCharacters}
          className={cn(
            "px-4 py-2.5 rounded-xl border bg-white text-sm transition-colors resize-none",
            "focus:outline-none focus:ring-2 focus:ring-brand-primary/20",
            error
              ? "border-brand-error focus:border-brand-error"
              : "border-brand-border/50 focus:border-brand-primary",
            "disabled:bg-brand-bg disabled:cursor-not-allowed disabled:opacity-50",
            fullWidth && "w-full"
          )}
          {...props}
        />
        {showCharCount && maxCharacters && (
          <div className="absolute bottom-2 right-3 text-xs text-brand-text-light">
            {charCount}/{maxCharacters}
          </div>
        )}
      </div>
    );
  }
);

FormTextarea.displayName = "FormTextarea";
