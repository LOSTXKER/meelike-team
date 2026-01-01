import type { Job } from "@/types";

// ===== V1 MOCK JOBS (Legacy - Team Model) =====
export const mockJobs: Job[] = [
  {
    id: "job-1",
    sellerId: "seller-1",
    orderId: "order-1",
    title: "500 ไลค์ FB",
    type: "like",
    platform: "facebook",
    targetUrl: "https://facebook.com/page/xxx",
    targetQuantity: 500,
    pricePerUnit: 0.2,
    requirements: "แอคจริงหน้าคน ไม่เอาโปรไฟล์การ์ตูน\nแคปหลักฐานทุกงาน",
    endsAt: new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString(),
    teamId: "team-1",
    visibility: "all_members",
    status: "in_progress",
    claimedQuantity: 420,
    completedQuantity: 380,
    createdAt: "2024-12-30T07:50:00Z",
    updatedAt: new Date().toISOString(),
  },
  {
    id: "job-2",
    sellerId: "seller-1",
    title: "100 เม้น FB",
    type: "comment",
    platform: "facebook",
    targetUrl: "https://facebook.com/post/yyy",
    targetQuantity: 100,
    pricePerUnit: 0.5,
    commentTemplates: [
      "สินค้าดีมากครับ",
      "แนะนำเลยค่ะ",
      "ชอบมากๆ",
      "ราคาโอเคเลย",
    ],
    requirements: "เม้นให้เป็นธรรมชาติ ไม่ซ้ำกัน",
    endsAt: new Date(Date.now() + 5 * 60 * 60 * 1000).toISOString(),
    teamId: "team-1",
    visibility: "all_members",
    status: "open",
    claimedQuantity: 45,
    completedQuantity: 32,
    createdAt: "2024-12-30T10:00:00Z",
    updatedAt: new Date().toISOString(),
  },
];

// ===== V2 MOCK JOBS (Marketplace Model) =====

export type Platform = 'facebook' | 'instagram' | 'tiktok' | 'twitter';
export type ActionType = 'like' | 'follow' | 'comment' | 'share' | 'view';
export type JobStatus = 'active' | 'paused' | 'completed' | 'cancelled';
export type ClaimStatus = 'claimed' | 'completed' | 'expired' | 'cancelled';

export interface MarketplaceJob {
  id: string;
  employerId: string;
  
  platform: Platform;
  actionType: ActionType;
  targetUrl: string;        // PRIVATE - ซ่อนจาก public/worker ที่ยังไม่รับงาน
  targetId?: string;
  
  totalQuantity: number;
  completedQuantity: number;
  claimedQuantity: number;
  
  pricePerAction: number;
  totalCost: number;
  platformFee: number;
  
  commentText?: string;     // สำหรับงาน comment
  
  status: JobStatus;
  expiresAt?: Date;
  createdAt: Date;
  completedAt?: Date;
}

export interface JobClaim {
  id: string;
  jobId: string;
  workerId: string;
  
  status: ClaimStatus;
  
  claimedAt: Date;
  expiresAt: Date;
  completedAt?: Date;
  
  reward: number;
  paid: boolean;
  paidAt?: Date;
}

