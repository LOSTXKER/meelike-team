"use client";

import { useState } from "react";
import Link from "next/link";
import { Card, Button, Input, Badge, Select } from "@/components/ui";
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
  CheckCircle2,
  ChevronRight,
  LogOut,
  Wallet,
  Building2,
  CheckCircle,
  AlertCircle,
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

  const [bankData, setBankData] = useState({
    bank: "kbank",
    accountNumber: "xxx-x-xxxxx-x",
    accountName: "นายจอห์น ดู",
    promptpay: "0801234567",
    isVerified: true,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleBankChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setBankData({ ...bankData, [e.target.name]: e.target.value });
  };

  const handleSave = () => {
    // Mock save
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
    <div className="space-y-8 animate-fade-in max-w-7xl mx-auto">
      {/* Header */}
      <PageHeader
        title="ตั้งค่าบัญชี"
        description="จัดการข้อมูลส่วนตัว บัญชีรับเงิน ความปลอดภัย และการตั้งค่าบัญชีของคุณ"
        icon={User}
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Profile & Menu */}
        <div className="lg:col-span-1 space-y-6">
          {/* Profile Card */}
          <Card variant="elevated" className="border-none shadow-lg shadow-brand-primary/5 text-center p-8 bg-gradient-to-b from-brand-bg to-white relative overflow-hidden">
             <div className="absolute top-0 left-0 w-full h-24 bg-brand-primary/10"></div>
             
             <div className="relative inline-block mb-4 mt-8">
                <div className="w-32 h-32 bg-white rounded-full p-1 shadow-md">
                   <div className="w-full h-full bg-brand-primary/10 rounded-full flex items-center justify-center text-4xl font-bold text-brand-primary overflow-hidden">
                      {formData.displayName.charAt(0)}
                   </div>
                </div>
                <button className="absolute bottom-1 right-1 w-10 h-10 bg-brand-primary text-white rounded-full flex items-center justify-center shadow-lg hover:bg-brand-primary-dark transition-all border-4 border-white hover:scale-110">
                   <Camera className="w-5 h-5" />
                </button>
             </div>
             
             <h2 className="text-xl font-bold text-brand-text-dark">{formData.displayName}</h2>
             <p className="text-brand-text-light text-sm mb-4">{formData.email}</p>
             
             <div className="flex justify-center gap-2 mb-6">
                <Badge variant="success" className="px-3 py-1 bg-brand-success/10 text-brand-success border-brand-success/20">
                   <CheckCircle2 className="w-3 h-3 mr-1" /> Verified
                </Badge>
                <Badge variant="info" className="px-3 py-1 bg-brand-info/10 text-brand-info border-brand-info/20">
                   Pro Plan
                </Badge>
             </div>
             
             <div className="grid grid-cols-3 divide-x divide-brand-border/50 border-t border-brand-border/50 pt-6">
                <div>
                   <p className="text-lg font-bold text-brand-text-dark">152</p>
                   <p className="text-xs text-brand-text-light">ออเดอร์</p>
                </div>
                <div>
                   <p className="text-lg font-bold text-brand-text-dark">4.8</p>
                   <p className="text-xs text-brand-text-light">คะแนน</p>
                </div>
                <div>
                   <p className="text-lg font-bold text-brand-text-dark">2 ปี</p>
                   <p className="text-xs text-brand-text-light">สมาชิก</p>
                </div>
             </div>
          </Card>

          {/* Quick Menu */}
          <div className="space-y-3">
             <Link href="/seller/settings/subscription">
                <div className="flex items-center justify-between p-4 bg-white rounded-xl shadow-sm border border-brand-border/50 hover:border-brand-primary/50 hover:shadow-md transition-all group cursor-pointer">
                   <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-brand-info/10 rounded-lg flex items-center justify-center text-brand-info group-hover:scale-110 transition-transform">
                         <CreditCard className="w-5 h-5" />
                      </div>
                      <div>
                         <p className="font-bold text-brand-text-dark">จัดการแพ็คเกจ</p>
                         <p className="text-xs text-brand-text-light">Pro Plan - หมดอายุ 30 ธ.ค.</p>
                      </div>
                   </div>
                   <ChevronRight className="w-5 h-5 text-brand-text-light group-hover:text-brand-primary transition-colors" />
                </div>
             </Link>
             
             <Link href="/seller/settings/api">
                <div className="flex items-center justify-between p-4 bg-white rounded-xl shadow-sm border border-brand-border/50 hover:border-brand-primary/50 hover:shadow-md transition-all group cursor-pointer">
                   <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-brand-warning/10 rounded-lg flex items-center justify-center text-brand-warning group-hover:scale-110 transition-transform">
                         <Shield className="w-5 h-5" />
                      </div>
                      <div>
                         <p className="font-bold text-brand-text-dark">API & ความปลอดภัย</p>
                         <p className="text-xs text-brand-text-light">จัดการ API Key และการเชื่อมต่อ</p>
                      </div>
                   </div>
                   <ChevronRight className="w-5 h-5 text-brand-text-light group-hover:text-brand-primary transition-colors" />
                </div>
             </Link>
             
             <Link href="/seller/store">
                <div className="flex items-center justify-between p-4 bg-white rounded-xl shadow-sm border border-brand-border/50 hover:border-brand-primary/50 hover:shadow-md transition-all group cursor-pointer">
                   <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-brand-primary/10 rounded-lg flex items-center justify-center text-brand-primary group-hover:scale-110 transition-transform">
                         <Store className="w-5 h-5" />
                      </div>
                      <div>
                         <p className="font-bold text-brand-text-dark">จัดการร้านค้า</p>
                         <p className="text-xs text-brand-text-light">ตกแต่งร้าน ธีม และบริการ</p>
                      </div>
                   </div>
                   <ChevronRight className="w-5 h-5 text-brand-text-light group-hover:text-brand-primary transition-colors" />
                </div>
             </Link>
          </div>
        </div>

        {/* Right Column: Settings Forms */}
        <div className="lg:col-span-2 space-y-6">
          {/* Basic Info */}
          <Card variant="elevated" className="border-none shadow-lg shadow-brand-primary/5 p-6 sm:p-8">
            <div className="flex items-center justify-between mb-6">
               <h2 className="font-bold text-lg text-brand-text-dark flex items-center gap-2">
                 <div className="p-2 bg-brand-primary/10 rounded-lg text-brand-primary">
                    <User className="w-5 h-5" />
                 </div>
                 ข้อมูลพื้นฐาน
               </h2>
            </div>
            
            <div className="grid gap-6">
              <div className="grid sm:grid-cols-2 gap-6">
                 <Input
                   label="ชื่อที่แสดง"
                   name="displayName"
                   value={formData.displayName}
                   onChange={handleChange}
                   leftIcon={<User className="w-4 h-4" />}
                   className="bg-brand-bg/30 border-brand-border/50 focus:bg-white transition-all"
                 />
                 <Input
                   label="LINE ID"
                   name="lineId"
                   value={formData.lineId}
                   onChange={handleChange}
                   className="bg-brand-bg/30 border-brand-border/50 focus:bg-white transition-all"
                   leftIcon={<span className="font-bold text-green-500">L</span>}
                 />
              </div>
              <div className="grid sm:grid-cols-2 gap-6">
                <Input
                  label="อีเมล"
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  leftIcon={<Mail className="w-4 h-4" />}
                  className="bg-brand-bg/30 border-brand-border/50 focus:bg-white transition-all"
                />
                <Input
                  label="เบอร์โทรศัพท์"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  leftIcon={<Phone className="w-4 h-4" />}
                  className="bg-brand-bg/30 border-brand-border/50 focus:bg-white transition-all"
                />
              </div>
            </div>
          </Card>

          {/* Payment / Banking Settings */}
          <Card variant="elevated" className="border-none shadow-lg shadow-brand-primary/5 p-6 sm:p-8">
            <div className="flex items-center justify-between mb-6">
               <h2 className="font-bold text-lg text-brand-text-dark flex items-center gap-2">
                 <div className="p-2 bg-green-100 rounded-lg text-green-600">
                    <Wallet className="w-5 h-5" />
                 </div>
                 บัญชีรับเงิน
               </h2>
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
              <div className="p-4 bg-green-50 rounded-xl border border-green-100 mb-6">
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-green-500 rounded-xl">
                    <Building2 className="w-5 h-5 text-white" />
                  </div>
                  <div className="flex-1">
                    <p className="font-bold text-brand-text-dark">
                      {bankOptions.find(b => b.value === bankData.bank)?.label}
                    </p>
                    <p className="text-sm text-brand-text-light">
                      {bankData.accountNumber} • {bankData.accountName}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 text-green-600">
                    <CheckCircle className="w-5 h-5" />
                    <span className="text-sm font-medium">ใช้งานอยู่</span>
                  </div>
                </div>
              </div>
            )}
            
            <div className="grid gap-6">
              <div className="grid sm:grid-cols-2 gap-6">
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
                  className="bg-brand-bg/30 border-brand-border/50 focus:bg-white transition-all"
                />
              </div>
              <div className="grid sm:grid-cols-2 gap-6">
                <Input
                  label="ชื่อบัญชี"
                  name="accountName"
                  value={bankData.accountName}
                  onChange={handleBankChange}
                  placeholder="ระบุชื่อบัญชีภาษาไทย"
                  className="bg-brand-bg/30 border-brand-border/50 focus:bg-white transition-all"
                />
                <Input
                  label="PromptPay (เบอร์โทร/เลขบัตร ปชช.)"
                  name="promptpay"
                  value={bankData.promptpay}
                  onChange={handleBankChange}
                  placeholder="เบอร์โทร หรือ เลขบัตร ปชช."
                  className="bg-brand-bg/30 border-brand-border/50 focus:bg-white transition-all"
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
          <Card variant="elevated" className="border-none shadow-lg shadow-brand-primary/5 p-6 sm:p-8">
            <div className="flex items-center justify-between mb-6">
               <h2 className="font-bold text-lg text-brand-text-dark flex items-center gap-2">
                 <div className="p-2 bg-brand-error/10 rounded-lg text-brand-error">
                    <Lock className="w-5 h-5" />
                 </div>
                 เปลี่ยนรหัสผ่าน
               </h2>
            </div>
            
            <div className="space-y-6">
              <Input
                label="รหัสผ่านปัจจุบัน"
                type="password"
                name="currentPassword"
                value={formData.currentPassword}
                onChange={handleChange}
                leftIcon={<Lock className="w-4 h-4" />}
                className="bg-brand-bg/30 border-brand-border/50 focus:bg-white transition-all"
              />
              <div className="grid sm:grid-cols-2 gap-6">
                <Input
                  label="รหัสผ่านใหม่"
                  type="password"
                  name="newPassword"
                  value={formData.newPassword}
                  onChange={handleChange}
                  leftIcon={<Lock className="w-4 h-4" />}
                  className="bg-brand-bg/30 border-brand-border/50 focus:bg-white transition-all"
                />
                <Input
                  label="ยืนยันรหัสผ่านใหม่"
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  leftIcon={<Lock className="w-4 h-4" />}
                  className="bg-brand-bg/30 border-brand-border/50 focus:bg-white transition-all"
                />
              </div>
            </div>
          </Card>

          {/* Notification Settings */}
          <Card variant="elevated" className="border-none shadow-lg shadow-brand-primary/5 p-6 sm:p-8">
            <div className="flex items-center justify-between mb-6">
               <h2 className="font-bold text-lg text-brand-text-dark flex items-center gap-2">
                 <div className="p-2 bg-brand-warning/10 rounded-lg text-brand-warning">
                    <Bell className="w-5 h-5" />
                 </div>
                 การแจ้งเตือน
               </h2>
            </div>
            
            <div className="space-y-1">
              {[
                { key: "orders", label: "ออเดอร์ใหม่", desc: "แจ้งเตือนทันทีเมื่อมีลูกค้าสั่งซื้อบริการ", enabled: true },
                { key: "team", label: "งานทีม", desc: "แจ้งเตือนเมื่อ Worker ส่งงานหรือขอเบิกเงิน", enabled: true },
                { key: "finance", label: "การเงิน", desc: "แจ้งเตือนเมื่อมีการเติมเงินหรือถอนเงิน", enabled: false },
                { key: "promo", label: "โปรโมชั่น", desc: "รับข่าวสารโปรโมชั่นและอัพเดทใหม่ๆ", enabled: false },
              ].map((item, index) => (
                <div
                  key={item.key}
                  className={`flex items-center justify-between p-4 rounded-xl hover:bg-brand-bg/30 transition-colors ${index !== 3 ? 'border-b border-brand-border/30' : ''}`}
                >
                  <div>
                    <p className="font-bold text-brand-text-dark text-sm">{item.label}</p>
                    <p className="text-xs text-brand-text-light mt-0.5">{item.desc}</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      className="sr-only peer"
                      defaultChecked={item.enabled}
                    />
                    <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:bg-brand-primary peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all shadow-inner"></div>
                  </label>
                </div>
              ))}
            </div>
          </Card>

          {/* Action Buttons */}
          <div className="flex flex-col-reverse sm:flex-row justify-end gap-4 pt-4 border-t border-brand-border/50">
             <Button variant="ghost" className="text-brand-error hover:bg-brand-error/10 hover:text-brand-error">
                <LogOut className="w-4 h-4 mr-2" />
                ออกจากระบบ
             </Button>
             <div className="flex gap-3">
                <Button variant="outline" className="px-6">ยกเลิก</Button>
                <Button onClick={handleSave} className="px-8 shadow-lg shadow-brand-primary/20">
                  <Save className="w-4 h-4 mr-2" />
                  บันทึกการเปลี่ยนแปลง
                </Button>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
}

