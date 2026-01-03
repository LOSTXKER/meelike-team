"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Card, Button, Badge, Input, Dialog, Progress, Dropdown } from "@/components/ui";
import { Container, Grid, Section, VStack, HStack } from "@/components/layout";
import { PageHeader, StatsGrid, EmptyState, InfoCard } from "@/components/shared";
import { formatCurrency } from "@/lib/utils";
import { useSellerTeams, useTeamPayouts, useTransactions } from "@/lib/api/hooks";
import { api } from "@/lib/api";
import {
  Building2,
  Users,
  Star,
  ArrowRight,
  Plus,
  Search,
  Filter,
  TrendingUp,
  TrendingDown,
  DollarSign,
  ClipboardList,
  CheckCircle,
  Clock,
  Eye,
  EyeOff,
  MoreVertical,
  Settings,
  Trash2,
  BarChart3,
  Trophy,
  Target,
  Zap,
  ChevronRight,
} from "lucide-react";

type SortOption = "name" | "members" | "rating" | "jobs" | "earnings";
type FilterOption = "all" | "active" | "inactive";

export default function TeamCenterPage() {
  const router = useRouter();
  const { data: teams, isLoading, refetch } = useSellerTeams();
  const { data: allPayouts } = useTeamPayouts();
  const { data: allTransactions } = useTransactions();
  
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<SortOption>("earnings");
  const [filterBy, setFilterBy] = useState<FilterOption>("all");
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [newTeamName, setNewTeamName] = useState("");
  const [newTeamDescription, setNewTeamDescription] = useState("");

  // Calculate real earnings data per team from payouts/transactions
  const getTeamEarnings = (teamId: string) => {
    if (!allPayouts || !allTransactions) {
      return { thisMonth: 0, lastMonth: 0, total: 0 };
    }
    
    // Get payouts related to this team (filter by worker's team membership would be ideal)
    // For now, calculate from completed payouts
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
    
    // Calculate pending payouts for this team
    const pendingPayouts = allPayouts.filter(p => 
      p.status === "pending"
      // Would ideally filter by team membership
    );
    
    const pendingAmount = pendingPayouts.reduce((sum, p) => sum + p.amount, 0);
    
    return {
      pendingReviews: 0, // Would derive from JOB_CLAIMS with status "submitted"
      pendingPayouts: pendingAmount,
    };
  };

  // Calculate totals
  const totals = useMemo(() => {
    if (!teams) return { teams: 0, members: 0, activeJobs: 0, completed: 0, earnings: 0, pendingReviews: 0 };
    
    return {
      teams: teams.length,
      members: teams.reduce((sum, t) => sum + t.memberCount, 0),
      activeJobs: teams.reduce((sum, t) => sum + t.activeJobCount, 0),
      completed: teams.reduce((sum, t) => sum + t.totalJobsCompleted, 0),
      earnings: teams.reduce((sum, t) => sum + getTeamEarnings(t.id).thisMonth, 0),
      pendingReviews: teams.reduce((sum, t) => sum + getTeamPendingData(t.id).pendingReviews, 0),
    };
  }, [teams]);

  // Filter and sort teams
  const filteredTeams = useMemo(() => {
    if (!teams) return [];
    
    let result = [...teams];
    
    // Filter by search
    if (searchQuery) {
      result = result.filter(t => 
        t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.description?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    // Filter by status
    if (filterBy === "active") {
      result = result.filter(t => t.isActive);
    } else if (filterBy === "inactive") {
      result = result.filter(t => !t.isActive);
    }
    
    // Sort
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

  // Find best performing team
  const bestTeam = useMemo(() => {
    if (!teams || teams.length === 0) return null;
    return teams.reduce((best, team) => {
      const earnings = getTeamEarnings(team.id).thisMonth;
      const bestEarnings = getTeamEarnings(best.id).thisMonth;
      return earnings > bestEarnings ? team : best;
    });
  }, [teams]);

  const handleCreateTeam = async () => {
    if (!newTeamName.trim()) {
      alert("กรุณาใส่ชื่อทีม");
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
      
      // Navigate to the new team
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
    <Container size="xl">
      <div className="space-y-6 animate-fade-in">
        {/* Header */}
        <HStack justify="between" align="center" className="flex-col sm:flex-row gap-4">
          <VStack gap={1}>
            <HStack gap={3} align="center">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-brand-primary to-brand-primary/70 flex items-center justify-center">
                <Building2 className="w-5 h-5 text-white" />
              </div>
              <h1 className="text-2xl font-bold text-brand-text-dark">Team Center</h1>
            </HStack>
            <p className="text-brand-text-light">จัดการและติดตามผลงานทุกทีมในที่เดียว</p>
          </VStack>
          <Button
            onClick={() => setIsCreateModalOpen(true)}
            className="rounded-full shadow-lg shadow-brand-primary/20"
          >
            <Plus className="w-4 h-4 mr-2" />
            สร้างทีมใหม่
          </Button>
        </HStack>

        {/* Overview Stats */}
        <Grid cols={2} responsive={{ md: 3, lg: 6 }} gap={4}>
        <Card className="p-4 border-none shadow-md bg-gradient-to-br from-brand-primary/5 to-brand-primary/10">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-brand-primary/10">
              <Building2 className="w-5 h-5 text-brand-primary" />
            </div>
            <div>
              <p className="text-2xl font-bold text-brand-text-dark">{totals.teams}</p>
              <p className="text-xs text-brand-text-light">ทีมทั้งหมด</p>
            </div>
          </div>
        </Card>
        
        <Card className="p-4 border-none shadow-md">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-blue-100">
              <Users className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-brand-text-dark">{totals.members}</p>
              <p className="text-xs text-brand-text-light">สมาชิกรวม</p>
            </div>
          </div>
        </Card>
        
        <Card className="p-4 border-none shadow-md">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-purple-100">
              <ClipboardList className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-brand-text-dark">{totals.activeJobs}</p>
              <p className="text-xs text-brand-text-light">งานกำลังทำ</p>
            </div>
          </div>
        </Card>
        
        <Card className="p-4 border-none shadow-md">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-emerald-100">
              <CheckCircle className="w-5 h-5 text-emerald-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-brand-text-dark">{totals.completed.toLocaleString()}</p>
              <p className="text-xs text-brand-text-light">งานสำเร็จ</p>
            </div>
          </div>
        </Card>
        
        <Card className="p-4 border-none shadow-md bg-gradient-to-br from-emerald-50 to-emerald-100">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-emerald-500/20">
              <DollarSign className="w-5 h-5 text-emerald-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-emerald-700">{formatCurrency(totals.earnings)}</p>
              <p className="text-xs text-emerald-600">รายได้เดือนนี้</p>
            </div>
          </div>
        </Card>
        
        <Card className="p-4 border-none shadow-md bg-gradient-to-br from-amber-50 to-amber-100">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-amber-500/20">
              <Clock className="w-5 h-5 text-amber-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-amber-700">{totals.pendingReviews}</p>
              <p className="text-xs text-amber-600">รอตรวจงาน</p>
            </div>
          </div>
        </Card>
        </Grid>

        {/* Best Performer Highlight */}
      {bestTeam && (
        <Card className="p-4 border-none shadow-md bg-gradient-to-r from-amber-50 via-yellow-50 to-amber-50 overflow-hidden relative">
          <div className="absolute -right-4 -top-4 opacity-10">
            <Trophy className="w-32 h-32 text-amber-500" />
          </div>
          <div className="flex items-center gap-4 relative z-10">
            <div className="p-3 rounded-2xl bg-gradient-to-br from-amber-400 to-yellow-500 shadow-lg">
              <Trophy className="w-6 h-6 text-white" />
            </div>
            <div className="flex-1">
              <p className="text-sm text-amber-700 font-medium">🏆 ทีมยอดเยี่ยมประจำเดือน</p>
              <p className="text-xl font-bold text-brand-text-dark">{bestTeam.name}</p>
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold text-amber-600">{formatCurrency(getTeamEarnings(bestTeam.id).thisMonth)}</p>
              <p className="text-xs text-amber-600">รายได้เดือนนี้</p>
            </div>
            <Link href={`/seller/team/${bestTeam.id}`}>
              <Button size="sm" variant="outline" className="border-amber-300 text-amber-700 hover:bg-amber-100">
                ดูรายละเอียด
              </Button>
            </Link>
          </div>
        </Card>
      )}

      {/* Filters & Search */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-brand-text-light" />
          <Input
            placeholder="ค้นหาทีม..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-12"
          />
        </div>
        <div className="flex gap-2">
          <select
            value={filterBy}
            onChange={(e) => setFilterBy(e.target.value as FilterOption)}
            className="px-4 py-2 rounded-xl border border-brand-border/50 bg-white text-sm focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/20 outline-none"
          >
            <option value="all">ทั้งหมด</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as SortOption)}
            className="px-4 py-2 rounded-xl border border-brand-border/50 bg-white text-sm focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/20 outline-none"
          >
            <option value="earnings">เรียงตามรายได้</option>
            <option value="members">เรียงตามสมาชิก</option>
            <option value="rating">เรียงตาม Rating</option>
            <option value="jobs">เรียงตามงาน</option>
            <option value="name">เรียงตามชื่อ</option>
          </select>
        </div>
      </div>

      {/* Teams List */}
      {isLoading ? (
        <div className="grid gap-4">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="p-6 animate-pulse">
              <div className="flex gap-4">
                <div className="w-16 h-16 rounded-2xl bg-brand-bg" />
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
              <Card 
                key={team.id} 
                className="p-5 border-none shadow-md hover:shadow-lg transition-all group"
              >
                <div className="flex flex-col lg:flex-row lg:items-center gap-4">
                  {/* Team Info */}
                  <div className="flex items-center gap-4 flex-1 min-w-0">
                    <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${colorClass} flex items-center justify-center text-white text-xl font-bold shadow-lg shrink-0`}>
                      {team.name.charAt(0)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="font-bold text-lg text-brand-text-dark truncate">
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
                    <div className="text-center min-w-[60px]">
                      <div className="flex items-center justify-center gap-1 text-brand-primary">
                        <Users className="w-4 h-4" />
                        <span className="text-lg font-bold text-brand-text-dark">{team.memberCount}</span>
                      </div>
                      <p className="text-xs text-brand-text-light">สมาชิก</p>
                    </div>
                    
                    <div className="text-center min-w-[60px]">
                      <div className="flex items-center justify-center gap-1">
                        <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
                        <span className="text-lg font-bold text-brand-text-dark">{team.rating.toFixed(1)}</span>
                      </div>
                      <p className="text-xs text-brand-text-light">Rating</p>
                    </div>
                    
                    <div className="text-center min-w-[60px]">
                      <div className="flex items-center justify-center gap-1 text-purple-600">
                        <ClipboardList className="w-4 h-4" />
                        <span className="text-lg font-bold text-brand-text-dark">{team.activeJobCount}</span>
                      </div>
                      <p className="text-xs text-brand-text-light">งานเปิด</p>
                    </div>

                    <div className="text-center min-w-[100px]">
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
                  <div className="flex items-center gap-2">
                    {pendingData.pendingReviews > 0 && (
                      <Badge variant="warning" size="sm" className="gap-1">
                        <Clock className="w-3 h-3" />
                        {pendingData.pendingReviews} รอตรวจ
                      </Badge>
                    )}
                    {pendingData.pendingPayouts > 0 && (
                      <Badge variant="info" size="sm" className="gap-1">
                        <DollarSign className="w-3 h-3" />
                        {formatCurrency(pendingData.pendingPayouts)}
                      </Badge>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2">
                    <Link href={`/seller/team/${team.id}`}>
                      <Button size="sm" className="rounded-full">
                        จัดการ <ArrowRight className="w-4 h-4 ml-1" />
                      </Button>
                    </Link>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      ) : (
        <EmptyState
          icon={Building2}
          title={searchQuery || filterBy !== "all" ? "ไม่พบทีมที่ค้นหา" : "ยังไม่มีทีม"}
          description={searchQuery || filterBy !== "all" ? "ลองเปลี่ยนคำค้นหาหรือตัวกรอง" : "สร้างทีมแรกเพื่อเริ่มจัดการ Worker"}
          action={
            !searchQuery && filterBy === "all" && (
              <Button onClick={() => setIsCreateModalOpen(true)}>
                <Plus className="w-4 h-4 mr-2" />
                สร้างทีมแรก
              </Button>
            )
          }
        />
      )}

      <Dialog
        open={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        size="sm"
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
          </VStack>
        </Dialog.Body>
        
        <Dialog.Footer>
          <Button
            variant="outline"
            onClick={() => setIsCreateModalOpen(false)}
          >
            ยกเลิก
          </Button>
          <Button onClick={handleCreateTeam}>
            สร้างทีม
          </Button>
        </Dialog.Footer>
      </Dialog>
      </div>
    </Container>
  );
}
