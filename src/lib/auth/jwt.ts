/**
 * Mock JWT Implementation
 *
 * Uses base64 encoding to simulate JWT behavior locally.
 * No real cryptography -- this is for local development only.
 * When migrating to a real backend, replace with a proper JWT library.
 */

// ===== TYPES =====

export interface JWTPayload {
  sub: string; // user ID
  email: string;
  role: "seller" | "worker" | "admin";
  sellerId?: string;
  workerId?: string;
  iat: number; // issued at (seconds)
  exp: number; // expiry (seconds)
}

export interface JWTTokenPair {
  accessToken: string;
  refreshToken: string;
}

// ===== CONSTANTS =====

const ACCESS_TOKEN_TTL = 60 * 60; // 1 hour in seconds
const REFRESH_TOKEN_TTL = 24 * 60 * 60; // 24 hours in seconds
const MOCK_SECRET = "meelike-dev-secret"; // not real security

// ===== HELPERS =====

function toBase64(str: string): string {
  if (typeof btoa === "function") {
    return btoa(unescape(encodeURIComponent(str)));
  }
  return Buffer.from(str, "utf-8").toString("base64");
}

function fromBase64(b64: string): string {
  if (typeof atob === "function") {
    return decodeURIComponent(escape(atob(b64)));
  }
  return Buffer.from(b64, "base64").toString("utf-8");
}

function nowSeconds(): number {
  return Math.floor(Date.now() / 1000);
}

// ===== PUBLIC API =====

/**
 * Create a mock JWT token string.
 * Format: base64(header).base64(payload).base64(signature)
 */
export function createMockJWT(
  payload: Omit<JWTPayload, "iat" | "exp">,
  ttlSeconds = ACCESS_TOKEN_TTL
): string {
  const now = nowSeconds();
  const fullPayload: JWTPayload = {
    ...payload,
    iat: now,
    exp: now + ttlSeconds,
  };

  const header = toBase64(JSON.stringify({ alg: "HS256", typ: "JWT" }));
  const body = toBase64(JSON.stringify(fullPayload));
  const signature = toBase64(`${header}.${body}.${MOCK_SECRET}`);

  return `${header}.${body}.${signature}`;
}

/**
 * Verify and decode a mock JWT token.
 * Returns null if the token is malformed or expired.
 */
export function verifyMockJWT(token: string): JWTPayload | null {
  try {
    const parts = token.split(".");
    if (parts.length !== 3) return null;

    const payload: JWTPayload = JSON.parse(fromBase64(parts[1]));

    // Check expiry
    if (payload.exp < nowSeconds()) {
      return null; // expired
    }

    // Verify signature (mock -- just checks format)
    const expectedSig = toBase64(`${parts[0]}.${parts[1]}.${MOCK_SECRET}`);
    if (parts[2] !== expectedSig) return null;

    return payload;
  } catch {
    return null;
  }
}

/**
 * Decode a JWT without verifying expiry or signature.
 * Useful for reading token contents even if expired.
 */
export function decodeMockJWT(token: string): JWTPayload | null {
  try {
    const parts = token.split(".");
    if (parts.length !== 3) return null;
    return JSON.parse(fromBase64(parts[1]));
  } catch {
    return null;
  }
}

/**
 * Create an access + refresh token pair for a user.
 */
export function createTokenPair(
  payload: Omit<JWTPayload, "iat" | "exp">
): JWTTokenPair {
  return {
    accessToken: createMockJWT(payload, ACCESS_TOKEN_TTL),
    refreshToken: createMockJWT(payload, REFRESH_TOKEN_TTL),
  };
}

/**
 * Refresh: given a valid refresh token, create a new access token.
 * Returns null if the refresh token is invalid/expired.
 */
export function refreshAccessToken(refreshToken: string): string | null {
  const payload = verifyMockJWT(refreshToken);
  if (!payload) return null;

  const { iat: _iat, exp: _exp, ...rest } = payload;
  return createMockJWT(rest, ACCESS_TOKEN_TTL);
}

/**
 * Check if a token is close to expiry (within 5 minutes).
 */
export function isTokenExpiringSoon(token: string): boolean {
  const payload = decodeMockJWT(token);
  if (!payload) return true;
  return payload.exp - nowSeconds() < 5 * 60;
}

/**
 * Check if a token is expired.
 */
export function isTokenExpired(token: string): boolean {
  const payload = decodeMockJWT(token);
  if (!payload) return true;
  return payload.exp < nowSeconds();
}
