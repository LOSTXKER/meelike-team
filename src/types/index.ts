// ===== STORE (NEW) =====
export interface Store {
  id: string;
  ownerId: string;
  name: string;
  slug: string;
  avatar?: string;
  description?: string;
  theme: StoreTheme;
  customTheme?: StoreThemeConfig;
  contactInfo: StoreContactInfo;
  walletBalance: number;
  subscription: SubscriptionPlan;
  // Seller Rank (Platform Fee)
  sellerRank: SellerRank;
  platformFeePercent: number; // 9-12% based on rank
  rollingAvgSpend: number; // 3-month rolling average spend
  monthlySpendHistory: number[]; // Last 3 months spend
  // Stats
  status: 'active' | 'suspended' | 'deleted';
  rating: number;
  ratingCount: number;
  totalOrders: number;
  totalRevenue: number;
  totalTeams: number;
  totalAdmins: number;
  createdAt: string;
  updatedAt: string;
}

export interface StoreContactInfo {
  line?: string;
  facebook?: string;
  instagram?: string;
  phone?: string;
  email?: string;
}

export type SubscriptionPlan = 'free' | 'basic' | 'pro' | 'business';
export type SellerRank = 'bronze' | 'silver' | 'gold' | 'platinum';

// ===== STORE ROLES =====
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
  plan: SubscriptionPlan;
  planExpiresAt?: string;
  // Seller Rank (Platform Fee)
  sellerRank: SellerRank;
  platformFeePercent: number;
  rollingAvgSpend: number;
  // Wallet & Stats
  balance: number;
  totalOrders: number;
  totalRevenue: number;
  totalSpentOnWorkers: number;
  rating: number;
  ratingCount: number;
  storeTheme: StoreTheme;
  customTheme?: StoreThemeConfig;
  isActive: boolean;
  isVerified: boolean;
  createdAt: string;
  updatedAt: string;
  // Reference to store
  storeId?: string;
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

// ===== TEAM ROLES =====
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
  showInStore: boolean; // true = แสดงในร้าน, false = บริการลับ
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
  cancelReason?: string;
  cancelledAt?: string;
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

// ===== TEAM JOB =====
export interface TeamJob {
  id: string;
  orderId: string;
  orderNumber: string;
  serviceName: string;
  platform: Platform;
  quantity: number;
  completedQuantity: number;
  pricePerUnit: number;
  totalPayout: number;
  targetUrl: string;
  status: "pending" | "in_progress" | "pending_review" | "completed" | "cancelled";
  assignedWorker?: Worker;
  deadline?: string;
  submittedAt?: string;
  completedAt?: string;
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

// ===== HUB =====
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

export interface OutsourceJob {
  id: string;
  title: string;
  author: {
    name: string;
    avatar: string;
    rating: number;
    verified: boolean;
    totalOutsourced: number;
  };
  description: string;
  platform: string;
  jobType: "like" | "comment" | "follow" | "view" | "share";
  quantity: number;
  budget: number;
  pricePerUnit: number;
  deadline: string;
  targetUrl: string;
  requirements: string[];
  views: number;
  bids: number;
  createdAt: string;
  isUrgent?: boolean;
}

// ===== WORKER JOB (for worker dashboard) =====
export interface WorkerJob {
  id: string;
  teamName: string;
  serviceName: string;
  platform: string;
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
}

// ===== MEELIKE API =====
// บริการจาก MeeLike API (https://api-docs.meelike-th.com/)
export interface MeeLikeService {
  service: string;      // Service ID จาก MeeLike
  name: string;         // ชื่อบริการ
  type: string;         // ประเภท เช่น "Facebook Likes"
  category: string;     // หมวดหมู่ เช่น "Facebook"
  rate: string;         // ราคาต่อ 1000 หน่วย (บาท)
  min: string;          // จำนวนขั้นต่ำ
  max: string;          // จำนวนสูงสุด
  refill: boolean;      // รองรับ Refill หรือไม่
  cancel: boolean;      // ยกเลิกได้หรือไม่
  description?: string; // รายละเอียดเพิ่มเติม
  dripfeed?: boolean;   // รองรับ Drip-feed หรือไม่
  averageTime?: string; // เวลาเฉลี่ยในการส่งมอบ
}

// Request สำหรับ MeeLike API
export interface MeeLikeAPIRequest {
  key: string;
  action: "services" | "add" | "status" | "statuses" | "refill" | "refills" | "refill_status" | "refill_statuses" | "cancel" | "balance";
}

export interface MeeLikeAddOrderRequest extends MeeLikeAPIRequest {
  action: "add";
  service: string;
  link: string;
  quantity: string;
  runs?: string;
  interval?: string;
}

export interface MeeLikeOrderStatusRequest extends MeeLikeAPIRequest {
  action: "status";
  order: string;
}

// Response จาก MeeLike API
export interface MeeLikeAddOrderResponse {
  order: string;        // Order ID
}

export interface MeeLikeOrderStatus {
  charge: string;       // ค่าใช้จ่าย
  start_count: string;  // จำนวนเริ่มต้น
  status: "Pending" | "In progress" | "Completed" | "Partial" | "Canceled" | "Processing";
  remains: string;      // จำนวนที่เหลือ
  currency: string;     // สกุลเงิน
}

export interface MeeLikeBalanceResponse {
  balance: string;      // ยอดเงินคงเหลือ
  currency: string;     // สกุลเงิน
}

// Seller's MeeLike Config
export interface SellerMeeLikeConfig {
  id: string;
  sellerId: string;
  apiKey: string;
  apiKeyMasked: string; // แสดงเฉพาะ 4 ตัวท้าย
  isConnected: boolean;
  balance?: number;
  lastSyncAt?: string;
  createdAt: string;
  updatedAt: string;
}


