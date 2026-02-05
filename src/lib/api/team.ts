/**
 * Team API Module
 * 
 * Handles team-related operations for public access including:
 * - Team lookup
 * - Public team listings
 * - Team members
 * - Worker lookup
 */

import {
  delay,
  getTeamsFromStorage,
  getTeamMembersFromStorage,
  getWorkersFromStorage,
} from "./storage-helpers";

import type {
  Team,
  TeamMember,
  Worker,
} from "@/types";

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
};
