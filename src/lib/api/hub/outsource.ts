/**
 * Hub Outsource Jobs API
 *
 * Handles outsource job posting, bidding, and management.
 */

import { getCurrentSellerId } from "@/lib/storage";
import { generateId } from "@/lib/utils/helpers";
import { validate } from "@/lib/validations/utils";
import {
  createBidSchema,
  postOutsourceFromOrderSchema,
  postOutsourceDirectSchema,
} from "@/lib/validations/hub";

import {
  delay,
  getOutsourceJobsFromStorage,
  saveOutsourceJobsToStorage,
  getOutsourceBidsFromStorage,
  saveOutsourceBidsToStorage,
  getOrdersFromStorage,
  saveOrdersToStorage,
  getTeamJobsFromStorage,
  saveTeamJobsToStorage,
  getTeamsFromStorage,
  getSellersFromStorage,
} from "../storage-helpers";

import type { OutsourceJob, OutsourceBid, Job } from "@/types";

// ===== QUERIES =====

export async function getOutsourceJobs(): Promise<OutsourceJob[]> {
  await delay();
  const jobs = getOutsourceJobsFromStorage();
  return jobs.filter((j) => j.status === "open");
}

export async function getOutsourceJobById(
  jobId: string
): Promise<OutsourceJob | null> {
  await delay();
  const jobs = getOutsourceJobsFromStorage();
  return jobs.find((j) => j.id === jobId) || null;
}

export async function getOutsourceJobsList(filters?: {
  platform?: string;
  status?: string;
  sellerId?: string;
}): Promise<OutsourceJob[]> {
  await delay();
  let jobs = getOutsourceJobsFromStorage();

  if (filters?.platform) {
    jobs = jobs.filter((j) => j.platform === filters.platform);
  }
  if (filters?.status) {
    jobs = jobs.filter((j) => j.status === filters.status);
  }
  if (filters?.sellerId) {
    jobs = jobs.filter((j) => j.sellerId === filters.sellerId);
  }

  return jobs;
}

export async function getOutsourceBids(
  outsourceJobId: string
): Promise<OutsourceBid[]> {
  await delay();
  const bids = getOutsourceBidsFromStorage();
  return bids.filter((b) => b.outsourceJobId === outsourceJobId);
}

// ===== MUTATIONS =====

export async function postOutsourceFromOrder(payload: {
  orderId: string;
  orderItemId: string;
  quantity: number;
  suggestedPricePerUnit: number;
  deadline: string;
  description?: string;
  requirements?: string[];
  isUrgent?: boolean;
}): Promise<OutsourceJob> {
  validate(postOutsourceFromOrderSchema, payload);
  await delay(600);

  const orders = getOrdersFromStorage();
  const outsourceJobs = getOutsourceJobsFromStorage();
  const sellers = getSellersFromStorage();
  const now = new Date().toISOString();
  const sellerId = getCurrentSellerId() || "seller-1";

  const order = orders.find((o) => o.id === payload.orderId);
  if (!order) throw new Error("Order not found");

  const item = order.items.find((i) => i.id === payload.orderItemId);
  if (!item) throw new Error("Order item not found");

  const assignedQuantity =
    item.jobs?.reduce(
      (sum, j) => (j.status !== "cancelled" ? sum + j.quantity : sum),
      0
    ) || 0;
  const remainingQuantity =
    item.quantity - item.completedQuantity - assignedQuantity;

  if (payload.quantity > remainingQuantity) {
    throw new Error(
      `จำนวนที่โพสต์ (${payload.quantity}) เกินจำนวนที่เหลือ (${remainingQuantity})`
    );
  }

  const outsourceJobId = `outsource-${generateId()}`;
  const seller = sellers.find((s) => s.id === sellerId);

  const newOutsourceJob: OutsourceJob = {
    id: outsourceJobId,
    sellerId,
    orderId: payload.orderId,
    orderItemId: payload.orderItemId,
    title: `${item.serviceName} ${payload.quantity.toLocaleString()} หน่วย`,
    author: {
      id: sellerId,
      name: seller?.displayName || "Seller",
      avatar: seller?.displayName?.charAt(0) || "S",
      rating: seller?.rating || 0,
      verified: seller?.isVerified || false,
      totalOutsourced: outsourceJobs.filter(
        (j) => j.sellerId === sellerId
      ).length,
    },
    description:
      payload.description ||
      `ต้องการ ${item.serviceName} จำนวน ${payload.quantity.toLocaleString()} หน่วย`,
    platform: item.platform,
    jobType: item.type as OutsourceJob["jobType"],
    quantity: payload.quantity,
    completedQuantity: 0,
    budget: payload.quantity * payload.suggestedPricePerUnit,
    suggestedPricePerUnit: payload.suggestedPricePerUnit,
    deadline: payload.deadline,
    targetUrl: item.targetUrl,
    requirements: payload.requirements || [],
    status: "open",
    views: 0,
    bidsCount: 0,
    createdAt: now,
    updatedAt: now,
    isUrgent: payload.isUrgent,
  };

  outsourceJobs.unshift(newOutsourceJob);
  saveOutsourceJobsToStorage(outsourceJobs);

  const orderIndex = orders.findIndex((o) => o.id === payload.orderId);
  const itemIndex = orders[orderIndex].items.findIndex(
    (i) => i.id === payload.orderItemId
  );

  orders[orderIndex].items[itemIndex].outsourceJobId = outsourceJobId;
  orders[orderIndex].items[itemIndex].outsourceStatus = "open";
  orders[orderIndex].updatedAt = now;

  saveOrdersToStorage(orders);

  return newOutsourceJob;
}

