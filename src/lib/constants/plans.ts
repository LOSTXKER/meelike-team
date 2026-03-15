export type SubscriptionPlan =
  | "free"
  | "starter"
  | "pro"
  | "business"
  | "enterprise";

export type StoreLevel = "none" | "basic" | "custom" | "premium";

export type AnalyticsLevel =
  | "basic_today"
  | "overview"
  | "full"
  | "full_export";

export type PaymentHelperLevel = "text" | "qr" | "checklist_schedule" | "csv_batch";

export type HubAccessLevel =
  | "view"
  | "post_recruit"
  | "post_outsource"
  | "priority";

export type SupportLevel =
  | "community"
  | "email"
  | "priority"
  | "sla_dedicated";

export interface PlanFeatures {
  autoCreateJobs: boolean;
  splitReassign: boolean;
  outsource: boolean;
  analytics: AnalyticsLevel;
  exportCsv: boolean;
  paymentHelper: PaymentHelperLevel;
  hub: HubAccessLevel;
  lineNotify: boolean;
  lineMessagingApi: boolean;
  webhook: boolean;
  api: boolean;
  whiteLabel: boolean;
  customDomain: boolean;
  support: SupportLevel;
}

export interface PlanConfig {
  id: SubscriptionPlan;
  name: string;
  price: number;
  /** Infinity for enterprise */
  orderQuota: number;
  teams: number;
  membersPerTeam: number;
  storeLevel: StoreLevel;
  features: PlanFeatures;
  /** Psychological role in popcorn pricing */
  role: "hook" | "decoy" | "target" | "premium" | "power";
  highlight?: boolean;
  badge?: string;
}

export const OVERAGE_FEE = 15; // THB per order over quota

export const PLANS: Record<SubscriptionPlan, PlanConfig> = {
  free: {
    id: "free",
    name: "Free",
    price: 0,
    orderQuota: 10,
    teams: 1,
    membersPerTeam: 5,
    storeLevel: "none",
    role: "hook",
    features: {
      autoCreateJobs: false,
      splitReassign: false,
      outsource: false,
      analytics: "basic_today",
      exportCsv: false,
      paymentHelper: "text",
      hub: "view",
      lineNotify: false,
      lineMessagingApi: false,
      webhook: false,
      api: false,
      whiteLabel: false,
      customDomain: false,
      support: "community",
    },
  },

  starter: {
    id: "starter",
    name: "Starter",
    price: 149,
    orderQuota: 30,
    teams: 2,
    membersPerTeam: 20,
    storeLevel: "basic",
    role: "decoy",
    features: {
      autoCreateJobs: true,
      splitReassign: false,
      outsource: false,
      analytics: "overview",
      exportCsv: false,
      paymentHelper: "qr",
      hub: "post_recruit",
      lineNotify: true,
      lineMessagingApi: false,
      webhook: false,
      api: false,
      whiteLabel: false,
      customDomain: false,
      support: "community",
    },
  },

  pro: {
    id: "pro",
    name: "Pro",
    price: 399,
    orderQuota: 150,
    teams: 5,
    membersPerTeam: 100,
    storeLevel: "custom",
    role: "target",
    highlight: true,
    badge: "ยอดนิยม",
    features: {
      autoCreateJobs: true,
      splitReassign: true,
      outsource: true,
      analytics: "full",
      exportCsv: true,
      paymentHelper: "checklist_schedule",
      hub: "post_outsource",
      lineNotify: true,
      lineMessagingApi: true,
      webhook: true,
      api: false,
      whiteLabel: false,
      customDomain: false,
      support: "email",
    },
  },

  business: {
    id: "business",
    name: "Business",
    price: 799,
    orderQuota: 500,
    teams: 20,
    membersPerTeam: 500,
    storeLevel: "premium",
    role: "premium",
    features: {
      autoCreateJobs: true,
      splitReassign: true,
      outsource: true,
      analytics: "full_export",
      exportCsv: true,
      paymentHelper: "csv_batch",
      hub: "priority",
      lineNotify: true,
      lineMessagingApi: true,
      webhook: true,
      api: true,
      whiteLabel: true,
      customDomain: false,
      support: "priority",
    },
  },

  enterprise: {
    id: "enterprise",
    name: "Enterprise",
    price: 1299,
    orderQuota: Infinity,
    teams: Infinity,
    membersPerTeam: Infinity,
    storeLevel: "premium",
    role: "power",
    badge: "ไม่จำกัด",
    features: {
      autoCreateJobs: true,
      splitReassign: true,
      outsource: true,
      analytics: "full_export",
      exportCsv: true,
      paymentHelper: "csv_batch",
      hub: "priority",
      lineNotify: true,
      lineMessagingApi: true,
      webhook: true,
      api: true,
      whiteLabel: true,
      customDomain: true,
      support: "sla_dedicated",
    },
  },
};

