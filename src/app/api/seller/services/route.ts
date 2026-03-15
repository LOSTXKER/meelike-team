import { NextRequest, NextResponse } from "next/server";
import { requireSeller } from "@/lib/api/auth-helper";
import { prisma } from "@/lib/prisma";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function mapService(s: any) {
  return {
    ...s,
    minQuantity: s.minQty,
    maxQuantity: s.maxQty,
    category: s.platform,
    type: s.serviceType,
  };
}

export async function GET() {
  const { seller, error } = await requireSeller();
  if (error) return error;

  const services = await prisma.service.findMany({
    where: { sellerId: seller!.id },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json({ services: services.map(mapService) });
}

export async function POST(request: NextRequest) {
  const { seller, error } = await requireSeller();
  if (error) return error;

  const body = await request.json();
  const {
    name,
    description,
    platform,
    serviceType,
    mode,
    costPrice,
    workerRate,
    sellPrice,
    minQty,
    maxQty,
    meelikeServiceId,
    isActive,
    showInStore,
  } = body;

  if (!name || !platform || !serviceType || !sellPrice) {
    return NextResponse.json(
      { error: "name, platform, serviceType and sellPrice are required" },
      { status: 400 }
    );
  }

  const service = await prisma.service.create({
    data: {
      sellerId: seller!.id,
      name,
      description,
      platform,
      serviceType,
      mode: mode ?? "human",
      costPrice: costPrice ?? null,
      workerRate: workerRate ?? null,
      sellPrice,
      minQty: minQty ?? 1,
      maxQty: maxQty ?? 10000,
      meelikeServiceId: meelikeServiceId ?? null,
      isActive: isActive ?? true,
      showInStore: showInStore ?? false,
    },
  });

  return NextResponse.json({ service: mapService(service) }, { status: 201 });
}
