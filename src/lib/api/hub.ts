/**
 * Hub API Module
 * 
 * Handles all hub-related operations including:
 * - Post management (recruit, find-team, outsource)
 * - Team applications
 * - Hub statistics
 */

import { getCurrentWorkerId, getCurrentSellerId, getCurrentUserRole } from "@/lib/storage";
import { generateId } from "@/lib/utils/helpers";

import {
  delay,
  TeamApplication,
  getHubPostsFromStorage,
  saveHubPostsToStorage,
  getTeamApplicationsFromStorage,
  saveTeamApplicationsToStorage,
  getTeamMembersFromStorage,
  saveTeamMembersToStorage,
  getTeamsFromStorage,
  saveTeamsToStorage,
  getOutsourceJobsFromStorage,
  saveOutsourceJobsToStorage,
  getOutsourceBidsFromStorage,
  saveOutsourceBidsToStorage,
  getOrdersFromStorage,
  saveOrdersToStorage,
  getTeamJobsFromStorage,
  saveTeamJobsToStorage,
  getSellersFromStorage,
  getWorkersFromStorage,
} from "./storage-helpers";

import type {
  HubPost,
  FindTeamPost,
  OutsourceJob,
  OutsourceBid,
  TeamMember,
  Job,
} from "@/types";

// Re-export TeamApplication type
export type { TeamApplication } from "./storage-helpers";

