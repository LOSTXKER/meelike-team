"use client";

import Link from "next/link";
import { Card, Button, Badge } from "@/components/ui";
import { useAuthStore } from "@/lib/store";
import {
  getKYCLevelLabel,
  type KYCLevel,
} from "@/types";
import {
  Shield,
  Phone,
  CreditCard,
  Building2,
  CheckCircle,
  ChevronRight,
  Sparkles,
} from "lucide-react";

export interface KYCStatusCardProps {
  userType?: "seller" | "worker";
  compact?: boolean;
  className?: string;
}

const NEXT_STEP: Record<
  Exclude<KYCLevel, "business">,
  { label: string; description: string; icon: React.ElementType; color: string; bgColor: string }
> = {
  none: {
    label: "Basic",
    description: "ยืนยันเบอร์โทรเพื่อเริ่มใช้งาน",
    icon: Phone,
    color: "text-blue-600",
    bgColor: "bg-blue-50",
  },
  basic: {
    label: "Verified",
    description: "ยืนยันบัตรประชาชนเพื่อถอนเงิน",
    icon: CreditCard,
    color: "text-emerald-600",
    bgColor: "bg-emerald-50",
  },
  verified: {
    label: "Business",
    description: "อัปเกรดเพื่อถอนเงินไม่จำกัด",
    icon: Building2,
    color: "text-purple-600",
    bgColor: "bg-purple-50",
  },
};

/**
 * KYCStatusCard - Simplified: shows current level + single "next step" CTA
 */
export function KYCStatusCard({
  userType = "seller",
  compact = false,
  className = "",
}: KYCStatusCardProps) {
  const { user } = useAuthStore();

  const currentLevel: KYCLevel =
    userType === "seller"
      ? user?.seller?.kyc?.level || "none"
      : user?.worker?.kyc?.level || "none";

  const verificationUrl =
    userType === "seller"
      ? "/seller/settings/verification"
      : "/work/settings/verification";

  // If user is at max level, don't show the card
  if (currentLevel === "business") return null;

  const next = NEXT_STEP[currentLevel];
  const NextIcon = next.icon;

  return (
    <Card
      className={`border-2 border-amber-200 bg-gradient-to-br from-amber-50/80 to-orange-50/50 overflow-hidden ${className}`}
      padding={compact ? "md" : "lg"}
    >
      <div className="flex items-center gap-3 mb-3">
        <div className="p-2 rounded-xl bg-amber-100">
          <Shield className="w-5 h-5 text-amber-600" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <h3 className="font-bold text-brand-text-dark text-sm">
              ยืนยันตัวตน
            </h3>
            <Badge
              variant={currentLevel === "none" ? "warning" : "info"}
              size="sm"
            >
              {currentLevel === "none"
                ? "ยังไม่ยืนยัน"
                : getKYCLevelLabel(currentLevel)}
            </Badge>
          </div>
        </div>
      </div>

      {/* Next step preview */}
      {!compact && (
        <div className="flex items-center gap-3 p-3 rounded-xl bg-white/70 mb-3">
          <div className={`p-2 rounded-lg ${next.bgColor}`}>
            <NextIcon className={`w-5 h-5 ${next.color}`} />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-brand-text-dark">
              ถัดไป: {next.label}
            </p>
            <p className="text-xs text-brand-text-light">{next.description}</p>
          </div>
        </div>
      )}

      {compact && (
        <p className="text-xs text-brand-text-light mb-3">
          {next.description}
        </p>
      )}

      <Link href={verificationUrl} className="block">
        <Button
          className="w-full shadow-lg shadow-amber-200/50"
          size={compact ? "sm" : "md"}
        >
          <Sparkles className="w-4 h-4 mr-1.5" />
          {currentLevel === "none" ? "เริ่มยืนยันตัวตน" : `อัปเกรดเป็น ${next.label}`}
          <ChevronRight className="w-4 h-4 ml-1" />
        </Button>
      </Link>
    </Card>
  );
}

export default KYCStatusCard;
