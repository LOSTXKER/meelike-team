"use client";

import { useState } from "react";
import {
  Crown,
  Check,
  X,
  Sparkles,
  Star,
  Zap,
  Shield,
  Rocket,
} from "lucide-react";
import { Card, Button, Badge, Input } from "@/components/ui";
import { PLAN_LIST, OVERAGE_FEE } from "@/lib/constants/plans";
import { useSubscription, useUpgradePlan } from "@/lib/api/hooks/subscription";
import type { SubscriptionPlan, PlanConfig } from "@/lib/constants/plans";

const PLAN_ICONS: Record<SubscriptionPlan, React.ReactNode> = {
  free: <Zap className="w-5 h-5" />,
  starter: <Star className="w-5 h-5" />,
  pro: <Crown className="w-5 h-5" />,
  business: <Rocket className="w-5 h-5" />,
  enterprise: <Shield className="w-5 h-5" />,
};

const FEATURE_ROWS: {
  label: string;
  key: (plan: PlanConfig) => string | boolean | number;
  format?: (v: string | boolean | number) => string;
}[] = [
  {
    label: "ราคา/เดือน",
    key: (p) => p.price,
    format: (v) => (v === 0 ? "ฟรี" : `฿${Number(v).toLocaleString()}`),
  },
  {
    label: "โควต้าออเดอร์",
    key: (p) => p.orderQuota,
    format: (v) => (v === Infinity ? "ไม่จำกัด" : `${v} ออเดอร์`),
  },
  {
    label: "จำนวนทีม",
    key: (p) => p.teams,
    format: (v) => (v === Infinity ? "ไม่จำกัด" : `${v} ทีม`),
  },
  {
    label: "สมาชิก/ทีม",
    key: (p) => p.membersPerTeam,
    format: (v) => (v === Infinity ? "ไม่จำกัด" : `${v} คน`),
  },
  {
    label: "Store",
    key: (p) =>
      p.storeLevel === "none" ? "ไม่มี"
        : p.storeLevel === "basic" ? "Basic"
        : p.storeLevel === "custom" ? "Custom Theme"
        : "Premium + Domain",
    format: (v) => String(v),
  },
  { label: "สร้าง Job อัตโนมัติ", key: (p) => p.features.autoCreateJobs },
  { label: "แยก/โอนงาน", key: (p) => p.features.splitReassign },
  { label: "Outsource", key: (p) => p.features.outsource },
  {
    label: "Analytics",
    key: (p) => ({
      basic_today: "วันนี้",
      overview: "ภาพรวม",
      full: "เต็ม",
      full_export: "เต็ม + Export",
    }[p.features.analytics]),
    format: (v) => String(v),
  },
  { label: "Export CSV", key: (p) => p.features.exportCsv },
  {
    label: "Payment Helper",
    key: (p) => ({
      text: "คำแนะนำ",
      qr: "QR Code",
      checklist_schedule: "Checklist",
      csv_batch: "CSV Batch",
    }[p.features.paymentHelper]),
    format: (v) => String(v),
  },
  { label: "LINE Notify", key: (p) => p.features.lineNotify },
  { label: "Webhook", key: (p) => p.features.webhook },
  { label: "API Access", key: (p) => p.features.api },
  { label: "White Label", key: (p) => p.features.whiteLabel },
  { label: "Custom Domain", key: (p) => p.features.customDomain },
  {
    label: "Support",
    key: (p) => ({
      community: "Community",
      email: "Email",
      priority: "Priority",
      sla_dedicated: "SLA Dedicated",
    }[p.features.support]),
    format: (v) => String(v),
  },
];

