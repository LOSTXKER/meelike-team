/**
 * Seller & Store Types
 * 
 * Types related to sellers, stores, and services.
 */

import type {
  SubscriptionPlan,
  SellerRank,
  ContactInfo,
  StoreTheme,
  StoreThemeConfig,
  Platform,
  ServiceType,
  ServiceMode,
} from "./common";


// ===== BASE SELLER/STORE INTERFACE =====
interface BaseSellerStore {
  // Identity
  id: string;
  name: string;
  slug: string;
  avatar?: string;
  description?: string;
  
  // Subscription & Rank
  subscription: SubscriptionPlan;
  sellerRank: SellerRank;
  platformFeePercent: number; // 9-12% based on rank
  rollingAvgSpend: number; // 3-month rolling average spend
  
  // Stats
  rating: number;
  ratingCount: number;
  totalOrders: number;
  totalRevenue: number;
  
  // Theme
  theme: StoreTheme;
  customTheme?: StoreThemeConfig;
  
  // Timestamps
  createdAt: string;
  updatedAt: string;
}

// ===== STORE (Multi-user store entity) =====
export interface Store extends BaseSellerStore {
  ownerId: string;
  contactInfo: ContactInfo;
  walletBalance: number;
  monthlySpendHistory: number[]; // Last 3 months spend
  status: 'active' | 'suspended' | 'deleted';
  totalTeams: number;
  totalAdmins: number;
}

// ===== STORE ROLES & PERMISSIONS =====
export type StoreRole = 'owner' | 'admin';

export type StorePermission =
  | 'store:manage'
  | 'services:manage'
  | 'orders:manage'
  | 'finance:view'
  | 'finance:manage'
  | 'team:view'
  | 'team:create'
  | 'team:delete'
  | 'settings:manage'
  | 'subscription:manage'
  | 'api:manage'
  | 'admin:manage';

export interface StoreUser {
  id: string;
  storeId: string;
  userId: string;
  role: StoreRole;
  permissions: StorePermission[];
  createdAt: string;
}

// ===== SELLER (Individual seller profile) =====
export interface Seller extends BaseSellerStore {
  userId: string;
  displayName: string;
  
  // Contact info
  bio?: string;
  contactInfo?: ContactInfo;
  
  // Subscription - preferred field for Seller (base `subscription` is for Store)
  plan: SubscriptionPlan;
  planExpiresAt?: string;
  
  // Wallet & Stats
  balance: number;
  totalSpentOnWorkers: number;
  
  // Status
  isActive: boolean;
  isVerified: boolean;
  

  // Reference to store (for future multi-seller support)
  storeId?: string;
}

// ===== STORE SERVICE (aligned with Prisma Service model) =====
export interface StoreService {
  id: string;
  sellerId: string;
  name: string;
  description?: string;
  platform: Platform;
  serviceType: ServiceType;
  mode: ServiceMode;
  costPrice?: number;
  workerRate?: number;
  sellPrice: number;
  minQty: number;
  maxQty: number;
  meelikeServiceId?: string;
  estimatedTime?: string;
  isActive: boolean;
  showInStore: boolean;
  orderCount: number;
  createdAt: string;
  updatedAt: string;
}
