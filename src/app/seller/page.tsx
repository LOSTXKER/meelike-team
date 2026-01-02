"use client";

import { useState } from "react";
import Link from "next/link";
import { useAuthStore } from "@/lib/store";
import { StatsCard, Card, Badge, Button, Progress, Skeleton, SkeletonCard, Modal, Input } from "@/components/ui";
import { ServiceTypeBadge, EmptyState, PlanBadge } from "@/components/shared";
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
  Wallet,
  Building2,
  Eye,
  EyeOff,
  Clock,
  Plus,
  Percent,
  ChevronRight,
  TrendingUp,
} from "lucide-react";
import { getRankConfig } from "@/lib/constants/plans";

export default function SellerDashboard() {
  const { user } = useAuthStore();
  const seller = user?.seller;

  const [isCreateTeamModalOpen, setIsCreateTeamModalOpen] = useState(false);
  const [newTeamName, setNewTeamName] = useState("");
  const [newTeamDescription, setNewTeamDescription] = useState("");

  const { data: stats, isLoading: statsLoading } = useSellerStats();
  const { data: orders, isLoading: ordersLoading } = useSellerOrders();
  const { data: teams, isLoading: teamsLoading } = useSellerTeams();

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
      {/* Header & Stats */}
      <section className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <div className="flex items-center gap-3 flex-wrap">
              <h1 className="text-2xl font-bold text-brand-text-dark">
                สวัสดี, {seller?.displayName} 👋
              </h1>
              {/* Current Plan Badge */}
              <PlanBadge 
                plan={seller?.plan || 'free'} 
                expiresAt={seller?.planExpiresAt}
              />
            </div>
            <p className="text-brand-text-light text-sm mt-1">
              ภาพรวมร้านค้าของคุณวันนี้
            </p>
          </div>
          <Link href="/seller/orders/new">
            <Button className="rounded-full px-6 shadow-lg shadow-brand-primary/20">
              + สร้างออเดอร์
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {statsLoading ? (
            <>
              <SkeletonCard className="h-[110px]" />
              <SkeletonCard className="h-[110px]" />
              <SkeletonCard className="h-[110px]" />
              <SkeletonCard className="h-[110px]" />
            </>
          ) : (
            <>
              {/* รายได้เดือนนี้ */}
              <Link href="/seller/finance">
                <div className="bg-white rounded-2xl p-4 shadow-md hover:shadow-lg hover:border-brand-primary/30 border border-transparent transition-all cursor-pointer group h-full relative overflow-hidden">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-brand-text-light">รายได้เดือนนี้</span>
                    <div className="p-1.5 rounded-full bg-brand-primary/10 text-brand-primary">
                      <DollarSign className="w-4 h-4" />
                    </div>
                  </div>
                  <p className="text-2xl font-bold text-brand-text-dark">{formatCurrency(stats?.monthRevenue || 0)}</p>
                  <div className="flex items-center gap-1 mt-1">
                    <TrendingUp className="w-3 h-3 text-brand-success" />
                    <span className="text-xs text-brand-success font-medium">+12.5%</span>
                    <span className="text-xs text-brand-text-light">จากเดือนก่อน</span>
                  </div>
                  {/* Hover indicator */}
                  <div className="absolute right-2 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <ChevronRight className="w-5 h-5 text-brand-primary" />
                  </div>
                </div>
              </Link>

              {/* ออเดอร์รอดำเนินการ */}
              <Link href="/seller/orders?status=pending">
                <div className="bg-white rounded-2xl p-4 shadow-md hover:shadow-lg hover:border-brand-primary/30 border border-transparent transition-all cursor-pointer group h-full relative overflow-hidden">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-brand-text-light">ออเดอร์รอดำเนินการ</span>
                    <div className="p-1.5 rounded-full bg-brand-warning/10 text-brand-warning">
                      <ShoppingBag className="w-4 h-4" />
                    </div>
                  </div>
                  <p className="text-2xl font-bold text-brand-text-dark">
                    {orders?.filter(o => o.status === 'pending' || o.status === 'processing').length || 0}
                  </p>
                  <p className="text-xs text-brand-text-light mt-1">รายการ</p>
                  {/* Hover indicator */}
                  <div className="absolute right-2 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <ChevronRight className="w-5 h-5 text-brand-primary" />
                  </div>
                </div>
              </Link>

              {/* Wallet */}
              <Link href="/seller/finance">
                <div className="bg-white rounded-2xl p-4 shadow-md hover:shadow-lg hover:border-brand-primary/30 border border-transparent transition-all cursor-pointer group h-full relative overflow-hidden">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-brand-text-light">Wallet</span>
                    <div className="p-1.5 rounded-full bg-brand-info/10 text-brand-info">
                      <Wallet className="w-4 h-4" />
                    </div>
                  </div>
                  <p className="text-2xl font-bold text-brand-text-dark">{formatCurrency(seller?.balance || 0)}</p>
                  <p className="text-xs text-brand-primary mt-1 group-hover:underline">เติมเงิน →</p>
                  {/* Hover indicator */}
                  <div className="absolute right-2 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <ChevronRight className="w-5 h-5 text-brand-primary" />
                  </div>
                </div>
              </Link>

              {/* Seller Rank */}
              <Link href="/seller/settings/subscription">
                <div className="bg-white rounded-2xl p-4 shadow-md hover:shadow-lg hover:border-brand-primary/30 border border-transparent transition-all cursor-pointer group h-full relative overflow-hidden">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-brand-text-light">Seller Rank</span>
                    <div className="p-1.5 rounded-full bg-brand-primary/10 text-brand-primary">
                      <Percent className="w-4 h-4" />
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xl">{getRankConfig(seller?.sellerRank || 'bronze').icon}</span>
                    <span className="text-lg font-bold text-brand-text-dark">
                      {getRankConfig(seller?.sellerRank || 'bronze').name}
                    </span>
                    <span 
                      className="text-xs font-bold px-2 py-0.5 rounded-full text-white ml-auto"
                      style={{ backgroundColor: getRankConfig(seller?.sellerRank || 'bronze').color }}
                    >
                      {seller?.platformFeePercent || 12}%
                    </span>
                  </div>
                  <p className="text-xs text-brand-primary mt-1 group-hover:underline">ดูสิทธิพิเศษ →</p>
                  {/* Hover indicator */}
                  <div className="absolute right-2 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <ChevronRight className="w-5 h-5 text-brand-primary" />
                  </div>
                </div>
              </Link>
            </>
          )}
        </div>
      </section>

      {/* Teams Section - Featured */}
      <section className="relative -mx-4 sm:-mx-6 lg:-mx-8 px-4 sm:px-6 lg:px-8 py-6 bg-gradient-to-br from-brand-primary/5 via-brand-secondary/30 to-brand-primary/10 rounded-3xl">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-4 right-8 w-24 h-24 bg-brand-primary/10 rounded-full blur-2xl" />
          <div className="absolute bottom-4 left-8 w-32 h-32 bg-brand-secondary/30 rounded-full blur-2xl" />
        </div>

        <div className="relative z-10">
          {/* Header */}
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-brand-primary to-brand-primary/70 flex items-center justify-center shadow-lg shadow-brand-primary/30">
                <Building2 className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-brand-text-dark">ทีมของฉัน</h2>
                <p className="text-sm text-brand-text-light">
                  {teams?.length || 0} ทีม • {teams?.reduce((sum, t) => sum + t.memberCount, 0) || 0} สมาชิก
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Link href="/seller/team">
                <Button variant="ghost" size="sm" className="text-brand-primary">
                  ดูทั้งหมด <ArrowRight className="w-4 h-4 ml-1" />
                </Button>
              </Link>
              <Button 
                onClick={() => setIsCreateTeamModalOpen(true)} 
                className="rounded-full shadow-lg shadow-brand-primary/20"
              >
                <Plus className="w-4 h-4 mr-1" />
                สร้างทีม
              </Button>
            </div>
          </div>

          {/* Teams - Horizontal Scroll on Mobile, Grid on Desktop */}
          <div className="relative">
            {teamsLoading ? (
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                <Skeleton className="h-52 rounded-2xl" />
                <Skeleton className="h-52 rounded-2xl" />
                <Skeleton className="h-52 rounded-2xl" />
              </div>
            ) : teams && teams.length > 0 ? (
              <div className="flex gap-4 overflow-x-auto pb-2 snap-x snap-mandatory scrollbar-hide sm:grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 sm:overflow-visible">
                {teams.map((team, index) => {
                  const pendingData = getTeamPendingData(team.id);
                  const colors = [
                    'from-brand-primary to-brand-primary/70',
                    'from-blue-500 to-blue-600',
                    'from-purple-500 to-purple-600',
                    'from-emerald-500 to-emerald-600',
                    'from-orange-500 to-orange-600',
                    'from-pink-500 to-pink-600',
                  ];
                  const colorClass = colors[index % colors.length];
                  
                  return (
                    <Link 
                      key={team.id} 
                      href={`/seller/team/${team.id}`}
                      className="snap-start shrink-0 w-[280px] sm:w-auto"
                    >
                      <div className="h-full bg-white rounded-2xl p-4 shadow-lg hover:shadow-xl transition-all cursor-pointer group border border-white/50 backdrop-blur-sm">
                        {/* Team Header */}
                        <div className="flex items-start gap-3 mb-4">
                          <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${colorClass} flex items-center justify-center text-white text-xl font-bold shadow-lg group-hover:scale-110 transition-transform`}>
                            {team.name.charAt(0)}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                              <h3 className="font-bold text-brand-text-dark group-hover:text-brand-primary transition-colors truncate text-lg">
                                {team.name}
                              </h3>
                              {team.isPublic ? (
                                <Eye className="w-4 h-4 text-brand-success shrink-0" />
                              ) : (
                                <EyeOff className="w-4 h-4 text-brand-text-light shrink-0" />
                              )}
                            </div>
                            <p className="text-sm text-brand-text-light line-clamp-1">{team.description}</p>
                          </div>
                        </div>

                        {/* Stats Row */}
                        <div className="flex items-center justify-between bg-brand-bg/50 rounded-xl p-3 mb-4">
                          <div className="text-center flex-1">
                            <div className="flex items-center justify-center gap-1 text-brand-primary">
                              <Users className="w-4 h-4" />
                              <span className="text-lg font-bold text-brand-text-dark">{team.memberCount}</span>
                            </div>
                            <p className="text-[11px] text-brand-text-light">สมาชิก</p>
                          </div>
                          <div className="w-px h-8 bg-brand-border/50" />
                          <div className="text-center flex-1">
                            <div className="flex items-center justify-center gap-1 text-brand-info">
                              <ClipboardList className="w-4 h-4" />
                              <span className="text-lg font-bold text-brand-text-dark">{team.activeJobCount}</span>
                            </div>
                            <p className="text-[11px] text-brand-text-light">งานเปิด</p>
                          </div>
                          <div className="w-px h-8 bg-brand-border/50" />
                          <div className="text-center flex-1">
                            <div className="flex items-center justify-center gap-1">
                              <Star className="w-4 h-4 text-brand-warning fill-brand-warning" />
                              <span className="text-lg font-bold text-brand-text-dark">{team.rating.toFixed(1)}</span>
                            </div>
                            <p className="text-[11px] text-brand-text-light">Rating</p>
                          </div>
                        </div>

                        {/* Footer */}
                        <div className="flex items-center justify-between">
                          <div className="flex gap-2">
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
                            {pendingData.pendingReviews === 0 && pendingData.pendingPayouts === 0 && (
                              <Badge variant="success" size="sm">
                                ✓ พร้อมใช้งาน
                              </Badge>
                            )}
                          </div>
                          <div className="w-8 h-8 rounded-full bg-brand-primary/10 flex items-center justify-center group-hover:bg-brand-primary group-hover:text-white transition-all">
                            <ArrowRight className="w-4 h-4 text-brand-primary group-hover:text-white" />
                          </div>
                        </div>
                      </div>
                    </Link>
                  );
                })}

              </div>
            ) : (
              <div className="bg-white rounded-2xl p-8 text-center">
                <div className="w-16 h-16 mx-auto rounded-2xl bg-brand-primary/10 flex items-center justify-center mb-4">
                  <Building2 className="w-8 h-8 text-brand-primary" />
                </div>
                <h3 className="font-bold text-lg text-brand-text-dark mb-2">ยังไม่มีทีม</h3>
                <p className="text-brand-text-light mb-4">สร้างทีมแรกเพื่อเริ่มจัดการ Worker</p>
                <Button onClick={() => setIsCreateTeamModalOpen(true)}>
                  <Plus className="w-4 h-4 mr-2" />
                  สร้างทีมแรก
                </Button>
              </div>
            )}
          </div>

          {/* Scroll Hint - Mobile Only */}
          {teams && teams.length > 2 && (
            <div className="flex justify-center gap-1.5 mt-4 sm:hidden">
              {teams.slice(0, 3).map((_, i) => (
                <div key={i} className="w-2 h-2 rounded-full bg-brand-primary/30" />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Recent Orders */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-brand-primary/10 flex items-center justify-center">
              <Package className="w-5 h-5 text-brand-primary" />
            </div>
            <h2 className="text-lg font-bold text-brand-text-dark">ออเดอร์ล่าสุด</h2>
          </div>
          <Link
            href="/seller/orders"
            className="text-sm font-medium text-brand-primary hover:underline flex items-center gap-1"
          >
            ดูทั้งหมด <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="space-y-3">
          {ordersLoading ? (
            <>
              <SkeletonCard className="h-[140px]" />
              <SkeletonCard className="h-[140px]" />
            </>
          ) : orders && orders.length > 0 ? (
            orders.slice(0, 3).map((order) => (
              <Link key={order.id} href={`/seller/orders/${order.id}`}>
                <Card 
                  variant="elevated" 
                  className="group hover:shadow-lg transition-all cursor-pointer border-none shadow-md"
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-brand-secondary flex items-center justify-center text-brand-text-dark font-bold text-sm">
                        {order.orderNumber.slice(-2)}
                      </div>
                      <div>
                        <p className="font-bold text-brand-text-dark">
                          {order.customer.name}
                        </p>
                        <p className="text-xs text-brand-text-light">
                          {order.orderNumber} • {formatDateTime(order.createdAt)}
                        </p>
                      </div>
                    </div>
                    <Badge
                      variant={
                        order.status === "completed" ? "success"
                          : order.status === "processing" ? "info"
                          : order.status === "cancelled" ? "error"
                          : "warning"
                      }
                      size="sm"
                      className="text-xs"
                    >
                      {order.status === "completed" ? "เสร็จ"
                        : order.status === "processing" ? "กำลังทำ"
                        : order.status === "cancelled" ? "ยกเลิก"
                        : "รอดำเนินการ"}
                    </Badge>
                  </div>

                  <div className="space-y-2 mb-3">
                    {order.items.slice(0, 2).map((item) => (
                      <div
                        key={item.id}
                        className="flex items-center justify-between text-sm p-2 rounded-lg bg-brand-bg/50"
                      >
                        <div className="flex items-center gap-2">
                          <ServiceTypeBadge type={item.serviceType} size="sm" />
                          <span className="text-brand-text-dark text-xs">
                            {item.serviceName}
                          </span>
                        </div>
                        <span className="text-xs text-brand-text-light">
                          {item.completedQuantity}/{item.quantity}
                        </span>
                      </div>
                    ))}
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-brand-border/30">
                    <span className="font-bold text-brand-primary">
                      {formatCurrency(order.total)}
                    </span>
                    <div className="flex items-center gap-2 w-1/3">
                      <Progress value={order.progress} size="sm" className="flex-1 h-1.5" />
                      <span className="text-xs text-brand-text-light">{order.progress}%</span>
                    </div>
                  </div>
                </Card>
              </Link>
            ))
          ) : (
            <EmptyState
              icon={Package}
              title="ยังไม่มีออเดอร์"
              description="สร้างออเดอร์แรกของคุณได้เลย"
              action={
                <Link href="/seller/orders/new">
                  <Button size="sm">สร้างออเดอร์แรก</Button>
                </Link>
              }
            />
          )}
        </div>
      </section>

      {/* Create Team Modal */}
      <Modal
        isOpen={isCreateTeamModalOpen}
        onClose={() => setIsCreateTeamModalOpen(false)}
        title="สร้างทีมใหม่"
        size="sm"
      >
        <div className="space-y-4">
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

          <div className="flex gap-3 pt-2">
            <Button
              variant="outline"
              onClick={() => setIsCreateTeamModalOpen(false)}
              className="flex-1"
              size="sm"
            >
              ยกเลิก
            </Button>
            <Button
              onClick={handleCreateTeam}
              className="flex-1"
              size="sm"
            >
              สร้างทีม
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
