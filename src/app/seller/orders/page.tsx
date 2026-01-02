"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button, Input } from "@/components/ui";
import { 
  PageHeader, 
  StatusBadge, 
  EmptyState, 
  FilterBar, 
  StatsGrid,
  AsyncBoundary,
  GenericDataTable,
  type Column
} from "@/components/shared";
import { formatCurrency, formatDateTime } from "@/lib/utils";
import { useSellerOrders } from "@/lib/api/hooks";
import { useFilters, useSort } from "@/lib/hooks";
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
  ChevronRight,
} from "lucide-react";

type OrderStatus = "all" | "pending" | "processing" | "completed" | "cancelled";

export default function OrdersPage() {
  const router = useRouter();
  const { data: orders, isLoading, error, refetch } = useSellerOrders();
  const [statusFilter, setStatusFilter] = useState<OrderStatus>("all");
  
  // Use new hooks for filtering
  const filterConfig = {
    status: (order: Order, value: any) => 
      value === "all" || order.status === value,
    search: (order: Order, value: any) => 
      !value || 
      order.orderNumber.toLowerCase().includes(value.toLowerCase()) ||
      order.customer.name.toLowerCase().includes(value.toLowerCase())
  };

  const { filteredItems, setFilter, filters } = useFilters(orders || [], filterConfig, {
    status: statusFilter,
    search: ""
  });

  // Use sort hook with custom comparator for profit
  const { sortedItems, sortBy, sortConfig } = useSort(filteredItems, 
    { key: "createdAt" as keyof Order, direction: "desc" },
    {
      profit: (a, b) => a.totalProfit - b.totalProfit
    }
  );

  const orderCounts = useMemo(() => ({
    all: orders?.length || 0,
    pending: orders?.filter((o: { status: string }) => o.status === "pending").length || 0,
    processing: orders?.filter((o: { status: string }) => o.status === "processing").length || 0,
    completed: orders?.filter((o: { status: string }) => o.status === "completed").length || 0,
    cancelled: orders?.filter((o: { status: string }) => o.status === "cancelled").length || 0,
  }), [orders]);

  // Update status filter when clicking on stats
  const handleFilterChange = (newFilter: OrderStatus) => {
    setStatusFilter(newFilter);
    setFilter("status", newFilter);
  };

  // Define columns for GenericDataTable
  const columns: Column<Order>[] = [
    {
      key: "orderNumber",
      label: "ออเดอร์",
      sortable: true,
      render: (_, order) => (
        <div className="flex flex-col">
          <span className="font-bold text-brand-text-dark text-sm">
            {order.orderNumber}
          </span>
          <span className="text-xs text-brand-text-light mt-0.5 flex items-center gap-1">
            <Calendar className="w-3 h-3" />
            {formatDateTime(order.createdAt)}
          </span>
        </div>
      )
    },
    {
      key: "customer",
      label: "ลูกค้า",
      render: (_, order) => (
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
      )
    },
    {
      key: "items",
      label: "บริการ",
      render: (_, order) => (
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
      )
    },
    {
      key: "total",
      label: "ยอดรวม",
      align: "right",
      sortable: true,
      render: (_, order) => (
        <span className="font-bold text-brand-primary text-sm">
          {formatCurrency(order.total)}
        </span>
      )
    },
    {
      key: "profit",
      label: "กำไร",
      align: "right",
      sortable: true,
      render: (_, order) => (
        <div className="flex flex-col items-end">
          <span className="font-medium text-brand-success text-sm">
            +{formatCurrency(order.totalProfit)}
          </span>
          <span className="text-[10px] text-brand-success/80 bg-brand-success/10 px-1.5 py-0.5 rounded">
            {Math.round((order.totalProfit / order.total) * 100)}%
          </span>
        </div>
      )
    },
    {
      key: "status",
      label: "สถานะ",
      sortable: true,
      render: (_, order) => (
        <div className="flex flex-col gap-1.5">
          <StatusBadge status={order.status} type="order" size="sm" />
          <div className="flex items-center gap-1 text-[10px] text-brand-text-light">
            <StatusBadge status={order.paymentStatus} type="payment" size="sm" />
          </div>
        </div>
      )
    },
    {
      key: "id",
      label: "จัดการ",
      align: "center",
      render: (_, order) => (
        <Button variant="ghost" size="sm" className="text-brand-text-light hover:text-brand-primary">
          <ChevronRight className="w-5 h-5" />
        </Button>
      )
    }
  ];

  return (
    <AsyncBoundary
      isLoading={isLoading}
      error={error}
      onRetry={refetch}
      isEmpty={(orders?.length || 0) === 0}
      emptyFallback={
        <EmptyState
          icon={Package}
          title="ยังไม่มีออเดอร์"
          description="สร้างออเดอร์แรกของคุณได้เลย"
          action={
            <Link href="/seller/orders/new">
              <Button>สร้างออเดอร์แรก</Button>
            </Link>
          }
        />
      }
    >
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
        <StatsGrid
          stats={[
            {
              label: "รอดำเนินการ",
              value: orderCounts.pending,
              icon: Clock,
              iconColor: "text-[#B06000]",
              iconBgColor: "bg-[#FEF7E0]",
              onClick: () => handleFilterChange("pending"),
            },
            {
              label: "กำลังดำเนินการ",
              value: orderCounts.processing,
              icon: Loader2,
              iconColor: "text-[#1967D2]",
              iconBgColor: "bg-[#E8F0FE]",
              onClick: () => handleFilterChange("processing"),
            },
            {
              label: "เสร็จสิ้น",
              value: orderCounts.completed,
              icon: CheckCircle2,
              iconColor: "text-[#1E8E3E]",
              iconBgColor: "bg-[#E6F4EA]",
              onClick: () => handleFilterChange("completed"),
            },
            {
              label: "ยกเลิก",
              value: orderCounts.cancelled,
              icon: XCircle,
              iconColor: "text-[#C5221F]",
              iconBgColor: "bg-[#FCE8E6]",
              onClick: () => handleFilterChange("cancelled"),
            },
          ]}
          columns={4}
        />

        {/* Filters */}
        <FilterBar<OrderStatus>
          filters={[
            { key: "all", label: "ทั้งหมด", count: orderCounts.all },
            { key: "pending", label: "รอทำ", count: orderCounts.pending, color: "warning" },
            { key: "processing", label: "กำลังทำ", count: orderCounts.processing, color: "info" },
            { key: "completed", label: "เสร็จ", count: orderCounts.completed, color: "success" },
            { key: "cancelled", label: "ยกเลิก", count: orderCounts.cancelled, color: "error" },
          ]}
          activeFilter={statusFilter}
          onFilterChange={handleFilterChange}
          showSearch={false}
        />

        {/* Orders Table */}
        <div className="bg-white rounded-2xl shadow-sm border border-brand-border/50 overflow-hidden">
          {/* Table Header with Search */}
          <div className="p-4 border-b border-brand-border/50">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div className="flex items-center gap-3 shrink-0">
                <h2 className="font-bold text-brand-text-dark">รายการออเดอร์</h2>
                <span className="text-sm text-brand-text-light bg-brand-bg px-2 py-0.5 rounded-full">
                  {sortedItems.length} รายการ
                </span>
              </div>
              <div className="w-full sm:w-auto sm:min-w-[280px]">
                <Input
                  placeholder="ค้นหาเลขออเดอร์, ชื่อลูกค้า..."
                  value={filters.search as string || ""}
                  onChange={(e) => setFilter("search", e.target.value)}
                  className="w-full border-brand-border/50 bg-brand-bg/50 focus:bg-white !py-2 !rounded-xl"
                  leftIcon={<Search className="w-4 h-4 text-brand-text-light" />}
                />
              </div>
            </div>
          </div>

          <GenericDataTable
            data={sortedItems}
            columns={columns}
            onRowClick={(order) => router.push(`/seller/orders/${order.id}`)}
            sortConfig={sortConfig}
            onSort={sortBy}
            emptyMessage="ไม่พบออเดอร์ที่ค้นหา"
          />
        </div>
      </div>
    </AsyncBoundary>
  );
}
