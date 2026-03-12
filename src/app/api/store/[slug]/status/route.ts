import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  const orderNumber = request.nextUrl.searchParams.get("orderNumber");

  if (!orderNumber) {
    return NextResponse.json({ error: "orderNumber is required" }, { status: 400 });
  }

  const store = await prisma.store.findFirst({
    where: { slug },
    select: { sellerId: true },
  });

  if (!store) {
    return NextResponse.json({ error: "Store not found" }, { status: 404 });
  }

  const order = await prisma.order.findFirst({
    where: {
      sellerId: store.sellerId,
      orderNumber: { equals: orderNumber, mode: "insensitive" },
    },
    include: {
      items: true,
      timeline: { orderBy: { createdAt: "asc" } },
    },
  });

  if (!order) {
    return NextResponse.json({ error: "Order not found" }, { status: 404 });
  }

  return NextResponse.json({ order });
}
