# Prototype Guide - V2 Marketplace

> Prototype without real database - use Mock Data + LocalStorage
>
> **UI Guidelines:** Minimal, Clean, Modern - NO EMOJI, Icons Only (Lucide)

---

## Overview

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                                                                              │
│  [flask] PROTOTYPE MODE                                                     │
│                                                                              │
│  ┌─────────────────────────────────────────────────────────────────────┐    │
│  │                                                                      │    │
│  │  [database] Database:     Mock Data (in-memory + localStorage)      │    │
│  │  [server] Backend:        ไม่มี (ใช้ mock functions)                │    │
│  │  [puzzle] Extension:      Mock Extension UI                         │    │
│  │  [credit-card] Payment:   Mock (auto-success)                       │    │
│  │                                                                      │    │
│  └─────────────────────────────────────────────────────────────────────┘    │
│                                                                              │
│  Stack:                                                                     │
│  ├── Next.js 14 (App Router)                                               │
│  ├── Zustand (State Management + Persist to localStorage)                  │
│  ├── TypeScript                                                            │
│  └── Tailwind CSS                                                          │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## Architecture

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                                                                              │
│  Prototype Architecture:                                                    │
│                                                                              │
│  ┌─────────────┐    ┌─────────────┐    ┌─────────────┐                     │
│  │   Pages     │ -> │   Zustand   │ -> │ localStorage│                     │
│  │  (Next.js)  │    │   Stores    │    │  (Persist)  │                     │
│  └─────────────┘    └──────┬──────┘    └─────────────┘                     │
│                            │                                                │
│                            ▼                                                │
│                     ┌─────────────┐                                        │
│                     │  Mock Data  │                                        │
│                     │  (Initial)  │                                        │
│                     └─────────────┘                                        │
│                                                                              │
│  Flow:                                                                      │
│  1. App loads → Zustand hydrates from localStorage                         │
│  2. If no data → Initialize with mock data                                 │
│  3. User actions → Update Zustand → Auto-persist to localStorage           │
│  4. Page refresh → Data preserved                                          │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## File Structure

```
src/
├── lib/
│   ├── store.ts              # Zustand stores (auth, app, jobs, wallets)
│   ├── mock-data/
│   │   ├── index.ts          # Export all mock data
│   │   ├── employer.ts       # [NEW] Mock employers
│   │   ├── worker.ts         # Mock workers
│   │   ├── jobs.ts           # [UPDATE] Mock jobs for V2
│   │   └── wallet.ts         # [NEW] Mock wallets
│   └── storage.ts            # localStorage utilities
│
├── hooks/
│   ├── use-jobs.ts           # [NEW] Job CRUD hooks
│   ├── use-wallet.ts         # [NEW] Wallet hooks
│   └── use-auth.ts           # Auth hooks
│
└── types/
    └── index.ts              # TypeScript types
```

---

## Zustand Stores

### 1. Auth Store (มีอยู่แล้ว - อัปเดต)

```typescript
// src/lib/store.ts

interface AuthState {
  user: AuthUser | null;
  isLoading: boolean;
  hasHydrated: boolean;
  
  // Actions
  login: (email: string, password: string, role: 'employer' | 'worker') => Promise<boolean>;
  register: (data: RegisterData) => Promise<boolean>;
  logout: () => void;
}

// AuthUser type
interface AuthUser {
  id: string;
  email: string;
  role: 'employer' | 'worker';
  name: string;
  avatarUrl?: string;
  
  // Role-specific data
  employer?: Employer;
  worker?: Worker;
}
```

### 2. Jobs Store (NEW)

```typescript
// src/lib/stores/jobs-store.ts

interface JobsState {
  jobs: Job[];
  claims: JobClaim[];
  
  // Employer Actions
  createJob: (job: CreateJobInput) => Job;
  pauseJob: (jobId: string) => void;
  cancelJob: (jobId: string) => void;
  
  // Worker Actions
  claimJob: (jobId: string, workerId: string) => JobClaim;
  completeJob: (claimId: string) => void;
  
  // Queries
  getPublicJobs: () => PublicJob[];
  getEmployerJobs: (employerId: string) => Job[];
  getWorkerClaims: (workerId: string) => JobClaim[];
  getClaimedJob: (claimId: string) => ClaimedJob | null;
}
```

### 3. Wallet Store (NEW)

```typescript
// src/lib/stores/wallet-store.ts

interface WalletState {
  wallets: Record<string, Wallet>; // userId -> Wallet
  transactions: Transaction[];
  
  // Actions
  deposit: (userId: string, amount: number) => void;
  withdraw: (userId: string, amount: number) => void;
  payForJob: (employerId: string, jobId: string, amount: number) => void;
  earnFromJob: (workerId: string, claimId: string, amount: number) => void;
  
  // Queries
  getWallet: (userId: string) => Wallet;
  getTransactions: (userId: string) => Transaction[];
}
```

