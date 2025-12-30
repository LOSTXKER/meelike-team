"use client";

import { cn } from "@/lib/utils";
import type { LucideIcon } from "lucide-react";
import { Inbox } from "lucide-react";

interface EmptyStateProps {
  icon?: LucideIcon;
  title: string;
  description?: string;
  action?: React.ReactNode;
  className?: string;
}

export function EmptyState({
  icon: Icon = Inbox,
  title,
  description,
  action,
  className,
}: EmptyStateProps) {
  return (
    <div className={cn("text-center py-12", className)}>
      <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-brand-secondary border border-brand-border mb-4 shadow-sm">
        <Icon className="w-8 h-8 text-brand-primary" />
      </div>
      <h3 className="text-lg font-bold text-brand-text-dark mb-1">{title}</h3>
      {description && (
        <p className="text-brand-text-light mb-4 max-w-sm mx-auto">{description}</p>
      )}
      {action}
    </div>
  );
}

