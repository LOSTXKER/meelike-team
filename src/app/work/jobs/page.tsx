"use client";

import { useState } from "react";
import Link from "next/link";
import { Card, Badge, Button, Progress } from "@/components/ui";
import { mockJobs, mockTeams } from "@/lib/mock-data";
import {
  Briefcase,
  Clock,
  CheckCircle2,
  PlayCircle,
  ExternalLink,
  ChevronRight,
  Timer,
  Target,
  Upload,
  Package,
  Facebook,
  Instagram,
  Music2,
  Youtube,
  Users,
} from "lucide-react";

type TabType = "in_progress" | "pending_review" | "completed";

const tabConfig = {
  in_progress: { label: "กำลังทำ", icon: <PlayCircle className="w-4 h-4" /> },
  pending_review: { label: "รอตรวจสอบ", icon: <Clock className="w-4 h-4" /> },
  completed: { label: "เสร็จแล้ว", icon: <CheckCircle2 className="w-4 h-4" /> },
};

export default function WorkerJobsPage() {
  const [activeTab, setActiveTab] = useState<TabType>("in_progress");

  // Mock jobs data for worker
  const workerJobs = {
    in_progress: [
      {
        id: "job-1",
        teamName: "JohnBoost Team",
        serviceName: "ไลค์ Facebook",
        platform: "facebook",
        type: "human",
        targetUrl: "https://facebook.com/post/123",
        quantity: 100,
        completedQuantity: 65,
        pricePerUnit: 0.2,
        deadline: new Date(Date.now() + 3600000 * 2).toISOString(),
        status: "in_progress",
      },
      {
        id: "job-2",
        teamName: "SocialPro Team",
        serviceName: "Follow Instagram",
        platform: "instagram",
        type: "human",
        targetUrl: "https://instagram.com/user123",
        quantity: 50,
        completedQuantity: 20,
        pricePerUnit: 0.3,
        deadline: new Date(Date.now() + 3600000 * 5).toISOString(),
        status: "in_progress",
      },
    ],
    pending_review: [
      {
        id: "job-3",
        teamName: "JohnBoost Team",
        serviceName: "เม้น Facebook",
        platform: "facebook",
        type: "human",
        targetUrl: "https://facebook.com/post/456",
        quantity: 30,
        completedQuantity: 30,
        pricePerUnit: 1.5,
        submittedAt: new Date(Date.now() - 3600000).toISOString(),
        status: "pending_review",
      },
      {
        id: "job-4",
        teamName: "BoostKing Team",
        serviceName: "ไลค์ Facebook",
        platform: "facebook",
        type: "human",
        targetUrl: "https://facebook.com/post/789",
        quantity: 50,
        completedQuantity: 50,
        pricePerUnit: 0.2,
        submittedAt: new Date(Date.now() - 7200000).toISOString(),
        status: "pending_review",
      },
      {
        id: "job-5",
        teamName: "SocialPro Team",
        serviceName: "View TikTok",
        platform: "tiktok",
        type: "human",
        targetUrl: "https://tiktok.com/@user/video/123",
        quantity: 200,
        completedQuantity: 200,
        pricePerUnit: 0.08,
        submittedAt: new Date(Date.now() - 10800000).toISOString(),
        status: "pending_review",
      },
    ],
    completed: [
      {
        id: "job-6",
        teamName: "JohnBoost Team",
        serviceName: "ไลค์ Facebook",
        platform: "facebook",
        type: "human",
        targetUrl: "https://facebook.com/post/111",
        quantity: 100,
        completedQuantity: 100,
        pricePerUnit: 0.2,
        completedAt: new Date(Date.now() - 86400000).toISOString(),
        earnings: 20,
        status: "completed",
      },
      {
        id: "job-7",
        teamName: "SocialPro Team",
        serviceName: "Follow Instagram",
        platform: "instagram",
        type: "human",
        targetUrl: "https://instagram.com/user456",
        quantity: 80,
        completedQuantity: 80,
        pricePerUnit: 0.3,
        completedAt: new Date(Date.now() - 172800000).toISOString(),
        earnings: 24,
        status: "completed",
      },
    ],
  };

  const currentJobs = workerJobs[activeTab];

  const getPlatformEmoji = (platform: string) => {
    switch (platform) {
      case "facebook": return <Facebook className="w-4 h-4" />;
      case "instagram": return <Instagram className="w-4 h-4" />;
      case "tiktok": return <Music2 className="w-4 h-4" />;
      case "youtube": return <Youtube className="w-4 h-4" />;
      default: return <Package className="w-4 h-4" />;
    }
  };

  const getTimeRemaining = (deadline: string) => {
    const diff = new Date(deadline).getTime() - Date.now();
    const hours = Math.floor(diff / 3600000);
    const minutes = Math.floor((diff % 3600000) / 60000);
    return `${hours}ชม. ${minutes}น.`;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-brand-text-dark flex items-center gap-2">
          <Briefcase className="w-7 h-7 text-brand-primary" />
          งานของฉัน
        </h1>
        <p className="text-brand-text-light mt-1">
          จัดการงานทั้งหมดที่คุณรับมา
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        <Card variant="bordered" padding="md" className="text-center">
          <div className="text-2xl font-bold text-brand-warning">
            {workerJobs.in_progress.length}
          </div>
          <p className="text-sm text-brand-text-light">กำลังทำ</p>
        </Card>
        <Card variant="bordered" padding="md" className="text-center">
          <div className="text-2xl font-bold text-brand-info">
            {workerJobs.pending_review.length}
          </div>
          <p className="text-sm text-brand-text-light">รอตรวจสอบ</p>
        </Card>
        <Card variant="bordered" padding="md" className="text-center">
          <div className="text-2xl font-bold text-brand-success">
            {workerJobs.completed.length}
          </div>
          <p className="text-sm text-brand-text-light">เสร็จแล้ว</p>
        </Card>
      </div>

      {/* Tabs */}
      <div className="flex rounded-lg bg-brand-bg p-1">
        {(Object.keys(tabConfig) as TabType[]).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg font-medium transition-all ${
              activeTab === tab
                ? "bg-brand-surface text-brand-primary shadow-sm"
                : "text-brand-text-light hover:text-brand-text-dark"
            }`}
          >
            {tabConfig[tab].icon}
            <span className="hidden sm:inline">{tabConfig[tab].label}</span>
            <Badge variant={tab === "pending_review" ? "warning" : "default"} size="sm">
              {workerJobs[tab].length}
            </Badge>
          </button>
        ))}
      </div>

      {/* Jobs List */}
      <div className="space-y-4">
        {currentJobs.length === 0 ? (
          <Card variant="bordered" padding="lg" className="text-center">
            <div className="py-8 space-y-3">
              <Briefcase className="w-12 h-12 text-brand-text-light mx-auto" />
              <p className="text-brand-text-light">ไม่มีงานในหมวดนี้</p>
            </div>
          </Card>
        ) : (
          currentJobs.map((job) => (
            <Card key={job.id} variant="bordered" padding="md" className="hover:shadow-md transition-shadow">
              <div className="space-y-4">
                {/* Header */}
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="text-3xl flex items-center justify-center w-12 h-12 rounded-lg bg-brand-bg">
                      {getPlatformEmoji(job.platform)}
                    </div>
                    <div>
                      <p className="font-semibold text-brand-text-dark">
                        {job.serviceName}
                      </p>
                      <div className="flex items-center gap-2 text-sm text-brand-text-light">
                        <span><Users className="w-4 h-4 inline-block mr-1" />{job.teamName}</span>
                        <Badge variant="success" size="sm">คนจริง</Badge>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-brand-primary">
                      ฿{(job.quantity * job.pricePerUnit).toFixed(0)}
                    </p>
                    <p className="text-xs text-brand-text-light">
                      ฿{job.pricePerUnit}/หน่วย
                    </p>
                  </div>
                </div>

                {/* Progress */}
                {activeTab === "in_progress" && (
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-brand-text-light flex items-center gap-1">
                        <Target className="w-4 h-4" />
                        ความคืบหน้า
                      </span>
                      <span className="font-medium text-brand-text-dark">
                        {job.completedQuantity}/{job.quantity}
                      </span>
                    </div>
                    <Progress
                      value={(job.completedQuantity / job.quantity) * 100}
                    />
                    <div className="flex items-center justify-between text-xs">
                      <a
                        href={job.targetUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-brand-primary hover:underline flex items-center gap-1"
                      >
                        <ExternalLink className="w-3 h-3" />
                        ดูลิงก์งาน
                      </a>
                      <span className="text-brand-warning flex items-center gap-1">
                        <Timer className="w-3 h-3" />
                        เหลือ {getTimeRemaining(job.deadline!)}
                      </span>
                    </div>
                  </div>
                )}

                {/* Pending Review Info */}
                {activeTab === "pending_review" && (
                  <div className="flex items-center justify-between text-sm bg-brand-bg rounded-lg p-3">
                    <span className="text-brand-text-light">
                      ส่งงานเมื่อ{" "}
                      {new Date(job.submittedAt!).toLocaleDateString("th-TH", {
                        day: "numeric",
                        month: "short",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                    <Badge variant="warning">รอ Seller ตรวจสอบ</Badge>
                  </div>
                )}

                {/* Completed Info */}
                {activeTab === "completed" && (
                  <div className="flex items-center justify-between text-sm bg-brand-success/10 rounded-lg p-3">
                    <span className="text-brand-text-light">
                      เสร็จเมื่อ{" "}
                      {new Date(job.completedAt!).toLocaleDateString("th-TH", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </span>
                    <span className="font-semibold text-brand-success">
                      +฿{job.earnings}
                    </span>
                  </div>
                )}

                {/* Actions */}
                {activeTab === "in_progress" && (
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" className="flex-1">
                      <ExternalLink className="w-4 h-4 mr-1" />
                      เปิดลิงก์
                    </Button>
                    <Button size="sm" className="flex-1">
                      <Upload className="w-4 h-4 mr-1" />
                      ส่งงาน
                    </Button>
                  </div>
                )}
              </div>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}

