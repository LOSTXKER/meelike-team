import { NextRequest, NextResponse } from "next/server";
import { requireSeller } from "@/lib/api/auth-helper";
import { prisma } from "@/lib/prisma";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { seller, error } = await requireSeller();
  if (error) return error;

  const { id } = await params;
  const order = await prisma.order.findFirst({
    where: { id, sellerId: seller!.id },
    include: { items: { include: { jobs: true } }, timeline: true },
  });

  if (!order) {
    return NextResponse.json({ error: "Order not found" }, { status: 404 });
  }

  return NextResponse.json({ order });
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { seller, error } = await requireSeller();
  if (error) return error;

  const { id } = await params;
  const body = await request.json();
  const { action, paymentProof } = body;

  const order = await prisma.order.findFirst({
    where: { id, sellerId: seller!.id },
  });

  if (!order) {
    return NextResponse.json({ error: "Order not found" }, { status: 404 });
  }

  if (action === "confirm_payment") {
    const updated = await prisma.order.update({
      where: { id },
      data: {
        paymentStatus: "paid",
        status: "processing",
        paidAt: new Date(),
        confirmedAt: new Date(),
        timeline: {
          create: {
            event: "payment_confirmed",
            message: paymentProof
              ? `Payment confirmed with proof: ${paymentProof}`
              : "Payment confirmed",
          },
        },
      },
      include: { items: true, timeline: true },
    });
    return NextResponse.json({ order: updated });
  }

  if (action === "cancel") {
    const { reason } = body;
    const updated = await prisma.order.update({
      where: { id },
      data: {
        status: "cancelled",
        items: { updateMany: { where: { orderId: id }, data: { status: "cancelled" } } },
        timeline: {
          create: { event: "cancelled", message: reason ?? "Order cancelled" },
        },
      },
      include: { items: true, timeline: true },
    });
    return NextResponse.json({ order: updated });
  }

  return NextResponse.json({ error: "Unknown action" }, { status: 400 });
}
