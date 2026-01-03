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

// ===== API CALL STATE =====

export interface ApiCallState<T, E = Error> {
  data: T | null;
  isLoading: boolean;
  isError: boolean;
  error: E | null;
}

export interface ApiCallOptions<T, E = Error> {
  deps?: unknown[];
  enabled?: boolean;
  onSuccess?: (data: T) => void;
  onError?: (error: E) => void;
  initialData?: T;
}

export interface ApiCallResult<T, E = Error> extends ApiCallState<T, E> {
  refetch: () => Promise<void>;
  reset: () => void;
}

// ===== GENERIC API HOOK =====

/**
 * Generic hook for data fetching with improved type inference
 * @template T - The type of data returned
 * @template E - The type of error (defaults to Error)
 */
function useApiCall<T, E = Error>(
  fetcher: () => Promise<T>,
  options: ApiCallOptions<T, E> = {}
): ApiCallResult<T, E> {
  const { deps = [], enabled = true, onSuccess, onError, initialData } = options;
  
  const [data, setData] = useState<T | null>(initialData ?? null);
  const [isLoading, setIsLoading] = useState(enabled);
  const [isError, setIsError] = useState(false);
  const [error, setError] = useState<E | null>(null);

  const refetch = useCallback(async () => {
    if (!enabled) return;
    
    setIsLoading(true);
    setIsError(false);
    setError(null);
    
    try {
      const result = await fetcher();
      setData(result);
      onSuccess?.(result);
    } catch (err) {
      const errorObj = (err instanceof Error ? err : new Error("Unknown error")) as E;
      setError(errorObj);
      setIsError(true);
      onError?.(errorObj);
    } finally {
      setIsLoading(false);
    }
  }, [enabled, ...deps]);

  const reset = useCallback(() => {
    setData(initialData ?? null);
    setIsLoading(enabled);
    setIsError(false);
    setError(null);
  }, [enabled, initialData]);

  useEffect(() => {
    if (enabled) {
      refetch();
    }
  }, [refetch, enabled]);

  return { data, isLoading, isError, error, refetch, reset };
}

// ===== SELLER HOOKS =====

export function useSellerStats(options?: Omit<ApiCallOptions<any>, 'deps'>) {
  return useApiCall(() => api.seller.getStats(), { ...options, deps: [] });
}

export function useSellerOrders(options?: Omit<ApiCallOptions<any>, 'deps'>) {
  return useApiCall(() => api.seller.getOrders(), { ...options, deps: [] });
}

export function useSellerOrder(id: string, options?: Omit<ApiCallOptions<any>, 'deps'>) {
  return useApiCall(
    () => api.seller.getOrderById(id), 
    { ...options, deps: [id], enabled: options?.enabled !== false && !!id }
  );
}

export function useSellerServices(options?: Omit<ApiCallOptions<any>, 'deps'>) {
  return useApiCall(() => api.seller.getServices(), { ...options, deps: [] });
}

// Seller มีได้หลายทีม
export function useSellerTeams() {
  return useApiCall(() => api.seller.getTeams(), { deps: [] });
}

// Legacy: เข้ากันได้กับ code เดิม (return ทีมแรก)
export function useSellerTeam() {
  return useApiCall(() => api.seller.getTeam(), { deps: [] });
}

export function useSellerTeamById(id: string) {
  return useApiCall(() => api.seller.getTeamById(id), { deps: [id] });
}

export function useSellerTeamMembers(teamId?: string) {
  return useApiCall(() => api.seller.getTeamMembers(teamId), { deps: [teamId] });
}

export function useSellerJobs() {
  return useApiCall(() => api.seller.getJobs(), { deps: [] });
}

export function usePendingReviews() {
  return useApiCall(() => api.seller.getPendingReviews(), { deps: [] });
}

export function useTeamJobs() {
  return useApiCall(() => api.seller.getTeamJobs(), { deps: [] });
}

export function useTeamPayouts() {
  return useApiCall(() => api.seller.getTeamPayouts(), { deps: [] });
}

export function useWorkerBalances() {
  return useApiCall(() => api.seller.getWorkerBalances(), { deps: [] });
}

export function useSeller() {
  return useApiCall(() => api.seller.getSeller(), { deps: [] });
}

export function useTransactions() {
  return useApiCall(() => api.seller.getTransactions(), { deps: [] });
}

export function useBalance() {
  return useApiCall(() => api.seller.getBalance(), { deps: [] });
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
  return useApiCall(() => api.worker.getStats(), { deps: [] });
}

export function useWorkerActiveJobs() {
  return useApiCall(() => api.worker.getActiveJobs(), { deps: [] });
}

export function useWorkerJobs() {
  return useApiCall(() => api.worker.getJobs(), { deps: [] });
}

export function useWorkerAccounts() {
  return useApiCall(() => api.worker.getAccounts(), { deps: [] });
}

export function useWorkerTeams() {
  return useApiCall(() => api.worker.getTeams(), { deps: [] });
}

// ===== HUB HOOKS =====
export function useHubPosts(type?: "all" | "recruit" | "find-team" | "outsource") {
  return useApiCall(() => api.hub.getPosts(type), { deps: [type] });
}

export function useHubStats() {
  return useApiCall(() => api.hub.getStats(), { deps: [] });
}

export function useFindTeamPosts() {
  return useApiCall(() => api.hub.getFindTeamPosts(), { deps: [] });
}

export function useOutsourceJobs() {
  return useApiCall(() => api.hub.getOutsourceJobs(), { deps: [] });
}

export function useRecruitPosts() {
  return useApiCall(() => api.hub.getRecruitPosts(), { deps: [] });
}

// ===== TEAM HOOKS =====
export function useTeam(id: string) {
  return useApiCall(() => api.team.getTeamById(id), { deps: [id] });
}

export function useAllTeams() {
  return useApiCall(() => api.team.getAllTeams(), { deps: [] });
}

export function usePublicTeams() {
  return useApiCall(() => api.team.getPublicTeams(), { deps: [] });
}

export function useTeamMembers(teamId: string) {
  return useApiCall(() => api.team.getMembers(teamId), { deps: [teamId] });
}

export function useWorkers() {
  return useApiCall(() => api.team.getWorkers(), { deps: [] });
}

// ===== JOB CLAIMS HOOKS =====
export function useJobClaims() {
  return useApiCall(() => api.seller.getJobClaims(), { deps: [] });
}

export function usePendingJobClaims() {
  return useApiCall(() => api.seller.getPendingJobClaims(), { deps: [] });
}
