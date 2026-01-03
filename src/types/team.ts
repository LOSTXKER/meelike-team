/**
 * Team Types
 * 
 * Types related to teams, members, jobs, and payouts.
 */

import type { Platform } from "./common";
import type { Worker, WorkerLevel } from "./worker";

// ===== TEAM ROLES & PERMISSIONS =====
export type TeamRole = 'lead' | 'assistant' | 'worker';

export type TeamPermission =
  | 'dashboard:view'
  | 'members:view'
  | 'members:invite'
  | 'members:remove'
  | 'members:promote'
  | 'jobs:view'
  | 'jobs:create'
  | 'jobs:edit'
  | 'jobs:delete'
  | 'jobs:review'
  | 'payouts:view'
  | 'payouts:approve'
  | 'settings:manage';

export interface AssistantConfig {
  canApprovePayout: boolean;
  canDeleteJob: boolean;
  canRemoveMember: boolean;
}

// ===== TEAM =====
export interface Team {
  id: string;
  sellerId: string;
  storeId?: string;
  name: string;
  description?: string;
  avatar?: string;
  rules?: string[];
  platforms?: Platform[];
  inviteCode: string;
  inviteLinkExpiry?: string;
  requireApproval: boolean;
  isPublic: boolean;
  isRecruiting: boolean;
  recruitingMessage?: string;
  memberCount: number;
  activeJobCount: number;
  totalJobsCompleted: number;
  rating: number;
  ratingCount: number;
  assistantConfig?: AssistantConfig;
  status: 'active' | 'inactive';
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

// ===== TEAM REVIEW (Worker รีวิว Team) =====
export type TeamReviewTag =
  | "pays_fast"        // จ่ายไว
  | "pays_fair"        // จ่ายราคาดี
  | "good_communication" // ติดต่อง่าย
  | "clear_instructions" // อธิบายงานชัดเจน
  | "consistent_work"  // มีงานสม่ำเสมอ
  | "friendly"         // เป็นมิตร
  | "slow_payment"     // จ่ายช้า
  | "unclear_instructions" // อธิบายไม่ชัด
  | "rude";            // ไม่สุภาพ

export interface TeamReview {
  id: string;
  teamId: string;
  workerId: string;
  worker?: Worker;
  jobClaimId?: string;
  rating: number; // 1-5
  review?: string;
  tags?: TeamReviewTag[];
  isAnonymous: boolean;
  createdAt: string;
}

// ===== TEAM MEMBER =====
export interface TeamMember {
  id: string;
  teamId: string;
  workerId: string;
  worker?: Worker;
  status: "pending" | "active" | "inactive" | "banned";
  role: TeamRole;
  permissions?: TeamPermission[];
  jobsCompleted: number;
  totalEarned: number;
  rating: number;
  ratingCount: number;
  joinedAt: string;
  lastActiveAt: string;
  invitedBy?: string;
}

// ===== TEAM JOIN REQUEST =====
export interface TeamJoinRequest {
  id: string;
  teamId: string;
  workerId: string;
  worker?: Worker;
  message?: string;
  status: "pending" | "approved" | "rejected";
  reviewedBy?: string;
  reviewedAt?: string;
  rejectionReason?: string;
  createdAt: string;
}

// ===== TEAM PAYOUT =====
export interface TeamPayout {
  id: string;
  workerId: string;
  worker: Worker;
  amount: number;
  jobCount: number;
  status: "pending" | "completed" | "rejected";
  requestedAt: string;
  completedAt?: string;
  paymentMethod: "promptpay" | "bank";
  paymentAccount: string;
  bankName?: string;
  accountName?: string;
  transactionRef?: string;
}
