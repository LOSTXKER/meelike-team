/**
 * Seller Query & Mutation Hooks
 */

"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "../index";
import { queryKeys } from "../query-keys";
import type { Order, StoreService } from "@/types";

// Type for seller stats
export interface SellerStats {
  todayRevenue: number;
  monthRevenue: number;
  todayOrders: number;
  monthOrders: number;
  activeTeamMembers: number;
  pendingReviews: number;
  pendingPayouts: number;
}

// =====================
// QUERIES
// =====================

export function useSeller() {
  return useQuery({
    queryKey: queryKeys.seller.profile(),
    queryFn: () => api.seller.getSeller(),
  });
}

export function useSellerStats() {
  return useQuery({
    queryKey: queryKeys.seller.stats(),
    queryFn: () => api.seller.getStats(),
  });
}

export function useSellerOrders() {
  return useQuery({
    queryKey: queryKeys.seller.orders(),
    queryFn: () => api.seller.getOrders(),
  });
}

export function useSellerOrder(id: string, options?: { enabled?: boolean }) {
  return useQuery({
    queryKey: queryKeys.seller.order(id),
    queryFn: () => api.seller.getOrderById(id),
    enabled: (options?.enabled !== false) && !!id,
  });
}

export function useSellerServices() {
  return useQuery({
    queryKey: queryKeys.seller.services(),
    queryFn: () => api.seller.getServices(),
  });
}

export function useSellerTeams() {
  return useQuery({
    queryKey: queryKeys.seller.teams(),
    queryFn: () => api.seller.getTeams(),
  });
}

/** Legacy: backward compatible -- returns first team */
export function useSellerTeam() {
  return useQuery({
    queryKey: [...queryKeys.seller.teams(), "first"],
    queryFn: () => api.seller.getTeam(),
  });
}

export function useSellerTeamById(id: string) {
  return useQuery({
    queryKey: queryKeys.team.byId(id),
    queryFn: () => api.team.getTeamById(id),
    enabled: !!id,
  });
}

export function useSellerTeamMembers(teamId?: string) {
  return useQuery({
    queryKey: queryKeys.seller.teamMembers(teamId),
    queryFn: () => api.seller.getTeamMembers(teamId),
  });
}

export function useSellerJobs() {
  return useQuery({
    queryKey: queryKeys.seller.jobs(),
    queryFn: () => api.seller.getJobs(),
  });
}

export function usePendingReviews() {
  return useQuery({
    queryKey: queryKeys.seller.pendingReviews(),
    queryFn: () => api.seller.getPendingReviews(),
  });
}

export function useTeamJobs() {
  return useQuery({
    queryKey: queryKeys.seller.teamJobs(),
    queryFn: () => api.seller.getTeamJobs(),
  });
}

export function useTeamJobById(teamJobId: string) {
  return useQuery({
    queryKey: queryKeys.seller.teamJob(teamJobId),
    queryFn: () => api.seller.getTeamJobById(teamJobId),
    enabled: !!teamJobId,
  });
}

export function useJobClaimsByTeamJobId(teamJobId: string) {
  return useQuery({
    queryKey: queryKeys.seller.jobClaimsByJob(teamJobId),
    queryFn: () => api.seller.getJobClaimsByTeamJobId(teamJobId),
    enabled: !!teamJobId,
  });
}

export function useTeamPayouts() {
  return useQuery({
    queryKey: queryKeys.seller.payouts(),
    queryFn: () => api.seller.getTeamPayouts(),
  });
}

export function useWorkerBalances() {
  return useQuery({
    queryKey: queryKeys.seller.workerBalances(),
    queryFn: () => api.seller.getWorkerBalances(),
  });
}

export function useTransactions() {
  return useQuery({
    queryKey: queryKeys.seller.transactions(),
    queryFn: () => api.seller.getTransactions(),
  });
}

export function useBalance() {
  return useQuery({
    queryKey: queryKeys.seller.balance(),
    queryFn: () => api.seller.getBalance(),
  });
}

// =====================
// MUTATIONS
// =====================

