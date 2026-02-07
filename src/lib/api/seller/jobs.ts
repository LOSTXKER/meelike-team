/**
 * Seller Jobs API
 *
 * Handles job management, job claims review, and order-job integration.
 */

import { getCurrentSellerId } from "@/lib/storage";
import { generateId } from "@/lib/utils/helpers";

import { validate } from "@/lib/validations/utils";
import { createStandaloneJobSchema, updateTeamJobSchema } from "@/lib/validations/seller";
import { requirePermission } from "@/lib/auth/guard";

import {
  delay,
  calculateOrderProgress,
  getOrdersFromStorage,
  saveOrdersToStorage,
  getTeamsFromStorage,
  getTeamJobsFromStorage,
  saveTeamJobsToStorage,
  getTeamPayoutsFromStorage,
  saveTeamPayoutsToStorage,
  getJobClaimsFromStorage,
  saveJobClaimsToStorage,
  getWorkersFromStorage,
  getJobsFromStorage,
  getTeamMembersFromStorage,
  saveTeamMembersToStorage,
} from "../storage-helpers";

import type { Job, JobClaim, TeamPayout } from "@/types";

// ===== JOB QUERIES =====

export async function getJobs(): Promise<Job[]> {
  await delay();
  return getJobsFromStorage();
}

export async function getJobClaims(): Promise<JobClaim[]> {
  await delay();
  return getJobClaimsFromStorage();
}

export async function getPendingJobClaims(): Promise<JobClaim[]> {
  await delay();
  const claims = getJobClaimsFromStorage();
  return claims.filter((c) => c.status === "submitted");
}

export async function getPendingReviews(): Promise<JobClaim[]> {
  await delay();
  const claims = getJobClaimsFromStorage();
  return claims.filter((c) => c.status === "submitted");
}

export async function getTeamJobs(): Promise<Job[]> {
  await delay();
  return getTeamJobsFromStorage();
}

export async function getTeamJobById(teamJobId: string): Promise<Job | null> {
  await delay();
  const jobs = getTeamJobsFromStorage();
  return jobs.find((j) => j.id === teamJobId) || null;
}

export async function getJobClaimsByTeamJobId(
  teamJobId: string
): Promise<JobClaim[]> {
  await delay();
  const claims = getJobClaimsFromStorage();
  const workers = getWorkersFromStorage();

  const jobClaims = claims.filter((c) => c.jobId === teamJobId);

  // Join worker data
  return jobClaims.map((claim) => {
    const worker = workers.find((w) => w.id === claim.workerId);
    return {
      ...claim,
      worker,
    };
  });
}

// ===== TEAM JOB MANAGEMENT =====

export async function updateTeamJob(
  jobId: string,
  updates: {
    quantity?: number;
    pricePerUnit?: number;
    instructions?: string;
    deadline?: string;
  }
): Promise<Job | null> {
  validate(updateTeamJobSchema, updates);
  await delay();

  const jobs = getTeamJobsFromStorage();
  const jobIndex = jobs.findIndex((j) => j.id === jobId);

  if (jobIndex === -1) return null;

  const job = jobs[jobIndex];

  if (job.status !== "pending") {
    throw new Error("Cannot edit job that is already in progress or completed");
  }

  const now = new Date().toISOString();

  jobs[jobIndex] = {
    ...job,
    ...updates,
    totalPayout:
      (updates.quantity ?? job.quantity) *
      (updates.pricePerUnit ?? job.pricePerUnit),
    updatedAt: now,
  };

  saveTeamJobsToStorage(jobs);
  return jobs[jobIndex];
}

export async function deleteTeamJob(jobId: string): Promise<boolean> {
  await delay();

  const jobs = getTeamJobsFromStorage();
  const jobIndex = jobs.findIndex((j) => j.id === jobId);

  if (jobIndex === -1) return false;

  const job = jobs[jobIndex];

  if (job.status !== "pending") {
    throw new Error(
      "Cannot delete job that is already in progress or completed"
    );
  }

  const claims = getJobClaimsFromStorage();
  const hasClaims = claims.some((c) => c.jobId === jobId);

  if (hasClaims) {
    throw new Error("Cannot delete job that has worker claims");
  }

  jobs.splice(jobIndex, 1);
  saveTeamJobsToStorage(jobs);

  return true;
}

