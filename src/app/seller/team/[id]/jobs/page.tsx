"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { Card, Badge, Button, Input, Progress, Skeleton } from "@/components/ui";
import { PlatformIcon, EmptyState, FilterTabs, Breadcrumb, type JobFilterStatus } from "@/components/shared";
import { useTeamJobs, useSellerTeams } from "@/lib/api/hooks";
import { getJobStatusLabel, getJobStatusVariant, type TeamJobStatus } from "@/lib/constants/statuses";
import type { Platform } from "@/types";
import {
  ClipboardList,
  Search,
  Clock,
  CheckCircle2,
  ChevronRight,
  Calendar,
  Target,
  Package,
  Star,
  Plus,
  AlertCircle,
  CheckCircle,
  Loader2,
} from "lucide-react";

export default function TeamJobsPage() {
  const params = useParams();
  const teamId = params.id as string;

  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState<JobFilterStatus>("all");

  // Use API hooks
  const { data: teams, isLoading: isLoadingTeams } = useSellerTeams();
  const { data: teamJobs, isLoading: isLoadingJobs } = useTeamJobs();
  
  const isLoading = isLoadingTeams || isLoadingJobs;
  
  const currentTeam = useMemo(() => {
    return teams?.find((t) => t.id === teamId);
  }, [teams, teamId]);

  // Filter jobs (mock: in real app, would filter by teamId)
  // Filter out jobs with missing required fields to avoid crashes
  const allJobs = (teamJobs || []).filter(job => job.serviceName && job.orderNumber);

  const filteredJobs = allJobs.filter((job) => {
    // Add null-safety check for undefined fields
    const matchSearch =
      (job.serviceName?.toLowerCase() || "").includes(searchQuery.toLowerCase()) ||
      (job.orderNumber?.toLowerCase() || "").includes(searchQuery.toLowerCase());
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

  if (isLoading) {
    return (
      <div className="space-y-6 animate-fade-in">
        <Skeleton className="h-16 w-full rounded-xl" />
        <div className="grid grid-cols-5 gap-4">
          {[1, 2, 3, 4, 5].map((i) => (
            <Skeleton key={i} className="h-20 rounded-xl" />
          ))}
        </div>
        <Skeleton className="h-64 rounded-xl" />
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Breadcrumb */}
      <Breadcrumb />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-purple-100 flex items-center justify-center">
            <ClipboardList className="w-5 h-5 text-purple-600" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-brand-text-dark">งานทั้งหมด</h1>
            <p className="text-sm text-brand-text-light">จัดการงานของทีม {currentTeam?.name || ""}</p>
          </div>
        </div>
        <div className="flex gap-2">
          {stats.pendingReview > 0 && (
            <Link href={`/seller/team/${teamId}/review`}>
              <Button
                variant="outline"
                size="sm"
                leftIcon={<AlertCircle className="w-4 h-4" />}
                className="border-amber-200 text-amber-600 hover:bg-amber-50"
              >
                รอตรวจสอบ ({stats.pendingReview})
              </Button>
            </Link>
          )}
          <Link href={`/seller/team/${teamId}/jobs/new`}>
            <Button leftIcon={<Plus className="w-4 h-4" />}>
              สร้างงานใหม่
            </Button>
          </Link>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
        <Card className="p-4 border-none shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center">
              <ClipboardList className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-brand-text-dark">{stats.total}</p>
              <p className="text-xs text-brand-text-light">ทั้งหมด</p>
            </div>
          </div>
        </Card>
        <Card className="p-4 border-none shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center">
              <Clock className="w-5 h-5 text-gray-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-brand-text-dark">{stats.pending}</p>
              <p className="text-xs text-brand-text-light">รอจอง</p>
            </div>
          </div>
        </Card>
        <Card className="p-4 border-none shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center">
              <Loader2 className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-brand-text-dark">{stats.inProgress}</p>
              <p className="text-xs text-brand-text-light">กำลังทำ</p>
            </div>
          </div>
        </Card>
        <Card className="p-4 border-none shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center">
              <AlertCircle className="w-5 h-5 text-amber-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-brand-text-dark">{stats.pendingReview}</p>
              <p className="text-xs text-brand-text-light">รอตรวจ</p>
            </div>
          </div>
        </Card>
        <Card className="p-4 border-none shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center">
              <CheckCircle className="w-5 h-5 text-emerald-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-brand-text-dark">{stats.completed}</p>
              <p className="text-xs text-brand-text-light">เสร็จ</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Filter & Search */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 bg-white p-4 rounded-2xl shadow-sm border border-brand-border/50">
        <FilterTabs
          tabs={[
            { value: "all" as const, label: "ทั้งหมด" },
            { value: "pending" as const, label: "รอจอง" },
            { value: "in_progress" as const, label: "กำลังทำ" },
            { value: "pending_review" as const, label: "รอตรวจ" },
            { value: "completed" as const, label: "เสร็จ" },
          ]}
          value={filterStatus}
          onChange={setFilterStatus}
          showCount={false}
        />
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

      {/* Jobs Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-brand-border/50 overflow-hidden">
        {filteredJobs.length === 0 ? (
          <EmptyState icon={ClipboardList} title="ไม่พบงานที่ค้นหา" className="py-12" />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-brand-bg/30 border-b border-brand-border/30">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-brand-text-light uppercase tracking-wider">งาน</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-brand-text-light uppercase tracking-wider">ออเดอร์</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-brand-text-light uppercase tracking-wider">Worker</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-brand-text-light uppercase tracking-wider">ความคืบหน้า</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-brand-text-light uppercase tracking-wider">รายได้</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-brand-text-light uppercase tracking-wider">สถานะ</th>
                  <th className="px-6 py-3 text-right text-xs font-semibold text-brand-text-light uppercase tracking-wider">วันที่</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-brand-border/30">
                {filteredJobs.map((job) => {
                  const progress = (job.completedQuantity / job.quantity) * 100;
                  
                  return (
                    <tr 
                      key={job.id} 
                      className="hover:bg-brand-bg/30 transition-colors cursor-pointer group"
                      onClick={() => window.location.href = `/seller/team/${teamId}/jobs/${job.id}`}
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-white rounded-lg shadow-sm border border-brand-border/20">
                            <PlatformIcon platform={job.platform as Platform} size="sm" />
                          </div>
                          <div>
                            <p className="font-bold text-sm text-brand-text-dark group-hover:text-brand-primary transition-colors">
                              {job.serviceName}
                            </p>
                            <p className="text-xs text-brand-text-light">
                              เป้าหมาย {job.quantity.toLocaleString()}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center gap-1.5 text-sm font-medium text-brand-text-dark bg-brand-bg/50 px-2 py-1 rounded-lg">
                          <Package className="w-3.5 h-3.5" />
                          {job.orderNumber}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        {job.assignedWorker ? (
                          <div className="flex items-center gap-2">
                            <div className="w-7 h-7 rounded-full bg-brand-secondary flex items-center justify-center text-xs font-bold text-brand-primary">
                              {job.assignedWorker.displayName.charAt(0)}
                            </div>
                            <div>
                              <p className="text-sm font-medium text-brand-text-dark">
                                @{job.assignedWorker.displayName}
                              </p>
                              <div className="flex items-center gap-1">
                                <Star className="w-3 h-3 text-brand-warning fill-brand-warning" />
                                <span className="text-xs text-brand-text-light">{job.assignedWorker.rating}</span>
                              </div>
                            </div>
                          </div>
                        ) : (
                          <span className="text-sm text-brand-text-light">-</span>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        {(job.status === "in_progress" || job.status === "pending_review") ? (
                          <div className="w-32 space-y-1">
                            <div className="flex justify-between text-xs">
                              <span className="text-brand-text-light">{Math.round(progress)}%</span>
                              <span className="text-brand-text-dark font-medium">
                                {job.completedQuantity.toLocaleString()}/{job.quantity.toLocaleString()}
                              </span>
                            </div>
                            <Progress value={progress} size="sm" className="h-1.5" />
                          </div>
                        ) : (
                          <span className="text-sm text-brand-text-light">-</span>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-base font-bold text-brand-success">
                          ฿{job.totalPayout}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <Badge
                          variant={getJobStatusVariant(job.status as TeamJobStatus)}
                          size="sm"
                        >
                          {getJobStatusLabel(job.status as TeamJobStatus)}
                        </Badge>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <p className="text-xs text-brand-text-light">
                          {new Date(job.createdAt).toLocaleDateString("th-TH", {
                            day: "numeric",
                            month: "short",
                            year: "numeric"
                          })}
                        </p>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
