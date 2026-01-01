# MeeLike V2 - Job Marketplace

> New Model: Marketplace + Browser Extension Tracking
>
> **UI Guidelines:** Minimal, Clean, Modern - NO EMOJI, Icons Only (Lucide)

## Version Info

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                                                                              │
│  Version: 2.0 (Marketplace Model)                                           │
│                                                                              │
│  Changed from:                                                              │
│  ├── V1: Team Leader-Member (Store -> Team -> Worker)                      │
│  └── V2: Marketplace (Employer -> Platform -> Worker)                      │
│                                                                              │
│  Key Changes:                                                               │
│  ├── No Team/Team Leader system                                            │
│  ├── Browser Extension for auto job verification                           │
│  ├── Desktop-first (No mobile support)                                     │
│  ├── Revenue from % per Transaction                                        │
│  ├── Public Marketplace (ดูได้ไม่ต้อง login)                               │
│  └── Privacy-first (ซ่อนลิงค์ที่ปั้ม)                                      │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## Documentation

| File | Content |
|------|---------|
| [DESIGN_SYSTEM.md](./DESIGN_SYSTEM.md) | UI/UX Guidelines, Components, Icons |
| [BUSINESS_MODEL.md](./BUSINESS_MODEL.md) | Revenue Model, Pricing, Projections |
| [EXTENSION_SPEC.md](./EXTENSION_SPEC.md) | Browser Extension Technical Spec |
| [USER_FLOWS.md](./USER_FLOWS.md) | Employer & Worker Flows |
| [DATABASE.md](./DATABASE.md) | Database Schema |
| [TIMELINE.md](./TIMELINE.md) | Development Timeline |

---

## Core Concept

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                                                                              │
│                    MeeLike Job Marketplace                                  │
│                                                                              │
│  ┌─────────────────┐       ┌─────────────────┐       ┌─────────────────┐   │
│  │ [briefcase]     │       │ [building]      │       │ [user]          │   │
│  │ Employer        │  -->  │ Platform        │  -->  │ Worker          │   │
│  │                 │       │                 │       │                 │   │
│  │ - Post jobs     │       │ - Match jobs    │       │ - Claim jobs    │   │
│  │ • เติมเงิน      │       │ • Extension     │       │ • ทำงานผ่าน Ext │   │
│  │ • ดู Report    │       │ • Auto Verify   │       │ • รับเงิน Auto  │   │
│  └─────────────────┘       └─────────────────┘       └─────────────────┘   │
│                                                                              │
│  🧩 Browser Extension = หัวใจของระบบ                                       │
│  ├── Track ทุก Action (Like, Follow, Comment)                              │
│  ├── Screenshot + Freeze + Auto-Close (ป้องกัน Unlike)                     │
│  ├── AI Verify งานอัตโนมัติ (Gemini Flash)                                 │
│  └── จ่ายเงิน Worker ทันทีเมื่องานสำเร็จ                                   │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## User Roles & Access Levels

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                                                                              │
│  Access Levels:                                                             │
│                                                                              │
│  ┌─────────────────────────────────────────────────────────────────────┐    │
│  │  [globe] PUBLIC (ไม่ต้อง Login)                                     │    │
│  │  ────────────────────────────────────────────────────────────────── │    │
│  │  - ดู Marketplace (รายการงานทั้งหมด)                                │    │
│  │  - ดูราคา, Platform, ประเภทงาน                                      │    │
│  │  - สมัครสมาชิก                                                      │    │
│  │                                                                      │    │
│  │  [x] ไม่เห็น: URL ที่ต้องปั้ม, ข้อมูล Employer                      │    │
│  └─────────────────────────────────────────────────────────────────────┘    │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

### 1. [briefcase] Employer (ผู้ว่าจ้าง)

| Feature | รายละเอียด | ต้อง Login |
|---------|-----------|:----------:|
| ดู Marketplace | ดูงานทั้งหมดใน Platform | [x] |
| เติมเงิน | เติม Wallet ผ่าน PromptPay/Bank | [check] |
| โพสต์งาน | สร้าง Job (Like/Follow/Comment) | [check] |
| ดู Progress | ดูว่างานเสร็จกี่ % แล้ว | [check] |
| Auto Pay | เงินหักอัตโนมัติเมื่องานสำเร็จ | [check] |

**Privacy Features:**
- URL ที่โพสต์จะถูกซ่อน (Worker เห็นเฉพาะตอนทำงานผ่าน Extension)
- ไม่มีการแสดงข้อมูล Employer ให้ Public

### 2. [user] Worker (คนรับงาน)

