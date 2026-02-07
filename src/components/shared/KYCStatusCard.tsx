"use client";

import Link from "next/link";
import { Card, Button, Badge } from "@/components/ui";
import { useAuthStore } from "@/lib/store";
import { 
  meetsKYCRequirement, 
  getKYCLevelLabel,
  WITHDRAWAL_LIMITS,
  type KYCLevel 
} from "@/types";
import { 
  Shield, 
  Phone, 
  CreditCard, 
  Building2,
  CheckCircle,
  Circle,
  ChevronRight,
  Wallet,
  Banknote,
  Lock
} from "lucide-react";

export interface KYCStatusCardProps {
  /** Type of user */
  userType?: "seller" | "worker";
  /** Compact mode (less details) */
  compact?: boolean;
  /** Custom class name */
  className?: string;
}

interface KYCLevelInfo {
  level: KYCLevel;
  label: string;
  description: string;
  icon: React.ReactNode;
  benefits: string[];
  color: string;
  bgColor: string;
}

const KYC_LEVELS: KYCLevelInfo[] = [
  {
    level: "basic",
    label: "Basic",
    description: "OTP เบอร์โทร",
    icon: <Phone className="w-5 h-5" />,
    benefits: ["เติมเงินได้"],
    color: "text-blue-600",
    bgColor: "bg-blue-50",
  },
  {
    level: "verified",
    label: "Verified",
    description: "บัตรประชาชน + Selfie",
    icon: <CreditCard className="w-5 h-5" />,
    benefits: ["ถอนเงินได้สูงสุด ฿10,000/วัน", "สร้างทีมได้"],
    color: "text-emerald-600",
    bgColor: "bg-emerald-50",
  },
  {
    level: "business",
    label: "Business",
    description: "หนังสือรับรองบริษัท",
    icon: <Building2 className="w-5 h-5" />,
    benefits: ["ถอนเงินไม่จำกัด"],
    color: "text-purple-600",
    bgColor: "bg-purple-50",
  },
];

/**
 * KYCStatusCard - Shows KYC verification status and benefits
 */
