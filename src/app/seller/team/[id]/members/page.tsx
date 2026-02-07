"use client";

import { useState, useMemo } from "react";
import { useParams } from "next/navigation";
import { Card, Badge, Button, Input, Select, Skeleton } from "@/components/ui";
import { Pagination, usePagination } from "@/components/ui/pagination";
import { Dialog } from "@/components/ui/Dialog";
import { 
  EmptyState, 
  InviteTeamModal, 
  DataTable,
  renderRatingCell,
  renderCurrencyCell,
  Breadcrumb,
  type DataTableColumn,
} from "@/components/shared";
import { useSellerTeams, useTeamMembersWithWorkers, type MemberWithWorker } from "@/lib/api/hooks";
import { api } from "@/lib/api";
import { TEAM_ROLES, type TeamRoleType } from "@/lib/constants/statuses";
import type { TeamRole } from "@/types";
import {
  Users,
  Search,
  Star,
  MoreVertical,
  UserPlus,
  Mail,
  Phone,
  Calendar,
  UserCheck,
  Crown,
  Briefcase,
} from "lucide-react";
import { useToast } from "@/components/ui/toast";
import { useConfirm } from "@/components/ui/confirm-dialog";

export default function TeamMembersPage() {
  const params = useParams();
  const teamId = params.id as string;
  
  const toast = useToast();
  const confirm = useConfirm();

  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState<"all" | TeamRole>("all");
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [showMemberModal, setShowMemberModal] = useState(false);
  const [selectedMemberId, setSelectedMemberId] = useState<string | null>(null);
  

  // Use API hooks - useTeamMembersWithWorkers already joins member + worker data
  const { data: teams, isLoading: isLoadingTeams } = useSellerTeams();
  const { data: members, isLoading: isLoadingMembers, refetch: refetchMembers } = useTeamMembersWithWorkers(teamId);

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

  // Paginate filtered members
  const { paginatedItems: paginatedMembers, currentPage, totalPages, totalItems, pageSize, setCurrentPage } = usePagination(filteredMembers, 10);

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
    return (
      <div className="space-y-6 animate-fade-in">
        <Skeleton className="h-16 w-full rounded-xl" />
        <div className="grid grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-20 rounded-xl" />
          ))}
        </div>
        <Skeleton className="h-64 rounded-xl" />
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Breadcrumb */}
      <Breadcrumb />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center">
            <Users className="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-brand-text-dark">สมาชิกทีม</h1>
            <p className="text-sm text-brand-text-light">จัดการสมาชิกของทีม {currentTeam?.name || ""}</p>
          </div>
        </div>
        <Button
          onClick={() => setShowInviteModal(true)}
          leftIcon={<UserPlus className="w-4 h-4" />}
        >
          เชิญสมาชิก
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-4 border-none shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center">
              <Users className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-brand-text-dark">{stats.total}</p>
              <p className="text-xs text-brand-text-light">สมาชิกทั้งหมด</p>
            </div>
          </div>
        </Card>
        <Card className="p-4 border-none shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center">
              <Crown className="w-5 h-5 text-amber-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-brand-text-dark">{stats.leads}</p>
              <p className="text-xs text-brand-text-light">หัวหน้าทีม</p>
            </div>
          </div>
        </Card>
        <Card className="p-4 border-none shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-purple-100 flex items-center justify-center">
              <UserCheck className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-brand-text-dark">{stats.assistants}</p>
              <p className="text-xs text-brand-text-light">ผู้ช่วย</p>
            </div>
          </div>
        </Card>
        <Card className="p-4 border-none shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center">
              <Briefcase className="w-5 h-5 text-emerald-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-brand-text-dark">{stats.workers}</p>
              <p className="text-xs text-brand-text-light">Worker</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Filter & Search */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 bg-white p-4 rounded-2xl shadow-sm border border-brand-border/50">
        <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto">
          <Select
            value={roleFilter}
            onChange={(e) => { setRoleFilter(e.target.value as "all" | TeamRole); setCurrentPage(1); }}
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
            onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
            className="w-full border-brand-border/50 bg-brand-bg/50 focus:bg-white !py-2.5 !rounded-xl"
            leftIcon={<Search className="w-4 h-4 text-brand-text-light" />}
          />
        </div>
      </div>

      {/* Members List */}
      <DataTable
        data={paginatedMembers}
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

      {/* Pagination */}
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
        pageSize={pageSize}
        totalItems={totalItems}
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
      <Dialog
        open={showMemberModal}
        onClose={() => {
          setShowMemberModal(false);
          setSelectedMemberId(null);
        }}
        size="md"
      >
        <Dialog.Header>
          <Dialog.Title>จัดการสมาชิก</Dialog.Title>
        </Dialog.Header>
        <Dialog.Body>
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
                <Select 
                  defaultValue={selectedMember.role} 
                  className="w-full"
                  id={`role-select-${selectedMember.id}`}
                >
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
            </div>
          )}
        </Dialog.Body>
        <Dialog.Footer>
          {selectedMember && (
            <>
              <Button
                variant="outline"
                className="flex-1 border-brand-error/20 text-brand-error hover:bg-brand-error/5"
                onClick={async () => {
                  if (await confirm({ title: "ยืนยัน", message: `ลบ @${selectedMember.worker.displayName} ออกจากทีม?`, variant: "danger", confirmLabel: "นำออก" })) {
                    try {
                      await api.seller.removeTeamMember(teamId, selectedMember.workerId);
                      await refetchMembers();
                      setShowMemberModal(false);
                      setSelectedMemberId(null);
                      toast.success("ลบสมาชิกออกจากทีมแล้ว");
                    } catch (error) {
                      console.error("Error removing member:", error);
                      toast.error("เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง");
                    }
                  }
                }}
              >
                นำออกจากทีม
              </Button>
              <Button
                className="flex-1"
                onClick={async () => {
                  try {
                    // Get selected role from select element
                    const selectElement = document.getElementById(`role-select-${selectedMember.id}`) as HTMLSelectElement;
                    const newRole = selectElement?.value || selectedMember.role;
                    
                    if (newRole !== selectedMember.role) {
                      await api.seller.updateTeamMemberRole(teamId, selectedMember.workerId, newRole);
                      await refetchMembers();
                      toast.success("อัปเดตบทบาทเรียบร้อย");
                    }
                    
                    setShowMemberModal(false);
                    setSelectedMemberId(null);
                  } catch (error) {
                    console.error("Error updating member:", error);
                    toast.error("เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง");
                  }
                }}
              >
                บันทึก
              </Button>
            </>
          )}
        </Dialog.Footer>
      </Dialog>
    </div>
  );
}
