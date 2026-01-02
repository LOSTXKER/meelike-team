"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import type { LucideIcon } from "lucide-react";

interface InfoCardProps extends React.HTMLAttributes<HTMLDivElement> {
  icon: LucideIcon;
  iconColor?: string;
  title: string;
  description?: string;
  badge?: React.ReactNode;
  action?: React.ReactNode;
}

export const InfoCard = React.forwardRef<HTMLDivElement, InfoCardProps>(
  ({ 
    icon: Icon, 
    iconColor = "text-brand-primary", 
    title, 
    description, 
    badge, 
    action, 
    onClick,
    className,
    ...props 
  }, ref) => {
    return (
      <div
        ref={ref}
        onClick={onClick}
        className={cn(
          "bg-white rounded-2xl p-5 shadow-sm border border-brand-border/50",
          onClick && "cursor-pointer hover:shadow-md transition-all",
          className
        )}
        {...props}
      >
        <div className="flex items-start gap-3">
          <div className={cn(
            "w-12 h-12 rounded-xl flex items-center justify-center",
            "bg-gradient-to-br from-brand-primary/10 to-brand-primary/5"
          )}>
            <Icon className={cn("w-6 h-6", iconColor)} />
          </div>
          
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <h3 className="font-semibold text-brand-text-dark">{title}</h3>
              {badge}
            </div>
            
            {description && (
              <p className="text-sm text-brand-text-light">{description}</p>
            )}
          </div>
          
          {action}
        </div>
      </div>
    );
  }
);

InfoCard.displayName = "InfoCard";
