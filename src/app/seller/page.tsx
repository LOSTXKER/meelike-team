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
    <div className="space-y-6 animate-fade-in">
      {/* Welcome */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-brand-text-dark">
            สวัสดี, {seller?.displayName} 👋
          </h1>
          <p className="text-brand-text-light">
            ยินดีต้อนรับกลับมา! นี่คือภาพรวมร้านของคุณวันนี้
          </p>
        </div>
        <Link href="/seller/orders/new">
          <Button>+ สร้างออเดอร์ใหม่</Button>
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard
          title="รายได้เดือนนี้"
          value={formatCurrency(mockSellerStats.monthRevenue)}
          icon={<DollarSign className="w-5 h-5" />}
          change={12.5}
          changeLabel="จากเดือนก่อน"
        />
        <StatsCard
          title="ออเดอร์เดือนนี้"
          value={mockSellerStats.monthOrders}
          icon={<ShoppingBag className="w-5 h-5" />}
          change={8.2}
        />
        <StatsCard
          title="ทีมงาน Active"
          value={`${mockSellerStats.activeTeamMembers} คน`}
          icon={<Users className="w-5 h-5" />}
        />
        <StatsCard
          title="Rating"
          value={`${seller?.rating}`}
          icon={<Star className="w-5 h-5" />}
        />
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Recent Orders */}
        <div className="lg:col-span-2">
          <Card variant="bordered">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-brand-text-dark flex items-center gap-2">
                <Package className="w-5 h-5 text-brand-primary" />
                ออเดอร์ล่าสุด
              </h2>
              <Link
                href="/seller/orders"
                className="text-sm text-brand-primary hover:underline flex items-center gap-1"
              >
                ดูทั้งหมด <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            <div className="space-y-3">
              {mockOrders.slice(0, 3).map((order) => (
                <div
                  key={order.id}
                  className="p-4 rounded-lg bg-brand-bg border border-brand-border"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <p className="font-medium text-brand-text-dark">
                        {order.orderNumber}
                      </p>
                      <p className="text-sm text-brand-text-light">
                        {order.customer.name} • {formatDateTime(order.createdAt)}
                      </p>
                    </div>
                    <Badge
                      variant={
                        order.status === "completed"
                          ? "success"
                          : order.status === "processing"
                          ? "info"
                          : "warning"
                      }
                    >
                      {order.status === "completed"
                        ? "เสร็จแล้ว"
                        : order.status === "processing"
                        ? "กำลังทำ"
                        : "รอดำเนินการ"}
                    </Badge>
                  </div>

                  <div className="space-y-2">
                    {order.items.slice(0, 2).map((item) => (
                      <div
                        key={item.id}
                        className="flex items-center justify-between text-sm"
                      >
                        <div className="flex items-center gap-2">
                          <span className="text-brand-text-dark">
                            {item.serviceName}
                          </span>
                        <ServiceTypeBadge type={item.serviceType} />
                        </div>
                        <span className="text-brand-text-light">
                          {item.completedQuantity}/{item.quantity}
                        </span>
                      </div>
                    ))}
                  </div>

                  <div className="flex items-center justify-between mt-3 pt-3 border-t border-brand-border">
                    <span className="font-medium text-brand-primary">
                      {formatCurrency(order.total)}
                    </span>
                    <Progress
                      value={order.progress}
                      size="sm"
                      className="w-24"
                    />
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Pending Reviews */}
        <div>
          <Card variant="bordered">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-brand-text-dark flex items-center gap-2">
                <Bell className="w-5 h-5 text-brand-warning" />
                รอตรวจสอบ ({pendingReviews.length})
              </h2>
              <Link
                href="/seller/team/review"
                className="text-sm text-brand-primary hover:underline"
              >
                ดูทั้งหมด
              </Link>
            </div>

            <div className="space-y-3">
              {pendingReviews.map((claim) => {
                const worker = mockWorkers.find(
                  (w) => w.id === claim.workerId
                );
                return (
                  <div
                    key={claim.id}
                    className="p-3 rounded-lg bg-brand-bg border border-brand-border"
                  >
                    <div className="flex items-center gap-3">
                      <Avatar
                        src={worker?.avatar}
                        fallback={worker?.displayName}
                        size="sm"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-brand-text-dark truncate">
                          @{worker?.displayName}
                        </p>
                        <p className="text-xs text-brand-text-light">
                          {claim.quantity} รายการ •{" "}
                          {formatCurrency(claim.earnAmount)}
                        </p>
                      </div>
                    </div>

                    <div className="flex gap-2 mt-3">
                      <Button size="sm" className="flex-1" leftIcon={<CheckCircle className="w-4 h-4" />}>
                        อนุมัติ
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="flex-1"
                        leftIcon={<XCircle className="w-4 h-4" />}
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
                  className="py-8"
                />
              )}
            </div>
          </Card>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          {
            label: "สร้างงานให้ทีม",
            href: "/seller/team/jobs/new",
            icon: <ClipboardList className="w-6 h-6" />,
            color: "bg-brand-primary/10 hover:bg-brand-primary/20",
          },
          {
            label: "จัดการบริการ",
            href: "/seller/services",
            icon: <Package className="w-6 h-6" />,
            color: "bg-brand-secondary/20 hover:bg-brand-secondary/30",
          },
          {
            label: "ดูหน้าร้าน",
            href: `/s/${seller?.storeSlug}`,
            icon: <Store className="w-6 h-6" />,
            color: "bg-brand-accent/10 hover:bg-brand-accent/20",
          },
          {
            label: "เติมเงิน",
            href: "/seller/wallet/topup",
            icon: <CreditCard className="w-6 h-6" />,
            color: "bg-brand-success/10 hover:bg-brand-success/20",
          },
        ].map((action, i) => (
          <Link key={i} href={action.href}>
            <Card
              variant="bordered"
              className={`${action.color} transition-colors cursor-pointer`}
            >
              <div className="flex items-center gap-3">
                <span className="text-2xl">{action.icon}</span>
                <span className="font-medium text-brand-text-dark">
                  {action.label}
                </span>
              </div>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}

