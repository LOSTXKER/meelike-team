"use client";

import * as React from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import type { LucideIcon } from "lucide-react";

interface QuickActionCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  colorClass: string; // e.g., "from-blue-500 to-blue-600"
  href: string;
  stats?: Array<{
    label: string;
    value: string | number;
    icon: LucideIcon;
    color: string;
  }>;
}

export const QuickActionCard: React.FC<QuickActionCardProps> = ({
  icon: Icon,
  title,
  description,
  colorClass,
  href,
  stats
}) => {
  return (
    <Link href={href} className="block h-full">
      <div className="h-full bg-white rounded-2xl p-4 shadow-lg hover:shadow-xl transition-all cursor-pointer group border border-white/50">
        {/* Icon Header */}
        <div className="flex items-start gap-3 mb-4">
          <div className={cn(
            "w-14 h-14 rounded-2xl bg-gradient-to-br flex items-center justify-center text-white text-xl font-bold shadow-lg group-hover:scale-110 transition-transform",
            colorClass
          )}>
            <Icon className="w-7 h-7" />
          </div>
          
          <div className="flex-1">
            <h3 className="font-bold text-brand-text-dark group-hover:text-brand-primary transition-colors">
              {title}
            </h3>
            <p className="text-xs text-brand-text-light mt-0.5">{description}</p>
          </div>
        </div>
        
        {/* Stats */}
        {stats && stats.length > 0 && (
          <div className="flex items-center justify-between bg-brand-bg/50 rounded-xl p-3">
            {stats.map((stat, idx) => (
              <div key={idx} className="text-center">
                <div className={cn("flex items-center justify-center gap-1", stat.color)}>
                  <stat.icon className="w-4 h-4" />
                  <p className="text-lg font-bold">{stat.value}</p>
                </div>
                <p className="text-[10px] text-brand-text-light mt-0.5">{stat.label}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </Link>
  );
};
