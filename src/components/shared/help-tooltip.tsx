"use client";

import { useState } from "react";

interface HelpTooltipProps {
  term: string;
  definition: string;
  children: React.ReactNode;
  placement?: "top" | "bottom" | "left" | "right";
  className?: string;
}

export function HelpTooltip({
  term,
  definition,
  children,
  placement = "top",
  className = "",
}: HelpTooltipProps) {
  const [isVisible, setIsVisible] = useState(false);

  const placementClasses = {
    top: "bottom-full left-1/2 -translate-x-1/2 mb-2",
    bottom: "top-full left-1/2 -translate-x-1/2 mt-2",
    left: "right-full top-1/2 -translate-y-1/2 mr-2",
    right: "left-full top-1/2 -translate-y-1/2 ml-2",
  };

  return (
    <div
      className={`relative inline-block ${className}`}
      onMouseEnter={() => setIsVisible(true)}
      onMouseLeave={() => setIsVisible(false)}
    >
      {children}

      {isVisible && (
        <div
          className={`
            absolute z-50 w-64 max-w-xs
            bg-brand-text-dark text-white text-xs
            rounded-lg shadow-lg px-3 py-2
            pointer-events-none animate-fade-in
            ${placementClasses[placement]}
          `}
          role="tooltip"
        >
          {/* Term */}
          {term && (
            <div className="font-bold mb-1 text-white">{term}</div>
          )}
          
          {/* Definition */}
          <div className="text-white/90 leading-relaxed">{definition}</div>

          {/* Arrow */}
          <div
            className={`
              absolute w-2 h-2 bg-brand-text-dark
              ${placement === "top" ? "bottom-[-4px] border-b border-r" : ""}
              ${placement === "bottom" ? "top-[-4px] border-t border-l" : ""}
              ${placement === "left" ? "right-[-4px] border-r border-b" : ""}
              ${placement === "right" ? "left-[-4px] border-l border-t" : ""}
              rotate-45
            `}
            style={{
              left: placement === "top" || placement === "bottom" ? "50%" : undefined,
              top: placement === "left" || placement === "right" ? "50%" : undefined,
              transform:
                placement === "top" || placement === "bottom"
                  ? "translateX(-50%) rotate(45deg)"
                  : "translateY(-50%) rotate(45deg)",
            }}
          />
        </div>
      )}
    </div>
  );
}
