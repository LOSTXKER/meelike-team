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
  ChevronRight,
  CreditCard,
  ShieldCheck
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
    <div className="max-w-3xl mx-auto space-y-8 animate-fade-in">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link href="/seller/finance">
          <button className="p-2.5 hover:bg-white hover:shadow-sm rounded-xl transition-all border border-transparent hover:border-brand-border/50 text-brand-text-light hover:text-brand-primary">
            <ArrowLeft className="w-5 h-5" />
          </button>
        </Link>
        <PageHeader
          title="เติมเงินเข้าระบบ"
          description={`ยอดเงินปัจจุบัน: ฿${balance.toLocaleString()}`}
          icon={Wallet}
        />
      </div>

      {/* Progress Steps */}
      <div className="bg-white p-4 rounded-2xl shadow-sm border border-brand-border/50">
        <div className="flex items-center justify-between relative px-4 sm:px-12">
           {/* Progress Bar Background */}
           <div className="absolute top-1/2 left-0 w-full h-1 bg-brand-bg -z-10" />
           
           {[
             { key: "amount", label: "ระบุจำนวน" },
             { key: "payment", label: "ชำระเงิน" },
             { key: "confirm", label: "ตรวจสอบ" },
           ].map((s, index) => {
             const isActive = step === s.key;
             const isCompleted = ["amount", "payment", "confirm"].indexOf(step) > index;
             const isPending = ["amount", "payment", "confirm"].indexOf(step) < index;

             return (
               <div key={s.key} className="flex flex-col items-center gap-2 relative bg-white px-2">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold border-4 transition-all duration-300 ${
                      isActive
                        ? "bg-brand-primary border-brand-primary/20 text-white shadow-lg shadow-brand-primary/20 scale-110"
                        : isCompleted
                        ? "bg-brand-success border-brand-success/20 text-white"
                        : "bg-brand-bg border-white text-brand-text-light"
                    }`}
                  >
                    {isCompleted ? <CheckCircle2 className="w-5 h-5" /> : index + 1}
                  </div>
                  <span
                    className={`text-xs sm:text-sm font-medium transition-colors ${
                      isActive ? "text-brand-text-dark" : "text-brand-text-light"
                    }`}
                  >
                    {s.label}
                  </span>
               </div>
             );
           })}
        </div>
      </div>

      {/* Step 1: Select Amount */}
      {step === "amount" && (
        <div className="space-y-6 animate-slide-in">
          <Card variant="elevated" className="border-none shadow-lg shadow-brand-primary/5 p-6 sm:p-8">
            <div>
              <h2 className="font-bold text-xl text-brand-text-dark mb-6 flex items-center gap-2">
                <div className="p-2 bg-brand-success/10 rounded-lg text-brand-success">
                   <DollarSign className="w-5 h-5" />
                </div>
                เลือกจำนวนเงินที่ต้องการเติม
              </h2>
              
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-8">
                {TOPUP_AMOUNTS.map((amt) => (
                  <button
                    key={amt}
                    onClick={() => {
                      setAmount(amt);
                      setCustomAmount("");
                    }}
                    className={`p-6 rounded-2xl border transition-all duration-200 flex flex-col items-center justify-center gap-2 ${
                      amount === amt && !customAmount
                        ? "border-brand-primary bg-brand-primary text-white shadow-lg shadow-brand-primary/20 scale-[1.02]"
                        : "border-brand-border/50 bg-white hover:border-brand-primary/30 hover:shadow-md text-brand-text-dark"
                    }`}
                  >
                    <span className="text-2xl font-bold">
                      ฿{amt.toLocaleString()}
                    </span>
                    {amount === amt && !customAmount && (
                      <CheckCircle2 className="w-5 h-5 opacity-50" />
                    )}
                  </button>
                ))}
              </div>

              <div className="bg-brand-bg/50 p-6 rounded-2xl border border-brand-border/50">
                <label className="block text-sm font-medium text-brand-text-dark mb-3">
                  หรือระบุจำนวนเอง (฿50 - ฿100,000)
                </label>
                <Input
                  type="number"
                  placeholder="ระบุจำนวนเงิน"
                  value={customAmount}
                  onChange={(e) => setCustomAmount(e.target.value)}
                  className="bg-white border-brand-border !text-lg !py-3 !px-4"
                  leftIcon={<span className="text-brand-text-light font-bold text-lg">฿</span>}
                />
              </div>
            </div>

            <div className="flex justify-end mt-8 pt-6 border-t border-brand-border/50">
              <Button 
                onClick={() => setStep("payment")} 
                disabled={!finalAmount || finalAmount < 50}
                className="w-full sm:w-auto px-8 py-6 text-lg shadow-lg shadow-brand-primary/20 rounded-xl"
              >
                ดำเนินการต่อ <ChevronRight className="w-5 h-5 ml-2" />
              </Button>
            </div>
          </Card>
        </div>
      )}

      {/* Step 2: Payment */}
      {step === "payment" && (
        <div className="space-y-6 animate-slide-in">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Left Column: Payment Method */}
            <div className="lg:col-span-2 space-y-6">
               <Card variant="elevated" className="border-none shadow-lg shadow-brand-primary/5 p-6">
                 <h2 className="font-bold text-xl text-brand-text-dark mb-6 flex items-center gap-2">
                    <div className="p-2 bg-brand-primary/10 rounded-lg text-brand-primary">
                       <CreditCard className="w-5 h-5" />
                    </div>
                    เลือกช่องทางชำระเงิน
                 </h2>

                 {/* Method Selection */}
                 <div className="grid grid-cols-2 gap-4 mb-8">
                    <button
                      onClick={() => setPaymentMethod("promptpay")}
                      className={`p-4 rounded-xl border transition-all flex flex-col items-center gap-3 ${
                        paymentMethod === "promptpay"
                          ? "border-brand-primary bg-brand-primary/5 ring-1 ring-brand-primary"
                          : "border-brand-border/50 bg-white hover:border-brand-primary/30"
                      }`}
                    >
                       <div className={`p-3 rounded-full ${paymentMethod === "promptpay" ? "bg-brand-primary text-white" : "bg-brand-bg text-brand-text-light"}`}>
                          <QrCode className="w-6 h-6" />
                       </div>
                       <span className={`font-bold ${paymentMethod === "promptpay" ? "text-brand-primary" : "text-brand-text-dark"}`}>PromptPay</span>
                    </button>
                    <button
                      onClick={() => setPaymentMethod("bank")}
                      className={`p-4 rounded-xl border transition-all flex flex-col items-center gap-3 ${
                        paymentMethod === "bank"
                          ? "border-brand-primary bg-brand-primary/5 ring-1 ring-brand-primary"
                          : "border-brand-border/50 bg-white hover:border-brand-primary/30"
                      }`}
                    >
                       <div className={`p-3 rounded-full ${paymentMethod === "bank" ? "bg-brand-primary text-white" : "bg-brand-bg text-brand-text-light"}`}>
                          <Building2 className="w-6 h-6" />
                       </div>
                       <span className={`font-bold ${paymentMethod === "bank" ? "text-brand-primary" : "text-brand-text-dark"}`}>โอนผ่านบัญชี</span>
                    </button>
                 </div>

                 {/* Method Details */}
                 <div className="bg-brand-bg/30 rounded-2xl p-6 border border-brand-border/50">
                    {paymentMethod === "promptpay" && (
                      <div className="flex flex-col items-center text-center space-y-4">
                        <div className="bg-white p-4 rounded-2xl shadow-sm border border-brand-border/30">
                           <QrCode className="w-40 h-40 text-brand-text-dark" />
                        </div>
                        <div>
                           <p className="text-brand-text-light text-sm mb-2">สแกน QR Code เพื่อชำระเงิน</p>
                           <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-xl border border-brand-border/30 shadow-sm">
                              <span className="font-mono text-lg font-bold text-brand-text-dark tracking-wider">{BANK_INFO.promptpay}</span>
                              <button 
                                onClick={() => handleCopy(BANK_INFO.promptpay)}
                                className="p-1.5 hover:bg-brand-bg rounded-lg transition-colors text-brand-text-light hover:text-brand-primary"
                              >
                                {copied ? <CheckCircle2 className="w-4 h-4 text-brand-success" /> : <Copy className="w-4 h-4" />}
                              </button>
                           </div>
                        </div>
                      </div>
                    )}

                    {paymentMethod === "bank" && (
                      <div className="space-y-4">
                         <div className="flex items-center gap-4 p-4 bg-white rounded-xl border border-brand-border/30 shadow-sm">
                            <div className="w-12 h-12 bg-[#00A950] rounded-full flex items-center justify-center text-white text-xs font-bold shrink-0">
                               KBANK
                            </div>
                            <div className="flex-1">
                               <p className="text-sm text-brand-text-light">ธนาคารกสิกรไทย</p>
                               <p className="font-bold text-brand-text-dark text-lg">{BANK_INFO.accountName}</p>
                            </div>
                         </div>
                         
                         <div className="flex items-center justify-between p-4 bg-white rounded-xl border border-brand-border/30 shadow-sm">
                            <div>
                               <p className="text-sm text-brand-text-light mb-1">เลขที่บัญชี</p>
                               <p className="font-mono text-xl font-bold text-brand-text-dark tracking-wide">{BANK_INFO.accountNumber}</p>
                            </div>
                            <button 
                              onClick={() => handleCopy(BANK_INFO.accountNumber.replace(/-/g, ""))}
                              className="p-2 hover:bg-brand-bg rounded-lg transition-colors text-brand-text-light hover:text-brand-primary"
                            >
                              {copied ? <CheckCircle2 className="w-5 h-5 text-brand-success" /> : <Copy className="w-5 h-5" />}
                            </button>
                         </div>
                      </div>
                    )}
                 </div>
               </Card>
               
               <Card variant="elevated" className="border-none shadow-lg shadow-brand-primary/5 p-6">
                  <h3 className="font-bold text-brand-text-dark mb-4 flex items-center gap-2">
                    <Upload className="w-5 h-5 text-brand-primary" />
                    อัพโหลดหลักฐานการโอน
                  </h3>
                  <div className="border-2 border-dashed border-brand-border rounded-2xl p-8 text-center hover:border-brand-primary/50 hover:bg-brand-primary/5 transition-all cursor-pointer group bg-brand-bg/20">
                    <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm group-hover:scale-110 transition-transform">
                       <Upload className="w-8 h-8 text-brand-text-light group-hover:text-brand-primary transition-colors" />
                    </div>
                    <p className="font-bold text-brand-text-dark">
                      คลิกเพื่ออัพโหลดรูปภาพ
                    </p>
                    <p className="text-sm text-brand-text-light mt-1">
                      หรือลากไฟล์มาวางที่นี่ (JPG, PNG ไม่เกิน 5MB)
                    </p>
                  </div>
               </Card>
            </div>
            
            {/* Right Column: Summary */}
            <div className="lg:col-span-1">
               <div className="sticky top-6">
                  <Card variant="elevated" className="border-none shadow-lg shadow-brand-primary/10 p-6 bg-brand-bg/50 backdrop-blur-sm border border-brand-border/50">
                     <h3 className="font-bold text-brand-text-dark mb-4">สรุปยอดชำระ</h3>
                     <div className="space-y-3">
                        <div className="flex justify-between text-sm">
                           <span className="text-brand-text-light">ยอดเติมเงิน</span>
                           <span className="font-medium">฿{finalAmount.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                           <span className="text-brand-text-light">ค่าธรรมเนียม</span>
                           <span className="font-medium text-brand-success">ฟรี</span>
                        </div>
                        <div className="h-px bg-brand-border my-2" />
                        <div className="flex justify-between items-end">
                           <span className="font-bold text-brand-text-dark">ยอดสุทธิ</span>
                           <span className="text-2xl font-bold text-brand-primary">฿{finalAmount.toLocaleString()}</span>
                        </div>
                     </div>
                     
                     <div className="mt-6 space-y-3">
                        <Button onClick={handleSubmit} className="w-full py-6 text-lg shadow-lg shadow-brand-primary/20 rounded-xl">
                           แจ้งชำระเงิน
                        </Button>
                        <Button variant="outline" onClick={() => setStep("amount")} className="w-full border-transparent hover:bg-white/50">
                           แก้ไขจำนวนเงิน
                        </Button>
                     </div>
                     
                     <div className="mt-6 flex items-start gap-3 p-3 bg-brand-info/10 rounded-xl">
                        <ShieldCheck className="w-5 h-5 text-brand-info shrink-0 mt-0.5" />
                        <p className="text-xs text-brand-text-light leading-relaxed">
                           การชำระเงินของคุณปลอดภัย 100% และจะได้รับการตรวจสอบภายใน 5-15 นาที
                        </p>
                     </div>
                  </Card>
               </div>
            </div>
          </div>
        </div>
      )}

      {/* Step 3: Confirmation */}
      {step === "confirm" && (
        <Card variant="elevated" className="border-none shadow-xl shadow-brand-primary/10 p-12 text-center max-w-lg mx-auto animate-fade-in relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-brand-primary via-brand-warning to-brand-primary" />
          
          <div className="w-24 h-24 bg-brand-success/10 rounded-full flex items-center justify-center mx-auto mb-6 animate-pulse-soft">
            <Clock className="w-12 h-12 text-brand-success" />
          </div>
          
          <h2 className="text-2xl font-bold text-brand-text-dark mb-2">
            กำลังตรวจสอบยอดเงิน
          </h2>
          <p className="text-brand-text-light mb-8 leading-relaxed">
            ระบบได้รับข้อมูลการแจ้งโอนแล้ว<br />
            เจ้าหน้าที่จะทำการตรวจสอบและปรับยอดเงินให้คุณ<br />
            ภายในเวลา <span className="text-brand-primary font-bold">5-15 นาที</span>
          </p>

          <div className="bg-brand-bg/50 rounded-2xl p-6 mb-8 border border-brand-border/50">
            <div className="flex justify-between text-sm mb-3">
              <span className="text-brand-text-light">จำนวนเงิน</span>
              <span className="font-bold text-brand-text-dark text-lg">
                ฿{finalAmount.toLocaleString()}
              </span>
            </div>
            <div className="flex justify-between text-sm items-center">
              <span className="text-brand-text-light">สถานะ</span>
              <Badge variant="warning" className="px-3 py-1">รอตรวจสอบ</Badge>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/seller/finance">
              <Button variant="outline" className="w-full sm:w-auto">
                กลับหน้าการเงิน
              </Button>
            </Link>
            <Link href="/seller/finance/history">
              <Button className="w-full sm:w-auto shadow-lg shadow-brand-primary/20">
                ดูประวัติธุรกรรม
              </Button>
            </Link>
          </div>
        </Card>
      )}
    </div>
  );
}

