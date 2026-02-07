"use client";

import { useState } from "react";
import { Card, Button, Switch } from "@/components/ui";
import { useToast } from "@/components/ui/toast";
import { Bell, Save } from "lucide-react";

export default function NotificationSettingsPage() {
  const toast = useToast();
  const [isSaving, setIsSaving] = useState(false);

  const [notifications, setNotifications] = useState({
    orders: true,
    team: true,
    finance: false,
    promo: false,
  });

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await new Promise((r) => setTimeout(r, 500));
      toast.success("บันทึกการตั้งค่าแจ้งเตือนเรียบร้อย");
    } finally {
      setIsSaving(false);
    }
  };

  const items = [
    {
      key: "orders" as const,
      label: "ออเดอร์ใหม่",
      desc: "แจ้งเตือนทันทีเมื่อมีลูกค้าสั่งซื้อบริการ",
    },
    {
      key: "team" as const,
      label: "งานทีม",
      desc: "แจ้งเตือนเมื่อ Worker ส่งงานหรือขอเบิกเงิน",
    },
    {
      key: "finance" as const,
      label: "การเงิน",
      desc: "แจ้งเตือนเมื่อมีการเติมเงินหรือถอนเงิน",
    },
    {
      key: "promo" as const,
      label: "โปรโมชั่น",
      desc: "รับข่าวสารโปรโมชั่นและอัพเดทใหม่ๆ",
    },
  ];

  return (
    <div className="space-y-6">
      <Card className="border-none shadow-md p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-lg bg-amber-100 flex items-center justify-center">
            <Bell className="w-5 h-5 text-amber-600" />
          </div>
          <div>
            <h2 className="font-bold text-brand-text-dark">การแจ้งเตือน</h2>
            <p className="text-xs text-brand-text-light">
              ตั้งค่าการรับแจ้งเตือน
            </p>
          </div>
        </div>

        <div className="divide-y divide-brand-border/30">
          {items.map((item) => (
            <div
              key={item.key}
              className="flex items-center justify-between py-4 first:pt-0 last:pb-0"
            >
              <div>
                <p className="font-medium text-brand-text-dark text-sm">
                  {item.label}
                </p>
                <p className="text-xs text-brand-text-light mt-0.5">
                  {item.desc}
                </p>
              </div>
              <Switch
                checked={notifications[item.key]}
                onChange={(checked) =>
                  setNotifications({ ...notifications, [item.key]: checked })
                }
              />
            </div>
          ))}
        </div>
      </Card>

      <div className="flex justify-end">
        <Button
          onClick={handleSave}
          isLoading={isSaving}
          leftIcon={<Save className="w-4 h-4" />}
        >
          บันทึก
        </Button>
      </div>
    </div>
  );
}
