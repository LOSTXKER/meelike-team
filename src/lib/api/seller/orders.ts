import { apiClient } from "../client";
import type { Order } from "@/types";

export async function getOrders() {
  const res = await apiClient.get<{ orders: Order[] }>("/seller/orders");
  return (res.data?.orders ?? []) as Order[];
}

export async function getOrderById(id: string) {
  const res = await apiClient.get<{ order: Order }>(`/seller/orders/${id}`);
  return (res.data?.order ?? null) as Order | null;
}

export async function createOrder(payload: {
  customerName?: string;
  customer?: { name: string; contactType?: string; contactValue?: string; note?: string };
  contactType?: string;
  contactValue?: string;
  customerNote?: string;
  items: {
    serviceId?: string;
    serviceName?: string;
    platform?: string;
    serviceType?: string;
    type?: string;
    targetUrl: string;
    quantity: number;
    unitPrice?: number;
    costPerUnit?: number;
    commentTemplates?: string[];
  }[];
  discount?: number;
  autoCreateJobs?: boolean;
  jobConfig?: { teamId: string; payRate: number };
}) {
  // Normalize customer fields from nested or flat format
  const normalized = {
    customerName: payload.customerName ?? payload.customer?.name ?? "",
    contactType: payload.contactType ?? payload.customer?.contactType,
    contactValue: payload.contactValue ?? payload.customer?.contactValue,
    customerNote: payload.customerNote ?? payload.customer?.note,
    items: payload.items,
    discount: payload.discount,
    autoCreateJobs: payload.autoCreateJobs,
    jobConfig: payload.jobConfig,
  };
  const res = await apiClient.post<{ order: Order; warning?: string }>(
    "/seller/orders",
    normalized
  );
  return res.data?.order ?? null;
}

export async function confirmPayment(orderId: string, paymentProof?: string) {
  const res = await apiClient.patch<{ order: Order }>(
    `/seller/orders/${orderId}`,
    { action: "confirm_payment", paymentProof }
  );
  return (res.data?.order ?? null) as Order | null;
}

export async function cancelOrder(orderId: string, reason?: string) {
  const res = await apiClient.patch<{ order: Order }>(
    `/seller/orders/${orderId}`,
    { action: "cancel", reason }
  );
  return (res.data?.order ?? null) as Order | null;
}

export async function dispatchBotItem(_orderId: string, _itemId: string) {
  return null;
}
