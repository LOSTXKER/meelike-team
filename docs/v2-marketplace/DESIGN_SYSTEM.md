# Design System - MeeLike Marketplace V2

> Minimal, Clean, Modern UI Guidelines
> 
> **Theme:** Coffee & Cream (โทนน้ำตาล-เหลืองทอง) - ใช้ธีมเดียวกับ MeeLike Seller

---

## Design Principles

### Core Values

```
1. MINIMAL        - Less is more. ลดสิ่งที่ไม่จำเป็นออก
2. FUNCTIONAL     - ทุกองค์ประกอบต้องมีประโยชน์
3. FAST           - โหลดเร็ว ทำงานไว
4. ACCESSIBLE     - ใช้งานง่าย ทุกคนเข้าถึงได้
```

### Important Rules

```
[x] NO EMOJI      - ห้ามใช้ Emoji ทุกกรณี
[/] USE ICONS     - ใช้ Lucide Icons เท่านั้น
[/] CLEAN SPACE   - เว้นระยะให้หายใจ
[/] COFFEE THEME  - โทนน้ำตาล-เหลืองทอง
```

---

## Color Palette

### Coffee & Cream Theme (Light Mode)

```css
/* From globals.css - ใช้ธีมเดียวกับ MeeLike Seller */

:root {
  /* Brand Colors - Coffee & Cream (Modern Earthy) */
  --brand-bg: #FAF9F6;           /* Pearl White */
  --brand-surface: #FFFFFF;
  --brand-text-dark: #1A1512;    /* Deep Espresso */
  --brand-text-light: #6D5E54;   /* Muted Cocoa */
  
  --brand-primary: #8C6A54;      /* Medium Roast - น้ำตาล */
  --brand-primary-light: #E8DED5; /* Foam */
  
  --brand-secondary: #F4EFEA;    /* Light Cream */
  --brand-secondary-light: #FDFBF9;
  
  --brand-accent: #D4A373;       /* Golden Caramel - เหลืองทอง */
  --brand-border: #E6E0DB;       /* Subtle beige border */
}
```

### Brand Colors

| Name | Hex | CSS Variable | Usage |
|------|-----|--------------|-------|
| Primary (น้ำตาล) | `#8C6A54` | `--brand-primary` | CTA, Links, Active states |
| Primary Light | `#E8DED5` | `--brand-primary-light` | Backgrounds, Highlights |
| Accent (เหลืองทอง) | `#D4A373` | `--brand-accent` | Pop color, Warnings |

### Background & Surface

| Name | Hex | CSS Variable | Usage |
|------|-----|--------------|-------|
| Background | `#FAF9F6` | `--brand-bg` | Page background |
| Surface | `#FFFFFF` | `--brand-surface` | Cards, Modals |
| Secondary | `#F4EFEA` | `--brand-secondary` | Subtle backgrounds |
| Border | `#E6E0DB` | `--brand-border` | Borders, Dividers |

### Text Colors

| Name | Hex | CSS Variable | Usage |
|------|-----|--------------|-------|
| Dark | `#1A1512` | `--brand-text-dark` | Headlines, Primary text |
| Light | `#6D5E54` | `--brand-text-light` | Secondary text, Captions |

### Status Colors (Slightly Desaturated)

| Status | Hex | CSS Variable | Usage |
|--------|-----|--------------|-------|
| Success | `#588157` | `--brand-success` | Completed, Verified |
| Warning | `#D4A373` | `--brand-warning` | Pending (matches accent) |
| Error | `#B04F4F` | `--brand-error` | Failed, Error |
| Info | `#5FA8D3` | `--brand-info` | Information |

### Dark Mode (Espresso)

```css
.dark {
  --brand-bg: #0C0A09;           /* Rich Black */
  --brand-surface: #1C1917;      /* Dark Roast */
  --brand-text-dark: #FAF9F6;    /* Pearl */
  --brand-text-light: #A8A29E;   /* Stone */
  
  --brand-primary: #D4A373;      /* Caramel as primary in dark */
  --brand-primary-light: #8C6A54;
  
  --brand-secondary: #292524;
  --brand-secondary-light: #44403C;
  
  --brand-accent: #D4A373;
  --brand-border: #292524;
}
```

---

## Typography

### Font Stack

```css
/* Thai Primary - Sarabun (ใช้อยู่แล้วใน globals.css) */
font-family: 'Sarabun', sans-serif;

/* Import */
@import url('https://fonts.googleapis.com/css2?family=Sarabun:wght@300;400;500;600;700&display=swap');
```

