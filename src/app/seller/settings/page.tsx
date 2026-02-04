"use client";

import { useState } from "react";
import { Card, Button, Input, Badge, Select, Switch } from "@/components/ui";
import { VStack, HStack } from "@/components/layout";
import { useAuthStore } from "@/lib/store";
import { clearAllStorage } from "@/lib/storage";
import {
  User,
  Mail,
  Phone,
  Lock,
  Save,
  Bell,
  CreditCard,
  CheckCircle,
  AlertCircle,
  Trash2,
  Wallet,
  Building2,
  Shield,
  ChevronRight,
} from "lucide-react";
import Link from "next/link";

export default function SettingsProfilePage() {
  const { user } = useAuthStore();
  const seller = user?.seller;

  const [formData, setFormData] = useState({
    displayName: seller?.displayName || "",
    email: user?.email || "",
    phone: seller?.phone || "",
    lineId: seller?.lineId || "",
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [bankData, setBankData] = useState({
    bank: "",
    accountNumber: "",
    accountName: "",
    promptpay: "",
    isVerified: false,
  });

  const [notifications, setNotifications] = useState({
    orders: true,
    team: true,
    finance: false,
    promo: false,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleBankChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setBankData({ ...bankData, [e.target.name]: e.target.value });
  };

  const handleSave = () => {
    alert("บันทึกการเปลี่ยนแปลงเรียบร้อย");
  };

  const bankOptions = [
    { value: "kbank", label: "กสิกรไทย (KBANK)" },
    { value: "scb", label: "ไทยพาณิชย์ (SCB)" },
    { value: "ktb", label: "กรุงไทย (KTB)" },
    { value: "bbl", label: "กรุงเทพ (BBL)" },
    { value: "ttb", label: "ทีทีบี (ttb)" },
    { value: "gsb", label: "ออมสิน (GSB)" },
    { value: "bay", label: "กรุงศรี (BAY)" },
  ];

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
            <p className="text-xs text-brand-text-light">ข้อมูลส่วนตัวและการติดต่อ</p>
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
              leftIcon={<span className="font-bold text-green-500 text-sm">L</span>}
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

      {/* KYC Verification */}
      <Link href="/seller/settings/verification">
        <Card className="border-none shadow-md p-6 cursor-pointer hover:shadow-lg transition-shadow">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
                <Shield className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <h2 className="font-bold text-brand-text-dark">ยืนยันตัวตน (KYC)</h2>
                <p className="text-xs text-brand-text-light">ยืนยันตัวตนเพื่อเพิ่มวงเงินถอน</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Badge variant="info" size="sm">
                Basic
              </Badge>
              <ChevronRight className="w-5 h-5 text-brand-text-light" />
            </div>
          </div>
          <div className="mt-4 p-3 rounded-lg bg-blue-50">
            <div className="flex items-center justify-between text-sm">
              <span className="text-blue-700">วงเงินถอนปัจจุบัน</span>
              <span className="font-semibold text-blue-800">฿1,000/วัน</span>
            </div>
            <p className="text-xs text-blue-600 mt-1">อัปเกรดเป็น Verified เพื่อถอนได้ถึง ฿10,000/วัน</p>
          </div>
        </Card>
      </Link>

      {/* Payment / Banking Settings */}
      <Card className="border-none shadow-md p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-emerald-100 flex items-center justify-center">
              <Wallet className="w-5 h-5 text-emerald-600" />
            </div>
            <div>
              <h2 className="font-bold text-brand-text-dark">บัญชีรับเงิน</h2>
              <p className="text-xs text-brand-text-light">บัญชีธนาคารสำหรับรับเงิน</p>
            </div>
          </div>
          {bankData.isVerified ? (
            <Badge variant="success" size="sm">
              <CheckCircle className="w-3 h-3 mr-1" />
              ยืนยันแล้ว
            </Badge>
          ) : (
            <Badge variant="warning" size="sm">
              <AlertCircle className="w-3 h-3 mr-1" />
              รอยืนยัน
            </Badge>
          )}
        </div>

        {/* Current Bank Account */}
        {bankData.isVerified && (
          <div className="p-4 bg-emerald-50 rounded-xl border border-emerald-100 mb-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-emerald-500 rounded-xl flex items-center justify-center">
                <Building2 className="w-6 h-6 text-white" />
              </div>
              <div className="flex-1">
                <p className="font-bold text-brand-text-dark">
                  {bankOptions.find(b => b.value === bankData.bank)?.label}
                </p>
                <p className="text-sm text-brand-text-light">
                  {bankData.accountNumber} • {bankData.accountName}
                </p>
              </div>
              <div className="flex items-center gap-2 text-emerald-600">
                <CheckCircle className="w-5 h-5" />
                <span className="text-sm font-medium">ใช้งานอยู่</span>
              </div>
            </div>
          </div>
        )}

        <div className="grid gap-5">
          <div className="grid sm:grid-cols-2 gap-5">
            <Select
              label="ธนาคาร"
              name="bank"
              options={bankOptions}
              value={bankData.bank}
              onChange={handleBankChange}
            />
            <Input
              label="เลขที่บัญชี"
              name="accountNumber"
              value={bankData.accountNumber}
              onChange={handleBankChange}
              placeholder="xxx-x-xxxxx-x"
              leftIcon={<CreditCard className="w-4 h-4" />}
            />
          </div>
          <div className="grid sm:grid-cols-2 gap-5">
            <Input
              label="ชื่อบัญชี"
              name="accountName"
              value={bankData.accountName}
              onChange={handleBankChange}
              placeholder="ระบุชื่อบัญชีภาษาไทย"
            />
            <Input
              label="PromptPay"
              name="promptpay"
              value={bankData.promptpay}
              onChange={handleBankChange}
              placeholder="เบอร์โทร หรือ เลขบัตร ปชช."
            />
          </div>
        </div>

        <div className="mt-4 p-3 bg-amber-50 rounded-xl border border-amber-100">
          <div className="flex items-start gap-2 text-amber-700">
            <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
            <p className="text-xs">
              บัญชีนี้จะใช้สำหรับรับเงินจากลูกค้าและการถอนเงินจากระบบ กรุณาตรวจสอบข้อมูลให้ถูกต้อง
            </p>
          </div>
        </div>
      </Card>

      {/* Change Password */}
      <Card className="border-none shadow-md p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-lg bg-red-100 flex items-center justify-center">
            <Lock className="w-5 h-5 text-red-600" />
          </div>
          <div>
            <h2 className="font-bold text-brand-text-dark">เปลี่ยนรหัสผ่าน</h2>
            <p className="text-xs text-brand-text-light">ตั้งค่ารหัสผ่านใหม่</p>
          </div>
        </div>

        <div className="space-y-5">
          <Input
            label="รหัสผ่านปัจจุบัน"
            type="password"
            name="currentPassword"
            value={formData.currentPassword}
            onChange={handleChange}
            leftIcon={<Lock className="w-4 h-4" />}
          />
          <div className="grid sm:grid-cols-2 gap-5">
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
      <Card className="border-none shadow-md p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-lg bg-amber-100 flex items-center justify-center">
            <Bell className="w-5 h-5 text-amber-600" />
          </div>
          <div>
            <h2 className="font-bold text-brand-text-dark">การแจ้งเตือน</h2>
            <p className="text-xs text-brand-text-light">ตั้งค่าการรับแจ้งเตือน</p>
          </div>
        </div>

        <div className="divide-y divide-brand-border/30">
          {[
            { key: "orders" as const, label: "ออเดอร์ใหม่", desc: "แจ้งเตือนทันทีเมื่อมีลูกค้าสั่งซื้อบริการ" },
            { key: "team" as const, label: "งานทีม", desc: "แจ้งเตือนเมื่อ Worker ส่งงานหรือขอเบิกเงิน" },
            { key: "finance" as const, label: "การเงิน", desc: "แจ้งเตือนเมื่อมีการเติมเงินหรือถอนเงิน" },
            { key: "promo" as const, label: "โปรโมชั่น", desc: "รับข่าวสารโปรโมชั่นและอัพเดทใหม่ๆ" },
          ].map((item) => (
            <div
              key={item.key}
              className="flex items-center justify-between py-4 first:pt-0 last:pb-0"
            >
              <div>
                <p className="font-medium text-brand-text-dark text-sm">{item.label}</p>
                <p className="text-xs text-brand-text-light mt-0.5">{item.desc}</p>
              </div>
              <Switch
                checked={notifications[item.key]}
                onChange={(checked) => setNotifications({ ...notifications, [item.key]: checked })}
              />
            </div>
          ))}
        </div>
      </Card>

      {/* Danger Zone */}
      <Card className="border-2 border-red-200 shadow-md p-6 bg-red-50/30">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-lg bg-red-100 flex items-center justify-center">
            <Trash2 className="w-5 h-5 text-red-600" />
          </div>
          <div>
            <h2 className="font-bold text-red-600">โซนอันตราย</h2>
            <p className="text-xs text-brand-text-light">การดำเนินการที่ไม่สามารถย้อนกลับได้</p>
          </div>
        </div>

        <div className="flex items-center justify-between p-4 bg-white rounded-xl border border-red-200">
          <div>
            <p className="font-medium text-brand-text-dark text-sm">รีเซ็ตข้อมูลทั้งหมด</p>
            <p className="text-xs text-brand-text-light mt-0.5">
              ลบข้อมูลออเดอร์ ทีม และบริการทั้งหมด (Dev/Test)
            </p>
          </div>
          <Button
            variant="outline"
            size="sm"
            className="border-red-300 text-red-600 hover:bg-red-600 hover:text-white hover:border-red-600"
            onClick={() => {
              if (confirm("⚠️ ยืนยันการรีเซ็ตข้อมูลทั้งหมด?")) {
                clearAllStorage();
                window.location.reload();
              }
            }}
          >
            <Trash2 className="w-4 h-4 mr-1.5" />
            รีเซ็ต
          </Button>
        </div>
      </Card>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row justify-end gap-3 pt-4 border-t border-brand-border/30">
        <Button variant="outline">ยกเลิก</Button>
        <Button onClick={handleSave} leftIcon={<Save className="w-4 h-4" />}>
          บันทึกการเปลี่ยนแปลง
        </Button>
      </div>
    </div>
  );
}