export async function cancelTeamJob(
  jobId: string,
  reason?: string
): Promise<{
  success: boolean;
  payoutAmount: number;
  payoutCreated?: TeamPayout;
}> {
  await delay(800);

  const jobs = getTeamJobsFromStorage();
  const jobIndex = jobs.findIndex((j) => j.id === jobId);

  if (jobIndex === -1) {
    throw new Error("Job not found");
  }

  const job = jobs[jobIndex];

  if (job.status === "completed" || job.status === "cancelled") {
    throw new Error("Cannot cancel completed or already cancelled job");
  }

  const now = new Date().toISOString();
  const claims = getJobClaimsFromStorage();
  const workers = getWorkersFromStorage();

  const jobClaims = claims.filter((c) => c.jobId === jobId);

  let totalPayoutAmount = 0;
  let payoutCreated: TeamPayout | undefined;

  if (job.status === "pending") {
    totalPayoutAmount = 0;
  } else if (job.status === "in_progress") {
    jobClaims.forEach((claim) => {
      if (claim.status === "claimed") {
        const partialAmount = (claim.actualQuantity || 0) * job.pricePerUnit;
        totalPayoutAmount += partialAmount;
      }
    });
  } else if (job.status === "pending_review") {
    jobClaims.forEach((claim) => {
      if (claim.status === "submitted") {
        totalPayoutAmount += claim.earnAmount;
      }
    });
  }

  jobs[jobIndex] = {
    ...job,
    status: "cancelled",
    cancelledAt: now,
    cancelReason: reason,
    updatedAt: now,
  };

  saveTeamJobsToStorage(jobs);

  const updatedClaims = claims.map((claim) => {
    if (claim.jobId === jobId && claim.status !== "approved") {
      return {
        ...claim,
        status: "cancelled" as const,
        updatedAt: now,
      };
    }
    return claim;
  });

  saveJobClaimsToStorage(updatedClaims);

  if (totalPayoutAmount > 0 && jobClaims.length > 0) {
    const payouts = getTeamPayoutsFromStorage();
    const workerPayments = new Map<string, number>();

    jobClaims.forEach((claim) => {
      if (
        (job.status === "in_progress" && claim.status === "claimed") ||
        (job.status === "pending_review" && claim.status === "submitted")
      ) {
        const amount =
          job.status === "in_progress"
            ? (claim.actualQuantity || 0) * job.pricePerUnit
            : claim.earnAmount;

        workerPayments.set(
          claim.workerId,
          (workerPayments.get(claim.workerId) || 0) + amount
        );
      }
    });

    workerPayments.forEach((amount, workerId) => {
      const worker = workers.find((w) => w.id === workerId);

      if (worker) {
        const existingPayoutIndex = payouts.findIndex(
          (p) => p.workerId === workerId && p.status === "pending"
        );

        if (existingPayoutIndex !== -1) {
          payouts[existingPayoutIndex].amount += amount;
          payouts[existingPayoutIndex].jobCount += 1;
        } else {
          const newPayout: TeamPayout = {
            id: `payout-${generateId()}`,
            workerId,
            worker,
            amount,
            jobCount: 1,
            status: "pending",
            requestedAt: now,
            paymentMethod: worker.promptPayId ? "promptpay" : "bank",
            paymentAccount:
              worker.promptPayId || worker.bankAccount || "",
            bankName: worker.bankName,
            accountName: worker.bankAccountName,
          };

          payouts.push(newPayout);

          if (!payoutCreated) {
            payoutCreated = newPayout;
          }
        }
      }
    });

    saveTeamPayoutsToStorage(payouts);
  }

  return {
    success: true,
    payoutAmount: totalPayoutAmount,
    payoutCreated,
  };
}

// ===== JOB REVIEW & APPROVAL =====

