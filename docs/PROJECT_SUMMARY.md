# MeeLike - Project Summary

> สรุปโปรเจคสำหรับปรึกษาผู้เชี่ยวชาญ
> 
> วันที่: 2 มกราคม 2026

---

## 1. Overview

### MeeLike คืออะไร?

**Marketplace สำหรับซื้อ-ขาย Social Media Engagement**

- ผู้ว่าจ้าง (Employer) โพสต์งาน: ต้องการ Like/Follow/Comment
- คนรับงาน (Worker) ทำงาน: กด Like/Follow/Comment แล้วได้เงิน
- Platform เก็บค่าธรรมเนียม

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                                                                              │
│  Employer ──── โพสต์งาน ────> Platform ──── แจกงาน ────> Workers            │
│      │                           │                           │              │
│      │                           │                           │              │
│      └─── จ่ายเงิน ──────────────┘                           │              │
│                                  │                           │              │
│                                  └─── จ่ายค่าจ้าง ───────────┘              │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Target Market

- **ไทย** เป็นหลัก
- Employer: ร้านค้าออนไลน์, Influencer, Agency
- Worker: นักศึกษา, แม่บ้าน, คนว่างงาน, ต้องการรายได้เสริม

### ราคาตลาด (ไทย)

| Service | ราคาขาย | ค่าจ้าง Worker |
|---------|---------|----------------|
| Facebook Like | 0.40-0.60 บาท | 0.20 บาท |
| Instagram Follow | 0.50-0.80 บาท | 0.25-0.35 บาท |
| TikTok Like | 0.30-0.50 บาท | 0.15-0.20 บาท |
| Comment | 1.00-3.00 บาท | 0.50-1.50 บาท |

---

## 2. Business Models ที่พิจารณา

### Model A: แม่ทีม-ลูกทีม (V1)

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                                                                              │
│  ลูกค้า ──> แม่ทีม (Seller) ──> Platform ──> Workers (ลูกทีม)               │
│                                                                              │
│  โครงสร้าง:                                                                 │
│  ├── แม่ทีมรับงานจากลูกค้า (นอก Platform)                                  │
│  ├── แม่ทีมสร้างทีม Worker                                                  │
│  ├── แม่ทีมโพสต์งานให้ลูกทีม                                               │
│  └── แม่ทีมตรวจงาน (QC)                                                    │
│                                                                              │
│  Revenue:                                                                   │
│  ├── เดิม: 11% จากยอดขาย (GMV)                                             │
│  └── ปัญหา: แม่ทีมรับเงินนอกระบบ → หลบ Fee ได้                             │
│                                                                              │
│  ถ้าแก้เป็น: 12% จากค่าจ้าง Worker                                         │
│  └── ไม่มีช่องโหว่ (เงินต้องผ่าน Platform)                                 │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘

ข้อดี:
├── QC ฟรี (แม่ทีมตรวจให้)
├── รองรับ Mobile
└── Dev ง่าย

ข้อเสีย:
├── Scale ยาก (ต้องหาแม่ทีม)
├── แม่ทีมออก = เสีย Worker ทั้งทีม
└── ถ้าเก็บ % จาก GMV → หลบ Fee ได้
```

### Model B: Pool Worker / Marketplace (V2)

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                                                                              │
│  Employer ──> Platform ──> Workers (Pool)                                   │
│                                                                              │
│  โครงสร้าง:                                                                 │
│  ├── ไม่มีแม่ทีม                                                           │
│  ├── Employer โพสต์งานตรง                                                  │
│  ├── Worker รับงานจาก Marketplace                                          │
│  └── Platform ตรวจงาน (QC)                                                 │
│                                                                              │
│  Revenue:                                                                   │
│  ├── Job Fee: 12% จาก Employer                                             │
│  └── Withdrawal Fee: 2.5-5% จาก Worker (ตาม Level)                         │
│  รวม: ~14.5-17% ต่อ Transaction                                            │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘

ข้อดี:
├── Scale ง่าย (ไม่ต้องหาแม่ทีม)
├── Network Effect แรง
├── เงินทุกบาทผ่าน Platform (หลบ Fee ไม่ได้)
└── Worker/Employer อิสระ

ข้อเสีย:
├── QC ต้องทำเอง (ปัญหาใหญ่!)
├── ถ้าใช้ Extension → Desktop Only (เสีย Mobile 70%)
└── Dev ซับซ้อนกว่า
```

