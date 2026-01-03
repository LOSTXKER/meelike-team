"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { Card, Badge, Button, Textarea, Skeleton, Modal, Avatar } from "@/components/ui";
import { PlatformIcon, EmptyState, Breadcrumb } from "@/components/shared";
import { usePendingReviews, useWorkers, useTeamJobs, useSellerTeams } from "@/lib/api/hooks";
import { api } from "@/lib/api";
import { formatCurrency } from "@/lib/utils";
import type { Platform } from "@/types";
import {
  CheckCircle2,
  XCircle,
  Clock,
  ExternalLink,
  Image as ImageIcon,
  ThumbsUp,
  AlertCircle,
  Target,
  Star,
  Package,
  CheckCircle,
  Eye,
  ShieldCheck,
} from "lucide-react";

export default function TeamReviewPage() {
  const params = useParams();
  const teamId = params.id as string;
  
  const [showApproveModal, setShowApproveModal] = useState(false);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [rejectReason, setRejectReason] = useState("");
  const [selectedJobId, setSelectedJobId] = useState<string | null>(null);
  const [locallyRemovedIds, setLocallyRemovedIds] = useState<Set<string>>(new Set());
  const [isProcessing, setIsProcessing] = useState(false);

  // Use API hooks
  const { data: teams, isLoading: isLoadingTeams } = useSellerTeams();
  const { data: pendingReviewsData, isLoading: isLoadingReviews, refetch: refetchReviews } = usePendingReviews();
  const { data: workers, isLoading: isLoadingWorkers } = useWorkers();
  const { data: teamJobs, isLoading: isLoadingJobs } = useTeamJobs();

  const isLoading = isLoadingTeams || isLoadingReviews || isLoadingWorkers || isLoadingJobs;
  
  const currentTeam = useMemo(() => {
    return teams?.find((t) => t.id === teamId);
  }, [teams, teamId]);

  // Build pending review jobs from claims
  const pendingReviewJobs = useMemo(() => {
    if (!pendingReviewsData || !workers || !teamJobs) return [];
    
    return pendingReviewsData
      .filter(claim => !locallyRemovedIds.has(claim.id))
      .map(claim => {
        const worker = workers.find(w => w.id === claim.workerId);
        const job = teamJobs.find(j => j.id === claim.jobId);
        
        return {
          id: claim.id,
          orderId: job?.orderId || "",
          orderNumber: job?.orderNumber || `ORD-${claim.jobId?.slice(-4) || "0000"}`,
          serviceName: job?.serviceName || "Unknown Service",
          platform: job?.platform || "facebook",
          quantity: claim.quantity,
          completedQuantity: claim.actualQuantity || claim.quantity,
          pricePerUnit: claim.earnAmount / claim.quantity,
          workerPayout: claim.earnAmount,
          targetUrl: job?.targetUrl || "#",
          worker: worker || {
            id: claim.workerId,
            displayName: "Unknown",
            level: "bronze",
            rating: 0,
            totalJobsCompleted: 0,
          },
          submittedAt: claim.submittedAt,
          proofImages: claim.proofUrls || [],
          workerNote: claim.workerNote || "",
        };
      });
  }, [pendingReviewsData, workers, teamJobs, locallyRemovedIds]);

  const selectedJob = selectedJobId 
    ? pendingReviewJobs.find(j => j.id === selectedJobId) 
    : null;

  const handleApprove = async () => {
    if (!selectedJob) return;
    
    setIsProcessing(true);
    
    try {
      await api.seller.approveJobClaim(selectedJob.id);
      
      // Refetch to update the UI
      await refetchReviews();
      
      setLocallyRemovedIds(prev => new Set(prev).add(selectedJob.id));
      setShowApproveModal(false);
      setSelectedJobId(null);
      
      alert(`อนุมัติงาน ${selectedJob.serviceName} เรียบร้อย! ระบบจะสร้างรายการจ่ายเงิน ฿${selectedJob.workerPayout} ให้ @${selectedJob.worker.displayName}`);
    } catch (error) {
      console.error("Error approving job:", error);
      alert("เกิดข้อผิดพลาดในการอนุมัติงาน กรุณาลองใหม่อีกครั้ง");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleReject = async () => {
    if (!selectedJob || !rejectReason.trim()) return;
    
    setIsProcessing(true);
    
    try {
      await api.seller.rejectJobClaim(selectedJob.id, rejectReason);
      
      // Refetch to update the UI
      await refetchReviews();
      
      setLocallyRemovedIds(prev => new Set(prev).add(selectedJob.id));
      setShowRejectModal(false);
      setSelectedJobId(null);
      setRejectReason("");
      
      alert(`ปฏิเสธงาน ${selectedJob.serviceName} - ส่งกลับให้ Worker แก้ไข`);
    } catch (error) {
      console.error("Error rejecting job:", error);
      alert("เกิดข้อผิดพลาดในการปฏิเสธงาน กรุณาลองใหม่อีกครั้ง");
    } finally {
      setIsProcessing(false);
    }
  };

  const totalPayout = pendingReviewJobs.reduce((sum, j) => sum + j.workerPayout, 0);

  if (isLoading) {
    return (
      <div className="space-y-8 animate-fade-in max-w-7xl mx-auto">
        <Skeleton className="h-16 w-full rounded-xl" />
        <Skeleton className="h-24 w-full rounded-xl" />
        <div className="space-y-6">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-64 rounded-xl" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Breadcrumb */}
      <Breadcrumb />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center">
            <ShieldCheck className="w-5 h-5 text-amber-600" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-brand-text-dark">รอตรวจสอบ</h1>
            <p className="text-sm text-brand-text-light">ตรวจสอบงานของทีม {currentTeam?.name || ""}</p>
          </div>
        </div>

        {pendingReviewJobs.length > 0 && (
          <div className="flex items-center gap-3">
            <div className="text-right">
              <p className="text-xs text-brand-text-light">ยอดจ่ายรวม</p>
              <p className="text-lg font-bold text-brand-success">{formatCurrency(totalPayout)}</p>
            </div>
            <Button
              size="sm"
              onClick={async () => {
                if (confirm(`อนุมัติทั้งหมด ${pendingReviewJobs.length} งาน? จะสร้างรายการจ่ายเงินรวม ${formatCurrency(totalPayout)}`)) {
                  setIsProcessing(true);
                  try {
                    for (const job of pendingReviewJobs) {
                      await api.seller.approveJobClaim(job.id);
                    }
                    await refetchReviews();
                    setLocallyRemovedIds(new Set(pendingReviewJobs.map(j => j.id)));
                    alert(`อนุมัติงานทั้งหมด ${pendingReviewJobs.length} รายการเรียบร้อย!`);
                  } catch (error) {
                    console.error("Error approving all:", error);
                    alert("เกิดข้อผิดพลาดบางรายการ กรุณาตรวจสอบอีกครั้ง");
                  } finally {
                    setIsProcessing(false);
                  }
                }
              }}
              disabled={isProcessing}
            >
              <ThumbsUp className="w-4 h-4 mr-2" />
              {isProcessing ? "กำลังอนุมัติ..." : `อนุมัติทั้งหมด (${pendingReviewJobs.length})`}
            </Button>
          </div>
        )}
      </div>

      {/* Jobs Table */}
      <Card className="border-none shadow-md overflow-hidden">
        {/* Desktop Table */}
        <div className="hidden lg:block overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-brand-bg/50 border-b border-brand-border/30">
                <th className="text-left text-xs font-semibold text-brand-text-light uppercase tracking-wider px-4 py-3">งาน</th>
                <th className="text-left text-xs font-semibold text-brand-text-light uppercase tracking-wider px-4 py-3">Worker</th>
                <th className="text-center text-xs font-semibold text-brand-text-light uppercase tracking-wider px-4 py-3">จำนวน</th>
                <th className="text-center text-xs font-semibold text-brand-text-light uppercase tracking-wider px-4 py-3">หลักฐาน</th>
                <th className="text-right text-xs font-semibold text-brand-text-light uppercase tracking-wider px-4 py-3">ค่าจ้าง</th>
                <th className="text-center text-xs font-semibold text-brand-text-light uppercase tracking-wider px-4 py-3">ส่งเมื่อ</th>
                <th className="text-center text-xs font-semibold text-brand-text-light uppercase tracking-wider px-4 py-3 w-48">การกระทำ</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-brand-border/30">
              {pendingReviewJobs.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-4 py-16 text-center">
                    <div className="flex flex-col items-center">
                      <div className="w-14 h-14 rounded-full bg-emerald-100 flex items-center justify-center mb-3">
                        <CheckCircle2 className="w-7 h-7 text-emerald-500" />
                      </div>
                      <p className="font-medium text-brand-text-dark">ไม่มีงานรอตรวจสอบ</p>
                      <p className="text-sm text-brand-text-light mt-1">งานทั้งหมดได้รับการตรวจสอบเรียบร้อยแล้ว</p>
                      <Link href={`/seller/team/${teamId}/jobs`}>
                        <Button variant="outline" size="sm" className="mt-4">ดูงานทั้งหมด</Button>
                      </Link>
                    </div>
                  </td>
                </tr>
              ) : (
                pendingReviewJobs.map((job) => (
                  <tr key={job.id} className="hover:bg-brand-bg/30 transition-colors">
                    {/* Job Info */}
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-lg bg-brand-bg flex items-center justify-center shrink-0">
                          <PlatformIcon platform={job.platform as Platform} size="sm" />
                        </div>
                        <div className="min-w-0">
                          <p className="font-medium text-brand-text-dark truncate max-w-[200px]">{job.serviceName}</p>
                          <p className="text-xs text-brand-text-light font-mono">{job.orderNumber}</p>
                        </div>
                      </div>
                    </td>
                    
                    {/* Worker */}
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-2">
                        <Avatar fallback={job.worker.displayName} size="sm" />
                        <div>
                          <p className="font-medium text-brand-text-dark text-sm">@{job.worker.displayName}</p>
                          <div className="flex items-center gap-1 text-xs text-brand-text-light">
                            <Star className="w-3 h-3 text-amber-500 fill-amber-500" />
                            <span>{job.worker.rating}</span>
                          </div>
                        </div>
                      </div>
                    </td>
                    
                    {/* Quantity */}
                    <td className="px-4 py-4 text-center">
                      <span className="font-medium text-brand-text-dark">{job.completedQuantity}</span>
                      <span className="text-brand-text-light">/{job.quantity}</span>
                    </td>
                    
                    {/* Proof */}
                    <td className="px-4 py-4 text-center">
                      <div className="flex items-center justify-center gap-2">
                        {job.proofImages.length > 0 ? (
                          <button className="flex items-center gap-1.5 text-brand-primary hover:text-brand-primary-dark text-sm">
                            <ImageIcon className="w-4 h-4" />
                            <span>{job.proofImages.length} รูป</span>
                          </button>
                        ) : (
                          <span className="text-brand-text-light text-sm">-</span>
                        )}
                        <a
                          href={job.targetUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-1.5 rounded-lg hover:bg-brand-bg text-brand-text-light hover:text-brand-primary transition-colors"
                          title="เปิดลิงก์"
                        >
                          <ExternalLink className="w-4 h-4" />
                        </a>
                      </div>
                    </td>
                    
                    {/* Payout */}
                    <td className="px-4 py-4 text-right">
                      <span className="font-bold text-brand-success">{formatCurrency(job.workerPayout)}</span>
                    </td>
                    
                    {/* Time */}
                    <td className="px-4 py-4 text-center">
                      <span className="text-sm text-brand-text-light">
                        {job.submittedAt ? new Date(job.submittedAt).toLocaleDateString("th-TH", {
                          day: "numeric", month: "short", hour: "2-digit", minute: "2-digit"
                        }) : "-"}
                      </span>
                    </td>
                    
                    {/* Actions */}
                    <td className="px-4 py-4">
                      <div className="flex items-center justify-center gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          className="border-red-200 text-red-600 hover:bg-red-50"
                          onClick={() => {
                            setSelectedJobId(job.id);
                            setShowRejectModal(true);
                          }}
                        >
                          <XCircle className="w-4 h-4" />
                        </Button>
                        <Button
                          size="sm"
                          className="bg-emerald-500 hover:bg-emerald-600"
                          onClick={() => {
                            setSelectedJobId(job.id);
                            setShowApproveModal(true);
                          }}
                        >
                          <CheckCircle2 className="w-4 h-4 mr-1" />
                          อนุมัติ
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Mobile Cards */}
        <div className="lg:hidden">
          {pendingReviewJobs.length === 0 ? (
            <div className="p-8 text-center">
              <div className="w-14 h-14 rounded-full bg-emerald-100 flex items-center justify-center mx-auto mb-3">
                <CheckCircle2 className="w-7 h-7 text-emerald-500" />
              </div>
              <p className="font-medium text-brand-text-dark">ไม่มีงานรอตรวจสอบ</p>
              <p className="text-sm text-brand-text-light mt-1">งานทั้งหมดได้รับการตรวจสอบเรียบร้อยแล้ว</p>
              <Link href={`/seller/team/${teamId}/jobs`}>
                <Button variant="outline" size="sm" className="mt-4">ดูงานทั้งหมด</Button>
              </Link>
            </div>
          ) : (
            <div className="divide-y divide-brand-border/30">
              {pendingReviewJobs.map((job) => (
                <div key={job.id} className="p-4 space-y-3">
                  {/* Header */}
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-brand-bg flex items-center justify-center shrink-0">
                        <PlatformIcon platform={job.platform as Platform} size="md" />
                      </div>
                      <div>
                        <p className="font-medium text-brand-text-dark">{job.serviceName}</p>
                        <p className="text-xs text-brand-text-light font-mono">{job.orderNumber}</p>
                      </div>
                    </div>
                    <span className="font-bold text-brand-success">{formatCurrency(job.workerPayout)}</span>
                  </div>
                  
                  {/* Worker & Details */}
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                      <Avatar fallback={job.worker.displayName} size="sm" />
                      <span className="text-brand-text-dark">@{job.worker.displayName}</span>
                    </div>
                    <span className="text-brand-text-light">{job.completedQuantity}/{job.quantity}</span>
                  </div>
                  
                  {/* Actions */}
                  <div className="flex items-center gap-2 pt-2">
                    <Button
                      size="sm"
                      variant="outline"
                      className="flex-1 border-red-200 text-red-600"
                      onClick={() => {
                        setSelectedJobId(job.id);
                        setShowRejectModal(true);
                      }}
                    >
                      <XCircle className="w-4 h-4 mr-1" />
                      ปฏิเสธ
                    </Button>
                    <Button
                      size="sm"
                      className="flex-1 bg-emerald-500 hover:bg-emerald-600"
                      onClick={() => {
                        setSelectedJobId(job.id);
                        setShowApproveModal(true);
                      }}
                    >
                      <CheckCircle2 className="w-4 h-4 mr-1" />
                      อนุมัติ
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </Card>

      {/* Approve Modal */}
      <Modal
        isOpen={showApproveModal}
        onClose={() => {
          setShowApproveModal(false);
          setSelectedJobId(null);
        }}
        title="ยืนยันการอนุมัติ"
      >
        {selectedJob && (
          <div className="space-y-6">
            <div className="flex items-center gap-4 p-4 bg-brand-success/5 border border-brand-success/20 rounded-xl">
               <div className="p-3 bg-brand-success/10 rounded-full text-brand-success">
                  <CheckCircle className="w-6 h-6" />
               </div>
               <div>
                  <h4 className="font-bold text-brand-text-dark">อนุมัติงานนี้?</h4>
                  <p className="text-sm text-brand-text-light">ระบบจะโอนเงินให้ Worker ทันที</p>
               </div>
            </div>
            
            <div className="space-y-3 bg-brand-bg/50 p-4 rounded-xl border border-brand-border/30">
              <div className="flex justify-between text-sm">
                <span className="text-brand-text-light">งาน</span>
                <span className="font-medium text-brand-text-dark">{selectedJob.serviceName}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-brand-text-light">Worker</span>
                <span className="font-medium text-brand-text-dark">@{selectedJob.worker.displayName}</span>
              </div>
              <div className="h-px bg-brand-border/50 my-2"></div>
              <div className="flex justify-between items-center">
                <span className="text-brand-text-light">ยอดเงินที่โอน</span>
                <span className="font-bold text-lg text-brand-success">฿{selectedJob.workerPayout}</span>
              </div>
            </div>

            <div className="flex gap-3 justify-end pt-2">
              <Button
                variant="outline"
                onClick={() => {
                  setShowApproveModal(false);
                  setSelectedJobId(null);
                }}
                className="flex-1"
              >
                ยกเลิก
              </Button>
              <Button 
                onClick={handleApprove} 
                className="flex-1 bg-brand-success hover:bg-brand-success/90 shadow-lg shadow-brand-success/20 border-transparent"
                disabled={isProcessing}
                isLoading={isProcessing}
              >
                <CheckCircle2 className="w-4 h-4 mr-2" />
                {isProcessing ? "กำลังอนุมัติ..." : "ยืนยันอนุมัติ"}
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
          setSelectedJobId(null);
          setRejectReason("");
        }}
        title="ปฏิเสธงาน"
      >
        {selectedJob && (
          <div className="space-y-6">
            <div className="flex items-center gap-4 p-4 bg-red-50 border border-red-200 rounded-xl">
              <div className="p-3 bg-red-100 rounded-full text-red-600">
                <AlertCircle className="w-6 h-6" />
              </div>
              <div>
                <h4 className="font-bold text-brand-text-dark">ไม่อนุมัติงานนี้?</h4>
                <p className="text-sm text-brand-text-light">งานจะถูกส่งกลับให้ Worker แก้ไข</p>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-brand-text-dark">ระบุเหตุผลที่ปฏิเสธ</label>
              <Textarea
                placeholder="เช่น รูปหลักฐานไม่ชัดเจน, จำนวนยอดไม่ครบ..."
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
                rows={4}
                className="bg-white"
              />
              <p className="text-xs text-brand-text-light">* Worker จะเห็นข้อความนี้เพื่อนำไปแก้ไขงาน</p>
            </div>

            <div className="flex gap-3 justify-end pt-2">
              <Button
                variant="outline"
                onClick={() => {
                  setShowRejectModal(false);
                  setSelectedJobId(null);
                  setRejectReason("");
                }}
                className="flex-1"
              >
                ยกเลิก
              </Button>
              <Button
                className="flex-1 bg-red-500 hover:bg-red-600 text-white"
                onClick={handleReject}
                disabled={!rejectReason.trim() || isProcessing}
                isLoading={isProcessing}
              >
                <XCircle className="w-4 h-4 mr-2" />
                {isProcessing ? "กำลังปฏิเสธ..." : "ยืนยันปฏิเสธ"}
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
