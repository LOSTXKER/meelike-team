"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { Card, Badge, Button, Input, Modal, Select, Skeleton } from "@/components/ui";
import { PageHeader, EmptyState } from "@/components/shared";
import { useSellerTeams, useSellerTeamMembers } from "@/lib/api/hooks";
import type { TeamRole } from "@/types";
import {
  ArrowLeft,
  Users,
  Search,
  Plus,
  Star,
  Clock,
  CheckCircle,
  MoreVertical,
  Shield,
  UserPlus,
  Settings,
  Mail,
  Phone,
  Calendar,
  Award,
  Link as LinkIcon,
  Copy,
  QrCode,
  Share2,
} from "lucide-react";

const roleLabels: Record<TeamRole, { label: string; color: "success" | "info" | "warning" | "default" }> = {
  lead: { label: "หัวหน้าทีม", color: "success" },
  assistant: { label: "ผู้ช่วย", color: "info" },
  worker: { label: "Worker", color: "default" },
};

export default function TeamMembersPage() {
  const params = useParams();
  const teamId = params.id as string;
  
  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState<"all" | TeamRole>("all");
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [showMemberModal, setShowMemberModal] = useState(false);
  const [selectedMemberId, setSelectedMemberId] = useState<string | null>(null);
  const [inviteCode] = useState("TEAM-" + Math.random().toString(36).substring(2, 8).toUpperCase());

  // Use API hooks
  const { data: teams, isLoading: isLoadingTeams } = useSellerTeams();
  const { data: members, isLoading: isLoadingMembers } = useSellerTeamMembers(teamId);

  const currentTeam = useMemo(() => {
    return teams?.find((t) => t.id === teamId);
  }, [teams, teamId]);

  const filteredMembers = useMemo(() => {
    if (!members) return [];
    return members.filter((member) => {
      const matchSearch = member.worker.displayName.toLowerCase().includes(searchQuery.toLowerCase());
      const matchRole = roleFilter === "all" || member.role === roleFilter;
      return matchSearch && matchRole;
    });
  }, [members, searchQuery, roleFilter]);

  const selectedMember = useMemo(() => {
    return members?.find((m) => m.worker.id === selectedMemberId);
  }, [members, selectedMemberId]);

  const stats = useMemo(() => {
    if (!members) return { total: 0, leads: 0, assistants: 0, workers: 0 };
    return {
      total: members.length,
      leads: members.filter((m) => m.role === "lead").length,
      assistants: members.filter((m) => m.role === "assistant").length,
      workers: members.filter((m) => m.role === "worker").length,
    };
  }, [members]);

  if (isLoadingTeams || isLoadingMembers) {
    return (
      <div className="space-y-8 animate-fade-in max-w-7xl mx-auto">
        <Skeleton className="h-16 w-full rounded-xl" />
        <div className="grid grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-24 rounded-xl" />
          ))}
        </div>
        <Skeleton className="h-64 rounded-xl" />
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fade-in max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Link href={`/seller/team/${teamId}`}>
            <button className="p-2.5 hover:bg-white hover:shadow-sm rounded-xl transition-all border border-transparent hover:border-brand-border/50 text-brand-text-light hover:text-brand-primary">
              <ArrowLeft className="w-5 h-5" />
            </button>
          </Link>
          <PageHeader
            title="สมาชิกทีม"
            description={`จัดการสมาชิกของทีม ${currentTeam?.name || ""}`}
            icon={Users}
          />
        </div>
        
        <Button
          onClick={() => setShowInviteModal(true)}
          leftIcon={<UserPlus className="w-4 h-4" />}
          className="shadow-lg shadow-brand-primary/20"
        >
          เชิญสมาชิก
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card variant="elevated" className="border-none shadow-lg shadow-brand-primary/5 hover:-translate-y-1 transition-transform">
          <div className="flex flex-col items-center justify-center p-2 text-center">
            <div className="w-10 h-10 rounded-xl bg-brand-primary/10 flex items-center justify-center text-brand-primary mb-2">
              <Users className="w-5 h-5" />
            </div>
            <p className="text-2xl font-bold text-brand-text-dark">{stats.total}</p>
            <p className="text-sm text-brand-text-light">สมาชิกทั้งหมด</p>
          </div>
        </Card>
        <Card variant="elevated" className="border-none shadow-lg shadow-brand-primary/5 hover:-translate-y-1 transition-transform">
          <div className="flex flex-col items-center justify-center p-2 text-center">
            <div className="w-10 h-10 rounded-xl bg-brand-success/10 flex items-center justify-center text-brand-success mb-2">
              <Shield className="w-5 h-5" />
            </div>
            <p className="text-2xl font-bold text-brand-success">{stats.leads}</p>
            <p className="text-sm text-brand-text-light">หัวหน้าทีม</p>
          </div>
        </Card>
        <Card variant="elevated" className="border-none shadow-lg shadow-brand-primary/5 hover:-translate-y-1 transition-transform">
          <div className="flex flex-col items-center justify-center p-2 text-center">
            <div className="w-10 h-10 rounded-xl bg-brand-info/10 flex items-center justify-center text-brand-info mb-2">
              <Award className="w-5 h-5" />
            </div>
            <p className="text-2xl font-bold text-brand-info">{stats.assistants}</p>
            <p className="text-sm text-brand-text-light">ผู้ช่วย</p>
          </div>
        </Card>
        <Card variant="elevated" className="border-none shadow-lg shadow-brand-primary/5 hover:-translate-y-1 transition-transform">
          <div className="flex flex-col items-center justify-center p-2 text-center">
            <div className="w-10 h-10 rounded-xl bg-brand-warning/10 flex items-center justify-center text-brand-warning mb-2">
              <CheckCircle className="w-5 h-5" />
            </div>
            <p className="text-2xl font-bold text-brand-warning">{stats.workers}</p>
            <p className="text-sm text-brand-text-light">Worker</p>
          </div>
        </Card>
      </div>

      {/* Filter & Search */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 bg-white p-4 rounded-2xl shadow-sm border border-brand-border/50">
        <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto">
          <Select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value as "all" | TeamRole)}
            className="min-w-[160px] border-brand-border/50"
          >
            <option value="all">ทุกบทบาท</option>
            <option value="lead">หัวหน้าทีม</option>
            <option value="assistant">ผู้ช่วย</option>
            <option value="worker">Worker</option>
          </Select>
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
        {filteredMembers.length === 0 ? (
          <EmptyState
            icon={Users}
            title="ไม่พบสมาชิก"
            description="ยังไม่มีสมาชิกในทีมหรือไม่ตรงกับการค้นหา"
            action={
              <Button
                onClick={() => setShowInviteModal(true)}
                leftIcon={<UserPlus className="w-4 h-4" />}
                className="mt-4"
              >
                เชิญสมาชิก
              </Button>
            }
            className="py-16"
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-brand-bg/50 border-b border-brand-border/30">
                  <th className="text-left px-6 py-4 text-sm font-semibold text-brand-text-dark">สมาชิก</th>
                  <th className="text-left px-6 py-4 text-sm font-semibold text-brand-text-dark">บทบาท</th>
                  <th className="text-left px-6 py-4 text-sm font-semibold text-brand-text-dark">ระดับ</th>
                  <th className="text-left px-6 py-4 text-sm font-semibold text-brand-text-dark">งานเสร็จ</th>
                  <th className="text-left px-6 py-4 text-sm font-semibold text-brand-text-dark">Rating</th>
                  <th className="text-left px-6 py-4 text-sm font-semibold text-brand-text-dark">รายได้รวม</th>
                  <th className="text-center px-6 py-4 text-sm font-semibold text-brand-text-dark">จัดการ</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-brand-border/30">
                {filteredMembers.map((member) => (
                  <tr key={member.worker.id} className="hover:bg-brand-bg/20 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-brand-primary to-brand-primary-dark rounded-full flex items-center justify-center text-white font-bold text-sm shadow-md">
                          {member.worker.displayName.charAt(0)}
                        </div>
                        <div>
                          <p className="font-semibold text-brand-text-dark">@{member.worker.displayName}</p>
                          <p className="text-xs text-brand-text-light flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            เข้าร่วม {new Date(member.joinedAt).toLocaleDateString("th-TH")}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <Badge variant={roleLabels[member.role].color} size="sm">
                        {roleLabels[member.role].label}
                      </Badge>
                    </td>
                    <td className="px-6 py-4">
                      <Badge variant="warning" size="sm" className="uppercase">
                        {member.worker.level}
                      </Badge>
                    </td>
                    <td className="px-6 py-4">
                      <span className="font-medium text-brand-text-dark">{member.worker.totalJobsCompleted}</span>
                      <span className="text-brand-text-light text-sm"> งาน</span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 text-brand-warning fill-brand-warning" />
                        <span className="font-medium text-brand-text-dark">{member.worker.rating}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="font-semibold text-brand-success">฿{member.totalEarnings?.toLocaleString() || 0}</span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => {
                            setSelectedMemberId(member.worker.id);
                            setShowMemberModal(true);
                          }}
                          className="p-2 hover:bg-brand-bg rounded-lg transition-colors text-brand-text-light hover:text-brand-primary"
                        >
                          <MoreVertical className="w-5 h-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Invite Modal */}
      <Modal
        isOpen={showInviteModal}
        onClose={() => setShowInviteModal(false)}
        title="เชิญสมาชิกเข้าทีม"
        size="md"
      >
        <div className="space-y-6">
          {/* Invite Link */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-brand-text-dark flex items-center gap-2">
              <LinkIcon className="w-4 h-4" />
              ลิงก์เชิญ
            </label>
            <div className="flex gap-2">
              <Input
                value={`https://meelike.com/join/${teamId}?code=${inviteCode}`}
                readOnly
                className="flex-1 font-mono text-sm bg-brand-bg/50"
              />
              <Button
                variant="outline"
                onClick={() => {
                  navigator.clipboard.writeText(`https://meelike.com/join/${teamId}?code=${inviteCode}`);
                  alert("คัดลอกลิงก์แล้ว!");
                }}
              >
                <Copy className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Invite Code */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-brand-text-dark flex items-center gap-2">
              <Share2 className="w-4 h-4" />
              รหัสเชิญ
            </label>
            <div className="flex gap-2 items-center">
              <div className="flex-1 bg-brand-bg/50 border border-brand-border rounded-lg p-3 text-center">
                <span className="font-mono text-xl font-bold text-brand-primary tracking-widest">{inviteCode}</span>
              </div>
              <Button
                variant="outline"
                onClick={() => {
                  navigator.clipboard.writeText(inviteCode);
                  alert("คัดลอกรหัสแล้ว!");
                }}
              >
                <Copy className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* QR Code Placeholder */}
          <div className="border-2 border-dashed border-brand-border/50 rounded-xl p-8 text-center bg-brand-bg/20">
            <QrCode className="w-24 h-24 text-brand-text-light/30 mx-auto mb-3" />
            <p className="text-sm text-brand-text-light">QR Code สำหรับเข้าร่วมทีม</p>
          </div>

          {/* Invite Settings */}
          <div className="space-y-3 pt-4 border-t border-brand-border/30">
            <h4 className="font-medium text-brand-text-dark text-sm">ตั้งค่าการเข้าร่วม</h4>
            <label className="flex items-center justify-between cursor-pointer p-3 rounded-lg border border-brand-border/30 hover:bg-brand-bg/30 transition-colors">
              <span className="text-sm text-brand-text-dark">ต้องได้รับการอนุมัติก่อนเข้าร่วม</span>
              <input type="checkbox" className="sr-only peer" defaultChecked />
              <div className="w-10 h-5 bg-brand-border rounded-full peer-checked:bg-brand-primary transition-colors relative">
                <div className="absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full shadow peer-checked:translate-x-5 transition-transform"></div>
              </div>
            </label>
            <label className="flex items-center justify-between cursor-pointer p-3 rounded-lg border border-brand-border/30 hover:bg-brand-bg/30 transition-colors">
              <span className="text-sm text-brand-text-dark">แสดงในหน้ารับสมัคร (Hub)</span>
              <input type="checkbox" className="sr-only peer" />
              <div className="w-10 h-5 bg-brand-border rounded-full peer-checked:bg-brand-primary transition-colors relative">
                <div className="absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full shadow peer-checked:translate-x-5 transition-transform"></div>
              </div>
            </label>
          </div>

          <Button className="w-full" onClick={() => setShowInviteModal(false)}>
            เสร็จสิ้น
          </Button>
        </div>
      </Modal>

      {/* Member Detail Modal */}
      <Modal
        isOpen={showMemberModal}
        onClose={() => {
          setShowMemberModal(false);
          setSelectedMemberId(null);
        }}
        title="จัดการสมาชิก"
        size="md"
      >
        {selectedMember && (
          <div className="space-y-6">
            {/* Member Info */}
            <div className="flex items-center gap-4 p-4 bg-brand-bg/50 rounded-xl border border-brand-border/30">
              <div className="w-16 h-16 bg-gradient-to-br from-brand-primary to-brand-primary-dark rounded-full flex items-center justify-center text-white font-bold text-xl shadow-lg">
                {selectedMember.worker.displayName.charAt(0)}
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-lg text-brand-text-dark">@{selectedMember.worker.displayName}</h3>
                <div className="flex items-center gap-3 text-sm text-brand-text-light mt-1">
                  <Badge variant={roleLabels[selectedMember.role].color} size="sm">
                    {roleLabels[selectedMember.role].label}
                  </Badge>
                  <span className="flex items-center gap-1">
                    <Star className="w-3 h-3 text-brand-warning fill-brand-warning" />
                    {selectedMember.worker.rating}
                  </span>
                </div>
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-3">
              <div className="bg-brand-bg/30 rounded-xl p-4 text-center border border-brand-border/20">
                <p className="text-xl font-bold text-brand-text-dark">{selectedMember.worker.totalJobsCompleted}</p>
                <p className="text-xs text-brand-text-light">งานเสร็จ</p>
              </div>
              <div className="bg-brand-bg/30 rounded-xl p-4 text-center border border-brand-border/20">
                <p className="text-xl font-bold text-brand-success">฿{selectedMember.totalEarnings?.toLocaleString() || 0}</p>
                <p className="text-xs text-brand-text-light">รายได้รวม</p>
              </div>
              <div className="bg-brand-bg/30 rounded-xl p-4 text-center border border-brand-border/20">
                <p className="text-xl font-bold text-brand-text-dark uppercase">{selectedMember.worker.level}</p>
                <p className="text-xs text-brand-text-light">ระดับ</p>
              </div>
            </div>

            {/* Role Change */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-brand-text-dark">เปลี่ยนบทบาท</label>
              <Select defaultValue={selectedMember.role} className="w-full">
                <option value="lead">หัวหน้าทีม</option>
                <option value="assistant">ผู้ช่วย</option>
                <option value="worker">Worker</option>
              </Select>
            </div>

            {/* Contact Info */}
            <div className="space-y-3 pt-4 border-t border-brand-border/30">
              <h4 className="font-medium text-brand-text-dark text-sm">ข้อมูลติดต่อ</h4>
              <div className="flex items-center gap-3 text-sm text-brand-text-light">
                <Mail className="w-4 h-4" />
                <span>worker@example.com</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-brand-text-light">
                <Phone className="w-4 h-4" />
                <span>08x-xxx-xxxx</span>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3 pt-4 border-t border-brand-border/30">
              <Button
                variant="outline"
                className="flex-1 border-brand-error/20 text-brand-error hover:bg-brand-error/5"
                onClick={() => {
                  if (confirm(`ลบ @${selectedMember.worker.displayName} ออกจากทีม?`)) {
                    setShowMemberModal(false);
                    setSelectedMemberId(null);
                    alert("ลบสมาชิกออกจากทีมแล้ว");
                  }
                }}
              >
                นำออกจากทีม
              </Button>
              <Button
                className="flex-1"
                onClick={() => {
                  setShowMemberModal(false);
                  setSelectedMemberId(null);
                }}
              >
                บันทึก
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
