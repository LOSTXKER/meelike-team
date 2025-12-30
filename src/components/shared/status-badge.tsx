"use client";

import { Badge } from "@/components/ui";
import {
  ORDER_STATUSES,
  PAYMENT_STATUSES,
  JOB_STATUSES,
  CLAIM_STATUSES,
  getStatusConfig,
  type StatusVariant,
} from "@/lib/constants/statuses";

type StatusType = "order" | "payment" | "job" | "claim";

const statusMaps = {
  order: ORDER_STATUSES,
  payment: PAYMENT_STATUSES,
  job: JOB_STATUSES,
  claim: CLAIM_STATUSES,
};

interface StatusBadgeProps {
  status: string;
  type: StatusType;
  size?: "sm" | "md";
  showEnglish?: boolean;
}

export function StatusBadge({ status, type, size = "sm", showEnglish = false }: StatusBadgeProps) {
  const config = getStatusConfig(status, statusMaps[type]);
  
  return (
    <Badge variant={config.variant} size={size}>
      {showEnglish ? config.label : config.labelTh}
    </Badge>
  );
}

