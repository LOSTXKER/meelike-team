"use client";

import { useState } from "react";
import Link from "next/link";
import { Card, Badge, Button, Progress, Modal, Textarea } from "@/components/ui";
import { mockWorkers } from "@/lib/mock-data";
import {
  ArrowLeft,
  CheckCircle2,
  XCircle,
  Clock,
  ExternalLink,
  Image as ImageIcon,
  MessageSquare,
  ThumbsUp,
  ThumbsDown,
  AlertCircle,
  Target,
  User,
  Star,
  Package,
  Facebook,
  Instagram,
  Music2,
  Youtube,
} from "lucide-react";

// Mock pending review jobs
const pendingReviewJobs = [
  {
    id: "job-3",
    orderId: "order-3",
    orderNumber: "ORD-2024-003",
    serviceName: "ไลค์ Facebook (คนไทยจริง)",
    platform: "facebook",
    quantity: 100,
    completedQuantity: 100,
    pricePerUnit: 0.2,
    workerPayout: 20,
    targetUrl: "https://facebook.com/post/yyy",
    worker: mockWorkers[1],
    submittedAt: new Date(Date.now() - 3600000).toISOString(),
    proofImages: ["/proofs/job3-1.jpg", "/proofs/job3-2.jpg"],
    workerNote: "ทำครบ 100 ไลค์แล้วค่ะ แคปหลักฐานให้ด้วย",
  },
  {
    id: "job-5",
    orderId: "order-5",
    orderNumber: "ORD-2024-005",
    serviceName: "ไลค์ Facebook (คนไทยจริง)",
    platform: "facebook",
    quantity: 50,
    completedQuantity: 50,
    pricePerUnit: 0.2,
    workerPayout: 10,
    targetUrl: "https://facebook.com/post/zzz",
    worker: mockWorkers[2],
    submittedAt: new Date(Date.now() - 7200000).toISOString(),
    proofImages: ["/proofs/job5-1.jpg"],
    workerNote: "เสร็จแล้วครับ",
  },
  {
    id: "job-6",
    orderId: "order-6",
    orderNumber: "ORD-2024-006",
    serviceName: "เม้น Facebook (คนไทยจริง)",
    platform: "facebook",
    quantity: 30,
    completedQuantity: 30,
    pricePerUnit: 1.5,
    workerPayout: 45,
    targetUrl: "https://facebook.com/post/aaa",
    worker: mockWorkers[0],
    submittedAt: new Date(Date.now() - 10800000).toISOString(),
    proofImages: [],
    workerNote: "เม้นครบ 30 เม้นแล้วค่ะ ตามที่กำหนด",
  },
  {
    id: "job-7",
    orderId: "order-7",
    orderNumber: "ORD-2024-007",
    serviceName: "Follow Instagram (คนไทยจริง)",
    platform: "instagram",
    quantity: 80,
    completedQuantity: 80,
    pricePerUnit: 0.3,
    workerPayout: 24,
    targetUrl: "https://instagram.com/shop_abc",
    worker: mockWorkers[0],
    submittedAt: new Date(Date.now() - 14400000).toISOString(),
    proofImages: ["/proofs/job7-1.jpg", "/proofs/job7-2.jpg", "/proofs/job7-3.jpg"],
    workerNote: "Follow ครบ 80 คนแล้วค่ะ",
  },
  {
    id: "job-8",
    orderId: "order-8",
    orderNumber: "ORD-2024-008",
    serviceName: "View TikTok (คนไทยจริง)",
    platform: "tiktok",
    quantity: 200,
    completedQuantity: 200,
    pricePerUnit: 0.08,
    workerPayout: 16,
    targetUrl: "https://tiktok.com/@user/video/xxx",
    worker: mockWorkers[1],
    submittedAt: new Date(Date.now() - 18000000).toISOString(),
    proofImages: [],
    workerNote: "ดูครบแล้วครับ",
  },
];

