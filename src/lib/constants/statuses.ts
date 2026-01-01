export type StatusVariant = "success" | "warning" | "error" | "info" | "default";

interface StatusConfig {
  label: string;
  labelTh: string;
  variant: StatusVariant;
}

// ===== ORDER STATUSES =====
export const ORDER_STATUSES: Record<string, StatusConfig> = {
  pending: { label: "Pending", labelTh: "รอดำเนินการ", variant: "warning" },
  confirmed: { label: "Confirmed", labelTh: "ยืนยันแล้ว", variant: "info" },
  processing: { label: "Processing", labelTh: "กำลังทำ", variant: "info" },
  completed: { label: "Completed", labelTh: "เสร็จแล้ว", variant: "success" },
  cancelled: { label: "Cancelled", labelTh: "ยกเลิก", variant: "error" },
};

// ===== PAYMENT STATUSES =====
export const PAYMENT_STATUSES: Record<string, StatusConfig> = {
  pending: { label: "Pending", labelTh: "รอชำระ", variant: "warning" },
  paid: { label: "Paid", labelTh: "ชำระแล้ว", variant: "success" },
  refunded: { label: "Refunded", labelTh: "คืนเงินแล้ว", variant: "default" },
};

// ===== JOB STATUSES (Team Jobs) =====
export type TeamJobStatus = "pending" | "in_progress" | "pending_review" | "completed" | "cancelled";

export const TEAM_JOB_STATUSES: Record<TeamJobStatus, StatusConfig> = {
  pending: { label: "Pending", labelTh: "รอจอง", variant: "warning" },
  in_progress: { label: "In Progress", labelTh: "กำลังทำ", variant: "info" },
  pending_review: { label: "Pending Review", labelTh: "รอตรวจสอบ", variant: "warning" },
  completed: { label: "Completed", labelTh: "เสร็จสิ้น", variant: "success" },
  cancelled: { label: "Cancelled", labelTh: "ยกเลิก", variant: "error" },
};

// Legacy JOB_STATUSES for backward compatibility
export const JOB_STATUSES: Record<string, StatusConfig> = {
  open: { label: "Open", labelTh: "เปิดรับ", variant: "success" },
  in_progress: { label: "In Progress", labelTh: "กำลังทำ", variant: "info" },
  completed: { label: "Completed", labelTh: "เสร็จแล้ว", variant: "success" },
  cancelled: { label: "Cancelled", labelTh: "ยกเลิก", variant: "error" },
};

// ===== CLAIM STATUSES =====
export const CLAIM_STATUSES: Record<string, StatusConfig> = {
  claimed: { label: "Claimed", labelTh: "จองแล้ว", variant: "info" },
  submitted: { label: "Submitted", labelTh: "รอตรวจสอบ", variant: "warning" },
  approved: { label: "Approved", labelTh: "อนุมัติแล้ว", variant: "success" },
  rejected: { label: "Rejected", labelTh: "ปฏิเสธ", variant: "error" },
  cancelled: { label: "Cancelled", labelTh: "ยกเลิก", variant: "default" },
};

// ===== PAYOUT STATUSES =====
export type PayoutStatus = "pending" | "completed";

export const PAYOUT_STATUSES: Record<PayoutStatus, StatusConfig> = {
  pending: { label: "Pending", labelTh: "รอจ่าย", variant: "warning" },
  completed: { label: "Completed", labelTh: "จ่ายแล้ว", variant: "success" },
};

// ===== TEAM ROLE CONFIGS =====
export type TeamRoleType = "lead" | "assistant" | "worker";

interface RoleConfig {
  label: string;
  labelTh: string;
  variant: StatusVariant;
}

export const TEAM_ROLES: Record<TeamRoleType, RoleConfig> = {
  lead: { label: "Lead", labelTh: "หัวหน้าทีม", variant: "success" },
  assistant: { label: "Assistant", labelTh: "ผู้ช่วย", variant: "info" },
  worker: { label: "Worker", labelTh: "Worker", variant: "default" },
};

// ===== WORKER LEVELS =====
export const WORKER_LEVELS = {
  bronze: { label: "Bronze", color: "text-amber-600", bgColor: "bg-amber-100" },
  silver: { label: "Silver", color: "text-gray-500", bgColor: "bg-gray-100" },
  gold: { label: "Gold", color: "text-yellow-600", bgColor: "bg-yellow-100" },
  platinum: { label: "Platinum", color: "text-cyan-600", bgColor: "bg-cyan-100" },
  vip: { label: "VIP", color: "text-purple-600", bgColor: "bg-purple-100" },
} as const;

export type WorkerLevelKey = keyof typeof WORKER_LEVELS;

// ===== HELPER FUNCTIONS =====
export function getStatusConfig(
  status: string,
  statusMap: Record<string, StatusConfig>
): StatusConfig {
  return statusMap[status] || { label: status, labelTh: status, variant: "default" };
}

/** Get job status label (Thai) */
export function getJobStatusLabel(status: TeamJobStatus): string {
  return TEAM_JOB_STATUSES[status]?.labelTh || status;
}

/** Get job status variant for Badge */
export function getJobStatusVariant(status: TeamJobStatus): StatusVariant {
  return TEAM_JOB_STATUSES[status]?.variant || "default";
}

/** Get role label (Thai) */
export function getRoleLabel(role: TeamRoleType): string {
  return TEAM_ROLES[role]?.labelTh || role;
}

/** Get role variant for Badge */
export function getRoleVariant(role: TeamRoleType): StatusVariant {
  return TEAM_ROLES[role]?.variant || "default";
}
