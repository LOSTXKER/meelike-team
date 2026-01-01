# MeeLike Master Plan - Final Blueprint

> แผนฉบับสมบูรณ์ พร้อมนำไป Dev ได้ทันที
> 
> **หลักการ:** ต้นทุนต่ำ + ประสิทธิภาพสูง + ปิดช่องโหว่ 99%

---

## Business Model

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                                                                              │
│  MeeLike Marketplace                                                        │
│                                                                              │
│  รูปแบบ:    ตลาดกลางจ้าง "คนจริง" (Real User Pool) - ไม่ใช้บอท             │
│  Platform:  Web App (Mobile First) เท่านั้น                                 │
│  Core:      AI (Gemini 2.0 Flash) เป็น "ผู้คุมกฎ" ตรวจงาน 100%             │
│                                                                              │
│  [x] ไม่ทำ Native App (ลง Store)                                            │
│  [x] ไม่ทำ Browser Extension                                                │
│  [check] Mobile First Web App                                               │
│  [check] AI QC ทุกงาน                                                       │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 1. ระบบยืนยันตัวตน (Identity Verification)

### เป้าหมาย

- กัน Bot สมัคร
- ยืนยันว่าเป็นเจ้าของบัญชี Social Media จริง
- เก็บ Avatar ไว้ใช้เทียบตอนทำงาน

### ทำไมไม่ใช้ Login via Facebook?

```
[alert-triangle] ห้ามใช้ Login via Facebook/Instagram

เหตุผล:
├── Facebook อาจ Ban App ID
├── ละเมิด Terms of Service
└── เสี่ยงถูก Block ทั้งระบบ
```

### Flow: Challenge Code Verification

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                                                                              │
│  Step 1: สมัครสมาชิก                                                        │
│  ├── กรอก Email, Password, ชื่อ                                             │
│  └── เลือก Platform ที่จะทำงาน (Facebook/IG/TikTok)                         │
│                                                                              │
│  Step 2: ระบบสร้าง Challenge Code                                           │
│  ├── Generate Code: #ML-8855                                                │
│  └── Valid: 30 นาที                                                         │
│                                                                              │
│  Step 3: Worker ทำ Challenge                                                │
│  ├── นำ Code ไปโพสต์บน Wall หรือใส่ใน Bio                                   │
│  └── ใช้ "มือถือ" แคปหน้าโปรไฟล์ที่มี Code                                  │
│                                                                              │
│  Step 4: Upload Screenshot                                                  │
│  └── ส่งรูปเข้าระบบ                                                         │
│                                                                              │
│  Step 5: AI Verification (Gemini)                                           │
│  ├── [check] หา Code #ML-8855 เจอไหม?                                      │
│  ├── [check] รูปเป็น Mobile UI จริงไหม? (มีแถบสัญญาณ/แบตเตอรี่)            │
│  └── [check] ถ้าผ่าน: บันทึก Avatar (รูปโปรไฟล์) ไว้ใช้เทียบ               │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

### ทำไมต้อง Mobile UI?

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                                                                              │
│  [shield] ป้องกันการโกงด้วย F12 (Inspect Element)                          │
│                                                                              │
│  ถ้าแคปจากคอม:                                                              │
│  ├── โกงได้ง่าย: F12 → แก้ Code ใน HTML                                    │
│  └── ไม่มี Status Bar (สัญญาณ/แบตเตอรี่)                                   │
│                                                                              │
│  ถ้าแคปจากมือถือ:                                                           │
│  ├── แก้ HTML ยากมาก                                                        │
│  ├── มี Status Bar (เวลา, สัญญาณ, แบตเตอรี่)                               │
│  └── AI ตรวจได้ว่าเป็น Mobile จริง                                         │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

### AI Prompt: Identity Verification

```
คุณเป็นระบบตรวจสอบการยืนยันตัวตน

รูปนี้คือ Screenshot หน้าโปรไฟล์ Social Media
Code ที่ต้องหา: #ML-8855

ตรวจสอบ:
1. พบ Code "#ML-8855" ในรูปไหม? (โพสต์หรือ Bio)
2. รูปนี้เป็น Mobile UI ไหม? (มีแถบ Status Bar: เวลา, สัญญาณ, แบตเตอรี่)
3. ถ้าผ่านทั้งสองข้อ ให้บรรยายรูป Avatar (รูปโปรไฟล์วงกลม) สั้นๆ

ตอบเป็น JSON:
{
  "code_found": true/false,
  "is_mobile_ui": true/false,
  "avatar_description": "...",
  "passed": true/false,
  "reason": "..."
}
```

