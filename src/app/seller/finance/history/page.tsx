"use client";

import { useState } from "react";
import Link from "next/link";
import { Card, Badge, Button, Input } from "@/components/ui";
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
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/seller/finance">
            <button className="p-2 hover:bg-brand-bg rounded-lg transition-colors">
              <ArrowLeft className="w-5 h-5 text-brand-text-dark" />
            </button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-brand-text-dark flex items-center gap-2">
              <History className="w-7 h-7 text-brand-primary" />
              ประวัติธุรกรรม
            </h1>
            <p className="text-brand-text-light">
              รายการธุรกรรมทั้งหมดของคุณ
            </p>
          </div>
        </div>
        <Button variant="outline" size="sm">
          <Download className="w-4 h-4 mr-2" />
          ดาวน์โหลด
        </Button>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card variant="bordered" padding="md">
          <p className="text-sm text-brand-text-light">รายรับทั้งหมด</p>
          <p className="text-2xl font-bold text-brand-success">
            +฿{totalIncome.toLocaleString()}
          </p>
        </Card>
        <Card variant="bordered" padding="md">
          <p className="text-sm text-brand-text-light">รายจ่ายทั้งหมด</p>
          <p className="text-2xl font-bold text-brand-error">
            -฿{totalExpense.toLocaleString()}
          </p>
        </Card>
        <Card variant="bordered" padding="md">
          <p className="text-sm text-brand-text-light">ยอดสุทธิ</p>
          <p className="text-2xl font-bold text-brand-primary">
            ฿{(totalIncome - totalExpense).toLocaleString()}
          </p>
        </Card>
        <Card variant="bordered" padding="md">
          <p className="text-sm text-brand-text-light">จำนวนรายการ</p>
          <p className="text-2xl font-bold text-brand-text-dark">
            {allTransactions.length}
          </p>
        </Card>
      </div>

      {/* Filters */}
      <Card variant="bordered" padding="md">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <Input
              placeholder="ค้นหาธุรกรรม..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              leftIcon={<Search className="w-4 h-4" />}
            />
          </div>
          <div className="flex gap-2">
            {[
              { key: "all", label: "ทั้งหมด" },
              { key: "income", label: "รายรับ" },
              { key: "expense", label: "รายจ่าย" },
              { key: "topup", label: "เติมเงิน" },
            ].map((f) => (
              <button
                key={f.key}
                onClick={() => setFilter(f.key as FilterType)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  filter === f.key
                    ? "bg-brand-primary text-white"
                    : "bg-brand-bg text-brand-text-light hover:text-brand-text-dark"
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>
      </Card>

      {/* Transactions List */}
      <Card variant="bordered">
        <div className="divide-y divide-brand-border">
          {filteredTransactions.length === 0 ? (
            <div className="p-8 text-center">
              <Filter className="w-12 h-12 text-brand-text-light mx-auto mb-3" />
              <p className="text-brand-text-light">ไม่พบรายการที่ค้นหา</p>
            </div>
          ) : (
            filteredTransactions.map((txn) => (
              <div
                key={txn.id}
                className="p-4 flex items-center justify-between hover:bg-brand-bg/50 transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div
                    className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                      txn.type === "income"
                        ? "bg-brand-success/10"
                        : txn.type === "topup"
                        ? "bg-brand-info/10"
                        : "bg-brand-error/10"
                    }`}
                  >
                    {txn.type === "income" ? (
                      <ArrowDownRight className="w-6 h-6 text-brand-success" />
                    ) : txn.type === "topup" ? (
                      <Plus className="w-6 h-6 text-brand-info" />
                    ) : (
                      <ArrowUpRight className="w-6 h-6 text-brand-error" />
                    )}
                  </div>
                  <div>
                    <p className="font-medium text-brand-text-dark">
                      {txn.title}
                    </p>
                    <p className="text-sm text-brand-text-light">
                      {txn.description}
                    </p>
                    <div className="flex items-center gap-2 mt-1">
                      <Calendar className="w-3 h-3 text-brand-text-light" />
                      <span className="text-xs text-brand-text-light">
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
                <div className="text-right">
                  <p
                    className={`text-lg font-bold ${
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
      </Card>
    </div>
  );
}


