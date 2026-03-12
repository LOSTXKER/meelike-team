import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;

  const store = await prisma.store.findUnique({
    where: { slug },
    include: {
      seller: {
        include: {
          services: {
            where: { isActive: true, showInStore: true },
          },
        },
      },
      reviews: {
        orderBy: { createdAt: "desc" },
        take: 10,
      },
    },
  });

  if (!store || !store.isPublic) {
    return NextResponse.json({ error: "Store not found" }, { status: 404 });
  }

  return NextResponse.json({
    store: {
      id: store.id,
      slug: store.slug,
      name: store.name,
      bio: store.bio,
      theme: store.theme,
      logoUrl: store.logoUrl,
      bannerUrl: store.bannerUrl,
      showPricing: store.showPricing,
      showReviews: store.showReviews,
      allowDirectOrder: store.allowDirectOrder,
      services: store.seller.services,
      reviews: store.showReviews ? store.reviews : [],
    },
  });
}
