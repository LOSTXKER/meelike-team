"use client";

import { useState } from "react";
import Link from "next/link";
import { Card, Badge, Button, Input } from "@/components/ui";
import { PageHeader, EmptyState } from "@/components/shared";
import {
  ArrowLeft,
  History,
  Search,
  Filter,
  ArrowUpRight,
  ArrowDownRight,
  Plus,
  Download,
  Calendar,
  Wallet,
  LayoutGrid,
  CheckCircle,
  TrendingUp,
  TrendingDown
} from "lucide-react";

const allTransactions = [
  {
    id: "txn-1",
    type: "income",
    category: "order",
    title: "รายได้จากออเดอร์ ORD-2024-001",
    description: "ไลค์ Facebook 1,000 + เม้น 50",
    amount: 385,
    date: "2024-12-30T14:30:00",
    status: "completed",
  },
  {
    id: "txn-2",
    type: "expense",
    category: "payout",
    title: "จ่ายค่าจ้าง Worker @นุ่น",
    description: "งาน JOB-001 - ไลค์ Facebook 30",
    amount: -50,
    date: "2024-12-30T12:00:00",
    status: "completed",
  },
  {
    id: "txn-3",
    type: "topup",
    category: "topup",
    title: "เติมเงินผ่าน PromptPay",
    description: "Ref: PP202412290915",
    amount: 500,
    date: "2024-12-29T09:15:00",
    status: "completed",
  },
  {
    id: "txn-4",
    type: "income",
    category: "order",
    title: "รายได้จากออเดอร์ ORD-2024-002",
    description: "Follow Instagram 200",
    amount: 150,
    date: "2024-12-28T16:45:00",
    status: "completed",
  },
  {
    id: "txn-5",
    type: "expense",
    category: "api",
    title: "ค่า MeeLike API (Bot)",
    description: "ไลค์ Facebook Bot 1,000",
    amount: -80,
    date: "2024-12-28T10:00:00",
    status: "completed",
  },
  {
    id: "txn-6",
    type: "expense",
    category: "payout",
    title: "จ่ายค่าจ้าง Worker @มิ้นท์",
    description: "งาน JOB-002 - เม้น 50",
    amount: -75,
    date: "2024-12-27T18:00:00",
    status: "completed",
  },
  {
    id: "txn-7",
    type: "income",
    category: "order",
    title: "รายได้จากออเดอร์ ORD-2024-003",
    description: "View TikTok 5,000",
    amount: 400,
    date: "2024-12-27T11:30:00",
    status: "completed",
  },
  {
    id: "txn-8",
    type: "topup",
    category: "topup",
    title: "เติมเงินผ่านโอนเงิน",
    description: "Ref: KBANK202412251000",
    amount: 1000,
    date: "2024-12-25T10:00:00",
    status: "completed",
  },
];

type FilterType = "all" | "income" | "expense" | "topup";

