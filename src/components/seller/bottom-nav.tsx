"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  ShoppingBag,
  Package,
  Users,
  MoreHorizontal,
  Wallet,
  Store,
  BarChart3,
  Sparkles,
} from "lucide-react";
import { useState } from "react";

const SELLER_BOTTOM_NAV = [
  { label: "หน้าแรก", href: "/seller", icon: LayoutDashboard },
  { label: "ออเดอร์", href: "/seller/orders", icon: ShoppingBag, badge: 4 },
  { label: "บริการ", href: "/seller/services", icon: Package },
  { label: "ทีม", href: "/seller/team", icon: Users },
  { label: "เพิ่มเติม", href: "#more", icon: MoreHorizontal, isMore: true },
];

const MORE_MENU_ITEMS = [
  { label: "ร้านค้า", href: "/seller/store", icon: Store },
  { label: "Analytics", href: "/seller/analytics", icon: BarChart3 },
  { label: "การเงิน", href: "/seller/finance", icon: Wallet },
  { label: "ตลาดกลาง", href: "/hub", icon: Sparkles },
];

export function SellerBottomNav() {
  const pathname = usePathname();
  const [showMore, setShowMore] = useState(false);

  // Check if current path is in "more" menu
  const isInMoreMenu = MORE_MENU_ITEMS.some(
    (item) => pathname === item.href || pathname.startsWith(item.href + "/")
  );

  return (
    <>
      {/* More Menu Overlay */}
      {showMore && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setShowMore(false)}
        />
      )}

      {/* More Menu Panel */}
      {showMore && (
        <div className="fixed bottom-16 left-0 right-0 bg-white border-t border-brand-border rounded-t-2xl shadow-xl z-50 lg:hidden animate-slide-up">
          <div className="p-4 grid grid-cols-4 gap-2">
            {MORE_MENU_ITEMS.map((item) => {
              const isActive =
                pathname === item.href || pathname.startsWith(item.href + "/");
              const Icon = item.icon;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setShowMore(false)}
                  className={cn(
                    "flex flex-col items-center justify-center p-3 rounded-xl transition-all",
                    isActive
                      ? "bg-brand-primary/10 text-brand-primary"
                      : "text-brand-text-light hover:bg-brand-bg"
                  )}
                >
                  <Icon className="w-6 h-6" />
                  <span className="text-xs mt-1.5 font-medium">{item.label}</span>
                </Link>
              );
            })}
          </div>
        </div>
      )}

      {/* Bottom Navigation Bar */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-brand-border lg:hidden z-50 safe-area-bottom">
        <div className="flex items-center justify-around h-16">
          {SELLER_BOTTOM_NAV.map((item) => {
            const isActive =
              item.isMore
                ? isInMoreMenu || showMore
                : pathname === item.href ||
                  (item.href !== "/seller" && pathname.startsWith(item.href + "/"));
            const Icon = item.icon;

            if (item.isMore) {
              return (
                <button
                  key={item.label}
                  onClick={() => setShowMore(!showMore)}
                  className={cn(
                    "flex flex-col items-center justify-center flex-1 h-full transition-colors relative",
                    isActive
                      ? "text-brand-primary"
                      : "text-brand-text-light hover:text-brand-text-dark"
                  )}
                >
                  <Icon className="w-5 h-5" />
                  <span className="text-xs mt-1 font-medium">{item.label}</span>
                </button>
              );
            }

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex flex-col items-center justify-center flex-1 h-full transition-colors relative",
                  isActive
                    ? "text-brand-primary"
                    : "text-brand-text-light hover:text-brand-text-dark"
                )}
              >
                <div className="relative">
                  <Icon className="w-5 h-5" />
                  {item.badge && item.badge > 0 && (
                    <span className="absolute -top-1 -right-1 w-4 h-4 bg-brand-error text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                      {item.badge > 9 ? "9+" : item.badge}
                    </span>
                  )}
                </div>
                <span className="text-xs mt-1 font-medium">{item.label}</span>
                {isActive && (
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-0.5 bg-brand-primary rounded-full" />
                )}
              </Link>
            );
          })}
        </div>
      </nav>
    </>
  );
}
