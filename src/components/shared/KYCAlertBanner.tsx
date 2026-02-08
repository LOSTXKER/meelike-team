"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui";
import { useAuthStore } from "@/lib/store";
import { meetsKYCRequirement, type KYCLevel } from "@/types";
import { 
  Shield, 
  X, 
  ChevronRight,
  AlertTriangle,
  Phone,
  CreditCard
} from "lucide-react";

export interface KYCAlertBannerProps {
  /** Required KYC level to hide the banner */
  requiredLevel?: KYCLevel;
  /** Type of user */
  userType?: "seller" | "worker";
  /** Custom message */
  message?: string;
  /** Show close button */
  dismissible?: boolean;
  /** Custom class name */
  className?: string;
}

/**
 * KYCAlertBanner - A prominent banner to alert users about KYC verification
 * 
 * Shows at the top of pages when user hasn't completed required KYC level.
 */
export function KYCAlertBanner({
  requiredLevel = "basic",
  userType = "seller",
  message,
  dismissible = true,
  className = "",
}: KYCAlertBannerProps) {
  const { user } = useAuthStore();
  const [isDismissed, setIsDismissed] = useState(false);

  // Get current KYC level
  const currentLevel: KYCLevel = userType === "seller" 
    ? (user?.seller?.kyc?.level || "none")
    : (user?.worker?.kyc?.level || "none");

  // Check if user meets required level
  const hasRequiredLevel = meetsKYCRequirement(currentLevel, requiredLevel);

  // Don't show if user already has required level or banner is dismissed
  if (hasRequiredLevel || isDismissed) {
    return null;
  }

  // Determine verification URL
  const verificationUrl = userType === "seller" 
    ? "/seller/settings/verification" 
    : "/work/settings/verification";

  // Default messages based on level
  const defaultMessages: Record<KYCLevel, string> = {
    none: "กรุณายืนยันตัวตนเพื่อใช้งานได้เต็มที่",
    basic: "กรุณายืนยันเบอร์โทรเพื่อเติมเงินได้",
    verified: "กรุณายืนยันบัตรประชาชนเพื่อถอนเงินได้",
    business: "อัปเกรดเป็น Business เพื่อถอนเงินไม่จำกัด",
  };

  const displayMessage = message || defaultMessages[requiredLevel];

  // Icon based on required level
  const LevelIcon = requiredLevel === "basic" ? Phone : 
                    requiredLevel === "verified" ? CreditCard : Shield;

  return (
    <div className={`relative overflow-hidden ${className}`}>
      {/* Background gradient */}
      <div className="bg-gradient-to-r from-amber-500 via-orange-500 to-amber-500 text-white">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between gap-4">
            {/* Left: Icon + Message */}
            <div className="flex items-center gap-3 flex-1 min-w-0">
              <div className="flex-shrink-0 p-2 bg-white/20 rounded-full animate-pulse">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div className="flex items-center gap-2 min-w-0">
                <LevelIcon className="w-4 h-4 flex-shrink-0 hidden sm:block" />
                <p className="text-sm font-medium truncate">
                  {displayMessage}
                </p>
              </div>
            </div>

            {/* Right: CTA Button + Close */}
            <div className="flex items-center gap-2 flex-shrink-0">
              <Link href={verificationUrl}>
                <Button
                  size="sm"
                  variant="outline"
                  className="bg-white text-amber-600 border-white hover:bg-amber-50 hover:text-amber-700 shadow-sm font-semibold"
                >
                  <Shield className="w-4 h-4 mr-1.5" />
                  <span className="hidden sm:inline">ยืนยันตัวตน</span>
                  <span className="sm:hidden">ยืนยัน</span>
                  <ChevronRight className="w-4 h-4 ml-1" />
                </Button>
              </Link>
              
              {dismissible && (
                <button
                  onClick={() => setIsDismissed(true)}
                  className="p-1.5 hover:bg-white/20 rounded-full transition-colors"
                  aria-label="ปิด"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
      
      {/* Bottom highlight line */}
      <div className="h-1 bg-gradient-to-r from-amber-400 via-orange-300 to-amber-400" />
    </div>
  );
}

export default KYCAlertBanner;
