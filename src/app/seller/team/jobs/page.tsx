"use client";

import { useState } from "react";
import Link from "next/link";
import { Card, Badge, Button, Input, Progress } from "@/components/ui";
import { mockJobs, mockWorkers, mockTeam } from "@/lib/mock-data";
import {
  ClipboardList,
  Search,
  Filter,
  Clock,
  CheckCircle2,
  XCircle,
  PlayCircle,
  Users,
  ExternalLink,
  ChevronRight,
  Calendar,
  Target,
  Package,
  Facebook,
  Instagram,
  Music2,
  Youtube,
  Star,
} from "lucide-react";

type JobStatus = "pending" | "in_progress" | "pending_review" | "completed" | "cancelled";

const statusConfig: Record<
  JobStatus,
  { label: string; color: "warning" | "info" | "success" | "error" | "default" }
> = {
  pending: { label: "รอรับงาน", color: "warning" },
  in_progress: { label: "กำลังทำ", color: "info" },
  pending_review: { label: "รอตรวจสอบ", color: "warning" },
  completed: { label: "เสร็จสิ้น", color: "success" },
  cancelled: { label: "ยกเลิก", color: "error" },
};

// Mock jobs data
const allJobs = [
  {
    id: "job-1",
    orderId: "order-1",
    orderNumber: "ORD-2024-001",
    serviceName: "เม้น Facebook (คนไทยจริง)",
    platform: "facebook",
    quantity: 50,
    completedQuantity: 32,
    pricePerUnit: 0.5,
    totalPayout: 25,
    targetUrl: "https://facebook.com/post/xxx",
    status: "in_progress",
    assignedWorker: mockWorkers[0],
    deadline: new Date(Date.now() + 3600000 * 4).toISOString(),
    createdAt: "2024-12-30T08:00:00Z",
  },
  {
    id: "job-2",
    orderId: "order-1",
    orderNumber: "ORD-2024-001",
    serviceName: "Follow Instagram (คนไทยจริง)",
    platform: "instagram",
    quantity: 200,
    completedQuantity: 0,
    pricePerUnit: 0.3,
    totalPayout: 60,
    targetUrl: "https://instagram.com/somchai_shop",
    status: "pending",
    deadline: new Date(Date.now() + 3600000 * 24).toISOString(),
    createdAt: "2024-12-30T08:30:00Z",
  },
  {
    id: "job-3",
    orderId: "order-3",
    orderNumber: "ORD-2024-003",
    serviceName: "ไลค์ Facebook (คนไทยจริง)",
    platform: "facebook",
    quantity: 100,
    completedQuantity: 100,
    pricePerUnit: 0.2,
    totalPayout: 20,
    targetUrl: "https://facebook.com/post/yyy",
    status: "pending_review",
    assignedWorker: mockWorkers[1],
    submittedAt: new Date(Date.now() - 3600000).toISOString(),
    createdAt: "2024-12-29T10:00:00Z",
  },
  {
    id: "job-4",
    orderId: "order-4",
    orderNumber: "ORD-2024-004",
    serviceName: "View TikTok (คนไทยจริง)",
    platform: "tiktok",
    quantity: 500,
    completedQuantity: 500,
    pricePerUnit: 0.1,
    totalPayout: 50,
    targetUrl: "https://tiktok.com/@shop/video/xxx",
    status: "completed",
    assignedWorker: mockWorkers[0],
    completedAt: "2024-12-28T15:00:00Z",
    createdAt: "2024-12-28T10:00:00Z",
  },
  {
    id: "job-5",
    orderId: "order-5",
    orderNumber: "ORD-2024-005",
    serviceName: "ไลค์ Facebook (คนไทยจริง)",
    platform: "facebook",
    quantity: 50,
    completedQuantity: 50,
    pricePerUnit: 0.2,
    totalPayout: 10,
    targetUrl: "https://facebook.com/post/zzz",
    status: "pending_review",
    assignedWorker: mockWorkers[2],
    submittedAt: new Date(Date.now() - 7200000).toISOString(),
    createdAt: "2024-12-27T14:00:00Z",
  },
];

type FilterStatus = "all" | JobStatus;

