"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { Card, Button, Badge, Avatar, Input, Modal, Skeleton } from "@/components/ui";
import { PageHeader, StatsGrid } from "@/components/shared";
import { formatCurrency, getLevelInfo } from "@/lib/utils";
import { useSellerTeams, useSellerTeamMembers, useWorkers } from "@/lib/api/hooks";
import { 
  Users, 
  UserPlus, 
  Search, 
  Copy, 
  QrCode,
  Star,
  CheckCircle,
  MoreVertical,
  RefreshCw,
  ClipboardList,
  DollarSign,
  ChevronRight,
  ShieldCheck,
  UserCheck,
  UserX,
  Clock,
  LayoutGrid,
  ArrowLeft,
  Settings,
  Eye,
  EyeOff,
  Building2,
} from "lucide-react";

type MemberStatus = "all" | "active" | "inactive" | "pending";

export default function TeamDetailPage() {
  const params = useParams();
  const teamId = params.id as string;
  
  const [filter, setFilter] = useState<MemberStatus>("all");
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  // Use API hooks
  const { data: teams, isLoading: isLoadingTeams } = useSellerTeams();
  const { data: allMembers, isLoading: isLoadingMembers } = useSellerTeamMembers(teamId);
  const { data: workers, isLoading: isLoadingWorkers } = useWorkers();

  const isLoading = isLoadingTeams || isLoadingMembers || isLoadingWorkers;

  // Find current team
  const team = useMemo(() => {
    return teams?.find((t) => t.id === teamId);
  }, [teams, teamId]);

  // Members of this team
  const members = useMemo(() => {
    if (!allMembers) return [];
    return allMembers.filter((m) => m.teamId === teamId);
  }, [allMembers, teamId]);

  const getMemberWithWorker = (member: NonNullable<typeof members>[0]) => {
    const worker = workers?.find((w) => w.id === member.workerId);
    return { ...member, worker };
  };

  const filteredMembers = useMemo(() => {
    if (!members) return [];
    return members
      .map(getMemberWithWorker)
      .filter((member) => {
        if (filter !== "all" && member.status !== filter) return false;
        if (searchQuery && member.worker) {
          return member.worker.displayName
            .toLowerCase()
            .includes(searchQuery.toLowerCase());
        }
        return true;
      });
  }, [members, workers, filter, searchQuery]);

  const memberCounts = useMemo(() => ({
    all: members?.length || 0,
    active: members?.filter((m) => m.status === "active").length || 0,
    inactive: members?.filter((m) => m.status === "inactive").length || 0,
    pending: members?.filter((m) => m.status === "pending").length || 0,
  }), [members]);

  const copyInviteLink = () => {
    if (team) {
      navigator.clipboard.writeText(
        `https://seller.meelike.com/work/teams/join?code=${team.inviteCode}`
      );
      alert("คัดลอกลิงก์เรียบร้อยแล้ว!");
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-8 animate-fade-in max-w-7xl mx-auto">
        <Skeleton className="h-20 w-full rounded-xl" />
        <div className="grid grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-24 rounded-xl" />
          ))}
        </div>
        <Skeleton className="h-96 rounded-xl" />
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
    <div className="space-y-8 animate-fade-in max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Link href="/seller/team">
            <button className="p-2.5 hover:bg-white hover:shadow-sm rounded-xl transition-all border border-transparent hover:border-brand-border/50 text-brand-text-light hover:text-brand-primary">
              <ArrowLeft className="w-5 h-5" />
            </button>
          </Link>
          
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-brand-primary to-brand-primary/70 flex items-center justify-center text-white text-xl font-bold shadow-lg shadow-brand-primary/30">
              {team.name.charAt(0)}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-bold text-brand-text-dark">{team.name}</h1>
                {team.isPublic ? (
                  <Badge variant="success" size="sm" className="gap-1">
                    <Eye className="w-3 h-3" /> เปิดรับสมาชิก
                  </Badge>
                ) : (
                  <Badge variant="secondary" size="sm" className="gap-1">
                    <EyeOff className="w-3 h-3" /> เชิญเท่านั้น
                  </Badge>
                )}
              </div>
              <p className="text-brand-text-light">{team.description}</p>
            </div>
          </div>
        </div>
        
        <div className="flex gap-2">
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
      </div>

      {/* Stats Cards */}
      <StatsGrid
        stats={[
          {
            label: "สมาชิกทั้งหมด",
            value: team.memberCount,
            icon: Users,
            iconColor: "text-brand-primary",
            iconBgColor: "bg-brand-primary/10",
          },
          {
            label: "งานเปิดอยู่",
            value: team.activeJobCount,
            icon: ClipboardList,
            iconColor: "text-brand-primary",
            iconBgColor: "bg-brand-secondary",
          },
          {
            label: "งานสำเร็จ",
            value: team.totalJobsCompleted.toLocaleString(),
            icon: CheckCircle,
            iconColor: "text-[#1E8E3E]",
            iconBgColor: "bg-[#E6F4EA]",
          },
          {
            label: "Rating",
            value: team.rating.toFixed(1),
            icon: Star,
            iconColor: "text-brand-warning",
            iconBgColor: "bg-brand-warning/10",
          },
        ]}
        columns={4}
      />

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

      {/* Filter & Search */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 bg-white p-4 rounded-2xl shadow-sm border border-brand-border/50">
        <div className="w-full lg:w-auto overflow-x-auto no-scrollbar">
          <div className="flex gap-1 p-1.5 bg-brand-bg/50 rounded-xl border border-brand-border/30 min-w-max">
            {[
              { value: "all", label: "ทั้งหมด", icon: LayoutGrid },
              { value: "active", label: "Active", icon: UserCheck },
              { value: "inactive", label: "ไม่ Active", icon: UserX },
              { value: "pending", label: "รอยืนยัน", icon: Clock },
            ].map((item) => (
              <button
                key={item.value}
                onClick={() => setFilter(item.value as MemberStatus)}
                className={`flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 whitespace-nowrap ${
                  filter === item.value
                    ? "bg-white text-brand-text-dark shadow-sm ring-1 ring-black/5"
                    : "text-brand-text-light hover:text-brand-text-dark opacity-70 hover:opacity-100"
                }`}
              >
                <item.icon className={`w-4 h-4 ${filter === item.value ? "text-brand-primary" : ""}`} />
                <span>{item.label} ({memberCounts[item.value as keyof typeof memberCounts]})</span>
              </button>
            ))}
          </div>
        </div>
        <div className="w-full lg:w-auto lg:min-w-[280px]">
          <Input
            placeholder="ค้นหาสมาชิก..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full border-brand-border/50 bg-brand-bg/50 focus:bg-white !py-2.5 !rounded-xl"
            leftIcon={<Search className="w-4 h-4 text-brand-text-light" />}
          />
        </div>
      </div>

      {/* Members List */}
      <div className="bg-white rounded-2xl shadow-sm border border-brand-border/50 overflow-hidden">
        <div className="p-4 border-b border-brand-border/50">
          <h3 className="font-bold text-brand-text-dark">สมาชิกในทีม</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-brand-bg/50 border-b border-brand-border/50 text-xs text-brand-text-light uppercase tracking-wider">
                <th className="p-4 pl-6 font-medium">สมาชิก</th>
                <th className="p-4 font-medium">Level</th>
                <th className="p-4 font-medium text-center">งานสำเร็จ</th>
                <th className="p-4 font-medium text-center">Rating</th>
                <th className="p-4 font-medium text-right">รายได้</th>
                <th className="p-4 font-medium text-center">สถานะ</th>
                <th className="p-4 font-medium text-right">จัดการ</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-brand-border/30">
              {filteredMembers.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-brand-text-light">
                    ไม่พบสมาชิกในทีมนี้
                  </td>
                </tr>
              ) : (
                filteredMembers.map((member) => {
                  const levelInfo = getLevelInfo(member.worker?.level || "bronze");
                  return (
                    <tr key={member.id} className="group hover:bg-brand-primary/5 transition-colors">
                      <td className="p-4 pl-6">
                        <div className="flex items-center gap-3">
                          <Avatar
                            src={member.worker?.avatar}
                            fallback={member.worker?.displayName}
                            size="md"
                            className="border-2 border-white shadow-sm"
                          />
                          <div>
                            <p className="font-bold text-brand-text-dark group-hover:text-brand-primary transition-colors">
                              @{member.worker?.displayName}
                            </p>
                            <p className="text-xs text-brand-text-light flex items-center gap-1 mt-0.5">
                              <Clock className="w-3 h-3" />
                              เข้าร่วม {new Date(member.joinedAt).toLocaleDateString("th-TH")}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="p-4">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${levelInfo.color.replace('text-', 'bg-').replace('500', '100')} ${levelInfo.color} border-current opacity-80`}>
                          {levelInfo.name}
                        </span>
                      </td>
                      <td className="p-4 text-center">
                        <span className="font-medium text-brand-text-dark">
                          {member.jobsCompleted}
                        </span>
                      </td>
                      <td className="p-4 text-center">
                        <div className="flex items-center justify-center gap-1">
                          <Star className="w-4 h-4 text-brand-warning fill-brand-warning" />
                          <span className="font-bold text-brand-text-dark">
                            {member.rating.toFixed(1)}
                          </span>
                          <span className="text-xs text-brand-text-light">
                            ({member.ratingCount})
                          </span>
                        </div>
                      </td>
                      <td className="p-4 text-right">
                        <span className="font-bold text-brand-success">
                          {formatCurrency(member.totalEarned)}
                        </span>
                      </td>
                      <td className="p-4 text-center">
                        <Badge
                          variant={
                            member.status === "active"
                              ? "success"
                              : member.status === "inactive"
                              ? "warning"
                              : member.status === "banned"
                              ? "error"
                              : "info"
                          }
                          size="sm"
                          className="shadow-sm"
                        >
                          {member.status === "active"
                            ? "Active"
                            : member.status === "inactive"
                            ? "ไม่ Active"
                            : member.status === "banned"
                            ? "แบน"
                            : "รอยืนยัน"}
                        </Badge>
                      </td>
                      <td className="p-4 text-right">
                        <Button size="sm" variant="ghost" className="text-brand-text-light hover:text-brand-primary">
                          <MoreVertical className="w-4 h-4" />
                        </Button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Invite Modal */}
      <Modal
        isOpen={isInviteModalOpen}
        onClose={() => setIsInviteModalOpen(false)}
        title={`➕ เชิญสมาชิกเข้าทีม ${team.name}`}
        size="md"
      >
        <div className="space-y-6">
          {/* Invite Link */}
          <div>
            <label className="block text-sm font-bold text-brand-text-dark mb-2">
              🔗 Link เชิญ
            </label>
            <div className="flex gap-2">
              <Input
                value={`seller.meelike.com/work/teams/join?code=${team.inviteCode}`}
                readOnly
                className="flex-1 bg-brand-bg/50"
              />
              <Button variant="outline" onClick={copyInviteLink}>
                <Copy className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Invite Code */}
          <div>
            <label className="block text-sm font-bold text-brand-text-dark mb-2">
              🔑 รหัสเชิญ
            </label>
            <div className="flex gap-2">
              <Input value={team.inviteCode} readOnly className="flex-1 bg-brand-bg/50 font-mono text-center tracking-widest text-lg" />
              <Button variant="outline">
                <RefreshCw className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* QR Code */}
          <div className="text-center">
            <label className="block text-sm font-bold text-brand-text-dark mb-2">
              QR Code
            </label>
            <div className="inline-block p-6 bg-white rounded-2xl border border-brand-border shadow-sm">
              <div className="w-32 h-32 bg-brand-text-dark flex items-center justify-center rounded-lg">
                <QrCode className="w-20 h-20 text-white" />
              </div>
            </div>
          </div>

          {/* Settings */}
          <div className="space-y-3 p-5 rounded-2xl bg-brand-bg/30 border border-brand-border/50">
            <label className="flex items-center gap-3 cursor-pointer group">
              <div className="relative flex items-center">
                <input
                  type="checkbox"
                  defaultChecked={team.requireApproval}
                  className="peer h-5 w-5 cursor-pointer appearance-none rounded-md border border-brand-border transition-all checked:border-brand-primary checked:bg-brand-primary hover:border-brand-primary/50"
                />
                <CheckCircle className="pointer-events-none absolute left-1/2 top-1/2 h-3.5 w-3.5 -translate-x-1/2 -translate-y-1/2 text-white opacity-0 transition-opacity peer-checked:opacity-100" />
              </div>
              <span className="text-sm font-medium text-brand-text-dark group-hover:text-brand-primary transition-colors">
                ต้องอนุมัติก่อนเข้าทีม
              </span>
            </label>
            <label className="flex items-center gap-3 cursor-pointer group">
              <div className="relative flex items-center">
                <input
                  type="checkbox"
                  defaultChecked={team.isRecruiting}
                  className="peer h-5 w-5 cursor-pointer appearance-none rounded-md border border-brand-border transition-all checked:border-brand-primary checked:bg-brand-primary hover:border-brand-primary/50"
                />
                <CheckCircle className="pointer-events-none absolute left-1/2 top-1/2 h-3.5 w-3.5 -translate-x-1/2 -translate-y-1/2 text-white opacity-0 transition-opacity peer-checked:opacity-100" />
              </div>
              <span className="text-sm font-medium text-brand-text-dark group-hover:text-brand-primary transition-colors">
                แสดงในหน้าค้นหาทีม
              </span>
            </label>
          </div>
        </div>
      </Modal>
    </div>
  );
}
