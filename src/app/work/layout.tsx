"use client";

import { useRouter } from "next/navigation";
import { useRequireAuth } from "@/lib/hooks";
import { useAppStore } from "@/lib/store";
import { DashboardLayout } from "@/components/layout";
import { WorkerBottomNav } from "@/components/worker/bottom-nav";
import { ErrorBoundary } from "@/components/shared";
import { WORKER_NAV } from "@/lib/constants/navigation";
import { formatCurrency, getLevelInfo } from "@/lib/utils";
import { Avatar } from "@/components/ui";
import { Star } from "lucide-react";

export default function WorkerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const { isReady, worker } = useRequireAuth({
    requiredRole: "worker",
    redirectIfWrongRole: "/seller",
  });
  const { sidebarOpen } = useAppStore();
  const levelInfo = getLevelInfo(worker?.level || "bronze");

  const handleLogout = () => {
    router.push("/login");
  };

  const userSection = worker && (
    <>
      <div className="flex items-center gap-3">
        <Avatar src={worker.avatar} fallback={worker.displayName} size="md" />
        {sidebarOpen && (
          <div className="flex-1 min-w-0">
            <p className="font-medium text-brand-text-dark truncate">
              {worker.displayName}
            </p>
            <div className="flex items-center gap-2 text-sm">
              <span className={levelInfo.color}>{levelInfo.name}</span>
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
    </>
  );

  return (
    <ErrorBoundary>
      <DashboardLayout
        nav={WORKER_NAV}
        logo={{
          href: "/work",
          title: "MeeLike Worker",
          color: "bg-brand-info",
        }}
        userSection={userSection}
        onLogout={handleLogout}
        isLoading={!isReady}
        showMobileLogo
        bottomNav={<WorkerBottomNav />}
        sidebarHiddenOnMobile
      >
        {children}
      </DashboardLayout>
    </ErrorBoundary>
  );
}
