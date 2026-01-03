"use client";

import { cn } from "@/lib/utils";
import type { LucideIcon } from "lucide-react";

interface PageHeaderProps {
  title: string;
  description?: string;
  icon?: LucideIcon;
  iconClassName?: string;
  action?: React.ReactNode;
  className?: string;
  /** Additional badge to show next to title */
  badge?: React.ReactNode;
  /** Show back button */
  showBack?: boolean;
  onBack?: () => void;
}

export function PageHeader({
  title,
  description,
  icon: Icon,
  iconClassName,
  action,
  className,
  badge,
  showBack,
  onBack,
}: PageHeaderProps) {
  return (
    <div className={cn("flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4", className)}>
      <div className="flex items-start gap-3">
        {Icon && (
          <div className="w-10 h-10 rounded-xl bg-brand-primary/10 flex items-center justify-center shrink-0">
            <Icon className={cn("w-5 h-5 text-brand-primary", iconClassName)} />
          </div>
        )}
        <div>
          <div className="flex items-center gap-2 flex-wrap">
            <h1 className="text-2xl font-bold text-brand-text-dark">
              {title}
            </h1>
            {badge}
          </div>
          {description && (
            <p className="text-sm text-brand-text-light mt-1">{description}</p>
          )}
        </div>
      </div>
      {action && <div className="flex-shrink-0">{action}</div>}
    </div>
  );
}

