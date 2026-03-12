import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { canCreateOrder, getOrderQuota } from "@/lib/utils/feature-gate";
import { OVERAGE_FEE } from "@/lib/constants/plans";
import type { SubscriptionPlan } from "@/lib/constants/plans";
import type { Service } from "@/generated/prisma/client";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  const body = await request.json();
  const { customerName, contactType, contactValue, items, note } = body;

  if (!customerName || !items || !Array.isArray(items) || items.length === 0) {
    return NextResponse.json(
      { error: "Customer name and items are required" },
      { status: 400 }
    );
  }

  const store = await prisma.store.findUnique({
    where: { slug },
    include: { seller: true },
  });

  if (!store || !store.isPublic || !store.allowDirectOrder) {
    return NextResponse.json(
      { error: "Store not found or orders disabled" },
      { status: 404 }
    );
  }

  const seller = store.seller;
  const plan = seller.plan as SubscriptionPlan;
  const now = new Date();
  const month = now.getMonth() + 1;
  const year = now.getFullYear();

  const usage = await prisma.orderUsage.findUnique({
    where: { sellerId_month_year: { sellerId: seller.id, month, year } },
  });
  const unpaidBill = await prisma.overageBill.findFirst({
    where: { sellerId: seller.id, status: "pending" },
  });
  const quotaCheck = canCreateOrder(plan, usage?.ordersUsed ?? 0, !!unpaidBill);

  if (!quotaCheck.allowed) {
    return NextResponse.json(
      { error: "Store is temporarily unable to accept orders" },
      { status: 503 }
    );
  }

  const serviceIds = items.map((i: { serviceId: string }) => i.serviceId);
  const services = await prisma.service.findMany({
    where: {
      id: { in: serviceIds },
      sellerId: seller.id,
      isActive: true,
      showInStore: true,
    },
  });

  if (services.length !== serviceIds.length) {
    return NextResponse.json(
      { error: "One or more services are unavailable" },
      { status: 400 }
    );
  }

  const serviceMap = new Map<string, Service>(services.map((s: Service) => [s.id, s]));
  let subtotal = 0;

  const orderItems = items.map((item: { serviceId: string; targetUrl: string; quantity: number }) => {
    const service: Service = serviceMap.get(item.serviceId)!;
    const qty = Math.min(Math.max(item.quantity, service.minQty), service.maxQty);
    const itemSubtotal = service.sellPrice * qty;
    subtotal += itemSubtotal;

    return {
      serviceId: service.id,
      serviceName: service.name,
      serviceType: service.serviceType,
      platform: service.platform,
      targetUrl: item.targetUrl,
      quantity: qty,
      unitPrice: service.sellPrice,
      subtotal: itemSubtotal,
      costPerUnit: service.costPrice ?? 0,
      totalCost: (service.costPrice ?? 0) * qty,
      profit: itemSubtotal - (service.costPrice ?? 0) * qty,
      profitPercent:
        itemSubtotal > 0
          ? ((itemSubtotal - (service.costPrice ?? 0) * qty) / itemSubtotal) * 100
          : 0,
    };
  });

  const orderNumber = `ORD-${Date.now().toString(36).toUpperCase()}`;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const order = await prisma.$transaction(async (tx: any) => {
    const newOrder = await tx.order.create({
      data: {
        orderNumber,
        sellerId: seller.id,
        customerName,
        contactType,
        contactValue,
        customerNote: note,
        subtotal,
        total: subtotal,
        totalCost: orderItems.reduce((s: number, i: { totalCost: number }) => s + i.totalCost, 0),
        totalProfit: orderItems.reduce((s: number, i: { profit: number }) => s + i.profit, 0),
        items: { create: orderItems },
      },
      include: { items: true },
    });

    const quota = getOrderQuota(plan);
    if (quota !== Infinity) {
      await tx.orderUsage.upsert({
        where: { sellerId_month_year: { sellerId: seller.id, month, year } },
        create: {
          sellerId: seller.id,
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
          where: { sellerId_month_year: { sellerId: seller.id, month, year } },
          create: {
            sellerId: seller.id,
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

  const o = order as { id: string; orderNumber: string; total: number };
  return NextResponse.json(
    { order: { id: o.id, orderNumber: o.orderNumber, total: o.total } },
    { status: 201 }
  );
}
