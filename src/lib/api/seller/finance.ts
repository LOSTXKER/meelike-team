/**
 * Seller Finance & Transactions API
 */

import { getCurrentSellerId } from "@/lib/storage";
import { generateId } from "@/lib/utils/helpers";

import {
  delay,
  Transaction,
  getTeamPayoutsFromStorage,
  saveTeamPayoutsToStorage,
  getTransactionsFromStorage,
  saveTransactionsToStorage,
  calculateBalance,
  getSellersFromStorage,
  getWorkersFromStorage,
} from "../storage-helpers";

import type { Worker, TeamPayout } from "@/types";
import { validate } from "@/lib/validations/utils";
import { createTopupSchema } from "@/lib/validations/seller";
import { requirePermission } from "@/lib/auth/guard";
import { meetsKYCRequirement } from "@/types/kyc";

// ===== FUNCTIONS =====

export async function getTeamPayouts(): Promise<TeamPayout[]> {
  await delay();
  return getTeamPayoutsFromStorage();
}

export async function processTeamPayout(
  payoutId: string
): Promise<TeamPayout | null> {
  await delay(800);

  const payouts = getTeamPayoutsFromStorage();
  const payoutIndex = payouts.findIndex((p) => p.id === payoutId);

  if (payoutIndex === -1) return null;

  const payout = payouts[payoutIndex];
  const now = new Date().toISOString();
  const txnRef = `TXN-${Date.now()}-${generateId()}`;

  // Update payout status
  payouts[payoutIndex] = {
    ...payout,
    status: "completed",
    completedAt: now,
    transactionRef: txnRef,
  };

  saveTeamPayoutsToStorage(payouts);

  // Create transaction entry (expense)
  const transactions = getTransactionsFromStorage();
  const newTransaction: Transaction = {
    id: `txn-${generateId()}`,
    type: "expense",
    category: "payout",
    title: `จ่ายค่าจ้าง Worker @${payout.worker?.displayName || "Worker"}`,
    description: `${payout.jobCount} งานที่ทำเสร็จ - Ref: ${txnRef}`,
    amount: -payout.amount,
    relatedPayoutId: payout.id,
    date: now,
  };

  transactions.unshift(newTransaction);
  saveTransactionsToStorage(transactions);

  return payouts[payoutIndex];
}

export async function processAllPendingPayouts(
  teamId?: string
): Promise<number> {
  await delay(1000);

  const payouts = getTeamPayoutsFromStorage();
  const transactions = getTransactionsFromStorage();
  const now = new Date().toISOString();
  let processedCount = 0;

  const updatedPayouts = payouts.map((payout) => {
    if (
      payout.status === "pending" &&
      (!teamId || payout.worker?.teamIds?.includes(teamId))
    ) {
      processedCount++;
      const txnRef = `TXN-${Date.now()}-${generateId()}`;

      // Create transaction for each payout
      const newTransaction: Transaction = {
        id: `txn-${generateId()}`,
        type: "expense",
        category: "payout",
        title: `จ่ายค่าจ้าง Worker @${payout.worker?.displayName || "Worker"}`,
        description: `${payout.jobCount} งานที่ทำเสร็จ - Ref: ${txnRef}`,
        amount: -payout.amount,
        relatedPayoutId: payout.id,
        date: now,
      };

      transactions.unshift(newTransaction);

      return {
        ...payout,
        status: "completed" as const,
        completedAt: now,
        transactionRef: txnRef,
      };
    }
    return payout;
  });

  saveTeamPayoutsToStorage(updatedPayouts);
  saveTransactionsToStorage(transactions);

  return processedCount;
}

// ===== TRANSACTIONS =====

export async function getTransactions(): Promise<Transaction[]> {
  await delay();
  return getTransactionsFromStorage();
}

export async function getBalance(): Promise<number> {
  await delay();
  const transactions = getTransactionsFromStorage();
  return calculateBalance(transactions);
}

export async function createTopupTransaction(payload: {
  amount: number;
  method: "promptpay" | "bank";
  reference?: string;
}): Promise<Transaction> {
  requirePermission("finance:topup");
  validate(createTopupSchema, payload);
  await delay(800);

  // KYC guard: require at least "basic" level (phone verified) to top up
  const sellerId = getCurrentSellerId() || "seller-1";
  const sellers = getSellersFromStorage();
  const seller = sellers.find((s) => s.id === sellerId);
  if (!seller?.kyc || !meetsKYCRequirement(seller.kyc.level, "basic")) {
    throw new Error("ต้องยืนยันตัวตน (KYC Basic) ก่อนจึงจะเติมเงินได้");
  }

  const transactions = getTransactionsFromStorage();
  const now = new Date().toISOString();

  const newTransaction: Transaction = {
    id: `txn-${generateId()}`,
    type: "topup",
    category: "topup",
    title: `เติมเงินผ่าน ${payload.method === "promptpay" ? "PromptPay" : "โอนเงิน"}`,
    description:
      payload.reference ||
      `Ref: ${payload.method.toUpperCase()}-${Date.now()}`,
    amount: payload.amount,
    date: now,
  };

  transactions.unshift(newTransaction);
  saveTransactionsToStorage(transactions);

  return newTransaction;
}

export async function getWorkerBalances(): Promise<
  Array<{
    worker: Worker;
    pendingBalance: number;
    availableBalance: number;
    totalEarned: number;
  }>
> {
  await delay();
  const workers = getWorkersFromStorage();
  return workers.map((worker) => ({
    worker,
    pendingBalance: worker.pendingBalance || 0,
    availableBalance: worker.availableBalance || 0,
    totalEarned: worker.totalEarned || 0,
  }));
}
