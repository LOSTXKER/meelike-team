"use client";

import Link from "next/link";
import { useAuthStore } from "@/lib/store";
import { StatsCard, Card, Badge, Button, Progress, Avatar } from "@/components/ui";
import { ServiceTypeBadge, EmptyState } from "@/components/shared";
import { formatCurrency, formatDateTime } from "@/lib/utils";
import { mockOrders, mockJobClaims, mockWorkers, mockSellerStats } from "@/lib/mock-data";
import {
  DollarSign,
  ShoppingBag,
  Users,
  Star,
  ArrowRight,
  CheckCircle,
  XCircle,
  Package,
  Bell,
  ClipboardList,
  Store,
  CreditCard,
} from "lucide-react";

export default function SellerDashboard() {
  const { user } = useAuthStore();
  const seller = user?.seller;

  const pendingReviews = mockJobClaims.filter(
    (claim) => claim.status === "submitted"
  );

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
          <StatsCard
            title="รายได้เดือนนี้"
            value={formatCurrency(mockSellerStats.monthRevenue)}
            icon={<DollarSign className="w-6 h-6" />}
            change={12.5}
            changeLabel="จากเดือนก่อน"
            className="border-none shadow-lg shadow-brand-primary/5 hover:-translate-y-1 transition-transform duration-300"
          />
          <StatsCard
            title="ออเดอร์"
            value={mockSellerStats.monthOrders}
            icon={<ShoppingBag className="w-6 h-6" />}
            change={8.2}
            className="border-none shadow-lg shadow-brand-primary/5 hover:-translate-y-1 transition-transform duration-300"
          />
          <StatsCard
            title="ทีมงาน Active"
            value={`${mockSellerStats.activeTeamMembers} คน`}
            icon={<Users className="w-6 h-6" />}
            className="border-none shadow-lg shadow-brand-primary/5 hover:-translate-y-1 transition-transform duration-300"
          />
          <StatsCard
            title="Rating ร้าน"
            value={`${seller?.rating}`}
            icon={<Star className="w-6 h-6" />}
            className="border-none shadow-lg shadow-brand-primary/5 hover:-translate-y-1 transition-transform duration-300"
          />
        </div>
      </section>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Sidebar Widgets (Mobile: First, Desktop: Second) */}
        <div className="space-y-8 lg:col-start-3 lg:row-start-1">
          {/* Quick Actions */}
          <section className="space-y-4">
            <h2 className="text-xl font-bold text-brand-text-dark">เมนูด่วน</h2>
            <div className="grid grid-cols-2 gap-3">
              {[
                {
                  label: "สร้างงาน",
                  href: "/seller/team/jobs/new",
                  icon: <ClipboardList className="w-5 h-5" />,
                  color: "bg-brand-surface border border-brand-border text-brand-text-dark hover:border-brand-primary/50 hover:shadow-md",
                },
                {
                  label: "บริการ",
                  href: "/seller/services",
                  icon: <Package className="w-5 h-5" />,
                  color: "bg-brand-surface border border-brand-border text-brand-text-dark hover:border-brand-primary/50 hover:shadow-md",
                },
                {
                  label: "หน้าร้าน",
                  href: `/s/${seller?.storeSlug}`,
                  icon: <Store className="w-5 h-5" />,
                  color: "bg-brand-surface border border-brand-border text-brand-text-dark hover:border-brand-primary/50 hover:shadow-md",
                },
                {
                  label: "เติมเงิน",
                  href: "/seller/wallet/topup",
                  icon: <CreditCard className="w-5 h-5" />,
                  color: "bg-brand-surface border border-brand-border text-brand-text-dark hover:border-brand-primary/50 hover:shadow-md",
                },
              ].map((action, i) => (
                <Link key={i} href={action.href}>
                  <div
                    className={`${action.color} p-4 rounded-xl transition-all duration-200 flex flex-col items-center justify-center gap-2 h-24 text-center cursor-pointer group`}
                  >
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

          {/* Pending Reviews */}
          <Card variant="elevated" className="border-none shadow-lg shadow-brand-primary/5 hidden lg:block">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-bold text-brand-text-dark flex items-center gap-2">
                <Bell className="w-5 h-5 text-brand-warning" />
                รอตรวจสอบ ({pendingReviews.length})
              </h2>
              <Link
                href="/seller/team/review"
                className="text-sm font-medium text-brand-primary hover:underline"
              >
                ดูทั้งหมด
              </Link>
            </div>
            {/* ... Review Items ... */}
            <div className="space-y-4">
              {pendingReviews.map((claim) => {
                const worker = mockWorkers.find(
                  (w) => w.id === claim.workerId
                );
                return (
                  <div
                    key={claim.id}
                    className="p-4 rounded-xl bg-brand-bg/30 border border-brand-border/50 hover:border-brand-primary/30 transition-colors"
                  >
                    <div className="flex items-center gap-3 mb-3">
                      <Avatar
                        src={worker?.avatar}
                        fallback={worker?.displayName}
                        size="sm"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="font-bold text-brand-text-dark truncate text-sm">
                          @{worker?.displayName}
                        </p>
                        <p className="text-xs font-medium text-brand-text-light">
                          ส่งงาน {claim.quantity} รายการ
                        </p>
                      </div>
                      <span className="font-bold text-brand-success text-sm">
                        {formatCurrency(claim.earnAmount)}
                      </span>
                    </div>

                    <div className="flex gap-2">
                      <Button size="sm" className="flex-1 h-8 text-xs font-bold" leftIcon={<CheckCircle className="w-3 h-3" />}>
                        อนุมัติ
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="flex-1 h-8 text-xs hover:bg-red-50 hover:text-red-600 hover:border-red-200"
                        leftIcon={<XCircle className="w-3 h-3" />}
                      >
                        ปฏิเสธ
                      </Button>
                    </div>
                  </div>
                );
              })}

              {pendingReviews.length === 0 && (
                <EmptyState
                  icon={CheckCircle}
                  title="ไม่มีงานรอตรวจสอบ"
                  className="py-8 opacity-60"
                />
              )}
            </div>
          </Card>
        </div>

        {/* Recent Orders (Mobile: Second, Desktop: First) */}
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
            {mockOrders.length > 0 ? (
              mockOrders.slice(0, 3).map((order) => (
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
                        : "warning"
                    }
                    className="self-start sm:self-center px-4 py-1.5 text-xs font-bold uppercase tracking-wide rounded-full shadow-sm"
                  >
                    {order.status === "completed"
                      ? "✓ เสร็จแล้ว"
                      : order.status === "processing"
                      ? "⚡ กำลังทำ"
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

