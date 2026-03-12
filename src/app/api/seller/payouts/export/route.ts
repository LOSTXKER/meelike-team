import { NextResponse } from "next/server";
import { requireSeller } from "@/lib/api/auth-helper";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const { seller, error } = await requireSeller();
  if (error) return error;

  const unpaidClaims = await prisma.jobClaim.groupBy({
    by: ["workerId"],
    where: {
      job: { sellerId: seller!.id },
      status: "approved",
    },
    _sum: { earnAmount: true },
  });

  type ClaimGroup = { workerId: string; _sum: { earnAmount: number | null } };
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

  const rows = (unpaidClaims as ClaimGroup[]).map((c) => {
    const worker = workerMap.get(c.workerId);
    return [
      worker?.user?.name ?? worker?.displayName ?? "Unknown",
      worker?.promptPayId ?? "",
      worker?.bankCode ?? "",
      worker?.bankAccount ?? "",
      (c._sum.earnAmount ?? 0).toFixed(2),
    ];
  });

  const headers = ["ชื่อ", "PromptPay", "ธนาคาร", "เลขบัญชี", "จำนวน (บาท)"];
  const csvContent = [headers, ...rows]
    .map((row) => row.map((cell: string) => `"${cell}"`).join(","))
    .join("\n");

  return new NextResponse(csvContent, {
    status: 200,
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="payout-${new Date().toISOString().split("T")[0]}.csv"`,
    },
  });
}
