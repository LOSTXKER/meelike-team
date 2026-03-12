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
  const team = await prisma.team.findFirst({
    where: { id, sellerId: seller!.id },
    include: {
      members: { include: { worker: { include: { user: true } } } },
      _count: { select: { jobs: true } },
    },
  });

  if (!team) {
    return NextResponse.json({ error: "Team not found" }, { status: 404 });
  }

  return NextResponse.json({ team });
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { seller, error } = await requireSeller();
  if (error) return error;

  const { id } = await params;
  const body = await request.json();

  const team = await prisma.team.findFirst({
    where: { id, sellerId: seller!.id },
  });

  if (!team) {
    return NextResponse.json({ error: "Team not found" }, { status: 404 });
  }

  const updated = await prisma.team.update({ where: { id }, data: body });
  return NextResponse.json({ team: updated });
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { seller, error } = await requireSeller();
  if (error) return error;

  const { id } = await params;
  const team = await prisma.team.findFirst({
    where: { id, sellerId: seller!.id },
  });

  if (!team) {
    return NextResponse.json({ error: "Team not found" }, { status: 404 });
  }

  await prisma.team.delete({ where: { id } });
  return NextResponse.json({ success: true });
}
