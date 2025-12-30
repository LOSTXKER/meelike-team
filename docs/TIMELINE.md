# 📅 Development Timeline

## ⚠️ Project Type: Prototype

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                                                                              │
│  📋 Prototype = UI/UX + Mock Data + LocalStorage                            │
│                                                                              │
│  ไม่รวม: Backend API, Database จริง, Payment จริง                          │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 📊 Overview

| Phase | ระยะเวลา | เนื้อหา |
|-------|---------|---------|
| Phase 1 | 2-3 สัปดาห์ | Core: Auth, Seller Dashboard, Store |
| Phase 2 | 2-3 สัปดาห์ | Team Manager & Worker System |
| Phase 3 | 2 สัปดาห์ | Account Marketplace (Coming Soon) |
| Phase 4 | 1-2 สัปดาห์ | Polish & Testing |

**รวม: 7-10 สัปดาห์**

---

## Phase 1: Core Platform (2-3 สัปดาห์)

### Week 1-2: Foundation

```
├── Project Setup
│   ├── Next.js 14 App Router
│   ├── Tailwind + MeeLike Theme
│   ├── TypeScript Types
│   └── Mock Data Structure
│
├── Auth (Mock)
│   ├── Login Page
│   ├── Register Page
│   └── Session Management (LocalStorage)
│
├── Seller Dashboard
│   ├── Layout (Sidebar + Header)
│   ├── Dashboard Page
│   ├── Stats Cards
│   └── Recent Orders Widget
│
└── Store Setup
    ├── Store Settings Page
    ├── Theme Selector
    └── Profile Editor
```

### Week 2-3: Store & Services

```
├── Service Management
│   ├── Service List Page
│   ├── Add Service Modal
│   ├── Edit Service
│   └── Bot vs Human Toggle
│
├── Public Store
│   ├── Store Page (/s/[slug])
│   ├── Service Cards
│   ├── Order Form
│   └── Status Check Page
│
└── Orders
    ├── Order List Page
    ├── Order Detail Page
    └── Order Status Management
```

### Checklist Phase 1

- [ ] Project Setup & Config
- [ ] MeeLike Theme Implementation
- [ ] Mock Data & LocalStorage Utils
- [ ] Auth Pages (Login, Register)
- [ ] Seller Dashboard
- [ ] Store Settings
- [ ] Service Management
- [ ] Public Store Pages
- [ ] Order Management

---

## Phase 2: Team Manager & Worker (2-3 สัปดาห์)

### Week 4-5: Team Manager

```
├── Team Dashboard
│   ├── Team Stats Cards
│   ├── Active Jobs Widget
│   └── Pending Review Widget
│
├── Member Management
│   ├── Member List Page
│   ├── Member Detail
│   ├── Invite Link Generator
│   ├── QR Code Generator
│   └── Join Request Handler
│
├── Job Management
│   ├── Job List Page
│   ├── Create Job Form
│   ├── Job Detail Page
│   └── Job Progress Tracker
│
└── Job Review
    ├── Review Queue
    ├── Approve/Reject UI
    └── Auto-Approve Timer
```

### Week 5-6: Worker App

```
├── Worker Dashboard
│   ├── Layout (Bottom Nav + Sidebar)
│   ├── Balance Widget
│   ├── Available Jobs List
│   └── My Jobs Widget
│
├── Team Management
│   ├── My Teams Page
│   ├── Search Teams Page
│   ├── Join Team Flow
│   └── Team Detail Page
│
├── Job Flow
│   ├── Job Detail Page
│   ├── Accept Job Flow
│   ├── Submit Job Flow
│   └── Upload Proof
│
├── Earnings
│   ├── Earnings Dashboard
│   ├── Withdrawal Page
│   ├── Bank Account Setup
│   └── Transaction History
│
├── Worker Account Verification
│   ├── Account List Page
│   ├── Add Account Flow
│   ├── Screenshot Upload
│   └── Verification Status
│
└── Gamification
    ├── Level Progress
    ├── Daily Streak
    ├── Leaderboard
    └── Referral Page
```

