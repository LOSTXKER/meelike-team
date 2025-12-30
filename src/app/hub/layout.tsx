"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuthStore } from "@/lib/store";
import {
  Users,
  Search,
  Briefcase,
  Plus,
  Home,
  Bell,
  User,
  Menu,
  X,
  LogIn,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui";

const navItems = [
  { href: "/hub", label: "หน้าหลัก", icon: Home },
  { href: "/hub/recruit", label: "หาลูกทีม", icon: Users },
  { href: "/hub/find-team", label: "หาทีม", icon: Search },
  { href: "/hub/outsource", label: "โยนงาน", icon: Briefcase },
];

export default function HubLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const { isAuthenticated, user, role, _hasHydrated } = useAuthStore();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Hub is public - no need to wait for hydration to show content

  return (
    <div className="min-h-screen bg-gradient-to-br from-brand-bg via-white to-brand-primary/5">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-brand-border">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link href="/hub" className="flex items-center gap-2">
              <div className="w-8 h-8 bg-brand-primary rounded-lg flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <span className="font-bold text-brand-text-dark">
                MeeLike <span className="text-brand-primary">Hub</span>
              </span>
            </Link>

            {/* Desktop Nav */}
            <nav className="hidden md:flex items-center gap-1">
              {navItems.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                      isActive
                        ? "bg-brand-primary text-white"
                        : "text-brand-text-light hover:text-brand-text-dark hover:bg-brand-bg"
                    }`}
                  >
                    {item.label}
                  </Link>
                );
              })}
            </nav>

            {/* Actions */}
            <div className="flex items-center gap-3">
              {isAuthenticated ? (
                <>
                  <Link href="/hub/post/new">
                    <Button size="sm">
                      <Plus className="w-4 h-4 mr-1" />
                      โพสต์
                    </Button>
                  </Link>
                  <button className="p-2 hover:bg-brand-bg rounded-lg relative">
                    <Bell className="w-5 h-5 text-brand-text-light" />
                    <span className="absolute top-1 right-1 w-2 h-2 bg-brand-error rounded-full" />
                  </button>
                  <Link
                    href={role === "seller" ? "/seller" : "/work"}
                    className="flex items-center gap-2 p-2 hover:bg-brand-bg rounded-lg"
                  >
                    <div className="w-8 h-8 bg-brand-primary/10 rounded-full flex items-center justify-center">
                      <User className="w-4 h-4 text-brand-primary" />
                    </div>
                    <span className="hidden sm:block text-sm font-medium text-brand-text-dark">
                      {user?.displayName || "ผู้ใช้"}
                    </span>
                  </Link>
                </>
              ) : (
                <Link href="/login">
                  <Button size="sm" variant="outline">
                    <LogIn className="w-4 h-4 mr-1" />
                    เข้าสู่ระบบ
                  </Button>
                </Link>
              )}

              {/* Mobile Menu Button */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden p-2 hover:bg-brand-bg rounded-lg"
              >
                {mobileMenuOpen ? (
                  <X className="w-5 h-5" />
                ) : (
                  <Menu className="w-5 h-5" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-brand-border bg-white">
            <nav className="p-4 space-y-2">
              {navItems.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex items-center gap-3 px-4 py-3 rounded-lg ${
                      isActive
                        ? "bg-brand-primary text-white"
                        : "text-brand-text-dark hover:bg-brand-bg"
                    }`}
                  >
                    <item.icon className="w-5 h-5" />
                    {item.label}
                  </Link>
                );
              })}
            </nav>
          </div>
        )}
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-6">{children}</main>

      {/* Footer */}
      <footer className="border-t border-brand-border bg-white mt-12">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-brand-primary rounded-lg flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <span className="font-medium text-brand-text-dark">
                MeeLike Hub
              </span>
              <span className="text-brand-text-light text-sm">
                - ตลาดกลางเชื่อมต่อแม่ทีมกับลูกทีม
              </span>
            </div>
            <div className="flex items-center gap-4 text-sm text-brand-text-light">
              <Link href="/" className="hover:text-brand-primary">
                หน้าหลัก
              </Link>
              <Link href="/seller" className="hover:text-brand-primary">
                Seller Center
              </Link>
              <Link href="/work" className="hover:text-brand-primary">
                Worker App
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

