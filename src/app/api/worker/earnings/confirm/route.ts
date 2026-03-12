import { NextRequest, NextResponse } from "next/server";
import { requireWorker } from "@/lib/api/auth-helper";
import { prisma } from "@/lib/prisma";

export async function POST(request: NextRequest) {
  const { worker, error } = await requireWorker();
  if (error) return error;

  const body = await request.json();
  const { paymentRecordId } = body;

  if (!paymentRecordId) {
    return NextResponse.json(
      { error: "paymentRecordId is required" },
      { status: 400 }
    );
  }

  const record = await prisma.paymentRecord.findFirst({
    where: { id: paymentRecordId, workerId: worker!.id },
  });

  if (!record) {
    return NextResponse.json(
      { error: "Payment record not found" },
      { status: 404 }
    );
  }

  if (record.status === "confirmed") {
    return NextResponse.json(
      { error: "Already confirmed" },
      { status: 400 }
    );
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const updated = await prisma.$transaction(async (tx: any) => {
    const r = await tx.paymentRecord.update({
      where: { id: paymentRecordId },
      data: { status: "confirmed", confirmedAt: new Date() },
    });

    await tx.worker.update({
      where: { id: worker!.id },
      data: { totalOwed: { decrement: record.amount } },
    });

    return r;
  });

  return NextResponse.json({ paymentRecord: updated });
}
