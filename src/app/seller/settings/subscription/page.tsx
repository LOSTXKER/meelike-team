"use client";

import { useState } from "react";
import Link from "next/link";
import { Card, Button, Badge } from "@/components/ui";
import { PageHeader } from "@/components/shared";
import {
  ArrowLeft,
  Crown,
  Check,
  Zap,
  Star,
  Shield,
  Users,
  TrendingUp,
  ChevronRight,
  Clock,
  HelpCircle,
  CreditCard
} from "lucide-react";

const plans = [
  {
    id: "free",
    name: "Free",
    price: 0,
    period: "ตลอดชีพ",
    description: "เริ่มต้นใช้งานฟรี",
    color: "bg-gray-100",
    features: [
      "บริการ Bot ไม่จำกัด",
      "หน้าร้านพื้นฐาน",
      "ทีมงาน 5 คน",
      "รายงานพื้นฐาน",
      "Support ทาง LINE",
    ],
    limitations: [
      "ไม่มีบริการคนจริง",
      "ค่าธรรมเนียม 5%",
      "ไม่มี API",
    ],
  },
  {
    id: "starter",
    name: "Starter",
    price: 299,
    period: "/เดือน",
    description: "สำหรับผู้เริ่มต้นธุรกิจ",
    color: "bg-blue-100",
    features: [
      "ทุกอย่างใน Free",
      "บริการคนจริง",
      "ทีมงาน 20 คน",
      "ค่าธรรมเนียม 3%",
      "Custom Domain",
      "Priority Support",
    ],
    limitations: ["ไม่มี API"],
  },
  {
    id: "pro",
    name: "Pro",
    price: 799,
    period: "/เดือน",
    description: "สำหรับธุรกิจที่เติบโต",
    color: "bg-brand-primary/20",
    popular: true,
    features: [
      "ทุกอย่างใน Starter",
      "ทีมงานไม่จำกัด",
      "ค่าธรรมเนียม 1.5%",
      "API Access",
      "รายงานขั้นสูง",
      "White-label",
      "24/7 Support",
    ],
    limitations: [],
  },
  {
    id: "enterprise",
    name: "Enterprise",
    price: null,
    period: "",
    description: "สำหรับองค์กรขนาดใหญ่",
    color: "bg-purple-100",
    features: [
      "ทุกอย่างใน Pro",
      "ค่าธรรมเนียม 0%",
      "Dedicated Support",
      "Custom Integration",
      "SLA Guarantee",
      "On-premise Option",
    ],
    limitations: [],
  },
];

const currentPlan = "pro";

