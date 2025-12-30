"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

export interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, label, error, id, ...props }, ref) => {
    const textareaId = id || React.useId();

    return (
      <div className="w-full">
        {label && (
          <label
            htmlFor={textareaId}
            className="block text-sm font-medium text-brand-text-dark mb-1.5"
          >
            {label}
          </label>
        )}
        <textarea
          id={textareaId}
          className={cn(
            "w-full bg-brand-surface border border-brand-border rounded-xl px-4 py-3 text-sm text-brand-text-dark placeholder:text-brand-text-light/50",
            "focus:outline-none focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/10",
            "transition-all duration-200 resize-none shadow-sm",
            "disabled:opacity-50 disabled:cursor-not-allowed",
            error && "border-brand-error focus:border-brand-error focus:ring-brand-error/20",
            className
          )}
          ref={ref}
          {...props}
        />
        {error && (
          <p className="mt-1.5 text-sm text-brand-error">{error}</p>
        )}
      </div>
    );
  }
);

Textarea.displayName = "Textarea";

export { Textarea };


