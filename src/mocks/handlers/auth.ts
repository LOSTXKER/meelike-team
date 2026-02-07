/**
 * MSW Auth Handlers
 *
 * Handles login, logout, token refresh.
 */

import { http, HttpResponse, delay } from "msw";
import { sellerApi } from "@/lib/api/seller";
import { workerApi } from "@/lib/api/worker";
import { getStorage, setStorage, STORAGE_KEYS } from "@/lib/storage";
import { generateId } from "@/lib/utils/helpers";
import { createTokenPair, refreshAccessToken, verifyMockJWT } from "@/lib/auth/jwt";
import { validate } from "@/lib/validations/utils";
import { loginSchema } from "@/lib/validations/auth";
import type { Seller, Worker } from "@/types";

const BASE = "/api";

export const authHandlers = [
  // POST /api/auth/login
  http.post(`${BASE}/auth/login`, async ({ request }) => {
    await delay(300);

    const body = (await request.json()) as Record<string, unknown>;
    const { email, password, role } = validate(loginSchema, body);

    // Admin login
    if (role === "admin") {
      const isValidAdmin =
        email.toLowerCase().includes("admin") ||
        email.toLowerCase() === "admin@meelike.com";

      if (!isValidAdmin) {
        return HttpResponse.json(
          { message: "อีเมลหรือรหัสผ่านไม่ถูกต้อง" },
          { status: 401 }
        );
      }

      const userId = `admin-${generateId()}`;
      const tokens = createTokenPair({ sub: userId, email, role: "admin" });

      return HttpResponse.json({
        user: { id: userId, email, role: "admin", isAdmin: true },
        ...tokens,
      });
    }

    // Seller login
    if (role === "seller") {
      const sellers = getStorage<Seller[]>(STORAGE_KEYS.SELLERS, []);
      let seller =
        sellers.find(
          (s) =>
            s.name === email.split("@")[0] ||
            s.displayName === email.split("@")[0]
        ) ||
        sellers[0] ||
        null;

      if (!seller) {
        const userId = `user-${generateId()}`;
        seller = {
          id: `seller-${generateId()}`,
          userId,
          displayName: email.split("@")[0],
          name: "My Store",
          slug: email.split("@")[0].toLowerCase(),
          subscription: "free",
          theme: "meelike",
          plan: "free",
          sellerRank: "bronze",
          platformFeePercent: 15,
          rollingAvgSpend: 0,
          totalSpentOnWorkers: 0,
          balance: 0,
          totalOrders: 0,
          totalRevenue: 0,
          rating: 0,
          ratingCount: 0,
          isActive: true,
          isVerified: false,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        sellers.push(seller);
        setStorage(STORAGE_KEYS.SELLERS, sellers);
      }

      const tokens = createTokenPair({
        sub: seller.userId,
        email,
        role: "seller",
        sellerId: seller.id,
      });

      return HttpResponse.json({
        user: { id: seller.userId, email, role: "seller", seller },
        ...tokens,
      });
    }

    // Worker login
    const workers = getStorage<Worker[]>(STORAGE_KEYS.WORKERS, []);
    let worker =
      workers.find((w) => w.displayName === email.split("@")[0]) ||
      workers[0] ||
      null;

    if (!worker) {
      const userId = `user-${generateId()}`;
      const now = new Date().toISOString();
      worker = {
        id: `worker-${generateId()}`,
        userId,
        displayName: email.split("@")[0],
        level: "bronze",
        rating: 0,
        ratingCount: 0,
        totalJobs: 0,
        totalJobsCompleted: 0,
        totalEarned: 0,
        completionRate: 100,
        availableBalance: 0,
        pendingBalance: 0,
        isActive: true,
        isBanned: false,
        teamIds: [],
        createdAt: now,
        lastActiveAt: now,
      };
      workers.push(worker);
      setStorage(STORAGE_KEYS.WORKERS, workers);
    }

    const tokens = createTokenPair({
      sub: worker.userId,
      email,
      role: "worker",
      workerId: worker.id,
    });

    return HttpResponse.json({
      user: { id: worker.userId, email, role: "worker", worker },
      ...tokens,
    });
  }),

  // POST /api/auth/refresh
  http.post(`${BASE}/auth/refresh`, async ({ request }) => {
    await delay(100);

    const body = (await request.json()) as { refreshToken?: string };
    if (!body.refreshToken) {
      return HttpResponse.json(
        { message: "Refresh token required" },
        { status: 400 }
      );
    }

    const newAccessToken = refreshAccessToken(body.refreshToken);
    if (!newAccessToken) {
      return HttpResponse.json(
        { message: "Invalid or expired refresh token" },
        { status: 401 }
      );
    }

    return HttpResponse.json({ accessToken: newAccessToken });
  }),

  // POST /api/auth/logout
  http.post(`${BASE}/auth/logout`, async () => {
    await delay(100);
    return HttpResponse.json({ success: true });
  }),
];
