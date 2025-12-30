"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { useAuthStore, useAppStore } from "@/lib/store";
import { formatCurrency, getLevelInfo } from "@/lib/utils";
import { Avatar, Badge } from "@/components/ui";
import {
  Home,
  Users,
  UserPlus,
  Search,
  ClipboardList,
  Clock,
  CheckCircle,
  Wallet,
  CreditCard,
  History,
  Smartphone,
  User,
  ChevronLeft,
  LogOut,
  Menu,
  Star,
  Sparkles,
} from "lucide-react";

const menuItems = [
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
    items: [
      { label: "ทีมที่เข้าร่วม", href: "/work/teams", icon: Users },
      { label: "ค้นหาทีม", href: "/work/teams/search", icon: Search },
    ],
  },
  {
    label: "งานของฉัน",
    items: [
      { label: "กำลังทำ", href: "/work/jobs", icon: Clock, badge: 2 },
      { label: "รอตรวจสอบ", href: "/work/jobs?tab=pending", icon: CheckCircle, badge: 3 },
      { label: "เสร็จแล้ว", href: "/work/jobs?tab=completed", icon: ClipboardList },
    ],
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
    label: "บัญชี Social",
    items: [
      { label: "จัดการบัญชี", href: "/work/accounts", icon: Smartphone },
    ],
  },
  {
    label: "โปรไฟล์",
    href: "/work/profile",
    icon: User,
  },
];

export function WorkerSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useAuthStore();
  const { sidebarOpen, toggleSidebar } = useAppStore();
  const worker = user?.worker;
  const levelInfo = getLevelInfo(worker?.level || "bronze");

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
          "transition-all duration-300 ease-in-out hidden lg:block",
          sidebarOpen ? "w-64" : "w-16"
        )}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="h-16 flex items-center justify-between px-4 border-b border-brand-border">
            {sidebarOpen && (
              <Link href="/work" className="flex items-center gap-2">
                <div className="w-8 h-8 bg-brand-info rounded-lg flex items-center justify-center">
                  <Sparkles className="w-5 h-5 text-white" />
                </div>
                <span className="text-lg font-bold text-brand-text-dark">
                  MeeLike Worker
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
          {worker && (
            <div className="p-4 border-t border-brand-border">
              <div className="flex items-center gap-3">
                <Avatar
                  src={worker.avatar}
                  fallback={worker.displayName}
                  size="md"
                />
                {sidebarOpen && (
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-brand-text-dark truncate">
                      {worker.displayName}
                    </p>
                    <div className="flex items-center gap-2 text-sm">
                      <span className={levelInfo.color}>
                        {levelInfo.name}
                      </span>
                      <span className="text-brand-text-light">•</span>
                      <span className="flex items-center gap-1 text-brand-text-light">
                        <Star className="w-3 h-3 text-brand-warning" />
                        {worker.rating}
                      </span>
                    </div>
                    <p className="text-sm font-medium text-brand-success mt-1">
                      {formatCurrency(worker.availableBalance)}
                    </p>
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

