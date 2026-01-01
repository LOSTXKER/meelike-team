"use client";

import Link from "next/link";
import { useAuthStore } from "@/lib/store";
import { StatsCard, Card, Badge, Button, Progress, Skeleton, SkeletonCard } from "@/components/ui";
import { ServiceTypeBadge, EmptyState } from "@/components/shared";
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
  ShieldCheck,
  Plus,
  ExternalLink,
  Layers,
  ArrowUpRight,
} from "lucide-react";

export default function SellerDashboard() {
  const { user } = useAuthStore();
  const seller = user?.seller;

  // Use API hooks
  const { data: stats, isLoading: statsLoading } = useSellerStats();
  const { data: orders, isLoading: ordersLoading } = useSellerOrders();
  const { data: teams, isLoading: teamsLoading } = useSellerTeams();

  const isLoading = statsLoading || ordersLoading || teamsLoading;

  // Calculate team summary
  const teamSummary = {
    total: teams?.length || 0,
    totalMembers: teams?.reduce((sum, t) => sum + t.memberCount, 0) || 0,
    totalActiveJobs: teams?.reduce((sum, t) => sum + t.activeJobCount, 0) || 0,
    pendingReviews: 7, // Mock - would come from API
    pendingPayouts: 4250, // Mock - would come from API
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

      {/* ===== TEAM PORTAL CARD ===== */}
      <section className="relative">
        <div className="absolute inset-0 bg-gradient-to-r from-brand-primary/5 via-brand-accent/5 to-brand-primary/5 rounded-3xl" />
        <div className="relative border-2 border-brand-primary/20 rounded-3xl p-6 lg:p-8 bg-white/80 backdrop-blur-sm shadow-xl shadow-brand-primary/10">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-brand-primary to-brand-primary-dark flex items-center justify-center shadow-lg shadow-brand-primary/30">
                <Layers className="w-7 h-7 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-brand-text-dark flex items-center gap-2">
                  ศูนย์จัดการทีม
                  <Badge variant="info" size="sm" className="font-normal">
                    {teamSummary.total} ทีม
                  </Badge>
                </h2>
                <p className="text-brand-text-light">
                  จัดการสมาชิก งาน และการจ่ายเงินของทีม
                </p>
              </div>
            </div>

            {/* Pending Actions */}
            {(teamSummary.pendingReviews > 0 || teamSummary.pendingPayouts > 0) && (
              <div className="flex flex-wrap gap-2">
                {teamSummary.pendingReviews > 0 && (
                  <Badge variant="warning" className="gap-1.5 px-3 py-1.5 text-sm animate-pulse">
                    <ShieldCheck className="w-4 h-4" />
                    {teamSummary.pendingReviews} รอตรวจ
                  </Badge>
                )}
                {teamSummary.pendingPayouts > 0 && (
                  <Badge variant="success" className="gap-1.5 px-3 py-1.5 text-sm">
                    <DollarSign className="w-4 h-4" />
                    {formatCurrency(teamSummary.pendingPayouts)} รอจ่าย
                  </Badge>
                )}
              </div>
            )}
          </div>

          {/* Summary Stats */}
          <div className="grid grid-cols-3 gap-3 mb-6 p-4 bg-brand-bg/50 rounded-2xl border border-brand-border/30">
            <div className="text-center">
              <p className="text-2xl font-bold text-brand-text-dark">{teamSummary.totalMembers}</p>
              <p className="text-sm text-brand-text-light">สมาชิกทั้งหมด</p>
            </div>
            <div className="text-center border-x border-brand-border/30">
              <p className="text-2xl font-bold text-brand-text-dark">{teamSummary.totalActiveJobs}</p>
              <p className="text-sm text-brand-text-light">งานที่เปิดอยู่</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-brand-warning">{teamSummary.pendingReviews}</p>
              <p className="text-sm text-brand-text-light">รอตรวจสอบ</p>
            </div>
          </div>

          {/* Team Cards Grid */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
            {teamsLoading ? (
              <>
                <Skeleton className="h-32 rounded-2xl" />
                <Skeleton className="h-32 rounded-2xl" />
                <Skeleton className="h-32 rounded-2xl" />
              </>
            ) : teams?.map((team) => (
              <Link key={team.id} href={`/seller/team/${team.id}`}>
                <div className="relative p-4 rounded-2xl bg-white border-2 border-brand-border/50 hover:border-brand-primary hover:shadow-lg hover:shadow-brand-primary/10 transition-all duration-300 cursor-pointer group h-full">
                  {/* Arrow indicator */}
                  <div className="absolute top-3 right-3 w-8 h-8 rounded-full bg-brand-bg group-hover:bg-brand-primary flex items-center justify-center transition-all duration-300">
                    <ArrowUpRight className="w-4 h-4 text-brand-text-light group-hover:text-white transition-colors" />
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-brand-primary to-brand-primary/70 flex items-center justify-center text-white font-bold text-lg shadow-md shrink-0">
                      {team.name.charAt(0)}
                    </div>
                    <div className="flex-1 min-w-0 pr-8">
                      <div className="flex items-center gap-2 mb-1">
                        <p className="font-bold text-brand-text-dark truncate group-hover:text-brand-primary transition-colors">
                          {team.name}
                        </p>
                        {team.isPublic ? (
                          <Eye className="w-3.5 h-3.5 text-brand-success shrink-0" />
                        ) : (
                          <EyeOff className="w-3.5 h-3.5 text-brand-text-light shrink-0" />
                        )}
                      </div>
                      <div className="flex items-center gap-3 text-sm text-brand-text-light">
                        <span className="flex items-center gap-1">
                          <Users className="w-3.5 h-3.5" />
                          {team.memberCount}
                        </span>
                        <span className="flex items-center gap-1">
                          <ClipboardList className="w-3.5 h-3.5" />
                          {team.activeJobCount} งาน
                        </span>
                        <span className="flex items-center gap-1">
                          <Star className="w-3.5 h-3.5 text-brand-warning fill-brand-warning" />
                          {team.rating?.toFixed(1) || "0.0"}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Quick stats bar */}
                  <div className="mt-4 pt-3 border-t border-brand-border/30 flex items-center justify-between text-xs">
                    <span className="text-brand-text-light">งานเสร็จ {team.totalJobsCompleted || 0}</span>
                    <span className="font-medium text-brand-primary group-hover:underline flex items-center gap-1">
                      เข้าจัดการ <ChevronRight className="w-3 h-3" />
                    </span>
                  </div>
                </div>
              </Link>
            ))}

            {/* Add New Team Card */}
            {!teamsLoading && (
              <Link href="/seller/team">
                <div className="h-full min-h-[130px] p-4 rounded-2xl border-2 border-dashed border-brand-border/50 hover:border-brand-primary/50 hover:bg-brand-primary/5 transition-all duration-300 flex flex-col items-center justify-center gap-2 cursor-pointer group">
                  <div className="w-10 h-10 rounded-full bg-brand-bg group-hover:bg-brand-primary/10 flex items-center justify-center transition-colors">
                    <Plus className="w-5 h-5 text-brand-text-light group-hover:text-brand-primary" />
                  </div>
                  <span className="text-sm font-medium text-brand-text-light group-hover:text-brand-primary transition-colors">
                    สร้างทีมใหม่
                  </span>
                </div>
              </Link>
            )}
          </div>

          {/* CTA Button - Portal Entry */}
          <Link href="/seller/team">
            <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-brand-primary to-brand-primary-dark p-5 text-white shadow-lg shadow-brand-primary/30 hover:shadow-xl hover:shadow-brand-primary/40 transition-all duration-300 cursor-pointer group">
              <div className="absolute inset-0 bg-white/10 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
              <div className="relative flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center">
                    <ExternalLink className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="font-bold text-lg">เข้าศูนย์จัดการทีม</p>
                    <p className="text-white/80 text-sm">ดูทีมทั้งหมด, สร้างทีมใหม่, จัดการงานและการจ่ายเงิน</p>
                  </div>
                </div>
                <ArrowRight className="w-6 h-6 group-hover:translate-x-2 transition-transform" />
              </div>
            </div>
          </Link>
        </div>
      </section>
      {/* ===== END TEAM PORTAL CARD ===== */}

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
    </div>
  );
}
