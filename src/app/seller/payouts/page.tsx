"use client";

import { useState } from "react";
import {
  Wallet,
  QrCode,
  Download,
  CheckCircle2,
  Users,
  Banknote,
  Landmark,
  X,
} from "lucide-react";
import { QRCodeSVG } from "qrcode.react";
import { Card, Button, Badge, Skeleton, Input } from "@/components/ui";
import { usePayoutChecklist, useConfirmPayout } from "@/lib/api/hooks/payouts";
import { generatePromptPayPayload } from "@/lib/utils/promptpay-qr";

interface WorkerPayout {
  workerId: string;
  workerName: string;
  promptPayId?: string;
  bankCode?: string;
  bankAccount?: string;
  totalOwed: number;
  jobCount: number;
}

function QRModal({
  worker,
  onClose,
}: {
  worker: WorkerPayout;
  onClose: () => void;
}) {
  const [amount, setAmount] = useState(worker.totalOwed);
  const payload = worker.promptPayId
    ? generatePromptPayPayload(worker.promptPayId, amount)
    : null;

  return (
    <div className="fixed inset-0 bg-brand-text-dark/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <Card variant="elevated" padding="lg" className="w-full max-w-sm border-none shadow-2xl">
        <div className="flex items-center justify-between mb-5">
          <h3 className="font-bold text-brand-text-dark flex items-center gap-2">
            <div className="p-2 rounded-lg bg-brand-primary/10">
              <QrCode className="w-4 h-4 text-brand-primary" />
            </div>
            โอนเงินให้ {worker.workerName}
          </h3>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-brand-secondary transition-colors text-brand-text-light"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {payload ? (
          <>
            <div className="flex justify-center mb-5">
              <div className="p-4 bg-white border-2 border-brand-border/30 rounded-2xl shadow-inner">
                <QRCodeSVG value={payload} size={200} />
              </div>
            </div>
            <div className="space-y-2 mb-4">
              <label className="text-sm font-medium text-brand-text-dark">
                จำนวนเงิน (บาท)
              </label>
              <Input
                type="number"
                value={amount}
                onChange={(e) => setAmount(parseFloat(e.target.value) || 0)}
                className="text-center text-xl font-bold"
              />
            </div>
            <p className="text-xs text-brand-text-light text-center mb-5">
              PromptPay: {worker.promptPayId}
            </p>
          </>
        ) : (
          <div className="text-center py-8 mb-5">
            <div className="w-14 h-14 rounded-full bg-brand-secondary flex items-center justify-center mx-auto mb-3">
              <Landmark className="w-7 h-7 text-brand-text-light" />
            </div>
            <p className="font-semibold text-brand-text-dark">ไม่มี PromptPay ID</p>
            <p className="text-sm text-brand-text-light mt-1">โอนผ่านธนาคาร:</p>
            {worker.bankCode && (
              <p className="font-mono text-sm text-brand-text-dark mt-1">
                {worker.bankCode}: {worker.bankAccount}
              </p>
            )}
          </div>
        )}

        <Button variant="primary" className="w-full" onClick={onClose}>
          ปิด
        </Button>
      </Card>
    </div>
  );
}

function PayoutRow({
  worker,
  onShowQR,
  onConfirm,
  isConfirming,
}: {
  worker: WorkerPayout;
  onShowQR: () => void;
  onConfirm: () => void;
  isConfirming: boolean;
}) {
  return (
    <div className="flex items-center gap-4 px-5 py-4 hover:bg-brand-bg/50 transition-colors">
      <div className="h-10 w-10 rounded-full bg-brand-primary/10 flex items-center justify-center text-brand-primary font-bold text-sm shrink-0">
        {worker.workerName?.charAt(0).toUpperCase()}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-brand-text-dark truncate">
          {worker.workerName}
        </p>
        <p className="text-xs text-brand-text-light">
          {worker.jobCount} งาน
          {worker.promptPayId ? ` · PromptPay ${worker.promptPayId}` : ""}
        </p>
      </div>
      <div className="text-right shrink-0">
        <p className="text-base font-bold text-brand-text-dark">
          ฿{worker.totalOwed.toLocaleString()}
        </p>
        <div className="flex gap-2 mt-1.5 justify-end">
          {worker.promptPayId && (
            <Button
              variant="outline"
              size="sm"
              onClick={onShowQR}
              leftIcon={<QrCode className="w-3 h-3" />}
            >
              QR
            </Button>
          )}
          <Button
            variant="success"
            size="sm"
            onClick={onConfirm}
            isLoading={isConfirming}
            leftIcon={<CheckCircle2 className="w-3 h-3" />}
          >
            โอนแล้ว
          </Button>
        </div>
      </div>
    </div>
  );
}