export async function approveJobClaim(
  claimId: string,
  payload?: {
    rating?: number;
    review?: string;
  }
): Promise<JobClaim> {
  await delay(800);
  const claims = getJobClaimsFromStorage();
  const claimIndex = claims.findIndex((c) => c.id === claimId);

  if (claimIndex === -1) throw new Error("Claim not found");

  const claim = claims[claimIndex];
  const now = new Date().toISOString();

  claims[claimIndex] = {
    ...claim,
    status: "approved",
    reviewedAt: now,
    reviewedBy: getCurrentSellerId() || "seller",
    sellerRating: payload?.rating,
    sellerReview: payload?.review,
    updatedAt: now,
  };

  saveJobClaimsToStorage(claims);

  const teamJobs = getTeamJobsFromStorage();
  const jobIndex = teamJobs.findIndex((j) => j.id === claim.jobId);

  if (jobIndex !== -1) {
    teamJobs[jobIndex].completedQuantity += claim.actualQuantity || 0;

    if (teamJobs[jobIndex].completedQuantity >= teamJobs[jobIndex].quantity) {
      teamJobs[jobIndex].status = "completed";
      teamJobs[jobIndex].completedAt = now;
    }

    saveTeamJobsToStorage(teamJobs);
  }

  const payouts = getTeamPayoutsFromStorage();
  const workers = getWorkersFromStorage();
  const worker = workers.find((w) => w.id === claim.workerId);

  if (worker) {
    const existingPayoutIndex = payouts.findIndex(
      (p) => p.workerId === claim.workerId && p.status === "pending"
    );

    if (existingPayoutIndex !== -1) {
      payouts[existingPayoutIndex].amount += claim.earnAmount;
      payouts[existingPayoutIndex].jobCount += 1;
    } else {
      const newPayout: TeamPayout = {
        id: `payout-${generateId()}`,
        workerId: claim.workerId,
        worker,
        amount: claim.earnAmount,
        jobCount: 1,
        status: "pending",
        requestedAt: now,
        paymentMethod: worker.promptPayId ? "promptpay" : "bank",
        paymentAccount: worker.promptPayId || worker.bankAccount || "",
        bankName: worker.bankName,
        accountName: worker.bankAccountName,
      };

      payouts.push(newPayout);
    }

    saveTeamPayoutsToStorage(payouts);
  }

  const members = getTeamMembersFromStorage();
  const memberIndex = members.findIndex(
    (m) => m.workerId === claim.workerId && teamJobs[jobIndex]?.orderId
  );

  if (memberIndex !== -1) {
    members[memberIndex].jobsCompleted += 1;
    members[memberIndex].totalEarned += claim.earnAmount;
    saveTeamMembersToStorage(members);
  }

  return claims[claimIndex];
}

export async function rejectJobClaim(
  claimId: string,
  reason?: string
): Promise<JobClaim> {
  await delay();
  const claims = getJobClaimsFromStorage();
  const claimIndex = claims.findIndex((c) => c.id === claimId);

  if (claimIndex === -1) throw new Error("Claim not found");

  const now = new Date().toISOString();

  claims[claimIndex] = {
    ...claims[claimIndex],
    status: "rejected",
    reviewedAt: now,
    reviewedBy: getCurrentSellerId() || "seller",
    reviewNote: reason,
    updatedAt: now,
  };

  saveJobClaimsToStorage(claims);
  return claims[claimIndex];
}

// ===== ORDER-JOB INTEGRATION =====

