"use client";

import { useState } from "react";
import Link from "next/link";
import { Card, Button, Badge, Avatar, Input, Modal, StatsCard } from "@/components/ui";
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
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <PageHeader
        title="ทีมงาน"
        description={`จัดการสมาชิกทีม ${team.name}`}
        icon={Users}
        action={
          <Button onClick={() => setIsInviteModalOpen(true)} leftIcon={<UserPlus className="w-4 h-4" />}>
            เชิญสมาชิกใหม่
          </Button>
        }
      />

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard
          title="สมาชิกทั้งหมด"
          value={team.memberCount}
          icon={<Users className="w-5 h-5" />}
        />
        <StatsCard
          title="งานเปิดอยู่"
          value={team.activeJobCount}
          icon={<ClipboardList className="w-5 h-5" />}
        />
        <StatsCard
          title="งานสำเร็จ"
          value={team.totalJobsCompleted.toLocaleString()}
          icon={<CheckCircle className="w-5 h-5" />}
        />
        <StatsCard
          title="รอจ่ายเงิน"
          value={formatCurrency(2450)}
          icon={<DollarSign className="w-5 h-5" />}
        />
      </div>

      {/* Quick Actions */}
      <div className="grid sm:grid-cols-3 gap-4">
        <Link href="/seller/team/jobs">
          <Card variant="bordered" className="hover:shadow-md transition-shadow cursor-pointer">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-brand-primary/10 text-brand-primary">
                <ClipboardList className="w-5 h-5" />
              </div>
              <div>
                <p className="font-medium text-brand-text-dark">งานทั้งหมด</p>
                <p className="text-sm text-brand-text-light">จัดการงานที่สร้าง</p>
              </div>
            </div>
          </Card>
        </Link>
        <Link href="/seller/team/review">
          <Card variant="bordered" className="hover:shadow-md transition-shadow cursor-pointer">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-brand-warning/20 text-brand-text-dark">
                <CheckCircle className="w-5 h-5" />
              </div>
              <div className="flex-1">
                <p className="font-medium text-brand-text-dark">รอตรวจสอบ</p>
                <p className="text-sm text-brand-text-light">5 งานรอตรวจ</p>
              </div>
              <Badge variant="error">5</Badge>
            </div>
          </Card>
        </Link>
        <Link href="/seller/team/payouts">
          <Card variant="bordered" className="hover:shadow-md transition-shadow cursor-pointer">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-brand-success/10 text-brand-success">
                <DollarSign className="w-5 h-5" />
              </div>
              <div>
                <p className="font-medium text-brand-text-dark">จ่ายเงินลูกทีม</p>
                <p className="text-sm text-brand-text-light">รออนุมัติ ฿2,450</p>
              </div>
            </div>
          </Card>
        </Link>
      </div>

      {/* Filter & Search */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex flex-wrap gap-2">
          {(
            [
              { value: "all", label: "ทั้งหมด" },
              { value: "active", label: "Active" },
              { value: "inactive", label: "ไม่ Active" },
              { value: "pending", label: "รอยืนยัน" },
            ] as const
          ).map((item) => (
            <button
              key={item.value}
              onClick={() => setFilter(item.value)}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                filter === item.value
                  ? "bg-brand-primary text-white"
                  : "bg-brand-surface border border-brand-border text-brand-text-light hover:text-brand-text-dark"
              }`}
            >
              {item.label} ({memberCounts[item.value]})
            </button>
          ))}
        </div>
        <div className="flex-1">
          <Input
            placeholder="ค้นหาสมาชิก..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            leftIcon={<Search className="w-4 h-4" />}
          />
        </div>
      </div>

      {/* Members List */}
      <Card variant="bordered" padding="none">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-brand-bg border-b border-brand-border">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-medium text-brand-text-light">
                  สมาชิก
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-brand-text-light">
                  Level
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-brand-text-light">
                  งานสำเร็จ
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-brand-text-light">
                  Rating
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-brand-text-light">
                  รายได้
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-brand-text-light">
                  สถานะ
                </th>
                <th className="px-4 py-3 text-right text-sm font-medium text-brand-text-light">
                  Action
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-brand-border">
              {filteredMembers.map((member) => {
                const levelInfo = getLevelInfo(member.worker?.level || "bronze");
                return (
                  <tr key={member.id} className="hover:bg-brand-bg/50">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <Avatar
                          src={member.worker?.avatar}
                          fallback={member.worker?.displayName}
                          size="sm"
                        />
                        <div>
                          <p className="font-medium text-brand-text-dark">
                            @{member.worker?.displayName}
                          </p>
                          <p className="text-xs text-brand-text-light">
                            เข้าร่วม {new Date(member.joinedAt).toLocaleDateString("th-TH")}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`font-medium ${levelInfo.color}`}>
                        {levelInfo.name}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-brand-text-dark">
                        {member.jobsCompleted} งาน
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 text-brand-warning" />
                        <span className="text-brand-text-dark">
                          {member.rating.toFixed(1)}
                        </span>
                        <span className="text-xs text-brand-text-light">
                          ({member.ratingCount})
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className="font-medium text-brand-success">
                        {formatCurrency(member.totalEarned)}
                      </span>
                    </td>
                    <td className="px-4 py-3">
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
                    <td className="px-4 py-3 text-right">
                      <Button size="sm" variant="ghost">
                        <MoreVertical className="w-4 h-4" />
                      </Button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Card>

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
            <label className="block text-sm font-medium text-brand-text-dark mb-2">
              🔗 Link เชิญ
            </label>
            <div className="flex gap-2">
              <Input
                value={`seller.meelike.com/work/teams/join?code=${team.inviteCode}`}
                readOnly
                className="flex-1"
              />
              <Button variant="outline" onClick={copyInviteLink}>
                <Copy className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Invite Code */}
          <div>
            <label className="block text-sm font-medium text-brand-text-dark mb-2">
              🔑 รหัสเชิญ
            </label>
            <div className="flex gap-2">
              <Input value={team.inviteCode} readOnly className="flex-1" />
              <Button variant="outline">
                <RefreshCw className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* QR Code */}
          <div className="text-center">
            <label className="block text-sm font-medium text-brand-text-dark mb-2">
              QR Code
            </label>
            <div className="inline-block p-4 bg-white rounded-lg border border-brand-border">
              <div className="w-32 h-32 bg-brand-bg flex items-center justify-center">
                <QrCode className="w-16 h-16 text-brand-text-light" />
              </div>
            </div>
          </div>

          {/* Settings */}
          <div className="space-y-3 p-4 rounded-lg bg-brand-bg">
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                defaultChecked={team.requireApproval}
                className="w-4 h-4 rounded border-brand-border text-brand-primary focus:ring-brand-primary"
              />
              <span className="text-sm text-brand-text-dark">
                ต้องอนุมัติก่อนเข้าทีม
              </span>
            </label>
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                defaultChecked={team.isRecruiting}
                className="w-4 h-4 rounded border-brand-border text-brand-primary focus:ring-brand-primary"
              />
              <span className="text-sm text-brand-text-dark">
                แสดงในหน้าค้นหาทีม
              </span>
            </label>
          </div>
        </div>
      </Modal>
    </div>
  );
}

