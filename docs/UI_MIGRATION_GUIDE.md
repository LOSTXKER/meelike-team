# UI Migration Guide

Guide for migrating from old patterns to new components system.

## Quick Reference

| Old Pattern | New Component |  Benefit |
|------------|---------------|----------|
| `<div className="max-w-7xl mx-auto px-4">` | `<Container size="xl">` | Consistent width system |
| `<div className="flex flex-col gap-4">` | `<VStack gap={4}>` | Type-safe spacing |
| `<div className="grid grid-cols-2 lg:grid-cols-4 gap-4">` | `<Grid cols={2} responsive={{ lg: 4 }} gap={4}>` | Responsive grid |
| `<div className="space-y-6">` | `<Section spacing="md">` | Vertical spacing |
| Custom stat card (20+ lines) | `<StatCard {...props} />` | Reusable, consistent |
| Custom filter tabs | `<Tabs variant="pills" {...props} />` | Keyboard accessible |
| `<Modal>` | `<Dialog>` with compound components | Better structure |
| Inline switch JSX | `<Switch checked={...} onChange={...} />` | Accessible toggle |

---

## Pattern Replacements

### 1. Stat Cards

#### Before (89 lines):
```tsx
<div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
  <div
    onClick={() => router.push('/seller/finance')}
    className="bg-white rounded-2xl p-4 shadow-md hover:shadow-lg hover:border-brand-primary/30 border border-transparent transition-all cursor-pointer group h-full relative overflow-hidden"
  >
    <div className="flex items-center justify-between mb-2">
      <span className="text-sm text-brand-text-light">รายได้เดือนนี้</span>
      <div className="p-1.5 rounded-full bg-brand-primary/10">
        <DollarSign className="w-5 h-5 text-brand-primary" />
      </div>
    </div>
    <p className="text-2xl font-bold text-brand-text-dark">
      {formatCurrency(monthlyRevenue)}
    </p>
    <div className="flex items-center gap-1 mt-1">
      <TrendingUp className="w-4 h-4 text-brand-success" />
      <span className="text-sm font-medium text-brand-success">
        12.5%
      </span>
    </div>
  </div>
  {/* Repeat 3 more times... */}
</div>
```

#### After (15 lines):
```tsx
<Grid cols={2} responsive={{ lg: 4 }} gap={4}>
  <StatCard
    label="รายได้เดือนนี้"
    value={formatCurrency(monthlyRevenue)}
    icon={DollarSign}
    iconColor="text-brand-success"
    iconBgColor="bg-brand-success/10"
    trend={{ value: 12.5, isPositive: true }}
    onClick={() => router.push('/seller/finance')}
  />
  {/* More stats... */}
</Grid>
```

**Savings:** 83% less code, fully type-safe

---

### 2. Filter Tabs

#### Before (25 lines):
```tsx
<div className="flex items-center gap-2 bg-brand-bg rounded-xl p-1">
  {periods.map((period) => (
    <button
      key={period.id}
      onClick={() => setPeriod(period.id)}
      className={cn(
        "flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all",
        selectedPeriod === period.id
          ? "bg-white text-brand-text-dark shadow-sm"
          : "text-brand-text-light hover:text-brand-text-dark"
      )}
    >
      {period.label}
    </button>
  ))}
</div>
```

#### After (9 lines):
```tsx
<Tabs
  tabs={[
    { id: "7d", label: "7 วัน" },
    { id: "30d", label: "30 วัน" },
    { id: "3m", label: "3 เดือน" }
  ]}
  activeTab={period}
  onChange={setPeriod}
  variant="pills"
/>
```

**Savings:** 64% less code + keyboard navigation

---

### 3. Team Cards

#### Before (35 lines):
```tsx
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
  {teams.map((team) => (
    <div
      key={team.id}
      onClick={() => router.push(`/seller/team/${team.id}`)}
      className="bg-white rounded-2xl p-5 shadow-sm border border-brand-border/50 cursor-pointer hover:shadow-md transition-all"
    >
      <div className="flex items-start gap-3">
        <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-gradient-to-br from-brand-primary/10 to-brand-primary/5">
          <Users className="w-6 h-6 text-brand-info" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="font-semibold text-brand-text-dark">{team.name}</h3>
            <Badge variant="success">{team.status}</Badge>
          </div>
          <p className="text-sm text-brand-text-light">
            {team.memberCount} สมาชิก • {team.activeJobCount} งานที่กำลังทำ
          </p>
        </div>
        <Button variant="ghost" size="sm">
          <ChevronRight className="w-5 h-5" />
        </Button>
      </div>
    </div>
  ))}
</div>
```

