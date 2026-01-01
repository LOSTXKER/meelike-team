import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("th-TH", {
    style: "currency",
    currency: "THB",
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(amount);
}

export function formatNumber(num: number): string {
  return new Intl.NumberFormat("th-TH").format(num);
}

export function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString("th-TH", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export function formatDateTime(dateString: string): string {
  return new Date(dateString).toLocaleString("th-TH", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function formatTimeAgo(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (seconds < 60) return "เมื่อสักครู่";
  if (seconds < 3600) return `${Math.floor(seconds / 60)} นาทีที่แล้ว`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)} ชั่วโมงที่แล้ว`;
  if (seconds < 604800) return `${Math.floor(seconds / 86400)} วันที่แล้ว`;
  return formatDate(dateString);
}

export function generateId(): string {
  return Math.random().toString(36).substring(2, 15);
}

export function generateOrderNumber(): string {
  const date = new Date();
  const year = date.getFullYear();
  const random = Math.floor(Math.random() * 1000)
    .toString()
    .padStart(3, "0");
  return `ORD-${year}-${random}`;
}

export function generateInviteCode(prefix: string): string {
  const random = Math.random().toString(36).substring(2, 8).toUpperCase();
  return `${prefix}-${new Date().getFullYear()}-${random}`;
}

export function calculateProgress(completed: number, total: number): number {
  if (total === 0) return 0;
  return Math.round((completed / total) * 100);
}

export function getStatusColor(status: string): string {
  const colors: Record<string, string> = {
    pending: "bg-brand-warning/10 text-brand-text-dark",
    processing: "bg-brand-info/10 text-brand-primary",
    in_progress: "bg-brand-info/10 text-brand-primary",
    completed: "bg-brand-success/10 text-brand-success",
    cancelled: "bg-brand-error/10 text-brand-error",
    failed: "bg-brand-error/10 text-brand-error",
    paid: "bg-brand-success/10 text-brand-success",
    refunded: "bg-brand-warning/10 text-brand-text-dark",
    approved: "bg-brand-success/10 text-brand-success",
    rejected: "bg-brand-error/10 text-brand-error",
    active: "bg-brand-success/10 text-brand-success",
    inactive: "bg-gray-100 text-gray-600",
    banned: "bg-brand-error/10 text-brand-error",
  };
  return colors[status] || "bg-gray-100 text-gray-600";
}

export function getLevelInfo(level: string): { icon: string; name: string; color: string; fee: number; bonus: number } {
  const levels: Record<string, { icon: string; name: string; color: string; fee: number; bonus: number }> = {
    bronze: { icon: "bronze", name: "Bronze", color: "text-amber-600", fee: 10, bonus: 0 },
    silver: { icon: "silver", name: "Silver", color: "text-gray-400", fee: 8, bonus: 2 },
    gold: { icon: "gold", name: "Gold", color: "text-yellow-500", fee: 6, bonus: 5 },
    platinum: { icon: "platinum", name: "Platinum", color: "text-cyan-400", fee: 4, bonus: 8 },
    vip: { icon: "vip", name: "VIP", color: "text-purple-500", fee: 2, bonus: 10 },
  };
  return levels[level] || levels.bronze;
}

export function getPlatformIcon(platform: string): string {
  const icons: Record<string, string> = {
    facebook: "facebook",
    instagram: "instagram",
    tiktok: "tiktok",
    youtube: "youtube",
    twitter: "twitter",
  };
  return icons[platform] || "smartphone";
}

export function getServiceTypeIcon(type: string): string {
  const icons: Record<string, string> = {
    like: "like",
    comment: "comment",
    follow: "follow",
    share: "share",
    view: "view",
  };
  return icons[type] || "list";
}

// Helper function for job type labels
export function getJobTypeLabel(type: string): string {
  const labels: Record<string, string> = {
    like: "ไลค์",
    comment: "เม้น",
    follow: "Follow",
    view: "View",
    share: "Share",
  };
  return labels[type] || type;
}// Helper function for level badge colors
export function getLevelColor(level: string): string {
  const colors: Record<string, string> = {
    Platinum: "bg-purple-100 text-purple-700",
    Gold: "bg-yellow-100 text-yellow-700",
    Silver: "bg-gray-100 text-gray-700",
    Bronze: "bg-orange-100 text-orange-700",
    New: "bg-blue-100 text-blue-700",
  };
  return colors[level] || "bg-gray-100 text-gray-700";
}