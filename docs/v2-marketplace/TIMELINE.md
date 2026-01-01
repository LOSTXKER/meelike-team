# Development Timeline - Marketplace V2

> MeeLike Marketplace + Extension Development Plan
>
> **UI Guidelines:** Minimal, Clean, Modern - NO EMOJI, Icons Only (Lucide)

---

## Table of Contents

1. [Overview](#overview)
2. [Phase Breakdown](#phase-breakdown)
3. [Detailed Tasks](#detailed-tasks)
4. [Tech Stack](#tech-stack)
5. [Milestones](#milestones)
6. [Risk & Mitigation](#risk--mitigation)

---

## Overview

### Timeline Summary

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                                                                              │
│  Total Timeline: 7 Weeks                                                    │
│                                                                              │
│  Week 1-2:  [wrench] Phase 1 - Foundation + Extension POC                  │
│  Week 3-4:  [briefcase] Phase 2 - Employer Dashboard                       │
│  Week 5-6:  [user] Phase 3 - Worker Dashboard + Extension Full             │
│  Week 7:    [rocket] Phase 4 - Testing + Launch                            │
│                                                                              │
│  ════════════════════════════════════════════════════════════════════════   │
│                                                                              │
│  🎯 MVP Features:                                                           │
│  ├── ✅ Employer: Register, Top-up, Post Jobs, Monitor                     │
│  ├── ✅ Worker: Register, Install Extension, Claim Jobs, Earn, Withdraw    │
│  ├── ✅ Extension: Track FB/IG/TikTok actions                              │
│  └── ✅ Admin: Basic job/user management                                   │
│                                                                              │
│  ❌ NOT in MVP:                                                             │
│  ├── Twitter support (Phase 2)                                             │
│  ├── YouTube support (Phase 2)                                             │
│  ├── Advanced analytics                                                    │
│  ├── Mobile app                                                            │
│  └── Referral system                                                       │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Gantt Chart

```
Week        │ 1   │ 2   │ 3   │ 4   │ 5   │ 6   │ 7   │
────────────┼─────┼─────┼─────┼─────┼─────┼─────┼─────┤
Phase 1     │████████████│     │     │     │     │     │
Foundation  │ Setup, DB │     │     │     │     │     │
            │ Auth, Ext │     │     │     │     │     │
────────────┼─────┼─────┼─────┼─────┼─────┼─────┼─────┤
Phase 2     │     │     │████████████│     │     │     │
Employer    │     │     │ Dashboard │     │     │     │
            │     │     │ Jobs, Pay │     │     │     │
────────────┼─────┼─────┼─────┼─────┼─────┼─────┼─────┤
Phase 3     │     │     │     │     │████████████│     │
Worker      │     │     │     │     │ Dashboard │     │
            │     │     │     │     │ Extension │     │
────────────┼─────┼─────┼─────┼─────┼─────┼─────┼─────┤
Phase 4     │     │     │     │     │     │     │█████│
Launch      │     │     │     │     │     │     │Test │
            │     │     │     │     │     │     │ Go! │
────────────┴─────┴─────┴─────┴─────┴─────┴─────┴─────┘
```

---

## Phase Breakdown

### Phase 1: Foundation (Week 1-2)

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                                                                              │
│  🔧 Phase 1: Foundation + Extension POC                                     │
│  Duration: 2 สัปดาห์                                                        │
│                                                                              │
│  ┌─────────────────────────────────────────────────────────────────────┐    │
│  │  Week 1: Setup & Core                                               │    │
│  │  ─────────────────────────────────────────────────────────────────  │    │
│  │  Day 1-2: Project Setup                                             │    │
│  │  ├── Next.js 14 + TypeScript setup                                  │    │
│  │  ├── Database schema (Supabase/Postgres)                            │    │
│  │  ├── Authentication (NextAuth/Supabase Auth)                        │    │
│  │  └── Basic API structure                                            │    │
│  │                                                                      │    │
│  │  Day 3-4: Core APIs                                                 │    │
│  │  ├── User registration/login                                        │    │
│  │  ├── Wallet system                                                  │    │
│  │  └── Basic job CRUD                                                 │    │
│  │                                                                      │    │
│  │  Day 5: Extension Boilerplate                                       │    │
│  │  ├── Chrome Extension setup (Manifest V3)                           │    │
│  │  ├── Popup UI skeleton                                              │    │
│  │  └── Background service worker                                      │    │
│  └─────────────────────────────────────────────────────────────────────┘    │
│                                                                              │
│  ┌─────────────────────────────────────────────────────────────────────┐    │
│  │  Week 2: Extension POC                                              │    │
│  │  ─────────────────────────────────────────────────────────────────  │    │
│  │  Day 1-2: Facebook Integration                                      │    │
│  │  ├── Content script for Facebook                                    │    │
│  │  ├── Like button detection                                          │    │
│  │  └── Action reporting to API                                        │    │
│  │                                                                      │    │
│  │  Day 3-4: Instagram + TikTok                                        │    │
│  │  ├── Content scripts for IG/TikTok                                  │    │
│  │  ├── Action detection                                               │    │
│  │  └── Testing & debugging                                            │    │
│  │                                                                      │    │
│  │  Day 5: Extension Polish                                            │    │
│  │  ├── Login flow                                                     │    │
│  │  ├── Job overlay UI                                                 │    │
│  │  └── Earnings display                                               │    │
│  └─────────────────────────────────────────────────────────────────────┘    │
│                                                                              │
│  ✅ Deliverables:                                                           │
│  ├── Working authentication                                                │
│  ├── Database with all tables                                              │
│  ├── Extension POC (FB/IG/TikTok tracking)                                │
│  └── Basic API endpoints                                                   │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Phase 2: Employer Dashboard (Week 3-4)

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                                                                              │
│  👔 Phase 2: Employer Dashboard                                             │
│  Duration: 2 สัปดาห์                                                        │
│                                                                              │
│  ┌─────────────────────────────────────────────────────────────────────┐    │
│  │  Week 3: Core Employer Features                                     │    │
│  │  ─────────────────────────────────────────────────────────────────  │    │
│  │  Day 1-2: Dashboard & Jobs                                          │    │
│  │  ├── Employer dashboard UI                                          │    │
│  │  ├── Job posting form                                               │    │
│  │  ├── Job listing page                                               │    │
│  │  └── Job detail/progress page                                       │    │
│  │                                                                      │    │
│  │  Day 3-4: Wallet System                                             │    │
│  │  ├── Wallet overview page                                           │    │
│  │  ├── Top-up flow (PromptPay QR)                                     │    │
│  │  ├── Transaction history                                            │    │
│  │  └── Payment processing                                             │    │
│  │                                                                      │    │
│  │  Day 5: Job Posting Flow                                            │    │
│  │  ├── Platform/action selection                                      │    │
│  │  ├── Pricing calculation                                            │    │
│  │  └── Wallet deduction                                               │    │
│  └─────────────────────────────────────────────────────────────────────┘    │
│                                                                              │
│  ┌─────────────────────────────────────────────────────────────────────┐    │
│  │  Week 4: Polish & Integration                                       │    │
│  │  ─────────────────────────────────────────────────────────────────  │    │
│  │  Day 1-2: Job Management                                            │    │
│  │  ├── Pause/resume jobs                                              │    │
│  │  ├── Cancel job (refund)                                            │    │
│  │  └── Job statistics                                                 │    │
│  │                                                                      │    │
│  │  Day 3-4: Settings & Profile                                        │    │
│  │  ├── Profile settings                                               │    │
│  │  ├── Notification preferences                                       │    │
│  │  └── Account security                                               │    │
│  │                                                                      │    │
│  │  Day 5: Testing                                                     │    │
│  │  ├── End-to-end employer flow                                       │    │
│  │  ├── Payment integration test                                       │    │
│  │  └── Bug fixes                                                      │    │
│  └─────────────────────────────────────────────────────────────────────┘    │
│                                                                              │
│  ✅ Deliverables:                                                           │
│  ├── Complete employer dashboard                                           │
│  ├── Job posting & management                                              │
│  ├── Wallet & payment system                                               │
│  └── Employer settings                                                     │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Phase 3: Worker Dashboard + Extension (Week 5-6)

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                                                                              │
│  👤 Phase 3: Worker Dashboard + Extension Full                              │
│  Duration: 2 สัปดาห์                                                        │
│                                                                              │
│  ┌─────────────────────────────────────────────────────────────────────┐    │
│  │  Week 5: Worker Web Dashboard                                       │    │
│  │  ─────────────────────────────────────────────────────────────────  │    │
│  │  Day 1-2: Dashboard & Marketplace                                   │    │
│  │  ├── Worker dashboard UI                                            │    │
│  │  ├── Job marketplace (browse jobs)                                  │    │
│  │  ├── Job claiming flow                                              │    │
│  │  └── My jobs page                                                   │    │
│  │                                                                      │    │
│  │  Day 3-4: Earnings & Withdrawal                                     │    │
│  │  ├── Earnings dashboard                                             │    │
│  │  ├── Withdrawal request flow                                        │    │
│  │  ├── Bank account management                                        │    │
│  │  └── Transaction history                                            │    │
│  │                                                                      │    │
│  │  Day 5: Profile & Onboarding                                        │    │
│  │  ├── Worker profile page                                            │    │
│  │  ├── Level/badge display                                            │    │
│  │  ├── Extension installation guide                                   │    │
│  │  └── Tutorial/onboarding flow                                       │    │
│  └─────────────────────────────────────────────────────────────────────┘    │
│                                                                              │
│  ┌─────────────────────────────────────────────────────────────────────┐    │
│  │  Week 6: Extension Production + Anti-Unlike System                  │    │
│  │  ─────────────────────────────────────────────────────────────────  │    │
│  │  Day 1-2: Screenshot + Freeze + Auto-Close System                   │    │
│  │  ├── Screenshot capture (chrome.tabs.captureVisibleTab)             │    │
│  │  ├── Freeze overlay UI (block interactions)                         │    │
│  │  ├── Auto-close tab after verification                              │    │
│  │  └── Block URL system (prevent revisit)                             │    │
│  │                                                                      │    │
│  │  Day 3: AI Verification Integration                                 │    │
│  │  ├── Gemini Flash API integration                                   │    │
│  │  ├── DOM state verification                                         │    │
│  │  ├── Trust-level based AI usage                                     │    │
│  │  └── Screenshot storage (S3/R2)                                     │    │
│  │                                                                      │    │
│  │  Day 4: Extension UI & Polish                                       │    │
│  │  ├── Success/error overlay animations                               │    │
│  │  ├── Progress indicator during verify                               │    │
│  │  ├── Popup UI polish                                                │    │
│  │  └── Notifications system                                           │    │
│  │                                                                      │    │
│  │  Day 5: Chrome Web Store                                            │    │
│  │  ├── Extension packaging                                            │    │
│  │  ├── Store listing creation                                         │    │
│  │  ├── Privacy policy                                                 │    │
│  │  └── Submit for review                                              │    │
│  └─────────────────────────────────────────────────────────────────────┘    │
│                                                                              │
│  ✅ Deliverables:                                                           │
│  ├── Complete worker dashboard                                             │
│  ├── Earnings & withdrawal system                                          │
│  ├── Anti-Unlike system (Screenshot + Freeze + Auto-Close)                 │
│  ├── AI verification integration                                           │
│  ├── Production-ready extension                                            │
│  └── Chrome Web Store submission                                           │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Phase 4: Testing & Launch (Week 7)

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                                                                              │
│  🚀 Phase 4: Testing & Launch                                               │
│  Duration: 1 สัปดาห์                                                        │
│                                                                              │
│  ┌─────────────────────────────────────────────────────────────────────┐    │
│  │  Day 1-2: Integration Testing                                       │    │
│  │  ├── End-to-end employer flow                                       │    │
│  │  ├── End-to-end worker flow                                         │    │
│  │  ├── Payment flow testing                                           │    │
│  │  ├── Extension testing (all platforms)                              │    │
│  │  └── Edge cases & error handling                                    │    │
│  └─────────────────────────────────────────────────────────────────────┘    │
│                                                                              │
│  ┌─────────────────────────────────────────────────────────────────────┐    │
│  │  Day 3-4: Beta Testing                                              │    │
│  │  ├── Internal testing (team)                                        │    │
│  │  ├── Beta users (10-20 workers)                                     │    │
│  │  ├── Real job testing                                               │    │
│  │  ├── Feedback collection                                            │    │
│  │  └── Bug fixes                                                      │    │
│  └─────────────────────────────────────────────────────────────────────┘    │
│                                                                              │
│  ┌─────────────────────────────────────────────────────────────────────┐    │
│  │  Day 5: Launch Preparation                                          │    │
│  │  ├── Production deployment                                          │    │
│  │  ├── Monitoring setup (Sentry, Analytics)                           │    │
│  │  ├── Documentation                                                  │    │
│  │  ├── Support channel setup                                          │    │
│  │  └── 🚀 LAUNCH!                                                     │    │
│  └─────────────────────────────────────────────────────────────────────┘    │
│                                                                              │
│  ✅ Deliverables:                                                           │
│  ├── Fully tested platform                                                 │
│  ├── Production deployment                                                 │
│  ├── Extension live on Chrome Web Store                                    │
│  └── Ready for first users!                                                │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## Detailed Tasks

### Checklist by Phase

#### Phase 1 Checklist

```
Foundation:
├── [ ] Project Setup
│   ├── [ ] Create Next.js 14 project
│   ├── [ ] Setup TypeScript config
│   ├── [ ] Install dependencies (Tailwind, etc.)
│   ├── [ ] Setup ESLint/Prettier
│   └── [ ] Create folder structure
│
├── [ ] Database
│   ├── [ ] Setup Supabase project
│   ├── [ ] Create all tables (users, jobs, etc.)
│   ├── [ ] Setup indexes
│   ├── [ ] Create TypeScript types
│   └── [ ] Seed data for testing
│
├── [ ] Authentication
│   ├── [ ] Setup NextAuth/Supabase Auth
│   ├── [ ] Registration flow (Employer/Worker)
│   ├── [ ] Login flow
│   ├── [ ] Email verification
│   └── [ ] Password reset
│
└── [ ] Extension POC
    ├── [ ] Chrome Extension boilerplate
    ├── [ ] Facebook content script
    ├── [ ] Instagram content script
    ├── [ ] TikTok content script
    ├── [ ] Action detection logic
    └── [ ] API integration
```

#### Phase 2 Checklist

```
Employer Dashboard:
├── [ ] Layout
│   ├── [ ] Sidebar navigation
│   ├── [ ] Header with user info
│   └── [ ] Responsive design
│
├── [ ] Dashboard Page
│   ├── [ ] Stats overview (wallet, jobs)
│   ├── [ ] Recent jobs list
│   └── [ ] Quick actions
│
├── [ ] Jobs Management
│   ├── [ ] Jobs list page
│   ├── [ ] Job detail page
│   ├── [ ] Post new job form
│   ├── [ ] Edit job
│   ├── [ ] Pause/Resume job
│   └── [ ] Cancel job (with refund)
│
├── [ ] Wallet
│   ├── [ ] Wallet overview
│   ├── [ ] Top-up page (PromptPay QR)
│   ├── [ ] Transaction history
│   └── [ ] Payment webhook handling
│
└── [ ] Settings
    ├── [ ] Profile settings
    ├── [ ] Notification settings
    └── [ ] Security settings
```

#### Phase 3 Checklist

```
Worker Dashboard:
├── [ ] Layout
│   ├── [ ] Extension status indicator
│   ├── [ ] Earnings badge
│   └── [ ] Navigation
│
├── [ ] Dashboard Page
│   ├── [ ] Today's earnings
│   ├── [ ] Active jobs
│   ├── [ ] Level/rank display
│   └── [ ] Quick actions
│
├── [ ] Job Marketplace
│   ├── [ ] Job listing with filters
│   ├── [ ] Job detail modal
│   ├── [ ] Claim job flow
│   └── [ ] My jobs page
│
├── [ ] Earnings
│   ├── [ ] Earnings overview
│   ├── [ ] Withdrawal request
│   ├── [ ] Bank account management
│   └── [ ] Transaction history
│
├── [ ] Profile
│   ├── [ ] Profile page
│   ├── [ ] Level benefits
│   ├── [ ] Stats/achievements
│   └── [ ] Settings
│
Extension Production:
├── [ ] Popup UI
│   ├── [ ] Redesigned popup
│   ├── [ ] Login state handling
│   ├── [ ] Jobs list
│   └── [ ] Earnings display
│
├── [ ] Content Scripts
│   ├── [ ] Polished overlay UI
│   ├── [ ] Success animations
│   ├── [ ] Error handling
│   └── [ ] Multi-platform support
│
├── [ ] Anti-cheat
│   ├── [ ] Browser fingerprint
│   ├── [ ] Action validation
│   ├── [ ] Rate limiting
│   └── [ ] Suspicious detection
│
└── [ ] Store Submission
    ├── [ ] Icons & screenshots
    ├── [ ] Store description
    ├── [ ] Privacy policy
    └── [ ] Submit for review
```

#### Phase 4 Checklist

```
Testing & Launch:
├── [ ] Testing
│   ├── [ ] Unit tests (critical paths)
│   ├── [ ] Integration tests
│   ├── [ ] E2E employer flow
│   ├── [ ] E2E worker flow
│   └── [ ] Extension testing
│
├── [ ] Beta Testing
│   ├── [ ] Recruit beta users
│   ├── [ ] Create test jobs
│   ├── [ ] Monitor & collect feedback
│   └── [ ] Fix critical bugs
│
├── [ ] Production
│   ├── [ ] Deploy to Vercel
│   ├── [ ] Setup custom domain
│   ├── [ ] SSL certificate
│   ├── [ ] Environment variables
│   └── [ ] Database backup
│
├── [ ] Monitoring
│   ├── [ ] Setup Sentry
│   ├── [ ] Google Analytics
│   ├── [ ] Uptime monitoring
│   └── [ ] Error alerting
│
└── [ ] Launch
    ├── [ ] Final QA
    ├── [ ] Documentation
    ├── [ ] Support channels
    └── [ ] GO LIVE! 🚀
```

---

## Tech Stack

### Frontend

| Technology | Purpose |
|------------|---------|
| **Next.js 14** | React framework |
| **TypeScript** | Type safety |
| **Tailwind CSS** | Styling |
| **shadcn/ui** | UI components |
| **React Query** | Data fetching |
| **Zustand** | State management |

### Backend

| Technology | Purpose |
|------------|---------|
| **Next.js API Routes** | API endpoints |
| **Supabase** | Database + Auth |
| **PostgreSQL** | Database |
| **Prisma** | ORM (optional) |

### Extension

| Technology | Purpose |
|------------|---------|
| **Chrome Extension (MV3)** | Browser extension |
| **TypeScript** | Type safety |
| **Webpack/Vite** | Bundling |

### Infrastructure

| Technology | Purpose |
|------------|---------|
| **Vercel** | Hosting |
| **Supabase** | Database hosting |
| **Cloudflare** | CDN & DNS |
| **Sentry** | Error tracking |

### Payments

| Technology | Purpose |
|------------|---------|
| **PromptPay** | Thai QR payments |
| **Omise** | Payment gateway (optional) |

---

## Milestones

### Key Milestones

| Milestone | Target Date | Criteria |
|-----------|-------------|----------|
| **M1: Foundation** | End of Week 2 | Auth + DB + Extension POC working |
| **M2: Employer MVP** | End of Week 4 | Employer can post & pay for jobs |
| **M3: Worker MVP** | End of Week 6 | Worker can claim & complete jobs |
| **M4: Launch** | End of Week 7 | Production live + Extension published |

### Success Criteria

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                                                                              │
│  🎯 Launch Success Criteria:                                                │
│                                                                              │
│  ✅ Technical:                                                              │
│  ├── All core features working                                             │
│  ├── Extension approved on Chrome Web Store                                │
│  ├── Payment system tested & working                                       │
│  ├── < 1% error rate                                                       │
│  └── < 3s page load time                                                   │
│                                                                              │
│  ✅ Business:                                                               │
│  ├── 10+ beta employers tested                                             │
│  ├── 50+ beta workers tested                                               │
│  ├── ฿10,000+ GMV during beta                                              │
│  └── < 5% dispute rate                                                     │
│                                                                              │
│  ✅ User Experience:                                                        │
│  ├── Employer can post job in < 5 minutes                                  │
│  ├── Worker can complete first job in < 10 minutes                         │
│  ├── Extension installs smoothly                                           │
│  └── Positive beta feedback (> 4/5 rating)                                 │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## Risk & Mitigation

### Risk Matrix

| Risk | Impact | Probability | Mitigation |
|------|--------|-------------|------------|
| Extension rejected by Chrome | High | Medium | Follow guidelines strictly, have backup plan |
| Social media blocks extension | High | Low | Use non-intrusive tracking, rate limit |
| Payment gateway issues | High | Low | Test thoroughly, have manual backup |
| Low worker adoption | Medium | Medium | Competitive pricing, referral bonus |
| Cheat/fraud attempts | Medium | High | Strong anti-cheat, spot checks |
| Scope creep | Medium | High | Stick to MVP, defer features |

### Contingency Plans

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                                                                              │
│  🛡️ Contingency Plans:                                                      │
│                                                                              │
│  1️⃣ Extension Rejected:                                                    │
│     ├── Fix issues and resubmit                                            │
│     ├── Offer manual installation (dev mode)                               │
│     └── Pivot to screenshot-based verification                             │
│                                                                              │
│  2️⃣ Payment Gateway Issues:                                                │
│     ├── Manual bank transfer option                                        │
│     ├── Admin approval for payments                                        │
│     └── Switch to alternative gateway                                      │
│                                                                              │
│  3️⃣ Low Adoption:                                                          │
│     ├── Increase worker payout rates                                       │
│     ├── Add sign-up bonus                                                  │
│     ├── Partner with existing communities                                  │
│     └── Facebook/social media ads                                          │
│                                                                              │
│  4️⃣ High Fraud Rate:                                                       │
│     ├── Increase verification stringency                                   │
│     ├── Manual review for suspicious accounts                              │
│     ├── Lower per-job limits for new users                                 │
│     └── Implement trust score system faster                                │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## Post-Launch Roadmap

### Phase 2 Features (Week 8-12)

- [ ] Twitter/X support
- [ ] YouTube support
- [ ] Firefox extension
- [ ] Referral system
- [ ] Advanced analytics
- [ ] Leaderboard

### Phase 3 Features (Month 3-6)

- [ ] Mobile app (React Native)
- [ ] Employer API
- [ ] Bulk job posting
- [ ] Subscription plans
- [ ] White-label solution

---

## Related Documents

- [README.md](./README.md) - Project Overview
- [BUSINESS_MODEL.md](./BUSINESS_MODEL.md) - Revenue Model
- [EXTENSION_SPEC.md](./EXTENSION_SPEC.md) - Extension Details
- [DATABASE.md](./DATABASE.md) - Database Schema
- [USER_FLOWS.md](./USER_FLOWS.md) - User Journeys