export async function assignHumanItemToTeam(
  orderId: string,
  itemId: string,
  teamId: string,
  quantity: number,
  payRate: number,
  requirements?: string
): Promise<import("@/types").Order | null> {
  await delay(600);

  const sellerId = getCurrentSellerId() || "seller-1";
  const orders = getOrdersFromStorage();
  const orderIndex = orders.findIndex((o) => o.id === orderId);

  if (orderIndex === -1) return null;

  const order = orders[orderIndex];
  const itemIndex = order.items.findIndex((i) => i.id === itemId);

  if (itemIndex === -1) return null;

  const now = new Date().toISOString();
  const jobId = `job-${generateId()}`;
  const item = order.items[itemIndex];

  const jobs = getTeamJobsFromStorage();

  let instructions = requirements || "";
  if (
    !instructions &&
    item.commentTemplates &&
    item.commentTemplates.length > 0
  ) {
    instructions = `ตัวอย่างความคิดเห็น:\n${item.commentTemplates.join("\n")}`;
  }

  const teams = getTeamsFromStorage();
  const team = teams.find((t) => t.id === teamId);

  const newJob: Job = {
    id: jobId,
    sellerId,
    teamId: teamId,
    orderId: orderId,
    orderItemId: itemId,
    orderNumber: order.orderNumber,
    serviceName: item.serviceName,
    type: item.type,
    platform: item.platform,
    quantity: quantity,
    completedQuantity: 0,
    claimedQuantity: 0,
    pricePerUnit: payRate,
    totalPayout: quantity * payRate,
    targetUrl: item.targetUrl || "",
    instructions: instructions || undefined,
    visibility: "all_members",
    status: "pending",
    createdAt: now,
    updatedAt: now,
  };

  jobs.push(newJob);

  if (!order.items[itemIndex].jobs) {
    order.items[itemIndex].jobs = [];
  }
  order.items[itemIndex].jobs.push({
    jobId: jobId,
    teamId: teamId,
    teamName: team?.name || "Unknown Team",
    quantity: quantity,
    completedQuantity: 0,
    status: "pending",
  });
  saveTeamJobsToStorage(jobs);

  order.items[itemIndex] = {
    ...order.items[itemIndex],
    status: "processing",
    jobId: jobId,
    startedAt: now,
  };

  order.progress = calculateOrderProgress(order.items);
  order.updatedAt = now;

  saveOrdersToStorage(orders);
  return order;
}

export async function splitJobToTeams(
  orderId: string,
  itemId: string,
  splits: { teamId: string; quantity: number; payRate: number }[]
): Promise<Job[]> {
  await delay(600);

  const sellerId = getCurrentSellerId() || "seller-1";
  const orders = getOrdersFromStorage();
  const orderIndex = orders.findIndex((o) => o.id === orderId);
  if (orderIndex === -1) throw new Error("Order not found");

  const order = orders[orderIndex];
  const itemIndex = order.items.findIndex((i) => i.id === itemId);
  if (itemIndex === -1) throw new Error("Order item not found");

  const item = order.items[itemIndex];
  const teams = getTeamsFromStorage();
  const jobs = getTeamJobsFromStorage();
  const now = new Date().toISOString();

  const totalSplitQuantity = splits.reduce((sum, s) => sum + s.quantity, 0);
  const remainingQuantity = item.quantity - item.completedQuantity;
  if (totalSplitQuantity > remainingQuantity) {
    throw new Error(
      `จำนวนรวม (${totalSplitQuantity}) เกินจำนวนที่เหลือ (${remainingQuantity})`
    );
  }

  const createdJobs: Job[] = [];

  for (const split of splits) {
    const team = teams.find((t) => t.id === split.teamId);
    if (!team) {
      throw new Error(`Team ${split.teamId} not found`);
    }

    const newJobId = `job-${generateId()}`;
    const newJob: Job = {
      id: newJobId,
      sellerId,
      teamId: split.teamId,
      orderId: orderId,
      orderItemId: itemId,
      orderNumber: order.orderNumber,
      serviceName: item.serviceName,
      type: item.type,
      platform: item.platform,
      quantity: split.quantity,
      completedQuantity: 0,
      claimedQuantity: 0,
      pricePerUnit: split.payRate,
      totalPayout: split.quantity * split.payRate,
      targetUrl: item.targetUrl || "",
      instructions: item.commentTemplates?.join("\n"),
      visibility: "all_members",
      status: "pending",
      createdAt: now,
      updatedAt: now,
    };

    jobs.push(newJob);
    createdJobs.push(newJob);

    if (!order.items[itemIndex].jobs) {
      order.items[itemIndex].jobs = [];
    }
    order.items[itemIndex].jobs.push({
      jobId: newJobId,
      teamId: split.teamId,
      teamName: team.name,
      quantity: split.quantity,
      completedQuantity: 0,
      status: "pending",
    });
  }

  order.items[itemIndex].status = "processing";
  if (!order.items[itemIndex].startedAt) {
    order.items[itemIndex].startedAt = now;
  }

  if (order.status === "confirmed" || order.status === "pending") {
    order.status = "processing";
  }
  order.updatedAt = now;

  saveTeamJobsToStorage(jobs);
  saveOrdersToStorage(orders);

  return createdJobs;
}