### Checklist Phase 2

- [ ] Team Dashboard
- [ ] Member Management
- [ ] Invite System (Link, QR, Search)
- [ ] Job Creation
- [ ] Job Review Queue
- [ ] Worker Dashboard
- [ ] Worker Teams
- [ ] Job Accept/Submit Flow
- [ ] Earnings & Withdrawal
- [ ] Worker Account Verification
- [ ] Level & Gamification

---

## Phase 3: Account Marketplace (2 สัปดาห์)

### Week 7-8: Marketplace (Coming Soon)

```
├── Marketplace Browse
│   ├── Category Pages
│   ├── Account Cards
│   └── Search & Filter
│
├── Account Detail
│   ├── Account Info
│   ├── Seller Info
│   └── Buy Flow
│
└── Seller: Account Management
    ├── My Accounts List
    ├── Add Account Flow
    └── Account Status
```

### Checklist Phase 3

- [ ] Marketplace Browse (Coming Soon Banner)
- [ ] Account Detail Page (Preview)
- [ ] Seller Account Management (Preview)

---

## Phase 4: Polish & Testing (1-2 สัปดาห์)

### Week 9-10: Final

```
├── UI Polish
│   ├── Responsive Design
│   ├── Dark Mode Support
│   ├── Loading States
│   ├── Empty States
│   └── Error States
│
├── Testing
│   ├── Flow Testing
│   ├── Mobile Testing
│   └── Cross-browser Testing
│
└── Documentation
    ├── User Guide
    └── Code Comments
```

### Checklist Phase 4

- [ ] Mobile Responsive
- [ ] Dark Mode
- [ ] Loading/Empty/Error States
- [ ] Flow Testing
- [ ] Final Polish

---

## 🎯 MVP Features Priority

### Must Have (P0)

| Feature | Phase |
|---------|-------|
| Seller Dashboard | 1 |
| Store Setup & Theme | 1 |
| Service Management | 1 |
| Public Store | 1 |
| Order Management | 1 |
| Team Dashboard | 2 |
| Member Management | 2 |
| Job Creation | 2 |
| Worker Dashboard | 2 |
| Job Accept/Submit | 2 |
| Earnings & Withdrawal | 2 |

### Should Have (P1)

| Feature | Phase |
|---------|-------|
| Job Review Queue | 2 |
| Worker Account Verification | 2 |
| Search Teams | 2 |
| Level & Gamification | 2 |

### Nice to Have (P2)

| Feature | Phase |
|---------|-------|
| Account Marketplace | 3 |
| Advanced Analytics | 4 |
| Dark Mode | 4 |

---

## 📁 Folder Structure

```
src/
├── app/
│   ├── (auth)/
│   │   ├── login/
│   │   └── register/
│   │
│   ├── seller/                 # Seller Center
│   │   ├── page.tsx           # Dashboard
│   │   ├── store/
│   │   ├── services/
│   │   ├── orders/
│   │   ├── team/
│   │   │   ├── page.tsx       # Team Dashboard
│   │   │   ├── members/
│   │   │   ├── jobs/
│   │   │   └── payouts/
│   │   ├── bot/
│   │   ├── wallet/
│   │   └── settings/
│   │
│   ├── work/                   # Worker App
│   │   ├── page.tsx           # Dashboard
│   │   ├── teams/
│   │   ├── my-jobs/
│   │   ├── earnings/
│   │   ├── accounts/
│   │   └── profile/
│   │
│   ├── s/[slug]/              # Public Store
│   │   ├── page.tsx
│   │   ├── order/
│   │   └── status/
│   │
│   └── market/                 # Marketplace (Coming Soon)
│
├── components/
│   ├── ui/                     # UI Components
│   ├── seller/                 # Seller Components
│   ├── worker/                 # Worker Components
│   └── store/                  # Store Components
│
├── lib/
│   ├── mock-data/              # Mock Data
│   ├── storage/                # LocalStorage Utils
│   └── utils/                  # Utilities
│
└── types/                      # TypeScript Types
```


