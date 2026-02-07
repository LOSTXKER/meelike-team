# MeeLike Seller

แพลตฟอร์มครบวงจรสำหรับธุรกิจ Social Media Engagement -- เชื่อมต่อผู้ต้องการเพิ่มยอด Social Media (Seller) กับคนรับงาน (Worker)

> **สถานะ:** Prototype / Frontend Demo -- ใช้ mock data + localStorage ยังไม่เชื่อม backend จริง

---

## สารบัญ

- [MeeLike คืออะไร](#meelike-คืออะไร)
  - [แพลตฟอร์มและบริการที่รองรับ](#แพลตฟอร์มและบริการที่รองรับ)
  - [ระบบ Subscription](#ระบบ-subscription-แพ็กเกจ-seller)
  - [ระบบ Rank และ Level](#ระบบ-rank-และ-level)
- [Tech Stack](#tech-stack)
- [เริ่มต้นใช้งาน](#เริ่มต้นใช้งาน)
- [โครงสร้างโปรเจค](#โครงสร้างโปรเจค)
- [Routes ทั้งหมด](#routes-ทั้งหมด)
- [Feature หลัก](#feature-หลัก)
- [State Management](#state-management)
- [API Layer](#api-layer)
- [หมายเหตุ](#หมายเหตุ)

---

## MeeLike คืออะไร

MeeLike คือแพลตฟอร์มที่ให้บริการเพิ่มยอด Social Media (Like, Comment, Follow, View, Share) โดยใช้คนจริง ระบบทำงานผ่าน 3 บทบาทหลัก:

| บทบาท | คำอธิบาย |
|--------|----------|
| **Seller** | เจ้าของร้าน/ผู้จ้างงาน -- สร้างออเดอร์, จัดการทีม, ติดตามผลงาน |
| **Worker** | คนรับงาน/ลูกทีม -- รับงาน Like/Comment/Follow แล้วได้ค่าตอบแทน |
| **Admin** | ผู้ดูแลระบบ -- ตรวจสอบ KYC, จัดการ users, ดู reports |

### ขั้นตอนการทำงานหลัก

```
Seller สร้างออเดอร์ → ระบบแตกเป็นงานย่อย (Jobs) → Worker claim งาน
→ Worker ทำงาน (Like/Comment/Follow) → ส่งหลักฐาน → ตรวจสอบ
→ Worker ได้เงิน → Seller ได้ยอด engagement
```

### แพลตฟอร์มและบริการที่รองรับ

**แพลตฟอร์ม Social Media:**

| แพลตฟอร์ม |
|-----------|
| Facebook |
| Instagram |
| TikTok |
| YouTube |
| Twitter (X) |

**ประเภทบริการ:**

| บริการ | คำอธิบาย |
|--------|---------|
| Like | กดไลค์โพสต์/วิดีโอ |
| Comment | คอมเมนต์ตามที่กำหนด |
| Follow | กดติดตามบัญชี |
| Share | แชร์โพสต์/วิดีโอ |
| View | เพิ่มยอดวิว |

**โหมดการทำงาน:** Bot (อัตโนมัติ) หรือ Human (คนจริง)

### ระบบ Subscription (แพ็กเกจ Seller)

Seller เลือกแพ็กเกจตามขนาดธุรกิจ:

| แพ็กเกจ | ราคา/เดือน | ทีม | Admins | Bot API | Analytics | Export | Webhook |
|---------|-----------|-----|--------|---------|-----------|--------|---------|
| **Free** | ฟรี | 2 | 1 | MeeLike | Basic | - | - |
| **Basic** | ฿49 | 5 | 2 | MeeLike | Basic | - | - |
| **Pro** | ฿99 | 20 | 5 | MeeLike + External | Pro | มี | มี |
| **Business** | ฿399 | ไม่จำกัด | ไม่จำกัด | MeeLike + External | Pro | มี | มี |

Pro และ Business ได้ White Label เพิ่ม, Business ได้ Custom Domain + Priority Support

### ระบบ Rank และ Level

**Seller Rank** -- คำนวณจากยอดจ้างงานเฉลี่ย 3 เดือน กำหนด platform fee:

| Rank | ยอดจ้างเฉลี่ย/เดือน | Platform Fee |
|------|---------------------|-------------|
| Bronze | 0 - ฿20,000 | 12% |
| Silver | ฿20,000 - ฿50,000 | 11% |
| Gold | ฿50,000 - ฿150,000 | 10% |
| Platinum | > ฿150,000 | 9% |

**Worker Level** -- กำหนดค่าธรรมเนียมถอนเงินและโบนัส:

| Level | ค่าธรรมเนียมถอน | โบนัส |
|-------|----------------|-------|
| Bronze | 10% | - |
| Silver | 8% | +2% |
| Gold | 6% | +5% |
| Platinum | 4% | +8% |
| VIP | 2% | +10% |

Worker level สูงขึ้นตามจำนวนงานที่ทำสำเร็จ ยิ่ง level สูง ค่าธรรมเนียมถอนยิ่งต่ำ และได้โบนัสเพิ่ม

---

## Tech Stack

| เทคโนโลยี | เวอร์ชัน | ใช้ทำอะไร |
|------------|---------|----------|
| Next.js | 16.1.1 | App Router, SSR/CSR |
| React | 19.2.3 | UI Framework |
| TypeScript | 5 | Type Safety |
| Tailwind CSS | 4 | Styling + Design System |
| Zustand | 5.0.9 | State Management + localStorage persist |
| lucide-react | 0.562.0 | Icons |
| qrcode.react | 4.2.0 | QR Code สำหรับ PromptPay |
| clsx + tailwind-merge | - | className utilities |

---

## เริ่มต้นใช้งาน

```bash
# ติดตั้ง dependencies
npm install

# รัน development server
npm run dev

# เปิด http://localhost:3000
```

### Demo Accounts

ระบบ login เป็น mock -- ใส่ email อะไรก็ได้ + password อะไรก็ได้ แล้วเลือก role:

| Role | วิธีเข้า | URL หลัก |
|------|---------|---------|
| Seller | Login เลือก role "Seller" | `/seller` |
| Worker | Login เลือก role "Worker" | `/work` |
| Admin | Login ด้วย email ที่มีคำว่า "admin" เช่น `admin@meelike.com` | `/admin` |

---

## โครงสร้างโปรเจค

```
src/
├── app/                    # Next.js App Router pages
│   ├── (auth)/             #   Login, Register
│   ├── seller/             #   Seller Center (ทุกหน้าของ Seller)
│   ├── work/               #   Worker App (ทุกหน้าของ Worker)
│   ├── hub/                #   Hub/Marketplace (หาทีม, รับสมัคร, โยนงาน)
│   ├── admin/              #   Admin Panel
│   ├── s/[slug]/           #   หน้าร้านสาธารณะ
│   ├── help/               #   Help Center
│   ├── layout.tsx          #   Root Layout
│   ├── page.tsx            #   Landing Page
│   └── globals.css         #   Global Styles + Design Tokens
│
├── components/
│   ├── ui/                 #   Base UI (Button, Card, Badge, Dialog, ...)
│   ├── shared/             #   Shared Components (KYC, Forms, Modals, ...)
│   ├── seller/             #   Seller-specific components
│   ├── worker/             #   Worker-specific components
│   ├── hub/                #   Hub components
│   ├── layout/             #   Layout (Sidebar, Header, BottomNav)
│   └── help/               #   Help components
│
├── lib/
│   ├── api/                #   Mock API layer (seller, worker, hub, team)
│   ├── constants/          #   Navigation, services, platforms, plans
│   ├── hooks/              #   Custom hooks (useRequireAuth, ...)
│   ├── utils/              #   Helpers, formatters
│   ├── design/             #   Design tokens, animations
│   ├── store.ts            #   Zustand stores
│   └── storage.ts          #   localStorage helpers
│
└── types/                  #   TypeScript type definitions
    ├── auth.ts             #     Auth types
    ├── seller.ts           #     Seller, Store, Service types
    ├── worker.ts           #     Worker types
    ├── team.ts             #     Team, TeamMember, TeamJob types
    ├── order.ts            #     Order types
    ├── job.ts              #     Job, JobClaim types
    ├── kyc.ts              #     KYC types + helpers
    ├── hub.ts              #     Hub post types
    ├── report.ts           #     Report types
    └── index.ts            #     Barrel exports
```

---

## Routes ทั้งหมด

### Seller (`/seller/*`)

| Route | หน้า |
|-------|------|
| `/seller` | Dashboard -- ภาพรวมร้าน, สถิติ, quick actions |
| `/seller/orders` | จัดการออเดอร์ทั้งหมด |
| `/seller/orders/new` | สร้างออเดอร์ใหม่ |
| `/seller/orders/[id]` | รายละเอียดออเดอร์ |
| `/seller/services` | จัดการบริการ (Like, Comment, Follow, ...) |
| `/seller/services/new` | สร้างบริการใหม่ |
| `/seller/team` | Team Center -- ภาพรวมทุกทีม |
| `/seller/team/[id]` | Dashboard ทีม |
| `/seller/team/[id]/members` | สมาชิกทีม |
| `/seller/team/[id]/jobs` | งานในทีม |
| `/seller/team/[id]/jobs/new` | สร้างงานใหม่ |
| `/seller/team/[id]/jobs/[jobId]` | รายละเอียดงาน |
| `/seller/team/[id]/review` | ตรวจงาน Worker |
| `/seller/team/[id]/payouts` | จ่ายเงิน Worker |
| `/seller/team/[id]/settings` | ตั้งค่าทีม |
| `/seller/store` | ตั้งค่าหน้าร้าน |
| `/seller/finance` | การเงิน -- เติมเงิน, ประวัติธุรกรรม |
| `/seller/analytics` | สถิติและวิเคราะห์ |
| `/seller/outsource` | โยนงานให้ทีมอื่น |
| `/seller/settings` | ตั้งค่าบัญชี |
| `/seller/settings/verification` | ยืนยันตัวตน (KYC) |
| `/seller/settings/api` | ตั้งค่า API |
| `/seller/settings/subscription` | แพ็กเกจสมาชิก |

### Worker (`/work/*`)

| Route | หน้า |
|-------|------|
| `/work` | Dashboard -- สถิติ, งานวันนี้, รายได้ |
| `/work/jobs` | หางาน -- ดูงานที่เปิดรับ |
| `/work/jobs/[id]` | รายละเอียดงาน + ส่งงาน |
| `/work/jobs/preview/[id]` | พรีวิวงานก่อน claim |
| `/work/teams` | ทีมที่เข้าร่วม |
| `/work/teams/[id]` | รายละเอียดทีม |
| `/work/teams/[id]/jobs` | งานในทีม |
| `/work/earnings` | รายได้รวม |
| `/work/earnings/history` | ประวัติรายได้ |
| `/work/earnings/withdraw` | ถอนเงิน |
| `/work/accounts` | บัญชี Social Media |
| `/work/profile` | โปรไฟล์ |
| `/work/profile/verification` | ยืนยันตัวตน (KYC) |
| `/work/leaderboard` | อันดับ Worker |
| `/work/referral` | ชวนเพื่อน |

### Hub (`/hub/*`)

| Route | หน้า |
|-------|------|
| `/hub` | หน้าหลัก Marketplace |
| `/hub/find-team` | หาทีมเข้าร่วม |
| `/hub/recruit` | รับสมัครลูกทีม |
| `/hub/outsource` | โยนงาน/รับงานจากร้านอื่น |
| `/hub/post/new` | สร้างโพสต์ |
| `/hub/post/[id]` | รายละเอียดโพสต์ |
| `/hub/team/[id]` | โปรไฟล์ทีม |

### Admin (`/admin/*`)

| Route | หน้า |
|-------|------|
| `/admin` | Dashboard |
| `/admin/users` | จัดการ Users |
| `/admin/kyc` | ตรวจสอบ KYC (approve/reject) |
| `/admin/reports` | ดู Reports เนื้อหาไม่เหมาะสม |
| `/admin/settings` | ตั้งค่าระบบ |

### อื่นๆ

| Route | หน้า |
|-------|------|
| `/` | Landing Page |
| `/login` | เข้าสู่ระบบ |
| `/register` | สมัครสมาชิก |
| `/s/[slug]` | หน้าร้านสาธารณะ |
| `/s/[slug]/order` | สั่งซื้อบริการ |
| `/s/[slug]/status` | ตรวจสอบสถานะออเดอร์ |
| `/help` | ศูนย์ช่วยเหลือ |
| `/help/faq` | คำถามที่พบบ่อย |
| `/help/seller` | คู่มือ Seller |
| `/help/worker` | คู่มือ Worker |
| `/help/hub` | คู่มือ Hub |

---

## Feature หลัก

### 1. ระบบ Authentication

- Login/Register แบบ multi-role (Seller, Worker, Admin)
- State เก็บใน Zustand + persist ลง localStorage
- Route protection ด้วย `useRequireAuth` hook -- redirect ถ้า role ไม่ตรง
- Seller layout: `/seller/*` ต้องเป็น role seller
- Worker layout: `/work/*` ต้องเป็น role worker

### 2. Seller Center

**Dashboard** (`/seller`) -- ภาพรวมร้าน: ยอดออเดอร์, รายได้, สถิติทีม, KYC status

**จัดการออเดอร์** (`/seller/orders`)
- สร้างออเดอร์ใหม่ (เลือกบริการ, กรอกข้อมูลลูกค้า, ลิงก์ Social)
- ดูสถานะออเดอร์: pending → processing → completed
- Timeline ติดตามความคืบหน้า

**จัดการบริการ** (`/seller/services`)
- สร้าง/แก้ไขบริการ (Like, Comment, Follow, View, Share)
- ตั้งราคา, จำนวนขั้นต่ำ/สูงสุด, เวลาส่งงาน
- เปิด/ปิดบริการ

**หน้าร้าน** (`/seller/store`)
- ตั้งค่าชื่อร้าน, slug, theme
- หน้าร้านสาธารณะที่ `/s/[slug]`

**การเงิน** (`/seller/finance`)
- เติมเงิน (PromptPay / โอนเงิน)
- ประวัติธุรกรรมทั้งหมด
- ยอดคงเหลือ

**สถิติ** (`/seller/analytics`) -- กราฟและตัวเลขสรุปผลงาน

### 3. ระบบทีม (Team Management)

Seller สร้างทีมเพื่อบริหาร Worker:

**Team Center** (`/seller/team`)
- ดูทุกทีม, สถิติรวม (สมาชิก, งาน, รายได้)
- สร้างทีมใหม่ (ต้องผ่าน KYC Verified ก่อน)

**ภายในทีม** (`/seller/team/[id]/*`)
- **Dashboard** -- สถิติทีม
- **สมาชิก** -- ดู/จัดการสมาชิก, invite ด้วย code
- **งาน** -- สร้าง/จัดการ Jobs, กำหนดรายละเอียดงาน
- **ตรวจงาน** -- Review งานที่ Worker ส่งมา (approve/reject)
- **จ่ายเงิน** -- Payout ให้ Worker
- **ตั้งค่า** -- ชื่อทีม, privacy, notifications, LINE integration, danger zone

### 4. Worker App

**Dashboard** (`/work`) -- งานวันนี้, รายได้, streak, KYC status

**หางาน** (`/work/jobs`)
- ดูงานที่เปิดรับทั้งหมด
- Preview งานก่อน claim
- Claim งาน → ทำงาน → ส่งหลักฐาน

**ทีม** (`/work/teams`)
- ดูทีมที่เข้าร่วม
- ดูงานในทีม

**รายได้** (`/work/earnings`)
- ยอดเงินรวม, ประวัติรายได้
- ถอนเงิน (ต้องผ่าน KYC Verified)

**อื่นๆ**
- บัญชี Social Media (`/work/accounts`)
- Leaderboard (`/work/leaderboard`)
- Referral/ชวนเพื่อน (`/work/referral`)
- โปรไฟล์ + KYC (`/work/profile`)

### 5. Hub (Marketplace)

ตลาดกลางที่เชื่อมต่อ Seller กับ Worker:

- **หาทีม** (`/hub/find-team`) -- Worker หาทีมเข้าร่วม
- **รับสมัคร** (`/hub/recruit`) -- Seller ประกาศรับสมัคร Worker
- **โยนงาน** (`/hub/outsource`) -- Seller โยนงานให้ทีมอื่นทำ
- **โพสต์** -- สร้างและดูโพสต์ในตลาดกลาง

### 6. ระบบ KYC (Know Your Customer)

ระบบยืนยันตัวตน 4 ระดับ:

| ระดับ | ต้องทำอะไร | สิทธิ์ที่ได้ |
|-------|-----------|------------|
| **none** | สมัครสมาชิก (email) | ใช้งานพื้นฐาน |
| **basic** | ยืนยันเบอร์โทร (OTP) | เติมเงินได้ |
| **verified** | อัปโหลดบัตรประชาชน + Selfie คู่บัตร | ถอนเงินได้ (สูงสุด 10,000/วัน), สร้างทีมได้ |
| **business** | หนังสือรับรองบริษัท + เลขผู้เสียภาษี | ถอนเงินไม่จำกัด |

**จุดที่บังคับใช้ KYC:**
- เติมเงิน → ต้อง basic ขึ้นไป
- สร้างทีม → ต้อง verified ขึ้นไป
- ถอนเงิน → ต้อง verified ขึ้นไป

**Components ที่เกี่ยวข้อง:**
- `KYCGate` -- wrapper component ที่เช็ค KYC ก่อนอนุญาต action
- `KYCRequiredModal` -- modal แจ้งเตือนต้องยืนยันตัวตน
- `KYCAlertBanner` -- banner เตือนด้านบนหน้า
- `KYCStatusCard` -- card แสดงสถานะ KYC + progress
- `QuickKYCModal` -- modal ยืนยันเบอร์โทร (Basic level) แบบเร็ว
- `IDCardUpload` -- อัปโหลดบัตรประชาชน + OCR
- `SelfieCapture` -- ถ่าย selfie คู่บัตร

**หน้ายืนยันตัวตน:**
- Seller: `/seller/settings/verification`
- Worker: `/work/profile/verification`
- Admin ตรวจสอบ: `/admin/kyc`

### 7. ระบบการเงิน

**Seller -- เติมเงิน** (`/seller/finance`)
- เลือกจำนวนเงิน → เลือกช่องทาง (PromptPay/โอนเงิน) → ยืนยัน
- ต้องผ่าน KYC Basic ก่อน (มี guard ทั้ง UI และ API)

**Worker -- ถอนเงิน** (`/work/earnings/withdraw`)
- กรอกจำนวน → ยืนยัน
- ต้องผ่าน KYC Verified ก่อน
- วงเงินถอนตาม KYC level

**ประวัติธุรกรรม** -- ดูได้ทั้งฝั่ง Seller และ Worker

### 8. ระบบรายงาน (Content Report)

- Worker สามารถรายงานเนื้อหาไม่เหมาะสมในงาน
- หมวดหมู่: เนื้อหาลามก, ความรุนแรง, หลอกลวง, ละเมิดลิขสิทธิ์ ฯลฯ
- Admin ตรวจสอบที่ `/admin/reports` (approve/reject/dismiss)
- Components: `ReportContentModal`, `ContentGuidelines`

### 9. Public Store

หน้าร้านสาธารณะที่ลูกค้าเข้าถึงได้โดยไม่ต้อง login:

- `/s/[slug]` -- หน้าร้าน, แสดงบริการทั้งหมด
- `/s/[slug]/order` -- สั่งซื้อบริการ
- `/s/[slug]/status` -- ตรวจสอบสถานะออเดอร์

### 10. Admin Panel

- **Dashboard** (`/admin`) -- สถิติภาพรวมระบบ
- **จัดการ Users** (`/admin/users`) -- ดู/ค้นหา users ทั้งหมด
- **ตรวจ KYC** (`/admin/kyc`) -- รายการ KYC ที่รอตรวจ, approve/reject, ดูเอกสาร
- **ดู Reports** (`/admin/reports`) -- รายงานเนื้อหาไม่เหมาะสม
- **ตั้งค่า** (`/admin/settings`) -- ตั้งค่าระบบ

### 11. Help Center

ศูนย์ช่วยเหลือที่ `/help`:
- FAQ ทั่วไป
- คู่มือ Seller -- วิธีสร้างร้าน, สร้างออเดอร์, จัดการทีม
- คู่มือ Worker -- วิธีรับงาน, ส่งงาน, ถอนเงิน
- คู่มือ Hub -- วิธีใช้ marketplace

---

## State Management

ใช้ **Zustand** กับ localStorage persistence:

| Store | ที่อยู่ | ใช้ทำอะไร |
|-------|--------|----------|
| `useAuthStore` | `src/lib/store.ts` | User session, login/logout, role management |
| `useAppStore` | `src/lib/store.ts` | UI state (sidebar, mobile menu) |
| `useNotificationStore` | `src/lib/store.ts` | Notification management |

Auth store persist ลง localStorage key `"meelike-auth"` -- refresh หน้าแล้วยังอยู่

---

## API Layer

API ทั้งหมดอยู่ใน `src/lib/api/` เป็น **mock API** ที่ใช้ localStorage เก็บข้อมูล:

| ไฟล์ | ขอบเขต |
|------|--------|
| `seller.ts` | ทุกอย่างฝั่ง Seller (orders, services, teams, finance, ...) |
| `worker.ts` | ทุกอย่างฝั่ง Worker (jobs, earnings, stats, ...) |
| `team.ts` | Team operations (get team, members, ...) |
| `hub.ts` | Hub/Marketplace operations |
| `hooks.ts` | React hooks สำหรับเรียก API (`useSellerTeams`, `useBalance`, ...) |
| `storage-helpers.ts` | อ่าน/เขียน localStorage, seed data |
| `client.ts` | API client config (พร้อมต่อ backend จริง) |

### รูปแบบการเรียก API

```typescript
// ใช้ hooks (แนะนำ)
const { data: teams, isLoading, refetch } = useSellerTeams();

// เรียกตรง
const team = await api.seller.createTeam({ name: "TikTok Team" });
```

ทุก API function มี `await delay()` จำลอง network latency และอ่าน/เขียนจาก localStorage

---

## หมายเหตุ

- โปรเจคนี้เป็น **Prototype / Frontend Demo** -- ยังไม่มี backend, database, หรือ API จริง
- ข้อมูลทั้งหมดเก็บใน **localStorage** ของ browser
- ระบบ **OCR** อ่านบัตรประชาชนเป็น mock data (return ข้อมูลจำลอง)
- ระบบ **OTP** ยืนยันเบอร์โทรเป็น mock (ใส่ 6 หลักอะไรก็ผ่าน)
- ระบบ **Login** เป็น mock (ใส่ email/password อะไรก็ผ่าน ยกเว้น Admin ต้องมีคำว่า "admin" ใน email)
- Seed data จะถูกสร้างอัตโนมัติเมื่อเปิดแอปครั้งแรก
- โครงสร้าง types และ API layer ออกแบบมาให้ **พร้อมต่อ backend จริง** -- แค่เปลี่ยน mock functions เป็น fetch calls
