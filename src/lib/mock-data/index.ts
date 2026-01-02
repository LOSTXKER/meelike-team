// Re-export all mock data from domain-specific files

// ===== V1 (Team Model) =====

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
export { mockTeams, mockTeam, mockTeamMembers, mockJobClaims as mockTeamJobClaims, mockTeamJobs, mockTeamPayouts, mockTeamReviews } from "./team";

// Jobs domain (V1)
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

// ===== V2 (Marketplace Model) =====

// Employer domain
export { mockEmployers, mockEmployer } from "./employer";
export type { Employer } from "./employer";

// Wallet domain
export { mockWallets, mockTransactions, getWalletByUserId, getTransactionsByUserId } from "./wallet";
export type { Wallet, Transaction, TransactionType } from "./wallet";

// Jobs domain (V2 Marketplace)
export {
  mockMarketplaceJobs,
  mockJobClaims,
  getPublicJobs,
  getEmployerJobs,
  getClaimedJobWithUrl,
  getWorkerClaims,
} from "./jobs";
export type {
  MarketplaceJob,
  JobClaim,
  PublicJob,
  Platform,
  ActionType,
  JobStatus,
  ClaimStatus,
} from "./jobs";

// Re-export types for convenience (they're now in @/types)
export type {
  HubPost,
  FindTeamPost,
  OutsourceJob,
  WorkerJob,
} from "@/types";

// MeeLike API domain
export {
  mockMeeLikeServices,
  getMeeLikeServicesByCategory,
  searchMeeLikeServices,
  getMeeLikeRatePerUnit,
  meeLikeCategories,
} from "./meelike";
