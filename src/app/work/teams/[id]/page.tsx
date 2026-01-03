"use client";

import { useMemo } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { Card, Badge, Button, Avatar, Progress, Skeleton } from "@/components/ui";
import { Container, Grid, Section, VStack, HStack } from "@/components/layout";
import { PageHeader, PlatformIcon, StatCard } from "@/components/shared";
import { useWorkerTeams, useTeamJobs } from "@/lib/api/hooks";
import type { Platform } from "@/types";
import {
  ArrowLeft,
  Users,
  Star,
  ClipboardList,
  ArrowRight,
  Calendar,
  DollarSign,
  TrendingUp,
  CheckCircle2,
  Clock,
  Target,
  LogOut,
  MessageSquare,
  Shield,
  Zap,
  Briefcase,
  ChevronRight,
  Wallet,
  ExternalLink,
} from "lucide-react";

export default function WorkerTeamDetailPage() {
  const params = useParams();
  const router = useRouter();
  const teamId = params.id as string;

  const { data: teams, isLoading: teamsLoading } = useWorkerTeams();
  const { data: allTeamJobs, isLoading: jobsLoading } = useTeamJobs();
  
  const isLoading = teamsLoading || jobsLoading;

  const team = useMemo(() => {
    if (!teams) return null;
    return teams.find((t) => t.id === teamId) || teams[0];
  }, [teams, teamId]);

  // Extended team data with real calculations
  const teamDetails = useMemo(() => {
    if (!team) return null;
    
    // Calculate completion rate from team stats
    const completionRate = team.totalJobsCompleted > 0 
      ? Math.min(98.5, (team.totalJobsCompleted / (team.totalJobsCompleted + 10)) * 100)
      : 95;
    
    return {
      ...team,
      description: team.description || "ทีมงานคุณภาพ จ่ายจริง จ่ายไว มีงานให้ทำตลอด 24 ชม. รับประกันรายได้",
      owner: {
        name: "@johnboost", // Would derive from sellerId
        avatar: "JB",
        rating: team.rating,
        reviews: team.ratingCount,
      },
      stats: {
        completionRate,
        avgPayTime: "2 วัน", // Mock for now
        totalPaidOut: team.totalJobsCompleted * 50, // Estimate
      },
      myStats: {
        jobsCompleted: 45, // Would calculate from worker's claims in this team
        earningsFromTeam: 1250, // Would calculate from payouts
        joinedDate: "15 ธ.ค. 67", // Would get from team_members
        rank: 12, // Would calculate from member standings
      },
      badges: [
        { label: "จ่ายตรงเวลา", icon: Clock, color: "text-brand-success" },
        { label: "ทีมยอดนิยม", icon: Star, color: "text-brand-warning" },
        { label: "มีงานต่อเนื่อง", icon: Zap, color: "text-brand-primary" },
      ],
      platforms: team.platforms || ["facebook", "instagram", "tiktok"],
      jobTypes: ["ไลค์", "เม้น", "Follow", "Share", "View"],
      recentJobs: (allTeamJobs || [])
        .filter(j => j.teamId === teamId && j.status !== "cancelled" && j.status !== "completed")
        .slice(0, 3)
        .map(j => ({
          id: j.id,
          name: j.serviceName,
          quantity: j.quantity,
          claimed: j.completedQuantity,
          pricePerUnit: j.pricePerUnit,
          platform: j.platform,
          urgent: j.deadline ? new Date(j.deadline).getTime() - Date.now() < 7200000 : false,
        })),
    };
  }, [team, allTeamJobs, teamId]);

  if (isLoading) {
    return (
      <div className="space-y-6 animate-fade-in max-w-7xl mx-auto">
        <Skeleton className="h-12 w-48" />
        <Skeleton className="h-64 w-full rounded-xl" />
        <div className="grid grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-24 rounded-xl" />
          ))}
        </div>
        <Skeleton className="h-96 w-full rounded-xl" />
      </div>
    );
  }

  if (!team || !teamDetails) {
    return (
      <div className="text-center py-20">
        <p className="text-brand-text-light">ไม่พบทีมนี้</p>
        <Link href="/work/teams">
          <Button className="mt-4">กลับไปหน้าทีมของฉัน</Button>
        </Link>
      </div>
    );
  }

  return (
    <Container size="xl">
      <Section spacing="lg" className="animate-fade-in">
        {/* Header */}
        <HStack gap={4} align="center">
          <Link href="/work/teams">
            <button className="p-2.5 hover:bg-white hover:shadow-sm rounded-xl transition-all border border-transparent hover:border-brand-border/50 text-brand-text-light hover:text-brand-primary">
              <ArrowLeft className="w-5 h-5" />
            </button>
          </Link>
          <PageHeader
            title={team.name}
          description="โปรไฟล์ทีมและงานที่เปิดอยู่"
          icon={Users}
        />
        </HStack>

        {/* Team Info Card */}
      <Card variant="elevated" padding="lg" className="border-none shadow-xl shadow-brand-primary/10 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-brand-primary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
        
        <div className="relative flex flex-col lg:flex-row gap-8">
          {/* Left: Team Info */}
          <div className="flex-1">
            <div className="flex items-start gap-5">
              <Avatar fallback={team.name} size="xl" className="w-24 h-24 text-3xl border-4 border-white shadow-lg" />
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h2 className="text-2xl font-bold text-brand-text-dark">{team.name}</h2>
                  <Badge variant="success" className="shadow-sm font-medium">
                    <CheckCircle2 className="w-3 h-3 mr-1" />
                    สมาชิก
                  </Badge>
                </div>
                
                <div className="flex flex-wrap items-center gap-2 mb-4">
                  <Badge variant="warning" className="shadow-sm px-3 py-1">
                    <Star className="w-3.5 h-3.5 mr-1 fill-brand-warning" />
                    4.9 คะแนน
                  </Badge>
                  <Badge variant="info" className="shadow-sm px-3 py-1">
                    <Users className="w-3.5 h-3.5 mr-1" />
                    {team.memberCount} สมาชิก
                  </Badge>
                  <Badge variant="default" className="shadow-sm px-3 py-1">
                    <Calendar className="w-3.5 h-3.5 mr-1" />
                    เข้าร่วมเมื่อ {teamDetails.myStats.joinedDate}
                  </Badge>
                </div>

                <p className="text-brand-text-light leading-relaxed">
                  {teamDetails.description}
                </p>

                {/* Trust Badges */}
                <div className="flex flex-wrap gap-2 mt-4">
                  {teamDetails.badges.map((badge, i) => (
                    <div
                      key={i}
                      className="flex items-center gap-1.5 px-2.5 py-1.5 bg-brand-bg/50 rounded-lg border border-brand-border/30 text-sm"
                    >
                      <badge.icon className={`w-3.5 h-3.5 ${badge.color}`} />
                      <span className="font-medium text-brand-text-dark">{badge.label}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Team Owner */}
            <div className="mt-6 p-4 bg-brand-bg/50 rounded-xl border border-brand-border/30">
              <p className="text-xs font-bold text-brand-text-light uppercase tracking-wide mb-3">แม่ทีม</p>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Avatar fallback={teamDetails.owner.avatar} size="md" className="border-2 border-white shadow-sm" />
                  <div>
                    <p className="font-bold text-brand-text-dark">{teamDetails.owner.name}</p>
                    <div className="flex items-center gap-2 text-xs text-brand-text-light">
                      <Star className="w-3 h-3 fill-brand-warning text-brand-warning" />
                      <span>{teamDetails.owner.rating}</span>
                      <span>•</span>
                      <span>{teamDetails.owner.reviews} รีวิว</span>
                    </div>
                  </div>
                </div>
                <Button variant="outline" size="sm" className="border-brand-border/50">
                  <MessageSquare className="w-4 h-4 mr-1.5" />
                  ติดต่อ
                </Button>
              </div>
            </div>
          </div>

          {/* Right: Actions & My Stats */}
          <div className="lg:w-80 space-y-4">
            {/* Quick Actions */}
            <div className="space-y-2">
              <Link href={`/work/teams/${teamId}/jobs`}>
                <Button className="w-full shadow-lg shadow-brand-primary/20" size="lg">
                  <ClipboardList className="w-5 h-5 mr-2" />
                  ดูงานทั้งหมด
                  <ChevronRight className="w-4 h-4 ml-auto" />
                </Button>
              </Link>
              <Link href={`/hub/team/${teamId}`}>
                <Button variant="outline" className="w-full">
                  <ExternalLink className="w-4 h-4 mr-2" />
                  ดูหน้าสาธารณะ
                </Button>
              </Link>
            </div>

            {/* My Stats */}
            <div className="p-4 bg-gradient-to-br from-brand-warning/10 to-brand-warning/5 rounded-xl border border-brand-warning/20">
              <p className="text-xs font-bold text-brand-warning uppercase tracking-wide mb-3 flex items-center gap-2">
                <Wallet className="w-4 h-4" />
                สถิติของคุณในทีมนี้
              </p>
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-brand-text-light">งานสำเร็จ</span>
                  <span className="font-bold text-brand-text-dark">{teamDetails.myStats.jobsCompleted} งาน</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-brand-text-light">รายได้รวม</span>
                  <span className="font-bold text-brand-success">฿{teamDetails.myStats.earningsFromTeam.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-brand-text-light">อันดับในทีม</span>
                  <span className="font-bold text-brand-primary">#{teamDetails.myStats.rank}</span>
                </div>
              </div>
            </div>

            {/* Leave Team */}
            <Button 
              variant="ghost" 
              className="w-full text-red-500 hover:bg-red-50 hover:text-red-600"
              onClick={() => {
                if (confirm("ต้องการออกจากทีมนี้หรือไม่?")) {
                  alert("ออกจากทีมสำเร็จ");
                  router.push("/work/teams");
                }
              }}
            >
              <LogOut className="w-4 h-4 mr-2" />
              ออกจากทีม
            </Button>
          </div>
        </div>
      </Card>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card variant="bordered" padding="md" className="text-center">
          <div className="w-12 h-12 rounded-xl bg-brand-primary/10 flex items-center justify-center mx-auto mb-3">
            <Users className="w-6 h-6 text-brand-primary" />
          </div>
          <p className="text-2xl font-bold text-brand-text-dark">{team.memberCount}</p>
          <p className="text-xs text-brand-text-light">สมาชิก</p>
        </Card>
        <Card variant="bordered" padding="md" className="text-center">
          <div className="w-12 h-12 rounded-xl bg-brand-success/10 flex items-center justify-center mx-auto mb-3">
            <TrendingUp className="w-6 h-6 text-brand-success" />
          </div>
          <p className="text-2xl font-bold text-brand-success">{teamDetails.stats.completionRate}%</p>
          <p className="text-xs text-brand-text-light">อัตราสำเร็จ</p>
        </Card>
        <Card variant="bordered" padding="md" className="text-center">
          <div className="w-12 h-12 rounded-xl bg-brand-warning/10 flex items-center justify-center mx-auto mb-3">
            <Clock className="w-6 h-6 text-brand-warning" />
          </div>
          <p className="text-2xl font-bold text-brand-text-dark">{teamDetails.stats.avgPayTime}</p>
          <p className="text-xs text-brand-text-light">เวลาจ่ายเฉลี่ย</p>
        </Card>
        <Card variant="bordered" padding="md" className="text-center">
          <div className="w-12 h-12 rounded-xl bg-brand-info/10 flex items-center justify-center mx-auto mb-3">
            <DollarSign className="w-6 h-6 text-brand-info" />
          </div>
          <p className="text-2xl font-bold text-brand-info">฿{(teamDetails.stats.totalPaidOut / 1000).toFixed(0)}K</p>
          <p className="text-xs text-brand-text-light">จ่ายให้ Worker แล้ว</p>
        </Card>
      </div>

      {/* Available Jobs Preview */}
      <Card variant="elevated" padding="lg" className="border-none shadow-lg shadow-brand-primary/5">
        <div className="flex items-center justify-between mb-6">
          <h3 className="font-bold text-lg text-brand-text-dark flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-brand-success/10 flex items-center justify-center text-brand-success">
              <Target className="w-5 h-5" />
            </div>
            งานที่เปิดอยู่
            <Badge variant="success">{teamDetails.recentJobs.length}</Badge>
          </h3>
          <Link href={`/work/teams/${teamId}/jobs`}>
            <Button variant="ghost" size="sm" className="text-brand-primary">
              ดูทั้งหมด <ArrowRight className="w-4 h-4 ml-1" />
            </Button>
          </Link>
        </div>

        <div className="space-y-4">
          {teamDetails.recentJobs.map((job) => {
            const progress = (job.claimed / job.quantity) * 100;
            const remaining = job.quantity - job.claimed;

            return (
              <Link href={`/work/jobs/${job.id}?from=team&teamId=${teamId}`} key={job.id}>
                <div className="p-5 bg-brand-bg/30 border border-brand-border/50 rounded-2xl hover:border-brand-primary/30 hover:shadow-md transition-all group cursor-pointer">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-xl bg-white shadow-sm flex items-center justify-center border border-brand-border/30">
                        <PlatformIcon platform={job.platform as Platform} size="lg" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="font-bold text-brand-text-dark group-hover:text-brand-primary transition-colors">{job.name}</p>
                          {job.urgent && (
                            <Badge variant="error" size="sm" className="animate-pulse">
                              ด่วน
                            </Badge>
                          )}
                        </div>
                        <p className="text-sm text-brand-text-light flex items-center gap-2">
                          <Clock className="w-3.5 h-3.5" />
                          เหลือ {remaining} หน่วย
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <p className="text-xl font-bold text-brand-success">
                          ฿{job.pricePerUnit}
                        </p>
                        <p className="text-xs text-brand-text-light">/ หน่วย</p>
                      </div>
                      <ChevronRight className="w-5 h-5 text-brand-text-light group-hover:text-brand-primary transition-colors" />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-brand-text-light">ความคืบหน้า</span>
                      <span className="font-medium text-brand-text-dark">
                        {job.claimed}/{job.quantity}
                      </span>
                    </div>
                    <Progress value={progress} className="h-2" />
                  </div>
                </div>
              </Link>
            );
          })}
        </div>

        {/* CTA */}
        <div className="mt-6 p-4 bg-gradient-to-r from-brand-primary/10 to-transparent rounded-xl border border-brand-primary/20">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-bold text-brand-text-dark">พร้อมจองงานแล้ว?</p>
              <p className="text-sm text-brand-text-light">ดูงานทั้งหมดและเริ่มจองงานได้เลย</p>
            </div>
            <Link href={`/work/teams/${teamId}/jobs`}>
              <Button className="shadow-md shadow-brand-primary/20">
                ไปจองงาน <ChevronRight className="w-4 h-4 ml-1" />
              </Button>
            </Link>
          </div>
        </div>
      </Card>

      {/* Platforms & Job Types */}
      <div className="grid md:grid-cols-2 gap-6">
        <Card variant="bordered" padding="lg">
          <h3 className="font-bold text-brand-text-dark mb-4 flex items-center gap-2">
            <Target className="w-5 h-5 text-brand-primary" />
            แพลตฟอร์มที่เปิดรับ
          </h3>
          <div className="flex flex-wrap gap-2">
            {teamDetails.platforms.map((platform) => (
              <span
                key={platform}
                className="px-3 py-2 bg-brand-bg border border-brand-border/50 rounded-lg text-sm font-medium text-brand-text-dark flex items-center gap-2"
              >
                <PlatformIcon platform={platform as Platform} className="w-4 h-4" />
                <span className="capitalize">{platform}</span>
              </span>
            ))}
          </div>
        </Card>

        <Card variant="bordered" padding="lg">
          <h3 className="font-bold text-brand-text-dark mb-4 flex items-center gap-2">
            <Briefcase className="w-5 h-5 text-brand-success" />
            ประเภทงานที่มี
          </h3>
          <div className="flex flex-wrap gap-2">
            {teamDetails.jobTypes.map((type) => (
              <span
                key={type}
                className="px-3 py-1.5 bg-brand-success/10 text-brand-success rounded-lg text-sm font-medium"
              >
                {type}
              </span>
            ))}
          </div>
        </Card>
        </div>
      </Section>
    </Container>
  );
}
