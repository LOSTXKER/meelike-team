/**
 * Worker Types
 *
 * Types related to workers, their accounts, and jobs.
 * Note: Payout/withdrawal removed — workers receive manual payments from team leaders.
 */

import type { Platform } from "./common";


// ===== WORKER LEVEL =====
export type WorkerLevel = "bronze" | "silver" | "gold" | "platinum" | "vip";

// ===== WORKER =====
export interface Worker {
  id: string;
  userId: string;
  displayName: string;
  avatar?: string;
  bio?: string;
  lineId?: string;
  phone?: string;
  bankCode?: string;
  bankName?: string;
  bankAccount?: string;
  bankAccountName?: string;
  promptPayId?: string;
  totalJobs: number;
  totalEarned: number;
  completionRate: number;
  rating: number;
  ratingCount: number;
  level: WorkerLevel;
  totalJobsCompleted: number;
  pendingBalance: number;
  availableBalance: number;
  /** Total owed by team leaders (informational only — no system withdrawal) */
  totalOwed: number;
  isActive: boolean;
  isBanned: boolean;
  teamIds: string[];
  createdAt: string;
  lastActiveAt: string;


}

// ===== WORKER ACCOUNT =====
export interface WorkerAccount {
  id: string;
  workerId: string;
  platform: Platform;
  username: string;
  profileUrl: string;
  screenshotUrl: string;
  verificationStatus:
    | "pending"
    | "ai_review"
    | "manual_review"
    | "verified"
    | "rejected";
  verifiedAt?: string;
  verifiedBy?: "ai" | "admin";
  aiResult?: {
    passed: boolean;
    confidence: number;
    hasProfilePicture: boolean;
    detectedFollowers?: number;
    usernameMatch: boolean;
    notes: string;
  };
  rejectionReason?: string;
  followers?: number;
  profilePictureExists: boolean;
  accountAge?: string;
  isActive: boolean;
  lastUsedAt?: string;
  jobsCompleted: number;
  createdAt: string;
  updatedAt: string;
}

// ===== WORKER JOB (for worker dashboard) =====
export interface WorkerJob {
  id: string;
  teamId?: string;
  teamName: string;
  serviceName: string;
  platform: Platform;
  type: string;
  targetUrl: string;
  quantity: number;
  completedQuantity: number;
  pricePerUnit: number;
  status: "in_progress" | "pending_review" | "completed";
  deadline?: string;
  submittedAt?: string;
  completedAt?: string;
  earnings?: number;
  instructions?: string;
  earnedSoFar?: number;
  totalEarnings?: number;
  startedAt?: string;
  claimedAt?: string;
  cancelledAt?: string;
  cancelReason?: string;
  teamLogo?: string;
  teamRating?: number;
  teamJobsCompleted?: number;
  orderNumber?: string;
  createdAt?: string;
  updatedAt?: string;
}

// ===== WORKER BANK ACCOUNT =====
export interface WorkerBankAccount {
  id: string;
  workerId: string;
  bankCode: string;
  bankName: string;
  accountNumber: string;
  accountName: string;
  promptpayNumber?: string;
  isDefault: boolean;
  isVerified: boolean;
  createdAt: string;
}

// ===== PAYMENT CONFIRMATION (replaces Payout) =====
export interface WorkerPaymentConfirmation {
  id: string;
  workerId: string;
  sellerId: string;
  sellerName: string;
  amount: number;
  method?: "promptpay" | "bank_transfer";
  slipUrl?: string;
  note?: string;
  periodStart?: string;
  periodEnd?: string;
  confirmedAt?: string;
  createdAt: string;
}
