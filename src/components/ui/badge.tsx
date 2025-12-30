"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: "default" | "success" | "warning" | "error" | "info" | "outline" | "bot" | "human";
  size?: "sm" | "md";
}

const Badge = React.forwardRef<HTMLSpanElement, BadgeProps>(
  ({ className, variant = "default", size = "md", ...props }, ref) => {
    const variants = {
      default: "bg-brand-secondary text-brand-text-dark border border-brand-border",
      success: "bg-[#E6F4EA] text-[#1E8E3E] border border-[#CEEAD6]", // Crisp Green
      warning: "bg-[#FEF7E0] text-[#B06000] border border-[#FEEFC3]", // Crisp Amber
      error: "bg-[#FCE8E6] text-[#C5221F] border border-[#FAD2CF]", // Crisp Red
      info: "bg-[#E8F0FE] text-[#1967D2] border border-[#D2E3FC]", // Crisp Blue
      outline: "border border-brand-border text-brand-text-light",
      // New variants for Service Types
      bot: "bg-[#F3F4F6] text-[#4B5563] border border-[#E5E7EB]", // Cool Gray
      human: "bg-[#F3E8FF] text-[#7E22CE] border border-[#E9D5FF]", // Soft Purple
    };

    const sizes = {
      sm: "px-2 py-0.5 text-xs",
      md: "px-2.5 py-1 text-sm",
    };

    return (
      <span
        ref={ref}
        className={cn(
          "inline-flex items-center font-medium rounded-full",
          variants[variant],
          sizes[size],
          className
        )}
        {...props}
      />
    );
  }
);

Badge.displayName = "Badge";

export { Badge };


