# 📊 Database Schema

## Overview

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                                                                              │
│  📋 ประเภทโปรเจค: Prototype                                                 │
│                                                                              │
│  ใช้ LocalStorage + Mock Data สำหรับ Prototype                              │
│  Schema นี้เป็นแนวทางสำหรับ Backend จริงในอนาคต                             │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 👤 User & Auth

```typescript
// ===== SELLER =====
interface Seller {
  id: string;
  userId: string;
  
  // Profile
  displayName: string;
  storeName: string;
  storeSlug: string;            // URL: /s/[slug]
  avatar?: string;
  bio?: string;
  
  // Contact
  lineId?: string;
  phone?: string;
  email?: string;
  
  // Subscription
  plan: 'free' | 'starter' | 'pro' | 'business';
  planExpiresAt?: string;
  
  // Wallet
  balance: number;
  
  // Stats
  totalOrders: number;
  totalRevenue: number;
  rating: number;
  ratingCount: number;
  
  // Store Theme
  storeTheme: StoreTheme;
  customTheme?: StoreThemeConfig;
  
  // Status
  isActive: boolean;
  isVerified: boolean;
  
  // Timestamps
  createdAt: string;
  updatedAt: string;
}

// ===== WORKER =====
interface Worker {
  id: string;
  userId: string;
  
  // Profile
  displayName: string;
  avatar?: string;
  bio?: string;
  
  // Contact
  lineId?: string;
  phone?: string;
  
  // Bank Info
  bankName?: string;
  bankAccount?: string;
  bankAccountName?: string;
  promptPayId?: string;
  
  // Stats
  totalJobs: number;
  totalEarned: number;
  completionRate: number;
  
  // Rating & Level
  rating: number;
  ratingCount: number;
  level: 'bronze' | 'silver' | 'gold' | 'platinum' | 'vip';
  totalJobsCompleted: number;
  
  // Balance
  pendingBalance: number;
  availableBalance: number;
  
  // Status
  isActive: boolean;
  isBanned: boolean;
  
  // Teams
  teamIds: string[];
  
  // Timestamps
  createdAt: string;
  lastActiveAt: string;
}
```

---

## 👥 Team

```typescript
// ===== TEAM =====
interface Team {
  id: string;
  sellerId: string;
  
  // Team Info
  name: string;
  description?: string;
  avatar?: string;
  
  // Rules
  rules?: string[];
  
  // Invite Settings
  inviteCode: string;
  inviteLinkExpiry?: string;
  requireApproval: boolean;
  
  // Visibility (สำหรับ "ค้นหาทีม")
  isPublic: boolean;
  isRecruiting: boolean;
  recruitingMessage?: string;
  
  // Stats
  memberCount: number;
  activeJobCount: number;
  totalJobsCompleted: number;
  
  // Status
  isActive: boolean;
  
  // Timestamps
  createdAt: string;
  updatedAt: string;
}

// ===== TEAM MEMBER =====
interface TeamMember {
  id: string;
  teamId: string;
  workerId: string;
  
  // Status
  status: 'pending' | 'active' | 'inactive' | 'banned';
  role: 'member' | 'admin';
  
  // Stats (ในทีมนี้)
  jobsCompleted: number;
  totalEarned: number;
  rating: number;
  ratingCount: number;
  
  // Timestamps
  joinedAt: string;
  lastActiveAt: string;
  invitedBy?: string;
}

// ===== TEAM JOIN REQUEST =====
interface TeamJoinRequest {
  id: string;
  teamId: string;
  workerId: string;
  
  // Request Info
  message?: string;
  
  // Status
  status: 'pending' | 'approved' | 'rejected';
  reviewedBy?: string;
  reviewedAt?: string;
  rejectionReason?: string;
  
  // Timestamps
  createdAt: string;
}
```

---

## 🏪 Store & Services

