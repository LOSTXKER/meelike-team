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
      <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-brand-bg mb-4">
        <Icon className="w-8 h-8 text-brand-text-light" />
      </div>
      <h3 className="text-lg font-medium text-brand-text-dark mb-1">{title}</h3>
      {description && (
        <p className="text-brand-text-light mb-4">{description}</p>
      )}
      {action}
    </div>
  );
}

