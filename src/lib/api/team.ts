/**
 * Team API Module
 * 
 * Handles team-related operations for public access including:
 * - Team lookup
 * - Public team listings
 * - Team members
 * - Worker lookup
 */

import { getCurrentWorkerId } from "@/lib/storage";
import { generateId } from "@/lib/utils/helpers";

import {
  delay,
  getTeamsFromStorage,
  saveTeamsToStorage,
  getTeamMembersFromStorage,
  saveTeamMembersToStorage,
  getTeamApplicationsFromStorage,
  saveTeamApplicationsToStorage,
  getWorkersFromStorage,
} from "./storage-helpers";

import type { TeamApplication } from "./storage-helpers";

import type {
  Team,
  TeamMember,
  Worker,
} from "@/types";

// ===== JOIN RESULT TYPE =====
export interface JoinTeamResult {
  success: boolean;
  type: "joined" | "pending" | "already_member" | "already_applied";
  team: Team;
}

// ===== TEAM API =====
export const teamApi = {
  async getTeamById(id: string): Promise<Team | null> {
    await delay();
    const teams = getTeamsFromStorage();
    return teams.find((team) => team.id === id) || null;
  },

  async getAllTeams(): Promise<Team[]> {
    await delay();
    return getTeamsFromStorage();
  },

  async getPublicTeams(): Promise<Team[]> {
    await delay();
    const teams = getTeamsFromStorage();
    return teams.filter((team) => team.isPublic && team.isRecruiting);
  },

  async getMembers(teamId: string): Promise<TeamMember[]> {
    await delay();
    const members = getTeamMembersFromStorage();
    return members.filter((m) => m.teamId === teamId);
  },

  async getWorkers(): Promise<Worker[]> {
    await delay();
    return getWorkersFromStorage();
  },

  async getTeamByInviteCode(code: string): Promise<Team | null> {
    await delay();
    const teams = getTeamsFromStorage();
    return teams.find((team) => team.inviteCode === code) || null;
  },

  async joinTeamByInviteCode(code: string): Promise<JoinTeamResult> {
    await delay();
    const workerId = getCurrentWorkerId();
    if (!workerId) throw new Error("Worker not authenticated");

    const teams = getTeamsFromStorage();
    const team = teams.find((t) => t.inviteCode === code);
    if (!team) throw new Error("ไม่พบทีมจากรหัสเชิญนี้");

    // Check if already a member
    const members = getTeamMembersFromStorage();
    const existingMember = members.find(
      (m) => m.teamId === team.id && m.workerId === workerId && m.status === "active"
    );
    if (existingMember) {
      return { success: true, type: "already_member", team };
    }

    // Check if already applied (pending)
    const applications = getTeamApplicationsFromStorage();
    const existingApp = applications.find(
      (a) => a.teamId === team.id && a.workerId === workerId && a.status === "pending"
    );
    if (existingApp) {
      return { success: true, type: "already_applied", team };
    }

    if (team.requireApproval) {
      // Create a join request (pending approval)
      const now = new Date().toISOString();
      const newApplication: TeamApplication = {
        id: `app-${generateId()}`,
        teamId: team.id,
        workerId,
        message: `เข้าร่วมผ่านลิงก์เชิญ (${code})`,
        status: "pending",
        createdAt: now,
      };
      applications.push(newApplication);
      saveTeamApplicationsToStorage(applications);

      return { success: true, type: "pending", team };
    } else {
      // Join directly
      const now = new Date().toISOString();
      const newMember: TeamMember = {
        id: `member-${generateId()}`,
        teamId: team.id,
        workerId,
        status: "active",
        role: "worker",
        jobsCompleted: 0,
        totalEarned: 0,
        rating: 0,
        ratingCount: 0,
        joinedAt: now,
        lastActiveAt: now,
        invitedBy: "invite-link",
      };
      members.push(newMember);
      saveTeamMembersToStorage(members);

      // Update team member count
      const teamIndex = teams.findIndex((t) => t.id === team.id);
      if (teamIndex !== -1) {
        teams[teamIndex].memberCount += 1;
        saveTeamsToStorage(teams);
      }

      return { success: true, type: "joined", team };
    }
  },
};
