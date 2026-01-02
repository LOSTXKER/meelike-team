"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

interface SectionProps extends React.HTMLAttributes<HTMLElement> {
  spacing?: "sm" | "md" | "lg";
  children: React.ReactNode;
}

export const Section = React.forwardRef<HTMLElement, SectionProps>(
  ({ spacing = "md", className, children, ...props }, ref) => {
    const spacings = {
      sm: "space-y-4",
      md: "space-y-6",
      lg: "space-y-8",
    };
    
    return (
      <section
        ref={ref}
        className={cn(spacings[spacing], className)}
        {...props}
      >
        {children}
      </section>
    );
  }
);

Section.displayName = "Section";
