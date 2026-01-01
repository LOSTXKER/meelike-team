/**
 * React Hooks for API calls
 * 
 * These hooks provide easy-to-use data fetching with loading states.
 * Can be easily replaced with React Query/SWR in the future.
 * 
 * Usage:
 * ```tsx
 * const { data: stats, isLoading } = useSellerStats();
 * const { data: orders, isLoading } = useSellerOrders();
 * ```
 */

"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { api } from "./index";
import type { TeamMember, Worker } from "@/types";

// Generic hook for data fetching
function useApiCall<T>(
  fetcher: () => Promise<T>,
  deps: unknown[] = []
) {
  const [data, setData] = useState<T | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const refetch = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await fetcher();
      setData(result);
    } catch (err) {
      setError(err instanceof Error ? err : new Error("Unknown error"));
    } finally {
      setIsLoading(false);
    }
  }, deps);

  useEffect(() => {
    refetch();
  }, [refetch]);

  return { data, isLoading, error, refetch };
}

// ===== SELLER HOOKS =====
export function useSellerStats() {
  return useApiCall(() => api.seller.getStats(), []);
}

export function useSellerOrders() {
  return useApiCall(() => api.seller.getOrders(), []);
}

export function useSellerOrder(id: string) {
  return useApiCall(() => api.seller.getOrderById(id), [id]);
}

export function useSellerServices() {
  return useApiCall(() => api.seller.getServices(), []);
}

// Seller มีได้หลายทีม
export function useSellerTeams() {
  return useApiCall(() => api.seller.getTeams(), []);
}

// Legacy: เข้ากันได้กับ code เดิม (return ทีมแรก)
export function useSellerTeam() {
  return useApiCall(() => api.seller.getTeam(), []);
}

export function useSellerTeamById(id: string) {
  return useApiCall(() => api.seller.getTeamById(id), [id]);
}

export function useSellerTeamMembers(teamId?: string) {
  return useApiCall(() => api.seller.getTeamMembers(teamId), [teamId]);
}

export function useSellerJobs() {
  return useApiCall(() => api.seller.getJobs(), []);
}

export function usePendingReviews() {
  return useApiCall(() => api.seller.getPendingReviews(), []);
}

export function useTeamJobs() {
  return useApiCall(() => api.seller.getTeamJobs(), []);
}

export function useTeamPayouts() {
  return useApiCall(() => api.seller.getTeamPayouts(), []);
}

export function useWorkerBalances() {
  return useApiCall(() => api.seller.getWorkerBalances(), []);
}

export function useSeller() {
  return useApiCall(() => api.seller.getSeller(), []);
}

// ===== COMBINED HOOKS (Data with joins) =====

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
  const { data: rawMembers, isLoading: isLoadingMembers, error: membersError, refetch: refetchMembers } = useSellerTeamMembers(teamId);
  const { data: workers, isLoading: isLoadingWorkers, error: workersError } = useWorkers();

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

// ===== WORKER HOOKS =====
export function useWorkerStats() {
  return useApiCall(() => api.worker.getStats(), []);
}

export function useWorkerActiveJobs() {
  return useApiCall(() => api.worker.getActiveJobs(), []);
}

export function useWorkerJobs() {
  return useApiCall(() => api.worker.getJobs(), []);
}

export function useWorkerAccounts() {
  return useApiCall(() => api.worker.getAccounts(), []);
}

export function useWorkerTeams() {
  return useApiCall(() => api.worker.getTeams(), []);
}

// ===== HUB HOOKS =====
export function useHubPosts(type?: "all" | "recruit" | "find-team" | "outsource") {
  return useApiCall(() => api.hub.getPosts(type), [type]);
}

export function useHubStats() {
  return useApiCall(() => api.hub.getStats(), []);
}

export function useFindTeamPosts() {
  return useApiCall(() => api.hub.getFindTeamPosts(), []);
}

export function useOutsourceJobs() {
  return useApiCall(() => api.hub.getOutsourceJobs(), []);
}

export function useRecruitPosts() {
  return useApiCall(() => api.hub.getRecruitPosts(), []);
}

// ===== TEAM HOOKS =====
export function useTeam(id: string) {
  return useApiCall(() => api.team.getTeamById(id), [id]);
}

export function useAllTeams() {
  return useApiCall(() => api.team.getAllTeams(), []);
}

export function usePublicTeams() {
  return useApiCall(() => api.team.getPublicTeams(), []);
}

export function useTeamMembers(teamId: string) {
  return useApiCall(() => api.team.getMembers(teamId), [teamId]);
}

export function useWorkers() {
  return useApiCall(() => api.team.getWorkers(), []);
}
