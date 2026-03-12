import { NextResponse } from "next/server";
import { requireSeller } from "@/lib/api/auth-helper";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const { seller, error } = await requireSeller();
  if (error) return error;

  const usageRecords = await prisma.orderUsage.findMany({
    where: { sellerId: seller!.id },
    orderBy: [{ year: "desc" }, { month: "desc" }],
    take: 12,
  });

  return NextResponse.json({ usage: usageRecords });
}
