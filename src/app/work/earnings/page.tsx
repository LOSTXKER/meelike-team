"use client";

import { useMemo } from "react";
import Link from "next/link";
import { useAuthStore } from "@/lib/store";
import { Card, Button, Badge, Progress, Skeleton } from "@/components/ui";
import { Container, Grid, Section, VStack, HStack } from "@/components/layout";
import { StatCard } from "@/components/shared";
import { formatCurrency, formatDate, getLevelInfo } from "@/lib/utils";
import { useWorkerStats, useWorkerJobs } from "@/lib/api/hooks";
import {
  Wallet,
  TrendingUp,
  CreditCard,
  CheckCircle,
  ArrowUpRight,
  ArrowDownRight,
  Star,
  DollarSign,
  ClipboardList,
  Trophy,
  Flame,
  Target,
  ArrowRight,
  History,
} from "lucide-react";

export default function WorkerEarningsPage() {
  const { user } = useAuthStore();
  const worker = user?.worker;
  const levelInfo = getLevelInfo(worker?.level || "bronze");

  // Use API hooks
  const { data: workerStats, isLoading } = useWorkerStats();
  const { data: workerJobs } = useWorkerJobs();

  // Derive transactions from completed jobs
  const transactions = useMemo(() => {
    if (!workerJobs) return [];
    
    const earnTransactions = workerJobs.completed
      .filter(job => job.earnings)
      .map((job, index) => ({
        id: index + 1,
        type: "earn" as const,
        description: `งาน: ${job.serviceName}`,
        amount: job.earnings || 0,
        date: job.completedAt || new Date().toISOString(),
        status: "completed" as const,
      }));
    
    // Mock withdrawals for display (would come from separate withdrawal system)
    const mockWithdrawals = [
      {
        id: 900,
        type: "withdraw" as const,
        description: "ถอนเงิน - กสิกร",
        amount: -100,
        date: "2024-12-29",
        status: "completed" as const,
      },
    ];
    
    return [...earnTransactions, ...mockWithdrawals].sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
    );
  }, [workerJobs]);

  // Calculate level progress
  const levelThresholds = {
    bronze: { min: 0, max: 50, next: "Silver" },
    silver: { min: 51, max: 200, next: "Gold" },
    gold: { min: 201, max: 500, next: "Platinum" },
    platinum: { min: 501, max: 1000, next: "VIP" },
    vip: { min: 1001, max: Infinity, next: "VIP" },
  };
  const currentThreshold = levelThresholds[worker?.level || "bronze"];
  const progressToNextLevel =
    ((worker?.totalJobsCompleted || 0 - currentThreshold.min) /
      (currentThreshold.max - currentThreshold.min)) *
    100;

  if (isLoading) {
    return (
      <div className="space-y-8 animate-fade-in max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <Skeleton className="h-10 w-48 mb-2" />
            <Skeleton className="h-5 w-64" />
          </div>
          <Skeleton className="h-10 w-36" />
        </div>
        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1 space-y-6">
            <Skeleton className="h-72 rounded-2xl" />
            <Skeleton className="h-48 rounded-2xl" />
          </div>
          <div className="lg:col-span-2 space-y-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[1, 2, 3, 4].map((i) => (
                <Skeleton key={i} className="h-24 rounded-xl" />
              ))}
            </div>
            <Skeleton className="h-96 rounded-2xl" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <Container size="xl">
      <Section spacing="lg" className="animate-fade-in">
        {/* Header */}
        <HStack justify="between" align="center" className="flex-col sm:flex-row gap-4">
          <VStack gap={2}>
            <HStack gap={3} align="center" className="text-3xl font-bold text-brand-text-dark tracking-tight">
              <span className="p-2.5 bg-brand-success/10 rounded-xl">
                <DollarSign className="w-7 h-7 text-brand-success" />
              </span>
              รายได้ของฉัน
            </HStack>
            <p className="text-brand-text-light text-lg">
              ติดตามรายได้และจัดการการถอนเงิน
            </p>
          </VStack>
          <Link href="/work/earnings/history">
            <Button variant="outline" className="bg-white shadow-sm" leftIcon={<History className="w-4 h-4" />}>
              ดูประวัติทั้งหมด
            </Button>
          </Link>
        </HStack>

        <div className="grid lg:grid-cols-3 gap-8">
        {/* Left Column: Balance & Quick Stats */}
        <div className="lg:col-span-1 space-y-6">
          {/* Balance Card */}
          <Card className="bg-gradient-to-br from-[#8C6A54] to-[#6D5E54] text-white border-none shadow-xl shadow-brand-primary/20 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
            <div className="absolute bottom-0 left-0 w-32 h-32 bg-black/10 rounded-full blur-2xl translate-y-1/2 -translate-x-1/2" />
            
            <div className="relative">
              <div className="text-center mb-6">
                <p className="text-[#E8DED5] text-sm flex items-center justify-center gap-2 mb-2 font-medium uppercase tracking-wide">
                  <span className="p-1.5 rounded-full bg-white/10 backdrop-blur-sm">
                    <Wallet className="w-4 h-4" />
                  </span>
                  ยอดเงินที่ถอนได้
                </p>
                <p className="text-4xl font-bold tracking-tight text-white drop-shadow-sm">
                  {formatCurrency(workerStats?.availableBalance || 0)}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3 py-4 border-t border-white/20">
                <div className="text-center p-3 bg-white/10 backdrop-blur-sm rounded-xl border border-white/10">
                  <p className="text-white/80 text-xs font-medium">รอตรวจสอบ</p>
                  <p className="text-lg font-bold mt-1">
                    {formatCurrency(workerStats?.pendingBalance || 0)}
                  </p>
                </div>
                <div className="text-center p-3 bg-white/10 backdrop-blur-sm rounded-xl border border-white/10">
                  <p className="text-white/80 text-xs font-medium">ถอนไปแล้ว</p>
                  <p className="text-lg font-bold mt-1">
                    {formatCurrency(workerStats?.totalEarned || 0)}
                  </p>
                </div>
              </div>

              <Link href="/work/earnings/withdraw" className="block mt-4">
                <Button
                  size="lg"
                  className="w-full bg-white text-brand-primary hover:bg-[#F4EFEA] border-none shadow-lg shadow-black/10 font-bold"
                >
                  <CreditCard className="w-5 h-5 mr-2" />
                  แจ้งถอนเงิน
                </Button>
              </Link>
            </div>
          </Card>

          {/* Level Progress Card */}
          <Card variant="elevated" className="border-none shadow-lg shadow-brand-primary/5 relative overflow-hidden">
            <div className="absolute -top-8 -right-8 w-24 h-24 bg-brand-warning/10 rounded-full blur-2xl" />
            <div className="relative">
              <div className="flex items-center gap-4 mb-4">
                <div className={`p-3 rounded-xl ${levelInfo.color.replace('text-', 'bg-')}/10 shadow-sm`}>
                  <Trophy className={`w-7 h-7 ${levelInfo.color}`} />
                </div>
                <div>
                  <p className="font-bold text-brand-text-dark text-xl">
                    {levelInfo.name}
                  </p>
                  <p className="text-sm text-brand-text-light">
                    {worker?.totalJobsCompleted} / {currentThreshold.max} งาน
                  </p>
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-brand-text-light">ความคืบหน้าสู่ {currentThreshold.next}</span>
                  <span className="font-bold text-brand-text-dark">{Math.round(Math.min(progressToNextLevel, 100))}%</span>
                </div>
                <Progress value={Math.min(progressToNextLevel, 100)} className="h-2.5" />
              </div>
              
              <div className="flex gap-2 mt-4">
                <Badge variant="info" className="shadow-sm">ค่าถอน {levelInfo.fee}%</Badge>
                <Badge variant="success" className="shadow-sm">โบนัส +{levelInfo.bonus}%</Badge>
              </div>
            </div>
          </Card>
        </div>

        {/* Right Column: Stats & Transactions */}
        <div className="lg:col-span-2 space-y-6">
          {/* Quick Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Card variant="elevated" className="border-none shadow-md hover:-translate-y-1 transition-transform">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-brand-success/10">
                  <TrendingUp className="w-5 h-5 text-brand-success" />
                </div>
                <div>
                  <p className="text-xl font-bold text-brand-text-dark leading-none">
                    {formatCurrency(workerStats?.todayEarned || 0)}
                  </p>
                  <p className="text-xs text-brand-text-light mt-1">วันนี้</p>
                </div>
              </div>
            </Card>
            <Card variant="elevated" className="border-none shadow-md hover:-translate-y-1 transition-transform">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-brand-info/10">
                  <CheckCircle className="w-5 h-5 text-brand-info" />
                </div>
                <div>
                  <p className="text-xl font-bold text-brand-text-dark leading-none">
                    {worker?.totalJobsCompleted}
                  </p>
                  <p className="text-xs text-brand-text-light mt-1">งานสำเร็จ</p>
                </div>
              </div>
            </Card>
            <Card variant="elevated" className="border-none shadow-md hover:-translate-y-1 transition-transform">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-brand-warning/10">
                  <Flame className="w-5 h-5 text-brand-warning" />
                </div>
                <div>
                  <p className="text-xl font-bold text-brand-text-dark leading-none">
                    7 วัน
                  </p>
                  <p className="text-xs text-brand-text-light mt-1">Streak</p>
                </div>
              </div>
            </Card>
            <Card variant="elevated" className="border-none shadow-md hover:-translate-y-1 transition-transform">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-brand-accent/10">
                  <Target className="w-5 h-5 text-brand-accent" />
                </div>
                <div>
                  <p className="text-xl font-bold text-brand-text-dark leading-none">
                    98%
                  </p>
                  <p className="text-xs text-brand-text-light mt-1">ผ่านตรวจ</p>
                </div>
              </div>
            </Card>
          </div>

          {/* Transactions */}
          <Card variant="elevated" padding="none" className="border-none shadow-lg shadow-brand-primary/5 overflow-hidden">
            <div className="p-5 border-b border-brand-border/50 flex items-center justify-between">
              <h2 className="text-lg font-bold text-brand-text-dark flex items-center gap-2">
                <ClipboardList className="w-5 h-5 text-brand-primary" />
                ธุรกรรมล่าสุด
              </h2>
              <Link
                href="/work/earnings/history"
                className="text-sm font-medium text-brand-primary hover:text-brand-primary/80 transition-colors flex items-center gap-1"
              >
                ดูทั้งหมด <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
            
            <div className="divide-y divide-brand-border/50">
              {transactions.map((tx) => (
                <div
                  key={tx.id}
                  className="flex items-center justify-between p-5 hover:bg-brand-bg/30 transition-colors group"
                >
                  <div className="flex items-center gap-4">
                    <div
                      className={`p-3 rounded-2xl shadow-sm transition-transform group-hover:scale-105 ${
                        tx.type === "earn"
                          ? "bg-brand-success/10"
                          : "bg-brand-error/10"
                      }`}
                    >
                      {tx.type === "earn" ? (
                        <ArrowUpRight className="w-5 h-5 text-brand-success" />
                      ) : (
                        <ArrowDownRight className="w-5 h-5 text-brand-error" />
                      )}
                    </div>
                    <div>
                      <p className="font-bold text-brand-text-dark text-base mb-0.5">
                        {tx.description}
                      </p>
                      <p className="text-xs text-brand-text-light font-medium">
                        {formatDate(tx.date)}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p
                      className={`font-bold text-lg mb-1 ${
                        tx.amount > 0 ? "text-brand-success" : "text-brand-error"
                      }`}
                    >
                      {tx.amount > 0 ? "+" : ""}
                      {formatCurrency(tx.amount)}
                    </p>
                    <Badge
                      variant={tx.status === "completed" ? "success" : "warning"}
                      size="sm"
                      className="font-bold text-[10px] px-2 py-0.5 uppercase tracking-wide"
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
      </Section>
    </Container>
  );
}
