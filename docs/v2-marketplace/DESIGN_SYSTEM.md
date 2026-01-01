# Design System - MeeLike Marketplace V2

> Minimal, Clean, Modern UI Guidelines

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
[/] MONOCHROME+   - สีหลัก 1 สี + Neutral
```

---

## Color Palette

### Brand Colors

| Name | Hex | CSS Variable | Usage |
|------|-----|--------------|-------|
| Primary | `#FF6B35` | `--color-primary` | CTA, Links, Active states |
| Primary Dark | `#E55A2B` | `--color-primary-dark` | Hover, Pressed |
| Primary Light | `#FFF4F0` | `--color-primary-light` | Backgrounds, Highlights |

### Neutral Colors

| Name | Hex | CSS Variable | Usage |
|------|-----|--------------|-------|
| Black | `#0F0F0F` | `--color-black` | Headlines |
| Gray 800 | `#1F1F1F` | `--color-gray-800` | Body text |
| Gray 600 | `#4B4B4B` | `--color-gray-600` | Secondary text |
| Gray 400 | `#9B9B9B` | `--color-gray-400` | Placeholders |
| Gray 200 | `#E5E5E5` | `--color-gray-200` | Borders |
| Gray 100 | `#F5F5F5` | `--color-gray-100` | Backgrounds |
| White | `#FFFFFF` | `--color-white` | Cards, Surfaces |

### Status Colors

| Status | Hex | Icon | Usage |
|--------|-----|------|-------|
| Success | `#22C55E` | `check-circle` | Completed, Verified |
| Warning | `#F59E0B` | `alert-triangle` | Pending, Attention |
| Error | `#EF4444` | `x-circle` | Failed, Error |
| Info | `#3B82F6` | `info` | Information |

---

## Typography

### Font Stack

```css
/* Thai + English */
font-family: 'IBM Plex Sans Thai', 'Inter', -apple-system, sans-serif;

/* Monospace (numbers, code) */
font-family: 'JetBrains Mono', 'SF Mono', monospace;
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

### Icon Colors

```css
/* Default */
color: var(--color-gray-600);

/* Interactive */
color: var(--color-primary);

/* On dark background */
color: var(--color-white);

/* Status */
color: var(--color-success);
color: var(--color-warning);
color: var(--color-error);
```

---

## Components

### Buttons

```
PRIMARY BUTTON
┌────────────────────────────────────┐
│  [icon]  Button Text               │
│                                    │
│  bg: primary                       │
│  text: white                       │
│  padding: 12px 20px                │
│  radius: 8px                       │
│  font-weight: 600                  │
│  transition: 150ms                 │
│                                    │
│  hover: bg primary-dark            │
│  active: scale 0.98                │
└────────────────────────────────────┘

SECONDARY BUTTON
┌────────────────────────────────────┐
│  [icon]  Button Text               │
│                                    │
│  bg: white                         │
│  text: gray-800                    │
│  border: 1px gray-200              │
│  padding: 12px 20px                │
│  radius: 8px                       │
│                                    │
│  hover: bg gray-50                 │
└────────────────────────────────────┘

GHOST BUTTON
┌────────────────────────────────────┐
│  [icon]  Button Text               │
│                                    │
│  bg: transparent                   │
│  text: gray-600                    │
│  padding: 8px 12px                 │
│                                    │
│  hover: bg gray-100                │
└────────────────────────────────────┘

ICON BUTTON
┌──────────┐
│  [icon]  │  size: 40px x 40px
│          │  radius: 8px
└──────────┘  hover: bg gray-100
```

### Cards

```
STANDARD CARD
┌────────────────────────────────────────────────┐
│                                                │
│  bg: white                                     │
│  border: 1px gray-200                          │
│  radius: 12px                                  │
│  padding: 20px                                 │
│  shadow: none (or 0 1px 3px rgba(0,0,0,0.08))  │
│                                                │
│  hover: border gray-300 (if clickable)         │
│                                                │
└────────────────────────────────────────────────┘

JOB CARD
┌────────────────────────────────────────────────┐
│ [platform-icon]  Action Type        [price]    │
│                                                │
│ Target URL or Description                      │
│                                                │
│ ────────────────────────────────────────────   │
│                                                │
│ [clock] Expires in 2d    [progress-bar] 85%    │
│                                                │
│                        [Secondary] [Primary]   │
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
STATUS BADGES (no emoji!)

[check-circle] Completed     bg: green-50, text: green-700
[clock] Pending              bg: yellow-50, text: yellow-700
[x-circle] Failed            bg: red-50, text: red-700
[loader] Processing          bg: blue-50, text: blue-700

LEVEL BADGES

New        bg: gray-100, text: gray-600
Bronze     bg: amber-100, text: amber-700
Silver     bg: slate-100, text: slate-600
Gold       bg: yellow-100, text: yellow-700
Platinum   bg: violet-100, text: violet-700
```

### Navigation

```
SIDEBAR (Desktop)
┌──────────────────────┐
│                      │
│  MEELIKE             │  Logo - text only, bold
│                      │
│  ────────────────    │
│                      │
│  [home] Dashboard    │  Nav item - icon + text
│  [briefcase] Jobs    │  Active: bg primary-light
│  [wallet] Wallet     │           text primary
│  [user] Profile      │           left border primary
│                      │
│  ────────────────    │
│                      │
│  [settings] Settings │
│  [log-out] Logout    │
│                      │
└──────────────────────┘

BOTTOM NAV (Mobile)
┌──────┬──────┬──────┬──────┐
│[home]│[brief]│[wall]│[user]│
│ Home │ Jobs │Wallet│ Me   │
└──────┴──────┴──────┴──────┘
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
