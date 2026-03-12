import { NextResponse } from "next/server";
import { requireSeller } from "@/lib/api/auth-helper";
import { prisma } from "@/lib/prisma";
import { getOrderQuota } from "@/lib/utils/feature-gate";
import type { SubscriptionPlan } from "@/lib/constants/plans";

export async function GET() {
  const { seller, error } = await requireSeller();
  if (error) return error;

  const now = new Date();
  const month = now.getMonth() + 1;
  const year = now.getFullYear();

  const [subscription, usage, unpaidBill] = await Promise.all([
    prisma.subscription.findFirst({
      where: { sellerId: seller!.id, status: "active" },
      orderBy: { createdAt: "desc" },
    }),
    prisma.orderUsage.findUnique({
      where: { sellerId_month_year: { sellerId: seller!.id, month, year } },
    }),
    prisma.overageBill.findFirst({
      where: { sellerId: seller!.id, status: "pending" },
    }),
  ]);

  const plan = seller!.plan as SubscriptionPlan;
  const quota = getOrderQuota(plan);
  const ordersUsed = usage?.ordersUsed ?? 0;

  return NextResponse.json({
    plan,
    planExpiresAt: seller!.planExpiresAt,
    subscription,
    usage: {
      month,
      year,
      ordersUsed,
      quotaLimit: quota === Infinity ? null : quota,
      overageCount: usage?.overageCount ?? 0,
    },
    hasUnpaidOverageBill: !!unpaidBill,
    unpaidBill,
  });
}
