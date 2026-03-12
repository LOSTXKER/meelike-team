"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "../client";

const keys = {
  payouts: () => ["seller", "payouts"] as const,
  earnings: () => ["worker", "earnings"] as const,
};

export function usePayoutChecklist() {
  return useQuery({
    queryKey: keys.payouts(),
    queryFn: () => apiClient.get("/seller/payouts"),
  });
}

export function useConfirmPayout() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      slipUrl,
      note,
    }: {
      id: string;
      slipUrl?: string;
      note?: string;
    }) => apiClient.post(`/seller/payouts/${id}/confirm`, { slipUrl, note }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: keys.payouts() });
    },
  });
}

export function useWorkerEarnings() {
  return useQuery({
    queryKey: keys.earnings(),
    queryFn: () => apiClient.get("/worker/earnings"),
  });
}

export function useConfirmPaymentReceived() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (paymentRecordId: string) =>
      apiClient.post("/worker/earnings/confirm", { paymentRecordId }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: keys.earnings() });
    },
  });
}
