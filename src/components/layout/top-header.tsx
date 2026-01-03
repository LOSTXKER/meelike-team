"use client";

import { cn } from "@/lib/utils";
import { useAppStore } from "@/lib/store";
import { Menu, Bell, Search, Sparkles, HelpCircle } from "lucide-react";
import Link from "next/link";

interface TopHeaderProps {
  showSearch?: boolean;
  showNotification?: boolean;
  showMobileMenu?: boolean;
  showMobileLogo?: boolean;
  logoText?: string;
  className?: string;
  leftContent?: React.ReactNode;
  rightContent?: React.ReactNode;
}

export function TopHeader({
  showSearch = false,
  showNotification = true,
  showMobileMenu = true,
  showMobileLogo = false,
  logoText = "MeeLike",
  className,
  leftContent,
  rightContent,
}: TopHeaderProps) {
  const { toggleSidebar } = useAppStore();

  return (
    <header
      className={cn(
        "sticky top-0 z-30 h-16 bg-brand-surface/80 backdrop-blur-sm border-b border-brand-border",
        className
      )}
    >
      <div className="flex items-center justify-between h-full px-4 lg:px-6">
        {/* Left Side */}
        <div className="flex items-center gap-3">
          {showMobileMenu && (
            <button
              onClick={toggleSidebar}
              className="lg:hidden p-2 rounded-lg hover:bg-brand-bg text-brand-text-light transition-colors"
            >
              <Menu className="w-5 h-5" />
            </button>
          )}
          
          {showMobileLogo && (
            <div className="flex items-center gap-3 lg:hidden">
              <Sparkles className="w-6 h-6 text-brand-primary" />
              <span className="text-lg font-bold text-brand-text-dark">
                {logoText}
              </span>
            </div>
          )}
          
          {leftContent}
        </div>

        {/* Search */}
        {showSearch && (
          <div className="hidden sm:flex items-center flex-1 max-w-md mx-4">
            <div className="relative w-full group">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-brand-text-light group-focus-within:text-brand-primary transition-colors" />
              <input
                type="text"
                placeholder="ค้นหา..."
                className="w-full pl-10 pr-4 py-2.5 bg-brand-bg/50 border-none rounded-xl text-sm text-brand-text-dark placeholder:text-brand-text-light/60 focus:outline-none focus:ring-2 focus:ring-brand-primary/10 transition-all shadow-sm group-hover:bg-brand-bg group-focus-within:bg-brand-surface"
              />
            </div>
          </div>
        )}

        {/* Right Actions */}
        <div className="flex items-center gap-3">
          {rightContent}
          
          {/* Help Link */}
          <Link
            href="/help"
            className="p-2 rounded-lg hover:bg-brand-bg text-brand-text-light hover:text-brand-primary transition-colors group"
            title="ศูนย์ช่วยเหลือ"
          >
            <HelpCircle className="w-5 h-5 group-hover:scale-110 transition-transform" />
          </Link>
          
          {showNotification && (
            <button className="relative p-2 rounded-lg hover:bg-brand-bg text-brand-text-light transition-colors">
              <Bell className="w-5 h-5" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-brand-error rounded-full" />
            </button>
          )}
        </div>
      </div>
    </header>
  );
}

