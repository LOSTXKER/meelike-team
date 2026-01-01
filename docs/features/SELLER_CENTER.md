# 🏪 Seller Center

> ระบบจัดการสำหรับ Seller

## 📋 สารบัญ

1. [Overview](#overview)
2. [Dashboard](#dashboard)
3. [Order Management](#order-management)
4. [Service Management](#service-management)
5. [Store Settings](#store-settings)
6. [Finance](#finance)
7. [Settings](#settings)

---

## Overview

Seller Center คือส่วนจัดการหลักสำหรับ Seller ในการ:
- จัดการออเดอร์จากลูกค้า
- จัดการบริการที่เปิดขาย
- ตั้งค่าร้านค้า
- จัดการการเงิน

```
/seller                 → Dashboard
/seller/orders          → จัดการออเดอร์
/seller/services        → จัดการบริการ
/seller/store           → ตั้งค่าร้านค้า
/seller/finance         → การเงิน
/seller/settings        → ตั้งค่าบัญชี
```

> 📌 **หมายเหตุ**: การจัดการทีมแยกไปที่ `/seller/team` - ดู [TEAM_MANAGEMENT.md](./TEAM_MANAGEMENT.md)

---

## Dashboard

### Stats Overview

| Stat | คำอธิบาย |
|------|----------|
| ยอดขายวันนี้ | รายได้จากออเดอร์วันนี้ |
| ออเดอร์รอดำเนินการ | ออเดอร์ที่ต้องจัดการ |
| Wallet Balance | ยอดเงินในกระเป๋า |
| ทีมทั้งหมด | จำนวนทีมที่มี |

### Quick Actions

- สร้างออเดอร์ใหม่
- ดูออเดอร์รอดำเนินการ
- เติมเงิน

### Widgets

1. **Recent Orders** - ออเดอร์ล่าสุด 5 รายการ
2. **Team Overview** - ภาพรวมทีมทั้งหมด

---

## Order Management

### Order vs Job

```
┌─────────────────────────────────────────────────────────────────────────┐
│                                                                         │
│  📦 Order (ออเดอร์)                  📋 Job (งาน)                       │
│                                                                         │
│  ├── จากลูกค้า                       ├── จาก Seller                     │
│  ├── มี 1 Order Item ขึ้นไป          ├── มอบหมายให้ทีม                   │
│  ├── Track โดย Customer             ├── Track โดย Team                  │
│  └── Status: pending/processing/    └── Status: open/claimed/           │
│             completed/cancelled            submitted/approved/paid      │
│                                                                         │
│  Flow:                                                                  │
│  Customer สั่ง Order → Seller สร้าง Job → Worker ทำงาน                  │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

### Order Statuses

| Status | คำอธิบาย | สี |
|--------|----------|-----|
| pending | รอดำเนินการ | 🟡 Yellow |
| processing | กำลังดำเนินการ | 🔵 Blue |
| completed | เสร็จสิ้น | 🟢 Green |
| cancelled | ยกเลิก | 🔴 Red |

### Order List (`/seller/orders`)

- ค้นหาด้วย Order ID, ชื่อลูกค้า
- กรองตาม Status, วันที่
- เรียงตาม วันที่, ยอดเงิน

### Order Detail (`/seller/orders/[id]`)

แสดง:
- ข้อมูลออเดอร์
- Order Items
- Activity Log
- Customer Info
- Payment Info

Actions:
- ยืนยันการชำระเงิน
- มอบหมายงานให้ทีม (สำหรับบริการคนจริง)
- ส่ง Bot API (สำหรับบริการ Bot)

### Create Order (`/seller/orders/new`)

สร้างออเดอร์ Manual สำหรับลูกค้าที่สั่งนอกระบบ

---

## Service Management

### Service Types

```
┌─────────────────────────────────────────────────────────────────────────┐
│                                                                         │
│  🤖 Bot Service                      👥 Human Service                   │
│                                                                         │
│  ├── ดึงจาก MeeLike API              ├── ทำโดยทีม Worker                 │
│  ├── เร็ว ราคาถูก                    ├── คุณภาพสูง คนจริง                │
│  ├── ไม่ต้องมีทีม                    ├── ต้องมีทีม                       │
│  └── Auto-process                    └── Manual review                   │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

### Service List (`/seller/services`)

- ค้นหาบริการ
- กรองตาม Platform, Type, Status
- เปิด/ปิดบริการ
- แก้ไขราคา

### Add/Edit Service

Fields:
- ชื่อบริการ
- Platform (TikTok, Instagram, etc.)
- ประเภท (Bot/Human)
- ราคาต่อหน่วย
- จำนวนขั้นต่ำ/สูงสุด
- เวลาส่งมอบ
- คำอธิบาย

---

## Store Settings

### Store Settings (`/seller/store`)

| Setting | คำอธิบาย |
|---------|----------|
| ชื่อร้าน | Display name |
| Logo | รูปโปรไฟล์ร้าน |
| Store URL | `meelike.me/s/[slug]` |
| Theme | สีและธีม |
| Description | คำอธิบายร้าน |
| Contact Info | LINE, Facebook, etc. |

### Public Store

URL: `meelike.me/s/[slug]`

แสดง:
- โปรไฟล์ร้าน
- รายการบริการ
- Flash Sale (ถ้ามี)
- รีวิว

---

## Finance

### Finance Overview (`/seller/finance`)

| Stat | คำอธิบาย |
|------|----------|
| Wallet Balance | ยอดเงินคงเหลือ |
| Pending | รอดำเนินการ |
| This Month | รายได้เดือนนี้ |
| Total Paid | จ่ายทีมทั้งหมด |

### Top Up (`/seller/finance/topup`)

วิธีเติมเงิน:
- PromptPay QR
- โอนธนาคาร
- True Money Wallet

### Transaction History (`/seller/finance/history`)

ประเภทธุรกรรม:
- เติมเงิน
- รายได้จากออเดอร์
- จ่ายค่าแพ็กเกจ
- จ่ายทีม

---

## Settings

### Account Settings (`/seller/settings`)

- Profile (ชื่อ, Email, Avatar)
- Password
- Notifications

### Subscription (`/seller/settings/subscription`)

- แพ็กเกจปัจจุบัน
- Upgrade/Downgrade
- Billing History

### API Settings (`/seller/settings/api`)

- API Keys
- Webhook URL
- IP Whitelist

---

## Related Documents

- [TEAM_MANAGEMENT.md](./TEAM_MANAGEMENT.md) - ระบบจัดการทีม
- [STORE.md](./STORE.md) - Public Store Pages
- [UI_WIREFRAMES.md](../design/UI_WIREFRAMES.md) - UI Mockups
