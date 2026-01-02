/**
 * Helper Utilities
 * 
 * Miscellaneous helper functions
 */

// ===== ID GENERATION =====

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

export function generateUUID(): string {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

// ===== STATUS & COLORS =====

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

export function getLevelColor(level: string): string {
  const colors: Record<string, string> = {
    Platinum: "bg-purple-100 text-purple-700",
    Gold: "bg-yellow-100 text-yellow-700",
    Silver: "bg-gray-100 text-gray-700",
    Bronze: "bg-orange-100 text-orange-700",
    VIP: "bg-pink-100 text-pink-700",
    New: "bg-blue-100 text-blue-700",
  };
  return colors[level] || "bg-gray-100 text-gray-700";
}

// ===== LEVEL INFO =====

export function getLevelInfo(level: string): {
  icon: string;
  name: string;
  color: string;
  fee: number;
  bonus: number;
} {
  const levels: Record<
    string,
    { icon: string; name: string; color: string; fee: number; bonus: number }
  > = {
    bronze: { icon: "bronze", name: "Bronze", color: "text-amber-600", fee: 10, bonus: 0 },
    silver: { icon: "silver", name: "Silver", color: "text-gray-400", fee: 8, bonus: 2 },
    gold: { icon: "gold", name: "Gold", color: "text-yellow-500", fee: 6, bonus: 5 },
    platinum: { icon: "platinum", name: "Platinum", color: "text-cyan-400", fee: 4, bonus: 8 },
    vip: { icon: "vip", name: "VIP", color: "text-purple-500", fee: 2, bonus: 10 },
  };
  return levels[level] || levels.bronze;
}

// ===== ICON HELPERS =====

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

// ===== LABEL HELPERS =====

export function getJobTypeLabel(type: string): string {
  const labels: Record<string, string> = {
    like: "ไลค์",
    comment: "เม้น",
    follow: "Follow",
    view: "View",
    share: "Share",
  };
  return labels[type] || type;
}

export function getStatusLabel(status: string): string {
  const labels: Record<string, string> = {
    pending: "รอดำเนินการ",
    processing: "กำลังดำเนินการ",
    in_progress: "กำลังดำเนินการ",
    completed: "เสร็จสิ้น",
    cancelled: "ยกเลิก",
    failed: "ล้มเหลว",
    paid: "ชำระแล้ว",
    refunded: "คืนเงินแล้ว",
    approved: "อนุมัติ",
    rejected: "ปฏิเสธ",
    active: "ใช้งาน",
    inactive: "ไม่ใช้งาน",
    banned: "ระงับ",
  };
  return labels[status] || status;
}

// ===== ARRAY HELPERS =====

export function chunk<T>(array: T[], size: number): T[][] {
  const chunks: T[][] = [];
  for (let i = 0; i < array.length; i += size) {
    chunks.push(array.slice(i, i + size));
  }
  return chunks;
}

export function shuffle<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

export function unique<T>(array: T[]): T[] {
  return Array.from(new Set(array));
}

export function groupBy<T>(array: T[], key: keyof T): Record<string, T[]> {
  return array.reduce((groups, item) => {
    const groupKey = String(item[key]);
    if (!groups[groupKey]) {
      groups[groupKey] = [];
    }
    groups[groupKey].push(item);
    return groups;
  }, {} as Record<string, T[]>);
}

// ===== ASYNC HELPERS =====

export function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | null = null;
  
  return function (this: any, ...args: Parameters<T>) {
    if (timeout) clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(this, args), wait);
  };
}

export function throttle<T extends (...args: any[]) => any>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle: boolean;
  
  return function (this: any, ...args: Parameters<T>) {
    if (!inThrottle) {
      func.apply(this, args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
}

// ===== URL HELPERS =====

export function buildQueryString(params: Record<string, any>): string {
  const searchParams = new URLSearchParams();
  
  Object.entries(params).forEach(([key, value]) => {
    if (value !== null && value !== undefined) {
      searchParams.append(key, String(value));
    }
  });
  
  return searchParams.toString();
}

export function parseQueryString(queryString: string): Record<string, string> {
  const params = new URLSearchParams(queryString);
  const result: Record<string, string> = {};
  
  params.forEach((value, key) => {
    result[key] = value;
  });
  
  return result;
}

// ===== HELPERS OBJECT =====

export const helpers = {
  generateId,
  generateOrderNumber,
  generateInviteCode,
  generateUUID,
  getStatusColor,
  getLevelColor,
  getLevelInfo,
  getPlatformIcon,
  getServiceTypeIcon,
  getJobTypeLabel,
  getStatusLabel,
  chunk,
  shuffle,
  unique,
  groupBy,
  sleep,
  debounce,
  throttle,
  buildQueryString,
  parseQueryString,
} as const;
