"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { Card, Badge, Button, Avatar, Progress, Skeleton } from "@/components/ui";
import { PageHeader, PlatformIcon } from "@/components/shared";
import { useHubPosts, useWorkerTeams } from "@/lib/api/hooks";
import { useAuthStore } from "@/lib/store";
import type { Platform } from "@/types";
import {
  ArrowLeft,
  Star,
  Users,
  DollarSign,
  CheckCircle2,
  Shield,
  Clock,
  Target,
  TrendingUp,
  Calendar,
  MessageCircle,
  Briefcase,
  Award,
  ThumbsUp,
  Zap,
  Eye,
  LogOut,
  ChevronRight,
  Wallet,
} from "lucide-react";

export default function TeamProfilePage() {
  const params = useParams();
  const router = useRouter();
  const teamId = params.id as string;
  const { user } = useAuthStore();

  const { data: hubPosts, isLoading: postsLoading } = useHubPosts();
  const { data: workerTeams, isLoading: teamsLoading } = useWorkerTeams();

  // Check if user is a member of this team
  const isMember = useMemo(() => {
    if (!workerTeams || !user || user.role !== "worker") return false;
    // Check by team ID or by matching post ID
    return workerTeams.some((t) => t.id === teamId || teamId.startsWith("post-"));
  }, [workerTeams, teamId, user]);

  // Find team data - either from worker teams (if member) or from hub posts
  const post = useMemo(() => {
    if (!hubPosts) return null;
    // Try to find by post ID first
    let found = hubPosts.find((p) => p.id === teamId && p.type === "recruit");
    // If not found and ID starts with "team-", try to find any recruit post
    if (!found && teamId.startsWith("team-")) {
      found = hubPosts.find((p) => p.type === "recruit");
    }
    return found;
  }, [hubPosts, teamId]);

  // Mock team details
  const teamDetails = useMemo(() => {
    if (!post) return null;
    return {
      id: teamId,
      ...post.author,
      description: "ทีมงานคุณภาพ จ่ายจริง จ่ายไว มีงานให้ทำตลอด 24 ชม. รับประกันรายได้ เน้นงาน Facebook และ Instagram มีพี่เลี้ยงคอยดูแลสมาชิกใหม่ทุกคน",
      stats: {
        totalJobs: 1250,
        completionRate: 98.5,
        avgPayTime: "2 วัน",
        activeMembers: 42,
        totalPaidOut: post.author.totalPaid || 125000,
        avgRating: post.author.rating || 4.9,
      },
      // Member-only stats
      myStats: {
        jobsCompleted: 45,
        earningsFromTeam: 1250,
        joinedDate: "15 ธ.ค. 67",
      },
      badges: [
        { label: "จ่ายตรงเวลา", icon: Clock, color: "text-brand-success" },
        { label: "ทีมยอดนิยม", icon: Star, color: "text-brand-warning" },
        { label: "มีงานต่อเนื่อง", icon: Zap, color: "text-brand-primary" },
      ],
      platforms: ["facebook", "instagram", "tiktok"],
      jobTypes: ["ไลค์", "เม้น", "Follow", "Share", "View"],
      recentReviews: [
        {
          id: "rev-1",
          author: "น้องมิ้นท์",
          avatar: "ม",
          rating: 5,
          comment: "แม่ทีมดีมาก จ่ายตรงเวลาทุกครั้ง งานเยอะมากๆ",
          date: "3 วันก่อน",
        },
        {
          id: "rev-2",
          author: "พี่ต้น",
          avatar: "ต",
          rating: 5,
          comment: "อยู่มา 6 เดือน ไม่เคยมีปัญหาเรื่องเงินเลย แนะนำครับ",
          date: "1 สัปดาห์ก่อน",
        },
        {
          id: "rev-3",
          author: "แนน",
          avatar: "แ",
          rating: 4,
          comment: "งานดี แต่บางทีงานเยอะไปหน่อย ต้องรีบทำ",
          date: "2 สัปดาห์ก่อน",
        },
      ],
      // Jobs with pricing (visible to members only)
      openJobs: [
        { id: "job-1", name: "ไลค์ Facebook", quantity: 500, claimed: 320, pricePerUnit: 0.2, platform: "facebook", urgent: false },
        { id: "job-2", name: "Follow Instagram", quantity: 200, claimed: 50, pricePerUnit: 0.3, platform: "instagram", urgent: true },
        { id: "job-3", name: "View TikTok", quantity: 1000, claimed: 200, pricePerUnit: 0.08, platform: "tiktok", urgent: false },
      ],
    };
  }, [post, teamId]);

  const isLoading = postsLoading || teamsLoading;

  if (isLoading) {
    return (
      <div className="space-y-6 animate-fade-in max-w-4xl mx-auto">
        <Skeleton className="h-12 w-48" />
        <Skeleton className="h-64 w-full rounded-xl" />
        <Skeleton className="h-96 w-full rounded-xl" />
      </div>
    );
  }

  if (!post || !teamDetails) {
    return (
      <div className="text-center py-20">
        <div className="w-20 h-20 bg-brand-bg rounded-full flex items-center justify-center mx-auto mb-6">
          <Users className="w-10 h-10 text-brand-text-light" />
        </div>
        <h1 className="text-2xl font-bold text-brand-text-dark mb-2">ไม่พบทีมนี้</h1>
        <p className="text-brand-text-light mb-6">ทีมอาจถูกลบหรือไม่มีอยู่ในระบบ</p>
        <Link href="/hub">
          <Button>กลับไปตลาดกลาง</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fade-in max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => router.back()}
          className="p-2.5 hover:bg-white hover:shadow-sm rounded-xl transition-all border border-transparent hover:border-brand-border/50 text-brand-text-light hover:text-brand-primary"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <PageHeader
          title="โปรไฟล์ทีม"
          description={isMember ? "ทีมที่คุณเป็นสมาชิก" : "ข้อมูลและรีวิวจากสมาชิก"}
          icon={Users}
        />
        {isMember && (
          <Badge variant="success" className="ml-auto shadow-sm">
            <CheckCircle2 className="w-3.5 h-3.5 mr-1" />
            สมาชิก
          </Badge>
        )}
      </div>

      {/* Team Header Card */}
      <Card variant="elevated" padding="lg" className="border-none shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-brand-primary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
        
        <div className="relative flex flex-col md:flex-row gap-6">
          {/* Avatar & Basic Info */}
          <div className="flex items-start gap-5">
            <div className="relative">
              <div className="w-24 h-24 rounded-2xl bg-brand-primary text-white flex items-center justify-center text-4xl font-bold shadow-lg">
                {teamDetails.avatar}
              </div>
              {teamDetails.verified && (
                <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-brand-success rounded-full flex items-center justify-center border-4 border-white shadow">
                  <CheckCircle2 className="w-4 h-4 text-white" />
                </div>
              )}
            </div>
            <div className="flex-1">
              <h1 className="text-2xl font-bold text-brand-text-dark mb-2">
                {teamDetails.name}
              </h1>
              <div className="flex flex-wrap items-center gap-3 mb-3">
                <Badge variant="warning" className="shadow-sm px-3 py-1">
                  <Star className="w-3.5 h-3.5 mr-1 fill-brand-warning" />
                  {teamDetails.stats.avgRating} คะแนน
                </Badge>
                <Badge variant="info" className="shadow-sm px-3 py-1">
                  <Users className="w-3.5 h-3.5 mr-1" />
                  {teamDetails.memberCount} สมาชิก
                </Badge>
                {teamDetails.verified && (
                  <Badge variant="success" className="shadow-sm px-3 py-1">
                    <Shield className="w-3.5 h-3.5 mr-1" />
                    ยืนยันแล้ว
                  </Badge>
                )}
              </div>
              <p className="text-brand-text-light leading-relaxed max-w-xl">
                {teamDetails.description}
              </p>
            </div>
          </div>

          {/* Action Buttons - Different for members vs non-members */}
          <div className="md:ml-auto flex flex-col gap-2 shrink-0">
            {isMember ? (
              <>
                <Link href={`/work/teams/${teamId}/jobs`}>
                  <Button className="w-full shadow-lg shadow-brand-primary/20">
                    <Briefcase className="w-4 h-4 mr-2" />
                    ดูงานในทีม
                    <ChevronRight className="w-4 h-4 ml-1" />
                  </Button>
                </Link>
                <Button variant="outline" onClick={() => alert("ระบบแชทกำลังพัฒนา")}>
                  <MessageCircle className="w-4 h-4 mr-2" />
                  ติดต่อแม่ทีม
                </Button>
                <Button 
                  variant="ghost" 
                  className="text-red-500 hover:bg-red-50 hover:text-red-600"
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
              </>
            ) : (
              <>
                <Link href={`/hub/post/${post.id}`}>
                  <Button className="w-full shadow-lg shadow-brand-primary/20">
                    <Briefcase className="w-4 h-4 mr-2" />
                    สมัครเข้าทีม
                  </Button>
                </Link>
                <Button variant="outline" onClick={() => alert("ระบบแชทกำลังพัฒนา")}>
                  <MessageCircle className="w-4 h-4 mr-2" />
                  ส่งข้อความ
                </Button>
              </>
            )}
          </div>
        </div>

        {/* Trust Badges */}
        <div className="flex flex-wrap gap-3 mt-6 pt-6 border-t border-brand-border/50">
          {teamDetails.badges.map((badge, i) => (
            <div
              key={i}
              className="flex items-center gap-2 px-3 py-2 bg-brand-bg/50 rounded-lg border border-brand-border/30"
            >
              <badge.icon className={`w-4 h-4 ${badge.color}`} />
              <span className="text-sm font-medium text-brand-text-dark">{badge.label}</span>
            </div>
          ))}
        </div>
      </Card>

      {/* Member-only: My Stats in this team */}
      {isMember && (
        <Card variant="bordered" padding="lg" className="bg-gradient-to-r from-brand-warning/10 to-transparent border-brand-warning/30">
          <h3 className="font-bold text-brand-text-dark mb-4 flex items-center gap-2">
            <Wallet className="w-5 h-5 text-brand-warning" />
            สถิติของคุณในทีมนี้
          </h3>
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-brand-text-dark">{teamDetails.myStats.jobsCompleted}</p>
              <p className="text-xs text-brand-text-light">งานที่ทำสำเร็จ</p>
            </div>
            <div className="text-center border-x border-brand-border/50">
              <p className="text-2xl font-bold text-brand-success">฿{teamDetails.myStats.earningsFromTeam.toLocaleString()}</p>
              <p className="text-xs text-brand-text-light">รายได้จากทีม</p>
            </div>
            <div className="text-center">
              <p className="text-lg font-bold text-brand-text-dark">{teamDetails.myStats.joinedDate}</p>
              <p className="text-xs text-brand-text-light">เข้าร่วมเมื่อ</p>
            </div>
          </div>
        </Card>
      )}

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card variant="bordered" padding="md" className="text-center">
          <div className="w-12 h-12 rounded-xl bg-brand-primary/10 flex items-center justify-center mx-auto mb-3">
            <Target className="w-6 h-6 text-brand-primary" />
          </div>
          <p className="text-2xl font-bold text-brand-text-dark">{teamDetails.stats.totalJobs.toLocaleString()}</p>
          <p className="text-xs text-brand-text-light">งานที่ทำสำเร็จ</p>
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

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Left Column */}
        <div className="lg:col-span-2 space-y-6">
          {/* Jobs Section - Different for members vs non-members */}
          <Card variant="bordered" padding="lg">
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-bold text-lg text-brand-text-dark flex items-center gap-2">
                <Briefcase className="w-5 h-5 text-brand-primary" />
                {isMember ? "งานที่เปิดรับอยู่" : "ภาพรวมงานในทีม"}
                {isMember && <Badge variant="success">{teamDetails.openJobs.length}</Badge>}
              </h3>
              {isMember && (
                <Link href={`/work/teams/${teamId}/jobs`}>
                  <Button variant="ghost" size="sm" className="text-brand-primary">
                    ดูทั้งหมด <ChevronRight className="w-4 h-4 ml-1" />
                  </Button>
                </Link>
              )}
            </div>
            
            {isMember ? (
              /* Member view: Show actual jobs with pricing */
              <div className="space-y-4">
                {teamDetails.openJobs.map((job) => {
                  const progress = (job.claimed / job.quantity) * 100;
                  const remaining = job.quantity - job.claimed;
                  return (
                    <div key={job.id} className="p-4 bg-brand-bg/50 rounded-xl border border-brand-border/30 hover:border-brand-primary/30 transition-colors">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-lg bg-white shadow-sm flex items-center justify-center border border-brand-border/30">
                            <PlatformIcon platform={job.platform as Platform} className="w-5 h-5" />
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <p className="font-bold text-brand-text-dark">{job.name}</p>
                              {job.urgent && (
                                <Badge variant="error" size="sm" className="animate-pulse">ด่วน</Badge>
                              )}
                            </div>
                            <p className="text-xs text-brand-text-light">เหลือ {remaining} หน่วย</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-brand-success text-lg">฿{job.pricePerUnit}</p>
                          <p className="text-xs text-brand-text-light">/ หน่วย</p>
                        </div>
                      </div>
                      <Progress value={progress} className="h-1.5" />
                    </div>
                  );
                })}
              </div>
            ) : (
              /* Non-member view: Show overview only */
              <>
                <div className="p-4 bg-brand-success/10 rounded-xl border border-brand-success/20 mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-brand-success/20 flex items-center justify-center">
                      <Zap className="w-6 h-6 text-brand-success" />
                    </div>
                    <div>
                      <p className="font-bold text-brand-success">มีงานต่อเนื่อง</p>
                      <p className="text-sm text-brand-text-light">ทีมนี้มีงานให้ทำตลอด ไม่ต้องรองาน</p>
                    </div>
                  </div>
                </div>
                <div className="space-y-3">
                  <p className="text-sm font-medium text-brand-text-light">ประเภทงานที่เปิดรับ:</p>
                  <div className="flex flex-wrap gap-2">
                    {teamDetails.jobTypes.map((type) => (
                      <span
                        key={type}
                        className="px-3 py-2 bg-brand-bg border border-brand-border/50 rounded-lg text-sm font-medium text-brand-text-dark flex items-center gap-2"
                      >
                        <CheckCircle2 className="w-4 h-4 text-brand-success" />
                        {type}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="mt-4 p-3 bg-brand-bg/50 rounded-lg border border-brand-border/30">
                  <p className="text-xs text-brand-text-light flex items-center gap-2">
                    <Eye className="w-4 h-4" />
                    รายละเอียดงานและราคาจะเห็นได้หลังเข้าร่วมทีมแล้ว
                  </p>
                </div>
              </>
            )}
          </Card>

          {/* Reviews */}
          <Card variant="bordered" padding="lg">
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-bold text-lg text-brand-text-dark flex items-center gap-2">
                <ThumbsUp className="w-5 h-5 text-brand-warning" />
                รีวิวจากสมาชิก
              </h3>
              <Badge variant="warning" className="shadow-sm">
                <Star className="w-3 h-3 mr-1 fill-brand-warning" />
                {teamDetails.stats.avgRating}
              </Badge>
            </div>
            <div className="space-y-4">
              {teamDetails.recentReviews.map((review) => (
                <div key={review.id} className="p-4 bg-brand-bg/50 rounded-xl border border-brand-border/30">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-full bg-brand-primary/10 flex items-center justify-center text-brand-primary font-bold">
                      {review.avatar}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <p className="font-bold text-brand-text-dark">{review.author}</p>
                        <span className="text-xs text-brand-text-light">{review.date}</span>
                      </div>
                      <div className="flex items-center gap-1 mb-2">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`w-3.5 h-3.5 ${
                              i < review.rating ? "text-brand-warning fill-brand-warning" : "text-brand-border"
                            }`}
                          />
                        ))}
                      </div>
                      <p className="text-sm text-brand-text-light">{review.comment}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          {/* Platforms */}
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

          {/* Job Types */}
          <Card variant="bordered" padding="lg">
            <h3 className="font-bold text-brand-text-dark mb-4 flex items-center gap-2">
              <Award className="w-5 h-5 text-brand-success" />
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

          {/* CTA Card - Different for members vs non-members */}
          {isMember ? (
            <Card variant="elevated" padding="lg" className="bg-gradient-to-br from-brand-success to-brand-success/80 text-white border-none shadow-xl">
              <h3 className="font-bold text-lg mb-2">พร้อมจองงานแล้ว!</h3>
              <p className="text-white/80 text-sm mb-4">
                ดูงานที่เปิดรับและเริ่มทำงานได้เลย
              </p>
              <Link href={`/work/teams/${teamId}/jobs`}>
                <Button variant="outline" className="w-full border-white/30 text-white hover:bg-white/10">
                  ไปจองงาน
                  <ChevronRight className="w-4 h-4 ml-1" />
                </Button>
              </Link>
            </Card>
          ) : (
            <Card variant="elevated" padding="lg" className="bg-gradient-to-br from-brand-primary to-brand-primary/80 text-white border-none shadow-xl">
              <h3 className="font-bold text-lg mb-2">สนใจเข้าร่วมทีม?</h3>
              <p className="text-white/80 text-sm mb-4">
                สมัครเลยวันนี้ เริ่มทำงานและรับรายได้ได้ทันที!
              </p>
              <Link href={`/hub/post/${post.id}`}>
                <Button variant="outline" className="w-full border-white/30 text-white hover:bg-white/10">
                  สมัครเข้าทีม
                </Button>
              </Link>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
