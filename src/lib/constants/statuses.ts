export type StatusVariant = "success" | "warning" | "error" | "info" | "default";

interface StatusConfig {
  label: string;
  labelTh: string;
  variant: StatusVariant;
}

export const ORDER_STATUSES: Record<string, StatusConfig> = {
  pending: { label: "Pending", labelTh: "รอดำเนินการ", variant: "warning" },
  confirmed: { label: "Confirmed", labelTh: "ยืนยันแล้ว", variant: "info" },
  processing: { label: "Processing", labelTh: "กำลังทำ", variant: "info" },
  completed: { label: "Completed", labelTh: "เสร็จแล้ว", variant: "success" },
  cancelled: { label: "Cancelled", labelTh: "ยกเลิก", variant: "error" },
};

export const PAYMENT_STATUSES: Record<string, StatusConfig> = {
  pending: { label: "Pending", labelTh: "รอชำระ", variant: "warning" },
  paid: { label: "Paid", labelTh: "ชำระแล้ว", variant: "success" },
  refunded: { label: "Refunded", labelTh: "คืนเงินแล้ว", variant: "default" },
};

export const JOB_STATUSES: Record<string, StatusConfig> = {
  open: { label: "Open", labelTh: "เปิดรับ", variant: "success" },
  in_progress: { label: "In Progress", labelTh: "กำลังทำ", variant: "info" },
  completed: { label: "Completed", labelTh: "เสร็จแล้ว", variant: "success" },
  cancelled: { label: "Cancelled", labelTh: "ยกเลิก", variant: "error" },
};

export const CLAIM_STATUSES: Record<string, StatusConfig> = {
  claimed: { label: "Claimed", labelTh: "รับงานแล้ว", variant: "info" },
  submitted: { label: "Submitted", labelTh: "รอตรวจสอบ", variant: "warning" },
  approved: { label: "Approved", labelTh: "อนุมัติแล้ว", variant: "success" },
  rejected: { label: "Rejected", labelTh: "ปฏิเสธ", variant: "error" },
  cancelled: { label: "Cancelled", labelTh: "ยกเลิก", variant: "default" },
};

export const WORKER_LEVELS = {
  bronze: { label: "Bronze", color: "text-amber-600", bgColor: "bg-amber-100" },
  silver: { label: "Silver", color: "text-gray-500", bgColor: "bg-gray-100" },
  gold: { label: "Gold", color: "text-yellow-600", bgColor: "bg-yellow-100" },
  platinum: { label: "Platinum", color: "text-cyan-600", bgColor: "bg-cyan-100" },
  vip: { label: "VIP", color: "text-purple-600", bgColor: "bg-purple-100" },
} as const;

export type WorkerLevelKey = keyof typeof WORKER_LEVELS;

export function getStatusConfig(
  status: string,
  statusMap: Record<string, StatusConfig>
): StatusConfig {
  return statusMap[status] || { label: status, labelTh: status, variant: "default" };
}

