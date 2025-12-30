// ===== SELLER =====
export interface Seller {
  id: string;
  userId: string;
  displayName: string;
  storeName: string;
  storeSlug: string;
  avatar?: string;
  bio?: string;
  lineId?: string;
  phone?: string;
  email?: string;
  plan: "free" | "starter" | "pro" | "business";
  planExpiresAt?: string;
  balance: number;
  totalOrders: number;
  totalRevenue: number;
  rating: number;
  ratingCount: number;
  storeTheme: StoreTheme;
  customTheme?: StoreThemeConfig;
  isActive: boolean;
  isVerified: boolean;
  createdAt: string;
  updatedAt: string;
}

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
}

export type WorkerLevel = "bronze" | "silver" | "gold" | "platinum" | "vip";

// ===== TEAM =====
export interface Team {
  id: string;
  sellerId: string;
  name: string;
  description?: string;
  avatar?: string;
  rules?: string[];
  inviteCode: string;
  inviteLinkExpiry?: string;
  requireApproval: boolean;
  isPublic: boolean;
  isRecruiting: boolean;
  recruitingMessage?: string;
  memberCount: number;
  activeJobCount: number;
  totalJobsCompleted: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

// ===== TEAM MEMBER =====
export interface TeamMember {
  id: string;
  teamId: string;
  workerId: string;
  worker?: Worker;
  status: "pending" | "active" | "inactive" | "banned";
  role: "member" | "admin";
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

// ===== STORE & SERVICES =====
export type Platform = "facebook" | "instagram" | "tiktok" | "youtube" | "twitter";
export type ServiceType = "like" | "comment" | "follow" | "share" | "view";
export type ServiceMode = "bot" | "human";

export interface StoreService {
  id: string;
  sellerId: string;
  name: string;
  description?: string;
  category: Platform;
  type: ServiceType;
  serviceType: ServiceMode;
  costPrice: number;
  sellPrice: number;
  minQuantity: number;
  maxQuantity: number;
  meelikeServiceId?: string;
  estimatedTime?: string;
  isActive: boolean;
  orderCount: number;
  createdAt: string;
  updatedAt: string;
}

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

// ===== ORDERS =====
export interface Order {
  id: string;
  orderNumber: string;
  sellerId: string;
  customer: {
    name: string;
    contactType: "line" | "facebook" | "phone" | "email";
    contactValue: string;
    note?: string;
  };
  items: OrderItem[];
  subtotal: number;
  discount: number;
  total: number;
  totalCost: number;
  totalProfit: number;
  paymentStatus: "pending" | "paid" | "refunded";
  paymentProof?: string;
  paidAt?: string;
  status: "pending" | "confirmed" | "processing" | "completed" | "cancelled";
  progress: number;
  sellerNote?: string;
  trackingUrl: string;
  createdAt: string;
  updatedAt: string;
  confirmedAt?: string;
  completedAt?: string;
}

export interface OrderItem {
  id: string;
  orderId: string;
  serviceId: string;
  serviceName: string;
  serviceType: ServiceMode;
  platform: Platform;
  type: ServiceType;
  targetUrl: string;
  quantity: number;
  commentTemplates?: string[];
  unitPrice: number;
  subtotal: number;
  costPerUnit: number;
  totalCost: number;
  profit: number;
  profitPercent: number;
  status: "pending" | "processing" | "completed" | "failed" | "cancelled";
  progress: number;
  completedQuantity: number;
  meelikeOrderId?: string;
  jobId?: string;
  startedAt?: string;
  completedAt?: string;
}

export interface OrderTimeline {
  id: string;
  orderId: string;
  event:
    | "created"
    | "paid"
    | "confirmed"
    | "bot_started"
    | "bot_completed"
    | "job_created"
    | "job_progress"
    | "job_completed"
    | "completed"
    | "cancelled";
  itemId?: string;
  message: string;
  createdAt: string;
}

// ===== JOBS =====
export interface Job {
  id: string;
  sellerId: string;
  orderId?: string;
  title?: string;
  type: ServiceType;
  platform: Platform;
  targetUrl: string;
  targetQuantity: number;
  pricePerUnit: number;
  requirements?: string;
  commentTemplates?: string[];
  endsAt?: string;
  teamId: string;
  visibility: "all_members" | "level_required" | "selected";
  allowedWorkerIds?: string[];
  minLevelRequired?: WorkerLevel;
  minWorkerLevel?: WorkerLevel;
  minWorkerRating?: number;
  minWorkerFollowers?: number;
  requireProfilePicture?: boolean;
  status: "open" | "in_progress" | "completed" | "cancelled";
  claimedQuantity: number;
  completedQuantity: number;
  createdAt: string;
  updatedAt: string;
  completedAt?: string;
}

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
  sellerRating?: number;
  sellerReview?: string;
  createdAt: string;
  updatedAt: string;
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

// ===== AUTH =====
export type UserRole = "seller" | "worker";

export interface AuthUser {
  id: string;
  email: string;
  role: UserRole;
  seller?: Seller;
  worker?: Worker;
}


