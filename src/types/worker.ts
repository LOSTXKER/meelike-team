/**
 * Worker Types
 * 
 * Types related to workers, their accounts, and jobs.
 */

import type { Platform } from "./common";
import type { KYCData } from "./kyc";

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
  isActive: boolean;
  isBanned: boolean;
  teamIds: string[];
  createdAt: string;
  lastActiveAt: string;
  
  // KYC Verification
  kyc?: KYCData;
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

// ===== PAYOUT =====
export interface Payout {
  id: string;
  workerId: string;
  requestedAmount: number;
  feeAmount: number;
  feePercent: number;
  netAmount: number;
  method: "promptpay" | "bank_transfer";
  promptpayNumber?: string;
  bankCode?: string;
  bankAccountNumber?: string;
  bankAccountName?: string;
  status:
    | "pending"
    | "approved"
    | "processing"
    | "completed"
    | "rejected"
    | "failed";
  reviewedBy?: string;
  reviewedAt?: string;
  rejectionReason?: string;
  transferredAt?: string;
  bankRefNumber?: string;
  errorMessage?: string;
  createdAt: string;
  updatedAt: string;
}
