"use client";

import { useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { Card, Button, Badge, Progress, Avatar } from "@/components/ui";
import { PageHeader, PlatformIcon, ServiceTypeBadge, EmptyState, SegmentedControl, StatsGridCompact } from "@/components/shared";
import type { FilterOption } from "@/components/shared";
import type { Platform, ServiceMode } from "@/types";
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
} from "lucide-react";

type TabType = "available" | "in_progress" | "completed";

export default function TeamJobsPage() {
  const params = useParams();
  const teamId = params.id as string;
  const [activeTab, setActiveTab] = useState<TabType>("available");

  // Mock Team Data
  const team = {
    id: teamId,
    name: "JohnBoost Team",
    rating: 4.9,
    memberCount: 45,
  };

  // Mock Jobs Data
  const teamJobs = {
    available: [
      {
        id: "job-1",
        serviceName: "ไลค์ Facebook",
        platform: "facebook",
        type: "human",
        quantity: 500,
        claimed: 320,
        pricePerUnit: 0.2,
        deadline: "2 ชม.",
        urgent: true,
      },
      {
        id: "job-2",
        serviceName: "Follow Instagram",
        platform: "instagram",
        type: "human",
        quantity: 200,
        claimed: 50,
        pricePerUnit: 0.3,
        deadline: "5 ชม.",
        urgent: false,
      },
      {
        id: "job-3",
        serviceName: "View TikTok",
        platform: "tiktok",
        type: "human",
        quantity: 1000,
        claimed: 200,
        pricePerUnit: 0.08,
        deadline: "12 ชม.",
        urgent: false,
      },
    ],
    in_progress: [
      {
        id: "job-4",
        serviceName: "ไลค์ Facebook",
        platform: "facebook",
        type: "human",
        quantity: 100,
        completed: 65,
        pricePerUnit: 0.2,
        deadline: "1 ชม.",
        myPayout: 20,
      },
    ],
    completed: [
      {
        id: "job-5",
        serviceName: "เม้น Facebook",
        platform: "facebook",
        type: "human",
        quantity: 50,
        completed: 50,
        pricePerUnit: 1.5,
        completedAt: "2024-12-29",
        myEarnings: 75,
      },
      {
        id: "job-6",
        serviceName: "Follow Instagram",
        platform: "instagram",
        type: "human",
        quantity: 80,
        completed: 80,
        pricePerUnit: 0.3,
        completedAt: "2024-12-28",
        myEarnings: 24,
      },
    ],
  };

  const currentJobs = teamJobs[activeTab];

  // Stats
  const statsData = [
    {
      label: "งานว่าง",
      value: teamJobs.available.length,
      icon: Briefcase,
      iconColor: "text-brand-primary",
      iconBgColor: "bg-brand-primary/10",
    },
    {
      label: "กำลังทำ",
      value: teamJobs.in_progress.length,
      icon: PlayCircle,
      iconColor: "text-brand-warning",
      iconBgColor: "bg-brand-warning/10",
    },
    {
      label: "เสร็จแล้ว",
      value: teamJobs.completed.length,
      icon: CheckCircle2,
      iconColor: "text-brand-success",
      iconBgColor: "bg-brand-success/10",
    },
  ];

  // Tab Options
  const tabOptions: FilterOption<TabType>[] = [
    { key: "available", label: "งานว่าง", icon: <Briefcase className="w-4 h-4" />, count: teamJobs.available.length },
    { key: "in_progress", label: "กำลังทำ", icon: <PlayCircle className="w-4 h-4" />, count: teamJobs.in_progress.length },
    { key: "completed", label: "เสร็จแล้ว", icon: <CheckCircle2 className="w-4 h-4" />, count: teamJobs.completed.length },
  ];

  return (
    <div className="space-y-6 animate-fade-in max-w-7xl mx-auto">
      {/* Header */}
      <Card className="border-none shadow-lg bg-gradient-to-r from-brand-primary/10 to-transparent p-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-brand-primary/5 rounded-full blur-3xl -mr-32 -mt-32" />
        <div className="relative flex items-center gap-6">
          <Link href="/work/teams">
            <button className="p-3 hover:bg-white bg-white/60 backdrop-blur-sm border border-brand-border/50 rounded-xl transition-all shadow-sm group">
              <ArrowLeft className="w-5 h-5 text-brand-text-dark group-hover:text-brand-primary" />
            </button>
          </Link>
          <div className="flex-1 flex items-center gap-5">
            <Avatar fallback={team.name} size="xl" className="w-20 h-20 text-2xl border-4 border-white shadow-md" />
            <div>
              <div className="flex items-center gap-3 mb-1">
                <h1 className="text-3xl font-bold text-brand-text-dark tracking-tight">
                  {team.name}
                </h1>
                <Badge variant="warning" className="text-sm px-2 py-0.5 font-bold shadow-sm">
                  <Star className="w-3.5 h-3.5 mr-1 fill-current" />
                  {team.rating}
                </Badge>
              </div>
              <div className="flex items-center gap-4 text-brand-text-light font-medium">
                <span className="flex items-center gap-1.5">
                  <Users className="w-4 h-4" />
                  {team.memberCount} สมาชิก
                </span>
                <span className="w-1 h-1 rounded-full bg-brand-border" />
                <span className="text-brand-primary">
                  รับงานได้ทันที ⚡
                </span>
              </div>
            </div>
          </div>
          <div className="hidden md:block">
            <Button variant="outline" className="bg-white/50 border-brand-border/50 hover:bg-white shadow-sm">
              ดูโปรไฟล์ทีม
            </Button>
          </div>
        </div>
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
            {activeTab === "available" && teamJobs.available.map((job) => (
              <Card key={job.id} variant="elevated" className="border-none shadow-md hover:shadow-lg transition-all group">
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
                        <ServiceTypeBadge type={job.type as ServiceMode} />
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
                    <Button className="shadow-md shadow-brand-primary/20">
                      รับงาน <ChevronRight className="w-4 h-4 ml-1" />
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
            {activeTab === "in_progress" && teamJobs.in_progress.map((job) => (
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
            {activeTab === "completed" && teamJobs.completed.map((job) => (
              <Card key={job.id} variant="elevated" className="border-l-4 border-l-brand-success border-none shadow-sm">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="flex items-start gap-4">
                    <div className="w-14 h-14 rounded-2xl bg-brand-success/10 border border-brand-success/20 flex items-center justify-center">
                      <CheckCircle2 className="w-7 h-7 text-brand-success" />
                    </div>
                    <div>
                      <h3 className="font-bold text-lg text-brand-text-dark">
                        {job.serviceName}
                      </h3>
                      <div className="flex items-center gap-3 text-sm text-brand-text-light mt-1">
                        <span>{job.completed} หน่วย</span>
                        <span>•</span>
                        <span>เสร็จเมื่อ {new Date(job.completedAt).toLocaleDateString("th-TH", { day: "numeric", month: "short" })}</span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-xl font-bold text-brand-success flex items-center gap-1 justify-end">
                      <DollarSign className="w-5 h-5" />
                      +฿{job.myEarnings}
                    </p>
                    <p className="text-xs text-brand-text-light">รายได้จากงานนี้</p>
                  </div>
                </div>
              </Card>
            ))}
          </>
        )}
      </div>
    </div>
  );
}