---

## 3. ปัญหาหลัก: Quality Control (QC)

### ทำไม QC สำคัญ?

```
ถ้าไม่มี QC:
├── Worker โกง: ไม่ Like แต่บอกว่า Like แล้ว
├── Worker Unlike: Like แล้ว Unlike ทีหลัง
├── Worker ใช้รูปเก่า: เอารูปที่ Like ไปแล้วมาส่งซ้ำ
└── Employer เสียเงินฟรี → ไม่กลับมาใช้
```

### วิธี QC ที่พิจารณา

#### Option 1: Browser Extension

```
วิธีการ:
├── Worker ติดตั้ง Extension บน Chrome/Edge
├── Extension Track ทุก Action (Like/Follow)
├── เมื่อกด Like → แคปหน้าจอ → ปิด Tab ทันที
└── ป้องกัน Unlike ได้ 100%

ข้อดี:
├── ป้องกัน Fraud ได้ 99%
├── อัตโนมัติ
└── Real-time Verification

ข้อเสีย:
├── Desktop Only (เสีย Mobile 70% ของตลาด)
├── Social Media อาจ Block
├── ต้อง Maintain ตาม Update ของ FB/IG/TikTok
└── Dev ซับซ้อน

Risk: สูง (อาจถูก Block)
```

#### Option 2: Screenshot + AI Verify

```
วิธีการ:
├── Worker ทำงาน → แคปหน้าจอ
├── Upload รูป
├── AI (Gemini/GPT-4V) ตรวจว่า Like จริงไหม
└── ถ้าผ่าน → จ่ายเงิน

ข้อดี:
├── รองรับ Mobile
├── ไม่เสี่ยงถูก Block

ข้อเสีย:
├── ค่า AI (~0.01-0.05 บาท/รูป)
├── UX แย่ (ต้อง Upload ทุกงาน)
├── ไม่ป้องกัน Unlike
└── ** โกงได้: เอารูปเก่ามาส่งซ้ำ **

Risk: ปานกลาง (มีช่องโหว่)
```

#### Option 3: Mobile App (WebView)

```
วิธีการ:
├── Worker ใช้ App ของเรา
├── App เปิด Facebook/IG ใน WebView
├── เมื่อกด Like → App แคปเองทันที
└── ส่งรูป + Device ID + Timestamp

ข้อดี:
├── รองรับ Mobile
├── ควบคุมได้ 100%
├── แคป Auto (UX ดี)

ข้อเสีย:
├── ต้อง Dev Mobile App (iOS + Android)
├── Social Media อาจ Block WebView
├── Maintenance สูง
└── App Store อาจ Reject

Risk: สูง (ถูก Block + Reject)
```

#### Option 4: Trust Score + Penalty + Buffer

```
วิธีการ:
├── ไว้ใจ Worker ก่อน
├── จ่ายเงินทันทีเมื่อบอกว่าเสร็จ
├── Employer สุ่มตรวจ 5-10%
├── ถ้าโกง: หักเงิน 3-5x + ลด Trust Score + Ban
└── Platform เพิ่ม Buffer 10% (ชดเชย Fraud)

ตัวอย่าง:
├── Employer สั่ง 1,000 likes
├── Platform โพสต์งาน 1,100 likes (buffer 10%)
├── ถ้า Fraud 10% → Employer ยังได้ 1,000 likes
└── Platform แบก Cost ~1% ของ Revenue

ข้อดี:
├── รองรับ Mobile + Desktop
├── UX ดีมาก (ทำงาน → ได้เงิน)
├── Dev ง่าย
├── ไม่เสี่ยงถูก Block
└── ค่าใช้จ่ายต่ำ

ข้อเสีย:
├── มี Fraud 5-10%
├── ต้องมี Buffer (ลด Margin ~1%)
└── Employer ต้องช่วยตรวจ

Risk: ต่ำ
```

