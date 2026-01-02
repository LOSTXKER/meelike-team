"use client";

import { useState, useMemo } from "react";
import { useParams } from "next/navigation";
import { Badge, Button, Input, Dialog, Select, Dropdown, Modal } from "@/components/ui";
import { Container, Section } from "@/components/layout";
import { 
  PageHeader, 
  EmptyState, 
  InviteTeamModal, 
  StatsGrid, 
  getMemberRoleStats,
  PageSkeleton,
  DataTable,
  renderRatingCell,
  renderCurrencyCell,
  type DataTableColumn,
} from "@/components/shared";
import { useSellerTeams, useTeamMembersWithWorkers, type MemberWithWorker } from "@/lib/api/hooks";
import { TEAM_ROLES, type TeamRoleType } from "@/lib/constants/statuses";
import type { TeamRole } from "@/types";
import {
  Users,
  Search,
  Star,
  CheckCircle,
  MoreVertical,
  UserPlus,
  Mail,
  Phone,
  Calendar,
  Edit,
  Trash2,
} from "lucide-react";

export default function TeamMembersPage() {
  const params = useParams();
  const teamId = params.id as string;
  
  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState<"all" | TeamRole>("all");
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [showMemberModal, setShowMemberModal] = useState(false);
  const [selectedMemberId, setSelectedMemberId] = useState<string | null>(null);
  

  // Use API hooks - useTeamMembersWithWorkers already joins member + worker data
  const { data: teams, isLoading: isLoadingTeams } = useSellerTeams();
  const { data: members, isLoading: isLoadingMembers } = useTeamMembersWithWorkers(teamId);

  const currentTeam = useMemo(() => {
    return teams?.find((t) => t.id === teamId);
  }, [teams, teamId]);

  const filteredMembers = useMemo((): MemberWithWorker[] => {
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

  // Define table columns
  const columns: DataTableColumn<MemberWithWorker>[] = useMemo(() => [
    {
      key: "worker",
      header: "สมาชิก",
      render: (member) => (
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
      ),
    },
    {
      key: "role",
      header: "บทบาท",
      render: (member) => (
        <Badge variant={TEAM_ROLES[member.role as TeamRoleType]?.variant || "default"} size="sm">
          {TEAM_ROLES[member.role as TeamRoleType]?.labelTh || member.role}
        </Badge>
      ),
    },
    {
      key: "level",
      header: "ระดับ",
      hideOnMobile: true,
      render: (member) => (
        <Badge variant="warning" size="sm" className="uppercase">
          {member.worker.level}
        </Badge>
      ),
    },
    {
      key: "jobsCompleted",
      header: "งานเสร็จ",
      hideOnMobile: true,
      render: (member) => (
        <span>
          <span className="font-medium text-brand-text-dark">{member.worker.totalJobsCompleted}</span>
          <span className="text-brand-text-light text-sm"> งาน</span>
        </span>
      ),
    },
    {
      key: "rating",
      header: "Rating",
      render: (member) => renderRatingCell(member.worker.rating),
    },
    {
      key: "earnings",
      header: "รายได้รวม",
      hideOnMobile: true,
      render: (member) => renderCurrencyCell(member.totalEarned || 0),
    },
    {
      key: "actions",
      header: "จัดการ",
      align: "center",
      render: (member) => (
        <button
          onClick={(e) => {
            e.stopPropagation();
            setSelectedMemberId(member.worker.id);
            setShowMemberModal(true);
          }}
          className="p-2 hover:bg-brand-bg rounded-lg transition-colors text-brand-text-light hover:text-brand-primary"
        >
          <MoreVertical className="w-5 h-5" />
        </button>
      ),
    },
  ], []);

  if (isLoadingTeams || isLoadingMembers) {
    return <PageSkeleton variant="list" className="max-w-7xl mx-auto" />;
  }

  return (
    <Container size="xl">
      <Section spacing="lg" className="animate-fade-in">
        {/* Header */}
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
          <PageHeader
            title="สมาชิกทีม"
            description={`จัดการสมาชิกของทีม ${currentTeam?.name || ""}`}
            icon={Users}
          />

          <Button
            onClick={() => setShowInviteModal(true)}
            leftIcon={<UserPlus className="w-4 h-4" />}
            className="shadow-lg shadow-brand-primary/20"
          >
            เชิญสมาชิก
          </Button>
        </div>

        {/* Stats */}
        <StatsGrid stats={getMemberRoleStats(stats)} columns={4} />

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
      <DataTable
        data={filteredMembers}
        columns={columns}
        keyExtractor={(member) => member.worker.id}
        emptyState={{
          icon: Users,
          title: "ไม่พบสมาชิก",
          description: "ยังไม่มีสมาชิกในทีมหรือไม่ตรงกับการค้นหา",
          action: (
            <Button
              onClick={() => setShowInviteModal(true)}
              leftIcon={<UserPlus className="w-4 h-4" />}
              className="mt-4"
            >
              เชิญสมาชิก
            </Button>
          ),
        }}
      />

      {/* Invite Modal */}
      {currentTeam && (
        <InviteTeamModal
          isOpen={showInviteModal}
          onClose={() => setShowInviteModal(false)}
          team={currentTeam}
        />
      )}

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
                  <Badge variant={TEAM_ROLES[selectedMember.role as TeamRoleType]?.variant || "default"} size="sm">
                    {TEAM_ROLES[selectedMember.role as TeamRoleType]?.labelTh || selectedMember.role}
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
                <p className="text-xl font-bold text-brand-success">฿{selectedMember.totalEarned?.toLocaleString() || 0}</p>
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
      </Section>
    </Container>
  );
}
