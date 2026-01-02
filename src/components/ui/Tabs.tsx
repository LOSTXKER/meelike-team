"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import type { LucideIcon } from "lucide-react";
import { Badge } from "./badge";

interface Tab {
  id: string;
  label: string;
  icon?: LucideIcon;
  count?: number;
}

interface TabsProps {
  tabs: Tab[];
  activeTab: string;
  onChange: (tabId: string) => void;
  variant?: "line" | "pills" | "buttons";
  className?: string;
}

export const Tabs: React.FC<TabsProps> = ({
  tabs,
  activeTab,
  onChange,
  variant = "line",
  className
}) => {
  if (variant === "pills") {
    return (
      <div className={cn("flex gap-1 p-1 bg-brand-bg/50 rounded-xl border border-brand-border/30", className)}>
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => onChange(tab.id)}
            className={cn(
              "flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all",
              activeTab === tab.id
                ? "bg-white text-brand-text-dark shadow-sm"
                : "text-brand-text-light hover:text-brand-text-dark"
            )}
          >
            {tab.icon && <tab.icon className={cn("w-4 h-4", activeTab === tab.id && "text-brand-primary")} />}
            {tab.label}
            {tab.count !== undefined && (
              <span className={cn(
                "px-1.5 py-0.5 rounded text-xs font-semibold",
                activeTab === tab.id
                  ? "bg-brand-primary/10 text-brand-primary"
                  : "bg-brand-bg text-brand-text-light"
              )}>
                {tab.count}
              </span>
            )}
          </button>
        ))}
      </div>
    );
  }
  
  // Line variant (default)
  return (
    <div className={cn("border-b border-brand-border/50", className)}>
      <div className="flex gap-6">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => onChange(tab.id)}
            className={cn(
              "flex items-center gap-2 px-1 py-3 font-medium text-sm transition-all relative",
              activeTab === tab.id
                ? "text-brand-primary"
                : "text-brand-text-light hover:text-brand-text-dark"
            )}
          >
            {tab.icon && <tab.icon className="w-4 h-4" />}
            {tab.label}
            {tab.count !== undefined && (
              <Badge variant={activeTab === tab.id ? "info" : "outline"} size="sm">
                {tab.count}
              </Badge>
            )}
            
            {activeTab === tab.id && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-brand-primary" />
            )}
          </button>
        ))}
      </div>
    </div>
  );
};