#### After (18 lines):
```tsx
<Grid cols={1} responsive={{ md: 2, lg: 3 }} gap={4}>
  {teams.map((team) => (
    <InfoCard
      key={team.id}
      icon={Users}
      iconColor="text-brand-info"
      title={team.name}
      description={`${team.memberCount} สมาชิก • ${team.activeJobCount} งานที่กำลังทำ`}
      badge={<Badge variant="success">{team.status}</Badge>}
      action={<Button variant="ghost" size="sm"><ChevronRight /></Button>}
      onClick={() => router.push(`/seller/team/${team.id}`)}
    />
  ))}
</Grid>
```

**Savings:** 49% less code

---

### 4. Modal to Dialog

#### Before:
```tsx
<Modal isOpen={isOpen} onClose={onClose} title="แก้ไขบริการ" size="lg">
  <form className="space-y-4">
    <ServiceForm service={editingService} />
    <div className="flex gap-3 pt-4">
      <Button variant="outline" onClick={onClose}>ยกเลิก</Button>
      <Button type="submit">บันทึก</Button>
    </div>
  </form>
</Modal>
```

#### After:
```tsx
<Dialog open={isOpen} onClose={onClose} size="lg">
  <Dialog.Header>
    <Dialog.Title>แก้ไขบริการ</Dialog.Title>
    <Dialog.Description>กรอกข้อมูลบริการที่ต้องการแก้ไข</Dialog.Description>
  </Dialog.Header>
  
  <Dialog.Body>
    <ServiceForm service={editingService} />
  </Dialog.Body>
  
  <Dialog.Footer>
    <Button variant="outline" onClick={onClose}>ยกเลิก</Button>
    <Button type="submit">บันทึก</Button>
  </Dialog.Footer>
</Dialog>
```

**Benefits:** Better semantic structure, automatic focus trap

---

### 5. Settings Toggle

#### Before:
```tsx
<div className="flex items-center justify-between">
  <span>แจ้งเตือนทางอีเมล</span>
  <button
    onClick={() => setEmailNotif(!emailNotif)}
    className={cn(
      "relative inline-flex h-6 w-11 items-center rounded-full transition-colors",
      emailNotif ? "bg-brand-success" : "bg-gray-200"
    )}
  >
    <span
      className={cn(
        "inline-block h-4 w-4 transform rounded-full bg-white transition-transform",
        emailNotif ? "translate-x-6" : "translate-x-1"
      )}
    />
  </button>
</div>
```

#### After:
```tsx
<Switch
  checked={emailNotif}
  onChange={setEmailNotif}
  label="แจ้งเตือนทางอีเมล"
/>
```

**Benefits:** Accessible, ARIA support, keyboard control

---

### 6. Subscription Plan Selection

#### Before:
```tsx
<div className="space-y-3">
  {plans.map((plan) => (
    <label key={plan.id} className="flex items-start gap-3 p-3 rounded-lg border...">
      <input
        type="radio"
        name="plan"
        value={plan.id}
        checked={selectedPlan === plan.id}
        onChange={() => setSelectedPlan(plan.id)}
      />
      <div>
        <span>{plan.label}</span>
        <p>{plan.description}</p>
      </div>
    </label>
  ))}
</div>
```

#### After:
```tsx
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

**Benefits:** Cleaner markup, consistent styling

---

## Migration Strategy

### Step 1: Start with Layout Components

Replace basic layout patterns first as they're non-breaking:

```tsx
// Replace this pattern everywhere
<div className="max-w-7xl mx-auto px-4 lg:px-6">
  <div className="space-y-6">
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">

// With this
<Container size="xl">
  <Section spacing="md">
    <Grid cols={2} responsive={{ lg: 4 }} gap={4}>
```

### Step 2: Replace Repeated Patterns

Identify and replace repeated card patterns:

1. **Stats cards** → `<StatCard>`
2. **Info cards** → `<InfoCard>`
3. **Quick actions** → `<QuickActionCard>`

### Step 3: Enhance Forms

Replace form components with enhanced versions:

```tsx
// Old
<Input label="Email" error={errors.email} />

// New
<FormField label="Email" error={errors.email} hint="ใช้สำหรับเข้าสู่ระบบ">
  <FormInput name="email" type="email" />
</FormField>
```

### Step 4: Update Interactive Elements

Replace custom implementations:

- Filter tabs → `<Tabs variant="pills">`
- Toggles → `<Switch>`
- Dropdowns → `<Dropdown>`
- Modals → `<Dialog>` compound

### Step 5: Add Accessibility

Use accessibility hooks where needed:

```tsx
// In modals/dialogs
const containerRef = useFocusTrap(isOpen);

// In dropdown menus
const { activeIndex } = useKeyboardNavigation(items, handleSelect);
```

---

## Common Patterns

### Dashboard Stats Grid

```tsx
<Grid cols={2} responsive={{ lg: 4 }} gap={4}>
  {dashboardStats.map((stat) => (
    <StatCard key={stat.id} {...stat} />
  ))}
