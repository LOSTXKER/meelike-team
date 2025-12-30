"use client";

import Link from "next/link";
import { useAuthStore } from "@/lib/store";
import { Card, Button, Badge, Progress, StatsCard } from "@/components/ui";
import { PageHeader } from "@/components/shared";
import { formatCurrency, formatDate, getLevelInfo } from "@/lib/utils";
import { mockWorkerStats } from "@/lib/mock-data";
import {
  Wallet,
  TrendingUp,
  CreditCard,
  Clock,
  CheckCircle,
  ArrowUpRight,
  ArrowDownRight,
  Star,
  DollarSign,
  ClipboardList,
  Trophy,
} from "lucide-react";

export default function WorkerEarningsPage() {
  const { user } = useAuthStore();
  const worker = user?.worker;
  const levelInfo = getLevelInfo(worker?.level || "bronze");

  // Mock transactions
  const transactions = [
    {
      id: 1,
      type: "earn",
      description: "งาน: 500 ไลค์ FB",
      amount: 6,
      date: "2024-12-30",
      status: "completed",
    },
    {
      id: 2,
      type: "earn",
      description: "งาน: 100 เม้น FB",
      amount: 5,
      date: "2024-12-30",
      status: "pending",
    },
    {
      id: 3,
      type: "withdraw",
      description: "ถอนเงิน - กสิกร",
      amount: -100,
      date: "2024-12-29",
      status: "completed",
    },
    {
      id: 4,
      type: "bonus",
      description: "Streak Bonus 7 วัน",
      amount: 15,
      date: "2024-12-28",
      status: "completed",
    },
  ];

  // Calculate level progress
  const levelThresholds = {
    bronze: { min: 0, max: 50 },
    silver: { min: 51, max: 200 },
    gold: { min: 201, max: 500 },
    platinum: { min: 501, max: 1000 },
    vip: { min: 1001, max: Infinity },
  };
  const currentThreshold = levelThresholds[worker?.level || "bronze"];
  const progressToNextLevel =
    ((worker?.totalJobsCompleted || 0 - currentThreshold.min) /
      (currentThreshold.max - currentThreshold.min)) *
    100;

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <PageHeader
        title="รายได้"
        description="ติดตามรายได้และถอนเงิน"
        icon={DollarSign}
        iconClassName="text-brand-success"
      />

      {/* Balance Card */}
      <Card className="bg-gradient-to-br from-brand-primary to-brand-primary/80 text-white">
        <div className="text-center mb-6">
          <p className="text-white/80 text-sm flex items-center justify-center gap-1">
            <DollarSign className="w-4 h-4" />
            ยอดพร้อมถอน
          </p>
          <p className="text-4xl font-bold mt-2">
            {formatCurrency(mockWorkerStats.availableBalance)}
          </p>
        </div>

        <div className="grid grid-cols-2 gap-4 py-4 border-t border-white/20">
          <div className="text-center">
            <p className="text-white/80 text-sm">รอตรวจสอบ</p>
            <p className="text-xl font-bold">
              {formatCurrency(mockWorkerStats.pendingBalance)}
            </p>
          </div>
          <div className="text-center">
            <p className="text-white/80 text-sm">ถอนไปแล้ว</p>
            <p className="text-xl font-bold">
              {formatCurrency(mockWorkerStats.totalEarned)}
            </p>
          </div>
        </div>

        <Link href="/work/earnings/withdraw" className="block mt-4">
          <Button
            variant="secondary"
            className="w-full bg-white text-brand-primary hover:bg-white/90"
            leftIcon={<CreditCard className="w-4 h-4" />}
          >
            ถอนเงิน
          </Button>
        </Link>
      </Card>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4">
        <Card variant="bordered">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-brand-success/10">
              <TrendingUp className="w-5 h-5 text-brand-success" />
            </div>
            <div>
              <p className="text-xl font-bold text-brand-text-dark">
                {formatCurrency(mockWorkerStats.todayEarned)}
              </p>
              <p className="text-xs text-brand-text-light">รายได้วันนี้</p>
            </div>
          </div>
        </Card>
        <Card variant="bordered">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-brand-info/20">
              <CheckCircle className="w-5 h-5 text-brand-info" />
            </div>
            <div>
              <p className="text-xl font-bold text-brand-text-dark">
                {worker?.totalJobsCompleted}
              </p>
              <p className="text-xs text-brand-text-light">งานสำเร็จ</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Level Progress */}
      <Card variant="bordered">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Trophy className={`w-6 h-6 ${levelInfo.color}`} />
            <div>
              <p className="font-semibold text-brand-text-dark">
                Level: {levelInfo.name}
              </p>
              <p className="text-xs text-brand-text-light">
                {worker?.totalJobsCompleted} / {currentThreshold.max} งาน
              </p>
            </div>
          </div>
          <Badge variant="info">ค่าถอน 2%</Badge>
        </div>
        <Progress value={Math.min(progressToNextLevel, 100)} size="md" />
        <p className="text-xs text-brand-text-light mt-2">
          อีก {currentThreshold.max - (worker?.totalJobsCompleted || 0)} งาน
          ถึง Level ถัดไป
        </p>
      </Card>

      {/* Transactions */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-brand-text-dark flex items-center gap-2">
            <ClipboardList className="w-5 h-5 text-brand-primary" />
            ประวัติล่าสุด
          </h2>
          <Link
            href="/work/earnings/history"
            className="text-sm text-brand-primary hover:underline"
          >
            ดูทั้งหมด
          </Link>
        </div>

        <Card variant="bordered" padding="none">
          <div className="divide-y divide-brand-border">
            {transactions.map((tx) => (
              <div
                key={tx.id}
                className="flex items-center justify-between p-4"
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`p-2 rounded-lg ${
                      tx.type === "earn"
                        ? "bg-brand-success/10"
                        : tx.type === "bonus"
                        ? "bg-brand-warning/20"
                        : "bg-brand-error/10"
                    }`}
                  >
                    {tx.type === "earn" ? (
                      <ArrowUpRight className="w-4 h-4 text-brand-success" />
                    ) : tx.type === "bonus" ? (
                      <Star className="w-4 h-4 text-brand-warning" />
                    ) : (
                      <ArrowDownRight className="w-4 h-4 text-brand-error" />
                    )}
                  </div>
                  <div>
                    <p className="font-medium text-brand-text-dark">
                      {tx.description}
                    </p>
                    <p className="text-xs text-brand-text-light">
                      {formatDate(tx.date)}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p
                    className={`font-medium ${
                      tx.amount > 0 ? "text-brand-success" : "text-brand-error"
                    }`}
                  >
                    {tx.amount > 0 ? "+" : ""}
                    {formatCurrency(tx.amount)}
                  </p>
                  <Badge
                    variant={tx.status === "completed" ? "success" : "warning"}
                    size="sm"
                  >
                    {tx.status === "completed" ? "สำเร็จ" : "รอตรวจ"}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}

