"use client";

import { Card, Badge, Button, Progress } from "@/components/ui";
import {
  Package,
  ExternalLink,
  Copy,
  CheckCircle2,
  AlertCircle,
  Facebook,
  Instagram,
  Music2,
  Youtube,
  Zap,
  Users,
  Loader2,
  Plus,
  Globe,
  Briefcase,
  ArrowRightLeft,
} from "lucide-react";
import type { OrderItemJob } from "@/types";

interface OrderItem {
  id: string;
  serviceId: string;
  completedQuantity: number;
  quantity: number;
  status: string;
  serviceName: string;
  platform: string;
  type: string;
  serviceType: string;
  targetUrl: string;
  unitPrice: number;
  subtotal: number;
  progress: number;
  jobs?: OrderItemJob[];
}

interface ServiceInfo {
  id: string;
  name: string;
  serviceType: string;
  category?: string;
  costPrice?: number;
}

interface OrderItemsProps {
  order: {
    status: string;
    items: OrderItem[];
    total: number;
  };
  services: ServiceInfo[] | undefined;
  teams: { id: string; name: string; memberCount: number }[] | undefined;
  sentItems: Record<number, { sent: boolean; loading: boolean }>;
  onSendBot: (itemIndex: number) => void;
  onAssignTeam: (itemIndex: number) => void;
  onSplitJob: (itemIndex: number, remainingQty: number) => void;
  onPostToHub: (itemIndex: number, remainingQty: number) => void;
  onReassignJob: (job: OrderItemJob) => void;
}

function getServiceInfo(services: ServiceInfo[] | undefined, serviceId: string) {
  return services?.find((s) => s.id === serviceId);
}

function getRemainingQuantityForSplit(item: OrderItem) {
  const assignedQuantity =
    item.jobs?.reduce((sum, j) => sum + j.quantity, 0) || 0;
  return item.quantity - assignedQuantity;
}

function getRemainingQuantityForHub(item: OrderItem) {
  const assignedQuantity =
    item.jobs?.reduce(
      (sum, j) => (j.status !== "cancelled" ? sum + j.quantity : sum),
      0
    ) || 0;
  return item.quantity - item.completedQuantity - assignedQuantity;
}

const platformIcon = (category?: string) => {
  switch (category) {
    case "facebook":
      return <Facebook className="w-6 h-6 text-[#1877F2]" />;
    case "instagram":
      return <Instagram className="w-6 h-6 text-[#E4405F]" />;
    case "tiktok":
      return <Music2 className="w-6 h-6 text-black" />;
    default:
      return <Youtube className="w-6 h-6 text-[#FF0000]" />;
  }
};