</Grid>
```

### Page with Sections

```tsx
<Container size="xl">
  <Section spacing="lg">
    <PageHeader title="Dashboard" description="ภาพรวมธุรกิจของคุณ" />
    
    <Grid cols={2} responsive={{ lg: 4 }} gap={4}>
      {stats.map(stat => <StatCard key={stat.id} {...stat} />)}
    </Grid>
    
    <Card variant="bordered">
      <CardHeader>
        <CardTitle>รายการล่าสุด</CardTitle>
      </CardHeader>
      <CardContent>
        {/* Content */}
      </CardContent>
    </Card>
  </Section>
</Container>
```

### Form with Validation

```tsx
<form onSubmit={handleSubmit}>
  <VStack gap={5}>
    <FormField label="ชื่อบริการ" required error={errors.name}>
      <FormInput name="name" placeholder="เช่น ไลค์ Facebook" />
    </FormField>
    
    <FormField label="รายละเอียด" hint="อธิบายบริการของคุณ">
      <FormTextarea name="description" rows={3} maxCharacters={500} showCharCount />
    </FormField>
    
    <HStack gap={3} justify="end">
      <Button variant="outline" onClick={onCancel}>ยกเลิก</Button>
      <Button type="submit">บันทึก</Button>
    </HStack>
  </VStack>
</form>
```

### Confirmation Dialog

```tsx
<Dialog open={isOpen} onClose={onClose}>
  <Dialog.Header>
    <Dialog.Title>ยืนยันการลบ</Dialog.Title>
    <Dialog.Description>
      คุณแน่ใจหรือไม่ว่าต้องการลบ "{itemName}"? การกระทำนี้ไม่สามารถยกเลิกได้
    </Dialog.Description>
  </Dialog.Header>
  
  <Dialog.Footer>
    <Button variant="outline" onClick={onClose}>ยกเลิก</Button>
    <Button variant="danger" onClick={handleConfirm}>ลบ</Button>
  </Dialog.Footer>
</Dialog>
```

---

## Files to Update

### High Priority

Pages with repeated patterns (easiest wins):

1. [`src/app/seller/page.tsx`](../src/app/seller/page.tsx) - Dashboard stats
2. [`src/app/seller/analytics/page.tsx`](../src/app/seller/analytics/page.tsx) - Filter tabs
3. [`src/app/seller/team/page.tsx`](../src/app/seller/team/page.tsx) - Team cards

### Medium Priority

Pages with forms and settings:

4. [`src/app/seller/settings/page.tsx`](../src/app/seller/settings/page.tsx) - Switches
5. [`src/app/seller/settings/subscription/page.tsx`](../src/app/seller/settings/subscription/page.tsx) - Radio groups
6. [`src/components/seller/service-form.tsx`](../src/components/seller/service-form.tsx) - Already migrated!

### Lower Priority

All pages using Modal → migrate to Dialog incrementally.

---

## Checklist

### Before Migration

- [ ] Read [`COMPONENTS.md`](./COMPONENTS.md) for component documentation
- [ ] Check design tokens in `src/lib/design/tokens.ts`
- [ ] Review existing page to identify patterns

### During Migration

- [ ] Import new components from correct paths
- [ ] Replace layout components first (non-breaking)
- [ ] Replace pattern components next (big wins)
- [ ] Add accessibility features
- [ ] Test keyboard navigation
- [ ] Test responsive behavior

### After Migration

- [ ] Remove old unused code
- [ ] Update TypeScript imports
- [ ] Run linter `npm run lint`
- [ ] Test in browser
- [ ] Check accessibility with screen reader

---

## Benefits Summary

### Code Quality

- **40-80% less code** for common patterns
- **Type-safe** props with IntelliSense
- **Consistent** styling across app
- **Reusable** components

### Developer Experience

- **Faster development** with pre-built components
- **Easier maintenance** with centralized logic
- **Better docs** with component guide
- **Self-documenting** code with semantic names

### User Experience

- **Consistent** interactions across pages
- **Accessible** by default (ARIA, keyboard)
- **Responsive** on all devices
- **Smooth animations** with consistent timing

### Performance

- **Smaller bundles** through component reuse
- **Better tree-shaking** with modular exports
- **Optimized re-renders** with React best practices

---

## Getting Help

- **Component docs:** [`COMPONENTS.md`](./COMPONENTS.md)
- **Design tokens:** `src/lib/design/tokens.ts`
- **Examples:** Look at migrated pages (service-form.tsx, services/page.tsx)

## Next Steps

1. Start with **layout components** (Container, Grid, VStack)
2. Replace **dashboard stats** with StatCard
3. Migrate one page at a time
4. Test thoroughly before moving to next page
5. Enjoy cleaner, more maintainable code! 🎉
