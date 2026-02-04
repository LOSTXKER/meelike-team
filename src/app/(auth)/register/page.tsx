"use client";

import { useState, Suspense, useCallback } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Button, Input, Card } from "@/components/ui";
import { OTPInput } from "@/components/shared";
import { useAuthStore } from "@/lib/store";
import { 
  Mail, 
  Lock, 
  User, 
  Store, 
  Phone, 
  Sparkles, 
  ArrowLeft,
  CheckCircle,
  AlertCircle,
  PartyPopper
} from "lucide-react";

type RegistrationStep = 'info' | 'email_verify' | 'complete';

interface FormData {
  name: string;
  email: string;
  phone: string;
  password: string;
  confirmPassword: string;
  storeName: string;
  lineId: string;
}

// Mock OTP function
async function sendOTP(type: 'phone' | 'email', destination: string): Promise<{ success: boolean; message: string }> {
  await new Promise((resolve) => setTimeout(resolve, 1000));
  console.log(`Sending ${type} OTP to ${destination}`);
  return { success: true, message: 'OTP sent successfully' };
}

async function verifyOTP(type: 'phone' | 'email', destination: string, code: string): Promise<{ success: boolean; message: string }> {
  await new Promise((resolve) => setTimeout(resolve, 1000));
  // Mock: accept any 6-digit code for demo
  const isValid = code.length === 6;
  return { 
    success: isValid, 
    message: isValid ? 'Verified successfully' : 'Invalid OTP code' 
  };
}

function RegisterForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { login, isLoading } = useAuthStore();

  const [step, setStep] = useState<RegistrationStep>('info');
  const [role, setRole] = useState<"seller" | "worker">(
    (searchParams.get("role") as "seller" | "worker") || "seller"
  );
  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    storeName: "",
    lineId: "",
  });
  const [error, setError] = useState("");
  const [otpError, setOtpError] = useState("");
  const [otpSuccess, setOtpSuccess] = useState(false);
  const [isSendingOtp, setIsSendingOtp] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError("");
  };

  const validateStep1 = (): boolean => {
    if (!formData.name || !formData.email || !formData.password) {
      setError("กรุณากรอกข้อมูลให้ครบถ้วน");
      return false;
    }

    if (formData.password !== formData.confirmPassword) {
      setError("รหัสผ่านไม่ตรงกัน");
      return false;
    }

    if (formData.password.length < 6) {
      setError("รหัสผ่านต้องมีอย่างน้อย 6 ตัวอักษร");
      return false;
    }

    if (role === "seller" && !formData.storeName) {
      setError("กรุณากรอกชื่อร้าน");
      return false;
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError("รูปแบบอีเมลไม่ถูกต้อง");
      return false;
    }

    return true;
  };

  const handleNextStep = async () => {
    setError("");

    if (step === 'info') {
      if (!validateStep1()) return;
      
      // Send OTP to email only
      setIsSendingOtp(true);
      const result = await sendOTP('email', formData.email);
      setIsSendingOtp(false);
      
      if (result.success) {
        setStep('email_verify');
      } else {
        setError(result.message);
      }
    }
  };

  const handleEmailOTPComplete = useCallback(async (code: string) => {
    setOtpError("");
    const result = await verifyOTP('email', formData.email, code);
    
    if (result.success) {
      setOtpSuccess(true);
      
      setTimeout(() => {
        setStep('complete');
      }, 1500);
    } else {
      setOtpError("รหัส OTP ไม่ถูกต้อง กรุณาลองใหม่");
    }
  }, [formData.email]);

  const handleResendOTP = async () => {
    setOtpError("");
    setIsSendingOtp(true);
    await sendOTP('email', formData.email);
    setIsSendingOtp(false);
  };

  const handleCompleteRegistration = async () => {
    setError("");
    
    // Complete registration (KYC level will be 'none' - only email verified)
    const success = await login(formData.email, formData.password, role);
    if (success) {
      router.push(role === "seller" ? "/seller" : "/work");
    }
  };

  const handleBack = () => {
    setOtpError("");
    setOtpSuccess(false);
    setStep('info');
  };

  // Step Progress Indicator (only 2 steps now)
  const StepIndicator = () => (
    <div className="flex items-center justify-center gap-2 mb-6">
      {[1, 2].map((s) => {
        const currentStepNum = step === 'info' ? 1 : step === 'email_verify' ? 2 : 3;
        const isActive = s === currentStepNum;
        const isCompleted = s < currentStepNum;
        
        return (
          <div key={s} className="flex items-center">
            <div
              className={`
                w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium
                transition-all duration-300
                ${isCompleted ? "bg-brand-success text-white" : ""}
                ${isActive ? "bg-brand-primary text-white" : ""}
                ${!isActive && !isCompleted ? "bg-brand-bg text-brand-text-light" : ""}
              `}
            >
              {isCompleted ? <CheckCircle className="w-5 h-5" /> : s}
            </div>
            {s < 2 && (
              <div 
                className={`w-12 h-1 mx-1 rounded ${
                  s < currentStepNum ? "bg-brand-success" : "bg-brand-bg"
                }`}
              />
            )}
          </div>
        );
      })}
    </div>
  );

  return (
    <div className="min-h-screen bg-brand-bg flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2">
            <Sparkles className="w-10 h-10 text-brand-primary" />
            <span className="text-2xl font-bold text-brand-text-dark">
              MeeLike Seller
            </span>
          </Link>
        </div>

        <Card variant="bordered" padding="lg">
          {/* Step 1: Basic Info */}
          {step === 'info' && (
            <>
              <h1 className="text-2xl font-bold text-brand-text-dark text-center mb-2">
                สมัครสมาชิก
              </h1>
              <p className="text-center text-brand-text-light text-sm mb-6">
                กรอกข้อมูลเพื่อสร้างบัญชี
              </p>

              <StepIndicator />

              {/* Role Toggle */}
              <div className="flex rounded-lg bg-brand-bg p-1 mb-6">
                <button
                  type="button"
                  onClick={() => setRole("seller")}
                  className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg font-medium transition-all ${
                    role === "seller"
                      ? "bg-brand-surface text-brand-primary shadow-sm"
                      : "text-brand-text-light hover:text-brand-text-dark"
                  }`}
                >
                  <Store className="w-4 h-4" />
                  Seller
                </button>
                <button
                  type="button"
                  onClick={() => setRole("worker")}
                  className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg font-medium transition-all ${
                    role === "worker"
                      ? "bg-brand-surface text-brand-primary shadow-sm"
                      : "text-brand-text-light hover:text-brand-text-dark"
                  }`}
                >
                  <User className="w-4 h-4" />
                  Worker
                </button>
              </div>

              <div className="space-y-4">
                <Input
                  label="ชื่อ-นามสกุล"
                  name="name"
                  placeholder="สมชาย ใจดี"
                  value={formData.name}
                  onChange={handleChange}
                  leftIcon={<User className="w-4 h-4" />}
                />

                {role === "seller" && (
                  <Input
                    label="ชื่อร้าน"
                    name="storeName"
                    placeholder="ชื่อร้านของคุณ"
                    value={formData.storeName}
                    onChange={handleChange}
                    leftIcon={<Store className="w-4 h-4" />}
                  />
                )}

                <Input
                  label="อีเมล"
                  type="email"
                  name="email"
                  placeholder="your@email.com"
                  value={formData.email}
                  onChange={handleChange}
                  leftIcon={<Mail className="w-4 h-4" />}
                />

                <Input
                  label="เบอร์โทร (ไม่บังคับ)"
                  name="phone"
                  placeholder="0812345678"
                  value={formData.phone}
                  onChange={handleChange}
                  leftIcon={<Phone className="w-4 h-4" />}
                  hint="ใช้สำหรับการติดต่อและยืนยันตัวตนภายหลัง"
                />

                <Input
                  label="LINE ID (ไม่บังคับ)"
                  name="lineId"
                  placeholder="@yourlineid"
                  value={formData.lineId}
                  onChange={handleChange}
                />

                <Input
                  label="รหัสผ่าน"
                  type="password"
                  name="password"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={handleChange}
                  leftIcon={<Lock className="w-4 h-4" />}
                  hint="อย่างน้อย 6 ตัวอักษร"
                />

                <Input
                  label="ยืนยันรหัสผ่าน"
                  type="password"
                  name="confirmPassword"
                  placeholder="••••••••"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  leftIcon={<Lock className="w-4 h-4" />}
                />

                {error && (
                  <div className="p-3 rounded-lg bg-brand-error/10 text-brand-error text-sm flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 flex-shrink-0" />
                    {error}
                  </div>
                )}

                <Button 
                  onClick={handleNextStep} 
                  className="w-full"
                  isLoading={isSendingOtp}
                >
                  ถัดไป - ยืนยันอีเมล
                </Button>
              </div>
            </>
          )}

          {/* Step 2: Email Verification */}
          {step === 'email_verify' && (
            <>
              <button
                onClick={handleBack}
                className="flex items-center gap-1 text-brand-text-light hover:text-brand-text-dark mb-4"
              >
                <ArrowLeft className="w-4 h-4" />
                <span className="text-sm">กลับ</span>
              </button>

              <div className="text-center mb-6">
                <div className="w-16 h-16 rounded-full bg-brand-primary/10 flex items-center justify-center mx-auto mb-4">
                  <Mail className="w-8 h-8 text-brand-primary" />
                </div>
                <h2 className="text-xl font-bold text-brand-text-dark mb-2">
                  ยืนยันอีเมล
                </h2>
                <p className="text-sm text-brand-text-light">
                  กรอกรหัส OTP 6 หลักที่ส่งไปที่
                </p>
                <p className="text-sm font-medium text-brand-text-dark">
                  {formData.email}
                </p>
              </div>

              <StepIndicator />

              <OTPInput
                length={6}
                onComplete={handleEmailOTPComplete}
                onResend={handleResendOTP}
                error={otpError}
                success={otpSuccess}
                disabled={isSendingOtp}
              />

              <p className="text-xs text-brand-text-light text-center mt-6">
                * สำหรับ demo ใส่รหัส 6 หลักใดๆ ก็ได้
              </p>
            </>
          )}

          {/* Step 3: Complete */}
          {step === 'complete' && (
            <>
              <div className="text-center mb-6">
                <div className="w-20 h-20 rounded-full bg-brand-success/10 flex items-center justify-center mx-auto mb-4">
                  <PartyPopper className="w-10 h-10 text-brand-success" />
                </div>
                <h2 className="text-xl font-bold text-brand-text-dark mb-2">
                  สมัครสมาชิกสำเร็จ!
                </h2>
                <p className="text-sm text-brand-text-light">
                  ยินดีต้อนรับสู่ MeeLike
                </p>
              </div>

              {/* What's next info */}
              <div className="space-y-3 mb-6">
                <div className="flex items-center gap-3 p-3 rounded-lg bg-brand-success/5 border border-brand-success/20">
                  <CheckCircle className="w-5 h-5 text-brand-success flex-shrink-0" />
                  <div>
                    <p className="text-sm font-medium text-brand-text-dark">อีเมลยืนยันแล้ว</p>
                    <p className="text-xs text-brand-text-light">{formData.email}</p>
                  </div>
                </div>
              </div>

              {/* Info about KYC */}
              <div className="p-4 rounded-lg bg-blue-50 border border-blue-100 mb-6">
                <p className="text-sm font-medium text-blue-800 mb-1">
                  เริ่มใช้งานได้เลย!
                </p>
                <p className="text-xs text-blue-700">
                  {role === "seller" 
                    ? "คุณสามารถสร้างทีม สร้างบริการ และรับออเดอร์ได้ทันที เมื่อต้องการเติมเงินจะต้องยืนยันตัวตนเพิ่มเติม"
                    : "คุณสามารถสมัครเข้าทีมและรับงานได้ทันที เมื่อต้องการถอนเงินจะต้องยืนยันตัวตนเพิ่มเติม"
                  }
                </p>
              </div>

              <Button 
                onClick={handleCompleteRegistration} 
                className="w-full"
                isLoading={isLoading}
              >
                เริ่มใช้งาน
              </Button>
            </>
          )}

          {/* Footer - Only show on info step */}
          {step === 'info' && (
            <div className="mt-6 text-center">
              <p className="text-sm text-brand-text-light">
                มีบัญชีอยู่แล้ว?{" "}
                <Link
                  href={`/login?role=${role}`}
                  className="text-brand-primary font-medium hover:underline"
                >
                  เข้าสู่ระบบ
                </Link>
              </p>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}

export default function RegisterPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-brand-bg flex items-center justify-center">กำลังโหลด...</div>}>
      <RegisterForm />
    </Suspense>
  );
}
