import type { SubscriptionPlan, SellerRank } from "@/types";

// ===== SUBSCRIPTION PLANS =====

export interface PlanConfig {
  id: SubscriptionPlan;
  name: string;
  price: number; // THB per month
  icon: string;
  description: string;
  features: {
    teams: number; // Infinity = unlimited
    admins: number;
    botApi: "meelike" | "meelike_plus_external";
    analytics: "basic" | "pro";
    exportData: boolean;
    webhook: boolean;
    whiteLabel: boolean;
    customDomain: boolean;
    prioritySupport: boolean;
  };
  highlight?: boolean; // For "most popular" badge
}

export const PLANS: Record<SubscriptionPlan, PlanConfig> = {
  free: {
    id: "free",
    name: "Free",
    price: 0,
    icon: "🆓",
    description: "เริ่มต้นใช้งานฟรี",
    features: {
      teams: 2,
      admins: 1,
      botApi: "meelike",
      analytics: "basic",
      exportData: false,
      webhook: false,
      whiteLabel: false,
      customDomain: false,
      prioritySupport: false,
    },
  },
  basic: {
    id: "basic",
    name: "Basic",
    price: 49,
    icon: "🌱",
    description: "สำหรับทีมเล็ก",
    features: {
      teams: 5,
      admins: 2,
      botApi: "meelike",
      analytics: "basic",
      exportData: false,
      webhook: false,
      whiteLabel: false,
      customDomain: false,
      prioritySupport: false,
    },
  },
  pro: {
    id: "pro",
    name: "Pro",
    price: 99,
    icon: "⭐",
    description: "คุ้มค่าที่สุด",
    highlight: true,
    features: {
      teams: 20,
      admins: 5,
      botApi: "meelike_plus_external",
      analytics: "pro",
      exportData: true,
      webhook: true,
      whiteLabel: true,
      customDomain: false,
      prioritySupport: false,
    },
  },
  business: {
    id: "business",
    name: "Business",
    price: 399,
    icon: "🏢",
    description: "สำหรับธุรกิจขนาดใหญ่",
    features: {
      teams: Infinity,
      admins: Infinity,
      botApi: "meelike_plus_external",
      analytics: "pro",
      exportData: true,
      webhook: true,
      whiteLabel: true,
      customDomain: true,
      prioritySupport: true,
    },
  },
};

export const PLAN_ORDER: SubscriptionPlan[] = ["free", "basic", "pro", "business"];

// ===== SELLER RANKS (Platform Fee) =====

export interface RankConfig {
  id: SellerRank;
  name: string;
  icon: string;
  minSpend: number; // Rolling 3-month average
  maxSpend: number;
  feePercent: number; // Platform fee percentage
  color: string;
  description: string;
  benefits: string[];
}

export const RANKS: Record<SellerRank, RankConfig> = {
  bronze: {
    id: "bronze",
    name: "Bronze",
    icon: "🥉",
    minSpend: 0,
    maxSpend: 20000,
    feePercent: 12,
    color: "#CD7F32",
    description: "เริ่มต้น",
    benefits: [
      "ค่าธรรมเนียม 12%",
      "เข้าถึงระบบพื้นฐาน",
    ],
  },
  silver: {
    id: "silver",
    name: "Silver",
    icon: "🥈",
    minSpend: 20000,
    maxSpend: 50000,
    feePercent: 11,
    color: "#C0C0C0",
    description: "ยอดจ้าง ฿20K - ฿50K",
    benefits: [
      "ค่าธรรมเนียมลดเหลือ 11%",
      "แบดจ์ Silver ที่หน้าร้าน",
      "ลำดับแสดงผลสูงขึ้น",
    ],
  },
  gold: {
    id: "gold",
    name: "Gold",
    icon: "🥇",
    minSpend: 50000,
    maxSpend: 150000,
    feePercent: 10,
    color: "#FFD700",
    description: "ยอดจ้าง ฿50K - ฿150K",
    benefits: [
      "ค่าธรรมเนียมลดเหลือ 10%",
      "แบดจ์ Gold ที่หน้าร้าน",
      "รายงาน Analytics ขั้นสูง",
      "ปักหมุดร้านในหมวดหมู่",
    ],
  },
  platinum: {
    id: "platinum",
    name: "Platinum",
    icon: "💎",
    minSpend: 150000,
    maxSpend: Infinity,
    feePercent: 9,
    color: "#E5E4E2",
    description: "ยอดจ้าง > ฿150K",
    benefits: [
      "ค่าธรรมเนียมต่ำสุด 9%",
      "แบดจ์ Platinum ที่หน้าร้าน",
      "ซัพพอร์ตเร่งด่วน (Priority)",
      "แบนเนอร์โปรโมตฟรี 1 ครั้ง/เดือน",
      "เข้าถึงฟีเจอร์ก่อนใคร (Early access)",
    ],
  },
};

