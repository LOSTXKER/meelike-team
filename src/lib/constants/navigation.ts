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
  type LucideIcon,
} from "lucide-react";

export interface NavItem {
  label: string;
  href: string;
  icon: LucideIcon;
  badge?: number;
}

export interface NavGroup {
  label: string;
  items: NavItem[];
}

export type NavConfig = (NavItem | NavGroup)[];

// ============================================
// ชั้นที่ 1: STORE LEVEL NAVIGATION
// ============================================
export const SELLER_NAV: NavConfig = [
  {
    label: "แดชบอร์ด",
    href: "/seller",
    icon: LayoutDashboard,
  },
  {
    label: "Hub ตลาดกลาง",
    href: "/hub",
    icon: Sparkles,
  },
  {
    label: "ร้านค้า",
    items: [
      { label: "ตั้งค่าร้าน", href: "/seller/store", icon: Store },
      { label: "จัดการบริการ", href: "/seller/services", icon: Package },
      { label: "ออเดอร์", href: "/seller/orders", icon: ShoppingBag },
    ],
  },
  {
    label: "การเงิน",
    items: [
      { label: "ยอดเงิน", href: "/seller/finance", icon: Wallet },
      { label: "เติมเงิน", href: "/seller/finance/topup", icon: CreditCard },
      { label: "ประวัติ", href: "/seller/finance/history", icon: History },
    ],
  },
  {
    label: "ตั้งค่า",
    items: [
      { label: "โปรไฟล์", href: "/seller/settings", icon: UserCircle },
      { label: "Subscription", href: "/seller/settings/subscription", icon: Crown },
      { label: "API Keys", href: "/seller/settings/api", icon: Key },
    ],
  },
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
export const WORKER_NAV: NavConfig = [
  {
    label: "หน้าแรก",
    href: "/work",
    icon: Home,
  },
  {
    label: "Hub ตลาดกลาง",
    href: "/hub",
    icon: Sparkles,
  },
  {
    label: "ทีมของฉัน",
    href: "/work/teams",
    icon: Users,
  },
  {
    label: "งานของฉัน",
    href: "/work/jobs",
    icon: ClipboardList,
    badge: 5,
  },
  {
    label: "รายได้",
    items: [
      { label: "ยอดสะสม", href: "/work/earnings", icon: Wallet },
      { label: "ถอนเงิน", href: "/work/earnings/withdraw", icon: CreditCard },
      { label: "ประวัติ", href: "/work/earnings/history", icon: History },
    ],
  },
  {
    label: "กิจกรรม",
    items: [
      { label: "Top Workers", href: "/work/leaderboard", icon: Trophy },
      { label: "ชวนเพื่อน", href: "/work/referral", icon: UserPlus },
    ],
  },
  {
    label: "บัญชี Social",
    href: "/work/accounts",
    icon: Smartphone,
  },
  {
    label: "โปรไฟล์",
    href: "/work/profile",
    icon: User,
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
