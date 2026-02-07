"use client";

import { useState } from "react";
import { Card, Button, Input } from "@/components/ui";
import { useAuthStore } from "@/lib/store";
import { useToast } from "@/components/ui/toast";
import { useUnsavedChanges } from "@/lib/hooks/useUnsavedChanges";
import { User, Mail, Phone, Save } from "lucide-react";

export default function SettingsProfilePage() {
  const { user } = useAuthStore();
  const toast = useToast();
  const { setDirty, setClean } = useUnsavedChanges();
  const seller = user?.seller;

  const [isSaving, setIsSaving] = useState(false);

  const [formData, setFormData] = useState({
    displayName: seller?.displayName || "",
    email: user?.email || "",
    phone: seller?.contactInfo?.phone || "",
    lineId: seller?.contactInfo?.line || "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setDirty();
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await new Promise((r) => setTimeout(r, 500));
      toast.success("บันทึกการเปลี่ยนแปลงเรียบร้อย");
      setClean();
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Basic Info */}
      <Card className="border-none shadow-md p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-lg bg-brand-primary/10 flex items-center justify-center">
            <User className="w-5 h-5 text-brand-primary" />
          </div>
          <div>
            <h2 className="font-bold text-brand-text-dark">ข้อมูลพื้นฐาน</h2>
            <p className="text-xs text-brand-text-light">
              ข้อมูลส่วนตัวและการติดต่อ
            </p>
          </div>
        </div>

        <div className="grid gap-5">
          <div className="grid sm:grid-cols-2 gap-5">
            <Input
              label="ชื่อที่แสดง"
              name="displayName"
              value={formData.displayName}
              onChange={handleChange}
              leftIcon={<User className="w-4 h-4" />}
            />
            <Input
              label="LINE ID"
              name="lineId"
              value={formData.lineId}
              onChange={handleChange}
              leftIcon={
                <span className="font-bold text-green-500 text-sm">L</span>
              }
            />
          </div>
          <div className="grid sm:grid-cols-2 gap-5">
            <Input
              label="อีเมล"
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              leftIcon={<Mail className="w-4 h-4" />}
            />
            <Input
              label="เบอร์โทรศัพท์"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              leftIcon={<Phone className="w-4 h-4" />}
            />
          </div>
        </div>
      </Card>

      {/* Action Buttons */}
      <div className="flex justify-end gap-3">
        <Button variant="outline">ยกเลิก</Button>
        <Button
          onClick={handleSave}
          isLoading={isSaving}
          leftIcon={<Save className="w-4 h-4" />}
        >
          บันทึกการเปลี่ยนแปลง
        </Button>
      </div>
    </div>
  );
}
