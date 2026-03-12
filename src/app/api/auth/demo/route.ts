import { NextRequest, NextResponse } from "next/server";
import { createClient as createAdminClient } from "@supabase/supabase-js";
import { prisma } from "@/lib/prisma";

const DEMO_PASSWORD = "demo1234";

const DEMO_ACCOUNTS = {
  seller: {
    email: "demo-seller@meelike.com",
    name: "Demo Seller",
    displayName: "Demo Seller",
    slug: "demo-seller",
  },
  worker: {
    email: "demo-worker@meelike.com",
    name: "Demo Worker",
    displayName: "Demo Worker",
  },
  admin: {
    email: "admin@meelike.com",
    name: "Admin",
  },
};

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const role = body.role as "seller" | "worker" | "admin";

    if (!role || !DEMO_ACCOUNTS[role]) {
      return NextResponse.json({ error: "Invalid role" }, { status: 400 });
    }

    const account = DEMO_ACCOUNTS[role];

    const supabaseAdmin = createAdminClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    // Try to find existing user, or create one
    const { data: existingUsers } = await supabaseAdmin.auth.admin.listUsers();
    let authUser = existingUsers?.users?.find(
      (u) => u.email === account.email
    );

    if (!authUser) {
      const { data: newUser, error: createError } =
        await supabaseAdmin.auth.admin.createUser({
          email: account.email,
          password: DEMO_PASSWORD,
          email_confirm: true,
          user_metadata: { name: account.name, role },
        });

      if (createError) {
        console.error("Failed to create demo auth user:", createError);
        return NextResponse.json(
          { error: "Failed to create demo user" },
          { status: 500 }
        );
      }
      authUser = newUser.user;
    }

    // Ensure DB records exist
    let dbUser = await prisma.user.findUnique({
      where: { id: authUser.id },
    });

    if (!dbUser) {
      dbUser = await prisma.user.create({
        data: {
          id: authUser.id,
          email: account.email,
          name: account.name,
          role: role === "admin" ? "seller" : role,
        },
      });
    }

    if (role === "seller" || role === "admin") {
      const sellerData = DEMO_ACCOUNTS.seller;
      const existing = await prisma.seller.findUnique({
        where: { userId: dbUser.id },
      });
      if (!existing) {
        await prisma.seller.create({
          data: {
            userId: dbUser.id,
            displayName: sellerData.displayName,
            slug: sellerData.slug + "-" + dbUser.id.slice(0, 6),
            plan: "pro",
          },
        });
      }
    }

    if (role === "worker") {
      const workerData = DEMO_ACCOUNTS.worker;
      const existing = await prisma.worker.findUnique({
        where: { userId: dbUser.id },
      });
      if (!existing) {
        await prisma.worker.create({
          data: {
            userId: dbUser.id,
            displayName: workerData.displayName,
          },
        });
      }
    }

    // Sign in via admin API to get session tokens
    const { data: signInData, error: signInError } =
      await supabaseAdmin.auth.admin.generateLink({
        type: "magiclink",
        email: account.email,
      });

    if (signInError) {
      console.error("Failed to generate magic link:", signInError);
    }

    // Return credentials for the client to sign in
    return NextResponse.json({
      email: account.email,
      password: DEMO_PASSWORD,
      role,
      userId: dbUser.id,
      token_hash: signInData?.properties?.hashed_token,
    });
  } catch (error) {
    console.error("Demo login error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