export const PLAN_LIST = Object.values(PLANS);

// ──────────────────────────────────────────────
// SELLER RANK SYSTEM (gamification — cosmetic badges & recognition)
// ──────────────────────────────────────────────

export type SellerRank = "bronze" | "silver" | "gold" | "platinum";

export interface RankConfig {
  name: string;
  minOrders: number;
  color: string;
  icon: string;
  badge: string;
  hubLabel: string;
  benefits: string[];
}

export const RANKS: Record<SellerRank, RankConfig> = {
  bronze: {
    name: "Bronze",
    minOrders: 0,
    color: "#cd7f32",
    icon: "🥉",
    badge: "Bronze Seller",
    hubLabel: "",
    benefits: [
      "Badge Bronze บนโปรไฟล์",
      "เข้าถึงระบบพื้นฐานทั้งหมด",
      "สร้างทีมและรับออเดอร์ได้ไม่จำกัด",
    ],
  },
  silver: {
    name: "Silver",
    minOrders: 100,
    color: "#c0c0c0",
    icon: "🥈",
    badge: "Silver Seller",
    hubLabel: "ร้านค้าแนะนำ",
    benefits: [
      "Badge Silver บนโปรไฟล์และ Hub",
      "ร้านค้าแสดงใน \"ร้านค้าแนะนำ\" ใน Hub",
      "โปรไฟล์โดดเด่นกว่า Bronze",
    ],
  },
  gold: {
    name: "Gold",
    minOrders: 500,
    color: "#ffd700",
    icon: "🥇",
    badge: "Trusted Seller",
    hubLabel: "Trusted Seller",
    benefits: [
      "Badge Gold + ตรา \"Trusted Seller\" บน Store",
      "Priority แสดงผลใน Hub",
      "โปรไฟล์ติด verified badge",
    ],
  },
  platinum: {
    name: "Platinum",
    minOrders: 2000,
    color: "#b0c4de",
    icon: "💎",
    badge: "Top Seller",
    hubLabel: "Top Seller",
    benefits: [
      "Badge Platinum + ตรา \"Top Seller\" พิเศษ",
      "แสดงบนหน้าแรก Hub",
      "Store ติด Top Seller ribbon",
    ],
  },
};

export const RANK_ORDER: SellerRank[] = ["bronze", "silver", "gold", "platinum"];

export function getPlan(plan: SubscriptionPlan): PlanConfig {
  return PLANS[plan];
}

export function getPlanPrice(plan: SubscriptionPlan): number {
  return PLANS[plan].price;
}

export function getOrderQuota(plan: SubscriptionPlan): number {
  return PLANS[plan].orderQuota;
}

export function isUnlimited(plan: SubscriptionPlan): boolean {
  return PLANS[plan].orderQuota === Infinity;
}

export function getStoreLevel(plan: SubscriptionPlan): StoreLevel {
  return PLANS[plan].storeLevel;
}

export function canUseFeature(
  plan: SubscriptionPlan,
  feature: keyof PlanFeatures
): boolean {
  const value = PLANS[plan].features[feature];
  if (typeof value === "boolean") return value;
  // Non-boolean features are always "available" at some level; caller checks the level
  return true;
}

export function getFeatureLevel<K extends keyof PlanFeatures>(
  plan: SubscriptionPlan,
  feature: K
): PlanFeatures[K] {
  return PLANS[plan].features[feature];
}

export function isPlanAtLeast(
  current: SubscriptionPlan,
  minimum: SubscriptionPlan
): boolean {
  const order: SubscriptionPlan[] = [
    "free",
    "starter",
    "pro",
    "business",
    "enterprise",
  ];
  return order.indexOf(current) >= order.indexOf(minimum);
}
