"use client";

import { useState } from "react";
import Link from "next/link";
import { Card, Button, Badge, Avatar, Input, Modal } from "@/components/ui";
import { PageHeader } from "@/components/shared";
import { formatCurrency, getLevelInfo } from "@/lib/utils";
import { mockTeam, mockTeamMembers, mockWorkers } from "@/lib/mock-data";
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
  LayoutGrid
} from "lucide-react";

type MemberStatus = "all" | "active" | "inactive" | "pending";

export default function TeamPage() {
  const [team] = useState(mockTeam);
  const [members] = useState(mockTeamMembers);
  const [filter, setFilter] = useState<MemberStatus>("all");
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const getMemberWithWorker = (member: typeof members[0]) => {
    const worker = mockWorkers.find((w) => w.id === member.workerId);
    return { ...member, worker };
  };

  const filteredMembers = members
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

  const memberCounts = {
    all: members.length,
    active: members.filter((m) => m.status === "active").length,
    inactive: members.filter((m) => m.status === "inactive").length,
    pending: members.filter((m) => m.status === "pending").length,
  };

  const copyInviteLink = () => {
    navigator.clipboard.writeText(
      `https://seller.meelike.com/work/teams/join?code=${team.inviteCode}`
    );
  };

  return (
    <div className="space-y-8 animate-fade-in max-w-7xl mx-auto">
      {/* Header */}
      <PageHeader
        title="ทีมงาน"
        description={`จัดการสมาชิกทีม ${team.name} ของคุณ`}
        icon={Users}
        action={
          <Button 
            onClick={() => setIsInviteModalOpen(true)} 
            leftIcon={<UserPlus className="w-4 h-4" />}
            className="rounded-full shadow-lg shadow-brand-primary/20"
          >
            เชิญสมาชิกใหม่
          </Button>
        }
      />

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card variant="elevated" className="border-none shadow-lg shadow-brand-primary/5 hover:-translate-y-1 transition-transform">
          <div className="flex items-center gap-4 p-2">
            <div className="w-12 h-12 rounded-2xl bg-brand-primary/10 flex items-center justify-center text-brand-primary">
              <Users className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-brand-text-light">สมาชิกทั้งหมด</p>
              <p className="text-2xl font-bold text-brand-text-dark">{team.memberCount}</p>
            </div>
          </div>
        </Card>
        <Card variant="elevated" className="border-none shadow-lg shadow-brand-primary/5 hover:-translate-y-1 transition-transform">
          <div className="flex items-center gap-4 p-2">
            <div className="w-12 h-12 rounded-2xl bg-brand-secondary flex items-center justify-center text-brand-primary">
              <ClipboardList className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-brand-text-light">งานเปิดอยู่</p>
              <p className="text-2xl font-bold text-brand-text-dark">{team.activeJobCount}</p>
            </div>
          </div>
        </Card>
        <Card variant="elevated" className="border-none shadow-lg shadow-brand-primary/5 hover:-translate-y-1 transition-transform">
          <div className="flex items-center gap-4 p-2">
            <div className="w-12 h-12 rounded-2xl bg-[#E6F4EA] flex items-center justify-center text-[#1E8E3E]">
              <CheckCircle className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-brand-text-light">งานสำเร็จ</p>
              <p className="text-2xl font-bold text-brand-text-dark">{team.totalJobsCompleted.toLocaleString()}</p>
            </div>
          </div>
        </Card>
        <Card variant="elevated" className="border-none shadow-lg shadow-brand-primary/5 hover:-translate-y-1 transition-transform">
          <div className="flex items-center gap-4 p-2">
            <div className="w-12 h-12 rounded-2xl bg-[#E8F0FE] flex items-center justify-center text-[#1967D2]">
              <DollarSign className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-brand-text-light">รอจ่ายเงิน</p>
              <p className="text-2xl font-bold text-brand-text-dark">{formatCurrency(2450)}</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="grid sm:grid-cols-3 gap-6">
        <Link href="/seller/team/jobs">
          <Card variant="elevated" className="h-full border-none shadow-md hover:shadow-xl transition-all cursor-pointer group">
            <div className="flex items-start justify-between p-2">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-xl bg-brand-primary/5 text-brand-primary group-hover:bg-brand-primary group-hover:text-white transition-colors">
                  <ClipboardList className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-bold text-brand-text-dark text-lg group-hover:text-brand-primary transition-colors">งานทั้งหมด</h3>
                  <p className="text-sm text-brand-text-light">จัดการงานที่สร้าง</p>
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-brand-text-light group-hover:text-brand-primary transition-colors" />
            </div>
          </Card>
        </Link>
        <Link href="/seller/team/review">
          <Card variant="elevated" className="h-full border-none shadow-md hover:shadow-xl transition-all cursor-pointer group relative overflow-hidden">
            <div className="flex items-start justify-between p-2">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-xl bg-brand-warning/10 text-brand-warning group-hover:bg-brand-warning group-hover:text-white transition-colors">
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-bold text-brand-text-dark text-lg group-hover:text-brand-primary transition-colors">รอตรวจสอบ</h3>
                  <p className="text-sm text-brand-text-light">5 งานรอตรวจ</p>
                </div>
              </div>
              <Badge variant="error" className="shadow-sm">5</Badge>
            </div>
          </Card>
        </Link>
        <Link href="/seller/team/payouts">
          <Card variant="elevated" className="h-full border-none shadow-md hover:shadow-xl transition-all cursor-pointer group">
            <div className="flex items-start justify-between p-2">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-xl bg-brand-success/10 text-brand-success group-hover:bg-brand-success group-hover:text-white transition-colors">
                  <DollarSign className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-bold text-brand-text-dark text-lg group-hover:text-brand-primary transition-colors">จ่ายเงินลูกทีม</h3>
                  <p className="text-sm text-brand-text-light">รออนุมัติ ฿2,450</p>
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-brand-text-light group-hover:text-brand-primary transition-colors" />
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
           <h3 className="font-bold text-brand-text-dark">รายชื่อสมาชิกทีม</h3>
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
              {filteredMembers.map((member) => {
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
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Invite Modal */}
      <Modal
        isOpen={isInviteModalOpen}
        onClose={() => setIsInviteModalOpen(false)}
        title="➕ เชิญสมาชิกใหม่"
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

