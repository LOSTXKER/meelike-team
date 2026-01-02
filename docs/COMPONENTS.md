# Components Guide

Comprehensive guide to all UI components in the MeeLike Seller platform.

## Table of Contents

- [Layout Components](#layout-components)
- [Pattern Components](#pattern-components)
- [Interactive Components](#interactive-components)
- [Form Components](#form-components)
- [Base Components](#base-components)

---

## Layout Components

### Container

Wraps content with max-width and horizontal padding for consistent page layout.

**Props:**
- `size?: "sm" | "md" | "lg" | "xl" | "full"` - Maximum width (default: "xl")
- `className?: string` - Additional CSS classes

**Usage:**
```tsx
import { Container } from "@/components/layout";

<Container size="xl">
  <h1>Page Content</h1>
</Container>
```

**Replaces:** `<div className="max-w-7xl mx-auto px-4">`

---

### Stack / VStack / HStack

Flexbox-based layout component for arranging children with consistent spacing.

**Props:**
- `direction?: "vertical" | "horizontal"` - Stack direction (default: "vertical")
- `gap?: SpaceKey` - Space between items (default: 4)
- `align?: "start" | "center" | "end" | "stretch"` - Cross-axis alignment
- `justify?: "start" | "center" | "end" | "between" | "around"` - Main-axis alignment
- `wrap?: boolean` - Allow wrapping (default: false)

**Usage:**
```tsx
import { VStack, HStack } from "@/components/layout";

// Vertical stack
<VStack gap={4} align="center">
  <div>Item 1</div>
  <div>Item 2</div>
</VStack>

// Horizontal stack
<HStack gap={3} justify="between">
  <button>Cancel</button>
  <button>Save</button>
</HStack>
```

**Replaces:** `<div className="flex flex-col gap-4">`

---

### Grid

CSS Grid layout component with responsive breakpoints.

**Props:**
- `cols?: 1 | 2 | 3 | 4 | 6 | 12` - Number of columns (default: 1)
- `gap?: SpaceKey` - Gap between items (default: 4)
- `responsive?: { sm?, md?, lg? }` - Responsive column counts

**Usage:**
```tsx
import { Grid } from "@/components/layout";

<Grid cols={2} responsive={{ lg: 4 }} gap={4}>
  <Card>Item 1</Card>
  <Card>Item 2</Card>
  <Card>Item 3</Card>
  <Card>Item 4</Card>
</Grid>
```

**Replaces:** `<div className="grid grid-cols-2 lg:grid-cols-4 gap-4">`

---

### Section

Section wrapper with vertical spacing between children.

**Props:**
- `spacing?: "sm" | "md" | "lg"` - Vertical spacing (default: "md")

**Usage:**
```tsx
import { Section } from "@/components/layout";

<Section spacing="lg">
  <PageHeader title="Dashboard" />
  <StatsGrid stats={stats} />
  <RecentOrders />
</Section>
```

**Replaces:** `<div className="space-y-6">`

---

## Pattern Components

### StatCard

Display key metrics with icon, trend, and click interaction.

**Props:**
- `label: string` - Stat label
- `value: string | number` - Stat value
- `icon: LucideIcon` - Icon component
- `iconColor?: string` - Icon color class (default: "text-brand-primary")
- `iconBgColor?: string` - Icon background class (default: "bg-brand-primary/10")
- `trend?: { value: number, isPositive: boolean }` - Trend indicator
- `onClick?: () => void` - Click handler

**Usage:**
```tsx
import { StatCard } from "@/components/shared";
import { DollarSign } from "lucide-react";

<StatCard
  label="รายได้เดือนนี้"
  value={formatCurrency(monthlyRevenue)}
  icon={DollarSign}
  iconColor="text-brand-success"
  iconBgColor="bg-brand-success/10"
  trend={{ value: 12.5, isPositive: true }}
  onClick={() => router.push('/seller/finance')}
/>
```

**Replaces:** ~20 lines of repeated card markup for stats

---

### InfoCard

Display information with icon, title, description, badge, and action button.

**Props:**
- `icon: LucideIcon` - Icon component
- `iconColor?: string` - Icon color
- `title: string` - Card title
- `description?: string` - Card description
- `badge?: React.ReactNode` - Badge element
- `action?: React.ReactNode` - Action button/element
- `onClick?: () => void` - Click handler

**Usage:**
```tsx
import { InfoCard } from "@/components/shared";
import { Users, ChevronRight } from "lucide-react";

<InfoCard
  icon={Users}
  iconColor="text-brand-info"
  title={team.name}
  description={`${team.memberCount} สมาชิก`}
  badge={<Badge variant="success">Active</Badge>}
  action={<Button variant="ghost" size="sm"><ChevronRight /></Button>}
  onClick={() => router.push(`/team/${team.id}`)}
/>
```

---

### QuickActionCard

Display quick action cards with stats (used in dashboard).

**Props:**
- `icon: LucideIcon` - Icon component
- `title: string` - Action title
- `description: string` - Action description
- `colorClass: string` - Gradient color classes
- `href: string` - Navigation link
- `stats?: Array<{ label, value, icon, color }>` - Optional stats

**Usage:**
```tsx
import { QuickActionCard } from "@/components/shared";
import { Package, LayoutGrid, CheckCircle } from "lucide-react";

<QuickActionCard
  icon={Package}
  title="บริการ"
  description="จัดการบริการของคุณ"
  colorClass="from-blue-500 to-blue-600"
  href="/seller/services"
  stats={[
    { label: "ทั้งหมด", value: 45, icon: LayoutGrid, color: "text-brand-primary" },
    { label: "เปิดขาย", value: 32, icon: CheckCircle, color: "text-brand-success" }
  ]}
/>
```

---

## Interactive Components

### Tooltip

Display contextual information on hover/focus.

**Props:**
- `content: React.ReactNode` - Tooltip content
- `side?: "top" | "right" | "bottom" | "left"` - Position (default: "top")
- `delay?: number` - Show delay in ms (default: 200)
- `children: React.ReactNode` - Trigger element

**Usage:**
```tsx
import { Tooltip } from "@/components/ui";

<Tooltip content="คัดลอกลิงก์" side="top">
  <Button variant="ghost" size="sm">
    <Copy className="w-4 h-4" />
  </Button>
</Tooltip>
```

---

### Dropdown

Dropdown menu with click-outside and keyboard support.

**Props:**
- `trigger: React.ReactNode` - Trigger element
- `items: DropdownItem[]` - Menu items
  - `{ icon?, label, onClick, variant?, divider? }`
- `align?: "left" | "right"` - Alignment (default: "right")

**Usage:**
```tsx
import { Dropdown } from "@/components/ui";
import { Edit, Trash, MoreVertical } from "lucide-react";

<Dropdown
  trigger={<Button variant="ghost" size="sm"><MoreVertical /></Button>}
  items={[
    { icon: Edit, label: "แก้ไข", onClick: handleEdit },
    { divider: true },
    { icon: Trash, label: "ลบ", onClick: handleDelete, variant: "danger" }
  ]}
  align="right"
/>
```

---

### Tabs

Tab navigation with pills or line variants.

**Props:**
- `tabs: Tab[]` - Tab items `{ id, label, icon?, count? }`
- `activeTab: string` - Active tab ID
- `onChange: (id: string) => void` - Tab change handler
- `variant?: "line" | "pills"` - Style variant (default: "line")

**Usage:**
```tsx
import { Tabs } from "@/components/ui";

<Tabs
  tabs={[
    { id: "all", label: "ทั้งหมด", count: 45 },
    { id: "active", label: "เปิดใช้งาน", count: 32 },
    { id: "inactive", label: "ปิดใช้งาน", count: 13 }
  ]}
  activeTab={activeTab}
  onChange={setActiveTab}
  variant="pills"
/>
```

---

### Switch

Toggle switch for boolean states.

**Props:**
- `checked: boolean` - Switch state
- `onChange: (checked: boolean) => void` - Change handler
- `label?: string` - Optional label
- `disabled?: boolean` - Disabled state

**Usage:**
```tsx
import { Switch } from "@/components/ui";

<Switch
  checked={notifications.email}
  onChange={(checked) => updateNotifications({ email: checked })}
  label="แจ้งเตือนทางอีเมล"
/>
```

---

### Dialog (replaces Modal)

Compound component for dialogs with better structure.

**Props:**
- `open: boolean` - Dialog state
- `onClose: () => void` - Close handler
- `size?: "sm" | "md" | "lg" | "xl" | "full"` - Dialog size

**Sub-components:**
- `Dialog.Header` - Header with close button
- `Dialog.Title` - Dialog title
- `Dialog.Description` - Description text
- `Dialog.Body` - Main content
- `Dialog.Footer` - Footer with actions

**Usage:**
```tsx
import { Dialog, Button } from "@/components/ui";

<Dialog open={isOpen} onClose={onClose} size="lg">
  <Dialog.Header>
    <Dialog.Title>ยืนยันการลบ</Dialog.Title>
    <Dialog.Description>คุณแน่ใจหรือไม่?</Dialog.Description>
  </Dialog.Header>
  
  <Dialog.Body>
    <p>การกระทำนี้ไม่สามารถยกเลิกได้</p>
  </Dialog.Body>
  
  <Dialog.Footer>
    <Button variant="outline" onClick={onClose}>ยกเลิก</Button>
    <Button variant="danger" onClick={handleDelete}>ลบ</Button>
  </Dialog.Footer>
</Dialog>
```

---

### Checkbox

Checkbox input with optional label.

**Props:**
- `checked: boolean` - Checked state
- `onChange: (checked: boolean) => void` - Change handler
- `label?: string` - Optional label
- `disabled?: boolean` - Disabled state

**Usage:**
```tsx
import { Checkbox } from "@/components/ui";

<Checkbox
  checked={agreeToTerms}
  onChange={setAgreeToTerms}
  label="ยอมรับข้อตกลงและเงื่อนไข"
/>
```

---

### RadioGroup

Radio button group with descriptions.

**Props:**
- `value: string` - Selected value
- `onChange: (value: string) => void` - Change handler
- `options: RadioOption[]` - Options `{ value, label, description? }`
- `name: string` - Input name

**Usage:**
```tsx
import { RadioGroup } from "@/components/ui";

<RadioGroup
  name="subscription-plan"
  value={selectedPlan}
  onChange={setSelectedPlan}
  options={[
    { value: "free", label: "Free", description: "เริ่มต้นใช้งานฟรี" },
    { value: "basic", label: "Basic", description: "฿299/เดือน" },
    { value: "pro", label: "Pro", description: "฿899/เดือน" }
  ]}
/>
```

---

## Form Components

### FormField

Wrapper for form inputs with label, hint, and error display.

**Props:**
- `label?: string` - Field label
- `required?: boolean` - Show required indicator
- `error?: string` - Error message
- `hint?: string` - Hint text
- `children: React.ReactNode` - Input element

**Usage:**
```tsx
import { FormField, FormInput } from "@/components/shared";

<FormField label="ชื่อบริการ" required error={errors.name}>
  <FormInput
    name="name"
    placeholder="เช่น ไลค์ Facebook"
  />
</FormField>
```

---

## Base Components (Enhanced)

### Button (Enhanced)

**New variants:**
- `success` - Green button
- `warning` - Amber button
- `link` - Link-style button

**New props:**
- `fullWidth?: boolean` - Full width button

**Usage:**
```tsx
<Button variant="success" fullWidth>
  บันทึก
</Button>
```

---

### Card (Enhanced)

**New variants:**
- `gradient` - Gradient background
- `glass` - Glass morphism effect
- `outline` - Outlined card

---

### Input (Enhanced)

**New props:**
- `hint?: string` - Help text
- `rightElement?: React.ReactNode` - Right side element (e.g., button)
- `variant?: "default" | "filled"` - Input variant

**Usage:**
```tsx
<Input
  label="ค้นหา"
  hint="พิมพ์อย่างน้อย 3 ตัวอักษร"
  leftIcon={<Search />}
  rightElement={<Button size="sm">ค้นหา</Button>}
/>
```

---

## Accessibility Hooks

### useFocusTrap

Trap focus within a container (for modals/dialogs).

```tsx
import { useFocusTrap } from "@/lib/hooks";

const containerRef = useFocusTrap(isOpen);

<div ref={containerRef}>
  {/* Modal content */}
</div>
```

### useKeyboardNavigation

Keyboard navigation for lists.

```tsx
import { useKeyboardNavigation } from "@/lib/hooks";

const { activeIndex } = useKeyboardNavigation(
  items,
  (item) => handleSelect(item),
  true
);
```

---

## Design Tokens

Access design tokens for consistent styling:

```tsx
import { tokens } from "@/lib/design";

// Use in components
style={{ gap: tokens.space[4] }}

// Available tokens:
// - tokens.space - Spacing scale
// - tokens.radii - Border radius
// - tokens.shadows - Shadow styles
// - tokens.transitions - Transition durations
// - tokens.zIndices - Z-index layers
```

---

## Migration Examples

### Before & After: Dashboard Stats

**Before:**
```tsx
<div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
  {stats.map((stat) => (
    <div className="bg-white rounded-2xl p-4 shadow-md hover:shadow-lg...">
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm text-brand-text-light">{stat.label}</span>
        <div className="p-1.5 rounded-full bg-brand-primary/10">
          <stat.icon className="w-5 h-5 text-brand-primary" />
        </div>
      </div>
      <p className="text-2xl font-bold">{stat.value}</p>
    </div>
  ))}
</div>
```

**After:**
```tsx
<Grid cols={2} responsive={{ lg: 4 }} gap={4}>
  {stats.map((stat) => (
    <StatCard
      key={stat.id}
      label={stat.label}
      value={stat.value}
      icon={stat.icon}
      iconColor={stat.iconColor}
      iconBgColor={stat.iconBgColor}
      onClick={() => router.push(stat.link)}
    />
  ))}
</Grid>
```

**Result:** 80% less code, fully reusable, type-safe

---

For more examples, see [`UI_MIGRATION_GUIDE.md`](./UI_MIGRATION_GUIDE.md)
