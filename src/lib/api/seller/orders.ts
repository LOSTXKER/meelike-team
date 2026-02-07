/**
 * Seller Orders API
 */

import { getCurrentSellerId } from "@/lib/storage";
import { generateOrderNumber, generateId } from "@/lib/utils/helpers";

import {
  delay,
  getOrdersFromStorage,
  saveOrdersToStorage,
  calculateOrderProgress,
  getTeamsFromStorage,
  getTeamJobsFromStorage,
  saveTeamJobsToStorage,
} from "../storage-helpers";

import type { Order, OrderItem, Job } from "@/types";
import { validate } from "@/lib/validations/utils";
import { createOrderSchema } from "@/lib/validations/seller";
import { requirePermission } from "@/lib/auth/guard";

// ===== FUNCTIONS =====

export async function getOrders(): Promise<Order[]> {
  await delay();
  return getOrdersFromStorage();
}

export async function getOrderById(id: string): Promise<Order | null> {
  await delay();
  const orders = getOrdersFromStorage();
  return orders.find((order) => order.id === id) || null;
}

export async function createOrder(payload: {
  customer: {
    name: string;
    contactType: "line" | "facebook" | "phone" | "email";
    contactValue: string;
    note?: string;
  };
  items: Array<{
    serviceId: string;
    serviceName: string;
    serviceType: "bot" | "human";
    platform: string;
    type: string;
    targetUrl: string;
    quantity: number;
    unitPrice: number;
    costPerUnit: number;
    commentTemplates?: string[];
  }>;
  discount?: number;
  autoCreateJobs?: boolean;
  jobConfig?: {
    teamId: string;
    payRate: number;
    splitToTeams?: { teamId: string; quantity: number; payRate?: number }[];
  };
}): Promise<Order> {
  requirePermission("order:create");
  validate(createOrderSchema, payload);
  await delay();

  const sellerId = getCurrentSellerId() || "seller-1";
  const orders = getOrdersFromStorage();
  const teams = getTeamsFromStorage();
  const jobs = getTeamJobsFromStorage();
  const now = new Date().toISOString();

  // Calculate totals
  const subtotal = payload.items.reduce(
    (sum, item) => sum + item.quantity * item.unitPrice,
    0
  );
  const discount = payload.discount || 0;
  const total = subtotal - discount;
  const totalCost = payload.items.reduce(
    (sum, item) => sum + item.quantity * item.costPerUnit,
    0
  );
  const totalProfit = total - totalCost;

  // Create order items
  const orderItems: OrderItem[] = payload.items.map((item) => ({
    id: `item-${generateId()}`,
    orderId: "",
    serviceId: item.serviceId,
    serviceName: item.serviceName,
    serviceType: item.serviceType as "bot" | "human",
    platform: item.platform as OrderItem["platform"],
    type: item.type as OrderItem["type"],
    targetUrl: item.targetUrl,
    quantity: item.quantity,
    commentTemplates: item.commentTemplates,
    unitPrice: item.unitPrice,
    subtotal: item.quantity * item.unitPrice,
    costPerUnit: item.costPerUnit,
    totalCost: item.quantity * item.costPerUnit,
    profit: item.quantity * item.unitPrice - item.quantity * item.costPerUnit,
    profitPercent:
      ((item.unitPrice - item.costPerUnit) / item.costPerUnit) * 100,
    status: "pending",
    progress: 0,
    completedQuantity: 0,
    jobs: [],
  }));

  // Generate order ID and number
  const orderId = `order-${generateId()}`;
  const orderNumber = generateOrderNumber();

  // Create order
  const newOrder: Order = {
    id: orderId,
    orderNumber: orderNumber,
    sellerId,
    customer: payload.customer,
    items: orderItems,
    subtotal,
    discount,
    total,
    totalCost,
    totalProfit,
    paymentStatus: "pending",
    status: "pending",
    progress: 0,
    trackingUrl: `seller.meelike.com/track/${orderNumber}`,
    createdAt: now,
    updatedAt: now,
  };

  // Set orderId for items
  newOrder.items.forEach((item) => {
    item.orderId = newOrder.id;
  });

  // Auto create jobs if enabled (only for human services)
  if (payload.autoCreateJobs && payload.jobConfig) {
    const { jobConfig } = payload;

    for (let i = 0; i < newOrder.items.length; i++) {
      const item = newOrder.items[i];

      if (item.serviceType !== "human") continue;

      if (jobConfig.splitToTeams && jobConfig.splitToTeams.length > 0) {
        for (const split of jobConfig.splitToTeams) {
          const team = teams.find((t) => t.id === split.teamId);
          if (!team) continue;

          const jobId = `job-${generateId()}`;
          const payRate = split.payRate ?? jobConfig.payRate;

          const newJob: Job = {
            id: jobId,
            sellerId,
            teamId: split.teamId,
            orderId: newOrder.id,
            orderItemId: item.id,
            orderNumber: newOrder.orderNumber,
            serviceName: item.serviceName,
            type: item.type,
            platform: item.platform,
            quantity: split.quantity,
            completedQuantity: 0,
            claimedQuantity: 0,
            pricePerUnit: payRate,
            totalPayout: split.quantity * payRate,
            targetUrl: item.targetUrl || "",
            instructions: item.commentTemplates?.join("\n"),
            visibility: "all_members",
            status: "pending",
            createdAt: now,
            updatedAt: now,
          };

          jobs.push(newJob);

          item.jobs!.push({
            jobId: jobId,
            teamId: split.teamId,
            teamName: team.name,
            quantity: split.quantity,
            completedQuantity: 0,
            status: "pending",
          });
        }
      } else {
        const team = teams.find((t) => t.id === jobConfig.teamId);
        if (team) {
          const jobId = `job-${generateId()}`;

          const newJob: Job = {
            id: jobId,
            sellerId,
            teamId: jobConfig.teamId,
            orderId: newOrder.id,
            orderItemId: item.id,
            orderNumber: newOrder.orderNumber,
            serviceName: item.serviceName,
            type: item.type,
            platform: item.platform,
            quantity: item.quantity,
            completedQuantity: 0,
            claimedQuantity: 0,
            pricePerUnit: jobConfig.payRate,
            totalPayout: item.quantity * jobConfig.payRate,
            targetUrl: item.targetUrl || "",
            instructions: item.commentTemplates?.join("\n"),
            visibility: "all_members",
            status: "pending",
            createdAt: now,
            updatedAt: now,
          };

          jobs.push(newJob);

          item.jobs!.push({
            jobId: jobId,
            teamId: jobConfig.teamId,
            teamName: team.name,
            quantity: item.quantity,
            completedQuantity: 0,
            status: "pending",
          });

          item.jobId = jobId;
        }
      }

      if (item.jobs && item.jobs.length > 0) {
        item.status = "processing";
        item.startedAt = now;
      }
    }

    const hasJobs = newOrder.items.some(
      (item) => item.jobs && item.jobs.length > 0
    );
    if (hasJobs) {
      newOrder.status = "processing";
    }

    saveTeamJobsToStorage(jobs);
  }

  orders.unshift(newOrder);
  saveOrdersToStorage(orders);

  return newOrder;
}

