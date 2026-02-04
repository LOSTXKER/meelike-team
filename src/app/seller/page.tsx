"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuthStore } from "@/lib/store";
import type { ServiceMode } from "@/types";
import { 
  Card, 
  Badge, 
  Button, 
  Progress, 
  Skeleton, 
  SkeletonCard, 
  Dialog 
} from "@/components/ui";
import { Container, Grid, Section, VStack, HStack } from "@/components/layout";
import { 
  ServiceTypeBadge, 
  EmptyState, 
  PlanBadge,
  ActionRequired,
  getSellerActionItems,
  KYCAlertBanner,
  KYCStatusCard,
} from "@/components/shared";
import { meetsKYCRequirement, type KYCLevel } from "@/types";
import { formatCurrency, formatDateTime } from "@/lib/utils";
import { useSellerStats, useSellerOrders, useSellerTeams, useTeamPayouts, usePendingReviews } from "@/lib/api/hooks";
import {
  DollarSign,
  ShoppingBag,
  Users,
  Star,
  ArrowRight,
  Package,
  Wallet,
  Eye,
  EyeOff,
  Plus,
  ChevronRight,
  TrendingUp,
  Building2,
  Sparkles,
} from "lucide-react";
import { getRankConfig, getRankProgress, RANKS, RANK_ORDER } from "@/lib/constants/plans";
import type { SellerRank } from "@/types";

// Mock data for demo
const rollingAvgSpend = 65000;

