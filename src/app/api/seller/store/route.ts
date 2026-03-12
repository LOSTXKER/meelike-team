import { NextRequest, NextResponse } from "next/server";
import { requireSeller } from "@/lib/api/auth-helper";
import { prisma } from "@/lib/prisma";
import { getStoreLevel, isPlanAtLeast } from "@/lib/constants/plans";
import type { SubscriptionPlan } from "@/lib/constants/plans";

export async function GET() {
  const { seller, error } = await requireSeller();
  if (error) return error;

  const store = await prisma.store.findUnique({
    where: { sellerId: seller!.id },
    include: { _count: { select: { reviews: true } } },
  });

  return NextResponse.json({ store });
}

export async function PATCH(request: NextRequest) {
  const { seller, error } = await requireSeller();
  if (error) return error;

  const plan = seller!.plan as SubscriptionPlan;
  const storeLevel = getStoreLevel(plan);

  if (storeLevel === "none") {
    return NextResponse.json(
      { error: "แผน Free ไม่รองรับ Store กรุณาอัปเกรดเป็น Starter ขึ้นไป" },
      { status: 403 }
    );
  }

  const body = await request.json();

  if (body.customDomain && !isPlanAtLeast(plan, "enterprise")) {
    return NextResponse.json(
      { error: "Custom domain ต้องการแผน Enterprise" },
      { status: 403 }
    );
  }

  if (body.whiteLabel && !isPlanAtLeast(plan, "business")) {
    return NextResponse.json(
      { error: "White label ต้องการแผน Business ขึ้นไป" },
      { status: 403 }
    );
  }

  const store = await prisma.store.upsert({
    where: { sellerId: seller!.id },
    create: {
      sellerId: seller!.id,
      slug: seller!.slug,
      name: seller!.displayName,
      level: storeLevel,
      ...body,
    },
    update: { level: storeLevel, ...body },
  });

  return NextResponse.json({ store });
}
