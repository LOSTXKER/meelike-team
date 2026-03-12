import { NextRequest, NextResponse } from "next/server";
import { requireSeller } from "@/lib/api/auth-helper";
import { prisma } from "@/lib/prisma";
import type { Platform } from "@/generated/prisma/client";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const platform = searchParams.get("platform");
  const status = searchParams.get("status") ?? "open";
  const page = parseInt(searchParams.get("page") ?? "1");
  const limit = parseInt(searchParams.get("limit") ?? "20");

  const jobs = await prisma.outsourceJob.findMany({
    where: {
      status: status as "open" | "in_progress" | "completed" | "cancelled",
      ...(platform ? { platform: platform as Platform } : {}),
    },
    include: { bids: { where: { status: "accepted" }, take: 1 } },
    orderBy: { createdAt: "desc" },
    skip: (page - 1) * limit,
    take: limit,
  });

  return NextResponse.json({ jobs, page, limit });
}

export async function POST(request: NextRequest) {
  const { seller, error } = await requireSeller();
  if (error) return error;

  const body = await request.json();
  const {
    title,
    platform,
    jobType,
    quantity,
    budget,
    suggestedPricePerUnit,
    deadline,
    orderId,
    orderItemId,
  } = body;

  if (!title || !platform || !jobType || !quantity || !budget) {
    return NextResponse.json(
      { error: "title, platform, jobType, quantity, budget are required" },
      { status: 400 }
    );
  }

  const job = await prisma.outsourceJob.create({
    data: {
      sellerId: seller!.id,
      title,
      platform,
      jobType,
      quantity,
      budget,
      suggestedPricePerUnit,
      deadline: deadline ? new Date(deadline) : null,
      orderId,
      orderItemId,
    },
  });

  return NextResponse.json({ job }, { status: 201 });
}