export function KYCStatusCard({
  userType = "seller",
  compact = false,
  className = "",
}: KYCStatusCardProps) {
  const { user } = useAuthStore();

  // Get current KYC level
  const currentLevel: KYCLevel = userType === "seller" 
    ? (user?.seller?.kyc?.level || "none")
    : (user?.worker?.kyc?.level || "none");

  // Determine verification URL
  const verificationUrl = userType === "seller" 
    ? "/seller/settings/verification" 
    : "/work/profile/verification";

  // Get level index for progress
  const levelOrder: KYCLevel[] = ["none", "basic", "verified", "business"];
  const currentIndex = levelOrder.indexOf(currentLevel);

  // If user is at max level, don't show the card
  if (currentLevel === "business") {
    return null;
  }

  return (
    <Card 
      className={`border-2 border-amber-200 bg-gradient-to-br from-amber-50/80 to-orange-50/50 overflow-hidden ${className}`}
      padding={compact ? "md" : "lg"}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-lg bg-amber-100">
            <Shield className="w-5 h-5 text-amber-600" />
          </div>
          <div>
            <h3 className="font-bold text-brand-text-dark">ยืนยันตัวตน</h3>
            {!compact && (
              <p className="text-xs text-brand-text-light">
                ระดับปัจจุบัน: <span className="font-medium">{getKYCLevelLabel(currentLevel)}</span>
              </p>
            )}
          </div>
        </div>
        <Badge 
          variant={currentLevel === "none" ? "warning" : "info"}
          className="font-semibold"
        >
          {currentLevel === "none" ? "ยังไม่ยืนยัน" : getKYCLevelLabel(currentLevel)}
        </Badge>
      </div>

      {/* Progress Indicator */}
      <div className="flex items-center gap-1 mb-4">
        {levelOrder.map((level, idx) => {
          const isCompleted = idx <= currentIndex;
          const isCurrent = idx === currentIndex;
          
          return (
            <div key={level} className="flex items-center flex-1">
              <div 
                className={`
                  w-full h-2 rounded-full transition-all
                  ${isCompleted ? "bg-amber-500" : "bg-gray-200"}
                  ${isCurrent ? "animate-pulse" : ""}
                `}
              />
            </div>
          );
        })}
      </div>

      {/* KYC Levels */}
      {!compact && (
        <div className="space-y-3 mb-4">
          {KYC_LEVELS.map((levelInfo) => {
            const isCompleted = meetsKYCRequirement(currentLevel, levelInfo.level);
            const isNext = !isCompleted && meetsKYCRequirement(currentLevel, 
              levelOrder[levelOrder.indexOf(levelInfo.level) - 1] as KYCLevel
            );
            
            return (
              <div 
                key={levelInfo.level}
                className={`
                  flex items-start gap-3 p-3 rounded-lg transition-all
                  ${isCompleted ? "bg-white/60" : isNext ? "bg-white border-2 border-amber-300" : "bg-white/40 opacity-60"}
                `}
              >
                {/* Status Icon */}
                <div className={`
                  p-2 rounded-lg flex-shrink-0
                  ${isCompleted ? levelInfo.bgColor : "bg-gray-100"}
                `}>
                  {isCompleted ? (
                    <CheckCircle className={`w-5 h-5 ${levelInfo.color}`} />
                  ) : (
                    <div className={isNext ? levelInfo.color : "text-gray-400"}>
                      {levelInfo.icon}
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className={`font-semibold ${isCompleted ? levelInfo.color : "text-brand-text-dark"}`}>
                      {levelInfo.label}
                    </span>
                    <span className="text-xs text-brand-text-light">
                      ({levelInfo.description})
                    </span>
                    {isNext && (
                      <Badge variant="warning" size="sm" className="ml-auto">
                        ถัดไป
                      </Badge>
                    )}
                  </div>
                  <ul className="mt-1 space-y-0.5">
                    {levelInfo.benefits.map((benefit, idx) => (
                      <li key={idx} className="text-xs text-brand-text-light flex items-center gap-1">
                        {isCompleted ? (
                          <CheckCircle className="w-3 h-3 text-emerald-500 flex-shrink-0" />
                        ) : (
                          <Lock className="w-3 h-3 text-gray-400 flex-shrink-0" />
                        )}
                        {benefit}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Compact Mode - Quick Summary */}
      {compact && (
        <div className="mb-4 p-3 rounded-lg bg-white/60">
          <div className="flex items-center justify-between text-sm">
            <span className="text-brand-text-light">
              {currentLevel === "none" && "ยืนยันเบอร์โทรเพื่อเติมเงิน"}
              {currentLevel === "basic" && "ยืนยันบัตรเพื่อถอนเงิน"}
              {currentLevel === "verified" && "อัปเกรดเพื่อถอนไม่จำกัด"}
            </span>
            <ChevronRight className="w-4 h-4 text-brand-text-light" />
          </div>
        </div>
      )}

      {/* CTA Button */}
      <Link href={verificationUrl} className="block">
        <Button 
          className="w-full shadow-lg shadow-amber-200/50"
          size={compact ? "md" : "lg"}
        >
          <Shield className="w-4 h-4 mr-2" />
          ยืนยันตัวตน
          <ChevronRight className="w-4 h-4 ml-1" />
        </Button>
      </Link>

      {/* Note for withdraw */}
      {userType === "worker" && currentLevel !== "verified" && (
        <p className="text-xs text-center text-amber-700 mt-3 flex items-center justify-center gap-1">
          <Banknote className="w-3 h-3" />
          ต้องยืนยันบัตรประชาชนก่อนถอนเงิน
        </p>
      )}
    </Card>
  );
}

export default KYCStatusCard;
