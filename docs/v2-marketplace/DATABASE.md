# Database Schema - Marketplace V2

> Database Schema for Marketplace + Extension Model
>
> **UI Guidelines:** Minimal, Clean, Modern - NO EMOJI, Icons Only (Lucide)

---

## Table of Contents

1. [Overview](#overview)
2. [Core Tables](#core-tables)
3. [TypeScript Interfaces](#typescript-interfaces)
4. [Relationships](#relationships)
5. [Indexes](#indexes)

---

## Overview

### Entity Relationship Diagram

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                                                                              │
│  📊 Entity Relationships:                                                   │
│                                                                              │
│  ┌─────────────┐       ┌─────────────┐       ┌─────────────┐               │
│  │    User     │       │    Job      │       │   Action    │               │
│  │  (Worker/   │──────▶│  (งาน)      │◀──────│  (การทำงาน) │               │
│  │  Employer)  │       │             │       │             │               │
│  └──────┬──────┘       └──────┬──────┘       └─────────────┘               │
│         │                     │                                             │
│         │                     │                                             │
│         ▼                     ▼                                             │
│  ┌─────────────┐       ┌─────────────┐                                     │
│  │   Wallet    │       │  JobClaim   │                                     │
│  │  (กระเป๋า)  │       │ (การรับงาน) │                                     │
│  └──────┬──────┘       └─────────────┘                                     │
│         │                                                                   │
│         ▼                                                                   │
│  ┌─────────────┐                                                           │
│  │ Transaction │                                                           │
│  │ (ธุรกรรม)   │                                                           │
│  └─────────────┘                                                           │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Tables Summary

| Table | Description | Key Fields |
|-------|-------------|------------|
| `users` | ผู้ใช้ทั้ง Worker และ Employer | id, role, email |
| `jobs` | งานที่ Employer โพสต์ | id, employer_id, platform, action_type |
| `job_claims` | Worker รับงาน | id, job_id, worker_id |
| `actions` | Action ที่ Extension track | id, claim_id, verified |
| `wallets` | กระเป๋าเงิน | id, user_id, balance |
| `transactions` | ธุรกรรมทั้งหมด | id, wallet_id, type, amount |
| `withdrawals` | การถอนเงิน | id, user_id, amount, status |

---

## Core Tables

### 1. Users Table

```sql
CREATE TABLE users (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  role            VARCHAR(20) NOT NULL CHECK (role IN ('worker', 'employer')),
  email           VARCHAR(255) NOT NULL UNIQUE,
  password_hash   VARCHAR(255) NOT NULL,
  name            VARCHAR(255) NOT NULL,
  phone           VARCHAR(20),
  avatar_url      VARCHAR(500),
  
  -- Worker specific
  level           VARCHAR(20) DEFAULT 'new' CHECK (level IN ('new', 'bronze', 'silver', 'gold', 'platinum')),
  trust_score     INTEGER DEFAULT 100,
  completed_jobs  INTEGER DEFAULT 0,
  
  -- Bank info (for workers)
  bank_name       VARCHAR(100),
  bank_account    VARCHAR(50),
  bank_account_name VARCHAR(255),
  
  -- Extension tracking
  extension_installed BOOLEAN DEFAULT FALSE,
  extension_version   VARCHAR(20),
  last_extension_ping TIMESTAMP,
  
  -- Metadata
  email_verified  BOOLEAN DEFAULT FALSE,
  phone_verified  BOOLEAN DEFAULT FALSE,
  status          VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'suspended', 'banned')),
  created_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Indexes
CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_level ON users(level) WHERE role = 'worker';
```

### 2. Jobs Table

```sql
CREATE TABLE jobs (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  employer_id     UUID NOT NULL REFERENCES users(id),
  
  -- Job details
  platform        VARCHAR(20) NOT NULL CHECK (platform IN ('facebook', 'instagram', 'tiktok', 'twitter')),
  action_type     VARCHAR(20) NOT NULL CHECK (action_type IN ('like', 'follow', 'comment', 'share', 'view')),
  target_url      VARCHAR(1000) NOT NULL,
  target_url_hash VARCHAR(64), -- SHA256 hash for deduplication
  target_id       VARCHAR(255), -- Post ID, Profile ID, etc.
  
  -- Quantities
  total_quantity  INTEGER NOT NULL,
  completed_quantity INTEGER DEFAULT 0,
  claimed_quantity INTEGER DEFAULT 0,
  
  -- Pricing
  price_per_action DECIMAL(10,2) NOT NULL,
  total_cost      DECIMAL(10,2) NOT NULL,
  platform_fee    DECIMAL(10,2) NOT NULL,
  
  -- Comment specific
  comment_text    TEXT, -- Required comment text (if action_type = 'comment')
  
  -- ⭐ Privacy Settings (URL ถูกซ่อนเสมอ)
  -- URL จะไม่ถูกส่งไปยัง:
  -- - Public (ไม่ login)
  -- - Worker ที่ยังไม่รับงาน
  -- - Worker ที่รับงานแล้ว (เห็นเฉพาะผ่าน Extension)
  
  -- Status
  status          VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'paused', 'completed', 'cancelled')),
  
  -- Timing
  expires_at      TIMESTAMP,
  created_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  completed_at    TIMESTAMP,
  
  -- Metadata
  metadata        JSONB DEFAULT '{}'
);

-- Indexes
CREATE INDEX idx_jobs_employer ON jobs(employer_id);
CREATE INDEX idx_jobs_platform ON jobs(platform);
CREATE INDEX idx_jobs_status ON jobs(status);
CREATE INDEX idx_jobs_created ON jobs(created_at DESC);
CREATE INDEX idx_jobs_active ON jobs(status, platform) WHERE status = 'active';
CREATE INDEX idx_jobs_url_hash ON jobs(target_url_hash);
```

### 3. Job Claims Table

```sql
CREATE TABLE job_claims (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  job_id          UUID NOT NULL REFERENCES jobs(id),
  worker_id       UUID NOT NULL REFERENCES users(id),
  
  -- Status
  status          VARCHAR(20) DEFAULT 'claimed' CHECK (status IN ('claimed', 'completed', 'expired', 'cancelled')),
  
  -- Timing
  claimed_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  expires_at      TIMESTAMP NOT NULL, -- Usually claimed_at + 24 hours
  completed_at    TIMESTAMP,
  
  -- Payment
  reward          DECIMAL(10,2) NOT NULL,
  paid            BOOLEAN DEFAULT FALSE,
  paid_at         TIMESTAMP,
  
  UNIQUE(job_id, worker_id) -- One claim per worker per job
);

-- Indexes
CREATE INDEX idx_claims_job ON job_claims(job_id);
CREATE INDEX idx_claims_worker ON job_claims(worker_id);
CREATE INDEX idx_claims_status ON job_claims(status);
CREATE INDEX idx_claims_worker_active ON job_claims(worker_id, status) WHERE status = 'claimed';
```

### 4. Actions Table (Extension Tracking)

```sql
CREATE TABLE actions (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  claim_id        UUID NOT NULL REFERENCES job_claims(id),
  worker_id       UUID NOT NULL REFERENCES users(id),
  job_id          UUID NOT NULL REFERENCES jobs(id),
  
  -- Action details
  action_type     VARCHAR(20) NOT NULL,
  platform        VARCHAR(20) NOT NULL,
  target_url      VARCHAR(1000) NOT NULL,
  target_id       VARCHAR(255),
  
  -- ⭐ State Change (ป้องกัน Like/Follow ซ้ำ)
  state_before    VARCHAR(50),               -- 'Like', 'Follow' (ก่อนกด)
  state_after     VARCHAR(50),               -- 'Unlike', 'Following' (หลังกด)
  
  -- Screenshot (Anti-Unlike System)
  screenshot_url  VARCHAR(500),              -- S3/CloudFlare R2 URL
  screenshot_hash VARCHAR(64),               -- SHA256 for deduplication
  
  -- Verification
  verified        BOOLEAN DEFAULT FALSE,
  verification_method VARCHAR(50),           -- 'dom_check', 'ai_verify', 'manual'
  verification_data JSONB DEFAULT '{}',
  
  -- AI Verification (if used)
  ai_verified     BOOLEAN,
  ai_confidence   DECIMAL(3,2),              -- 0.00 - 1.00
  ai_model        VARCHAR(50),               -- 'gemini-flash', 'gpt-4-vision'
  ai_response     JSONB,                     -- Full AI response
  
  -- Extension metadata
  browser_fingerprint VARCHAR(255),
  extension_version VARCHAR(20),
  dom_state       JSONB,                     -- State of DOM when action was taken
  
  -- Timing
  created_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  verified_at     TIMESTAMP,
  
  -- Anti-cheat
  suspicious      BOOLEAN DEFAULT FALSE,
  suspicious_reason VARCHAR(255),
  
  -- ⭐ Constraint: ต้องมี State Change ที่ถูกต้อง
  CONSTRAINT valid_state_change CHECK (
    (state_before IS NOT NULL AND state_after IS NOT NULL) OR verified = FALSE
  )
);

-- Indexes
CREATE INDEX idx_actions_claim ON actions(claim_id);
CREATE INDEX idx_actions_worker ON actions(worker_id);
CREATE INDEX idx_actions_job ON actions(job_id);
CREATE INDEX idx_actions_verified ON actions(verified);
CREATE INDEX idx_actions_created ON actions(created_at DESC);
```

### 5. Wallets Table

```sql
CREATE TABLE wallets (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id         UUID NOT NULL UNIQUE REFERENCES users(id),
  
  -- Balance
  balance         DECIMAL(12,2) DEFAULT 0,
  pending_balance DECIMAL(12,2) DEFAULT 0, -- For workers: earnings not yet withdrawable
  
  -- Totals
  total_deposited DECIMAL(12,2) DEFAULT 0, -- Employer
  total_spent     DECIMAL(12,2) DEFAULT 0, -- Employer
  total_earned    DECIMAL(12,2) DEFAULT 0, -- Worker
  total_withdrawn DECIMAL(12,2) DEFAULT 0, -- Worker
  
  created_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Index
CREATE INDEX idx_wallets_user ON wallets(user_id);
```

### 6. Transactions Table

```sql
CREATE TABLE transactions (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  wallet_id       UUID NOT NULL REFERENCES wallets(id),
  user_id         UUID NOT NULL REFERENCES users(id),
  
  -- Transaction details
  type            VARCHAR(30) NOT NULL CHECK (type IN (
    'deposit',           -- Employer เติมเงิน
    'job_payment',       -- Employer จ่ายค่างาน
    'job_fee',           -- Platform fee จาก job
    'earning',           -- Worker ได้เงินจากงาน
    'withdrawal',        -- Worker ถอนเงิน
    'withdrawal_fee',    -- ค่าธรรมเนียมถอน
    'refund',            -- คืนเงิน
    'adjustment'         -- ปรับยอด manual
  )),
  
  amount          DECIMAL(12,2) NOT NULL,
  balance_before  DECIMAL(12,2) NOT NULL,
  balance_after   DECIMAL(12,2) NOT NULL,
  
  -- References
  reference_type  VARCHAR(50), -- 'job', 'withdrawal', 'deposit', etc.
  reference_id    UUID,
  
  -- Description
  description     VARCHAR(500),
  
  -- Metadata
  metadata        JSONB DEFAULT '{}',
  created_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Indexes
CREATE INDEX idx_transactions_wallet ON transactions(wallet_id);
CREATE INDEX idx_transactions_user ON transactions(user_id);
CREATE INDEX idx_transactions_type ON transactions(type);
CREATE INDEX idx_transactions_created ON transactions(created_at DESC);
CREATE INDEX idx_transactions_reference ON transactions(reference_type, reference_id);
```

### 7. Withdrawals Table

```sql
CREATE TABLE withdrawals (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id         UUID NOT NULL REFERENCES users(id),
  wallet_id       UUID NOT NULL REFERENCES wallets(id),
  
  -- Amount
  amount          DECIMAL(12,2) NOT NULL,
  fee             DECIMAL(12,2) NOT NULL,
  net_amount      DECIMAL(12,2) NOT NULL, -- amount - fee
  
  -- Bank details (snapshot)
  bank_name       VARCHAR(100) NOT NULL,
  bank_account    VARCHAR(50) NOT NULL,
  bank_account_name VARCHAR(255) NOT NULL,
  
  -- Status
  status          VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'completed', 'failed', 'cancelled')),
  
  -- Processing
  processed_at    TIMESTAMP,
  processed_by    UUID REFERENCES users(id), -- Admin who processed
  transfer_ref    VARCHAR(255), -- Bank transfer reference
  
  -- Failure
  failure_reason  VARCHAR(500),
  
  created_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Indexes
CREATE INDEX idx_withdrawals_user ON withdrawals(user_id);
CREATE INDEX idx_withdrawals_status ON withdrawals(status);
CREATE INDEX idx_withdrawals_created ON withdrawals(created_at DESC);
```

### 8. Deposits Table

```sql
CREATE TABLE deposits (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id         UUID NOT NULL REFERENCES users(id),
  wallet_id       UUID NOT NULL REFERENCES wallets(id),
  
  -- Amount
  amount          DECIMAL(12,2) NOT NULL,
  
  -- Payment method
  payment_method  VARCHAR(50) NOT NULL CHECK (payment_method IN ('promptpay', 'bank_transfer', 'credit_card')),
  payment_ref     VARCHAR(255), -- Reference from payment gateway
  
  -- Status
  status          VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'failed', 'expired')),
  
  -- Timing
  expires_at      TIMESTAMP, -- QR code expiry
  completed_at    TIMESTAMP,
  
  -- Metadata
  metadata        JSONB DEFAULT '{}',
  created_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Indexes
CREATE INDEX idx_deposits_user ON deposits(user_id);
CREATE INDEX idx_deposits_status ON deposits(status);
CREATE INDEX idx_deposits_payment_ref ON deposits(payment_ref);
```

### 9. Unlike Reports Table

```sql
CREATE TABLE unlike_reports (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  worker_id       UUID NOT NULL REFERENCES users(id),
  job_id          UUID NOT NULL REFERENCES jobs(id),
  claim_id        UUID NOT NULL REFERENCES job_claims(id),
  
  -- Detection info
  detected_by     VARCHAR(50) NOT NULL CHECK (detected_by IN ('extension', 'spot_check', 'scheduled', 'manual')),
  detected_at     TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  
  -- Penalty applied
  penalty_type    VARCHAR(50) CHECK (penalty_type IN ('warning', 'ban_3d', 'ban_7d', 'ban_permanent')),
  amount_deducted DECIMAL(10,2) DEFAULT 0,
  score_deducted  INTEGER DEFAULT 0,
  
  -- Status
  status          VARCHAR(20) DEFAULT 'confirmed' CHECK (status IN ('reported', 'confirmed', 'disputed', 'resolved')),
  dispute_reason  TEXT,
  resolved_at     TIMESTAMP,
  resolved_by     UUID REFERENCES users(id),
  
  created_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Indexes
CREATE INDEX idx_unlike_worker ON unlike_reports(worker_id);
CREATE INDEX idx_unlike_job ON unlike_reports(job_id);
CREATE INDEX idx_unlike_status ON unlike_reports(status);
CREATE INDEX idx_unlike_detected ON unlike_reports(detected_at DESC);
```

### 10. Hold Payments Table

```sql
CREATE TABLE hold_payments (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  worker_id       UUID NOT NULL REFERENCES users(id),
  claim_id        UUID NOT NULL REFERENCES job_claims(id),
  job_id          UUID NOT NULL REFERENCES jobs(id),
  
  -- Amount
  hold_amount     DECIMAL(10,2) NOT NULL,
  
  -- Schedule
  release_at      TIMESTAMP NOT NULL,
  
  -- Status
  status          VARCHAR(20) DEFAULT 'holding' CHECK (status IN ('holding', 'released', 'revoked')),
  
  -- Resolution
  released_at     TIMESTAMP,
  revoked_at      TIMESTAMP,
  revoke_reason   VARCHAR(255), -- 'unlike_detected', 'fraud', 'admin'
  
  created_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Indexes
CREATE INDEX idx_hold_worker ON hold_payments(worker_id);
CREATE INDEX idx_hold_status ON hold_payments(status);
CREATE INDEX idx_hold_release ON hold_payments(release_at) WHERE status = 'holding';
```

---

## TypeScript Interfaces

```typescript
// types/database.ts

// ============ ENUMS ============

export type UserRole = 'worker' | 'employer';

export type WorkerLevel = 'new' | 'bronze' | 'silver' | 'gold' | 'platinum';

export type UserStatus = 'active' | 'suspended' | 'banned';

export type Platform = 'facebook' | 'instagram' | 'tiktok' | 'twitter';

export type ActionType = 'like' | 'follow' | 'comment' | 'share' | 'view';

export type JobStatus = 'active' | 'paused' | 'completed' | 'cancelled';

export type ClaimStatus = 'claimed' | 'completed' | 'expired' | 'cancelled';

export type TransactionType = 
  | 'deposit'
  | 'job_payment'
  | 'job_fee'
  | 'earning'
  | 'withdrawal'
  | 'withdrawal_fee'
  | 'refund'
  | 'adjustment';

export type WithdrawalStatus = 'pending' | 'processing' | 'completed' | 'failed' | 'cancelled';

export type DepositStatus = 'pending' | 'completed' | 'failed' | 'expired';

export type PaymentMethod = 'promptpay' | 'bank_transfer' | 'credit_card';

// ============ INTERFACES ============

export interface User {
  id: string;
  role: UserRole;
  email: string;
  name: string;
  phone?: string;
  avatarUrl?: string;
  
  // Worker specific
  level?: WorkerLevel;
  trustScore?: number;
  completedJobs?: number;
  
  // Bank info
  bankName?: string;
  bankAccount?: string;
  bankAccountName?: string;
  
  // Extension
  extensionInstalled?: boolean;
  extensionVersion?: string;
  lastExtensionPing?: Date;
  
  // Status
  emailVerified: boolean;
  phoneVerified: boolean;
  status: UserStatus;
  
  createdAt: Date;
  updatedAt: Date;
}

export interface Job {
  id: string;
  employerId: string;
  
  platform: Platform;
  actionType: ActionType;
  targetUrl: string;        // ⭐ PRIVATE - ไม่ส่งไป client ยกเว้น employer เจ้าของ
  targetUrlHash?: string;   // For deduplication
  targetId?: string;
  
  totalQuantity: number;
  completedQuantity: number;
  claimedQuantity: number;
  
  pricePerAction: number;
  totalCost: number;
  platformFee: number;
  
  commentText?: string;
  
  status: JobStatus;
  expiresAt?: Date;
  createdAt: Date;
  completedAt?: Date;
  
  metadata?: Record<string, any>;
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

export interface Action {
  id: string;
  claimId: string;
  workerId: string;
  jobId: string;
  
  actionType: ActionType;
  platform: Platform;
  targetUrl: string;
  targetId?: string;
  
  // ⭐ State Change (ป้องกัน Like/Follow ซ้ำ)
  stateBefore?: string;  // 'Like', 'Follow' (ก่อนกด)
  stateAfter?: string;   // 'Unlike', 'Following' (หลังกด)
  
  // Screenshot
  screenshotUrl?: string;
  screenshotHash?: string;
  
  // Verification
  verified: boolean;
  verificationMethod?: string;
  verificationData?: Record<string, any>;
  
  // AI Verification
  aiVerified?: boolean;
  aiConfidence?: number;
  aiModel?: string;
  aiResponse?: Record<string, any>;
  
  browserFingerprint?: string;
  extensionVersion?: string;
  domState?: Record<string, any>;
  
  createdAt: Date;
  verifiedAt?: Date;
  
  suspicious: boolean;
  suspiciousReason?: string;
}

export interface Wallet {
  id: string;
  userId: string;
  
  balance: number;
  pendingBalance: number;
  
  totalDeposited: number;
  totalSpent: number;
  totalEarned: number;
  totalWithdrawn: number;
  
  createdAt: Date;
  updatedAt: Date;
}

export interface Transaction {
  id: string;
  walletId: string;
  userId: string;
  
  type: TransactionType;
  amount: number;
  balanceBefore: number;
  balanceAfter: number;
  
  referenceType?: string;
  referenceId?: string;
  
  description?: string;
  metadata?: Record<string, any>;
  
  createdAt: Date;
}

export interface Withdrawal {
  id: string;
  userId: string;
  walletId: string;
  
  amount: number;
  fee: number;
  netAmount: number;
  
  bankName: string;
  bankAccount: string;
  bankAccountName: string;
  
  status: WithdrawalStatus;
  
  processedAt?: Date;
  processedBy?: string;
  transferRef?: string;
  
  failureReason?: string;
  
  createdAt: Date;
  updatedAt: Date;
}

export interface Deposit {
  id: string;
  userId: string;
  walletId: string;
  
  amount: number;
  
  paymentMethod: PaymentMethod;
  paymentRef?: string;
  
  status: DepositStatus;
  
  expiresAt?: Date;
  completedAt?: Date;
  
  metadata?: Record<string, any>;
  createdAt: Date;
}

// Unlike Report Types
type DetectionMethod = 'extension' | 'spot_check' | 'scheduled' | 'manual';
type PenaltyType = 'warning' | 'ban_3d' | 'ban_7d' | 'ban_permanent';
type UnlikeReportStatus = 'reported' | 'confirmed' | 'disputed' | 'resolved';

export interface UnlikeReport {
  id: string;
  workerId: string;
  jobId: string;
  claimId: string;
  
  detectedBy: DetectionMethod;
  detectedAt: Date;
  
  penaltyType?: PenaltyType;
  amountDeducted: number;
  scoreDeducted: number;
  
  status: UnlikeReportStatus;
  disputeReason?: string;
  resolvedAt?: Date;
  resolvedBy?: string;
  
  createdAt: Date;
}

// Hold Payment Types
type HoldStatus = 'holding' | 'released' | 'revoked';

export interface HoldPayment {
  id: string;
  workerId: string;
  claimId: string;
  jobId: string;
  
  holdAmount: number;
  releaseAt: Date;
  
  status: HoldStatus;
  
  releasedAt?: Date;
  revokedAt?: Date;
  revokeReason?: string;
  
  createdAt: Date;
}

// ============ API RESPONSES ============

// ⭐ Public Job (ไม่มี URL - สำหรับ Public Marketplace)
export interface PublicJob {
  id: string;
  platform: Platform;
  actionType: ActionType;
  // targetUrl ถูกซ่อน!
  
  totalQuantity: number;
  completedQuantity: number;
  remainingQuantity: number;
  
  pricePerAction: number;
  
  status: JobStatus;
  createdAt: Date;
}

// ⭐ Worker Job (ไม่มี URL - สำหรับ Worker ที่ยังไม่รับงาน)
export interface WorkerBrowseJob extends PublicJob {
  // ยังไม่มี URL
  // เห็นข้อมูลเพิ่มเติม
  expiresAt?: Date;
  commentText?: string; // ถ้าเป็นงาน comment
}

// ⭐ Claimed Job (มี URL - สำหรับ Worker ที่รับงานแล้ว, ส่งไป Extension เท่านั้น)
export interface ClaimedJob extends WorkerBrowseJob {
  targetUrl: string;    // ⭐ เห็น URL เฉพาะตอนรับงานแล้ว
  targetId?: string;
  claimId: string;
  claimedAt: Date;
  claimExpiresAt: Date;
}

// ⭐ Employer Job (เห็นทุกอย่าง - สำหรับ Employer เจ้าของงาน)
export interface EmployerJob extends Job {
  remainingQuantity: number;
  progressPercent: number;
}

export interface JobWithStats extends Job {
  employer: Pick<User, 'id' | 'name' | 'avatarUrl'>;
  remainingQuantity: number;
  progressPercent: number;
}

export interface WorkerDashboard {
  user: User;
  wallet: Wallet;
  todayEarnings: number;
  activeClaims: JobClaim[];
  recentActions: Action[];
  rank?: number;
}

export interface EmployerDashboard {
  user: User;
  wallet: Wallet;
  activeJobs: EmployerJob[];
  completedJobs: number;
  totalSpent: number;
}

// ============ PRIVACY HELPERS ============

/**
 * ฟังก์ชันสำหรับซ่อน URL ตาม access level
 * 
 * Usage:
 * - Public: ใช้ toPublicJob(job)
 * - Worker (browse): ใช้ toWorkerBrowseJob(job)
 * - Worker (claimed): ใช้ toClaimedJob(job, claim) - ส่งไป Extension เท่านั้น
 * - Employer (owner): ใช้ toEmployerJob(job)
 */

export type JobAccessLevel = 'public' | 'worker_browse' | 'worker_claimed' | 'employer';

export function getJobByAccessLevel(job: Job, accessLevel: JobAccessLevel, claim?: JobClaim): PublicJob | WorkerBrowseJob | ClaimedJob | EmployerJob {
  // Implementation in backend
  throw new Error('Implementation in backend');
}
```

---

## Relationships

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                                                                              │
│  🔗 Relationships:                                                          │
│                                                                              │
│  users (1) ──────────────────── (1) wallets                                │
│    │                                                                        │
│    ├── (1) ───────────────── (N) jobs         [employer creates jobs]      │
│    │                                                                        │
│    ├── (1) ───────────────── (N) job_claims   [worker claims jobs]         │
│    │                                                                        │
│    ├── (1) ───────────────── (N) actions      [worker does actions]        │
│    │                                                                        │
│    ├── (1) ───────────────── (N) transactions [user has transactions]      │
│    │                                                                        │
│    ├── (1) ───────────────── (N) withdrawals  [worker withdraws]           │
│    │                                                                        │
│    └── (1) ───────────────── (N) deposits     [employer deposits]          │
│                                                                              │
│  jobs (1) ───────────────────── (N) job_claims                             │
│    │                                                                        │
│    └── (1) ───────────────────── (N) actions                               │
│                                                                              │
│  job_claims (1) ─────────────── (N) actions                                │
│                                                                              │
│  wallets (1) ────────────────── (N) transactions                           │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## Indexes

### Performance Indexes

```sql
-- Job search (for workers)
CREATE INDEX idx_jobs_search ON jobs(status, platform, action_type, created_at DESC)
  WHERE status = 'active';

-- Worker's active claims
CREATE INDEX idx_claims_worker_active ON job_claims(worker_id, expires_at)
  WHERE status = 'claimed';

-- Transaction history
CREATE INDEX idx_transactions_history ON transactions(user_id, created_at DESC);

-- Pending withdrawals
CREATE INDEX idx_withdrawals_pending ON withdrawals(status, created_at)
  WHERE status IN ('pending', 'processing');

-- Action verification queue
CREATE INDEX idx_actions_unverified ON actions(created_at)
  WHERE verified = FALSE;
```

### Full-text Search (Optional)

```sql
-- Search jobs by URL
CREATE INDEX idx_jobs_target_url ON jobs USING gin(to_tsvector('english', target_url));
```

---

## Related Documents

- [EXTENSION_SPEC.md](./EXTENSION_SPEC.md) - How Extension interacts with DB
- [USER_FLOWS.md](./USER_FLOWS.md) - Data flow diagrams
- [BUSINESS_MODEL.md](./BUSINESS_MODEL.md) - Financial calculations
