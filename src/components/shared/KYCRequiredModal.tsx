"use client";

import { Dialog } from "@/components/ui/Dialog";
import { Button, Badge } from "@/components/ui";
import {
  Shield,
  Phone,
  CreditCard,
  Building2,
  AlertTriangle,
  ArrowRight,
  CheckCircle,
  Lock,
} from "lucide-react";
import Link from "next/link";
import type { KYCLevel, KYCAction } from "@/types";

export interface KYCRequiredModalProps {
  isOpen: boolean;
  onClose: () => void;
  onStartKYC?: () => void;
  requiredLevel?: KYCLevel;
  currentLevel?: KYCLevel;
  action?: KYCAction;
  userType?: "seller" | "worker";
}

const ACTION_TEXT: Record<KYCAction, string> = {
  topup: "เติมเงิน",
  withdraw: "ถอนเงิน",
  create_team: "สร้างทีม",
  general: "ดำเนินการต่อ",
};

const LEVEL_CONFIG: Record<KYCLevel, { label: string; icon: React.ElementType; color: string; bgColor: string }> = {
  none: { label: "ยังไม่ยืนยัน", icon: AlertTriangle, color: "text-gray-500", bgColor: "bg-gray-100" },
  basic: { label: "Basic", icon: Phone, color: "text-blue-600", bgColor: "bg-blue-50" },
  verified: { label: "Verified", icon: CreditCard, color: "text-emerald-600", bgColor: "bg-emerald-50" },
  business: { label: "Business", icon: Building2, color: "text-purple-600", bgColor: "bg-purple-50" },
};

const LEVEL_REQUIREMENTS: Record<KYCLevel, string[]> = {
  none: [],
  basic: ["ยืนยันเบอร์โทรผ่าน OTP"],
  verified: ["อัปโหลดบัตรประชาชน", "ถ่าย Selfie คู่บัตร"],
  business: ["หนังสือรับรองนิติบุคคล", "เลขประจำตัวผู้เสียภาษี"],
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
  const RequiredIcon = LEVEL_CONFIG[requiredLevel].icon;

  const handleStartKYC = () => {
    // Only call onStartKYC — do NOT call onClose here.
    // The onStartKYC handler typically navigates away or closes the modal itself.
    // Calling onClose after onStartKYC can trigger side-effects (e.g. history.back)
    // that override the navigation from onStartKYC.
    if (onStartKYC) {
      onStartKYC();
    } else {
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onClose={onClose} size="sm">
      <Dialog.Body className="pt-6 pb-2">
        <div className="flex flex-col items-center text-center">
          {/* Icon */}
          <div className="w-16 h-16 rounded-2xl bg-amber-100 flex items-center justify-center mb-4">
            <Shield className="w-8 h-8 text-amber-600" />
          </div>

          {/* What triggered the gate */}
          <h3 className="text-lg font-bold text-brand-text-dark mb-1">
            ต้องยืนยันตัวตนก่อน{ACTION_TEXT[action]}
          </h3>
          <p className="text-sm text-brand-text-light mb-5">
            ฟีเจอร์นี้ต้องการ KYC ระดับ{" "}
            <span className="font-semibold">{LEVEL_CONFIG[requiredLevel].label}</span>
          </p>

          {/* Current → Required */}
          <div className="flex items-center justify-center gap-3 mb-5 w-full px-4">
            <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-gray-50 border border-gray-200">
              <Lock className="w-4 h-4 text-gray-400" />
              <span className="text-sm text-brand-text-light">
                {LEVEL_CONFIG[currentLevel].label}
              </span>
            </div>
            <ArrowRight className="w-5 h-5 text-brand-primary shrink-0" />
            <div className={`flex items-center gap-2 px-3 py-2 rounded-lg ${LEVEL_CONFIG[requiredLevel].bgColor} border ${requiredLevel === 'basic' ? 'border-blue-200' : requiredLevel === 'verified' ? 'border-emerald-200' : 'border-purple-200'}`}>
              <RequiredIcon className={`w-4 h-4 ${LEVEL_CONFIG[requiredLevel].color}`} />
              <span className={`text-sm font-medium ${LEVEL_CONFIG[requiredLevel].color}`}>
                {LEVEL_CONFIG[requiredLevel].label}
              </span>
            </div>
          </div>

          {/* Requirements */}
          <div className="w-full text-left p-4 rounded-xl bg-brand-bg mb-4">
            <p className="text-xs font-semibold text-brand-text-light uppercase tracking-wider mb-2">
              สิ่งที่ต้องทำ
            </p>
            <ul className="space-y-2">
              {LEVEL_REQUIREMENTS[requiredLevel].map((req, idx) => (
                <li
                  key={idx}
                  className="flex items-center gap-2 text-sm text-brand-text-dark"
                >
                  <div className="w-5 h-5 rounded-full bg-brand-primary/10 flex items-center justify-center shrink-0">
                    <span className="text-xs font-medium text-brand-primary">
                      {idx + 1}
                    </span>
                  </div>
                  {req}
                </li>
              ))}
            </ul>
          </div>

          {requiredLevel === "basic" && (
            <p className="text-xs text-brand-text-light mb-2">
              ใช้เวลาไม่ถึง 1 นาที
            </p>
          )}
        </div>
      </Dialog.Body>
      <Dialog.Footer className="justify-center">
        <Button variant="outline" size="sm" onClick={onClose}>
          ภายหลัง
        </Button>
        <Button variant="primary" size="sm" onClick={handleStartKYC}>
          <Shield className="w-4 h-4 mr-1.5" />
          ยืนยันตัวตน
        </Button>
      </Dialog.Footer>
    </Dialog>
  );
}

export default KYCRequiredModal;
