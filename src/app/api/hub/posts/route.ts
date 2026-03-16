import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/api/auth-helper";
import { prisma } from "@/lib/prisma";
import type { Platform } from "@/generated/prisma/client";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const type = searchParams.get("type");
  const platform = searchParams.get("platform");
  const page = parseInt(searchParams.get("page") ?? "1");
  const limit = parseInt(searchParams.get("limit") ?? "20");

  const rows = await prisma.hubPost.findMany({
    where: {
      status: "active",
      ...(type ? { type: type as "recruit" | "find_team" | "outsource" } : {}),
      ...(platform ? { platforms: { has: platform as Platform } } : {}),
    },
    orderBy: { createdAt: "desc" },
    skip: (page - 1) * limit,
    take: limit,
  });

  // Look up author info for each post
  const authorIds = [...new Set(rows.map((r) => r.authorId))];
  const users = await prisma.user.findMany({
    where: { id: { in: authorIds } },
    include: { seller: true },
  });
  const userMap = Object.fromEntries(users.map((u) => [u.id, u]));

  const posts = rows.map((row) => {
    const user = userMap[row.authorId];
    return {
      ...row,
      author: {
        name: user?.name ?? "Unknown",
        avatar: user?.name?.charAt(0) ?? "?",
        rating: 4.5,
        verified: !!user?.seller,
        type: (user?.role === "seller" ? "seller" : "worker") as "seller" | "worker",
        memberCount: undefined,
      },
    };
  });

  return NextResponse.json({ posts, page, limit });
}

export async function POST(request: NextRequest) {
  const { user, error } = await requireAuth();
  if (error) return error;

  const body = await request.json();
  const { type, title, content, platforms, tags, metadata, expiresAt } = body;

  if (!type || !content) {
    return NextResponse.json(
      { error: "type and content are required" },
      { status: 400 }
    );
  }

  const post = await prisma.hubPost.create({
    data: {
      authorId: user!.id,
      type,
      title,
      content,
      platforms: platforms ?? [],
      tags: tags ?? [],
      metadata,
      expiresAt: expiresAt ? new Date(expiresAt) : null,
    },
  });

  return NextResponse.json({ post }, { status: 201 });
}
