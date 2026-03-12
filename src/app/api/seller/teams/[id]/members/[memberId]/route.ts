import { NextRequest, NextResponse } from "next/server";
import { requireSeller } from "@/lib/api/auth-helper";
import { prisma } from "@/lib/prisma";

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; memberId: string }> }
) {
  const { seller, error } = await requireSeller();
  if (error) return error;

  const { id, memberId } = await params;
  const body = await request.json();
  const { role, status } = body;

  const team = await prisma.team.findFirst({
    where: { id, sellerId: seller!.id },
  });

  if (!team) {
    return NextResponse.json({ error: "Team not found" }, { status: 404 });
  }

  const updated = await prisma.teamMember.update({
    where: { id: memberId },
    data: {
      ...(role ? { role } : {}),
      ...(status ? { status } : {}),
    },
  });

  return NextResponse.json({ member: updated });
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string; memberId: string }> }
) {
  const { seller, error } = await requireSeller();
  if (error) return error;

  const { id, memberId } = await params;
  const team = await prisma.team.findFirst({
    where: { id, sellerId: seller!.id },
  });

  if (!team) {
    return NextResponse.json({ error: "Team not found" }, { status: 404 });
  }

  await prisma.teamMember.delete({ where: { id: memberId } });
  await prisma.team.update({
    where: { id },
    data: { memberCount: { decrement: 1 } },
  });

  return NextResponse.json({ success: true });
}
