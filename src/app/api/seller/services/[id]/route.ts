import { NextRequest, NextResponse } from "next/server";
import { requireSeller } from "@/lib/api/auth-helper";
import { prisma } from "@/lib/prisma";

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { seller, error } = await requireSeller();
  if (error) return error;

  const { id } = await params;
  const body = await request.json();

  const service = await prisma.service.findFirst({
    where: { id, sellerId: seller!.id },
  });

  if (!service) {
    return NextResponse.json({ error: "Service not found" }, { status: 404 });
  }

  const updated = await prisma.service.update({
    where: { id },
    data: body,
  });

  return NextResponse.json({ service: updated });
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { seller, error } = await requireSeller();
  if (error) return error;

  const { id } = await params;

  const service = await prisma.service.findFirst({
    where: { id, sellerId: seller!.id },
  });

  if (!service) {
    return NextResponse.json({ error: "Service not found" }, { status: 404 });
  }

  await prisma.service.delete({ where: { id } });

  return NextResponse.json({ success: true });
}
