/**
 * Team Query Hooks
 */

"use client";

import { useQuery } from "@tanstack/react-query";
import { api } from "../index";
import { queryKeys } from "../query-keys";

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
