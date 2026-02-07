"use client";

import { Card, Badge, Button } from "@/components/ui";
import { User, MessageSquare, Mail, Send } from "lucide-react";

interface OrderCustomerProps {
  customerName: string;
  customerContact: string;
}

export function OrderCustomer({
  customerName,
  customerContact,
}: OrderCustomerProps) {
  return (
    <Card
      variant="elevated"
      padding="lg"
      className="border-none shadow-lg shadow-brand-primary/5"
    >
      <h3 className="font-bold text-brand-text-dark mb-4 flex items-center gap-2">
        <User className="w-5 h-5 text-brand-primary" />
        ข้อมูลลูกค้า
      </h3>

      <div className="space-y-4">
        <div className="flex items-center gap-4 p-3 bg-brand-bg/30 rounded-xl border border-brand-border/30">
          <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-lg font-bold text-brand-primary border border-brand-border shadow-sm">
            {customerName.charAt(0)}
          </div>
          <div>
            <p className="font-bold text-brand-text-dark text-lg">
              {customerName}
            </p>
            <Badge variant="default" size="sm" className="mt-1">
              ลูกค้าใหม่
            </Badge>
          </div>
        </div>

        <div className="space-y-3 pt-4">
          {customerContact && (
            <div className="flex items-center gap-3 text-sm p-2 hover:bg-brand-bg/50 rounded-lg transition-colors">
              <div className="w-8 h-8 rounded-lg bg-[#06C755] flex items-center justify-center text-white shrink-0">
                <MessageSquare className="w-4 h-4" />
              </div>
              <div className="flex flex-col">
                <span className="text-xs text-brand-text-light">LINE ID</span>
                <span className="font-medium text-brand-text-dark">
                  {customerContact}
                </span>
              </div>
            </div>
          )}
          <div className="flex items-center gap-3 text-sm p-2 hover:bg-brand-bg/50 rounded-lg transition-colors">
            <div className="w-8 h-8 rounded-lg bg-brand-primary/10 flex items-center justify-center text-brand-primary shrink-0">
              <Mail className="w-4 h-4" />
            </div>
            <div className="flex flex-col">
              <span className="text-xs text-brand-text-light">Email</span>
              <span className="font-medium text-brand-text-dark">
                customer@example.com
              </span>
            </div>
          </div>
        </div>

        <Button
          variant="outline"
          className="w-full rounded-xl border-brand-border/50 hover:bg-brand-bg hover:text-brand-primary"
          size="sm"
        >
          <Send className="w-4 h-4 mr-2" />
          ส่งข้อความ
        </Button>
      </div>
    </Card>
  );
}
