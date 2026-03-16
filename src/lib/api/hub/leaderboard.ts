import { apiClient } from "../client";

export type LeaderboardType = "workers" | "sellers" | "teams";
export type LeaderboardPeriod = "week" | "month" | "all";

export interface LeaderboardWorkerEntry {
  rank: number;
  id: string;
  name: string;
  avatar: string | null;
  level: string;
  score: number;
  rating: number;
  completionRate: number;
  totalJobs: number;
}

export interface LeaderboardSellerEntry {
  rank: number;
  id: string;
  name: string;
  avatar: string | null;
  plan: string;
  score: number;
  teamCount: number;
  slug: string;
}

export interface LeaderboardTeamEntry {
  rank: number;
  id: string;
  name: string;
  score: number;
  memberCount: number;
  rating: number;
  ratingCount: number;
  totalJobsCompleted: number;
}

export type LeaderboardEntry =
  | LeaderboardWorkerEntry
  | LeaderboardSellerEntry
  | LeaderboardTeamEntry;

export interface LeaderboardResponse {
  type: LeaderboardType;
  period: LeaderboardPeriod;
  entries: LeaderboardEntry[];
}

export async function getLeaderboard(
  type: LeaderboardType = "workers",
  period: LeaderboardPeriod = "week"
): Promise<LeaderboardResponse> {
  const res = await apiClient.get<LeaderboardResponse>(
    `/hub/leaderboard?type=${type}&period=${period}`
  );
  return res.data as LeaderboardResponse;
}