---

## 2. ระบบสั่งงาน (Employer Job Posting)

### เป้าหมาย

- ดึงข้อมูลต้นฉบับ (Reference) มาให้ AI ตรวจ
- ลูกค้าไม่ต้องกรอกเยอะ

### Flow: Post Job

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                                                                              │
│  Step 1: Employer กรอก URL                                                  │
│  └── https://facebook.com/mypage/posts/123456                              │
│                                                                              │
│  Step 2: Auto-Fetch (Microlink.io)                                          │
│  ├── ดึง OG Image (รูปปก)                                                  │
│  ├── ดึง OG Title                                                          │
│  └── ดึง OG Description (Caption)                                          │
│                                                                              │
│  Step 3: Preview & Confirm                                                  │
│  ┌─────────────────────────────────────────────────────────────────────┐    │
│  │  [image] รูปปก                                                      │    │
│  │                                                                      │    │
│  │  Title: ชื่อเพจ/โพสต์                                                │    │
│  │  Caption: ข้อความในโพสต์...                                         │    │
│  │                                                                      │    │
│  │  นี่คือโพสต์ที่ต้องการใช่ไหม?                                       │    │
│  │                                                                      │    │
│  │  [ใช่ ถูกต้อง]  [ไม่ใช่ แก้ไข]                                       │    │
│  └─────────────────────────────────────────────────────────────────────┘    │
│                                                                              │
│  Step 4: ถ้า Auto-Fetch ไม่ได้ (Fallback)                                  │
│  ├── ให้ลูกค้า Upload รูปปก 1 รูป                                          │
│  └── พิมพ์ Caption/Keywords สั้นๆ                                          │
│                                                                              │
│  Step 5: เลือกประเภทงาน + จำนวน + ราคา                                     │
│  ├── Type: Like / Follow / Comment                                         │
│  ├── Quantity: 100                                                         │
│  └── Price: 0.25 บาท/like                                                  │
│                                                                              │
│  Step 6: ชำระเงิน → งานถูกโพสต์!                                            │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Data ที่เก็บไว้ตรวจ

```typescript
interface JobReference {
  target_url: string;           // URL ต้นฉบับ
  target_account: string;       // ชื่อเพจ/บัญชี
  ref_image_url: string;        // รูปปก (OG Image)
  ref_image_hash: string;       // Hash ของรูปปก
  keywords: string[];           // Keywords จาก Caption
  caption_snippet: string;      // Caption ย่อ
}
```

---

## 3. ระบบตรวจงาน (AI-QC Engine)

### เป้าหมาย

- ตรวจ 100% ทุกงาน (ไม่ต้องสุ่ม)
- ตรวจละเอียด 4 มิติ
- ต้นทุนต่ำ (~$0.0008/รูป)

### Pre-Screen: Client-Side (ฟรี!)

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                                                                              │
│  [zap] Client-Side Checks (JavaScript - ฟรี!)                               │
│                                                                              │
│  Before Upload:                                                             │
│                                                                              │
│  1. MD5 Hash Check                                                          │
│     ├── คำนวณ Hash ของไฟล์                                                 │
│     ├── เทียบกับ Hash ที่เคยส่งมาแล้ว                                      │
│     └── ถ้าซ้ำ → [x] Reject "รูปนี้เคยใช้แล้ว"                             │
│                                                                              │
│  2. Metadata Check (EXIF)                                                   │
│     ├── อ่าน DateTime จาก EXIF                                             │
│     ├── เทียบกับเวลาที่รับงาน                                              │
│     └── ถ้าถ่ายก่อนรับงาน → [x] Reject "รูปถ่ายก่อนเวลารับงาน"             │
│                                                                              │
│  ถ้าผ่าน Pre-Screen → ส่งไป AI Verify                                       │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

