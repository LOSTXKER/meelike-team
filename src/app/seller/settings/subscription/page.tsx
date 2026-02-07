"use client";

import { useState } from "react";
import { Card, Button, Badge } from "@/components/ui";
import {
  Crown,
  Check,
  ArrowRight,
  Zap,
  Shield,
  Users,
  Sparkles,
  CreditCard,
  HelpCircle,
  Calendar,
  Globe,
  BarChart3,
  Download,
  Webhook,
  Palette,
  Headphones,
} from "lucide-react";
import {
  PLANS,
  PLAN_ORDER,
  getPlanConfig,
  formatPlanPrice,
  formatTeamLimit,
  formatAdminLimit,
} from "@/lib/constants/plans";
import type { SubscriptionPlan } from "@/types";

// Mock current seller data
const currentPlan: SubscriptionPlan = "pro";

// Feature comparison rows for the table
const FEATURE_ROWS: {
  label: string;
  icon: React.ElementType;
  getValue: (plan: SubscriptionPlan) => string | boolean;
}[] = [
  {
    label: "จำนวนทีม",
    icon: Users,
    getValue: (p) => formatTeamLimit(p),
  },
  {
    label: "จำนวน Admin",
    icon: Shield,
    getValue: (p) => formatAdminLimit(p),
  },
  {
    label: "Bot API",
    icon: Zap,
    getValue: (p) =>
      PLANS[p].features.botApi === "meelike_plus_external"
        ? "MeeLike + เจ้าอื่น"
        : "MeeLike",
  },
  {
    label: "Analytics",
    icon: BarChart3,
    getValue: (p) =>
      PLANS[p].features.analytics === "pro" ? "Pro" : "พื้นฐาน",
  },
  {
    label: "Export ข้อมูล",
    icon: Download,
    getValue: (p) => PLANS[p].features.exportData,
  },
  {
    label: "Webhook",
    icon: Webhook,
    getValue: (p) => PLANS[p].features.webhook,
  },
  {
    label: "White Label",
    icon: Palette,
    getValue: (p) => PLANS[p].features.whiteLabel,
  },
  {
    label: "Custom Domain",
    icon: Globe,
    getValue: (p) => PLANS[p].features.customDomain,
  },
  {
    label: "Priority Support",
    icon: Headphones,
    getValue: (p) => PLANS[p].features.prioritySupport,
  },
];

