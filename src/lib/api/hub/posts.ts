/**
 * Hub Posts & Applications API
 *
 * Handles post management (recruit, find-team), team applications, and hub stats.
 */

import {
  getCurrentWorkerId,
  getCurrentSellerId,
  getCurrentUserRole,
} from "@/lib/storage";
import { generateId } from "@/lib/utils/helpers";

import { validate } from "@/lib/validations/utils";
import { createPostSchema } from "@/lib/validations/hub";

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
  getSellersFromStorage,
  getWorkersFromStorage,
} from "../storage-helpers";

import type { HubPost, FindTeamPost, TeamMember } from "@/types";

// ===== QUERIES =====

export async function getPosts(
  type?: "all" | "recruit" | "find-team" | "outsource"
): Promise<HubPost[]> {
  await delay();
  const posts = getHubPostsFromStorage();

  if (!type || type === "all") {
    return posts;
  }
  return posts.filter((post) => post.type === type);
}

export async function getStats() {
  await delay();
  const posts = getHubPostsFromStorage();

  return [
    {
      label: "หาลูกทีม",
      value: posts.filter((p) => p.type === "recruit").length,
    },
    {
      label: "หาทีม",
      value: posts.filter((p) => p.type === "find-team").length,
    },
    {
      label: "โยนงาน",
      value: posts.filter((p) => p.type === "outsource").length,
    },
    { label: "ทั้งหมด", value: posts.length },
  ];
}

export async function getFindTeamPosts(): Promise<FindTeamPost[]> {
  await delay();
  const posts = getHubPostsFromStorage();
  // Transform HubPost to FindTeamPost format
  return posts
    .filter((p) => p.type === "find-team")
    .map((p) => ({
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
}

export async function getRecruitPosts(): Promise<HubPost[]> {
  await delay();
  const posts = getHubPostsFromStorage();
  return posts.filter((post) => post.type === "recruit");
}

// ===== MUTATIONS =====

export async function createPost(payload: {
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
  validate(createPostSchema, payload);
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
    const seller = sellers.find((s) => s.id === sellerId);
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
    const worker = workers.find((w) => w.id === workerId);
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
}

export async function applyToTeam(
  teamId: string,
  workerId?: string,
  message?: string
): Promise<TeamApplication> {
  await delay();
  const wId = workerId || getCurrentWorkerId();
  if (!wId) throw new Error("Worker not authenticated");

  const applications = getTeamApplicationsFromStorage();
  const now = new Date().toISOString();

  const existing = applications.find(
    (a) => a.teamId === teamId && a.workerId === wId && a.status === "pending"
  );
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
}

export async function approveApplication(
  applicationId: string
): Promise<boolean> {
  await delay();
  const applications = getTeamApplicationsFromStorage();
  const appIndex = applications.findIndex((a) => a.id === applicationId);

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
  const teamIndex = teams.findIndex((t) => t.id === application.teamId);
  if (teamIndex !== -1) {
    teams[teamIndex].memberCount += 1;
    saveTeamsToStorage(teams);
  }

  return true;
}
