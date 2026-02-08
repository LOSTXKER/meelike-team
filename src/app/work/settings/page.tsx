"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Card, Button, Input, Badge, Skeleton } from "@/components/ui";
import { VStack } from "@/components/layout";
import { useAuthStore } from "@/lib/store";
import { useUpdateWorkerProfile } from "@/lib/api/hooks";
import { useToast } from "@/components/ui/toast";
import { DEFAULT_KYC_DATA } from "@/types";
import {
  User,
  Mail,
  Phone,
  Camera,
  Save,
  MessageCircle,
  Shield,
  ChevronRight,
  Lock,
  Wallet,
  Building2,
} from "lucide-react";

export default function WorkerSettingsProfilePage() {
  const { user } = useAuthStore();
  const worker = user?.worker;
  const updateProfile = useUpdateWorkerProfile();
  const toast = useToast();

  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => { const t = setTimeout(() => setIsLoading(false), 300); return () => clearTimeout(t); }, []);

  const kycLevel = worker?.kyc?.level || DEFAULT_KYC_DATA.level;
  const kycLabel = kycLevel === "none" ? "ยังไม่ยืนยัน" : kycLevel === "basic" ? "Basic" : kycLevel === "verified" ? "Verified" : "Business";
  const hasBankInfo = worker?.bankName && worker?.bankAccount;

  const [formData, setFormData] = useState({
    displayName: worker?.displayName || "",
    email: user?.email || "",
    phone: worker?.phone || "",
    lineId: worker?.lineId || "",
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSave = () => {
    updateProfile.mutate(
      {
        displayName: formData.displayName,
        phone: formData.phone,
        lineId: formData.lineId,
      },
      {
        onSuccess: () => toast.success("บันทึกข้อมูลเรียบร้อย"),
        onError: () => toast.error("เกิดข้อผิดพลาด กรุณาลองใหม่"),
      }
    );
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-64 rounded-xl" />
        <Skeleton className="h-48 rounded-xl" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Profile Photo */}
      <Card className="border-none shadow-md">
        <div className="p-6">
          <h2 className="text-lg font-bold text-brand-text-dark mb-4">รูปโปรไฟล์</h2>
          <div className="flex items-center gap-6">
            <div className="relative">
              <div className="w-24 h-24 rounded-full bg-brand-primary/10 flex items-center justify-center text-3xl font-bold text-brand-primary border-4 border-white shadow-lg">
                {worker?.displayName?.charAt(0) || "W"}
              </div>
              <button className="absolute bottom-0 right-0 w-8 h-8 bg-brand-primary text-white rounded-full flex items-center justify-center shadow-md hover:bg-brand-primary/90 transition-colors">
                <Camera className="w-4 h-4" />
              </button>
            </div>
            <div>
              <p className="font-medium text-brand-text-dark">{worker?.displayName || "Worker"}</p>
              <p className="text-sm text-brand-text-light">คลิกที่ไอคอนกล้องเพื่อเปลี่ยนรูป</p>
            </div>
          </div>
        </div>
      </Card>

      {/* Quick Links: KYC & Bank */}
      <div className="grid sm:grid-cols-2 gap-4">
        <Link href="/work/settings/verification">
          <Card className="border-none shadow-sm cursor-pointer hover:shadow-md transition-all h-full">
            <div className="p-4 flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center shrink-0">
                <Shield className="w-5 h-5 text-blue-600" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-brand-text-dark text-sm">ยืนยันตัวตน (KYC)</p>
                <p className="text-xs text-brand-text-light truncate">เพิ่มวงเงินการถอน</p>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <Badge
                  variant={kycLevel === "none" ? "warning" : kycLevel === "business" ? "success" : "info"}
                  size="sm"
                >
                  {kycLabel}
                </Badge>
                <ChevronRight className="w-4 h-4 text-brand-text-light" />
              </div>
            </div>
          </Card>
        </Link>
        <Link href="/work/settings/bank">
          <Card className="border-none shadow-sm cursor-pointer hover:shadow-md transition-all h-full">
            <div className="p-4 flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-brand-success/10 flex items-center justify-center shrink-0">
                <Building2 className="w-5 h-5 text-brand-success" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-brand-text-dark text-sm">บัญชีรับเงิน</p>
                <p className="text-xs text-brand-text-light truncate">ธนาคาร, PromptPay</p>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <Badge variant={hasBankInfo ? "success" : "warning"} size="sm">
                  {hasBankInfo ? "ตั้งค่าแล้ว" : "ยังไม่ตั้งค่า"}
                </Badge>
                <ChevronRight className="w-4 h-4 text-brand-text-light" />
              </div>
            </div>
          </Card>
        </Link>
      </div>

      {/* Personal Info */}
      <Card className="border-none shadow-md">
        <div className="p-6">
          <h2 className="text-lg font-bold text-brand-text-dark mb-4">ข้อมูลส่วนตัว</h2>
          <VStack gap={4}>
            <div>
              <label className="text-sm font-medium text-brand-text-dark mb-1.5 flex items-center gap-2">
                <User className="w-4 h-4 text-brand-primary" />
                ชื่อที่แสดง
              </label>
              <Input
                name="displayName"
                value={formData.displayName}
                onChange={handleChange}
                placeholder="ชื่อที่แสดงในระบบ"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-brand-text-dark mb-1.5 flex items-center gap-2">
                <Mail className="w-4 h-4 text-brand-primary" />
                อีเมล
              </label>
              <Input
                name="email"
                value={formData.email}
                readOnly
                className="bg-brand-bg/50"
              />
              <p className="text-xs text-brand-text-light mt-1">ไม่สามารถเปลี่ยนอีเมลได้</p>
            </div>
            <div>
              <label className="text-sm font-medium text-brand-text-dark mb-1.5 flex items-center gap-2">
                <Phone className="w-4 h-4 text-brand-primary" />
                เบอร์โทรศัพท์
              </label>
              <Input
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="0XX-XXX-XXXX"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-brand-text-dark mb-1.5 flex items-center gap-2">
                <MessageCircle className="w-4 h-4 text-brand-success" />
                LINE ID
              </label>
              <Input
                name="lineId"
                value={formData.lineId}
                onChange={handleChange}
                placeholder="@your_line_id"
              />
            </div>
          </VStack>
        </div>
      </Card>

      {/* Change Password */}
      <Card className="border-none shadow-md">
        <div className="p-6">
          <h2 className="text-lg font-bold text-brand-text-dark mb-4 flex items-center gap-2">
            <Lock className="w-5 h-5 text-brand-warning" />
            เปลี่ยนรหัสผ่าน
          </h2>
          <VStack gap={4}>
            <div>
              <label className="text-sm font-medium text-brand-text-dark mb-1.5 block">รหัสผ่านปัจจุบัน</label>
              <Input
                type="password"
                name="currentPassword"
                value={formData.currentPassword}
                onChange={handleChange}
                placeholder="รหัสผ่านปัจจุบัน"
              />
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-brand-text-dark mb-1.5 block">รหัสผ่านใหม่</label>
                <Input
                  type="password"
                  name="newPassword"
                  value={formData.newPassword}
                  onChange={handleChange}
                  placeholder="รหัสผ่านใหม่"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-brand-text-dark mb-1.5 block">ยืนยันรหัสผ่านใหม่</label>
                <Input
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="ยืนยันรหัสผ่านใหม่"
                />
              </div>
            </div>
          </VStack>
        </div>
      </Card>

      {/* Save */}
      <div className="flex justify-end">
        <Button
          onClick={handleSave}
          disabled={updateProfile.isPending}
          className="shadow-md shadow-brand-primary/20"
        >
          <Save className="w-4 h-4 mr-2" />
          {updateProfile.isPending ? "กำลังบันทึก..." : "บันทึกการเปลี่ยนแปลง"}
        </Button>
      </div>
    </div>
  );
}
