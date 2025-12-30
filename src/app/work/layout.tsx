"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore, useAppStore } from "@/lib/store";
import { WorkerSidebar } from "@/components/worker/sidebar";
import { WorkerBottomNav } from "@/components/worker/bottom-nav";
import { cn } from "@/lib/utils";
import { Bell, Sparkles } from "lucide-react";

export default function WorkerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const { user, hasHydrated } = useAuthStore();
  const { sidebarOpen } = useAppStore();

  useEffect(() => {
    if (hasHydrated && !user) {
      router.push("/login?role=worker");
    } else if (hasHydrated && user?.role !== "worker") {
      router.push("/seller");
    }
  }, [user, hasHydrated, router]);

  if (!hasHydrated || !user || user.role !== "worker") {
    return (
      <div className="min-h-screen bg-brand-bg flex items-center justify-center">
        <div className="animate-pulse text-brand-text-light">กำลังโหลด...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-brand-bg">
      <WorkerSidebar />

      {/* Main Content */}
      <div
        className={cn(
          "transition-all duration-300 pb-20 lg:pb-0",
          sidebarOpen ? "lg:ml-64" : "lg:ml-16"
        )}
      >
        {/* Top Header */}
        <header className="sticky top-0 z-30 h-16 bg-brand-surface/80 backdrop-blur-sm border-b border-brand-border">
          <div className="flex items-center justify-between h-full px-4 lg:px-6">
            {/* Mobile Logo */}
            <div className="flex items-center gap-3 lg:hidden">
              <Sparkles className="w-6 h-6 text-brand-primary" />
              <span className="text-lg font-bold text-brand-text-dark">
                MeeLike
              </span>
            </div>

            {/* Desktop spacer */}
            <div className="hidden lg:block" />

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

      <WorkerBottomNav />
    </div>
  );
}

