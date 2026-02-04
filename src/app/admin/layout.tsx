"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  Shield, 
  Users, 
  FileText, 
  Settings, 
  LayoutDashboard,
  ChevronRight,
  LogOut
} from "lucide-react";
import { Button } from "@/components/ui";

const navItems = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/kyc", label: "KYC Review", icon: Shield },
  { href: "/admin/users", label: "Users", icon: Users },
  { href: "/admin/reports", label: "Reports", icon: FileText },
  { href: "/admin/settings", label: "Settings", icon: Settings },
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  return (
    <div className="min-h-screen bg-brand-bg flex">
      {/* Sidebar */}
      <aside className="w-64 bg-brand-surface border-r border-brand-border hidden lg:block">
        <div className="p-6">
          <Link href="/admin" className="flex items-center gap-2">
            <Shield className="w-8 h-8 text-brand-primary" />
            <span className="text-xl font-bold text-brand-text-dark">Admin</span>
          </Link>
        </div>

        <nav className="px-4 space-y-1">
          {navItems.map((item) => {
            const isActive = pathname === item.href || 
              (item.href !== "/admin" && pathname.startsWith(item.href));
            
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`
                  flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium
                  transition-colors
                  ${isActive 
                    ? "bg-brand-primary text-white" 
                    : "text-brand-text-light hover:bg-brand-bg hover:text-brand-text-dark"
                  }
                `}
              >
                <item.icon className="w-5 h-5" />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="absolute bottom-0 left-0 right-0 p-4 w-64">
          <Link href="/seller">
            <Button variant="outline" className="w-full gap-2">
              <LogOut className="w-4 h-4" />
              Exit Admin
            </Button>
          </Link>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        {/* Mobile Header */}
        <header className="lg:hidden bg-brand-surface border-b border-brand-border p-4">
          <div className="flex items-center justify-between">
            <Link href="/admin" className="flex items-center gap-2">
              <Shield className="w-6 h-6 text-brand-primary" />
              <span className="font-bold text-brand-text-dark">Admin</span>
            </Link>
          </div>
        </header>

        <div className="p-6">
          {children}
        </div>
      </main>
    </div>
  );
}
