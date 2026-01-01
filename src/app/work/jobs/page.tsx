"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { Card, Badge, Button, Progress, Skeleton } from "@/components/ui";
import { PageHeader, PlatformIcon, ServiceTypeBadge, EmptyState, SegmentedControl, StatsGridCompact } from "@/components/shared";
import type { FilterOption } from "@/components/shared";
import { useWorkerJobs } from "@/lib/api/hooks";
import type { Platform, ServiceMode } from "@/types";
import {
  Briefcase,
  Clock,
  CheckCircle2,
  PlayCircle,
  ExternalLink,
  Timer,
  Target,
  Upload,
  Users,
} from "lucide-react";

type TabType = "in_progress" | "pending_review" | "completed";

export default function WorkerJobsPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<TabType>("in_progress");

  // Use API hook instead of direct mock data import
  const { data: workerJobs, isLoading } = useWorkerJobs();

  const currentJobs = useMemo(() => {
    if (!workerJobs) return [];
    return workerJobs[activeTab];
  }, [workerJobs, activeTab]);

  const getTimeRemaining = (deadline: string) => {
    const diff = new Date(deadline).getTime() - Date.now();
    const hours = Math.floor(diff / 3600000);
    const minutes = Math.floor((diff % 3600000) / 60000);
    return `${hours}ชม. ${minutes}น.`;
  };

  // Stats data for StatsGridCompact
  const statsData = useMemo(() => [
    {
      label: "กำลังทำ",
      value: workerJobs?.in_progress.length || 0,
      icon: PlayCircle,
      iconColor: "text-brand-warning",
      iconBgColor: "bg-brand-warning/10",
    },
    {
      label: "รอตรวจสอบ",
      value: workerJobs?.pending_review.length || 0,
      icon: Clock,
      iconColor: "text-brand-info",
      iconBgColor: "bg-brand-info/10",
    },
    {
      label: "เสร็จแล้ว",
      value: workerJobs?.completed.length || 0,
      icon: CheckCircle2,
      iconColor: "text-brand-success",
      iconBgColor: "bg-brand-success/10",
    },
  ], [workerJobs]);

  // Tab options for SegmentedControl
  const tabOptions: FilterOption<TabType>[] = useMemo(() => [
    { key: "in_progress", label: "กำลังทำ", icon: <PlayCircle className="w-4 h-4" />, count: workerJobs?.in_progress.length || 0 },
    { key: "pending_review", label: "รอตรวจสอบ", icon: <Clock className="w-4 h-4" />, count: workerJobs?.pending_review.length || 0 },
    { key: "completed", label: "เสร็จแล้ว", icon: <CheckCircle2 className="w-4 h-4" />, count: workerJobs?.completed.length || 0 },
  ], [workerJobs]);

  return (
    <div className="space-y-6 animate-fade-in max-w-7xl mx-auto">
      {/* Header */}
      <PageHeader
        title="งานของฉัน"
        description="จัดการงานทั้งหมดที่คุณรับมา"
        icon={Briefcase}
      />

      {/* Stats - Using StatsGridCompact */}
      {isLoading ? (
        <div className="grid grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-[80px] rounded-xl" />
          ))}
        </div>
      ) : (
        <StatsGridCompact stats={statsData} columns={3} />
      )}

      {/* Tabs - Using SegmentedControl */}
      <SegmentedControl
        options={tabOptions}
        activeOption={activeTab}
        onChange={setActiveTab}
      />

      {/* Jobs List */}
      <div className="space-y-4">
        {isLoading ? (
          <>
            <Skeleton className="h-[200px] rounded-xl" />
            <Skeleton className="h-[200px] rounded-xl" />
          </>
        ) : currentJobs.length === 0 ? (
          <EmptyState
            icon={Briefcase}
            title="ไม่มีงานในหมวดนี้"
            description="ลองเลือกสถานะอื่น หรือจองงานใหม่เพิ่ม"
          />
        ) : (
          currentJobs.map((job) => (
            <Card 
              key={job.id} 
              variant="hoverable" 
              padding="lg" 
              className="group cursor-pointer hover:-translate-y-1"
              onClick={() => router.push(`/work/jobs/${job.id}`)}
            >
              <div className="space-y-6">
                {/* Header */}
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-4">
                    <div className="flex items-center justify-center w-14 h-14 rounded-2xl bg-brand-bg border border-brand-border/50 shadow-sm group-hover:scale-105 transition-transform duration-300">
                      <PlatformIcon platform={job.platform as Platform} className="w-7 h-7" />
                    </div>
                    <div>
                      <h3 className="font-bold text-xl text-brand-text-dark group-hover:text-brand-primary transition-colors mb-1">
                        {job.serviceName}
                      </h3>
                      <div className="flex flex-wrap items-center gap-2">
                        <Badge variant="default" size="sm" className="bg-brand-bg text-brand-text-light border-brand-border/50">
                          <Users className="w-3 h-3 mr-1" />
                          {job.teamName}
                        </Badge>
                        <ServiceTypeBadge type={job.type as ServiceMode} />
                      </div>
                    </div>
                  </div>
                  <div className="text-right bg-brand-bg/30 p-2.5 rounded-xl border border-brand-border/30">
                    <p className="text-2xl font-bold text-brand-primary leading-none">
                      ฿{(job.quantity * job.pricePerUnit).toFixed(0)}
                    </p>
                    <p className="text-xs font-medium text-brand-text-light uppercase tracking-wide mt-1">
                      ฿{job.pricePerUnit}/หน่วย
                    </p>
                  </div>
                </div>

                {/* Progress */}
                {activeTab === "in_progress" && job.deadline && (
                  <div className="bg-brand-bg/30 rounded-xl p-4 border border-brand-border/30 space-y-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-brand-text-dark font-medium flex items-center gap-2">
                        <div className="p-1 rounded bg-brand-primary/10">
                          <Target className="w-3.5 h-3.5 text-brand-primary" />
                        </div>
                        ความคืบหน้า
                      </span>
                      <span className="font-bold text-brand-text-dark">
                        {job.completedQuantity} <span className="text-brand-text-light font-normal">/ {job.quantity}</span>
                      </span>
                    </div>
                    <Progress
                      value={(job.completedQuantity / job.quantity) * 100}
                      className="h-2.5"
                    />
                    <div className="flex items-center justify-between pt-1">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          window.open(job.targetUrl, '_blank');
                        }}
                        className="text-brand-primary hover:text-brand-primary/80 font-medium text-sm flex items-center gap-1.5 transition-colors"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                        ลิงก์งาน
                      </button>
                      <span className="flex items-center gap-1.5 text-xs font-medium bg-brand-warning/10 text-brand-warning px-2 py-1 rounded-lg border border-brand-warning/20">
                        <Timer className="w-3.5 h-3.5" />
                        เหลือ {getTimeRemaining(job.deadline)}
                      </span>
                    </div>
                  </div>
                )}

                {/* Pending Review Info */}
                {activeTab === "pending_review" && job.submittedAt && (
                  <div className="flex items-center justify-between text-sm bg-brand-warning/5 border border-brand-warning/20 rounded-xl p-4">
                    <span className="text-brand-text-dark flex items-center gap-2">
                      <div className="p-1 rounded bg-brand-warning/10">
                        <Clock className="w-3.5 h-3.5 text-brand-warning" />
                      </div>
                      ส่งงานเมื่อ <span className="font-medium">{new Date(job.submittedAt).toLocaleDateString("th-TH", {
                        day: "numeric",
                        month: "short",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}</span>
                    </span>
                    <Badge variant="warning" className="uppercase tracking-wide font-bold">รอตรวจสอบ</Badge>
                  </div>
                )}

                {/* Completed Info */}
                {activeTab === "completed" && job.completedAt && (
                  <div className="flex items-center justify-between text-sm bg-brand-success/5 border border-brand-success/20 rounded-xl p-4">
                    <span className="text-brand-text-dark flex items-center gap-2">
                      <div className="p-1 rounded bg-brand-success/10">
                        <CheckCircle2 className="w-3.5 h-3.5 text-brand-success" />
                      </div>
                      เสร็จเมื่อ <span className="font-medium">{new Date(job.completedAt).toLocaleDateString("th-TH", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}</span>
                    </span>
                    <Badge variant="success" className="uppercase tracking-wide font-bold">+฿{job.earnings || 0}</Badge>
                  </div>
                )}

                {/* Actions - Prevent Card onClick propagation */}
                {activeTab === "in_progress" && (
                  <div className="grid grid-cols-2 gap-3" onClick={(e) => e.stopPropagation()}>
                    <Button variant="outline" className="w-full bg-white hover:bg-brand-bg/50 border-brand-border/50 shadow-sm" onClick={() => window.open(job.targetUrl, '_blank')}>
                      <ExternalLink className="w-4 h-4 mr-2" />
                      เปิดลิงก์
                    </Button>
                    <Button className="w-full shadow-md shadow-brand-primary/20" onClick={() => router.push(`/work/jobs/${job.id}`)}>
                      <Upload className="w-4 h-4 mr-2" />
                      ส่งงาน
                    </Button>
                  </div>
                )}
              </div>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
