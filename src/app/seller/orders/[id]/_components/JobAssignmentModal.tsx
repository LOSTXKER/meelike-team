"use client";

import { useState } from "react";
import { Button, Input, Textarea } from "@/components/ui";
import { Dialog } from "@/components/ui/Dialog";
import { ContentGuidelines } from "@/components/shared";
import {
  CheckCircle2,
  AlertCircle,
  Zap,
  Users,
  Building2,
  ChevronDown,
  Split,
  ArrowRightLeft,
  AlertTriangle,
} from "lucide-react";
import type { OrderItemJob } from "@/types";

interface TeamOption {
  value: string;
  label: string;
}

// ===== CONFIRM PAYMENT MODAL =====

interface ConfirmPaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  orderNumber: string;
  total: number;
}

export function ConfirmPaymentModal({
  isOpen,
  onClose,
  onConfirm,
  orderNumber,
  total,
}: ConfirmPaymentModalProps) {
  return (
    <Dialog open={isOpen} onClose={onClose}>
      <Dialog.Header>
        <Dialog.Title>ยืนยันการชำระเงิน</Dialog.Title>
      </Dialog.Header>
      <Dialog.Body>
        <div className="space-y-4">
          <div className="p-4 bg-brand-bg rounded-lg">
            <div className="flex justify-between mb-2">
              <span className="text-brand-text-light">ออเดอร์</span>
              <span className="font-medium text-brand-text-dark">
                {orderNumber}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-brand-text-light">จำนวนเงิน</span>
              <span className="font-bold text-brand-primary">
                ฿{total.toLocaleString()}
              </span>
            </div>
          </div>

          <div className="p-4 bg-brand-warning/10 rounded-lg flex gap-3">
            <AlertCircle className="w-5 h-5 text-brand-warning shrink-0" />
            <p className="text-sm text-brand-text-dark">
              กรุณาตรวจสอบหลักฐานการโอนเงินก่อนยืนยัน
              เมื่อยืนยันแล้วจะไม่สามารถยกเลิกได้
            </p>
          </div>
        </div>
      </Dialog.Body>
      <Dialog.Footer>
        <Button variant="outline" onClick={onClose}>
          ยกเลิก
        </Button>
        <Button onClick={onConfirm}>
          <CheckCircle2 className="w-4 h-4 mr-2" />
          ยืนยันการชำระเงิน
        </Button>
      </Dialog.Footer>
    </Dialog>
  );
}

// ===== SEND BOT MODAL =====

interface SendBotModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  serviceName: string;
  quantity: number;
  costPrice: number;
}

export function SendBotModal({
  isOpen,
  onClose,
  onConfirm,
  serviceName,
  quantity,
  costPrice,
}: SendBotModalProps) {
  return (
    <Dialog open={isOpen} onClose={onClose}>
      <Dialog.Header>
        <Dialog.Title>ส่งคำสั่งซื้อไป Bot API</Dialog.Title>
      </Dialog.Header>
      <Dialog.Body>
        <div className="space-y-4">
          <div className="p-4 bg-brand-bg rounded-xl">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-lg bg-brand-primary/10 flex items-center justify-center">
                <Zap className="w-5 h-5 text-brand-primary" />
              </div>
              <div>
                <p className="font-bold text-brand-text-dark">{serviceName}</p>
                <p className="text-xs text-brand-text-light">Bot Service</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div className="p-2 bg-white rounded-lg">
                <p className="text-brand-text-light text-xs">จำนวน</p>
                <p className="font-bold text-brand-text-dark">
                  {quantity.toLocaleString()} หน่วย
                </p>
              </div>
              <div className="p-2 bg-white rounded-lg">
                <p className="text-brand-text-light text-xs">ต้นทุน</p>
                <p className="font-bold text-brand-primary">
                  ฿{(quantity * costPrice).toLocaleString()}
                </p>
              </div>
            </div>
          </div>

          <div className="p-4 bg-brand-warning/10 rounded-xl border border-brand-warning/30 flex gap-3">
            <AlertCircle className="w-5 h-5 text-brand-warning shrink-0" />
            <div className="text-sm text-brand-text-dark">
              <p className="font-medium text-brand-warning mb-1">ยืนยันการส่ง?</p>
              <p className="text-brand-text-light">
                เมื่อส่งแล้วจะหักเครดิตจาก MeeLike API ทันที
                และไม่สามารถยกเลิกได้
              </p>
            </div>
          </div>
        </div>
      </Dialog.Body>
      <Dialog.Footer>
        <Button variant="outline" onClick={onClose}>
          ยกเลิก
        </Button>
        <Button
          onClick={onConfirm}
          className="shadow-md shadow-brand-primary/20"
        >
          <Zap className="w-4 h-4 mr-2" />
          ยืนยัน ส่ง Bot API
        </Button>
      </Dialog.Footer>
    </Dialog>
  );
}

