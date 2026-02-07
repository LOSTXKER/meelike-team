"use client";

import { useState } from "react";
import { Card, Button, Switch } from "@/components/ui";
import { Bell, Save } from "lucide-react";
import { useToast } from "@/components/ui/toast";

export default function TeamNotificationsPage() {
  const toast = useToast();

  const [notifyNewRequests, setNotifyNewRequests] = useState(true);
  const [notifyPendingReview, setNotifyPendingReview] = useState(true);
  const [dailySummary, setDailySummary] = useState(false);

  const handleSave = () => {
    toast.success("บันทึกการตั้งค่าเรียบร้อย!");
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Notifications */}
      <Card variant="elevated" className="border-none shadow-md">
        <div className="p-6 border-b border-brand-border/30 bg-brand-bg/30">
          <h3 className="font-bold text-lg text-brand-text-dark flex items-center gap-2">
            <Bell className="w-5 h-5 text-brand-warning" />
            การแจ้งเตือน
          </h3>
          <p className="text-sm text-brand-text-light mt-1">ตั้งค่าการแจ้งเตือนสำหรับทีม</p>
        </div>
        <div className="p-6 space-y-5">
          <div className="flex items-center justify-between p-4 rounded-xl border border-brand-border/30 hover:bg-brand-bg/30 transition-colors">
            <div>
              <span className="font-medium text-brand-text-dark">แจ้งเตือนเมื่อมีคำขอเข้าร่วมใหม่</span>
              <p className="text-sm text-brand-text-light">ได้รับการแจ้งเตือนเมื่อ Worker สมัครเข้าทีม</p>
            </div>
            <Switch checked={notifyNewRequests} onChange={setNotifyNewRequests} />
          </div>
          
          <div className="flex items-center justify-between p-4 rounded-xl border border-brand-border/30 hover:bg-brand-bg/30 transition-colors">
            <div>
              <span className="font-medium text-brand-text-dark">แจ้งเตือนเมื่อมีงานรอตรวจสอบ</span>
              <p className="text-sm text-brand-text-light">ได้รับการแจ้งเตือนเมื่อ Worker ส่งงาน</p>
            </div>
            <Switch checked={notifyPendingReview} onChange={setNotifyPendingReview} />
          </div>
          
          <div className="flex items-center justify-between p-4 rounded-xl border border-brand-border/30 hover:bg-brand-bg/30 transition-colors">
            <div>
              <span className="font-medium text-brand-text-dark">สรุปรายวัน</span>
              <p className="text-sm text-brand-text-light">รับสรุปผลงานของทีมทุกวัน</p>
            </div>
            <Switch checked={dailySummary} onChange={setDailySummary} />
          </div>
        </div>
      </Card>

      {/* Save Button */}
      <div className="flex justify-end pt-4">
        <Button onClick={handleSave} leftIcon={<Save className="w-4 h-4" />}>
          บันทึกการเปลี่ยนแปลง
        </Button>
      </div>
    </div>
  );
}
