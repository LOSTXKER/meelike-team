import { apiClient } from "../client";
import type { StoreService } from "@/types";

export async function getServices() {
  const res = await apiClient.get<{ services: StoreService[] }>("/seller/services");
  return (res.data?.services ?? []) as StoreService[];
}

export async function createServices(payload: unknown) {
  const items = Array.isArray(payload) ? payload : [payload];
  const results: StoreService[] = [];
  for (const item of items) {
    const res = await apiClient.post<{ service: StoreService }>("/seller/services", item);
    if (res.data?.service) results.push(res.data.service);
  }
  return results.length === 1 ? results[0] : results;
}

export async function updateService(id: string, patch: unknown) {
  const res = await apiClient.patch<{ service: StoreService }>(
    `/seller/services/${id}`,
    patch
  );
  return (res.data?.service ?? null) as StoreService | null;
}

export async function deleteService(id: string) {
  await apiClient.delete(`/seller/services/${id}`);
}

export async function bulkUpdateServices(ids: string[], data: unknown) {
  await Promise.all(ids.map((id) => apiClient.patch(`/seller/services/${id}`, data)));
}
