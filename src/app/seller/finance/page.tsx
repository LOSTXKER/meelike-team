"use client";

import Link from "next/link";
import {
  CreditCard,
  TrendingUp,
  AlertTriangle,
  ArrowUpRight,
  Clock,
  CheckCircle,
  Package,
  BarChart3,
} from "lucide-react";
import { Card, Button, Badge, Skeleton } from "@/components/ui";
import { Container, Section } from "@/components/layout";
import { useSubscription, useOverageBills } from "@/lib/api/hooks/subscription";
import { PLANS, OVERAGE_FEE } from "@/lib/constants/plans";
import { getQuotaPercent } from "@/lib/utils/feature-gate";
import type { SubscriptionPlan } from "@/lib/constants/plans";

function QuotaMeter({
  used,
  limit,
  percent,
}: {
  used: number;
  limit: number | null;
  percent: number;
}) {
  const color =
    percent >= 100
      ? "bg-brand-error"
      : percent >= 80
      ? "bg-brand-warning"
      : "bg-brand-success";

  if (limit === null) {
    return (
      <div className="flex items-center gap-2 text-sm text-brand-success font-medium">
        <CheckCircle className="w-4 h-4" />
        <span>ออเดอร์ไม่จำกัด</span>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="flex justify-between text-sm">
        <span className="text-brand-text-light">ใช้ไปแล้ว</span>
        <span className="font-bold text-brand-text-dark">
          {used} / {limit} ออเดอร์
        </span>
      </div>
      <div className="h-3 bg-brand-secondary rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-500 ${color}`}
          style={{ width: `${Math.min(percent, 100)}%` }}
        />
      </div>
      <p className="text-xs text-brand-text-light">{percent}% ของโควต้าเดือนนี้</p>
    </div>
  );
}

function PlanBadge({ plan }: { plan: SubscriptionPlan }) {
  const config = PLANS[plan];
  const variants: Record<SubscriptionPlan, "default" | "success" | "warning" | "info" | "error"> = {
    free: "default",
    starter: "info",
    pro: "success",
    business: "warning",
    enterprise: "error",
  };
  return (
    <Badge variant={variants[plan]} size="md">
      {config.name}
      {config.badge ? ` · ${config.badge}` : ""}
    </Badge>
  );
}

export default function FinancePage() {
  const { data: subData, isLoading: subLoading } = useSubscription();
  const { data: billData, isLoading: billLoading } = useOverageBills();

  if (subLoading) {
    return (
      <Container size="md">
        <Section spacing="lg">
          <div className="space-y-6 animate-fade-in">
            <Skeleton className="h-8 w-64" />
            <Skeleton className="h-48 w-full rounded-2xl" />
            <Skeleton className="h-36 w-full rounded-2xl" />
          </div>
        </Section>
      </Container>
    );
  }

  const sub = (subData as { data?: Record<string, unknown> })?.data as {
    plan: SubscriptionPlan;
    planExpiresAt?: string;
    usage: {
      month: number;
      year: number;
      ordersUsed: number;
      quotaLimit: number | null;
      overageCount: number;
    };
    hasUnpaidOverageBill: boolean;
    unpaidBill?: {
      id: string;
      month: number;
      year: number;
      overageOrders: number;
      totalAmount: number;
    };
  } | null;

  const bills = (billData as { data?: { bills: Array<{
    id: string;
    month: number;
    year: number;
    overageOrders: number;
    feePerOrder: number;
    totalAmount: number;
    status: string;
    paidAt?: string;
  }> } })?.data?.bills ?? [];

  const plan = sub?.plan ?? "free";
  const planConfig = PLANS[plan];
  const usage = sub?.usage;
  const quotaPercent = usage
    ? getQuotaPercent(plan, usage.ordersUsed)
    : 0;

  const thaiMonths = [
    "มกราคม", "กุมภาพันธ์", "มีนาคม", "เมษายน", "พฤษภาคม", "มิถุนายน",
    "กรกฎาคม", "สิงหาคม", "กันยายน", "ตุลาคม", "พฤศจิกายน", "ธันวาคม",
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-brand-text-dark flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-brand-primary/10 flex items-center justify-center">
            <CreditCard className="w-5 h-5 text-brand-primary" />
          </div>
          การสมัครสมาชิก & การใช้งาน
        </h1>
        <p className="text-sm text-brand-text-light mt-1 ml-[52px]">
          ดูแผนปัจจุบัน โควต้าออเดอร์ และค่าใช้จ่ายเพิ่มเติม
        </p>
      </div>

      {/* Current Plan Card */}
      <Card variant="elevated" padding="lg" className="border-none shadow-lg shadow-brand-primary/5">
        <div className="flex items-start justify-between">
          <div className="space-y-2">
            <p className="text-sm font-medium text-brand-text-light">แผนปัจจุบัน</p>
            <PlanBadge plan={plan} />
            {sub?.planExpiresAt && (
              <p className="text-xs text-brand-text-light flex items-center gap-1">
                <Clock className="w-3 h-3" />
                หมดอายุ{" "}
                {new Date(sub.planExpiresAt).toLocaleDateString("th-TH", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })}
              </p>
            )}
          </div>
          <div className="text-right">
            <p className="text-3xl font-bold text-brand-text-dark">
              ฿{planConfig.price.toLocaleString()}
            </p>
            <p className="text-sm text-brand-text-light">/เดือน</p>
          </div>
        </div>

        <div className="mt-5 pt-5 border-t border-brand-border/30">
          <Link href="/seller/settings/subscription">
            <Button variant="primary" rightIcon={<ArrowUpRight className="w-4 h-4" />}>
              อัปเกรดแผน
            </Button>
          </Link>
        </div>
      </Card>

      {/* Quota Meter */}
      {usage && (
        <Card variant="elevated" padding="lg" className="border-none shadow-lg shadow-brand-primary/5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-bold text-brand-text-dark flex items-center gap-2">
              <div className="p-2 rounded-lg bg-brand-primary/10">
                <Package className="w-4 h-4 text-brand-primary" />
              </div>
              โควต้าออเดอร์ — {thaiMonths[(usage.month ?? 1) - 1]} {usage.year}
            </h2>
            {usage.overageCount > 0 && (
              <Badge variant="warning" size="sm">
                Overage: {usage.overageCount}
              </Badge>
            )}
          </div>

          <QuotaMeter
            used={usage.ordersUsed}
            limit={usage.quotaLimit}
            percent={quotaPercent}
          />

          {usage.quotaLimit !== null && usage.ordersUsed >= usage.quotaLimit && (
            <div className="mt-4 text-sm text-brand-warning bg-brand-warning/10 rounded-xl p-3 flex items-start gap-2">
              <AlertTriangle className="w-4 h-4 mt-0.5 shrink-0" />
              <span>เกินโควต้า — ออเดอร์เพิ่มเติมจะถูกเรียกเก็บ ฿{OVERAGE_FEE}/ออเดอร์</span>
            </div>
          )}
        </Card>
      )}

      {/* Unpaid Overage Bill Alert */}
      {sub?.hasUnpaidOverageBill && sub.unpaidBill && (
        <Card className="border-brand-error/30 bg-brand-error/5 p-6">
          <div className="flex items-start gap-3">
            <div className="p-2 rounded-lg bg-brand-error/10 shrink-0">
              <AlertTriangle className="w-5 h-5 text-brand-error" />
            </div>
            <div className="space-y-2 flex-1">
              <h3 className="font-bold text-brand-error">
                มีค่า Overage ค้างชำระ
              </h3>
              <p className="text-sm text-brand-error/80">
                เดือน {thaiMonths[(sub.unpaidBill.month ?? 1) - 1]} {sub.unpaidBill.year}:{" "}
                {sub.unpaidBill.overageOrders} ออเดอร์ — รวม ฿
                {sub.unpaidBill.totalAmount.toLocaleString()}
              </p>
              <p className="text-xs text-brand-error/60">
                กรุณาชำระก่อนสร้างออเดอร์ใหม่
              </p>
              <Link href="/seller/settings/subscription">
                <Button variant="danger" size="sm">ชำระเดี๋ยวนี้</Button>
              </Link>
            </div>
          </div>
        </Card>
      )}

      {/* Overage Bill History */}
      {!billLoading && bills.length > 0 && (
        <Card variant="elevated" padding="none" className="border-none shadow-lg shadow-brand-primary/5 overflow-hidden">
          <div className="px-6 py-4 border-b border-brand-border/30">
            <h2 className="font-bold text-brand-text-dark flex items-center gap-2">
              <div className="p-2 rounded-lg bg-brand-accent/10">
                <BarChart3 className="w-4 h-4 text-brand-accent" />
              </div>
              ประวัติค่า Overage
            </h2>
          </div>
          <div className="divide-y divide-brand-border/30">
            {bills.map((bill) => (
              <div
                key={bill.id}
                className="flex items-center justify-between px-6 py-4 hover:bg-brand-bg/50 transition-colors"
              >
                <div>
                  <p className="text-sm font-semibold text-brand-text-dark">
                    {thaiMonths[(bill.month ?? 1) - 1]} {bill.year}
                  </p>
                  <p className="text-xs text-brand-text-light mt-0.5">
                    {bill.overageOrders} ออเดอร์ × ฿{bill.feePerOrder}
                  </p>
                </div>
                <div className="text-right flex items-center gap-3">
                  <p className="text-sm font-bold text-brand-text-dark">
                    ฿{bill.totalAmount.toLocaleString()}
                  </p>
                  <Badge
                    variant={
                      bill.status === "paid" ? "success" : bill.status === "waived" ? "default" : "error"
                    }
                    size="sm"
                  >
                    {bill.status === "paid"
                      ? "ชำระแล้ว"
                      : bill.status === "waived"
                      ? "ยกเว้น"
                      : "ค้างชำระ"}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
}