function PlanCard({
  plan,
  currentPlan,
  onSelect,
}: {
  plan: PlanConfig;
  currentPlan: SubscriptionPlan;
  onSelect: (p: SubscriptionPlan) => void;
}) {
  const isCurrent = plan.id === currentPlan;
  const isTarget = plan.highlight;

  return (
    <Card
      className={`relative flex flex-col gap-4 p-5 transition-all duration-300 hover:-translate-y-1 ${
        isTarget
          ? "border-2 border-brand-primary shadow-xl shadow-brand-primary/10 bg-brand-surface"
          : isCurrent
          ? "border-2 border-brand-success/50 bg-brand-surface"
          : "border border-brand-border/50 hover:border-brand-primary/30 hover:shadow-md"
      }`}
    >
      {isTarget && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gradient-to-r from-brand-primary to-brand-accent text-white text-xs font-bold px-4 py-1 rounded-full flex items-center gap-1">
          <Sparkles className="w-3 h-3" /> ยอดนิยม
        </div>
      )}
      {plan.badge && !isTarget && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-brand-text-dark text-white text-xs font-bold px-3 py-1 rounded-full">
          {plan.badge}
        </div>
      )}

      <div className="flex items-center gap-2 text-brand-primary">
        <div className="p-2 rounded-lg bg-brand-primary/10">
          {PLAN_ICONS[plan.id]}
        </div>
        <h3 className="text-lg font-bold text-brand-text-dark">{plan.name}</h3>
      </div>

      <div>
        <div className="flex items-baseline gap-1">
          <span className="text-3xl font-extrabold text-brand-text-dark">
            ฿{plan.price.toLocaleString()}
          </span>
          <span className="text-sm text-brand-text-light">/เดือน</span>
        </div>
        <p className="text-xs text-brand-text-light mt-1">
          {plan.orderQuota === Infinity
            ? "ออเดอร์ไม่จำกัด"
            : `${plan.orderQuota} ออเดอร์/เดือน`}
        </p>
      </div>

      {isCurrent ? (
        <div className="w-full py-2.5 rounded-xl bg-brand-success/10 text-brand-success text-sm font-semibold text-center flex items-center justify-center gap-2">
          <Check className="w-4 h-4" /> แผนปัจจุบัน
        </div>
      ) : (
        <Button
          variant={isTarget ? "primary" : "outline"}
          className="w-full"
          onClick={() => onSelect(plan.id)}
        >
          เลือกแผนนี้
        </Button>
      )}
    </Card>
  );
}

function UpgradeModal({
  plan,
  onClose,
  onConfirm,
  isPending,
}: {
  plan: PlanConfig;
  onClose: () => void;
  onConfirm: (slipUrl?: string) => void;
  isPending: boolean;
}) {
  const [slipUrl, setSlipUrl] = useState("");

  return (
    <div className="fixed inset-0 bg-brand-text-dark/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <Card variant="elevated" padding="lg" className="w-full max-w-md border-none shadow-2xl">
        <h3 className="text-xl font-bold text-brand-text-dark mb-5 flex items-center gap-2">
          <div className="p-2 rounded-lg bg-brand-primary/10">
            {PLAN_ICONS[plan.id]}
          </div>
          สมัครแผน {plan.name}
        </h3>

        <Card className="bg-brand-secondary/50 border-brand-border/30 p-4 mb-5">
          <div className="flex justify-between text-sm mb-2">
            <span className="text-brand-text-light">ราคา</span>
            <span className="font-bold text-brand-text-dark">
              ฿{plan.price.toLocaleString()}/เดือน
            </span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-brand-text-light">โควต้า</span>
            <span className="font-bold text-brand-text-dark">
              {plan.orderQuota === Infinity
                ? "ไม่จำกัด"
                : `${plan.orderQuota} ออเดอร์`}
            </span>
          </div>
        </Card>

        {plan.price > 0 && (
          <div className="space-y-3 mb-5">
            <p className="text-sm font-medium text-brand-text-dark">
              โอนเงินมาที่ PromptPay:{" "}
              <span className="font-mono text-brand-primary">0XX-XXX-XXXX</span>
            </p>
            <Input
              placeholder="URL สลิปการโอนเงิน (ถ้ามี)"
              value={slipUrl}
              onChange={(e) => setSlipUrl(e.target.value)}
            />
          </div>
        )}

        <div className="flex gap-3">
          <Button variant="outline" className="flex-1" onClick={onClose}>
            ยกเลิก
          </Button>
          <Button
            variant="primary"
            className="flex-1"
            isLoading={isPending}
            onClick={() => onConfirm(slipUrl || undefined)}
          >
            ยืนยัน
          </Button>
        </div>
      </Card>
    </div>
  );
}