export default function SubscriptionPage() {
  const [billingCycle, setBillingCycle] = useState<"monthly" | "yearly">("monthly");

  return (
    <div className="space-y-8 animate-fade-in max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link href="/seller/settings">
          <button className="p-2.5 hover:bg-white hover:shadow-sm rounded-xl transition-all border border-transparent hover:border-brand-border/50 text-brand-text-light hover:text-brand-primary">
            <ArrowLeft className="w-5 h-5" />
          </button>
        </Link>
        <PageHeader
          title="Subscription"
          description="จัดการแพ็คเกจและการสมัครสมาชิก"
          icon={Crown}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: Current Plan & History */}
        <div className="lg:col-span-1 space-y-6">
          {/* Current Plan Card */}
          <Card variant="elevated" className="border-none shadow-xl shadow-brand-primary/20 bg-gradient-to-br from-[#8C6A54] to-[#6D5E54] text-white relative overflow-hidden h-auto p-8">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl" />
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-black/10 rounded-full translate-y-1/2 -translate-x-1/2 blur-2xl" />
            
            <div className="relative space-y-6">
              <div className="flex items-start justify-between">
                <div>
                  <Badge className="bg-white/20 text-white border-0 backdrop-blur-md mb-3 px-3 py-1">
                    แพ็คเกจปัจจุบัน
                  </Badge>
                  <h2 className="text-4xl font-bold tracking-tight">Pro Plan</h2>
                  <p className="text-[#E8DED5] mt-1 text-sm font-medium opacity-90">
                    ฿799/เดือน • ต่ออายุอัตโนมัติ
                  </p>
                </div>
                <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center backdrop-blur-md border border-white/10">
                   <Crown className="w-6 h-6 text-white" />
                </div>
              </div>

              <div className="p-4 bg-white/10 rounded-xl backdrop-blur-md border border-white/5 space-y-3">
                 <div className="flex justify-between text-sm">
                    <span className="text-[#E8DED5]">หมดอายุ</span>
                    <span className="font-bold">15 ม.ค. 2568</span>
                 </div>
                 <div className="w-full h-1.5 bg-black/20 rounded-full overflow-hidden">
                    <div className="h-full bg-white w-3/4 rounded-full"></div>
                 </div>
                 <p className="text-xs text-right text-[#E8DED5]">เหลือเวลา 15 วัน</p>
              </div>

              <div className="grid grid-cols-3 gap-3 pt-2">
                <div className="bg-black/20 rounded-xl p-3 text-center backdrop-blur-sm border border-white/5">
                  <Users className="w-5 h-5 mx-auto mb-1 text-[#D4A373]" />
                  <p className="font-bold text-lg leading-none">45</p>
                  <p className="text-[10px] text-[#E8DED5] mt-1">ทีมงาน</p>
                </div>
                <div className="bg-black/20 rounded-xl p-3 text-center backdrop-blur-sm border border-white/5">
                  <Zap className="w-5 h-5 mx-auto mb-1 text-[#D4A373]" />
                  <p className="font-bold text-lg leading-none">1.5%</p>
                  <p className="text-[10px] text-[#E8DED5] mt-1">Fee</p>
                </div>
                <div className="bg-black/20 rounded-xl p-3 text-center backdrop-blur-sm border border-white/5">
                  <Shield className="w-5 h-5 mx-auto mb-1 text-[#D4A373]" />
                  <p className="font-bold text-sm leading-none pt-1">Active</p>
                  <p className="text-[10px] text-[#E8DED5] mt-1">API</p>
                </div>
              </div>
            </div>
          </Card>

          {/* Billing History */}
          <Card variant="elevated" className="border-none shadow-lg shadow-brand-primary/5 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-brand-text-dark flex items-center gap-2">
                <Clock className="w-5 h-5 text-brand-primary" />
                ประวัติการชำระเงิน
              </h3>
              <Link href="/seller/finance/history" className="text-xs text-brand-primary hover:underline">
                ดูทั้งหมด
              </Link>
            </div>
            <div className="space-y-3">
              {[
                { date: "15 ธ.ค. 67", amount: 799, status: "success" },
                { date: "15 พ.ย. 67", amount: 799, status: "success" },
                { date: "15 ต.ค. 67", amount: 799, status: "success" },
              ].map((payment, index) => (
                <div key={index} className="flex items-center justify-between p-3 rounded-xl hover:bg-brand-bg/50 transition-colors border border-transparent hover:border-brand-border/50 group cursor-pointer">
                   <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-brand-success/10 flex items-center justify-center text-brand-success">
                         <Check className="w-4 h-4" />
                      </div>
                      <div>
                         <p className="text-sm font-bold text-brand-text-dark">Pro Plan</p>
                         <p className="text-xs text-brand-text-light">{payment.date}</p>
                      </div>
                   </div>
                   <span className="font-bold text-brand-text-dark">฿{payment.amount}</span>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Right Column: Plans & FAQ */}
        <div className="lg:col-span-2 space-y-8">
           {/* Billing Cycle */}
           <div className="flex flex-col items-center justify-center space-y-4">
              <h2 className="text-2xl font-bold text-brand-text-dark text-center">อัพเกรดแพ็คเกจของคุณ</h2>
              <div className="inline-flex p-1 bg-brand-bg rounded-xl border border-brand-border/50">
                <button
                  onClick={() => setBillingCycle("monthly")}
                  className={`px-6 py-2.5 rounded-lg text-sm font-medium transition-all ${
                    billingCycle === "monthly"
                      ? "bg-white text-brand-primary shadow-sm ring-1 ring-black/5"
                      : "text-brand-text-light hover:text-brand-text-dark"
                  }`}
                >
                  รายเดือน
                </button>
                <button
                  onClick={() => setBillingCycle("yearly")}
                  className={`px-6 py-2.5 rounded-lg text-sm font-medium transition-all flex items-center gap-2 ${
                    billingCycle === "yearly"
                      ? "bg-white text-brand-primary shadow-sm ring-1 ring-black/5"
                      : "text-brand-text-light hover:text-brand-text-dark"
                  }`}
                >
                  รายปี
                  <span className="bg-brand-success/10 text-brand-success text-[10px] px-1.5 py-0.5 rounded font-bold">-20%</span>
                </button>
              </div>
           </div>

           {/* Plans Grid */}
           <div className="grid md:grid-cols-2 gap-4">
              {plans.map((plan) => {
                const isCurrent = plan.id === currentPlan;
                const yearlyPrice = plan.price ? Math.round(plan.price * 12 * 0.8) : null;
                const displayPrice = billingCycle === "yearly" && yearlyPrice ? yearlyPrice : plan.price;
                const isPopular = plan.popular;

                return (
                  <Card
                    key={plan.id}
                    variant="elevated"
                    className={`relative overflow-hidden transition-all duration-300 hover:-translate-y-1 ${
                      isPopular 
                        ? "border-2 border-brand-primary shadow-xl shadow-brand-primary/10" 
                        : "border border-brand-border/50 shadow-lg shadow-brand-primary/5"
                    }`}
                  >
                    {isPopular && (
                      <div className="absolute top-0 right-0 bg-brand-primary text-white text-xs font-bold px-3 py-1 rounded-bl-xl shadow-sm">
                        ขายดี
                      </div>
                    )}
                    
                    <div className="p-6 border-b border-brand-border/30 bg-brand-bg/20">
                       <h3 className="text-lg font-bold text-brand-text-dark mb-1">{plan.name}</h3>
                       <p className="text-sm text-brand-text-light min-h-[40px]">{plan.description}</p>
                       <div className="mt-4 flex items-baseline gap-1">
                          {displayPrice !== null ? (
                            <>
                              <span className="text-3xl font-bold text-brand-text-dark">฿{displayPrice.toLocaleString()}</span>
                              <span className="text-brand-text-light text-sm">{billingCycle === "yearly" ? "/ปี" : plan.period}</span>
                            </>
                          ) : (
                            <span className="text-2xl font-bold text-brand-text-dark">ติดต่อเรา</span>
                          )}
                       </div>
                    </div>
                    
                    <div className="p-6 space-y-6">
                       <ul className="space-y-3">
                          {plan.features.map((feature, idx) => (
                             <li key={idx} className="flex items-start gap-3 text-sm text-brand-text-dark">
                                <div className="w-5 h-5 rounded-full bg-brand-success/10 flex items-center justify-center text-brand-success shrink-0 mt-0.5">
                                   <Check className="w-3 h-3" />
                                </div>
                                {feature}
                             </li>
                          ))}
                          {plan.limitations.map((limit, idx) => (
                             <li key={idx} className="flex items-start gap-3 text-sm text-brand-text-light opacity-60">
                                <div className="w-5 h-5 rounded-full bg-gray-100 flex items-center justify-center text-gray-400 shrink-0 mt-0.5">
                                   <span className="text-xs font-bold">-</span>
                                </div>
                                {limit}
                             </li>
                          ))}
                       </ul>
                       
                       <Button 
                          className={`w-full py-6 text-base rounded-xl ${
                             isCurrent 
                                ? "bg-brand-bg text-brand-text-light border-brand-border hover:bg-brand-bg cursor-default"
                                : isPopular
                                ? "bg-brand-primary text-white shadow-lg shadow-brand-primary/20 hover:bg-brand-primary-dark"
                                : "bg-white text-brand-primary border-brand-primary/20 hover:bg-brand-primary/5"
                          }`}
                          variant={isCurrent ? "outline" : isPopular ? "default" : "outline"}
                       >
                          {isCurrent ? "ใช้งานอยู่" : plan.price === null ? "ติดต่อฝ่ายขาย" : "เลือกแพ็คเกจนี้"}
                       </Button>
                    </div>
                  </Card>
                );
              })}
           </div>

           {/* FAQ */}
           <Card variant="elevated" className="border-none shadow-lg shadow-brand-primary/5 p-6 sm:p-8">
              <h3 className="font-bold text-lg text-brand-text-dark mb-6 flex items-center gap-2">
                 <HelpCircle className="w-5 h-5 text-brand-info" />
                 คำถามที่พบบ่อย
              </h3>
              <div className="grid md:grid-cols-2 gap-6">
                 {[
                    { q: "ยกเลิกได้ไหม?", a: "ยกเลิกได้ตลอดเวลา โดยสิทธิ์การใช้งานจะคงอยู่จนครบรอบบิลปัจจุบัน" },
                    { q: "เปลี่ยนแพ็คเกจระหว่างเดือน?", a: "ระบบจะคำนวณส่วนต่างและปรับยอดให้ทันทีตามวันที่เหลืออยู่" },
                    { q: "ชำระเงินยังไง?", a: "รองรับทั้งบัตรเครดิต, โอนเงินผ่านธนาคาร และ QR PromptPay" },
                    { q: "ต้องการใบกำกับภาษี?", a: "สามารถขอใบกำกับภาษีได้ในหน้าประวัติการชำระเงิน" }
                 ].map((faq, idx) => (
                    <div key={idx} className="bg-brand-bg/30 p-4 rounded-xl border border-brand-border/30">
                       <p className="font-bold text-brand-text-dark text-sm mb-2">{faq.q}</p>
                       <p className="text-sm text-brand-text-light leading-relaxed">{faq.a}</p>
                    </div>
                 ))}
              </div>
           </Card>
        </div>
      </div>
    </div>
  );
}


