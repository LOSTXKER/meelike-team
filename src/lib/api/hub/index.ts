/**
 * Hub API Module
 *
 * Handles all hub-related operations including:
 * - Post management (recruit, find-team, outsource)
 * - Team applications
 * - Hub statistics
 */

// Re-export TeamApplication type
export type { TeamApplication } from "../storage-helpers";

import {
  getPosts,
  getStats,
  getFindTeamPosts,
  getRecruitPosts,
  createPost,
  applyToTeam,
  approveApplication,
} from "./posts";
import {
  getOutsourceJobs,
  getOutsourceJobById,
  getOutsourceJobsList,
  getOutsourceBids,
  postOutsourceFromOrder,
  createBid,
  acceptBid,
  rejectBid,
  postOutsourceDirect,
  cancelOutsourceJob,
} from "./outsource";

// ===== COMBINED HUB API =====

export const hubApi = {
  // Posts & Applications
  getPosts,
  getStats,
  getFindTeamPosts,
  getRecruitPosts,
  createPost,
  applyToTeam,
  approveApplication,

  // Outsource Jobs
  getOutsourceJobs,
  getOutsourceJobById,
  getOutsourceJobsList,
  getOutsourceBids,
  postOutsourceFromOrder,
  createBid,
  acceptBid,
  rejectBid,
  postOutsourceDirect,
  cancelOutsourceJob,
};
