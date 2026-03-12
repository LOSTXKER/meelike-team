import { NextResponse } from "next/server";
import { requireSeller } from "@/lib/api/auth-helper";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const { seller, error } = await requireSeller();
  if (error) return error;

  const store = await prisma.store.findUnique({
    where: { sellerId: seller!.id },
    select: { id: true },
  });

  if (!store) {
    return NextResponse.json({ reviews: [] });
  }

  const reviews = await prisma.storeReview.findMany({
    where: { storeId: store.id },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json({ reviews });
}
