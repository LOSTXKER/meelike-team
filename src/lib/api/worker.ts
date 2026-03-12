import { apiClient } from "./client";
import type { WorkerJob, Team } from "@/types";

export interface WorkerTransaction {
  id: string;
  type: "earning" | "payment";
  amount: number;
  description: string;
  createdAt: string;
}

export interface WorkerStats {
  todayEarned: number;
  weekEarned: number;
  totalEarned: number;
  totalOwed: number;
  availableBalance: number;
  pendingBalance: number;
  activeJobs: number;
  pendingReviews: number;
}

export const workerApi = {
  async getWorker() {
    const res = await apiClient.get<WorkerStats>("/worker/stats");
    return res.data ?? ({
      todayEarned: 0, weekEarned: 0, totalEarned: 0, totalOwed: 0,
      availableBalance: 0, pendingBalance: 0, activeJobs: 0, pendingReviews: 0,
    } as WorkerStats);
  },

  async getStats() {
    const res = await apiClient.get<WorkerStats>("/worker/stats");
    return res.data ?? ({
      todayEarned: 0, weekEarned: 0, totalEarned: 0, totalOwed: 0,
      availableBalance: 0, pendingBalance: 0, activeJobs: 0, pendingReviews: 0,
    } as WorkerStats);
  },

  async getActiveJobs() {
    const res = await apiClient.get<{ myClaims: WorkerJob[] }>("/worker/jobs");
    return (res.data?.myClaims ?? []).filter((c) => c.status === "in_progress") as WorkerJob[];
  },

  async getJobs() {
    const res = await apiClient.get<{ myClaims: WorkerJob[] }>("/worker/jobs");
    const claims = (res.data?.myClaims ?? []) as WorkerJob[];
    return {
      in_progress: claims.filter((c) => c.status === "in_progress"),
      pending_review: claims.filter((c) => c.status === "pending_review"),
      completed: claims.filter((c) => c.status === "completed"),
    };
  },

  async getAccounts() {
    const res = await apiClient.get("/worker/accounts");
    return res.data;
  },

  async getTeams() {
    const res = await apiClient.get<{ teams: Team[] }>("/worker/teams");
    return (res.data?.teams ?? []) as Team[];
  },

  async getTeamJobPreview(teamJobId: string) {
    const res = await apiClient.get<{
      teamJob: WorkerJob;
      team: Team;
      existingClaim: { id: string; status: string; quantity: number; earnAmount: number } | null;
    }>(`/worker/jobs/${teamJobId}`);
    return res.data ?? { teamJob: null, team: null, existingClaim: null };
  },

  async claimTeamJob(jobId: string, quantity: number) {
    const res = await apiClient.post<{ claim: { id: string; earnAmount: number; status: string } }>(
      `/worker/jobs/${jobId}/claim`,
      { quantity }
    );
    return res.data?.claim ?? { id: "", earnAmount: 0, status: "claimed" };
  },

  async submitJobClaim(
    jobId: string,
    data: { actualQuantity?: number; proofUrls?: string[]; note?: string }
  ) {
    const res = await apiClient.post(`/worker/jobs/${jobId}/submit`, data);
    return res.data;
  },

  async updateClaimProgress(_claimId: string, _completedQuantity: number) {
    return null;
  },

  async updateProfile(patch: unknown) {
    const res = await apiClient.patch("/worker/profile", patch);
    return res.data;
  },

  async createAccount(payload: unknown) {
    const res = await apiClient.post("/worker/accounts", payload);
    return res.data;
  },

  async updateAccount(accountId: string, patch: unknown) {
    const res = await apiClient.patch(`/worker/accounts/${accountId}`, patch);
    return res.data;
  },

  async deleteAccount(accountId: string) {
    await apiClient.delete(`/worker/accounts/${accountId}`);
  },

  async verifyBankAccount(payload: { bankCode: string; accountNumber: string }) {
    const res = await apiClient.post<{ verified: boolean; accountName?: string; message?: string }>(
      "/worker/verify-bank",
      payload
    );
    return res.data ?? { verified: false };
  },

  async getTransactions(): Promise<WorkerTransaction[]> {
    const res = await apiClient.get<{ approvedClaims: unknown[] }>(
      "/worker/earnings"
    );
    return (res.data?.approvedClaims ?? []) as WorkerTransaction[];
  },

  async leaveTeam(teamId: string) {
    const res = await apiClient.post(`/worker/teams/${teamId}/leave`);
    return res.data;
  },
};
