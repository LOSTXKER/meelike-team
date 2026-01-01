# 📊 Database Schema

> TypeScript Interfaces สำหรับ MeeLike Platform

## 📋 สารบัญ

1. [User & Auth](#user--auth)
2. [Store](#store)
3. [Team](#team)
4. [Service & Order](#service--order)
5. [Job & Claim](#job--claim)
6. [Worker](#worker)
7. [Finance](#finance)
8. [Gamification](#gamification)

---

## User & Auth

```typescript
interface User {
  id: string;
  email: string;
  phone?: string;
  password: string; // hashed
  role: 'seller' | 'worker' | 'admin';
  isVerified: boolean;
  createdAt: Date;
  updatedAt: Date;
}

interface Session {
  id: string;
  userId: string;
  token: string;
  expiresAt: Date;
  createdAt: Date;
}
```

---

## Store

```typescript
type StoreRole = 'owner' | 'admin';

type StorePermission =
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

interface Store {
  id: string;
  ownerId: string;
  name: string;
  slug: string;
  avatar?: string;
  description?: string;
  theme: StoreTheme;
  contactInfo: ContactInfo;
  walletBalance: number;
  subscription: SubscriptionPlan;
  status: 'active' | 'suspended' | 'deleted';
  createdAt: Date;
  updatedAt: Date;
}

interface StoreTheme {
  primaryColor: string;
  backgroundColor: string;
  textColor: string;
}

interface ContactInfo {
  line?: string;
  facebook?: string;
  instagram?: string;
  phone?: string;
  email?: string;
}

interface StoreUser {
  id: string;
  storeId: string;
  userId: string;
  role: StoreRole;
  permissions: StorePermission[];
  createdAt: Date;
}

type SubscriptionPlan = 'free' | 'starter' | 'pro' | 'business';
```

---

## Team

```typescript
type TeamRole = 'lead' | 'assistant' | 'worker';

type TeamPermission =
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

interface Team {
  id: string;
  storeId: string;
  name: string;
  avatar?: string;
  description?: string;
  inviteCode: string;
  isPublic: boolean;
  platforms: Platform[];
  rules: string[];
  assistantConfig: AssistantConfig;
  rating: number;
  ratingCount: number;
  memberCount: number;
  activeJobCount: number;
  status: 'active' | 'inactive';
  createdAt: Date;
  updatedAt: Date;
}

interface AssistantConfig {
  canApprovePayout: boolean;
  canDeleteJob: boolean;
  canRemoveMember: boolean;
}

interface TeamMember {
  id: string;
  teamId: string;
  userId: string;
  role: TeamRole;
  permissions: TeamPermission[];
  joinedAt: Date;
  invitedBy: string;
  totalJobsCompleted: number;
  totalEarnings: number;
  rating: number;
}

type Platform = 
  | 'tiktok' 
  | 'instagram' 
  | 'facebook' 
  | 'youtube' 
  | 'twitter' 
  | 'line' 
  | 'threads';
```

---

## Service & Order

```typescript
type ServiceType = 
  | 'like' 
  | 'follow' 
  | 'view' 
  | 'comment' 
  | 'share' 
  | 'save';

interface Service {
  id: string;
  storeId: string;
  name: string;
  platform: Platform;
  type: ServiceType;
  serviceMode: 'bot' | 'human';
  pricePerUnit: number;
  minQuantity: number;
  maxQuantity: number;
  estimatedDelivery: string; // e.g., "1-2 hours"
  description?: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

type OrderStatus = 'pending' | 'processing' | 'completed' | 'cancelled';

interface Order {
  id: string;
  storeId: string;
  orderNumber: string;
  customerName?: string;
  customerEmail?: string;
  customerLine?: string;
  items: OrderItem[];
  totalAmount: number;
  paymentMethod?: string;
  paymentStatus: 'pending' | 'paid' | 'refunded';
  status: OrderStatus;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
  completedAt?: Date;
}

interface OrderItem {
  id: string;
  orderId: string;
  serviceId: string;
  serviceName: string;
  platform: Platform;
  serviceType: ServiceType;
  serviceMode: 'bot' | 'human';
  targetUrl: string;
  quantity: number;
  pricePerUnit: number;
  totalPrice: number;
  completedQuantity: number;
  status: OrderStatus;
}
```

---

## Job & Claim

```typescript
type JobStatus = 'open' | 'in_progress' | 'completed' | 'cancelled';

interface Job {
  id: string;
  teamId: string;
  orderId?: string;
  orderItemId?: string;
  service: ServiceType;
  platform: Platform;
  targetUrl: string;
  quantity: number;
  claimedQuantity: number;
  completedQuantity: number;
  pricePerUnit: number;
  totalBudget: number;
  deadline: Date;
  requirements?: string;
  isPublic: boolean;
  status: JobStatus;
  createdAt: Date;
  updatedAt: Date;
  completedAt?: Date;
}

type ClaimStatus = 
  | 'active' 
  | 'submitted' 
  | 'approved' 
  | 'rejected' 
  | 'paid';

interface JobClaim {
  id: string;
  jobId: string;
  workerId: string;
  quantity: number;
  completedQuantity: number;
  proof?: string;
  status: ClaimStatus;
  submittedAt?: Date;
  reviewedAt?: Date;
  reviewedBy?: string;
  rejectionReason?: string;
  isPaid: boolean;
  paidAt?: Date;
  earnings: number;
  
  // Worker's team review
  workerTeamRating?: number;
  workerTeamReview?: string;
  hasWorkerReviewedTeam: boolean;
  
  createdAt: Date;
  updatedAt: Date;
}

interface TeamReview {
  id: string;
  teamId: string;
  workerId: string;
  jobClaimId: string;
  rating: number; // 1-5
  review?: string;
  tags: TeamReviewTag[];
  isAnonymous: boolean;
  createdAt: Date;
}

type TeamReviewTag = 
  | 'fast_payment' 
  | 'good_communication' 
  | 'fair_pricing' 
  | 'professional'
  | 'slow_payment' 
  | 'poor_communication' 
  | 'unfair_pricing';
```

---

## Worker

```typescript
interface Worker {
  id: string;
  userId: string;
  displayName: string;
  avatar?: string;
  bio?: string;
  level: WorkerLevel;
  experience: number;
  dailyStreak: number;
  totalJobsCompleted: number;
  totalEarnings: number;
  rating: number;
  ratingCount: number;
  walletBalance: number;
  pendingBalance: number;
  socialAccounts: SocialAccount[];
  achievements: Achievement[];
  referralCode: string;
  referredBy?: string;
  createdAt: Date;
  updatedAt: Date;
}

type WorkerLevel = 'bronze' | 'silver' | 'gold' | 'platinum' | 'vip';

interface SocialAccount {
  id: string;
  workerId: string;
  platform: Platform;
  username: string;
  profileUrl: string;
  isVerified: boolean;
  verifiedAt?: Date;
  createdAt: Date;
}

interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  unlockedAt: Date;
}
```

---

## Finance

```typescript
type TransactionType = 
  | 'topup' 
  | 'order_income' 
  | 'subscription_payment' 
  | 'team_payout'
  | 'withdrawal'
  | 'earning'
  | 'bonus'
  | 'referral';

type TransactionStatus = 'pending' | 'completed' | 'failed' | 'cancelled';

interface Transaction {
  id: string;
  userId: string;
  storeId?: string;
  teamId?: string;
  type: TransactionType;
  amount: number;
  fee: number;
  netAmount: number;
  status: TransactionStatus;
  description: string;
  reference?: string;
  metadata?: Record<string, any>;
  createdAt: Date;
  completedAt?: Date;
}

interface Payout {
  id: string;
  teamId: string;
  workerId: string;
  jobClaimId: string;
  amount: number;
  status: 'pending' | 'approved' | 'paid' | 'rejected';
  approvedBy?: string;
  approvedAt?: Date;
  paidAt?: Date;
  createdAt: Date;
}

interface Withdrawal {
  id: string;
  workerId: string;
  amount: number;
  fee: number;
  netAmount: number;
  method: 'promptpay' | 'bank_transfer' | 'truemoney';
  accountInfo: string;
  status: TransactionStatus;
  processedAt?: Date;
  createdAt: Date;
}
```

---

## Gamification

```typescript
interface LeaderboardEntry {
  id: string;
  workerId: string;
  period: 'daily' | 'weekly' | 'monthly';
  periodStart: Date;
  periodEnd: Date;
  category: 'earnings' | 'jobs' | 'rating';
  value: number;
  rank: number;
  createdAt: Date;
}

interface Referral {
  id: string;
  referrerId: string;
  refereeId: string;
  tier: 1 | 2 | 3;
  totalEarnings: number;
  status: 'active' | 'inactive';
  createdAt: Date;
}

interface ReferralEarning {
  id: string;
  referralId: string;
  referrerId: string;
  refereeId: string;
  tier: 1 | 2 | 3;
  sourceAmount: number;
  commissionRate: number;
  commissionAmount: number;
  createdAt: Date;
}

interface DailyStreak {
  id: string;
  workerId: string;
  date: Date;
  jobsCompleted: number;
  bonusEarned: number;
  createdAt: Date;
}
```

---

## Hub (Community)

```typescript
type HubPostType = 'recruit' | 'find_team' | 'outsource';
type HubPostStatus = 'active' | 'closed' | 'expired';

interface HubPost {
  id: string;
  authorId: string;
  teamId?: string;
  type: HubPostType;
  title: string;
  description: string;
  platforms: Platform[];
  requirements?: string[];
  budget?: {
    min: number;
    max: number;
  };
  deadline?: Date;
  contactInfo: {
    line?: string;
    facebook?: string;
  };
  viewCount: number;
  responseCount: number;
  status: HubPostStatus;
  createdAt: Date;
  updatedAt: Date;
  expiresAt: Date;
}

interface HubResponse {
  id: string;
  postId: string;
  responderId: string;
  message: string;
  createdAt: Date;
}
```

---

## Related Documents

- [TEAM_MANAGEMENT.md](../features/TEAM_MANAGEMENT.md) - Role & Permission Details
- [SELLER_CENTER.md](../features/SELLER_CENTER.md) - Order & Service Logic
- [WORKER_APP.md](../features/WORKER_APP.md) - Worker & Job Logic
