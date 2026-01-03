"use client";

import { useState } from "react";
import { HelpCircle, X } from "lucide-react";
import { Button } from "@/components/ui";

interface HelpIconProps {
  title: string;
  content: string | React.ReactNode;
  placement?: "top" | "bottom" | "left" | "right";
  size?: "sm" | "md" | "lg";
  className?: string;
}

export function HelpIcon({
  title,
  content,
  placement = "bottom",
  size = "md",
  className = "",
}: HelpIconProps) {
  const [isOpen, setIsOpen] = useState(false);

  const sizeClasses = {
    sm: "w-4 h-4",
    md: "w-5 h-5",
    lg: "w-6 h-6",
  };

  const placementClasses = {
    top: "bottom-full left-1/2 -translate-x-1/2 mb-2",
    bottom: "top-full left-1/2 -translate-x-1/2 mt-2",
    left: "right-full top-1/2 -translate-y-1/2 mr-2",
    right: "left-full top-1/2 -translate-y-1/2 ml-2",
  };

  return (
    <div className={`relative inline-block ${className}`}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        onMouseEnter={() => setIsOpen(true)}
        onMouseLeave={() => setIsOpen(false)}
        className="text-brand-primary hover:text-brand-primary-dark transition-colors cursor-help"
        aria-label={title}
      >
        <HelpCircle className={sizeClasses[size]} />
      </button>

      {isOpen && (
        <>
          {/* Backdrop for mobile */}
          <div
            className="fixed inset-0 z-40 bg-black/20 md:hidden"
            onClick={() => setIsOpen(false)}
          />

          {/* Popover */}
          <div
            className={`
              absolute z-50 w-80 max-w-[calc(100vw-2rem)]
              bg-white rounded-xl shadow-xl border border-brand-border/20
              p-4 animate-fade-in
              ${placementClasses[placement]}
              md:w-96
            `}
            onMouseEnter={() => setIsOpen(true)}
            onMouseLeave={() => setIsOpen(false)}
          >
            {/* Header */}
            <div className="flex items-start justify-between mb-3">
              <h4 className="font-bold text-brand-text-dark flex items-center gap-2">
                <HelpCircle className="w-5 h-5 text-brand-primary" />
                {title}
              </h4>
              <button
                onClick={() => setIsOpen(false)}
                className="text-brand-text-light hover:text-brand-text-dark transition-colors md:hidden"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Content */}
            <div className="text-sm text-brand-text-light leading-relaxed">
              {typeof content === "string" ? (
                <p>{content}</p>
              ) : (
                content
              )}
            </div>

            {/* Arrow */}
            <div
              className={`
                absolute w-3 h-3 bg-white border-brand-border/20
                ${placement === "top" ? "bottom-[-6px] border-b border-r" : ""}
                ${placement === "bottom" ? "top-[-6px] border-t border-l" : ""}
                ${placement === "left" ? "right-[-6px] border-r border-b" : ""}
                ${placement === "right" ? "left-[-6px] border-l border-t" : ""}
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
        </>
      )}
    </div>
  );
}
