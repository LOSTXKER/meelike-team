"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { Badge, Button, Input, Progress } from "@/components/ui";
import { Container, Section, HStack } from "@/components/layout";
import { PageHeader, PlatformIcon, EmptyState, StatsGrid, FilterTabs, PageSkeleton, getJobStats, type JobFilterStatus } from "@/components/shared";
import { useTeamJobs, useSellerTeams } from "@/lib/api/hooks";
import { TEAM_JOB_STATUSES, getJobStatusLabel, getJobStatusVariant, type TeamJobStatus } from "@/lib/constants/statuses";
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
    return <PageSkeleton variant="list" statsCount={5} className="max-w-7xl mx-auto" />;
  }

  return (
    <Container size="xl">
      <div className="space-y-6 animate-fade-in">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <PageHeader
            title="งานทั้งหมด"
            description={`จัดการงานของทีม ${currentTeam?.name || ""}`}
            icon={ClipboardList}
          />

          <HStack gap={3} className="flex-wrap">
            <Link href={`/seller/team/${teamId}/review`}>
              <Button
                variant="secondary"
                leftIcon={<CheckCircle2 className="w-4 h-4" />}
                className="bg-[#FEF7E0] text-[#B06000] border-[#FEEFC3] hover:bg-[#FEEFC3]"
              >
                รอตรวจสอบ ({stats.pendingReview})
              </Button>
            </Link>
            <Link href={`/seller/team/${teamId}/jobs/new`}>
            <Button 
              leftIcon={<Plus className="w-4 h-4" />}
              className="shadow-lg shadow-brand-primary/20"
            >
              สร้างงานใหม่
            </Button>
          </Link>
          </HStack>
        </div>

        {/* Stats Cards */}
      <StatsGrid stats={getJobStats(stats)} columns={5} />

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
                            variant={getJobStatusVariant(job.status as TeamJobStatus)}
                            size="sm"
                            className="shadow-none border-none"
                          >
                            {getJobStatusLabel(job.status as TeamJobStatus)}
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
                        <Link href={`/seller/team/${teamId}/review`}>
                          <Button size="sm" className="shadow-lg shadow-brand-primary/20 rounded-xl">
                            ตรวจสอบงาน
                            <ChevronRight className="w-4 h-4 ml-1" />
                          </Button>
                        </Link>
                      )}
                      
                      {job.status === "pending" && (
                        <div className="px-3 py-1.5 rounded-lg bg-[#FEF7E0] text-[#B06000] border border-[#FEEFC3] text-xs font-medium flex items-center gap-1.5 animate-pulse">
                          <Clock className="w-3 h-3" />
                          รอ Worker จอง
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
    </Container>
  );
}
