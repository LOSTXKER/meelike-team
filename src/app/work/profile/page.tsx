"use client";

import { useState } from "react";
import { Card, Button, Input, Badge, Progress } from "@/components/ui";
import { PageHeader } from "@/components/shared";
import { useAuthStore } from "@/lib/store";
import {
  User,
  Mail,
  Phone,
  Lock,
  Camera,
  Save,
  Star,
  Award,
  TrendingUp,
  Calendar,
  CheckCircle2,
  Trophy,
  Flame,
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

  const stats = {
    totalJobs: 245,
    rating: 4.9,
    totalEarnings: 12500,
    level: "Gold",
    streak: 7,
    rank: 1,
    nextLevelProgress: 75,
  };

  const achievements = [
    { icon: <Trophy className="w-6 h-6" />, title: "Top Worker", desc: "อันดับ 1 ประจำสัปดาห์", color: "text-yellow-500" },
    { icon: <Flame className="w-6 h-6" />, title: "7 Day Streak", desc: "ทำงานติดต่อกัน 7 วัน", color: "text-orange-500" },
    { icon: <Star className="w-6 h-6" />, title: "5 Star Rating", desc: "คะแนนเฉลี่ย 4.9+", color: "text-purple-500" },
    { icon: <CheckCircle2 className="w-6 h-6" />, title: "100% Success", desc: "งานสำเร็จ 100 งาน", color: "text-green-500" },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <PageHeader
        title="โปรไฟล์ของฉัน"
        description="จัดการข้อมูลและดูสถิติการทำงาน"
        icon={User}
      />

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Left Column - Stats */}
        <div className="lg:col-span-1 space-y-4">
          {/* Profile Card */}
          <Card variant="bordered" padding="lg" className="text-center">
            <div className="relative inline-block">
              <div className="w-24 h-24 bg-brand-primary/10 rounded-full flex items-center justify-center text-4xl mx-auto">
                น
              </div>
              <button className="absolute bottom-0 right-0 w-8 h-8 bg-brand-primary text-white rounded-full flex items-center justify-center shadow-lg">
                <Camera className="w-4 h-4" />
              </button>
            </div>
            <h2 className="text-xl font-bold text-brand-text-dark mt-4">
              {formData.displayName}
            </h2>
            <div className="flex items-center justify-center gap-2 mt-1">
              <Badge variant="warning">{stats.level}</Badge>
              <span className="text-brand-text-light">•</span>
              <span className="flex items-center gap-1 text-brand-warning">
                <Star className="w-4 h-4 fill-current" />
                {stats.rating}
              </span>
            </div>

            {/* Level Progress */}
            <div className="mt-4 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-brand-text-light">ถึง Platinum</span>
                <span className="font-medium text-brand-text-dark">
                  {stats.nextLevelProgress}%
                </span>
              </div>
              <Progress value={stats.nextLevelProgress} />
            </div>
          </Card>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 gap-3">
            <Card variant="bordered" padding="sm" className="text-center">
              <CheckCircle2 className="w-5 h-5 text-brand-success mx-auto mb-1" />
              <p className="text-xl font-bold text-brand-text-dark">
                {stats.totalJobs}
              </p>
              <p className="text-xs text-brand-text-light">งานสำเร็จ</p>
            </Card>
            <Card variant="bordered" padding="sm" className="text-center">
              <TrendingUp className="w-5 h-5 text-brand-primary mx-auto mb-1" />
              <p className="text-xl font-bold text-brand-text-dark">
                ฿{stats.totalEarnings.toLocaleString()}
              </p>
              <p className="text-xs text-brand-text-light">รายได้รวม</p>
            </Card>
            <Card variant="bordered" padding="sm" className="text-center">
              <Calendar className="w-5 h-5 text-brand-warning mx-auto mb-1" />
              <p className="text-xl font-bold text-brand-text-dark">
                {stats.streak} วัน
              </p>
              <p className="text-xs text-brand-text-light">ทำงานติดต่อกัน</p>
            </Card>
            <Card variant="bordered" padding="sm" className="text-center">
              <Award className="w-5 h-5 text-brand-info mx-auto mb-1" />
              <p className="text-xl font-bold text-brand-text-dark">
                #{stats.rank}
              </p>
              <p className="text-xs text-brand-text-light">อันดับสัปดาห์</p>
            </Card>
          </div>

          {/* Achievements */}
          <Card variant="bordered" padding="md">
            <h3 className="font-semibold text-brand-text-dark mb-3 flex items-center gap-1">
              <Award className="w-4 h-4" />
              ความสำเร็จ
            </h3>
            <div className="grid grid-cols-2 gap-2">
              {achievements.map((ach, index) => (
                <div
                  key={index}
                  className="p-2 bg-brand-bg rounded-lg text-center"
                >
                  <span className={`flex items-center justify-center mb-1 ${ach.color}`}>{ach.icon}</span>
                  <p className="text-xs font-medium text-brand-text-dark mt-1">
                    {ach.title}
                  </p>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Right Column - Forms */}
        <div className="lg:col-span-2 space-y-4">
          {/* Basic Info */}
          <Card variant="bordered" padding="lg">
            <h2 className="font-semibold text-brand-text-dark mb-4 flex items-center gap-2">
              <ClipboardList className="w-5 h-5 text-brand-primary" />
              ข้อมูลพื้นฐาน
            </h2>
            <div className="grid gap-4">
              <Input
                label="ชื่อที่แสดง"
                name="displayName"
                value={formData.displayName}
                onChange={handleChange}
                leftIcon={<User className="w-4 h-4" />}
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
            <h2 className="font-semibold text-brand-text-dark mb-4">
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

          {/* Bank Account */}
          <Card variant="bordered" padding="lg">
            <h2 className="font-semibold text-brand-text-dark mb-4">
              🏦 บัญชีธนาคาร (สำหรับถอนเงิน)
            </h2>
            <div className="grid gap-4">
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-brand-text-dark mb-1.5">
                    ธนาคาร
                  </label>
                  <select className="w-full bg-brand-surface border border-brand-border rounded-lg px-3 py-2 text-brand-text-dark focus:outline-none focus:border-brand-primary">
                    <option>ธนาคารกสิกรไทย</option>
                    <option>ธนาคารไทยพาณิชย์</option>
                    <option>ธนาคารกรุงเทพ</option>
                    <option>ธนาคารกรุงไทย</option>
                  </select>
                </div>
                <Input label="เลขบัญชี" placeholder="xxx-x-xxxxx-x" />
              </div>
              <Input label="ชื่อบัญชี" placeholder="ชื่อ นามสกุล" />
            </div>
          </Card>

          {/* Save Button */}
          <div className="flex justify-end gap-3">
            <Button variant="outline">ยกเลิก</Button>
            <Button onClick={handleSave}>
              <Save className="w-4 h-4 mr-2" />
              บันทึกการเปลี่ยนแปลง
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