### AI Verification: 4 จุดตรวจ

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                                                                              │
│  [brain] AI Verification - Gemini 2.0 Flash                                 │
│                                                                              │
│  Worker Upload: Screenshot เต็มจอมือถือ                                     │
│                                                                              │
│  ─────────────────────────────────────────────────────────────────────────  │
│                                                                              │
│  [1] Account Match                                                          │
│      ├── ชื่อเพจ/บัญชี ด้านบนของ Screenshot                                │
│      └── ตรงกับ target_account ในโจทย์ไหม?                                 │
│                                                                              │
│  [2] Content Match (Hybrid)                                                 │
│      ├── Visual: รูปใน Screenshot คล้ายกับ ref_image ไหม?                  │
│      └── Text: (ถ้า Visual ไม่ชัด) มี Keywords ตรงกันไหม?                  │
│                                                                              │
│  [3] Action Match                                                           │
│      ├── งาน Like: ปุ่มเป็น "สีฟ้า" หรือ "Liked" ไหม?                     │
│      ├── งาน Follow: ปุ่มเป็น "Following" ไหม?                             │
│      └── งาน Comment: เห็น Comment ของ Worker ไหม?                         │
│                                                                              │
│  [4] Integrity Check                                                        │
│      ├── Time: เวลาบน Status Bar ตรงกับปัจจุบัน (±15 นาที)?               │
│      └── Avatar: รูปโปรไฟล์วงกลมเล็กๆ หน้าเหมือน Worker คนนี้ไหม?         │
│                                                                              │
│  ─────────────────────────────────────────────────────────────────────────  │
│                                                                              │
│  ผลลัพธ์:                                                                   │
│  ├── ผ่านทั้ง 4 ข้อ → [check] Approved → จ่ายเงิน                         │
│  └── ไม่ผ่านข้อใดข้อหนึ่ง → [x] Rejected → แจ้งเหตุผล                     │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

### AI Prompt: Job Verification

```
คุณเป็นระบบตรวจงาน Social Media Engagement

ข้อมูลโจทย์:
- Platform: Facebook
- Action: Like
- Target Account: "ร้านขายของออนไลน์"
- Reference Image: [แนบรูป]
- Keywords: ["สินค้าใหม่", "ลดราคา", "พิเศษ"]
- Worker Avatar: "ผู้หญิงผมยาว แว่นตา"

Screenshot ที่ Worker ส่งมา: [แนบรูป]
เวลาปัจจุบัน: 14:30

ตรวจสอบ 4 จุด:

1. Account Match: ชื่อเพจ/บัญชีด้านบน ตรงกับ "ร้านขายของออนไลน์" ไหม?

2. Content Match: 
   - รูปใน Screenshot คล้ายกับ Reference Image ไหม?
   - หรือมี Keywords ตรงกันไหม?

3. Action Match: ปุ่ม Like เป็นสีฟ้า/Liked แล้วไหม?

4. Integrity Check:
   - เวลาบน Status Bar อยู่ในช่วง 14:15-14:45 ไหม?
   - รูปโปรไฟล์เล็กๆ (มุมจอ/ช่อง Comment) ตรงกับ "ผู้หญิงผมยาว แว่นตา" ไหม?

ตอบเป็น JSON:
{
  "account_match": { "passed": true/false, "found": "...", "reason": "..." },
  "content_match": { "passed": true/false, "method": "visual/text", "reason": "..." },
  "action_match": { "passed": true/false, "button_state": "...", "reason": "..." },
  "integrity_check": { 
    "time_valid": true/false, 
    "time_found": "...",
    "avatar_match": true/false,
    "reason": "..." 
  },
  "final_verdict": "approved/rejected",
  "confidence": 0.95,
  "rejection_reason": "..." // ถ้า rejected
}
```

### สำหรับงาน Comment

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                                                                              │
│  [message-square] Comment Verification                                      │
│                                                                              │
│  Worker ต้อง:                                                               │
│  ├── แคปเฉพาะ Comment ของตัวเอง (ไม่ต้องเห็นทั้งโพสต์)                     │
│  └── เห็นรูป Avatar + ชื่อ + ข้อความ Comment                               │
│                                                                              │
│  AI ตรวจ:                                                                   │
│  ├── Avatar ตรงกับ Worker ไหม?                                             │
│  ├── ข้อความ Comment สัมพันธ์กับโจทย์/โพสต์ไหม?                           │
│  └── ไม่ใช่ Comment ขยะ (เช่น ".", "ๆๆๆ")                                  │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 4. ระบบการเงิน & Safety Net

