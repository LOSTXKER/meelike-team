import { NextRequest, NextResponse } from "next/server";
import { requireSeller } from "@/lib/api/auth-helper";
import { prisma } from "@/lib/prisma";
import { canCreateOrder, getOrderQuota } from "@/lib/utils/feature-gate";
import { OVERAGE_FEE } from "@/lib/constants/plans";
import type { SubscriptionPlan } from "@/lib/constants/plans";
import type { Service } from "@/generated/prisma/client";

export async function GET() {
  const { seller, error } = await requireSeller();
  if (error) return error;

  const orders = await prisma.order.findMany({
    where: { sellerId: seller!.id },
    include: { items: true },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json({ orders });
}

export async function POST(request: NextRequest) {
  const { seller, error } = await requireSeller();
  if (error) return error;

  const body = await request.json();
  const {
    customerName,
    contactType,
    contactValue,
    customerNote,
    items,
    discount = 0,
  } = body;

  if (!customerName || !items || !Array.isArray(items) || items.length === 0) {
    return NextResponse.json(
      { error: "Customer name and items are required" },
      { status: 400 }
    );
  }

  const plan = seller!.plan as SubscriptionPlan;
  const now = new Date();
  const month = now.getMonth() + 1;
  const year = now.getFullYear();

  const usage = await prisma.orderUsage.findUnique({
    where: { sellerId_month_year: { sellerId: seller!.id, month, year } },
  });

  const unpaidBill = await prisma.overageBill.findFirst({
    where: { sellerId: seller!.id, status: "pending" },
  });

  const usedOrders = usage?.ordersUsed ?? 0;
  const quotaCheck = canCreateOrder(plan, usedOrders, !!unpaidBill);

  if (!quotaCheck.allowed) {
    return NextResponse.json({ error: quotaCheck.reason }, { status: 402 });
  }

  const serviceIds = items
    .map((i: { serviceId?: string }) => i.serviceId)
    .filter(Boolean) as string[];

  const services = serviceIds.length
    ? await prisma.service.findMany({
        where: { id: { in: serviceIds }, sellerId: seller!.id },
      })
    : [];

  const serviceMap = new Map<string, Service>(services.map((s: Service) => [s.id, s]));

  let subtotal = 0;
  const orderItems = items.map(
    (item: {
      serviceId?: string;
      serviceName?: string;
      platform: string;
      serviceType: string;
      targetUrl: string;
      quantity: number;
      unitPrice?: number;
    }) => {
      const service = item.serviceId ? serviceMap.get(item.serviceId) : null;
      const unitPrice = item.unitPrice ?? service?.sellPrice ?? 0;
      const costPerUnit = service?.costPrice ?? 0;
      const qty = item.quantity;
      const itemSubtotal = unitPrice * qty;
      const totalCost = costPerUnit * qty;
      const profit = itemSubtotal - totalCost;

      subtotal += itemSubtotal;

      return {
        serviceId: item.serviceId ?? null,
        serviceName: item.serviceName ?? service?.name ?? "Custom",
        serviceType: item.serviceType as string,
        platform: item.platform as string,
        targetUrl: item.targetUrl,
        quantity: qty,
        unitPrice,
        subtotal: itemSubtotal,
        costPerUnit,
        totalCost,
        profit,
        profitPercent: itemSubtotal > 0 ? (profit / itemSubtotal) * 100 : 0,
      };
    }
  );

  const total = Math.max(0, subtotal - discount);
  const totalCost = orderItems.reduce(
    (sum: number, i: { totalCost: number }) => sum + i.totalCost,
    0
  );
  const totalProfit = total - totalCost;
  const orderNumber = `ORD-${Date.now().toString(36).toUpperCase()}`;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const order = await prisma.$transaction(async (tx: any) => {
    const newOrder = await tx.order.create({
      data: {
        orderNumber,
        sellerId: seller!.id,
        customerName,
        contactType,
        contactValue,
        customerNote,
        subtotal,
        discount,
        total,
        totalCost,
        totalProfit,
        items: { create: orderItems },
      },
      include: { items: true },
    });

    const quota = getOrderQuota(plan);
    if (quota !== Infinity) {
      await tx.orderUsage.upsert({
        where: { sellerId_month_year: { sellerId: seller!.id, month, year } },
        create: {
          sellerId: seller!.id,
          month,
          year,
          ordersUsed: 1,
          quotaLimit: quota,
          overageCount: quotaCheck.isOverage ? 1 : 0,
        },
        update: {
          ordersUsed: { increment: 1 },
          overageCount: quotaCheck.isOverage ? { increment: 1 } : undefined,
        },
      });

      if (quotaCheck.isOverage) {
        await tx.overageBill.upsert({
          where: { sellerId_month_year: { sellerId: seller!.id, month, year } },
          create: {
            sellerId: seller!.id,
            month,
            year,
            overageOrders: 1,
            feePerOrder: OVERAGE_FEE,
            totalAmount: OVERAGE_FEE,
            status: "pending",
          },
          update: {
            overageOrders: { increment: 1 },
            totalAmount: { increment: OVERAGE_FEE },
          },
        });
      }
    }

    return newOrder;
  });

  return NextResponse.json(
    {
      order,
      warning: quotaCheck.isOverage ? quotaCheck.reason : undefined,
    },
    { status: 201 }
  );
}
