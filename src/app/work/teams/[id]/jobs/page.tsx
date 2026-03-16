"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { Card, Button, Badge, Progress, Avatar } from "@/components/ui";
import { Container, Section, HStack } from "@/components/layout";
import { PageHeader, PlatformIcon, ServiceTypeBadge, EmptyState, SegmentedControl, StatsGridCompact, ClaimJobModal, ReviewTeamModal } from "@/components/shared";
import type { FilterOption } from "@/components/shared";
import type { Platform, ServiceMode } from "@/types";
import { useWorkerTeams, useWorkerJobs, useTeamJobs } from "@/lib/api/hooks";
import { api } from "@/lib/api";
import {
  ArrowLeft,
  Briefcase,
  Clock,
  CheckCircle2,
  PlayCircle,
  Target,
  Users,
  Star,
  DollarSign,
  Zap,
  ChevronRight,
  MessageSquare,
} from "lucide-react";

type TabType = "available" | "in_progress" | "completed";

interface AvailableJob {
  id: string;
  serviceName: string;
  platform: string;
  type: string;
  quantity: number;
  claimed: number;
  pricePerUnit: number;
  deadline: string;
  urgent: boolean;
}

export default function TeamJobsPage() {
  const params = useParams();
  const router = useRouter();
  const teamId = params.id as string;
  const [activeTab, setActiveTab] = useState<TabType>("available");
  const [selectedJob, setSelectedJob] = useState<AvailableJob | null>(null);
  const [isClaimModalOpen, setIsClaimModalOpen] = useState(false);
  const [isClaimLoading, setIsClaimLoading] = useState(false);
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [reviewJobName, setReviewJobName] = useState<string>("");

  // Get data from API
  const { data: teams } = useWorkerTeams();
  const { data: workerJobsData } = useWorkerJobs();
  const { data: allTeamJobs } = useTeamJobs(); // All available team jobs
  
  const team = useMemo(() => {
    return teams?.find(t => t.id === teamId);
  }, [teams, teamId]);
  
  // Organize jobs by status
  const teamJobsOrganized = useMemo(() => {
    if (!workerJobsData || !allTeamJobs) {
      return { available: [], in_progress: [], completed: [] };
    }
    
    // Available jobs = team jobs that belong to this team and are not yet claimed by current worker
    // Filter team jobs where status is pending or in_progress (still accepting workers) AND belong to this team
    const available = allTeamJobs
      .filter(tj => 
        tj.teamId === teamId && // Only jobs from this team
        (tj.status === "pending" || tj.status === "in_progress") &&
        tj.completedQuantity < tj.quantity
      )
      .map(tj => ({
        id: tj.id,
        serviceName: tj.serviceName,
        platform: tj.platform,
        type: "human" as const,
        quantity: tj.quantity,
        claimed: tj.completedQuantity,
        pricePerUnit: tj.pricePerUnit,
        deadline: tj.deadline ? new Date(tj.deadline).toLocaleString('th-TH') : "ไม่มีกำหนด",
        urgent: tj.deadline ? new Date(tj.deadline).getTime() - Date.now() < 7200000 : false, // < 2 hours
      }));
    
    // Map worker's actual jobs to display format
    const inProgress = workerJobsData.in_progress.map(wj => ({
      id: wj.id,
      serviceName: wj.serviceName,
      platform: wj.platform,
      type: wj.type,
      quantity: wj.quantity,
      completed: wj.completedQuantity,
      pricePerUnit: wj.pricePerUnit,
      deadline: wj.deadline,
      myPayout: wj.quantity * wj.pricePerUnit,
    }));
    
    const completed = workerJobsData.completed.map(wj => ({
      id: wj.id,
      serviceName: wj.serviceName,
      platform: wj.platform,
      type: wj.type,
      quantity: wj.quantity,
      completed: wj.completedQuantity,
      pricePerUnit: wj.pricePerUnit,
      completedAt: wj.completedAt,
      myEarnings: wj.earnings || 0,
      isPaid: !!wj.earnings,
      paidAt: wj.completedAt,
      hasReviewed: false, // Would need separate review tracking
    }));
    
    return { available, in_progress: inProgress, completed };
  }, [workerJobsData, allTeamJobs]);

  const currentJobs = teamJobsOrganized[activeTab];

  // Handle claim job
  const handleOpenClaimModal = (job: AvailableJob) => {
    setSelectedJob({
      ...job,
      // Add team name for display in modal
    });
    setIsClaimModalOpen(true);
  };

  const handleClaimJob = async (quantity: number) => {
    if (!selectedJob) return;
    
    setIsClaimLoading(true);
    
    try {
      await api.worker.claimTeamJob(selectedJob.id, quantity);
      
      alert(`จองงาน ${selectedJob.serviceName} จำนวน ${quantity} สำเร็จ!`);
      
      setIsClaimLoading(false);
      setIsClaimModalOpen(false);
      setSelectedJob(null);
      
      // Redirect to jobs page after successful claim
      router.push("/work/jobs");
    } catch (error: any) {
      console.error("Error claiming job:", error);
      alert(error?.message || "เกิดข้อผิดพลาดในการจองงาน กรุณาลองใหม่อีกครั้ง");
      setIsClaimLoading(false);
    }
  };

  // Stats
  const statsData = useMemo(() => [
    {
      label: "งานว่าง",
      value: teamJobsOrganized.available.length,
      icon: Briefcase,
      iconColor: "text-brand-primary",
      iconBgColor: "bg-brand-primary/10",
    },
    {
      label: "กำลังทำ",
      value: teamJobsOrganized.in_progress.length,
      icon: PlayCircle,
      iconColor: "text-brand-warning",
      iconBgColor: "bg-brand-warning/10",
    },
    {
      label: "เสร็จแล้ว",
      value: teamJobsOrganized.completed.length,
      icon: CheckCircle2,
      iconColor: "text-brand-success",
      iconBgColor: "bg-brand-success/10",
    },
  ], [teamJobsOrganized]);

  // Tab Options
  const tabOptions: FilterOption<TabType>[] = useMemo(() => [
    { key: "available", label: "งานว่าง", icon: <Briefcase className="w-4 h-4" />, count: teamJobsOrganized.available.length },
    { key: "in_progress", label: "กำลังทำ", icon: <PlayCircle className="w-4 h-4" />, count: teamJobsOrganized.in_progress.length },
    { key: "completed", label: "เสร็จแล้ว", icon: <CheckCircle2 className="w-4 h-4" />, count: teamJobsOrganized.completed.length },
  ], [teamJobsOrganized]);

  return (
    <Container size="xl">
      <Section spacing="md" className="animate-fade-in">
        {/* Header */}
        <Card className="border-none shadow-lg bg-gradient-to-r from-brand-primary/10 to-transparent p-6 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-brand-primary/5 rounded-full blur-3xl -mr-32 -mt-32" />
          <HStack gap={6} align="center" className="relative">
            <Link href="/work/teams">
              <button className="p-3 hover:bg-white bg-white/60 backdrop-blur-sm border border-brand-border/50 rounded-xl transition-all shadow-sm group">
                <ArrowLeft className="w-5 h-5 text-brand-text-dark group-hover:text-brand-primary" />
              </button>
            </Link>
          <div className="flex-1 flex items-center gap-5">
            <Avatar fallback={team?.name || "T"} size="xl" className="w-20 h-20 text-2xl border-4 border-white shadow-md" />
            <div>
              <div className="flex items-center gap-3 mb-1">
                <h1 className="text-3xl font-bold text-brand-text-dark tracking-tight">
                  {team?.name || "ทีม"}
                </h1>
                <Badge variant="warning" className="text-sm px-2 py-0.5 font-bold shadow-sm">
                  <Star className="w-3.5 h-3.5 mr-1 fill-current" />
                  {team?.rating || 0}
                </Badge>
              </div>
              <div className="flex items-center gap-4 text-brand-text-light font-medium">
                <span className="flex items-center gap-1.5">
                  <Users className="w-4 h-4" />
                  {team?.memberCount || 0} สมาชิก
                </span>
                <span className="w-1 h-1 rounded-full bg-brand-border" />
                <span className="text-brand-primary">
                  จองงานได้ทันที ⚡
                </span>
              </div>
            </div>
          </div>
          <div className="hidden md:block">
            <Link href={`/hub/team/${teamId}`}>
              <Button variant="outline" className="bg-white/50 border-brand-border/50 hover:bg-white shadow-sm">
                ดูโปรไฟล์ทีม
              </Button>
            </Link>
          </div>
          </HStack>
        </Card>

        {/* Stats */}
      <StatsGridCompact stats={statsData} columns={3} />

      {/* Tabs */}
      <SegmentedControl
        options={tabOptions}
        activeOption={activeTab}
        onChange={setActiveTab}
      />

      {/* Jobs List */}
      <div className="space-y-4">
        {currentJobs.length === 0 ? (
          <EmptyState
            icon={Briefcase}
            title="ไม่มีงานในหมวดนี้"
            description={activeTab === "available" ? "ยังไม่มีงานว่างในขณะนี้" : "ลองดูงานในหมวดอื่น"}
          />
        ) : (
          <>
            {/* Available Jobs */}
            {activeTab === "available" && teamJobsOrganized.available.map((job) => (
              <Card 
                key={job.id} 
                variant="elevated" 
                className="border-none shadow-md hover:shadow-lg transition-all group cursor-pointer"
                onClick={() => router.push(`/work/jobs/preview/${job.id}`)}
              >
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="flex items-start gap-4">
                    <div className="w-14 h-14 rounded-2xl bg-brand-bg border border-brand-border/50 flex items-center justify-center shadow-sm group-hover:scale-105 transition-transform">
                      <PlatformIcon platform={job.platform as Platform} className="w-7 h-7" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-bold text-lg text-brand-text-dark group-hover:text-brand-primary transition-colors">
                          {job.serviceName}
                        </h3>
                        {job.urgent && (
                          <Badge variant="error" size="sm" className="animate-pulse">
                            <Zap className="w-3 h-3 mr-1" /> ด่วน
                          </Badge>
                        )}
                        <ServiceTypeBadge type={"human" as ServiceMode} />
                      </div>
                      <div className="flex flex-wrap items-center gap-3 text-sm text-brand-text-light">
                        <span className="flex items-center gap-1">
                          <Target className="w-4 h-4" />
                          {job.claimed}/{job.quantity} รับแล้ว
                        </span>
                        <span className="flex items-center gap-1 text-brand-warning">
                          <Clock className="w-4 h-4" />
                          เหลือ {job.deadline}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <p className="text-2xl font-bold text-brand-primary">
                        ฿{job.pricePerUnit}
                      </p>
                      <p className="text-xs text-brand-text-light">ต่อหน่วย</p>
                    </div>
                    <Button 
                      className="shadow-md shadow-brand-primary/20"
                      onClick={(e) => {
                        e.stopPropagation();
                        router.push(`/work/jobs/preview/${job.id}`);
                      }}
                    >
                      ดูรายละเอียด <ChevronRight className="w-4 h-4 ml-1" />
                    </Button>
                  </div>
                </div>
                {/* Progress */}
                <div className="mt-4 pt-4 border-t border-brand-border/50">
                  <div className="flex justify-between text-xs text-brand-text-light mb-2">
                    <span>ความคืบหน้า</span>
                    <span>{Math.round((job.claimed / job.quantity) * 100)}%</span>
                  </div>
                  <Progress value={(job.claimed / job.quantity) * 100} className="h-1.5" />
                </div>
              </Card>
            ))}

            {/* In Progress Jobs */}
            {activeTab === "in_progress" && teamJobsOrganized.in_progress.map((job) => (
              <Link href={`/work/jobs/${job.id}`} key={job.id}>
                <Card variant="elevated" className="border-l-4 border-l-brand-warning border-none shadow-md hover:shadow-lg transition-all cursor-pointer group">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex items-start gap-4">
                      <div className="w-14 h-14 rounded-2xl bg-brand-bg border border-brand-border/50 flex items-center justify-center shadow-sm">
                        <PlatformIcon platform={job.platform as Platform} className="w-7 h-7" />
                      </div>
                      <div>
                        <h3 className="font-bold text-lg text-brand-text-dark group-hover:text-brand-primary transition-colors">
                          {job.serviceName}
                        </h3>
                        <div className="flex items-center gap-3 text-sm text-brand-text-light mt-1">
                          <span className="flex items-center gap-1">
                            <Target className="w-4 h-4" />
                            {job.completed}/{job.quantity}
                          </span>
                          <span className="flex items-center gap-1 text-brand-warning font-medium">
                            <Clock className="w-4 h-4" />
                            เหลือ {job.deadline}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <p className="text-xl font-bold text-brand-success">
                          ฿{job.myPayout}
                        </p>
                        <p className="text-xs text-brand-text-light">รายได้</p>
                      </div>
                      <ChevronRight className="w-5 h-5 text-brand-text-light group-hover:text-brand-primary transition-colors" />
                    </div>
                  </div>
                  {/* Progress */}
                  <div className="mt-4 pt-4 border-t border-brand-border/50">
                    <div className="flex justify-between text-xs text-brand-text-light mb-2">
                      <span>ความคืบหน้าของคุณ</span>
                      <span className="font-bold text-brand-text-dark">{Math.round((job.completed / job.quantity) * 100)}%</span>
                    </div>
                    <Progress value={(job.completed / job.quantity) * 100} variant="warning" className="h-2" />
                  </div>
                </Card>
              </Link>
            ))}

            {/* Completed Jobs */}
            {activeTab === "completed" && teamJobsOrganized.completed.map((job) => (
              <Card key={job.id} variant="elevated" className="border-l-4 border-l-brand-success border-none shadow-sm hover:shadow-md transition-all">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <Link href={`/work/jobs/${job.id}`} className="flex items-start gap-4 flex-1 group">
                    <div className="w-14 h-14 rounded-2xl bg-brand-success/10 border border-brand-success/20 flex items-center justify-center">
                      <CheckCircle2 className="w-7 h-7 text-brand-success" />
                    </div>
                    <div>
                      <h3 className="font-bold text-lg text-brand-text-dark group-hover:text-brand-primary transition-colors">
                        {job.serviceName}
                      </h3>
                      <div className="flex flex-wrap items-center gap-2 text-sm text-brand-text-light mt-1">
                        <span>{job.completed} หน่วย</span>
                        <span>•</span>
                        <span>เสร็จเมื่อ {job.completedAt ? new Date(job.completedAt).toLocaleDateString("th-TH", { day: "numeric", month: "short" }) : '-'}</span>
                        {job.isPaid ? (
                          <Badge variant="success" size="sm">💰 จ่ายแล้ว</Badge>
                        ) : (
                          <Badge variant="warning" size="sm">⏳ รอจ่าย</Badge>
                        )}
                      </div>
                    </div>
                  </Link>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <p className="text-xl font-bold text-brand-success flex items-center gap-1 justify-end">
                        <DollarSign className="w-5 h-5" />
                        +฿{job.myEarnings}
                      </p>
                      <p className="text-xs text-brand-text-light">รายได้จากงานนี้</p>
                    </div>
                    {/* แสดงปุ่มรีวิวเฉพาะงานที่จ่ายเงินแล้วและยังไม่ได้รีวิว */}
                    {job.isPaid && !job.hasReviewed ? (
                      <Button 
                        variant="outline" 
                        size="sm"
                        className="border-brand-warning/50 text-brand-warning hover:bg-brand-warning/10"
                        onClick={() => {
                          setReviewJobName(job.serviceName);
                          setIsReviewModalOpen(true);
                        }}
                      >
                        <MessageSquare className="w-4 h-4 mr-1" />
                        รีวิว
                      </Button>
                    ) : job.hasReviewed ? (
                      <Badge variant="default" size="sm" className="px-3 py-1.5">
                        <CheckCircle2 className="w-3 h-3 mr-1" />
                        รีวิวแล้ว
                      </Badge>
                    ) : (
                      <span className="text-xs text-brand-text-light">รอจ่ายก่อนรีวิว</span>
                    )}
                  </div>
                </div>
              </Card>
            ))}
          </>
        )}
      </div>

      {/* Claim Job Modal */}
      <ClaimJobModal
        isOpen={isClaimModalOpen}
        onClose={() => {
          setIsClaimModalOpen(false);
          setSelectedJob(null);
        }}
        job={selectedJob ? { ...selectedJob, teamName: team?.name || "ทีม" } : null}
        onConfirm={handleClaimJob}
        isLoading={isClaimLoading}
      />

      {/* Review Team Modal */}
      <ReviewTeamModal
        isOpen={isReviewModalOpen}
        onClose={() => {
          setIsReviewModalOpen(false);
          setReviewJobName("");
        }}
        teamName={team?.name || "ทีม"}
        jobName={reviewJobName}
        onSubmit={async (data) => {
          // Simulate API call
          await new Promise((resolve) => setTimeout(resolve, 1000));
          alert(`ส่งรีวิวสำเร็จ! ให้คะแนน ${data.rating} ดาว`);
          setIsReviewModalOpen(false);
          setReviewJobName("");
        }}
      />
      </Section>
    </Container>
  );
}
