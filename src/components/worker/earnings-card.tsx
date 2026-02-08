"use client";

import { Card } from "@/components/ui";
import { cn, formatCurrency } from "@/lib/utils";
import type { LucideIcon } from "lucide-react";
import {
  Wallet,
  TrendingUp,
  Clock,
  CheckCircle2,
} from "lucide-react";

interface EarningsCardProps {
  /** Card type determines color scheme */
  type?: "available" | "pending" | "today" | "total";
  /** Custom label */
  label?: string;
  /** Amount in THB */
  amount: number;
  /** Custom icon */
  icon?: LucideIcon;
  /** Additional className */
  className?: string;
  /** Show as compact card */
  compact?: boolean;
}

const typeConfig = {
  available: {
    label: "ยอดถอนได้",
    icon: Wallet,
    color: "text-brand-success",
    bg: "bg-brand-success/10",
  },
  pending: {
    label: "รอตรวจสอบ",
    icon: Clock,
    color: "text-brand-warning",
    bg: "bg-brand-warning/10",
  },
  today: {
    label: "วันนี้",
    icon: TrendingUp,
    color: "text-brand-primary",
    bg: "bg-brand-primary/10",
  },
  total: {
    label: "รายได้ทั้งหมด",
    icon: CheckCircle2,
    color: "text-brand-text-dark",
    bg: "bg-brand-bg",
  },
};

export function EarningsCard({
  type = "available",
  label,
  amount,
  icon,
  className,
  compact = false,
}: EarningsCardProps) {
  const config = typeConfig[type];
  const Icon = icon || config.icon;
  const displayLabel = label || config.label;

  if (compact) {
    return (
      <div className={cn("flex items-center gap-3 p-3 rounded-xl bg-brand-bg/50", className)}>
        <div className={cn("w-8 h-8 rounded-lg flex items-center justify-center", config.bg)}>
          <Icon className={cn("w-4 h-4", config.color)} />
        </div>
        <div>
          <p className="text-xs text-brand-text-light">{displayLabel}</p>
          <p className={cn("font-bold text-sm", config.color)}>{formatCurrency(amount)}</p>
        </div>
      </div>
    );
  }

  return (
    <Card className={cn("border-none shadow-sm", className)}>
      <div className="p-4">
        <div className="flex items-center gap-3 mb-2">
          <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center", config.bg)}>
            <Icon className={cn("w-5 h-5", config.color)} />
          </div>
          <p className="text-sm text-brand-text-light font-medium">{displayLabel}</p>
        </div>
        <p className={cn("text-2xl font-bold", config.color)}>
          {formatCurrency(amount)}
        </p>
      </div>
    </Card>
  );
}
