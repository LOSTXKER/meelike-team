"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { Card } from "@/components/ui";
import { cn } from "@/lib/utils";
import {
  User,
  CreditCard,
  Key,
  Shield,
  Settings,
  ChevronRight,
  Wallet,
  Bell,
  Lock,
  Trash2,
  Home,
} from "lucide-react";
import { useAuthStore } from "@/lib/store";
import { Badge } from "@/components/ui";
import { DEFAULT_KYC_DATA } from "@/types";

// Grouped settings navigation
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
        label: "ข้อมูลบัญชี",
        description: "ชื่อ, อีเมล, เบอร์โทร",
        href: "/seller/settings",
        icon: User,
      },
      {
        id: "verification",
        label: "ยืนยันตัวตน",
        description: "KYC Basic / Verified / Business",
        href: "/seller/settings/verification",
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
        description: "ธนาคาร, เลขบัญชี",
        href: "/seller/settings/bank",
        icon: Wallet,
      },
      {
        id: "subscription",
        label: "จัดการแพ็คเกจ",
        description: "แผน, Seller Rank",
        href: "/seller/settings/subscription",
        icon: CreditCard,
      },
    ],
  },
  {
    title: "ระบบ",
    items: [
      {
        id: "notifications",
        label: "การแจ้งเตือน",
        description: "ออเดอร์, ทีม, การเงิน",
        href: "/seller/settings/notifications",
        icon: Bell,
      },
      {
        id: "security",
        label: "ความปลอดภัย",
        description: "รหัสผ่าน, API Keys",
        href: "/seller/settings/api",
        icon: Lock,
      },
      {
        id: "danger",
        label: "โซนอันตราย",
        description: "รีเซ็ตข้อมูล",
        href: "/seller/settings/danger",
        icon: Trash2,
      },
    ],
  },
];

// Flatten for easy lookup
const ALL_NAV_ITEMS = SETTINGS_GROUPS.flatMap((g) => g.items);

export default function SettingsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  const { user } = useAuthStore();
  const kycLevel = user?.seller?.kyc?.level || DEFAULT_KYC_DATA.level;

  // Determine active section
  const getActiveSection = () => {
    if (pathname === "/seller/settings") return "profile";
    if (pathname.includes("/verification")) return "verification";
    if (pathname.includes("/bank")) return "bank";
    if (pathname.includes("/subscription")) return "subscription";
    if (pathname.includes("/notifications")) return "notifications";
    if (pathname.includes("/api")) return "security";
    if (pathname.includes("/danger")) return "danger";
    return "profile";
  };

  const activeSection = getActiveSection();

  const isActiveItem = (item: NavItem) => item.id === activeSection;

  // Find current page label for breadcrumb
  const activeItem = ALL_NAV_ITEMS.find((i) => i.id === activeSection);
  const activeLabel = activeItem?.label || "ข้อมูลบัญชี";

  return (
    <div className="animate-fade-in">
      {/* Page Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-brand-text-dark flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-brand-primary/10 flex items-center justify-center">
            <Settings className="w-5 h-5 text-brand-primary" />
          </div>
          ตั้งค่า
        </h1>
        <p className="text-brand-text-light text-sm mt-1 ml-[52px]">
          จัดการบัญชี แพ็คเกจ และความปลอดภัย
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Sidebar */}
        <aside className="lg:w-72 shrink-0">
          <Card className="p-2 border-none shadow-md">
            <nav className="space-y-4">
              {SETTINGS_GROUPS.map((group, gi) => (
                <div key={group.title}>
                  {/* Group header */}
                  {gi > 0 && (
                    <div className="mx-3 mb-2 border-t border-brand-border/30" />
                  )}
                  <p className="px-3 pt-1 pb-1.5 text-[10px] font-semibold text-brand-text-light uppercase tracking-wider">
                    {group.title}
                  </p>

                  {/* Group items */}
                  <div className="space-y-0.5">
                    {group.items.map((item) => {
                      const isActive = isActiveItem(item);
                      const Icon = item.icon;
                      const isDanger = item.id === "danger";

                      return (
                        <Link key={item.id} href={item.href}>
                          <div
                            className={cn(
                              "flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all group",
                              isActive
                                ? "bg-brand-primary text-white shadow-md"
                                : isDanger
                                  ? "hover:bg-red-50 text-brand-text-dark"
                                  : "hover:bg-brand-bg text-brand-text-dark"
                            )}
                          >
                            <div
                              className={cn(
                                "w-8 h-8 rounded-lg flex items-center justify-center transition-colors shrink-0",
                                isActive
                                  ? "bg-white/20"
                                  : isDanger
                                    ? "bg-red-50 group-hover:bg-red-100"
                                    : "bg-brand-bg group-hover:bg-brand-primary/10"
                              )}
                            >
                              <Icon
                                className={cn(
                                  "w-4 h-4",
                                  isActive
                                    ? "text-white"
                                    : isDanger
                                      ? "text-red-500"
                                      : "text-brand-primary"
                                )}
                              />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2">
                                <p
                                  className={cn(
                                    "font-medium text-sm",
                                    isActive
                                      ? "text-white"
                                      : isDanger
                                        ? "text-red-600"
                                        : "text-brand-text-dark"
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
                                  isActive
                                    ? "text-white/70"
                                    : "text-brand-text-light"
                                )}
                              >
                                {item.description}
                              </p>
                            </div>
                            <ChevronRight
                              className={cn(
                                "w-3.5 h-3.5 shrink-0",
                                isActive
                                  ? "text-white/70"
                                  : "text-brand-text-light/50"
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