### Type Scale

| Name | Size | Weight | Line Height | Usage |
|------|------|--------|-------------|-------|
| display | 36px | 700 | 1.2 | Hero, Landing |
| h1 | 28px | 700 | 1.3 | Page titles |
| h2 | 22px | 600 | 1.4 | Section titles |
| h3 | 18px | 600 | 1.4 | Card titles |
| body | 15px | 400 | 1.6 | Body text |
| small | 13px | 400 | 1.5 | Captions, Labels |
| tiny | 11px | 500 | 1.4 | Badges, Tags |

### Number Display

```css
/* เงิน/ตัวเลข ใช้ Monospace */
.amount {
  font-family: 'JetBrains Mono', monospace;
  font-variant-numeric: tabular-nums;
}
```

---

## Icons

### Icon Library

**Lucide React** - https://lucide.dev

```tsx
import { 
  Home, User, Settings, Wallet,
  ThumbsUp, UserPlus, MessageSquare,
  ArrowRight, Check, X, AlertTriangle,
  Clock, TrendingUp, Download, Upload
} from 'lucide-react';
```

### Platform Icons (Custom SVG)

```
facebook    - Facebook brand icon
instagram   - Instagram brand icon  
tiktok      - TikTok brand icon
twitter     - X/Twitter brand icon
```

### Icon Sizes

| Size | px | Usage |
|------|-----|-------|
| xs | 14px | Inline with small text |
| sm | 16px | Buttons, Inputs |
| md | 20px | Navigation, Lists |
| lg | 24px | Headers, Cards |
| xl | 32px | Empty states |
| 2xl | 48px | Hero sections |

### Icon Colors (Coffee Theme)

```css
/* Default */
color: var(--brand-text-light);  /* #6D5E54 - Muted Cocoa */

/* Interactive / Active */
color: var(--brand-primary);     /* #8C6A54 - Medium Roast */

/* Accent / Highlight */
color: var(--brand-accent);      /* #D4A373 - Golden Caramel */

/* On dark background */
color: var(--brand-bg);          /* #FAF9F6 - Pearl White */

/* Status */
color: var(--brand-success);     /* #588157 - Sage Green */
color: var(--brand-warning);     /* #D4A373 - Golden */
color: var(--brand-error);       /* #B04F4F - Muted Red */
color: var(--brand-info);        /* #5FA8D3 - Soft Blue */
```

---

## Components

### Buttons

```
PRIMARY BUTTON (Coffee Theme)
┌────────────────────────────────────┐
│  [icon]  Button Text               │
│                                    │
│  bg: #8C6A54 (brand-primary)       │
│  text: white                       │
│  padding: 12px 20px                │
│  radius: 8px                       │
│  font-weight: 600                  │
│  transition: 150ms                 │
│                                    │
│  hover: brightness 0.9             │
│  active: scale 0.98                │
└────────────────────────────────────┘

ACCENT BUTTON (Golden Caramel)
┌────────────────────────────────────┐
│  [icon]  Button Text               │
│                                    │
│  bg: #D4A373 (brand-accent)        │
│  text: white                       │
│  padding: 12px 20px                │
│  radius: 8px                       │
│                                    │
│  hover: brightness 0.9             │
└────────────────────────────────────┘

SECONDARY BUTTON
┌────────────────────────────────────┐
│  [icon]  Button Text               │
│                                    │
│  bg: #FFFFFF (brand-surface)       │
│  text: #1A1512 (brand-text-dark)   │
│  border: 1px #E6E0DB (brand-border)│
│  padding: 12px 20px                │
│  radius: 8px                       │
│                                    │
│  hover: bg #F4EFEA (brand-secondary)│
└────────────────────────────────────┘

GHOST BUTTON
┌────────────────────────────────────┐
│  [icon]  Button Text               │
│                                    │
│  bg: transparent                   │
│  text: #6D5E54 (brand-text-light)  │
│  padding: 8px 12px                 │
│                                    │
│  hover: bg #E8DED5 (primary-light) │
└────────────────────────────────────┘

ICON BUTTON
┌──────────┐
│  [icon]  │  size: 40px x 40px
│          │  radius: 8px
└──────────┘  hover: bg #E8DED5 (primary-light)
```

### Cards

