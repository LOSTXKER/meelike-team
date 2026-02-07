"use client";

import Link from "next/link";
import { Badge, Button } from "@/components/ui";
import {
  ArrowLeft,
  Clock,
  CheckCircle2,
  RefreshCw,
} from "lucide-react";

type OrderStatus = "pending" | "processing" | "completed" | "cancelled";

const statusConfig: Record<
  OrderStatus,
  { label: string; color: "warning" | "info" | "success" | "error" }
> = {
  pending: { label: "รอชำระเงิน", color: "warning" },
  processing: { label: "กำลังดำเนินการ", color: "info" },
  completed: { label: "เสร็จสิ้น", color: "success" },
  cancelled: { label: "ยกเลิก", color: "error" },
};

interface OrderHeaderProps {
  order: {
    orderNumber: string;
    status: string;
    createdAt: string;
  };
  onConfirmPayment: () => void;
}

export function OrderHeader({ order, onConfirmPayment }: OrderHeaderProps) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      <div className="flex items-center gap-4">
        <Link href="/seller/orders">
          <button className="p-2.5 hover:bg-white hover:shadow-sm rounded-xl transition-all border border-transparent hover:border-brand-border/50 text-brand-text-light hover:text-brand-primary">
            <ArrowLeft className="w-5 h-5" />
          </button>
        </Link>
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold text-brand-text-dark">
              {order.orderNumber}
            </h1>
            <Badge
              variant={statusConfig[order.status as OrderStatus].color}
              className="shadow-sm"
            >
              {statusConfig[order.status as OrderStatus].label}
            </Badge>
          </div>
          <p className="text-brand-text-light flex items-center gap-2 mt-1 text-sm">
            <Clock className="w-4 h-4" />
            สั่งเมื่อ{" "}
            {new Date(order.createdAt).toLocaleDateString("th-TH", {
              day: "numeric",
              month: "long",
              year: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            })}
          </p>
        </div>
      </div>

      <div className="flex gap-3">
        {order.status === "pending" && (
          <Button
            onClick={onConfirmPayment}
            className="shadow-lg shadow-brand-primary/20 rounded-xl"
          >
            <CheckCircle2 className="w-4 h-4 mr-2" />
            ยืนยันชำระเงิน
          </Button>
        )}
        {order.status === "processing" && (
          <Button
            variant="secondary"
            className="bg-white shadow-sm border border-brand-border/50 hover:bg-brand-bg rounded-xl"
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            อัปเดตสถานะ
          </Button>
        )}
      </div>
    </div>
  );
}
