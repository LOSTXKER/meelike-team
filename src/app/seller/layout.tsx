"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore, useAppStore } from "@/lib/store";
import { SellerSidebar } from "@/components/seller/sidebar";
import { cn } from "@/lib/utils";
import { Menu, Bell, Search } from "lucide-react";

export default function SellerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const { user, hasHydrated } = useAuthStore();
  const { sidebarOpen, toggleSidebar } = useAppStore();

  useEffect(() => {
    if (hasHydrated && !user) {
      router.push("/login?role=seller");
    } else if (hasHydrated && user?.role !== "seller") {
      router.push("/work");
    }
  }, [user, hasHydrated, router]);

  if (!hasHydrated || !user || user.role !== "seller") {
    return (
      <div className="min-h-screen bg-brand-bg flex items-center justify-center">
        <div className="animate-pulse text-brand-text-light">กำลังโหลด...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-brand-bg">
      <SellerSidebar />

      {/* Main Content */}
      <div
        className={cn(
          "transition-all duration-300",
          sidebarOpen ? "lg:ml-64" : "lg:ml-16"
        )}
      >
        {/* Top Header */}
        <header className="sticky top-0 z-30 h-16 bg-brand-surface/80 backdrop-blur-sm border-b border-brand-border">
          <div className="flex items-center justify-between h-full px-4 lg:px-6">
            {/* Mobile Menu Button */}
            <button
              onClick={toggleSidebar}
              className="lg:hidden p-2 rounded-lg hover:bg-brand-bg text-brand-text-light transition-colors"
            >
              <Menu className="w-5 h-5" />
            </button>

            {/* Search */}
            <div className="hidden sm:flex items-center flex-1 max-w-md mx-4">
              <div className="relative w-full">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-brand-text-light" />
                <input
                  type="text"
                  placeholder="ค้นหา..."
                  className="w-full pl-10 pr-4 py-2 bg-brand-bg border border-brand-border rounded-lg text-sm text-brand-text-dark placeholder:text-brand-text-light/60 focus:outline-none focus:border-brand-primary"
                />
              </div>
            </div>

            {/* Right Actions */}
            <div className="flex items-center gap-3">
              <button className="relative p-2 rounded-lg hover:bg-brand-bg text-brand-text-light transition-colors">
                <Bell className="w-5 h-5" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-brand-error rounded-full" />
              </button>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="p-4 lg:p-6">{children}</main>
      </div>
    </div>
  );
}