### Revenue Model

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                                                                              │
│  [wallet] Revenue:                                                          │
│                                                                              │
│  1. Job Fee (จาก Employer): 12%                                             │
│  2. Withdrawal Fee (จาก Worker): 3%                                         │
│                                                                              │
│  รวม: ~15% ต่อ Transaction                                                  │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Buffer System (15%)

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                                                                              │
│  [shield] Buffer 15%                                                        │
│                                                                              │
│  เหตุผล:                                                                    │
│  ├── ป้องกัน Unlike หลังได้เงิน                                            │
│  ├── ชดเชยงานที่ Reject                                                    │
│  └── Employer ได้ครบตามสั่ง                                                │
│                                                                              │
│  ตัวอย่าง:                                                                  │
│  ├── Employer สั่ง: 100 likes                                              │
│  ├── ระบบโพสต์งาน: 115 likes (buffer 15%)                                  │
│  ├── สมมติ Reject 10 งาน + Unlike 5 งาน                                    │
│  └── Employer ยังได้: 100 likes ครบ!                                       │
│                                                                              │
│  Cost:                                                                      │
│  ├── Buffer Cost = 15% × Worker Pay                                        │
│  ├── แต่จริงๆ ใช้ไม่ถึง 15% (AI ตรวจได้ดี)                                │
│  └── คาดว่าใช้จริง ~5-8%                                                   │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Delayed Payout (24 ชม.)

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                                                                              │
│  [clock] Delayed Payout                                                     │
│                                                                              │
│  Flow:                                                                      │
│  1. Worker ทำงานเสร็จ                                                       │
│  2. AI ตรวจผ่าน                                                             │
│  3. เงินเข้า Wallet ทันที (สถานะ: Pending)                                 │
│  4. รอ 24 ชม.                                                               │
│  5. ถ้าไม่มี Dispute → เงินเป็น Available                                   │
│  6. Worker ถอนได้                                                           │
│                                                                              │
│  ทำไม 24 ชม.?                                                               │
│  ├── ให้ Employer มีเวลาตรวจสอบ                                             │
│  ├── ถ้า Worker Unlike → Employer แจ้งได้ทัน                               │
│  └── ป้องกัน Hit & Run                                                     │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Dispute System

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                                                                              │
│  [alert-triangle] Dispute System                                            │
│                                                                              │
│  Flow:                                                                      │
│  1. Employer เจองานมีปัญหา (Unlike, งานเสีย)                               │
│  2. กดปุ่ม "แจ้งงานเสีย"                                                   │
│  3. ระบบดึง AI มา Re-check                                                 │
│  4. ถ้าผิดจริง:                                                             │
│     ├── ยึดเงินคืน Employer                                                │
│     ├── หัก Trust Score Worker                                             │
│     └── ถ้าโกงซ้ำ → Ban                                                    │
│                                                                              │
│  Penalty:                                                                   │
│  ├── ครั้งที่ 1: -20 Trust, หักเงิน 2x                                     │
│  ├── ครั้งที่ 2: -40 Trust, หักเงิน 3x, Ban 7 วัน                          │
│  └── ครั้งที่ 3: Ban ถาวร                                                  │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 5. Tech Stack

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                                                                              │
│  [code] Tech Stack                                                          │
│                                                                              │
│  Frontend:                                                                  │
│  ├── Next.js 14 (App Router)                                               │
│  ├── TypeScript                                                            │
│  ├── Tailwind CSS                                                          │
│  └── Mobile First Responsive                                               │
│                                                                              │
│  Backend:                                                                   │
│  ├── Supabase                                                              │
│  │   ├── Auth (Email/Password)                                             │
│  │   ├── Database (PostgreSQL)                                             │
│  │   └── Storage (Screenshots)                                             │
│  └── Next.js API Routes                                                    │
│                                                                              │
│  AI:                                                                        │
│  └── Google Gemini 2.0 Flash                                               │
│      └── Cost: ~$0.0008 / รูป (ถูกมาก!)                                    │
│                                                                              │
│  Helpers:                                                                   │
│  ├── microlink.io - ดึง OG Tags (รูปปก, Caption)                           │
│  ├── crypto-js - MD5 Hash Check (Client-side)                              │
│  └── exif-js - อ่าน Metadata รูป                                           │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Cost Estimation

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                                                                              │
│  [calculator] AI Cost (Gemini 2.0 Flash)                                    │
│                                                                              │
│  ราคา Gemini 2.0 Flash:                                                     │
│  ├── Input: $0.10 / 1M tokens                                              │
│  └── Output: $0.40 / 1M tokens                                             │
│                                                                              │
│  ต่อการตรวจ 1 งาน:                                                          │
│  ├── Input: ~500 tokens (prompt + image)                                   │
│  ├── Output: ~200 tokens (JSON response)                                   │
│  └── Cost: ~$0.0001 + $0.00008 = ~$0.00018                                 │
│                                                                              │
│  รวม 2 รูป (Reference + Screenshot):                                        │
│  └── Total: ~$0.0004 - $0.0008 / งาน                                       │
│                                                                              │
│  ─────────────────────────────────────────────────────────────────────────  │
│                                                                              │
│  ตัวอย่าง 100,000 งาน/เดือน:                                                │
│  ├── AI Cost: $40-80 (~1,500-3,000 บาท)                                    │
│  ├── Revenue (15%): ~150,000 บาท                                           │
│  └── AI Cost = 1-2% ของ Revenue (ถูกมาก!)                                  │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 6. Database Schema

