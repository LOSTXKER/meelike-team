# 🏪 Public Store

> หน้าร้านค้าสำหรับลูกค้า

## 📋 สารบัญ

1. [Overview](#overview)
2. [Store Front](#store-front)
3. [Order Flow](#order-flow)
4. [Order Tracking](#order-tracking)

---

## Overview

Public Store คือหน้าร้านที่ลูกค้าเข้ามาซื้อบริการ

```
/s/[slug]               → หน้าร้าน
/s/[slug]/order         → สั่งซื้อ
/s/[slug]/status        → เช็คสถานะ
```

---

## Store Front

### URL Structure

```
meelike.me/s/johnboost
meelike.me/s/socialking
meelike.me/s/tiktok-pro
```

### Store Header

แสดง:
- Logo ร้าน
- ชื่อร้าน
- คำอธิบาย
- Contact Info
- Rating

### Service Categories

จัดกลุ่มบริการตาม:
- Platform (TikTok, Instagram, etc.)
- Type (Like, Follow, View, etc.)

### Service Card

แสดง:
- ชื่อบริการ
- ราคา (ต่อ 1000)
- เวลาส่งมอบ
- Rating
- ปุ่มสั่งซื้อ

### Flash Sale

โปรโมชั่นพิเศษ:
- ลดราคา %
- ระยะเวลา
- จำนวนจำกัด

---

## Order Flow

### Step 1: Select Service

- เลือกบริการที่ต้องการ
- ดูรายละเอียด

### Step 2: Configure Order

- ใส่ Target URL
- เลือกจำนวน
- ดูราคารวม

### Step 3: Customer Info

- ชื่อ (optional)
- Email (optional)
- LINE ID (optional)

### Step 4: Payment

วิธีชำระเงิน:
- PromptPay QR
- โอนธนาคาร
- True Money Wallet
- Credit Card (Coming Soon)

### Step 5: Confirmation

- Order ID
- รายละเอียดออเดอร์
- Link ติดตามสถานะ

---

## Order Tracking

### Status Page (`/s/[slug]/status`)

ลูกค้าใส่ Order ID เพื่อเช็คสถานะ

### Order Statuses

| Status | คำอธิบาย |
|--------|----------|
| pending | รอชำระเงิน |
| paid | ชำระเงินแล้ว รอดำเนินการ |
| processing | กำลังดำเนินการ |
| completed | เสร็จสิ้น |
| cancelled | ยกเลิก |

### Progress Display

แสดง:
- สถานะปัจจุบัน
- จำนวนที่ทำเสร็จ / ทั้งหมด
- เวลาที่คาดว่าจะเสร็จ

---

## Customer Experience

### Guest Checkout

- ไม่ต้องสมัครสมาชิก
- สั่งซื้อได้เลย
- ติดตามด้วย Order ID

### Notifications

แจ้งเตือนผ่าน:
- LINE (ถ้าให้ LINE ID)
- Email (ถ้าให้ Email)

### Support

- Contact Seller via LINE
- Contact Seller via Facebook

---

## Related Documents

- [SELLER_CENTER.md](./SELLER_CENTER.md) - Seller จัดการ Store
- [UI_WIREFRAMES.md](../design/UI_WIREFRAMES.md) - UI Mockups
