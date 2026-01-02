"use client";

import * as React from "react";
import { useState, useRef, useEffect } from "react";
import { cn } from "@/lib/utils";

interface TooltipProps {
  content: React.ReactNode;
  side?: "top" | "right" | "bottom" | "left";
  children: React.ReactNode;
  delay?: number;
}

export const Tooltip: React.FC<TooltipProps> = ({
  content,
  side = "top",
  children,
  delay = 200
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout>(undefined);
  
  const showTooltip = () => {
    timeoutRef.current = setTimeout(() => setIsVisible(true), delay);
  };
  
  const hideTooltip = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setIsVisible(false);
  };
  
  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);
  
  return (
    <div
      className="relative inline-block"
      onMouseEnter={showTooltip}
      onMouseLeave={hideTooltip}
      onFocus={showTooltip}
      onBlur={hideTooltip}
    >
      {children}
      
      {isVisible && (
        <div
          role="tooltip"
          className={cn(
            "absolute z-tooltip px-2 py-1 text-xs text-white bg-gray-900 rounded-lg whitespace-nowrap animate-fade-in pointer-events-none",
            side === "top" && "bottom-full left-1/2 -translate-x-1/2 mb-2",
            side === "bottom" && "top-full left-1/2 -translate-x-1/2 mt-2",
            side === "left" && "right-full top-1/2 -translate-y-1/2 mr-2",
            side === "right" && "left-full top-1/2 -translate-y-1/2 ml-2"
          )}
        >
          {content}
        </div>
      )}
    </div>
  );
};