```sql
-- Users (Workers + Employers)
CREATE TABLE users (
  id              UUID PRIMARY KEY,
  email           VARCHAR(255) UNIQUE NOT NULL,
  password_hash   VARCHAR(255) NOT NULL,
  role            VARCHAR(20) NOT NULL, -- 'worker', 'employer'
  name            VARCHAR(255) NOT NULL,
  phone           VARCHAR(20),
  
  -- Worker specific
  trust_score     INTEGER DEFAULT 100,
  verified        BOOLEAN DEFAULT FALSE,
  avatar_desc     TEXT, -- AI description of avatar
  
  -- Bank info
  bank_name       VARCHAR(100),
  bank_account    VARCHAR(50),
  
  created_at      TIMESTAMP DEFAULT NOW()
);

-- Worker Social Accounts (verified)
CREATE TABLE worker_accounts (
  id              UUID PRIMARY KEY,
  worker_id       UUID REFERENCES users(id),
  platform        VARCHAR(20) NOT NULL, -- 'facebook', 'instagram', 'tiktok'
  account_name    VARCHAR(255),
  profile_url     VARCHAR(500),
  avatar_url      VARCHAR(500),
  avatar_desc     TEXT, -- AI description for matching
  verified_at     TIMESTAMP,
  
  UNIQUE(worker_id, platform)
);

-- Jobs
CREATE TABLE jobs (
  id              UUID PRIMARY KEY,
  employer_id     UUID REFERENCES users(id),
  
  platform        VARCHAR(20) NOT NULL,
  action_type     VARCHAR(20) NOT NULL, -- 'like', 'follow', 'comment'
  
  -- Target
  target_url      VARCHAR(1000) NOT NULL,
  target_account  VARCHAR(255),
  
  -- Reference for AI matching
  ref_image_url   VARCHAR(500),
  ref_image_hash  VARCHAR(64),
  keywords        TEXT[], -- extracted from caption
  caption_snippet TEXT,
  
  -- Quantities
  quantity        INTEGER NOT NULL,
  buffer_quantity INTEGER NOT NULL, -- quantity * 1.15
  completed       INTEGER DEFAULT 0,
  
  -- Pricing
  price_per_action DECIMAL(10,2) NOT NULL,
  total_cost      DECIMAL(10,2) NOT NULL,
  
  status          VARCHAR(20) DEFAULT 'active',
  created_at      TIMESTAMP DEFAULT NOW()
);

-- Job Claims
CREATE TABLE job_claims (
  id              UUID PRIMARY KEY,
  job_id          UUID REFERENCES jobs(id),
  worker_id       UUID REFERENCES users(id),
  
  -- Screenshot
  screenshot_url  VARCHAR(500),
  screenshot_hash VARCHAR(64),
  
  -- AI Verification
  ai_result       JSONB, -- full AI response
  ai_passed       BOOLEAN,
  ai_checked_at   TIMESTAMP,
  
  -- Payment
  reward          DECIMAL(10,2),
  status          VARCHAR(20) DEFAULT 'pending', -- pending, approved, rejected, disputed
  payout_status   VARCHAR(20) DEFAULT 'pending', -- pending (24h), available, paid
  payout_at       TIMESTAMP,
  
  created_at      TIMESTAMP DEFAULT NOW(),
  
  UNIQUE(job_id, worker_id)
);

-- Screenshot Hashes (prevent reuse)
CREATE TABLE screenshot_hashes (
  hash            VARCHAR(64) PRIMARY KEY,
  worker_id       UUID REFERENCES users(id),
  created_at      TIMESTAMP DEFAULT NOW()
);

-- Wallets
CREATE TABLE wallets (
  id              UUID PRIMARY KEY,
  user_id         UUID UNIQUE REFERENCES users(id),
  balance         DECIMAL(12,2) DEFAULT 0,
  pending_balance DECIMAL(12,2) DEFAULT 0, -- 24h hold
  created_at      TIMESTAMP DEFAULT NOW()
);

-- Transactions
CREATE TABLE transactions (
  id              UUID PRIMARY KEY,
  wallet_id       UUID REFERENCES wallets(id),
  type            VARCHAR(30) NOT NULL,
  amount          DECIMAL(12,2) NOT NULL,
  reference_id    UUID,
  description     TEXT,
  created_at      TIMESTAMP DEFAULT NOW()
);
```

