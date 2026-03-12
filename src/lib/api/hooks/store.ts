"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "../client";

const keys = {
  store: () => ["seller", "store"] as const,
  reviews: () => ["seller", "store", "reviews"] as const,
};

export function useSellerStore() {
  return useQuery({
    queryKey: keys.store(),
    queryFn: () => apiClient.get("/seller/store"),
  });
}

export function useStoreReviews() {
  return useQuery({
    queryKey: keys.reviews(),
    queryFn: () => apiClient.get("/seller/store/reviews"),
  });
}

export function useUpdateStore() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: Record<string, unknown>) =>
      apiClient.patch("/seller/store", data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: keys.store() });
    },
  });
}
