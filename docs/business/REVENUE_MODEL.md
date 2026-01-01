# 💰 Revenue Model

> โมเดลรายได้ของ MeeLike Platform

## 📋 สารบัญ

1. [Overview](#overview)
2. [Seller Plans](#seller-plans)
3. [Order Fee](#order-fee)
4. [Worker Fee](#worker-fee)
5. [Break-even Analysis](#break-even-analysis)
6. [Projections](#projections)

---

## Overview

### Revenue Streams

```
┌─────────────────────────────────────────────────────────────────────────┐
│                                                                         │
│  💰 แหล่งรายได้ของ Platform:                                            │
│                                                                         │
│  1️⃣ Subscription รายเดือน (จาก Seller)                                 │
│     └── ฿0 - ฿799/เดือน ตามแพ็กเกจ                                     │
│                                                                         │
│  2️⃣ Order Fee % ต่อยอดขาย (จาก Seller)                                 │
│     └── 2% - 10% ตามแพ็กเกจ                                            │
│                                                                         │
│  3️⃣ Withdrawal Fee (จาก Worker)                                        │
│     └── ฿15 + 2-5% ตาม Level                                           │
│                                                                         │
│  4️⃣ Bot API Margin (Future)                                           │
│     └── ส่วนต่างจากการขาย Bot Service                                  │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

---

## Seller Plans

### Plan Comparison

| แพ็กเกจ | ราคา/เดือน | Order Fee | Bot Orders | ทีม | บัญชีขาย | Analytics |
|---------|-----------|-----------|------------|-----|----------|-----------|
| 🆓 Free | ฿0 | **10%** | 30/เดือน | ❌ | ❌ | Basic |
| 🌟 Starter | ฿149 | **7%** | 200/เดือน | 20 คน | 10 รายการ | Basic |
| 💎 Pro | ฿399 | **5%** | ไม่จำกัด | 100 คน | 50 รายการ | Pro |
| 🏢 Business | ฿799 | **2%** | ไม่จำกัด | ไม่จำกัด | ไม่จำกัด | Pro + API |

### Feature Breakdown

#### 🆓 Free Plan

- ✅ หน้าร้านพื้นฐาน
- ✅ Bot Orders 30 ครั้ง/เดือน
- ✅ Basic Analytics
- ❌ ไม่มีทีม
- ❌ ไม่ขายบัญชีได้
- 📊 Order Fee: 10%

#### 🌟 Starter Plan - ฿149/เดือน

- ✅ หน้าร้านปรับแต่งได้
- ✅ Bot Orders 200 ครั้ง/เดือน
- ✅ ทีมได้ 20 คน
- ✅ ขายบัญชี 10 รายการ
- ✅ Basic Analytics
- 📊 Order Fee: 7%

#### 💎 Pro Plan - ฿399/เดือน

- ✅ หน้าร้านปรับแต่งเต็มที่
- ✅ Bot Orders ไม่จำกัด
- ✅ ทีมได้ 100 คน
- ✅ ขายบัญชี 50 รายการ
- ✅ Pro Analytics
- 📊 Order Fee: 5%

#### 🏢 Business Plan - ฿799/เดือน

- ✅ ทุกอย่างใน Pro
- ✅ ทีมไม่จำกัด
- ✅ ขายบัญชีไม่จำกัด
- ✅ API Access
- ✅ Priority Support
- 📊 Order Fee: 2%

---

## Order Fee

### How it works

```
ลูกค้าสั่ง ฿1,000

┌─────────────────────────────────────────────────────────────────────────┐
│                                                                         │
│  Free Plan (10%):                                                       │
│  ├── Platform Fee: ฿100                                                │
│  └── Seller ได้: ฿900                                                  │
│                                                                         │
│  Pro Plan (5%):                                                         │
│  ├── Platform Fee: ฿50                                                 │
│  └── Seller ได้: ฿950                                                  │
│                                                                         │
│  Business Plan (2%):                                                    │
│  ├── Platform Fee: ฿20                                                 │
│  └── Seller ได้: ฿980                                                  │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

---

## Worker Fee

### Withdrawal Fee by Level

| Level | งานสำเร็จ | ค่าคงที่ | % | ตัวอย่าง (ถอน ฿1,000) |
|-------|----------|---------|---|---------------------|
| 🥉 Bronze | 0-50 | ฿15 | 5% | ได้ ฿935 |
| 🥈 Silver | 51-200 | ฿15 | 3.5% | ได้ ฿950 |
| 🥇 Gold | 201-500 | ฿15 | 3% | ได้ ฿955 |
| 💎 Platinum | 501-1K | ฿15 | 2.5% | ได้ ฿960 |
| 👑 VIP | 1K+ | ฿15 | 2% | ได้ ฿965 |

### Fee Structure

```
ค่าถอน = ฿15 (คงที่) + X% (ตาม Level)

ค่าคงที่ ฿15 = ต้นทุน API ถอนเงิน
X% = กำไร Platform
```

---

## Break-even Analysis

### เมื่อไหร่ควรอัพเกรด?

```
┌─────────────────────────────────────────────────────────────────────────┐
│                                                                         │
│  📊 จุดคุ้มทุน (Break-even):                                            │
│                                                                         │
│  ยอดขาย/เดือน                                                          │
│  │                                                                      │
│  │  ฿20,000+ ──────────────────────────────────► 🏢 Business (2%)      │
│  │                                                                      │
│  │  ฿12,500+ ──────────────────────► 💎 Pro (5%)                       │
│  │                                                                      │
│  │  ฿4,967+ ─────────► 🌟 Starter (7%)                                 │
│  │                                                                      │
│  │  <฿5,000 ──► 🆓 Free (10%)                                          │
│  │                                                                      │
│  └──────────────────────────────────────────────────────────────────    │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

### Example: ฿50,000/เดือน

| แพ็กเกจ | Subscription | Order Fee | รวมจ่าย | ประหยัด |
|---------|-------------|-----------|---------|---------|
| Free | ฿0 | ฿5,000 (10%) | ฿5,000 | - |
| Starter | ฿149 | ฿3,500 (7%) | ฿3,649 | ฿1,351 |
| Pro | ฿399 | ฿2,500 (5%) | ฿2,899 | ฿2,101 |
| **Business** | ฿799 | ฿1,000 (2%) | **฿1,799** | **฿3,201** ✅ |

---

## Projections

### Year 1 Projections

| Metric | Month 1 | Month 6 | Month 12 |
|--------|---------|---------|----------|
| Active Sellers | 50 | 500 | 2,000 |
| Active Workers | 200 | 3,000 | 15,000 |
| GMV | ฿500K | ฿5M | ฿25M |
| Platform Revenue | ฿35K | ฿350K | ฿1.5M |

### Revenue Breakdown (Month 12)

| Source | Amount | % |
|--------|--------|---|
| Subscription | ฿400K | 27% |
| Order Fee | ฿750K | 50% |
| Withdrawal Fee | ฿300K | 20% |
| Other | ฿50K | 3% |
| **Total** | **฿1.5M** | 100% |

### Seller Distribution (Month 12)

| Plan | Count | Revenue |
|------|-------|---------|
| Free | 1,200 (60%) | ฿0 |
| Starter | 500 (25%) | ฿74,500 |
| Pro | 200 (10%) | ฿79,800 |
| Business | 100 (5%) | ฿79,900 |
| **Total** | **2,000** | **฿234,200** |

---

## Competitive Analysis

### vs. Direct Competitors

| Feature | MeeLike | Competitor A | Competitor B |
|---------|---------|--------------|--------------|
| Subscription | ฿0-799 | ฿299-999 | ฿0-599 |
| Order Fee | 2-10% | 5-15% | 3-8% |
| Team Feature | ✅ | ❌ | ⚠️ Limited |
| Bot + Human | ✅ | Bot only | Human only |
| Worker App | ✅ | ❌ | ⚠️ Basic |

### Our Advantages

1. **Lower Entry Barrier** - Free plan ใช้งานได้จริง
2. **Team Management** - ระบบทีมครบครัน
3. **Hybrid Model** - Bot + Human ในที่เดียว
4. **Worker Ecosystem** - Gamification, Referral

---

## Related Documents

- [VIRAL_MARKETING.md](./VIRAL_MARKETING.md) - Marketing & Referral
- [SELLER_CENTER.md](../features/SELLER_CENTER.md) - Seller Features
- [WORKER_APP.md](../features/WORKER_APP.md) - Worker Features
