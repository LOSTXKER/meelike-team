"use client";

import { useState } from "react";
import Link from "next/link";
import { Card, Button, Badge, Input, Modal, Progress } from "@/components/ui";
import { useAuthStore } from "@/lib/store";
import { formatCurrency, getLevelInfo } from "@/lib/utils";
import { mockWorkerStats } from "@/lib/mock-data";
import {
  ArrowLeft,
  Wallet,
  CreditCard,
  CheckCircle2,
  AlertCircle,
  Clock,
  ArrowRight,
  Building2,
  DollarSign,
  Info,
  Sparkles,
  Shield,
  Banknote,
} from "lucide-react";

export default function WithdrawPage() {
  const { user } = useAuthStore();
  const worker = user?.worker;
  const levelInfo = getLevelInfo(worker?.level || "bronze");

  const [step, setStep] = useState(1);
  const [amount, setAmount] = useState("");
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  const availableBalance = mockWorkerStats.availableBalance;
  const minWithdraw = 100;
  const withdrawFee = levelInfo.fee / 100; // Convert percentage to decimal

  const quickAmounts = [100, 200, 500, 1000];

  const bankAccount = {
    bank: "ธนาคารกสิกรไทย",
    bankCode: "KBANK",
    accountNumber: "xxx-x-xx123-4",
    accountName: "นุ่น ศรีสุข",
  };

  const calculateFee = (amt: number) => amt * withdrawFee;
  const calculateNet = (amt: number) => amt - calculateFee(amt);

  const handleWithdraw = () => {
    alert("แจ้งถอนเงินเรียบร้อย! รอการตรวจสอบภายใน 24 ชั่วโมง");
    setShowConfirmModal(false);
    setStep(3);
  };

  return (
    <div className="space-y-6 animate-fade-in max-w-2xl mx-auto pb-8">
      {/* Header */}
      <Card className="border-none shadow-lg bg-gradient-to-r from-brand-success/10 to-transparent p-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-48 h-48 bg-brand-success/5 rounded-full blur-3xl -mr-24 -mt-24" />
        <div className="relative flex items-center gap-4">
          <Link href="/work/earnings">
            <button className="p-3 hover:bg-white bg-white/60 backdrop-blur-sm border border-brand-border/50 rounded-xl transition-all shadow-sm group">
              <ArrowLeft className="w-5 h-5 text-brand-text-dark group-hover:text-brand-primary" />
            </button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-brand-text-dark flex items-center gap-2">
              <Banknote className="w-6 h-6 text-brand-success" />
              ถอนเงิน
            </h1>
            <p className="text-brand-text-light text-sm mt-0.5">แจ้งถอนเงินเข้าบัญชีธนาคาร</p>
          </div>
        </div>
      </Card>

      {/* Stepper */}
      <div className="flex items-center justify-center gap-2 py-2">
        {[
          { num: 1, label: "ระบุจำนวน" },
          { num: 2, label: "ยืนยัน" },
          { num: 3, label: "สำเร็จ" },
        ].map((s, idx) => (
          <div key={s.num} className="flex items-center gap-2">
            <div className="flex flex-col items-center">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold transition-all ${
                  step >= s.num
                    ? "bg-brand-primary text-white shadow-lg shadow-brand-primary/30"
                    : "bg-brand-bg text-brand-text-light border-2 border-brand-border"
                }`}
              >
                {step > s.num ? <CheckCircle2 className="w-5 h-5" /> : s.num}
              </div>
              <span className={`text-xs mt-1.5 font-medium ${step >= s.num ? "text-brand-primary" : "text-brand-text-light"}`}>
                {s.label}
              </span>
            </div>
            {idx < 2 && (
              <div
                className={`w-16 h-1 rounded-full -mt-5 ${
                  step > s.num ? "bg-brand-primary" : "bg-brand-border"
                }`}
              />
            )}
          </div>
        ))}
      </div>

      {/* Step 1: Amount */}
      {step === 1 && (
        <div className="space-y-6">
          {/* Balance Card */}
          <Card variant="elevated" className="border-none shadow-xl relative overflow-hidden bg-gradient-to-br from-brand-surface to-brand-bg/50">
            <div className="absolute -top-16 -right-16 w-40 h-40 bg-brand-primary/5 rounded-full blur-3xl" />
            <div className="relative">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <p className="text-sm text-brand-text-light font-medium flex items-center gap-2">
                    <Wallet className="w-4 h-4" />
                    ยอดเงินที่ถอนได้
                  </p>
                  <p className="text-4xl font-bold text-brand-text-dark mt-1">
                    {formatCurrency(availableBalance)}
                  </p>
                </div>
                <div className="p-4 bg-brand-primary/10 rounded-2xl">
                  <DollarSign className="w-8 h-8 text-brand-primary" />
                </div>
              </div>
              
              {/* Level Badge */}
              <div className="flex items-center gap-2 p-3 bg-brand-bg/50 rounded-xl border border-brand-border/30">
                <Shield className="w-5 h-5 text-brand-info" />
                <span className="text-sm text-brand-text-dark">
                  ระดับ <span className="font-bold">{levelInfo.name}</span> • ค่าธรรมเนียม <span className="font-bold text-brand-success">{levelInfo.fee}%</span>
                </span>
              </div>
            </div>
          </Card>

          {/* Amount Input Card */}
          <Card variant="elevated" className="border-none shadow-lg">
            <div className="space-y-5">
              <div>
                <label className="block text-sm font-bold text-brand-text-dark mb-3">
                  จำนวนเงินที่ต้องการถอน
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-2xl text-brand-text-light font-bold">฿</span>
                  <input
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder="0.00"
                    className="w-full pl-12 pr-4 py-5 bg-brand-bg/50 border-2 border-brand-border/50 rounded-2xl text-3xl font-bold text-brand-text-dark text-center focus:outline-none focus:ring-4 focus:ring-brand-primary/10 focus:border-brand-primary shadow-sm transition-all"
                  />
                </div>

                {/* Quick Amounts */}
                <div className="grid grid-cols-4 gap-3 mt-4">
                  {quickAmounts.map((amt) => (
                    <button
                      key={amt}
                      onClick={() => setAmount(amt.toString())}
                      disabled={amt > availableBalance}
                      className={`py-3 rounded-xl text-sm font-bold transition-all ${
                        amount === amt.toString()
                          ? "bg-brand-primary text-white shadow-lg shadow-brand-primary/30 scale-105"
                          : amt > availableBalance
                          ? "bg-brand-bg/50 text-brand-text-light/50 cursor-not-allowed"
                          : "bg-brand-bg hover:bg-brand-secondary text-brand-text-dark border border-brand-border/50 hover:border-brand-primary/30"
                      }`}
                    >
                      ฿{amt.toLocaleString()}
                    </button>
                  ))}
                </div>

                <button
                  onClick={() => setAmount(availableBalance.toString())}
                  className="w-full mt-3 py-2.5 text-sm font-bold text-brand-primary hover:text-brand-primary/80 transition-colors bg-brand-primary/5 rounded-xl hover:bg-brand-primary/10"
                >
                  <Sparkles className="w-4 h-4 inline-block mr-1.5" />
                  ถอนทั้งหมด ({formatCurrency(availableBalance)})
                </button>
              </div>

              {/* Summary */}
              {amount && Number(amount) > 0 && (
                <div className="p-5 bg-gradient-to-r from-brand-bg/80 to-brand-bg/50 rounded-2xl space-y-3 border border-brand-border/30">
                  <div className="flex justify-between text-sm">
                    <span className="text-brand-text-light">ยอดถอน</span>
                    <span className="font-bold text-brand-text-dark">{formatCurrency(Number(amount))}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-brand-text-light">ค่าธรรมเนียม ({levelInfo.fee}%)</span>
                    <span className="font-bold text-brand-error">-{formatCurrency(calculateFee(Number(amount)))}</span>
                  </div>
                  <div className="flex justify-between text-lg pt-3 border-t border-brand-border/50">
                    <span className="font-bold text-brand-text-dark">ยอดที่จะได้รับ</span>
                    <span className="font-bold text-brand-success text-xl">{formatCurrency(calculateNet(Number(amount)))}</span>
                  </div>
                </div>
              )}

              {/* Error/Warning */}
              {amount && Number(amount) < minWithdraw && (
                <div className="p-3 bg-brand-error/5 border border-brand-error/20 rounded-xl flex items-center gap-2">
                  <AlertCircle className="w-5 h-5 text-brand-error shrink-0" />
                  <p className="text-sm text-brand-error font-medium">
                    ยอดถอนขั้นต่ำ ฿{minWithdraw}
                  </p>
                </div>
              )}

              {amount && Number(amount) > availableBalance && (
                <div className="p-3 bg-brand-error/5 border border-brand-error/20 rounded-xl flex items-center gap-2">
                  <AlertCircle className="w-5 h-5 text-brand-error shrink-0" />
                  <p className="text-sm text-brand-error font-medium">
                    ยอดเงินไม่เพียงพอ
                  </p>
                </div>
              )}

              <Button
                onClick={() => setStep(2)}
                disabled={!amount || Number(amount) < minWithdraw || Number(amount) > availableBalance}
                size="lg"
                className="w-full shadow-xl shadow-brand-primary/20 py-4"
              >
                ถัดไป <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </div>
          </Card>

          {/* Info Card */}
          <Card className="bg-brand-info/5 border border-brand-info/20">
            <div className="flex items-start gap-3">
              <Info className="w-5 h-5 text-brand-info shrink-0 mt-0.5" />
              <div className="text-sm">
                <p className="font-bold text-brand-text-dark">ข้อมูลการถอนเงิน</p>
                <ul className="text-brand-text-light mt-2 space-y-1">
                  <li>• ยอดถอนขั้นต่ำ ฿{minWithdraw}</li>
                  <li>• ค่าธรรมเนียม {levelInfo.fee}% ตามระดับของคุณ</li>
                  <li>• ดำเนินการภายใน 1-2 วันทำการ</li>
                </ul>
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* Step 2: Confirm */}
      {step === 2 && (
        <div className="space-y-6">
          {/* Bank Account Card */}
          <Card variant="elevated" className="border-none shadow-lg">
            <h3 className="font-bold text-brand-text-dark mb-4 flex items-center gap-2">
              <Building2 className="w-5 h-5 text-brand-primary" />
              บัญชีรับเงิน
            </h3>
            <div className="p-5 bg-gradient-to-br from-[#1F4E3D] to-[#2D6A4F] rounded-2xl text-white relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full blur-2xl" />
              <div className="relative">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-white/80 text-sm font-medium">KASIKORNBANK</span>
                  <div className="px-3 py-1 bg-white/20 rounded-lg text-xs font-bold backdrop-blur-sm">
                    {bankAccount.bankCode}
                  </div>
                </div>
                <p className="text-2xl font-mono tracking-wider mb-4">{bankAccount.accountNumber}</p>
                <p className="text-white/90 font-medium">{bankAccount.accountName}</p>
              </div>
            </div>
            <Link href="/work/profile" className="inline-flex items-center gap-1 mt-3 text-sm text-brand-primary hover:underline font-medium">
              เปลี่ยนบัญชีธนาคาร <ArrowRight className="w-4 h-4" />
            </Link>
          </Card>

          {/* Summary Card */}
          <Card variant="elevated" className="border-none shadow-lg">
            <h3 className="font-bold text-brand-text-dark mb-4 flex items-center gap-2">
              <DollarSign className="w-5 h-5 text-brand-success" />
              สรุปการถอนเงิน
            </h3>
            <div className="p-5 bg-gradient-to-r from-brand-bg/80 to-brand-bg/50 rounded-2xl space-y-3 border border-brand-border/30">
              <div className="flex justify-between text-sm">
                <span className="text-brand-text-light">ยอดถอน</span>
                <span className="font-bold text-brand-text-dark">{formatCurrency(Number(amount))}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-brand-text-light">ค่าธรรมเนียม ({levelInfo.fee}%)</span>
                <span className="font-bold text-brand-error">-{formatCurrency(calculateFee(Number(amount)))}</span>
              </div>
              <div className="flex justify-between text-lg pt-3 border-t border-brand-border/50">
                <span className="font-bold text-brand-text-dark">ยอดที่จะได้รับ</span>
                <span className="font-bold text-brand-success text-2xl">{formatCurrency(calculateNet(Number(amount)))}</span>
              </div>
            </div>
          </Card>

          {/* Processing Time */}
          <Card className="bg-brand-warning/5 border border-brand-warning/20">
            <div className="flex items-start gap-3">
              <Clock className="w-5 h-5 text-brand-warning shrink-0 mt-0.5" />
              <div className="text-sm">
                <p className="font-bold text-brand-text-dark">ระยะเวลาดำเนินการ</p>
                <p className="text-brand-text-light mt-1">
                  ภายใน 1-2 วันทำการ (ไม่รวมวันหยุดราชการ)
                </p>
              </div>
            </div>
          </Card>

          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={() => setStep(1)}
              className="flex-1 bg-white shadow-sm"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              ย้อนกลับ
            </Button>
            <Button
              onClick={() => setShowConfirmModal(true)}
              size="lg"
              className="flex-1 shadow-xl shadow-brand-primary/20"
            >
              ยืนยันถอนเงิน
            </Button>
          </div>
        </div>
      )}

      {/* Step 3: Success */}
      {step === 3 && (
        <Card variant="elevated" className="border-none shadow-xl text-center py-10 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-brand-success/5 to-transparent" />
          <div className="relative">
            <div className="w-24 h-24 bg-brand-success/10 rounded-full flex items-center justify-center mx-auto mb-6 animate-bounce">
              <CheckCircle2 className="w-14 h-14 text-brand-success" />
            </div>
            <h2 className="text-3xl font-bold text-brand-text-dark mb-2">
              แจ้งถอนเงินสำเร็จ! 🎉
            </h2>
            <p className="text-brand-text-light mb-8 max-w-md mx-auto">
              เราได้รับคำขอถอนเงินของคุณแล้ว กรุณารอการตรวจสอบและโอนเงินภายใน 1-2 วันทำการ
            </p>

            <div className="p-6 bg-brand-bg/50 rounded-2xl max-w-sm mx-auto mb-8 border border-brand-border/30">
              <p className="text-sm text-brand-text-light">ยอดที่จะได้รับ</p>
              <p className="text-4xl font-bold text-brand-success mt-2">
                {formatCurrency(calculateNet(Number(amount)))}
              </p>
              <div className="mt-4 pt-4 border-t border-brand-border/50">
                <p className="text-xs text-brand-text-light">โอนเข้า</p>
                <p className="font-medium text-brand-text-dark">{bankAccount.bank}</p>
                <p className="text-sm text-brand-text-light">{bankAccount.accountNumber}</p>
              </div>
            </div>

            <div className="flex gap-3 justify-center">
              <Link href="/work/earnings">
                <Button variant="outline" className="bg-white shadow-sm">
                  กลับหน้ารายได้
                </Button>
              </Link>
              <Link href="/work">
                <Button className="shadow-lg shadow-brand-primary/20">
                  หน้าหลัก
                </Button>
              </Link>
            </div>
          </div>
        </Card>
      )}

      {/* Confirm Modal */}
      <Modal
        isOpen={showConfirmModal}
        onClose={() => setShowConfirmModal(false)}
        title="ยืนยันการถอนเงิน"
      >
        <div className="space-y-4">
          <div className="p-4 bg-brand-warning/5 border border-brand-warning/20 rounded-xl">
            <p className="text-sm text-brand-text-dark flex items-start gap-2">
              <AlertCircle className="w-5 h-5 text-brand-warning shrink-0 mt-0.5" />
              <span>กรุณาตรวจสอบข้อมูลให้ถูกต้องก่อนยืนยัน เมื่อยืนยันแล้วไม่สามารถยกเลิกได้</span>
            </p>
          </div>

          <div className="p-4 bg-brand-bg/50 rounded-xl space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-brand-text-light">ยอดที่จะได้รับ</span>
              <span className="font-bold text-brand-success text-lg">{formatCurrency(calculateNet(Number(amount)))}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-brand-text-light">โอนเข้า</span>
              <span className="font-medium text-brand-text-dark">{bankAccount.bank}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-brand-text-light">เลขบัญชี</span>
              <span className="font-medium text-brand-text-dark">{bankAccount.accountNumber}</span>
            </div>
          </div>

          <div className="flex gap-3 pt-2">
            <Button
              variant="outline"
              className="flex-1 bg-white"
              onClick={() => setShowConfirmModal(false)}
            >
              ยกเลิก
            </Button>
            <Button
              className="flex-1 shadow-lg shadow-brand-primary/20"
              onClick={handleWithdraw}
            >
              ยืนยันถอนเงิน
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
