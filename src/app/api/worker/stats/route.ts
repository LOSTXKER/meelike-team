import { NextResponse } from "next/server";
import { requireWorker } from "@/lib/api/auth-helper";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const { worker, error } = await requireWorker();
  if (error) return error;

  const now = new Date();
  const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const startOfWeek = new Date(startOfToday);
  startOfWeek.setDate(startOfToday.getDate() - startOfToday.getDay());

  const [
    todayEarnings,
    weekEarnings,
    activeJobs,
    pendingReviews,
  ] = await Promise.all([
    prisma.jobClaim.aggregate({
      where: {
        workerId: worker!.id,
        status: "approved",
        reviewedAt: { gte: startOfToday },
      },
      _sum: { earnAmount: true },
    }),
    prisma.jobClaim.aggregate({
      where: {
        workerId: worker!.id,
        status: "approved",
        reviewedAt: { gte: startOfWeek },
      },
      _sum: { earnAmount: true },
    }),
    prisma.jobClaim.count({
      where: { workerId: worker!.id, status: "claimed" },
    }),
    prisma.jobClaim.count({
      where: { workerId: worker!.id, status: "submitted" },
    }),
  ]);

  return NextResponse.json({
    todayEarnings: todayEarnings._sum.earnAmount ?? 0,
    weekEarnings: weekEarnings._sum.earnAmount ?? 0,
    totalEarned: worker!.totalEarned,
    totalOwed: worker!.totalOwed,
    activeJobs,
    pendingReviews,
    level: worker!.level,
  });
}
