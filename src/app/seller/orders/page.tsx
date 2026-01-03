"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button, Input, Badge, Card } from "@/components/ui";
import { 
  PageHeader, 
  StatusBadge, 
  EmptyState, 
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
  Filter,
  ShoppingBag,
} from "lucide-react";

type OrderStatus = "all" | "pending" | "processing" | "completed" | "cancelled";

const STATUS_CONFIGS: Record<OrderStatus, { label: string; color: "default" | "warning" | "info" | "success" | "error"; icon?: typeof Clock }> = {
  all: { label: "ทั้งหมด", color: "default" },
  pending: { label: "รอทำ", color: "warning", icon: Clock },
  processing: { label: "กำลังทำ", color: "info", icon: Loader2 },
  completed: { label: "เสร็จ", color: "success", icon: CheckCircle2 },
  cancelled: { label: "ยกเลิก", color: "error", icon: XCircle },
};

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

  // Update status filter when clicking
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
          <StatusBadge status={order.paymentStatus} type="payment" size="sm" />
        </div>
      )
    },
    {
      key: "id",
      label: "",
      align: "center",
      render: (_, order) => (
        <Button variant="ghost" size="sm" className="text-brand-text-light hover:text-brand-primary">
          <ChevronRight className="w-5 h-5" />
        </Button>
      )
    }
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header - Always visible */}
      <PageHeader
        title="จัดการออเดอร์"
        description="ตรวจสอบและจัดการรายการสั่งซื้อทั้งหมดจากลูกค้า"
        icon={ShoppingBag}
        action={
          <Link href="/seller/orders/new">
            <Button leftIcon={<Plus className="w-4 h-4" />}>
              สร้างออเดอร์ใหม่
            </Button>
          </Link>
        }
      />

      {/* Summary Stats - Always visible */}
      <div className="flex flex-wrap items-center gap-3 p-4 bg-white rounded-xl border border-brand-border/50 shadow-sm">
        <span className="text-sm font-medium text-brand-text-dark mr-2">สถานะ:</span>
        {(["all", "pending", "processing", "completed", "cancelled"] as OrderStatus[]).map((status) => {
          const config = STATUS_CONFIGS[status];
          const count = orderCounts[status];
          const isActive = statusFilter === status;
          
          return (
            <button
              key={status}
              onClick={() => handleFilterChange(status)}
              className={`
                flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-all
                ${isActive 
                  ? 'bg-brand-primary text-white shadow-sm' 
                  : 'bg-brand-bg hover:bg-brand-bg/80 text-brand-text-light hover:text-brand-text-dark'
                }
              `}
            >
              {status !== "all" && config.icon && (
                <config.icon className={`w-3.5 h-3.5 ${isActive ? '' : 'opacity-60'}`} />
              )}
              <span>{config.label}</span>
              <span className={`
                px-1.5 py-0.5 rounded text-xs font-bold
                ${isActive ? 'bg-white/20' : 'bg-brand-border/50'}
              `}>
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Orders Content - Loading/Empty/Data states */}
      <AsyncBoundary
        isLoading={isLoading}
        error={error}
        onRetry={refetch}
        isEmpty={(orders?.length || 0) === 0}
        emptyFallback={
          <Card className="border-none shadow-md p-12">
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
          </Card>
        }
      >
        {/* Orders Table Card */}
        <Card className="border-none shadow-md overflow-hidden">
          {/* Table Header with Search */}
          <div className="p-4 border-b border-brand-border/30 bg-brand-bg/30">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div className="flex items-center gap-3">
                <Package className="w-5 h-5 text-brand-primary" />
                <h2 className="font-bold text-brand-text-dark">รายการออเดอร์</h2>
                <Badge variant="default" size="sm">{sortedItems.length} รายการ</Badge>
              </div>
              <div className="w-full sm:w-auto sm:min-w-[280px]">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-brand-text-light" />
                  <input
                    type="text"
                    placeholder="ค้นหาเลขออเดอร์, ชื่อลูกค้า..."
                    value={filters.search as string || ""}
                    onChange={(e) => setFilter("search", e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-brand-border/50 bg-white focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/10 outline-none text-sm"
                  />
                </div>
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
        </Card>
      </AsyncBoundary>
    </div>
  );
}
