import { apiClient } from "../client";
import type { Team, TeamMember } from "@/types";

export async function getTeams() {
  const res = await apiClient.get<{ teams: Team[] }>("/seller/teams");
  return (res.data?.teams ?? []) as Team[];
}

export async function getTeam(id?: string) {
  if (id) {
    const res = await apiClient.get<{ team: Team }>(`/seller/teams/${id}`);
    return (res.data?.team ?? null) as Team | null;
  }
  const teams = await getTeams();
  return teams.length > 0 ? teams[0] : null;
}

export async function getTeamMembers(teamId?: string) {
  if (!teamId) {
    const teams = await getTeams();
    if (teams.length === 0) return [] as TeamMember[];
    teamId = teams[0].id;
  }
  const res = await apiClient.get<{ team: { members: TeamMember[] } }>(
    `/seller/teams/${teamId}`
  );
  return (res.data?.team?.members ?? []) as TeamMember[];
}

export async function createTeam(payload: {
  name: string;
  description?: string;
  requireApproval?: boolean;
  isPublic?: boolean;
  isRecruiting?: boolean;
}) {
  const res = await apiClient.post<{ team: Team }>("/seller/teams", payload);
  return (res.data?.team ?? null) as Team | null;
}

export async function updateTeam(id: string, patch: unknown) {
  const res = await apiClient.patch<{ team: Team }>(`/seller/teams/${id}`, patch);
  return (res.data?.team ?? null) as Team | null;
}

export async function deleteTeam(id: string) {
  await apiClient.delete(`/seller/teams/${id}`);
}

export async function removeTeamMember(teamId: string, memberId: string) {
  await apiClient.delete(`/seller/teams/${teamId}/members/${memberId}`);
}

export async function updateTeamMemberRole(
  teamId: string,
  memberId: string,
  role: string
) {
  const res = await apiClient.patch(`/seller/teams/${teamId}/members/${memberId}`, { role });
  return res.data;
}
