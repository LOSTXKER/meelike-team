/**
 * Auth Guard
 *
 * Utility for checking authentication and permissions in mock API functions.
 * Reads the JWT from Zustand's persisted state in localStorage.
 */

import { verifyMockJWT, type JWTPayload } from "./jwt";
import { hasPermission, type Permission } from "./permissions";
import { AuthError } from "@/lib/errors";
import { ApiError } from "@/lib/errors";

/**
 * Get the current auth token from persisted Zustand state.
 */
function getTokenFromStorage(): string | null {
  if (typeof window === "undefined") return null;
  try {
    const authData = localStorage.getItem("meelike-auth");
    if (!authData) return null;
    const parsed = JSON.parse(authData);
    return parsed?.state?.user?.token || null;
  } catch {
    return null;
  }
}

/**
 * Require authentication. Returns the JWT payload or throws AuthError.
 */
export function requireAuth(): JWTPayload {
  const token = getTokenFromStorage();
  if (!token) {
    throw new AuthError("กรุณาเข้าสู่ระบบ");
  }

  const payload = verifyMockJWT(token);
  if (!payload) {
    throw new AuthError("เซสชันหมดอายุ กรุณาเข้าสู่ระบบใหม่");
  }

  return payload;
}

/**
 * Require a specific permission. Throws ApiError(403) if denied.
 */
export function requirePermission(permission: Permission): JWTPayload {
  const payload = requireAuth();

  if (!hasPermission(payload.role, permission)) {
    throw new ApiError(403, "คุณไม่มีสิทธิ์ดำเนินการนี้");
  }

  return payload;
}

/**
 * Optional auth -- returns payload if logged in, null otherwise.
 * Does NOT throw.
 */
export function getAuthPayload(): JWTPayload | null {
  const token = getTokenFromStorage();
  if (!token) return null;
  return verifyMockJWT(token);
}
