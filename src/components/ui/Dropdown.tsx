"use client";

import * as React from "react";
import { useState, useRef, useEffect } from "react";
import { cn } from "@/lib/utils";
import type { LucideIcon } from "lucide-react";

interface DropdownItem {
  icon?: LucideIcon;
  label: string;
  onClick: () => void;
  variant?: "default" | "danger";
  divider?: boolean;
}

interface DropdownProps {
  trigger: React.ReactNode;
  items: DropdownItem[];
  align?: "left" | "right";
  className?: string;
}

export const Dropdown: React.FC<DropdownProps> = ({
  trigger,
  items,
  align = "right",
  className
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  
  // Close on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);
  
  // Close on Escape
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsOpen(false);
    };
    
    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
      return () => document.removeEventListener("keydown", handleEscape);
    }
  }, [isOpen]);
  
  return (
    <div ref={dropdownRef} className={cn("relative", className)}>
      <div onClick={() => setIsOpen(!isOpen)}>
        {trigger}
      </div>
      
      {isOpen && (
        <div
          className={cn(
            "absolute top-full mt-2 w-56 bg-white rounded-xl shadow-xl border border-brand-border/50 z-dropdown overflow-hidden animate-slide-in-up",
            align === "right" ? "right-0" : "left-0"
          )}
        >
          {items.map((item, idx) => (
            <React.Fragment key={idx}>
              {item.divider && <div className="border-t border-brand-border/30 my-1" />}
              <button
                onClick={() => {
                  item.onClick();
                  setIsOpen(false);
                }}
                className={cn(
                  "w-full flex items-center gap-3 px-4 py-2.5 text-left transition-colors",
                  item.variant === "danger"
                    ? "text-brand-error hover:bg-brand-error/5"
                    : "text-brand-text-dark hover:bg-brand-bg"
                )}
              >
                {item.icon && <item.icon className="w-4 h-4" />}
                <span className="font-medium text-sm">{item.label}</span>
              </button>
            </React.Fragment>
          ))}
        </div>
      )}
    </div>
  );
};
