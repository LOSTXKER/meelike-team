"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { useAuthStore, useAppStore } from "@/lib/store";
import { formatCurrency } from "@/lib/utils";
import { Avatar, Badge } from "@/components/ui";
import {
  LayoutDashboard,
  Store,
  Package,
  ShoppingBag,
  Users,
  UserPlus,
  ClipboardList,
  CheckCircle,
  DollarSign,
  Wallet,
  CreditCard,
  History,
  Settings,
  UserCircle,
  Key,
  Crown,
  ChevronLeft,
  LogOut,
  Menu,
  Sparkles,
  Award,
} from "lucide-react";

const menuItems = [
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
    label: "ทีมงาน",
    items: [
      { label: "สมาชิก", href: "/seller/team", icon: Users },
      { label: "งานทั้งหมด", href: "/seller/team/jobs", icon: ClipboardList },
      {
        label: "รอตรวจสอบ",
        href: "/seller/team/review",
        icon: CheckCircle,
        badge: 5,
      },
      { label: "จ่ายเงิน", href: "/seller/team/payouts", icon: DollarSign },
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

export function SellerSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useAuthStore();
  const { sidebarOpen, toggleSidebar } = useAppStore();
  const seller = user?.seller;

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  return (
    <>
      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={toggleSidebar}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed left-0 top-0 h-full bg-brand-surface border-r border-brand-border z-50",
          "transition-all duration-300 ease-in-out",
          sidebarOpen ? "w-64" : "w-0 lg:w-16",
          "lg:translate-x-0",
          sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        )}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="h-16 flex items-center justify-between px-4 border-b border-brand-border">
            {sidebarOpen && (
              <Link href="/seller" className="flex items-center gap-2">
                <div className="w-8 h-8 bg-brand-primary rounded-lg flex items-center justify-center">
                  <Sparkles className="w-5 h-5 text-white" />
                </div>
                <span className="text-lg font-bold text-brand-text-dark">
                  MeeLike Seller
                </span>
              </Link>
            )}
            <button
              onClick={toggleSidebar}
              className="p-2 rounded-lg hover:bg-brand-bg text-brand-text-light transition-colors"
            >
              {sidebarOpen ? (
                <ChevronLeft className="w-5 h-5" />
              ) : (
                <Menu className="w-5 h-5" />
              )}
            </button>
          </div>

          {/* Menu */}
          <nav className="flex-1 overflow-y-auto p-4">
            <ul className="space-y-1">
              {menuItems.map((item, index) => (
                <li key={index}>
                  {item.href ? (
                    <Link
                      href={item.href}
                      className={cn(
                        "flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors",
                        pathname === item.href
                          ? "bg-brand-primary/10 text-brand-primary"
                          : "text-brand-text-light hover:text-brand-text-dark hover:bg-brand-bg"
                      )}
                    >
                      <item.icon className="w-5 h-5 flex-shrink-0" />
                      {sidebarOpen && (
                        <span className="font-medium">{item.label}</span>
                      )}
                    </Link>
                  ) : (
                    <>
                      {sidebarOpen && (
                        <div className="px-3 py-2 text-xs font-semibold text-brand-text-light uppercase tracking-wider mt-4">
                          {item.label}
                        </div>
                      )}
                      <ul className="space-y-1">
                        {item.items?.map((subItem, subIndex) => (
                          <li key={subIndex}>
                            <Link
                              href={subItem.href}
                              className={cn(
                                "flex items-center justify-between gap-3 px-3 py-2.5 rounded-lg transition-colors",
                                pathname === subItem.href
                                  ? "bg-brand-primary/10 text-brand-primary"
                                  : "text-brand-text-light hover:text-brand-text-dark hover:bg-brand-bg"
                              )}
                            >
                              <div className="flex items-center gap-3">
                                <subItem.icon className="w-5 h-5 flex-shrink-0" />
                                {sidebarOpen && (
                                  <span className="font-medium">
                                    {subItem.label}
                                  </span>
                                )}
                              </div>
                              {sidebarOpen && subItem.badge && (
                                <Badge variant="error" size="sm">
                                  {subItem.badge}
                                </Badge>
                              )}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </>
                  )}
                </li>
              ))}
            </ul>
          </nav>

          {/* User Info */}
          {seller && (
            <div className="p-4 border-t border-brand-border">
              <div className="flex items-center gap-3">
                <Avatar
                  src={seller.avatar}
                  fallback={seller.displayName}
                  size="md"
                />
                {sidebarOpen && (
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-brand-text-dark truncate">
                      {seller.displayName}
                    </p>
                    <div className="flex items-center gap-2 text-sm">
                      <Badge variant="info" size="sm" className="flex items-center gap-1">
                        <Award className="w-3 h-3" />
                        {seller.plan.charAt(0).toUpperCase() + seller.plan.slice(1)}
                      </Badge>
                      <span className="text-brand-text-light">
                        {formatCurrency(seller.balance)}
                      </span>
                    </div>
                  </div>
                )}
              </div>
              {sidebarOpen && (
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 w-full mt-4 px-3 py-2 text-sm text-brand-text-light hover:text-brand-error hover:bg-brand-error/10 rounded-lg transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  ออกจากระบบ
                </button>
              )}
            </div>
          )}
        </div>
      </aside>
    </>
  );
}

