"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Card, Button, Badge, Input, Dialog, Checkbox } from "@/components/ui";
import { VStack } from "@/components/layout";
import { PageHeader, EmptyState, ContentGuidelines, KYCRequiredModal, PROHIBITED_CONTENT, PENALTIES } from "@/components/shared";
import { formatCurrency } from "@/lib/utils";
import { useSellerTeams, useTeamPayouts, useTransactions } from "@/lib/api/hooks";
import { useAuthStore } from "@/lib/store";
import { api } from "@/lib/api";
import { meetsKYCRequirement } from "@/types/kyc";
import type { KYCLevel } from "@/types";
import {
  Building2,
  Users,
  Star,
  ArrowRight,
  Plus,
  Search,
  TrendingUp,
  TrendingDown,
  DollarSign,
  ClipboardList,
  CheckCircle,
  Clock,
  Eye,
  EyeOff,
  ChevronRight,
} from "lucide-react";

type SortOption = "name" | "members" | "rating" | "jobs" | "earnings";
type FilterOption = "all" | "active" | "inactive";

export default function TeamCenterPage() {
  const router = useRouter();
  const { data: teams, isLoading, refetch } = useSellerTeams();
  const { data: allPayouts } = useTeamPayouts();
  const { data: allTransactions } = useTransactions();
  
  const { user } = useAuthStore();
  
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<SortOption>("earnings");
  const [filterBy, setFilterBy] = useState<FilterOption>("all");
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [showKYCModal, setShowKYCModal] = useState(false);
  const [newTeamName, setNewTeamName] = useState("");
  const [newTeamDescription, setNewTeamDescription] = useState("");
  const [guidelinesAccepted, setGuidelinesAccepted] = useState(false);

  // KYC verification check
  const currentKYCLevel: KYCLevel = user?.seller?.kyc?.level || "none";
  const isKYCVerified = meetsKYCRequirement(currentKYCLevel, "verified");

  const handleOpenCreateModal = () => {
    if (!isKYCVerified) {
      setShowKYCModal(true);
      return;
    }
    setIsCreateModalOpen(true);
  };

  // Calculate real earnings data per team
  const getTeamEarnings = (teamId: string) => {
    if (!allPayouts || !allTransactions) {
      return { thisMonth: 0, lastMonth: 0, total: 0 };
    }
    
    const teamPayouts = allPayouts.filter(p => p.status === "completed");
    const now = new Date();
    const thisMonthStart = new Date(now.getFullYear(), now.getMonth(), 1);
    const lastMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    
    const thisMonthPayouts = teamPayouts.filter(p => 
      p.completedAt && new Date(p.completedAt) >= thisMonthStart
    );
    
    const lastMonthPayouts = teamPayouts.filter(p => 
      p.completedAt && 
      new Date(p.completedAt) >= lastMonthStart && 
      new Date(p.completedAt) < thisMonthStart
    );
    
    return {
      thisMonth: thisMonthPayouts.reduce((sum, p) => sum + p.amount, 0),
      lastMonth: lastMonthPayouts.reduce((sum, p) => sum + p.amount, 0),
      total: teamPayouts.reduce((sum, p) => sum + p.amount, 0),
    };
  };

  const getTeamPendingData = (teamId: string) => {
    if (!allPayouts) {
      return { pendingReviews: 0, pendingPayouts: 0 };
    }
    
    const pendingPayouts = allPayouts.filter(p => p.status === "pending");
    const pendingAmount = pendingPayouts.reduce((sum, p) => sum + p.amount, 0);
    
    return {
      pendingReviews: 0,
      pendingPayouts: pendingAmount,
    };
  };

  // Calculate totals
  const totals = useMemo(() => {
    if (!teams) return { teams: 0, members: 0, activeJobs: 0, completed: 0, earnings: 0 };
    
    return {
      teams: teams.length,
      members: teams.reduce((sum, t) => sum + t.memberCount, 0),
      activeJobs: teams.reduce((sum, t) => sum + t.activeJobCount, 0),
      completed: teams.reduce((sum, t) => sum + t.totalJobsCompleted, 0),
      earnings: teams.reduce((sum, t) => sum + getTeamEarnings(t.id).thisMonth, 0),
    };
  }, [teams]);

  // Filter and sort teams
  const filteredTeams = useMemo(() => {
    if (!teams) return [];
    
    let result = [...teams];
    
    if (searchQuery) {
      result = result.filter(t => 
        t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.description?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    if (filterBy === "active") {
      result = result.filter(t => t.isActive);
    } else if (filterBy === "inactive") {
      result = result.filter(t => !t.isActive);
    }
    
    result.sort((a, b) => {
      switch (sortBy) {
        case "name":
          return a.name.localeCompare(b.name);
        case "members":
          return b.memberCount - a.memberCount;
        case "rating":
          return b.rating - a.rating;
        case "jobs":
          return b.activeJobCount - a.activeJobCount;
        case "earnings":
          return getTeamEarnings(b.id).thisMonth - getTeamEarnings(a.id).thisMonth;
        default:
          return 0;
      }
    });
    
    return result;
  }, [teams, searchQuery, sortBy, filterBy]);

  const handleCreateTeam = async () => {
    if (!newTeamName.trim()) {
      alert("กรุณาใส่ชื่อทีม");
      return;
    }
    
    if (!guidelinesAccepted) {
      alert("กรุณายอมรับกฎและข้อห้ามก่อนสร้างทีม");
      return;
    }
    
    try {
      const newTeam = await api.seller.createTeam({
        name: newTeamName,
        description: newTeamDescription || undefined,
      });
      
      await refetch();
      alert(`สร้างทีม "${newTeamName}" สำเร็จ!`);
      setIsCreateModalOpen(false);
      setNewTeamName("");
      setNewTeamDescription("");
      setGuidelinesAccepted(false);
      
      router.push(`/seller/team/${newTeam.id}`);
    } catch (error) {
      console.error("Error creating team:", error);
      alert("เกิดข้อผิดพลาดในการสร้างทีม กรุณาลองใหม่อีกครั้ง");
    }
  };

  const colors = [
    'from-brand-primary to-brand-primary/70',
    'from-blue-500 to-blue-600',
    'from-purple-500 to-purple-600',
    'from-emerald-500 to-emerald-600',
    'from-orange-500 to-orange-600',
    'from-pink-500 to-pink-600',
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <PageHeader
        title="Team Center"
        description="จัดการและติดตามผลงานทุกทีมในที่เดียว"
        icon={Building2}
        action={
          <Button onClick={handleOpenCreateModal} leftIcon={<Plus className="w-4 h-4" />}>
            สร้างทีมใหม่
          </Button>
        }
      />

      {/* Overview Stats - Compact */}
      <div className="flex flex-wrap items-center gap-6 p-4 bg-white rounded-xl border border-brand-border/50 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-brand-primary/10">
            <Building2 className="w-5 h-5 text-brand-primary" />
          </div>
          <div>
            <p className="text-2xl font-bold text-brand-text-dark">{totals.teams}</p>
            <p className="text-xs text-brand-text-light">ทีมทั้งหมด</p>
          </div>
        </div>
        
        <div className="w-px h-10 bg-brand-border/50 hidden sm:block" />
        
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-blue-100">
            <Users className="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <p className="text-2xl font-bold text-brand-text-dark">{totals.members}</p>
            <p className="text-xs text-brand-text-light">สมาชิกรวม</p>
          </div>
        </div>
        
        <div className="w-px h-10 bg-brand-border/50 hidden sm:block" />
        
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-purple-100">
            <ClipboardList className="w-5 h-5 text-purple-600" />
          </div>
          <div>
            <p className="text-2xl font-bold text-brand-text-dark">{totals.activeJobs}</p>
            <p className="text-xs text-brand-text-light">งานกำลังทำ</p>
          </div>
        </div>
        
        <div className="w-px h-10 bg-brand-border/50 hidden sm:block" />
        
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-emerald-100">
            <DollarSign className="w-5 h-5 text-emerald-600" />
          </div>
          <div>
            <p className="text-2xl font-bold text-emerald-600">{formatCurrency(totals.earnings)}</p>
            <p className="text-xs text-brand-text-light">รายได้เดือนนี้</p>
          </div>
        </div>
      </div>

      {/* Filters & Search */}
      <Card className="p-4 border-none shadow-sm">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-brand-text-light" />
            <input
              type="text"
              placeholder="ค้นหาทีม..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-brand-border/50 bg-white focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/10 outline-none text-sm"
            />
          </div>
          <div className="flex gap-2">
            <select
              value={filterBy}
              onChange={(e) => setFilterBy(e.target.value as FilterOption)}
              className="px-4 py-2.5 rounded-xl border border-brand-border/50 bg-white text-sm focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/10 outline-none"
            >
              <option value="all">ทั้งหมด</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as SortOption)}
              className="px-4 py-2.5 rounded-xl border border-brand-border/50 bg-white text-sm focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/10 outline-none"
            >
              <option value="earnings">เรียงตามรายได้</option>
              <option value="members">เรียงตามสมาชิก</option>
              <option value="rating">เรียงตาม Rating</option>
              <option value="jobs">เรียงตามงาน</option>
              <option value="name">เรียงตามชื่อ</option>
            </select>
          </div>
        </div>
      </Card>

      {/* Teams List */}
      {isLoading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="p-5 animate-pulse border-none shadow-md">
              <div className="flex gap-4">
                <div className="w-14 h-14 rounded-xl bg-brand-bg" />
                <div className="flex-1 space-y-2">
                  <div className="h-5 w-40 bg-brand-bg rounded" />
                  <div className="h-4 w-60 bg-brand-bg rounded" />
                </div>
              </div>
            </Card>
          ))}
        </div>
      ) : filteredTeams.length > 0 ? (
        <div className="space-y-4">
          {filteredTeams.map((team, index) => {
            const earnings = getTeamEarnings(team.id);
            const pendingData = getTeamPendingData(team.id);
            const earningsChange = earnings.lastMonth > 0 
              ? ((earnings.thisMonth - earnings.lastMonth) / earnings.lastMonth * 100).toFixed(1)
              : 0;
            const isUp = Number(earningsChange) >= 0;
            const colorClass = colors[index % colors.length];
            
            return (
              <Link key={team.id} href={`/seller/team/${team.id}`}>
                <Card className="p-5 border-none shadow-md hover:shadow-lg transition-all group cursor-pointer">
                  <div className="flex flex-col lg:flex-row lg:items-center gap-4">
                    {/* Team Info */}
                    <div className="flex items-center gap-4 flex-1 min-w-0">
                      <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${colorClass} flex items-center justify-center text-white text-xl font-bold shadow-lg shrink-0 group-hover:scale-105 transition-transform`}>
                        {team.name.charAt(0)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h3 className="font-bold text-lg text-brand-text-dark group-hover:text-brand-primary transition-colors truncate">
                            {team.name}
                          </h3>
                          {team.isPublic ? (
                            <Eye className="w-4 h-4 text-brand-success shrink-0" />
                          ) : (
                            <EyeOff className="w-4 h-4 text-brand-text-light shrink-0" />
                          )}
                          <Badge variant={team.isActive ? "success" : "default"} size="sm">
                            {team.isActive ? "Active" : "Inactive"}
                          </Badge>
                        </div>
                        <p className="text-sm text-brand-text-light truncate">{team.description}</p>
                      </div>
                    </div>

                    {/* Stats */}
                    <div className="flex items-center gap-6 flex-wrap">
                      <div className="text-center min-w-[50px]">
                        <div className="flex items-center justify-center gap-1">
                          <Users className="w-4 h-4 text-blue-500" />
                          <span className="text-lg font-bold text-brand-text-dark">{team.memberCount}</span>
                        </div>
                        <p className="text-xs text-brand-text-light">สมาชิก</p>
                      </div>
                      
                      <div className="text-center min-w-[50px]">
                        <div className="flex items-center justify-center gap-1">
                          <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
                          <span className="text-lg font-bold text-brand-text-dark">{team.rating.toFixed(1)}</span>
                        </div>
                        <p className="text-xs text-brand-text-light">Rating</p>
                      </div>
                      
                      <div className="text-center min-w-[50px]">
                        <div className="flex items-center justify-center gap-1">
                          <ClipboardList className="w-4 h-4 text-purple-500" />
                          <span className="text-lg font-bold text-brand-text-dark">{team.activeJobCount}</span>
                        </div>
                        <p className="text-xs text-brand-text-light">งานเปิด</p>
                      </div>

                      <div className="text-center min-w-[90px]">
                        <p className="text-lg font-bold text-emerald-600">{formatCurrency(earnings.thisMonth)}</p>
                        <div className="flex items-center justify-center gap-1">
                          {isUp ? (
                            <TrendingUp className="w-3 h-3 text-emerald-500" />
                          ) : (
                            <TrendingDown className="w-3 h-3 text-red-500" />
                          )}
                          <span className={`text-xs ${isUp ? 'text-emerald-500' : 'text-red-500'}`}>
                            {isUp ? '+' : ''}{earningsChange}%
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Pending Actions */}
                    <div className="flex items-center gap-2 shrink-0">
                      {pendingData.pendingReviews > 0 && (
                        <Badge variant="warning" size="sm" className="gap-1">
                          <Clock className="w-3 h-3" />
                          {pendingData.pendingReviews}
                        </Badge>
                      )}
                      {pendingData.pendingPayouts > 0 && (
                        <Badge variant="info" size="sm" className="gap-1">
                          <DollarSign className="w-3 h-3" />
                          {formatCurrency(pendingData.pendingPayouts)}
                        </Badge>
                      )}
                      <ChevronRight className="w-5 h-5 text-brand-text-light group-hover:text-brand-primary transition-colors" />
                    </div>
                  </div>
                </Card>
              </Link>
            );
          })}
        </div>
      ) : (
        <Card className="p-8 border-none shadow-md">
          <EmptyState
            icon={Building2}
            title={searchQuery || filterBy !== "all" ? "ไม่พบทีมที่ค้นหา" : "ยังไม่มีทีม"}
            description={searchQuery || filterBy !== "all" ? "ลองเปลี่ยนคำค้นหาหรือตัวกรอง" : "สร้างทีมแรกเพื่อเริ่มจัดการ Worker"}
            action={
              !searchQuery && filterBy === "all" && (
                <Button onClick={handleOpenCreateModal} leftIcon={<Plus className="w-4 h-4" />}>
                  สร้างทีมแรก
                </Button>
              )
            }
          />
        </Card>
      )}

      {/* KYC Required Modal */}
      <KYCRequiredModal
        isOpen={showKYCModal}
        onClose={() => setShowKYCModal(false)}
        onStartKYC={() => {
          setShowKYCModal(false);
          router.push("/seller/settings/verification");
        }}
        requiredLevel="verified"
        currentLevel={currentKYCLevel}
        action="create_team"
        userType="seller"
      />

      {/* Create Team Dialog */}
      <Dialog
        open={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        size="md"
      >
        <Dialog.Header>
          <Dialog.Title>สร้างทีมใหม่</Dialog.Title>
          <Dialog.Description>สร้างทีมเพื่อบริหารจัดการ Worker และงาน</Dialog.Description>
        </Dialog.Header>
        
        <Dialog.Body>
          <VStack gap={4}>
            <div>
              <label className="block text-sm font-medium text-brand-text-dark mb-1.5">
                ชื่อทีม <span className="text-brand-error">*</span>
              </label>
              <Input
                placeholder="เช่น TikTok Team"
                value={newTeamName}
                onChange={(e) => setNewTeamName(e.target.value)}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-brand-text-dark mb-1.5">
                คำอธิบาย
              </label>
              <textarea
                className="w-full p-3 rounded-xl border border-brand-border/50 focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/20 outline-none resize-none text-sm"
                rows={2}
                placeholder="ทีมเฉพาะทาง TikTok"
                value={newTeamDescription}
                onChange={(e) => setNewTeamDescription(e.target.value)}
              />
            </div>

            {/* Content Guidelines */}
            <div className="border-t border-brand-border/50 pt-4">
              <ContentGuidelines variant="compact" />
            </div>

            {/* Guidelines Agreement */}
            <div className="flex items-start gap-3 p-4 bg-amber-50 border border-amber-200 rounded-lg">
              <Checkbox
                checked={guidelinesAccepted}
                onChange={(checked) => setGuidelinesAccepted(checked)}
                className="mt-1"
              />
              <span 
                className="text-sm text-amber-800 cursor-pointer leading-relaxed"
                onClick={() => setGuidelinesAccepted(!guidelinesAccepted)}
              >
                ข้าพเจ้าได้อ่านและยอมรับกฎข้อห้ามข้างต้น และเข้าใจว่าในฐานะหัวหน้าทีม 
                ข้าพเจ้าต้องรับผิดชอบร่วมหากสมาชิกในทีมทำผิดกฎ
              </span>
            </div>
          </VStack>
        </Dialog.Body>
        
        <Dialog.Footer>
          <Button variant="outline" onClick={() => setIsCreateModalOpen(false)}>
            ยกเลิก
          </Button>
          <Button onClick={handleCreateTeam} disabled={!guidelinesAccepted}>
            สร้างทีม
          </Button>
        </Dialog.Footer>
      </Dialog>
    </div>
  );
}
