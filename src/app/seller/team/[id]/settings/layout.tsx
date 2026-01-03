"use client";

import { usePathname, useParams } from "next/navigation";
import Link from "next/link";
import { Card } from "@/components/ui";
import { Breadcrumb } from "@/components/shared";
import { cn } from "@/lib/utils";
import {
  Info,
  Shield,
  Bell,
  AlertTriangle,
  Settings,
  ChevronRight,
} from "lucide-react";

export default function TeamSettingsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const params = useParams();
  const teamId = params.id as string;

  // Settings navigation items
  const TEAM_SETTINGS_NAV = [
    {
      id: "general",
      label: "ข้อมูลทั่วไป",
      description: "ชื่อ, คำอธิบาย, รูปโปรไฟล์",
      href: `/seller/team/${teamId}/settings`,
      icon: Info,
    },
    {
      id: "privacy",
      label: "ความเป็นส่วนตัว",
      description: "การมองเห็น, สิทธิ์ผู้ช่วย",
      href: `/seller/team/${teamId}/settings/privacy`,
      icon: Shield,
    },
    {
      id: "notifications",
      label: "การแจ้งเตือน",
      description: "แจ้งเตือน, สรุปรายวัน",
      href: `/seller/team/${teamId}/settings/notifications`,
      icon: Bell,
    },
    {
      id: "danger",
      label: "โซนอันตราย",
      description: "ลบทีม, ดำเนินการถาวร",
      href: `/seller/team/${teamId}/settings/danger`,
      icon: AlertTriangle,
    },
  ];

  // Determine active section
  const getActiveSection = () => {
    if (pathname === `/seller/team/${teamId}/settings`) return "general";
    if (pathname.includes("/privacy")) return "privacy";
    if (pathname.includes("/notifications")) return "notifications";
    if (pathname.includes("/danger")) return "danger";
    return "general";
  };

  const activeSection = getActiveSection();

  return (
    <div className="animate-fade-in space-y-6">
      {/* Breadcrumb */}
      <Breadcrumb />

      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-brand-text-dark flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center">
            <Settings className="w-5 h-5 text-gray-600" />
          </div>
          ตั้งค่าทีม
        </h1>
        <p className="text-brand-text-light text-sm mt-1 ml-[52px]">
          จัดการการตั้งค่าของทีม
        </p>
      </div>

      {/* Sidebar + Content */}
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Sidebar */}
        <aside className="lg:w-72 shrink-0">
          <Card className="p-2 border-none shadow-md">
            <nav className="space-y-1">
              {TEAM_SETTINGS_NAV.map((item) => {
                const isActive = activeSection === item.id;
                const Icon = item.icon;
                const isDanger = item.id === "danger";

                return (
                  <Link key={item.id} href={item.href}>
                    <div
                      className={cn(
                        "flex items-center gap-3 p-3 rounded-xl transition-all group",
                        isActive && !isDanger && "bg-brand-primary text-white shadow-md",
                        isActive && isDanger && "bg-brand-error text-white shadow-md",
                        !isActive && !isDanger && "hover:bg-brand-bg text-brand-text-dark",
                        !isActive && isDanger && "hover:bg-brand-error/5 text-brand-text-dark"
                      )}
                    >
                      <div
                        className={cn(
                          "w-10 h-10 rounded-lg flex items-center justify-center transition-colors",
                          isActive && !isDanger && "bg-white/20",
                          isActive && isDanger && "bg-white/20",
                          !isActive && !isDanger && "bg-brand-bg group-hover:bg-brand-primary/10",
                          !isActive && isDanger && "bg-brand-error/10 group-hover:bg-brand-error/20"
                        )}
                      >
                        <Icon
                          className={cn(
                            "w-5 h-5",
                            isActive && "text-white",
                            !isActive && !isDanger && "text-brand-primary",
                            !isActive && isDanger && "text-brand-error"
                          )}
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className={cn(
                          "font-medium text-sm",
                          isActive ? "text-white" : isDanger ? "text-brand-error" : "text-brand-text-dark"
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