export default function TeamJobsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState<FilterStatus>("all");

  const filteredJobs = allJobs.filter((job) => {
    const matchSearch =
      job.serviceName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.orderNumber.toLowerCase().includes(searchQuery.toLowerCase());
    const matchStatus = filterStatus === "all" || job.status === filterStatus;
    return matchSearch && matchStatus;
  });

  const stats = {
    total: allJobs.length,
    pending: allJobs.filter((j) => j.status === "pending").length,
    inProgress: allJobs.filter((j) => j.status === "in_progress").length,
    pendingReview: allJobs.filter((j) => j.status === "pending_review").length,
    completed: allJobs.filter((j) => j.status === "completed").length,
  };

  const getPlatformEmoji = (platform: string) => {
    switch (platform) {
      case "facebook": return <Facebook className="w-4 h-4" />;
      case "instagram": return <Instagram className="w-4 h-4" />;
      case "tiktok": return <Music2 className="w-4 h-4" />;
      case "youtube": return <Youtube className="w-4 h-4" />;
      default: return <Package className="w-4 h-4" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-brand-text-dark flex items-center gap-2">
            <ClipboardList className="w-7 h-7 text-brand-primary" />
            งานทั้งหมด
          </h1>
          <p className="text-brand-text-light mt-1">
            จัดการงานที่มอบหมายให้ทีม
          </p>
        </div>
        <Link href="/seller/team/review">
          <Button variant="secondary">
            <CheckCircle2 className="w-4 h-4 mr-2" />
            รอตรวจสอบ ({stats.pendingReview})
          </Button>
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        <Card variant="bordered" padding="md" className="text-center">
          <p className="text-2xl font-bold text-brand-text-dark">{stats.total}</p>
          <p className="text-sm text-brand-text-light">ทั้งหมด</p>
        </Card>
        <Card variant="bordered" padding="md" className="text-center">
          <p className="text-2xl font-bold text-brand-warning">{stats.pending}</p>
          <p className="text-sm text-brand-text-light">รอรับงาน</p>
        </Card>
        <Card variant="bordered" padding="md" className="text-center">
          <p className="text-2xl font-bold text-brand-info">{stats.inProgress}</p>
          <p className="text-sm text-brand-text-light">กำลังทำ</p>
        </Card>
        <Card variant="bordered" padding="md" className="text-center">
          <p className="text-2xl font-bold text-brand-warning">{stats.pendingReview}</p>
          <p className="text-sm text-brand-text-light">รอตรวจสอบ</p>
        </Card>
        <Card variant="bordered" padding="md" className="text-center">
          <p className="text-2xl font-bold text-brand-success">{stats.completed}</p>
          <p className="text-sm text-brand-text-light">เสร็จสิ้น</p>
        </Card>
      </div>

      {/* Filters */}
      <Card variant="bordered" padding="md">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <Input
              placeholder="ค้นหางาน..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              leftIcon={<Search className="w-4 h-4" />}
            />
          </div>
          <div className="flex gap-2 overflow-x-auto">
            {[
              { key: "all", label: "ทั้งหมด" },
              { key: "pending", label: "รอรับงาน" },
              { key: "in_progress", label: "กำลังทำ" },
              { key: "pending_review", label: "รอตรวจสอบ" },
              { key: "completed", label: "เสร็จสิ้น" },
            ].map((f) => (
              <button
                key={f.key}
                onClick={() => setFilterStatus(f.key as FilterStatus)}
                className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all ${
                  filterStatus === f.key
                    ? "bg-brand-primary text-white"
                    : "bg-brand-bg text-brand-text-light hover:text-brand-text-dark"
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>
      </Card>

      {/* Jobs List */}
      <Card variant="bordered">
        <div className="divide-y divide-brand-border">
          {filteredJobs.length === 0 ? (
            <div className="p-8 text-center">
              <ClipboardList className="w-12 h-12 text-brand-text-light mx-auto mb-3" />
              <p className="text-brand-text-light">ไม่พบงานที่ค้นหา</p>
            </div>
          ) : (
            filteredJobs.map((job) => {
              const progress = (job.completedQuantity / job.quantity) * 100;
              
              return (
                <div
                  key={job.id}
                  className="p-4 hover:bg-brand-bg/50 transition-colors"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-4">
                      <div className="text-3xl">
                        {getPlatformEmoji(job.platform)}
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <p className="font-semibold text-brand-text-dark">
                            {job.serviceName}
                          </p>
                          <Badge
                            variant={statusConfig[job.status as JobStatus].color}
                            size="sm"
                          >
                            {statusConfig[job.status as JobStatus].label}
                          </Badge>
                        </div>
                        
                        <div className="flex items-center gap-4 text-sm text-brand-text-light">
                          <span className="flex items-center gap-1">
                            <Package className="w-4 h-4" />
                            {job.orderNumber}
                          </span>
                          <span>
                            <Target className="w-3 h-3 inline mr-1" />
                            {job.quantity.toLocaleString()} หน่วย
                          </span>
                          <span className="text-brand-success font-medium">
                            ฿{job.totalPayout}
                          </span>
                        </div>

                        {/* Worker Info */}
                        {job.assignedWorker && (
                          <div className="flex items-center gap-2 text-sm">
                            <Users className="w-3 h-3 text-brand-text-light" />
                            <span className="text-brand-text-dark">
                              @{job.assignedWorker.displayName}
                            </span>
                            <Badge variant="default" size="sm" className="bg-brand-bg flex items-center gap-1">
                              <Star className="w-3 h-3 text-yellow-500" />
                              {job.assignedWorker.rating}
                            </Badge>
                          </div>
                        )}

                        {/* Progress */}
                        {(job.status === "in_progress" || job.status === "pending_review") && (
                          <div className="w-64 space-y-1">
                            <div className="flex justify-between text-xs">
                              <span className="text-brand-text-light">ความคืบหน้า</span>
                              <span className="font-medium text-brand-text-dark">
                                {job.completedQuantity}/{job.quantity} ({Math.round(progress)}%)
                              </span>
                            </div>
                            <Progress value={progress} size="sm" />
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="text-right space-y-2">
                      <p className="text-sm text-brand-text-light">
                        <Calendar className="w-3 h-3 inline mr-1" />
                        {new Date(job.createdAt).toLocaleDateString("th-TH", {
                          day: "numeric",
                          month: "short",
                        })}
                      </p>
                      
                      {job.status === "pending_review" && (
                        <Link href="/seller/team/review">
                          <Button size="sm">
                            ตรวจสอบ
                            <ChevronRight className="w-4 h-4 ml-1" />
                          </Button>
                        </Link>
                      )}
                      
                      {job.status === "pending" && (
                        <Badge variant="warning" size="sm">
                          <Clock className="w-3 h-3 mr-1" />
                          รอ Worker รับ
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </Card>
    </div>
  );
}

