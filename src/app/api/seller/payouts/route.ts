import { NextRequest, NextResponse } from "next/server";
import { requireSeller } from "@/lib/api/auth-helper";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const { seller, error } = await requireSeller();
  if (error) return error;

  // Get all workers with approved jobs that haven't been paid yet
  const pendingPayouts = await prisma.paymentRecord.findMany({
    where: { sellerId: seller!.id, status: "pending" },
    include: {
      worker: {
        include: { user: { select: { name: true } } },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  // Also compute unpaid earnings per worker (approved claims with no payment record)
  const unpaidClaims = await prisma.jobClaim.groupBy({
    by: ["workerId"],
    where: {
      job: { sellerId: seller!.id },
      status: "approved",
    },
    _sum: { earnAmount: true },
    _count: { id: true },
  });

  type ClaimGroup = { workerId: string; _sum: { earnAmount: number | null }; _count: { id: number } };
  const workerIds = (unpaidClaims as ClaimGroup[]).map((c) => c.workerId);

  type WorkerWithUser = {
    id: string;
    displayName: string | null;
    promptPayId: string | null;
    bankCode: string | null;
    bankAccount: string | null;
    user: { name: string | null } | null;
  };

  const workers: WorkerWithUser[] = workerIds.length
    ? await prisma.worker.findMany({
        where: { id: { in: workerIds } },
        include: { user: { select: { name: true } } },
      })
    : [];

  const workerMap = new Map<string, WorkerWithUser>(workers.map((w) => [w.id, w]));

  const checklist = (unpaidClaims as ClaimGroup[]).map((c) => {
    const worker = workerMap.get(c.workerId);
    return {
      workerId: c.workerId,
      workerName: worker?.user?.name ?? worker?.displayName,
      promptPayId: worker?.promptPayId,
      bankCode: worker?.bankCode,
      bankAccount: worker?.bankAccount,
      totalOwed: c._sum.earnAmount ?? 0,
      jobCount: c._count.id,
    };
  });

  return NextResponse.json({ checklist, pendingPayouts });
}

export async function POST(request: NextRequest) {
  const { seller, error } = await requireSeller();
  if (error) return error;

  const body = await request.json();
  const { workerId, amount, method, note, periodStart, periodEnd } = body;

  if (!workerId || !amount) {
    return NextResponse.json(
      { error: "workerId and amount are required" },
      { status: 400 }
    );
  }

  const paymentRecord = await prisma.paymentRecord.create({
    data: {
      sellerId: seller!.id,
      workerId,
      amount,
      method,
      note,
      periodStart: periodStart ? new Date(periodStart) : null,
      periodEnd: periodEnd ? new Date(periodEnd) : null,
      status: "pending",
    },
  });

  return NextResponse.json({ paymentRecord }, { status: 201 });
}
