import { NextRequest, NextResponse } from "next/server";
import { requireWorker } from "@/lib/api/auth-helper";
import { prisma } from "@/lib/prisma";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { worker, error } = await requireWorker();
  if (error) return error;

  const { id } = await params;
  const body = await request.json();
  const { quantity, workerAccountId } = body;

  if (!quantity || quantity <= 0) {
    return NextResponse.json({ error: "Invalid quantity" }, { status: 400 });
  }

  const job = await prisma.job.findUnique({ where: { id } });

  if (!job) {
    return NextResponse.json({ error: "Job not found" }, { status: 404 });
  }

  if (job.status === "cancelled" || job.status === "completed") {
    return NextResponse.json(
      { error: "Job is no longer available" },
      { status: 400 }
    );
  }

  const available = job.quantity - job.claimedQuantity;
  if (quantity > available) {
    return NextResponse.json(
      { error: `Only ${available} units available to claim` },
      { status: 400 }
    );
  }

  const existingClaim = await prisma.jobClaim.findFirst({
    where: { jobId: id, workerId: worker!.id, status: { in: ["claimed", "submitted"] } },
  });

  if (existingClaim) {
    return NextResponse.json(
      { error: "You already have an active claim on this job" },
      { status: 400 }
    );
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const claim = await prisma.$transaction(async (tx: any) => {
    const c = await tx.jobClaim.create({
      data: {
        jobId: id,
        workerId: worker!.id,
        workerAccountId,
        quantity,
        earnAmount: quantity * job.pricePerUnit,
        status: "claimed",
      },
    });

    await tx.job.update({
      where: { id },
      data: { claimedQuantity: { increment: quantity }, status: "in_progress" },
    });

    return c;
  });

  return NextResponse.json({ claim }, { status: 201 });
}
