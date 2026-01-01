"use client";

import { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { Card } from "@/components/ui";
import { LucideIcon } from "lucide-react";

// ===== Form Section =====
interface FormSectionProps {
  /** Section title */
  title?: string;
  /** Section description */
  description?: string;
  /** Icon for the section header */
  icon?: LucideIcon;
  /** Children elements */
  children: ReactNode;
  /** Additional class names */
  className?: string;
  /** Use card wrapper (default: true) */
  card?: boolean;
  /** Card variant */
  variant?: "default" | "elevated";
}

export function FormSection({
  title,
  description,
  icon: Icon,
  children,
  className,
  card = true,
  variant = "default",
}: FormSectionProps) {
  const content = (
    <>
      {(title || description) && (
        <div className="mb-6">
          {title && (
            <h3 className="font-bold text-lg text-brand-text-dark flex items-center gap-2">
              {Icon && <Icon className="w-5 h-5 text-brand-primary" />}
              {title}
            </h3>
          )}
          {description && (
            <p className="text-sm text-brand-text-light mt-1">{description}</p>
          )}
        </div>
      )}
      <div className="space-y-4">{children}</div>
    </>
  );

  if (!card) {
    return <div className={className}>{content}</div>;
  }

  return (
    <Card variant={variant} className={cn("p-6", className)}>
      {content}
    </Card>
  );
}

// ===== Form Field =====
interface FormFieldProps {
  /** Field label */
  label: string;
  /** Field description/helper text */
  description?: string;
  /** Error message */
  error?: string;
  /** Whether field is required */
  required?: boolean;
  /** Input/control element */
  children: ReactNode;
  /** Additional class names */
  className?: string;
  /** Label position */
  labelPosition?: "top" | "left";
  /** Full width label (for left position) */
  labelWidth?: string;
}

export function FormField({
  label,
  description,
  error,
  required,
  children,
  className,
  labelPosition = "top",
  labelWidth = "w-32",
}: FormFieldProps) {
  if (labelPosition === "left") {
    return (
      <div className={cn("flex items-start gap-4", className)}>
        <label
          className={cn(
            "text-sm font-medium text-brand-text-dark pt-2.5 shrink-0",
            labelWidth
          )}
        >
          {label}
          {required && <span className="text-brand-error ml-0.5">*</span>}
        </label>
        <div className="flex-1 space-y-1">
          {children}
          {description && !error && (
            <p className="text-xs text-brand-text-light">{description}</p>
          )}
          {error && <p className="text-xs text-brand-error">{error}</p>}
        </div>
      </div>
    );
  }

  return (
    <div className={cn("space-y-1.5", className)}>
      <label className="block text-sm font-medium text-brand-text-dark">
        {label}
        {required && <span className="text-brand-error ml-0.5">*</span>}
      </label>
      {children}
      {description && !error && (
        <p className="text-xs text-brand-text-light">{description}</p>
      )}
      {error && <p className="text-xs text-brand-error">{error}</p>}
    </div>
  );
}

// ===== Form Row =====
interface FormRowProps {
  /** Children (typically FormField components) */
  children: ReactNode;
  /** Number of columns (default: 2) */
  columns?: 2 | 3 | 4;
  /** Gap size */
  gap?: "sm" | "md" | "lg";
  /** Additional class names */
  className?: string;
}

export function FormRow({
  children,
  columns = 2,
  gap = "md",
  className,
}: FormRowProps) {
  const colsClass = {
    2: "grid-cols-1 md:grid-cols-2",
    3: "grid-cols-1 md:grid-cols-3",
    4: "grid-cols-1 md:grid-cols-2 lg:grid-cols-4",
  };

  const gapClass = {
    sm: "gap-3",
    md: "gap-4",
    lg: "gap-6",
  };

  return (
    <div className={cn("grid", colsClass[columns], gapClass[gap], className)}>
      {children}
    </div>
  );
}

// ===== Form Actions =====
interface FormActionsProps {
  /** Children (typically Button components) */
  children: ReactNode;
  /** Alignment */
  align?: "left" | "center" | "right" | "between";
  /** Show divider above */
  divider?: boolean;
  /** Additional class names */
  className?: string;
}

export function FormActions({
  children,
  align = "right",
  divider = true,
  className,
}: FormActionsProps) {
  const alignClass = {
    left: "justify-start",
    center: "justify-center",
    right: "justify-end",
    between: "justify-between",
  };

  return (
    <div
      className={cn(
        "flex items-center gap-3 pt-6",
        divider && "border-t border-brand-border/30 mt-6",
        alignClass[align],
        className
      )}
    >
      {children}
    </div>
  );
}

// ===== Form Divider =====
interface FormDividerProps {
  /** Divider label */
  label?: string;
  /** Additional class names */
  className?: string;
}

export function FormDivider({ label, className }: FormDividerProps) {
  if (label) {
    return (
      <div className={cn("relative my-6", className)}>
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-brand-border/30" />
        </div>
        <div className="relative flex justify-center">
          <span className="px-3 bg-white text-sm text-brand-text-light">
            {label}
          </span>
        </div>
      </div>
    );
  }

  return <hr className={cn("border-t border-brand-border/30 my-6", className)} />;
}

// ===== Form Toggle =====
interface FormToggleProps {
  /** Toggle label */
  label: string;
  /** Description */
  description?: string;
  /** Checked state */
  checked: boolean;
  /** Change handler */
  onChange: (checked: boolean) => void;
  /** Disabled state */
  disabled?: boolean;
  /** Additional class names */
  className?: string;
}

export function FormToggle({
  label,
  description,
  checked,
  onChange,
  disabled,
  className,
}: FormToggleProps) {
  return (
    <label
      className={cn(
        "flex items-center justify-between p-3 rounded-xl border border-brand-border/30 hover:bg-brand-bg/30 transition-colors cursor-pointer",
        disabled && "opacity-50 cursor-not-allowed",
        className
      )}
    >
      <div className="space-y-0.5">
        <p className="text-sm font-medium text-brand-text-dark">{label}</p>
        {description && (
          <p className="text-xs text-brand-text-light">{description}</p>
        )}
      </div>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        disabled={disabled}
        onClick={() => onChange(!checked)}
        className={cn(
          "relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary focus-visible:ring-offset-2",
          checked ? "bg-brand-primary" : "bg-brand-border"
        )}
      >
        <span
          className={cn(
            "inline-block h-4 w-4 transform rounded-full bg-white shadow-sm transition-transform",
            checked ? "translate-x-6" : "translate-x-1"
          )}
        />
      </button>
    </label>
  );
}

// ===== Form Checkbox =====
interface FormCheckboxProps {
  /** Checkbox label */
  label: string;
  /** Description */
  description?: string;
  /** Checked state */
  checked: boolean;
  /** Change handler */
  onChange: (checked: boolean) => void;
  /** Disabled state */
  disabled?: boolean;
  /** Additional class names */
  className?: string;
}

export function FormCheckbox({
  label,
  description,
  checked,
  onChange,
  disabled,
  className,
}: FormCheckboxProps) {
  return (
    <label
      className={cn(
        "flex items-start gap-3 cursor-pointer group",
        disabled && "opacity-50 cursor-not-allowed",
        className
      )}
    >
      <div className="relative flex items-center pt-0.5">
        <input
          type="checkbox"
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
          disabled={disabled}
          className="peer h-5 w-5 cursor-pointer appearance-none rounded-md border border-brand-border transition-all checked:border-brand-primary checked:bg-brand-primary hover:border-brand-primary/50 disabled:cursor-not-allowed"
        />
        <svg
          className="pointer-events-none absolute left-1/2 top-1/2 h-3.5 w-3.5 -translate-x-1/2 -translate-y-1/2 text-white opacity-0 transition-opacity peer-checked:opacity-100"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={3}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
        </svg>
      </div>
      <div className="space-y-0.5">
        <p className="text-sm font-medium text-brand-text-dark group-hover:text-brand-primary transition-colors">
          {label}
        </p>
        {description && (
          <p className="text-xs text-brand-text-light">{description}</p>
        )}
      </div>
    </label>
  );
}
