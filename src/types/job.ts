/**
 * Job Types
 * 
 * Unified Job type - replaces both old Job and TeamJob.
 * Jobs are always associated with a team and optionally linked to orders.
 */

import type { Platform, ServiceType } from "./common";
import type { Worker, WorkerLevel } from "./worker";
import type { TeamReviewTag } from "./team";

// ===== JOB (Unified - replaces TeamJob) =====
export interface Job {
  id: string;
  sellerId: string;
  teamId: string;           // Required - jobs always belong to a team
  
  // Order linkage (optional - jobs can exist without orders)
  orderId?: string;
  orderItemId?: string;     // Link to specific OrderItem
  orderNumber?: string;     // Denormalized for display
  sourceJobId?: string;     // For reassign/transfer from another job
  
  // Service info
  title?: string;
  serviceName: string;      // Required - display name
  type: ServiceType;
  platform: Platform;
  targetUrl: string;
  instructions?: string;    // Instructions for workers
  commentTemplates?: string[];
  
  // Quantity & Pricing
  quantity: number;         // Target quantity (renamed from targetQuantity)
  completedQuantity: number;
  claimedQuantity: number;
  pricePerUnit: number;
  totalPayout: number;      // quantity * pricePerUnit
  
  // Visibility & Requirements
  visibility: "all_members" | "level_required" | "selected";
  allowedWorkerIds?: string[];
  minWorkerLevel?: WorkerLevel;
  minWorkerRating?: number;
  
  // Assignment (optional - for jobs assigned to specific worker)
  assignedWorker?: Worker;
  
  // Status & Timing
  status: "pending" | "in_progress" | "pending_review" | "completed" | "cancelled";
  deadline?: string;
  createdAt: string;
  updatedAt: string;
  submittedAt?: string;
  completedAt?: string;
  cancelledAt?: string;
  cancelReason?: string;
}

// ===== LEGACY ALIAS =====
// For backward compatibility during migration
export type TeamJob = Job;

// ===== JOB CLAIM =====
export interface JobClaim {
  id: string;
  jobId: string;
  workerId: string;
  worker?: Worker;
  workerAccountId: string;
  quantity: number;
  earnAmount: number;
  status: "claimed" | "submitted" | "approved" | "rejected" | "cancelled";
  submittedAt?: string;
  proofUrls?: string[];
  actualQuantity?: number;
  workerNote?: string;
  reviewedAt?: string;
  reviewedBy?: string;
  reviewNote?: string;
  // Seller รีวิว Worker
  sellerRating?: number;
  sellerReview?: string;
  // Worker รีวิว Team
  workerTeamRating?: number;
  workerTeamReview?: string;
  workerTeamReviewTags?: TeamReviewTag[];
  createdAt: string;
  updatedAt: string;
}
