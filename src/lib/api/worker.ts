/**
 * Worker API Module
 * 
 * Handles all worker-related operations including:
 * - Worker profile and stats
 * - Job claiming and submission
 * - Teams and accounts
 * - Earnings tracking
 */

import { getCurrentWorkerId } from "@/lib/storage";
import { generateId } from "@/lib/utils/helpers";

import {
  delay,
  getJobClaimsFromStorage,
  saveJobClaimsToStorage,
  getTeamJobsFromStorage,
  saveTeamJobsToStorage,
  getTeamsFromStorage,
  getTeamMembersFromStorage,
  getWorkersFromStorage,
  getWorkerAccountsFromStorage,
} from "./storage-helpers";

import type {
  Worker,
  WorkerAccount,
  Team,
  Job,
  JobClaim,
  WorkerJob,
} from "@/types";

// ===== DEFAULT DATA =====

const createDefaultWorker = (id: string): Worker => {
  const now = new Date().toISOString();
  return {
    id,
    userId: id,
    displayName: "Worker",
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
};

const defaultStats = {
  todayEarned: 0,
  weekEarned: 0,
  totalEarned: 0,
  pendingBalance: 0,
  availableBalance: 0,
  activeJobs: 0,
  completedJobs: 0,
  pendingReviews: 0,
  totalJobsCompleted: 0,
};

// ===== WORKER API =====
export const workerApi = {
  async getWorker(id?: string): Promise<Worker | null> {
    await delay();
    const workerId = id || getCurrentWorkerId();
    if (!workerId) return null;
    
    const workers = getWorkersFromStorage();
    return workers.find((w) => w.id === workerId) || null;
  },

  async getStats() {
    await delay();
    const workerId = getCurrentWorkerId();
    if (!workerId) return defaultStats;
    
    const claims = getJobClaimsFromStorage();
    const workerClaims = claims.filter(c => c.workerId === workerId);
    
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);
    
    const todayClaims = workerClaims.filter(c => new Date(c.createdAt) >= todayStart);
    const todayEarned = todayClaims
      .filter(c => c.status === "approved")
      .reduce((sum, c) => sum + c.earnAmount, 0);
    
    const pendingBalance = workerClaims
      .filter(c => c.status === "submitted")
      .reduce((sum, c) => sum + c.earnAmount, 0);
    
    const availableBalance = workerClaims
      .filter(c => c.status === "approved")
      .reduce((sum, c) => sum + c.earnAmount, 0);
    
    const totalJobsCompleted = workerClaims.filter(c => c.status === "approved").length;
    
    return {
      todayEarned,
      weekEarned: todayEarned * 5,
      totalEarned: availableBalance,
      pendingBalance,
      availableBalance,
      activeJobs: workerClaims.filter(c => c.status === "claimed").length,
      completedJobs: totalJobsCompleted,
      pendingReviews: workerClaims.filter(c => c.status === "submitted").length,
      totalJobsCompleted,
    };
  },

  async getActiveJobs(): Promise<WorkerJob[]> {
    await delay();
    const workerId = getCurrentWorkerId();
    if (!workerId) return [];
    
    const claims = getJobClaimsFromStorage();
    const teamJobs = getTeamJobsFromStorage();
    const teams = getTeamsFromStorage();
    
    const activeClaims = claims.filter(c => c.workerId === workerId && c.status === "claimed");
    
    return activeClaims
      .map(claim => {
        const job = teamJobs.find(j => j.id === claim.jobId);
        if (!job) return null;
        
        const team = teams.find(t => t.id === job.teamId);
        
        return {
          id: claim.id,
          teamName: team?.name || "Team",
          serviceName: job.serviceName,
          platform: job.platform,
          type: "human",
          targetUrl: job.targetUrl,
          quantity: claim.quantity,
          completedQuantity: claim.actualQuantity || 0,
          pricePerUnit: job.pricePerUnit,
          status: "in_progress" as const,
          deadline: job.deadline,
        } as WorkerJob;
      })
      .filter((j): j is WorkerJob => j !== null);
  },

  async getJobs(): Promise<{
    in_progress: WorkerJob[];
    pending_review: WorkerJob[];
    completed: WorkerJob[];
  }> {
    await delay();
    const workerId = getCurrentWorkerId();
    if (!workerId) return { in_progress: [], pending_review: [], completed: [] };
    
    const claims = getJobClaimsFromStorage();
    const teamJobs = getTeamJobsFromStorage();
    const teams = getTeamsFromStorage();
    
    const workerClaims = claims.filter(c => c.workerId === workerId);
    
    const mapClaimToWorkerJob = (claim: JobClaim): WorkerJob | null => {
      const job = teamJobs.find(j => j.id === claim.jobId);
      if (!job) return null;
      
      const team = teams.find(t => t.id === job.teamId);
      
      return {
        id: claim.id,
        teamName: team?.name || "Team",
        serviceName: job.serviceName,
        platform: job.platform,
        type: "human",
        targetUrl: job.targetUrl,
        quantity: claim.quantity,
        completedQuantity: claim.actualQuantity || 0,
        pricePerUnit: job.pricePerUnit,
        status: claim.status === "claimed" ? "in_progress" 
              : claim.status === "submitted" ? "pending_review" 
              : "completed",
        deadline: job.deadline,
        submittedAt: claim.submittedAt,
        completedAt: claim.status === "approved" ? claim.reviewedAt : undefined,
        earnings: claim.status === "approved" ? claim.earnAmount : undefined,
        instructions: job.instructions,
        earnedSoFar: claim.status === "approved" ? claim.earnAmount : (claim.actualQuantity || 0) * job.pricePerUnit,
        totalEarnings: claim.quantity * job.pricePerUnit,
        startedAt: claim.createdAt,
        claimedAt: claim.createdAt,
        cancelledAt: claim.status === "cancelled" ? claim.updatedAt : job.cancelledAt,
        cancelReason: job.cancelReason,
      };
    };
    
    const allJobs = workerClaims.map(mapClaimToWorkerJob).filter((j): j is WorkerJob => j !== null);
    
    return {
      in_progress: allJobs.filter(j => j.status === "in_progress"),
      pending_review: allJobs.filter(j => j.status === "pending_review"),
      completed: allJobs.filter(j => j.status === "completed"),
    };
  },

  async getAccounts(): Promise<WorkerAccount[]> {
    await delay();
    const workerId = getCurrentWorkerId();
    if (!workerId) return [];
    
    const accounts = getWorkerAccountsFromStorage();
    return accounts.filter(a => a.workerId === workerId);
  },

  async getTeams(): Promise<Team[]> {
    await delay();
    const workerId = getCurrentWorkerId();
    if (!workerId) return [];
    
    const members = getTeamMembersFromStorage();
    const teams = getTeamsFromStorage();
    
    const workerTeamIds = members
      .filter(m => m.workerId === workerId && m.status === "active")
      .map(m => m.teamId);
    
    return teams.filter(t => workerTeamIds.includes(t.id));
  },

  async getTeamJobPreview(teamJobId: string): Promise<{
    teamJob: Job | null;
    team: Team | null;
    existingClaim: JobClaim | null;
  }> {
    await delay();
    const workerId = getCurrentWorkerId();
    
    const teamJobs = getTeamJobsFromStorage();
    const teams = getTeamsFromStorage();
    const claims = getJobClaimsFromStorage();
    
    const teamJob = teamJobs.find(j => j.id === teamJobId) || null;
    const team = teamJob?.teamId ? teams.find(t => t.id === teamJob.teamId) || null : null;
    
    const existingClaim = workerId 
      ? claims.find(c => c.jobId === teamJobId && c.workerId === workerId) || null
      : null;
    
    return { teamJob, team, existingClaim };
  },
  
  // ===== WORKER MUTATIONS =====
  
  async claimTeamJob(jobId: string, quantity: number): Promise<JobClaim> {
    await delay();
    const workerId = getCurrentWorkerId();
    if (!workerId) throw new Error("Worker not authenticated");
    
    const teamJobs = getTeamJobsFromStorage();
    const claims = getJobClaimsFromStorage();
    const now = new Date().toISOString();
    
    const job = teamJobs.find(j => j.id === jobId);
    if (!job) throw new Error("Job not found");
    
    const remaining = job.quantity - job.completedQuantity;
    const claimQty = Math.min(quantity, remaining);
    
    const newClaim: JobClaim = {
      id: `claim-${generateId()}`,
      jobId: job.id,
      workerId,
      workerAccountId: "",
      quantity: claimQty,
      earnAmount: claimQty * job.pricePerUnit,
      status: "claimed",
      createdAt: now,
      updatedAt: now,
    };
    
    claims.push(newClaim);
    saveJobClaimsToStorage(claims);
    
    const jobIndex = teamJobs.findIndex(j => j.id === jobId);
    if (jobIndex !== -1) {
      teamJobs[jobIndex].status = "in_progress";
      teamJobs[jobIndex].claimedQuantity = (teamJobs[jobIndex].claimedQuantity || 0) + claimQty;
      saveTeamJobsToStorage(teamJobs);
    }
    
    return newClaim;
  },
  
  async submitJobClaim(claimId: string, payload: {
    actualQuantity: number;
    proofUrls?: string[];
    note?: string;
  }): Promise<JobClaim> {
    await delay();
    const claims = getJobClaimsFromStorage();
    const claimIndex = claims.findIndex(c => c.id === claimId);
    
    if (claimIndex === -1) throw new Error("Claim not found");
    
    const now = new Date().toISOString();
    
    claims[claimIndex] = {
      ...claims[claimIndex],
      status: "submitted",
      actualQuantity: payload.actualQuantity,
      proofUrls: payload.proofUrls,
      workerNote: payload.note,
      submittedAt: now,
      updatedAt: now,
    };
    
    saveJobClaimsToStorage(claims);
    
    const teamJobs = getTeamJobsFromStorage();
    const job = teamJobs.find(j => j.id === claims[claimIndex].jobId);
    if (job && job.status !== "pending_review") {
      const jobIndex = teamJobs.findIndex(j => j.id === job.id);
      if (jobIndex !== -1) {
        teamJobs[jobIndex].status = "pending_review";
        teamJobs[jobIndex].submittedAt = now;
        saveTeamJobsToStorage(teamJobs);
      }
    }
    
    return claims[claimIndex];
  },
  
  async updateClaimProgress(claimId: string, completedQuantity: number): Promise<JobClaim> {
    await delay();
    const claims = getJobClaimsFromStorage();
    const claimIndex = claims.findIndex(c => c.id === claimId);
    
    if (claimIndex === -1) throw new Error("Claim not found");
    
    claims[claimIndex] = {
      ...claims[claimIndex],
      actualQuantity: completedQuantity,
      updatedAt: new Date().toISOString(),
    };
    
    saveJobClaimsToStorage(claims);
    return claims[claimIndex];
  },
};
