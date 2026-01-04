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
  MessageCircle,
} from "lucide-react";

// LINE Icon component
const LineIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M19.365 9.863c.349 0 .63.285.63.631 0 .345-.281.63-.63.63H17.61v1.125h1.755c.349 0 .63.283.63.63 0 .344-.281.629-.63.629h-2.386c-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.627-.63h2.386c.349 0 .63.285.63.63 0 .349-.281.63-.63.63H17.61v1.125h1.755zm-3.855 3.016c0 .27-.174.51-.432.596-.064.021-.133.031-.199.031-.211 0-.391-.09-.51-.25l-2.443-3.317v2.94c0 .344-.279.629-.631.629-.346 0-.626-.285-.626-.629V8.108c0-.27.173-.51.43-.595.06-.023.136-.033.194-.033.195 0 .375.104.495.254l2.462 3.33V8.108c0-.345.282-.63.63-.63.345 0 .63.285.63.63v4.771zm-5.741 0c0 .344-.282.629-.631.629-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.627-.63.349 0 .631.285.631.63v4.771zm-2.466.629H4.917c-.345 0-.63-.285-.63-.629V8.108c0-.345.285-.63.63-.63.348 0 .63.285.63.63v4.141h1.756c.348 0 .629.283.629.63 0 .344-.282.629-.629.629M24 10.314C24 4.943 18.615.572 12 .572S0 4.943 0 10.314c0 4.811 4.27 8.842 10.035 9.608.391.082.923.258 1.058.59.12.301.079.766.038 1.08l-.164 1.02c-.045.301-.24 1.186 1.049.645 1.291-.539 6.916-4.078 9.436-6.975C23.176 14.393 24 12.458 24 10.314" />
  </svg>
);

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
      id: "line",
      label: "LINE Integration",
      description: "LINE Notify, Messaging API",
      href: `/seller/team/${teamId}/settings/line`,
      icon: LineIcon,
      isLine: true,
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
    if (pathname.includes("/line")) return "line";
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
                const isLine = item.id === "line";

                return (
                  <Link key={item.id} href={item.href}>
                    <div
                      className={cn(
                        "flex items-center gap-3 p-3 rounded-xl transition-all group",
                        isActive && !isDanger && !isLine && "bg-brand-primary text-white shadow-md",
                        isActive && isDanger && "bg-brand-error text-white shadow-md",
                        isActive && isLine && "bg-[#00B900] text-white shadow-md",
                        !isActive && !isDanger && !isLine && "hover:bg-brand-bg text-brand-text-dark",
                        !isActive && isDanger && "hover:bg-brand-error/5 text-brand-text-dark",
                        !isActive && isLine && "hover:bg-[#00B900]/5 text-brand-text-dark"
                      )}
                    >
                      <div
                        className={cn(
                          "w-10 h-10 rounded-lg flex items-center justify-center transition-colors",
                          isActive && !isDanger && !isLine && "bg-white/20",
                          isActive && isDanger && "bg-white/20",
                          isActive && isLine && "bg-white/20",
                          !isActive && !isDanger && !isLine && "bg-brand-bg group-hover:bg-brand-primary/10",
                          !isActive && isDanger && "bg-brand-error/10 group-hover:bg-brand-error/20",
                          !isActive && isLine && "bg-[#00B900]/10 group-hover:bg-[#00B900]/20"
                        )}
                      >
                        <Icon
                          className={cn(
                            "w-5 h-5",
                            isActive && "text-white",
                            !isActive && !isDanger && !isLine && "text-brand-primary",
                            !isActive && isDanger && "text-brand-error",
                            !isActive && isLine && "text-[#00B900]"
                          )}
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className={cn(
                          "font-medium text-sm",
                          isActive ? "text-white" : isDanger ? "text-brand-error" : isLine ? "text-[#00B900]" : "text-brand-text-dark"
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
