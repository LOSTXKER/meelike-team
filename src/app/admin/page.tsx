"use client";

import { Card, Badge } from "@/components/ui";
import { 
  Shield, 
  Users, 
  Clock, 
  CheckCircle, 
  AlertCircle,
  TrendingUp
} from "lucide-react";
import Link from "next/link";

// Mock data
const stats = [
  { label: "รอตรวจสอบ KYC", value: 12, icon: Clock, color: "text-amber-600", bg: "bg-amber-50" },
  { label: "อนุมัติวันนี้", value: 8, icon: CheckCircle, color: "text-emerald-600", bg: "bg-emerald-50" },
  { label: "ปฏิเสธวันนี้", value: 2, icon: AlertCircle, color: "text-red-600", bg: "bg-red-50" },
  { label: "ผู้ใช้ทั้งหมด", value: 1234, icon: Users, color: "text-blue-600", bg: "bg-blue-50" },
];

export default function AdminDashboardPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-brand-text-dark">Dashboard</h1>
        <p className="text-brand-text-light">ภาพรวมระบบ Admin</p>
      </div>

      {/* Stats Grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <Card key={stat.label} className="border-none shadow-md p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-brand-text-light">{stat.label}</p>
                <p className="text-2xl font-bold text-brand-text-dark mt-1">
                  {stat.value.toLocaleString()}
                </p>
              </div>
              <div className={`w-12 h-12 rounded-xl ${stat.bg} flex items-center justify-center`}>
                <stat.icon className={`w-6 h-6 ${stat.color}`} />
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="grid sm:grid-cols-2 gap-4">
        <Link href="/admin/kyc">
          <Card className="border-none shadow-md p-5 cursor-pointer hover:shadow-lg transition-shadow">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-brand-primary/10 flex items-center justify-center">
                <Shield className="w-6 h-6 text-brand-primary" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-brand-text-dark">ตรวจสอบ KYC</h3>
                <p className="text-sm text-brand-text-light">มี 12 รายการรอตรวจสอบ</p>
              </div>
              <Badge variant="warning">12</Badge>
            </div>
          </Card>
        </Link>

        <Link href="/admin/users">
          <Card className="border-none shadow-md p-5 cursor-pointer hover:shadow-lg transition-shadow">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center">
                <Users className="w-6 h-6 text-blue-600" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-brand-text-dark">จัดการผู้ใช้</h3>
                <p className="text-sm text-brand-text-light">ดูและจัดการบัญชีผู้ใช้</p>
              </div>
            </div>
          </Card>
        </Link>
      </div>
    </div>
  );
}
