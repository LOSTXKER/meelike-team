"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { Card, Badge, Button, Dialog, Textarea, Skeleton, Modal } from "@/components/ui";
import { Container, Section, VStack, HStack } from "@/components/layout";
import { PageHeader, PlatformIcon, EmptyState } from "@/components/shared";
import { usePendingReviews, useWorkers, useSellerJobs, useSellerTeams } from "@/lib/api/hooks";
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
} from "lucide-react";

export default function TeamReviewPage() {
  const params = useParams();
  const teamId = params.id as string;
  
  const [showApproveModal, setShowApproveModal] = useState(false);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [rejectReason, setRejectReason] = useState("");
  const [selectedJobId, setSelectedJobId] = useState<string | null>(null);
  const [locallyRemovedIds, setLocallyRemovedIds] = useState<Set<string>>(new Set());

  // Use API hooks
  const { data: teams, isLoading: isLoadingTeams } = useSellerTeams();
  const { data: pendingReviewsData, isLoading: isLoadingReviews } = usePendingReviews();
  const { data: workers, isLoading: isLoadingWorkers } = useWorkers();
  const { data: jobs, isLoading: isLoadingJobs } = useSellerJobs();

  const isLoading = isLoadingTeams || isLoadingReviews || isLoadingWorkers || isLoadingJobs;
  
  const currentTeam = useMemo(() => {
    return teams?.find((t) => t.id === teamId);
  }, [teams, teamId]);

  // Build pending review jobs from claims
  const pendingReviewJobs = useMemo(() => {
    if (!pendingReviewsData || !workers || !jobs) return [];
    
    return pendingReviewsData
      .filter(claim => !locallyRemovedIds.has(claim.id))
      .map(claim => {
        const worker = workers.find(w => w.id === claim.workerId);
        const job = jobs.find(j => j.id === claim.jobId);
        
        return {
          id: claim.id,
          orderId: job?.id || "",
          orderNumber: `ORD-${claim.jobId?.slice(-4) || "0000"}`,
          serviceName: job?.title || "Unknown Service",
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
          proofImages: [] as string[],
          workerNote: claim.workerNote || "",
        };
      });
  }, [pendingReviewsData, workers, jobs, locallyRemovedIds]);

  const selectedJob = selectedJobId 
    ? pendingReviewJobs.find(j => j.id === selectedJobId) 
    : null;

  const handleApprove = () => {
    if (selectedJob) {
      setLocallyRemovedIds(prev => new Set(prev).add(selectedJob.id));
      setShowApproveModal(false);
      setSelectedJobId(null);
      alert(`อนุมัติงาน ${selectedJob.serviceName} เรียบร้อย! จ่ายเงิน ฿${selectedJob.workerPayout} ให้ @${selectedJob.worker.displayName}`);
    }
  };

  const handleReject = () => {
    if (selectedJob) {
      setLocallyRemovedIds(prev => new Set(prev).add(selectedJob.id));
      setShowRejectModal(false);
      setSelectedJobId(null);
      setRejectReason("");
      alert(`ปฏิเสธงาน ${selectedJob.serviceName} - ส่งกลับให้ Worker แก้ไข`);
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
    <Container size="xl">
      <Section spacing="lg" className="animate-fade-in">
        {/* Header */}
        <HStack justify="between" align="center" className="flex-col lg:flex-row gap-4">
          <PageHeader
            title="รอตรวจสอบ"
            description={`ตรวจสอบงานของทีม ${currentTeam?.name || ""}`}
            icon={CheckCircle2}
          />

          {pendingReviewJobs.length > 0 && (
            <HStack gap={4} align="center" className="bg-white p-2 pl-4 rounded-xl shadow-sm border border-brand-border/50">
              <div className="text-right">
                <p className="text-xs text-brand-text-light font-medium">ยอดจ่ายรวม</p>
                <p className="text-lg font-bold text-brand-success">฿{totalPayout.toLocaleString()}</p>
              </div>
             <Button
                size="sm"
                onClick={() => {
                  if (confirm(`อนุมัติทั้งหมด ${pendingReviewJobs.length} งาน?`)) {
                    setLocallyRemovedIds(new Set(pendingReviewJobs.map(j => j.id)));
                    alert("อนุมัติงานทั้งหมดเรียบร้อย!");
                  }
                }}
                className="rounded-lg shadow-md shadow-brand-primary/20"
              >
                <ThumbsUp className="w-4 h-4 mr-2" />
                อนุมัติทั้งหมด ({pendingReviewJobs.length})
              </Button>
            </HStack>
          )}
        </HStack>

      {/* Quick Stats */}
      {pendingReviewJobs.length > 0 && (
        <Card variant="elevated" className="border-none shadow-lg shadow-brand-primary/5 bg-brand-info/5">
          <div className="flex items-start gap-4 p-2">
            <div className="p-3 bg-white rounded-xl shadow-sm text-brand-info border border-brand-info/20">
               <AlertCircle className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-brand-text-dark">มี {pendingReviewJobs.length} งานที่รอการตรวจสอบ</h3>
              <p className="text-brand-text-light text-sm mt-1">
                กรุณาตรวจสอบความถูกต้องของงานก่อนอนุมัติ หากอนุมัติแล้วระบบจะโอนเงินให้ Worker ทันที
              </p>
            </div>
          </div>
        </Card>
      )}

      {/* Jobs List */}
      {pendingReviewJobs.length === 0 ? (
        <EmptyState 
            icon={CheckCircle2} 
            title="ไม่มีงานรอตรวจสอบ" 
            description="งานทั้งหมดได้รับการตรวจสอบเรียบร้อยแล้ว"
            action={
                <Link href={`/seller/team/${teamId}/jobs`}>
                  <Button variant="outline" className="mt-4">
                    ดูงานทั้งหมด
                  </Button>
                </Link>
            }
            className="py-16"
        />
      ) : (
        <div className="space-y-6">
          {pendingReviewJobs.map((job) => (
            <div key={job.id} className="bg-white rounded-2xl shadow-sm border border-brand-border/50 overflow-hidden hover:shadow-md transition-shadow">
               {/* Header Section */}
               <div className="p-6 border-b border-brand-border/30 bg-brand-bg/30">
                 <div className="flex flex-col lg:flex-row items-start justify-between gap-4">
                    <div className="flex items-start gap-4">
                       <div className="p-3 bg-white rounded-xl shadow-sm border border-brand-border/20">
                          <PlatformIcon platform={job.platform as Platform} size="lg" />
                       </div>
                       <div>
                          <h3 className="font-bold text-lg text-brand-text-dark">{job.serviceName}</h3>
                          <div className="flex flex-wrap items-center gap-3 mt-2 text-sm text-brand-text-light">
                             <span className="bg-white px-2 py-1 rounded-lg border border-brand-border/50 shadow-sm flex items-center gap-1.5">
                                <Package className="w-3.5 h-3.5" />
                                <span className="font-mono">{job.orderNumber}</span>
                             </span>
                             <span className="flex items-center gap-1.5">
                                <Target className="w-3.5 h-3.5" />
                                <span>เป้าหมาย {job.completedQuantity}/{job.quantity}</span>
                             </span>
                            <span className="flex items-center gap-1.5 text-brand-text-light/70">
                               <Clock className="w-3.5 h-3.5" />
                               {job.submittedAt ? new Date(job.submittedAt).toLocaleDateString("th-TH", {
                                 day: "numeric", month: "short", hour: "2-digit", minute: "2-digit"
                               }) : "N/A"}
                            </span>
                          </div>
                       </div>
                    </div>
                    <div className="flex flex-row lg:flex-col items-center lg:items-end gap-2 lg:gap-0 w-full lg:w-auto justify-between lg:justify-start">
                        <div className="text-right">
                           <span className="text-sm text-brand-text-light block">ค่าจ้างที่ต้องจ่าย</span>
                           <span className="text-2xl font-bold text-brand-success">฿{job.workerPayout}</span>
                        </div>
                    </div>
                 </div>
               </div>

               {/* Content Section */}
               <div className="p-6">
                 <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Left: Worker & Proof */}
                    <div className="space-y-6">
                       {/* Worker Profile */}
                       <div className="flex items-center gap-4 p-4 rounded-xl bg-brand-bg/50 border border-brand-border/30">
                          <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center border border-brand-border/50 shadow-sm">
                             <span className="text-lg font-bold text-brand-primary">{job.worker.displayName.charAt(0)}</span>
                          </div>
                          <div className="flex-1">
                             <div className="flex items-center gap-2">
                                <span className="font-bold text-brand-text-dark">@{job.worker.displayName}</span>
                                <Badge variant="success" size="sm" className="px-1.5 py-0 text-[10px] h-5">{job.worker.level}</Badge>
                             </div>
                             <div className="flex items-center gap-3 text-sm text-brand-text-light mt-0.5">
                                <span className="flex items-center gap-1">
                                   <Star className="w-3 h-3 text-brand-warning fill-brand-warning" />
                                   {job.worker.rating}
                                </span>
                                <span className="w-1 h-1 bg-brand-border rounded-full"></span>
                                <span>งานเสร็จ {job.worker.totalJobsCompleted}</span>
                             </div>
                          </div>
                       </div>

                       {/* Worker Note */}
                       {job.workerNote && (
                         <div className="relative pl-4 border-l-2 border-brand-info/30 py-1">
                            <p className="text-sm italic text-brand-text-light">"{job.workerNote}"</p>
                         </div>
                       )}
                       
                       {/* Target Link */}
                        <a
                          href={job.targetUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-2 text-brand-primary hover:text-brand-primary-dark transition-colors group w-fit"
                        >
                          <div className="p-2 bg-brand-primary/10 rounded-lg group-hover:bg-brand-primary/20 transition-colors">
                             <ExternalLink className="w-4 h-4" />
                          </div>
                          <span className="font-medium underline decoration-brand-primary/30 underline-offset-4">เปิดลิงก์งานตรวจสอบ</span>
                        </a>
                    </div>

                    {/* Right: Proof Images */}
                    <div className="space-y-3">
                       <h4 className="font-bold text-brand-text-dark flex items-center gap-2">
                          <ImageIcon className="w-4 h-4 text-brand-text-light" />
                          หลักฐานการทำงาน
                          <span className="text-xs font-normal text-brand-text-light bg-brand-bg px-2 py-0.5 rounded-full">
                             {job.proofImages.length} รูป
                          </span>
                       </h4>
                       
                       {job.proofImages.length > 0 ? (
                         <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                            {job.proofImages.map((img, index) => (
                              <div key={index} className="aspect-square bg-brand-bg rounded-xl border border-brand-border/50 flex items-center justify-center relative overflow-hidden group cursor-pointer hover:shadow-md transition-all">
                                 <ImageIcon className="w-8 h-8 text-brand-text-light/50 group-hover:scale-110 transition-transform duration-500" />
                                 <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors"></div>
                              </div>
                            ))}
                         </div>
                       ) : (
                         <div className="p-8 rounded-xl border-2 border-dashed border-brand-border/50 bg-brand-bg/20 text-center">
                            <ImageIcon className="w-8 h-8 text-brand-text-light/30 mx-auto mb-2" />
                            <p className="text-sm text-brand-text-light">ไม่มีรูปภาพหลักฐาน</p>
                         </div>
                       )}
                    </div>
                 </div>
               </div>

               {/* Footer Actions */}
               <div className="p-4 bg-brand-bg/50 border-t border-brand-border/50 flex justify-end gap-3">
                  <Button
                    variant="outline"
                    className="border-brand-error/20 text-brand-error hover:bg-brand-error/5 hover:border-brand-error/50 min-w-[120px]"
                    onClick={() => {
                      setSelectedJobId(job.id);
                      setShowRejectModal(true);
                    }}
                  >
                    <XCircle className="w-4 h-4 mr-2" />
                    ปฏิเสธ
                  </Button>
                  <Button
                    className="min-w-[120px] shadow-lg shadow-brand-primary/20"
                    onClick={() => {
                      setSelectedJobId(job.id);
                      setShowApproveModal(true);
                    }}
                  >
                    <CheckCircle2 className="w-4 h-4 mr-2" />
                    อนุมัติ
                  </Button>
               </div>
            </div>
          ))}
        </div>
      )}

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
              <Button onClick={handleApprove} className="flex-1 bg-brand-success hover:bg-brand-success/90 shadow-lg shadow-brand-success/20 border-transparent">
                <CheckCircle2 className="w-4 h-4 mr-2" />
                ยืนยันอนุมัติ
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
             <div className="flex items-center gap-4 p-4 bg-brand-error/5 border border-brand-error/20 rounded-xl">
               <div className="p-3 bg-brand-error/10 rounded-full text-brand-error">
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
                className="flex-1 bg-brand-error hover:bg-brand-error/90 shadow-lg shadow-brand-error/20 border-transparent text-white"
                onClick={handleReject}
                disabled={!rejectReason.trim()}
              >
                <XCircle className="w-4 h-4 mr-2" />
                ยืนยันปฏิเสธ
              </Button>
            </div>
          </div>
        )}
      </Modal>
      </Section>
    </Container>
  );
}
