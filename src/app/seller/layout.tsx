"use client";

import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { useState } from "react";
import { useRequireAuth } from "@/lib/hooks";
import { SELLER_NAV, isNavGroup } from "@/lib/constants/navigation";
import { formatCurrency } from "@/lib/utils";
import { cn } from "@/lib/utils";
import { Avatar, Badge, Button, Skeleton } from "@/components/ui";
import { Award, Menu, X, Bell, Search, LogOut, ChevronDown } from "lucide-react";

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

  const handleLogout = () => {
    router.push("/login");
  };

  if (!isReady) {
    return (
      <div className="min-h-screen bg-brand-bg">
        <div className="h-16 bg-white border-b border-brand-border/50 px-6 flex items-center justify-between">
          <Skeleton className="h-8 w-32" />
          <Skeleton className="h-10 w-10 rounded-full" />
        </div>
        <div className="h-14 bg-white border-b border-brand-border/50 px-6 flex items-center gap-4">
          {[1, 2, 3, 4, 5].map((i) => (
            <Skeleton key={i} className="h-8 w-24 rounded-lg" />
          ))}
        </div>
        <main className="p-6">
          <Skeleton className="h-64 w-full rounded-xl" />
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-brand-bg">
      {/* Top Header */}
      <header className="sticky top-0 z-50 bg-white border-b border-brand-border/50 shadow-sm">
        <div className="h-16 px-4 lg:px-6 flex items-center justify-between">
          {/* Left: Logo + Mobile Menu */}
          <div className="flex items-center gap-4">
            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileSidebarOpen(!mobileSidebarOpen)}
              className="lg:hidden p-2 hover:bg-brand-bg rounded-lg transition-colors"
            >
              <Menu className="w-5 h-5 text-brand-text-light" />
            </button>

            {/* Logo */}
            <Link href="/seller">
              <div className="flex items-center gap-2 cursor-pointer">
                <div className="w-8 h-8 bg-brand-primary rounded-lg flex items-center justify-center text-white font-bold">
                  M
                </div>
                <span className="font-bold text-lg text-brand-text-dark hidden sm:inline">
                  MeeLike Seller
                </span>
              </div>
            </Link>
          </div>

          {/* Right: Search + Notifications + User */}
          <div className="flex items-center gap-3">
            {/* Search */}
            <div className="hidden md:flex items-center gap-2 px-3 py-2 bg-brand-bg rounded-lg border border-brand-border/50 w-64">
              <Search className="w-4 h-4 text-brand-text-light" />
              <input
                type="text"
                placeholder="ค้นหา..."
                className="flex-1 bg-transparent border-none outline-none text-sm placeholder:text-brand-text-light"
              />
            </div>

            {/* Notifications */}
            <button className="relative p-2 hover:bg-brand-bg rounded-lg transition-colors">
              <Bell className="w-5 h-5 text-brand-text-light" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-brand-error rounded-full" />
            </button>

            {/* User Menu */}
            <div className="relative">
              <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="flex items-center gap-2 p-1 pr-3 hover:bg-brand-bg rounded-lg transition-colors"
              >
                <Avatar src={seller?.avatar} fallback={seller?.displayName} size="sm" />
                <div className="hidden sm:block text-left">
                  <p className="text-sm font-medium text-brand-text-dark leading-tight">
                    {seller?.displayName}
                  </p>
                  <p className="text-xs text-brand-text-light">
                    {formatCurrency(seller?.balance || 0)}
                  </p>
                </div>
                <ChevronDown className="w-4 h-4 text-brand-text-light hidden sm:block" />
              </button>

              {/* User Dropdown */}
              {showUserMenu && (
                <>
                  <div
                    className="fixed inset-0 z-40"
                    onClick={() => setShowUserMenu(false)}
                  />
                  <div className="absolute right-0 top-full mt-2 w-64 bg-white rounded-xl shadow-xl border border-brand-border/50 z-50 overflow-hidden animate-fade-in">
                    <div className="p-4 border-b border-brand-border/30">
                      <div className="flex items-center gap-3">
                        <Avatar src={seller?.avatar} fallback={seller?.displayName} size="md" />
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-brand-text-dark truncate">
                            {seller?.displayName}
                          </p>
                          <Badge variant="info" size="sm" className="mt-1">
                            <Award className="w-3 h-3 mr-1" />
                            {seller?.plan.charAt(0).toUpperCase() + seller?.plan.slice(1)}
                          </Badge>
                        </div>
                      </div>
                    </div>
                    <div className="p-2">
                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-brand-error/5 text-brand-error transition-colors"
                      >
                        <LogOut className="w-4 h-4" />
                        <span className="font-medium">ออกจากระบบ</span>
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Horizontal Navigation */}
        <div className="border-t border-brand-border/30 bg-white">
          {/* Desktop Tabs */}
          <nav className="hidden lg:flex items-center gap-1 px-6 overflow-x-auto no-scrollbar">
            {SELLER_NAV.map((item) => {
              if (isNavGroup(item)) {
                // Group with dropdown
                return (
                  <div key={item.label} className="relative group">
                    <button className="flex items-center gap-2 px-4 py-3.5 font-medium text-sm text-brand-text-light hover:text-brand-text-dark hover:bg-brand-bg/50 transition-all whitespace-nowrap">
                      <span>{item.label}</span>
                      <ChevronDown className="w-3 h-3" />
                    </button>
                    {/* Dropdown */}
                    <div className="absolute top-full left-0 mt-1 w-48 bg-white rounded-xl shadow-xl border border-brand-border/50 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50">
                      {item.items.map((subItem) => {
                        const SubIcon = subItem.icon;
                        const isActive = pathname === subItem.href;
                        return (
                          <Link
                            key={subItem.href}
                            href={subItem.href}
                            className={cn(
                              "flex items-center gap-3 px-4 py-2.5 hover:bg-brand-bg transition-colors first:rounded-t-xl last:rounded-b-xl",
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
                );
              }

              // Single item
              const isActive = pathname === item.href;
              const Icon = item.icon;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-2 px-5 py-3.5 font-medium text-sm transition-all relative whitespace-nowrap",
                    isActive
                      ? "text-brand-primary"
                      : "text-brand-text-light hover:text-brand-text-dark hover:bg-brand-bg/50"
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
                    <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-brand-primary" />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Mobile Horizontal Scroll Tabs */}
          <nav className="lg:hidden flex items-center gap-1 px-4 overflow-x-auto no-scrollbar">
            {SELLER_NAV.map((item) => {
              if (isNavGroup(item)) {
                return item.items.map((subItem) => {
                  const SubIcon = subItem.icon;
                  const isActive = pathname === subItem.href;
                  return (
                    <Link
                      key={subItem.href}
                      href={subItem.href}
                      className={cn(
                        "flex items-center gap-2 px-4 py-3 font-medium text-sm transition-all relative whitespace-nowrap shrink-0",
                        isActive
                          ? "text-brand-primary"
                          : "text-brand-text-light hover:text-brand-text-dark"
                      )}
                    >
                      <SubIcon className="w-4 h-4" />
                      <span>{subItem.label}</span>
                      {isActive && (
                        <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-brand-primary" />
                      )}
                    </Link>
                  );
                });
              }

              const isActive = pathname === item.href;
              const Icon = item.icon;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-2 px-4 py-3 font-medium text-sm transition-all relative whitespace-nowrap shrink-0",
                    isActive
                      ? "text-brand-primary"
                      : "text-brand-text-light hover:text-brand-text-dark"
                  )}
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                  {isActive && (
                    <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-brand-primary" />
                  )}
                </Link>
              );
            })}
          </nav>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      {mobileSidebarOpen && (
        <>
          <div
            className="fixed inset-0 bg-black/50 z-40 lg:hidden"
            onClick={() => setMobileSidebarOpen(false)}
          />
          <aside className="fixed left-0 top-0 bottom-0 w-72 bg-white z-50 lg:hidden shadow-xl animate-slide-in-left">
            <div className="h-16 px-4 flex items-center justify-between border-b border-brand-border/50">
              <Link href="/seller">
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

            <nav className="p-4 space-y-1">
              {SELLER_NAV.map((item) => {
                if (isNavGroup(item)) {
                  return (
                    <div key={item.label} className="space-y-1">
                      <p className="px-3 py-2 text-xs font-semibold text-brand-text-light uppercase tracking-wider">
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

                const isActive = pathname === item.href;
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

            <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-brand-border/50">
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

      {/* Main Content - Full Width */}
      <main className="p-4 lg:p-6 min-h-[calc(100vh-8rem)]">
        {children}
      </main>
    </div>
  );
}