export async function createBid(payload: {
  outsourceJobId: string;
  teamId: string;
  pricePerUnit: number;
  estimatedDays: number;
  message?: string;
}): Promise<OutsourceBid> {
  validate(createBidSchema, payload);
  await delay();

  const outsourceJobs = getOutsourceJobsFromStorage();
  const bids = getOutsourceBidsFromStorage();
  const teams = getTeamsFromStorage();
  const now = new Date().toISOString();

  const job = outsourceJobs.find((j) => j.id === payload.outsourceJobId);
  if (!job) throw new Error("Outsource job not found");
  if (job.status !== "open")
    throw new Error("Job is no longer accepting bids");

  const team = teams.find((t) => t.id === payload.teamId);
  if (!team) throw new Error("Team not found");

  const existingBid = bids.find(
    (b) =>
      b.outsourceJobId === payload.outsourceJobId &&
      b.teamId === payload.teamId &&
      b.status === "pending"
  );
  if (existingBid)
    throw new Error("Already submitted a bid for this job");

  const newBid: OutsourceBid = {
    id: `bid-${generateId()}`,
    outsourceJobId: payload.outsourceJobId,
    teamId: payload.teamId,
    team: {
      id: team.id,
      name: team.name,
      avatar: team.avatar,
      rating: team.rating,
      ratingCount: team.ratingCount,
      memberCount: team.memberCount,
      completedJobs: team.totalJobsCompleted,
    },
    pricePerUnit: payload.pricePerUnit,
    totalPrice: payload.pricePerUnit * job.quantity,
    estimatedDays: payload.estimatedDays,
    message: payload.message,
    status: "pending",
    createdAt: now,
    updatedAt: now,
  };

  bids.push(newBid);
  saveOutsourceBidsToStorage(bids);

  const jobIndex = outsourceJobs.findIndex(
    (j) => j.id === payload.outsourceJobId
  );
  outsourceJobs[jobIndex].bidsCount += 1;
  outsourceJobs[jobIndex].updatedAt = now;
  saveOutsourceJobsToStorage(outsourceJobs);

  return newBid;
}