export default function SellerDashboard() {
  const router = useRouter();
  const { user } = useAuthStore();
  const seller = user?.seller;

  const [isCreateTeamModalOpen, setIsCreateTeamModalOpen] = useState(false);
  const [newTeamName, setNewTeamName] = useState("");
  const [newTeamDescription, setNewTeamDescription] = useState("");

  const { data: stats, isLoading: statsLoading } = useSellerStats();
  const { data: orders, isLoading: ordersLoading } = useSellerOrders();
  const { data: teams, isLoading: teamsLoading } = useSellerTeams();
  const { data: allPayouts } = useTeamPayouts();
  const { data: pendingReviewClaims } = usePendingReviews();

  // Calculate action items
  const pendingOrdersCount = orders?.filter((o: { status: string }) => 
    o.status === 'pending' || o.status === 'processing'
  ).length || 0;
  const pendingReviewCount = pendingReviewClaims?.length || 0;
  const pendingPayoutCount = allPayouts?.filter(p => p.status === "pending").length || 0;

  const actionItems = getSellerActionItems({
    pendingOrders: pendingOrdersCount,
    pendingReviews: pendingReviewCount,
    pendingPayouts: pendingPayoutCount,
    lowBalance: (seller?.balance || 0) < 100,
    balanceAmount: seller?.balance || 0,
  });

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

  const colors = [
    'from-brand-primary to-brand-primary/70',
    'from-blue-500 to-blue-600',
    'from-purple-500 to-purple-600',
    'from-emerald-500 to-emerald-600',
  ];

  // Get KYC level for seller
  const kycLevel: KYCLevel = seller?.kyc?.level || 'none';
  const needsKYC = !meetsKYCRequirement(kycLevel, 'basic');

  return (
    <div className="space-y-6 animate-fade-in">
      {/* ============================================ */}
      {/* KYC ALERT BANNER - Show if not verified */}
      {/* ============================================ */}
      {needsKYC && (
        <KYCAlertBanner 
          requiredLevel="basic" 
          userType="seller"
          message="ยืนยันตัวตนเพื่อเติมเงินและใช้งานได้เต็มที่"
        />
      )}

      {/* ============================================ */}
      {/* HEADER SECTION */}
      {/* ============================================ */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <h1 className="text-2xl font-bold text-brand-text-dark">
              สวัสดี, {seller?.displayName} 👋
            </h1>
            <PlanBadge 
              plan={seller?.plan || 'free'} 
              expiresAt={seller?.planExpiresAt}
            />
          </div>
          <p className="text-brand-text-light text-sm">
            ภาพรวมร้านค้าของคุณวันนี้
          </p>
        </div>
        <Link href="/seller/orders/new">
          <Button leftIcon={<Plus className="w-4 h-4" />}>
            สร้างออเดอร์
          </Button>
        </Link>
      </div>

      {/* ============================================ */}
      {/* ACTION REQUIRED - Items needing attention */}
      {/* ============================================ */}
      {actionItems.length > 0 && (
        <ActionRequired items={actionItems} />
      )}

      {/* ============================================ */}
      {/* MAIN CONTENT - Two Columns */}
      {/* ============================================ */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Left Column - Stats + Teams + Orders */}
        <div className="lg:col-span-2 space-y-6">
          {/* 3 Stats Cards */}
          {statsLoading ? (
            <div className="grid grid-cols-3 gap-3">
              {[1,2,3].map(i => (
                <Card key={i} className="p-4 border-none shadow-sm">
                  <Skeleton className="h-4 w-16 mb-2" />
                  <Skeleton className="h-7 w-20" />
                </Card>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-3 gap-3">
              {/* Monthly Revenue */}
              <Link href="/seller/finance">
                <Card className="p-4 border-none shadow-sm hover:shadow-md transition-all h-full">
                  <div className="flex items-center gap-2 text-brand-text-light text-xs mb-2">
                    <div className="w-7 h-7 rounded-lg bg-emerald-100 flex items-center justify-center">
                      <DollarSign className="w-3.5 h-3.5 text-emerald-600" />
                    </div>
                    <span>รายได้เดือนนี้</span>
                  </div>
                  <p className="text-xl font-bold text-brand-text-dark">{formatCurrency(stats?.monthRevenue || 0)}</p>
                  <div className="flex items-center gap-1 mt-1 text-xs text-emerald-600">
                    <TrendingUp className="w-3 h-3" />
                    +12.5%
                  </div>
                </Card>
              </Link>

              {/* Pending Orders */}
              <Link href="/seller/orders?status=pending">
                <Card className="p-4 border-none shadow-sm hover:shadow-md transition-all h-full">
                  <div className="flex items-center gap-2 text-brand-text-light text-xs mb-2">
                    <div className="w-7 h-7 rounded-lg bg-amber-100 flex items-center justify-center">
                      <ShoppingBag className="w-3.5 h-3.5 text-amber-600" />
                    </div>
                    <span>รอดำเนินการ</span>
                  </div>
                  <p className="text-xl font-bold text-brand-text-dark">{pendingOrdersCount}</p>
                  <p className="text-xs text-brand-text-light mt-1">ออเดอร์</p>
                </Card>
              </Link>

              {/* Wallet */}
              <Link href="/seller/finance">
                <Card className="p-4 border-none shadow-sm hover:shadow-md transition-all h-full">
                  <div className="flex items-center gap-2 text-brand-text-light text-xs mb-2">
                    <div className="w-7 h-7 rounded-lg bg-blue-100 flex items-center justify-center">
                      <Wallet className="w-3.5 h-3.5 text-blue-600" />
                    </div>
                    <span>ยอดเงิน</span>
                  </div>
                  <p className="text-xl font-bold text-brand-text-dark">{formatCurrency(seller?.balance || 0)}</p>
                  <p className="text-xs text-brand-text-light mt-1">คงเหลือ</p>
                </Card>
              </Link>
            </div>
          )}

          {/* Teams Section */}
          <Card className="border-none shadow-md overflow-hidden">
            <div className="p-4 border-b border-brand-border/30 bg-brand-bg/30 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-brand-primary/10 flex items-center justify-center">
                  <Building2 className="w-5 h-5 text-brand-primary" />
                </div>
                <div>
                  <h2 className="font-bold text-brand-text-dark">ทีมของฉัน</h2>
                  <p className="text-xs text-brand-text-light">
                    {teams?.length || 0} ทีม • {teams?.reduce((sum, t) => sum + t.memberCount, 0) || 0} สมาชิก
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Link href="/seller/team">
                  <Button variant="ghost" size="sm">
                    ดูทั้งหมด <ArrowRight className="w-4 h-4 ml-1" />
                  </Button>
                </Link>
                <Button size="sm" onClick={() => setIsCreateTeamModalOpen(true)}>
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
            </div>

            <div className="p-4">
              {teamsLoading ? (
                <div className="space-y-3">
                  <Skeleton className="h-20 rounded-xl" />
                  <Skeleton className="h-20 rounded-xl" />
                </div>
              ) : teams && teams.length > 0 ? (
                <div className="space-y-3">
                  {teams.slice(0, 3).map((team, index) => {
                    const colorClass = colors[index % colors.length];
                    return (
                      <Link key={team.id} href={`/seller/team/${team.id}`}>
                        <div className="flex items-center gap-4 p-3 rounded-xl hover:bg-brand-bg/50 transition-colors group">
                          <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${colorClass} flex items-center justify-center text-white font-bold text-lg shadow-md`}>
                            {team.name.charAt(0)}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                              <h3 className="font-semibold text-brand-text-dark group-hover:text-brand-primary transition-colors">
                                {team.name}
                              </h3>
                              {team.isPublic ? (
                                <Eye className="w-3.5 h-3.5 text-brand-success" />
                              ) : (
                                <EyeOff className="w-3.5 h-3.5 text-brand-text-light" />
                              )}
                            </div>
                            <div className="flex items-center gap-4 text-xs text-brand-text-light mt-1">
                              <span className="flex items-center gap-1">
                                <Users className="w-3.5 h-3.5" />
                                {team.memberCount} สมาชิก
                              </span>
                              <span className="flex items-center gap-1">
                                <Star className="w-3.5 h-3.5 text-amber-500" />
                                {team.rating.toFixed(1)}
                              </span>
                              <span className="flex items-center gap-1">
                                <Package className="w-3.5 h-3.5" />
                                {team.activeJobCount} งาน
                              </span>
                            </div>
                          </div>
                          <ChevronRight className="w-5 h-5 text-brand-text-light group-hover:text-brand-primary transition-colors" />
                        </div>
                      </Link>
                    );
                  })}
                </div>
              ) : (
                <div className="text-center py-8">
                  <div className="w-14 h-14 mx-auto rounded-2xl bg-brand-primary/10 flex items-center justify-center mb-3">
                    <Building2 className="w-7 h-7 text-brand-primary" />
                  </div>
                  <h3 className="font-semibold text-brand-text-dark mb-1">ยังไม่มีทีม</h3>
                  <p className="text-sm text-brand-text-light mb-4">สร้างทีมแรกเพื่อเริ่มจัดการ Worker</p>
                  <Button size="sm" onClick={() => setIsCreateTeamModalOpen(true)}>
                    <Plus className="w-4 h-4 mr-2" />
                    สร้างทีมแรก
                  </Button>
                </div>
              )}
            </div>
          </Card>

          {/* Recent Orders */}
          <Card className="border-none shadow-md overflow-hidden">
            <div className="p-4 border-b border-brand-border/30 bg-brand-bg/30 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-brand-warning/10 flex items-center justify-center">
                  <Package className="w-5 h-5 text-brand-warning" />
                </div>
                <div>
                  <h2 className="font-bold text-brand-text-dark">ออเดอร์ล่าสุด</h2>
                  <p className="text-xs text-brand-text-light">{orders?.length || 0} ออเดอร์ทั้งหมด</p>
                </div>
              </div>
              <Link href="/seller/orders">
                <Button variant="ghost" size="sm">
                  ดูทั้งหมด <ArrowRight className="w-4 h-4 ml-1" />
                </Button>
              </Link>
            </div>

            <div className="divide-y divide-brand-border/30">
              {ordersLoading ? (
                <div className="p-4 space-y-3">
                  <Skeleton className="h-16 rounded-xl" />
                  <Skeleton className="h-16 rounded-xl" />
                  <Skeleton className="h-16 rounded-xl" />
                </div>
              ) : orders && orders.length > 0 ? (
                orders.slice(0, 4).map((order: { id: string; orderNumber: string; customer: { name: string }; status: string; progress: number; createdAt: string; items: { id: string; platform: string; serviceName: string; quantity: number; serviceType: ServiceMode; completedQuantity: number }[]; total: number }) => (
                  <Link key={order.id} href={`/seller/orders/${order.id}`}>
                    <div className="p-4 hover:bg-brand-bg/30 transition-colors group">
                      <div className="flex items-center justify-between gap-4">
                        <div className="flex items-center gap-3 min-w-0">
                          <div className="w-10 h-10 rounded-lg bg-brand-secondary flex items-center justify-center text-sm font-bold text-brand-primary">
                            {order.orderNumber.slice(-2)}
                          </div>
                          <div className="min-w-0">
                            <p className="font-medium text-brand-text-dark group-hover:text-brand-primary transition-colors truncate">
                              {order.customer.name}
                            </p>
                            <p className="text-xs text-brand-text-light">
                              {order.orderNumber} • {formatDateTime(order.createdAt)}
                            </p>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-4 shrink-0">
                          <div className="text-right hidden sm:block">
                            <p className="font-bold text-brand-primary text-sm">
                              {formatCurrency(order.total)}
                            </p>
                            <div className="flex items-center gap-2">
                              <Progress value={order.progress} size="sm" className="w-16 h-1.5" />
                              <span className="text-xs text-brand-text-light">{order.progress}%</span>
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
                          >
                            {order.status === "completed" ? "เสร็จ"
                              : order.status === "processing" ? "กำลังทำ"
                              : order.status === "cancelled" ? "ยกเลิก"
                              : "รอทำ"}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))
              ) : (
                <div className="p-8 text-center">
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
                </div>
              )}
            </div>
          </Card>
        </div>

        {/* Right Column - KYC Status + Seller Rank + Quick Actions + Tips */}
        <div className="space-y-6">
          {/* KYC Status Card - Show if not fully verified */}
          {kycLevel !== 'business' && (
            <KYCStatusCard userType="seller" compact={kycLevel !== 'none'} />
          )}

          {/* Seller Rank Card */}
          {(() => {
            const currentRank = seller?.sellerRank || 'bronze';
            const currentRankConfig = getRankConfig(currentRank);
            const rankProgress = getRankProgress(rollingAvgSpend, currentRank as SellerRank);
            
            return (
              <Card className="border-none shadow-md p-4">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-9 h-9 rounded-xl bg-amber-100 flex items-center justify-center">
                    <TrendingUp className="w-5 h-5 text-amber-600" />
                  </div>
                  <div>
                    <h3 className="font-bold text-brand-text-dark text-sm">Seller Rank</h3>
                    <p className="text-[11px] text-brand-text-light">ค่าธรรมเนียมแพลตฟอร์ม</p>
                  </div>
                </div>

                {/* Current Rank */}
                <div 
                  className="flex items-center gap-3 p-3 rounded-xl border-2 mb-3"
                  style={{ 
                    borderColor: currentRankConfig.color,
                    backgroundColor: `${currentRankConfig.color}10`
                  }}
                >
                  <div className="text-2xl">{currentRankConfig.icon}</div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-sm text-brand-text-dark">
                        {currentRankConfig.name}
                      </span>
                      <Badge 
                        className="text-white text-[10px]"
                        style={{ backgroundColor: currentRankConfig.color }}
                      >
                        Fee {currentRankConfig.feePercent}%
                      </Badge>
                    </div>
                    <p className="text-[11px] text-brand-text-light mt-0.5 truncate">
                      เฉลี่ย 3 เดือน: ฿{rollingAvgSpend.toLocaleString()}
                    </p>
                  </div>
                </div>

                {/* Progress to Next Rank */}
                {rankProgress.nextRank && (
                  <div className="space-y-1.5 mb-3">
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="text-brand-text-light">
                        ไปสู่ {RANKS[rankProgress.nextRank].name} {RANKS[rankProgress.nextRank].icon}
                      </span>
                      <span className="font-medium text-brand-text-dark">
                        อีก ฿{rankProgress.amountNeeded.toLocaleString()}
                      </span>
                    </div>
                    <div className="w-full h-1.5 bg-brand-bg rounded-full overflow-hidden">
                      <div 
                        className="h-full rounded-full transition-all"
                        style={{ 
                          width: `${rankProgress.progress}%`,
                          backgroundColor: currentRankConfig.color
                        }}
                      />
                    </div>
                  </div>
                )}

                {/* All Ranks Overview */}
                <div className="grid grid-cols-4 gap-1">
                  {RANK_ORDER.map((rank) => {
                    const config = RANKS[rank];
                    const isCurrent = rank === currentRank;
                    return (
                      <div 
                        key={rank}
                        className={`text-center p-1 rounded-lg ${
                          isCurrent 
                            ? "ring-2 ring-brand-primary bg-brand-primary/5" 
                            : "bg-brand-bg/50"
                        }`}
                      >
                        <div className="text-base">{config.icon}</div>
                        <p className="text-[9px] font-medium text-brand-text-dark">
                          {config.feePercent}%
                        </p>
                      </div>
                    );
                  })}
                </div>
              </Card>
            );
          })()}

          {/* Quick Actions */}
          <Card className="border-none shadow-md p-4">
            <h3 className="font-bold text-brand-text-dark mb-4 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-brand-accent" />
              ทางลัด
            </h3>
            <div className="space-y-2">
              <Link href="/seller/orders/new">
                <div className="flex items-center gap-3 p-3 rounded-xl hover:bg-brand-bg transition-colors group">
                  <div className="w-10 h-10 rounded-xl bg-brand-primary/10 flex items-center justify-center group-hover:bg-brand-primary/20 transition-colors">
                    <Plus className="w-5 h-5 text-brand-primary" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-sm text-brand-text-dark">สร้างออเดอร์</p>
                    <p className="text-xs text-brand-text-light">เปิดออเดอร์ใหม่ให้ลูกค้า</p>
                  </div>
                  <ChevronRight className="w-4 h-4 text-brand-text-light" />
                </div>
              </Link>
              
              <Link href="/seller/services/new">
                <div className="flex items-center gap-3 p-3 rounded-xl hover:bg-brand-bg transition-colors group">
                  <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center group-hover:bg-blue-500/20 transition-colors">
                    <Package className="w-5 h-5 text-blue-500" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-sm text-brand-text-dark">เพิ่มบริการ</p>
                    <p className="text-xs text-brand-text-light">เปิดบริการใหม่ในร้าน</p>
                  </div>
                  <ChevronRight className="w-4 h-4 text-brand-text-light" />
                </div>
              </Link>
              
              <Link href="/seller/finance">
                <div className="flex items-center gap-3 p-3 rounded-xl hover:bg-brand-bg transition-colors group">
                  <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center group-hover:bg-emerald-500/20 transition-colors">
                    <Wallet className="w-5 h-5 text-emerald-500" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-sm text-brand-text-dark">เติมเงิน</p>
                    <p className="text-xs text-brand-text-light">เติมเครดิตเข้าระบบ</p>
                  </div>
                  <ChevronRight className="w-4 h-4 text-brand-text-light" />
                </div>
              </Link>
              
              <Link href="/hub">
                <div className="flex items-center gap-3 p-3 rounded-xl hover:bg-brand-bg transition-colors group">
                  <div className="w-10 h-10 rounded-xl bg-purple-500/10 flex items-center justify-center group-hover:bg-purple-500/20 transition-colors">
                    <Users className="w-5 h-5 text-purple-500" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-sm text-brand-text-dark">ตลาดกลาง</p>
                    <p className="text-xs text-brand-text-light">หาทีมหรือจ้างงาน</p>
                  </div>
                  <ChevronRight className="w-4 h-4 text-brand-text-light" />
                </div>
              </Link>
            </div>
          </Card>

          {/* Tips Card */}
          <Card className="border-none shadow-md p-4 bg-gradient-to-br from-brand-accent/10 to-brand-primary/10">
            <h3 className="font-bold text-brand-text-dark mb-2">💡 เคล็ดลับ</h3>
            <p className="text-sm text-brand-text-light">
              อัปเกรด Seller Rank เพื่อลดค่าธรรมเนียมและเพิ่มโควต้าการสร้างงาน
            </p>
            <Link href="/seller/settings/subscription">
              <Button variant="outline" size="sm" className="mt-3 w-full">
                ดูรายละเอียด
              </Button>
            </Link>
          </Card>
        </div>
      </div>

      {/* Create Team Dialog */}
      <Dialog
        open={isCreateTeamModalOpen}
        onClose={() => setIsCreateTeamModalOpen(false)}
        size="sm"
      >
        <Dialog.Header>
          <Dialog.Title>สร้างทีมใหม่</Dialog.Title>
          <Dialog.Description>สร้างทีมเพื่อบริหารจัดการ Worker</Dialog.Description>
        </Dialog.Header>
        
        <Dialog.Body>
          <VStack gap={4}>
            <div>
              <label className="block text-sm font-medium text-brand-text-dark mb-1.5">
                ชื่อทีม <span className="text-brand-error">*</span>
              </label>
              <input
                type="text"
                placeholder="เช่น TikTok Team"
                value={newTeamName}
                onChange={(e) => setNewTeamName(e.target.value)}
                className="w-full p-3 rounded-xl border border-brand-border/50 focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/20 outline-none text-sm"
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
            onClick={() => setIsCreateTeamModalOpen(false)}
          >
            ยกเลิก
          </Button>
          <Button onClick={handleCreateTeam}>
            สร้างทีม
          </Button>
        </Dialog.Footer>
      </Dialog>
    </div>
  );
}