#### Option 5: Hybrid (Extension + Trust)

```
วิธีการ:
├── Desktop: ใช้ Extension (Fraud 0%)
├── Mobile: ใช้ Trust + Buffer (Fraud ~10%)
└── Mobile Worker ได้ค่าจ้างน้อยกว่า (ชดเชย Risk)

ข้อดี:
├── รองรับทั้ง Desktop + Mobile
├── Desktop ได้ Premium Rate
├── Mobile ยัง Scale ได้

ข้อเสีย:
├── Dev ทั้ง Extension + Trust System
├── ซับซ้อน
└── Pricing ต่างกัน 2 กลุ่ม
```

---

## 4. เปรียบเทียบ Revenue

### ถ้า Fee Structure เหมือนกัน (12% + 3%)

| เกณฑ์ | Model A (แม่ทีม) | Model B (Pool) |
|-------|------------------|----------------|
| Revenue/Transaction | 15% | 15% |
| Scalability | ติด Bottleneck | ไม่มี Ceiling |
| Growth 1 ปี | 5x | 20-50x |
| QC Cost | ฟรี (แม่ทีมทำ) | 1-5% (ขึ้นกับวิธี) |
| Mobile Support | ได้ | ขึ้นกับ QC Method |

### Projection 1 ปี (สมมติ)

| เดือน | Model A Revenue | Model B Revenue |
|-------|-----------------|-----------------|
| 1 | 73K | 73K |
| 6 | 263K | 700K |
| 12 | 584K | 3M |

**Model B โตเร็วกว่า ~5x เพราะไม่มี Bottleneck หาแม่ทีม**

---

## 5. ความเสี่ยง

### Legal Risk

```
สถานะทางกฎหมาย (ไทย):
├── ไม่ผิดกฎหมายโดยตรง
├── แต่ละเมิด Terms of Service ของ Social Media ทุกแพลตฟอร์ม
├── ถ้าใช้สำหรับ Scam/หลอกลวง → อาจโดน พ.ร.บ. คอมพิวเตอร์
└── Grey Area - ควรปรึกษาทนาย

Mitigation:
├── Terms & Conditions ชัดเจน
├── KYC (ยืนยันตัวตน)
├── ห้ามงาน Political / Scam
└── ปรึกษาทนายก่อน Launch
```

### Platform Risk

```
Social Media อาจ:
├── Block Extension
├── Block WebView
├── Ban Account ที่มี Activity ผิดปกติ
├── เปลี่ยน DOM → Extension พัง
└── ฟ้องร้อง (กรณีร้ายแรง)

Mitigation:
├── ไม่ใช้ Extension → ใช้ Trust System
├── กระจาย Action ให้ดูธรรมชาติ
├── ไม่ให้ Worker ทำเยอะเกินไป/วัน
└── มี Plan B ถ้าถูก Block
```

### Fraud Risk

```
Worker อาจ:
├── ไม่ทำงานจริง
├── Unlike หลังได้เงิน
├── ใช้ Bot
├── ใช้รูปเก่า/ปลอม
└── สร้าง Multi-account

Mitigation:
├── Trust Score System
├── Penalty หนัก
├── Buffer 10%
├── Device Fingerprint
└── สุ่มตรวจ
```

---

## 6. Tech Stack (Prototype)

```
Frontend:
├── Next.js 14 (App Router)
├── TypeScript
├── Tailwind CSS
└── Zustand (State Management)

Backend (Prototype):
├── Mock Data + localStorage
├── ไม่มี Database จริง
└── ไม่มี API จริง

Production (อนาคต):
├── PostgreSQL (Supabase/Neon)
├── Next.js API Routes
├── Cloudflare R2 (Storage)
├── PromptPay/Bank API (Payment)
└── AI API (Gemini/GPT-4V) - ถ้าใช้ Screenshot
```

