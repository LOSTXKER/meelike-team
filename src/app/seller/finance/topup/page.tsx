"use client";

import { useState } from "react";
import Link from "next/link";
import { Card, Button, Input, Badge } from "@/components/ui";
import { PageHeader } from "@/components/shared";
import { useAuthStore } from "@/lib/store";
import {
  ArrowLeft,
  Wallet,
  QrCode,
  Building2,
  Copy,
  CheckCircle2,
  Upload,
  Clock,
  DollarSign,
} from "lucide-react";

const TOPUP_AMOUNTS = [100, 300, 500, 1000, 2000, 5000];

const BANK_INFO = {
  bank: "ธนาคารกสิกรไทย",
  accountNumber: "123-4-56789-0",
  accountName: "บริษัท มีไลค์ จำกัด",
  promptpay: "080-xxx-xxxx",
};

export default function TopupPage() {
  const { user } = useAuthStore();
  const balance = user?.seller?.balance || 2450;

  const [amount, setAmount] = useState<number>(500);
  const [customAmount, setCustomAmount] = useState("");
  const [paymentMethod, setPaymentMethod] = useState<"promptpay" | "bank">("promptpay");
  const [step, setStep] = useState<"amount" | "payment" | "confirm">("amount");
  const [copied, setCopied] = useState(false);

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSubmit = () => {
    // Mock submit
    setStep("confirm");
  };

  const finalAmount = customAmount ? parseInt(customAmount) : amount;

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link href="/seller/finance">
          <button className="p-2 hover:bg-brand-bg rounded-lg transition-colors">
            <ArrowLeft className="w-5 h-5 text-brand-text-dark" />
          </button>
        </Link>
        <PageHeader
          title="เติมเงิน"
          description={`ยอดเงินปัจจุบัน: ฿${balance.toLocaleString()}`}
          icon={Wallet}
        />
      </div>

      {/* Progress Steps */}
      <div className="flex items-center gap-4">
        {[
          { key: "amount", label: "จำนวนเงิน" },
          { key: "payment", label: "ชำระเงิน" },
          { key: "confirm", label: "ยืนยัน" },
        ].map((s, index) => (
          <div key={s.key} className="flex items-center flex-1">
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                step === s.key
                  ? "bg-brand-primary text-white"
                  : ["amount", "payment", "confirm"].indexOf(step) > index
                  ? "bg-brand-success text-white"
                  : "bg-brand-bg text-brand-text-light"
              }`}
            >
              {["amount", "payment", "confirm"].indexOf(step) > index ? (
                <CheckCircle2 className="w-4 h-4" />
              ) : (
                index + 1
              )}
            </div>
            <span
              className={`ml-2 text-sm ${
                step === s.key ? "text-brand-text-dark font-medium" : "text-brand-text-light"
              }`}
            >
              {s.label}
            </span>
            {index < 2 && (
              <div
                className={`flex-1 h-0.5 mx-4 ${
                  ["amount", "payment", "confirm"].indexOf(step) > index
                    ? "bg-brand-success"
                    : "bg-brand-border"
                }`}
              />
            )}
          </div>
        ))}
      </div>

      {/* Step 1: Select Amount */}
      {step === "amount" && (
        <Card variant="bordered" padding="lg" className="space-y-6">
          <div>
            <h2 className="font-semibold text-brand-text-dark mb-4 flex items-center gap-2">
              <DollarSign className="w-5 h-5 text-brand-success" />
              เลือกจำนวนเงิน
            </h2>
            <div className="grid grid-cols-3 gap-3">
              {TOPUP_AMOUNTS.map((amt) => (
                <button
                  key={amt}
                  onClick={() => {
                    setAmount(amt);
                    setCustomAmount("");
                  }}
                  className={`p-4 rounded-xl border-2 transition-all ${
                    amount === amt && !customAmount
                      ? "border-brand-primary bg-brand-primary/5"
                      : "border-brand-border hover:border-brand-primary/50"
                  }`}
                >
                  <span className="text-lg font-bold text-brand-text-dark">
                    ฿{amt.toLocaleString()}
                  </span>
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-brand-text-dark mb-2">
              หรือระบุจำนวนเอง
            </label>
            <Input
              type="number"
              placeholder="ระบุจำนวนเงิน"
              value={customAmount}
              onChange={(e) => setCustomAmount(e.target.value)}
              leftIcon={<span className="text-brand-text-light">฿</span>}
            />
            <p className="text-xs text-brand-text-light mt-1">
              ขั้นต่ำ ฿50 - สูงสุด ฿100,000
            </p>
          </div>

          <div className="flex justify-end">
            <Button onClick={() => setStep("payment")} disabled={!finalAmount || finalAmount < 50}>
              ถัดไป
            </Button>
          </div>
        </Card>
      )}

      {/* Step 2: Payment */}
      {step === "payment" && (
        <div className="space-y-4">
          <Card variant="bordered" padding="lg">
            <div className="text-center mb-6">
              <p className="text-brand-text-light">จำนวนเงินที่ต้องชำระ</p>
              <p className="text-4xl font-bold text-brand-primary mt-1">
                ฿{finalAmount.toLocaleString()}
              </p>
            </div>

            {/* Payment Method Toggle */}
            <div className="flex rounded-lg bg-brand-bg p-1 mb-6">
              <button
                onClick={() => setPaymentMethod("promptpay")}
                className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-lg font-medium transition-all ${
                  paymentMethod === "promptpay"
                    ? "bg-brand-surface text-brand-primary shadow-sm"
                    : "text-brand-text-light hover:text-brand-text-dark"
                }`}
              >
                <QrCode className="w-4 h-4" />
                PromptPay
              </button>
              <button
                onClick={() => setPaymentMethod("bank")}
                className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-lg font-medium transition-all ${
                  paymentMethod === "bank"
                    ? "bg-brand-surface text-brand-primary shadow-sm"
                    : "text-brand-text-light hover:text-brand-text-dark"
                }`}
              >
                <Building2 className="w-4 h-4" />
                โอนเงิน
              </button>
            </div>

            {/* PromptPay */}
            {paymentMethod === "promptpay" && (
              <div className="space-y-4">
                <div className="bg-brand-bg rounded-xl p-6 text-center">
                  <div className="w-48 h-48 bg-white rounded-xl mx-auto mb-4 flex items-center justify-center border">
                    <QrCode className="w-32 h-32 text-brand-text-light" />
                  </div>
                  <p className="text-sm text-brand-text-light">
                    สแกน QR Code เพื่อชำระเงิน
                  </p>
                  <div className="mt-4 flex items-center justify-center gap-2">
                    <span className="font-mono text-brand-text-dark">
                      {BANK_INFO.promptpay}
                    </span>
                    <button
                      onClick={() => handleCopy(BANK_INFO.promptpay)}
                      className="p-1.5 hover:bg-brand-surface rounded transition-colors"
                    >
                      {copied ? (
                        <CheckCircle2 className="w-4 h-4 text-brand-success" />
                      ) : (
                        <Copy className="w-4 h-4 text-brand-text-light" />
                      )}
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Bank Transfer */}
            {paymentMethod === "bank" && (
              <div className="space-y-4">
                <div className="bg-brand-bg rounded-xl p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-brand-text-light">ธนาคาร</span>
                    <span className="font-medium text-brand-text-dark">
                      {BANK_INFO.bank}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-brand-text-light">เลขบัญชี</span>
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-medium text-brand-text-dark">
                        {BANK_INFO.accountNumber}
                      </span>
                      <button
                        onClick={() => handleCopy(BANK_INFO.accountNumber.replace(/-/g, ""))}
                        className="p-1.5 hover:bg-brand-surface rounded transition-colors"
                      >
                        {copied ? (
                          <CheckCircle2 className="w-4 h-4 text-brand-success" />
                        ) : (
                          <Copy className="w-4 h-4 text-brand-text-light" />
                        )}
                      </button>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-brand-text-light">ชื่อบัญชี</span>
                    <span className="font-medium text-brand-text-dark">
                      {BANK_INFO.accountName}
                    </span>
                  </div>
                </div>
              </div>
            )}
          </Card>

          {/* Upload Slip */}
          <Card variant="bordered" padding="lg">
            <h3 className="font-semibold text-brand-text-dark mb-4">
              📎 อัพโหลดหลักฐานการโอน
            </h3>
            <div className="border-2 border-dashed border-brand-border rounded-xl p-8 text-center hover:border-brand-primary/50 transition-colors cursor-pointer">
              <Upload className="w-10 h-10 text-brand-text-light mx-auto mb-3" />
              <p className="font-medium text-brand-text-dark">
                คลิกหรือลากไฟล์มาวาง
              </p>
              <p className="text-sm text-brand-text-light mt-1">
                PNG, JPG ขนาดไม่เกิน 5MB
              </p>
            </div>
          </Card>

          <div className="flex gap-3 justify-end">
            <Button variant="outline" onClick={() => setStep("amount")}>
              ย้อนกลับ
            </Button>
            <Button onClick={handleSubmit}>
              ยืนยันการชำระเงิน
            </Button>
          </div>
        </div>
      )}

      {/* Step 3: Confirmation */}
      {step === "confirm" && (
        <Card variant="bordered" padding="lg" className="text-center space-y-6">
          <div className="w-20 h-20 bg-brand-success/10 rounded-full flex items-center justify-center mx-auto">
            <Clock className="w-10 h-10 text-brand-success" />
          </div>
          
          <div>
            <h2 className="text-xl font-bold text-brand-text-dark">
              รอการตรวจสอบ
            </h2>
            <p className="text-brand-text-light mt-2">
              ระบบกำลังตรวจสอบหลักฐานการโอนเงิน<br />
              โดยปกติจะใช้เวลาไม่เกิน 5 นาที
            </p>
          </div>

          <div className="bg-brand-bg rounded-xl p-4 max-w-xs mx-auto">
            <div className="flex justify-between text-sm mb-2">
              <span className="text-brand-text-light">จำนวนเงิน</span>
              <span className="font-semibold text-brand-text-dark">
                ฿{finalAmount.toLocaleString()}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-brand-text-light">สถานะ</span>
              <Badge variant="warning">รอตรวจสอบ</Badge>
            </div>
          </div>

          <div className="flex justify-center gap-3">
            <Link href="/seller/finance">
              <Button variant="outline">
                กลับหน้าการเงิน
              </Button>
            </Link>
            <Link href="/seller/finance/history">
              <Button>
                ดูประวัติ
              </Button>
            </Link>
          </div>
        </Card>
      )}
    </div>
  );
}

