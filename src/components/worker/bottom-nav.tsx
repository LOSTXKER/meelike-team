"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Home, Users, ClipboardList, Wallet, Sparkles } from "lucide-react";

const navItems = [
  { href: "/work", icon: Home, label: "หน้าแรก" },
  { href: "/work/teams", icon: Users, label: "ทีม" },
  { href: "/hub", icon: Sparkles, label: "Hub" },
  { href: "/work/jobs", icon: ClipboardList, label: "งาน" },
  { href: "/work/earnings", icon: Wallet, label: "รายได้" },
];

export function WorkerBottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-brand-surface border-t border-brand-border lg:hidden">
      <div className="flex items-center justify-around h-16">
        {navItems.map((item) => {
          const isActive = pathname === item.href || 
            (item.href !== "/work" && pathname.startsWith(item.href));
          
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex flex-col items-center justify-center flex-1 h-full transition-colors",
                isActive
                  ? "text-brand-primary"
                  : "text-brand-text-light hover:text-brand-text-dark"
              )}
            >
              <item.icon className="w-5 h-5" />
              <span className="text-xs mt-1">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}

