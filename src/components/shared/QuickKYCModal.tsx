"use client";

import { useState, useCallback } from "react";
import { Button, Input } from "@/components/ui";
import { Dialog } from "@/components/ui/Dialog";
import { OTPInput } from "./OTPInput";
import { 
  Phone, 
  CheckCircle, 
  ArrowRight,
  Shield,
  AlertCircle,
  Loader2
} from "lucide-react";
import type { KYCAction } from "@/types";

export interface QuickKYCModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  existingPhone?: string;
  action?: KYCAction;
}

type QuickKYCStep = "phone" | "otp" | "success";

// Mock OTP functions
async function sendPhoneOTP(phone: string): Promise<{ success: boolean; message: string }> {
  await new Promise((resolve) => setTimeout(resolve, 1500));
  console.log(`Sending OTP to ${phone}`);
  return { success: true, message: 'OTP sent successfully' };
}

async function verifyPhoneOTP(phone: string, code: string): Promise<{ success: boolean; message: string }> {
  await new Promise((resolve) => setTimeout(resolve, 1000));
  // Mock: accept any 6-digit code for demo
  const isValid = code.length === 6;
  return { 
    success: isValid, 
    message: isValid ? 'Verified successfully' : 'Invalid OTP code' 
  };
}

export function QuickKYCModal({
  isOpen,
  onClose,
  onSuccess,
  existingPhone = "",
  action = "general",
}: QuickKYCModalProps) {
  const [step, setStep] = useState<QuickKYCStep>("phone");
  const [phone, setPhone] = useState(existingPhone);
  const [error, setError] = useState("");
  const [otpError, setOtpError] = useState("");
  const [otpSuccess, setOtpSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const actionText: Record<KYCAction, string> = {
    topup: "เติมเงิน",
    withdraw: "ถอนเงิน",
    create_team: "สร้างทีม",
    general: "ดำเนินการ",
  };

  const validatePhone = (phoneNumber: string): boolean => {
    const phoneRegex = /^0[0-9]{9}$/;
    const cleanPhone = phoneNumber.replace(/[-\s]/g, "");
    return phoneRegex.test(cleanPhone);
  };

  const handleSendOTP = async () => {
    setError("");
    
    if (!phone) {
      setError("กรุณากรอกเบอร์โทร");
      return;
    }

    const cleanPhone = phone.replace(/[-\s]/g, "");
    if (!validatePhone(cleanPhone)) {
      setError("เบอร์โทรไม่ถูกต้อง (ตัวอย่าง: 0812345678)");
      return;
    }

    setIsLoading(true);
    const result = await sendPhoneOTP(cleanPhone);
    setIsLoading(false);

    if (result.success) {
      setStep("otp");
    } else {
      setError(result.message);
    }
  };

  const handleOTPComplete = useCallback(async (code: string) => {
    setOtpError("");
    const cleanPhone = phone.replace(/[-\s]/g, "");
    const result = await verifyPhoneOTP(cleanPhone, code);
    
    if (result.success) {
      setOtpSuccess(true);
      
      // Wait a moment then show success
      setTimeout(() => {
        setStep("success");
      }, 1500);
    } else {
      setOtpError("รหัส OTP ไม่ถูกต้อง กรุณาลองใหม่");
    }
  }, [phone]);

  const handleResendOTP = async () => {
    setOtpError("");
    setIsLoading(true);
    const cleanPhone = phone.replace(/[-\s]/g, "");
    await sendPhoneOTP(cleanPhone);
    setIsLoading(false);
  };

  const handleSuccess = () => {
    onSuccess();
    onClose();
    // Reset state
    setStep("phone");
    setOtpSuccess(false);
    setError("");
    setOtpError("");
  };

  const handleClose = () => {
    onClose();
    // Reset state
    setStep("phone");
    setOtpSuccess(false);
    setError("");
    setOtpError("");
  };

  const handleBack = () => {
    setStep("phone");
    setOtpError("");
    setOtpSuccess(false);
  };

  return (
    <Dialog open={isOpen} onClose={handleClose}>
      <Dialog.Body>
      {/* Step 1: Enter Phone */}
      {step === "phone" && (
        <div className="text-center">
          <div className="w-16 h-16 rounded-full bg-brand-primary/10 flex items-center justify-center mx-auto mb-4">
            <Phone className="w-8 h-8 text-brand-primary" />
          </div>

          <h2 className="text-xl font-bold text-brand-text-dark mb-2">
            ยืนยันเบอร์โทร
          </h2>
          <p className="text-sm text-brand-text-light mb-6">
            กรอกเบอร์โทรเพื่อรับรหัส OTP
          </p>

          <div className="space-y-4">
            <Input
              value={phone}
              onChange={(e) => {
                setPhone(e.target.value);
                setError("");
              }}
              placeholder="0812345678"
              leftIcon={<Phone className="w-4 h-4" />}
              error={error}
            />

            <div className="p-3 rounded-lg bg-blue-50 border border-blue-100">
              <p className="text-xs text-blue-700">
                หลังยืนยันเบอร์โทรแล้ว คุณจะสามารถ{actionText[action]}ได้ทันที
              </p>
            </div>

            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={handleClose}
                className="flex-1"
              >
                ยกเลิก
              </Button>
              <Button
                variant="primary"
                onClick={handleSendOTP}
                isLoading={isLoading}
                className="flex-1"
              >
                ส่งรหัส OTP
              </Button>
            </div>
          </div>

          <p className="text-xs text-brand-text-light mt-4">
            * สำหรับ demo ใส่เบอร์โทร 10 หลักใดๆ ก็ได้
          </p>
        </div>
      )}

      {/* Step 2: Enter OTP */}
      {step === "otp" && (
        <div className="text-center">
          <button
            onClick={handleBack}
            className="absolute top-4 left-4 text-brand-text-light hover:text-brand-text-dark"
          >
            <ArrowRight className="w-5 h-5 rotate-180" />
          </button>

          <div className="w-16 h-16 rounded-full bg-brand-primary/10 flex items-center justify-center mx-auto mb-4">
            <Phone className="w-8 h-8 text-brand-primary" />
          </div>

          <h2 className="text-xl font-bold text-brand-text-dark mb-2">
            กรอกรหัส OTP
          </h2>
          <p className="text-sm text-brand-text-light">
            รหัส 6 หลักถูกส่งไปที่
          </p>
          <p className="text-sm font-medium text-brand-text-dark mb-6">
            {phone}
          </p>

          <OTPInput
            length={6}
            onComplete={handleOTPComplete}
            onResend={handleResendOTP}
            error={otpError}
            success={otpSuccess}
            disabled={isLoading}
          />

          <p className="text-xs text-brand-text-light mt-6">
            * สำหรับ demo ใส่รหัส 6 หลักใดๆ ก็ได้
          </p>
        </div>
      )}

      {/* Step 3: Success */}
      {step === "success" && (
        <div className="text-center">
          <div className="w-20 h-20 rounded-full bg-brand-success/10 flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-10 h-10 text-brand-success" />
          </div>

          <h2 className="text-xl font-bold text-brand-text-dark mb-2">
            ยืนยันสำเร็จ!
          </h2>
          <p className="text-sm text-brand-text-light mb-6">
            คุณผ่านการยืนยันระดับ Basic แล้ว
          </p>

          {/* Verified info */}
          <div className="p-4 rounded-lg bg-brand-success/5 border border-brand-success/20 mb-6">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Shield className="w-5 h-5 text-brand-success" />
              <span className="font-semibold text-brand-text-dark">KYC Level: Basic</span>
            </div>
            <p className="text-sm text-brand-text-light">
              {action === "withdraw" && "วงเงินถอน: ฿1,000/วัน"}
              {action === "topup" && "สามารถเติมเงินได้แล้ว"}
              {action === "general" && "สามารถทำธุรกรรมได้แล้ว"}
            </p>
          </div>

          <Button
            variant="primary"
            onClick={handleSuccess}
            className="w-full"
          >
            {actionText[action]}ต่อ
          </Button>
        </div>
      )}
      </Dialog.Body>
    </Dialog>
  );
}

export default QuickKYCModal;
