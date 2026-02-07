/**
 * Worker Query & Mutation Hooks
 */

"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "../index";
import { queryKeys } from "../query-keys";

// =====================
// QUERIES
// =====================

export function useWorkerStats() {
  return useQuery({
    queryKey: queryKeys.worker.stats(),
    queryFn: () => api.worker.getStats(),
  });
}

export function useWorkerActiveJobs() {
  return useQuery({
    queryKey: queryKeys.worker.activeJobs(),
    queryFn: () => api.worker.getActiveJobs(),
  });
}

export function useWorkerJobs() {
  return useQuery({
    queryKey: queryKeys.worker.jobs(),
    queryFn: () => api.worker.getJobs(),
  });
}

export function useWorkerAccounts() {
  return useQuery({
    queryKey: queryKeys.worker.accounts(),
    queryFn: () => api.worker.getAccounts(),
  });
}

export function useWorkerTeams() {
  return useQuery({
    queryKey: queryKeys.worker.teams(),
    queryFn: () => api.worker.getTeams(),
  });
}

export function useTeamJobPreview(teamJobId: string) {
  return useQuery({
    queryKey: queryKeys.worker.teamJobPreview(teamJobId),
    queryFn: () => api.worker.getTeamJobPreview(teamJobId),
    enabled: !!teamJobId,
  });
}

// =====================
// MUTATIONS
// =====================

export function useClaimTeamJob() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ jobId, quantity }: { jobId: string; quantity: number }) =>
      api.worker.claimTeamJob(jobId, quantity),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: queryKeys.worker.activeJobs() });
      qc.invalidateQueries({ queryKey: queryKeys.worker.jobs() });
      qc.invalidateQueries({ queryKey: queryKeys.worker.stats() });
      qc.invalidateQueries({ queryKey: queryKeys.seller.teamJobs() });
      qc.invalidateQueries({ queryKey: queryKeys.seller.jobClaims() });
    },
  });
}

export function useSubmitJobClaim() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({
      jobId,
      data,
    }: {
      jobId: string;
      data: Parameters<typeof api.worker.submitJobClaim>[1];
    }) => api.worker.submitJobClaim(jobId, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: queryKeys.worker.activeJobs() });
      qc.invalidateQueries({ queryKey: queryKeys.worker.jobs() });
      qc.invalidateQueries({ queryKey: queryKeys.seller.pendingReviews() });
      qc.invalidateQueries({ queryKey: queryKeys.seller.jobClaims() });
    },
  });
}
