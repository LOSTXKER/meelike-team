"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { Card, Badge, Button, Avatar, Skeleton } from "@/components/ui";
import { Container, Grid, Section, VStack, HStack } from "@/components/layout";
import { PageHeader, PlatformIcon, StatCard } from "@/components/shared";
import { useHubPosts } from "@/lib/api/hooks";
import { api } from "@/lib/api";
import { getLevelColor } from "@/lib/mock-data/helpers";
import type { Platform } from "@/types";
import {
  ArrowLeft,
  Star,
  Clock,
  Heart,
  Eye,
  Users,
  CheckCircle2,
  MessageCircle,
  Flame,
  Zap,
  ClipboardList,
  Briefcase,
  Search,
  DollarSign,
  Calendar,
  Target,
  Award,
  Shield,
  Send,
  Share2,
  ExternalLink,
} from "lucide-react";

const postTypeConfig: Record<string, { label: string; color: "info" | "success" | "warning"; icon: React.ElementType }> = {
  recruit: { label: "หาลูกทีม", color: "info", icon: Users },
  "find-team": { label: "หาทีม", color: "success", icon: Search },
  outsource: { label: "โยนงาน", color: "warning", icon: Briefcase },
};

export default function HubPostDetailPage() {
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const postId = params.id as string;
  const actionParam = searchParams.get("action");

  const [isApplying, setIsApplying] = useState(false);
  const [hasApplied, setHasApplied] = useState(false);

  const { data: hubPosts, isLoading } = useHubPosts();

  const post = useMemo(() => {
    if (!hubPosts) return null;
    return hubPosts.find((p) => p.id === postId);
  }, [hubPosts, postId]);

  const config = post ? postTypeConfig[post.type] : null;

  const handleApply = async () => {
    setIsApplying(true);
    
    try {
      // Extract teamId from post (would need proper linking in real app)
      // For now, assuming post author for recruit posts maps to a team
      const teamId = post?.author.name || "team-1"; // Temporary workaround
      
      await api.hub.applyToTeam(teamId, undefined, "สนใจเข้าร่วมทีม");
      
      setIsApplying(false);
      setHasApplied(true);
      alert("สมัครเข้าทีมสำเร็จ! รอการตอบรับจากแม่ทีม");
    } catch (error: any) {
      console.error("Error applying:", error);
      alert(error?.message || "เกิดข้อผิดพลาดในการสมัคร");
      setIsApplying(false);
    }
  };

  const handleContact = () => {
    // For now, show alert - in production would open chat
    alert("ระบบแชทกำลังพัฒนา - โปรดติดต่อผ่าน LINE หรือ Facebook");
  };

  const formatPayRate = (payRate: { min: number; max: number; unit: string } | string | undefined) => {
    if (!payRate) return null;
    if (typeof payRate === "string") return payRate;
    return `${payRate.min}-${payRate.max} ${payRate.unit}`;
  };

  if (isLoading) {
    return (
      <div className="space-y-6 animate-fade-in max-w-4xl mx-auto">
        <Skeleton className="h-12 w-48" />
        <Skeleton className="h-64 w-full rounded-xl" />
        <Skeleton className="h-96 w-full rounded-xl" />
      </div>
    );
  }

  if (!post) {
    return (
      <div className="text-center py-20">
        <div className="w-20 h-20 bg-brand-bg rounded-full flex items-center justify-center mx-auto mb-6">
          <Search className="w-10 h-10 text-brand-text-light" />
        </div>
        <h1 className="text-2xl font-bold text-brand-text-dark mb-2">ไม่พบโพสต์นี้</h1>
        <p className="text-brand-text-light mb-6">โพสต์อาจถูกลบหรือหมดอายุแล้ว</p>
        <Link href="/hub">
          <Button>กลับไปตลาดกลาง</Button>
        </Link>
      </div>
    );
  }

  const TypeIcon = config?.icon || Users;

  return (
    <Container size="lg">
      <Section spacing="lg" className="animate-fade-in">
        {/* Header */}
        <HStack gap={4} align="center">
          <button
            onClick={() => router.back()}
            className="p-2.5 hover:bg-white hover:shadow-sm rounded-xl transition-all border border-transparent hover:border-brand-border/50 text-brand-text-light hover:text-brand-primary"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <VStack gap={3} className="flex-1">
            <HStack gap={3} align="center">
              <Badge variant={config?.color || "default"} className="shadow-sm">
                <TypeIcon className="w-3.5 h-3.5 mr-1" />
                {config?.label}
              </Badge>
            {post.isHot && (
              <Badge variant="error" size="sm" className="animate-pulse">
                <Flame className="w-3 h-3 mr-1" /> Hot
              </Badge>
            )}
            {post.isUrgent && (
              <Badge variant="error" size="sm" className="animate-pulse">
                <Zap className="w-3 h-3 mr-1" /> ด่วน
              </Badge>
            )}
            </HStack>
            <h1 className="text-2xl font-bold text-brand-text-dark mt-2">{post.title}</h1>
          </VStack>
        </HStack>

      {/* Main Content */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Left: Post Details */}
        <div className="lg:col-span-2 space-y-6">
          {/* Author Card */}
          <Card variant="elevated" padding="lg" className="border-none shadow-lg">
            <div className="flex items-start gap-4">
              <Link 
                href={post.author.type === "seller" ? `/hub/team/${post.id}` : `/hub/worker/${post.id}`}
                className="relative group"
              >
                <div
                  className={`w-16 h-16 rounded-2xl flex items-center justify-center text-2xl font-bold shadow-sm transition-all group-hover:scale-105 group-hover:shadow-md ${
                    post.author.type === "seller"
                      ? "bg-brand-primary text-white"
                      : "bg-brand-info/20 text-brand-info border border-brand-info/30"
                  }`}
                >
                  {post.author.avatar}
                </div>
                {post.author.verified && (
                  <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-brand-success rounded-full flex items-center justify-center border-2 border-white">
                    <CheckCircle2 className="w-3.5 h-3.5 text-white" />
                  </div>
                )}
              </Link>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <Link 
                    href={post.author.type === "seller" ? `/hub/team/${post.id}` : `/hub/worker/${post.id}`}
                    className="font-bold text-lg text-brand-text-dark hover:text-brand-primary transition-colors"
                  >
                    {post.author.name}
                  </Link>
                  <Badge variant="default" size="sm" className="bg-brand-bg text-brand-text-light">
                    {post.author.type === "seller" ? "แม่ทีม" : "Worker"}
                  </Badge>
                </div>
                <div className="flex flex-wrap items-center gap-3 text-sm">
                  {post.author.rating > 0 && (
                    <span className="flex items-center gap-1 bg-brand-warning/10 text-brand-warning px-2 py-0.5 rounded-lg font-medium">
                      <Star className="w-3.5 h-3.5 fill-current" />
                      {post.author.rating}
                    </span>
                  )}
                  {post.author.memberCount && (
                    <span className="flex items-center gap-1 text-brand-text-light">
                      <Users className="w-3.5 h-3.5" />
                      {post.author.memberCount} สมาชิก
                    </span>
                  )}
                  {post.author.totalPaid && (
                    <span className="flex items-center gap-1 text-brand-success">
                      <DollarSign className="w-3.5 h-3.5" />
                      จ่ายแล้ว ฿{post.author.totalPaid.toLocaleString()}
                    </span>
                  )}
                </div>
              </div>
              {/* View Profile Button */}
              {post.author.type === "seller" && (
                <Link href={`/hub/team/${post.id}`}>
                  <Button variant="outline" size="sm" className="shrink-0">
                    <ExternalLink className="w-4 h-4 mr-1.5" />
                    ดูโปรไฟล์ทีม
                  </Button>
                </Link>
              )}
            </div>
          </Card>

          {/* Description */}
          <Card variant="bordered" padding="lg">
            <h3 className="font-bold text-brand-text-dark mb-4 flex items-center gap-2">
              <ClipboardList className="w-5 h-5 text-brand-primary" />
              รายละเอียด
            </h3>
            <p className="text-brand-text-dark leading-relaxed whitespace-pre-line">
              {post.description}
            </p>
          </Card>

          {/* Platforms */}
          <Card variant="bordered" padding="lg">
            <h3 className="font-bold text-brand-text-dark mb-4 flex items-center gap-2">
              <Target className="w-5 h-5 text-brand-primary" />
              แพลตฟอร์มที่รองรับ
            </h3>
            <div className="flex flex-wrap gap-3">
              {post.platforms.map((platform) => (
                <span
                  key={platform}
                  className="px-4 py-2 bg-brand-bg border border-brand-border/50 rounded-xl text-sm font-medium text-brand-text-dark flex items-center gap-2"
                >
                  <PlatformIcon platform={platform as Platform} className="w-5 h-5" />
                  <span className="capitalize">{platform}</span>
                </span>
              ))}
            </div>
          </Card>

          {/* Recruit Type Specific Info */}
          {post.type === "recruit" && (
            <>
              {/* Requirements */}
              {post.requirements && post.requirements.length > 0 && (
                <Card variant="bordered" padding="lg">
                  <h3 className="font-bold text-brand-text-dark mb-4 flex items-center gap-2">
                    <ClipboardList className="w-5 h-5 text-brand-warning" />
                    คุณสมบัติที่ต้องการ
                  </h3>
                  <ul className="space-y-3">
                    {post.requirements.map((req, i) => (
                      <li key={i} className="flex items-start gap-3">
                        <div className="w-6 h-6 rounded-full bg-brand-warning/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                          <span className="text-xs font-bold text-brand-warning">{i + 1}</span>
                        </div>
                        <span className="text-brand-text-dark">{req}</span>
                      </li>
                    ))}
                  </ul>
                </Card>
              )}

              {/* Benefits */}
              {post.benefits && post.benefits.length > 0 && (
                <Card variant="bordered" padding="lg" className="bg-brand-success/5 border-brand-success/20">
                  <h3 className="font-bold text-brand-text-dark mb-4 flex items-center gap-2">
                    <Award className="w-5 h-5 text-brand-success" />
                    สิ่งที่จะได้รับ
                  </h3>
                  <ul className="space-y-3">
                    {post.benefits.map((benefit, i) => (
                      <li key={i} className="flex items-center gap-3">
                        <CheckCircle2 className="w-5 h-5 text-brand-success flex-shrink-0" />
                        <span className="text-brand-text-dark">{benefit}</span>
                      </li>
                    ))}
                  </ul>
                </Card>
              )}
            </>
          )}

          {/* Find Team Type Specific Info */}
          {post.type === "find-team" && (
            <Card variant="bordered" padding="lg">
              <h3 className="font-bold text-brand-text-dark mb-4 flex items-center gap-2">
                <Award className="w-5 h-5 text-brand-info" />
                ข้อมูล Worker
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-brand-bg rounded-xl">
                  <p className="text-xs text-brand-text-light mb-1">ประสบการณ์</p>
                  <p className="font-bold text-brand-text-dark">{post.experience || "-"}</p>
                </div>
                <div className="p-4 bg-brand-bg rounded-xl">
                  <p className="text-xs text-brand-text-light mb-1">ค่าจ้างที่ต้องการ</p>
                  <p className="font-bold text-brand-success">{post.expectedPay || "-"}</p>
                </div>
                <div className="p-4 bg-brand-bg rounded-xl">
                  <p className="text-xs text-brand-text-light mb-1">งานที่ทำแล้ว</p>
                  <p className="font-bold text-brand-text-dark">{(post.completedJobs || 0).toLocaleString()} งาน</p>
                </div>
                <div className="p-4 bg-brand-bg rounded-xl">
                  <p className="text-xs text-brand-text-light mb-1">เวลาว่าง</p>
                  <p className="font-bold text-brand-text-dark">{post.availability || "-"}</p>
                </div>
              </div>
            </Card>
          )}

          {/* Outsource Type Specific Info */}
          {post.type === "outsource" && (
            <Card variant="bordered" padding="lg">
              <h3 className="font-bold text-brand-text-dark mb-4 flex items-center gap-2">
                <Briefcase className="w-5 h-5 text-brand-warning" />
                รายละเอียดงาน
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-brand-bg rounded-xl">
                  <p className="text-xs text-brand-text-light mb-1">ประเภทงาน</p>
                  <p className="font-bold text-brand-text-dark capitalize">{post.jobType || "-"}</p>
                </div>
                <div className="p-4 bg-brand-bg rounded-xl">
                  <p className="text-xs text-brand-text-light mb-1">จำนวน</p>
                  <p className="font-bold text-brand-text-dark">{(post.quantity || 0).toLocaleString()}</p>
                </div>
                <div className="p-4 bg-brand-bg rounded-xl">
                  <p className="text-xs text-brand-text-light mb-1">งบประมาณ</p>
                  <p className="font-bold text-brand-success">{post.budget || "-"}</p>
                </div>
                <div className="p-4 bg-brand-warning/10 rounded-xl border border-brand-warning/30">
                  <p className="text-xs text-brand-text-light mb-1">กำหนดส่ง</p>
                  <p className="font-bold text-brand-error">{post.deadline || "-"}</p>
                </div>
              </div>
            </Card>
          )}
        </div>

        {/* Right: Sidebar */}
        <div className="space-y-6">
          {/* Action Card */}
          <Card variant="elevated" padding="lg" className="border-none shadow-xl sticky top-6">
            {/* Stats */}
            <div className="flex items-center justify-between text-sm text-brand-text-light mb-6 pb-4 border-b border-brand-border">
              <span className="flex items-center gap-1.5">
                <Eye className="w-4 h-4" />
                {post.views} ดู
              </span>
              <span className="flex items-center gap-1.5">
                <Heart className="w-4 h-4" />
                {post.interested} สนใจ
              </span>
              <span className="flex items-center gap-1.5">
                <Clock className="w-4 h-4" />
                {new Date(post.createdAt).toLocaleDateString("th-TH", {
                  day: "numeric",
                  month: "short",
                })}
              </span>
            </div>

            {/* Pay Rate / Key Info */}
            {post.type === "recruit" && post.payRate && (
              <div className="text-center mb-6 p-4 bg-brand-success/10 rounded-xl border border-brand-success/20">
                <p className="text-sm text-brand-text-light mb-1">อัตราค่าจ้าง</p>
                <p className="text-3xl font-bold text-brand-success">{formatPayRate(post.payRate)}</p>
              </div>
            )}

            {post.type === "recruit" && post.openSlots && (
              <div className="text-center mb-6 p-4 bg-brand-primary/10 rounded-xl border border-brand-primary/20">
                <p className="text-sm text-brand-text-light mb-1">ตำแหน่งที่เปิดรับ</p>
                <p className="text-3xl font-bold text-brand-primary">
                  {post.openSlots} <span className="text-lg">คน</span>
                </p>
                {post.applicants !== undefined && (
                  <p className="text-xs text-brand-text-light mt-1">สมัครแล้ว {post.applicants} คน</p>
                )}
              </div>
            )}

            {/* Action Buttons */}
            <div className="space-y-3">
              {post.type === "recruit" && (
                <Button
                  className="w-full shadow-lg shadow-brand-primary/20"
                  size="lg"
                  onClick={handleApply}
                  disabled={isApplying || hasApplied}
                >
                  {isApplying ? (
                    <span className="flex items-center gap-2">
                      <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      กำลังสมัคร...
                    </span>
                  ) : hasApplied ? (
                    <span className="flex items-center gap-2">
                      <CheckCircle2 className="w-5 h-5" />
                      สมัครแล้ว
                    </span>
                  ) : (
                    <span className="flex items-center gap-2">
                      <Send className="w-5 h-5" />
                      สมัครเข้าทีม
                    </span>
                  )}
                </Button>
              )}

              {post.type === "find-team" && (
                <Button
                  className="w-full shadow-lg shadow-brand-primary/20"
                  size="lg"
                  onClick={handleContact}
                >
                  <MessageCircle className="w-5 h-5 mr-2" />
                  รับเข้าทีม
                </Button>
              )}

              {post.type === "outsource" && (
                <Button
                  className="w-full shadow-lg shadow-brand-primary/20"
                  size="lg"
                  onClick={handleContact}
                >
                  <Briefcase className="w-5 h-5 mr-2" />
                  จองงานนี้
                </Button>
              )}

              <Button variant="outline" className="w-full" onClick={handleContact}>
                <MessageCircle className="w-4 h-4 mr-2" />
                ส่งข้อความ
              </Button>

              <Button variant="ghost" className="w-full text-brand-text-light">
                <Share2 className="w-4 h-4 mr-2" />
                แชร์โพสต์
              </Button>
            </div>

            {/* Trust Badges */}
            {post.author.verified && (
              <div className="mt-6 pt-4 border-t border-brand-border">
                <div className="flex items-center gap-2 text-sm text-brand-success">
                  <Shield className="w-4 h-4" />
                  <span>ยืนยันตัวตนแล้ว</span>
                </div>
              </div>
            )}
          </Card>
        </div>
        </div>
      </Section>
    </Container>
  );
}
