"use client";

import { useState } from "react";
import Link from "next/link";
import { Card, Button, Badge } from "@/components/ui";
import { PageHeader, EmptyState } from "@/components/shared";
import { formatCurrency, formatDate } from "@/lib/utils";
import {
  ArrowLeft,
  History,
  ArrowUpRight,
  ArrowDownRight,
  Star,
  Plus,
  Filter,
  Search,
  Calendar,
  Download,
  Wallet,
  ArrowUpCircle,
  ArrowDownCircle,
  Sparkles,
} from "lucide-react";

type TransactionType = "all" | "earn" | "withdraw" | "bonus";

interface Transaction {
  id: string;
  type: "earn" | "withdraw" | "bonus";
  description: string;
  amount: number;
  date: string;
  status: "completed" | "pending" | "rejected";
  teamName?: string;
  jobId?: string;
}

const mockTransactions: Transaction[] = [
  {
    id: "tx-1",
    type: "earn",
    description: "งาน: 500 ไลค์ FB",
    amount: 6,
    date: "2024-12-30",
    status: "completed",
    teamName: "JohnBoost Team",
    jobId: "job-1",
  },
  {
    id: "tx-2",
    type: "earn",
    description: "งาน: 100 เม้น FB",
    amount: 5,
    date: "2024-12-30",
    status: "pending",
    teamName: "JohnBoost Team",
    jobId: "job-2",
  },
  {
    id: "tx-3",
    type: "withdraw",
    description: "ถอนเงิน - กสิกร",
    amount: -100,
    date: "2024-12-29",
    status: "completed",
  },
  {
    id: "tx-4",
    type: "bonus",
    description: "Streak Bonus 7 วัน",
    amount: 15,
    date: "2024-12-28",
    status: "completed",
  },
  {
    id: "tx-5",
    type: "earn",
    description: "งาน: 200 Follow IG",
    amount: 10,
    date: "2024-12-27",
    status: "completed",
    teamName: "SocialPro Team",
    jobId: "job-3",
  },
  {
    id: "tx-6",
    type: "earn",
    description: "งาน: 1000 View TikTok",
    amount: 8,
    date: "2024-12-26",
    status: "completed",
    teamName: "SocialPro Team",
    jobId: "job-4",
  },
  {
    id: "tx-7",
    type: "withdraw",
    description: "ถอนเงิน - กสิกร",
    amount: -200,
    date: "2024-12-25",
    status: "completed",
  },
  {
    id: "tx-8",
    type: "bonus",
    description: "โบนัสงานแรกของวัน",
    amount: 5,
    date: "2024-12-25",
    status: "completed",
  },
  {
    id: "tx-9",
    type: "earn",
    description: "งาน: 300 ไลค์ FB",
    amount: 3.6,
    date: "2024-12-24",
    status: "completed",
    teamName: "BoostKing Team",
    jobId: "job-5",
  },
  {
    id: "tx-10",
    type: "withdraw",
    description: "ถอนเงิน - กสิกร",
    amount: -150,
    date: "2024-12-23",
    status: "rejected",
  },
];

const filterConfig = {
  all: { label: "ทั้งหมด", icon: <History className="w-4 h-4" /> },
  earn: { label: "รายได้", icon: <ArrowUpCircle className="w-4 h-4" /> },
  withdraw: { label: "ถอนเงิน", icon: <ArrowDownCircle className="w-4 h-4" /> },
  bonus: { label: "โบนัส", icon: <Sparkles className="w-4 h-4" /> },
};

