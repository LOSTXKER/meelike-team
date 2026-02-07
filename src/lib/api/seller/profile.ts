/**
 * Seller Profile & Stats API
 */

import { getCurrentSellerId } from "@/lib/storage";

import {
  delay,
  getOrdersFromStorage,
  getTeamPayoutsFromStorage,
  getTeamMembersFromStorage,
  getJobClaimsFromStorage,
  getSellersFromStorage,
  saveSellersToStorage,
} from "../storage-helpers";

import type { Seller } from "@/types";

// ===== DEFAULT DATA =====

const createDefaultSeller = (id: string): Seller => ({
  id,
  userId: id,
  displayName: "My Store",
  name: "My Store",
  slug: "my-store",
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
});

// ===== FUNCTIONS =====

export async function getSeller(): Promise<Seller> {
  await delay();
  const sellerId = getCurrentSellerId() || "seller-1";
  const sellers = getSellersFromStorage();

  let seller = sellers.find((s) => s.id === sellerId);

  // Create default seller if not exists
  if (!seller) {
    seller = createDefaultSeller(sellerId);
    sellers.push(seller);
    saveSellersToStorage(sellers);
  }

  return seller;
}

export async function getStats() {
  await delay();
  const orders = getOrdersFromStorage();
  const payouts = getTeamPayoutsFromStorage();
  const members = getTeamMembersFromStorage();
  const claims = getJobClaimsFromStorage();

  const now = new Date();
  const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);

  const todayOrders = orders.filter(
    (o) => new Date(o.createdAt) >= todayStart
  );
  const monthOrders = orders.filter(
    (o) => new Date(o.createdAt) >= monthStart
  );

  return {
    todayRevenue: todayOrders.reduce((sum, o) => sum + o.total, 0),
    monthRevenue: monthOrders.reduce((sum, o) => sum + o.total, 0),
    todayOrders: todayOrders.length,
    monthOrders: monthOrders.length,
    activeTeamMembers: members.filter((m) => m.status === "active").length,
    pendingReviews: claims.filter((c) => c.status === "submitted").length,
    pendingPayouts: payouts
      .filter((p) => p.status === "pending")
      .reduce((sum, p) => sum + p.amount, 0),
  };
}
