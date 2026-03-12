import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password, name, role = "seller" } = body;

    if (!email || !password || !name) {
      return NextResponse.json(
        { error: "Email, password and name are required" },
        { status: 400 }
      );
    }

    if (!["seller", "worker"].includes(role)) {
      return NextResponse.json({ error: "Invalid role" }, { status: 400 });
    }

    const supabase = await createClient();
    const { data, error } = await supabase.auth.signUp({ email, password });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    if (!data.user) {
      return NextResponse.json({ error: "Registration failed" }, { status: 400 });
    }

    const slug = name
      .toLowerCase()
      .replace(/\s+/g, "-")
      .replace(/[^a-z0-9-]/g, "")
      .substring(0, 30);

    const uniqueSlug = `${slug}-${Date.now().toString(36)}`;

    const user = await prisma.user.create({
      data: {
        id: data.user.id,
        email,
        name,
        role: role as "seller" | "worker",
        ...(role === "seller"
          ? {
              seller: {
                create: {
                  displayName: name,
                  slug: uniqueSlug,
                  plan: "free",
                },
              },
            }
          : {
              worker: {
                create: {
                  displayName: name,
                },
              },
            }),
      },
      include: { seller: true, worker: true },
    });

    return NextResponse.json({ user, session: data.session }, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
