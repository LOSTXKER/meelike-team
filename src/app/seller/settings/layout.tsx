"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { Card } from "@/components/ui";
import { cn } from "@/lib/utils";
import {
  User,
  CreditCard,
  Key,
  Settings,
  ChevronRight,
} from "lucide-react";

// Settings navigation items
const SETTINGS_NAV = [
  {
    id: "profile",
    label: "ข้อมูลบัญชี",
    description: "ชื่อ, อีเมล, เบอร์โทร",
    href: "/seller/settings",
    icon: User,
  },
  {
    id: "subscription",
    label: "จัดการแพ็คเกจ",
    description: "แผน, Seller Rank",
    href: "/seller/settings/subscription",
    icon: CreditCard,
  },
  {
    id: "api",
    label: "API & ความปลอดภัย",
    description: "API Keys, การเชื่อมต่อ",
    href: "/seller/settings/api",
    icon: Key,
  },
];

export default function SettingsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  // Determine active section
  const getActiveSection = () => {
    if (pathname === "/seller/settings") return "profile";
    if (pathname.includes("/subscription")) return "subscription";
    if (pathname.includes("/api")) return "api";
    return "profile";
  };

  const activeSection = getActiveSection();

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
          {/* Navigation Menu */}
          <Card className="p-2 border-none shadow-md">
            <nav className="space-y-1">
              {SETTINGS_NAV.map((item) => {
                const isActive = activeSection === item.id;
                const Icon = item.icon;

                return (
                  <Link key={item.id} href={item.href}>
                    <div
                      className={cn(
                        "flex items-center gap-3 p-3 rounded-xl transition-all group",
                        isActive
                          ? "bg-brand-primary text-white shadow-md"
                          : "hover:bg-brand-bg text-brand-text-dark"
                      )}
                    >
                      <div
                        className={cn(
                          "w-10 h-10 rounded-lg flex items-center justify-center transition-colors",
                          isActive
                            ? "bg-white/20"
                            : "bg-brand-bg group-hover:bg-brand-primary/10"
                        )}
                      >
                        <Icon
                          className={cn(
                            "w-5 h-5",
                            isActive ? "text-white" : "text-brand-primary"
                          )}
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className={cn(
                          "font-medium text-sm",
                          isActive ? "text-white" : "text-brand-text-dark"
                        )}>
                          {item.label}
                        </p>
                        <p className={cn(
                          "text-xs truncate",
                          isActive ? "text-white/70" : "text-brand-text-light"
                        )}>
                          {item.description}
                        </p>
                      </div>
                      <ChevronRight
                        className={cn(
                          "w-4 h-4 shrink-0",
                          isActive ? "text-white/70" : "text-brand-text-light"
                        )}
                      />
                    </div>
                  </Link>
                );
              })}
            </nav>
          </Card>

        </aside>

        {/* Main Content */}
        <main className="flex-1 min-w-0">
          {children}
        </main>
      </div>
    </div>
  );
}
