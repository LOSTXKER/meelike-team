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
  Landmark,
  Coins,
  Receipt,
  Download
} from "lucide-react";

const transactions = [
  {
    id: "txn-1",
    type: "income",
    title: "รายได้จากออเดอร์ ORD-2024-001",
    amount: 385,
    date: "2024-12-30T14:30:00",
    status: "completed",
    desc: "ลูกค้า: @somchai_shop"
  },
  {
    id: "txn-2",
    type: "expense",
    title: "จ่ายค่าจ้าง Worker @นุ่น",
    amount: -50,
    date: "2024-12-30T12:00:00",
    status: "completed",
    desc: "งาน: Like Facebook 500"
  },
  {
    id: "txn-3",
    type: "topup",
    title: "เติมเงินผ่าน PromptPay",
    amount: 500,
    date: "2024-12-29T09:15:00",
    status: "completed",
    desc: "Ref: 12345678"
  },
  {
    id: "txn-4",
    type: "income",
    title: "รายได้จากออเดอร์ ORD-2024-002",
    amount: 150,
    date: "2024-12-28T16:45:00",
    status: "completed",
    desc: "ลูกค้า: @beauty_queen"
  },
  {
    id: "txn-5",
    type: "expense",
    title: "ค่า MeeLike API (Bot)",
    amount: -80,
    date: "2024-12-28T10:00:00",
    status: "completed",
    desc: "Service: Instagram Follower"
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
    <div className="space-y-8 animate-fade-in max-w-7xl mx-auto">
      {/* Header */}
      <PageHeader
        title="การเงิน"
        description="ตรวจสอบยอดเงินคงเหลือ รายรับ รายจ่าย และประวัติธุรกรรม"
        icon={Wallet}
        action={
          <div className="flex gap-2">
            <Link href="/seller/finance/history">
              <Button variant="outline" className="bg-white hover:bg-brand-bg text-brand-text-dark border-brand-border/50 shadow-sm rounded-xl">
                 <History className="w-4 h-4 mr-2" />
                 ประวัติธุรกรรม
              </Button>
            </Link>
            <Link href="/seller/finance/topup">
              <Button leftIcon={<Plus className="w-4 h-4" />} className="rounded-xl shadow-lg shadow-brand-primary/20">เติมเงินเข้าระบบ</Button>
            </Link>
          </div>
        }
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Balance Card */}
        <div className="lg:col-span-1 space-y-6">
          <Card className="bg-gradient-to-br from-[#8C6A54] to-[#6D5E54] text-white overflow-hidden relative border-none shadow-xl shadow-brand-primary/20 h-auto">
            {/* Decorative circles */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl" />
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-black/10 rounded-full translate-y-1/2 -translate-x-1/2 blur-2xl" />
            
            <div className="relative p-8 space-y-8">
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <p className="text-[#E8DED5] text-sm font-medium flex items-center gap-2">
                    <Wallet className="w-4 h-4" /> ยอดเงินคงเหลือ
                  </p>
                  <p className="text-5xl font-bold tracking-tight">
                    ฿{balance.toLocaleString()}
                  </p>
                </div>
                <button className="p-2.5 bg-white/10 rounded-xl hover:bg-white/20 transition-all backdrop-blur-sm border border-white/10">
                  <RefreshCw className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-3 pt-4 border-t border-white/10">
                <div className="flex items-center justify-between p-3 bg-white/10 rounded-xl backdrop-blur-md border border-white/5">
                   <div className="flex items-center gap-3">
                      <div className="p-2 bg-green-500/20 rounded-lg">
                        <TrendingUp className="w-4 h-4 text-green-300" />
                      </div>
                      <span className="text-[#E8DED5] text-sm">รายรับเดือนนี้</span>
                   </div>
                   <span className="font-bold text-lg">฿{stats.totalIncome.toLocaleString()}</span>
                </div>

                <div className="flex items-center justify-between p-3 bg-white/10 rounded-xl backdrop-blur-md border border-white/5">
                   <div className="flex items-center gap-3">
                      <div className="p-2 bg-red-500/20 rounded-lg">
                        <TrendingDown className="w-4 h-4 text-red-300" />
                      </div>
                      <span className="text-[#E8DED5] text-sm">รายจ่ายเดือนนี้</span>
                   </div>
                   <span className="font-bold text-lg">฿{stats.totalExpense.toLocaleString()}</span>
                </div>
                
                <div className="flex items-center justify-between p-3 bg-white/10 rounded-xl backdrop-blur-md border border-white/5">
                   <div className="flex items-center gap-3">
                      <div className="p-2 bg-orange-500/20 rounded-lg">
                        <History className="w-4 h-4 text-orange-300" />
                      </div>
                      <span className="text-[#E8DED5] text-sm">รอจ่ายให้ทีม</span>
                   </div>
                   <span className="font-bold text-lg text-orange-200">฿{stats.pendingPayout.toLocaleString()}</span>
                </div>
              </div>
            </div>
          </Card>

          {/* Quick Menu */}
          <div className="grid grid-cols-2 gap-3">
              <Link href="/seller/finance/topup" className="contents">
                <button className="flex flex-col items-center justify-center gap-2 p-4 bg-white border border-brand-border/50 rounded-xl hover:shadow-md hover:border-brand-primary/30 transition-all group">
                   <div className="w-10 h-10 rounded-full bg-brand-primary/5 flex items-center justify-center group-hover:bg-brand-primary/10 transition-colors">
                      <Plus className="w-5 h-5 text-brand-primary" />
                   </div>
                   <span className="text-sm font-medium text-brand-text-dark">เติมเงิน</span>
                </button>
              </Link>
              <Link href="/seller/team/payouts" className="contents">
                <button className="flex flex-col items-center justify-center gap-2 p-4 bg-white border border-brand-border/50 rounded-xl hover:shadow-md hover:border-brand-primary/30 transition-all group">
                   <div className="w-10 h-10 rounded-full bg-brand-warning/10 flex items-center justify-center group-hover:bg-brand-warning/20 transition-colors">
                      <Coins className="w-5 h-5 text-brand-warning" />
                   </div>
                   <span className="text-sm font-medium text-brand-text-dark">จ่ายทีม</span>
                </button>
              </Link>
              <Link href="/seller/finance/history" className="contents">
                <button className="flex flex-col items-center justify-center gap-2 p-4 bg-white border border-brand-border/50 rounded-xl hover:shadow-md hover:border-brand-primary/30 transition-all group">
                   <div className="w-10 h-10 rounded-full bg-brand-info/10 flex items-center justify-center group-hover:bg-brand-info/20 transition-colors">
                      <Receipt className="w-5 h-5 text-brand-info" />
                   </div>
                   <span className="text-sm font-medium text-brand-text-dark">ใบเสร็จ</span>
                </button>
              </Link>
              <button className="flex flex-col items-center justify-center gap-2 p-4 bg-white border border-brand-border/50 rounded-xl hover:shadow-md hover:border-brand-primary/30 transition-all group">
                 <div className="w-10 h-10 rounded-full bg-purple-50 flex items-center justify-center group-hover:bg-purple-100 transition-colors">
                    <Landmark className="w-5 h-5 text-purple-600" />
                 </div>
                 <span className="text-sm font-medium text-brand-text-dark">บัญชี</span>
              </button>
          </div>
        </div>

        {/* Right Column: Recent Transactions */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between p-1">
             <h2 className="font-bold text-lg text-brand-text-dark flex items-center gap-2">
                <History className="w-5 h-5 text-brand-primary" />
                ธุรกรรมล่าสุด
             </h2>
             <Link href="/seller/finance/history" className="text-sm text-brand-primary hover:underline flex items-center gap-1">
                ดูทั้งหมด <ChevronRight className="w-4 h-4" />
             </Link>
          </div>
          
          <div className="bg-white rounded-2xl shadow-sm border border-brand-border/50 overflow-hidden">
             <div className="divide-y divide-brand-border/30">
                {transactions.map((txn) => (
                  <div
                    key={txn.id}
                    className="p-5 flex items-center justify-between hover:bg-brand-bg/30 transition-colors group cursor-pointer"
                  >
                    <div className="flex items-start gap-4">
                      <div
                        className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 border shadow-sm ${
                          txn.type === "income"
                            ? "bg-brand-success/5 border-brand-success/20 text-brand-success"
                            : txn.type === "topup"
                            ? "bg-brand-info/5 border-brand-info/20 text-brand-info"
                            : "bg-brand-error/5 border-brand-error/20 text-brand-error"
                        }`}
                      >
                        {txn.type === "income" ? (
                          <ArrowDownRight className="w-6 h-6" />
                        ) : txn.type === "topup" ? (
                          <Plus className="w-6 h-6" />
                        ) : (
                          <ArrowUpRight className="w-6 h-6" />
                        )}
                      </div>
                      <div>
                        <p className="font-bold text-brand-text-dark text-base group-hover:text-brand-primary transition-colors">
                          {txn.title}
                        </p>
                        <p className="text-xs text-brand-text-light mt-1 flex items-center gap-2">
                          <span className="bg-brand-bg px-2 py-0.5 rounded text-brand-text-dark/70 font-medium">{txn.desc}</span>
                          <span>•</span>
                          <span>{new Date(txn.date).toLocaleDateString("th-TH", {
                            day: "numeric",
                            month: "short",
                            hour: "2-digit",
                            minute: "2-digit",
                          })}</span>
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p
                        className={`font-bold text-lg ${
                          txn.amount > 0 ? "text-brand-success" : "text-brand-error"
                        }`}
                      >
                        {txn.amount > 0 ? "+" : ""}฿{Math.abs(txn.amount).toLocaleString()}
                      </p>
                      <Badge
                        variant={txn.status === "completed" ? "success" : "warning"}
                        size="sm"
                        className="mt-1"
                      >
                        {txn.status === "completed" ? "สำเร็จ" : "รอดำเนินการ"}
                      </Badge>
                    </div>
                  </div>
                ))}
             </div>
             
             {/* Footer Actions */}
             <div className="p-4 bg-brand-bg/30 border-t border-brand-border/30 flex justify-center">
                <Button variant="ghost" size="sm" className="text-brand-text-light hover:text-brand-primary">
                   โหลดเพิ่ม...
                </Button>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
}

