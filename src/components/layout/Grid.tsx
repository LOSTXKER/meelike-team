"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { type SpaceKey } from "@/lib/design";

interface GridProps extends React.HTMLAttributes<HTMLDivElement> {
  cols?: 1 | 2 | 3 | 4 | 6 | 12;
  gap?: SpaceKey;
  responsive?: {
    sm?: 1 | 2 | 3 | 4 | 6 | 12;
    md?: 1 | 2 | 3 | 4 | 6 | 12;
    lg?: 1 | 2 | 3 | 4 | 6 | 12;
  };
  children: React.ReactNode;
}

export const Grid = React.forwardRef<HTMLDivElement, GridProps>(
  ({ cols = 1, gap = 4, responsive, className, children, ...props }, ref) => {
    const colsClass = `grid-cols-${cols}`;
    const gapClass = `gap-${gap}`;
    const responsiveClasses = responsive ? [
      responsive.sm && `sm:grid-cols-${responsive.sm}`,
      responsive.md && `md:grid-cols-${responsive.md}`,
      responsive.lg && `lg:grid-cols-${responsive.lg}`,
    ].filter(Boolean).join(" ") : "";
    
    return (
      <div
        ref={ref}
        className={cn("grid", colsClass, gapClass, responsiveClasses, className)}
        {...props}
      >
        {children}
      </div>
    );
  }
);

Grid.displayName = "Grid";
