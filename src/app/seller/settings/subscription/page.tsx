"use client";

import { useState } from "react";
import Link from "next/link";
import { Card, Button, Badge } from "@/components/ui";
import { PageHeader } from "@/components/shared";
import {
  Crown,
  Check,
  Zap,
  Shield,
  Users,
  TrendingUp,
  Clock,
  HelpCircle,
  X,
  Sparkles,
} from "lucide-react";
import {
  PLANS,
  PLAN_ORDER,
  RANKS,
  RANK_ORDER,
  getPlanConfig,
  getRankConfig,
  formatPlanPrice,
  formatTeamLimit,
  formatAdminLimit,
  getRankProgress,
} from "@/lib/constants/plans";
import type { SubscriptionPlan, SellerRank } from "@/types";

// Mock current seller data
const currentPlan: SubscriptionPlan = "pro";
const currentRank: SellerRank = "gold";
const rollingAvgSpend = 65000;

// Feature labels for display
const featureLabels: Record<string, string> = {
  teams: "ทีม",
  admins: "Store Admin",
  botApi: "Bot API",
  analytics: "Analytics",
  exportData: "Export Data",
  webhook: "Webhook",
  whiteLabel: "White Label",
  customDomain: "Custom Domain",
  prioritySupport: "Priority Support",
};

// Format feature value for display
function formatFeatureValue(key: string, value: unknown): string | boolean {
  if (typeof value === "boolean") return value;
  if (typeof value === "number") {
    if (value === Infinity) return "ไม่จำกัด";
    return `${value}`;
  }
  if (key === "botApi") {
    return value === "meelike_plus_external" ? "MeeLike + เจ้าอื่น" : "MeeLike เท่านั้น";
  }
  if (key === "analytics") {
    return value === "pro" ? "ขั้นสูง" : "พื้นฐาน";
  }
  return String(value);
}

