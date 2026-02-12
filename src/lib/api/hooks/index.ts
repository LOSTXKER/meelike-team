/**
 * React Query Hooks for API calls
 *
 * Query hooks provide data fetching with caching, automatic refetching,
 * and background updates via React Query.
 *
 * Mutation hooks provide write operations with automatic cache invalidation.
 *
 * Usage:
 * ```tsx
 * // Queries
 * const { data: stats, isLoading } = useSellerStats();
 * const { data: orders } = useSellerOrders();
 *
 * // Mutations
 * const createOrder = useCreateOrder();
 * createOrder.mutate(orderData);
 * ```
 */

// Query key factory
export { queryKeys } from "../query-keys";

// Seller query hooks
export {
  type SellerStats,
  useSeller,
  useSellerStats,
  useSellerOrders,
  useSellerOrder,
  useSellerServices,
  useSellerTeams,
  useSellerTeam,
  useSellerTeamById,
  useSellerTeamMembers,
  useSellerJobs,
  usePendingReviews,
  useTeamJobs,
  useTeamJobById,
  useJobClaimsByTeamJobId,
  useTeamPayouts,
  useWorkerBalances,
  useTransactions,
  useBalance,
} from "./seller";

// Seller mutation hooks
export {
  useCreateOrder,
  useConfirmPayment,
  useCancelOrder,
  useDispatchBotItem,
  useAssignHumanItemToTeam,
  useSplitJobToTeams,
  useReassignJob,
  useCreateTeam,
  useUpdateService,
  useDeleteService,
  useBulkUpdateServices,
  useApproveJobClaim,
  useRejectJobClaim,
  useUpdateTeamJob,
  useDeleteTeamJob,
  useCancelTeamJob,
  useCreateStandaloneJob,
  useProcessTeamPayout,
  useProcessAllPendingPayouts,
  useCreateTopup,
  useRemoveTeamMember,
  useUpdateTeamMemberRole,
} from "./seller";

// Worker query hooks
export {
  useWorkerStats,
  useWorkerActiveJobs,
  useWorkerJobs,
  useWorkerAccounts,
  useWorkerTeams,
  useTeamJobPreview,
  useWorkerTransactions,
} from "./worker";

// Worker mutation hooks
export {
  useClaimTeamJob,
  useSubmitJobClaim,
  useUpdateWorkerProfile,
  useCreateWorkerAccount,
  useUpdateWorkerAccount,
  useDeleteWorkerAccount,
  useVerifyBankAccount,
  useWithdraw,
  useLeaveTeam,
} from "./worker";

// Hub query hooks
export {
  useHubPosts,
  useHubStats,
  useFindTeamPosts,
  useOutsourceJobs,
  useRecruitPosts,
} from "./hub";

// Hub mutation hooks
export {
  useCreatePost,
  useApplyToTeam,
  usePostOutsourceFromOrder,
  usePostOutsourceDirect,
  useAcceptBid,
  useRejectBid,
  useCancelOutsourceJob,
} from "./hub";

// Team query hooks
export {
  useTeam,
  useAllTeams,
  usePublicTeams,
  useTeamMembers,
  useWorkers,
  useTeamByInviteCode,
  useJoinTeamByInviteCode,
} from "./team";

// Combined hooks
export {
  type MemberWithWorker,
  useTeamMembersWithWorkers,
  useJobClaims,
  usePendingJobClaims,
} from "./combined";
