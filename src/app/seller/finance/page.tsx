"use client";

import Link from "next/link";
import { Card, Badge, Button } from "@/components/ui";
import { PageHeader } from "@/components/shared";
import { useAuthStore } from "@/lib/store";
import {
  Wallet,
  TrendingUp,
  TrendingDown,
  ArrowUpRight,
  ArrowDownRight,
  CreditCard,
  History,
  RefreshCw,
  Plus,
  ChevronRight,
} from "lucide-react";

const transactions = [
  {
    id: "txn-1",
    type: "income",
    title: "รายได้จากออเดอร์ ORD-2024-001",
    amount: 385,
    date: "2024-12-30T14:30:00",
    status: "completed",
  },
  {
    id: "txn-2",
    type: "expense",
    title: "จ่ายค่าจ้าง Worker @นุ่น",
    amount: -50,
    date: "2024-12-30T12:00:00",
    status: "completed",
  },
  {
    id: "txn-3",
    type: "topup",
    title: "เติมเงินผ่าน PromptPay",
    amount: 500,
    date: "2024-12-29T09:15:00",
    status: "completed",
  },
  {
    id: "txn-4",
    type: "income",
    title: "รายได้จากออเดอร์ ORD-2024-002",
    amount: 150,
    date: "2024-12-28T16:45:00",
    status: "completed",
  },
  {
    id: "txn-5",
    type: "expense",
    title: "ค่า MeeLike API (Bot)",
    amount: -80,
    date: "2024-12-28T10:00:00",
    status: "completed",
  },
];

