"use client";

import { useRouter } from "next/navigation";
import { useRequireAuth } from "@/lib/hooks";
import { useAppStore } from "@/lib/store";
import { DashboardLayout } from "@/components/layout";
import { SELLER_NAV } from "@/lib/constants/navigation";
import { formatCurrency } from "@/lib/utils";
import { Avatar, Badge } from "@/components/ui";
import { Award } from "lucide-react";

export default function SellerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const { user, isReady, seller } = useRequireAuth({
    requiredRole: "seller",
    redirectIfWrongRole: "/work",
  });
  const { sidebarOpen } = useAppStore();

  const handleLogout = () => {
    router.push("/login");
  };

  const userSection = seller && (
    <>
      <div className="flex items-center gap-3">
        <Avatar src={seller.avatar} fallback={seller.displayName} size="md" />
        {sidebarOpen && (
          <div className="flex-1 min-w-0">
            <p className="font-medium text-brand-text-dark truncate">
              {seller.displayName}
            </p>
            <div className="flex items-center gap-2 text-sm">
              <Badge variant="info" size="sm" className="flex items-center gap-1">
                <Award className="w-3 h-3" />
                {seller.plan.charAt(0).toUpperCase() + seller.plan.slice(1)}
              </Badge>
              <span className="text-brand-text-light">
                {formatCurrency(seller.balance)}
              </span>
            </div>
          </div>
        )}
      </div>
    </>
  );

  return (
    <DashboardLayout
      nav={SELLER_NAV}
      logo={{
        href: "/seller",
        title: "MeeLike Seller",
        color: "bg-brand-primary",
      }}
      userSection={userSection}
      onLogout={handleLogout}
      isLoading={!isReady}
      showSearch
    >
      {children}
    </DashboardLayout>
  );
}
