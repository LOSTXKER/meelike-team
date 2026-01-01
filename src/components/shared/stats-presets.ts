/**
 * Stats Grid Preset Configurations
 * 
 * These presets provide common stats configurations for different contexts.
 * Use with StatsGrid component: <StatsGrid stats={getTeamStats(team)} />
 */

import { 
  Users, 
  ClipboardList, 
  CheckCircle, 
  Star, 
  DollarSign,
  Clock,
  Wallet,
  TrendingUp,
  Package,
  ShoppingCart,
} from "lucide-react";
import type { Team } from "@/types";

export interface StatItem {
  label: string;
  value: string | number;
  icon: typeof Users;
  iconColor: string;
  iconBgColor: string;
  change?: string;
  changeType?: "positive" | "negative" | "neutral";
}

// ===== TEAM STATS =====

/** Get stats for a team dashboard */
export function getTeamStats(team: Team): StatItem[] {
  return [
    {
      label: "สมาชิกทั้งหมด",
      value: team.memberCount,
      icon: Users,
      iconColor: "text-brand-primary",
      iconBgColor: "bg-brand-primary/10",
    },
    {
      label: "งานเปิดอยู่",
      value: team.activeJobCount,
      icon: ClipboardList,
      iconColor: "text-brand-primary",
      iconBgColor: "bg-brand-secondary",
    },
    {
      label: "งานสำเร็จ",
      value: team.totalJobsCompleted.toLocaleString(),
      icon: CheckCircle,
      iconColor: "text-[#1E8E3E]",
      iconBgColor: "bg-[#E6F4EA]",
    },
    {
      label: "Rating",
      value: team.rating.toFixed(1),
      icon: Star,
      iconColor: "text-brand-warning",
      iconBgColor: "bg-brand-warning/10",
    },
  ];
}

/** Get member role stats */
export function getMemberRoleStats(counts: {
  total: number;
  leads: number;
  assistants: number;
  workers: number;
}): StatItem[] {
  return [
    {
      label: "สมาชิกทั้งหมด",
      value: counts.total,
      icon: Users,
      iconColor: "text-brand-primary",
      iconBgColor: "bg-brand-primary/10",
    },
    {
      label: "หัวหน้าทีม",
      value: counts.leads,
      icon: Users,
      iconColor: "text-brand-success",
      iconBgColor: "bg-brand-success/10",
    },
    {
      label: "ผู้ช่วย",
      value: counts.assistants,
      icon: Users,
      iconColor: "text-brand-info",
      iconBgColor: "bg-brand-info/10",
    },
    {
      label: "Worker",
      value: counts.workers,
      icon: Users,
      iconColor: "text-brand-warning",
      iconBgColor: "bg-brand-warning/10",
    },
  ];
}

// ===== JOB STATS =====

/** Get job stats for a team */
export function getJobStats(counts: {
  total: number;
  pending: number;
  inProgress: number;
  pendingReview: number;
  completed: number;
}): StatItem[] {
  return [
    {
      label: "งานทั้งหมด",
      value: counts.total,
      icon: ClipboardList,
      iconColor: "text-brand-primary",
      iconBgColor: "bg-brand-primary/10",
    },
    {
      label: "รอจอง",
      value: counts.pending,
      icon: Clock,
      iconColor: "text-brand-warning",
      iconBgColor: "bg-brand-warning/10",
    },
    {
      label: "กำลังทำ",
      value: counts.inProgress,
      icon: TrendingUp,
      iconColor: "text-brand-info",
      iconBgColor: "bg-brand-info/10",
    },
    {
      label: "รอตรวจสอบ",
      value: counts.pendingReview,
      icon: CheckCircle,
      iconColor: "text-brand-warning",
      iconBgColor: "bg-brand-warning/10",
    },
    {
      label: "เสร็จสิ้น",
      value: counts.completed,
      icon: CheckCircle,
      iconColor: "text-brand-success",
      iconBgColor: "bg-brand-success/10",
    },
  ];
}

// ===== PAYOUT STATS =====

/** Get payout stats */
export function getPayoutStats(data: {
  pendingCount: number;
  pendingAmount: number;
  completedAmount: number;
  totalWorkers: number;
}): StatItem[] {
  return [
    {
      label: "รายการรอจ่าย",
      value: data.pendingCount,
      icon: Clock,
      iconColor: "text-brand-warning",
      iconBgColor: "bg-brand-warning/10",
    },
    {
      label: "ยอดเงินค้างจ่าย",
      value: `฿${data.pendingAmount.toLocaleString()}`,
      icon: Wallet,
      iconColor: "text-brand-error",
      iconBgColor: "bg-brand-error/10",
    },
    {
      label: "จ่ายไปแล้ว",
      value: `฿${data.completedAmount.toLocaleString()}`,
      icon: CheckCircle,
      iconColor: "text-brand-success",
      iconBgColor: "bg-brand-success/10",
    },
    {
      label: "Worker ทั้งหมด",
      value: data.totalWorkers,
      icon: Users,
      iconColor: "text-brand-primary",
      iconBgColor: "bg-brand-primary/10",
    },
  ];
}

// ===== SELLER DASHBOARD STATS =====

/** Get seller dashboard stats */
export function getSellerDashboardStats(data: {
  totalOrders: number;
  pendingOrders: number;
  totalRevenue: number;
  totalWorkers: number;
}): StatItem[] {
  return [
    {
      label: "ออเดอร์ทั้งหมด",
      value: data.totalOrders,
      icon: ShoppingCart,
      iconColor: "text-brand-primary",
      iconBgColor: "bg-brand-primary/10",
    },
    {
      label: "รอดำเนินการ",
      value: data.pendingOrders,
      icon: Clock,
      iconColor: "text-brand-warning",
      iconBgColor: "bg-brand-warning/10",
    },
    {
      label: "รายได้รวม",
      value: `฿${data.totalRevenue.toLocaleString()}`,
      icon: DollarSign,
      iconColor: "text-brand-success",
      iconBgColor: "bg-brand-success/10",
    },
    {
      label: "Workers",
      value: data.totalWorkers,
      icon: Users,
      iconColor: "text-brand-info",
      iconBgColor: "bg-brand-info/10",
    },
  ];
}

// ===== WORKER STATS =====

/** Get worker dashboard stats */
export function getWorkerDashboardStats(data: {
  completedJobs: number;
  pendingEarnings: number;
  totalEarnings: number;
  rating: number;
}): StatItem[] {
  return [
    {
      label: "งานเสร็จ",
      value: data.completedJobs,
      icon: CheckCircle,
      iconColor: "text-brand-success",
      iconBgColor: "bg-brand-success/10",
    },
    {
      label: "รอรับเงิน",
      value: `฿${data.pendingEarnings.toLocaleString()}`,
      icon: Clock,
      iconColor: "text-brand-warning",
      iconBgColor: "bg-brand-warning/10",
    },
    {
      label: "รายได้รวม",
      value: `฿${data.totalEarnings.toLocaleString()}`,
      icon: Wallet,
      iconColor: "text-brand-success",
      iconBgColor: "bg-brand-success/10",
    },
    {
      label: "Rating",
      value: data.rating.toFixed(1),
      icon: Star,
      iconColor: "text-brand-warning",
      iconBgColor: "bg-brand-warning/10",
    },
  ];
}
