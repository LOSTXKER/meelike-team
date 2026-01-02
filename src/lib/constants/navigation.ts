import {
  LayoutDashboard,
  Store,
  Package,
  ShoppingBag,
  Users,
  ClipboardList,
  CheckCircle,
  DollarSign,
  Wallet,
  CreditCard,
  History,
  UserCircle,
  Crown,
  Key,
  Home,
  Smartphone,
  User,
  Sparkles,
  Trophy,
  UserPlus,
  Settings,
  Building2,
  BarChart3,
  type LucideIcon,
} from "lucide-react";

export interface NavItem {
  label: string;
  href: string;
  icon: LucideIcon;
  badge?: number;
  isSpecial?: boolean; // สำหรับปุ่มพิเศษ เช่น ตลาด
}

export interface NavGroup {
  label: string;
  icon: LucideIcon;
  items: NavItem[];
}

export type NavConfig = (NavItem | NavGroup)[];

// ============================================
// ชั้นที่ 1: STORE LEVEL NAVIGATION
// ============================================
// จัดเรียงตามหลัก UX:
// 1. Primary Actions (ใช้บ่อย) ไว้ก่อน
// 2. Secondary Actions ไว้กลาง  
// 3. Settings/Config ไว้ท้าย
// 4. External (ตลาดกลาง) ไว้ท้ายสุด
// ============================================
export const SELLER_NAV: NavConfig = [
  // === PRIMARY: ใช้บ่อยที่สุด ===
  {
    label: "แดชบอร์ด",
    href: "/seller",
    icon: LayoutDashboard,
  },
  {
    label: "ออเดอร์",
    href: "/seller/orders",
    icon: ShoppingBag,
    badge: 4, // TODO: dynamic pending orders count
  },
  {
    label: "บริการ",
    href: "/seller/services",
    icon: Package,
  },
  {
    label: "ทีม",
    href: "/seller/team",
    icon: Users,
  },
  {
    label: "ร้านค้า",
    href: "/seller/store",
    icon: Store,
  },
  {
    label: "Analytics",
    href: "/seller/analytics",
    icon: BarChart3,
  },
  
  // === SECONDARY: การเงิน (direct link) ===
  {
    label: "การเงิน",
    href: "/seller/finance",
    icon: Wallet,
  },
  
  // === EXTERNAL: ตลาดกลาง (ปุ่มพิเศษ) ===
  {
    label: "ตลาด",
    href: "/hub",
    icon: Sparkles,
    isSpecial: true, // Flag สำหรับ styling พิเศษ
  },
];

// ============================================
// USER MENU ITEMS (สำหรับ User Dropdown)
// ============================================
export const USER_MENU_ITEMS: NavItem[] = [
  { label: "Subscription", href: "/seller/settings/subscription", icon: Crown },
  { label: "API Keys", href: "/seller/settings/api", icon: Key },
  { label: "ตั้งค่าบัญชี", href: "/seller/settings", icon: UserCircle },
];

// ============================================
// ชั้นที่ 2: TEAM LEVEL NAVIGATION
// ============================================
export const getTeamNav = (teamId: string): NavConfig => [
  {
    label: "Dashboard",
    href: `/seller/team/${teamId}`,
    icon: LayoutDashboard,
  },
  {
    label: "สมาชิก",
    href: `/seller/team/${teamId}/members`,
    icon: Users,
  },
  {
    label: "งาน",
    href: `/seller/team/${teamId}/jobs`,
    icon: ClipboardList,
  },
  {
    label: "ตรวจสอบงาน",
    href: `/seller/team/${teamId}/review`,
    icon: CheckCircle,
    badge: 5, // TODO: dynamic from API
  },
  {
    label: "จ่ายเงิน",
    href: `/seller/team/${teamId}/payouts`,
    icon: DollarSign,
  },
  {
    label: "ตั้งค่าทีม",
    href: `/seller/team/${teamId}/settings`,
    icon: Settings,
  },
];

// ============================================
// WORKER NAVIGATION
// ============================================
// จัดเรียงตามหลัก UX สำหรับ Worker:
// 1. หน้าแรก (Dashboard)
// 2. งาน (Primary action - หาเงิน!)
// 3. ทีม (งานมาจากทีม)
// 4. ตลาดกลาง (หาทีมใหม่)
// 5. รายได้ (ดูเงิน)
// 6. โปรไฟล์ (ตั้งค่า)
// ============================================
export const WORKER_NAV: NavConfig = [
  // === PRIMARY: ใช้บ่อยที่สุด ===
  {
    label: "หน้าแรก",
    href: "/work",
    icon: Home,
  },
  {
    label: "งานของฉัน",
    href: "/work/jobs",
    icon: ClipboardList,
    badge: 5, // TODO: dynamic active jobs count
  },
  {
    label: "ทีมของฉัน",
    href: "/work/teams",
    icon: Users,
  },
  
  // === SECONDARY ===
  {
    label: "ตลาดกลาง",
    href: "/hub",
    icon: Sparkles,
  },
  {
    label: "บัญชี Social",
    href: "/work/accounts",
    icon: Smartphone,
  },
  
  // === TERTIARY: Dropdowns ===
  {
    label: "รายได้",
    icon: Wallet,
    items: [
      { label: "ภาพรวม", href: "/work/earnings", icon: Wallet },
      { label: "ถอนเงิน", href: "/work/earnings/withdraw", icon: CreditCard },
      { label: "ประวัติ", href: "/work/earnings/history", icon: History },
    ],
  },
  {
    label: "อื่นๆ",
    icon: Settings,
    items: [
      { label: "Leaderboard", href: "/work/leaderboard", icon: Trophy },
      { label: "ชวนเพื่อน", href: "/work/referral", icon: UserPlus },
      { label: "โปรไฟล์", href: "/work/profile", icon: User },
    ],
  },
];

export const WORKER_BOTTOM_NAV: NavItem[] = [
  { label: "หน้าแรก", href: "/work", icon: Home },
  { label: "งาน", href: "/work/jobs", icon: ClipboardList },
  { label: "ทีม", href: "/work/teams", icon: Users },
  { label: "รายได้", href: "/work/earnings", icon: Wallet },
  { label: "โปรไฟล์", href: "/work/profile", icon: User },
];

export function isNavGroup(item: NavItem | NavGroup): item is NavGroup {
  return "items" in item;
}
