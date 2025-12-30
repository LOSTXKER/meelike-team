"use client";

import { useState } from "react";
import Link from "next/link";
import { Card, Badge, Button, Input, Progress } from "@/components/ui";
import { PageHeader, PlatformIcon, EmptyState } from "@/components/shared";
import { mockJobs, mockWorkers, mockTeam } from "@/lib/mock-data";
import type { Platform } from "@/types";
import {
  ClipboardList,
  Search,
  Clock,
  CheckCircle2,
  Users,
  ChevronRight,
  Calendar,
  Target,
  Package,
  Star,
  ArrowLeft,
  Loader2,
  CheckCircle,
  XCircle,
  LayoutGrid
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

  return (
    <div className="space-y-8 animate-fade-in max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link href="/seller/team">
          <button className="p-2.5 hover:bg-white hover:shadow-sm rounded-xl transition-all border border-transparent hover:border-brand-border/50 text-brand-text-light hover:text-brand-primary">
            <ArrowLeft className="w-5 h-5" />
          </button>
        </Link>
        <PageHeader
          title="งานทั้งหมด"
          description="จัดการงานที่มอบหมายให้ทีม Worker"
          icon={ClipboardList}
          action={
            <Link href="/seller/team/review">
              <Button 
                variant="secondary" 
                leftIcon={<CheckCircle2 className="w-4 h-4" />}
                className="bg-[#FEF7E0] text-[#B06000] border-[#FEEFC3] hover:bg-[#FEEFC3]"
              >
                รอตรวจสอบ ({stats.pendingReview})
              </Button>
            </Link>
          }
        />
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        <Card variant="elevated" className="border-none shadow-lg shadow-brand-primary/5 hover:-translate-y-1 transition-transform">
          <div className="flex flex-col items-center justify-center p-2 text-center">
             <div className="w-10 h-10 rounded-xl bg-brand-primary/10 flex items-center justify-center text-brand-primary mb-2">
               <ClipboardList className="w-5 h-5" />
             </div>
            <p className="text-2xl font-bold text-brand-text-dark">{stats.total}</p>
            <p className="text-sm text-brand-text-light">ทั้งหมด</p>
          </div>
        </Card>
        <Card variant="elevated" className="border-none shadow-lg shadow-brand-primary/5 hover:-translate-y-1 transition-transform">
           <div className="flex flex-col items-center justify-center p-2 text-center">
             <div className="w-10 h-10 rounded-xl bg-brand-warning/10 flex items-center justify-center text-brand-warning mb-2">
               <Clock className="w-5 h-5" />
             </div>
            <p className="text-2xl font-bold text-brand-warning">{stats.pending}</p>
            <p className="text-sm text-brand-text-light">รอรับงาน</p>
          </div>
        </Card>
        <Card variant="elevated" className="border-none shadow-lg shadow-brand-primary/5 hover:-translate-y-1 transition-transform">
           <div className="flex flex-col items-center justify-center p-2 text-center">
             <div className="w-10 h-10 rounded-xl bg-brand-info/10 flex items-center justify-center text-brand-info mb-2">
               <Loader2 className="w-5 h-5" />
             </div>
            <p className="text-2xl font-bold text-brand-info">{stats.inProgress}</p>
            <p className="text-sm text-brand-text-light">กำลังทำ</p>
          </div>
        </Card>
        <Card variant="elevated" className="border-none shadow-lg shadow-brand-primary/5 hover:-translate-y-1 transition-transform">
           <div className="flex flex-col items-center justify-center p-2 text-center">
             <div className="w-10 h-10 rounded-xl bg-purple-50 flex items-center justify-center text-purple-600 mb-2">
               <CheckCircle2 className="w-5 h-5" />
             </div>
            <p className="text-2xl font-bold text-purple-600">{stats.pendingReview}</p>
            <p className="text-sm text-brand-text-light">รอตรวจสอบ</p>
          </div>
        </Card>
        <Card variant="elevated" className="border-none shadow-lg shadow-brand-primary/5 hover:-translate-y-1 transition-transform">
           <div className="flex flex-col items-center justify-center p-2 text-center">
             <div className="w-10 h-10 rounded-xl bg-brand-success/10 flex items-center justify-center text-brand-success mb-2">
               <CheckCircle className="w-5 h-5" />
             </div>
            <p className="text-2xl font-bold text-brand-success">{stats.completed}</p>
            <p className="text-sm text-brand-text-light">เสร็จสิ้น</p>
          </div>
        </Card>
      </div>

      {/* Filter & Search */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 bg-white p-4 rounded-2xl shadow-sm border border-brand-border/50">
        <div className="w-full lg:w-auto overflow-x-auto no-scrollbar">
          <div className="flex gap-1 p-1.5 bg-brand-bg/50 rounded-xl border border-brand-border/30 min-w-max">
            {[
              { key: "all", label: "ทั้งหมด", icon: LayoutGrid },
              { key: "pending", label: "รอรับงาน", icon: Clock },
              { key: "in_progress", label: "กำลังทำ", icon: Loader2 },
              { key: "pending_review", label: "รอตรวจ", icon: CheckCircle2 },
              { key: "completed", label: "เสร็จ", icon: CheckCircle },
            ].map((f) => (
              <button
                key={f.key}
                onClick={() => setFilterStatus(f.key as FilterStatus)}
                className={`flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 whitespace-nowrap ${
                  filterStatus === f.key
                    ? "bg-white text-brand-text-dark shadow-sm ring-1 ring-black/5"
                    : "text-brand-text-light hover:text-brand-text-dark opacity-70 hover:opacity-100"
                }`}
              >
                <f.icon className={`w-4 h-4 ${filterStatus === f.key ? "text-brand-primary" : ""}`} />
                <span>{f.label}</span>
              </button>
            ))}
          </div>
        </div>
        <div className="w-full lg:w-auto lg:min-w-[280px]">
          <Input
            placeholder="ค้นหางาน, เลขออเดอร์..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full border-brand-border/50 bg-brand-bg/50 focus:bg-white !py-2.5 !rounded-xl"
            leftIcon={<Search className="w-4 h-4 text-brand-text-light" />}
          />
        </div>
      </div>

      {/* Jobs List */}
      <div className="bg-white rounded-2xl shadow-sm border border-brand-border/50 overflow-hidden">
        <div className="divide-y divide-brand-border/50">
          {filteredJobs.length === 0 ? (
            <EmptyState icon={ClipboardList} title="ไม่พบงานที่ค้นหา" className="py-12" />
          ) : (
            filteredJobs.map((job) => {
              const progress = (job.completedQuantity / job.quantity) * 100;
              
              return (
                <div
                  key={job.id}
                  className="p-6 hover:bg-brand-bg/30 transition-colors group"
                >
                  <div className="flex flex-col lg:flex-row items-start justify-between gap-6">
                    <div className="flex items-start gap-5 flex-1">
                      <div className="p-3 bg-white rounded-xl shadow-sm border border-brand-border/20">
                         <PlatformIcon platform={job.platform as Platform} size="lg" />
                      </div>
                      <div className="space-y-3 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <p className="font-bold text-lg text-brand-text-dark group-hover:text-brand-primary transition-colors">
                            {job.serviceName}
                          </p>
                          <Badge
                            variant={statusConfig[job.status as JobStatus].color}
                            size="sm"
                            className="shadow-none border-none"
                          >
                            {statusConfig[job.status as JobStatus].label}
                          </Badge>
                        </div>
                        
                        <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-brand-text-light">
                          <span className="flex items-center gap-1.5 bg-brand-bg/50 px-2 py-1 rounded-lg">
                            <Package className="w-4 h-4" />
                            <span className="font-medium text-brand-text-dark">{job.orderNumber}</span>
                          </span>
                          <span className="flex items-center gap-1.5">
                            <Target className="w-4 h-4" />
                            เป้าหมาย <b className="text-brand-text-dark">{job.quantity.toLocaleString()}</b>
                          </span>
                          <span className="flex items-center gap-1.5 text-brand-success bg-brand-success/5 px-2 py-1 rounded-lg">
                            <span className="font-bold">฿{job.totalPayout}</span>
                            <span className="text-xs opacity-80">รายได้</span>
                          </span>
                        </div>

                        {/* Worker Info */}
                        {job.assignedWorker && (
                          <div className="flex items-center gap-3 p-2 bg-brand-bg/20 rounded-xl border border-brand-border/30 w-fit">
                            <div className="w-6 h-6 rounded-full bg-brand-secondary flex items-center justify-center text-xs font-bold text-brand-primary">
                              {job.assignedWorker.displayName.charAt(0)}
                            </div>
                            <span className="text-sm font-medium text-brand-text-dark">
                              @{job.assignedWorker.displayName}
                            </span>
                            <div className="w-px h-3 bg-brand-border/50"></div>
                            <div className="flex items-center gap-1">
                              <Star className="w-3 h-3 text-brand-warning fill-brand-warning" />
                              <span className="text-xs font-bold text-brand-text-dark">{job.assignedWorker.rating}</span>
                            </div>
                          </div>
                        )}

                        {/* Progress */}
                        {(job.status === "in_progress" || job.status === "pending_review") && (
                          <div className="max-w-md w-full space-y-2 bg-white p-3 rounded-xl border border-brand-border/20 shadow-sm">
                            <div className="flex justify-between text-xs">
                              <span className="text-brand-text-light font-medium">ความคืบหน้า</span>
                              <span className="font-bold text-brand-primary">
                                {job.completedQuantity.toLocaleString()} <span className="text-brand-text-light font-normal">/ {job.quantity.toLocaleString()}</span>
                              </span>
                            </div>
                            <Progress value={progress} className="h-2" />
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="flex flex-row lg:flex-col items-center lg:items-end justify-between w-full lg:w-auto gap-4 lg:gap-2">
                      <p className="text-xs text-brand-text-light flex items-center gap-1 bg-brand-bg/30 px-2 py-1 rounded-lg">
                        <Calendar className="w-3 h-3" />
                        {new Date(job.createdAt).toLocaleDateString("th-TH", {
                          day: "numeric",
                          month: "short",
                          year: "numeric"
                        })}
                      </p>
                      
                      {job.status === "pending_review" && (
                        <Link href="/seller/team/review">
                          <Button size="sm" className="shadow-lg shadow-brand-primary/20 rounded-xl">
                            ตรวจสอบงาน
                            <ChevronRight className="w-4 h-4 ml-1" />
                          </Button>
                        </Link>
                      )}
                      
                      {job.status === "pending" && (
                        <div className="px-3 py-1.5 rounded-lg bg-[#FEF7E0] text-[#B06000] border border-[#FEEFC3] text-xs font-medium flex items-center gap-1.5 animate-pulse">
                          <Clock className="w-3 h-3" />
                          รอ Worker รับงาน
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}

