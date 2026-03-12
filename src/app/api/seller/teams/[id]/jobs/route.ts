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
  });

  if (!team) {
    return NextResponse.json({ error: "Team not found" }, { status: 404 });
  }

  const jobs = await prisma.job.findMany({
    where: { teamId: id },
    include: { claims: { include: { worker: true } } },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json({ jobs });
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { seller, error } = await requireSeller();
  if (error) return error;

  const { id } = await params;
  const body = await request.json();
  const {
    title,
    serviceName,
    platform,
    serviceType,
    targetUrl,
    instructions,
    quantity,
    pricePerUnit,
    visibility,
    minWorkerLevel,
    isUrgent,
    deadline,
  } = body;

  if (!serviceName || !platform || !serviceType || !targetUrl || !quantity || !pricePerUnit) {
    return NextResponse.json(
      { error: "serviceName, platform, serviceType, targetUrl, quantity, pricePerUnit are required" },
      { status: 400 }
    );
  }

  const team = await prisma.team.findFirst({
    where: { id, sellerId: seller!.id },
  });

  if (!team) {
    return NextResponse.json({ error: "Team not found" }, { status: 404 });
  }

  const job = await prisma.job.create({
    data: {
      sellerId: seller!.id,
      teamId: id,
      title,
      serviceName,
      platform,
      serviceType,
      targetUrl,
      instructions,
      quantity,
      pricePerUnit,
      totalPayout: quantity * pricePerUnit,
      visibility: visibility ?? "team",
      allowedWorkerIds: [],
      minWorkerLevel,
      isUrgent: isUrgent ?? false,
      deadline: deadline ? new Date(deadline) : null,
    },
  });

  await prisma.team.update({
    where: { id },
    data: { activeJobCount: { increment: 1 } },
  });

  return NextResponse.json({ job }, { status: 201 });
}