---

## Mock Data Examples

### Employers

```typescript
// src/lib/mock-data/employer.ts

export const mockEmployers: Employer[] = [
  {
    id: 'emp-1',
    userId: 'user-emp-1',
    name: 'John Marketing',
    email: 'john@example.com',
    companyName: 'Digital Agency Co.',
    phone: '0812345678',
    createdAt: new Date('2024-01-01'),
  },
  {
    id: 'emp-2',
    userId: 'user-emp-2', 
    name: 'Sarah Business',
    email: 'sarah@example.com',
    companyName: 'Social Boost Inc.',
    phone: '0898765432',
    createdAt: new Date('2024-02-15'),
  },
];
```

### Workers

```typescript
// src/lib/mock-data/worker.ts (อัปเดต)

export const mockWorkers: Worker[] = [
  {
    id: 'worker-1',
    userId: 'user-worker-1',
    name: 'สมชาย ใจดี',
    email: 'somchai@example.com',
    phone: '0891234567',
    level: 'silver',
    trustScore: 95,
    completedJobs: 156,
    
    // Bank
    bankName: 'กสิกรไทย',
    bankAccount: 'xxx-x-xx123-x',
    bankAccountName: 'สมชาย ใจดี',
    
    // Extension
    extensionInstalled: true,
    extensionVersion: '1.0.0',
    
    createdAt: new Date('2024-01-15'),
  },
  // ... more workers
];
```

### Jobs

```typescript
// src/lib/mock-data/jobs.ts (อัปเดตสำหรับ V2)

export const mockJobs: Job[] = [
  {
    id: 'job-1',
    employerId: 'emp-1',
    
    platform: 'facebook',
    actionType: 'like',
    targetUrl: 'https://facebook.com/page/posts/123456', // Private!
    targetUrlHash: 'abc123...',
    
    totalQuantity: 500,
    completedQuantity: 423,
    claimedQuantity: 450,
    
    pricePerAction: 0.25,
    totalCost: 125,
    platformFee: 15,
    
    status: 'active',
    createdAt: new Date('2024-01-20'),
  },
  {
    id: 'job-2',
    employerId: 'emp-1',
    
    platform: 'instagram',
    actionType: 'follow',
    targetUrl: 'https://instagram.com/mybusiness',
    
    totalQuantity: 300,
    completedQuantity: 150,
    claimedQuantity: 200,
    
    pricePerAction: 0.35,
    totalCost: 105,
    platformFee: 12.6,
    
    status: 'active',
    createdAt: new Date('2024-01-21'),
  },
  {
    id: 'job-3',
    employerId: 'emp-2',
    
    platform: 'tiktok',
    actionType: 'like',
    targetUrl: 'https://tiktok.com/@user/video/123',
    
    totalQuantity: 1000,
    completedQuantity: 0,
    claimedQuantity: 50,
    
    pricePerAction: 0.20,
    totalCost: 200,
    platformFee: 24,
    
    status: 'active',
    createdAt: new Date('2024-01-22'),
  },
];
```

### Wallets

```typescript
// src/lib/mock-data/wallet.ts (NEW)

export const mockWallets: Record<string, Wallet> = {
  'user-emp-1': {
    id: 'wallet-emp-1',
    userId: 'user-emp-1',
    balance: 2500,
    pendingBalance: 0,
    totalDeposited: 5000,
    totalSpent: 2500,
    totalEarned: 0,
    totalWithdrawn: 0,
  },
  'user-worker-1': {
    id: 'wallet-worker-1',
    userId: 'user-worker-1',
    balance: 1250,
    pendingBalance: 0,
    totalDeposited: 0,
    totalSpent: 0,
    totalEarned: 3450,
    totalWithdrawn: 2200,
  },
};
```

---

## Privacy Implementation (Prototype)

```typescript
// src/lib/utils/job-privacy.ts

/**
 * ซ่อน URL ตาม access level
 */
export function filterJobForAccess(
  job: Job, 
  accessLevel: 'public' | 'worker_browse' | 'worker_claimed' | 'employer',
  userId?: string
): PublicJob | WorkerBrowseJob | ClaimedJob | Job {
  
  // Public & Worker Browse: ซ่อน URL
  if (accessLevel === 'public' || accessLevel === 'worker_browse') {
    const { targetUrl, targetUrlHash, ...publicJob } = job;
    return {
      ...publicJob,
      remainingQuantity: job.totalQuantity - job.claimedQuantity,
    } as PublicJob;
  }
  
  // Worker Claimed: เห็น URL (ส่งไป Extension)
  if (accessLevel === 'worker_claimed') {
    return job as ClaimedJob;
  }
  
  // Employer: เห็นทุกอย่าง (เฉพาะงานตัวเอง)
  if (accessLevel === 'employer' && job.employerId === userId) {
    return job;
  }
  
  // Default: ซ่อน URL
  const { targetUrl, targetUrlHash, ...safeJob } = job;
  return safeJob as PublicJob;
}

/**
 * Get jobs for marketplace (public view)
 */
export function getPublicJobs(jobs: Job[]): PublicJob[] {
  return jobs
    .filter(job => job.status === 'active')
    .map(job => filterJobForAccess(job, 'public') as PublicJob);
}
```

