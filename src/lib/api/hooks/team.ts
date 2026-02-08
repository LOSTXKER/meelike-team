/**
 * Team Query Hooks
 */

"use client";

import { useQuery, useMutation } from "@tanstack/react-query";
import { api } from "../index";
import { queryKeys } from "../query-keys";
import type { JoinTeamResult } from "../team";

export function useTeam(id: string) {
  return useQuery({
    queryKey: queryKeys.team.byId(id),
    queryFn: () => api.team.getTeamById(id),
    enabled: !!id,
  });
}

export function useAllTeams() {
  return useQuery({
    queryKey: queryKeys.team.allTeams(),
    queryFn: () => api.team.getAllTeams(),
  });
}

export function usePublicTeams() {
  return useQuery({
    queryKey: queryKeys.team.publicTeams(),
    queryFn: () => api.team.getPublicTeams(),
  });
}

export function useTeamMembers(teamId: string) {
  return useQuery({
    queryKey: queryKeys.team.members(teamId),
    queryFn: () => api.team.getMembers(teamId),
    enabled: !!teamId,
  });
}

export function useWorkers() {
  return useQuery({
    queryKey: queryKeys.team.workers(),
    queryFn: () => api.team.getWorkers(),
  });
}

export function useTeamByInviteCode(code: string) {
  return useQuery({
    queryKey: queryKeys.team.byInviteCode(code),
    queryFn: () => api.team.getTeamByInviteCode(code),
    enabled: !!code,
  });
}

export function useJoinTeamByInviteCode() {
  return useMutation<JoinTeamResult, Error, string>({
    mutationFn: (code: string) => api.team.joinTeamByInviteCode(code),
  });
}