// V2 Marketplace Jobs
export const mockMarketplaceJobs: MarketplaceJob[] = [
  {
    id: 'mkt-job-1',
    employerId: 'emp-1',
    
    platform: 'facebook',
    actionType: 'like',
    targetUrl: 'https://facebook.com/mybusiness/posts/123456789',
    targetId: '123456789',
    
    totalQuantity: 500,
    completedQuantity: 423,
    claimedQuantity: 450,
    
    pricePerAction: 0.25,
    totalCost: 125,
    platformFee: 15,
    
    status: 'active',
    expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    createdAt: new Date('2024-01-20T08:00:00'),
  },
  {
    id: 'mkt-job-2',
    employerId: 'emp-1',
    
    platform: 'instagram',
    actionType: 'follow',
    targetUrl: 'https://instagram.com/mybusiness',
    targetId: 'mybusiness',
    
    totalQuantity: 300,
    completedQuantity: 150,
    claimedQuantity: 200,
    
    pricePerAction: 0.35,
    totalCost: 105,
    platformFee: 12.6,
    
    status: 'active',
    expiresAt: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
    createdAt: new Date('2024-01-21T10:00:00'),
  },
  {
    id: 'mkt-job-3',
    employerId: 'emp-2',
    
    platform: 'tiktok',
    actionType: 'like',
    targetUrl: 'https://tiktok.com/@cooluser/video/7890123456',
    targetId: '7890123456',
    
    totalQuantity: 1000,
    completedQuantity: 0,
    claimedQuantity: 50,
    
    pricePerAction: 0.20,
    totalCost: 200,
    platformFee: 24,
    
    status: 'active',
    expiresAt: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000),
    createdAt: new Date('2024-01-22T14:00:00'),
  },
  {
    id: 'mkt-job-4',
    employerId: 'emp-2',
    
    platform: 'twitter',
    actionType: 'follow',
    targetUrl: 'https://twitter.com/mybrand',
    targetId: 'mybrand',
    
    totalQuantity: 200,
    completedQuantity: 200,
    claimedQuantity: 200,
    
    pricePerAction: 0.30,
    totalCost: 60,
    platformFee: 7.2,
    
    status: 'completed',
    createdAt: new Date('2024-01-18T09:00:00'),
    completedAt: new Date('2024-01-20T16:00:00'),
  },
  {
    id: 'mkt-job-5',
    employerId: 'emp-3',
    
    platform: 'facebook',
    actionType: 'comment',
    targetUrl: 'https://facebook.com/newproduct/posts/987654321',
    targetId: '987654321',
    commentText: 'สินค้าดีมากครับ แนะนำเลย!',
    
    totalQuantity: 50,
    completedQuantity: 12,
    claimedQuantity: 25,
    
    pricePerAction: 1.50,
    totalCost: 75,
    platformFee: 9,
    
    status: 'active',
    expiresAt: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
    createdAt: new Date('2024-01-23T11:00:00'),
  },
  {
    id: 'mkt-job-6',
    employerId: 'emp-1',
    
    platform: 'instagram',
    actionType: 'like',
    targetUrl: 'https://instagram.com/p/ABC123xyz',
    targetId: 'ABC123xyz',
    
    totalQuantity: 800,
    completedQuantity: 320,
    claimedQuantity: 400,
    
    pricePerAction: 0.22,
    totalCost: 176,
    platformFee: 21.12,
    
    status: 'active',
    expiresAt: new Date(Date.now() + 6 * 24 * 60 * 60 * 1000),
    createdAt: new Date('2024-01-24T08:30:00'),
  },
];

// V2 Job Claims
export const mockJobClaims: JobClaim[] = [
  {
    id: 'claim-1',
    jobId: 'mkt-job-1',
    workerId: 'worker-1',
    
    status: 'completed',
    
    claimedAt: new Date('2024-01-20T10:00:00'),
    expiresAt: new Date('2024-01-21T10:00:00'),
    completedAt: new Date('2024-01-20T10:05:00'),
    
    reward: 0.25,
    paid: true,
    paidAt: new Date('2024-01-20T10:05:00'),
  },
  {
    id: 'claim-2',
    jobId: 'mkt-job-2',
    workerId: 'worker-1',
    
    status: 'claimed',
    
    claimedAt: new Date('2024-01-24T09:00:00'),
    expiresAt: new Date('2024-01-25T09:00:00'),
    
    reward: 0.35,
    paid: false,
  },
  {
    id: 'claim-3',
    jobId: 'mkt-job-3',
    workerId: 'worker-2',
    
    status: 'claimed',
    
    claimedAt: new Date('2024-01-24T11:00:00'),
    expiresAt: new Date('2024-01-25T11:00:00'),
    
    reward: 0.20,
    paid: false,
  },
];

// ===== V2 Helper Functions =====

// Get public jobs (hide targetUrl)
export interface PublicJob {
  id: string;
  platform: Platform;
  actionType: ActionType;
  totalQuantity: number;
  completedQuantity: number;
  remainingQuantity: number;
  pricePerAction: number;
  status: JobStatus;
  createdAt: Date;
  expiresAt?: Date;
}

export function getPublicJobs(): PublicJob[] {
  return mockMarketplaceJobs
    .filter(job => job.status === 'active')
    .map(job => ({
      id: job.id,
      platform: job.platform,
      actionType: job.actionType,
      totalQuantity: job.totalQuantity,
      completedQuantity: job.completedQuantity,
      remainingQuantity: job.totalQuantity - job.claimedQuantity,
      pricePerAction: job.pricePerAction,
      status: job.status,
      createdAt: job.createdAt,
      expiresAt: job.expiresAt,
    }));
}

// Get jobs for employer (full data)
export function getEmployerJobs(employerId: string): MarketplaceJob[] {
  return mockMarketplaceJobs.filter(job => job.employerId === employerId);
}

// Get claimed job with URL (for Extension)
export function getClaimedJobWithUrl(claimId: string): (MarketplaceJob & { claimId: string }) | null {
  const claim = mockJobClaims.find(c => c.id === claimId);
  if (!claim) return null;
  
  const job = mockMarketplaceJobs.find(j => j.id === claim.jobId);
  if (!job) return null;
  
  return { ...job, claimId: claim.id };
}

// Get worker claims
export function getWorkerClaims(workerId: string): JobClaim[] {
  return mockJobClaims.filter(claim => claim.workerId === workerId);
}
