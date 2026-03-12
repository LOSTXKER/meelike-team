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
  const { actualQuantity, proofUrls, note } = body;

  const claim = await prisma.jobClaim.findFirst({
    where: { jobId: id, workerId: worker!.id, status: "claimed" },
  });

  if (!claim) {
    return NextResponse.json(
      { error: "Active claim not found" },
      { status: 404 }
    );
  }

  const updated = await prisma.jobClaim.update({
    where: { id: claim.id },
    data: {
      status: "submitted",
      actualQuantity: actualQuantity ?? claim.quantity,
      proofUrls: proofUrls ?? [],
      note,
      submittedAt: new Date(),
      earnAmount: (actualQuantity ?? claim.quantity) * (claim.earnAmount / claim.quantity),
    },
  });

  return NextResponse.json({ claim: updated });
}
