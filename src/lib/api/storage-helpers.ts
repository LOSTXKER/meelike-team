/**
 * Storage Helpers for API Layer
 * 
 * Provides localStorage-based persistence for the API layer.
 * All functions return empty arrays by default - no mock data seeding.
 */

import { getStorage, setStorage, STORAGE_KEYS } from "@/lib/storage";

import type {
  Order,
  OrderItem,
  StoreService,
  Team,
  TeamMember,
  Job,
  TeamPayout,
  JobClaim,
  HubPost,
  OutsourceJob,
  OutsourceBid,
  Seller,
  Worker,
  WorkerAccount,
} from "@/types";

// ===== SHARED UTILITIES =====

/** Simulate network delay (remove in production) */
export const delay = (ms?: number) => {
  const defaultDelay =
    typeof window !== "undefined"
      ? parseInt(localStorage.getItem("meelike_dev_mock_delay") || "300")
      : 300;
  return new Promise((resolve) => setTimeout(resolve, ms ?? defaultDelay));
};

// ===== TRANSACTION TYPE =====

export interface Transaction {
  id: string;
  type: "income" | "expense" | "topup";
  category: "order" | "payout" | "api" | "topup" | "refund" | "fee";
  title: string;
  description: string;
  amount: number;
  relatedOrderId?: string;
  relatedPayoutId?: string;
  date: string;
}

// ===== TEAM APPLICATION TYPE =====

export interface TeamApplication {
  id: string;
  teamId: string;
  workerId: string;
  message?: string;
  status: "pending" | "approved" | "rejected";
  reviewedBy?: string;
  reviewedAt?: string;
  rejectionReason?: string;
  createdAt: string;
}

// ===== ORDERS STORAGE =====

export function getOrdersFromStorage(): Order[] {
  return getStorage<Order[]>(STORAGE_KEYS.ORDERS, []);
}

export function saveOrdersToStorage(orders: Order[]): void {
  setStorage(STORAGE_KEYS.ORDERS, orders);
}

export function calculateOrderProgress(items: OrderItem[]): number {
  if (items.length === 0) return 0;
  
  const totalQuantity = items.reduce((sum, item) => sum + item.quantity, 0);
  const completedQuantity = items.reduce((sum, item) => sum + item.completedQuantity, 0);
  
  return Math.round((completedQuantity / totalQuantity) * 100);
}

// ===== SERVICES STORAGE =====

export function getServicesFromStorage(): StoreService[] {
  return getStorage<StoreService[]>(STORAGE_KEYS.SERVICES, []);
}

export function saveServicesToStorage(services: StoreService[]): void {
  setStorage(STORAGE_KEYS.SERVICES, services);
}

// ===== TEAMS STORAGE =====

export function getTeamsFromStorage(): Team[] {
  const teams = getStorage<Team[]>(STORAGE_KEYS.TEAMS, []);
  
  // Ensure all teams have required fields (for backwards compatibility)
  return teams.map(team => ({
    ...team,
    rating: team.rating ?? 0,
    ratingCount: team.ratingCount ?? 0,
  }));
}

export function saveTeamsToStorage(teams: Team[]): void {
  setStorage(STORAGE_KEYS.TEAMS, teams);
}

// ===== TEAM MEMBERS STORAGE =====

export function getTeamMembersFromStorage(): TeamMember[] {
  return getStorage<TeamMember[]>(STORAGE_KEYS.TEAM_MEMBERS, []);
}

export function saveTeamMembersToStorage(members: TeamMember[]): void {
  setStorage(STORAGE_KEYS.TEAM_MEMBERS, members);
}

// ===== JOBS STORAGE (Unified - replaces TeamJobs) =====

export function getJobsFromStorage(): Job[] {
  return getStorage<Job[]>(STORAGE_KEYS.TEAM_JOBS, []);
}

export function saveJobsToStorage(jobs: Job[]): void {
  setStorage(STORAGE_KEYS.TEAM_JOBS, jobs);
}

// Legacy aliases for backward compatibility
export const getTeamJobsFromStorage = getJobsFromStorage;
export const saveTeamJobsToStorage = saveJobsToStorage;

// ===== TEAM PAYOUTS STORAGE =====

