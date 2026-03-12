import { NextRequest, NextResponse } from "next/server";
import { requireSeller } from "@/lib/api/auth-helper";
import { prisma } from "@/lib/prisma";
import { isPlanAtLeast } from "@/lib/utils/feature-gate";
import { PLANS } from "@/lib/constants/plans";
import type { SubscriptionPlan } from "@/lib/constants/plans";

export async function GET() {
  const { seller, error } = await requireSeller();
  if (error) return error;

  const teams = await prisma.team.findMany({
    where: { sellerId: seller!.id },
    include: { _count: { select: { members: true } } },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json({ teams });
}

export async function POST(request: NextRequest) {
  const { seller, error } = await requireSeller();
  if (error) return error;

  const body = await request.json();
  const { name, description, requireApproval, isPublic, isRecruiting } = body;

  if (!name) {
    return NextResponse.json({ error: "Team name is required" }, { status: 400 });
  }

  const plan = seller!.plan as SubscriptionPlan;
  const planConfig = PLANS[plan];
  const currentTeams = await prisma.team.count({
    where: { sellerId: seller!.id },
  });

  const maxTeams = planConfig.teams;
  if (maxTeams !== Infinity && currentTeams >= maxTeams) {
    return NextResponse.json(
      {
        error: `แผน ${planConfig.name} รองรับสูงสุด ${maxTeams} ทีม กรุณาอัปเกรดแผน`,
      },
      { status: 403 }
    );
  }

  if (!isPlanAtLeast(plan, "free")) {
    return NextResponse.json(
      { error: "ต้องการแผน Free ขึ้นไปเพื่อสร้างทีม" },
      { status: 403 }
    );
  }

  const team = await prisma.team.create({
    data: {
      sellerId: seller!.id,
      name,
      description,
      requireApproval: requireApproval ?? false,
      isPublic: isPublic ?? true,
      isRecruiting: isRecruiting ?? false,
    },
  });

  return NextResponse.json({ team }, { status: 201 });
}
