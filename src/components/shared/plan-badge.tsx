"use client";

import Link from "next/link";
import { Crown, AlertTriangle, Sparkles } from "lucide-react";

interface PlanBadgeProps {
  plan: string;
  expiresAt?: string;
  className?: string;
}

const PLAN_CONFIG = {
  free: {
    label: "Free",
    color: "bg-gray-500",
    bgGradient: "from-gray-100 to-gray-200",
    borderColor: "border-gray-300",
    canUpgrade: true,
  },
  basic: {
    label: "Basic",
    color: "bg-blue-500",
    bgGradient: "from-blue-50 to-blue-100",
    borderColor: "border-blue-200",
    canUpgrade: true,
  },
  pro: {
    label: "Pro",
    color: "bg-brand-primary",
    bgGradient: "from-brand-primary/10 to-brand-accent/10",
    borderColor: "border-brand-primary/20",
    canUpgrade: true,
  },
  business: {
    label: "Business",
    color: "bg-gradient-to-r from-amber-500 to-yellow-500",
    bgGradient: "from-amber-50 to-yellow-50",
    borderColor: "border-amber-200",
    canUpgrade: false,
  },
};

function getDaysRemaining(expiresAt: string): number {
  const now = new Date();
  // Reset time to midnight for accurate day calculation
  now.setHours(0, 0, 0, 0);
  const expiry = new Date(expiresAt);
  expiry.setHours(0, 0, 0, 0);
  const diffTime = expiry.getTime() - now.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
}

export function PlanBadge({ plan, expiresAt, className = "" }: PlanBadgeProps) {
  const config = PLAN_CONFIG[plan as keyof typeof PLAN_CONFIG] || PLAN_CONFIG.free;
  const daysRemaining = expiresAt ? getDaysRemaining(expiresAt) : null;
  const isExpiringSoon = daysRemaining !== null && daysRemaining <= 7;
  const isExpired = daysRemaining !== null && daysRemaining <= 0;

  return (
    <Link href="/seller/settings/subscription">
      <div 
        className={`
          inline-flex items-center gap-2 px-3 py-1.5 rounded-full 
          bg-gradient-to-r ${config.bgGradient} 
          border ${config.borderColor} 
          hover:shadow-md transition-all cursor-pointer group
          ${className}
        `}
      >
        {/* Plan Label */}
        <span className={`text-xs font-bold text-white ${config.color} px-2 py-0.5 rounded uppercase tracking-wide flex items-center gap-1`}>
          {plan === 'business' && <Crown className="w-3 h-3" />}
          {config.label}
        </span>

        {/* Days Remaining */}
        {daysRemaining !== null && plan !== 'free' && (
          <>
            <span className="w-1 h-1 rounded-full bg-brand-text-light/30" />
            <span className={`text-xs font-medium flex items-center gap-1 ${
              isExpired ? 'text-brand-error' : 
              isExpiringSoon ? 'text-brand-warning' : 
              'text-brand-text-light'
            }`}>
              {isExpiringSoon && <AlertTriangle className="w-3 h-3" />}
              {isExpired ? 'หมดอายุแล้ว' : `คงเหลือ ${daysRemaining} วัน`}
            </span>
          </>
        )}

        {/* Upgrade CTA */}
        {config.canUpgrade && (
          <>
            <span className="w-1 h-1 rounded-full bg-brand-text-light/30" />
            <span className="text-xs text-brand-primary group-hover:underline flex items-center gap-1">
              <Sparkles className="w-3 h-3" />
              อัปเกรด
            </span>
          </>
        )}

        {/* Business - Max Plan */}
        {!config.canUpgrade && (
          <>
            <span className="w-1 h-1 rounded-full bg-amber-400/50" />
            <span className="text-xs text-amber-600 flex items-center gap-1">
              <Crown className="w-3 h-3" />
              แพคเกจสูงสุด
            </span>
          </>
        )}
      </div>
    </Link>
  );
}
