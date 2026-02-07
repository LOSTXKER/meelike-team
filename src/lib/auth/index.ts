/**
 * Auth Module
 *
 * JWT tokens, permissions, and auth utilities.
 */

export {
  createMockJWT,
  verifyMockJWT,
  decodeMockJWT,
  createTokenPair,
  refreshAccessToken,
  isTokenExpiringSoon,
  isTokenExpired,
  type JWTPayload,
  type JWTTokenPair,
} from "./jwt";

export {
  hasPermission,
  hasAllPermissions,
  hasAnyPermission,
  getPermissionsForRole,
  canAccessRoute,
  ROUTE_PERMISSIONS,
  type Permission,
} from "./permissions";

export {
  requireAuth,
  requirePermission,
  getAuthPayload,
} from "./guard";
