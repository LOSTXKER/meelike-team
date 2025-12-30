"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { useAppStore } from "@/lib/store";
import { Badge } from "@/components/ui";
import { ChevronLeft, LogOut, Menu, Sparkles } from "lucide-react";
import type { NavConfig, NavItem, NavGroup } from "@/lib/constants/navigation";
import { isNavGroup } from "@/lib/constants/navigation";

interface SidebarProps {
  nav: NavConfig;
  logo: {
    href: string;
    title: string;
    color?: string;
  };
  userSection?: React.ReactNode;
  onLogout?: () => void;
  className?: string;
  hiddenOnMobile?: boolean;
}

export function Sidebar({
  nav,
  logo,
  userSection,
  onLogout,
  className,
  hiddenOnMobile = false,
}: SidebarProps) {
  const pathname = usePathname();
  const { sidebarOpen, toggleSidebar } = useAppStore();

  return (
    <>
      {/* Mobile Overlay */}
      {sidebarOpen && !hiddenOnMobile && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={toggleSidebar}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed left-0 top-0 h-full bg-brand-surface border-r border-brand-border z-50",
          "transition-all duration-300 ease-in-out",
          sidebarOpen ? "w-64" : "w-64 lg:w-16",
          hiddenOnMobile ? "hidden lg:block" : "",
          !hiddenOnMobile && (sidebarOpen ? "translate-x-0 shadow-xl" : "-translate-x-full lg:translate-x-0 lg:shadow-none"),
          className
        )}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="h-16 flex items-center justify-between px-4 border-b border-brand-border">
            {sidebarOpen && (
              <Link href={logo.href} className="flex items-center gap-2">
                <div className={cn("w-8 h-8 rounded-lg flex items-center justify-center", logo.color || "bg-brand-primary")}>
                  <Sparkles className="w-5 h-5 text-white" />
                </div>
                <span className="text-lg font-bold text-brand-text-dark">
                  {logo.title}
                </span>
              </Link>
            )}
            <button
              onClick={toggleSidebar}
              className="p-2 rounded-lg hover:bg-brand-bg text-brand-text-light transition-colors"
            >
              {sidebarOpen ? (
                <ChevronLeft className="w-5 h-5" />
              ) : (
                <Menu className="w-5 h-5" />
              )}
            </button>
          </div>

          {/* Menu */}
          <nav className={cn("flex-1 overflow-y-auto", sidebarOpen ? "p-4" : "p-2")}>
            <ul className="space-y-1">
              {nav.map((item, index) => (
                <li key={index}>
                  {isNavGroup(item) ? (
                    <NavGroupComponent group={item} pathname={pathname} sidebarOpen={sidebarOpen} />
                  ) : (
                    <NavItemComponent item={item} pathname={pathname} sidebarOpen={sidebarOpen} />
                  )}
                </li>
              ))}
            </ul>
          </nav>

          {/* User Section */}
          {userSection && (
            <div className="p-4 border-t border-brand-border">
              {userSection}
              {sidebarOpen && onLogout && (
                <button
                  onClick={onLogout}
                  className="flex items-center gap-2 w-full mt-4 px-3 py-2 text-sm text-brand-text-light hover:text-brand-error hover:bg-brand-error/10 rounded-lg transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  ออกจากระบบ
                </button>
              )}
            </div>
          )}
        </div>
      </aside>
    </>
  );
}

function NavItemComponent({
  item,
  pathname,
  sidebarOpen,
}: {
  item: NavItem;
  pathname: string;
  sidebarOpen: boolean;
}) {
  const isActive = pathname === item.href;
  const Icon = item.icon;

  return (
    <Link
      href={item.href}
      className={cn(
        "group flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 ease-in-out",
        sidebarOpen ? "justify-between" : "justify-center px-2",
        isActive
          ? "bg-brand-primary text-white shadow-md shadow-brand-primary/20"
          : "text-brand-text-light hover:text-brand-text-dark hover:bg-brand-secondary"
      )}
    >
      <div className={cn("flex items-center gap-3", !sidebarOpen && "gap-0")}>
        <Icon className={cn("w-5 h-5 flex-shrink-0 transition-colors", isActive ? "text-white" : "group-hover:text-brand-primary")} />
        {sidebarOpen && <span className="font-medium">{item.label}</span>}
      </div>
      {sidebarOpen && item.badge && (
        <Badge variant={isActive ? "secondary" : "error"} size="sm" className={isActive ? "bg-white/20 text-white" : ""}>
          {item.badge}
        </Badge>
      )}
    </Link>
  );
}

function NavGroupComponent({
  group,
  pathname,
  sidebarOpen,
}: {
  group: NavGroup;
  pathname: string;
  sidebarOpen: boolean;
}) {
  return (
    <>
      {sidebarOpen && (
        <div className="px-3 py-2 text-xs font-semibold text-brand-text-light uppercase tracking-wider mt-4">
          {group.label}
        </div>
      )}
      <ul className="space-y-1">
        {group.items.map((subItem, subIndex) => (
          <li key={subIndex}>
            <NavItemComponent item={subItem} pathname={pathname} sidebarOpen={sidebarOpen} />
          </li>
        ))}
      </ul>
    </>
  );
}

