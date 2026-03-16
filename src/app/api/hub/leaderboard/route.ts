import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

function getDateRange(period: string): Date | null {
  const now = new Date();
  if (period === "week") {
    const day = now.getDay();
    const diff = day === 0 ? 6 : day - 1;
    const monday = new Date(now);
    monday.setDate(now.getDate() - diff);
    monday.setHours(0, 0, 0, 0);
    return monday;
  }
  if (period === "month") {
    return new Date(now.getFullYear(), now.getMonth(), 1);
  }
  return null; // all-time
}

async function getTopWorkers(since: Date | null) {
  if (since) {
    const claims = await prisma.jobClaim.groupBy({
      by: ["workerId"],
      where: { status: "approved", reviewedAt: { gte: since } },
      _count: { id: true },
      orderBy: { _count: { id: "desc" } },
      take: 20,
    });

    if (claims.length === 0) return [];

    const workerIds = claims.map((c) => c.workerId);
    const workers = await prisma.worker.findMany({
      where: { id: { in: workerIds } },
      include: { user: { select: { name: true, avatarUrl: true } } },
    });

    const workerMap = new Map(workers.map((w) => [w.id, w]));
    return claims.map((c, i) => {
      const w = workerMap.get(c.workerId);
      return {
        rank: i + 1,
        id: c.workerId,
        name: w?.user.name || w?.displayName || "Worker",
        avatar: w?.user.avatarUrl || null,
        level: w?.level || "bronze",
        score: c._count.id,
        rating: w?.rating || 0,
        completionRate: w?.completionRate || 0,
        totalJobs: w?.totalJobs || 0,
      };
    });
  }

  // All-time: use denormalized counter
  const workers = await prisma.worker.findMany({
    where: { isActive: true, totalJobs: { gt: 0 } },
    orderBy: { totalJobs: "desc" },
    take: 20,
    include: { user: { select: { name: true, avatarUrl: true } } },
  });

  return workers.map((w, i) => ({
    rank: i + 1,
    id: w.id,
    name: w.user.name || w.displayName,
    avatar: w.user.avatarUrl || null,
    level: w.level,
    score: w.totalJobs,
    rating: w.rating,
    completionRate: w.completionRate,
    totalJobs: w.totalJobs,
  }));
}

async function getTopSellers(since: Date | null) {
  if (since) {
    const orders = await prisma.order.groupBy({
      by: ["sellerId"],
      where: { status: "completed", createdAt: { gte: since } },
      _count: { id: true },
      orderBy: { _count: { id: "desc" } },
      take: 20,
    });

    if (orders.length === 0) return [];

    const sellerIds = orders.map((o) => o.sellerId);
    const sellers = await prisma.seller.findMany({
      where: { id: { in: sellerIds } },
      include: {
        user: { select: { name: true, avatarUrl: true } },
        _count: { select: { teams: true } },
      },
    });

    const sellerMap = new Map(sellers.map((s) => [s.id, s]));
    return orders.map((o, i) => {
      const s = sellerMap.get(o.sellerId);
      return {
        rank: i + 1,
        id: o.sellerId,
        name: s?.user.name || s?.displayName || "Seller",
        avatar: s?.user.avatarUrl || null,
        plan: s?.plan || "free",
        score: o._count.id,
        teamCount: s?._count.teams || 0,
        slug: s?.slug || "",
      };
    });
  }

  // All-time: count completed orders per seller
  const orders = await prisma.order.groupBy({
    by: ["sellerId"],
    where: { status: "completed" },
    _count: { id: true },
    orderBy: { _count: { id: "desc" } },
    take: 20,
  });

  if (orders.length === 0) return [];

  const sellerIds = orders.map((o) => o.sellerId);
  const sellers = await prisma.seller.findMany({
    where: { id: { in: sellerIds } },
    include: {
      user: { select: { name: true, avatarUrl: true } },
      _count: { select: { teams: true } },
    },
  });

  const sellerMap = new Map(sellers.map((s) => [s.id, s]));
  return orders.map((o, i) => {
    const s = sellerMap.get(o.sellerId);
    return {
      rank: i + 1,
      id: o.sellerId,
      name: s?.user.name || s?.displayName || "Seller",
      avatar: s?.user.avatarUrl || null,
      plan: s?.plan || "free",
      score: o._count.id,
      teamCount: s?._count.teams || 0,
      slug: s?.slug || "",
    };
  });
}

async function getTopTeams(since: Date | null) {
  if (since) {
    const jobs = await prisma.job.groupBy({
      by: ["teamId"],
      where: {
        status: "completed",
        teamId: { not: null },
        updatedAt: { gte: since },
      },
      _count: { id: true },
      orderBy: { _count: { id: "desc" } },
      take: 20,
    });

    if (jobs.length === 0) return [];

    const teamIds = jobs.map((j) => j.teamId).filter(Boolean) as string[];
    const teams = await prisma.team.findMany({
      where: { id: { in: teamIds } },
    });

    const teamMap = new Map(teams.map((t) => [t.id, t]));
    return jobs.map((j, i) => {
      const t = teamMap.get(j.teamId!);
      return {
        rank: i + 1,
        id: j.teamId!,
        name: t?.name || "Team",
        score: j._count.id,
        memberCount: t?.memberCount || 0,
        rating: t?.rating || 0,
        ratingCount: t?.ratingCount || 0,
        totalJobsCompleted: t?.totalJobsCompleted || 0,
      };
    });
  }

  // All-time
  const teams = await prisma.team.findMany({
    where: { isActive: true, totalJobsCompleted: { gt: 0 } },
    orderBy: { totalJobsCompleted: "desc" },
    take: 20,
  });

  return teams.map((t, i) => ({
    rank: i + 1,
    id: t.id,
    name: t.name,
    score: t.totalJobsCompleted,
    memberCount: t.memberCount,
    rating: t.rating,
    ratingCount: t.ratingCount,
    totalJobsCompleted: t.totalJobsCompleted,
  }));
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const type = searchParams.get("type") || "workers";
  const period = searchParams.get("period") || "week";

  const since = getDateRange(period);

  let entries;
  switch (type) {
    case "sellers":
      entries = await getTopSellers(since);
      break;
    case "teams":
      entries = await getTopTeams(since);
      break;
    default:
      entries = await getTopWorkers(since);
  }

  return NextResponse.json({ type, period, entries });
}
