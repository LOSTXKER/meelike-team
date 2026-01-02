"use client";

import { useState } from "react";
import { Card, Button, Input, Badge } from "@/components/ui";
import { Container, Grid, Section, VStack, HStack } from "@/components/layout";
import { useAuthStore } from "@/lib/store";
import {
  User,
  Mail,
  Phone,
  Lock,
  Camera,
  Save,
  ClipboardList,
  Building2,
  Settings,
} from "lucide-react";

export default function WorkerProfilePage() {
  const { user } = useAuthStore();
  const worker = user?.worker;

  const [formData, setFormData] = useState({
    displayName: worker?.displayName || "นุ่น",
    email: user?.email || "noon@example.com",
    phone: "080-xxx-xxxx",
    lineId: "@noon_worker",
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSave = () => {
    alert("บันทึกการเปลี่ยนแปลงเรียบร้อย");
  };

  return (
    <Container size="xl">
      <Section spacing="lg" className="animate-fade-in">
        {/* Header */}
        <VStack gap={2}>
          <HStack gap={3} align="center" className="text-3xl font-bold text-brand-text-dark tracking-tight">
            <span className="p-2.5 bg-brand-primary/10 rounded-xl">
              <Settings className="w-7 h-7 text-brand-primary" />
            </span>
            ตั้งค่าบัญชี
          </HStack>
          <p className="text-brand-text-light text-lg">
            จัดการข้อมูลส่วนตัวและรหัสผ่าน
          </p>
        </VStack>

        <Grid cols={1} responsive={{ lg: 3 }} gap={8}>
        {/* Left Column - Quick Profile & Navigation (Optional future nav) */}
        <div className="lg:col-span-1 space-y-6">
          {/* Simple Profile Card */}
          <Card variant="elevated" className="border-none shadow-lg text-center py-8">
            <div className="relative inline-block">
              <div className="w-32 h-32 bg-brand-bg rounded-full flex items-center justify-center text-5xl shadow-md border-4 border-white text-brand-primary font-bold mx-auto">
                {formData.displayName.charAt(0)}
              </div>
              <button className="absolute bottom-0 right-0 w-10 h-10 bg-brand-primary text-white rounded-full flex items-center justify-center shadow-lg hover:bg-brand-primary/90 transition-colors border-2 border-white">
                <Camera className="w-5 h-5" />
              </button>
            </div>
            <h2 className="text-2xl font-bold text-brand-text-dark mt-4">
              {formData.displayName}
            </h2>
            <p className="text-brand-text-light text-sm mt-1">{formData.email}</p>
          </Card>
        </div>

        {/* Right Column - Forms */}
        <div className="lg:col-span-2 space-y-6">
          {/* Basic Info */}
          <Card variant="elevated" className="border-none shadow-lg">
            <h2 className="text-lg font-bold text-brand-text-dark mb-6 flex items-center gap-3 border-b border-brand-border/50 pb-4">
              <div className="p-2 bg-brand-primary/10 rounded-xl">
                <ClipboardList className="w-5 h-5 text-brand-primary" />
              </div>
              ข้อมูลพื้นฐาน
            </h2>
            <div className="grid gap-5">
              <Input
                label="ชื่อที่แสดง"
                name="displayName"
                value={formData.displayName}
                onChange={handleChange}
                leftIcon={<User className="w-4 h-4" />}
              />
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
              <Input
                label="LINE ID"
                name="lineId"
                value={formData.lineId}
                onChange={handleChange}
                leftIcon={
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M19.365 9.863c.349 0 .63.285.63.631 0 .345-.281.63-.63.63H17.61v1.125h1.755c.349 0 .63.283.63.63 0 .344-.281.629-.63.629h-2.386c-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.63-.63h2.386c.346 0 .627.285.627.63 0 .349-.281.63-.63.63H17.61v1.125h1.755zm-3.855 3.016c0 .27-.174.51-.432.596-.064.021-.133.031-.199.031-.211 0-.391-.09-.51-.25l-2.443-3.317v2.94c0 .344-.279.629-.631.629-.346 0-.626-.285-.626-.629V8.108c0-.27.173-.51.43-.595.06-.023.136-.033.194-.033.195 0 .375.104.495.254l2.462 3.33V8.108c0-.345.282-.63.63-.63.345 0 .63.285.63.63v4.771zm-5.741 0c0 .344-.282.629-.631.629-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.63-.63.346 0 .628.285.628.63v4.771zm-2.466.629H4.917c-.345 0-.63-.285-.63-.629V8.108c0-.345.285-.63.63-.63.348 0 .63.285.63.63v4.141h1.756c.348 0 .629.283.629.63 0 .344-.282.629-.629.629M24 10.314C24 4.943 18.615.572 12 .572S0 4.943 0 10.314c0 4.811 4.27 8.842 10.035 9.608.391.082.923.258 1.058.59.12.301.079.766.038 1.08l-.164 1.02c-.045.301-.24 1.186 1.049.645 1.291-.539 6.916-4.078 9.436-6.975C23.176 14.393 24 12.458 24 10.314"/>
                  </svg>
                }
              />
            </div>
          </Card>

          {/* Change Password */}
          <Card variant="elevated" className="border-none shadow-lg">
            <h2 className="text-lg font-bold text-brand-text-dark mb-6 flex items-center gap-3 border-b border-brand-border/50 pb-4">
              <div className="p-2 bg-brand-warning/10 rounded-xl">
                <Lock className="w-5 h-5 text-brand-warning" />
              </div>
              เปลี่ยนรหัสผ่าน
            </h2>
            <div className="grid gap-5">
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

          {/* Bank Account */}
          <Card variant="elevated" className="border-none shadow-lg">
            <h2 className="text-lg font-bold text-brand-text-dark mb-6 flex items-center gap-3 border-b border-brand-border/50 pb-4">
              <div className="p-2 bg-brand-success/10 rounded-xl">
                <Building2 className="w-5 h-5 text-brand-success" />
              </div>
              บัญชีธนาคาร
              <Badge variant="info" size="sm">สำหรับถอนเงิน</Badge>
            </h2>
            <div className="grid gap-5">
              <div className="grid sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-bold text-brand-text-dark mb-2">
                    ธนาคาร
                  </label>
                  <select className="w-full bg-brand-surface border border-brand-border rounded-xl px-4 py-3 text-brand-text-dark focus:outline-none focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary shadow-sm transition-all">
                    <option>ธนาคารกสิกรไทย</option>
                    <option>ธนาคารไทยพาณิชย์</option>
                    <option>ธนาคารกรุงเทพ</option>
                    <option>ธนาคารกรุงไทย</option>
                    <option>ธนาคารกรุงศรีอยุธยา</option>
                    <option>ธนาคารทหารไทยธนชาต</option>
                  </select>
                </div>
                <Input label="เลขบัญชี" placeholder="xxx-x-xxxxx-x" />
              </div>
              <Input label="ชื่อบัญชี" placeholder="ชื่อ-นามสกุล ตามบัญชีธนาคาร" />
            </div>
          </Card>

          {/* Save Button */}
          <div className="flex justify-end gap-4 pt-4">
            <Button variant="outline" className="bg-white border-brand-border/50 shadow-sm hover:bg-brand-bg px-6">
              ยกเลิก
            </Button>
            <Button onClick={handleSave} size="lg" className="shadow-xl shadow-brand-primary/20 px-8">
              <Save className="w-5 h-5 mr-2" />
              บันทึกการเปลี่ยนแปลง
            </Button>
          </div>
        </div>
        </Grid>
      </Section>
    </Container>
  );
}

