/**
 * Common/Shared Types
 * 
 * Base types used across multiple domains.
 */

// ===== SUBSCRIPTION & RANK =====
export type SubscriptionPlan = 'free' | 'basic' | 'pro' | 'business';
export type SellerRank = 'bronze' | 'silver' | 'gold' | 'platinum';

// ===== CONTACT INFO =====
export interface ContactInfo {
  line?: string;
  facebook?: string;
  instagram?: string;
  phone?: string;
  email?: string;
}

// ===== PLATFORM & SERVICE TYPES =====
export type Platform = "facebook" | "instagram" | "tiktok" | "youtube" | "twitter";
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
