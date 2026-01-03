"use client";

import Link from "next/link";
import { cn } from "@/lib/utils";
import { AlertCircle, ArrowRight, CheckCircle, Clock, DollarSign, Eye, type LucideIcon } from "lucide-react";

export interface ActionItem {
  id: string;
  label: string;
  count: number;
  href: string;
  icon?: LucideIcon;
  variant?: "warning" | "info" | "error" | "success";
  description?: string;
}

interface ActionRequiredProps {
  items: ActionItem[];
  className?: string;
  title?: string;
}

const VARIANT_STYLES = {
  warning: {
    bg: "bg-amber-100/80",
    border: "border-amber-300",
    icon: "text-amber-700 bg-amber-200",
    text: "text-amber-800",
    badge: "bg-amber-200 text-amber-800 font-bold",
  },
  info: {
    bg: "bg-blue-100/80",
    border: "border-blue-300",
    icon: "text-blue-700 bg-blue-200",
    text: "text-blue-800",
    badge: "bg-blue-200 text-blue-800 font-bold",
  },
  error: {
    bg: "bg-red-100/80",
    border: "border-red-300",
    icon: "text-red-700 bg-red-200",
    text: "text-red-800",
    badge: "bg-red-200 text-red-800 font-bold",
  },
  success: {
    bg: "bg-emerald-100/80",
    border: "border-emerald-300",
    icon: "text-emerald-700 bg-emerald-200",
    text: "text-emerald-800",
    badge: "bg-emerald-200 text-emerald-800 font-bold",
  },
};

const DEFAULT_ICONS: Record<string, LucideIcon> = {
  warning: AlertCircle,
  info: Clock,
  error: AlertCircle,
  success: CheckCircle,
};

export function ActionRequired({ items, className, title = "ต้องดำเนินการ" }: ActionRequiredProps) {
  // Filter out items with count = 0
  const activeItems = items.filter((item) => item.count > 0);

  if (activeItems.length === 0) {
    return null;
  }

  return (
    <div className={cn("space-y-3", className)}>
      <h3 className="text-sm font-bold text-brand-text-dark flex items-center gap-2">
        <AlertCircle className="w-5 h-5 text-amber-600" />
        {title}
        <span className="text-xs font-semibold text-amber-600 bg-amber-100 px-2 py-0.5 rounded-full">
          {activeItems.length} รายการ
        </span>
      </h3>
      
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {activeItems.map((item) => {
          const variant = item.variant || "warning";
          const styles = VARIANT_STYLES[variant];
          const Icon = item.icon || DEFAULT_ICONS[variant];

          return (
            <Link
              key={item.id}
              href={item.href}
              className={cn(
                "group flex items-center gap-3 p-3 rounded-xl border shadow-sm transition-all",
                styles.bg,
                styles.border,
                "hover:shadow-lg hover:-translate-y-1"
              )}
            >
              <div className={cn("p-2 rounded-lg", styles.icon)}>
                <Icon className="w-4 h-4" />
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className={cn("text-sm font-medium", styles.text)}>
                    {item.label}
                  </span>
                  <span className={cn("text-xs font-bold px-1.5 py-0.5 rounded", styles.badge)}>
                    {item.count}
                  </span>
                </div>
                {item.description && (
                  <p className="text-xs text-brand-text-light truncate mt-0.5">
                    {item.description}
                  </p>
                )}
              </div>
              
              <ArrowRight className={cn(
                "w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity",
                styles.text
              )} />
            </Link>
          );
        })}
      </div>
    </div>
  );
}

// Preset action items for common use cases
export function getSellerActionItems(data: {
  pendingOrders?: number;
  pendingReviews?: number;
  pendingPayouts?: number;
  lowBalance?: boolean;
  balanceAmount?: number;
}): ActionItem[] {
  const items: ActionItem[] = [];

  if (data.pendingOrders && data.pendingOrders > 0) {
    items.push({
      id: "pending-orders",
      label: "ออเดอร์รอดำเนินการ",
      count: data.pendingOrders,
      href: "/seller/orders?status=pending",
      icon: Clock,
      variant: "warning",
    });
  }

  if (data.pendingReviews && data.pendingReviews > 0) {
    items.push({
      id: "pending-reviews",
      label: "งานรอตรวจสอบ",
      count: data.pendingReviews,
      href: "/seller/team",
      icon: Eye,
      variant: "info",
    });
  }

  if (data.pendingPayouts && data.pendingPayouts > 0) {
    items.push({
      id: "pending-payouts",
      label: "รอจ่ายเงินทีม",
      count: data.pendingPayouts,
      href: "/seller/team",
      icon: DollarSign,
      variant: "info",
    });
  }

  if (data.lowBalance && data.balanceAmount !== undefined) {
    items.push({
      id: "low-balance",
      label: "ยอดเงินเหลือน้อย",
      count: 1,
      href: "/seller/finance",
      icon: AlertCircle,
      variant: "error",
      description: `เหลือ ฿${data.balanceAmount.toLocaleString()}`,
    });
  }

  return items;
}
