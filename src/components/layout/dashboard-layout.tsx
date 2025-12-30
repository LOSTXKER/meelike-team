"use client";

import { cn } from "@/lib/utils";
import { useAppStore } from "@/lib/store";
import { LoadingScreen } from "@/components/shared";
import { Sidebar } from "./sidebar";
import { TopHeader } from "./top-header";
import type { NavConfig } from "@/lib/constants/navigation";

interface DashboardLayoutProps {
  children: React.ReactNode;
  nav: NavConfig;
  logo: {
    href: string;
    title: string;
    color?: string;
  };
  userSection?: React.ReactNode;
  onLogout?: () => void;
  isLoading?: boolean;
  loadingMessage?: string;
  showSearch?: boolean;
  showMobileLogo?: boolean;
  bottomNav?: React.ReactNode;
  sidebarHiddenOnMobile?: boolean;
  className?: string;
}

export function DashboardLayout({
  children,
  nav,
  logo,
  userSection,
  onLogout,
  isLoading = false,
  loadingMessage,
  showSearch = false,
  showMobileLogo = false,
  bottomNav,
  sidebarHiddenOnMobile = false,
  className,
}: DashboardLayoutProps) {
  const { sidebarOpen } = useAppStore();

  if (isLoading) {
    return <LoadingScreen message={loadingMessage} />;
  }

  return (
    <div className="min-h-screen bg-brand-bg">
      <Sidebar
        nav={nav}
        logo={logo}
        userSection={userSection}
        onLogout={onLogout}
        hiddenOnMobile={sidebarHiddenOnMobile}
      />

      {/* Main Content */}
      <div
        className={cn(
          "transition-all duration-300",
          sidebarOpen ? "lg:ml-64" : "lg:ml-16",
          bottomNav && "pb-20 lg:pb-0",
          className
        )}
      >
        <TopHeader
          showSearch={showSearch}
          showMobileMenu={!sidebarHiddenOnMobile}
          showMobileLogo={showMobileLogo}
          logoText={logo.title}
        />

        {/* Page Content */}
        <main className="p-4 lg:p-6">{children}</main>
      </div>

      {bottomNav}
    </div>
  );
}

