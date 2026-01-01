/**
 * API Abstraction Layer
 * 
 * This module provides a unified interface for data fetching.
 * Currently uses mock data, but can be easily switched to real API calls.
 * 
 * Usage:
 * ```ts
 * import { api } from '@/lib/api';
 * 
 * const stats = await api.seller.getStats();
 * const orders = await api.seller.getOrders();
 * ```
 */

import {
  mockSeller,
  mockServices,
  mockOrders,
  mockSellerStats,
  mockWorkers,
  mockWorkerStats,
  mockWorkerJobs,
  mockActiveJobs,
  mockWorkerAccounts,
  mockTeams,
  mockTeam,
  mockTeamMembers,
  mockJobClaims,
  mockTeamJobs,
  mockTeamPayouts,
  mockJobs,
  mockHubPosts,
  mockHubStats,
  mockFindTeamPosts,
  mockOutsourceJobs,
} from "@/lib/mock-data";

import type {
  Seller,
  Worker,
  StoreService,
  Order,
  Job,
  JobClaim,
  Team,
  TeamMember,
  TeamJob,
  TeamPayout,
  WorkerAccount,
  HubPost,
  FindTeamPost,
  OutsourceJob,
  WorkerJob,
} from "@/types";

// Simulate network delay (remove in production)
const delay = (ms: number = 300) => new Promise((resolve) => setTimeout(resolve, ms));

// ===== SELLER API =====
export const sellerApi = {
  async getSeller(): Promise<Seller> {
    await delay();
    return mockSeller;
  },

  async getStats() {
    await delay();
    return mockSellerStats;
  },

  async getServices(): Promise<StoreService[]> {
    await delay();
    return mockServices;
  },

  async getOrders(): Promise<Order[]> {
    await delay();
    return mockOrders;
  },

  async getOrderById(id: string): Promise<Order | undefined> {
    await delay();
    return mockOrders.find((order) => order.id === id);
  },

  // Seller มีได้หลายทีม
  async getTeams(): Promise<Team[]> {
    await delay();
    return mockTeams.filter((team) => team.sellerId === "seller-1");
  },

  // Legacy: เข้ากันได้กับ code เดิม (return ทีมแรก)
  async getTeam(): Promise<Team> {
    await delay();
    return mockTeam;
  },

  async getTeamById(id: string): Promise<Team | undefined> {
    await delay();
    return mockTeams.find((team) => team.id === id);
  },

  async getTeamMembers(teamId?: string): Promise<TeamMember[]> {
    await delay();
    if (teamId) {
      return mockTeamMembers.filter((m) => m.teamId === teamId);
    }
    return mockTeamMembers;
  },

  async getJobs(): Promise<Job[]> {
    await delay();
    return mockJobs;
  },

  async getJobClaims(): Promise<JobClaim[]> {
    await delay();
    return mockJobClaims;
  },

  async getPendingReviews(): Promise<JobClaim[]> {
    await delay();
    return mockJobClaims.filter((claim) => claim.status === "submitted");
  },

  async getTeamJobs(): Promise<TeamJob[]> {
    await delay();
    return mockTeamJobs;
  },

  async getTeamPayouts(): Promise<TeamPayout[]> {
    await delay();
    return mockTeamPayouts;
  },

  async getWorkerBalances(): Promise<Array<{
    worker: Worker;
    pendingBalance: number;
    availableBalance: number;
    totalEarned: number;
  }>> {
    await delay();
    return mockWorkers.map((worker) => ({
      worker,
      pendingBalance: worker.pendingBalance || 0,
      availableBalance: worker.availableBalance || 0,
      totalEarned: worker.totalEarned || 0,
    }));
  },
};

// ===== WORKER API =====
export const workerApi = {
  async getWorker(id?: string): Promise<Worker | undefined> {
    await delay();
    if (id) {
      return mockWorkers.find((w) => w.id === id);
    }
    return mockWorkers[0]; // Return first worker as current user
  },

  async getStats() {
    await delay();
    return mockWorkerStats;
  },

  async getActiveJobs() {
    await delay();
    return mockActiveJobs;
  },

  async getJobs(): Promise<{
    in_progress: WorkerJob[];
    pending_review: WorkerJob[];
    completed: WorkerJob[];
  }> {
    await delay();
    return mockWorkerJobs;
  },

  async getAccounts(): Promise<WorkerAccount[]> {
    await delay();
    return mockWorkerAccounts;
  },

  async getTeams(): Promise<Team[]> {
    await delay();
    // Worker อยู่ในหลายทีมได้ (mock: อยู่ทีม 1 และ 2)
    return mockTeams.filter((team) => ["team-1", "team-2"].includes(team.id));
  },
};

// ===== HUB API =====
export const hubApi = {
  async getPosts(type?: "all" | "recruit" | "find-team" | "outsource"): Promise<HubPost[]> {
    await delay();
    if (!type || type === "all") {
      return mockHubPosts;
    }
    return mockHubPosts.filter((post) => post.type === type);
  },

  async getStats() {
    await delay();
    return mockHubStats;
  },

  async getFindTeamPosts(): Promise<FindTeamPost[]> {
    await delay();
    return mockFindTeamPosts;
  },

  async getOutsourceJobs(): Promise<OutsourceJob[]> {
    await delay();
    return mockOutsourceJobs;
  },

  async getRecruitPosts(): Promise<HubPost[]> {
    await delay();
    return mockHubPosts.filter((post) => post.type === "recruit");
  },
};

// ===== TEAM API =====
export const teamApi = {
  async getTeamById(id: string): Promise<Team | undefined> {
    await delay();
    return mockTeams.find((team) => team.id === id);
  },

  async getAllTeams(): Promise<Team[]> {
    await delay();
    return mockTeams;
  },

  async getPublicTeams(): Promise<Team[]> {
    await delay();
    return mockTeams.filter((team) => team.isPublic && team.isRecruiting);
  },

  async getMembers(teamId: string): Promise<TeamMember[]> {
    await delay();
    return mockTeamMembers.filter((m) => m.teamId === teamId);
  },

  async getWorkers(): Promise<Worker[]> {
    await delay();
    return mockWorkers;
  },
};

// ===== COMBINED API OBJECT =====
export const api = {
  seller: sellerApi,
  worker: workerApi,
  hub: hubApi,
  team: teamApi,
};

export default api;
