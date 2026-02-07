"use client";

import { useState } from "react";
import {
  Users,
  Store,
  User,
  Search,
  Filter,
  MoreVertical,
  Eye,
  Ban,
  CheckCircle2,
  XCircle,
  Shield,
  Star,
  Clock,
  Mail,
  Phone,
} from "lucide-react";
import {
  Card,
  Button,
  Badge,
  Input,
  Dialog,
} from "@/components/ui";

type UserType = "all" | "seller" | "worker";
type UserStatus = "all" | "active" | "inactive" | "banned";

interface UserData {
  id: string;
  name: string;
  email: string;
  phone?: string;
  type: "seller" | "worker";
  status: "active" | "inactive" | "banned";
  kycLevel: "none" | "basic" | "verified" | "business";
  createdAt: string;
  lastActiveAt: string;
  // Seller specific
  shopName?: string;
  totalOrders?: number;
  totalRevenue?: number;
  // Worker specific
  totalJobs?: number;
  totalEarned?: number;
  rating?: number;
}

// Mock users data
const MOCK_USERS: UserData[] = [
  {
    id: "user-1",
    name: "สมชาย รักดี",
    email: "somchai@example.com",
    phone: "081-234-5678",
    type: "seller",
    status: "active",
    kycLevel: "verified",
    createdAt: "2024-01-15",
    lastActiveAt: "2024-02-05",
    shopName: "ร้านสมชายออนไลน์",
    totalOrders: 156,
    totalRevenue: 245000,
  },
  {
    id: "user-2",
    name: "นภา สวยงาม",
    email: "napa@example.com",
    phone: "089-876-5432",
    type: "worker",
    status: "active",
    kycLevel: "verified",
    createdAt: "2024-02-01",
    lastActiveAt: "2024-02-05",
    totalJobs: 89,
    totalEarned: 15600,
    rating: 4.8,
  },
  {
    id: "user-3",
    name: "วิชัย มุ่งมั่น",
    email: "wichai@example.com",
    type: "seller",
    status: "active",
    kycLevel: "basic",
    createdAt: "2024-01-20",
    lastActiveAt: "2024-02-04",
    shopName: "วิชัย Shop",
    totalOrders: 45,
    totalRevenue: 67500,
  },
  {
    id: "user-4",
    name: "ประสิทธิ์ ขยัน",
    email: "prasit@example.com",
    phone: "082-111-2222",
    type: "worker",
    status: "inactive",
    kycLevel: "none",
    createdAt: "2024-01-25",
    lastActiveAt: "2024-01-30",
    totalJobs: 12,
    totalEarned: 2400,
    rating: 4.2,
  },
  {
    id: "user-5",
    name: "มานี มีสุข",
    email: "manee@example.com",
    type: "worker",
    status: "banned",
    kycLevel: "basic",
    createdAt: "2024-01-10",
    lastActiveAt: "2024-01-28",
    totalJobs: 5,
    totalEarned: 800,
    rating: 2.1,
  },
  {
    id: "user-6",
    name: "ธนกร รวยมาก",
    email: "thanakorn@example.com",
    phone: "085-999-8888",
    type: "seller",
    status: "active",
    kycLevel: "business",
    createdAt: "2023-12-01",
    lastActiveAt: "2024-02-05",
    shopName: "Thanakorn Enterprise",
    totalOrders: 520,
    totalRevenue: 1250000,
  },
];

const STATUS_CONFIG = {
  active: { label: "ใช้งาน", color: "bg-green-100 text-green-700", icon: CheckCircle2 },
  inactive: { label: "ไม่ใช้งาน", color: "bg-gray-100 text-gray-700", icon: Clock },
  banned: { label: "ถูกแบน", color: "bg-red-100 text-red-700", icon: Ban },
};

const KYC_CONFIG = {
  none: { label: "ไม่มี", color: "bg-gray-100 text-gray-600" },
  basic: { label: "Basic", color: "bg-blue-100 text-blue-700" },
  verified: { label: "Verified", color: "bg-green-100 text-green-700" },
  business: { label: "Business", color: "bg-purple-100 text-purple-700" },
};