export function OrderItems({
  order,
  services,
  teams,
  sentItems,
  onSendBot,
  onAssignTeam,
  onSplitJob,
  onPostToHub,
  onReassignJob,
}: OrderItemsProps) {
  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  return (
    <Card
      variant="elevated"
      padding="lg"
      className="border-none shadow-lg shadow-brand-primary/5"
    >
      <h2 className="font-bold text-lg text-brand-text-dark mb-6 flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-brand-primary/10 flex items-center justify-center text-brand-primary">
          <Package className="w-5 h-5" />
        </div>
        รายการสั่งซื้อ{" "}
        <Badge variant="default" className="ml-2">
          {order.items.length}
        </Badge>
      </h2>

      <div className="space-y-6">
        {order.items.map((item, index) => {
          const service = getServiceInfo(services, item.serviceId);
          const progress = (item.completedQuantity / item.quantity) * 100;
          const hasJobs = item.jobs && item.jobs.length > 0;
          const remainingQuantity = getRemainingQuantityForSplit(item);

          return (
            <div
              key={index}
              className="p-6 bg-brand-bg/30 border border-brand-border/50 rounded-2xl space-y-5 hover:border-brand-primary/20 transition-all"
            >
              {/* Item Header */}
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-white shadow-sm flex items-center justify-center text-2xl border border-brand-border/20">
                    {platformIcon(service?.category)}
                  </div>
                  <div>
                    <p className="font-bold text-lg text-brand-text-dark">
                      {service?.name || "บริการ"}
                    </p>
                    <div className="flex items-center gap-2 mt-1.5">
                      <Badge
                        variant={
                          service?.serviceType === "bot" ? "bot" : "human"
                        }
                        size="sm"
                        className="shadow-none border-none"
                      >
                        {service?.serviceType === "bot"
                          ? "Bot Service"
                          : "Real Human"}
                      </Badge>
                      <span className="text-sm font-medium text-brand-text-light px-2 py-0.5 bg-brand-bg rounded-md">
                        จำนวน {item.quantity.toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold text-brand-primary text-xl">
                    ฿{(item.subtotal || 0).toLocaleString()}
                  </p>
                  <p className="text-sm text-brand-text-light">
                    ฿{item.unitPrice || 0} / หน่วย
                  </p>
                </div>
              </div>

              {/* Target URL */}
              {item.targetUrl && (
                <div className="flex items-center gap-3 p-3 bg-white border border-brand-border/30 rounded-xl shadow-sm">
                  <div className="p-1.5 bg-brand-bg rounded-lg text-brand-text-light">
                    <ExternalLink className="w-4 h-4" />
                  </div>
                  <a
                    href={item.targetUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm font-medium text-brand-primary hover:underline truncate flex-1 font-mono"
                  >
                    {item.targetUrl}
                  </a>
                  <button
                    onClick={() => handleCopy(item.targetUrl!)}
                    className="p-1.5 hover:bg-brand-bg rounded-lg text-brand-text-light transition-colors"
                    title="Copy URL"
                  >
                    <Copy className="w-4 h-4" />
                  </button>
                </div>
              )}

              {/* Progress */}
              <div className="space-y-3 p-4 bg-white rounded-xl border border-brand-border/20 shadow-sm">
                <div className="flex justify-between text-sm items-end">
                  <span className="text-brand-text-light font-medium">
                    ความคืบหน้า
                  </span>
                  <div className="text-right">
                    <span className="font-bold text-brand-text-dark text-lg">
                      {item.completedQuantity.toLocaleString()}
                    </span>
                    <span className="text-brand-text-light mx-1">/</span>
                    <span className="text-brand-text-light">
                      {item.quantity.toLocaleString()}
                    </span>
                    <span className="ml-2 text-xs font-bold text-brand-primary bg-brand-primary/10 px-1.5 py-0.5 rounded">
                      {Math.round(progress)}%
                    </span>
                  </div>
                </div>
                <Progress value={progress} className="h-2.5" />
              </div>

              {/* Jobs List (human services) */}
              {hasJobs && service?.serviceType === "human" && (
                <div className="space-y-3 p-4 bg-white rounded-xl border border-brand-border/20 shadow-sm">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Briefcase className="w-4 h-4 text-brand-primary" />
                      <span className="text-sm font-medium text-brand-text-dark">
                        งานที่มอบหมาย ({item.jobs!.length})
                      </span>
                    </div>
                    <div className="flex gap-2">
                      {remainingQuantity > 0 &&
                        order.status === "processing" && (
                          <>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() =>
                                onSplitJob(index, remainingQuantity)
                              }
                              className="text-xs h-7"
                            >
                              <Plus className="w-3 h-3 mr-1" />
                              แบ่งงานเพิ่ม
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() =>
                                onPostToHub(
                                  index,
                                  getRemainingQuantityForHub(item)
                                )
                              }
                              className="text-xs h-7 text-brand-accent border-brand-accent/30 hover:bg-brand-accent/5"
                            >
                              <Globe className="w-3 h-3 mr-1" />
                              โพสต์ลง Hub
                            </Button>
                          </>
                        )}
                    </div>
                  </div>

                  <div className="space-y-2">
                    {item.jobs!.map((job) => (
                      <div
                        key={job.jobId}
                        className="flex items-center justify-between p-3 bg-brand-bg/50 rounded-lg border border-brand-border/30"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg bg-brand-primary/10 flex items-center justify-center">
                            <Users className="w-4 h-4 text-brand-primary" />
                          </div>
                          <div>
                            <p className="text-sm font-medium text-brand-text-dark">
                              {job.teamName}
                            </p>
                            <p className="text-xs text-brand-text-light">
                              {job.completedQuantity}/{job.quantity} หน่วย
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge
                            variant={
                              job.status === "completed"
                                ? "success"
                                : job.status === "cancelled"
                                  ? "error"
                                  : job.status === "in_progress" ||
                                      job.status === "pending_review"
                                    ? "info"
                                    : "warning"
                            }
                            size="sm"
                          >
                            {job.status === "completed"
                              ? "เสร็จสิ้น"
                              : job.status === "cancelled"
                                ? "ยกเลิก"
                                : job.status === "in_progress"
                                  ? "กำลังทำ"
                                  : job.status === "pending_review"
                                    ? "รอตรวจ"
                                    : "รอรับงาน"}
                          </Badge>
                          {job.status !== "completed" &&
                            job.status !== "cancelled" && (
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => onReassignJob(job)}
                                className="text-xs h-7 px-2 text-brand-text-light hover:text-brand-primary"
                                title="โยนงานไปทีมอื่น"
                              >
                                <ArrowRightLeft className="w-3 h-3" />
                              </Button>
                            )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Actions */}
              {order.status === "processing" && (
                <div className="pt-3 border-t border-brand-border/30">
                  {sentItems[index]?.sent ? (
                    <div className="flex items-center gap-2 p-3 bg-brand-success/10 border border-brand-success/30 rounded-xl">
                      <CheckCircle2 className="w-5 h-5 text-brand-success" />
                      <span className="text-sm font-medium text-brand-success">
                        {service?.serviceType === "bot"
                          ? "ส่ง API แล้ว"
                          : "มอบหมายงานแล้ว"}
                      </span>
                    </div>
                  ) : sentItems[index]?.loading ? (
                    <div className="flex items-center gap-2 p-3 bg-brand-info/10 border border-brand-info/30 rounded-xl">
                      <Loader2 className="w-5 h-5 text-brand-info animate-spin" />
                      <span className="text-sm font-medium text-brand-info">
                        กำลังส่ง...
                      </span>
                    </div>
                  ) : (
                    <div className="flex gap-2">
                      {service?.serviceType === "bot" ? (
                        <Button
                          variant="primary"
                          size="sm"
                          className="flex-1 h-11 rounded-xl font-medium shadow-md shadow-brand-primary/20"
                          onClick={() => onSendBot(index)}
                        >
                          <Zap className="w-4 h-4 mr-2" />
                          ส่ง Bot API
                        </Button>
                      ) : (
                        <Button
                          variant="primary"
                          size="sm"
                          className="flex-1 h-11 rounded-xl font-medium shadow-md shadow-brand-primary/20 bg-gradient-to-r from-brand-primary to-brand-primary/80"
                          onClick={() => onAssignTeam(index)}
                        >
                          <Users className="w-4 h-4 mr-2" />
                          มอบหมายงานให้ทีม
                        </Button>
                      )}
                    </div>
                  )}
                </div>
              )}

              {/* Pending payment notice */}
              {order.status === "pending" && (
                <div className="pt-3 border-t border-brand-border/30">
                  <div className="flex items-center gap-2 p-3 bg-brand-warning/10 border border-brand-warning/30 rounded-xl">
                    <AlertCircle className="w-5 h-5 text-brand-warning" />
                    <span className="text-sm font-medium text-brand-warning">
                      รอยืนยันชำระเงินก่อนส่งคำสั่งซื้อ
                    </span>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Total */}
      <div className="mt-8 pt-6 border-t border-brand-border/50 flex justify-between items-center">
        <span className="font-bold text-brand-text-dark text-lg">
          ยอดรวมทั้งหมด
        </span>
        <span className="text-3xl font-bold text-brand-primary">
          ฿{(order.total || 0).toLocaleString()}
        </span>
      </div>
    </Card>
  );
}
