import { apiClient } from "./client";
import type { Team, TeamMember, Worker } from "@/types";

export interface JoinTeamResult {
  success: boolean;
  status: "joined" | "pending";
  type?: "joined" | "pending";
  message?: string;
  team?: import("@/types").Team;
}

export const teamApi = {
  async getTeamById(id: string) {
    const res = await apiClient.get<{ team: Team }>(`/seller/teams/${id}`);
    return (res.data?.team ?? null) as Team | null;
  },

  async getAllTeams() {
    const res = await apiClient.get<{ teams: Team[] }>("/seller/teams");
    return (res.data?.teams ?? []) as Team[];
  },

  async getPublicTeams() {
    const res = await apiClient.get<{ teams: Team[] }>("/seller/teams");
    return (res.data?.teams ?? []) as Team[];
  },

  async getMembers(teamId: string) {
    const res = await apiClient.get<{ team: { members: TeamMember[] } }>(
      `/seller/teams/${teamId}`
    );
    return (res.data?.team?.members ?? []) as TeamMember[];
  },

  async getWorkers() {
    return [] as Worker[];
  },

  async getTeamByInviteCode(_inviteCode: string): Promise<Team | null> {
    return null;
  },

  async joinTeamByInviteCode(
    _inviteCode: string,
    _message?: string
  ): Promise<JoinTeamResult> {
    return { success: false, status: "pending", message: "Not implemented" };
  },
};
