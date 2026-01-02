"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { tokens, type SpaceKey } from "@/lib/design";

interface StackProps extends React.HTMLAttributes<HTMLDivElement> {
  direction?: "vertical" | "horizontal";
  gap?: SpaceKey;
  align?: "start" | "center" | "end" | "stretch";
  justify?: "start" | "center" | "end" | "between" | "around";
  wrap?: boolean;
  children: React.ReactNode;
}

export const Stack = React.forwardRef<HTMLDivElement, StackProps>(
  ({ 
    direction = "vertical", 
    gap = 4, 
    align, 
    justify, 
    wrap = false, 
    className, 
    children,
    ...props
  }, ref) => {
    const directionClass = direction === "horizontal" ? "flex-row" : "flex-col";
    const gapClass = `gap-${gap}`;
    const alignClass = align ? `items-${align}` : "";
    const justifyClass = justify ? `justify-${justify}` : "";
    const wrapClass = wrap ? "flex-wrap" : "";
    
    return (
      <div
        ref={ref}
        className={cn(
          "flex",
          directionClass,
          gapClass,
          alignClass,
          justifyClass,
          wrapClass,
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);

Stack.displayName = "Stack";

// Shortcuts
export const VStack = React.forwardRef<HTMLDivElement, Omit<StackProps, "direction">>(
  (props, ref) => <Stack ref={ref} direction="vertical" {...props} />
);

VStack.displayName = "VStack";

export const HStack = React.forwardRef<HTMLDivElement, Omit<StackProps, "direction">>(
  (props, ref) => <Stack ref={ref} direction="horizontal" {...props} />
);

HStack.displayName = "HStack";