export default function SubscriptionPage() {
  const [billingCycle, setBillingCycle] = useState<"monthly" | "yearly">(
    "monthly"
  );
  const currentPlanConfig = getPlanConfig(currentPlan);
  const currentPlanIndex = PLAN_ORDER.indexOf(currentPlan);

  const getPrice = (planId: SubscriptionPlan) => {
    const plan = PLANS[planId];
    if (plan.price === 0) return 0;
    return billingCycle === "yearly"
      ? Math.round(plan.price * 12 * 0.8)
      : plan.price;
  };

  const getMonthlyEquivalent = (planId: SubscriptionPlan) => {
    const plan = PLANS[planId];
    if (plan.price === 0) return 0;
    return billingCycle === "yearly"
      ? Math.round(plan.price * 0.8)
      : plan.price;
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* ===== Current Plan Status ===== */}
      <Card className="border-none shadow-md overflow-hidden">
        <div className="p-5 sm:p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 bg-amber-100 rounded-xl flex items-center justify-center">
                <Crown className="w-5 h-5 text-amber-600" />
              </div>
              <div>
                <p className="text-xs font-medium text-brand-text-light">
                  แพ็คเกจปัจจุบัน
                </p>
                <p className="text-lg font-bold text-brand-text-dark">
                  {currentPlanConfig.icon} {currentPlanConfig.name}
                </p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-lg font-bold text-brand-text-dark">
                {formatPlanPrice(currentPlan)}
              </p>
              <p className="text-xs text-brand-text-light">ต่ออายุอัตโนมัติ</p>
            </div>
          </div>

          {/* Expiry bar */}
          <div className="p-3 bg-brand-bg rounded-xl">
            <div className="flex justify-between text-xs mb-1.5">
              <span className="text-brand-text-light flex items-center gap-1">
                <Calendar className="w-3 h-3" />
                รอบบิลถัดไป
              </span>
              <span className="font-semibold text-brand-text-dark">
                15 ม.ค. 2568
              </span>
            </div>
            <div className="w-full h-1.5 bg-brand-border/30 rounded-full overflow-hidden">
              <div className="h-full bg-brand-primary w-3/4 rounded-full transition-all" />
            </div>
            <p className="text-[10px] text-right text-brand-text-light mt-1">
              เหลือ 15 วัน
            </p>
          </div>
        </div>
      </Card>

      {/* ===== Billing Cycle Toggle ===== */}
      <div className="flex justify-center">
        <div className="inline-flex p-1 bg-brand-bg rounded-xl border border-brand-border/50">
          <button
            onClick={() => setBillingCycle("monthly")}
            className={`px-5 py-2 rounded-lg text-sm font-medium transition-all ${
              billingCycle === "monthly"
                ? "bg-white text-brand-primary shadow-sm"
                : "text-brand-text-light hover:text-brand-text-dark"
            }`}
          >
            รายเดือน
          </button>
          <button
            onClick={() => setBillingCycle("yearly")}
            className={`px-5 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-2 ${
              billingCycle === "yearly"
                ? "bg-white text-brand-primary shadow-sm"
                : "text-brand-text-light hover:text-brand-text-dark"
            }`}
          >
            รายปี
            <span className="bg-emerald-100 text-emerald-700 text-[10px] px-1.5 py-0.5 rounded-md font-bold">
              ประหยัด 20%
            </span>
          </button>
        </div>
      </div>

      {/* ===== Plan Cards - 2 column on mobile, 4 on desktop ===== */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {PLAN_ORDER.map((planId) => {
          const plan = PLANS[planId];
          const isCurrent = planId === currentPlan;
          const planIndex = PLAN_ORDER.indexOf(planId);
          const isUpgrade = planIndex > currentPlanIndex;
          const isDowngrade = planIndex < currentPlanIndex;
          const isPopular = plan.highlight;
          const price = getPrice(planId);
          const monthlyEq = getMonthlyEquivalent(planId);

          return (
            <Card
              key={planId}
              className={`relative overflow-hidden transition-all ${
                isCurrent
                  ? "border-2 border-brand-primary shadow-lg ring-4 ring-brand-primary/10"
                  : isPopular && !isCurrent
                    ? "border-2 border-amber-300 shadow-md"
                    : "border border-brand-border/50 shadow-sm hover:shadow-md"
              }`}
            >
              {/* Top ribbon */}
              {isCurrent && (
                <div className="bg-brand-primary text-white text-[10px] font-bold text-center py-1">
                  ใช้งานอยู่
                </div>
              )}
              {isPopular && !isCurrent && (
                <div className="bg-gradient-to-r from-amber-400 to-amber-500 text-white text-[10px] font-bold text-center py-1 flex items-center justify-center gap-1">
                  <Sparkles className="w-3 h-3" />
                  แนะนำ
                </div>
              )}

              <div className="p-4 flex flex-col">
                {/* Plan icon & name */}
                <div className="text-center mb-3">
                  <div className="text-2xl mb-0.5">{plan.icon}</div>
                  <h3 className="font-bold text-brand-text-dark text-sm">
                    {plan.name}
                  </h3>
                  <p className="text-[10px] text-brand-text-light">
                    {plan.description}
                  </p>
                </div>

                {/* Price */}
                <div className="text-center mb-4">
                  {price > 0 ? (
                    <>
                      <div>
                        <span className="text-2xl font-bold text-brand-text-dark">
                          ฿{price.toLocaleString()}
                        </span>
                        <span className="text-xs text-brand-text-light">
                          /{billingCycle === "yearly" ? "ปี" : "เดือน"}
                        </span>
                      </div>
                      {billingCycle === "yearly" && (
                        <p className="text-[10px] text-brand-text-light mt-0.5">
                          ≈ ฿{monthlyEq}/เดือน
                        </p>
                      )}
                    </>
                  ) : (
                    <span className="text-2xl font-bold text-brand-text-dark">
                      ฟรี
                    </span>
                  )}
                </div>

                {/* Key highlights - only top 3 features */}
                <div className="space-y-1.5 mb-4 flex-1">
                  <div className="flex items-center gap-1.5 text-xs">
                    <Check className="w-3.5 h-3.5 text-brand-success shrink-0" />
                    <span className="text-brand-text-dark">
                      {formatTeamLimit(planId)}
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5 text-xs">
                    <Check className="w-3.5 h-3.5 text-brand-success shrink-0" />
                    <span className="text-brand-text-dark">
                      Admin: {formatAdminLimit(planId)}
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5 text-xs">
                    <Check className="w-3.5 h-3.5 text-brand-success shrink-0" />
                    <span className="text-brand-text-dark">
                      {plan.features.botApi === "meelike_plus_external"
                        ? "API ภายนอก"
                        : "MeeLike API"}
                    </span>
                  </div>
                </div>

                {/* CTA */}
                <Button
                  variant={
                    isCurrent
                      ? "outline"
                      : isUpgrade
                        ? "primary"
                        : "outline"
                  }
                  size="sm"
                  className={`w-full ${
                    isUpgrade && !isCurrent ? "shadow-sm" : ""
                  }`}
                  disabled={isCurrent}
                >
                  {isCurrent ? (
                    "แพ็คเกจปัจจุบัน"
                  ) : isUpgrade ? (
                    <>
                      อัปเกรด
                      <ArrowRight className="w-3.5 h-3.5 ml-1" />
                    </>
                  ) : (
                    "ดาวน์เกรด"
                  )}
                </Button>
              </div>
            </Card>
          );
        })}
      </div>

      {/* ===== Feature Comparison Table ===== */}
      <Card className="border-none shadow-sm overflow-hidden">
        <div className="p-4 border-b border-brand-border/30">
          <p className="font-semibold text-brand-text-dark text-sm">
            เปรียบเทียบฟีเจอร์ทั้งหมด
          </p>
          <p className="text-xs text-brand-text-light mt-0.5">
            ดูรายละเอียดทุกฟีเจอร์ของแต่ละแพ็คเกจ
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-brand-border/30">
                <th className="text-left p-3 pl-4 font-medium text-brand-text-light text-xs min-w-[130px]">
                  ฟีเจอร์
                </th>
                {PLAN_ORDER.map((planId) => {
                  const isCurrent = planId === currentPlan;
                  return (
                    <th
                      key={planId}
                      className={`text-center p-3 text-xs font-semibold min-w-[85px] ${
                        isCurrent
                          ? "text-brand-primary bg-brand-primary/5"
                          : "text-brand-text-dark"
                      }`}
                    >
                      <div>{PLANS[planId].icon}</div>
                      <div className="mt-0.5">{PLANS[planId].name}</div>
                      {isCurrent && (
                        <Badge
                          variant="info"
                          size="sm"
                          className="mt-1 text-[9px]"
                        >
                          ปัจจุบัน
                        </Badge>
                      )}
                    </th>
                  );
                })}
              </tr>
            </thead>
            <tbody>
              {FEATURE_ROWS.map((row, idx) => (
                <tr
                  key={row.label}
                  className={
                    idx < FEATURE_ROWS.length - 1
                      ? "border-b border-brand-border/15"
                      : ""
                  }
                >
                  <td className="p-3 pl-4 text-brand-text-dark text-xs font-medium">
                    <div className="flex items-center gap-2">
                      <row.icon className="w-3.5 h-3.5 text-brand-text-light" />
                      {row.label}
                    </div>
                  </td>
                  {PLAN_ORDER.map((planId) => {
                    const val = row.getValue(planId);
                    const isCurrent = planId === currentPlan;
                    return (
                      <td
                        key={planId}
                        className={`text-center p-3 ${
                          isCurrent ? "bg-brand-primary/5" : ""
                        }`}
                      >
                        {typeof val === "boolean" ? (
                          val ? (
                            <Check className="w-4 h-4 text-brand-success mx-auto" />
                          ) : (
                            <span className="text-gray-300 text-xs">—</span>
                          )
                        ) : (
                          <span className="text-xs font-medium text-brand-text-dark">
                            {val}
                          </span>
                        )}
                      </td>
                    );
                  })}
                </tr>
              ))}
              {/* Price row at bottom */}
              <tr className="border-t-2 border-brand-border/30 bg-brand-bg/30">
                <td className="p-3 pl-4 text-xs font-bold text-brand-text-dark">
                  ราคา/{billingCycle === "yearly" ? "ปี" : "เดือน"}
                </td>
                {PLAN_ORDER.map((planId) => {
                  const price = getPrice(planId);
                  const isCurrent = planId === currentPlan;
                  return (
                    <td
                      key={planId}
                      className={`text-center p-3 ${
                        isCurrent ? "bg-brand-primary/5" : ""
                      }`}
                    >
                      <span className="text-sm font-bold text-brand-text-dark">
                        {price > 0 ? `฿${price.toLocaleString()}` : "ฟรี"}
                      </span>
                    </td>
                  );
                })}
              </tr>
            </tbody>
          </table>
        </div>
      </Card>

      {/* ===== FAQ / Trust ===== */}
      <Card className="border-none shadow-sm p-5">
        <div className="flex items-start gap-3 mb-4">
          <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center shrink-0">
            <HelpCircle className="w-4 h-4 text-blue-600" />
          </div>
          <p className="font-semibold text-brand-text-dark text-sm">
            คำถามที่พบบ่อย
          </p>
        </div>

        <div className="space-y-4">
          {[
            {
              q: "เปลี่ยนแพ็คเกจแล้วเกิดอะไรขึ้น?",
              a: "อัปเกรดมีผลทันที โดยคิดค่าส่วนต่างตามวันที่เหลือ ดาวน์เกรดจะมีผลเมื่อรอบบิลปัจจุบันหมดอายุ",
            },
            {
              q: "ยกเลิกได้ไหม?",
              a: "ยกเลิกได้ตลอดเวลา สิทธิ์ยังใช้ได้จนครบรอบบิล ไม่มีค่าใช้จ่ายเพิ่มเติม",
            },
            {
              q: "รองรับวิธีชำระเงินอะไรบ้าง?",
              a: "รองรับบัตรเครดิต/เดบิต, PromptPay และโอนผ่านธนาคาร",
            },
          ].map((item) => (
            <div key={item.q}>
              <p className="text-sm font-medium text-brand-text-dark">
                {item.q}
              </p>
              <p className="text-xs text-brand-text-light mt-0.5">
                {item.a}
              </p>
            </div>
          ))}
        </div>
      </Card>

      {/* Trust bar */}
      <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1 text-xs text-brand-text-light">
        <span className="flex items-center gap-1">
          <Shield className="w-3 h-3" />
          ชำระเงินปลอดภัย
        </span>
        <span>•</span>
        <span className="flex items-center gap-1">
          <CreditCard className="w-3 h-3" />
          บัตรเครดิต / PromptPay
        </span>
        <span>•</span>
        <span>ยกเลิกได้ตลอดเวลา</span>
      </div>
    </div>
  );
}