```
STANDARD CARD (Coffee Theme)
┌────────────────────────────────────────────────┐
│                                                │
│  bg: #FFFFFF (brand-surface)                   │
│  border: 1px #E6E0DB (brand-border)            │
│  radius: 12px                                  │
│  padding: 20px                                 │
│  shadow: 0 1px 2px 0 rgb(26 21 18 / 0.05)      │
│                                                │
│  hover: border #8C6A54 (brand-primary)         │
│         (if clickable)                         │
│                                                │
└────────────────────────────────────────────────┘

JOB CARD
┌────────────────────────────────────────────────┐
│ [platform-icon]  Action Type        [price]    │
│                                                │
│ Target URL or Description (text-light)         │
│                                                │
│ ───────────────────────────────────────── (#E6E0DB)
│                                                │
│ [clock] Expires in 2d    [progress-bar] 85%    │
│ (text-light)             (accent: #D4A373)     │
│                                                │
│                   [Secondary] [Primary #8C6A54]│
└────────────────────────────────────────────────┘

STATS CARD
┌────────────────────────────────────────────────┐
│                                                │
│  bg: #F4EFEA (brand-secondary)                 │
│  border: none                                  │
│  radius: 12px                                  │
│  padding: 16px                                 │
│                                                │
│  [icon] (brand-primary #8C6A54)                │
│  Label (text-light #6D5E54)                    │
│  Value (text-dark #1A1512, font-bold)          │
│                                                │
└────────────────────────────────────────────────┘
```

### Inputs

```
TEXT INPUT
┌────────────────────────────────────────────────┐
│ Label                                          │
│ ┌────────────────────────────────────────────┐ │
│ │ [icon]  Placeholder text                   │ │
│ └────────────────────────────────────────────┘ │
│ Helper text or error message                   │
└────────────────────────────────────────────────┘

Specs:
- bg: white
- border: 1px gray-200
- radius: 8px
- padding: 12px 14px
- focus: border primary, ring 2px primary/20
- error: border error, ring 2px error/20
```

### Badges / Tags

```
STATUS BADGES (no emoji! - Coffee Theme)

[check-circle] Completed     bg: #588157/10, text: #588157 (success)
[clock] Pending              bg: #D4A373/10, text: #D4A373 (warning/accent)
[x-circle] Failed            bg: #B04F4F/10, text: #B04F4F (error)
[loader] Processing          bg: #5FA8D3/10, text: #5FA8D3 (info)

LEVEL BADGES (Coffee & Gold tones)

New        bg: #F4EFEA, text: #6D5E54 (secondary/text-light)
Bronze     bg: #DEB887/20, text: #8B4513
Silver     bg: #C0C0C0/20, text: #696969
Gold       bg: #D4A373/20, text: #8C6A54 (accent/primary)
Platinum   bg: #E5E4E2/30, text: #4A4A4A
```

### Navigation

```
SIDEBAR (Desktop) - Coffee Theme
┌──────────────────────┐
│                      │
│  MEELIKE             │  Logo - text #8C6A54, bold
│                      │
│  ──────────────── (#E6E0DB)
│                      │
│  [home] Dashboard    │  Nav item - icon + text
│  [briefcase] Jobs    │  Active:
│  [wallet] Wallet     │    bg: #E8DED5 (primary-light)
│  [user] Profile      │    text: #8C6A54 (primary)
│                      │    left-border: #8C6A54
│  ──────────────── (#E6E0DB)
│                      │  Inactive:
│  [settings] Settings │    text: #6D5E54 (text-light)
│  [log-out] Logout    │    hover: bg #F4EFEA
│                      │
└──────────────────────┘
bg: #FFFFFF (brand-surface)
border-right: 1px #E6E0DB (brand-border)

BOTTOM NAV (Mobile)
┌──────┬──────┬──────┬──────┐
│[home]│[brief]│[wall]│[user]│
│ Home │ Jobs │Wallet│ Me   │
└──────┴──────┴──────┴──────┘
bg: #FFFFFF
border-top: 1px #E6E0DB
Active icon: #8C6A54 (primary)
Inactive icon: #6D5E54 (text-light)
```

---

## Extension UI

### Popup Window