```typescript
// ===== STORE SERVICE =====
interface StoreService {
  id: string;
  sellerId: string;
  
  // Service Info
  name: string;
  description?: string;
  category: 'facebook' | 'instagram' | 'tiktok' | 'youtube' | 'twitter';
  type: 'like' | 'comment' | 'follow' | 'share' | 'view';
  serviceType: 'bot' | 'human';
  
  // Pricing
  costPrice: number;
  sellPrice: number;
  minQuantity: number;
  maxQuantity: number;
  
  // Bot Config
  meelikeServiceId?: string;
  
  // Human Config
  estimatedTime?: string;
  
  // Status
  isActive: boolean;
  
  // Stats
  orderCount: number;
  
  // Timestamps
  createdAt: string;
  updatedAt: string;
}

// ===== STORE THEME =====
type StoreTheme = 
  | 'meelike' | 'ocean' | 'purple' | 'dark' | 'sakura'
  | 'red' | 'green' | 'orange' | 'minimal' | 'custom';

interface StoreThemeConfig {
  theme: StoreTheme;
  customPrimary?: string;
  customSecondary?: string;
  customAccent?: string;
  customBackground?: string;
}
```

---

## 📦 Orders

```typescript
// ===== ORDER =====
interface Order {
  id: string;
  orderNumber: string;        // e.g. "ORD-2024-001"
  
  // Seller
  sellerId: string;
  
  // Customer Info
  customer: {
    name: string;
    contactType: 'line' | 'facebook' | 'phone' | 'email';
    contactValue: string;
    note?: string;
  };
  
  // Order Items (หลายรายการ)
  items: OrderItem[];
  
  // Pricing Summary
  subtotal: number;
  discount: number;
  total: number;
  totalCost: number;
  totalProfit: number;
  
  // Payment
  paymentStatus: 'pending' | 'paid' | 'refunded';
  paymentProof?: string;
  paidAt?: string;
  
  // Status (overall)
  status: 'pending' | 'confirmed' | 'processing' | 'completed' | 'cancelled';
  progress: number;           // 0-100 overall progress
  
  // Notes
  sellerNote?: string;
  
  // Tracking
  trackingUrl: string;        // seller.meelike.com/track/ORD-2024-001
  
  // Timestamps
  createdAt: string;
  updatedAt: string;
  confirmedAt?: string;
  completedAt?: string;
}

// ===== ORDER ITEM =====
interface OrderItem {
  id: string;
  orderId: string;
  
  // Service Info
  serviceId: string;
  serviceName: string;
  serviceType: 'bot' | 'human';
  platform: 'facebook' | 'instagram' | 'tiktok' | 'youtube' | 'twitter';
  type: 'like' | 'comment' | 'follow' | 'share' | 'view';
  
  // Target
  targetUrl: string;
  quantity: number;
  
  // For Comment
  commentTemplates?: string[];
  
  // Pricing
  unitPrice: number;
  subtotal: number;
  
  // Cost (for seller)
  costPerUnit: number;
  totalCost: number;
  profit: number;
  profitPercent: number;
  
  // Progress
  status: 'pending' | 'processing' | 'completed' | 'failed' | 'cancelled';
  progress: number;           // 0-100
  completedQuantity: number;
  
  // Execution
  meelikeOrderId?: string;    // For Bot orders
  jobId?: string;             // For Human orders
  
  // Timestamps
  startedAt?: string;
  completedAt?: string;
}

// ===== ORDER TIMELINE =====
interface OrderTimeline {
  id: string;
  orderId: string;
  
  // Event
  event: 
    | 'created' 
    | 'paid' 
    | 'confirmed' 
    | 'bot_started' 
    | 'bot_completed'
    | 'job_created'
    | 'job_progress'
    | 'job_completed'
    | 'completed'
    | 'cancelled';
  
  // Details
  itemId?: string;
  message: string;
  
  // Timestamp
  createdAt: string;
}
```

---

## 📋 Jobs (Worker Tasks)

