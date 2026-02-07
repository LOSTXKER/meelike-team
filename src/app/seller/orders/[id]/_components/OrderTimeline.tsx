"use client";

import { Card } from "@/components/ui";
import { FileText, Package, CheckCircle2, RefreshCw } from "lucide-react";

interface OrderTimelineProps {
  order: {
    createdAt: string;
    paidAt?: string;
    status: string;
  };
  customerName: string;
}

export function OrderTimeline({ order, customerName }: OrderTimelineProps) {
  const logs = [
    {
      action: "สร้างออเดอร์",
      time: order.createdAt,
      user: customerName,
      icon: <Package className="w-4 h-4" />,
      color: "bg-brand-primary text-white",
    },
    ...(order.paidAt
      ? [
          {
            action: "ยืนยันการชำระเงิน",
            time: order.paidAt,
            user: "ระบบอัตโนมัติ",
            icon: <CheckCircle2 className="w-4 h-4" />,
            color: "bg-brand-success text-white",
          },
        ]
      : []),
    ...(order.status === "processing"
      ? [
          {
            action: "เริ่มดำเนินการ",
            time: new Date().toISOString(),
            user: "Seller",
            icon: <RefreshCw className="w-4 h-4" />,
            color: "bg-brand-info text-white",
          },
        ]
      : []),
  ];

  return (
    <Card
      variant="elevated"
      padding="lg"
      className="border-none shadow-lg shadow-brand-primary/5"
    >
      <h2 className="font-bold text-lg text-brand-text-dark mb-6 flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-brand-secondary flex items-center justify-center text-brand-primary">
          <FileText className="w-5 h-5" />
        </div>
        ประวัติการดำเนินการ
      </h2>

      <div className="relative pl-4 space-y-8 before:absolute before:left-[27px] before:top-4 before:bottom-4 before:w-0.5 before:bg-brand-border/50">
        {logs.map((log, index) => (
          <div key={index} className="flex gap-4 relative">
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center shadow-sm shrink-0 z-10 ring-4 ring-white ${log.color}`}
            >
              {log.icon}
            </div>
            <div className="flex-1 bg-brand-bg/20 p-3 rounded-xl border border-brand-border/30">
              <p className="font-bold text-brand-text-dark text-sm">
                {log.action}
              </p>
              <div className="flex items-center gap-2 text-xs text-brand-text-light mt-1">
                <span className="font-medium bg-brand-bg px-1.5 py-0.5 rounded">
                  {log.user}
                </span>
                <span>•</span>
                <span>
                  {new Date(log.time).toLocaleDateString("th-TH", {
                    day: "numeric",
                    month: "short",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}
