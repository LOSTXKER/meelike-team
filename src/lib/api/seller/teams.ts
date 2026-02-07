/**
 * Seller Teams API
 */

import { getCurrentSellerId } from "@/lib/storage";
import { generateId } from "@/lib/utils/helpers";

import {
  delay,
  getTeamsFromStorage,
  saveTeamsToStorage,
  getTeamMembersFromStorage,
  saveTeamMembersToStorage,
  getSellersFromStorage,
} from "../storage-helpers";

import type { Team, TeamMember } from "@/types";
import { meetsKYCRequirement } from "@/types/kyc";
import { validate } from "@/lib/validations/utils";
import { createTeamSchema } from "@/lib/validations/seller";
import { requirePermission } from "@/lib/auth/guard";

// ===== FUNCTIONS =====

// Seller มีได้หลายทีม
export async function getTeams(): Promise<Team[]> {
  await delay();
  const sellerId = getCurrentSellerId() || "seller-1";
  const teams = getTeamsFromStorage();
  return teams.filter((team) => team.sellerId === sellerId);
}

// Legacy: เข้ากันได้กับ code เดิม (return ทีมแรก)
export async function getTeam(): Promise<Team | null> {
  await delay();
  const sellerId = getCurrentSellerId() || "seller-1";
  const teams = getTeamsFromStorage();
  const sellerTeams = teams.filter((team) => team.sellerId === sellerId);
  return sellerTeams[0] || null;
}

// Note: getTeamById was removed - use api.team.getTeamById instead

export async function getTeamMembers(
  teamId?: string
): Promise<TeamMember[]> {
  await delay();
  const members = getTeamMembersFromStorage();
  if (teamId) {
    return members.filter((m) => m.teamId === teamId);
  }
  return members;
}

export async function createTeam(payload: {
  name: string;
  description?: string;
}): Promise<Team> {
  requirePermission("team:create");
  validate(createTeamSchema, payload);
  await delay();

  const sellerId = getCurrentSellerId() || "seller-1";

  // KYC guard: require at least "verified" level (ID card + selfie)
  const sellers = getSellersFromStorage();
  const seller = sellers.find((s) => s.id === sellerId);
  if (!seller?.kyc || !meetsKYCRequirement(seller.kyc.level, "verified")) {
    throw new Error(
      "ต้องยืนยันตัวตน (KYC Verified) ก่อนจึงจะสร้างทีมได้"
    );
  }

  const teams = getTeamsFromStorage();
  const now = new Date().toISOString();

  const newTeam: Team = {
    id: `team-${generateId()}`,
    sellerId,
    name: payload.name,
    description: payload.description,
    inviteCode: `TEAM-${Math.random()
      .toString(36)
      .substring(2, 8)
      .toUpperCase()}`,
    requireApproval: false,
    isPublic: true,
    isRecruiting: true,
    memberCount: 0,
    activeJobCount: 0,
    totalJobsCompleted: 0,
    rating: 0,
    ratingCount: 0,
    status: "active",
    isActive: true,
    createdAt: now,
    updatedAt: now,
  };

  teams.push(newTeam);
  saveTeamsToStorage(teams);

  return newTeam;
}

export async function updateTeam(
  teamId: string,
  patch: Partial<Team>
): Promise<Team | null> {
  await delay();

  const teams = getTeamsFromStorage();
  const teamIndex = teams.findIndex((t) => t.id === teamId);

  if (teamIndex === -1) return null;

  const now = new Date().toISOString();
  teams[teamIndex] = {
    ...teams[teamIndex],
    ...patch,
    updatedAt: now,
  };

  saveTeamsToStorage(teams);
  return teams[teamIndex];
}

export async function deleteTeam(teamId: string): Promise<boolean> {
  await delay();

  const teams = getTeamsFromStorage();
  const filtered = teams.filter((t) => t.id !== teamId);

  if (filtered.length === teams.length) return false;

  // Also remove team members
  const members = getTeamMembersFromStorage();
  const filteredMembers = members.filter((m) => m.teamId !== teamId);
  saveTeamMembersToStorage(filteredMembers);

  saveTeamsToStorage(filtered);
  return true;
}

export async function removeTeamMember(
  teamId: string,
  workerId: string
): Promise<boolean> {
  await delay();

  const members = getTeamMembersFromStorage();
  const filtered = members.filter(
    (m) => !(m.teamId === teamId && m.workerId === workerId)
  );

  if (filtered.length === members.length) return false;

  // Update team member count
  const teams = getTeamsFromStorage();
  const team = teams.find((t) => t.id === teamId);
  if (team) {
    team.memberCount = Math.max(0, team.memberCount - 1);
    saveTeamsToStorage(teams);
  }

  saveTeamMembersToStorage(filtered);
  return true;
}

export async function updateTeamMemberRole(
  teamId: string,
  workerId: string,
  role: string
): Promise<TeamMember | null> {
  await delay();

  const members = getTeamMembersFromStorage();
  const memberIndex = members.findIndex(
    (m) => m.teamId === teamId && m.workerId === workerId
  );

  if (memberIndex === -1) return null;

  members[memberIndex] = {
    ...members[memberIndex],
    role: role as TeamMember["role"],
  };

  saveTeamMembersToStorage(members);
  return members[memberIndex];
}
