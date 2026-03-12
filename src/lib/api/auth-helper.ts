import { createClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function getAuthUser() {
  const supabase = await createClient();
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();
  if (error || !user) return null;

  const dbUser = await prisma.user.findUnique({ where: { id: user.id } });
  return dbUser;
}

export async function requireAuth() {
  const user = await getAuthUser();
  if (!user) {
    return {
      user: null,
      error: NextResponse.json({ error: "Unauthorized" }, { status: 401 }),
    };
  }
  return { user, error: null };
}

export async function requireSeller() {
  const { user, error } = await requireAuth();
  if (error || !user) return { seller: null, user: null, error };

  const seller = await prisma.seller.findUnique({
    where: { userId: user.id },
  });
  if (!seller) {
    return {
      seller: null,
      user,
      error: NextResponse.json({ error: "Seller profile not found" }, { status: 403 }),
    };
  }
  return { seller, user, error: null };
}

export async function requireWorker() {
  const { user, error } = await requireAuth();
  if (error || !user) return { worker: null, user: null, error };

  const worker = await prisma.worker.findUnique({
    where: { userId: user.id },
  });
  if (!worker) {
    return {
      worker: null,
      user,
      error: NextResponse.json({ error: "Worker profile not found" }, { status: 403 }),
    };
  }
  return { worker, user, error: null };
}

export function ok<T>(data: T, status = 200) {
  return NextResponse.json(data, { status });
}

export function err(message: string, status = 400) {
  return NextResponse.json({ error: message }, { status });
}
