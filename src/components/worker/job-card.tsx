"use client";

import Link from "next/link";
import { Card, Badge, Progress } from "@/components/ui";
import { PlatformIcon } from "@/components/shared";
import { cn, formatCurrency } from "@/lib/utils";
import type { WorkerJob, Platform } from "@/types";
import {
  Clock,
  CheckCircle2,
  AlertCircle,
  Users,
  Target,
} from "lucide-react";

interface JobCardProps {
  job: WorkerJob;
  /** Show progress bar */
  showProgress?: boolean;
  /** Show deadline info */
  showDeadline?: boolean;
  /** Link destination (default: /work/jobs/{id}) */
  href?: string;
  /** Additional className */
  className?: string;
}

const statusConfig = {
  in_progress: {
    label: "กำลังทำ",
    variant: "info" as const,
    icon: Clock,
  },
  pending_review: {
    label: "รอตรวจ",
    variant: "warning" as const,
    icon: AlertCircle,
  },
  completed: {
    label: "เสร็จแล้ว",
    variant: "success" as const,
    icon: CheckCircle2,
  },
};

export function JobCard({
  job,
  showProgress = true,
  showDeadline = false,
  href,
  className,
}: JobCardProps) {
  const config = statusConfig[job.status];
  const StatusIcon = config.icon;
  const progress = job.quantity > 0 ? (job.completedQuantity / job.quantity) * 100 : 0;
  const totalEarnings = job.quantity * job.pricePerUnit;
  const linkHref = href || `/work/jobs/${job.id}`;

  return (
    <Link href={linkHref}>
      <Card
        className={cn(
          "border-none shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer group",
          className
        )}
      >
        <div className="p-4">
          {/* Header Row */}
          <div className="flex items-start justify-between gap-3 mb-3">
            <div className="flex items-start gap-3 min-w-0">
              <div className="w-10 h-10 rounded-xl bg-white shadow-sm flex items-center justify-center border border-brand-border/30 shrink-0">
                <PlatformIcon platform={job.platform as Platform} size="md" />
              </div>
              <div className="min-w-0">
                <p className="font-bold text-brand-text-dark truncate group-hover:text-brand-primary transition-colors">
                  {job.serviceName}
                </p>
                <div className="flex items-center gap-2 mt-1">
                  <Badge variant="default" size="sm" className="bg-brand-bg text-brand-text-light border-brand-border/50">
                    <Users className="w-3 h-3 mr-1" />
                    {job.teamName}
                  </Badge>
                  <Badge variant={config.variant} size="sm">
                    <StatusIcon className="w-3 h-3 mr-1" />
                    {config.label}
                  </Badge>
                </div>
              </div>
            </div>
            <div className="text-right shrink-0">
              <p className="text-lg font-bold text-brand-primary">
                {formatCurrency(totalEarnings)}
              </p>
              <p className="text-xs text-brand-text-light">
                {formatCurrency(job.pricePerUnit)}/หน่วย
              </p>
            </div>
          </div>

          {/* Progress */}
          {showProgress && job.status === "in_progress" && (
            <div className="bg-brand-bg/30 rounded-xl p-3 border border-brand-border/30 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-brand-text-dark font-medium flex items-center gap-1.5">
                  <Target className="w-3.5 h-3.5 text-brand-primary" />
                  ความคืบหน้า
                </span>
                <span className="font-bold text-brand-text-dark">
                  {job.completedQuantity} <span className="text-brand-text-light font-normal">/ {job.quantity}</span>
                </span>
              </div>
              <Progress value={progress} className="h-2" />
            </div>
          )}

          {/* Deadline */}
          {showDeadline && job.deadline && (
            <div className="flex items-center gap-1.5 mt-2 text-xs text-brand-text-light">
              <Clock className="w-3.5 h-3.5" />
              <span>กำหนดส่ง: {new Date(job.deadline).toLocaleDateString("th-TH")}</span>
            </div>
          )}

          {/* Earnings for completed */}
          {job.status === "completed" && job.earnings && (
            <div className="flex items-center justify-between mt-2 pt-2 border-t border-brand-border/30">
              <span className="text-sm text-brand-text-light">รายได้ที่ได้รับ</span>
              <span className="font-bold text-brand-success">{formatCurrency(job.earnings)}</span>
            </div>
          )}
        </div>
      </Card>
    </Link>
  );
}