---

## 7. Action Plan (3 วัน)

### Day 1: Core + Auth

```
Morning:
├── Setup Next.js + Supabase
├── Configure Auth (Email/Password)
└── Create base UI components

Afternoon:
├── Register Page (Worker/Employer)
├── Login Page
└── Dashboard Layout

Evening:
├── Challenge Code Generation
├── Screenshot Upload Component
└── AI Integration (Gemini) - Identity Verification
```

### Day 2: Employer Flow

```
Morning:
├── Post Job Page
├── Microlink API Integration
└── OG Image/Caption Fetch

Afternoon:
├── Job Preview Component
├── Fallback: Manual Upload
└── Payment Flow (Mock)

Evening:
├── Employer Dashboard
├── Job List + Progress
└── Database: jobs table
```

### Day 3: Worker Flow + AI QC

```
Morning:
├── Job Marketplace Page
├── Claim Job Flow
└── Screenshot Upload + Pre-screen (Hash, Metadata)

Afternoon:
├── AI Verification Prompt
├── 4-Point Check Implementation
└── Result Handling (Approve/Reject)

Evening:
├── Wallet System
├── Delayed Payout Logic
├── Dispute Button
└── Testing!
```

---

## 8. สรุป

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                                                                              │
│  [star] MeeLike Master Plan - Final                                         │
│                                                                              │
│  Platform:     Web App (Mobile First)                                       │
│  QC Method:    AI (Gemini 2.0 Flash) ตรวจ 100%                             │
│  Cost:         ~$0.0008/งาน (~1-2% ของ Revenue)                            │
│                                                                              │
│  ─────────────────────────────────────────────────────────────────────────  │
│                                                                              │
│  ป้องกันการโกง:                                                             │
│                                                                              │
│  [check] รูปเก่า/ซ้ำ         → MD5 Hash Check                               │
│  [check] รูปถ่ายก่อนรับงาน   → Metadata Check                               │
│  [check] แก้ Code ด้วย F12   → Mobile UI Check                              │
│  [check] รูปคนอื่น           → Avatar Match                                 │
│  [check] ไม่ได้ทำจริง        → 4-Point AI Check                             │
│  [check] Unlike หลังได้เงิน  → Buffer 15% + Delayed Payout 24h             │
│  [check] Multi-account       → Avatar Verification                          │
│                                                                              │
│  ─────────────────────────────────────────────────────────────────────────  │
│                                                                              │
│  Revenue: 15% (12% Job Fee + 3% Withdrawal)                                 │
│  Buffer Cost: ~5-8% (ใช้จริงไม่ถึง 15%)                                     │
│  AI Cost: ~1-2%                                                             │
│  Net Margin: ~5-8%                                                          │
│                                                                              │
│  [rocket] พร้อม Dev!                                                        │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## Related Documents

- [PROJECT_SUMMARY.md](../PROJECT_SUMMARY.md) - สรุปโปรเจคฉบับก่อน
- [DATABASE.md](./DATABASE.md) - Schema เดิม (อัปเดตแล้ว)
- [USER_FLOWS.md](./USER_FLOWS.md) - User Flows
- [DESIGN_SYSTEM.md](./DESIGN_SYSTEM.md) - UI/UX Guidelines
