// Re-export all mock data from domain-specific files

// Seller domain
export { mockSeller, mockServices, mockOrders, mockSellerStats } from "./seller";

// Worker domain
export {
  mockWorkers,
  mockWorkerAccounts,
  mockWorkerStats,
  mockWorkerJobs,
  mockActiveJobs,
} from "./worker";

// Team domain
export { mockTeams, mockTeam, mockTeamMembers, mockJobClaims, mockTeamJobs, mockTeamPayouts, mockTeamReviews } from "./team";

// Jobs domain
export { mockJobs } from "./jobs";

// Hub domain
export {
  mockHubPosts,
  mockHubStats,
  mockFindTeamPosts,
  mockOutsourceJobs,
  getHubPostsByType,
  getRecruitPosts,
  getFindTeamPosts,
  getOutsourcePosts,
} from "./hub";

// Helper functions
export { getJobTypeLabel, getLevelColor } from "./helpers";

// Re-export types for convenience (they're now in @/types)
export type {
  HubPost,
  FindTeamPost,
  OutsourceJob,
  WorkerJob,
} from "@/types";
