/**
 * Combined/Composite Hooks
 *
 * Hooks that combine data from multiple API domains.
 */

"use client";

import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { api } from "../index";
import { queryKeys } from "../query-keys";
import { useSellerTeamMembers } from "./seller";
import { useWorkers } from "./team";
import type { TeamMember, Worker } from "@/types";

/** Type for member with worker data joined */
export type MemberWithWorker = TeamMember & { worker: Worker };

/**
 * Hook that returns team members with worker data already joined.
 * This eliminates the need to manually join members with workers in components.
 *
 * @param teamId - Optional team ID to filter members
 * @returns Members with worker data, loading state, and error
 */
export function useTeamMembersWithWorkers(teamId?: string) {
  const {
    data: rawMembers,
    isLoading: isLoadingMembers,
    error: membersError,
    refetch: refetchMembers,
  } = useSellerTeamMembers(teamId);
  const {
    data: workers,
    isLoading: isLoadingWorkers,
    error: workersError,
  } = useWorkers();

  const isLoading = isLoadingMembers || isLoadingWorkers;
  const error = membersError || workersError;

  const data = useMemo((): MemberWithWorker[] | null => {
    if (!rawMembers || !workers) return null;

    return rawMembers
      .map((member) => {
        const worker = workers.find((w) => w.id === member.workerId);
        if (!worker) return null;
        return { ...member, worker };
      })
      .filter((m): m is MemberWithWorker => m !== null);
  }, [rawMembers, workers]);

  return { data, isLoading, error, refetch: refetchMembers };
}

// ===== JOB CLAIMS HOOKS =====

export function useJobClaims() {
  return useQuery({
    queryKey: queryKeys.seller.jobClaims(),
    queryFn: () => api.seller.getJobClaims(),
  });
}

export function usePendingJobClaims() {
  return useQuery({
    queryKey: queryKeys.seller.pendingJobClaims(),
    queryFn: () => api.seller.getPendingJobClaims(),
  });
}
