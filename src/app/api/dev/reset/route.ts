import { NextResponse } from "next/server";
import { clearAll, seedDemo } from "@/lib/dev/seed";
import { getAuthUser } from "@/lib/api/auth-helper";
import { prisma } from "@/lib/prisma";

export async function POST() {
  if (process.env.NODE_ENV !== "development") {
    return NextResponse.json({ error: "Dev only" }, { status: 403 });
  }

  try {
    // Resolve logged-in seller before clearing
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

    // Clear all seed data (preserves @meelike.com auth users)
    await clearAll();

    // Re-seed under the logged-in seller
    await seedDemo(
      sellerId && userId ? { sellerId, userId } : undefined
    );

    return NextResponse.json({ ok: true, message: "Reset and re-seeded successfully" });
  } catch (error) {
    console.error("[dev/reset]", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Reset failed" },
      { status: 500 }
    );
  }
}