export function useCreateOrder() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: Parameters<typeof api.seller.createOrder>[0]) =>
      api.seller.createOrder(data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: queryKeys.seller.orders() });
      qc.invalidateQueries({ queryKey: queryKeys.seller.stats() });
      qc.invalidateQueries({ queryKey: queryKeys.seller.balance() });
    },
  });
}

export function useConfirmPayment() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (orderId: string) => api.seller.confirmPayment(orderId),
    onSuccess: (_data, orderId) => {
      qc.invalidateQueries({ queryKey: queryKeys.seller.order(orderId) });
      qc.invalidateQueries({ queryKey: queryKeys.seller.orders() });
      qc.invalidateQueries({ queryKey: queryKeys.seller.stats() });
    },
  });
}

export function useCancelOrder() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ orderId, reason }: { orderId: string; reason: string }) =>
      api.seller.cancelOrder(orderId, reason),
    onSuccess: (_data, { orderId }) => {
      qc.invalidateQueries({ queryKey: queryKeys.seller.order(orderId) });
      qc.invalidateQueries({ queryKey: queryKeys.seller.orders() });
      qc.invalidateQueries({ queryKey: queryKeys.seller.stats() });
    },
  });
}

export function useDispatchBotItem() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ orderId, itemId }: { orderId: string; itemId: string }) =>
      api.seller.dispatchBotItem(orderId, itemId),
    onSuccess: (_data, { orderId }) => {
      qc.invalidateQueries({ queryKey: queryKeys.seller.order(orderId) });
      qc.invalidateQueries({ queryKey: queryKeys.seller.orders() });
    },
  });
}

export function useAssignHumanItemToTeam() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (args: {
      orderId: string;
      itemId: string;
      teamId: string;
      quantity: number;
      payRate: number;
      requirements?: string;
    }) =>
      api.seller.assignHumanItemToTeam(
        args.orderId,
        args.itemId,
        args.teamId,
        args.quantity,
        args.payRate,
        args.requirements
      ),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: queryKeys.seller.orders() });
      qc.invalidateQueries({ queryKey: queryKeys.seller.jobs() });
      qc.invalidateQueries({ queryKey: queryKeys.seller.teamJobs() });
    },
  });
}

export function useSplitJobToTeams() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (args: Parameters<typeof api.seller.splitJobToTeams>) =>
      api.seller.splitJobToTeams(...args),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: queryKeys.seller.orders() });
      qc.invalidateQueries({ queryKey: queryKeys.seller.jobs() });
      qc.invalidateQueries({ queryKey: queryKeys.seller.teamJobs() });
    },
  });
}

export function useReassignJob() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({
      jobId,
      options,
    }: {
      jobId: string;
      options: Parameters<typeof api.seller.reassignJob>[1];
    }) => api.seller.reassignJob(jobId, options),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: queryKeys.seller.jobs() });
      qc.invalidateQueries({ queryKey: queryKeys.seller.teamJobs() });
    },
  });
}

export function useCreateTeam() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: Parameters<typeof api.seller.createTeam>[0]) =>
      api.seller.createTeam(data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: queryKeys.seller.teams() });
      qc.invalidateQueries({ queryKey: queryKeys.team.allTeams() });
    },
  });
}

export function useUpdateService() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: string;
      data: Parameters<typeof api.seller.updateService>[1];
    }) => api.seller.updateService(id, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: queryKeys.seller.services() });
    },
  });
}

export function useDeleteService() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => api.seller.deleteService(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: queryKeys.seller.services() });
    },
  });
}

export function useBulkUpdateServices() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({
      ids,
      data,
    }: {
      ids: string[];
      data: Parameters<typeof api.seller.bulkUpdateServices>[1];
    }) => api.seller.bulkUpdateServices(ids, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: queryKeys.seller.services() });
    },
  });
}

export function useApproveJobClaim() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (claimId: string) => api.seller.approveJobClaim(claimId),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: queryKeys.seller.jobClaims() });
      qc.invalidateQueries({ queryKey: queryKeys.seller.pendingReviews() });
      qc.invalidateQueries({ queryKey: queryKeys.seller.pendingJobClaims() });
      qc.invalidateQueries({ queryKey: queryKeys.seller.teamJobs() });
      qc.invalidateQueries({ queryKey: queryKeys.seller.stats() });
    },
  });
}

