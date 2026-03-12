import { NextResponse } from "next/server";
import { requireWorker } from "@/lib/api/auth-helper";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const { worker, error } = await requireWorker();
  if (error) return error;

  const [approvedClaims, confirmedPayments, pendingPayments] =
    await Promise.all([
      prisma.jobClaim.findMany({
        where: { workerId: worker!.id, status: "approved" },
        include: {
          job: {
            include: { team: { select: { name: true, seller: { select: { displayName: true } } } } },
          },
        },
        orderBy: { reviewedAt: "desc" },
        take: 50,
      }),
      prisma.paymentRecord.findMany({
        where: { workerId: worker!.id, status: "confirmed" },
        orderBy: { confirmedAt: "desc" },
        take: 20,
      }),
      prisma.paymentRecord.findMany({
        where: { workerId: worker!.id, status: "pending" },
        orderBy: { createdAt: "desc" },
      }),
    ]);

  return NextResponse.json({
    totalOwed: worker!.totalOwed,
    totalEarned: worker!.totalEarned,
    approvedClaims,
    confirmedPayments,
    pendingPayments,
  });
}
