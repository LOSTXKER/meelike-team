"use client";

import { useState } from "react";
import { Card, Button, Input, Badge } from "@/components/ui";
import { PageHeader } from "@/components/shared";
import { useAuthStore } from "@/lib/store";
import {
  User,
  Store,
  Mail,
  Phone,
  Lock,
  Camera,
  Save,
  Bell,
  Shield,
  CreditCard,
  ClipboardList,
} from "lucide-react";

export default function SellerSettingsPage() {
  const { user } = useAuthStore();
  const seller = user?.seller;

  const [formData, setFormData] = useState({
    displayName: seller?.displayName || "JohnBoost",
    email: user?.email || "john@example.com",
    phone: "080-123-4567",
    lineId: "@johnboost",
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSave = () => {
    // Mock save
    alert("บันทึกการเปลี่ยนแปลงเรียบร้อย");
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Header */}
      <PageHeader
        title="ตั้งค่าโปรไฟล์"
        description="จัดการข้อมูลส่วนตัวและการตั้งค่าบัญชี"
        icon={User}
      />

      {/* Profile Picture */}
      <Card variant="bordered" padding="lg">
        <h2 className="font-semibold text-brand-text-dark mb-4 flex items-center gap-2">
          <Camera className="w-5 h-5 text-brand-primary" />
          รูปโปรไฟล์
        </h2>
        <div className="flex items-center gap-6">
          <div className="relative">
            <div className="w-24 h-24 bg-brand-primary/10 rounded-2xl flex items-center justify-center text-4xl">
              J
            </div>
            <button className="absolute -bottom-2 -right-2 w-8 h-8 bg-brand-primary text-white rounded-full flex items-center justify-center shadow-lg hover:bg-brand-primary/90 transition-colors">
              <Camera className="w-4 h-4" />
            </button>
          </div>
          <div>
            <p className="font-medium text-brand-text-dark">
              {formData.displayName}
            </p>
            <p className="text-sm text-brand-text-light">
              แนะนำขนาด 200x200 พิกเซล
            </p>
            <Button variant="outline" size="sm" className="mt-2">
              เปลี่ยนรูป
            </Button>
          </div>
        </div>
      </Card>

      {/* Basic Info */}
      <Card variant="bordered" padding="lg">
        <h2 className="font-semibold text-brand-text-dark mb-4 flex items-center gap-2">
          <ClipboardList className="w-5 h-5 text-brand-primary" />
          ข้อมูลพื้นฐาน
        </h2>
        <div className="grid gap-4">
          <Input
            label="ชื่อร้าน / ชื่อที่แสดง"
            name="displayName"
            value={formData.displayName}
            onChange={handleChange}
            leftIcon={<Store className="w-4 h-4" />}
          />
          <div className="grid sm:grid-cols-2 gap-4">
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
          <Input
            label="LINE ID"
            name="lineId"
            value={formData.lineId}
            onChange={handleChange}
          />
        </div>
      </Card>

      {/* Change Password */}
      <Card variant="bordered" padding="lg">
        <h2 className="font-semibold text-brand-text-dark mb-4 flex items-center gap-2">
          <Lock className="w-5 h-5 text-brand-primary" />
          เปลี่ยนรหัสผ่าน
        </h2>
        <div className="grid gap-4">
          <Input
            label="รหัสผ่านปัจจุบัน"
            type="password"
            name="currentPassword"
            value={formData.currentPassword}
            onChange={handleChange}
            leftIcon={<Lock className="w-4 h-4" />}
          />
          <div className="grid sm:grid-cols-2 gap-4">
            <Input
              label="รหัสผ่านใหม่"
              type="password"
              name="newPassword"
              value={formData.newPassword}
              onChange={handleChange}
              leftIcon={<Lock className="w-4 h-4" />}
            />
            <Input
              label="ยืนยันรหัสผ่านใหม่"
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              leftIcon={<Lock className="w-4 h-4" />}
            />
          </div>
        </div>
      </Card>

      {/* Notification Settings */}
      <Card variant="bordered" padding="lg">
        <h2 className="font-semibold text-brand-text-dark mb-4 flex items-center gap-2">
          <Bell className="w-5 h-5 text-brand-primary" />
          การแจ้งเตือน
        </h2>
        <div className="space-y-4">
          {[
            { key: "orders", label: "ออเดอร์ใหม่", desc: "แจ้งเตือนเมื่อมีออเดอร์เข้ามา", enabled: true },
            { key: "team", label: "งานทีม", desc: "แจ้งเตือนเมื่อทีมส่งงาน", enabled: true },
            { key: "finance", label: "การเงิน", desc: "แจ้งเตือนธุรกรรมการเงิน", enabled: false },
            { key: "promo", label: "โปรโมชั่น", desc: "ข่าวสารและโปรโมชั่น", enabled: false },
          ].map((item) => (
            <div
              key={item.key}
              className="flex items-center justify-between p-3 bg-brand-bg rounded-lg"
            >
              <div>
                <p className="font-medium text-brand-text-dark">{item.label}</p>
                <p className="text-sm text-brand-text-light">{item.desc}</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  className="sr-only peer"
                  defaultChecked={item.enabled}
                />
                <div className="w-11 h-6 bg-brand-border rounded-full peer peer-checked:bg-brand-primary peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all"></div>
              </label>
            </div>
          ))}
        </div>
      </Card>

      {/* Quick Links */}
      <div className="grid sm:grid-cols-2 gap-4">
        <Card
          variant="bordered"
          padding="md"
          className="hover:border-brand-primary cursor-pointer transition-colors"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-brand-info/10 rounded-lg flex items-center justify-center">
              <CreditCard className="w-5 h-5 text-brand-info" />
            </div>
            <div>
              <p className="font-medium text-brand-text-dark">Subscription</p>
              <p className="text-sm text-brand-text-light">
                แพ็คเกจปัจจุบัน: <Badge variant="success" size="sm">Pro</Badge>
              </p>
            </div>
          </div>
        </Card>

        <Card
          variant="bordered"
          padding="md"
          className="hover:border-brand-primary cursor-pointer transition-colors"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-brand-warning/10 rounded-lg flex items-center justify-center">
              <Shield className="w-5 h-5 text-brand-warning" />
            </div>
            <div>
              <p className="font-medium text-brand-text-dark">API Key</p>
              <p className="text-sm text-brand-text-light">จัดการ API สำหรับเชื่อมต่อ</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Save Button */}
      <div className="flex justify-end gap-3 pt-4">
        <Button variant="outline">ยกเลิก</Button>
        <Button onClick={handleSave}>
          <Save className="w-4 h-4 mr-2" />
          บันทึกการเปลี่ยนแปลง
        </Button>
      </div>
    </div>
  );
}

