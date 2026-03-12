import { apiClient } from "../client";
import type { Seller } from "@/types";

export interface SellerStats {
  todayRevenue: number;
  monthRevenue: number;
  todayOrders: number;
  monthOrders: number;
  activeTeamMembers: number;
  pendingReviews: number;
  pendingPayouts: number;
  totalOrders: number;
  totalRevenue: number;
  activeJobs: number;
}

export async function getSeller() {
  const res = await apiClient.get<{ user: Seller }>("/auth/me");
  return (res.data?.user ?? null) as Seller | null;
}

export async function getStats() {
  const res = await apiClient.get<SellerStats>("/seller/analytics");
  return (res.data ?? {
    todayRevenue: 0,
    monthRevenue: 0,
    todayOrders: 0,
    monthOrders: 0,
    activeTeamMembers: 0,
    pendingReviews: 0,
    pendingPayouts: 0,
    totalOrders: 0,
    totalRevenue: 0,
    activeJobs: 0,
  }) as SellerStats;
}
