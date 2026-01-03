"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import {
  BarChart3,
  TrendingUp,
  TrendingDown,
  DollarSign,
  ShoppingBag,
  Users,
  CheckCircle,
  XCircle,
  Star,
  Calendar,
  ArrowUpRight,
  ArrowDownRight,
  Package,
  Clock,
  Target,
  Award,
  Zap,
  PieChart,
  Activity,
  Eye,
} from "lucide-react";
import { Card, Badge, Button, Skeleton, Tabs } from "@/components/ui";
import { Container, Grid, Section } from "@/components/layout";
import { PageHeader, StatsGrid } from "@/components/shared";
import { useSellerOrders, useSellerServices, useSellerTeams, useTransactions } from "@/lib/api/hooks";
import { computeAnalytics } from "@/lib/utils/analytics";
import { formatCurrency, cn } from "@/lib/utils";

type Period = "today" | "week" | "month" | "year";

export default function AnalyticsPage() {
  const [period, setPeriod] = useState<Period>("month");
  
  // Load data from localStorage
  const { data: orders = [], isLoading: isLoadingOrders } = useSellerOrders();
  const { data: services = [], isLoading: isLoadingServices } = useSellerServices();
  const { data: teams = [], isLoading: isLoadingTeams } = useSellerTeams();
  const { data: transactions = [], isLoading: isLoadingTransactions } = useTransactions();
  
  const isLoading = isLoadingOrders || isLoadingServices || isLoadingTeams || isLoadingTransactions;

  const periodLabels: Record<Period, string> = {
    today: "วันนี้",
    week: "สัปดาห์นี้",
    month: "เดือนนี้",
    year: "ปีนี้",
  };

  // Compute analytics from stored data
  const mockAnalytics = useMemo(() => {
    if (isLoading || !orders || !services || !teams || !transactions) {
      // Return empty structure while loading
      return {
        overview: {
          totalRevenue: 0,
          revenueChange: 0,
          totalOrders: 0,
          ordersChange: 0,
          totalCustomers: 0,
          customersChange: 0,
          successRate: 0,
          successRateChange: 0,
          avgOrderValue: 0,
          avgOrderValueChange: 0,
          repeatCustomerRate: 0,
        },
        revenueByDay: [],
        revenueByMonth: [],
        topServices: [],
        topTeams: [],
        orderStatus: { completed: 0, inProgress: 0, pending: 0, failed: 0 },
        customerInsights: { newCustomers: 0, returningCustomers: 0, avgOrdersPerCustomer: 0, topCustomerSpend: 0 },
        peakHours: [],
      };
    }
    return computeAnalytics(orders, services, teams, transactions);
  }, [orders, services, teams, transactions, isLoading]);

  // Calculate max for charts
  const maxRevenue = Math.max(...mockAnalytics.revenueByDay.map((d) => d.value), 1);
  const maxOrders = Math.max(...mockAnalytics.peakHours.map((d) => d.orders), 1);

  if (isLoading) {
    return (
      <div className="space-y-6 animate-fade-in">
        <PageHeader title="Analytics" description="วิเคราะห์ข้อมูลธุรกิจของคุณ" icon={BarChart3} />
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
          {[...Array(5)].map((_, i) => (
            <Skeleton key={i} className="h-28 rounded-2xl" />
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Skeleton className="h-80 rounded-2xl" />
          <Skeleton className="h-80 rounded-2xl" />
        </div>
      </div>
    );
  }

  return (
    <Container size="xl">
      <Section spacing="md" className="animate-fade-in pb-12">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <PageHeader
            title="Analytics"
            description="วิเคราะห์ข้อมูลและประสิทธิภาพธุรกิจของคุณ"
            icon={BarChart3}
          />

          {/* Period Selector */}
          <Tabs
            tabs={[
              { id: "today", label: "วันนี้" },
              { id: "week", label: "สัปดาห์นี้" },
              { id: "month", label: "เดือนนี้" },
              { id: "year", label: "ปีนี้" },
            ]}
            activeTab={period}
            onChange={(id) => setPeriod(id as Period)}
            variant="pills"
          />
        </div>

        {/* Overview Stats */}
        <Grid cols={2} responsive={{ md: 3, lg: 4 }} gap={4}>
        <StatCard
          label="รายได้รวม"
          value={formatCurrency(mockAnalytics.overview.totalRevenue)}
          change={mockAnalytics.overview.revenueChange}
          icon={DollarSign}
          color="green"
        />
        <StatCard
          label="ออเดอร์ทั้งหมด"
          value={mockAnalytics.overview.totalOrders.toLocaleString()}
          change={mockAnalytics.overview.ordersChange}
          icon={ShoppingBag}
          color="blue"
        />
        <StatCard
          label="ลูกค้าทั้งหมด"
          value={mockAnalytics.overview.totalCustomers.toString()}
          change={mockAnalytics.overview.customersChange}
          icon={Users}
          color="purple"
        />
        <StatCard
          label="อัตราสำเร็จ"
          value={`${mockAnalytics.overview.successRate}%`}
          change={mockAnalytics.overview.successRateChange}
          icon={CheckCircle}
          color="emerald"
        />
        <StatCard
          label="ค่าเฉลี่ย/ออเดอร์"
          value={formatCurrency(mockAnalytics.overview.avgOrderValue)}
          change={mockAnalytics.overview.avgOrderValueChange}
          icon={Target}
          color="orange"
        />
        </Grid>

        {/* Charts Row */}
        <Grid cols={1} responsive={{ lg: 2 }} gap={6}>
        {/* Revenue Chart */}
        <Card variant="elevated" className="p-6 border-none shadow-lg">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="font-bold text-brand-text-dark flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-brand-success" />
                รายได้รายวัน
              </h3>
              <p className="text-sm text-brand-text-light mt-1">7 วันล่าสุด</p>
            </div>
            <Badge variant="success" className="flex items-center gap-1">
              <ArrowUpRight className="w-3 h-3" />
              +12.5%
            </Badge>
          </div>

          {/* Simple Bar Chart */}
          <div className="flex items-end justify-between gap-2 h-48">
            {mockAnalytics.revenueByDay.map((day, i) => (
              <div key={day.day} className="flex-1 flex flex-col items-center gap-2">
                <div className="w-full flex flex-col items-center">
                  <span className="text-xs font-medium text-brand-text-dark mb-1">
                    {formatCurrency(day.value)}
                  </span>
                  <div
                    className={cn(
                      "w-full rounded-t-lg transition-all hover:opacity-80",
                      i === mockAnalytics.revenueByDay.length - 2
                        ? "bg-brand-primary"
                        : "bg-brand-primary/30"
                    )}
                    style={{
                      height: `${(day.value / maxRevenue) * 140}px`,
                    }}
                  />
                </div>
                <span className="text-xs text-brand-text-light">{day.day}</span>
              </div>
            ))}
          </div>
        </Card>

        {/* Peak Hours Chart */}
        <Card variant="elevated" className="p-6 border-none shadow-lg">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="font-bold text-brand-text-dark flex items-center gap-2">
                <Clock className="w-5 h-5 text-brand-info" />
                ชั่วโมงที่ขายดี
              </h3>
              <p className="text-sm text-brand-text-light mt-1">ช่วงเวลาที่มีออเดอร์เยอะที่สุด</p>
            </div>
            <Badge variant="info">
              Peak: 19:00
            </Badge>
          </div>

          {/* Simple Line-like Bar Chart */}
          <div className="flex items-end justify-between gap-1 h-48">
            {mockAnalytics.peakHours.map((hour, i) => {
              const isPeak = hour.orders === maxOrders;
              return (
                <div key={hour.hour} className="flex-1 flex flex-col items-center gap-1">
                  <div
                    className={cn(
                      "w-full rounded-t transition-all hover:opacity-80",
                      isPeak ? "bg-brand-info" : "bg-brand-info/30"
                    )}
                    style={{
                      height: `${(hour.orders / maxOrders) * 140}px`,
                    }}
                  />
                  <span className="text-[10px] text-brand-text-light rotate-45 origin-left">
                    {hour.hour.split(":")[0]}
                  </span>
                </div>
              );
            })}
          </div>
        </Card>
        </Grid>

        {/* Second Row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Order Status */}
        <Card variant="elevated" className="p-6 border-none shadow-lg">
          <h3 className="font-bold text-brand-text-dark flex items-center gap-2 mb-6">
            <PieChart className="w-5 h-5 text-brand-primary" />
            สถานะออเดอร์
          </h3>

          <div className="space-y-4">
            <StatusRow
              label="สำเร็จ"
              value={mockAnalytics.orderStatus.completed}
              total={mockAnalytics.overview.totalOrders}
              color="bg-brand-success"
            />
            <StatusRow
              label="กำลังทำ"
              value={mockAnalytics.orderStatus.inProgress}
              total={mockAnalytics.overview.totalOrders}
              color="bg-brand-info"
            />
            <StatusRow
              label="รอดำเนินการ"
              value={mockAnalytics.orderStatus.pending}
              total={mockAnalytics.overview.totalOrders}
              color="bg-brand-warning"
            />
            <StatusRow
              label="ล้มเหลว"
              value={mockAnalytics.orderStatus.failed}
              total={mockAnalytics.overview.totalOrders}
              color="bg-brand-error"
            />
          </div>

          <div className="mt-6 pt-4 border-t border-brand-border/50">
            <div className="flex items-center justify-between text-sm">
              <span className="text-brand-text-light">อัตราสำเร็จ</span>
              <span className="font-bold text-brand-success">
                {mockAnalytics.overview.successRate}%
              </span>
            </div>
          </div>
        </Card>

        {/* Top Services */}
        <Card variant="elevated" className="p-6 border-none shadow-lg lg:col-span-2">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-bold text-brand-text-dark flex items-center gap-2">
              <Package className="w-5 h-5 text-brand-warning" />
              บริการยอดนิยม
            </h3>
            <Link href="/seller/services">
              <Button variant="ghost" size="sm">
                ดูทั้งหมด
              </Button>
            </Link>
          </div>

          <div className="space-y-3">
            {mockAnalytics.topServices.map((service, i) => (
              <div
                key={service.name}
                className="flex items-center gap-4 p-3 rounded-xl bg-brand-bg/50 hover:bg-brand-bg transition-colors"
              >
                <div
                  className={cn(
                    "w-8 h-8 rounded-lg flex items-center justify-center text-white font-bold text-sm",
                    i === 0
                      ? "bg-yellow-500"
                      : i === 1
                      ? "bg-gray-400"
                      : i === 2
                      ? "bg-amber-600"
                      : "bg-brand-text-light"
                  )}
                >
                  {i + 1}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-brand-text-dark truncate">{service.name}</p>
                  <p className="text-xs text-brand-text-light">{service.orders} ออเดอร์</p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-brand-text-dark">{formatCurrency(service.revenue)}</p>
                  <p
                    className={cn(
                      "text-xs flex items-center justify-end gap-0.5",
                      service.growth >= 0 ? "text-brand-success" : "text-brand-error"
                    )}
                  >
                    {service.growth >= 0 ? (
                      <ArrowUpRight className="w-3 h-3" />
                    ) : (
                      <ArrowDownRight className="w-3 h-3" />
                    )}
                    {Math.abs(service.growth)}%
                  </p>
                </div>
              </div>
            ))}
          </div>
        </Card>
        </div>

        {/* Third Row */}
        <Grid cols={1} responsive={{ lg: 3 }} gap={6}>
        {/* Customer Insights */}
        <Card variant="elevated" className="p-6 border-none shadow-lg">
          <h3 className="font-bold text-brand-text-dark flex items-center gap-2 mb-6">
            <Users className="w-5 h-5 text-purple-500" />
            ข้อมูลลูกค้า
          </h3>

          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 rounded-xl bg-green-50">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-100 rounded-lg">
                  <Zap className="w-4 h-4 text-green-600" />
                </div>
                <span className="text-sm text-brand-text-dark">ลูกค้าใหม่</span>
              </div>
              <span className="font-bold text-green-600">{mockAnalytics.customerInsights.newCustomers}</span>
            </div>

            <div className="flex items-center justify-between p-3 rounded-xl bg-blue-50">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Users className="w-4 h-4 text-blue-600" />
                </div>
                <span className="text-sm text-brand-text-dark">ลูกค้าเก่า</span>
              </div>
              <span className="font-bold text-blue-600">{mockAnalytics.customerInsights.returningCustomers}</span>
            </div>

            <div className="flex items-center justify-between p-3 rounded-xl bg-purple-50">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <Activity className="w-4 h-4 text-purple-600" />
                </div>
                <span className="text-sm text-brand-text-dark">ออเดอร์เฉลี่ย/ลูกค้า</span>
              </div>
              <span className="font-bold text-purple-600">{mockAnalytics.customerInsights.avgOrdersPerCustomer}</span>
            </div>

            <div className="flex items-center justify-between p-3 rounded-xl bg-amber-50">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-amber-100 rounded-lg">
                  <Award className="w-4 h-4 text-amber-600" />
                </div>
                <span className="text-sm text-brand-text-dark">ลูกค้าสูงสุด</span>
              </div>
              <span className="font-bold text-amber-600">
                {formatCurrency(mockAnalytics.customerInsights.topCustomerSpend)}
              </span>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-brand-border/50">
            <div className="flex items-center justify-between text-sm">
              <span className="text-brand-text-light">อัตราลูกค้ากลับมาซื้อ</span>
              <span className="font-bold text-brand-primary">
                {mockAnalytics.overview.repeatCustomerRate}%
              </span>
            </div>
          </div>
        </Card>

        {/* Top Teams */}
        <Card variant="elevated" className="p-6 border-none shadow-lg lg:col-span-2">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-bold text-brand-text-dark flex items-center gap-2">
              <Award className="w-5 h-5 text-amber-500" />
              ทีมยอดเยี่ยม
            </h3>
            <Link href="/seller/team">
              <Button variant="ghost" size="sm">
                ดูทั้งหมด
              </Button>
            </Link>
          </div>

          <div className="space-y-4">
            {mockAnalytics.topTeams.map((team, i) => (
              <div
                key={team.name}
                className="flex items-center gap-4 p-4 rounded-xl border border-brand-border/50 hover:border-brand-primary/30 hover:shadow-md transition-all"
              >
                <div
                  className={cn(
                    "w-12 h-12 rounded-xl flex items-center justify-center text-white font-bold",
                    i === 0
                      ? "bg-gradient-to-br from-yellow-400 to-amber-500"
                      : i === 1
                      ? "bg-gradient-to-br from-gray-300 to-gray-400"
                      : "bg-gradient-to-br from-amber-500 to-amber-700"
                  )}
                >
                  #{i + 1}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-brand-text-dark">{team.name}</p>
                  <div className="flex items-center gap-3 mt-1 text-xs text-brand-text-light">
                    <span className="flex items-center gap-1">
                      <Users className="w-3 h-3" />
                      {team.members} คน
                    </span>
                    <span className="flex items-center gap-1">
                      <CheckCircle className="w-3 h-3" />
                      {team.completedJobs} งาน
                    </span>
                    <span className="flex items-center gap-1 text-yellow-500">
                      <Star className="w-3 h-3 fill-yellow-500" />
                      {team.rating}
                    </span>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold text-brand-primary">{formatCurrency(team.revenue)}</p>
                  <p className="text-xs text-brand-text-light">รายได้เดือนนี้</p>
                </div>
              </div>
            ))}
          </div>
        </Card>
        </Grid>

        {/* Monthly Revenue Chart */}
      <Card variant="elevated" className="p-6 border-none shadow-lg">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="font-bold text-brand-text-dark flex items-center gap-2">
              <Activity className="w-5 h-5 text-brand-primary" />
              รายได้รายเดือน
            </h3>
            <p className="text-sm text-brand-text-light mt-1">6 เดือนล่าสุด</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-brand-primary" />
              <span className="text-sm text-brand-text-light">รายได้</span>
            </div>
          </div>
        </div>

        {/* Monthly Bar Chart */}
        <div className="flex items-end justify-between gap-4 h-64">
          {mockAnalytics.revenueByMonth.map((month, i) => {
            const maxMonthly = Math.max(...mockAnalytics.revenueByMonth.map((m) => m.value));
            const isCurrentMonth = i === mockAnalytics.revenueByMonth.length - 1;
            return (
              <div key={month.month} className="flex-1 flex flex-col items-center gap-3">
                <span className="text-sm font-bold text-brand-text-dark">
                  {formatCurrency(month.value)}
                </span>
                <div
                  className={cn(
                    "w-full rounded-t-xl transition-all hover:opacity-80",
                    isCurrentMonth
                      ? "bg-gradient-to-t from-brand-primary to-brand-primary/70"
                      : "bg-brand-primary/30"
                  )}
                  style={{
                    height: `${(month.value / maxMonthly) * 180}px`,
                  }}
                />
                <span
                  className={cn(
                    "text-sm font-medium",
                    isCurrentMonth ? "text-brand-primary" : "text-brand-text-light"
                  )}
                >
                  {month.month}
                </span>
              </div>
            );
          })}
        </div>
        </Card>

        {/* Quick Insights */}
        <Grid cols={1} responsive={{ md: 2, lg: 4 }} gap={4}>
        <InsightCard
          icon={Eye}
          title="การเข้าชมหน้าร้าน"
          value="2,847"
          change={18.5}
          description="ครั้ง/เดือน"
        />
        <InsightCard
          icon={Target}
          title="Conversion Rate"
          value="4.38%"
          change={-0.5}
          description="ผู้เข้าชม → ลูกค้า"
        />
        <InsightCard
          icon={Clock}
          title="เวลาตอบกลับเฉลี่ย"
          value="< 2 ชม."
          change={12}
          description="เร็วกว่าค่าเฉลี่ย"
        />
        <InsightCard
          icon={Star}
          title="คะแนนรีวิว"
          value="4.9"
          change={0.1}
          description="จาก 5 คะแนน"
        />
        </Grid>
      </Section>
    </Container>
  );
}

// Components
function StatCard({
  label,
  value,
  change,
  icon: Icon,
  color,
}: {
  label: string;
  value: string;
  change: number;
  icon: React.ElementType;
  color: "green" | "blue" | "purple" | "emerald" | "orange";
}) {
  const colorClasses = {
    green: "bg-green-50 text-green-600",
    blue: "bg-blue-50 text-blue-600",
    purple: "bg-purple-50 text-purple-600",
    emerald: "bg-emerald-50 text-emerald-600",
    orange: "bg-orange-50 text-orange-600",
  };

  return (
    <Card variant="elevated" className="p-4 border-none shadow-md hover:shadow-lg transition-shadow">
      <div className="flex items-start justify-between mb-3">
        <div className={cn("p-2 rounded-xl", colorClasses[color])}>
          <Icon className="w-5 h-5" />
        </div>
        <div
          className={cn(
            "flex items-center gap-0.5 text-xs font-medium",
            change >= 0 ? "text-brand-success" : "text-brand-error"
          )}
        >
          {change >= 0 ? (
            <ArrowUpRight className="w-3 h-3" />
          ) : (
            <ArrowDownRight className="w-3 h-3" />
          )}
          {Math.abs(change)}%
        </div>
      </div>
      <p className="text-2xl font-bold text-brand-text-dark">{value}</p>
      <p className="text-xs text-brand-text-light mt-1">{label}</p>
    </Card>
  );
}

function StatusRow({
  label,
  value,
  total,
  color,
}: {
  label: string;
  value: number;
  total: number;
  color: string;
}) {
  const percentage = (value / total) * 100;

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between text-sm">
        <span className="text-brand-text-dark">{label}</span>
        <span className="font-medium text-brand-text-dark">
          {value.toLocaleString()} ({percentage.toFixed(1)}%)
        </span>
      </div>
      <div className="h-2 bg-brand-bg rounded-full overflow-hidden">
        <div
          className={cn("h-full rounded-full transition-all", color)}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}

function InsightCard({
  icon: Icon,
  title,
  value,
  change,
  description,
}: {
  icon: React.ElementType;
  title: string;
  value: string;
  change: number;
  description: string;
}) {
  return (
    <Card variant="elevated" className="p-4 border-none shadow-md">
      <div className="flex items-center gap-3">
        <div className="p-2 bg-brand-primary/10 rounded-xl">
          <Icon className="w-5 h-5 text-brand-primary" />
        </div>
        <div className="flex-1">
          <p className="text-xs text-brand-text-light">{title}</p>
          <div className="flex items-baseline gap-2">
            <p className="text-xl font-bold text-brand-text-dark">{value}</p>
            <span
              className={cn(
                "text-xs flex items-center gap-0.5",
                change >= 0 ? "text-brand-success" : "text-brand-error"
              )}
            >
              {change >= 0 ? "↑" : "↓"} {Math.abs(change)}%
            </span>
          </div>
          <p className="text-xs text-brand-text-light">{description}</p>
        </div>
      </div>
    </Card>
  );
}
