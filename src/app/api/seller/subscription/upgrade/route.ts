import { NextRequest, NextResponse } from "next/server";
import { requireSeller } from "@/lib/api/auth-helper";
import { prisma } from "@/lib/prisma";
import { PLANS } from "@/lib/constants/plans";
import type { SubscriptionPlan } from "@/lib/constants/plans";

export async function POST(request: NextRequest) {
  const { seller, error } = await requireSeller();
  if (error) return error;

  const body = await request.json();
  const { plan, paymentMethod, paymentReference, slipUrl } = body;

  if (!plan || !PLANS[plan as SubscriptionPlan]) {
    return NextResponse.json({ error: "Invalid plan" }, { status: 400 });
  }

  const newPlan = plan as SubscriptionPlan;
  const planConfig = PLANS[newPlan];

  const startDate = new Date();
  const endDate = new Date(startDate);
  endDate.setMonth(endDate.getMonth() + 1);

  const [subscription] = await prisma.$transaction([
    prisma.subscription.create({
      data: {
        sellerId: seller!.id,
        plan: newPlan,
        status: "active",
        startDate,
        endDate,
        price: planConfig.price,
      },
    }),
    prisma.seller.update({
      where: { id: seller!.id },
      data: { plan: newPlan, planExpiresAt: endDate },
    }),
    prisma.payment.create({
      data: {
        sellerId: seller!.id,
        type: "subscription",
        amount: planConfig.price,
        method: paymentMethod,
        reference: paymentReference,
        slipUrl,
        status: planConfig.price === 0 ? "confirmed" : "pending",
        confirmedAt: planConfig.price === 0 ? new Date() : null,
      },
    }),
  ]);

  return NextResponse.json({ subscription, plan: newPlan });
}