---

## Mock Extension UI

สำหรับ prototype เราจะสร้าง **Mock Extension Popup** เป็น Modal ใน Web App:

```typescript
// src/components/mock-extension/extension-popup.tsx

'use client';

import { useState } from 'react';
import { Modal } from '@/components/ui/modal';
import { Button } from '@/components/ui/button';
import { useJobsStore } from '@/lib/stores/jobs-store';

interface MockExtensionProps {
  isOpen: boolean;
  onClose: () => void;
  claimedJobs: ClaimedJob[];
}

export function MockExtensionPopup({ isOpen, onClose, claimedJobs }: MockExtensionProps) {
  const { completeJob } = useJobsStore();
  
  const handleDoJob = async (claim: ClaimedJob) => {
    // Simulate: Open URL, Do action, Verify, Close
    
    // 1. Show "Opening..." state
    setStatus('opening');
    await delay(500);
    
    // 2. Show "Working..." state
    setStatus('working');
    await delay(1000);
    
    // 3. Show "Verifying..." state (mock screenshot + AI)
    setStatus('verifying');
    await delay(1500);
    
    // 4. Complete!
    completeJob(claim.id);
    setStatus('complete');
  };
  
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="MeeLike Extension">
      {/* Extension UI mockup */}
    </Modal>
  );
}
```

---

## Demo Flow

### 1. Public User

```
1. เข้า /marketplace
2. เห็นรายการงาน (ไม่มี URL)
3. Click "Login เพื่อรับงาน"
4. เลือก "สมัครเป็น Worker" หรือ Login
```

### 2. Employer Flow

```
1. Login as Employer
2. เข้า /employer/wallet/topup
3. Mock: เติมเงิน ฿500 (auto-success)
4. เข้า /employer/jobs/new
5. สร้างงาน: FB Like, 100 likes, ฿0.25/like
6. ยืนยัน → งานโพสต์!
7. เข้า /employer/jobs → เห็น progress
```

### 3. Worker Flow

```
1. Login as Worker
2. เข้า /worker/jobs (marketplace)
3. เห็นงาน (ไม่มี URL)
4. Click "รับงาน"
5. เข้า /worker/my-jobs
6. Click "เปิดใน Extension"
7. Mock Extension: ทำงาน → Verify → Complete
8. เงินเข้า Balance ทันที!
9. เข้า /worker/earnings/withdraw
```

---

## localStorage Keys

```typescript
// Keys used in localStorage

'meelike-auth'     // Auth state (user info)
'meelike-app'      // App state (sidebar, theme)
'meelike-jobs'     // Jobs + Claims
'meelike-wallets'  // Wallets + Transactions
```

---

## Reset Prototype Data

```typescript
// src/lib/utils/reset-data.ts

export function resetAllData() {
  localStorage.removeItem('meelike-auth');
  localStorage.removeItem('meelike-app');
  localStorage.removeItem('meelike-jobs');
  localStorage.removeItem('meelike-wallets');
  
  window.location.reload();
}

// Usage: เพิ่มปุ่ม Reset ใน Settings page
```

---

## What's NOT in Prototype

| Feature | Prototype | Production |
|---------|:---------:|:----------:|
| Real Database | [x] | [check] PostgreSQL |
| Real Backend API | [x] | [check] Next.js API Routes |
| Real Extension | [x] | [check] Chrome Extension |
| Real Payment | [x] | [check] PromptPay/Bank |
| Real AI Verify | [x] | [check] Gemini Flash |
| Email Verification | [x] | [check] SendGrid |
| Screenshot Storage | [x] | [check] Cloudflare R2 |

---

## Next Steps (After Prototype)

1. **Validate UX** with prototype
2. **Get feedback** from potential users
3. **If approved** → Start real development:
   - Setup PostgreSQL (Supabase/Neon)
   - Build Chrome Extension
   - Integrate Payment Gateway
   - Setup AI Verification

---

## Related Documents

- [DATABASE.md](./DATABASE.md) - Real database schema (for production)
- [EXTENSION_SPEC.md](./EXTENSION_SPEC.md) - Real extension spec
- [USER_FLOWS.md](./USER_FLOWS.md) - User flows to implement
