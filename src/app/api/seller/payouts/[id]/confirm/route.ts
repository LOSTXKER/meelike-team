import { NextRequest, NextResponse } from "next/server";
import { requireSeller } from "@/lib/api/auth-helper";
import { prisma } from "@/lib/prisma";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { seller, error } = await requireSeller();
  if (error) return error;

  const { id } = await params;
  const body = await request.json();
  const { slipUrl, note } = body;

  const record = await prisma.paymentRecord.findFirst({
    where: { id, sellerId: seller!.id },
  });

  if (!record) {
    return NextResponse.json({ error: "Payment record not found" }, { status: 404 });
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const updated = await prisma.$transaction(async (tx: any) => {
    const r = await tx.paymentRecord.update({
      where: { id },
      data: {
        status: "confirmed",
        slipUrl: slipUrl ?? record.slipUrl,
        note: note ?? record.note,
        confirmedAt: new Date(),
      },
    });

    await tx.worker.update({
      where: { id: record.workerId },
      data: { totalOwed: { decrement: record.amount } },
    });

    return r;
  });

  return NextResponse.json({ paymentRecord: updated });
}
