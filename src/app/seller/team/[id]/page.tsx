"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { Card, Button, Badge, Avatar, Skeleton } from "@/components/ui";
import { StatsGrid, InviteTeamModal, getTeamStats } from "@/components/shared";
import { getLevelInfo } from "@/lib/utils";
import { useSellerTeams, useTeamMembersWithWorkers } from "@/lib/api/hooks";
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
} from "lucide-react";

export default function TeamDetailPage() {
  const params = useParams();
  const teamId = params.id as string;
  
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);

  // Use API hooks
  const { data: teams, isLoading: isLoadingTeams } = useSellerTeams();
  const { data: membersWithWorkers, isLoading: isLoadingMembers } = useTeamMembersWithWorkers(teamId);

  const isLoading = isLoadingTeams || isLoadingMembers;

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

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Action Buttons */}
      <div className="flex justify-end gap-2">
        <Button 
          variant="outline" 
          onClick={() => setIsInviteModalOpen(true)}
          leftIcon={<UserPlus className="w-4 h-4" />}
        >
          เชิญสมาชิก
        </Button>
        <Link href={`/seller/team/${teamId}/settings`}>
          <Button variant="ghost" leftIcon={<Settings className="w-4 h-4" />}>
            ตั้งค่า
          </Button>
        </Link>
      </div>

      {/* Stats Cards */}
      <StatsGrid stats={getTeamStats(team)} columns={4} />

      {/* Quick Actions */}
      <div className="grid sm:grid-cols-4 gap-4">
        <Link href={`/seller/team/${teamId}/jobs`}>
          <Card variant="elevated" className="h-full border-none shadow-md hover:shadow-xl transition-all cursor-pointer group">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-brand-primary/10 text-brand-primary group-hover:bg-brand-primary group-hover:text-white transition-colors">
                  <ClipboardList className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-brand-text-dark group-hover:text-brand-primary transition-colors">งานทั้งหมด</h3>
                  <p className="text-xs text-brand-text-light">{team.activeJobCount} งานเปิดอยู่</p>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-brand-text-light group-hover:text-brand-primary transition-colors" />
            </div>
          </Card>
        </Link>
        <Link href={`/seller/team/${teamId}/review`}>
          <Card variant="elevated" className="h-full border-none shadow-md hover:shadow-xl transition-all cursor-pointer group">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-brand-warning/10 text-brand-warning group-hover:bg-brand-warning group-hover:text-white transition-colors">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-brand-text-dark group-hover:text-brand-primary transition-colors">รอตรวจสอบ</h3>
                  <p className="text-xs text-brand-text-light">5 งานรอตรวจ</p>
                </div>
              </div>
              <Badge variant="error" size="sm">5</Badge>
            </div>
          </Card>
        </Link>
        <Link href={`/seller/team/${teamId}/payouts`}>
          <Card variant="elevated" className="h-full border-none shadow-md hover:shadow-xl transition-all cursor-pointer group">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-brand-success/10 text-brand-success group-hover:bg-brand-success group-hover:text-white transition-colors">
                  <DollarSign className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-brand-text-dark group-hover:text-brand-primary transition-colors">จ่ายเงินลูกทีม</h3>
                  <p className="text-xs text-brand-text-light">รออนุมัติ ฿2,450</p>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-brand-text-light group-hover:text-brand-primary transition-colors" />
            </div>
          </Card>
        </Link>
        <Link href={`/seller/team/${teamId}/jobs/new`}>
          <Card variant="elevated" className="h-full border-none shadow-md hover:shadow-xl transition-all cursor-pointer group border-2 border-dashed border-brand-border/50 hover:border-brand-primary/50">
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <div className="p-2.5 rounded-xl bg-brand-bg text-brand-text-light group-hover:bg-brand-primary/10 group-hover:text-brand-primary transition-colors mx-auto w-fit">
                  <ClipboardList className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-brand-text-light group-hover:text-brand-primary transition-colors mt-2">+ สร้างงานใหม่</h3>
              </div>
            </div>
          </Card>
        </Link>
      </div>

      {/* Two Column Layout: Top Workers + Recent Activity */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Top Workers */}
        <Card variant="elevated" className="border-none shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Crown className="w-5 h-5 text-brand-warning" />
              <h3 className="font-bold text-brand-text-dark">Top Workers</h3>
            </div>
            <Link href={`/seller/team/${teamId}/members`}>
              <Button variant="ghost" size="sm" className="text-brand-primary">
                ดูทั้งหมด
                <ChevronRight className="w-4 h-4 ml-1" />
              </Button>
            </Link>
          </div>
          
          {topWorkers.length === 0 ? (
            <div className="text-center py-8 text-brand-text-light">
              <Users className="w-12 h-12 mx-auto mb-3 opacity-30" />
              <p>ยังไม่มีสมาชิกในทีม</p>
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

        {/* Recent Activity */}
        <Card variant="elevated" className="border-none shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Activity className="w-5 h-5 text-brand-info" />
              <h3 className="font-bold text-brand-text-dark">กิจกรรมล่าสุด</h3>
            </div>
          </div>
          
          <div className="space-y-3">
            {[
              { icon: CheckCircle, color: "text-brand-success", bg: "bg-brand-success/10", text: "@นุ่น ทำงาน Facebook Like เสร็จ 50 ยอด", time: "5 นาทีที่แล้ว" },
              { icon: UserPlus, color: "text-brand-info", bg: "bg-brand-info/10", text: "@ใหม่ เข้าร่วมทีม", time: "1 ชั่วโมงที่แล้ว" },
              { icon: DollarSign, color: "text-brand-success", bg: "bg-brand-success/10", text: "จ่ายเงิน ฿450 ให้ @มินท์", time: "2 ชั่วโมงที่แล้ว" },
              { icon: ClipboardList, color: "text-brand-primary", bg: "bg-brand-primary/10", text: "สร้างงานใหม่: Instagram Followers", time: "3 ชั่วโมงที่แล้ว" },
              { icon: TrendingUp, color: "text-brand-warning", bg: "bg-brand-warning/10", text: "@เบส เลื่อนระดับเป็น Silver", time: "1 วันที่แล้ว" },
            ].map((activity, index) => (
              <div
                key={index}
                className="flex items-start gap-3 p-3 rounded-xl hover:bg-brand-bg/50 transition-colors"
              >
                <div className={`p-2 rounded-lg ${activity.bg} ${activity.color} shrink-0`}>
                  <activity.icon className="w-4 h-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-brand-text-dark">{activity.text}</p>
                  <p className="text-xs text-brand-text-light flex items-center gap-1 mt-0.5">
                    <Calendar className="w-3 h-3" />
                    {activity.time}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </Card>
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