export default function SubscriptionPage() {
  const { data: subData } = useSubscription();
  const upgradePlan = useUpgradePlan();
  const [selectedPlan, setSelectedPlan] = useState<PlanConfig | null>(null);

  const currentPlan = ((subData as { data?: { plan: SubscriptionPlan } })?.data
    ?.plan ?? "free") as SubscriptionPlan;

  async function handleConfirmUpgrade(slipUrl?: string) {
    if (!selectedPlan) return;
    await upgradePlan.mutateAsync({
      plan: selectedPlan.id,
      slipUrl,
      paymentMethod: slipUrl ? "bank_transfer" : undefined,
    });
    setSelectedPlan(null);
  }

  return (
    <div className="space-y-8 animate-fade-in">
      {selectedPlan && (
        <UpgradeModal
          plan={selectedPlan}
          onClose={() => setSelectedPlan(null)}
          onConfirm={handleConfirmUpgrade}
          isPending={upgradePlan.isPending}
        />
      )}

      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-brand-text-dark flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-brand-primary/10 flex items-center justify-center">
            <Crown className="w-5 h-5 text-brand-primary" />
          </div>
          เลือกแผนการใช้งาน
        </h1>
        <p className="text-sm text-brand-text-light mt-1 ml-[52px]">
          Overage ฿{OVERAGE_FEE}/ออเดอร์ เมื่อเกินโควต้า
        </p>
      </div>

      {/* Plan Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {PLAN_LIST.map((plan) => (
          <PlanCard
            key={plan.id}
            plan={plan}
            currentPlan={currentPlan}
            onSelect={(id) =>
              setSelectedPlan(PLAN_LIST.find((p) => p.id === id) ?? null)
            }
          />
        ))}
      </div>

      {/* Feature Comparison Table */}
      <Card variant="elevated" padding="none" className="border-none shadow-lg shadow-brand-primary/5 overflow-hidden">
        <div className="px-6 py-4 border-b border-brand-border/30">
          <h2 className="font-bold text-brand-text-dark flex items-center gap-2">
            <div className="p-2 rounded-lg bg-brand-accent/10">
              <Sparkles className="w-4 h-4 text-brand-accent" />
            </div>
            เปรียบเทียบฟีเจอร์
          </h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-brand-border/30">
                <th className="text-left px-6 py-3 text-brand-text-light font-semibold text-xs uppercase tracking-wider w-40">
                  ฟีเจอร์
                </th>
                {PLAN_LIST.map((plan) => (
                  <th
                    key={plan.id}
                    className={`px-4 py-3 font-semibold text-center text-xs uppercase tracking-wider ${
                      plan.highlight
                        ? "text-brand-primary bg-brand-primary/5"
                        : plan.id === currentPlan
                        ? "text-brand-success bg-brand-success/5"
                        : "text-brand-text-light"
                    }`}
                  >
                    {plan.name}
                    {plan.id === currentPlan && (
                      <Badge variant="success" size="sm" className="ml-1">
                        ✓
                      </Badge>
                    )}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {FEATURE_ROWS.map((row, i) => (
                <tr
                  key={i}
                  className={`border-b border-brand-border/20 ${
                    i % 2 === 0 ? "bg-brand-surface" : "bg-brand-bg/30"
                  }`}
                >
                  <td className="px-6 py-3 text-brand-text-light font-medium">
                    {row.label}
                  </td>
                  {PLAN_LIST.map((plan) => {
                    const raw = row.key(plan);
                    const isBoolean = typeof raw === "boolean";
                    const display = row.format
                      ? row.format(raw)
                      : isBoolean
                      ? ""
                      : String(raw);

                    return (
                      <td
                        key={plan.id}
                        className={`px-4 py-3 text-center ${
                          plan.highlight ? "bg-brand-primary/[0.02]" : ""
                        } ${plan.id === currentPlan ? "bg-brand-success/[0.02]" : ""}`}
                      >
                        {isBoolean ? (
                          raw ? (
                            <Check className="w-4 h-4 text-brand-success mx-auto" />
                          ) : (
                            <X className="w-4 h-4 text-brand-border mx-auto" />
                          )
                        ) : (
                          <span className="text-brand-text-dark text-sm">{display}</span>
                        )}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
