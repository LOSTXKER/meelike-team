/**
 * Hub Query & Mutation Hooks
 */

"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "../index";
import { queryKeys } from "../query-keys";

// =====================
// QUERIES
// =====================

export function useHubPosts(
  type?: "all" | "recruit" | "find-team" | "outsource"
) {
  return useQuery({
    queryKey: queryKeys.hub.posts(type),
    queryFn: () => api.hub.getPosts(type),
  });
}

export function useHubStats() {
  return useQuery({
    queryKey: queryKeys.hub.stats(),
    queryFn: () => api.hub.getStats(),
  });
}

export function useFindTeamPosts() {
  return useQuery({
    queryKey: queryKeys.hub.findTeamPosts(),
    queryFn: () => api.hub.getFindTeamPosts(),
  });
}

export function useOutsourceJobs() {
  return useQuery({
    queryKey: queryKeys.hub.outsourceJobs(),
    queryFn: () => api.hub.getOutsourceJobs(),
  });
}

export function useRecruitPosts() {
  return useQuery({
    queryKey: queryKeys.hub.recruitPosts(),
    queryFn: () => api.hub.getRecruitPosts(),
  });
}

// =====================
// MUTATIONS
// =====================

export function useCreatePost() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: Parameters<typeof api.hub.createPost>[0]) =>
      api.hub.createPost(data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: queryKeys.hub.all });
    },
  });
}

export function useApplyToTeam() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({
      teamId,
      sellerId,
      message,
    }: {
      teamId: string;
      sellerId?: string;
      message?: string;
    }) => api.hub.applyToTeam(teamId, sellerId, message),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: queryKeys.hub.all });
    },
  });
}

export function usePostOutsourceFromOrder() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: Parameters<typeof api.hub.postOutsourceFromOrder>[0]) =>
      api.hub.postOutsourceFromOrder(data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: queryKeys.hub.outsourceJobs() });
      qc.invalidateQueries({ queryKey: queryKeys.hub.stats() });
      qc.invalidateQueries({ queryKey: queryKeys.seller.orders() });
    },
  });
}

export function usePostOutsourceDirect() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: Parameters<typeof api.hub.postOutsourceDirect>[0]) =>
      api.hub.postOutsourceDirect(data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: queryKeys.hub.outsourceJobs() });
      qc.invalidateQueries({ queryKey: queryKeys.hub.stats() });
    },
  });
}

export function useAcceptBid() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (bidId: string) => api.hub.acceptBid(bidId),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: queryKeys.hub.outsourceJobs() });
    },
  });
}

export function useRejectBid() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (bidId: string) => api.hub.rejectBid(bidId),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: queryKeys.hub.outsourceJobs() });
    },
  });
}

export function useCancelOutsourceJob() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (jobId: string) => api.hub.cancelOutsourceJob(jobId),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: queryKeys.hub.outsourceJobs() });
      qc.invalidateQueries({ queryKey: queryKeys.hub.stats() });
    },
  });
}
