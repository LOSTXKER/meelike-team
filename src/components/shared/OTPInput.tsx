"use client";

import { useState, useRef, useEffect, KeyboardEvent, ClipboardEvent } from "react";
import { Button } from "@/components/ui";
import { RefreshCw, CheckCircle, XCircle } from "lucide-react";

export interface OTPInputProps {
  length?: number;
  onComplete: (otp: string) => void;
  onResend?: () => void;
  error?: string;
  success?: boolean;
  disabled?: boolean;
  autoFocus?: boolean;
  resendCooldown?: number; // seconds
  className?: string;
}

export function OTPInput({
  length = 6,
  onComplete,
  onResend,
  error,
  success,
  disabled = false,
  autoFocus = true,
  resendCooldown = 60,
  className = "",
}: OTPInputProps) {
  const [otp, setOtp] = useState<string[]>(Array(length).fill(""));
  const [countdown, setCountdown] = useState(0);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Auto-focus first input
  useEffect(() => {
    if (autoFocus && inputRefs.current[0]) {
      inputRefs.current[0].focus();
    }
  }, [autoFocus]);

  // Countdown timer
  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  // Check if OTP is complete
  useEffect(() => {
    const otpValue = otp.join("");
    if (otpValue.length === length && !otp.includes("")) {
      onComplete(otpValue);
    }
  }, [otp, length, onComplete]);

  const handleChange = (index: number, value: string) => {
    if (disabled) return;

    // Only allow digits
    const digit = value.replace(/\D/g, "").slice(-1);
    
    const newOtp = [...otp];
    newOtp[index] = digit;
    setOtp(newOtp);

    // Move to next input if digit entered
    if (digit && index < length - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: KeyboardEvent<HTMLInputElement>) => {
    if (disabled) return;

    if (e.key === "Backspace") {
      if (!otp[index] && index > 0) {
        // Move to previous input if current is empty
        inputRefs.current[index - 1]?.focus();
        const newOtp = [...otp];
        newOtp[index - 1] = "";
        setOtp(newOtp);
      } else {
        // Clear current input
        const newOtp = [...otp];
        newOtp[index] = "";
        setOtp(newOtp);
      }
    } else if (e.key === "ArrowLeft" && index > 0) {
      inputRefs.current[index - 1]?.focus();
    } else if (e.key === "ArrowRight" && index < length - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handlePaste = (e: ClipboardEvent<HTMLInputElement>) => {
    if (disabled) return;

    e.preventDefault();
    const pastedData = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, length);
    
    if (pastedData) {
      const newOtp = [...otp];
      for (let i = 0; i < pastedData.length; i++) {
        newOtp[i] = pastedData[i];
      }
      setOtp(newOtp);

      // Focus the next empty input or the last input
      const nextEmptyIndex = newOtp.findIndex((v) => !v);
      if (nextEmptyIndex !== -1) {
        inputRefs.current[nextEmptyIndex]?.focus();
      } else {
        inputRefs.current[length - 1]?.focus();
      }
    }
  };

  const handleResend = () => {
    if (countdown > 0 || disabled) return;
    
    setOtp(Array(length).fill(""));
    setCountdown(resendCooldown);
    inputRefs.current[0]?.focus();
    onResend?.();
  };

  const getInputStyle = () => {
    if (success) return "border-brand-success bg-brand-success/5 text-brand-success";
    if (error) return "border-brand-error bg-brand-error/5 text-brand-error";
    return "border-brand-border focus:border-brand-primary";
  };

  return (
    <div className={`space-y-4 ${className}`}>
      {/* OTP Input Fields */}
      <div className="flex justify-center gap-2 sm:gap-3">
        {Array.from({ length }).map((_, index) => (
          <input
            key={index}
            ref={(el) => { inputRefs.current[index] = el; }}
            type="text"
            inputMode="numeric"
            maxLength={1}
            value={otp[index]}
            onChange={(e) => handleChange(index, e.target.value)}
            onKeyDown={(e) => handleKeyDown(index, e)}
            onPaste={handlePaste}
            disabled={disabled || success}
            className={`
              w-10 h-12 sm:w-12 sm:h-14
              text-center text-xl sm:text-2xl font-bold
              border-2 rounded-lg
              transition-all duration-200
              focus:outline-none focus:ring-2 focus:ring-brand-primary/20
              disabled:opacity-50 disabled:cursor-not-allowed
              ${getInputStyle()}
            `}
            aria-label={`OTP digit ${index + 1}`}
          />
        ))}
      </div>

      {/* Status Messages */}
      {success && (
        <div className="flex items-center justify-center gap-2 text-brand-success">
          <CheckCircle className="w-5 h-5" />
          <span className="text-sm font-medium">ยืนยันสำเร็จ</span>
        </div>
      )}

      {error && (
        <div className="flex items-center justify-center gap-2 text-brand-error">
          <XCircle className="w-5 h-5" />
          <span className="text-sm">{error}</span>
        </div>
      )}

      {/* Resend Button */}
      {onResend && !success && (
        <div className="flex flex-col items-center gap-2">
          <p className="text-sm text-brand-text-light">
            ไม่ได้รับรหัส?
          </p>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleResend}
            disabled={countdown > 0 || disabled}
            className="gap-2"
          >
            <RefreshCw className={`w-4 h-4 ${countdown > 0 ? "" : ""}`} />
            {countdown > 0 ? (
              <span>ส่งใหม่ใน {countdown} วินาที</span>
            ) : (
              <span>ส่งรหัสอีกครั้ง</span>
            )}
          </Button>
        </div>
      )}
    </div>
  );
}

// Compact version for inline use
export function OTPInputCompact({
  length = 6,
  onComplete,
  error,
  disabled = false,
  className = "",
}: Omit<OTPInputProps, "onResend" | "success" | "resendCooldown">) {
  const [otp, setOtp] = useState<string[]>(Array(length).fill(""));
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    const otpValue = otp.join("");
    if (otpValue.length === length && !otp.includes("")) {
      onComplete(otpValue);
    }
  }, [otp, length, onComplete]);

  const handleChange = (index: number, value: string) => {
    if (disabled) return;
    const digit = value.replace(/\D/g, "").slice(-1);
    const newOtp = [...otp];
    newOtp[index] = digit;
    setOtp(newOtp);
    if (digit && index < length - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: KeyboardEvent<HTMLInputElement>) => {
    if (disabled) return;
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  return (
    <div className={className}>
      <div className="flex gap-1">
        {Array.from({ length }).map((_, index) => (
          <input
            key={index}
            ref={(el) => { inputRefs.current[index] = el; }}
            type="text"
            inputMode="numeric"
            maxLength={1}
            value={otp[index]}
            onChange={(e) => handleChange(index, e.target.value)}
            onKeyDown={(e) => handleKeyDown(index, e)}
            disabled={disabled}
            className={`
              w-8 h-10 text-center text-lg font-bold
              border rounded
              focus:outline-none focus:border-brand-primary
              ${error ? "border-brand-error" : "border-brand-border"}
            `}
          />
        ))}
      </div>
      {error && (
        <p className="mt-1 text-xs text-brand-error">{error}</p>
      )}
    </div>
  );
}

export default OTPInput;
