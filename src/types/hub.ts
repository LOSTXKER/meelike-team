/**
 * Hub Types
 * 
 * Types related to hub posts (recruit, find-team, outsource).
 */

// ===== HUB POST =====
export interface HubPost {
  id: string;
  type: "recruit" | "find-team" | "outsource";
  title: string;
  author: {
    name: string;
    avatar: string;
    rating: number;
    verified: boolean;
    type: "seller" | "worker";
    memberCount?: number;
    totalPaid?: number;
  };
  description: string;
  platforms: string[];
  // Recruit specific
  payRate?: string | { min: number; max: number; unit: string };
  requirements?: string[];
  benefits?: string[];
  memberCount?: number;
  openSlots?: number;
  applicants?: number;
  // Find-team specific
  experience?: string;
  completedJobs?: number;
  expectedPay?: string;
  availability?: string;
  // Outsource specific
  jobType?: string;
  quantity?: number;
  budget?: string;
  deadline?: string;
  // Common
  views: number;
  interested: number;
  createdAt: string;
  isHot?: boolean;
  isUrgent?: boolean;
}

// ===== FIND TEAM POST =====
export interface FindTeamPost {
  id: string;
  title: string;
  author: {
    name: string;
    avatar: string;
    rating: number;
    level: "Platinum" | "Gold" | "Silver" | "Bronze" | "New";
  };
  description: string;
  platforms: string[];
  experience: string;
  completedJobs: number;
  completionRate: number;
  expectedPay: string;
  availability: string;
  skills: string[];
  portfolio: string;
  views: number;
  interested: number;
  createdAt: string;
  isTopWorker?: boolean;
}

// ===== OUTSOURCE JOB =====
export interface OutsourceJob {
  id: string;
  sellerId: string;
  // Link back to Order (optional - for jobs from cancelled team jobs)
  orderId?: string;
  orderItemId?: string;
  sourceJobId?: string; // Original job that was cancelled
  
  title: string;
  author: {
    id: string;
    name: string;
    avatar?: string;
    rating: number;
    verified: boolean;
    totalOutsourced: number;
  };
  description: string;
  platform: string;
  jobType: "like" | "comment" | "follow" | "view" | "share";
  quantity: number;
  completedQuantity: number; // Progress tracking
  budget: number; // Max budget
  suggestedPricePerUnit: number; // Suggested price (teams can bid different)
  deadline: string;
  targetUrl: string;
  requirements: string[];
  
  // Status
  status: "open" | "in_progress" | "completed" | "cancelled";
  acceptedBidId?: string; // Which bid was accepted
  assignedTeamId?: string; // Team that's working on it
  assignedJobId?: string; // The TeamJob created after accepting bid
  
  views: number;
  bidsCount: number;
  createdAt: string;
  updatedAt: string;
  completedAt?: string;
  isUrgent?: boolean;
}

// ===== OUTSOURCE BID =====
export interface OutsourceBid {
  id: string;
  outsourceJobId: string;
  teamId: string;
  team: {
    id: string;
    name: string;
    avatar?: string;
    rating: number;
    ratingCount: number;
    memberCount: number;
    completedJobs: number;
  };
  pricePerUnit: number; // Bid price
  totalPrice: number; // pricePerUnit * quantity
  estimatedDays: number; // How many days to complete
  message?: string; // Message from team
  status: "pending" | "accepted" | "rejected" | "withdrawn";
  createdAt: string;
  updatedAt: string;
  respondedAt?: string; // When seller responded
}
