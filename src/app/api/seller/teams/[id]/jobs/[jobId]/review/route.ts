import { NextRequest, NextResponse } from "next/server";
import { requireSeller } from "@/lib/api/auth-helper";
import { prisma } from "@/lib/prisma";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; jobId: string }> }
) {
  const { seller, error } = await requireSeller();
  if (error) return error;

  const { id, jobId } = await params;
  const body = await request.json();
  const { claimId, action, rejectionReason } = body;

  if (!claimId || !action) {
    return NextResponse.json(
      { error: "claimId and action are required" },
      { status: 400 }
    );
  }

  const team = await prisma.team.findFirst({
    where: { id, sellerId: seller!.id },
  });

  if (!team) {
    return NextResponse.json({ error: "Team not found" }, { status: 404 });
  }

  const claim = await prisma.jobClaim.findFirst({
    where: { id: claimId, jobId },
  });

  if (!claim) {
    return NextResponse.json({ error: "Claim not found" }, { status: 404 });
  }

  if (action === "approve") {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const updatedClaim = await prisma.$transaction(async (tx: any) => {
      const c = await tx.jobClaim.update({
        where: { id: claimId },
        data: { status: "approved", reviewedAt: new Date() },
      });

      await tx.worker.update({
        where: { id: claim.workerId },
        data: {
          totalEarned: { increment: claim.earnAmount },
          totalOwed: { increment: claim.earnAmount },
          totalJobs: { increment: 1 },
        },
      });

      await tx.job.update({
        where: { id: jobId },
        data: {
          completedQuantity: {
            increment: claim.actualQuantity ?? claim.quantity,
          },
        },
      });

      return c;
    });

    return NextResponse.json({ claim: updatedClaim });
  }

  if (action === "reject") {
    const updatedClaim = await prisma.jobClaim.update({
      where: { id: claimId },
      data: {
        status: "rejected",
        reviewedAt: new Date(),
        note: rejectionReason,
      },
    });

    return NextResponse.json({ claim: updatedClaim });
  }

  return NextResponse.json({ error: "Unknown action" }, { status: 400 });
}
