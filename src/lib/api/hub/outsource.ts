import { apiClient } from "../client";
import type { OutsourceJob } from "@/types";

export async function getOutsourceJobs(filters?: {
  platform?: string;
  status?: string;
  page?: number;
}) {
  const params = new URLSearchParams();
  if (filters?.platform) params.set("platform", filters.platform);
  if (filters?.status) params.set("status", filters.status ?? "open");
  if (filters?.page) params.set("page", String(filters.page));
  const res = await apiClient.get<{ jobs: OutsourceJob[] }>(`/hub/outsource?${params}`);
  return (res.data?.jobs ?? []) as OutsourceJob[];
}

export async function getOutsourceJobById(_id: string): Promise<OutsourceJob | null> {
  return null;
}

export async function getOutsourceJobsList(filters?: {
  sellerId?: string;
  platform?: string;
  status?: string;
}) {
  return getOutsourceJobs(filters);
}

export async function getOutsourceBids(_jobId: string) {
  return [];
}

export async function postOutsourceFromOrder(data: {
  orderId?: string;
  orderItemId?: string;
  [key: string]: unknown;
}) {
  const res = await apiClient.post<{ job: OutsourceJob }>("/hub/outsource", data);
  return res.data?.job ?? null;
}

export async function createBid(_jobId: string, _data: unknown) {
  return null;
}

export async function acceptBid(_bidId: string) {
  return null;
}

export async function rejectBid(_bidId: string) {
  return null;
}

export async function postOutsourceDirect(data: unknown) {
  const res = await apiClient.post<{ job: OutsourceJob }>("/hub/outsource", data);
  return res.data?.job ?? null;
}

export async function cancelOutsourceJob(_jobId: string) {
  return null;
}