export function getTeamPayoutsFromStorage(): TeamPayout[] {
  const payouts = getStorage<TeamPayout[]>(STORAGE_KEYS.PAYOUTS, []);
  
  // Validate and filter out payouts with missing worker data (backwards compatibility)
  return payouts.filter(p => p.worker && typeof p.worker === 'object');
}

export function saveTeamPayoutsToStorage(payouts: TeamPayout[]): void {
  setStorage(STORAGE_KEYS.PAYOUTS, payouts);
}

// ===== TRANSACTIONS STORAGE =====

export function getTransactionsFromStorage(): Transaction[] {
  return getStorage<Transaction[]>(STORAGE_KEYS.TRANSACTIONS, []);
}

export function saveTransactionsToStorage(transactions: Transaction[]): void {
  setStorage(STORAGE_KEYS.TRANSACTIONS, transactions);
}

export function calculateBalance(transactions: Transaction[]): number {
  return transactions.reduce((sum, txn) => sum + txn.amount, 0);
}

// ===== JOB CLAIMS STORAGE =====

export function getJobClaimsFromStorage(): JobClaim[] {
  return getStorage<JobClaim[]>(STORAGE_KEYS.JOB_CLAIMS, []);
}

export function saveJobClaimsToStorage(claims: JobClaim[]): void {
  setStorage(STORAGE_KEYS.JOB_CLAIMS, claims);
}

// ===== HUB POSTS STORAGE =====

export function getHubPostsFromStorage(): HubPost[] {
  return getStorage<HubPost[]>(STORAGE_KEYS.HUB_POSTS, []);
}

export function saveHubPostsToStorage(posts: HubPost[]): void {
  setStorage(STORAGE_KEYS.HUB_POSTS, posts);
}

// ===== TEAM APPLICATIONS STORAGE =====

export function getTeamApplicationsFromStorage(): TeamApplication[] {
  return getStorage<TeamApplication[]>(STORAGE_KEYS.TEAM_APPLICATIONS, []);
}

export function saveTeamApplicationsToStorage(applications: TeamApplication[]): void {
  setStorage(STORAGE_KEYS.TEAM_APPLICATIONS, applications);
}

// ===== OUTSOURCE JOBS STORAGE =====

export function getOutsourceJobsFromStorage(): OutsourceJob[] {
  return getStorage<OutsourceJob[]>(STORAGE_KEYS.OUTSOURCE_JOBS, []);
}

export function saveOutsourceJobsToStorage(jobs: OutsourceJob[]): void {
  setStorage(STORAGE_KEYS.OUTSOURCE_JOBS, jobs);
}

// ===== OUTSOURCE BIDS STORAGE =====

export function getOutsourceBidsFromStorage(): OutsourceBid[] {
  return getStorage<OutsourceBid[]>(STORAGE_KEYS.OUTSOURCE_BIDS, []);
}

export function saveOutsourceBidsToStorage(bids: OutsourceBid[]): void {
  setStorage(STORAGE_KEYS.OUTSOURCE_BIDS, bids);
}

// ===== SELLERS STORAGE =====

export function getSellersFromStorage(): Seller[] {
  return getStorage<Seller[]>(STORAGE_KEYS.SELLERS, []);
}

export function saveSellersToStorage(sellers: Seller[]): void {
  setStorage(STORAGE_KEYS.SELLERS, sellers);
}

export function getSellerById(id: string): Seller | null {
  const sellers = getSellersFromStorage();
  return sellers.find(s => s.id === id) || null;
}

// ===== WORKERS STORAGE =====

export function getWorkersFromStorage(): Worker[] {
  return getStorage<Worker[]>(STORAGE_KEYS.WORKERS, []);
}

export function saveWorkersToStorage(workers: Worker[]): void {
  setStorage(STORAGE_KEYS.WORKERS, workers);
}

export function getWorkerById(id: string): Worker | null {
  const workers = getWorkersFromStorage();
  return workers.find(w => w.id === id) || null;
}

// ===== WORKER ACCOUNTS STORAGE =====

export function getWorkerAccountsFromStorage(): WorkerAccount[] {
  return getStorage<WorkerAccount[]>(STORAGE_KEYS.WORKER_ACCOUNTS, []);
}

export function saveWorkerAccountsToStorage(accounts: WorkerAccount[]): void {
  setStorage(STORAGE_KEYS.WORKER_ACCOUNTS, accounts);
}
