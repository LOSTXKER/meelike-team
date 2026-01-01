"use client";

import { useState } from "react";
import Link from "next/link";
import { useAuthStore } from "@/lib/store";
import { StatsCard, Card, Badge, Button, Progress, Skeleton, SkeletonCard, Modal, Input } from "@/components/ui";
import { ServiceTypeBadge, EmptyState, StatsGrid } from "@/components/shared";
import { formatCurrency, formatDateTime } from "@/lib/utils";
import { useSellerStats, useSellerOrders, useSellerTeams } from "@/lib/api/hooks";
import {
  DollarSign,
  ShoppingBag,
  Users,
  Star,
  ArrowRight,
  Package,
  ClipboardList,
  Store,
  CreditCard,
  Wallet,
  Building2,
  ChevronRight,
  Eye,
  EyeOff,
  Clock,
  Plus,
  Search,
  TrendingUp,
  CheckCircle,
  ArrowUpRight,
} from "lucide-react";

export default function SellerDashboard() {
  const { user } = useAuthStore();
  const seller = user?.seller;

  // Modal & search state
  const [isCreateTeamModalOpen, setIsCreateTeamModalOpen] = useState(false);
  const [newTeamName, setNewTeamName] = useState("");
  const [newTeamDescription, setNewTeamDescription] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  // Use API hooks
  const { data: stats, isLoading: statsLoading } = useSellerStats();
  const { data: orders, isLoading: ordersLoading } = useSellerOrders();
  const { data: teams, isLoading: teamsLoading } = useSellerTeams();

  const isLoading = statsLoading || ordersLoading || teamsLoading;

  // Filter teams by search
  const filteredTeams = teams?.filter(team => 
    team.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    team.description?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Calculate team summary
  const teamSummary = {
    total: teams?.length || 0,
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

  return (
    <div className="space-y-8 animate-fade-in max-w-7xl mx-auto">
      {/* Welcome & Stats */}
      <section className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-brand-text-dark tracking-tight">
              สวัสดี, {seller?.displayName}
            </h1>
            <p className="text-brand-text-light mt-1 text-lg">
              วันนี้ร้านของคุณดูดีมากเลยนะ 🌟
            </p>
          </div>
          <Link href="/seller/orders/new">
            <Button size="lg" className="rounded-full px-8 shadow-lg shadow-brand-primary/20">
              + สร้างออเดอร์
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
          {statsLoading ? (
            <>
              <SkeletonCard className="h-[120px]" />
              <SkeletonCard className="h-[120px]" />
              <SkeletonCard className="h-[120px]" />
              <SkeletonCard className="h-[120px]" />
            </>
          ) : (
            <>
              <StatsCard
                title="รายได้เดือนนี้"
                value={formatCurrency(stats?.monthRevenue || 0)}
                icon={<DollarSign className="w-6 h-6" />}
                change={12.5}
                changeLabel="จากเดือนก่อน"
                className="border-none shadow-lg shadow-brand-primary/5 hover:-translate-y-1 transition-transform duration-300"
              />
              <StatsCard
                title="ออเดอร์รอดำเนินการ"
                value={orders?.filter(o => o.status === 'pending' || o.status === 'processing').length || 0}
                icon={<ShoppingBag className="w-6 h-6" />}
                className="border-none shadow-lg shadow-brand-primary/5 hover:-translate-y-1 transition-transform duration-300"
              />
              <StatsCard
                title="Wallet"
                value={formatCurrency(seller?.balance || 0)}
                icon={<Wallet className="w-6 h-6" />}
                className="border-none shadow-lg shadow-brand-primary/5 hover:-translate-y-1 transition-transform duration-300"
              />
              <StatsCard
                title="ทีมทั้งหมด"
                value={`${teamSummary.total} ทีม`}
                icon={<Building2 className="w-6 h-6" />}
                className="border-none shadow-lg shadow-brand-primary/5 hover:-translate-y-1 transition-transform duration-300"
              />
            </>
          )}
        </div>
      </section>

      {/* ===== TEAM MANAGEMENT SECTION ===== */}
      <section className="space-y-6">
        {/* Header with Create Button */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-brand-primary to-brand-primary/70 flex items-center justify-center shadow-md">
              <Building2 className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-brand-text-dark">จัดการทีม</h2>
              <p className="text-brand-text-light text-sm">เลือกทีมเพื่อจัดการสมาชิก งาน และการจ่ายเงิน</p>
            </div>
          </div>
          <Button 
            onClick={() => setIsCreateTeamModalOpen(true)} 
            leftIcon={<Plus className="w-4 h-4" />}
            className="rounded-full shadow-lg shadow-brand-primary/20"
          >
            สร้างทีมใหม่
          </Button>
        </div>

        {/* Stats Summary */}
        <StatsGrid
          stats={[
            {
              label: "ทีมทั้งหมด",
              value: teamSummary.total,
              icon: Building2,
              iconColor: "text-brand-primary",
              iconBgColor: "bg-brand-primary/10",
            },
            {
              label: "สมาชิกรวม",
              value: teamSummary.totalMembers,
              icon: Users,
              iconColor: "text-brand-primary",
              iconBgColor: "bg-brand-secondary",
            },
            {
              label: "งานกำลังทำ",
              value: teamSummary.totalActiveJobs,
              icon: ClipboardList,
              iconColor: "text-brand-info",
              iconBgColor: "bg-brand-info/10",
            },
            {
              label: "งานสำเร็จรวม",
              value: teamSummary.totalCompleted.toLocaleString(),
              icon: CheckCircle,
              iconColor: "text-brand-success",
              iconBgColor: "bg-brand-success/10",
            },
          ]}
          columns={4}
        />

        {/* Search */}
        {teams && teams.length > 2 && (
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-brand-text-light" />
            <Input
              placeholder="ค้นหาทีม..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-12"
            />
          </div>
        )}

        {/* Teams Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {teamsLoading ? (
            <>
              <Skeleton className="h-64 rounded-2xl" />
              <Skeleton className="h-64 rounded-2xl" />
              <Skeleton className="h-64 rounded-2xl" />
            </>
          ) : filteredTeams?.map((team) => {
            const pendingData = getTeamPendingData(team.id);
            
            return (
              <Link key={team.id} href={`/seller/team/${team.id}`}>
                <Card 
                  variant="elevated" 
                  className="h-full border-none shadow-md hover:shadow-xl transition-all cursor-pointer group overflow-hidden relative"
                >
                  {/* Background decoration */}
                  <div className="absolute top-0 right-0 w-32 h-32 bg-brand-primary/5 rounded-full -translate-y-1/2 translate-x-1/2" />
                  
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
          {!teamsLoading && (
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
          )}
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
      </section>
      {/* ===== END TEAM MANAGEMENT SECTION ===== */}

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Quick Actions */}
        <div className="space-y-6 lg:col-start-3 lg:row-start-1">
          <section className="space-y-4">
            <h2 className="text-xl font-bold text-brand-text-dark">เมนูด่วน</h2>
            <div className="grid grid-cols-2 gap-3">
              {[
                {
                  label: "บริการ",
                  href: "/seller/services",
                  icon: <Package className="w-5 h-5" />,
                },
                {
                  label: "หน้าร้าน",
                  href: `/s/${seller?.storeSlug}`,
                  icon: <Store className="w-5 h-5" />,
                },
                {
                  label: "เติมเงิน",
                  href: "/seller/finance/topup",
                  icon: <CreditCard className="w-5 h-5" />,
                },
                {
                  label: "ออเดอร์",
                  href: "/seller/orders",
                  icon: <ShoppingBag className="w-5 h-5" />,
                },
              ].map((action, i) => (
                <Link key={i} href={action.href}>
                  <div className="bg-brand-surface border border-brand-border text-brand-text-dark hover:border-brand-primary/50 hover:shadow-md p-4 rounded-xl transition-all duration-200 flex flex-col items-center justify-center gap-2 h-24 text-center cursor-pointer group">
                    <div className="p-2 rounded-full bg-brand-bg group-hover:bg-brand-primary/10 group-hover:text-brand-primary transition-colors">
                      {action.icon}
                    </div>
                    <span className="font-semibold text-sm">
                      {action.label}
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        </div>

        {/* Recent Orders */}
        <div className="lg:col-span-2 space-y-6 lg:col-start-1 lg:row-start-1">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-brand-text-dark flex items-center gap-2">
              <Package className="w-6 h-6 text-brand-primary" />
              ออเดอร์ล่าสุด
            </h2>
            <Link
              href="/seller/orders"
              className="text-sm font-medium text-brand-primary hover:text-brand-primary-dark hover:underline flex items-center gap-1 transition-colors"
            >
              ดูทั้งหมด <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="space-y-4">
            {ordersLoading ? (
              <>
                <SkeletonCard className="h-[200px]" />
                <SkeletonCard className="h-[200px]" />
              </>
            ) : orders && orders.length > 0 ? (
              orders.slice(0, 3).map((order) => (
              <Card 
                key={order.id} 
                variant="elevated" 
                className="group hover:border-brand-primary/20 transition-all duration-300 shadow-sm hover:shadow-md border border-transparent"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-brand-secondary flex items-center justify-center text-brand-text-dark font-bold text-lg border border-brand-border">
                      {order.orderNumber.slice(-2)}
                    </div>
                    <div>
                      <p className="font-bold text-brand-text-dark text-lg">
                        {order.customer.name}
                      </p>
                      <p className="text-sm font-medium text-brand-text-light flex items-center gap-2">
                        {order.orderNumber} • {formatDateTime(order.createdAt)}
                      </p>
                    </div>
                  </div>
                  <Badge
                    variant={
                      order.status === "completed"
                        ? "success"
                        : order.status === "processing"
                        ? "info"
                        : order.status === "cancelled"
                        ? "error"
                        : "warning"
                    }
                    className="self-start sm:self-center px-4 py-1.5 text-xs font-bold uppercase tracking-wide rounded-full shadow-sm"
                  >
                    {order.status === "completed"
                      ? "✓ เสร็จแล้ว"
                      : order.status === "processing"
                      ? "⚡ กำลังทำ"
                      : order.status === "cancelled"
                      ? "✕ ยกเลิก"
                      : "⏳ รอดำเนินการ"}
                  </Badge>
                </div>

                <div className="pl-0 sm:pl-[4rem] space-y-3">
                  {order.items.slice(0, 2).map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center justify-between text-sm p-3 rounded-lg bg-brand-secondary/50 border border-brand-border/50"
                    >
                      <div className="flex items-center gap-3">
                        <ServiceTypeBadge type={item.serviceType} />
                        <span className="font-semibold text-brand-text-dark">
                          {item.serviceName}
                        </span>
                      </div>
                      <span className="text-brand-text-dark font-medium">
                        {item.completedQuantity}/{item.quantity}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="flex items-center justify-between mt-5 pt-4 border-t border-brand-border/50">
                  <span className="text-lg font-bold text-brand-primary">
                    {formatCurrency(order.total)}
                  </span>
                  <div className="flex items-center gap-3 w-1/3">
                    <span className="text-xs font-medium text-brand-text-light">ความคืบหน้า</span>
                    <Progress
                      value={order.progress}
                      size="sm"
                      className="flex-1 h-2"
                    />
                  </div>
                </div>
              </Card>
              ))
            ) : (
              <EmptyState
                icon={Package}
                title="ยังไม่มีออเดอร์"
                description="สร้างออเดอร์แรกของคุณได้เลย หรือแชร์ร้านค้าให้ลูกค้าเห็น"
                action={
                  <Link href="/seller/orders/new">
                    <Button>สร้างออเดอร์แรก</Button>
                  </Link>
                }
              />
            )}
          </div>
        </div>
      </div>

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
