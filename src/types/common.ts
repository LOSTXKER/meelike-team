/**
 * Common/Shared Types
 *
 * Base types used across multiple domains.
 */

// ===== SUBSCRIPTION =====
export type SubscriptionPlan =
  | "free"
  | "starter"
  | "pro"
  | "business"
  | "enterprise";

// Legacy rank type (display only)
export type SellerRank = "bronze" | "silver" | "gold" | "platinum";

// ===== CONTACT INFO =====
export interface ContactInfo {
  line?: string;
  facebook?: string;
  instagram?: string;
  phone?: string;
  email?: string;
}

// ===== PLATFORM & SERVICE TYPES =====
export type Platform =
  | "facebook"
  | "instagram"
  | "tiktok"
  | "youtube"
  | "twitter";
export type ServiceType = "like" | "comment" | "follow" | "share" | "view";
export type ServiceMode = "bot" | "human";

// ===== STORE THEME =====
export type StoreTheme =
  | "meelike"
  | "ocean"
  | "purple"
  | "dark"
  | "sakura"
  | "red"
  | "green"
  | "orange"
  | "minimal"
  | "custom";

export interface StoreThemeConfig {
  theme: StoreTheme;
  customPrimary?: string;
  customSecondary?: string;
  customAccent?: string;
  customBackground?: string;
}

// ===== SUBSCRIPTION & BILLING (NEW) =====
export interface Subscription {
  id: string;
  sellerId: string;
  plan: SubscriptionPlan;
  status: "active" | "expired" | "cancelled" | "trialing";
  startDate: string;
  endDate: string;
  price: number;
  autoRenew: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface OrderUsage {
  id: string;
  sellerId: string;
  month: number;
  year: number;
  ordersUsed: number;
  quotaLimit: number;
  overageCount: number;
}

export interface OverageBill {
  id: string;
  sellerId: string;
  month: number;
  year: number;
  overageOrders: number;
  feePerOrder: number;
  totalAmount: number;
  status: "pending" | "paid" | "waived";
  paidAt?: string;
  createdAt: string;
}

export interface PaymentRecord {
  id: string;
  sellerId: string;
  workerId: string;
  workerName?: string;
  workerPromptPayId?: string;
  amount: number;
  method?: "promptpay" | "bank_transfer";
  status: "pending" | "confirmed";
  slipUrl?: string;
  note?: string;
  confirmedAt?: string;
  periodStart?: string;
  periodEnd?: string;
  createdAt: string;
  updatedAt: string;
}

export interface PaymentSchedule {
  id: string;
  sellerId: string;
  dayOfWeek?: number;
  dayOfMonth?: number;
  isActive: boolean;
  lastRunAt?: string;
  createdAt: string;
  updatedAt: string;
}
