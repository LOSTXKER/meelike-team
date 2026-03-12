"use client";

/**
 * Dev Tools — deprecated
 * Previously used to seed and manage localStorage mock data.
 * Now that the backend uses Supabase/Prisma, use Prisma Studio for database management.
 */
export function DevTools() {
  if (process.env.NODE_ENV !== "development") return null;
  return null;
}

export default DevTools;