export function useRejectJobClaim() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ claimId, reason }: { claimId: string; reason?: string }) =>
      api.seller.rejectJobClaim(claimId, reason),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: queryKeys.seller.jobClaims() });
      qc.invalidateQueries({ queryKey: queryKeys.seller.pendingReviews() });
      qc.invalidateQueries({ queryKey: queryKeys.seller.pendingJobClaims() });
      qc.invalidateQueries({ queryKey: queryKeys.seller.teamJobs() });
    },
  });
}

export function useUpdateTeamJob() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: string;
      data: Parameters<typeof api.seller.updateTeamJob>[1];
    }) => api.seller.updateTeamJob(id, data),
    onSuccess: (_data, { id }) => {
      qc.invalidateQueries({ queryKey: queryKeys.seller.teamJob(id) });
      qc.invalidateQueries({ queryKey: queryKeys.seller.teamJobs() });
    },
  });
}

export function useDeleteTeamJob() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => api.seller.deleteTeamJob(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: queryKeys.seller.teamJobs() });
      qc.invalidateQueries({ queryKey: queryKeys.seller.jobs() });
    },
  });
}

export function useCancelTeamJob() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, reason }: { id: string; reason: string }) =>
      api.seller.cancelTeamJob(id, reason),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: queryKeys.seller.teamJobs() });
      qc.invalidateQueries({ queryKey: queryKeys.seller.jobs() });
    },
  });
}

export function useCreateStandaloneJob() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({
      teamId,
      data,
    }: {
      teamId: string;
      data: Parameters<typeof api.seller.createStandaloneJob>[1];
    }) => api.seller.createStandaloneJob(teamId, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: queryKeys.seller.teamJobs() });
      qc.invalidateQueries({ queryKey: queryKeys.seller.jobs() });
    },
  });
}

export function useProcessTeamPayout() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payoutId: string) => api.seller.processTeamPayout(payoutId),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: queryKeys.seller.payouts() });
      qc.invalidateQueries({ queryKey: queryKeys.seller.transactions() });
      qc.invalidateQueries({ queryKey: queryKeys.seller.balance() });
      qc.invalidateQueries({ queryKey: queryKeys.seller.workerBalances() });
      qc.invalidateQueries({ queryKey: queryKeys.seller.stats() });
    },
  });
}

export function useProcessAllPendingPayouts() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: () => api.seller.processAllPendingPayouts(),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: queryKeys.seller.payouts() });
      qc.invalidateQueries({ queryKey: queryKeys.seller.transactions() });
      qc.invalidateQueries({ queryKey: queryKeys.seller.balance() });
      qc.invalidateQueries({ queryKey: queryKeys.seller.workerBalances() });
      qc.invalidateQueries({ queryKey: queryKeys.seller.stats() });
    },
  });
}

export function useCreateTopup() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: Parameters<typeof api.seller.createTopupTransaction>[0]) =>
      api.seller.createTopupTransaction(data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: queryKeys.seller.transactions() });
      qc.invalidateQueries({ queryKey: queryKeys.seller.balance() });
      qc.invalidateQueries({ queryKey: queryKeys.seller.stats() });
    },
  });
}

export function useRemoveTeamMember() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({
      teamId,
      workerId,
    }: {
      teamId: string;
      workerId: string;
    }) => api.seller.removeTeamMember(teamId, workerId),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: queryKeys.seller.teamMembers() });
      qc.invalidateQueries({ queryKey: queryKeys.seller.teams() });
      qc.invalidateQueries({ queryKey: queryKeys.team.allTeams() });
    },
  });
}

export function useUpdateTeamMemberRole() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({
      teamId,
      workerId,
      role,
    }: {
      teamId: string;
      workerId: string;
      role: Parameters<typeof api.seller.updateTeamMemberRole>[2];
    }) => api.seller.updateTeamMemberRole(teamId, workerId, role),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: queryKeys.seller.teamMembers() });
    },
  });
}
