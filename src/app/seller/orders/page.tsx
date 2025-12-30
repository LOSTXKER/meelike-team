"use client";

import { useState } from "react";
import Link from "next/link";
import { Card, Button, Badge, Input } from "@/components/ui";
import { PageHeader, StatusBadge, EmptyState } from "@/components/shared";
import { formatCurrency, formatDateTime } from "@/lib/utils";
import { mockOrders } from "@/lib/mock-data";
import type { Order } from "@/types";
import {
  Plus,
  Search,
  Package,
  Calendar,
  Clock,
  CheckCircle2,
  XCircle,
  Loader2,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  ChevronRight,
} from "lucide-react";

type OrderStatus = "all" | "pending" | "processing" | "completed" | "cancelled";

export default function OrdersPage() {
  const [orders] = useState<Order[]>(mockOrders);
  const [filter, setFilter] = useState<OrderStatus>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortConfig, setSortConfig] = useState<{ key: keyof Order | "profit"; direction: "asc" | "desc" }>({
    key: "createdAt",
    direction: "desc",
  });

  const filteredOrders = orders
    .filter((order) => {
      if (filter !== "all" && order.status !== filter) return false;
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        return (
          order.orderNumber.toLowerCase().includes(query) ||
          order.customer.name.toLowerCase().includes(query)
        );
      }
      return true;
    })
    .sort((a, b) => {
      let aValue: any = a[sortConfig.key as keyof Order];
      let bValue: any = b[sortConfig.key as keyof Order];

      if (sortConfig.key === "profit") {
        aValue = a.totalProfit;
        bValue = b.totalProfit;
      }

      if (aValue < bValue) return sortConfig.direction === "asc" ? -1 : 1;
      if (aValue > bValue) return sortConfig.direction === "asc" ? 1 : -1;
      return 0;
    });

  const handleSort = (key: keyof Order | "profit") => {
    setSortConfig((current) => ({
      key,
      direction: current.key === key && current.direction === "asc" ? "desc" : "asc",
    }));
  };

  const SortIcon = ({ column }: { column: keyof Order | "profit" }) => {
    if (sortConfig.key !== column) return <ArrowUpDown className="w-3 h-3 text-brand-text-light/30 opacity-0 group-hover:opacity-50" />;
    return sortConfig.direction === "asc" ? (
      <ArrowUp className="w-3 h-3 text-brand-primary" />
    ) : (
      <ArrowDown className="w-3 h-3 text-brand-primary" />
    );
  };

  const orderCounts = {
    all: orders.length,
    pending: orders.filter((o) => o.status === "pending").length,
    processing: orders.filter((o) => o.status === "processing").length,
    completed: orders.filter((o) => o.status === "completed").length,
    cancelled: orders.filter((o) => o.status === "cancelled").length,
  };

  return (
    <div className="space-y-8 animate-fade-in max-w-7xl mx-auto">
      {/* Header */}
      <PageHeader
        title="จัดการออเดอร์"
        description="ตรวจสอบและจัดการรายการสั่งซื้อทั้งหมดจากลูกค้า"
        icon={Package}
        action={
          <Link href="/seller/orders/new">
            <Button className="rounded-full shadow-lg shadow-brand-primary/20" leftIcon={<Plus className="w-4 h-4" />}>
              สร้างออเดอร์ใหม่
            </Button>
          </Link>
        }
      />

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card variant="elevated" className="border-none shadow-lg shadow-brand-primary/5 hover:-translate-y-1 transition-transform cursor-pointer" onClick={() => setFilter("pending")}>
          <div className="flex items-center gap-4 p-2">
            <div className="w-12 h-12 rounded-2xl bg-[#FEF7E0] flex items-center justify-center text-[#B06000]">
              <Clock className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-brand-text-light">รอดำเนินการ</p>
              <p className="text-2xl font-bold text-brand-text-dark">{orderCounts.pending}</p>
            </div>
          </div>
        </Card>
        <Card variant="elevated" className="border-none shadow-lg shadow-brand-primary/5 hover:-translate-y-1 transition-transform cursor-pointer" onClick={() => setFilter("processing")}>
          <div className="flex items-center gap-4 p-2">
            <div className="w-12 h-12 rounded-2xl bg-[#E8F0FE] flex items-center justify-center text-[#1967D2]">
              <Loader2 className="w-6 h-6 animate-spin-slow" />
            </div>
            <div>
              <p className="text-sm font-medium text-brand-text-light">กำลังดำเนินการ</p>
              <p className="text-2xl font-bold text-brand-text-dark">{orderCounts.processing}</p>
            </div>
          </div>
        </Card>
        <Card variant="elevated" className="border-none shadow-lg shadow-brand-primary/5 hover:-translate-y-1 transition-transform cursor-pointer" onClick={() => setFilter("completed")}>
          <div className="flex items-center gap-4 p-2">
            <div className="w-12 h-12 rounded-2xl bg-[#E6F4EA] flex items-center justify-center text-[#1E8E3E]">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-brand-text-light">เสร็จสิ้น</p>
              <p className="text-2xl font-bold text-brand-text-dark">{orderCounts.completed}</p>
            </div>
          </div>
        </Card>
        <Card variant="elevated" className="border-none shadow-lg shadow-brand-primary/5 hover:-translate-y-1 transition-transform cursor-pointer" onClick={() => setFilter("cancelled")}>
          <div className="flex items-center gap-4 p-2">
            <div className="w-12 h-12 rounded-2xl bg-[#FCE8E6] flex items-center justify-center text-[#C5221F]">
              <XCircle className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-brand-text-light">ยกเลิก</p>
              <p className="text-2xl font-bold text-brand-text-dark">{orderCounts.cancelled}</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-2">
        {[
          { value: "all", label: "ทั้งหมด", count: orderCounts.all },
          { value: "pending", label: "รอทำ", count: orderCounts.pending, color: "text-amber-600" },
          { value: "processing", label: "กำลังทำ", count: orderCounts.processing, color: "text-blue-600" },
          { value: "completed", label: "เสร็จ", count: orderCounts.completed, color: "text-green-600" },
          { value: "cancelled", label: "ยกเลิก", count: orderCounts.cancelled, color: "text-red-500" },
        ].map((item) => (
          <button
            key={item.value}
            onClick={() => setFilter(item.value as OrderStatus)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 border ${
              filter === item.value
                ? "bg-brand-primary text-white border-brand-primary shadow-md shadow-brand-primary/20"
                : "bg-white text-brand-text-light border-brand-border/50 hover:border-brand-primary/50 hover:text-brand-text-dark"
            }`}
          >
            {item.label}
            <span className={`ml-1.5 ${filter === item.value ? "text-white/80" : item.color || "text-brand-text-light"}`}>
              {item.count}
            </span>
          </button>
        ))}
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-brand-border/50 overflow-hidden">
        {/* Table Header with Search */}
        <div className="p-4 border-b border-brand-border/50">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div className="flex items-center gap-3 shrink-0">
              <h2 className="font-bold text-brand-text-dark">รายการออเดอร์</h2>
              <span className="text-sm text-brand-text-light bg-brand-bg px-2 py-0.5 rounded-full">{filteredOrders.length} รายการ</span>
            </div>
            <div className="w-full sm:w-auto sm:min-w-[280px]">
              <Input
                placeholder="ค้นหาเลขออเดอร์, ชื่อลูกค้า..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full border-brand-border/50 bg-brand-bg/50 focus:bg-white !py-2 !rounded-xl"
                leftIcon={<Search className="w-4 h-4 text-brand-text-light" />}
              />
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-brand-bg/50 border-b border-brand-border/50 text-xs text-brand-text-light uppercase tracking-wider">
                <th 
                  className="p-4 pl-6 font-medium cursor-pointer group hover:bg-brand-border/30 transition-colors"
                  onClick={() => handleSort("orderNumber")}
                >
                  <div className="flex items-center gap-2">
                    ออเดอร์
                    <SortIcon column="orderNumber" />
                  </div>
                </th>
                <th className="p-4 font-medium">ลูกค้า</th>
                <th className="p-4 font-medium">บริการ</th>
                <th 
                  className="p-4 font-medium text-right cursor-pointer group hover:bg-brand-border/30 transition-colors"
                  onClick={() => handleSort("total")}
                >
                  <div className="flex items-center justify-end gap-2">
                    ยอดรวม
                    <SortIcon column="total" />
                  </div>
                </th>
                <th 
                  className="p-4 font-medium text-right cursor-pointer group hover:bg-brand-border/30 transition-colors"
                  onClick={() => handleSort("profit")}
                >
                  <div className="flex items-center justify-end gap-2">
                    กำไร
                    <SortIcon column="profit" />
                  </div>
                </th>
                <th 
                  className="p-4 font-medium cursor-pointer group hover:bg-brand-border/30 transition-colors"
                  onClick={() => handleSort("status")}
                >
                  <div className="flex items-center gap-2">
                    สถานะ
                    <SortIcon column="status" />
                  </div>
                </th>
                <th className="p-4 font-medium text-center">จัดการ</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-brand-border/30">
              {filteredOrders.map((order) => (
                <tr 
                  key={order.id} 
                  className="group hover:bg-brand-primary/5 transition-colors cursor-pointer"
                  onClick={() => window.location.href = `/seller/orders/${order.id}`}
                >
                  <td className="p-4 pl-6">
                    <div className="flex flex-col">
                      <span className="font-bold text-brand-text-dark text-sm group-hover:text-brand-primary transition-colors">
                        {order.orderNumber}
                      </span>
                      <span className="text-xs text-brand-text-light mt-0.5 flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {formatDateTime(order.createdAt)}
                      </span>
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-brand-secondary flex items-center justify-center text-xs font-bold text-brand-primary border border-brand-border">
                        {order.customer.name.charAt(0)}
                      </div>
                      <div className="flex flex-col">
                        <span className="text-sm font-medium text-brand-text-dark">{order.customer.name}</span>
                        <span className="text-xs text-brand-text-light truncate max-w-[120px]">
                          {order.customer.contactType}: {order.customer.contactValue}
                        </span>
                      </div>
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="flex flex-col gap-1">
                      {order.items.slice(0, 2).map((item, idx) => (
                        <div key={idx} className="text-xs text-brand-text-dark truncate max-w-[200px] flex items-center gap-1.5">
                           <span className="w-1.5 h-1.5 rounded-full bg-brand-primary/50"></span>
                           {item.serviceName} <span className="text-brand-text-light">x{item.quantity}</span>
                        </div>
                      ))}
                      {order.items.length > 2 && (
                        <span className="text-xs text-brand-text-light pl-3">
                          +{order.items.length - 2} รายการอื่นๆ
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="p-4 text-right">
                    <span className="font-bold text-brand-primary text-sm">
                      {formatCurrency(order.total)}
                    </span>
                  </td>
                  <td className="p-4 text-right">
                    <div className="flex flex-col items-end">
                      <span className="font-medium text-brand-success text-sm">
                        +{formatCurrency(order.totalProfit)}
                      </span>
                      <span className="text-[10px] text-brand-success/80 bg-brand-success/10 px-1.5 py-0.5 rounded">
                        {Math.round((order.totalProfit / order.total) * 100)}%
                      </span>
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="flex flex-col gap-1.5">
                       <StatusBadge status={order.status} type="order" size="sm" />
                       <div className="flex items-center gap-1 text-[10px] text-brand-text-light">
                          <StatusBadge status={order.paymentStatus} type="payment" size="sm" />
                       </div>
                    </div>
                  </td>
                  <td className="p-4 text-center" onClick={(e) => e.stopPropagation()}>
                    <Link href={`/seller/orders/${order.id}`}>
                      <Button variant="ghost" size="sm" className="text-brand-text-light hover:text-brand-primary">
                        <ChevronRight className="w-5 h-5" />
                      </Button>
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredOrders.length === 0 && (
          <div className="p-12">
            <EmptyState
              icon={Package}
              title="ไม่พบออเดอร์"
              description="ลองเปลี่ยนตัวกรองหรือสร้างออเดอร์ใหม่"
              action={
                <Link href="/seller/orders/new">
                  <Button className="rounded-full">สร้างออเดอร์ใหม่</Button>
                </Link>
              }
            />
          </div>
        )}
      </div>
    </div>
  );
}