export const RANK_ORDER: SellerRank[] = ["bronze", "silver", "gold", "platinum"];

// ===== HELPER FUNCTIONS =====

/**
 * Get the plan config by plan ID
 */
export function getPlanConfig(plan: SubscriptionPlan): PlanConfig {
  return PLANS[plan];
}

/**
 * Get the rank config by rank ID
 */
export function getRankConfig(rank: SellerRank): RankConfig {
  return RANKS[rank];
}

/**
 * Calculate seller rank based on rolling 3-month average spend
 */
export function calculateSellerRank(rollingAvgSpend: number): SellerRank {
  if (rollingAvgSpend >= RANKS.platinum.minSpend) return "platinum";
  if (rollingAvgSpend >= RANKS.gold.minSpend) return "gold";
  if (rollingAvgSpend >= RANKS.silver.minSpend) return "silver";
  return "bronze";
}

/**
 * Calculate platform fee percentage based on rank
 */
export function getPlatformFeePercent(rank: SellerRank): number {
  return RANKS[rank].feePercent;
}

/**
 * Calculate platform fee amount
 */
export function calculatePlatformFee(amount: number, rank: SellerRank): number {
  const feePercent = getPlatformFeePercent(rank);
  return amount * (feePercent / 100);
}

/**
 * Calculate rolling 3-month average
 */
export function calculateRollingAverage(monthlySpend: number[]): number {
  const last3Months = monthlySpend.slice(-3);
  if (last3Months.length === 0) return 0;
  return last3Months.reduce((sum, val) => sum + val, 0) / last3Months.length;
}

/**
 * Get progress to next rank
 */
export function getRankProgress(rollingAvgSpend: number, currentRank: SellerRank): {
  nextRank: SellerRank | null;
  progress: number;
  amountNeeded: number;
} {
  const currentIndex = RANK_ORDER.indexOf(currentRank);
  
  if (currentIndex === RANK_ORDER.length - 1) {
    // Already at highest rank
    return { nextRank: null, progress: 100, amountNeeded: 0 };
  }
  
  const nextRank = RANK_ORDER[currentIndex + 1];
  const nextRankConfig = RANKS[nextRank];
  const currentRankConfig = RANKS[currentRank];
  
  const rangeStart = currentRankConfig.minSpend;
  const rangeEnd = nextRankConfig.minSpend;
  const progress = Math.min(100, ((rollingAvgSpend - rangeStart) / (rangeEnd - rangeStart)) * 100);
  const amountNeeded = Math.max(0, rangeEnd - rollingAvgSpend);
  
  return { nextRank, progress, amountNeeded };
}

/**
 * Check if a feature is available for a plan
 */
export function isPlanFeatureAvailable(
  plan: SubscriptionPlan,
  feature: keyof PlanConfig["features"]
): boolean {
  const config = PLANS[plan];
  const value = config.features[feature];
  
  if (typeof value === "boolean") return value;
  if (typeof value === "number") return value > 0;
  return true;
}

/**
 * Get the limit for a numeric plan feature
 */
export function getPlanLimit(
  plan: SubscriptionPlan,
  feature: "teams" | "admins"
): number {
  return PLANS[plan].features[feature];
}

/**
 * Check if user can use external bot API
 */
export function canUseExternalBotApi(plan: SubscriptionPlan): boolean {
  return PLANS[plan].features.botApi === "meelike_plus_external";
}

/**
 * Format price for display
 */
export function formatPlanPrice(plan: SubscriptionPlan): string {
  const config = PLANS[plan];
  if (config.price === 0) return "ฟรี";
  return `฿${config.price}/เดือน`;
}

/**
 * Format team limit for display
 */
export function formatTeamLimit(plan: SubscriptionPlan): string {
  const limit = PLANS[plan].features.teams;
  return limit === Infinity ? "ไม่จำกัด" : `${limit} ทีม`;
}

/**
 * Format admin limit for display
 */
export function formatAdminLimit(plan: SubscriptionPlan): string {
  const limit = PLANS[plan].features.admins;
  return limit === Infinity ? "ไม่จำกัด" : `${limit} คน`;
}