```
EXTENSION POPUP (400px x 500px)
┌────────────────────────────────────────────────┐
│                                                │
│  MEELIKE                      [settings-icon]  │
│                                                │
│  ┌──────────────────┐ ┌──────────────────┐    │
│  │ Today            │ │ Total            │    │
│  │ B 127.50         │ │ B 3,450.00       │    │
│  │ +B 0.25          │ │ Gold Level       │    │
│  └──────────────────┘ └──────────────────┘    │
│                                                │
│  My Jobs (3)                                   │
│  ┌────────────────────────────────────────┐   │
│  │ [fb] Like Post           B 0.25        │   │
│  │ facebook.com/...         [arrow-right] │   │
│  └────────────────────────────────────────┘   │
│  ┌────────────────────────────────────────┐   │
│  │ [ig] Follow              B 0.35        │   │
│  │ instagram.com/...        [arrow-right] │   │
│  └────────────────────────────────────────┘   │
│                                                │
│  [View All Jobs]              [Withdraw]      │
│                                                │
└────────────────────────────────────────────────┘
```

### Job Overlay (on Social Media page)

```
JOB OVERLAY - Floating Card
┌────────────────────────────────────────────────┐
│                                         [x]    │
│  MeeLike Job                                   │
│  ──────────────────────────────────────────    │
│                                                │
│  [thumbs-up] Like this post to earn            │
│                                                │
│  Reward: B 0.25                                │
│                                                │
│  [arrow-up] Click the Like button above        │
│                                                │
└────────────────────────────────────────────────┘

Position: Fixed, bottom-right of viewport
Width: 320px
Shadow: lg
Animation: slide-in from right
```

### Verification Overlay (Full Screen)

```
VERIFYING STATE
┌────────────────────────────────────────────────┐
│                                                │
│          (backdrop: blur + dark 50%)           │
│                                                │
│           ┌──────────────────────┐             │
│           │                      │             │
│           │    [loader icon]     │             │
│           │    Verifying...      │             │
│           │                      │             │
│           │    ████████░░ 80%    │             │
│           │                      │             │
│           │    Please wait       │             │
│           │                      │             │
│           └──────────────────────┘             │
│                                                │
└────────────────────────────────────────────────┘

SUCCESS STATE
┌────────────────────────────────────────────────┐
│                                                │
│           ┌──────────────────────┐             │
│           │                      │             │
│           │  [check-circle]      │             │
│           │    Success!          │             │
│           │                      │             │
│           │    +B 0.25           │             │
│           │                      │             │
│           │  Closing in 2s...    │             │
│           │                      │             │
│           └──────────────────────┘             │
│                                                │
└────────────────────────────────────────────────┘

Check icon: color success, size 48px
Amount: font-size 24px, font-weight 700
```

### Warning Overlay (Already Liked)

```
WARNING STATE
┌────────────────────────────────────────────────┐
│                                                │
│           ┌──────────────────────┐             │
│           │                      │             │
│           │  [alert-triangle]    │             │
│           │    Cannot Earn       │             │
│           │                      │             │
│           │  You already liked   │             │
│           │  this post           │             │
│           │                      │             │
│           │  Only new actions    │             │
│           │  will be rewarded    │             │
│           │                      │             │
│           │ [Cancel] [Find Jobs] │             │
│           │                      │             │
│           └──────────────────────┘             │
│                                                │
└────────────────────────────────────────────────┘

Alert icon: color warning, size 48px
```

---

## Web Dashboard UI

### Employer Dashboard

```
┌──────────────────────────────────────────────────────────────────────┐
│  MEELIKE                                    [notification] [avatar]  │
├────────────┬─────────────────────────────────────────────────────────┤
│            │                                                         │
│ [grid]     │  Dashboard                                              │
│ Dashboard  │  ─────────────────────────────────────────────────────  │
│            │                                                         │
│ [plus]     │  ┌─────────────┐ ┌─────────────┐ ┌─────────────┐       │
│ Create Job │  │ Balance     │ │ Active Jobs │ │ Completed   │       │
│            │  │ B 5,250.00  │ │ 12          │ │ 156         │       │
│ [list]     │  │ [Top Up]    │ │             │ │             │       │
│ My Jobs    │  └─────────────┘ └─────────────┘ └─────────────┘       │
│            │                                                         │
│ [wallet]   │  Active Jobs                              [View All]   │
│ Wallet     │  ┌───────────────────────────────────────────────────┐ │
│            │  │ [fb] Like    423/500   84%  ████████░░    B125.00 │ │
│ [bar-chart]│  │ [ig] Follow  150/300   50%  █████░░░░░    B105.00 │ │
│ Reports    │  │ [tt] Like    89/100    89%  █████████░    B 22.25 │ │
│            │  └───────────────────────────────────────────────────┘ │
│ ─────────  │                                                         │
│            │                                                         │
│ [settings] │                                                         │
│ Settings   │                                                         │
│            │                                                         │
└────────────┴─────────────────────────────────────────────────────────┘
```