export async function reassignJob(
  jobId: string,
  payload: { toTeamId: string; reason?: string }
): Promise<Job> {
  await delay(600);

  const sellerId = getCurrentSellerId() || "seller-1";
  const jobs = getTeamJobsFromStorage();
  const jobIndex = jobs.findIndex((j) => j.id === jobId);
  if (jobIndex === -1) throw new Error("Job not found");

  const oldJob = jobs[jobIndex];

  if (oldJob.status === "completed" || oldJob.status === "cancelled") {
    throw new Error("Cannot reassign completed or cancelled job");
  }

  const teams = getTeamsFromStorage();
  const newTeam = teams.find((t) => t.id === payload.toTeamId);
  if (!newTeam) throw new Error("Target team not found");

  const orders = getOrdersFromStorage();
  const now = new Date().toISOString();

  const remainingQuantity = oldJob.quantity - oldJob.completedQuantity;

  const newJobId = `job-${generateId()}`;
  const newJob: Job = {
    id: newJobId,
    sellerId,
    teamId: payload.toTeamId,
    orderId: oldJob.orderId,
    orderItemId: oldJob.orderItemId,
    sourceJobId: oldJob.id,
    orderNumber: oldJob.orderNumber,
    serviceName: oldJob.serviceName,
    type: oldJob.type,
    platform: oldJob.platform,
    quantity: remainingQuantity,
    completedQuantity: 0,
    claimedQuantity: 0,
    pricePerUnit: oldJob.pricePerUnit,
    totalPayout: remainingQuantity * oldJob.pricePerUnit,
    targetUrl: oldJob.targetUrl,
    instructions: oldJob.instructions,
    visibility: "all_members",
    status: "pending",
    deadline: oldJob.deadline,
    createdAt: now,
    updatedAt: now,
  };

  jobs[jobIndex] = {
    ...oldJob,
    status: "cancelled",
    cancelledAt: now,
    cancelReason: payload.reason || `โยนงานไปทีม ${newTeam.name}`,
    updatedAt: now,
  };

  jobs.push(newJob);
  saveTeamJobsToStorage(jobs);

  if (oldJob.orderItemId) {
    const orderIndex = orders.findIndex((o) => o.id === oldJob.orderId);
    if (orderIndex !== -1) {
      const itemIndex = orders[orderIndex].items.findIndex(
        (i) => i.id === oldJob.orderItemId
      );
      if (itemIndex !== -1 && orders[orderIndex].items[itemIndex].jobs) {
        const jobArrayIndex = orders[orderIndex].items[
          itemIndex
        ].jobs!.findIndex((j) => j.jobId === oldJob.id);
        if (jobArrayIndex !== -1) {
          orders[orderIndex].items[itemIndex].jobs![jobArrayIndex].status =
            "cancelled";
        }

        orders[orderIndex].items[itemIndex].jobs!.push({
          jobId: newJobId,
          teamId: payload.toTeamId,
          teamName: newTeam.name,
          quantity: remainingQuantity,
          completedQuantity: 0,
          status: "pending",
        });

        saveOrdersToStorage(orders);
      }
    }
  }

  return newJob;
}

