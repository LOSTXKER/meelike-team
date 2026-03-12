"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "../client";
import type { SubscriptionPlan } from "@/lib/constants/plans";

const keys = {
  subscription: () => ["seller", "subscription"] as const,
  usage: () => ["seller", "subscription", "usage"] as const,
  overage: () => ["seller", "subscription", "overage"] as const,
};

export function useSubscription() {
  return useQuery({
    queryKey: keys.subscription(),
    queryFn: () => apiClient.get("/seller/subscription"),
  });
}

export function useOrderUsage() {
  return useQuery({
    queryKey: keys.usage(),
    queryFn: () => apiClient.get("/seller/subscription/usage"),
  });
}

export function useOverageBills() {
  return useQuery({
    queryKey: keys.overage(),
    queryFn: () => apiClient.get("/seller/subscription/overage"),
  });
}

export function useUpgradePlan() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: {
      plan: SubscriptionPlan;
      paymentMethod?: string;
      paymentReference?: string;
      slipUrl?: string;
    }) => apiClient.post("/seller/subscription/upgrade", data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: keys.subscription() });
    },
  });
}
