"use client";

import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { useState } from "react";
import { useRequireAuth } from "@/lib/hooks";
import { SELLER_NAV, USER_MENU_ITEMS, isNavGroup } from "@/lib/constants/navigation";
import { formatCurrency } from "@/lib/utils";
import { cn } from "@/lib/utils";
import { Avatar, Badge, Button, Skeleton } from "@/components/ui";
import { ErrorBoundary, Breadcrumb, DevTools } from "@/components/shared";
import { SellerBottomNav } from "@/components/seller";
import { Award, Menu, X, Bell, LogOut, ChevronDown, Wallet, Plus, Search, Command } from "lucide-react";

export default function SellerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const { user, isReady, seller } = useRequireAuth({
    requiredRole: "seller",
    redirectIfWrongRole: "/work",
  });

  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showSearch, setShowSearch] = useState(false);

  const handleLogout = () => {
    router.push("/login");
  };

  // Check if we're inside Team Level (has team ID in path)
  const isInTeamLevel = /^\/seller\/team\/[^/]+/.test(pathname);

  // If inside Team Level, just render children (Team Layout will handle its own header)
  if (isInTeamLevel) {
    if (!isReady) {
      return (
        <div className="min-h-screen bg-brand-bg">
          <Skeleton className="h-64 w-full rounded-xl m-6" />
        </div>
      );
    }
    return <>{children}</>;
  }

  if (!isReady) {
    return (
      <div className="min-h-screen bg-brand-bg">
        <div className="h-16 bg-white border-b border-brand-border/50 px-6 flex items-center justify-between">
          <Skeleton className="h-8 w-32" />
          <Skeleton className="h-10 w-10 rounded-full" />
        </div>
        <main className="p-6">
          <Skeleton className="h-64 w-full rounded-xl" />
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-brand-bg">
      {/* ============================================ */}
      {/* TOP HEADER - Simplified & Clean */}
      {/* ============================================ */}
      <header className="sticky top-0 z-50 bg-white border-b border-brand-border/50 shadow-sm">
        <div className="max-w-7xl mx-auto h-14 px-4 lg:px-6 flex items-center justify-between gap-4">
          {/* Left: Logo */}
          <div className="flex items-center gap-3">
            <Link href="/seller" className="flex items-center gap-2.5 shrink-0">
              <div className="w-8 h-8 bg-brand-primary rounded-lg flex items-center justify-center text-white font-bold text-sm">
                M
              </div>
              <span className="font-bold text-lg text-brand-text-dark hidden sm:inline">
                MeeLike
              </span>
            </Link>
          </div>

          {/* Center: Search Bar (Desktop Only) - Clickable to open modal */}
          <button
            onClick={() => setShowSearch(true)}
            className="hidden md:flex items-center gap-2 px-3 py-2 bg-brand-bg/80 hover:bg-brand-bg rounded-xl border border-brand-border/50 text-brand-text-light text-sm transition-colors w-64 lg:w-80"
          >
            <Search className="w-4 h-4" />
            <span className="flex-1 text-left">ค้นหา...</span>
            <kbd className="hidden lg:flex items-center gap-0.5 px-1.5 py-0.5 bg-white rounded text-xs border border-brand-border/50">
              <Command className="w-3 h-3" />K
            </kbd>
          </button>

          {/* Right: Actions */}
          <div className="flex items-center gap-2">
            {/* Mobile Search Button */}
            <button
              onClick={() => setShowSearch(true)}
              className="md:hidden p-2.5 hover:bg-brand-bg rounded-xl transition-colors"
            >
              <Search className="w-5 h-5 text-brand-text-light" />
            </button>

            {/* Wallet Balance - Compact */}
            <Link href="/seller/finance" className="hidden sm:block">
              <div className="flex items-center gap-2 px-3 py-2 bg-brand-success/10 hover:bg-brand-success/15 rounded-xl transition-colors group">
                <Wallet className="w-4 h-4 text-brand-success" />
                <span className="text-sm font-bold text-brand-success">
                  {formatCurrency(seller?.balance || 0)}
                </span>
              </div>
            </Link>

            {/* Notifications */}
            <button className="relative p-2.5 hover:bg-brand-bg rounded-xl transition-colors">
              <Bell className="w-5 h-5 text-brand-text-light" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-brand-error rounded-full" />
            </button>

            {/* User Menu */}
            <div className="relative">
              <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="flex items-center gap-2 p-1.5 pr-2 hover:bg-brand-bg rounded-xl transition-colors"
              >
                <Avatar src={seller?.avatar} fallback={seller?.displayName} size="sm" />
                <ChevronDown className={cn(
                  "w-4 h-4 text-brand-text-light transition-transform hidden sm:block",
                  showUserMenu && "rotate-180"
                )} />
              </button>

              {/* User Dropdown */}
              {showUserMenu && (
                <>
                  <div
                    className="fixed inset-0 z-40"
                    onClick={() => setShowUserMenu(false)}
                  />
                  <div className="absolute right-0 top-full mt-2 w-64 bg-white rounded-xl shadow-xl border border-brand-border/50 z-50 overflow-hidden animate-fade-in">
                    {/* User Info */}
                    <div className="p-4 border-b border-brand-border/30 bg-brand-bg/30">
                      <div className="flex items-center gap-3">
                        <Avatar src={seller?.avatar} fallback={seller?.displayName} size="md" />
                        <div className="flex-1 min-w-0">
                          <p className="font-semibold text-brand-text-dark truncate">
                            {seller?.displayName}
                          </p>
                          <div className="flex items-center gap-2 mt-1">
                            <Badge variant="info" size="sm">
                              <Award className="w-3 h-3 mr-1" />
                              {seller?.plan ? seller.plan.charAt(0).toUpperCase() + seller.plan.slice(1) : "Free"}
                            </Badge>
                          </div>
                        </div>
                      </div>
                      {/* Mobile Wallet Display */}
                      <Link 
                        href="/seller/finance"
                        onClick={() => setShowUserMenu(false)}
                        className="sm:hidden flex items-center justify-between mt-3 p-2.5 bg-brand-success/10 rounded-lg"
                      >
                        <div className="flex items-center gap-2">
                          <Wallet className="w-4 h-4 text-brand-success" />
                          <span className="text-sm text-brand-text-dark">ยอดเงิน</span>
                        </div>
                        <span className="text-sm font-bold text-brand-success">
                          {formatCurrency(seller?.balance || 0)}
                        </span>
                      </Link>
                    </div>
                    
                    {/* Menu Items */}
                    <div className="p-2">
                      {USER_MENU_ITEMS.map((item) => {
                        const Icon = item.icon;
                        const isActive = pathname === item.href;
                        return (
                          <Link
                            key={item.href}
                            href={item.href}
                            onClick={() => setShowUserMenu(false)}
                            className={cn(
                              "flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors",
                              isActive 
                                ? "bg-brand-primary/10 text-brand-primary" 
                                : "hover:bg-brand-bg text-brand-text-dark"
                            )}
                          >
                            <Icon className="w-4 h-4" />
                            <span className="font-medium text-sm">{item.label}</span>
                          </Link>
                        );
                      })}
                    </div>
                    
                    {/* Logout */}
                    <div className="p-2 border-t border-brand-border/30">
                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-brand-error/5 text-brand-error transition-colors"
                      >
                        <LogOut className="w-4 h-4" />
                        <span className="font-medium text-sm">ออกจากระบบ</span>
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* ============================================ */}
      {/* SECONDARY NAVIGATION - Tabs */}
      {/* ============================================ */}
      <nav className="sticky top-14 z-40 bg-white border-b border-brand-border/30 hidden lg:block">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center gap-1">
            {SELLER_NAV.map((item) => {
              if (isNavGroup(item)) {
                const GroupIcon = item.icon;
                return (
                  <div key={item.label} className="relative group/nav">
                    <button className="flex items-center gap-2 px-4 py-3 font-medium text-sm text-brand-text-light hover:text-brand-text-dark transition-colors">
                      <GroupIcon className="w-4 h-4" />
                      <span>{item.label}</span>
                      <ChevronDown className="w-3 h-3 transition-transform group-hover/nav:rotate-180" />
                    </button>
                    <div className="absolute top-full left-0 pt-1 opacity-0 invisible group-hover/nav:opacity-100 group-hover/nav:visible transition-all duration-150 z-[100]">
                      <div className="w-48 bg-white rounded-xl shadow-xl border border-brand-border/50 py-1">
                        {item.items.map((subItem) => {
                          const SubIcon = subItem.icon;
                          const isActive = pathname === subItem.href;
                          return (
                            <Link
                              key={subItem.href}
                              href={subItem.href}
                              className={cn(
                                "flex items-center gap-3 px-4 py-2.5 hover:bg-brand-bg transition-colors",
                                isActive && "bg-brand-primary/5 text-brand-primary"
                              )}
                            >
                              <SubIcon className="w-4 h-4" />
                              <span className="text-sm font-medium">{subItem.label}</span>
                              {subItem.badge && (
                                <Badge variant="error" size="sm" className="ml-auto">
                                  {subItem.badge}
                                </Badge>
                              )}
                            </Link>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                );
              }

              const isActive = pathname === item.href || 
                (item.href !== "/seller" && pathname.startsWith(item.href + "/"));
              const Icon = item.icon;

              if (item.isSpecial) {
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="flex items-center gap-2 px-4 py-2 ml-auto font-medium text-sm bg-brand-primary text-white rounded-full hover:bg-brand-primary/90 transition-all shadow-md hover:shadow-lg"
                  >
                    <Icon className="w-4 h-4" />
                    <span>{item.label}</span>
                  </Link>
                );
              }

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-2 px-4 py-3 font-medium text-sm transition-all relative",
                    isActive
                      ? "text-brand-primary"
                      : "text-brand-text-light hover:text-brand-text-dark"
                  )}
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                  {item.badge && (
                    <Badge variant="error" size="sm" className="ml-1">
                      {item.badge}
                    </Badge>
                  )}
                  {isActive && (
                    <div className="absolute bottom-0 left-2 right-2 h-0.5 bg-brand-primary rounded-full" />
                  )}
                </Link>
              );
            })}
          </div>
        </div>
      </nav>

      {/* ============================================ */}
      {/* BREADCRUMB - Below navigation */}
      {/* ============================================ */}
      <div className="max-w-7xl mx-auto px-4 lg:px-6 pt-4">
        <Breadcrumb />
      </div>

      {/* ============================================ */}
      {/* MOBILE SIDEBAR */}
      {/* ============================================ */}
      {mobileSidebarOpen && (
        <>
          <div
            className="fixed inset-0 bg-black/50 z-40 lg:hidden"
            onClick={() => setMobileSidebarOpen(false)}
          />
          <aside className="fixed left-0 top-0 bottom-0 w-72 bg-white z-50 lg:hidden shadow-xl animate-slide-in-left">
            <div className="h-14 px-4 flex items-center justify-between border-b border-brand-border/50">
              <Link href="/seller" onClick={() => setMobileSidebarOpen(false)}>
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-brand-primary rounded-lg flex items-center justify-center text-white font-bold">
                    M
                  </div>
                  <span className="font-bold text-lg text-brand-text-dark">
                    MeeLike Seller
                  </span>
                </div>
              </Link>
              <button
                onClick={() => setMobileSidebarOpen(false)}
                className="p-2 hover:bg-brand-bg rounded-lg"
              >
                <X className="w-5 h-5 text-brand-text-light" />
              </button>
            </div>

            <nav className="p-4 space-y-1 overflow-y-auto max-h-[calc(100vh-8rem)]">
              {SELLER_NAV.map((item) => {
                if (isNavGroup(item)) {
                  const GroupIcon = item.icon;
                  return (
                    <div key={item.label} className="space-y-1">
                      <p className="px-3 py-2 text-xs font-semibold text-brand-text-light uppercase tracking-wider flex items-center gap-2">
                        <GroupIcon className="w-4 h-4" />
                        {item.label}
                      </p>
                      {item.items.map((subItem) => {
                        const SubIcon = subItem.icon;
                        const isActive = pathname === subItem.href;
                        return (
                          <Link
                            key={subItem.href}
                            href={subItem.href}
                            onClick={() => setMobileSidebarOpen(false)}
                            className={cn(
                              "flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all",
                              isActive
                                ? "bg-brand-primary text-white shadow-md"
                                : "text-brand-text-light hover:bg-brand-bg"
                            )}
                          >
                            <SubIcon className="w-5 h-5" />
                            <span className="font-medium">{subItem.label}</span>
                            {subItem.badge && (
                              <Badge
                                variant={isActive ? "default" : "error"}
                                size="sm"
                                className={cn("ml-auto", isActive && "bg-white/20 text-white")}
                              >
                                {subItem.badge}
                              </Badge>
                            )}
                          </Link>
                        );
                      })}
                    </div>
                  );
                }

                const isActive = pathname === item.href || 
                  (item.href !== "/seller" && pathname.startsWith(item.href + "/"));
                const Icon = item.icon;

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setMobileSidebarOpen(false)}
                    className={cn(
                      "flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all",
                      isActive
                        ? "bg-brand-primary text-white shadow-md"
                        : "text-brand-text-light hover:bg-brand-bg"
                    )}
                  >
                    <Icon className="w-5 h-5" />
                    <span className="font-medium">{item.label}</span>
                    {item.badge && (
                      <Badge
                        variant={isActive ? "default" : "error"}
                        size="sm"
                        className={cn("ml-auto", isActive && "bg-white/20 text-white")}
                      >
                        {item.badge}
                      </Badge>
                    )}
                  </Link>
                );
              })}
            </nav>

            <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-brand-border/50 bg-white">
              <Button
                variant="outline"
                className="w-full text-brand-error border-brand-error/20 hover:bg-brand-error/5"
                onClick={handleLogout}
                leftIcon={<LogOut className="w-4 h-4" />}
              >
                ออกจากระบบ
              </Button>
            </div>
          </aside>
        </>
      )}

      {/* ============================================ */}
      {/* SEARCH MODAL */}
      {/* ============================================ */}
      {showSearch && (
        <>
          <div
            className="fixed inset-0 bg-black/50 z-[60]"
            onClick={() => setShowSearch(false)}
          />
          <div className="fixed top-20 left-1/2 -translate-x-1/2 w-full max-w-lg mx-auto px-4 z-[70]">
            <div className="bg-white rounded-2xl shadow-2xl border border-brand-border/50 overflow-hidden">
              <div className="flex items-center gap-3 p-4 border-b border-brand-border/30">
                <Search className="w-5 h-5 text-brand-text-light" />
                <input
                  type="text"
                  placeholder="ค้นหาออเดอร์, บริการ, ทีม..."
                  className="flex-1 bg-transparent border-none outline-none text-brand-text-dark placeholder:text-brand-text-light"
                  autoFocus
                />
                <kbd className="px-2 py-1 bg-brand-bg rounded text-xs text-brand-text-light border border-brand-border/50">
                  ESC
                </kbd>
              </div>
              <div className="p-4 text-center text-sm text-brand-text-light">
                พิมพ์เพื่อค้นหา...
              </div>
            </div>
          </div>
        </>
      )}

      {/* ============================================ */}
      {/* MAIN CONTENT */}
      {/* ============================================ */}
      <main className="max-w-7xl mx-auto p-4 lg:p-6 pb-24 lg:pb-6 min-h-[calc(100vh-8rem)]">
        <ErrorBoundary>
          {children}
        </ErrorBoundary>
      </main>

      {/* ============================================ */}
      {/* MOBILE BOTTOM NAVIGATION */}
      {/* ============================================ */}
      <SellerBottomNav />

      {/* ============================================ */}
      {/* DEV TOOLS - Development Only */}
      {/* ============================================ */}
      {(process.env.NODE_ENV === "development" || process.env.NEXT_PUBLIC_DEV_TOOLS === "true") && <DevTools />}
    </div>
  );
}
