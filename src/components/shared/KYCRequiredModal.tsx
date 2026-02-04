"use client";

import { Modal, Button, Badge } from "@/components/ui";
import { 
  Shield, 
  Phone, 
  Mail, 
  CheckCircle, 
  AlertTriangle,
  ArrowRight,
  CreditCard,
  Building2
} from "lucide-react";
import Link from "next/link";
import type { KYCLevel } from "@/types";

export interface KYCRequiredModalProps {
  isOpen: boolean;
  onClose: () => void;
  onStartKYC?: () => void;
  requiredLevel?: KYCLevel;
  currentLevel?: KYCLevel;
  action?: "topup" | "withdraw" | "general";
  userType?: "seller" | "worker";
}

const levelInfo: Record<KYCLevel, { label: string; icon: React.ReactNode; color: string }> = {
  none: { label: "ยังไม่ยืนยัน", icon: <AlertTriangle className="w-5 h-5" />, color: "text-gray-500" },
  basic: { label: "Basic", icon: <Phone className="w-5 h-5" />, color: "text-blue-600" },
  verified: { label: "Verified", icon: <CreditCard className="w-5 h-5" />, color: "text-emerald-600" },
  business: { label: "Business", icon: <Building2 className="w-5 h-5" />, color: "text-purple-600" },
};

const levelRequirements: Record<KYCLevel, string[]> = {
  none: [],
  basic: ["ยืนยันเบอร์โทรผ่าน OTP"],
  verified: ["ยืนยันเบอร์โทรผ่าน OTP", "อัปโหลดบัตรประชาชน", "ถ่าย Selfie คู่บัตร"],
  business: ["ผ่าน Verified แล้ว", "หนังสือรับรองบริษัท", "เลขประจำตัวผู้เสียภาษี"],
};

export function KYCRequiredModal({
  isOpen,
  onClose,
  onStartKYC,
  requiredLevel = "basic",
  currentLevel = "none",
  action = "general",
  userType = "seller",
}: KYCRequiredModalProps) {
  const actionText = {
    topup: "เติมเงิน",
    withdraw: "ถอนเงิน",
    general: "ดำเนินการต่อ",
  };

  const handleStartKYC = () => {
    if (onStartKYC) {
      onStartKYC();
    }
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title=""
      size="md"
    >
      <div className="text-center">
        {/* Icon */}
        <div className="w-20 h-20 rounded-full bg-amber-100 flex items-center justify-center mx-auto mb-4">
          <Shield className="w-10 h-10 text-amber-600" />
        </div>

        {/* Title */}
        <h2 className="text-xl font-bold text-brand-text-dark mb-2">
          ต้องยืนยันตัวตนก่อน
        </h2>
        <p className="text-sm text-brand-text-light mb-6">
          เพื่อความปลอดภัยของคุณ กรุณายืนยันตัวตนก่อน{actionText[action]}
        </p>

        {/* Current Level */}
        <div className="flex items-center justify-center gap-2 mb-6">
          <span className="text-sm text-brand-text-light">ระดับปัจจุบัน:</span>
          <Badge variant={currentLevel === "none" ? "secondary" : "info"}>
            {levelInfo[currentLevel].label}
          </Badge>
          <ArrowRight className="w-4 h-4 text-brand-text-light" />
          <Badge variant="warning">
            ต้องการ {levelInfo[requiredLevel].label}
          </Badge>
        </div>

        {/* Requirements */}
        <div className="text-left p-4 rounded-lg bg-brand-bg mb-6">
          <p className="text-sm font-medium text-brand-text-dark mb-3">
            สิ่งที่ต้องทำ:
          </p>
          <ul className="space-y-2">
            {levelRequirements[requiredLevel].map((req, idx) => (
              <li key={idx} className="flex items-center gap-2 text-sm text-brand-text-light">
                <div className="w-5 h-5 rounded-full bg-brand-primary/10 flex items-center justify-center flex-shrink-0">
                  <span className="text-xs font-medium text-brand-primary">{idx + 1}</span>
                </div>
                {req}
              </li>
            ))}
          </ul>
        </div>

        {/* Benefits */}
        {requiredLevel === "basic" && (
          <div className="text-left p-4 rounded-lg bg-blue-50 border border-blue-100 mb-6">
            <p className="text-sm font-medium text-blue-800 mb-2">
              หลังยืนยัน Basic แล้ว:
            </p>
            <ul className="text-xs text-blue-700 space-y-1">
              {action === "withdraw" && <li>• ถอนเงินได้สูงสุด ฿1,000/วัน</li>}
              {action === "topup" && <li>• เติมเงินได้ไม่จำกัด</li>}
              <li>• ใช้เวลาไม่ถึง 1 นาที</li>
            </ul>
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-3">
          <Button
            variant="outline"
            onClick={onClose}
            className="flex-1"
          >
            ภายหลัง
          </Button>
          <Button
            variant="primary"
            onClick={handleStartKYC}
            className="flex-1"
          >
            <Shield className="w-4 h-4 mr-2" />
            ยืนยันตัวตน
          </Button>
        </div>
      </div>
    </Modal>
  );
}

export default KYCRequiredModal;
