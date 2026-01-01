"use client";

import { cn } from "@/lib/utils";
import type { LucideIcon } from "lucide-react";

export interface FilterTab<T extends string> {
  value: T;
  label: string;
  icon?: LucideIcon;
  count?: number;
}

interface FilterTabsProps<T extends string> {
  tabs: FilterTab<T>[];
  value: T;
  onChange: (value: T) => void;
  className?: string;
  /** Show count in parentheses after label */
  showCount?: boolean;
}

export function FilterTabs<T extends string>({
  tabs,
  value,
  onChange,
  className,
  showCount = true,
}: FilterTabsProps<T>) {
  return (
    <div className={cn("w-full lg:w-auto overflow-x-auto no-scrollbar", className)}>
      <div className="flex gap-1 p-1.5 bg-brand-bg/50 rounded-xl border border-brand-border/30 min-w-max">
        {tabs.map((tab) => {
          const isActive = value === tab.value;
          const Icon = tab.icon;
          
          return (
            <button
              key={tab.value}
              onClick={() => onChange(tab.value)}
              className={cn(
                "flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 whitespace-nowrap",
                isActive
                  ? "bg-white text-brand-text-dark shadow-sm ring-1 ring-black/5"
                  : "text-brand-text-light hover:text-brand-text-dark opacity-70 hover:opacity-100"
              )}
            >
              {Icon && (
                <Icon className={cn("w-4 h-4", isActive && "text-brand-primary")} />
              )}
              <span>
                {tab.label}
                {showCount && tab.count !== undefined && ` (${tab.count})`}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

// ===== Preset Tab Configurations =====

import { LayoutGrid, UserCheck, UserX, Clock, CheckCircle, Loader2, XCircle } from "lucide-react";

/** Member status filter tabs */
export type MemberStatus = "all" | "active" | "inactive" | "pending";

export const memberStatusTabs: FilterTab<MemberStatus>[] = [
  { value: "all", label: "ทั้งหมด", icon: LayoutGrid },
  { value: "active", label: "Active", icon: UserCheck },
  { value: "inactive", label: "ไม่ Active", icon: UserX },
  { value: "pending", label: "รอยืนยัน", icon: Clock },
];

/** Job status filter tabs */
export type JobFilterStatus = "all" | "pending" | "in_progress" | "pending_review" | "completed" | "cancelled";

export const jobStatusTabs: FilterTab<JobFilterStatus>[] = [
  { value: "all", label: "ทั้งหมด", icon: LayoutGrid },
  { value: "pending", label: "รอจอง", icon: Clock },
  { value: "in_progress", label: "กำลังทำ", icon: Loader2 },
  { value: "pending_review", label: "รอตรวจ", icon: CheckCircle },
  { value: "completed", label: "เสร็จสิ้น", icon: CheckCircle },
  { value: "cancelled", label: "ยกเลิก", icon: XCircle },
];

/** Payout status filter tabs */
export type PayoutFilterStatus = "all" | "pending" | "completed";

export const payoutStatusTabs: FilterTab<PayoutFilterStatus>[] = [
  { value: "all", label: "ทั้งหมด", icon: LayoutGrid },
  { value: "pending", label: "รอจ่าย", icon: Clock },
  { value: "completed", label: "จ่ายแล้ว", icon: CheckCircle },
];
