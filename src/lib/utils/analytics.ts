/**
 * Analytics Utilities
 * 
 * Derives analytics from localStorage-backed data (orders, services, teams, transactions)
 */

import type { Order, StoreService, Team, TeamJob } from "@/types";
import type { Transaction } from "@/lib/api";

export interface AnalyticsOverview {
  totalRevenue: number;
  revenueChange: number;
  totalOrders: number;
  ordersChange: number;
  totalCustomers: number;
  customersChange: number;
  successRate: number;
  successRateChange: number;
  avgOrderValue: number;
  avgOrderValueChange: number;
  repeatCustomerRate: number;
}

export interface RevenueDataPoint {
  day: string;
  value: number;
  orders: number;
}

export interface MonthlyDataPoint {
  month: string;
  value: number;
}

export interface TopService {
  name: string;
  orders: number;
  revenue: number;
  growth: number;
}

export interface TopTeam {
  name: string;
  members: number;
  completedJobs: number;
  rating: number;
  revenue: number;
}

export interface OrderStatusBreakdown {
  completed: number;
  inProgress: number;
  pending: number;
  failed: number;
}

export interface CustomerInsights {
  newCustomers: number;
  returningCustomers: number;
  avgOrdersPerCustomer: number;
  topCustomerSpend: number;
}

export interface PeakHourData {
  hour: string;
  orders: number;
}

export interface DerivedAnalytics {
  overview: AnalyticsOverview;
  revenueByDay: RevenueDataPoint[];
  revenueByMonth: MonthlyDataPoint[];
  topServices: TopService[];
  topTeams: TopTeam[];
  orderStatus: OrderStatusBreakdown;
  customerInsights: CustomerInsights;
  peakHours: PeakHourData[];
}

/**
 * Compute analytics from stored data
 */