// ===== HUB API =====
export const hubApi = {
  async getPosts(type?: "all" | "recruit" | "find-team" | "outsource"): Promise<HubPost[]> {
    await delay();
    const posts = getHubPostsFromStorage();
    
    if (!type || type === "all") {
      return posts;
    }
    return posts.filter((post) => post.type === type);
  },

  async getStats() {
    await delay();
    const posts = getHubPostsFromStorage();
    
    return [
      { label: "หาลูกทีม", value: posts.filter(p => p.type === "recruit").length },
      { label: "หาทีม", value: posts.filter(p => p.type === "find-team").length },
      { label: "โยนงาน", value: posts.filter(p => p.type === "outsource").length },
      { label: "ทั้งหมด", value: posts.length },
    ];
  },

  async getFindTeamPosts(): Promise<FindTeamPost[]> {
    await delay();
    const posts = getHubPostsFromStorage();
    // Transform HubPost to FindTeamPost format
    return posts
      .filter(p => p.type === "find-team")
      .map(p => ({
        id: p.id,
        title: p.title,
        author: {
          name: p.author?.name || "Worker",
          avatar: p.author?.avatar || "W",
          rating: p.author?.rating || 0,
          level: "Bronze" as const,
        },
        platforms: p.platforms || [],
        description: p.description,
        experience: p.experience || "ไม่ระบุ",
        availability: p.availability || "ไม่ระบุ",
        expectedPay: p.expectedPay || "ไม่ระบุ",
        skills: p.requirements || [],
        completedJobs: p.completedJobs || 0,
        completionRate: 0,
        portfolio: "",
        views: p.views || 0,
        interested: p.interested || 0,
        createdAt: p.createdAt,
      }));
  },

  async getOutsourceJobs(): Promise<OutsourceJob[]> {
    await delay();
    const jobs = getOutsourceJobsFromStorage();
    return jobs.filter(j => j.status === "open");
  },

  async getRecruitPosts(): Promise<HubPost[]> {
    await delay();
    const posts = getHubPostsFromStorage();
    return posts.filter((post) => post.type === "recruit");
  },
  
  // ===== HUB MUTATIONS =====
  
  async createPost(payload: {
    type: "recruit" | "find-team" | "outsource";
    title: string;
    description: string;
    platforms: string[];
    payRate?: string | { min: number; max: number; unit: string };
    requirements?: string[];
    benefits?: string[];
    openSlots?: number;
    experience?: string;
    expectedPay?: string;
    availability?: string;
    jobType?: string;
    quantity?: number;
    budget?: string;
    deadline?: string;
  }): Promise<HubPost> {
    await delay();
    const posts = getHubPostsFromStorage();
    const now = new Date().toISOString();
    
    // Get author info from auth
    const role = getCurrentUserRole();
    const workerId = getCurrentWorkerId();
    const sellerId = getCurrentSellerId();
    
    let authorInfo;
    if (role === "seller" && sellerId) {
      const sellers = getSellersFromStorage();
      const seller = sellers.find(s => s.id === sellerId);
      authorInfo = {
        name: seller?.displayName || "Seller",
        avatar: seller?.displayName?.charAt(0) || "S",
        rating: seller?.rating || 0,
        verified: seller?.isVerified || false,
        type: "seller" as const,
        memberCount: 0,
        totalPaid: seller?.totalSpentOnWorkers || 0,
      };
    } else if (role === "worker" && workerId) {
      const workers = getWorkersFromStorage();
      const worker = workers.find(w => w.id === workerId);
      authorInfo = {
        name: worker?.displayName || "Worker",
        avatar: worker?.displayName?.charAt(0) || "W",
        rating: worker?.rating || 0,
        verified: true,
        type: "worker" as const,
      };
    } else {
      throw new Error("User not authenticated");
    }
    
    const newPost: HubPost = {
      id: `post-${generateId()}`,
      type: payload.type,
      title: payload.title,
      author: authorInfo,
      description: payload.description,
      platforms: payload.platforms,
      payRate: payload.payRate,
      requirements: payload.requirements,
      benefits: payload.benefits,
      openSlots: payload.openSlots,
      applicants: 0,
      experience: payload.experience,
      expectedPay: payload.expectedPay,
      availability: payload.availability,
      jobType: payload.jobType,
      quantity: payload.quantity,
      budget: payload.budget,
      deadline: payload.deadline,
      views: 0,
      interested: 0,
      createdAt: now,
    };
    
    posts.unshift(newPost);
    saveHubPostsToStorage(posts);
    
    return newPost;
  },
  
  async applyToTeam(teamId: string, workerId?: string, message?: string): Promise<TeamApplication> {
    await delay();
    const wId = workerId || getCurrentWorkerId();
    if (!wId) throw new Error("Worker not authenticated");
    
    const applications = getTeamApplicationsFromStorage();
    const now = new Date().toISOString();
    
    const existing = applications.find(a => a.teamId === teamId && a.workerId === wId && a.status === "pending");
    if (existing) {
      throw new Error("Already applied to this team");
    }
    
    const newApplication: TeamApplication = {
      id: `app-${generateId()}`,
      teamId,
      workerId: wId,
      message,
      status: "pending",
      createdAt: now,
    };
    
    applications.push(newApplication);
    saveTeamApplicationsToStorage(applications);
    
    return newApplication;
  },
  
  async approveApplication(applicationId: string): Promise<boolean> {
    await delay();
    const applications = getTeamApplicationsFromStorage();
    const appIndex = applications.findIndex(a => a.id === applicationId);
    
    if (appIndex === -1) return false;
    
    const application = applications[appIndex];
    const now = new Date().toISOString();
    
    applications[appIndex] = {
      ...application,
      status: "approved",
      reviewedAt: now,
      reviewedBy: getCurrentSellerId() || "seller",
    };
    saveTeamApplicationsToStorage(applications);
    
    const members = getTeamMembersFromStorage();
    const newMember: TeamMember = {
      id: `member-${generateId()}`,
      teamId: application.teamId,
      workerId: application.workerId,
      status: "active",
      role: "worker",
      jobsCompleted: 0,
      totalEarned: 0,
      rating: 0,
      ratingCount: 0,
      joinedAt: now,
      lastActiveAt: now,
    };
    
    members.push(newMember);
    saveTeamMembersToStorage(members);
    
    const teams = getTeamsFromStorage();
    const teamIndex = teams.findIndex(t => t.id === application.teamId);
    if (teamIndex !== -1) {
      teams[teamIndex].memberCount += 1;
      saveTeamsToStorage(teams);
    }
    
    return true;
  },

  // ===== OUTSOURCE JOB APIs =====

  async postOutsourceFromOrder(payload: {
    orderId: string;
    orderItemId: string;
    quantity: number;
    suggestedPricePerUnit: number;
    deadline: string;
    description?: string;
    requirements?: string[];
    isUrgent?: boolean;
  }): Promise<OutsourceJob> {
    await delay(600);

    const orders = getOrdersFromStorage();
    const outsourceJobs = getOutsourceJobsFromStorage();
    const sellers = getSellersFromStorage();
    const now = new Date().toISOString();
    const sellerId = getCurrentSellerId() || "seller-1";

    const order = orders.find(o => o.id === payload.orderId);
    if (!order) throw new Error("Order not found");

    const item = order.items.find(i => i.id === payload.orderItemId);
    if (!item) throw new Error("Order item not found");

    const assignedQuantity = item.jobs?.reduce((sum, j) => 
      j.status !== "cancelled" ? sum + j.quantity : sum, 0) || 0;
    const remainingQuantity = item.quantity - item.completedQuantity - assignedQuantity;

    if (payload.quantity > remainingQuantity) {
      throw new Error(`จำนวนที่โพสต์ (${payload.quantity}) เกินจำนวนที่เหลือ (${remainingQuantity})`);
    }

    const outsourceJobId = `outsource-${generateId()}`;
    const seller = sellers.find(s => s.id === sellerId);

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
        totalOutsourced: outsourceJobs.filter(j => j.sellerId === sellerId).length,
      },
      description: payload.description || `ต้องการ ${item.serviceName} จำนวน ${payload.quantity.toLocaleString()} หน่วย`,
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

    const orderIndex = orders.findIndex(o => o.id === payload.orderId);
    const itemIndex = orders[orderIndex].items.findIndex(i => i.id === payload.orderItemId);
    
    orders[orderIndex].items[itemIndex].outsourceJobId = outsourceJobId;
    orders[orderIndex].items[itemIndex].outsourceStatus = "open";
    orders[orderIndex].updatedAt = now;
    
    saveOrdersToStorage(orders);

    return newOutsourceJob;
  },

  async getOutsourceJobById(jobId: string): Promise<OutsourceJob | null> {
    await delay();
    const jobs = getOutsourceJobsFromStorage();
    return jobs.find(j => j.id === jobId) || null;
  },

  async getOutsourceJobsList(filters?: {
    platform?: string;
    status?: string;
    sellerId?: string;
  }): Promise<OutsourceJob[]> {
    await delay();
    let jobs = getOutsourceJobsFromStorage();

    if (filters?.platform) {
      jobs = jobs.filter(j => j.platform === filters.platform);
    }
    if (filters?.status) {
      jobs = jobs.filter(j => j.status === filters.status);
    }
    if (filters?.sellerId) {
      jobs = jobs.filter(j => j.sellerId === filters.sellerId);
    }

    return jobs;
  },

  async getOutsourceBids(outsourceJobId: string): Promise<OutsourceBid[]> {
    await delay();
    const bids = getOutsourceBidsFromStorage();
    return bids.filter(b => b.outsourceJobId === outsourceJobId);
  },

  async createBid(payload: {
    outsourceJobId: string;
    teamId: string;
    pricePerUnit: number;
    estimatedDays: number;
    message?: string;
  }): Promise<OutsourceBid> {
    await delay();

    const outsourceJobs = getOutsourceJobsFromStorage();
    const bids = getOutsourceBidsFromStorage();
    const teams = getTeamsFromStorage();
    const now = new Date().toISOString();

    const job = outsourceJobs.find(j => j.id === payload.outsourceJobId);
    if (!job) throw new Error("Outsource job not found");
    if (job.status !== "open") throw new Error("Job is no longer accepting bids");

    const team = teams.find(t => t.id === payload.teamId);
    if (!team) throw new Error("Team not found");

    const existingBid = bids.find(b => 
      b.outsourceJobId === payload.outsourceJobId && 
      b.teamId === payload.teamId &&
      b.status === "pending"
    );
    if (existingBid) throw new Error("Already submitted a bid for this job");

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

    const jobIndex = outsourceJobs.findIndex(j => j.id === payload.outsourceJobId);
    outsourceJobs[jobIndex].bidsCount += 1;
    outsourceJobs[jobIndex].updatedAt = now;
    saveOutsourceJobsToStorage(outsourceJobs);

    return newBid;
  },

  async acceptBid(bidId: string): Promise<{ bid: OutsourceBid; teamJob: Job }> {
    await delay(600);

    const bids = getOutsourceBidsFromStorage();
    const outsourceJobs = getOutsourceJobsFromStorage();
    const teamJobs = getTeamJobsFromStorage();
    const orders = getOrdersFromStorage();
    const teams = getTeamsFromStorage();
    const now = new Date().toISOString();
    const sellerId = getCurrentSellerId() || "seller-1";

    const bidIndex = bids.findIndex(b => b.id === bidId);
    if (bidIndex === -1) throw new Error("Bid not found");

    const bid = bids[bidIndex];
    if (bid.status !== "pending") throw new Error("Bid is no longer pending");

    const jobIndex = outsourceJobs.findIndex(j => j.id === bid.outsourceJobId);
    if (jobIndex === -1) throw new Error("Outsource job not found");

    const outsourceJob = outsourceJobs[jobIndex];
    if (outsourceJob.status !== "open") throw new Error("Job is no longer open");

    const team = teams.find(t => t.id === bid.teamId);
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
      if (b.outsourceJobId === bid.outsourceJobId && b.id !== bidId && b.status === "pending") {
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
      const orderIndex = orders.findIndex(o => o.id === outsourceJob.orderId);
      if (orderIndex !== -1) {
        const itemIndex = orders[orderIndex].items.findIndex(i => i.id === outsourceJob.orderItemId);
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
  },

  async rejectBid(bidId: string, reason?: string): Promise<OutsourceBid> {
    await delay();

    const bids = getOutsourceBidsFromStorage();
    const now = new Date().toISOString();

    const bidIndex = bids.findIndex(b => b.id === bidId);
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
  },

  async postOutsourceDirect(payload: {
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
    await delay(600);

    const outsourceJobs = getOutsourceJobsFromStorage();
    const sellers = getSellersFromStorage();
    const now = new Date().toISOString();
    const sellerId = getCurrentSellerId() || "seller-1";

    const outsourceJobId = `outsource-${generateId()}`;
    const seller = sellers.find(s => s.id === sellerId);

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
      title: payload.title || `${jobTypeLabels[payload.jobType] || payload.jobType} ${payload.platform} ${payload.quantity.toLocaleString()} หน่วย`,
      author: {
        id: sellerId,
        name: seller?.displayName || "Seller",
        avatar: seller?.displayName?.charAt(0) || "S",
        rating: seller?.rating || 0,
        verified: seller?.isVerified || false,
        totalOutsourced: outsourceJobs.filter(j => j.sellerId === sellerId).length,
      },
      description: payload.description || `ต้องการ ${jobTypeLabels[payload.jobType] || payload.jobType} จำนวน ${payload.quantity.toLocaleString()} หน่วย`,
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
  },

  async cancelOutsourceJob(jobId: string): Promise<OutsourceJob> {
    await delay();

    const outsourceJobs = getOutsourceJobsFromStorage();
    const orders = getOrdersFromStorage();
    const now = new Date().toISOString();

    const jobIndex = outsourceJobs.findIndex(j => j.id === jobId);
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
      const orderIndex = orders.findIndex(o => o.id === job.orderId);
      if (orderIndex !== -1) {
        const itemIndex = orders[orderIndex].items.findIndex(i => i.id === job.orderItemId);
        if (itemIndex !== -1) {
          orders[orderIndex].items[itemIndex].outsourceStatus = "cancelled";
          orders[orderIndex].items[itemIndex].outsourceJobId = undefined;
          orders[orderIndex].updatedAt = now;
          saveOrdersToStorage(orders);
        }
      }
    }

    return outsourceJobs[jobIndex];
  },
};