// ===== CREATE JOB MODAL =====

interface CreateJobModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (teamId: string, quantity: string, payRate: string) => void;
  serviceName: string;
  remainingQuantity: number;
  teamOptions: TeamOption[];
  initialQuantity: string;
}

export function CreateJobModal({
  isOpen,
  onClose,
  onSubmit,
  serviceName,
  remainingQuantity,
  teamOptions,
  initialQuantity,
}: CreateJobModalProps) {
  const [teamId, setTeamId] = useState("");
  const [quantity, setQuantity] = useState(initialQuantity);
  const [payRate, setPayRate] = useState("");

  const handleClose = () => {
    setTeamId("");
    setQuantity("");
    setPayRate("");
    onClose();
  };

  return (
    <Dialog open={isOpen} onClose={handleClose}>
      <Dialog.Header>
        <Dialog.Title>มอบหมายงานให้ทีม</Dialog.Title>
      </Dialog.Header>
      <Dialog.Body>
        <div className="space-y-4">
          <div className="p-4 bg-brand-bg rounded-xl">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-brand-primary to-brand-primary/70 flex items-center justify-center">
                <Users className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="font-bold text-brand-text-dark">{serviceName}</p>
                <p className="text-xs text-brand-text-light">
                  Real Human Service
                </p>
              </div>
            </div>
            <div className="p-2 bg-white rounded-lg text-sm">
              <p className="text-brand-text-light text-xs">จำนวนที่ต้องทำ</p>
              <p className="font-bold text-brand-text-dark">
                {remainingQuantity.toLocaleString()} หน่วย
              </p>
            </div>
          </div>

          <div>
            <label className="block text-sm font-bold text-brand-text-dark mb-2">
              เลือกทีมที่จะมอบหมาย *
            </label>
            <div className="relative">
              <select
                value={teamId}
                onChange={(e) => setTeamId(e.target.value)}
                className="w-full p-3 pl-10 rounded-xl border border-brand-border/50 bg-white focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/20 outline-none appearance-none cursor-pointer font-medium"
              >
                <option value="">-- เลือกทีม --</option>
                {teamOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
              <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-brand-text-light" />
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-brand-text-light pointer-events-none" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Input
              label="จำนวนที่มอบหมาย *"
              type="number"
              placeholder="100"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
            />
            <Input
              label="ค่าจ้างต่อหน่วย (฿) *"
              type="number"
              step="0.01"
              placeholder="0.15"
              value={payRate}
              onChange={(e) => setPayRate(e.target.value)}
            />
          </div>

          {quantity && payRate && (
            <div className="p-3 bg-brand-success/10 border border-brand-success/30 rounded-xl">
              <div className="flex justify-between text-sm">
                <span className="text-brand-text-light">ค่าจ้างรวม</span>
                <span className="font-bold text-brand-success">
                  ฿
                  {(
                    parseFloat(quantity || "0") * parseFloat(payRate || "0")
                  ).toLocaleString()}
                </span>
              </div>
            </div>
          )}

          <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl">
            <div className="flex gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
              <div className="text-sm">
                <p className="font-medium text-amber-800">
                  คำเตือน: กรุณาตรวจสอบเนื้อหางานก่อนมอบหมาย
                </p>
                <p className="text-amber-700 text-xs mt-1">
                  ห้ามมอบหมายงานที่เกี่ยวข้องกับการพนัน, เว็บผิดกฎหมาย,
                  โฆษณาหลอกลวง หรือเนื้อหาผู้ใหญ่
                </p>
              </div>
            </div>
          </div>
        </div>
      </Dialog.Body>
      <Dialog.Footer>
        <Button variant="outline" onClick={handleClose}>
          ยกเลิก
        </Button>
        <Button
          onClick={() => onSubmit(teamId, quantity, payRate)}
          disabled={!quantity || !payRate || !teamId}
          className="shadow-md shadow-brand-primary/20"
        >
          <Users className="w-4 h-4 mr-2" />
          มอบหมายงาน
        </Button>
      </Dialog.Footer>
    </Dialog>
  );
}

// ===== SPLIT JOB MODAL =====

interface SplitJobModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (teamId: string, quantity: string, payRate: string) => void;
  serviceName: string;
  remainingQuantity: number;
  teamOptions: TeamOption[];
  initialQuantity: string;
}