export default function FinancePage() {
  const { user } = useAuthStore();
  const balance = user?.seller?.balance || 2450;

  const stats = {
    totalIncome: 28500,
    totalExpense: 12350,
    pendingPayout: 1250,
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <PageHeader
        title="การเงิน"
        description="จัดการยอดเงินและธุรกรรมทั้งหมด"
        icon={Wallet}
        action={
          <Link href="/seller/finance/topup">
            <Button leftIcon={<Plus className="w-4 h-4" />}>เติมเงิน</Button>
          </Link>
        }
      />

      {/* Balance Card */}
      <Card className="bg-gradient-to-br from-brand-primary to-brand-secondary text-white overflow-hidden relative">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/2" />
        
        <div className="relative p-6 space-y-6">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-white/80 text-sm">ยอดเงินคงเหลือ</p>
              <p className="text-4xl font-bold mt-1">
                ฿{balance.toLocaleString()}
              </p>
            </div>
            <button className="p-2 bg-white/20 rounded-lg hover:bg-white/30 transition-colors">
              <RefreshCw className="w-5 h-5" />
            </button>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="bg-white/20 rounded-xl p-3">
              <div className="flex items-center gap-2 text-white/80 text-sm mb-1">
                <TrendingUp className="w-4 h-4" />
                รายรับ
              </div>
              <p className="text-lg font-semibold">
                ฿{stats.totalIncome.toLocaleString()}
              </p>
            </div>
            <div className="bg-white/20 rounded-xl p-3">
              <div className="flex items-center gap-2 text-white/80 text-sm mb-1">
                <TrendingDown className="w-4 h-4" />
                รายจ่าย
              </div>
              <p className="text-lg font-semibold">
                ฿{stats.totalExpense.toLocaleString()}
              </p>
            </div>
            <div className="bg-white/20 rounded-xl p-3">
              <div className="flex items-center gap-2 text-white/80 text-sm mb-1">
                <History className="w-4 h-4" />
                รอจ่าย
              </div>
              <p className="text-lg font-semibold">
                ฿{stats.pendingPayout.toLocaleString()}
              </p>
            </div>
          </div>
        </div>
      </Card>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Link href="/seller/finance/topup">
          <Card
            variant="bordered"
            padding="md"
            className="hover:border-brand-primary hover:bg-brand-primary/5 transition-all cursor-pointer group"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-brand-success/10 rounded-lg flex items-center justify-center group-hover:bg-brand-success/20 transition-colors">
                <Plus className="w-5 h-5 text-brand-success" />
              </div>
              <div>
                <p className="font-medium text-brand-text-dark">เติมเงิน</p>
                <p className="text-xs text-brand-text-light">PromptPay / Bank</p>
              </div>
            </div>
          </Card>
        </Link>

        <Link href="/seller/team/payout">
          <Card
            variant="bordered"
            padding="md"
            className="hover:border-brand-primary hover:bg-brand-primary/5 transition-all cursor-pointer group"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-brand-warning/10 rounded-lg flex items-center justify-center group-hover:bg-brand-warning/20 transition-colors">
                <CreditCard className="w-5 h-5 text-brand-warning" />
              </div>
              <div>
                <p className="font-medium text-brand-text-dark">จ่ายทีม</p>
                <p className="text-xs text-brand-text-light">รอจ่าย ฿{stats.pendingPayout}</p>
              </div>
            </div>
          </Card>
        </Link>

        <Link href="/seller/finance/history">
          <Card
            variant="bordered"
            padding="md"
            className="hover:border-brand-primary hover:bg-brand-primary/5 transition-all cursor-pointer group"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-brand-info/10 rounded-lg flex items-center justify-center group-hover:bg-brand-info/20 transition-colors">
                <History className="w-5 h-5 text-brand-info" />
              </div>
              <div>
                <p className="font-medium text-brand-text-dark">ประวัติ</p>
                <p className="text-xs text-brand-text-light">ธุรกรรมทั้งหมด</p>
              </div>
            </div>
          </Card>
        </Link>

        <Card
          variant="bordered"
          padding="md"
          className="hover:border-brand-primary hover:bg-brand-primary/5 transition-all cursor-pointer group"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-brand-primary/10 rounded-lg flex items-center justify-center group-hover:bg-brand-primary/20 transition-colors">
              <TrendingUp className="w-5 h-5 text-brand-primary" />
            </div>
            <div>
              <p className="font-medium text-brand-text-dark">รายงาน</p>
              <p className="text-xs text-brand-text-light">วิเคราะห์รายได้</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Recent Transactions */}
      <Card variant="bordered">
        <div className="p-4 border-b border-brand-border flex items-center justify-between">
          <h2 className="font-semibold text-brand-text-dark flex items-center gap-2">
            <CreditCard className="w-5 h-5 text-brand-primary" />
            ธุรกรรมล่าสุด
          </h2>
          <Link
            href="/seller/finance/history"
            className="text-sm text-brand-primary hover:underline flex items-center gap-1"
          >
            ดูทั้งหมด
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>
        <div className="divide-y divide-brand-border">
          {transactions.map((txn) => (
            <div
              key={txn.id}
              className="p-4 flex items-center justify-between hover:bg-brand-bg/50 transition-colors"
            >
              <div className="flex items-center gap-4">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    txn.type === "income"
                      ? "bg-brand-success/10"
                      : txn.type === "topup"
                      ? "bg-brand-info/10"
                      : "bg-brand-error/10"
                  }`}
                >
                  {txn.type === "income" ? (
                    <ArrowDownRight className="w-5 h-5 text-brand-success" />
                  ) : txn.type === "topup" ? (
                    <Plus className="w-5 h-5 text-brand-info" />
                  ) : (
                    <ArrowUpRight className="w-5 h-5 text-brand-error" />
                  )}
                </div>
                <div>
                  <p className="font-medium text-brand-text-dark text-sm">
                    {txn.title}
                  </p>
                  <p className="text-xs text-brand-text-light">
                    {new Date(txn.date).toLocaleDateString("th-TH", {
                      day: "numeric",
                      month: "short",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p
                  className={`font-semibold ${
                    txn.amount > 0 ? "text-brand-success" : "text-brand-error"
                  }`}
                >
                  {txn.amount > 0 ? "+" : ""}฿{Math.abs(txn.amount).toLocaleString()}
                </p>
                <Badge
                  variant={txn.status === "completed" ? "success" : "warning"}
                  size="sm"
                >
                  {txn.status === "completed" ? "สำเร็จ" : "รอดำเนินการ"}
                </Badge>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}

