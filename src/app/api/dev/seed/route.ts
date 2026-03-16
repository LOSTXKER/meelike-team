import { NextResponse } from "next/server";
import { clearAll, seedDemo } from "@/lib/dev/seed";
import { getAuthUser } from "@/lib/api/auth-helper";
import { prisma } from "@/lib/prisma";

export async function POST() {
  if (process.env.NODE_ENV !== "development") {
    return NextResponse.json({ error: "Dev only" }, { status: 403 });
  }

  try {
    // Try to resolve the logged-in seller so seed data belongs to them
    const user = await getAuthUser();
    let sellerId: string | undefined;
    let userId: string | undefined;

    if (user) {
      const seller = await prisma.seller.findUnique({ where: { userId: user.id } });
      if (seller) {
        sellerId = seller.id;
        userId = user.id;
      }
    }

    await seedDemo(
      sellerId && userId ? { sellerId, userId } : undefined
    );

    return NextResponse.json({ ok: true, message: "Seeded successfully" });
  } catch (error) {
    console.error("[dev/seed]", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Seed failed" },
      { status: 500 }
    );
  }
}