export default function TeamReviewPage() {
  const [jobs, setJobs] = useState(pendingReviewJobs);
  const [selectedJob, setSelectedJob] = useState<typeof pendingReviewJobs[0] | null>(null);
  const [showApproveModal, setShowApproveModal] = useState(false);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [rejectReason, setRejectReason] = useState("");

  const handleApprove = () => {
    if (selectedJob) {
      setJobs(jobs.filter((j) => j.id !== selectedJob.id));
      setShowApproveModal(false);
      setSelectedJob(null);
      alert(`อนุมัติงาน ${selectedJob.serviceName} เรียบร้อย! จ่ายเงิน ฿${selectedJob.workerPayout} ให้ @${selectedJob.worker.displayName}`);
    }
  };

  const handleReject = () => {
    if (selectedJob) {
      setJobs(jobs.filter((j) => j.id !== selectedJob.id));
      setShowRejectModal(false);
      setSelectedJob(null);
      setRejectReason("");
      alert(`ปฏิเสธงาน ${selectedJob.serviceName} - ส่งกลับให้ Worker แก้ไข`);
    }
  };

  const getPlatformEmoji = (platform: string) => {
    switch (platform) {
      case "facebook": return <Facebook className="w-4 h-4" />;
      case "instagram": return <Instagram className="w-4 h-4" />;
      case "tiktok": return <Music2 className="w-4 h-4" />;
      case "youtube": return <Youtube className="w-4 h-4" />;
      default: return <Package className="w-4 h-4" />;
    }
  };

  const totalPayout = jobs.reduce((sum, j) => sum + j.workerPayout, 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/seller/team">
            <button className="p-2 hover:bg-brand-bg rounded-lg transition-colors">
              <ArrowLeft className="w-5 h-5 text-brand-text-dark" />
            </button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-brand-text-dark flex items-center gap-2">
              <CheckCircle2 className="w-7 h-7 text-brand-warning" />
              รอตรวจสอบ
            </h1>
            <p className="text-brand-text-light mt-1">
              ตรวจสอบและอนุมัติงานจาก Worker
            </p>
          </div>
        </div>
        <div className="text-right">
          <p className="text-sm text-brand-text-light">รอตรวจสอบ</p>
          <p className="text-2xl font-bold text-brand-warning">{jobs.length} งาน</p>
          <p className="text-sm text-brand-text-light">
            รวม <span className="text-brand-success font-medium">฿{totalPayout}</span>
          </p>
        </div>
      </div>

      {/* Quick Actions */}
      {jobs.length > 0 && (
        <Card variant="bordered" padding="md" className="bg-brand-info/5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <AlertCircle className="w-5 h-5 text-brand-info" />
              <span className="text-brand-text-dark">
                มี {jobs.length} งานรอตรวจสอบ
              </span>
            </div>
            <Button
              size="sm"
              onClick={() => {
                if (confirm(`อนุมัติทั้งหมด ${jobs.length} งาน?`)) {
                  setJobs([]);
                  alert("อนุมัติงานทั้งหมดเรียบร้อย!");
                }
              }}
            >
              <ThumbsUp className="w-4 h-4 mr-2" />
              อนุมัติทั้งหมด
            </Button>
          </div>
        </Card>
      )}

      {/* Jobs List */}
      {jobs.length === 0 ? (
        <Card variant="bordered" padding="lg" className="text-center">
          <div className="py-8 space-y-3">
            <CheckCircle2 className="w-16 h-16 text-brand-success mx-auto" />
            <h3 className="font-semibold text-brand-text-dark text-xl">
              ไม่มีงานรอตรวจสอบ
            </h3>
            <p className="text-brand-text-light">
              งานทั้งหมดได้รับการตรวจสอบแล้ว
            </p>
            <Link href="/seller/team/jobs">
              <Button variant="outline" className="mt-4">
                ดูงานทั้งหมด
              </Button>
            </Link>
          </div>
        </Card>
      ) : (
        <div className="space-y-4">
          {jobs.map((job) => (
            <Card key={job.id} variant="bordered" padding="lg">
              <div className="space-y-4">
                {/* Job Header */}
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-4">
                    <div className="text-4xl">
                      {getPlatformEmoji(job.platform)}
                    </div>
                    <div>
                      <p className="font-semibold text-brand-text-dark text-lg">
                        {job.serviceName}
                      </p>
                      <div className="flex items-center gap-3 text-sm text-brand-text-light mt-1">
                        <span className="flex items-center gap-1">
                          <Package className="w-4 h-4" />
                          {job.orderNumber}
                        </span>
                        <span>
                          <Target className="w-3 h-3 inline mr-1" />
                          {job.completedQuantity}/{job.quantity}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-xl font-bold text-brand-success">
                      ฿{job.workerPayout}
                    </p>
                    <p className="text-xs text-brand-text-light">
                      ค่าจ้าง Worker
                    </p>
                  </div>
                </div>

                {/* Worker Info */}
                <div className="flex items-center gap-3 p-3 bg-brand-bg rounded-lg">
                  <div className="w-10 h-10 bg-brand-primary/10 rounded-full flex items-center justify-center">
                    <User className="w-5 h-5 text-brand-primary" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-brand-text-dark">
                      @{job.worker.displayName}
                    </p>
                    <div className="flex items-center gap-2 text-sm text-brand-text-light">
                      <span className="flex items-center gap-1">
                        <Star className="w-3 h-3 text-brand-warning" />
                        {job.worker.rating}
                      </span>
                      <span>•</span>
                      <span>{job.worker.totalJobsCompleted} งาน</span>
                    </div>
                  </div>
                  <Badge variant="success" size="sm">
                    {job.worker.level}
                  </Badge>
                </div>

                {/* Worker Note */}
                {job.workerNote && (
                  <div className="p-3 bg-brand-info/10 rounded-lg">
                    <p className="text-sm text-brand-text-light flex items-start gap-2">
                      <MessageSquare className="w-4 h-4 shrink-0 mt-0.5" />
                      "{job.workerNote}"
                    </p>
                  </div>
                )}

                {/* Proof Images */}
                {job.proofImages.length > 0 && (
                  <div>
                    <p className="text-sm font-medium text-brand-text-dark mb-2">
                      📎 หลักฐาน ({job.proofImages.length})
                    </p>
                    <div className="flex gap-2 overflow-x-auto">
                      {job.proofImages.map((_, index) => (
                        <div
                          key={index}
                          className="w-20 h-20 bg-brand-bg rounded-lg flex items-center justify-center shrink-0"
                        >
                          <ImageIcon className="w-8 h-8 text-brand-text-light" />
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Target Link */}
                <a
                  href={job.targetUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-sm text-brand-primary hover:underline"
                >
                  <ExternalLink className="w-4 h-4" />
                  ดูลิงก์งาน
                </a>

                {/* Submitted Time */}
                <div className="flex items-center justify-between text-sm text-brand-text-light">
                  <span className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    ส่งเมื่อ{" "}
                    {new Date(job.submittedAt).toLocaleDateString("th-TH", {
                      day: "numeric",
                      month: "short",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                </div>

                {/* Actions */}
                <div className="flex gap-3 pt-2 border-t border-brand-border">
                  <Button
                    variant="outline"
                    className="flex-1 text-brand-error hover:bg-brand-error/10"
                    onClick={() => {
                      setSelectedJob(job);
                      setShowRejectModal(true);
                    }}
                  >
                    <XCircle className="w-4 h-4 mr-2" />
                    ปฏิเสธ
                  </Button>
                  <Button
                    className="flex-1"
                    onClick={() => {
                      setSelectedJob(job);
                      setShowApproveModal(true);
                    }}
                  >
                    <CheckCircle2 className="w-4 h-4 mr-2" />
                    อนุมัติ
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Approve Modal */}
      <Modal
        isOpen={showApproveModal}
        onClose={() => {
          setShowApproveModal(false);
          setSelectedJob(null);
        }}
        title="ยืนยันการอนุมัติ"
      >
        {selectedJob && (
          <div className="space-y-4">
            <div className="p-4 bg-brand-success/10 rounded-lg">
              <p className="font-medium text-brand-text-dark mb-2">
                {selectedJob.serviceName}
              </p>
              <div className="flex justify-between text-sm">
                <span className="text-brand-text-light">จำนวน</span>
                <span className="text-brand-text-dark">
                  {selectedJob.completedQuantity} หน่วย
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-brand-text-light">Worker</span>
                <span className="text-brand-text-dark">
                  @{selectedJob.worker.displayName}
                </span>
              </div>
              <div className="flex justify-between text-sm mt-2 pt-2 border-t border-brand-border">
                <span className="text-brand-text-light">ค่าจ้าง</span>
                <span className="font-bold text-brand-success">
                  ฿{selectedJob.workerPayout}
                </span>
              </div>
            </div>

            <p className="text-sm text-brand-text-light">
              เมื่ออนุมัติแล้ว ระบบจะโอนเงินค่าจ้างให้ Worker โดยอัตโนมัติ
            </p>

            <div className="flex gap-3 justify-end">
              <Button
                variant="outline"
                onClick={() => {
                  setShowApproveModal(false);
                  setSelectedJob(null);
                }}
              >
                ยกเลิก
              </Button>
              <Button onClick={handleApprove}>
                <CheckCircle2 className="w-4 h-4 mr-2" />
                อนุมัติ
              </Button>
            </div>
          </div>
        )}
      </Modal>

      {/* Reject Modal */}
      <Modal
        isOpen={showRejectModal}
        onClose={() => {
          setShowRejectModal(false);
          setSelectedJob(null);
          setRejectReason("");
        }}
        title="ปฏิเสธงาน"
      >
        {selectedJob && (
          <div className="space-y-4">
            <div className="p-4 bg-brand-error/10 rounded-lg">
              <p className="font-medium text-brand-text-dark">
                {selectedJob.serviceName}
              </p>
              <p className="text-sm text-brand-text-light mt-1">
                Worker: @{selectedJob.worker.displayName}
              </p>
            </div>

            <Textarea
              label="เหตุผลที่ปฏิเสธ"
              placeholder="อธิบายเหตุผลให้ Worker ทราบ..."
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              rows={3}
            />

            <p className="text-sm text-brand-text-light">
              งานจะถูกส่งกลับให้ Worker แก้ไขใหม่
            </p>

            <div className="flex gap-3 justify-end">
              <Button
                variant="outline"
                onClick={() => {
                  setShowRejectModal(false);
                  setSelectedJob(null);
                  setRejectReason("");
                }}
              >
                ยกเลิก
              </Button>
              <Button
                variant="outline"
                className="text-brand-error hover:bg-brand-error/10"
                onClick={handleReject}
                disabled={!rejectReason.trim()}
              >
                <XCircle className="w-4 h-4 mr-2" />
                ปฏิเสธ
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}

