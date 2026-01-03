/**
 * Order Types
 * 
 * Types related to orders and order items.
 */

import type { Platform, ServiceType, ServiceMode } from "./common";

// ===== ORDER =====
export interface Order {
  id: string;
  orderNumber: string;
  sellerId: string;
  customer: {
    name: string;
    contactType: "line" | "facebook" | "phone" | "email";
    contactValue: string;
    note?: string;
  };
  items: OrderItem[];
  subtotal: number;
  discount: number;
  total: number;
  totalCost: number;
  totalProfit: number;
  paymentStatus: "pending" | "paid" | "refunded";
  paymentProof?: string;
  paidAt?: string;
  status: "pending" | "confirmed" | "processing" | "completed" | "cancelled";
  progress: number;
  sellerNote?: string;
  trackingUrl: string;
  createdAt: string;
  updatedAt: string;
  confirmedAt?: string;
  cancelReason?: string;
  cancelledAt?: string;
  completedAt?: string;
}

// ===== ORDER ITEM JOB (Summary of jobs created from this item) =====
export interface OrderItemJob {
  jobId: string;
  teamId: string;
  teamName: string;
  quantity: number;
  completedQuantity: number;
  status: "pending" | "in_progress" | "pending_review" | "completed" | "cancelled";
}

// ===== ORDER ITEM =====
export interface OrderItem {
  id: string;
  orderId: string;
  serviceId: string;
  serviceName: string;
  serviceType: ServiceMode;
  platform: Platform;
  type: ServiceType;
  targetUrl: string;
  quantity: number;
  commentTemplates?: string[];
  unitPrice: number;
  subtotal: number;
  costPerUnit: number;
  totalCost: number;
  profit: number;
  profitPercent: number;
  status: "pending" | "processing" | "completed" | "failed" | "cancelled";
  progress: number;
  completedQuantity: number;
  meelikeOrderId?: string;
  jobId?: string;
  jobs?: OrderItemJob[]; // รองรับหลาย jobs (แบ่งไปหลายทีม)
  // Hub outsource
  outsourceJobId?: string; // ID of outsource job in Hub (if posted)
  outsourceStatus?: "open" | "in_progress" | "completed" | "cancelled";
  startedAt?: string;
  completedAt?: string;
}

// ===== ORDER TIMELINE =====
export interface OrderTimeline {
  id: string;
  orderId: string;
  event:
    | "created"
    | "paid"
    | "confirmed"
    | "bot_started"
    | "bot_completed"
    | "job_created"
    | "job_progress"
    | "job_completed"
    | "completed"
    | "cancelled";
  itemId?: string;
  message: string;
  createdAt: string;
}
