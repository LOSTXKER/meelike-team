"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { Card, Button, Badge, Avatar, Skeleton, Progress } from "@/components/ui";
import { InviteTeamModal, getTeamStats, Breadcrumb, ContentGuidelines } from "@/components/shared";
import { getLevelInfo, formatCurrency } from "@/lib/utils";
import { useSellerTeams, useTeamMembersWithWorkers, usePendingJobClaims, useTeamPayouts } from "@/lib/api/hooks";
import { 
  Users, 
  UserPlus, 
  Star,
  CheckCircle,
  ClipboardList,
  DollarSign,
  ChevronRight,
  ShieldCheck,
  Settings,
  Building2,
  TrendingUp,
  Calendar,
  Activity,
  Crown,
  Briefcase,
  Plus,
  Globe,
  Copy,
  ExternalLink,
} from "lucide-react";

export default function TeamDetailPage() {
  const router = useRouter();
  const params = useParams();
  const teamId = params.id as string;
  
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);

  // Use API hooks
  const { data: teams, isLoading: isLoadingTeams } = useSellerTeams();
  const { data: membersWithWorkers, isLoading: isLoadingMembers } = useTeamMembersWithWorkers(teamId);
  const { data: pendingClaims } = usePendingJobClaims();
  const { data: payouts } = useTeamPayouts();

  const isLoading = isLoadingTeams || isLoadingMembers;

  // Calculate real stats
  const pendingReviewCount = pendingClaims?.length || 0;
  const pendingPayoutAmount = payouts?.filter(p => p.status === "pending").reduce((sum, p) => sum + p.amount, 0) || 0;

  // Find current team
  const team = useMemo(() => {
    return teams?.find((t) => t.id === teamId);
  }, [teams, teamId]);

  // Top 3 workers by jobs completed
  const topWorkers = useMemo(() => {
    if (!membersWithWorkers) return [];
    return [...membersWithWorkers]
      .sort((a, b) => b.jobsCompleted - a.jobsCompleted)
      .slice(0, 3);
  }, [membersWithWorkers]);


  if (isLoading) {
    return (
      <div className="space-y-6 animate-fade-in">
        <div className="flex justify-end">
          <Skeleton className="h-10 w-32 rounded-xl" />
        </div>
        <div className="grid grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-24 rounded-xl" />
          ))}
        </div>
        <div className="grid grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-20 rounded-xl" />
          ))}
        </div>
        <div className="grid lg:grid-cols-2 gap-6">
          <Skeleton className="h-64 rounded-xl" />
          <Skeleton className="h-64 rounded-xl" />
        </div>
      </div>
    );
  }

  if (!team) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <Building2 className="w-16 h-16 text-brand-text-light mb-4" />
        <h2 className="text-xl font-bold text-brand-text-dark mb-2">ไม่พบทีมนี้</h2>
        <p className="text-brand-text-light mb-6">ทีมที่คุณกำลังมองหาอาจถูกลบหรือไม่มีอยู่</p>
        <Link href="/seller/team">
          <Button>กลับหน้าภาพรวมทีม</Button>
        </Link>
      </div>
    );
  }

  // Calculate completion percentage
  const completionRate = team.totalJobsCompleted > 0 
    ? Math.round((team.totalJobsCompleted / (team.totalJobsCompleted + team.activeJobCount)) * 100) 
    : 0;

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Breadcrumb */}
      <Breadcrumb />

      {/* ============================================ */}
      {/* TEAM HEADER CARD WITH COVER */}
      {/* ============================================ */}
      <Card className="border-none shadow-lg overflow-hidden">
        {/* Cover Banner */}
        <div className="h-28 sm:h-36 bg-gradient-to-br from-brand-primary via-brand-accent to-amber-400 relative">
          {/* Pattern Overlay */}
          <div className="absolute inset-0 opacity-20">
            <div className="absolute inset-0" style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            }} />
          </div>
          
          {/* Decorative Elements */}
          <div className="absolute top-4 right-4 w-20 h-20 bg-white/10 rounded-full blur-2xl" />
          <div className="absolute bottom-4 left-10 w-32 h-32 bg-white/10 rounded-full blur-3xl" />
          
          {/* Actions on Cover */}
          <div className="absolute top-4 right-4 flex gap-2">
            <Button 
              size="sm"
              className="bg-white/90 hover:bg-white text-brand-text-dark shadow-lg"
              onClick={() => setIsInviteModalOpen(true)}
              leftIcon={<UserPlus className="w-4 h-4" />}
            >
              เชิญสมาชิก
            </Button>
            <Link href={`/seller/team/${teamId}/settings`}>
              <Button size="sm" className="bg-white/90 hover:bg-white text-brand-text-dark shadow-lg" leftIcon={<Settings className="w-4 h-4" />}>
                ตั้งค่า
              </Button>
            </Link>
          </div>
        </div>
        
        {/* Team Info Section - ไม่ทับ Cover */}
        <div className="p-5 bg-white">
          <div className="flex flex-col sm:flex-row gap-4">
            {/* Avatar */}
            <div className="w-16 h-16 bg-gradient-to-br from-brand-primary to-brand-accent rounded-xl shadow-md flex items-center justify-center text-2xl font-bold text-white shrink-0">
              {team.name.charAt(0)}
            </div>
            
            {/* Info */}
            <div className="flex-1 min-w-0">
              {/* Title Row */}
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-xl font-bold text-brand-text-dark">{team.name}</h1>
                <Badge variant={team.isPublic ? "info" : "default"} size="sm">
                  {team.isPublic ? <><Globe className="w-3 h-3 mr-1" /> สาธารณะ</> : "ส่วนตัว"}
                </Badge>
                {team.isRecruiting && (
                  <Badge variant="success" size="sm">🔥 รับสมัคร</Badge>
                )}
              </div>
              
              {/* Description */}
              <p className="text-sm text-brand-text-light mt-1">
                {team.description || "ทีมงานคุณภาพ พร้อมรับงานตลอด 24 ชม."}
              </p>
              
              {/* Meta Info */}
              <div className="mt-2 flex flex-wrap items-center gap-4 text-sm">
                <div className="flex items-center gap-1.5 text-brand-text-light">
                  <Users className="w-4 h-4" />
                  <span><strong className="text-brand-text-dark">{team.memberCount}</strong> สมาชิก</span>
                </div>
                <div className="flex items-center gap-1.5 text-brand-text-light">
                  <Star className="w-4 h-4 text-amber-500" />
                  <span><strong className="text-brand-text-dark">{team.rating.toFixed(1)}</strong> ({team.ratingCount} รีวิว)</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="text-brand-text-light">รหัสเชิญ:</span>
                  <code className="px-2 py-0.5 bg-brand-bg rounded text-xs font-mono text-brand-primary font-medium">
                    {team.inviteCode}
                  </code>
                  <button 
                    onClick={() => navigator.clipboard.writeText(team.inviteCode)}
                    className="p-1 hover:bg-brand-bg rounded text-brand-text-light hover:text-brand-primary transition-colors"
                    title="คัดลอก"
                  >
                    <Copy className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* ============================================ */}
      {/* STATS ROW */}
      {/* ============================================ */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-4 border-none shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center">
              <Users className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-brand-text-dark">{team.memberCount}</p>
              <p className="text-xs text-brand-text-light">สมาชิก</p>
            </div>
          </div>
        </Card>
        
        <Card className="p-4 border-none shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center">
              <CheckCircle className="w-5 h-5 text-emerald-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-brand-text-dark">{team.totalJobsCompleted}</p>
              <p className="text-xs text-brand-text-light">งานสำเร็จ</p>
            </div>
          </div>
        </Card>
        
        <Card className="p-4 border-none shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center">
              <Star className="w-5 h-5 text-amber-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-brand-text-dark">{team.rating.toFixed(1)}</p>
              <p className="text-xs text-brand-text-light">คะแนน ({team.ratingCount} รีวิว)</p>
            </div>
          </div>
        </Card>
        
        <Card className="p-4 border-none shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-purple-100 flex items-center justify-center">
              <Briefcase className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-brand-text-dark">{team.activeJobCount}</p>
              <p className="text-xs text-brand-text-light">งานกำลังทำ</p>
            </div>
          </div>
        </Card>
      </div>

      {/* ============================================ */}
      {/* MAIN CONTENT: Two Columns */}
      {/* ============================================ */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Left: Top Workers (2 cols) */}
        <Card className="lg:col-span-2 p-5 border-none shadow-md">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-amber-100 flex items-center justify-center">
                <Crown className="w-4 h-4 text-amber-600" />
              </div>
              <h3 className="font-bold text-brand-text-dark">Top Workers</h3>
            </div>
            <Link href={`/seller/team/${teamId}/members`}>
              <Button variant="ghost" size="sm" className="text-brand-primary text-xs">
                ดูทั้งหมด
                <ChevronRight className="w-3 h-3 ml-1" />
              </Button>
            </Link>
          </div>
          
          {topWorkers.length === 0 ? (
            <div className="text-center py-10 text-brand-text-light">
              <Users className="w-12 h-12 mx-auto mb-3 opacity-30" />
              <p>ยังไม่มีสมาชิกในทีม</p>
              <Button 
                variant="outline" 
                size="sm" 
                className="mt-4"
                onClick={() => setIsInviteModalOpen(true)}
              >
                <UserPlus className="w-4 h-4 mr-2" />
                เชิญสมาชิกคนแรก
              </Button>
            </div>
          ) : (
            <div className="space-y-3">
              {topWorkers.map((member, index) => {
                const levelInfo = getLevelInfo(member.worker?.level || "bronze");
                const medals = ["🥇", "🥈", "🥉"];
                return (
                  <div
                    key={member.id}
                    className="flex items-center gap-3 p-3 rounded-xl bg-brand-bg/50 hover:bg-brand-bg transition-colors"
                  >
                    <span className="text-xl w-8 text-center">{medals[index]}</span>
                    <Avatar
                      src={member.worker?.avatar}
                      fallback={member.worker?.displayName}
                      size="md"
                      className="border-2 border-white shadow-sm"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="font-bold text-brand-text-dark truncate">
                        @{member.worker?.displayName}
                      </p>
                      <div className="flex items-center gap-2 text-xs text-brand-text-light">
                        <span className={`${levelInfo.color} font-medium`}>{levelInfo.name}</span>
                        <span className="w-1 h-1 bg-brand-border rounded-full" />
                        <span className="flex items-center gap-0.5">
                          <Star className="w-3 h-3 text-brand-warning fill-brand-warning" />
                          {member.rating.toFixed(1)}
                        </span>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-brand-text-dark">{member.jobsCompleted}</p>
                      <p className="text-xs text-brand-text-light">งานเสร็จ</p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </Card>

        {/* Right: Team Performance + Quick Add */}
        <div className="space-y-4">
          {/* Performance */}
          <Card className="p-5 border-none shadow-md">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-emerald-100 flex items-center justify-center">
                <TrendingUp className="w-4 h-4 text-emerald-600" />
              </div>
              <h3 className="font-bold text-brand-text-dark">ผลงานทีม</h3>
            </div>
            
            <div className="space-y-4">
              {/* Completion Rate */}
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-brand-text-light">อัตราความสำเร็จ</span>
                  <span className="font-bold text-brand-text-dark">{completionRate}%</span>
                </div>
                <Progress value={completionRate} className="h-2" />
              </div>
              
              {/* Rating */}
              <div className="flex items-center justify-between py-2 border-t border-brand-border/30">
                <span className="text-sm text-brand-text-light">Rating เฉลี่ย</span>
                <div className="flex items-center gap-1">
                  <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
                  <span className="font-bold text-brand-text-dark">{team.rating.toFixed(1)}</span>
                </div>
              </div>
              
              {/* Total Jobs */}
              <div className="flex items-center justify-between py-2 border-t border-brand-border/30">
                <span className="text-sm text-brand-text-light">งานทั้งหมด</span>
                <span className="font-bold text-brand-text-dark">{team.totalJobsCompleted + team.activeJobCount}</span>
              </div>
            </div>
          </Card>

          {/* Quick Actions */}
          <Card className="p-5 border-none shadow-md">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center">
                <Activity className="w-4 h-4 text-blue-600" />
              </div>
              <h3 className="font-bold text-brand-text-dark">ทางลัด</h3>
            </div>
            
            <div className="space-y-2">
              <Link href={`/seller/team/${teamId}/jobs/new`} className="block">
                <Button variant="outline" className="w-full justify-start" leftIcon={<Plus className="w-4 h-4" />}>
                  สร้างงานใหม่
                </Button>
              </Link>
              <Button 
                variant="outline" 
                className="w-full justify-start" 
                leftIcon={<UserPlus className="w-4 h-4" />}
                onClick={() => setIsInviteModalOpen(true)}
              >
                เชิญสมาชิก
              </Button>
            </div>
          </Card>

          {/* Content Guidelines Reminder */}
          <ContentGuidelines variant="card" showPenalties={false} />
        </div>
      </div>

      {/* Invite Modal */}
      <InviteTeamModal
        isOpen={isInviteModalOpen}
        onClose={() => setIsInviteModalOpen(false)}
        team={team}
      />
    </div>
  );
}
