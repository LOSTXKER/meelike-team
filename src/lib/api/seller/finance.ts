import { apiClient } from "../client";
import type { TeamPayout } from "@/types";

export interface SubscriptionInfo {
  plan: string;
  status: string;
  expiresAt?: string;
  ordersThisMonth: number;
  orderQuota: number;
}

export async function getSubscription() {
  const res = await apiClient.get<SubscriptionInfo>("/seller/subscription");
  return res.data;
}

export async function getTeamPayouts() {
  const res = await apiClient.get<{ checklist: TeamPayout[]; pendingPayouts: TeamPayout[] }>(
    "/seller/payouts"
  );
  return (res.data?.checklist ?? []) as TeamPayout[];
}

export async function processTeamPayout(payoutId: string) {
  const res = await apiClient.post<{ record: unknown }>(`/seller/payouts/${payoutId}/confirm`);
  return res.data;
}

export async function processAllPendingPayouts() {
  return null;
}

type LegacyTransaction = { id: string; type: string; amount: number; createdAt: string; [key: string]: unknown };

export async function getTransactions(): Promise<LegacyTransaction[]> {
  return [];
}

export async function getBalance() {
  return { balance: 0 };
}

export async function createTopupTransaction(_data: unknown) {
  return null;
}

export async function getWorkerBalances() {
  const res = await apiClient.get<{ checklist: TeamPayout[] }>("/seller/payouts");
  return (res.data?.checklist ?? []) as TeamPayout[];
}
