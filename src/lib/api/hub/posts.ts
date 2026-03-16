import { apiClient } from "../client";
import type { HubPost, FindTeamPost } from "@/types";

export async function getPosts(
  type?: "all" | "recruit" | "find_team" | "outsource"
) {
  const params = new URLSearchParams();
  if (type && type !== "all") params.set("type", type);
  const res = await apiClient.get<{ posts: HubPost[] }>(`/hub/posts?${params}`);
  return (res.data?.posts ?? []) as HubPost[];
}

export async function getStats() {
  return [
    { label: "โพสต์ทั้งหมด", value: 0 },
    { label: "หาลูกทีม", value: 0 },
    { label: "หาทีม", value: 0 },
    { label: "โยนงาน", value: 0 },
  ];
}

export async function getFindTeamPosts() {
  const res = await apiClient.get<{ posts: FindTeamPost[] }>("/hub/posts?type=find_team");
  return (res.data?.posts ?? []) as FindTeamPost[];
}

export async function getRecruitPosts() {
  const res = await apiClient.get<{ posts: HubPost[] }>("/hub/posts?type=recruit");
  return (res.data?.posts ?? []) as HubPost[];
}

export async function createPost(payload: unknown) {
  const res = await apiClient.post<{ post: HubPost }>("/hub/posts", payload);
  return res.data?.post ?? null;
}

export async function applyToTeam(_teamId: string, _sellerId?: string, _message?: string) {
  return null;
}

export async function approveApplication(_applicationId: string) {
  return null;
}
