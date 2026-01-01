# 🎯 MeeLike Platform - Documentation

> เอกสารประกอบการพัฒนา MeeLike Platform

## ⚠️ Project Type: Prototype

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                                                                              │
│  📋 ประเภทโปรเจค: Prototype (ไม่เชื่อม Backend จริง)                        │
│                                                                              │
│  ✅ สิ่งที่ทำ:                                                               │
│  ├── UI/UX ครบทุกหน้า                                                        │
│  ├── Mock Data สำหรับทดสอบ Flow                                              │
│  ├── LocalStorage สำหรับเก็บข้อมูลชั่วคราว                                   │
│  └── Interactive Prototype ที่ใช้งานได้จริง                                  │
│                                                                              │
│  ❌ สิ่งที่ไม่ทำ (Phase นี้):                                                │
│  ├── Backend API                                                             │
│  ├── Database จริง                                                           │
│  ├── Payment Gateway จริง                                                    │
│  ├── LINE Login/Notify จริง                                                  │
│  └── AI Verification จริง                                                    │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 📚 Documentation Index

### 🎨 Design

| ไฟล์ | เนื้อหา |
|------|---------|
| [DESIGN_SYSTEM.md](./design/DESIGN_SYSTEM.md) | Colors, Typography, Components |
| [UI_WIREFRAMES.md](./design/UI_WIREFRAMES.md) | UI Mockups, Wireframes |

### ⚙️ Features

| ไฟล์ | เนื้อหา |
|------|---------|
| [SELLER_CENTER.md](./features/SELLER_CENTER.md) | Seller Dashboard, Orders, Services |
| [WORKER_APP.md](./features/WORKER_APP.md) | Worker Dashboard, Jobs, Earnings |
| [STORE.md](./features/STORE.md) | Public Store Pages |
| [TEAM_MANAGEMENT.md](./features/TEAM_MANAGEMENT.md) | **Team System, Roles, Permissions** |

### 🔧 Technical

| ไฟล์ | เนื้อหา |
|------|---------|
| [DATABASE.md](./technical/DATABASE.md) | TypeScript Interfaces, Schema |
| [TIMELINE.md](./technical/TIMELINE.md) | Development Phases, Checklist |

### 💼 Business

| ไฟล์ | เนื้อหา |
|------|---------|
| [REVENUE_MODEL.md](./business/REVENUE_MODEL.md) | Pricing, Plans, Projections |
| [VIRAL_MARKETING.md](./business/VIRAL_MARKETING.md) | Referral, Gamification, Growth |

---

## 📋 Overview

**MeeLike Platform** คือแพลตฟอร์มที่รวมทุกอย่างสำหรับธุรกิจ Social Media Engagement

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                                                                              │
│                       🎯 MeeLike Platform                                   │
│                    "แพลตฟอร์มครบวงจร"                                       │
│                                                                              │
│  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐              │
│  │ 🏪 Seller       │  │ 👤 Worker       │  │ 🛒 Buyer        │              │
│  │    Center       │  │    App          │  │    (ลูกค้า)     │              │
│  │                 │  │                 │  │                 │              │
│  │ • ขาย Bot      │  │ • รับงาน        │  │ • ซื้อบริการ    │              │
│  │ • ขายคนจริง    │  │ • ส่งงาน        │  │ • ซื้อบัญชี     │              │
│  │ • ขายบัญชี     │  │ • ถอนเงิน       │  │                 │              │
│  │ • บริหารทีม    │  │                 │  │                 │              │
│  └─────────────────┘  └─────────────────┘  └─────────────────┘              │
│                                                                              │
│                         🔗 MeeLike API                                      │
│                    (สำหรับบริการ Bot)                                       │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 👤 User Roles

### 1. 🏪 Seller (ผู้ขาย / แม่ทีม)

- มี 1 Store + หลาย Teams ได้
- ขายบริการ Bot หรือ คนจริง
- บริหารทีม Worker
- จ่าย Subscription รายเดือน

### 2. 👤 Worker (ลูกทีม)

- เข้าร่วมได้หลายทีม
- จองงาน / ส่งงาน / รับเงิน
- สะสม Level & Achievements
- ใช้ฟรี (Platform เก็บ Withdrawal fee)

### 3. 🛒 Buyer (ลูกค้า)

- เข้าหน้าร้าน Seller
- สั่งซื้อบริการ
- ติดตามสถานะ

---

## 🏗️ URL Structure

### Seller Center

```
/seller                         → Dashboard รวม
├── /orders                     → ออเดอร์
├── /services                   → บริการ
├── /store                      → ตั้งค่าร้าน
├── /finance                    → การเงิน
├── /settings                   → ตั้งค่า
└── /team                       → 🎯 เลือกทีม
    └── /[id]                   → Dashboard ทีม
        ├── /members            → สมาชิก
        ├── /jobs               → งาน
        ├── /review             → ตรวจงาน
        ├── /payouts            → จ่ายเงิน
        └── /settings           → ตั้งค่าทีม
```

### Worker App

```
/work                           → Dashboard
├── /teams                      → ทีมของฉัน
├── /jobs                       → งานทั้งหมด
├── /earnings                   → รายได้
├── /profile                    → โปรไฟล์
├── /accounts                   → บัญชี Social
├── /leaderboard                → กระดานผู้นำ
└── /referral                   → ชวนเพื่อน
```

### Hub (Community)

```
/hub                            → Hub Center
├── /recruit                    → ทีมรับสมาชิก
├── /find-team                  → หาทีม
├── /outsource                  → งานจ้างนอก
├── /post/[id]                  → รายละเอียดโพสต์
└── /team/[id]                  → โปรไฟล์ทีม
```

### Public Store

```
/s/[slug]                       → หน้าร้าน
├── /order                      → สั่งซื้อ
└── /status                     → เช็คสถานะ
```

---

## 💰 Revenue Model

| แหล่งรายได้ | จาก | อัตรา |
|------------|-----|-------|
| Subscription | Seller | ฿0-799/เดือน |
| Order Fee | Seller | 2-10% ตามแพ็กเกจ |
| Withdrawal Fee | Worker | ฿15 + 2-5% ตาม Level |

---

## 📁 Folder Structure

```
docs/
├── README.md                   ← คุณอยู่ที่นี่
├── design/
│   ├── DESIGN_SYSTEM.md
│   └── UI_WIREFRAMES.md
├── features/
│   ├── SELLER_CENTER.md
│   ├── WORKER_APP.md
│   ├── STORE.md
│   └── TEAM_MANAGEMENT.md
├── technical/
│   ├── DATABASE.md
│   └── TIMELINE.md
└── business/
    ├── REVENUE_MODEL.md
    └── VIRAL_MARKETING.md
```

---

## 🚀 Quick Start

1. **Seller** → อ่าน [SELLER_CENTER.md](./features/SELLER_CENTER.md) + [TEAM_MANAGEMENT.md](./features/TEAM_MANAGEMENT.md)
2. **Worker** → อ่าน [WORKER_APP.md](./features/WORKER_APP.md)
3. **Design** → อ่าน [UI_WIREFRAMES.md](./design/UI_WIREFRAMES.md)
4. **Technical** → อ่าน [DATABASE.md](./technical/DATABASE.md) + [TIMELINE.md](./technical/TIMELINE.md)