export function SplitJobModal({
  isOpen,
  onClose,
  onSubmit,
  serviceName,
  remainingQuantity,
  teamOptions,
  initialQuantity,
}: SplitJobModalProps) {
  const [teamId, setTeamId] = useState("");
  const [quantity, setQuantity] = useState(initialQuantity);
  const [payRate, setPayRate] = useState("");

  const handleClose = () => {
    setTeamId("");
    setQuantity("");
    setPayRate("");
    onClose();
  };

  return (
    <Dialog open={isOpen} onClose={handleClose}>
      <Dialog.Header>
        <Dialog.Title>แบ่งงานไปทีมอื่น</Dialog.Title>
      </Dialog.Header>
      <Dialog.Body>
        <div className="space-y-4">
          <div className="p-4 bg-brand-bg rounded-xl">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-brand-accent to-brand-primary flex items-center justify-center">
                <Split className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="font-bold text-brand-text-dark">{serviceName}</p>
                <p className="text-xs text-brand-text-light">
                  แบ่งงานเพิ่มไปทีมอื่น
                </p>
              </div>
            </div>
            <div className="p-2 bg-white rounded-lg text-sm">
              <p className="text-brand-text-light text-xs">
                จำนวนที่ยังไม่ได้มอบหมาย
              </p>
              <p className="font-bold text-brand-text-dark">
                {remainingQuantity.toLocaleString()} หน่วย
              </p>
            </div>
          </div>

          <div>
            <label className="block text-sm font-bold text-brand-text-dark mb-2">
              เลือกทีมปลายทาง *
            </label>
            <div className="relative">
              <select
                value={teamId}
                onChange={(e) => setTeamId(e.target.value)}
                className="w-full p-3 pl-10 rounded-xl border border-brand-border/50 bg-white focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/20 outline-none appearance-none cursor-pointer font-medium"
              >
                <option value="">-- เลือกทีม --</option>
                {teamOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
              <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-brand-text-light" />
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-brand-text-light pointer-events-none" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Input
              label="จำนวนที่แบ่ง *"
              type="number"
              placeholder="100"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              max={remainingQuantity}
            />
            <Input
              label="ค่าจ้างต่อหน่วย (฿) *"
              type="number"
              step="0.01"
              placeholder="0.15"
              value={payRate}
              onChange={(e) => setPayRate(e.target.value)}
            />
          </div>

          {quantity && payRate && (
            <div className="p-3 bg-brand-success/10 border border-brand-success/30 rounded-xl">
              <div className="flex justify-between text-sm">
                <span className="text-brand-text-light">ค่าจ้างรวม</span>
                <span className="font-bold text-brand-success">
                  ฿
                  {(
                    parseFloat(quantity || "0") * parseFloat(payRate || "0")
                  ).toLocaleString()}
                </span>
              </div>
            </div>
          )}

          <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl">
            <div className="flex gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
              <div className="text-sm">
                <p className="font-medium text-amber-800">
                  คำเตือน: ตรวจสอบเนื้อหาก่อนแบ่งงาน
                </p>
                <p className="text-amber-700 text-xs mt-1">
                  ห้ามแบ่งงานที่เกี่ยวข้องกับการพนัน, เว็บผิดกฎหมาย,
                  โฆษณาหลอกลวง หรือเนื้อหาผู้ใหญ่
                </p>
              </div>
            </div>
          </div>
        </div>
      </Dialog.Body>
      <Dialog.Footer>
        <Button variant="outline" onClick={handleClose}>
          ยกเลิก
        </Button>
        <Button
          onClick={() => onSubmit(teamId, quantity, payRate)}
          disabled={!quantity || !payRate || !teamId}
          className="shadow-md shadow-brand-primary/20"
        >
          <Split className="w-4 h-4 mr-2" />
          แบ่งงาน
        </Button>
      </Dialog.Footer>
    </Dialog>
  );
}

// ===== REASSIGN JOB MODAL =====

interface ReassignJobModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (teamId: string, reason: string) => void;
  job: OrderItemJob | null;
  teamOptions: TeamOption[];
}