### Worker Dashboard (Web)

```
┌──────────────────────────────────────────────────────────────────────┐
│  MEELIKE                                    [notification] [avatar]  │
├────────────┬─────────────────────────────────────────────────────────┤
│            │                                                         │
│ [grid]     │  Dashboard                                              │
│ Dashboard  │  ─────────────────────────────────────────────────────  │
│            │                                                         │
│ [search]   │  ┌─────────────┐ ┌─────────────┐ ┌─────────────┐       │
│ Find Jobs  │  │ Today       │ │ Total       │ │ Level       │       │
│            │  │ B 127.50    │ │ B 3,450.00  │ │ Gold        │       │
│ [briefcase]│  │ 52 jobs     │ │             │ │ [star]      │       │
│ My Jobs    │  └─────────────┘ └─────────────┘ └─────────────┘       │
│            │                                                         │
│ [wallet]   │  Available Jobs                     [Filter] [Refresh] │
│ Earnings   │  ┌───────────────────────────────────────────────────┐ │
│            │  │ [fb] Like Post                           B 0.25   │ │
│ [trophy]   │  │ facebook.com/page/...                             │ │
│ Leaderboard│  │ 77 remaining            Expires: 2d   [Claim]    │ │
│            │  ├───────────────────────────────────────────────────┤ │
│ ─────────  │  │ [ig] Follow Profile                      B 0.35   │ │
│            │  │ instagram.com/user/...                            │ │
│ [settings] │  │ 150 remaining           Expires: 3d   [Claim]    │ │
│ Settings   │  └───────────────────────────────────────────────────┘ │
│            │                                                         │
└────────────┴─────────────────────────────────────────────────────────┘
```

---

## Spacing System

| Token | Value | Usage |
|-------|-------|-------|
| space-1 | 4px | Tight inline spacing |
| space-2 | 8px | Icon gaps, tight padding |
| space-3 | 12px | Small component padding |
| space-4 | 16px | Standard padding |
| space-5 | 20px | Card padding |
| space-6 | 24px | Section gaps |
| space-8 | 32px | Large gaps |
| space-10 | 40px | Page sections |
| space-12 | 48px | Major sections |

---

## Animation

### Transitions

```css
/* Default */
transition: all 150ms ease;

/* Slow (modals, overlays) */
transition: all 200ms ease;
```

### Micro-interactions

```css
/* Button press */
transform: scale(0.98);

/* Card hover */
transform: translateY(-2px);
box-shadow: 0 4px 12px rgba(0,0,0,0.1);

/* Icon button hover */
background-color: var(--color-gray-100);
```

### Loading States

```
SPINNER (Lucide: loader-2)
- Animation: rotate 1s linear infinite
- Size: 20px (default), 16px (small), 24px (large)
- Color: primary (default), gray-400 (secondary)

SKELETON
- Background: linear-gradient(90deg, gray-100 25%, gray-200 50%, gray-100 75%)
- Animation: shimmer 1.5s infinite
- Border-radius: 4px
```

---

## Do's and Don'ts

### DO

```
[check] Use icons from Lucide library
[check] Keep UI clean with ample whitespace
[check] Use monospace font for numbers/amounts
[check] Provide clear feedback for all actions
[check] Use consistent spacing (4px grid)
[check] Make touch targets at least 44px
```

### DON'T

```
[x] Use emoji anywhere in the UI
[x] Use multiple accent colors
[x] Add decorative elements without purpose
[x] Use shadows excessively
[x] Mix icon libraries
[x] Use more than 2 font families
```

---

## File Structure

```
components/
├── ui/
│   ├── button.tsx
│   ├── card.tsx
│   ├── input.tsx
│   ├── badge.tsx
│   ├── skeleton.tsx
│   └── index.ts
├── icons/
│   ├── platform-icons.tsx    // FB, IG, TikTok, Twitter
│   └── index.ts
├── layout/
│   ├── sidebar.tsx
│   ├── top-header.tsx
│   ├── bottom-nav.tsx
│   └── index.ts
└── extension/
    ├── popup.tsx
    ├── job-overlay.tsx
    ├── verify-overlay.tsx
    └── warning-overlay.tsx
```

---

## Related Documents

- [EXTENSION_SPEC.md](./EXTENSION_SPEC.md) - Extension Technical Spec
- [USER_FLOWS.md](./USER_FLOWS.md) - User Flow Diagrams
- [../design/DESIGN_SYSTEM.md](../design/DESIGN_SYSTEM.md) - Original Design System
