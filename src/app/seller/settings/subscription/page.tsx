"use client";

import { useState } from "react";
import { Card, Button, Badge } from "@/components/ui";
import {
  Crown,
  Check,
  X,
  Zap,
  Shield,
  Users,
  Sparkles,
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

export default function SubscriptionPage() {
  const [billingCycle, setBillingCycle] = useState<"monthly" | "yearly">("monthly");
  const currentPlanConfig = getPlanConfig(currentPlan);

  return (
    <div className="space-y-6">
      {/* Current Plan Card */}
      <Card className="border-none shadow-md p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center">
              <Crown className="w-6 h-6 text-amber-600" />
            </div>
            <div>
              <Badge variant="default" size="sm" className="mb-1">แพ็คเกจปัจจุบัน</Badge>
              <h2 className="text-2xl font-bold text-brand-text-dark">
                {currentPlanConfig.icon} {currentPlanConfig.name}
              </h2>
              <p className="text-brand-text-light text-sm">
                {formatPlanPrice(currentPlan)} • ต่ออายุอัตโนมัติ
              </p>
            </div>
          </div>
        </div>

        <div className="p-3 bg-brand-bg rounded-xl mb-4">
          <div className="flex justify-between text-sm mb-2">
            <span className="text-brand-text-light">หมดอายุ</span>
            <span className="font-bold text-brand-text-dark">15 ม.ค. 2568</span>
          </div>
          <div className="w-full h-2 bg-brand-border/30 rounded-full overflow-hidden">
            <div className="h-full bg-brand-primary w-3/4 rounded-full"></div>
          </div>
          <p className="text-xs text-right text-brand-text-light mt-1">เหลือเวลา 15 วัน</p>
        </div>

        <div className="grid grid-cols-3 gap-3">
          <div className="bg-brand-bg rounded-xl p-3 text-center">
            <Users className="w-5 h-5 mx-auto mb-1 text-brand-primary" />
            <p className="font-bold text-lg text-brand-text-dark">{formatTeamLimit(currentPlan).replace(" ทีม", "")}</p>
            <p className="text-[10px] text-brand-text-light">ทีม</p>
          </div>
          <div className="bg-brand-bg rounded-xl p-3 text-center">
            <Shield className="w-5 h-5 mx-auto mb-1 text-brand-primary" />
            <p className="font-bold text-lg text-brand-text-dark">{formatAdminLimit(currentPlan).replace(" คน", "")}</p>
            <p className="text-[10px] text-brand-text-light">Admin</p>
          </div>
          <div className="bg-brand-bg rounded-xl p-3 text-center">
            <Zap className="w-5 h-5 mx-auto mb-1 text-brand-primary" />
            <p className="font-bold text-sm pt-1 text-brand-text-dark">
              {currentPlanConfig.features.botApi === "meelike_plus_external" ? "Full" : "Basic"}
            </p>
            <p className="text-[10px] text-brand-text-light">API</p>
          </div>
        </div>
      </Card>

      {/* Billing Cycle Toggle */}
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
            <span className="bg-emerald-100 text-emerald-700 text-[10px] px-1.5 py-0.5 rounded font-bold">
              -20%
            </span>
          </button>
        </div>
      </div>

      {/* Plans Comparison Grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {PLAN_ORDER.map((planId) => {
          const plan = PLANS[planId];
          const isCurrent = planId === currentPlan;
          const yearlyPrice = plan.price > 0 ? Math.round(plan.price * 12 * 0.8) : 0;
          const displayPrice = billingCycle === "yearly" ? yearlyPrice : plan.price;
          const isPopular = plan.highlight;

          return (
            <Card
              key={planId}
              className={`relative overflow-hidden transition-all ${
                isCurrent
                  ? "border-2 border-brand-primary shadow-lg"
                  : isPopular
                  ? "border-2 border-amber-400 shadow-md"
                  : "border border-brand-border/50 shadow-sm hover:shadow-md"
              }`}
            >
              {isPopular && !isCurrent && (
                <div className="absolute top-0 right-0 bg-amber-400 text-white text-[10px] font-bold px-2 py-1 rounded-bl-lg flex items-center gap-1">
                  <Sparkles className="w-3 h-3" />
                  แนะนำ
                </div>
              )}
              {isCurrent && (
                <div className="absolute top-0 right-0 bg-brand-primary text-white text-[10px] font-bold px-2 py-1 rounded-bl-lg">
                  ใช้งานอยู่
                </div>
              )}

              <div className="p-4">
                {/* Plan Header */}
                <div className="text-center mb-4">
                  <div className="text-3xl mb-1">{plan.icon}</div>
                  <h3 className="font-bold text-brand-text-dark">{plan.name}</h3>
                  <div className="mt-2">
                    {displayPrice > 0 ? (
                      <>
                        <span className="text-2xl font-bold text-brand-text-dark">
                          ฿{displayPrice.toLocaleString()}
                        </span>
                        <span className="text-brand-text-light text-xs">
                          /{billingCycle === "yearly" ? "ปี" : "เดือน"}
                        </span>
                      </>
                    ) : (
                      <span className="text-2xl font-bold text-brand-text-dark">ฟรี</span>
                    )}
                  </div>
                </div>

                {/* Features */}
                <div className="space-y-2 text-sm mb-4">
                  <div className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-500 shrink-0" />
                    <span className="text-brand-text-dark">{formatTeamLimit(planId)}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-500 shrink-0" />
                    <span className="text-brand-text-dark">Admin: {formatAdminLimit(planId)}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-500 shrink-0" />
                    <span className="text-brand-text-dark">
                      {plan.features.botApi === "meelike_plus_external" ? "API: MeeLike + เจ้าอื่น" : "API: MeeLike"}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    {plan.features.exportData ? (
                      <Check className="w-4 h-4 text-emerald-500 shrink-0" />
                    ) : (
                      <X className="w-4 h-4 text-gray-300 shrink-0" />
                    )}
                    <span className={plan.features.exportData ? "text-brand-text-dark" : "text-brand-text-light"}>
                      Export Data
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    {plan.features.webhook ? (
                      <Check className="w-4 h-4 text-emerald-500 shrink-0" />
                    ) : (
                      <X className="w-4 h-4 text-gray-300 shrink-0" />
                    )}
                    <span className={plan.features.webhook ? "text-brand-text-dark" : "text-brand-text-light"}>
                      Webhook
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    {plan.features.whiteLabel ? (
                      <Check className="w-4 h-4 text-emerald-500 shrink-0" />
                    ) : (
                      <X className="w-4 h-4 text-gray-300 shrink-0" />
                    )}
                    <span className={plan.features.whiteLabel ? "text-brand-text-dark" : "text-brand-text-light"}>
                      White Label
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    {plan.features.prioritySupport ? (
                      <Check className="w-4 h-4 text-emerald-500 shrink-0" />
                    ) : (
                      <X className="w-4 h-4 text-gray-300 shrink-0" />
                    )}
                    <span className={plan.features.prioritySupport ? "text-brand-text-dark" : "text-brand-text-light"}>
                      Priority Support
                    </span>
                  </div>
                </div>

                {/* CTA Button */}
                <Button
                  variant={isCurrent ? "outline" : isPopular ? "primary" : "outline"}
                  size="sm"
                  className="w-full"
                  disabled={isCurrent}
                >
                  {isCurrent ? "ใช้งานอยู่" : "เลือกแพ็คเกจนี้"}
                </Button>
              </div>
            </Card>
          );
        })}
      </div>

      {/* Note */}
      <div className="text-center text-sm text-brand-text-light">
        <p>ยกเลิกได้ตลอดเวลา • สิทธิ์คงอยู่จนครบรอบบิล • รองรับบัตรเครดิต/PromptPay</p>
      </div>
    </div>
  );
}
