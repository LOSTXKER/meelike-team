"use client";

import { useState } from "react";
import Link from "next/link";
import { Card, Button, Badge, Progress, Input } from "@/components/ui";
import { PageHeader, ServiceTypeBadge, StatusBadge, EmptyState } from "@/components/shared";
import { formatCurrency, formatDateTime } from "@/lib/utils";
import { mockOrders } from "@/lib/mock-data";
import type { Order } from "@/types";
import { Plus, Search, Filter, Eye, MoreVertical, Package, User, Calendar } from "lucide-react";

type OrderStatus = "all" | "pending" | "processing" | "completed" | "cancelled";

export default function OrdersPage() {
  const [orders] = useState<Order[]>(mockOrders);
  const [filter, setFilter] = useState<OrderStatus>("all");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredOrders = orders.filter((order) => {
    if (filter !== "all" && order.status !== filter) return false;
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      return (
        order.orderNumber.toLowerCase().includes(query) ||
        order.customer.name.toLowerCase().includes(query)
      );
    }
    return true;
  });

  const orderCounts = {
    all: orders.length,
    pending: orders.filter((o) => o.status === "pending").length,
    processing: orders.filter((o) => o.status === "processing").length,
    completed: orders.filter((o) => o.status === "completed").length,
    cancelled: orders.filter((o) => o.status === "cancelled").length,
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <PageHeader
        title="ออเดอร์"
        description="จัดการออเดอร์ทั้งหมดจากลูกค้า"
        icon={Package}
        action={
          <Link href="/seller/orders/new">
            <Button leftIcon={<Plus className="w-4 h-4" />}>สร้างออเดอร์ใหม่</Button>
          </Link>
        }
      />

      {/* Stats Tabs */}
      <div className="flex flex-wrap gap-2">
        {(
          [
            { value: "all", label: "ทั้งหมด" },
            { value: "pending", label: "รอดำเนินการ" },
            { value: "processing", label: "กำลังทำ" },
            { value: "completed", label: "เสร็จแล้ว" },
            { value: "cancelled", label: "ยกเลิก" },
          ] as const
        ).map((item) => (
          <button
            key={item.value}
            onClick={() => setFilter(item.value)}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              filter === item.value
                ? "bg-brand-primary text-white"
                : "bg-brand-surface border border-brand-border text-brand-text-light hover:text-brand-text-dark"
            }`}
          >
            {item.label} ({orderCounts[item.value]})
          </button>
        ))}
      </div>

      {/* Search */}
      <div className="flex gap-4">
        <div className="flex-1">
          <Input
            placeholder="ค้นหาเลขออเดอร์หรือชื่อลูกค้า..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            leftIcon={<Search className="w-4 h-4" />}
          />
        </div>
        <Button variant="outline" leftIcon={<Filter className="w-4 h-4" />}>
          กรอง
        </Button>
      </div>

      {/* Orders List */}
      <div className="space-y-4">
        {filteredOrders.map((order) => (
          <Card key={order.id} variant="bordered">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-4">
              <div>
                <div className="flex items-center gap-3">
                  <h3 className="font-semibold text-brand-text-dark">
                    {order.orderNumber}
                  </h3>
                  <StatusBadge status={order.status} type="order" />
                  <StatusBadge status={order.paymentStatus} type="payment" size="sm" />
                </div>
                <p className="text-sm text-brand-text-light mt-1 flex items-center gap-1">
                  <User className="w-3 h-3" />
                  {order.customer.name} • {order.customer.contactType}:{" "}
                  {order.customer.contactValue}
                </p>
                <p className="text-xs text-brand-text-light mt-1 flex items-center gap-1">
                  <Calendar className="w-3 h-3" />
                  {formatDateTime(order.createdAt)}
                </p>
              </div>

              <div className="flex items-center gap-4">
                <div className="text-right">
                  <p className="text-lg font-bold text-brand-primary">
                    {formatCurrency(order.total)}
                  </p>
                  <p className="text-xs text-brand-success">
                    กำไร {formatCurrency(order.totalProfit)} (
                    {Math.round((order.totalProfit / order.total) * 100)}%)
                  </p>
                </div>
              </div>
            </div>

            {/* Items */}
            <div className="space-y-2 py-3 border-t border-brand-border">
              {order.items.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between p-3 rounded-lg bg-brand-bg"
                >
                  <div className="flex items-center gap-3">
                    <div>
                      <p className="font-medium text-brand-text-dark">
                        {item.serviceName}
                      </p>
                      <div className="flex items-center gap-2 mt-0.5">
                        <ServiceTypeBadge type={item.serviceType} />
                        <span className="text-xs text-brand-text-light">
                          {item.quantity.toLocaleString()} x{" "}
                          {formatCurrency(item.unitPrice)}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <p className="text-sm font-medium text-brand-text-dark">
                        {item.completedQuantity.toLocaleString()}/
                        {item.quantity.toLocaleString()}
                      </p>
                      <Progress
                        value={item.progress}
                        size="sm"
                        variant={
                          item.status === "completed"
                            ? "success"
                            : item.status === "failed"
                            ? "error"
                            : "default"
                        }
                        className="w-20 mt-1"
                      />
                    </div>
                    <Badge
                      variant={
                        item.status === "completed"
                          ? "success"
                          : item.status === "processing"
                          ? "info"
                          : item.status === "failed"
                          ? "error"
                          : "warning"
                      }
                      size="sm"
                    >
                      {item.status === "completed"
                        ? "เสร็จ"
                        : item.status === "processing"
                        ? "กำลังทำ"
                        : item.status === "failed"
                        ? "ล้มเหลว"
                        : "รอ"}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>

            {/* Footer Actions */}
            <div className="flex items-center justify-between pt-3 border-t border-brand-border">
              <div className="flex items-center gap-2">
                <Progress value={order.progress} size="sm" className="w-32" />
                <span className="text-sm text-brand-text-light">
                  {order.progress}%
                </span>
              </div>

              <div className="flex items-center gap-2">
                <Link href={`/seller/orders/${order.id}`}>
                  <Button size="sm" variant="outline" leftIcon={<Eye className="w-4 h-4" />}>
                    ดูรายละเอียด
                  </Button>
                </Link>
                <Button size="sm" variant="ghost">
                  <MoreVertical className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </Card>
        ))}

        {filteredOrders.length === 0 && (
          <Card variant="bordered">
            <EmptyState
              icon={Package}
              title="ไม่พบออเดอร์"
              description="ลองเปลี่ยนตัวกรองหรือสร้างออเดอร์ใหม่"
              action={
                <Link href="/seller/orders/new">
                  <Button>สร้างออเดอร์ใหม่</Button>
                </Link>
              }
            />
          </Card>
        )}
      </div>
    </div>
  );
}