export default function FinanceHistoryPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [filter, setFilter] = useState<FilterType>("all");

  const filteredTransactions = allTransactions.filter((txn) => {
    const matchSearch =
      txn.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      txn.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchFilter = filter === "all" || txn.type === filter;
    return matchSearch && matchFilter;
  });

  const totalIncome = allTransactions
    .filter((t) => t.type === "income" || t.type === "topup")
    .reduce((sum, t) => sum + t.amount, 0);
  
  const totalExpense = allTransactions
    .filter((t) => t.type === "expense")
    .reduce((sum, t) => sum + Math.abs(t.amount), 0);

  return (
    <div className="space-y-8 animate-fade-in max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Link href="/seller/finance">
            <button className="p-2.5 hover:bg-white hover:shadow-sm rounded-xl transition-all border border-transparent hover:border-brand-border/50 text-brand-text-light hover:text-brand-primary">
              <ArrowLeft className="w-5 h-5" />
            </button>
          </Link>
          <PageHeader
            title="ประวัติธุรกรรม"
            description="รายการธุรกรรมและประวัติการเงินทั้งหมดของคุณ"
            icon={History}
          />
        </div>
        <Button variant="outline" className="bg-white hover:bg-brand-bg text-brand-text-dark border-brand-border/50 shadow-sm rounded-xl">
          <Download className="w-4 h-4 mr-2" />
          ส่งออกรายงาน (CSV)
        </Button>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card variant="elevated" className="border-none shadow-lg shadow-brand-primary/5 hover:-translate-y-1 transition-transform">
           <div className="flex flex-col items-center justify-center p-2 text-center">
             <div className="w-10 h-10 rounded-xl bg-brand-success/10 flex items-center justify-center text-brand-success mb-2">
               <TrendingUp className="w-5 h-5" />
             </div>
             <p className="text-2xl font-bold text-brand-success">+฿{totalIncome.toLocaleString()}</p>
             <p className="text-sm text-brand-text-light">รายรับรวม</p>
           </div>
        </Card>
        <Card variant="elevated" className="border-none shadow-lg shadow-brand-primary/5 hover:-translate-y-1 transition-transform">
           <div className="flex flex-col items-center justify-center p-2 text-center">
             <div className="w-10 h-10 rounded-xl bg-brand-error/10 flex items-center justify-center text-brand-error mb-2">
               <TrendingDown className="w-5 h-5" />
             </div>
             <p className="text-2xl font-bold text-brand-error">-฿{totalExpense.toLocaleString()}</p>
             <p className="text-sm text-brand-text-light">รายจ่ายรวม</p>
           </div>
        </Card>
        <Card variant="elevated" className="border-none shadow-lg shadow-brand-primary/5 hover:-translate-y-1 transition-transform">
           <div className="flex flex-col items-center justify-center p-2 text-center">
             <div className="w-10 h-10 rounded-xl bg-brand-primary/10 flex items-center justify-center text-brand-primary mb-2">
               <Wallet className="w-5 h-5" />
             </div>
             <p className="text-2xl font-bold text-brand-primary">฿{(totalIncome - totalExpense).toLocaleString()}</p>
             <p className="text-sm text-brand-text-light">ยอดสุทธิ</p>
           </div>
        </Card>
        <Card variant="elevated" className="border-none shadow-lg shadow-brand-primary/5 hover:-translate-y-1 transition-transform">
           <div className="flex flex-col items-center justify-center p-2 text-center">
             <div className="w-10 h-10 rounded-xl bg-brand-info/10 flex items-center justify-center text-brand-info mb-2">
               <History className="w-5 h-5" />
             </div>
             <p className="text-2xl font-bold text-brand-text-dark">{allTransactions.length}</p>
             <p className="text-sm text-brand-text-light">รายการทั้งหมด</p>
           </div>
        </Card>
      </div>

      {/* Filter & Search */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 bg-white p-4 rounded-2xl shadow-sm border border-brand-border/50">
        <div className="flex items-center gap-3 w-full lg:w-auto overflow-x-auto no-scrollbar">
          <div className="flex gap-1 p-1.5 bg-brand-bg/50 rounded-xl border border-brand-border/30 min-w-max">
            {[
              { key: "all", label: "ทั้งหมด", icon: LayoutGrid },
              { key: "income", label: "รายรับ", icon: ArrowDownRight },
              { key: "expense", label: "รายจ่าย", icon: ArrowUpRight },
              { key: "topup", label: "เติมเงิน", icon: Plus },
            ].map((f) => (
              <button
                key={f.key}
                onClick={() => setFilter(f.key as FilterType)}
                className={`flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 whitespace-nowrap ${
                  filter === f.key
                    ? "bg-white text-brand-text-dark shadow-sm ring-1 ring-black/5"
                    : "text-brand-text-light hover:text-brand-text-dark opacity-70 hover:opacity-100"
                }`}
              >
                <f.icon className={`w-4 h-4 ${filter === f.key ? "text-brand-primary" : ""}`} />
                <span>{f.label}</span>
              </button>
            ))}
          </div>
        </div>
        <div className="w-full lg:w-auto lg:min-w-[280px]">
          <Input
            placeholder="ค้นหาธุรกรรม, รหัส..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full border-brand-border/50 bg-brand-bg/50 focus:bg-white !py-2.5 !rounded-xl"
            leftIcon={<Search className="w-4 h-4 text-brand-text-light" />}
          />
        </div>
      </div>

      {/* Transactions List */}
      <div className="bg-white rounded-2xl shadow-sm border border-brand-border/50 overflow-hidden">
        <div className="divide-y divide-brand-border/30">
          {filteredTransactions.length === 0 ? (
            <EmptyState 
                icon={History} 
                title="ไม่พบรายการธุรกรรม" 
                description="ลองเปลี่ยนคำค้นหาหรือตัวกรองใหม่อีกครั้ง"
                className="py-12"
            />
          ) : (
            filteredTransactions.map((txn) => (
              <div
                key={txn.id}
                className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-brand-bg/30 transition-colors group cursor-pointer"
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
                    <p className="text-sm text-brand-text-light mt-0.5">
                      {txn.description}
                    </p>
                    <div className="flex items-center gap-2 mt-1.5 text-xs text-brand-text-light">
                      <span className="flex items-center gap-1 bg-brand-bg px-2 py-0.5 rounded">
                         <Calendar className="w-3 h-3" />
                         {new Date(txn.date).toLocaleDateString("th-TH", {
                          day: "numeric",
                          month: "long",
                          year: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex flex-row sm:flex-col items-center sm:items-end justify-between w-full sm:w-auto pl-16 sm:pl-0">
                  <p
                    className={`text-xl font-bold ${
                      txn.amount > 0 ? "text-brand-success" : "text-brand-error"
                    }`}
                  >
                    {txn.amount > 0 ? "+" : ""}฿{Math.abs(txn.amount).toLocaleString()}
                  </p>
                  <Badge
                    variant={
                      txn.category === "order"
                        ? "success"
                        : txn.category === "payout"
                        ? "warning"
                        : txn.category === "topup"
                        ? "info"
                        : "default"
                    }
                    size="sm"
                    className="border-none bg-opacity-10 sm:mt-1"
                  >
                    {txn.category === "order"
                      ? "ออเดอร์"
                      : txn.category === "payout"
                      ? "จ่ายทีม"
                      : txn.category === "topup"
                      ? "เติมเงิน"
                      : "API"}
                  </Badge>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}


