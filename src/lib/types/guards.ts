/**
 * Type Guards & Runtime Validators
 * 
 * These functions provide runtime type checking for TypeScript types.
 * Useful for API responses, user inputs, and ensuring type safety at runtime.
 */

import type {
  Seller,
  Worker,
  Order,
  OrderItem,
  Team,
  TeamMember,
  Job,
  JobClaim,
  AuthUser,
  Platform,
  ServiceType,
  ServiceMode,
  UserRole,
} from "@/types";

// ===== USER & AUTH GUARDS =====

export function isAuthUser(value: unknown): value is AuthUser {
  if (!value || typeof value !== "object") return false;
  const user = value as Record<string, unknown>;
  return (
    typeof user.id === "string" &&
    typeof user.email === "string" &&
    (user.role === "seller" || user.role === "worker")
  );
}

export function isSeller(user: AuthUser | unknown): user is AuthUser & { seller: Seller } {
  if (!isAuthUser(user)) return false;
  return user.role === "seller" && !!user.seller;
}

export function isWorker(user: AuthUser | unknown): user is AuthUser & { worker: Worker } {
  if (!isAuthUser(user)) return false;
  return user.role === "worker" && !!user.worker;
}

export function isUserRole(value: unknown): value is UserRole {
  return value === "seller" || value === "worker";
}

// ===== PLATFORM & SERVICE GUARDS =====

export function isPlatform(value: unknown): value is Platform {
  return (
    value === "facebook" ||
    value === "instagram" ||
    value === "tiktok" ||
    value === "youtube" ||
    value === "twitter"
  );
}

export function isServiceType(value: unknown): value is ServiceType {
  return (
    value === "like" ||
    value === "comment" ||
    value === "follow" ||
    value === "share" ||
    value === "view"
  );
}

export function isServiceMode(value: unknown): value is ServiceMode {
  return value === "bot" || value === "human";
}

// ===== ORDER GUARDS =====

export function isValidOrder(value: unknown): value is Order {
  if (!value || typeof value !== "object") return false;
  const order = value as Record<string, unknown>;
  
  return (
    typeof order.id === "string" &&
    typeof order.orderNumber === "string" &&
    typeof order.sellerId === "string" &&
    typeof order.total === "number" &&
    Array.isArray(order.items) &&
    order.items.every(isValidOrderItem)
  );
}

export function isValidOrderItem(value: unknown): value is OrderItem {
  if (!value || typeof value !== "object") return false;
  const item = value as Record<string, unknown>;
  
  return (
    typeof item.id === "string" &&
    typeof item.orderId === "string" &&
    typeof item.serviceId === "string" &&
    typeof item.quantity === "number" &&
    typeof item.unitPrice === "number" &&
    isPlatform(item.platform) &&
    isServiceType(item.type)
  );
}

// ===== TEAM GUARDS =====

export function isValidTeam(value: unknown): value is Team {
  if (!value || typeof value !== "object") return false;
  const team = value as Record<string, unknown>;
  
  return (
    typeof team.id === "string" &&
    typeof team.sellerId === "string" &&
    typeof team.name === "string" &&
    typeof team.memberCount === "number" &&
    typeof team.isPublic === "boolean"
  );
}

export function isValidTeamMember(value: unknown): value is TeamMember {
  if (!value || typeof value !== "object") return false;
  const member = value as Record<string, unknown>;
  
  return (
    typeof member.id === "string" &&
    typeof member.teamId === "string" &&
    typeof member.workerId === "string" &&
    (member.status === "pending" ||
      member.status === "active" ||
      member.status === "inactive" ||
      member.status === "banned")
  );
}

// ===== JOB GUARDS =====

export function isValidJob(value: unknown): value is Job {
  if (!value || typeof value !== "object") return false;
  const job = value as Record<string, unknown>;
  
  return (
    typeof job.id === "string" &&
    typeof job.sellerId === "string" &&
    typeof job.teamId === "string" &&
    typeof job.targetQuantity === "number" &&
    typeof job.pricePerUnit === "number" &&
    isPlatform(job.platform) &&
    isServiceType(job.type)
  );
}

export function isValidJobClaim(value: unknown): value is JobClaim {
  if (!value || typeof value !== "object") return false;
  const claim = value as Record<string, unknown>;
  
  return (
    typeof claim.id === "string" &&
    typeof claim.jobId === "string" &&
    typeof claim.workerId === "string" &&
    typeof claim.quantity === "number" &&
    typeof claim.earnAmount === "number"
  );
}

// ===== UTILITY GUARDS =====

/**
 * Check if a value is a non-null object
 */
export function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

/**
 * Check if a value is a non-empty string
 */
export function isNonEmptyString(value: unknown): value is string {
  return typeof value === "string" && value.trim().length > 0;
}

/**
 * Check if a value is a positive number
 */
export function isPositiveNumber(value: unknown): value is number {
  return typeof value === "number" && value > 0 && !isNaN(value);
}

/**
 * Check if a value is a valid date string
 */
export function isValidDateString(value: unknown): value is string {
  if (typeof value !== "string") return false;
  const date = new Date(value);
  return !isNaN(date.getTime());
}

// ===== ARRAY GUARDS =====

/**
 * Type guard for arrays of a specific type
 */
export function isArrayOf<T>(
  value: unknown,
  guard: (item: unknown) => item is T
): value is T[] {
  return Array.isArray(value) && value.every(guard);
}

/**
 * Example usage:
 * if (isArrayOf(data, isValidOrder)) {
 *   // data is Order[]
 * }
 */
