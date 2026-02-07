"use client";

import * as React from "react";
import { Button, Progress } from "@/components/ui";
import { Dialog } from "@/components/ui/Dialog";
import { PlatformIcon, ServiceTypeBadge } from "@/components/shared";
import type { Platform, ServiceMode } from "@/types";
import {
  Target,
  Clock,
  DollarSign,
  Users,
  AlertTriangle,
  CheckCircle2,
  Minus,
  Plus,
  Zap,
} from "lucide-react";

interface JobData {
  id: string;
  serviceName: string;
  platform: string;
  type: string;
  quantity: number;
  claimed: number;
  pricePerUnit: number;
  deadline: string;
  urgent?: boolean;
  teamName?: string;
  instructions?: string;
}

interface ClaimJobModalProps {
  isOpen: boolean;
  onClose: () => void;
  job: JobData | null;
  onConfirm: (quantity: number) => void;
  isLoading?: boolean;
}

export function ClaimJobModal({
  isOpen,
  onClose,
  job,
  onConfirm,
  isLoading = false,
}: ClaimJobModalProps) {
  const [claimQuantity, setClaimQuantity] = React.useState(10);

  // Reset quantity when modal opens with new job
  React.useEffect(() => {
    if (isOpen && job) {
      const available = job.quantity - job.claimed;
      // Default to 10% of available or min 10
      const defaultQty = Math.max(10, Math.min(Math.floor(available * 0.1), available));
      setClaimQuantity(defaultQty);
    }
  }, [isOpen, job]);

  if (!job) return null;

  const availableQuantity = job.quantity - job.claimed;
  const maxClaimable = Math.min(availableQuantity, 500); // Limit per claim
  const estimatedEarnings = claimQuantity * job.pricePerUnit;
  const progressPercent = (job.claimed / job.quantity) * 100;

  const handleQuantityChange = (delta: number) => {
    const newValue = claimQuantity + delta;
    if (newValue >= 1 && newValue <= maxClaimable) {
      setClaimQuantity(newValue);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value) || 0;
    if (value >= 0 && value <= maxClaimable) {
      setClaimQuantity(value);
    }
  };

  const quickAmounts = [10, 50, 100, maxClaimable].filter((v, i, arr) => 
    v <= maxClaimable && (i === 0 || v !== arr[i-1])
  );

  return (
    <Dialog open={isOpen} onClose={onClose}>
      <Dialog.Header>
        <Dialog.Title>จองงาน</Dialog.Title>
      </Dialog.Header>
      <Dialog.Body>
      <div className="space-y-6">
        {/* Job Info Header */}
        <div className="flex items-start gap-4 p-4 bg-brand-bg/50 rounded-xl border border-brand-border/50">
          <div className="w-14 h-14 rounded-2xl bg-white border border-brand-border/50 flex items-center justify-center shadow-sm">
            <PlatformIcon platform={job.platform as Platform} className="w-7 h-7" />
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <h3 className="font-bold text-lg text-brand-text-dark">
                {job.serviceName}
              </h3>
              {job.urgent && (
                <span className="flex items-center gap-1 text-xs font-bold bg-brand-error/10 text-brand-error px-2 py-0.5 rounded-full animate-pulse">
                  <Zap className="w-3 h-3" /> ด่วน
                </span>
              )}
            </div>
            <div className="flex items-center gap-2">
              {job.teamName && (
                <span className="text-sm text-brand-text-light flex items-center gap-1">
                  <Users className="w-3.5 h-3.5" />
                  {job.teamName}
                </span>
              )}
              <ServiceTypeBadge type={job.type as ServiceMode} />
            </div>
          </div>
        </div>

        {/* Progress */}
        <div className="p-4 bg-brand-bg/30 rounded-xl border border-brand-border/30">
          <div className="flex justify-between text-sm mb-2">
            <span className="text-brand-text-light font-medium flex items-center gap-1.5">
              <Target className="w-4 h-4 text-brand-primary" />
              ความคืบหน้ารวม
            </span>
            <span className="font-bold text-brand-text-dark">
              {job.claimed} / {job.quantity}
            </span>
          </div>
          <Progress value={progressPercent} className="h-2" />
          <div className="flex justify-between mt-2 text-xs text-brand-text-light">
            <span>รับแล้ว {progressPercent.toFixed(0)}%</span>
            <span className="text-brand-success font-medium">
              ว่าง {availableQuantity} หน่วย
            </span>
          </div>
        </div>

        {/* Quantity Selector */}
        <div>
          <label className="block text-sm font-bold text-brand-text-dark mb-3">
            เลือกจำนวนที่ต้องการจอง
          </label>
          
          {/* Quick Amount Buttons */}
          <div className="flex gap-2 mb-4">
            {quickAmounts.map((amount) => (
              <button
                key={amount}
                onClick={() => setClaimQuantity(amount)}
                className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-all ${
                  claimQuantity === amount
                    ? "bg-brand-primary text-white shadow-md shadow-brand-primary/20"
                    : "bg-brand-bg text-brand-text-dark hover:bg-brand-primary/10 border border-brand-border/50"
                }`}
              >
                {amount === maxClaimable ? "สูงสุด" : amount}
              </button>
            ))}
          </div>

          {/* Number Input with +/- */}
          <div className="flex items-center justify-center gap-4 p-4 bg-brand-bg/50 rounded-xl border border-brand-border/50">
            <button
              onClick={() => handleQuantityChange(-10)}
              disabled={claimQuantity <= 10}
              className="w-12 h-12 rounded-xl bg-white border border-brand-border/50 flex items-center justify-center text-brand-text-dark hover:bg-brand-bg disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-sm"
            >
              <Minus className="w-5 h-5" />
            </button>
            
            <div className="flex-1 max-w-[120px]">
              <input
                type="number"
                value={claimQuantity}
                onChange={handleInputChange}
                min={1}
                max={maxClaimable}
                className="w-full text-center text-3xl font-bold text-brand-primary bg-transparent border-none focus:outline-none"
              />
              <p className="text-center text-xs text-brand-text-light mt-1">
                หน่วย (สูงสุด {maxClaimable})
              </p>
            </div>
            
            <button
              onClick={() => handleQuantityChange(10)}
              disabled={claimQuantity >= maxClaimable}
              className="w-12 h-12 rounded-xl bg-white border border-brand-border/50 flex items-center justify-center text-brand-text-dark hover:bg-brand-bg disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-sm"
            >
              <Plus className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Earnings Estimate */}
        <div className="p-4 bg-gradient-to-br from-brand-success/10 to-brand-success/5 rounded-xl border border-brand-success/20">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-brand-text-light font-medium flex items-center gap-1.5">
                <DollarSign className="w-4 h-4 text-brand-success" />
                รายได้โดยประมาณ
              </p>
              <p className="text-xs text-brand-text-light mt-1">
                ฿{job.pricePerUnit} × {claimQuantity} หน่วย
              </p>
            </div>
            <div className="text-right">
              <p className="text-3xl font-bold text-brand-success">
                ฿{estimatedEarnings.toFixed(2)}
              </p>
            </div>
          </div>
        </div>

        {/* Deadline Warning */}
        <div className="flex items-start gap-3 p-3 bg-brand-warning/10 border border-brand-warning/20 rounded-xl">
          <Clock className="w-5 h-5 text-brand-warning shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-medium text-brand-text-dark">
              กำหนดส่งภายใน {job.deadline}
            </p>
            <p className="text-xs text-brand-text-light mt-0.5">
              หากไม่ส่งงานทันเวลา อาจถูกหักคะแนน
            </p>
          </div>
        </div>

        {/* Instructions */}
        {job.instructions && (
          <div className="p-3 bg-brand-info/10 border border-brand-info/20 rounded-xl">
            <p className="text-sm font-medium text-brand-text-dark mb-1">คำแนะนำ:</p>
            <p className="text-sm text-brand-text-light">{job.instructions}</p>
          </div>
        )}

      </div>
      </Dialog.Body>
      <Dialog.Footer>
          <Button
            variant="outline"
            onClick={onClose}
            className="flex-1"
            disabled={isLoading}
          >
            ยกเลิก
          </Button>
          <Button
            onClick={() => onConfirm(claimQuantity)}
            className="flex-1 shadow-md shadow-brand-primary/20"
            isLoading={isLoading}
          >
            <CheckCircle2 className="w-4 h-4 mr-2" />
            ยืนยันจองงาน
          </Button>
      </Dialog.Footer>
    </Dialog>
  );
}