export async function syncOrderItemProgress(
  orderItemId: string
): Promise<void> {
  await delay();

  const orders = getOrdersFromStorage();
  const jobs = getTeamJobsFromStorage();

  let orderIndex = -1;
  let itemIndex = -1;

  for (let i = 0; i < orders.length; i++) {
    const idx = orders[i].items.findIndex((item) => item.id === orderItemId);
    if (idx !== -1) {
      orderIndex = i;
      itemIndex = idx;
      break;
    }
  }

  if (orderIndex === -1 || itemIndex === -1) {
    throw new Error("Order item not found");
  }

  const order = orders[orderIndex];
  const item = order.items[itemIndex];

  const linkedJobs = jobs.filter((j) => j.orderItemId === orderItemId);

  if (linkedJobs.length === 0) {
    return;
  }

  const totalCompleted = linkedJobs.reduce(
    (sum, j) => sum + j.completedQuantity,
    0
  );

  order.items[itemIndex].completedQuantity = totalCompleted;
  order.items[itemIndex].progress = Math.round(
    (totalCompleted / item.quantity) * 100
  );

  if (order.items[itemIndex].jobs) {
    order.items[itemIndex].jobs = order.items[itemIndex].jobs!.map(
      (jobSummary) => {
        const fullJob = linkedJobs.find((j) => j.id === jobSummary.jobId);
        if (fullJob) {
          return {
            ...jobSummary,
            completedQuantity: fullJob.completedQuantity,
            status: fullJob.status,
          };
        }
        return jobSummary;
      }
    );
  }

  if (totalCompleted >= item.quantity) {
    order.items[itemIndex].status = "completed";
    order.items[itemIndex].completedAt = new Date().toISOString();
  }

  const allItems = order.items;
  const totalQuantity = allItems.reduce((sum, i) => sum + i.quantity, 0);
  const totalCompletedOrder = allItems.reduce(
    (sum, i) => sum + i.completedQuantity,
    0
  );
  order.progress = Math.round((totalCompletedOrder / totalQuantity) * 100);

  const allItemsCompleted = allItems.every(
    (i) => i.status === "completed" || i.status === "cancelled"
  );
  if (allItemsCompleted && order.status === "processing") {
    order.status = "completed";
    order.completedAt = new Date().toISOString();
  }

  order.updatedAt = new Date().toISOString();
  saveOrdersToStorage(orders);
}

// ===== STANDALONE JOB CREATION =====

export async function createStandaloneJob(
  teamId: string,
  payload: {
    title?: string;
    platform: "facebook" | "instagram" | "tiktok" | "youtube" | "twitter";
    serviceType: "like" | "comment" | "follow" | "share" | "view";
    targetUrl: string;
    quantity: number;
    pricePerUnit: number;
    instructions?: string;
    commentTemplates?: string[];
    deadline?: string;
    isUrgent?: boolean;
  }
): Promise<Job> {
  requirePermission("job:create");
  validate(createStandaloneJobSchema, payload);
  await delay(600);

  const sellerId = getCurrentSellerId() || "seller-1";
  const teams = getTeamsFromStorage();
  const team = teams.find((t) => t.id === teamId);

  if (!team) {
    throw new Error("Team not found");
  }

  const jobs = getTeamJobsFromStorage();
  const now = new Date().toISOString();
  const jobId = `job-${generateId()}`;

  // Generate service name based on platform and type
  const platformNames: Record<string, string> = {
    facebook: "Facebook",
    instagram: "Instagram",
    tiktok: "TikTok",
    youtube: "YouTube",
    twitter: "Twitter/X",
  };
  const typeNames: Record<string, string> = {
    like: "Like",
    comment: "Comment",
    follow: "Follow",
    share: "Share",
    view: "View",
  };
  const serviceName =
    payload.title ||
    `${platformNames[payload.platform]} ${typeNames[payload.serviceType]}`;

  const newJob: Job = {
    id: jobId,
    sellerId,
    teamId,
    serviceName,
    title: payload.title,
    type: payload.serviceType,
    platform: payload.platform,
    targetUrl: payload.targetUrl,
    quantity: payload.quantity,
    completedQuantity: 0,
    claimedQuantity: 0,
    pricePerUnit: payload.pricePerUnit,
    totalPayout: payload.quantity * payload.pricePerUnit,
    instructions: payload.instructions,
    commentTemplates: payload.commentTemplates,
    visibility: "all_members",
    deadline: payload.deadline
      ? new Date(payload.deadline).toISOString()
      : undefined,
    isUrgent: payload.isUrgent || false,
    status: "pending",
    createdAt: now,
    updatedAt: now,
    teamName: team.name,
  };

  jobs.push(newJob);
  saveTeamJobsToStorage(jobs);

  return newJob;
}