| Feature | รายละเอียด | ต้อง Login |
|---------|-----------|:----------:|
| ดู Marketplace | ดูงานทั้งหมด + รายละเอียด | [check] |
| ติดตั้ง Extension | **บังคับ** ต้องใช้ Extension | [check] |
| รับงาน | เลือกงานจาก Marketplace | [check] |
| ทำงาน | Extension track อัตโนมัติ | [check] |
| รับเงิน | เงินเข้า Balance ทันที | [check] |
| ถอนเงิน | ถอนเข้าบัญชีธนาคาร | [check] |

**Privacy:**
- เห็น URL เฉพาะงานที่รับแล้ว + ทำผ่าน Extension เท่านั้น

---

## 🛡️ Anti-Unlike System

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                                                                              │
│  📸 ป้องกัน Unlike: Screenshot + Freeze + Auto-Close                        │
│                                                                              │
│  Flow:                                                                       │
│  ┌─────┐    ┌─────────┐    ┌─────────┐    ┌─────────┐    ┌─────────┐       │
│  │ กด  │ -> │ Freeze  │ -> │ แคปจอ  │ -> │ AI/DOM  │ -> │ ปิด Tab │       │
│  │Like │    │  หน้าจอ │    │ ทันที  │    │ Verify  │    │ อัตโนมัติ│       │
│  └─────┘    └─────────┘    └─────────┘    └─────────┘    └─────────┘       │
│                                                                              │
│  ✅ Worker ไม่มีโอกาส Unlike (Tab ปิดทันที)                                 │
│  ✅ มีหลักฐาน Screenshot ทุกงาน                                             │
│  ✅ AI ตรวจ Fake ได้ (Gemini Flash)                                         │
│  ✅ รวมเวลา ~2 วินาที (UX ดี)                                               │
│                                                                              │
│  📊 Unlike Rate: <1% (จาก ~20-30% ถ้าไม่มีระบบนี้)                         │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 💰 Revenue Model

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                                                                              │
│  💰 แหล่งรายได้:                                                            │
│                                                                              │
│  1️⃣ Job Fee (จาก Employer) - 12% ของค่างาน                                │
│     ├── Employer โพสต์งาน ฿1,000                                           │
│     ├── Platform หัก 12% = ฿120                                            │
│     └── Worker Pool ได้ = ฿880                                             │
│                                                                              │
│  2️⃣ Withdrawal Fee (จาก Worker) - ฿15 + 3%                                │
│     ├── Worker ถอน ฿1,000                                                  │
│     ├── หัก ฿15 + 3% = ฿45                                                 │
│     └── ได้รับจริง = ฿955                                                  │
│                                                                              │
│  📊 รวม Platform Margin: ~15% ต่อ Transaction                              │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## URL Structure

### Public (ไม่ต้อง Login)

```
/                           → Landing Page
/marketplace                → [star] ดูงานทั้งหมด (Public)
/login                      → เข้าสู่ระบบ
/register                   → สมัครสมาชิก (เลือก Employer/Worker)
/extension                  → Download Extension
```

