import { NextResponse } from "next/server";
import { requireSeller } from "@/lib/api/auth-helper";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const { seller, error } = await requireSeller();
  if (error) return error;

  const now = new Date();
  const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

  const [
    totalOrders,
    pendingOrders,
    todayOrders,
    monthOrders,
    totalRevenue,
    monthRevenue,
    totalProfit,
    activeJobs,
  ] = await Promise.all([
    prisma.order.count({ where: { sellerId: seller!.id } }),
    prisma.order.count({
      where: { sellerId: seller!.id, status: { in: ["pending", "processing", "confirmed"] } },
    }),
    prisma.order.count({
      where: { sellerId: seller!.id, createdAt: { gte: startOfToday } },
    }),
    prisma.order.count({
      where: { sellerId: seller!.id, createdAt: { gte: startOfMonth } },
    }),
    prisma.order.aggregate({
      where: { sellerId: seller!.id, paymentStatus: "paid" },
      _sum: { total: true },
    }),
    prisma.order.aggregate({
      where: {
        sellerId: seller!.id,
        paymentStatus: "paid",
        createdAt: { gte: startOfMonth },
      },
      _sum: { total: true },
    }),
    prisma.order.aggregate({
      where: { sellerId: seller!.id, paymentStatus: "paid" },
      _sum: { totalProfit: true },
    }),
    prisma.job.count({
      where: { sellerId: seller!.id, status: { in: ["pending", "in_progress"] } },
    }),
  ]);

  return NextResponse.json({
    totalOrders,
    pendingOrders,
    todayOrders,
    monthOrders,
    totalRevenue: totalRevenue._sum.total ?? 0,
    monthRevenue: monthRevenue._sum.total ?? 0,
    totalProfit: totalProfit._sum.totalProfit ?? 0,
    activeJobs,
  });
}
