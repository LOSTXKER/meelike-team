"use client";

import { useState } from "react";
import {
  Settings,
  Shield,
  Bell,
  Mail,
  DollarSign,
  Users,
  FileText,
  Save,
  RefreshCw,
  CheckCircle2,
  AlertTriangle,
  Globe,
  Lock,
  CreditCard,
} from "lucide-react";
import {
  Card,
  Button,
  Input,
  Switch,
} from "@/components/ui";

interface SettingsSection {
  id: string;
  title: string;
  description: string;
  icon: React.ElementType;
}

const SECTIONS: SettingsSection[] = [
  { id: "general", title: "ทั่วไป", description: "ตั้งค่าพื้นฐานของระบบ", icon: Settings },
  { id: "kyc", title: "KYC", description: "การยืนยันตัวตน", icon: Shield },
  { id: "payment", title: "การเงิน", description: "ค่าธรรมเนียมและการชำระเงิน", icon: DollarSign },
  { id: "notification", title: "การแจ้งเตือน", description: "การแจ้งเตือนอัตโนมัติ", icon: Bell },
  { id: "security", title: "ความปลอดภัย", description: "การรักษาความปลอดภัย", icon: Lock },
];

export default function AdminSettingsPage() {
  const [activeSection, setActiveSection] = useState("general");
  const [isSaving, setIsSaving] = useState(false);
  const [showSaveSuccess, setShowSaveSuccess] = useState(false);

  // General Settings
  const [siteName, setSiteName] = useState("MeeLike Seller");
  const [siteDescription, setSiteDescription] = useState("แพลตฟอร์มบริหารจัดการ Social Media Marketing");
  const [maintenanceMode, setMaintenanceMode] = useState(false);
  const [allowRegistration, setAllowRegistration] = useState(true);

  // KYC Settings
  const [requireKYCForWithdraw, setRequireKYCForWithdraw] = useState(true);
  const [requireKYCForTopup, setRequireKYCForTopup] = useState(true);
  const [autoApproveBasicKYC, setAutoApproveBasicKYC] = useState(false);
  const [kycExpiryDays, setKycExpiryDays] = useState("365");

  // Payment Settings
  const [platformFeePercent, setPlatformFeePercent] = useState("15");
  const [minWithdrawAmount, setMinWithdrawAmount] = useState("100");
  const [maxWithdrawPerDay, setMaxWithdrawPerDay] = useState("50000");
  const [withdrawProcessingDays, setWithdrawProcessingDays] = useState("3");

  // Notification Settings
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [newUserNotification, setNewUserNotification] = useState(true);
  const [kycPendingNotification, setKycPendingNotification] = useState(true);
  const [reportNotification, setReportNotification] = useState(true);

  // Security Settings
  const [twoFactorRequired, setTwoFactorRequired] = useState(false);
  const [sessionTimeoutMinutes, setSessionTimeoutMinutes] = useState("60");
  const [maxLoginAttempts, setMaxLoginAttempts] = useState("5");
  const [ipWhitelist, setIpWhitelist] = useState("");

  const handleSave = async () => {
    setIsSaving(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setIsSaving(false);
    setShowSaveSuccess(true);
    setTimeout(() => setShowSaveSuccess(false), 3000);
  };

  const renderSection = () => {
    switch (activeSection) {
      case "general":
        return (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-brand-text-dark mb-2">
                ชื่อเว็บไซต์
              </label>
              <Input
                value={siteName}
                onChange={(e) => setSiteName(e.target.value)}
                placeholder="ชื่อเว็บไซต์"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-brand-text-dark mb-2">
                คำอธิบายเว็บไซต์
              </label>
              <Input
                value={siteDescription}
                onChange={(e) => setSiteDescription(e.target.value)}
                placeholder="คำอธิบายเว็บไซต์"
              />
            </div>
            <div className="flex items-center justify-between p-4 bg-brand-bg/50 rounded-lg">
              <div>
                <p className="font-medium text-brand-text-dark">โหมดปิดปรับปรุง</p>
                <p className="text-sm text-brand-text-light">ปิดการเข้าถึงเว็บไซต์ชั่วคราว</p>
              </div>
              <Switch
                checked={maintenanceMode}
                onChange={setMaintenanceMode}
              />
            </div>
            <div className="flex items-center justify-between p-4 bg-brand-bg/50 rounded-lg">
              <div>
                <p className="font-medium text-brand-text-dark">เปิดรับสมัครสมาชิก</p>
                <p className="text-sm text-brand-text-light">อนุญาตให้ผู้ใช้ใหม่สมัครสมาชิก</p>
              </div>
              <Switch
                checked={allowRegistration}
                onChange={setAllowRegistration}
              />
            </div>
          </div>
        );

      case "kyc":
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between p-4 bg-brand-bg/50 rounded-lg">
              <div>
                <p className="font-medium text-brand-text-dark">บังคับ KYC สำหรับถอนเงิน</p>
                <p className="text-sm text-brand-text-light">ผู้ใช้ต้องยืนยันตัวตนก่อนถอนเงิน</p>
              </div>
              <Switch
                checked={requireKYCForWithdraw}
                onChange={setRequireKYCForWithdraw}
              />
            </div>
            <div className="flex items-center justify-between p-4 bg-brand-bg/50 rounded-lg">
              <div>
                <p className="font-medium text-brand-text-dark">บังคับ KYC สำหรับเติมเงิน</p>
                <p className="text-sm text-brand-text-light">ผู้ใช้ต้องยืนยันตัวตนก่อนเติมเงิน</p>
              </div>
              <Switch
                checked={requireKYCForTopup}
                onChange={setRequireKYCForTopup}
              />
            </div>
            <div className="flex items-center justify-between p-4 bg-brand-bg/50 rounded-lg">
              <div>
                <p className="font-medium text-brand-text-dark">อนุมัติ Basic KYC อัตโนมัติ</p>
                <p className="text-sm text-brand-text-light">อนุมัติการยืนยัน OTP โดยอัตโนมัติ</p>
              </div>
              <Switch
                checked={autoApproveBasicKYC}
                onChange={setAutoApproveBasicKYC}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-brand-text-dark mb-2">
                อายุการยืนยัน KYC (วัน)
              </label>
              <Input
                type="number"
                value={kycExpiryDays}
                onChange={(e) => setKycExpiryDays(e.target.value)}
                placeholder="365"
              />
              <p className="text-xs text-brand-text-light mt-1">
                ระยะเวลาที่การยืนยัน KYC ยังคงใช้ได้
              </p>
            </div>
          </div>
        );

      case "payment":
        return (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-brand-text-dark mb-2">
                ค่าธรรมเนียมแพลตฟอร์ม (%)
              </label>
              <Input
                type="number"
                value={platformFeePercent}
                onChange={(e) => setPlatformFeePercent(e.target.value)}
                placeholder="15"
              />
              <p className="text-xs text-brand-text-light mt-1">
                เปอร์เซ็นต์ที่หักจากยอดขาย
              </p>
            </div>
            <div>
              <label className="block text-sm font-medium text-brand-text-dark mb-2">
                ยอดถอนขั้นต่ำ (บาท)
              </label>
              <Input
                type="number"
                value={minWithdrawAmount}
                onChange={(e) => setMinWithdrawAmount(e.target.value)}
                placeholder="100"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-brand-text-dark mb-2">
                วงเงินถอนสูงสุดต่อวัน (บาท)
              </label>
              <Input
                type="number"
                value={maxWithdrawPerDay}
                onChange={(e) => setMaxWithdrawPerDay(e.target.value)}
                placeholder="50000"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-brand-text-dark mb-2">
                ระยะเวลาดำเนินการถอน (วัน)
              </label>
              <Input
                type="number"
                value={withdrawProcessingDays}
                onChange={(e) => setWithdrawProcessingDays(e.target.value)}
                placeholder="3"
              />
            </div>
          </div>
        );

      case "notification":
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between p-4 bg-brand-bg/50 rounded-lg">
              <div>
                <p className="font-medium text-brand-text-dark">แจ้งเตือนทางอีเมล</p>
                <p className="text-sm text-brand-text-light">ส่งอีเมลแจ้งเตือนถึง Admin</p>
              </div>
              <Switch
                checked={emailNotifications}
                onChange={setEmailNotifications}
              />
            </div>
            <div className="flex items-center justify-between p-4 bg-brand-bg/50 rounded-lg">
              <div>
                <p className="font-medium text-brand-text-dark">แจ้งเตือนผู้ใช้ใหม่</p>
                <p className="text-sm text-brand-text-light">แจ้งเตือนเมื่อมีผู้สมัครสมาชิกใหม่</p>
              </div>
              <Switch
                checked={newUserNotification}
                onChange={setNewUserNotification}
              />
            </div>
            <div className="flex items-center justify-between p-4 bg-brand-bg/50 rounded-lg">
              <div>
                <p className="font-medium text-brand-text-dark">แจ้งเตือน KYC รอตรวจสอบ</p>
                <p className="text-sm text-brand-text-light">แจ้งเตือนเมื่อมี KYC รอการอนุมัติ</p>
              </div>
              <Switch
                checked={kycPendingNotification}
                onChange={setKycPendingNotification}
              />
            </div>
            <div className="flex items-center justify-between p-4 bg-brand-bg/50 rounded-lg">
              <div>
                <p className="font-medium text-brand-text-dark">แจ้งเตือนรายงานเนื้อหา</p>
                <p className="text-sm text-brand-text-light">แจ้งเตือนเมื่อมีการรายงานเนื้อหาใหม่</p>
              </div>
              <Switch
                checked={reportNotification}
                onChange={setReportNotification}
              />
            </div>
          </div>
        );

      case "security":
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between p-4 bg-brand-bg/50 rounded-lg">
              <div>
                <p className="font-medium text-brand-text-dark">บังคับใช้ Two-Factor Authentication</p>
                <p className="text-sm text-brand-text-light">บังคับให้ Admin ทุกคนใช้ 2FA</p>
              </div>
              <Switch
                checked={twoFactorRequired}
                onChange={setTwoFactorRequired}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-brand-text-dark mb-2">
                Session Timeout (นาที)
              </label>
              <Input
                type="number"
                value={sessionTimeoutMinutes}
                onChange={(e) => setSessionTimeoutMinutes(e.target.value)}
                placeholder="60"
              />
              <p className="text-xs text-brand-text-light mt-1">
                ระยะเวลาก่อน logout อัตโนมัติเมื่อไม่มีกิจกรรม
              </p>
            </div>
            <div>
              <label className="block text-sm font-medium text-brand-text-dark mb-2">
                จำนวนครั้งที่อนุญาตให้ login ผิดพลาด
              </label>
              <Input
                type="number"
                value={maxLoginAttempts}
                onChange={(e) => setMaxLoginAttempts(e.target.value)}
                placeholder="5"
              />
              <p className="text-xs text-brand-text-light mt-1">
                หลังจากนั้นบัญชีจะถูกล็อคชั่วคราว
              </p>
            </div>
            <div>
              <label className="block text-sm font-medium text-brand-text-dark mb-2">
                IP Whitelist (คั่นด้วยเครื่องหมายจุลภาค)
              </label>
              <Input
                value={ipWhitelist}
                onChange={(e) => setIpWhitelist(e.target.value)}
                placeholder="เช่น 192.168.1.1, 10.0.0.1"
              />
              <p className="text-xs text-brand-text-light mt-1">
                เว้นว่างเพื่ออนุญาตทุก IP
              </p>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-brand-text-dark">ตั้งค่าระบบ</h1>
          <p className="text-brand-text-light mt-1">จัดการการตั้งค่าต่างๆ ของระบบ</p>
        </div>
        <div className="flex items-center gap-3">
          {showSaveSuccess && (
            <div className="flex items-center gap-2 text-green-600 bg-green-50 px-3 py-2 rounded-lg">
              <CheckCircle2 className="w-4 h-4" />
              <span className="text-sm">บันทึกเรียบร้อย</span>
            </div>
          )}
          <Button onClick={handleSave} disabled={isSaving}>
            {isSaving ? (
              <>
                <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                กำลังบันทึก...
              </>
            ) : (
              <>
                <Save className="w-4 h-4 mr-2" />
                บันทึกการตั้งค่า
              </>
            )}
          </Button>
        </div>
      </div>

      <div className="grid lg:grid-cols-4 gap-6">
        {/* Sidebar */}
        <div className="lg:col-span-1">
          <Card className="p-2">
            <nav className="space-y-1">
              {SECTIONS.map((section) => {
                const Icon = section.icon;
                const isActive = activeSection === section.id;
                return (
                  <button
                    key={section.id}
                    onClick={() => setActiveSection(section.id)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-colors ${
                      isActive
                        ? "bg-brand-primary text-white"
                        : "text-brand-text-light hover:bg-brand-bg hover:text-brand-text-dark"
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <div>
                      <p className="font-medium text-sm">{section.title}</p>
                      <p className={`text-xs ${isActive ? "text-white/70" : "text-brand-text-light"}`}>
                        {section.description}
                      </p>
                    </div>
                  </button>
                );
              })}
            </nav>
          </Card>
        </div>

        {/* Content */}
        <div className="lg:col-span-3">
          <Card className="p-6">
            <div className="mb-6">
              <h2 className="text-lg font-semibold text-brand-text-dark">
                {SECTIONS.find((s) => s.id === activeSection)?.title}
              </h2>
              <p className="text-sm text-brand-text-light">
                {SECTIONS.find((s) => s.id === activeSection)?.description}
              </p>
            </div>
            {renderSection()}
          </Card>
        </div>
      </div>
    </div>
  );
}