**Marketplace แสดงอะไร?**
```
┌─────────────────────────────────────────────────────────────────────────────┐
│                                                                              │
│  [globe] Public View (/marketplace):                                        │
│                                                                              │
│  ┌─────────────────────────────────────────────────────────────────────┐    │
│  │  [thumbs-up] Facebook Like                              0.25/like   │    │
│  │  Platform: Facebook                                                  │    │
│  │  เหลือ: 77 slots                                                     │    │
│  │  [lock] Login เพื่อรับงาน                                           │    │
│  └─────────────────────────────────────────────────────────────────────┘    │
│                                                                              │
│  [x] ไม่แสดง:                                                               │
│  - URL ของโพสต์/โปรไฟล์                                                     │
│  - ข้อมูล Employer                                                          │
│  - รายละเอียดอื่นๆ                                                          │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Employer Dashboard (ต้อง Login)

```
/employer                   → Dashboard
├── /jobs                   → งานของฉัน
│   ├── /new                → โพสต์งานใหม่
│   └── /[id]               → รายละเอียดงาน
├── /wallet                 → การเงิน
│   ├── /topup              → เติมเงิน
│   └── /history            → ประวัติ
└── /settings               → ตั้งค่า
```

### Worker Dashboard (ต้อง Login + Extension)

```
/worker                     → Dashboard
├── /jobs                   → Marketplace งาน (เห็นมากกว่า Public)
│   └── /[id]               → รายละเอียดงาน
├── /my-jobs                → งานที่รับ (เห็น URL ตรงนี้)
├── /earnings               → รายได้
│   ├── /withdraw           → ถอนเงิน
│   └── /history            → ประวัติ
├── /profile                → โปรไฟล์
└── /leaderboard            → กระดานผู้นำ
```

---

## 🧩 Browser Extension

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                                                                              │
│  🧩 MeeLike Extension:                                                      │
│                                                                              │
│  Supported Browsers:                                                        │
│  ├── ✅ Google Chrome                                                       │
│  ├── ✅ Microsoft Edge                                                      │
│  ├── ✅ Brave                                                               │
│  └── ⚠️ Firefox (Phase 2)                                                  │
│                                                                              │
│  Supported Platforms:                                                       │
│  ├── ✅ Facebook (Like, Follow, Comment, Share)                            │
│  ├── ✅ Instagram (Like, Follow, Comment)                                  │
│  ├── ✅ TikTok (Like, Follow, Comment)                                     │
│  ├── ✅ Twitter/X (Like, Follow, Retweet, Comment)                         │
│  └── ⚠️ YouTube (Phase 2)                                                  │
│                                                                              │
│  Features:                                                                  │
│  ├── 🎯 Auto-detect งานที่ต้องทำ                                           │
│  ├── 📊 Track actions (Like, Follow, etc.)                                 │
│  ├── ✅ Auto-verify เมื่อทำสำเร็จ                                          │
│  ├── 💰 แสดงเงินที่ได้ Real-time                                           │
│  └── 🔔 Notification งานใหม่                                               │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 📊 Comparison: V1 vs V2

| เกณฑ์ | V1 (แม่ทีม) | V2 (Marketplace) |
|-------|-------------|------------------|
| **โครงสร้าง** | Store → Team → Worker | Employer → Worker |
| **Roles** | 5+ (Owner, Admin, Lead, Assistant, Worker) | 2 (Employer, Worker) |
| **QC** | แม่ทีมตรวจ (ฟรี) | Extension ตรวจ Auto |
| **Device** | Mobile + Desktop | Desktop Only |
| **Pages** | 30+ pages | ~15 pages |
| **Dev Time** | 8-10 สัปดาห์ | 4-6 สัปดาห์ |
| **Revenue/GMV** | 11% | 15% |
| **Scale** | ติด Ceiling (หาแม่ทีม) | ไม่มี Ceiling |

---

## 🚀 Why V2?

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                                                                              │
│  ✅ ข้อดีของ V2:                                                            │
│                                                                              │
│  1. Simple                                                                  │
│     ├── 2 Roles แทน 5+ Roles                                               │
│     ├── ไม่มีระบบ Team ซับซ้อน                                             │
│     └── Dev เร็วกว่า 50%                                                   │
│                                                                              │
│  2. Scalable                                                                │
│     ├── ไม่ต้องหาแม่ทีม                                                    │
│     ├── Worker สมัครเองได้เลย                                              │
│     └── Network Effect แรง                                                 │
│                                                                              │
│  3. Auto QC                                                                 │
│     ├── Extension ตรวจงาน 100%                                             │
│     ├── ไม่ต้องจ้างคน QC                                                   │
│     └── จ่ายเงินทันทีเมื่องานสำเร็จ                                        │
│                                                                              │
│  4. Higher Margin                                                           │
│     ├── เก็บ 12% Job Fee + 3% Withdrawal                                   │
│     └── ~15% total margin                                                  │
│                                                                              │
│  ─────────────────────────────────────────────────────────────────────────  │
│                                                                              │
│  ⚠️ Trade-off:                                                              │
│                                                                              │
│  1. Desktop Only → เสีย Mobile users 70%                                   │
│  2. Extension Dev → ต้อง maintain ต่อเนื่อง                                │
│  3. Platform Risk → Social Media อาจ block                                 │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 📅 Timeline Overview

| Phase | ระยะเวลา | Deliverable |
|-------|---------|-------------|
| **Phase 1** | 2 สัปดาห์ | Extension POC + Core API |
| **Phase 2** | 2 สัปดาห์ | Employer Dashboard |
| **Phase 3** | 2 สัปดาห์ | Worker Dashboard + Extension Full |
| **Phase 4** | 1 สัปดาห์ | Testing + Launch |
| **Total** | **7 สัปดาห์** | Production Ready |

---

## 📁 Folder Structure (This Doc)

```
docs/v2-marketplace/
├── README.md                   ← คุณอยู่ที่นี่
├── BUSINESS_MODEL.md           → Revenue, Pricing, Projections
├── EXTENSION_SPEC.md           → Technical Spec for Extension
├── USER_FLOWS.md               → Employer & Worker Flows
├── DATABASE.md                 → Database Schema
└── TIMELINE.md                 → Development Plan
```
