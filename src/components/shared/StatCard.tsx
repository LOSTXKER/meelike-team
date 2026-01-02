"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import type { LucideIcon } from "lucide-react";
import { TrendingUp, TrendingDown } from "lucide-react";

interface StatCardProps extends React.HTMLAttributes<HTMLDivElement> {
  label: string;
  value: string | number;
  icon: LucideIcon;
  iconColor?: string;
  iconBgColor?: string;
  trend?: {
    value: number;
    isPositive: boolean;
  };
}

export const StatCard = React.forwardRef<HTMLDivElement, StatCardProps>(
  ({ 
    label, 
    value, 
    icon: Icon, 
    iconColor = "text-brand-primary", 
    iconBgColor = "bg-brand-primary/10", 
    trend, 
    onClick,
    className,
    ...props 
  }, ref) => {
    const isClickable = !!onClick;
    
    return (
      <div
        ref={ref}
        onClick={onClick}
        className={cn(
          "bg-white rounded-2xl p-4 shadow-md border border-transparent transition-all",
          isClickable && "cursor-pointer hover:shadow-lg hover:border-brand-primary/30",
          className
        )}
        {...props}
      >
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-brand-text-light">{label}</span>
          <div className={cn("p-1.5 rounded-full", iconBgColor)}>
            <Icon className={cn("w-5 h-5", iconColor)} />
          </div>
        </div>
        
        <p className="text-2xl font-bold text-brand-text-dark">{value}</p>
        
        {trend && (
          <div className="flex items-center gap-1 mt-1">
            {trend.isPositive ? (
              <TrendingUp className="w-4 h-4 text-brand-success" />
            ) : (
              <TrendingDown className="w-4 h-4 text-brand-error" />
            )}
            <span className={cn(
              "text-sm font-medium",
              trend.isPositive ? "text-brand-success" : "text-brand-error"
            )}>
              {trend.value}%
            </span>
          </div>
        )}
      </div>
    );
  }
);

StatCard.displayName = "StatCard";