export default function PayoutsPage() {
  const { data, isLoading, refetch } = usePayoutChecklist();
  const confirmPayout = useConfirmPayout();
  const [qrWorker, setQrWorker] = useState<WorkerPayout | null>(null);

  const checklist = (data as { data?: { checklist: WorkerPayout[] } })?.data
    ?.checklist ?? [];

  const totalToPay = checklist.reduce((sum, w) => sum + w.totalOwed, 0);

  function handleExportCsv() {
    window.open("/api/seller/payouts/export", "_blank");
  }

  async function handleConfirm(worker: WorkerPayout) {
    try {
      const res = await fetch("/api/seller/payouts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          workerId: worker.workerId,
          amount: worker.totalOwed,
        }),
      });
      const newRecord = await res.json();
      if (newRecord?.paymentRecord?.id) {
        await confirmPayout.mutateAsync({ id: newRecord.paymentRecord.id });
        refetch();
      }
    } catch (err) {
      console.error("Confirm payout error:", err);
    }
  }

  if (isLoading) {
    return (
      <div className="space-y-6 animate-fade-in">
        <Skeleton className="h-8 w-48" />
        <div className="space-y-3">
          {[...Array(3)].map((_, i) => (
            <Skeleton key={i} className="h-20 w-full rounded-2xl" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {qrWorker && (
        <QRModal worker={qrWorker} onClose={() => setQrWorker(null)} />
      )}

      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-brand-text-dark flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-brand-primary/10 flex items-center justify-center">
              <Wallet className="w-5 h-5 text-brand-primary" />
            </div>
            จ่ายเงินสมาชิก
          </h1>
          <p className="text-sm text-brand-text-light mt-1 ml-[52px]">
            {checklist.length} คน รวม ฿{totalToPay.toLocaleString()}
          </p>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={handleExportCsv}
          leftIcon={<Download className="w-4 h-4" />}
        >
          Export CSV
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4">
        <Card variant="bordered" className="p-4 hover:shadow-md hover:border-brand-primary/20 transition-all">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-brand-warning/10">
              <Users className="w-4 h-4 text-brand-warning" />
            </div>
            <div>
              <p className="text-xs text-brand-text-light">รอจ่าย</p>
              <p className="text-lg font-bold text-brand-text-dark">{checklist.length} คน</p>
            </div>
          </div>
        </Card>
        <Card variant="bordered" className="p-4 hover:shadow-md hover:border-brand-primary/20 transition-all">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-brand-primary/10">
              <Banknote className="w-4 h-4 text-brand-primary" />
            </div>
            <div>
              <p className="text-xs text-brand-text-light">ยอดรวม</p>
              <p className="text-lg font-bold text-brand-text-dark">฿{totalToPay.toLocaleString()}</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Payout List */}
      {checklist.length === 0 ? (
        <Card variant="elevated" className="border-none shadow-md">
          <div className="text-center py-16">
            <div className="w-16 h-16 rounded-full bg-brand-success/10 flex items-center justify-center mx-auto mb-4">
              <CheckCircle2 className="w-8 h-8 text-brand-success" />
            </div>
            <p className="text-lg font-semibold text-brand-text-dark">จ่ายครบแล้ว!</p>
            <p className="text-sm text-brand-text-light mt-1">
              ไม่มีรายการรอการจ่ายเงิน
            </p>
          </div>
        </Card>
      ) : (
        <Card variant="elevated" padding="none" className="border-none shadow-lg shadow-brand-primary/5 overflow-hidden">
          <div className="divide-y divide-brand-border/30">
            {checklist.map((worker) => (
              <PayoutRow
                key={worker.workerId}
                worker={worker}
                onShowQR={() => setQrWorker(worker)}
                onConfirm={() => handleConfirm(worker)}
                isConfirming={confirmPayout.isPending}
              />
            ))}
          </div>
        </Card>
      )}

      {/* Hint */}
      <Card className="bg-brand-info/5 border-brand-info/20 p-4">
        <div className="flex items-start gap-3">
          <div className="p-1.5 rounded-lg bg-brand-info/10 shrink-0">
            <Banknote className="w-4 h-4 text-brand-info" />
          </div>
          <div className="text-sm text-brand-info">
            <p className="font-semibold mb-0.5">ตั้งเวลาจ่ายเงิน</p>
            <p>
              ไปที่{" "}
              <a href="/seller/settings/payment-schedule" className="underline font-medium">
                ตั้งค่าการชำระเงิน
              </a>{" "}
              เพื่อตั้งวันจ่ายเงินประจำสัปดาห์
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
}
