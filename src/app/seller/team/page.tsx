"use client";

import { useState } from "react";
import Link from "next/link";
import { Card, Button, Badge, Modal, Input, Skeleton } from "@/components/ui";
import { PageHeader, StatsGrid } from "@/components/shared";
import { formatCurrency } from "@/lib/utils";
import { useSellerTeams } from "@/lib/api/hooks";
import { 
  Users, 
  Star,
  CheckCircle,
  ClipboardList,
  DollarSign,
  ChevronRight,
  Plus,
  Building2,
  Eye,
  EyeOff,
  ArrowRight,
  Clock,
  TrendingUp,
  Search,
} from "lucide-react";

export default function TeamPickerPage() {
  const [isCreateTeamModalOpen, setIsCreateTeamModalOpen] = useState(false);
  const [newTeamName, setNewTeamName] = useState("");
  const [newTeamDescription, setNewTeamDescription] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  // Use API hooks
  const { data: teams, isLoading } = useSellerTeams();

  // Filter teams by search
  const filteredTeams = teams?.filter(team => 
    team.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    team.description?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Calculate summary stats
  const summaryStats = {
    totalTeams: teams?.length || 0,
    totalMembers: teams?.reduce((sum, t) => sum + t.memberCount, 0) || 0,
    totalActiveJobs: teams?.reduce((sum, t) => sum + t.activeJobCount, 0) || 0,
    totalCompleted: teams?.reduce((sum, t) => sum + t.totalJobsCompleted, 0) || 0,
  };

  // Mock pending data per team (would come from API)
  const getTeamPendingData = (teamId: string) => {
    const mockData: Record<string, { pendingReviews: number; pendingPayouts: number }> = {
      "team-1": { pendingReviews: 5, pendingPayouts: 2450 },
      "team-2": { pendingReviews: 7, pendingPayouts: 1800 },
      "team-3": { pendingReviews: 0, pendingPayouts: 0 },
    };
    return mockData[teamId] || { pendingReviews: 0, pendingPayouts: 0 };
  };

  const handleCreateTeam = () => {
    if (!newTeamName.trim()) {
      alert("กรุณาใส่ชื่อทีม");
      return;
    }
    alert(`สร้างทีม "${newTeamName}" สำเร็จ!`);
    setIsCreateTeamModalOpen(false);
    setNewTeamName("");
    setNewTeamDescription("");
  };

  if (isLoading) {
    return (
      <div className="space-y-8 animate-fade-in max-w-7xl mx-auto">
        <Skeleton className="h-20 w-full rounded-xl" />
        <div className="grid grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-28 rounded-xl" />
          ))}
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-64 rounded-xl" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fade-in max-w-7xl mx-auto">
      {/* Header */}
      <PageHeader
        title="เลือกทีมที่ต้องการจัดการ"
        description="จัดการสมาชิก งาน และการจ่ายเงินของแต่ละทีม"
        icon={Building2}
        action={
          <Button 
            onClick={() => setIsCreateTeamModalOpen(true)} 
            leftIcon={<Plus className="w-4 h-4" />}
            className="rounded-full shadow-lg shadow-brand-primary/20"
          >
            สร้างทีมใหม่
          </Button>
        }
      />

      {/* Summary Stats */}
      <StatsGrid
        stats={[
          {
            label: "ทีมทั้งหมด",
            value: summaryStats.totalTeams,
            icon: Building2,
            iconColor: "text-brand-primary",
            iconBgColor: "bg-brand-primary/10",
          },
          {
            label: "สมาชิกรวม",
            value: summaryStats.totalMembers,
            icon: Users,
            iconColor: "text-brand-primary",
            iconBgColor: "bg-brand-secondary",
          },
          {
            label: "งานกำลังทำ",
            value: summaryStats.totalActiveJobs,
            icon: ClipboardList,
            iconColor: "text-brand-info",
            iconBgColor: "bg-brand-info/10",
          },
          {
            label: "งานสำเร็จรวม",
            value: summaryStats.totalCompleted.toLocaleString(),
            icon: CheckCircle,
            iconColor: "text-brand-success",
            iconBgColor: "bg-brand-success/10",
          },
        ]}
        columns={4}
      />

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-brand-text-light" />
        <Input
          placeholder="ค้นหาทีม..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-12"
        />
      </div>

      {/* Teams Grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTeams?.map((team) => {
          const pendingData = getTeamPendingData(team.id);
          
          return (
            <Link key={team.id} href={`/seller/team/${team.id}`}>
              <Card 
                variant="elevated" 
                className="h-full border-none shadow-md hover:shadow-xl transition-all cursor-pointer group overflow-hidden relative"
              >
                {/* Background decoration */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-brand-primary/5 rounded-full -translate-y-1/2 translate-x-1/2"></div>
                
                {/* Team Header */}
                <div className="flex items-start gap-4 mb-4 relative z-10">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-brand-primary to-brand-primary/70 flex items-center justify-center text-white text-2xl font-bold shadow-lg shadow-brand-primary/30 group-hover:scale-105 transition-transform">
                    {team.name.charAt(0)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <h3 className="font-bold text-brand-text-dark text-lg group-hover:text-brand-primary transition-colors truncate">
                        {team.name}
                      </h3>
                      {team.isPublic ? (
                        <Eye className="w-4 h-4 text-brand-success shrink-0" />
                      ) : (
                        <EyeOff className="w-4 h-4 text-brand-text-light shrink-0" />
                      )}
                    </div>
                    <p className="text-sm text-brand-text-light line-clamp-2 mt-1">{team.description}</p>
                  </div>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-3 gap-2 mb-4">
                  <div className="text-center p-3 bg-brand-bg/50 rounded-xl">
                    <div className="flex items-center justify-center gap-1 mb-1">
                      <Users className="w-4 h-4 text-brand-primary" />
                    </div>
                    <p className="text-lg font-bold text-brand-text-dark">{team.memberCount}</p>
                    <p className="text-xs text-brand-text-light">สมาชิก</p>
                  </div>
                  <div className="text-center p-3 bg-brand-bg/50 rounded-xl">
                    <div className="flex items-center justify-center gap-1 mb-1">
                      <ClipboardList className="w-4 h-4 text-brand-info" />
                    </div>
                    <p className="text-lg font-bold text-brand-text-dark">{team.activeJobCount}</p>
                    <p className="text-xs text-brand-text-light">งานเปิด</p>
                  </div>
                  <div className="text-center p-3 bg-brand-bg/50 rounded-xl">
                    <div className="flex items-center justify-center gap-1 mb-1">
                      <Star className="w-4 h-4 text-brand-warning fill-brand-warning" />
                    </div>
                    <p className="text-lg font-bold text-brand-text-dark">{team.rating.toFixed(1)}</p>
                    <p className="text-xs text-brand-text-light">Rating</p>
                  </div>
                </div>

                {/* Pending Actions */}
                {(pendingData.pendingReviews > 0 || pendingData.pendingPayouts > 0) && (
                  <div className="flex flex-wrap gap-2 pt-3 border-t border-brand-border/30">
                    {pendingData.pendingReviews > 0 && (
                      <Badge variant="warning" size="sm" className="gap-1">
                        <Clock className="w-3 h-3" />
                        {pendingData.pendingReviews} รอตรวจ
                      </Badge>
                    )}
                    {pendingData.pendingPayouts > 0 && (
                      <Badge variant="info" size="sm" className="gap-1">
                        <DollarSign className="w-3 h-3" />
                        {formatCurrency(pendingData.pendingPayouts)} รอจ่าย
                      </Badge>
                    )}
                  </div>
                )}

                {/* Status & Arrow */}
                <div className="flex items-center justify-between mt-4 pt-3 border-t border-brand-border/30">
                  <Badge 
                    variant={team.isActive ? "success" : "default"} 
                    size="sm"
                  >
                    {team.isActive ? "🟢 Active" : "⚪ Inactive"}
                  </Badge>
                  <div className="flex items-center gap-1 text-sm font-medium text-brand-primary opacity-0 group-hover:opacity-100 transition-opacity">
                    จัดการทีม <ArrowRight className="w-4 h-4" />
                  </div>
                </div>
              </Card>
            </Link>
          );
        })}

        {/* Add New Team Card */}
        <button
          onClick={() => setIsCreateTeamModalOpen(true)}
          className="h-full min-h-[280px] border-2 border-dashed border-brand-border/50 rounded-2xl flex flex-col items-center justify-center gap-4 text-brand-text-light hover:text-brand-primary hover:border-brand-primary/50 hover:bg-brand-primary/5 transition-all group"
        >
          <div className="w-16 h-16 rounded-2xl bg-brand-bg flex items-center justify-center group-hover:bg-brand-primary/10 transition-colors">
            <Plus className="w-8 h-8" />
          </div>
          <div className="text-center">
            <p className="font-bold text-lg">สร้างทีมใหม่</p>
            <p className="text-sm opacity-70">แยกจัดการงานแต่ละประเภท</p>
          </div>
        </button>
      </div>

      {/* Tips */}
      <Card variant="bordered" className="bg-gradient-to-r from-brand-info/5 to-brand-primary/5 border-brand-info/20">
        <div className="flex items-start gap-4">
          <div className="p-3 bg-brand-info/10 rounded-xl text-brand-info shrink-0">
            <TrendingUp className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-bold text-brand-text-dark mb-2">💡 เคล็ดลับการจัดการหลายทีม</h3>
            <ul className="text-sm text-brand-text-light space-y-1">
              <li>• <strong>แยกทีมตามแพลตฟอร์ม</strong> - Facebook, TikTok, Instagram ช่วยให้จัดการง่ายขึ้น</li>
              <li>• <strong>แยกทีมตามระดับ</strong> - VIP, Premium, ปกติ สำหรับงานที่ต้องการคุณภาพต่างกัน</li>
              <li>• <strong>ใช้ผู้ช่วย</strong> - แต่งตั้ง Assistant ช่วยตรวจงานและจัดการสมาชิก</li>
            </ul>
          </div>
        </div>
      </Card>

      {/* Create Team Modal */}
      <Modal
        isOpen={isCreateTeamModalOpen}
        onClose={() => setIsCreateTeamModalOpen(false)}
        title="🏢 สร้างทีมใหม่"
        size="md"
      >
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-bold text-brand-text-dark mb-2">
              ชื่อทีม <span className="text-brand-error">*</span>
            </label>
            <Input
              placeholder="เช่น MyBoost TikTok Team"
              value={newTeamName}
              onChange={(e) => setNewTeamName(e.target.value)}
            />
            <p className="text-xs text-brand-text-light mt-1">
              ตั้งชื่อที่จดจำง่าย แยกตามแพลตฟอร์มหรือประเภทงาน
            </p>
          </div>

          <div>
            <label className="block text-sm font-bold text-brand-text-dark mb-2">
              คำอธิบายทีม
            </label>
            <textarea
              className="w-full p-3 rounded-xl border border-brand-border/50 focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/20 outline-none resize-none"
              rows={3}
              placeholder="เช่น ทีมเฉพาะทาง TikTok งานเยอะ จ่ายไว"
              value={newTeamDescription}
              onChange={(e) => setNewTeamDescription(e.target.value)}
            />
          </div>

          <div className="p-4 rounded-xl bg-brand-info/10 border border-brand-info/20">
            <p className="text-sm text-brand-info">
              💡 คุณสามารถสร้างหลายทีมเพื่อแยกจัดการงานประเภทต่างๆ เช่น:
            </p>
            <ul className="mt-2 ml-4 text-xs text-brand-text-light list-disc space-y-1">
              <li>แยกตามแพลตฟอร์ม (Facebook, TikTok, Instagram)</li>
              <li>แยกตามประเภทงาน (ไลค์, เม้น, Follow)</li>
              <li>แยกตามระดับ (ทีม VIP, ทีมปกติ)</li>
            </ul>
          </div>

          <div className="flex gap-3 pt-2">
            <Button
              variant="outline"
              onClick={() => setIsCreateTeamModalOpen(false)}
              className="flex-1"
            >
              ยกเลิก
            </Button>
            <Button
              onClick={handleCreateTeam}
              className="flex-1 shadow-md shadow-brand-primary/20"
            >
              <Plus className="w-4 h-4 mr-2" />
              สร้างทีม
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
