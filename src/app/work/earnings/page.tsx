"use client";

import {
  Coins,
  TrendingUp,
  Clock,
  CheckCircle2,
  Banknote,
  CalendarDays,
  Briefcase,
  ArrowDownLeft,
  Info,
} from "lucide-react";
import { Card, Button, Badge, Skeleton } from "@/components/ui";
import { useWorkerEarnings, useConfirmPaymentReceived } from "@/lib/api/hooks/payouts";
import { useWorkerStats } from "@/lib/api/hooks";

interface PaymentRecord {
  id: string;
  amount: number;
  method?: string;
  status: string;
  slipUrl?: string;
  confirmedAt?: string;
  createdAt: string;
  seller?: { displayName: string };
}

interface JobClaim {
  id: string;
  earnAmount: number;
  actualQuantity?: number;
  quantity: number;
  reviewedAt?: string;
  job?: {
    serviceName: string;
    team?: { name: string; seller?: { displayName: string } };
  };
}

export default function WorkerEarningsPage() {
  const { data: statsData } = useWorkerStats();
  const { data: earningsData, isLoading } = useWorkerEarnings();
  const confirmPayment = useConfirmPaymentReceived();

  const stats = (statsData as { data?: Record<string, unknown> })?.data as {
    totalOwed: number;
    totalEarned: number;
    todayEarnings: number;
    weekEarnings: number;
  } | null;

  const earnings = (earningsData as { data?: Record<string, unknown> })?.data as {
    approvedClaims: JobClaim[];
    confirmedPayments: PaymentRecord[];
    pendingPayments: PaymentRecord[];
    totalOwed: number;
    totalEarned: number;
  } | null;

  if (isLoading) {
    return (
      <div className="space-y-6 animate-fade-in">
        <Skeleton className="h-8 w-48" />
        <div className="grid grid-cols-2 gap-4">
          {[...Array(4)].map((_, i) => (
            <Skeleton key={i} className="h-28 rounded-2xl" />
          ))}
        </div>
        <Skeleton className="h-40 rounded-2xl" />
      </div>
    );
  }

  const pendingPayments = earnings?.pendingPayments ?? [];
  const confirmedPayments = earnings?.confirmedPayments ?? [];
  const approvedClaims = earnings?.approvedClaims ?? [];

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-brand-text-dark flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-brand-primary/10 flex items-center justify-center">
            <Coins className="w-5 h-5 text-brand-primary" />
          </div>
          รายได้ของฉัน
        </h1>
        <p className="text-sm text-brand-text-light mt-1 ml-[52px]">
          ดูสรุปรายได้และยืนยันการรับเงิน
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 gap-4">
        <Card variant="elevated" className="p-5 border-none shadow-lg shadow-brand-primary/5 hover:-translate-y-1 transition-all duration-300">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs font-medium text-brand-text-light">รายได้รอรับ</p>
              <p className="text-2xl font-bold text-brand-primary mt-1">
                ฿{(stats?.totalOwed ?? earnings?.totalOwed ?? 0).toLocaleString()}
              </p>
              <p className="text-xs text-brand-text-light mt-1">
                ยอดที่แม่ทีมยังไม่ได้โอน
              </p>
            </div>
            <div className="p-2 rounded-lg bg-brand-primary/10">
              <Clock className="w-4 h-4 text-brand-primary" />
            </div>
          </div>
        </Card>
        <Card variant="elevated" className="p-5 border-none shadow-lg shadow-brand-primary/5 hover:-translate-y-1 transition-all duration-300">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs font-medium text-brand-text-light">รายได้รวมทั้งหมด</p>
              <p className="text-2xl font-bold text-brand-text-dark mt-1">
                ฿{(stats?.totalEarned ?? earnings?.totalEarned ?? 0).toLocaleString()}
              </p>
              <p className="text-xs text-brand-text-light mt-1">ตั้งแต่เริ่มใช้งาน</p>
            </div>
            <div className="p-2 rounded-lg bg-brand-accent/10">
              <TrendingUp className="w-4 h-4 text-brand-accent" />
            </div>
          </div>
        </Card>
        <Card variant="bordered" className="p-5 hover:shadow-md hover:border-brand-primary/20 transition-all">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs font-medium text-brand-text-light">วันนี้</p>
              <p className="text-xl font-bold text-brand-success mt-1">
                ฿{(stats?.todayEarnings ?? 0).toLocaleString()}
              </p>
            </div>
            <div className="p-2 rounded-lg bg-brand-success/10">
              <CalendarDays className="w-4 h-4 text-brand-success" />
            </div>
          </div>
        </Card>
        <Card variant="bordered" className="p-5 hover:shadow-md hover:border-brand-primary/20 transition-all">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs font-medium text-brand-text-light">สัปดาห์นี้</p>
              <p className="text-xl font-bold text-brand-info mt-1">
                ฿{(stats?.weekEarnings ?? 0).toLocaleString()}
              </p>
            </div>
            <div className="p-2 rounded-lg bg-brand-info/10">
              <Banknote className="w-4 h-4 text-brand-info" />
            </div>
          </div>
        </Card>
      </div>

      {/* Notice */}
      <Card className="bg-brand-warning/5 border-brand-warning/20 p-4">
        <div className="flex items-start gap-3">
          <div className="p-1.5 rounded-lg bg-brand-warning/10 shrink-0">
            <Info className="w-4 h-4 text-brand-warning" />
          </div>
          <div className="text-sm text-brand-warning">
            <p className="font-semibold mb-0.5">วิธีรับเงิน</p>
            <p>
              แม่ทีมจะโอนเงินให้โดยตรงผ่าน PromptPay หรือโอนเงินธนาคาร
              เมื่อได้รับเงินแล้วกด &quot;ยืนยันรับเงิน&quot; ด้านล่าง
            </p>
          </div>
        </div>
      </Card>

      {/* Pending Payment Confirmations */}
      {pendingPayments.length > 0 && (
        <Card variant="elevated" padding="none" className="border-none shadow-lg shadow-brand-primary/5 overflow-hidden">
          <div className="px-6 py-4 border-b border-brand-border/30 flex items-center justify-between">
            <h2 className="font-bold text-brand-text-dark flex items-center gap-2">
              <div className="p-2 rounded-lg bg-brand-warning/10">
                <ArrowDownLeft className="w-4 h-4 text-brand-warning" />
              </div>
              รอยืนยันการรับเงิน
            </h2>
            <Badge variant="warning" size="sm">{pendingPayments.length}</Badge>
          </div>
          <div className="divide-y divide-brand-border/30">
            {pendingPayments.map((p) => (
              <div key={p.id} className="px-6 py-4 flex items-center justify-between hover:bg-brand-bg/50 transition-colors">
                <div>
                  <p className="text-sm font-semibold text-brand-text-dark">
                    {p.seller?.displayName ?? "แม่ทีม"}
                  </p>
                  <p className="text-xs text-brand-text-light mt-0.5">
                    {new Date(p.createdAt).toLocaleDateString("th-TH")}
                    {p.method === "promptpay" ? " · PromptPay" : " · โอนเงิน"}
                  </p>
                  {p.slipUrl && (
                    <a
                      href={p.slipUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="text-xs text-brand-primary underline mt-0.5 inline-block"
                    >
                      ดูสลิป
                    </a>
                  )}
                </div>
                <div className="text-right">
                  <p className="text-base font-bold text-brand-text-dark">
                    ฿{p.amount.toLocaleString()}
                  </p>
                  <Button
                    variant="success"
                    size="sm"
                    className="mt-1.5"
                    onClick={() => confirmPayment.mutate(p.id)}
                    isLoading={confirmPayment.isPending}
                    leftIcon={<CheckCircle2 className="w-3 h-3" />}
                  >
                    ยืนยันรับเงิน
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Approved Claims */}
      {approvedClaims.length > 0 && (
        <Card variant="elevated" padding="none" className="border-none shadow-lg shadow-brand-primary/5 overflow-hidden">
          <div className="px-6 py-4 border-b border-brand-border/30">
            <h2 className="font-bold text-brand-text-dark flex items-center gap-2">
              <div className="p-2 rounded-lg bg-brand-success/10">
                <Briefcase className="w-4 h-4 text-brand-success" />
              </div>
              งานที่อนุมัติแล้ว (รอแม่ทีมโอน)
            </h2>
          </div>
          <div className="divide-y divide-brand-border/30">
            {approvedClaims.slice(0, 10).map((claim) => (
              <div key={claim.id} className="px-6 py-4 flex items-center justify-between hover:bg-brand-bg/50 transition-colors">
                <div>
                  <p className="text-sm font-semibold text-brand-text-dark">
                    {claim.job?.serviceName ?? "งาน"}
                  </p>
                  <p className="text-xs text-brand-text-light mt-0.5">
                    {claim.job?.team?.name ?? "ทีม"} · {claim.actualQuantity ?? claim.quantity} รายการ
                  </p>
                  {claim.reviewedAt && (
                    <p className="text-xs text-brand-text-light">
                      อนุมัติ {new Date(claim.reviewedAt).toLocaleDateString("th-TH")}
                    </p>
                  )}
                </div>
                <p className="text-sm font-bold text-brand-success">
                  +฿{claim.earnAmount.toLocaleString()}
                </p>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Payment History */}
      {confirmedPayments.length > 0 && (
        <Card variant="elevated" padding="none" className="border-none shadow-lg shadow-brand-primary/5 overflow-hidden">
          <div className="px-6 py-4 border-b border-brand-border/30">
            <h2 className="font-bold text-brand-text-dark flex items-center gap-2">
              <div className="p-2 rounded-lg bg-brand-accent/10">
                <CheckCircle2 className="w-4 h-4 text-brand-accent" />
              </div>
              ประวัติการรับเงิน
            </h2>
          </div>
          <div className="divide-y divide-brand-border/30">
            {confirmedPayments.map((p) => (
              <div key={p.id} className="px-6 py-4 flex items-center justify-between hover:bg-brand-bg/50 transition-colors">
                <div>
                  <p className="text-sm font-semibold text-brand-text-dark">
                    {p.seller?.displayName ?? "แม่ทีม"}
                  </p>
                  <p className="text-xs text-brand-text-light mt-0.5">
                    {p.confirmedAt
                      ? new Date(p.confirmedAt).toLocaleDateString("th-TH")
                      : "-"}
                  </p>
                </div>
                <div className="text-right flex items-center gap-3">
                  <p className="text-sm font-bold text-brand-text-dark">
                    ฿{p.amount.toLocaleString()}
                  </p>
                  <Badge variant="success" size="sm">รับแล้ว</Badge>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Empty State */}
      {approvedClaims.length === 0 &&
        pendingPayments.length === 0 &&
        confirmedPayments.length === 0 && (
          <Card variant="elevated" className="border-none shadow-md">
            <div className="text-center py-16">
              <div className="w-16 h-16 rounded-full bg-brand-secondary flex items-center justify-center mx-auto mb-4">
                <Coins className="w-8 h-8 text-brand-text-light" />
              </div>
              <p className="text-lg font-semibold text-brand-text-dark">ยังไม่มีรายได้</p>
              <p className="text-sm text-brand-text-light mt-1">
                เริ่มรับงานและส่งงานเพื่อสะสมรายได้
              </p>
            </div>
          </Card>
        )}
    </div>
  );
}
