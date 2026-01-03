"use client";

import { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import { Card, Badge, Button, Skeleton } from "@/components/ui";
import { PlatformIcon, EmptyState, StatsGrid } from "@/components/shared";
import { api } from "@/lib/api";
import type { OutsourceJob, Platform } from "@/types";
import {
  Globe,
  Plus,
  Eye,
  MessageCircle,
  Clock,
  DollarSign,
  Zap,
  CheckCircle2,
  XCircle,
  ArrowRight,
  Briefcase,
} from "lucide-react";

const statusConfig = {
  open: { label: "เปิดรับ bid", color: "warning" as const },
  in_progress: { label: "กำลังทำ", color: "info" as const },
  completed: { label: "เสร็จสิ้น", color: "success" as const },
  cancelled: { label: "ยกเลิก", color: "error" as const },
};

export default function SellerOutsourcePage() {
  const [outsourceJobs, setOutsourceJobs] = useState<OutsourceJob[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadJobs = async () => {
      try {
        const jobs = await api.hub.getOutsourceJobsList({ sellerId: "seller-1" });
        setOutsourceJobs(jobs);
      } catch (error) {
        console.error("Error loading outsource jobs:", error);
      } finally {
        setIsLoading(false);
      }
    };
    loadJobs();
  }, []);

  // Stats
  const stats = useMemo(() => {
    const openJobs = outsourceJobs.filter(j => j.status === "open").length;
    const inProgressJobs = outsourceJobs.filter(j => j.status === "in_progress").length;
    const totalBids = outsourceJobs.reduce((sum, j) => sum + j.bidsCount, 0);
    const totalBudget = outsourceJobs.reduce((sum, j) => sum + j.budget, 0);

    return [
      {
        label: "รอ Bid",
        value: openJobs,
        icon: Globe,
        iconColor: "text-brand-warning",
        iconBgColor: "bg-brand-warning/10",
      },
      {
        label: "กำลังทำ",
        value: inProgressJobs,
        icon: Briefcase,
        iconColor: "text-brand-info",
        iconBgColor: "bg-brand-info/10",
      },
      {
        label: "Bids ทั้งหมด",
        value: totalBids,
        icon: MessageCircle,
        iconColor: "text-brand-accent",
        iconBgColor: "bg-brand-accent/10",
      },
      {
        label: "งบประมาณรวม",
        value: `฿${totalBudget.toLocaleString()}`,
        icon: DollarSign,
        iconColor: "text-brand-success",
        iconBgColor: "bg-brand-success/10",
      },
    ];
  }, [outsourceJobs]);

  const getTimeRemaining = (deadline: string) => {
    const now = new Date();
    const end = new Date(deadline);
    const diff = end.getTime() - now.getTime();

    if (diff <= 0) return "หมดเวลา";

    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(hours / 24);

    if (days > 0) return `${days} วัน`;
    return `${hours} ชม.`;
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-brand-text-dark flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-brand-accent/10 flex items-center justify-center">
            <Globe className="w-5 h-5 text-brand-accent" />
          </div>
          งานที่โพสต์ใน Hub
        </h1>
        <p className="text-brand-text-light text-sm mt-1 ml-[52px]">
          จัดการงานที่คุณโพสต์ไว้ในตลาด รอทีมอื่นมา bid
        </p>
      </div>

        {/* Stats */}
        {isLoading ? (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <Skeleton key={i} className="h-[100px] rounded-xl" />
            ))}
          </div>
        ) : (
          <StatsGrid stats={stats} columns={4} />
        )}

        {/* Jobs List */}
        {isLoading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-[200px] rounded-xl" />
            ))}
          </div>
        ) : outsourceJobs.length === 0 ? (
          <EmptyState
            icon={Globe}
            title="ยังไม่มีงานที่โพสต์"
            description="เมื่อคุณโพสต์งานลง Hub จากหน้า Order Detail งานจะแสดงที่นี่"
          />
        ) : (
          <div className="space-y-4">
            {outsourceJobs.map((job) => (
              <Card key={job.id} variant="elevated" padding="lg" className="border-none shadow-lg shadow-brand-primary/5">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  {/* Left: Job Info */}
                  <div className="flex items-start gap-4 flex-1">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-brand-accent to-brand-primary flex items-center justify-center">
                      <PlatformIcon platform={job.platform as Platform} className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="font-bold text-brand-text-dark text-lg">
                          {job.title}
                        </h3>
                        <Badge variant={statusConfig[job.status].color} size="sm">
                          {statusConfig[job.status].label}
                        </Badge>
                        {job.isUrgent && (
                          <Badge variant="error" size="sm">
                            <Zap className="w-3 h-3 mr-1" />
                            ด่วน
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-brand-text-light mt-1 line-clamp-1">
                        {job.description}
                      </p>
                      <div className="flex items-center gap-4 mt-2 text-xs text-brand-text-light">
                        <span className="flex items-center gap-1">
                          <Eye className="w-3 h-3" />
                          {job.views} เข้าชม
                        </span>
                        <span className="flex items-center gap-1 font-medium text-brand-accent">
                          <MessageCircle className="w-3 h-3" />
                          {job.bidsCount} bids
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {getTimeRemaining(job.deadline)}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Right: Price & Actions */}
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <p className="text-2xl font-bold text-brand-success">
                        ฿{job.budget.toLocaleString()}
                      </p>
                      <p className="text-xs text-brand-text-light">
                        {job.quantity.toLocaleString()} หน่วย
                      </p>
                    </div>
                    <Link href={`/seller/outsource/${job.id}`}>
                      <Button variant={job.bidsCount > 0 ? "primary" : "outline"} className="shadow-md">
                        {job.bidsCount > 0 ? (
                          <>
                            ดู Bids ({job.bidsCount})
                            <ArrowRight className="w-4 h-4 ml-2" />
                          </>
                        ) : (
                          "ดูรายละเอียด"
                        )}
                      </Button>
                    </Link>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
    </div>
  );
}