export async function confirmPayment(
  orderId: string,
  paymentProof?: string
): Promise<Order | null> {
  await delay();

  const orders = getOrdersFromStorage();
  const orderIndex = orders.findIndex((o) => o.id === orderId);

  if (orderIndex === -1) return null;

  const now = new Date().toISOString();
  orders[orderIndex] = {
    ...orders[orderIndex],
    paymentStatus: "paid",
    paidAt: now,
    confirmedAt: now,
    status: "processing",
    paymentProof,
    updatedAt: now,
  };

  saveOrdersToStorage(orders);
  return orders[orderIndex];
}

export async function dispatchBotItem(
  orderId: string,
  itemId: string
): Promise<Order | null> {
  await delay(800);

  const orders = getOrdersFromStorage();
  const orderIndex = orders.findIndex((o) => o.id === orderId);

  if (orderIndex === -1) return null;

  const order = orders[orderIndex];
  const itemIndex = order.items.findIndex((i) => i.id === itemId);

  if (itemIndex === -1) return null;

  const now = new Date().toISOString();
  const mockMeeLikeOrderId = `ML-${Math.floor(10000 + Math.random() * 90000)}`;

  order.items[itemIndex] = {
    ...order.items[itemIndex],
    status: "processing",
    meelikeOrderId: mockMeeLikeOrderId,
    startedAt: now,
  };

  order.progress = calculateOrderProgress(order.items);
  order.updatedAt = now;

  saveOrdersToStorage(orders);
  return order;
}

export async function cancelOrder(
  orderId: string,
  reason?: string
): Promise<Order | null> {
  await delay();

  const orders = getOrdersFromStorage();
  const orderIndex = orders.findIndex((o) => o.id === orderId);

  if (orderIndex === -1) return null;

  const now = new Date().toISOString();

  orders[orderIndex] = {
    ...orders[orderIndex],
    status: "cancelled",
    cancelReason: reason || "Cancelled by seller",
    cancelledAt: now,
    updatedAt: now,
  };

  orders[orderIndex].items = orders[orderIndex].items.map((item) => ({
    ...item,
    status: "cancelled",
  }));

  saveOrdersToStorage(orders);
  return orders[orderIndex];
}
