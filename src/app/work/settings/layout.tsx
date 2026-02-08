"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { Card, Badge } from "@/components/ui";
import { cn } from "@/lib/utils";
import {
  User,
  Shield,
  Settings,
  ChevronRight,
  Wallet,
  Bell,
  Smartphone,
} from "lucide-react";
import { useAuthStore } from "@/lib/store";
import { DEFAULT_KYC_DATA } from "@/types";

interface NavItem {
  id: string;
  label: string;
  description: string;
  href: string;
  icon: React.ElementType;
  badge?: "kyc";
}

interface NavGroup {
  title: string;
  items: NavItem[];
}

const SETTINGS_GROUPS: NavGroup[] = [
  {
    title: "บัญชี",
    items: [
      {
        id: "profile",
        label: "ข้อมูลส่วนตัว",
        description: "ชื่อ, อีเมล, เบอร์โทร",
        href: "/work/settings",
        icon: User,
      },
      {
        id: "verification",
        label: "ยืนยันตัวตน",
        description: "KYC Basic / Verified / Business",
        href: "/work/settings/verification",
        icon: Shield,
        badge: "kyc",
      },
    ],
  },
  {
    title: "การเงิน",
    items: [
      {
        id: "bank",
        label: "บัญชีรับเงิน",
        description: "ธนาคาร, PromptPay",
        href: "/work/settings/bank",
        icon: Wallet,
      },
    ],
  },
  {
    title: "ระบบ",
    items: [
      {
        id: "accounts",
        label: "บัญชี Social Media",
        description: "Facebook, Instagram, TikTok",
        href: "/work/settings/accounts",
        icon: Smartphone,
      },
      {
        id: "notifications",
        label: "การแจ้งเตือน",
        description: "งาน, ทีม, การเงิน",
        href: "/work/settings/notifications",
        icon: Bell,
      },
    ],
  },
];

const ALL_NAV_ITEMS = SETTINGS_GROUPS.flatMap((g) => g.items);

export default function WorkerSettingsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const { user } = useAuthStore();
  const kycLevel = user?.worker?.kyc?.level || DEFAULT_KYC_DATA.level;

  const getActiveSection = () => {
    if (pathname === "/work/settings") return "profile";
    if (pathname.includes("/verification")) return "verification";
    if (pathname.includes("/bank")) return "bank";
    if (pathname.includes("/accounts")) return "accounts";
    if (pathname.includes("/notifications")) return "notifications";
    return "profile";
  };

  const activeSection = getActiveSection();
  const isActiveItem = (item: NavItem) => item.id === activeSection;

  return (
    <div className="animate-fade-in max-w-7xl mx-auto px-4 py-6">
      {/* Page Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-brand-text-dark flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-brand-primary/10 flex items-center justify-center">
            <Settings className="w-5 h-5 text-brand-primary" />
          </div>
          ตั้งค่า
        </h1>
        <p className="text-brand-text-light text-sm mt-1 ml-[52px]">
          จัดการบัญชี ข้อมูลส่วนตัว และการเงิน
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Sidebar */}
        <aside className="lg:w-72 shrink-0">
          <Card className="p-2 border-none shadow-md">
            <nav className="space-y-4">
              {SETTINGS_GROUPS.map((group, gi) => (
                <div key={group.title}>
                  {gi > 0 && (
                    <div className="mx-3 mb-2 border-t border-brand-border/30" />
                  )}
                  <p className="px-3 pt-1 pb-1.5 text-[10px] font-semibold text-brand-text-light uppercase tracking-wider">
                    {group.title}
                  </p>

                  <div className="space-y-0.5">
                    {group.items.map((item) => {
                      const isActive = isActiveItem(item);
                      const Icon = item.icon;

                      return (
                        <Link key={item.id} href={item.href}>
                          <div
                            className={cn(
                              "flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all group",
                              isActive
                                ? "bg-brand-primary text-white shadow-md"
                                : "hover:bg-brand-bg text-brand-text-dark"
                            )}
                          >
                            <div
                              className={cn(
                                "w-8 h-8 rounded-lg flex items-center justify-center transition-colors shrink-0",
                                isActive
                                  ? "bg-white/20"
                                  : "bg-brand-bg group-hover:bg-brand-primary/10"
                              )}
                            >
                              <Icon
                                className={cn(
                                  "w-4 h-4",
                                  isActive ? "text-white" : "text-brand-primary"
                                )}
                              />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2">
                                <p
                                  className={cn(
                                    "font-medium text-sm",
                                    isActive ? "text-white" : "text-brand-text-dark"
                                  )}
                                >
                                  {item.label}
                                </p>
                                {item.badge === "kyc" && !isActive && (
                                  <Badge
                                    variant={
                                      kycLevel === "none"
                                        ? "warning"
                                        : kycLevel === "business"
                                          ? "success"
                                          : "info"
                                    }
                                    size="sm"
                                  >
                                    {kycLevel === "none"
                                      ? "!"
                                      : kycLevel.charAt(0).toUpperCase() +
                                        kycLevel.slice(1)}
                                  </Badge>
                                )}
                              </div>
                              <p
                                className={cn(
                                  "text-[11px] truncate",
                                  isActive ? "text-white/70" : "text-brand-text-light"
                                )}
                              >
                                {item.description}
                              </p>
                            </div>
                            <ChevronRight
                              className={cn(
                                "w-3.5 h-3.5 shrink-0",
                                isActive ? "text-white/70" : "text-brand-text-light/50"
                              )}
                            />
                          </div>
                        </Link>
                      );
                    })}
                  </div>
                </div>
              ))}
            </nav>
          </Card>
        </aside>

        {/* Main Content */}
        <main className="flex-1 min-w-0">{children}</main>
      </div>
    </div>
  );
}