```typescript
// ===== JOB =====
interface Job {
  id: string;
  sellerId: string;
  orderId?: string;
  
  // Job Info
  title?: string;
  type: 'like' | 'comment' | 'follow' | 'share' | 'view';
  platform: 'facebook' | 'instagram' | 'tiktok' | 'youtube' | 'twitter';
  
  // Target
  targetUrl: string;
  targetQuantity: number;
  
  // Pricing
  pricePerUnit: number;
  
  // Requirements
  requirements?: string;
  commentTemplates?: string[];
  
  // Schedule
  endsAt?: string;
  
  // Access Control (Team Only)
  teamId: string;
  visibility: 'all_members' | 'level_required' | 'selected';
  allowedWorkerIds?: string[];
  minLevelRequired?: 'bronze' | 'silver' | 'gold' | 'platinum' | 'vip';
  
  // Worker Requirements
  minWorkerLevel?: 'bronze' | 'silver' | 'gold' | 'platinum' | 'vip';
  minWorkerRating?: number;
  minWorkerFollowers?: number;
  requireProfilePicture?: boolean;
  
  // Progress
  status: 'open' | 'in_progress' | 'completed' | 'cancelled';
  claimedQuantity: number;
  completedQuantity: number;
  
  // Timestamps
  createdAt: string;
  updatedAt: string;
  completedAt?: string;
}

// ===== JOB CLAIM =====
interface JobClaim {
  id: string;
  jobId: string;
  workerId: string;
  workerAccountId: string;
  
  // Claim Details
  quantity: number;
  earnAmount: number;
  
  // Status
  status: 'claimed' | 'submitted' | 'approved' | 'rejected' | 'cancelled';
  
  // Submission
  submittedAt?: string;
  proofUrls?: string[];
  actualQuantity?: number;
  workerNote?: string;
  
  // Review (by Seller)
  reviewedAt?: string;
  reviewedBy?: string;
  reviewNote?: string;
  
  // Rating (after approval)
  sellerRating?: number;
  sellerReview?: string;
  
  // Timestamps
  createdAt: string;
  updatedAt: string;
}
```

---

## 📱 Worker Account

```typescript
// ===== WORKER ACCOUNT (บัญชี Social ของ Worker) =====
interface WorkerAccount {
  id: string;
  workerId: string;
  
  // Account Info
  platform: 'facebook' | 'instagram' | 'tiktok' | 'twitter' | 'youtube';
  username: string;
  profileUrl: string;
  
  // Verification
  screenshotUrl: string;
  verificationStatus: 'pending' | 'ai_review' | 'manual_review' | 'verified' | 'rejected';
  verifiedAt?: string;
  verifiedBy?: 'ai' | 'admin';
  
  // AI Result
  aiResult?: {
    passed: boolean;
    confidence: number;
    hasProfilePicture: boolean;
    detectedFollowers?: number;
    usernameMatch: boolean;
    notes: string;
  };
  
  // Rejection
  rejectionReason?: string;
  
  // Stats
  followers?: number;
  profilePictureExists: boolean;
  accountAge?: string;
  
  // Usage
  isActive: boolean;
  lastUsedAt?: string;
  jobsCompleted: number;
  
  // Timestamps
  createdAt: string;
  updatedAt: string;
}
```

---

## 💰 Payout

```typescript
// ===== PAYOUT =====
interface Payout {
  id: string;
  workerId: string;
  
  // Amount
  requestedAmount: number;
  feeAmount: number;
  feePercent: number;
  netAmount: number;
  
  // Method
  method: 'promptpay' | 'bank_transfer';
  promptpayNumber?: string;
  bankCode?: string;
  bankAccountNumber?: string;
  bankAccountName?: string;
  
  // Status
  status: 'pending' | 'approved' | 'processing' | 'completed' | 'rejected' | 'failed';
  
  // Review
  reviewedBy?: string;
  reviewedAt?: string;
  rejectionReason?: string;
  
  // Transfer
  transferredAt?: string;
  bankRefNumber?: string;
  errorMessage?: string;
  
  // Timestamps
  createdAt: string;
  updatedAt: string;
}

// ===== WORKER BANK ACCOUNT =====
interface WorkerBankAccount {
  id: string;
  workerId: string;
  
  // Bank Info
  bankCode: string;
  bankName: string;
  accountNumber: string;
  accountName: string;
  
  // PromptPay
  promptpayNumber?: string;
  
  // Status
  isDefault: boolean;
  isVerified: boolean;
  
  // Timestamps
  createdAt: string;
}
```

---

## 📊 Summary

| Entity | Description |
|--------|-------------|
| `Seller` | ผู้ขาย / แม่ทีม |
| `Worker` | ลูกทีม / คนทำงาน |
| `Team` | ทีมงาน |
| `TeamMember` | สมาชิกทีม |
| `TeamJoinRequest` | คำขอเข้าทีม |
| `StoreService` | บริการในร้าน (Bot/Human) |
| `Order` | ออเดอร์จากลูกค้า |
| `Job` | งานสำหรับ Worker |
| `JobClaim` | การรับงาน |
| `WorkerAccount` | บัญชี Social ของ Worker |
| `Payout` | การถอนเงิน |
| `WorkerBankAccount` | บัญชีธนาคาร Worker |