export function computeAnalytics(
  orders: Order[],
  services: StoreService[],
  teams: Team[],
  transactions: Transaction[]
): DerivedAnalytics {
  // Get time ranges
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
  const monthAgo = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000);
  const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
  
  // Filter orders by time
  const completedOrders = orders.filter(o => o.status === "completed");
  const thisMonthOrders = completedOrders.filter(o => new Date(o.createdAt) >= monthAgo);
  const lastMonthOrders = completedOrders.filter(o => {
    const date = new Date(o.createdAt);
    return date >= lastMonth && date < monthAgo;
  });
  
  // Overview stats
  const totalRevenue = completedOrders.reduce((sum, o) => sum + o.total, 0);
  const thisMonthRevenue = thisMonthOrders.reduce((sum, o) => sum + o.total, 0);
  const lastMonthRevenue = lastMonthOrders.reduce((sum, o) => sum + o.total, 0);
  const revenueChange = lastMonthRevenue > 0 
    ? ((thisMonthRevenue - lastMonthRevenue) / lastMonthRevenue) * 100 
    : 0;
  
  const ordersChange = lastMonthOrders.length > 0
    ? ((thisMonthOrders.length - lastMonthOrders.length) / lastMonthOrders.length) * 100
    : 0;
  
  // Customer analytics
  const customerMap = new Map<string, number>();
  completedOrders.forEach(order => {
    const customerId = order.customer.contactValue;
    customerMap.set(customerId, (customerMap.get(customerId) || 0) + 1);
  });
  
  const totalCustomers = customerMap.size;
  const repeatCustomers = Array.from(customerMap.values()).filter(count => count > 1).length;
  const repeatCustomerRate = totalCustomers > 0 ? (repeatCustomers / totalCustomers) * 100 : 0;
  
  const avgOrderValue = completedOrders.length > 0 
    ? totalRevenue / completedOrders.length 
    : 0;
  
  // Success rate
  const totalOrdersAll = orders.length;
  const successRate = totalOrdersAll > 0 
    ? (completedOrders.length / totalOrdersAll) * 100 
    : 100;
  
  // Revenue by day (last 7 days)
  const revenueByDay: RevenueDataPoint[] = [];
  const dayNames = ["อา.", "จ.", "อ.", "พ.", "พฤ.", "ศ.", "ส."];
  for (let i = 6; i >= 0; i--) {
    const date = new Date(today.getTime() - i * 24 * 60 * 60 * 1000);
    const dayStart = new Date(date.getFullYear(), date.getMonth(), date.getDate());
    const dayEnd = new Date(dayStart.getTime() + 24 * 60 * 60 * 1000);
    
    const dayOrders = completedOrders.filter(o => {
      const orderDate = new Date(o.createdAt);
      return orderDate >= dayStart && orderDate < dayEnd;
    });
    
    revenueByDay.push({
      day: dayNames[date.getDay()],
      value: dayOrders.reduce((sum, o) => sum + o.total, 0),
      orders: dayOrders.length,
    });
  }
  
  // Revenue by month (last 6 months)
  const revenueByMonth: MonthlyDataPoint[] = [];
  const monthNames = ["ม.ค.", "ก.พ.", "มี.ค.", "เม.ย.", "พ.ค.", "มิ.ย.", "ก.ค.", "ส.ค.", "ก.ย.", "ต.ค.", "พ.ย.", "ธ.ค."];
  for (let i = 5; i >= 0; i--) {
    const monthDate = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const monthStart = new Date(monthDate.getFullYear(), monthDate.getMonth(), 1);
    const monthEnd = new Date(monthDate.getFullYear(), monthDate.getMonth() + 1, 0, 23, 59, 59);
    
    const monthOrders = completedOrders.filter(o => {
      const orderDate = new Date(o.createdAt);
      return orderDate >= monthStart && orderDate <= monthEnd;
    });
    
    revenueByMonth.push({
      month: monthNames[monthDate.getMonth()],
      value: monthOrders.reduce((sum, o) => sum + o.total, 0),
    });
  }
  
  // Top services
  const serviceRevenue = new Map<string, { orders: number; revenue: number }>();
  completedOrders.forEach(order => {
    order.items.forEach(item => {
      const current = serviceRevenue.get(item.serviceName) || { orders: 0, revenue: 0 };
      serviceRevenue.set(item.serviceName, {
        orders: current.orders + 1,
        revenue: current.revenue + item.subtotal,
      });
    });
  });
  
  const topServices: TopService[] = Array.from(serviceRevenue.entries())
    .map(([name, data]) => ({
      name,
      orders: data.orders,
      revenue: data.revenue,
      growth: 10, // Mock growth - would need historical comparison
    }))
    .sort((a, b) => b.revenue - a.revenue)
    .slice(0, 5);
  
  // Top teams (mock revenue data)
  const topTeams: TopTeam[] = teams.slice(0, 3).map(team => ({
    name: team.name,
    members: team.memberCount,
    completedJobs: team.totalJobsCompleted,
    rating: team.rating,
    revenue: 45000, // Would derive from team jobs
  }));
  
  // Order status breakdown
  const orderStatus: OrderStatusBreakdown = {
    completed: orders.filter(o => o.status === "completed").length,
    inProgress: orders.filter(o => o.status === "processing").length,
    pending: orders.filter(o => o.status === "pending").length,
    failed: orders.filter(o => o.status === "cancelled").length,
  };
  
  // Customer insights
  const newCustomersThisMonth = Array.from(customerMap.entries()).filter(([customerId, count]) => {
    const firstOrder = completedOrders.find(o => o.customer.contactValue === customerId);
    return firstOrder && new Date(firstOrder.createdAt) >= monthAgo;
  }).length;
  
  const avgOrdersPerCustomer = totalCustomers > 0 
    ? Math.round(completedOrders.length / totalCustomers) 
    : 0;
  
  const topCustomerSpend = Math.max(...Array.from(customerMap.entries()).map(([customerId]) => {
    return completedOrders
      .filter(o => o.customer.contactValue === customerId)
      .reduce((sum, o) => sum + o.total, 0);
  }), 0);
  
  // Peak hours
  const hourCounts = new Array(24).fill(0);
  completedOrders.forEach(order => {
    const hour = new Date(order.createdAt).getHours();
    hourCounts[hour]++;
  });
  
  const peakHours: PeakHourData[] = [];
  for (let h = 9; h <= 21; h++) {
    peakHours.push({
      hour: `${h.toString().padStart(2, '0')}:00`,
      orders: hourCounts[h],
    });
  }
  
  return {
    overview: {
      totalRevenue,
      revenueChange,
      totalOrders: completedOrders.length,
      ordersChange,
      totalCustomers,
      customersChange: 15, // Mock
      successRate,
      successRateChange: 0.3, // Mock
      avgOrderValue,
      avgOrderValueChange: -2.1, // Mock
      repeatCustomerRate,
    },
    revenueByDay,
    revenueByMonth,
    topServices,
    topTeams,
    orderStatus,
    customerInsights: {
      newCustomers: newCustomersThisMonth,
      returningCustomers: repeatCustomers,
      avgOrdersPerCustomer,
      topCustomerSpend,
    },
    peakHours,
  };
}
