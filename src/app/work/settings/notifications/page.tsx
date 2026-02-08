"use client";

import { useState, useEffect } from "react";
import { Card, Switch, Skeleton } from "@/components/ui";
import { VStack } from "@/components/layout";
import { useToast } from "@/components/ui/toast";
import {
  Bell,
  Briefcase,
  Users,
  Wallet,
  MessageCircle,
  Megaphone,
} from "lucide-react";

interface NotificationSetting {
  id: string;
  label: string;
  description: string;
  icon: React.ElementType;
  enabled: boolean;
}

export default function WorkerNotificationsSettingsPage() {
  const toast = useToast();
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => { const t = setTimeout(() => setIsLoading(false), 300); return () => clearTimeout(t); }, []);

  const [settings, setSettings] = useState<NotificationSetting[]>([
    { id: "jobs", label: "งานใหม่", description: "แจ้งเตือนเมื่อมีงานใหม่ในทีมของคุณ", icon: Briefcase, enabled: true },
    { id: "job_review", label: "ผลตรวจงาน", description: "แจ้งเตือนเมื่องานถูกอนุมัติหรือปฏิเสธ", icon: Bell, enabled: true },
    { id: "team", label: "ทีม", description: "แจ้งเตือนเกี่ยวกับทีมของคุณ", icon: Users, enabled: true },
    { id: "earnings", label: "รายได้", description: "แจ้งเตือนเมื่อได้รับเงินหรือถอนเงินสำเร็จ", icon: Wallet, enabled: true },
    { id: "chat", label: "ข้อความ", description: "แจ้งเตือนเมื่อได้รับข้อความใหม่", icon: MessageCircle, enabled: false },
    { id: "promotions", label: "โปรโมชั่น", description: "ข่าวสาร โบนัส และโปรโมชั่นพิเศษ", icon: Megaphone, enabled: false },
  ]);

  const toggleSetting = (id: string) => {
    setSettings((prev) =>
      prev.map((s) =>
        s.id === id ? { ...s, enabled: !s.enabled } : s
      )
    );
    toast.success("บันทึกการตั้งค่าเรียบร้อย");
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-48" />
        <div className="space-y-3">
          {[1, 2, 3, 4, 5].map((i) => <Skeleton key={i} className="h-20 rounded-xl" />)}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Card className="border-none shadow-md">
        <div className="p-6">
          <h2 className="text-lg font-bold text-brand-text-dark mb-1">การแจ้งเตือน</h2>
          <p className="text-sm text-brand-text-light mb-6">เลือกประเภทการแจ้งเตือนที่คุณต้องการรับ</p>

          <VStack gap={0}>
            {settings.map((setting, i) => {
              const Icon = setting.icon;
              return (
                <div
                  key={setting.id}
                  className={`flex items-center justify-between py-4 ${
                    i < settings.length - 1 ? "border-b border-brand-border/30" : ""
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-brand-bg flex items-center justify-center">
                      <Icon className="w-5 h-5 text-brand-primary" />
                    </div>
                    <div>
                      <p className="font-medium text-brand-text-dark text-sm">{setting.label}</p>
                      <p className="text-xs text-brand-text-light">{setting.description}</p>
                    </div>
                  </div>
                  <Switch
                    checked={setting.enabled}
                    onChange={() => toggleSetting(setting.id)}
                  />
                </div>
              );
            })}
          </VStack>
        </div>
      </Card>
    </div>
  );
}
