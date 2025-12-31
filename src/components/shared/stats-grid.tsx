"use client";

import { cn } from "@/lib/utils";
import { Card } from "@/components/ui";
import { type LucideIcon } from "lucide-react";

export interface StatItem {
  label: string;
  value: string | number;
  icon?: LucideIcon;
  iconColor?: string;
  iconBgColor?: string;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  onClick?: () => void;
}

interface StatsGridProps {
  stats: StatItem[];
  columns?: 2 | 3 | 4;
  className?: string;
}

export function StatsGrid({ stats, columns = 4, className }: StatsGridProps) {
  const gridCols = {
    2: "grid-cols-2",
    3: "grid-cols-3",
    4: "grid-cols-2 lg:grid-cols-4",
  };

  return (
    <div className={cn("grid gap-4", gridCols[columns], className)}>
      {stats.map((stat, index) => (
        <Card
          key={index}
          variant="elevated"
          padding="md"
          className={cn(
            "border-none shadow-md hover:-translate-y-1 transition-all duration-300",
            stat.onClick && "cursor-pointer"
          )}
          onClick={stat.onClick}
        >
          <div className="flex items-center gap-4">
            {stat.icon && (
              <div
                className={cn(
                  "p-3 rounded-xl",
                  stat.iconBgColor || "bg-brand-primary/10"
                )}
              >
                <stat.icon
                  className={cn("w-6 h-6", stat.iconColor || "text-brand-primary")}
                />
              </div>
            )}
            <div className="flex-1 min-w-0">
              <p className="text-2xl font-bold text-brand-text-dark leading-none truncate">
                {stat.value}
              </p>
              <p className="text-sm text-brand-text-light mt-1 truncate">
                {stat.label}
              </p>
              {stat.trend && (
                <p
                  className={cn(
                    "text-xs font-medium mt-1",
                    stat.trend.isPositive ? "text-brand-success" : "text-brand-error"
                  )}
                >
                  {stat.trend.isPositive ? "+" : ""}
                  {stat.trend.value}%
                </p>
              )}
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}

// Compact version for smaller spaces
export function StatsGridCompact({ stats, columns = 3, className }: StatsGridProps) {
  const gridCols = {
    2: "grid-cols-2",
    3: "grid-cols-3",
    4: "grid-cols-4",
  };

  return (
    <div className={cn("grid gap-4", gridCols[columns], className)}>
      {stats.map((stat, index) => (
        <Card
          key={index}
          variant="elevated"
          padding="sm"
          className="text-center border-none shadow-sm"
        >
          {stat.icon && (
            <div
              className={cn(
                "p-2 rounded-full w-fit mx-auto mb-2",
                stat.iconBgColor || "bg-brand-primary/10"
              )}
            >
              <stat.icon
                className={cn("w-5 h-5", stat.iconColor || "text-brand-primary")}
              />
            </div>
          )}
          <p className="text-xl font-bold text-brand-text-dark leading-none">
            {stat.value}
          </p>
          <p className="text-xs text-brand-text-light mt-1">{stat.label}</p>
        </Card>
      ))}
    </div>
  );
}