export default function AdminUsersPage() {
  const [users] = useState<UserData[]>(MOCK_USERS);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState<UserType>("all");
  const [filterStatus, setFilterStatus] = useState<UserStatus>("all");
  const [selectedUser, setSelectedUser] = useState<UserData | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);

  // Filter users
  const filteredUsers = users.filter((user) => {
    if (filterType !== "all" && user.type !== filterType) return false;
    if (filterStatus !== "all" && user.status !== filterStatus) return false;
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      return (
        user.name.toLowerCase().includes(query) ||
        user.email.toLowerCase().includes(query) ||
        user.shopName?.toLowerCase().includes(query)
      );
    }
    return true;
  });

  // Stats
  const totalSellers = users.filter((u) => u.type === "seller").length;
  const totalWorkers = users.filter((u) => u.type === "worker").length;
  const activeUsers = users.filter((u) => u.status === "active").length;
  const bannedUsers = users.filter((u) => u.status === "banned").length;

  const handleViewUser = (user: UserData) => {
    setSelectedUser(user);
    setIsDetailModalOpen(true);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("th-TH").format(amount);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-brand-text-dark">จัดการผู้ใช้</h1>
        <p className="text-brand-text-light mt-1">ดูและจัดการบัญชีผู้ใช้ทั้ง Seller และ Worker</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="p-4 border-l-4 border-l-blue-500">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Users className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-brand-text-dark">{users.length}</p>
              <p className="text-sm text-brand-text-light">ผู้ใช้ทั้งหมด</p>
            </div>
          </div>
        </Card>
        <Card className="p-4 border-l-4 border-l-purple-500">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-purple-100 rounded-lg">
              <Store className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-brand-text-dark">{totalSellers}</p>
              <p className="text-sm text-brand-text-light">Sellers</p>
            </div>
          </div>
        </Card>
        <Card className="p-4 border-l-4 border-l-green-500">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-100 rounded-lg">
              <User className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-brand-text-dark">{totalWorkers}</p>
              <p className="text-sm text-brand-text-light">Workers</p>
            </div>
          </div>
        </Card>
        <Card className="p-4 border-l-4 border-l-red-500">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-red-100 rounded-lg">
              <Ban className="w-5 h-5 text-red-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-brand-text-dark">{bannedUsers}</p>
              <p className="text-sm text-brand-text-light">ถูกแบน</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Filters */}
      <Card className="p-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-brand-text-light" />
              <Input
                placeholder="ค้นหาชื่อ, อีเมล, ร้านค้า..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
          <div className="flex gap-2">
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value as UserType)}
              className="px-4 py-2 border border-brand-border rounded-lg bg-white text-brand-text-dark text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary"
            >
              <option value="all">ประเภททั้งหมด</option>
              <option value="seller">Seller</option>
              <option value="worker">Worker</option>
            </select>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value as UserStatus)}
              className="px-4 py-2 border border-brand-border rounded-lg bg-white text-brand-text-dark text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary"
            >
              <option value="all">สถานะทั้งหมด</option>
              <option value="active">ใช้งาน</option>
              <option value="inactive">ไม่ใช้งาน</option>
              <option value="banned">ถูกแบน</option>
            </select>
          </div>
        </div>
      </Card>

      {/* Users Table */}
      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-brand-bg/50">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-medium text-brand-text-light">ผู้ใช้</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-brand-text-light">ประเภท</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-brand-text-light">KYC</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-brand-text-light">สถานะ</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-brand-text-light">สถิติ</th>
                <th className="px-4 py-3 text-right text-sm font-medium text-brand-text-light">จัดการ</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-brand-border/50">
              {filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-4 py-12 text-center">
                    <Users className="w-12 h-12 text-brand-text-light mx-auto mb-4 opacity-50" />
                    <p className="text-brand-text-light">ไม่พบผู้ใช้ที่ตรงกับเงื่อนไข</p>
                  </td>
                </tr>
              ) : (
                filteredUsers.map((user) => {
                  const statusConfig = STATUS_CONFIG[user.status];
                  const StatusIcon = statusConfig.icon;
                  const kycConfig = KYC_CONFIG[user.kycLevel];

                  return (
                    <tr key={user.id} className="hover:bg-brand-bg/30">
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-3">
                          <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                            user.type === "seller" ? "bg-purple-100" : "bg-green-100"
                          }`}>
                            {user.type === "seller" ? (
                              <Store className="w-5 h-5 text-purple-600" />
                            ) : (
                              <User className="w-5 h-5 text-green-600" />
                            )}
                          </div>
                          <div>
                            <p className="font-medium text-brand-text-dark">{user.name}</p>
                            <p className="text-sm text-brand-text-light">{user.email}</p>
                            {user.shopName && (
                              <p className="text-xs text-purple-600">{user.shopName}</p>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <Badge className={user.type === "seller" ? "bg-purple-100 text-purple-700" : "bg-green-100 text-green-700"}>
                          {user.type === "seller" ? "Seller" : "Worker"}
                        </Badge>
                      </td>
                      <td className="px-4 py-4">
                        <Badge className={kycConfig.color}>
                          {kycConfig.label}
                        </Badge>
                      </td>
                      <td className="px-4 py-4">
                        <Badge className={statusConfig.color}>
                          <StatusIcon className="w-3 h-3 mr-1" />
                          {statusConfig.label}
                        </Badge>
                      </td>
                      <td className="px-4 py-4">
                        {user.type === "seller" ? (
                          <div className="text-sm">
                            <p className="text-brand-text-dark">{user.totalOrders} ออเดอร์</p>
                            <p className="text-brand-text-light">฿{formatCurrency(user.totalRevenue || 0)}</p>
                          </div>
                        ) : (
                          <div className="text-sm">
                            <p className="text-brand-text-dark">{user.totalJobs} งาน</p>
                            <div className="flex items-center gap-1 text-brand-text-light">
                              <Star className="w-3 h-3 text-amber-500" />
                              {user.rating?.toFixed(1)}
                            </div>
                          </div>
                        )}
                      </td>
                      <td className="px-4 py-4 text-right">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleViewUser(user)}
                        >
                          <Eye className="w-4 h-4 mr-1" />
                          ดู
                        </Button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {/* User Detail Modal */}
      <Dialog
        open={isDetailModalOpen}
        onClose={() => setIsDetailModalOpen(false)}
        size="lg"
      >
        <Dialog.Header>
          <Dialog.Title>รายละเอียดผู้ใช้</Dialog.Title>
          {selectedUser && (
            <Dialog.Description>{selectedUser.name}</Dialog.Description>
          )}
        </Dialog.Header>
        {selectedUser && (
          <>
            <Dialog.Body>
              <div className="space-y-6">
                {/* User Info */}
                <div className="flex items-center gap-4">
                  <div className={`w-16 h-16 rounded-full flex items-center justify-center ${
                    selectedUser.type === "seller" ? "bg-purple-100" : "bg-green-100"
                  }`}>
                    {selectedUser.type === "seller" ? (
                      <Store className="w-8 h-8 text-purple-600" />
                    ) : (
                      <User className="w-8 h-8 text-green-600" />
                    )}
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-brand-text-dark">{selectedUser.name}</h3>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge className={selectedUser.type === "seller" ? "bg-purple-100 text-purple-700" : "bg-green-100 text-green-700"}>
                        {selectedUser.type === "seller" ? "Seller" : "Worker"}
                      </Badge>
                      <Badge className={STATUS_CONFIG[selectedUser.status].color}>
                        {STATUS_CONFIG[selectedUser.status].label}
                      </Badge>
                      <Badge className={KYC_CONFIG[selectedUser.kycLevel].color}>
                        KYC: {KYC_CONFIG[selectedUser.kycLevel].label}
                      </Badge>
                    </div>
                  </div>
                </div>

                {/* Contact Info */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-3 bg-brand-bg/50 rounded-lg">
                    <div className="flex items-center gap-2 text-brand-text-light mb-1">
                      <Mail className="w-4 h-4" />
                      <span className="text-sm">อีเมล</span>
                    </div>
                    <p className="font-medium text-brand-text-dark">{selectedUser.email}</p>
                  </div>
                  <div className="p-3 bg-brand-bg/50 rounded-lg">
                    <div className="flex items-center gap-2 text-brand-text-light mb-1">
                      <Phone className="w-4 h-4" />
                      <span className="text-sm">โทรศัพท์</span>
                    </div>
                    <p className="font-medium text-brand-text-dark">{selectedUser.phone || "-"}</p>
                  </div>
                </div>

                {/* Stats */}
                {selectedUser.type === "seller" ? (
                  <div className="grid grid-cols-3 gap-4">
                    <div className="p-4 bg-purple-50 rounded-lg text-center">
                      <p className="text-2xl font-bold text-purple-700">{selectedUser.totalOrders}</p>
                      <p className="text-sm text-purple-600">ออเดอร์ทั้งหมด</p>
                    </div>
                    <div className="p-4 bg-green-50 rounded-lg text-center">
                      <p className="text-2xl font-bold text-green-700">฿{formatCurrency(selectedUser.totalRevenue || 0)}</p>
                      <p className="text-sm text-green-600">รายได้รวม</p>
                    </div>
                    <div className="p-4 bg-blue-50 rounded-lg text-center">
                      <p className="text-2xl font-bold text-blue-700">{selectedUser.shopName}</p>
                      <p className="text-sm text-blue-600">ชื่อร้านค้า</p>
                    </div>
                  </div>
                ) : (
                  <div className="grid grid-cols-3 gap-4">
                    <div className="p-4 bg-green-50 rounded-lg text-center">
                      <p className="text-2xl font-bold text-green-700">{selectedUser.totalJobs}</p>
                      <p className="text-sm text-green-600">งานทั้งหมด</p>
                    </div>
                    <div className="p-4 bg-purple-50 rounded-lg text-center">
                      <p className="text-2xl font-bold text-purple-700">฿{formatCurrency(selectedUser.totalEarned || 0)}</p>
                      <p className="text-sm text-purple-600">รายได้รวม</p>
                    </div>
                    <div className="p-4 bg-amber-50 rounded-lg text-center">
                      <div className="flex items-center justify-center gap-1">
                        <Star className="w-5 h-5 text-amber-500" />
                        <p className="text-2xl font-bold text-amber-700">{selectedUser.rating?.toFixed(1)}</p>
                      </div>
                      <p className="text-sm text-amber-600">คะแนน</p>
                    </div>
                  </div>
                )}

                {/* Dates */}
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-brand-text-light">สมัครเมื่อ</p>
                    <p className="font-medium text-brand-text-dark">{selectedUser.createdAt}</p>
                  </div>
                  <div>
                    <p className="text-brand-text-light">ใช้งานล่าสุด</p>
                    <p className="font-medium text-brand-text-dark">{selectedUser.lastActiveAt}</p>
                  </div>
                </div>
              </div>
            </Dialog.Body>
            <Dialog.Footer>
              <Button variant="outline" onClick={() => setIsDetailModalOpen(false)}>
                ปิด
              </Button>
              {selectedUser.status !== "banned" ? (
                <Button className="bg-red-600 hover:bg-red-700">
                  <Ban className="w-4 h-4 mr-2" />
                  แบนผู้ใช้
                </Button>
              ) : (
                <Button className="bg-green-600 hover:bg-green-700">
                  <CheckCircle2 className="w-4 h-4 mr-2" />
                  ปลดแบน
                </Button>
              )}
            </Dialog.Footer>
          </>
        )}
      </Dialog>
    </div>
  );
}
