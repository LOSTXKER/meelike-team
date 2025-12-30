"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { Card } from "./card";
import { TrendingUp, TrendingDown } from "lucide-react";

interface StatsCardProps {
  title: string;
  value: string | number;
  icon?: React.ReactNode;
  change?: number;
  changeLabel?: string;
  className?: string;
}

const StatsCard: React.FC<StatsCardProps> = ({
  title,
  value,
  icon,
  change,
  changeLabel,
  className,
}) => {
  const isPositive = change !== undefined && change >= 0;

  return (
    <Card variant="bordered" className={cn("", className)}>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-brand-text-light">{title}</p>
          <p className="mt-1 text-2xl font-bold text-brand-text-dark">{value}</p>
          {change !== undefined && (
            <div className="mt-2 flex items-center gap-1">
              {isPositive ? (
                <TrendingUp className="w-4 h-4 text-brand-success" />
              ) : (
                <TrendingDown className="w-4 h-4 text-brand-error" />
              )}
              <span
                className={cn(
                  "text-sm font-medium",
                  isPositive ? "text-brand-success" : "text-brand-error"
                )}
              >
                {isPositive ? "+" : ""}
                {change}%
              </span>
              {changeLabel && (
                <span className="text-sm text-brand-text-light">
                  {changeLabel}
                </span>
              )}
            </div>
          )}
        </div>
        {icon && (
          <div className="p-2 rounded-lg bg-brand-primary/10 text-brand-primary">
            {icon}
          </div>
        )}
      </div>
    </Card>
  );
};

export { StatsCard };


