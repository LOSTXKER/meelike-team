import { NextRequest, NextResponse } from "next/server";
import { requireSeller } from "@/lib/api/auth-helper";
import { prisma } from "@/lib/prisma";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ workerId: string }> }
) {
  const { error } = await requireSeller();
  if (error) return error;

  const { workerId } = await params;
  const { searchParams } = new URL(request.url);
  const amount = parseFloat(searchParams.get("amount") ?? "0");

  const worker = await prisma.worker.findUnique({
    where: { id: workerId },
    select: { promptPayId: true, displayName: true },
  });

  if (!worker || !worker.promptPayId) {
    return NextResponse.json(
      { error: "Worker not found or has no PromptPay ID" },
      { status: 404 }
    );
  }

  return NextResponse.json({
    promptPayId: worker.promptPayId,
    workerName: worker.displayName,
    amount,
  });
}
