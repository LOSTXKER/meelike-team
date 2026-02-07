"use client";

import { Card, Badge } from "@/components/ui";
import { CheckCircle2, FileText } from "lucide-react";

interface OrderPaymentProps {
  order: {
    paidAt?: string;
    paymentProof?: string;
    total: number;
  };
}

export function OrderPayment({ order }: OrderPaymentProps) {
  return (
    <Card
      variant="elevated"
      padding="lg"
      className="border-none shadow-lg shadow-brand-primary/5"
    >
      <h3 className="font-bold text-brand-text-dark mb-4 flex items-center gap-2">
        <div className="w-8 h-8 rounded-lg bg-green-100 flex items-center justify-center text-green-600">
          <CheckCircle2 className="w-5 h-5" />
        </div>
        การชำระเงิน
      </h3>

      <div className="space-y-4">
        <div className="flex justify-between items-center p-3 bg-brand-bg/30 rounded-xl border border-brand-border/30">
          <span className="text-brand-text-light text-sm">สถานะ</span>
          <Badge
            variant={order.paidAt ? "success" : "warning"}
            className="shadow-sm"
          >
            {order.paidAt ? "ชำระแล้ว" : "รอชำระ"}
          </Badge>
        </div>

        <div className="space-y-2">
          {order.paidAt && (
            <div className="flex justify-between text-sm">
              <span className="text-brand-text-light">ชำระเมื่อ</span>
              <span className="text-brand-text-dark font-medium">
                {new Date(order.paidAt).toLocaleDateString("th-TH", {
                  day: "numeric",
                  month: "short",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </span>
            </div>
          )}
          <div className="flex justify-between text-sm">
            <span className="text-brand-text-light">ช่องทาง</span>
            <span className="text-brand-text-dark font-medium">PromptPay</span>
          </div>
        </div>

        {order.paymentProof && (
          <div className="pt-4 border-t border-brand-border/50">
            <p className="text-sm font-medium text-brand-text-dark mb-3">
              หลักฐานการโอน
            </p>
            <div className="aspect-[4/3] bg-brand-bg rounded-xl flex items-center justify-center border-2 border-dashed border-brand-border/50 hover:border-brand-primary/50 transition-colors cursor-pointer group">
              <div className="text-center group-hover:scale-105 transition-transform">
                <FileText className="w-8 h-8 text-brand-text-light mx-auto mb-2" />
                <span className="text-sm text-brand-text-light">
                  คลิกเพื่อดูรูปภาพ
                </span>
              </div>
            </div>
          </div>
        )}
      </div>
    </Card>
  );
}
