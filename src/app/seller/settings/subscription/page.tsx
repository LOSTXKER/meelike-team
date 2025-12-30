"use client";

import { useState } from "react";
import Link from "next/link";
import { Card, Button, Badge } from "@/components/ui";
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
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link href="/seller/settings">
          <button className="p-2 hover:bg-brand-bg rounded-lg transition-colors">
            <ArrowLeft className="w-5 h-5 text-brand-text-dark" />
          </button>
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-brand-text-dark flex items-center gap-2">
            <Crown className="w-7 h-7 text-brand-warning" />
            Subscription
          </h1>
          <p className="text-brand-text-light">
            จัดการแพ็คเกจและการสมัครสมาชิก
          </p>
        </div>
      </div>

      {/* Current Plan */}
      <Card className="bg-gradient-to-r from-brand-primary to-brand-secondary text-white overflow-hidden relative">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2" />
        
        <div className="relative p-6">
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Badge className="bg-white/20 text-white border-0">
                  แพ็คเกจปัจจุบัน
                </Badge>
              </div>
              <h2 className="text-3xl font-bold mb-2">Pro Plan</h2>
              <p className="text-white/80">
                ฿799/เดือน • หมดอายุ 15 ม.ค. 2568
              </p>
            </div>
            <div className="text-right">
              <p className="text-white/60 text-sm">ใช้งานแล้ว</p>
              <p className="text-2xl font-bold">28 วัน</p>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4 mt-6">
            <div className="bg-white/20 rounded-xl p-3 text-center">
              <Users className="w-5 h-5 mx-auto mb-1" />
              <p className="font-semibold">45/∞</p>
              <p className="text-xs text-white/80">ทีมงาน</p>
            </div>
            <div className="bg-white/20 rounded-xl p-3 text-center">
              <Zap className="w-5 h-5 mx-auto mb-1" />
              <p className="font-semibold">1.5%</p>
              <p className="text-xs text-white/80">ค่าธรรมเนียม</p>
            </div>
            <div className="bg-white/20 rounded-xl p-3 text-center">
              <Shield className="w-5 h-5 mx-auto mb-1" />
              <p className="font-semibold">Active</p>
              <p className="text-xs text-white/80">API</p>
            </div>
          </div>
        </div>
      </Card>

      {/* Billing Cycle Toggle */}
      <div className="flex justify-center">
        <div className="inline-flex rounded-lg bg-brand-bg p-1">
          <button
            onClick={() => setBillingCycle("monthly")}
            className={`px-6 py-2 rounded-lg font-medium transition-all ${
              billingCycle === "monthly"
                ? "bg-brand-surface text-brand-primary shadow-sm"
                : "text-brand-text-light hover:text-brand-text-dark"
            }`}
          >
            รายเดือน
          </button>
          <button
            onClick={() => setBillingCycle("yearly")}
            className={`px-6 py-2 rounded-lg font-medium transition-all flex items-center gap-2 ${
              billingCycle === "yearly"
                ? "bg-brand-surface text-brand-primary shadow-sm"
                : "text-brand-text-light hover:text-brand-text-dark"
            }`}
          >
            รายปี
            <Badge variant="success" size="sm">-20%</Badge>
          </button>
        </div>
      </div>

      {/* Plans Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
        {plans.map((plan) => {
          const isCurrent = plan.id === currentPlan;
          const yearlyPrice = plan.price ? Math.round(plan.price * 12 * 0.8) : null;
          const displayPrice = billingCycle === "yearly" && yearlyPrice ? yearlyPrice : plan.price;

          return (
            <Card
              key={plan.id}
              variant="bordered"
              padding="lg"
              className={`relative ${
                plan.popular ? "border-brand-primary border-2" : ""
              } ${isCurrent ? "bg-brand-primary/5" : ""}`}
            >
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <Badge variant="default" className="bg-brand-primary text-white">
                    <Star className="w-3 h-3 mr-1" />
                    แนะนำ
                  </Badge>
                </div>
              )}

              <div className={`w-12 h-12 ${plan.color} rounded-xl flex items-center justify-center mb-4`}>
                <Crown className={`w-6 h-6 ${plan.id === "pro" ? "text-brand-primary" : "text-gray-600"}`} />
              </div>

              <h3 className="text-xl font-bold text-brand-text-dark mb-1">
                {plan.name}
              </h3>
              <p className="text-sm text-brand-text-light mb-4">
                {plan.description}
              </p>

              <div className="mb-6">
                {displayPrice !== null ? (
                  <div className="flex items-baseline gap-1">
                    <span className="text-3xl font-bold text-brand-text-dark">
                      ฿{displayPrice.toLocaleString()}
                    </span>
                    <span className="text-brand-text-light">
                      {billingCycle === "yearly" ? "/ปี" : plan.period}
                    </span>
                  </div>
                ) : (
                  <span className="text-2xl font-bold text-brand-text-dark">
                    ติดต่อเรา
                  </span>
                )}
              </div>

              <ul className="space-y-2 mb-6">
                {plan.features.map((feature, index) => (
                  <li key={index} className="flex items-start gap-2 text-sm">
                    <Check className="w-4 h-4 text-brand-success shrink-0 mt-0.5" />
                    <span className="text-brand-text-dark">{feature}</span>
                  </li>
                ))}
                {plan.limitations.map((limitation, index) => (
                  <li
                    key={index}
                    className="flex items-start gap-2 text-sm text-brand-text-light"
                  >
                    <span className="w-4 h-4 shrink-0 mt-0.5 text-center">-</span>
                    <span>{limitation}</span>
                  </li>
                ))}
              </ul>

              {isCurrent ? (
                <Button variant="outline" className="w-full" disabled>
                  แพ็คเกจปัจจุบัน
                </Button>
              ) : (
                <Button
                  variant={plan.popular ? "default" : "outline"}
                  className="w-full"
                >
                  {plan.price === null ? "ติดต่อฝ่ายขาย" : "อัพเกรด"}
                </Button>
              )}
            </Card>
          );
        })}
      </div>

      {/* Billing History */}
      <Card variant="bordered" padding="lg">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-brand-text-dark">
            📜 ประวัติการชำระเงิน
          </h3>
          <Link
            href="/seller/finance/history"
            className="text-sm text-brand-primary hover:underline flex items-center gap-1"
          >
            ดูทั้งหมด
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="space-y-3">
          {[
            { date: "15 ธ.ค. 2567", amount: 799, status: "success" },
            { date: "15 พ.ย. 2567", amount: 799, status: "success" },
            { date: "15 ต.ค. 2567", amount: 799, status: "success" },
          ].map((payment, index) => (
            <div
              key={index}
              className="flex items-center justify-between p-3 bg-brand-bg rounded-lg"
            >
              <div>
                <p className="font-medium text-brand-text-dark">
                  Pro Plan - รายเดือน
                </p>
                <p className="text-sm text-brand-text-light">{payment.date}</p>
              </div>
              <div className="text-right">
                <p className="font-semibold text-brand-text-dark">
                  ฿{payment.amount}
                </p>
                <Badge variant="success" size="sm">ชำระแล้ว</Badge>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* FAQ */}
      <Card variant="bordered" padding="lg">
        <h3 className="font-semibold text-brand-text-dark mb-4">
          ❓ คำถามที่พบบ่อย
        </h3>

        <div className="space-y-4">
          {[
            {
              q: "สามารถยกเลิก Subscription ได้หรือไม่?",
              a: "ได้ครับ คุณสามารถยกเลิกได้ทุกเมื่อ โดยจะยังใช้งานได้จนกว่าจะหมดรอบบิล",
            },
            {
              q: "อัพเกรดแพ็คเกจระหว่างเดือนได้ไหม?",
              a: "ได้ครับ ระบบจะคำนวณส่วนต่างและเรียกเก็บเพิ่มตามสัดส่วนวันที่เหลือ",
            },
            {
              q: "รองรับการชำระเงินแบบไหนบ้าง?",
              a: "รองรับ PromptPay, บัตรเครดิต/เดบิต และโอนเงินธนาคาร",
            },
          ].map((faq, index) => (
            <div key={index} className="p-4 bg-brand-bg rounded-lg">
              <p className="font-medium text-brand-text-dark mb-1">{faq.q}</p>
              <p className="text-sm text-brand-text-light">{faq.a}</p>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}