---

## 7. คำถามสำหรับผู้เชี่ยวชาญ

### Technical

1. **QC Method**: วิธีไหนเหมาะสมที่สุดในระยะยาว?
   - Extension (Desktop Only)
   - Mobile App (WebView)
   - Trust + Buffer (ยอมรับ Fraud)
   - Hybrid

2. **Extension Risk**: โอกาสที่ Social Media จะ Block Extension มีมากแค่ไหน? มีวิธีลด Risk?

3. **Screenshot AI**: มีวิธีป้องกันรูปปลอม/รูปเก่าที่ดีกว่า Challenge Code ไหม?

### Business

4. **Model เลือก**: ควรเริ่มด้วย Model A (แม่ทีม) หรือ Model B (Pool)?

5. **Pricing**: Buffer 10% เพียงพอไหม? หรือควรมากกว่า/น้อยกว่า?

6. **Market**: มี Competitor ที่ประสบความสำเร็จในไทยไหม? เขาทำ QC ยังไง?

### Legal

7. **Risk Assessment**: ความเสี่ยงทางกฎหมายในไทยมีมากแค่ไหน?

8. **Terms of Service**: ถ้า Social Media ฟ้อง มี Case Study ไหม?

9. **Entity Structure**: ควรจดบริษัทแบบไหน? ไทย หรือ ต่างประเทศ?

---

## 8. Next Steps

### ถ้าเลือก Model B + Trust System

```
Phase 1 (2 สัปดาห์): Prototype
├── UI/UX ทั้งหมด
├── Mock Data
├── ทดสอบ Flow

Phase 2 (2 สัปดาห์): MVP
├── Database จริง
├── Payment (PromptPay)
├── Trust Score System

Phase 3 (2 สัปดาห์): Launch
├── Soft Launch (100 users)
├── ตรวจสอบ Fraud Rate
├── ปรับ Buffer ตามจริง

Phase 4 (ต่อเนื่อง): Scale
├── Marketing
├── ถ้า Fraud สูง → Dev Extension/App
├── ขยายตลาด
```

### Budget Estimate (MVP)

| Item | Cost |
|------|------|
| Development | 50,000-100,000 บาท |
| Server (1 ปี) | 12,000-24,000 บาท |
| Domain + SSL | 1,500 บาท |
| Legal Consultation | 10,000-30,000 บาท |
| Marketing (เริ่มต้น) | 20,000-50,000 บาท |
| **Total** | **~100,000-200,000 บาท** |

---

## 9. สรุป

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                                                                              │
│  แนะนำ: Model B (Pool Worker) + Trust System + Buffer                       │
│                                                                              │
│  เหตุผล:                                                                    │
│  ├── Scale ได้ดีกว่า                                                       │
│  ├── รองรับ Mobile (ตลาดใหญ่)                                              │
│  ├── Dev ไม่ยาก                                                            │
│  ├── ไม่เสี่ยงถูก Block                                                    │
│  └── ยอมเสีย 1% Margin แลกกับความเรียบง่าย                                 │
│                                                                              │
│  Trade-off:                                                                 │
│  ├── Fraud ~5-10% (ชดเชยด้วย Buffer)                                       │
│  └── Employer ต้องช่วยสุ่มตรวจ                                             │
│                                                                              │
│  ถ้า Fraud เกิน 15% → ค่อย Dev Extension/App เพิ่ม                          │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## Appendix: ไฟล์ที่เกี่ยวข้อง

```
docs/v2-marketplace/
├── README.md           - Overview
├── BUSINESS_MODEL.md   - Revenue, Pricing
├── USER_FLOWS.md       - User Journeys
├── DATABASE.md         - Schema
├── DESIGN_SYSTEM.md    - UI/UX Guidelines
├── EXTENSION_SPEC.md   - Extension Technical Spec
├── PROTOTYPE.md        - Prototype Guide
└── TIMELINE.md         - Development Timeline
```

---

*สร้างโดย: AI Assistant*
*วันที่: 2 มกราคม 2026*