export default function SubscriptionPage() {
  const [billingCycle, setBillingCycle] = useState<"monthly" | "yearly">("monthly");

  const currentPlanConfig = getPlanConfig(currentPlan);
  const currentRankConfig = getRankConfig(currentRank);
  const rankProgress = getRankProgress(rollingAvgSpend, currentRank);

  return (
    <div className="space-y-8 animate-fade-in max-w-7xl mx-auto">
      {/* Header */}
      <PageHeader
        title="Subscription"
        description="จัดการแพ็คเกจและการสมัครสมาชิก"
        icon={Crown}
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Current Plan, Seller Rank & History */}
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
                  <h2 className="text-4xl font-bold tracking-tight">
                    {currentPlanConfig.icon} {currentPlanConfig.name}
                  </h2>
                  <p className="text-[#E8DED5] mt-1 text-sm font-medium opacity-90">
                    {formatPlanPrice(currentPlan)} • ต่ออายุอัตโนมัติ
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
                  <p className="font-bold text-lg leading-none">{formatTeamLimit(currentPlan).replace(" ทีม", "")}</p>
                  <p className="text-[10px] text-[#E8DED5] mt-1">ทีม</p>
                </div>
                <div className="bg-black/20 rounded-xl p-3 text-center backdrop-blur-sm border border-white/5">
                  <Shield className="w-5 h-5 mx-auto mb-1 text-[#D4A373]" />
                  <p className="font-bold text-lg leading-none">{formatAdminLimit(currentPlan).replace(" คน", "")}</p>
                  <p className="text-[10px] text-[#E8DED5] mt-1">Admin</p>
                </div>
                <div className="bg-black/20 rounded-xl p-3 text-center backdrop-blur-sm border border-white/5">
                  <Zap className="w-5 h-5 mx-auto mb-1 text-[#D4A373]" />
                  <p className="font-bold text-sm leading-none pt-1">
                    {currentPlanConfig.features.botApi === "meelike_plus_external" ? "Full" : "Basic"}
                  </p>
                  <p className="text-[10px] text-[#E8DED5] mt-1">API</p>
                </div>
              </div>
            </div>
          </Card>

          {/* Seller Rank Card */}
          <Card variant="elevated" className="border-none shadow-lg shadow-brand-primary/5 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-brand-text-dark flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-brand-primary" />
                Seller Rank (Platform Fee)
              </h3>
            </div>

            <div className="space-y-4">
              {/* Current Rank */}
              <div 
                className="flex items-center gap-4 p-4 rounded-xl border-2"
                style={{ 
                  borderColor: currentRankConfig.color,
                  backgroundColor: `${currentRankConfig.color}10`
                }}
              >
                <div className="text-4xl">{currentRankConfig.icon}</div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-lg text-brand-text-dark">
                      {currentRankConfig.name}
                    </span>
                    <Badge 
                      className="text-white text-xs"
                      style={{ backgroundColor: currentRankConfig.color }}
                    >
                      Fee {currentRankConfig.feePercent}%
                    </Badge>
                  </div>
                  <p className="text-sm text-brand-text-light mt-1">
                    ยอดจ้างเฉลี่ย 3 เดือน: ฿{rollingAvgSpend.toLocaleString()}
                  </p>
                </div>
              </div>

              {/* Progress to Next Rank */}
              {rankProgress.nextRank && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-brand-text-light">
                      ไปสู่ {RANKS[rankProgress.nextRank].name} {RANKS[rankProgress.nextRank].icon}
                    </span>
                    <span className="font-medium text-brand-text-dark">
                      อีก ฿{rankProgress.amountNeeded.toLocaleString()}
                    </span>
                  </div>
                  <div className="w-full h-2 bg-brand-bg rounded-full overflow-hidden">
                    <div 
                      className="h-full rounded-full transition-all"
                      style={{ 
                        width: `${rankProgress.progress}%`,
                        backgroundColor: currentRankConfig.color
                      }}
                    />
                  </div>
                  <p className="text-xs text-brand-text-light">
                    ได้ลด fee เป็น {RANKS[rankProgress.nextRank].feePercent}%
                  </p>
                </div>
              )}

              {/* All Ranks Overview */}
              <div className="pt-2 space-y-2">
                <p className="text-xs font-medium text-brand-text-light uppercase tracking-wide">
                  ระดับ Rank ทั้งหมด
                </p>
                <div className="grid grid-cols-4 gap-2">
                  {RANK_ORDER.map((rank) => {
                    const config = RANKS[rank];
                    const isCurrent = rank === currentRank;
                    return (
                      <div 
                        key={rank}
                        className={`text-center p-2 rounded-lg ${
                          isCurrent 
                            ? "ring-2 ring-brand-primary bg-brand-primary/5" 
                            : "bg-brand-bg/50"
                        }`}
                      >
                        <div className="text-xl">{config.icon}</div>
                        <p className="text-xs font-medium text-brand-text-dark mt-1">
                          {config.feePercent}%
                        </p>
                      </div>
                    );
                  })}
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
              <Link href="/seller/finance" className="text-xs text-brand-primary hover:underline">
                ดูทั้งหมด
              </Link>
            </div>
            <div className="space-y-3">
              {[
                { date: "15 ธ.ค. 67", amount: 99, plan: "Pro" },
                { date: "15 พ.ย. 67", amount: 99, plan: "Pro" },
                { date: "15 ต.ค. 67", amount: 49, plan: "Basic" },
              ].map((payment, index) => (
                <div key={index} className="flex items-center justify-between p-3 rounded-xl hover:bg-brand-bg/50 transition-colors border border-transparent hover:border-brand-border/50 group cursor-pointer">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-brand-success/10 flex items-center justify-center text-brand-success">
                      <Check className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-brand-text-dark">{payment.plan} Plan</p>
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
            <h2 className="text-2xl font-bold text-brand-text-dark text-center">
              อัพเกรดแพ็คเกจของคุณ
            </h2>
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
                <span className="bg-brand-success/10 text-brand-success text-[10px] px-1.5 py-0.5 rounded font-bold">
                  -20%
                </span>
              </button>
            </div>
          </div>

          {/* Plans Grid */}
          <div className="grid md:grid-cols-2 gap-4">
            {PLAN_ORDER.map((planId) => {
              const plan = PLANS[planId];
              const isCurrent = planId === currentPlan;
              const yearlyPrice = plan.price > 0 ? Math.round(plan.price * 12 * 0.8) : 0;
              const displayPrice = billingCycle === "yearly" ? yearlyPrice : plan.price;
              const isPopular = plan.highlight;

              return (
                <Card
                  key={planId}
                  variant="elevated"
                  className={`relative overflow-hidden transition-all duration-300 hover:-translate-y-1 ${
                    isPopular
                      ? "border-2 border-brand-primary shadow-xl shadow-brand-primary/10"
                      : "border border-brand-border/50 shadow-lg shadow-brand-primary/5"
                  }`}
                >
                  {isPopular && (
                    <div className="absolute top-0 right-0 bg-brand-primary text-white text-xs font-bold px-3 py-1 rounded-bl-xl shadow-sm flex items-center gap-1">
                      <Sparkles className="w-3 h-3" />
                      คุ้มค่าที่สุด
                    </div>
                  )}

                  <div className="p-6 border-b border-brand-border/30 bg-brand-bg/20">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-2xl">{plan.icon}</span>
                      <h3 className="text-lg font-bold text-brand-text-dark">{plan.name}</h3>
                    </div>
                    <p className="text-sm text-brand-text-light min-h-[40px]">
                      {plan.description}
                    </p>
                    <div className="mt-4 flex items-baseline gap-1">
                      {displayPrice > 0 ? (
                        <>
                          <span className="text-3xl font-bold text-brand-text-dark">
                            ฿{displayPrice.toLocaleString()}
                          </span>
                          <span className="text-brand-text-light text-sm">
                            {billingCycle === "yearly" ? "/ปี" : "/เดือน"}
                          </span>
                        </>
                      ) : (
                        <span className="text-3xl font-bold text-brand-text-dark">ฟรี</span>
                      )}
                    </div>
                  </div>

                  <div className="p-6 space-y-6">
                    <ul className="space-y-3">
                      {/* Teams */}
                      <li className="flex items-start gap-3 text-sm text-brand-text-dark">
                        <div className="w-5 h-5 rounded-full bg-brand-success/10 flex items-center justify-center text-brand-success shrink-0 mt-0.5">
                          <Check className="w-3 h-3" />
                        </div>
                        {formatTeamLimit(planId)}
                      </li>
                      {/* Admins */}
                      <li className="flex items-start gap-3 text-sm text-brand-text-dark">
                        <div className="w-5 h-5 rounded-full bg-brand-success/10 flex items-center justify-center text-brand-success shrink-0 mt-0.5">
                          <Check className="w-3 h-3" />
                        </div>
                        Store Admin: {formatAdminLimit(planId)}
                      </li>
                      {/* Bot API */}
                      <li className="flex items-start gap-3 text-sm text-brand-text-dark">
                        <div className="w-5 h-5 rounded-full bg-brand-success/10 flex items-center justify-center text-brand-success shrink-0 mt-0.5">
                          <Check className="w-3 h-3" />
                        </div>
                        Bot API: {formatFeatureValue("botApi", plan.features.botApi)}
                      </li>
                      {/* Analytics */}
                      <li className="flex items-start gap-3 text-sm text-brand-text-dark">
                        <div className="w-5 h-5 rounded-full bg-brand-success/10 flex items-center justify-center text-brand-success shrink-0 mt-0.5">
                          <Check className="w-3 h-3" />
                        </div>
                        Analytics: {formatFeatureValue("analytics", plan.features.analytics)}
                      </li>
                      {/* Export Data */}
                      <li className={`flex items-start gap-3 text-sm ${
                        plan.features.exportData ? "text-brand-text-dark" : "text-brand-text-light opacity-60"
                      }`}>
                        <div className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 mt-0.5 ${
                          plan.features.exportData 
                            ? "bg-brand-success/10 text-brand-success" 
                            : "bg-gray-100 text-gray-400"
                        }`}>
                          {plan.features.exportData ? <Check className="w-3 h-3" /> : <X className="w-3 h-3" />}
                        </div>
                        Export Data
                      </li>
                      {/* Webhook */}
                      <li className={`flex items-start gap-3 text-sm ${
                        plan.features.webhook ? "text-brand-text-dark" : "text-brand-text-light opacity-60"
                      }`}>
                        <div className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 mt-0.5 ${
                          plan.features.webhook 
                            ? "bg-brand-success/10 text-brand-success" 
                            : "bg-gray-100 text-gray-400"
                        }`}>
                          {plan.features.webhook ? <Check className="w-3 h-3" /> : <X className="w-3 h-3" />}
                        </div>
                        Webhook
                      </li>
                      {/* White Label */}
                      <li className={`flex items-start gap-3 text-sm ${
                        plan.features.whiteLabel ? "text-brand-text-dark" : "text-brand-text-light opacity-60"
                      }`}>
                        <div className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 mt-0.5 ${
                          plan.features.whiteLabel 
                            ? "bg-brand-success/10 text-brand-success" 
                            : "bg-gray-100 text-gray-400"
                        }`}>
                          {plan.features.whiteLabel ? <Check className="w-3 h-3" /> : <X className="w-3 h-3" />}
                        </div>
                        White Label
                      </li>
                      {/* Custom Domain */}
                      <li className={`flex items-start gap-3 text-sm ${
                        plan.features.customDomain ? "text-brand-text-dark" : "text-brand-text-light opacity-60"
                      }`}>
                        <div className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 mt-0.5 ${
                          plan.features.customDomain 
                            ? "bg-brand-success/10 text-brand-success" 
                            : "bg-gray-100 text-gray-400"
                        }`}>
                          {plan.features.customDomain ? <Check className="w-3 h-3" /> : <X className="w-3 h-3" />}
                        </div>
                        Custom Domain
                      </li>
                      {/* Priority Support */}
                      <li className={`flex items-start gap-3 text-sm ${
                        plan.features.prioritySupport ? "text-brand-text-dark" : "text-brand-text-light opacity-60"
                      }`}>
                        <div className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 mt-0.5 ${
                          plan.features.prioritySupport 
                            ? "bg-brand-success/10 text-brand-success" 
                            : "bg-gray-100 text-gray-400"
                        }`}>
                          {plan.features.prioritySupport ? <Check className="w-3 h-3" /> : <X className="w-3 h-3" />}
                        </div>
                        Priority Support
                      </li>
                    </ul>

                    <Button
                      className={`w-full py-6 text-base rounded-xl ${
                        isCurrent
                          ? "bg-brand-bg text-brand-text-light border-brand-border hover:bg-brand-bg cursor-default"
                          : isPopular
                          ? "bg-brand-primary text-white shadow-lg shadow-brand-primary/20 hover:bg-brand-primary-dark"
                          : "bg-white text-brand-primary border-brand-primary/20 hover:bg-brand-primary/5"
                      }`}
                      variant={isCurrent ? "outline" : isPopular ? "primary" : "outline"}
                    >
                      {isCurrent ? "ใช้งานอยู่" : "เลือกแพ็คเกจนี้"}
                    </Button>
                  </div>
                </Card>
              );
            })}
          </div>

          {/* Platform Fee Notice */}
          <Card variant="elevated" className="border-none shadow-lg shadow-brand-primary/5 p-6 bg-gradient-to-r from-amber-50 to-orange-50">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-full bg-amber-100 flex items-center justify-center text-amber-600 shrink-0">
                <TrendingUp className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-bold text-brand-text-dark mb-2">
                  🎯 Platform Fee แยกจาก Subscription
                </h3>
                <p className="text-sm text-brand-text-light leading-relaxed">
                  ค่าธรรมเนียมแพลตฟอร์ม <strong>9-12%</strong> คิดจากค่าจ้าง Worker และขึ้นกับ{" "}
                  <strong>Seller Rank</strong> (ยอดจ้างเฉลี่ย 3 เดือน) ไม่เกี่ยวกับแพ็คเกจที่เลือก
                </p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {RANK_ORDER.map((rank) => (
                    <span 
                      key={rank}
                      className="inline-flex items-center gap-1 text-xs px-2 py-1 rounded-full bg-white/80"
                    >
                      {RANKS[rank].icon} {RANKS[rank].name}: {RANKS[rank].feePercent}%
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </Card>

          {/* FAQ */}
          <Card variant="elevated" className="border-none shadow-lg shadow-brand-primary/5 p-6 sm:p-8">
            <h3 className="font-bold text-lg text-brand-text-dark mb-6 flex items-center gap-2">
              <HelpCircle className="w-5 h-5 text-brand-info" />
              คำถามที่พบบ่อย
            </h3>
            <div className="grid md:grid-cols-2 gap-6">
              {[
                { q: "ยกเลิกได้ไหม?", a: "ยกเลิกได้ตลอดเวลา โดยสิทธิ์การใช้งานจะคงอยู่จนครบรอบบิลปัจจุบัน" },
                { q: "Seller Rank คำนวณยังไง?", a: "คิดจากยอดจ้าง Worker เฉลี่ย 3 เดือนล่าสุด ยิ่งจ้างเยอะ Fee ยิ่งลด!" },
                { q: "ชำระเงินยังไง?", a: "รองรับทั้งบัตรเครดิต, โอนเงินผ่านธนาคาร และ QR PromptPay" },
                { q: "เปลี่ยนแพ็คเกจระหว่างเดือน?", a: "ระบบจะคำนวณส่วนต่างและปรับยอดให้ทันทีตามวันที่เหลืออยู่" }
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