export default function EarningsHistoryPage() {
  const [activeFilter, setActiveFilter] = useState<TransactionType>("all");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredTransactions = mockTransactions.filter((tx) => {
    const matchesType = activeFilter === "all" || tx.type === activeFilter;
    const matchesSearch = tx.description
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    return matchesType && matchesSearch;
  });

  const totalEarned = mockTransactions
    .filter((tx) => tx.type === "earn" && tx.status === "completed")
    .reduce((sum, tx) => sum + tx.amount, 0);

  const totalWithdrawn = mockTransactions
    .filter((tx) => tx.type === "withdraw" && tx.status === "completed")
    .reduce((sum, tx) => sum + Math.abs(tx.amount), 0);

  const totalBonus = mockTransactions
    .filter((tx) => tx.type === "bonus" && tx.status === "completed")
    .reduce((sum, tx) => sum + tx.amount, 0);

  return (
    <div className="space-y-8 animate-fade-in max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Link href="/work/earnings">
            <button className="p-2.5 hover:bg-white bg-white/50 border border-brand-border/50 rounded-xl transition-all shadow-sm group">
              <ArrowLeft className="w-5 h-5 text-brand-text-dark group-hover:text-brand-primary" />
            </button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-brand-text-dark flex items-center gap-2">
              <Wallet className="w-6 h-6 text-brand-primary" />
              ประวัติรายได้
            </h1>
            <p className="text-brand-text-light text-sm mt-0.5">ดูประวัติรายได้และการถอนเงินทั้งหมด</p>
          </div>
        </div>
        <Button variant="outline" className="bg-white border-brand-border/50 shadow-sm hidden sm:flex">
          <Download className="w-4 h-4 mr-2" />
          ดาวน์โหลด
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card variant="elevated" className="border-none shadow-md hover:-translate-y-1 transition-transform relative overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-brand-success/5 rounded-full blur-2xl -mr-8 -mt-8" />
          <div className="flex items-center gap-4 p-2 relative">
            <div className="p-3 bg-brand-success/10 rounded-2xl shadow-sm">
              <ArrowUpCircle className="w-8 h-8 text-brand-success" />
            </div>
            <div>
              <p className="text-xs font-medium text-brand-text-light uppercase tracking-wide mb-1">รายได้รวม</p>
              <p className="text-2xl font-bold text-brand-success leading-none">{formatCurrency(totalEarned)}</p>
            </div>
          </div>
        </Card>
        
        <Card variant="elevated" className="border-none shadow-md hover:-translate-y-1 transition-transform relative overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-brand-error/5 rounded-full blur-2xl -mr-8 -mt-8" />
          <div className="flex items-center gap-4 p-2 relative">
            <div className="p-3 bg-brand-error/10 rounded-2xl shadow-sm">
              <ArrowDownCircle className="w-8 h-8 text-brand-error" />
            </div>
            <div>
              <p className="text-xs font-medium text-brand-text-light uppercase tracking-wide mb-1">ถอนไปแล้ว</p>
              <p className="text-2xl font-bold text-brand-error leading-none">{formatCurrency(totalWithdrawn)}</p>
            </div>
          </div>
        </Card>
        
        <Card variant="elevated" className="border-none shadow-md hover:-translate-y-1 transition-transform relative overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-brand-warning/5 rounded-full blur-2xl -mr-8 -mt-8" />
          <div className="flex items-center gap-4 p-2 relative">
            <div className="p-3 bg-brand-warning/10 rounded-2xl shadow-sm">
              <Sparkles className="w-8 h-8 text-brand-warning" />
            </div>
            <div>
              <p className="text-xs font-medium text-brand-text-light uppercase tracking-wide mb-1">โบนัสรวม</p>
              <p className="text-2xl font-bold text-brand-warning leading-none">{formatCurrency(totalBonus)}</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Filter & List */}
      <div className="space-y-4">
        <div className="flex flex-col md:flex-row gap-4 justify-between items-start md:items-center">
          {/* Filter Tabs */}
          <div className="flex p-1 bg-brand-surface border border-brand-border/50 rounded-xl shadow-sm overflow-x-auto max-w-full">
            {(Object.keys(filterConfig) as TransactionType[]).map((filter) => (
              <button
                key={filter}
                onClick={() => setActiveFilter(filter)}
                className={`
                  flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold whitespace-nowrap transition-all duration-200
                  ${activeFilter === filter
                    ? "bg-brand-primary text-white shadow-md"
                    : "text-brand-text-light hover:text-brand-text-dark hover:bg-brand-bg/50"
                  }
                `}
              >
                {filterConfig[filter].icon}
                {filterConfig[filter].label}
              </button>
            ))}
          </div>

          {/* Search */}
          <div className="relative w-full md:w-auto md:min-w-[280px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-brand-text-light" />
            <input
              type="text"
              placeholder="ค้นหารายการ..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-brand-surface border border-brand-border/50 rounded-xl text-sm text-brand-text-dark placeholder:text-brand-text-light focus:outline-none focus:ring-2 focus:ring-brand-primary/10 focus:border-brand-primary transition-all shadow-sm"
            />
          </div>
        </div>

        {/* Transactions List */}
        <Card variant="elevated" padding="none" className="border-none shadow-lg shadow-brand-primary/5 overflow-hidden">
          {filteredTransactions.length === 0 ? (
            <div className="p-16 text-center">
              <div className="w-20 h-20 bg-brand-bg/50 rounded-full flex items-center justify-center mx-auto mb-4 border border-brand-border shadow-sm">
                <History className="w-10 h-10 text-brand-text-light" />
              </div>
              <p className="text-xl font-bold text-brand-text-dark mb-2">ไม่พบรายการ</p>
              <p className="text-brand-text-light text-sm max-w-xs mx-auto">ลองเปลี่ยนตัวกรองหรือค้นหาด้วยคำอื่น</p>
            </div>
          ) : (
            <div className="divide-y divide-brand-border/50">
              {filteredTransactions.map((tx) => (
                <div
                  key={tx.id}
                  className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-brand-bg/30 transition-colors group"
                >
                  <div className="flex items-start sm:items-center gap-4">
                    <div
                      className={`p-3 rounded-2xl shadow-sm transition-transform group-hover:scale-105 ${
                        tx.type === "earn"
                          ? "bg-brand-success/10"
                          : tx.type === "bonus"
                          ? "bg-brand-warning/10"
                          : "bg-brand-error/10"
                      }`}
                    >
                      {tx.type === "earn" ? (
                        <ArrowUpRight className="w-6 h-6 text-brand-success" />
                      ) : tx.type === "bonus" ? (
                        <Sparkles className="w-6 h-6 text-brand-warning" />
                      ) : (
                        <ArrowDownRight className="w-6 h-6 text-brand-error" />
                      )}
                    </div>
                    <div>
                      <p className="font-bold text-brand-text-dark text-lg mb-1 leading-tight">
                        {tx.description}
                      </p>
                      <div className="flex flex-wrap items-center gap-2 text-xs text-brand-text-light font-medium">
                        <span className="flex items-center gap-1 bg-brand-bg px-2 py-0.5 rounded-md border border-brand-border/30">
                          <Calendar className="w-3 h-3" />
                          {formatDate(tx.date)}
                        </span>
                        {tx.teamName && (
                          <span className="flex items-center gap-1 bg-brand-bg px-2 py-0.5 rounded-md border border-brand-border/30">
                            <span className="w-1.5 h-1.5 rounded-full bg-brand-primary"></span>
                            {tx.teamName}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between sm:block text-right pl-[3.25rem] sm:pl-0">
                    <p
                      className={`font-bold text-xl mb-1 ${
                        tx.amount > 0 ? "text-brand-success" : "text-brand-error"
                      }`}
                    >
                      {tx.amount > 0 ? "+" : ""}
                      {formatCurrency(tx.amount)}
                    </p>
                    <Badge
                      variant={
                        tx.status === "completed"
                          ? "success"
                          : tx.status === "pending"
                          ? "warning"
                          : "error"
                      }
                      size="sm"
                      className="font-bold text-[10px] px-2 py-0.5 uppercase tracking-wide shadow-sm"
                    >
                      {tx.status === "completed"
                        ? "สำเร็จ"
                        : tx.status === "pending"
                        ? "รอตรวจ"
                        : "ไม่อนุมัติ"}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>

      {/* Load More */}
      {filteredTransactions.length > 0 && (
        <div className="text-center pt-4">
          <Button variant="outline" className="bg-white border-brand-border/50 shadow-sm hover:bg-brand-bg px-8 py-6 h-auto text-base">
            โหลดเพิ่มเติม
          </Button>
        </div>
      )}
    </div>
  );
}
