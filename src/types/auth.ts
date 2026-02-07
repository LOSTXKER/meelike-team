/**
 * Auth Types
 * 
 * Types related to authentication and users.
 */

import type { Seller } from "./seller";
import type { Worker } from "./worker";

// ===== USER ROLE =====
export type UserRole = "seller" | "worker" | "admin";

// ===== AUTH USER =====
export interface AuthUser {
  id: string;
  email: string;
  role: UserRole;
  seller?: Seller;
  worker?: Worker;
  isAdmin?: boolean;
  /** JWT access token */
  token?: string;
  /** JWT refresh token */
  refreshToken?: string;
  /** Token expiry timestamp (ms) */
  tokenExpiresAt?: number;
}
