/**
 * Role-Based Permission System
 *
 * Defines what each role can do. Used by API functions and route guards.
 */

import type { UserRole } from "@/types/auth";

// ===== PERMISSION KEYS =====

export type Permission =
  // Seller
  | "seller:read"
  | "seller:write"
  | "order:create"
  | "order:manage"
  | "service:manage"
  | "team:create"
  | "team:manage"
  | "job:create"
  | "job:manage"
  | "job:review"
  | "payout:process"
  | "finance:topup"
  | "outsource:post"
  // Worker
  | "worker:read"
  | "worker:write"
  | "job:claim"
  | "job:submit"
  | "team:join"
  // Hub (shared)
  | "hub:read"
  | "hub:post"
  | "hub:bid"
  // Admin
  | "admin:read"
  | "admin:write"
  | "admin:manage_users";

// ===== ROLE → PERMISSIONS MAP =====

const ROLE_PERMISSIONS: Record<UserRole, Permission[]> = {
  seller: [
    "seller:read",
    "seller:write",
    "order:create",
    "order:manage",
    "service:manage",
    "team:create",
    "team:manage",
    "job:create",
    "job:manage",
    "job:review",
    "payout:process",
    "finance:topup",
    "outsource:post",
    "hub:read",
    "hub:post",
  ],
  worker: [
    "worker:read",
    "worker:write",
    "job:claim",
    "job:submit",
    "team:join",
    "hub:read",
    "hub:post",
    "hub:bid",
  ],
  admin: [
    "seller:read",
    "seller:write",
    "worker:read",
    "worker:write",
    "order:create",
    "order:manage",
    "service:manage",
    "team:create",
    "team:manage",
    "job:create",
    "job:manage",
    "job:review",
    "payout:process",
    "finance:topup",
    "outsource:post",
    "job:claim",
    "job:submit",
    "team:join",
    "hub:read",
    "hub:post",
    "hub:bid",
    "admin:read",
    "admin:write",
    "admin:manage_users",
  ],
};

// ===== PUBLIC API =====

/**
 * Get all permissions for a given role.
 */
export function getPermissionsForRole(role: UserRole): Permission[] {
  return ROLE_PERMISSIONS[role] || [];
}

/**
 * Check if a role has a specific permission.
 */
export function hasPermission(role: UserRole, permission: Permission): boolean {
  return ROLE_PERMISSIONS[role]?.includes(permission) ?? false;
}

/**
 * Check if a role has ALL of the specified permissions.
 */
export function hasAllPermissions(
  role: UserRole,
  permissions: Permission[]
): boolean {
  const rolePerms = ROLE_PERMISSIONS[role] || [];
  return permissions.every((p) => rolePerms.includes(p));
}

/**
 * Check if a role has ANY of the specified permissions.
 */
export function hasAnyPermission(
  role: UserRole,
  permissions: Permission[]
): boolean {
  const rolePerms = ROLE_PERMISSIONS[role] || [];
  return permissions.some((p) => rolePerms.includes(p));
}

// ===== ROUTE PROTECTION =====

/** Defines which roles can access which route prefixes */
export const ROUTE_PERMISSIONS: Record<string, UserRole[]> = {
  "/seller": ["seller", "admin"],
  "/work": ["worker", "admin"],
  "/admin": ["admin"],
  "/hub": ["seller", "worker", "admin"],
};

/**
 * Check if a role can access a given pathname.
 */
export function canAccessRoute(
  role: UserRole | null,
  pathname: string
): boolean {
  if (!role) return false;

  // Public routes
  if (
    pathname === "/" ||
    pathname === "/login" ||
    pathname.startsWith("/s/") ||
    pathname.startsWith("/_next")
  ) {
    return true;
  }

  // Check route prefixes
  for (const [prefix, allowedRoles] of Object.entries(ROUTE_PERMISSIONS)) {
    if (pathname.startsWith(prefix)) {
      return allowedRoles.includes(role);
    }
  }

  // Default: allow
  return true;
}