export function ReassignJobModal({
  isOpen,
  onClose,
  onSubmit,
  job,
  teamOptions,
}: ReassignJobModalProps) {
  const [teamId, setTeamId] = useState("");
  const [reason, setReason] = useState("");

  const handleClose = () => {
    setTeamId("");
    setReason("");
    onClose();
  };

  if (!job) return null;

  return (
    <Dialog open={isOpen} onClose={handleClose}>
      <Dialog.Header>
        <Dialog.Title>โยนงานไปทีมอื่น</Dialog.Title>
      </Dialog.Header>
      <Dialog.Body>
        <div className="space-y-4">
          <div className="p-4 bg-brand-bg rounded-xl">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-brand-warning to-brand-accent flex items-center justify-center">
                <ArrowRightLeft className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="font-bold text-brand-text-dark">
                  โยนงานจากทีม &quot;{job.teamName}&quot;
                </p>
                <p className="text-xs text-brand-text-light">
                  {job.quantity - job.completedQuantity} หน่วยที่เหลือจะถูกโยนไปทีมใหม่
                </p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div className="p-2 bg-white rounded-lg text-sm">
                <p className="text-brand-text-light text-xs">จำนวนทั้งหมด</p>
                <p className="font-bold text-brand-text-dark">
                  {job.quantity} หน่วย
                </p>
              </div>
              <div className="p-2 bg-white rounded-lg text-sm">
                <p className="text-brand-text-light text-xs">ทำเสร็จแล้ว</p>
                <p className="font-bold text-brand-success">
                  {job.completedQuantity} หน่วย
                </p>
              </div>
            </div>
          </div>

          <div className="p-3 bg-brand-warning/10 border border-brand-warning/30 rounded-xl">
            <div className="flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-brand-warning mt-0.5 shrink-0" />
              <p className="text-sm text-brand-text-dark">
                งานเดิมจะถูกยกเลิก และสร้างงานใหม่ในทีมที่เลือก
                ส่วนที่ทำเสร็จแล้วจะยังคงอยู่
              </p>
            </div>
          </div>

          <div>
            <label className="block text-sm font-bold text-brand-text-dark mb-2">
              เลือกทีมปลายทาง *
            </label>
            <div className="relative">
              <select
                value={teamId}
                onChange={(e) => setTeamId(e.target.value)}
                className="w-full p-3 pl-10 rounded-xl border border-brand-border/50 bg-white focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/20 outline-none appearance-none cursor-pointer font-medium"
              >
                <option value="">-- เลือกทีม --</option>
                {teamOptions
                  .filter((opt) => opt.value !== job.teamId)
                  .map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
              </select>
              <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-brand-text-light" />
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-brand-text-light pointer-events-none" />
            </div>
          </div>

          <Textarea
            label="เหตุผล (ถ้ามี)"
            placeholder="เช่น ทีมเดิมไม่ว่าง, ต้องการเปลี่ยนทีม..."
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            rows={2}
          />

          <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl">
            <div className="flex gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
              <div className="text-sm">
                <p className="font-medium text-amber-800">
                  คำเตือน: ตรวจสอบเนื้อหาก่อนโยนงาน
                </p>
                <p className="text-amber-700 text-xs mt-1">
                  ห้ามโยนงานที่เกี่ยวข้องกับการพนัน, เว็บผิดกฎหมาย,
                  โฆษณาหลอกลวง หรือเนื้อหาผู้ใหญ่
                </p>
              </div>
            </div>
          </div>
        </div>
      </Dialog.Body>
      <Dialog.Footer>
        <Button variant="outline" onClick={handleClose}>
          ยกเลิก
        </Button>
        <Button
          onClick={() => onSubmit(teamId, reason)}
          disabled={!teamId}
          className="shadow-md shadow-brand-primary/20"
        >
          <ArrowRightLeft className="w-4 h-4 mr-2" />
          โยนงาน
        </Button>
      </Dialog.Footer>
    </Dialog>
  );
}