export async function acceptBid(
  bidId: string
): Promise<{ bid: OutsourceBid; teamJob: Job }> {
  await delay(600);

  const bids = getOutsourceBidsFromStorage();
  const outsourceJobs = getOutsourceJobsFromStorage();
  const teamJobs = getTeamJobsFromStorage();
  const orders = getOrdersFromStorage();
  const teams = getTeamsFromStorage();
  const now = new Date().toISOString();
  const sellerId = getCurrentSellerId() || "seller-1";

  const bidIndex = bids.findIndex((b) => b.id === bidId);
  if (bidIndex === -1) throw new Error("Bid not found");

  const bid = bids[bidIndex];
  if (bid.status !== "pending") throw new Error("Bid is no longer pending");

  const jobIndex = outsourceJobs.findIndex(
    (j) => j.id === bid.outsourceJobId
  );
  if (jobIndex === -1) throw new Error("Outsource job not found");

  const outsourceJob = outsourceJobs[jobIndex];
  if (outsourceJob.status !== "open")
    throw new Error("Job is no longer open");

  const team = teams.find((t) => t.id === bid.teamId);
  if (!team) throw new Error("Team not found");

  const teamJobId = `job-${generateId()}`;
  const newTeamJob: Job = {
    id: teamJobId,
    sellerId,
    teamId: bid.teamId,
    orderId: outsourceJob.orderId,
    orderItemId: outsourceJob.orderItemId,
    sourceJobId: outsourceJob.sourceJobId,
    orderNumber: `HUB-${outsourceJob.id.slice(-6).toUpperCase()}`,
    serviceName: outsourceJob.title,
    type: outsourceJob.jobType as Job["type"],
    platform: outsourceJob.platform as Job["platform"],
    quantity: outsourceJob.quantity,
    completedQuantity: 0,
    claimedQuantity: 0,
    pricePerUnit: bid.pricePerUnit,
    totalPayout: bid.totalPrice,
    targetUrl: outsourceJob.targetUrl,
    instructions: outsourceJob.description,
    visibility: "all_members",
    status: "pending",
    deadline: outsourceJob.deadline,
    createdAt: now,
    updatedAt: now,
  };

  teamJobs.push(newTeamJob);
  saveTeamJobsToStorage(teamJobs);

  bids[bidIndex] = {
    ...bid,
    status: "accepted",
    updatedAt: now,
    respondedAt: now,
  };

  bids.forEach((b, i) => {
    if (
      b.outsourceJobId === bid.outsourceJobId &&
      b.id !== bidId &&
      b.status === "pending"
    ) {
      bids[i] = { ...b, status: "rejected", updatedAt: now, respondedAt: now };
    }
  });
  saveOutsourceBidsToStorage(bids);

  outsourceJobs[jobIndex] = {
    ...outsourceJob,
    status: "in_progress",
    acceptedBidId: bidId,
    assignedTeamId: bid.teamId,
    assignedJobId: teamJobId,
    updatedAt: now,
  };
  saveOutsourceJobsToStorage(outsourceJobs);

  if (outsourceJob.orderId && outsourceJob.orderItemId) {
    const orderIndex = orders.findIndex(
      (o) => o.id === outsourceJob.orderId
    );
    if (orderIndex !== -1) {
      const itemIndex = orders[orderIndex].items.findIndex(
        (i) => i.id === outsourceJob.orderItemId
      );
      if (itemIndex !== -1) {
        orders[orderIndex].items[itemIndex].outsourceStatus = "in_progress";

        if (!orders[orderIndex].items[itemIndex].jobs) {
          orders[orderIndex].items[itemIndex].jobs = [];
        }
        orders[orderIndex].items[itemIndex].jobs!.push({
          jobId: teamJobId,
          teamId: bid.teamId,
          teamName: team.name,
          quantity: outsourceJob.quantity,
          completedQuantity: 0,
          status: "pending",
        });

        orders[orderIndex].updatedAt = now;
        saveOrdersToStorage(orders);
      }
    }
  }

  return { bid: bids[bidIndex], teamJob: newTeamJob };
}

export async function rejectBid(
  bidId: string,
  reason?: string
): Promise<OutsourceBid> {
  await delay();

  const bids = getOutsourceBidsFromStorage();
  const now = new Date().toISOString();

  const bidIndex = bids.findIndex((b) => b.id === bidId);
  if (bidIndex === -1) throw new Error("Bid not found");

  if (bids[bidIndex].status !== "pending") {
    throw new Error("Bid is no longer pending");
  }

  bids[bidIndex] = {
    ...bids[bidIndex],
    status: "rejected",
    updatedAt: now,
    respondedAt: now,
  };
  saveOutsourceBidsToStorage(bids);

  return bids[bidIndex];
}

