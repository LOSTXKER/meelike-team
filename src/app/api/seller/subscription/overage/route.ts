import { NextResponse } from "next/server";
import { requireSeller } from "@/lib/api/auth-helper";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const { seller, error } = await requireSeller();
  if (error) return error;

  const bills = await prisma.overageBill.findMany({
    where: { sellerId: seller!.id },
    orderBy: [{ year: "desc" }, { month: "desc" }],
  });

  return NextResponse.json({ bills });
}
