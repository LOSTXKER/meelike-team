/**
 * React Query Key Factory
 *
 * Centralized query key management for cache invalidation.
 * Convention: each domain has a hierarchy of keys for granular invalidation.
 */

export const queryKeys = {
  // ===== SELLER =====
  seller: {
    all: ["seller"] as const,
    profile: () => [...queryKeys.seller.all, "profile"] as const,
    stats: () => [...queryKeys.seller.all, "stats"] as const,
    services: () => [...queryKeys.seller.all, "services"] as const,
    orders: () => [...queryKeys.seller.all, "orders"] as const,
    order: (id: string) => [...queryKeys.seller.all, "order", id] as const,
    teams: () => [...queryKeys.seller.all, "teams"] as const,
    team: (id: string) => [...queryKeys.seller.all, "team", id] as const,
    teamMembers: (teamId?: string) =>
      [...queryKeys.seller.all, "teamMembers", teamId] as const,
    jobs: () => [...queryKeys.seller.all, "jobs"] as const,
    teamJobs: () => [...queryKeys.seller.all, "teamJobs"] as const,
    teamJob: (id: string) => [...queryKeys.seller.all, "teamJob", id] as const,
    jobClaims: () => [...queryKeys.seller.all, "jobClaims"] as const,
    jobClaimsByJob: (jobId: string) =>
      [...queryKeys.seller.all, "jobClaims", jobId] as const,
    pendingReviews: () =>
      [...queryKeys.seller.all, "pendingReviews"] as const,
    pendingJobClaims: () =>
      [...queryKeys.seller.all, "pendingJobClaims"] as const,
    payouts: () => [...queryKeys.seller.all, "payouts"] as const,
    workerBalances: () =>
      [...queryKeys.seller.all, "workerBalances"] as const,
    transactions: () =>
      [...queryKeys.seller.all, "transactions"] as const,
    balance: () => [...queryKeys.seller.all, "balance"] as const,
  },

  // ===== WORKER =====
  worker: {
    all: ["worker"] as const,
    stats: () => [...queryKeys.worker.all, "stats"] as const,
    activeJobs: () => [...queryKeys.worker.all, "activeJobs"] as const,
    jobs: () => [...queryKeys.worker.all, "jobs"] as const,
    accounts: () => [...queryKeys.worker.all, "accounts"] as const,
    teams: () => [...queryKeys.worker.all, "teams"] as const,
    teamJobPreview: (id: string) =>
      [...queryKeys.worker.all, "teamJobPreview", id] as const,
  },

  // ===== HUB =====
  hub: {
    all: ["hub"] as const,
    posts: (type?: string) => [...queryKeys.hub.all, "posts", type] as const,
    stats: () => [...queryKeys.hub.all, "stats"] as const,
    findTeamPosts: () => [...queryKeys.hub.all, "findTeamPosts"] as const,
    recruitPosts: () => [...queryKeys.hub.all, "recruitPosts"] as const,
    outsourceJobs: () => [...queryKeys.hub.all, "outsourceJobs"] as const,
  },

  // ===== TEAM =====
  team: {
    all: ["team"] as const,
    byId: (id: string) => [...queryKeys.team.all, id] as const,
    allTeams: () => [...queryKeys.team.all, "allTeams"] as const,
    publicTeams: () => [...queryKeys.team.all, "publicTeams"] as const,
    members: (teamId: string) =>
      [...queryKeys.team.all, "members", teamId] as const,
    workers: () => [...queryKeys.team.all, "workers"] as const,
  },
} as const;
