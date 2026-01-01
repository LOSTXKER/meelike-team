# 🎨 Design System

> MeeLike Platform Design Guidelines

## 📋 สารบัญ

1. [Colors](#colors)
2. [Typography](#typography)
3. [Components](#components)
4. [Spacing](#spacing)
5. [Icons](#icons)

---

## Colors

### Primary Colors

| Name | Hex | Usage |
|------|-----|-------|
| Primary | `#FF6B35` | Buttons, Links, CTAs |
| Primary Dark | `#E55A2B` | Hover states |
| Primary Light | `#FF8F6B` | Backgrounds |

### Secondary Colors

| Name | Hex | Usage |
|------|-----|-------|
| Secondary | `#4ECDC4` | Accents, Success |
| Secondary Dark | `#3DB8B0` | Hover states |

### Neutral Colors

| Name | Hex | Usage |
|------|-----|-------|
| Gray 900 | `#1A1A2E` | Text primary |
| Gray 700 | `#4A4A5A` | Text secondary |
| Gray 500 | `#6B6B7A` | Placeholders |
| Gray 300 | `#D1D1D9` | Borders |
| Gray 100 | `#F5F5F7` | Backgrounds |
| White | `#FFFFFF` | Cards, Modals |

### Status Colors

| Name | Hex | Usage |
|------|-----|-------|
| Success | `#22C55E` | Success states |
| Warning | `#F59E0B` | Warning states |
| Error | `#EF4444` | Error states |
| Info | `#3B82F6` | Info states |

---

## Typography

### Font Family

```css
font-family: 'Noto Sans Thai', 'Inter', sans-serif;
```

### Font Sizes

| Name | Size | Line Height | Usage |
|------|------|-------------|-------|
| xs | 12px | 16px | Captions |
| sm | 14px | 20px | Body small |
| base | 16px | 24px | Body |
| lg | 18px | 28px | Subheadings |
| xl | 20px | 28px | Headings |
| 2xl | 24px | 32px | Page titles |
| 3xl | 30px | 36px | Hero titles |

### Font Weights

| Name | Weight | Usage |
|------|--------|-------|
| Normal | 400 | Body text |
| Medium | 500 | Emphasis |
| Semibold | 600 | Subheadings |
| Bold | 700 | Headings |

---

## Components

### Buttons

```
┌─────────────────────────────────────────────────┐
│  Primary Button                                 │
│  bg: primary | text: white | rounded: 8px       │
│  padding: 12px 24px | font-weight: 600          │
└─────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────┐
│  Secondary Button                               │
│  bg: white | text: primary | border: primary    │
│  rounded: 8px | padding: 12px 24px              │
└─────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────┐
│  Ghost Button                                   │
│  bg: transparent | text: gray-700               │
│  hover: bg-gray-100                             │
└─────────────────────────────────────────────────┘
```

### Cards

```
┌─────────────────────────────────────────────────┐
│  Card                                           │
│  bg: white | rounded: 12px | shadow: sm         │
│  padding: 16px | border: 1px gray-200           │
└─────────────────────────────────────────────────┘
```

### Inputs

```
┌─────────────────────────────────────────────────┐
│  Input                                          │
│  bg: white | border: 1px gray-300               │
│  rounded: 8px | padding: 12px 16px              │
│  focus: border-primary ring-2 ring-primary/20   │
└─────────────────────────────────────────────────┘
```

### Badges

```
Status Badges:
🟢 Success  - bg-green-100 text-green-700
🟡 Warning  - bg-yellow-100 text-yellow-700
🔴 Error    - bg-red-100 text-red-700
🔵 Info     - bg-blue-100 text-blue-700
⚪ Default  - bg-gray-100 text-gray-700
```

---

## Spacing

### Scale

| Name | Size | Usage |
|------|------|-------|
| 1 | 4px | Tight spacing |
| 2 | 8px | Small gaps |
| 3 | 12px | Medium gaps |
| 4 | 16px | Standard spacing |
| 5 | 20px | Section gaps |
| 6 | 24px | Large gaps |
| 8 | 32px | Section separators |
| 10 | 40px | Page sections |
| 12 | 48px | Major sections |

### Container

```css
max-width: 1280px;
padding-x: 16px (mobile) | 24px (tablet) | 32px (desktop);
```

---

## Icons

### Icon Library

Using **Lucide Icons** (React)

```tsx
import { Home, User, Settings } from 'lucide-react';
```

### Icon Sizes

| Name | Size | Usage |
|------|------|-------|
| sm | 16px | Inline icons |
| md | 20px | Buttons, inputs |
| lg | 24px | Navigation |
| xl | 32px | Empty states |
| 2xl | 48px | Hero sections |

---

## Responsive Breakpoints

| Name | Width | Usage |
|------|-------|-------|
| sm | 640px | Mobile landscape |
| md | 768px | Tablet |
| lg | 1024px | Small desktop |
| xl | 1280px | Desktop |
| 2xl | 1536px | Large desktop |

---

## Shadows

| Name | Value | Usage |
|------|-------|-------|
| sm | `0 1px 2px rgba(0,0,0,0.05)` | Subtle elevation |
| md | `0 4px 6px rgba(0,0,0,0.1)` | Cards |
| lg | `0 10px 15px rgba(0,0,0,0.1)` | Dropdowns |
| xl | `0 20px 25px rgba(0,0,0,0.1)` | Modals |

---

## Animation

### Durations

| Name | Duration | Usage |
|------|----------|-------|
| fast | 150ms | Hover states |
| normal | 200ms | Transitions |
| slow | 300ms | Page transitions |

### Easing

```css
transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
```