export async function postOutsourceDirect(payload: {
  platform: string;
  jobType: string;
  quantity: number;
  suggestedPricePerUnit: number;
  deadline: string;
  targetUrl: string;
  title?: string;
  description?: string;
  requirements?: string[];
  isUrgent?: boolean;
}): Promise<OutsourceJob> {
  validate(postOutsourceDirectSchema, payload);
  await delay(600);

  const outsourceJobs = getOutsourceJobsFromStorage();
  const sellers = getSellersFromStorage();
  const now = new Date().toISOString();
  const sellerId = getCurrentSellerId() || "seller-1";

  const outsourceJobId = `outsource-${generateId()}`;
  const seller = sellers.find((s) => s.id === sellerId);

  const jobTypeLabels: Record<string, string> = {
    like: "ไลค์",
    comment: "เม้น",
    follow: "Follow",
    view: "View",
    share: "Share",
    subscribe: "Subscribe",
  };

  const newOutsourceJob: OutsourceJob = {
    id: outsourceJobId,
    sellerId,
    orderId: undefined,
    orderItemId: undefined,
    title:
      payload.title ||
      `${jobTypeLabels[payload.jobType] || payload.jobType} ${payload.platform} ${payload.quantity.toLocaleString()} หน่วย`,
    author: {
      id: sellerId,
      name: seller?.displayName || "Seller",
      avatar: seller?.displayName?.charAt(0) || "S",
      rating: seller?.rating || 0,
      verified: seller?.isVerified || false,
      totalOutsourced: outsourceJobs.filter(
        (j) => j.sellerId === sellerId
      ).length,
    },
    description:
      payload.description ||
      `ต้องการ ${jobTypeLabels[payload.jobType] || payload.jobType} จำนวน ${payload.quantity.toLocaleString()} หน่วย`,
    platform: payload.platform,
    jobType: payload.jobType as OutsourceJob["jobType"],
    quantity: payload.quantity,
    completedQuantity: 0,
    budget: payload.quantity * payload.suggestedPricePerUnit,
    suggestedPricePerUnit: payload.suggestedPricePerUnit,
    deadline: payload.deadline,
    targetUrl: payload.targetUrl,
    requirements: payload.requirements || [],
    status: "open",
    views: 0,
    bidsCount: 0,
    createdAt: now,
    updatedAt: now,
    isUrgent: payload.isUrgent,
  };

  outsourceJobs.unshift(newOutsourceJob);
  saveOutsourceJobsToStorage(outsourceJobs);

  return newOutsourceJob;
}

export async function cancelOutsourceJob(
  jobId: string
): Promise<OutsourceJob> {
  await delay();

  const outsourceJobs = getOutsourceJobsFromStorage();
  const orders = getOrdersFromStorage();
  const now = new Date().toISOString();

  const jobIndex = outsourceJobs.findIndex((j) => j.id === jobId);
  if (jobIndex === -1) throw new Error("Outsource job not found");

  const job = outsourceJobs[jobIndex];
  if (job.status !== "open") {
    throw new Error("Can only cancel open jobs");
  }

  outsourceJobs[jobIndex] = {
    ...job,
    status: "cancelled",
    updatedAt: now,
  };
  saveOutsourceJobsToStorage(outsourceJobs);

  if (job.orderId && job.orderItemId) {
    const orderIndex = orders.findIndex((o) => o.id === job.orderId);
    if (orderIndex !== -1) {
      const itemIndex = orders[orderIndex].items.findIndex(
        (i) => i.id === job.orderItemId
      );
      if (itemIndex !== -1) {
        orders[orderIndex].items[itemIndex].outsourceStatus = "cancelled";
        orders[orderIndex].items[itemIndex].outsourceJobId = undefined;
        orders[orderIndex].updatedAt = now;
        saveOrdersToStorage(orders);
      }
    }
  }

  return outsourceJobs[jobIndex];
}
