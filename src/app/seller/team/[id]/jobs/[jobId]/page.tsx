"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { Card, Badge, Button, Progress, Modal, Input, Textarea } from "@/components/ui";
import { Container, Section, HStack, VStack } from "@/components/layout";
import { PageHeader, PlatformIcon, EmptyState, PageSkeleton, ShareJobModal } from "@/components/shared";
import { useTeamJobById, useJobClaimsByTeamJobId, useSellerTeamById } from "@/lib/api/hooks";
import { api } from "@/lib/api";
import { getJobStatusLabel, getJobStatusVariant, type TeamJobStatus } from "@/lib/constants/statuses";
import type { Platform } from "@/types";
import {
  ArrowLeft,
  ExternalLink,
  Clock,
  Target,
  CheckCircle2,
  Package,
  Calendar,
  Users,
  DollarSign,
  AlertCircle,
  AlertTriangle,
  ClipboardList,
  Star,
  XCircle,
  MessageSquare,
  Edit,
  Trash2,
  Ban,
  Share2,
} from "lucide-react";

export default function SellerJobDetailPage() {
  const params = useParams();
  const router = useRouter();
  const teamId = params.id as string;
  const jobId = params.jobId as string;

  const [isProcessing, setIsProcessing] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  
  // Edit form state
  const [editQuantity, setEditQuantity] = useState<number>(0);
  const [editPricePerUnit, setEditPricePerUnit] = useState<number>(0);
  const [editInstructions, setEditInstructions] = useState<string>("");
  const [editDeadline, setEditDeadline] = useState<string>("");
  
  // Cancel form state
  const [cancelReason, setCancelReason] = useState("");

  const { data: job, isLoading: isLoadingJob, refetch } = useTeamJobById(jobId);
  const { data: claims, isLoading: isLoadingClaims } = useJobClaimsByTeamJobId(jobId);
  const { data: team } = useSellerTeamById(teamId);

  const isLoading = isLoadingJob || isLoadingClaims;

  const progress = job ? (job.completedQuantity / job.quantity) * 100 : 0;
  const remainingQuantity = job ? job.quantity - job.completedQuantity : 0;

  const pendingClaims = useMemo(() => {
    return claims?.filter(c => c.status === "submitted") || [];
  }, [claims]);

  const approvedClaims = useMemo(() => {
    return claims?.filter(c => c.status === "approved") || [];
  }, [claims]);

  const activeClaims = useMemo(() => {
    return claims?.filter(c => c.status === "claimed") || [];
  }, [claims]);

  const handleApproveClaim = async (claimId: string) => {
    if (!confirm("ยืนยันการอนุมัติงานนี้?")) return;

    setIsProcessing(true);
    try {
      await api.seller.approveJobClaim(claimId);
      await refetch();
      alert("อนุมัติงานเรียบร้อย!");
    } catch (error) {
      console.error("Error approving claim:", error);
      alert("เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleRejectClaim = async (claimId: string) => {
    const reason = prompt("กรุณาระบุเหตุผลในการปฏิเสธ:");
    if (!reason) return;

    setIsProcessing(true);
    try {
      await api.seller.rejectJobClaim(claimId, reason);
      await refetch();
      alert("ปฏิเสธงานเรียบร้อย");
    } catch (error) {
      console.error("Error rejecting claim:", error);
      alert("เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleOpenEditModal = () => {
    if (job) {
      setEditQuantity(job.quantity);
      setEditPricePerUnit(job.pricePerUnit);
      setEditInstructions(job.instructions || "");
      setEditDeadline(job.deadline ? job.deadline.split('T')[0] : "");
      setShowEditModal(true);
    }
  };

  const handleEditJob = async () => {
    if (!job) return;

    setIsProcessing(true);
    try {
      await api.seller.updateTeamJob(job.id, {
        quantity: editQuantity,
        pricePerUnit: editPricePerUnit,
        instructions: editInstructions,
        deadline: editDeadline ? new Date(editDeadline).toISOString() : undefined,
      });
      await refetch();
      setShowEditModal(false);
      alert("แก้ไขงานเรียบร้อย!");
    } catch (error: any) {
      console.error("Error editing job:", error);
      alert(error.message || "เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDeleteJob = async () => {
    if (!job) return;
    
    if (!confirm("ยืนยันการลบงาน? การดำเนินการนี้ไม่สามารถย้อนกลับได้")) return;

    setIsProcessing(true);
    try {
      await api.seller.deleteTeamJob(job.id);
      alert("ลบงานเรียบร้อย!");
      router.push(`/seller/team/${teamId}/jobs`);
    } catch (error: any) {
      console.error("Error deleting job:", error);
      alert(error.message || "เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleOpenCancelModal = () => {
    setCancelReason("");
    setShowCancelModal(true);
  };

  const handleCancelJob = async () => {
    if (!job) return;

    setIsProcessing(true);
    try {
      const result = await api.seller.cancelTeamJob(job.id, cancelReason);
      await refetch();
      setShowCancelModal(false);
      
      if (result.payoutAmount > 0) {
        alert(`ยกเลิกงานเรียบร้อย!\n\nได้สร้าง Payout สำหรับ Worker แล้ว\nจำนวนเงิน: ฿${result.payoutAmount.toFixed(2)}`);
      } else {
        alert("ยกเลิกงานเรียบร้อย!");
      }
    } catch (error: any) {
      console.error("Error cancelling job:", error);
      alert(error.message || "เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง");
    } finally {
      setIsProcessing(false);
    }
  };

  // Calculate payment for cancel preview
  const calculateCancelPayment = () => {
    if (!job || !claims) return 0;
    
    if (job.status === "pending") return 0;
    
    if (job.status === "in_progress") {
      return claims
        .filter(c => c.status === "claimed")
        .reduce((sum, c) => sum + ((c.actualQuantity || 0) * job.pricePerUnit), 0);
    }
    
    if (job.status === "pending_review") {
      return claims
        .filter(c => c.status === "submitted")
        .reduce((sum, c) => sum + c.earnAmount, 0);
    }
    
    return 0;
  };

  if (isLoading) {
    return <PageSkeleton variant="detail" className="max-w-7xl mx-auto" />;
  }

  if (!job) {
    return (
      <Container size="xl">
        <Section spacing="lg">
          <EmptyState
            icon={ClipboardList}
            title="ไม่พบงานนี้"
            description="งานอาจถูกลบหรือไม่มีอยู่ในระบบ"
          />
          <div className="text-center mt-6">
            <Link href={`/seller/team/${teamId}/jobs`}>
              <Button>กลับไปหน้างานทั้งหมด</Button>
            </Link>
          </div>
        </Section>
      </Container>
    );
  }

  return (
    <Container size="xl">
      <Section spacing="lg" className="animate-fade-in">
        {/* Header */}
        <HStack justify="between" align="center" className="flex-col md:flex-row gap-4">
          <HStack gap={4} align="center">
            <Link href={`/seller/team/${teamId}/jobs`}>
              <button className="p-3 hover:bg-white bg-white/60 backdrop-blur-sm border border-brand-border/50 rounded-xl transition-all shadow-sm group">
                <ArrowLeft className="w-5 h-5 text-brand-text-dark group-hover:text-brand-primary" />
              </button>
            </Link>
            <VStack gap={2}>
              <HStack gap={3} align="center">
                <h1 className="text-3xl font-bold text-brand-text-dark tracking-tight">
                  {job.serviceName}
                </h1>
                <Badge variant={getJobStatusVariant(job.status as TeamJobStatus)} className="text-sm px-2.5 py-0.5 shadow-sm">
                  {getJobStatusLabel(job.status as TeamJobStatus)}
                </Badge>
              </HStack>
              <div className="flex items-center gap-3 mt-2">
                <Badge variant="default" className="bg-brand-bg text-brand-text-dark border-brand-border/50 font-medium px-3 py-1">
                  <Package className="w-3.5 h-3.5 mr-1.5 text-brand-text-light" />
                  {job.orderNumber}
                </Badge>
                {team && (
                  <Badge variant="default" className="bg-brand-bg text-brand-text-dark border-brand-border/50 font-medium px-3 py-1">
                    <Users className="w-3.5 h-3.5 mr-1.5 text-brand-text-light" />
                    {team.name}
                  </Badge>
                )}
              </div>
            </VStack>
          </HStack>

          <HStack gap={2} className="flex-wrap">
            {/* Share Button - Always visible */}
            <Button
              size="lg"
              variant="outline"
              onClick={() => setShowShareModal(true)}
              className="shadow-sm bg-[#00B900]/5 border-[#00B900]/30 text-[#00B900] hover:bg-[#00B900]/10"
            >
              <Share2 className="w-5 h-5 mr-2" />
              แชร์งาน
            </Button>

            {/* Actions for pending status */}
            {job.status === "pending" && (
              <>
                <Button
                  size="lg"
                  variant="outline"
                  onClick={handleOpenEditModal}
                  className="shadow-sm"
                >
                  <Edit className="w-5 h-5 mr-2" />
                  แก้ไข
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  onClick={handleDeleteJob}
                  disabled={isProcessing}
                  className="shadow-sm border-red-300 text-red-600 hover:bg-red-50"
                >
                  <Trash2 className="w-5 h-5 mr-2" />
                  ลบ
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  onClick={handleOpenCancelModal}
                  disabled={isProcessing}
                  className="shadow-sm"
                >
                  <Ban className="w-5 h-5 mr-2" />
                  ยกเลิก
                </Button>
              </>
            )}
            
            {/* Actions for in_progress status */}
            {job.status === "in_progress" && (
              <Button
                size="lg"
                variant="outline"
                onClick={handleOpenCancelModal}
                disabled={isProcessing}
                className="shadow-sm border-red-300 text-red-600 hover:bg-red-50"
              >
                <Ban className="w-5 h-5 mr-2" />
                ยกเลิกงาน
              </Button>
            )}
            
            {/* Actions for pending_review status */}
            {job.status === "pending_review" && (
              <>
                {pendingClaims.length > 0 && (
                  <Link href={`/seller/team/${teamId}/review`}>
                    <Button size="lg" className="shadow-lg shadow-brand-primary/20 px-8">
                      <CheckCircle2 className="w-5 h-5 mr-2" />
                      ตรวจสอบงาน ({pendingClaims.length})
                    </Button>
                  </Link>
                )}
                <Button
                  size="lg"
                  variant="outline"
                  onClick={handleOpenCancelModal}
                  disabled={isProcessing}
                  className="shadow-sm border-red-300 text-red-600 hover:bg-red-50"
                >
                  <Ban className="w-5 h-5 mr-2" />
                  ยกเลิกงาน
                </Button>
              </>
            )}
          </HStack>
        </HStack>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Progress Card */}
            <Card variant="elevated" padding="lg" className="border-none shadow-xl shadow-brand-primary/5 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-brand-primary/5 rounded-full blur-3xl -mr-32 -mt-32" />
              <div className="relative">
                <div className="flex items-center justify-between mb-8">
                  <h2 className="text-xl font-bold text-brand-text-dark flex items-center gap-3">
                    <div className="p-2.5 bg-brand-primary/10 rounded-xl">
                      <Target className="w-6 h-6 text-brand-primary" />
                    </div>
                    ความคืบหน้างาน
                  </h2>
                </div>

                <div className="space-y-8">
                  {/* Progress Stats */}
                  <div className="grid grid-cols-3 gap-4">
                    <div className="p-5 bg-brand-success/5 border border-brand-success/10 rounded-2xl text-center relative overflow-hidden group hover:border-brand-success/30 transition-all">
                      <div className="absolute inset-0 bg-brand-success/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                      <p className="text-4xl font-bold text-brand-success mb-1 relative z-10">
                        {job.completedQuantity}
                      </p>
                      <p className="text-xs font-bold text-brand-text-light uppercase tracking-wider relative z-10">เสร็จแล้ว</p>
                    </div>
                    <div className="p-5 bg-brand-warning/5 border border-brand-warning/10 rounded-2xl text-center relative overflow-hidden group hover:border-brand-warning/30 transition-all">
                      <div className="absolute inset-0 bg-brand-warning/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                      <p className="text-4xl font-bold text-brand-warning mb-1 relative z-10">
                        {remainingQuantity}
                      </p>
                      <p className="text-xs font-bold text-brand-text-light uppercase tracking-wider relative z-10">เหลืออีก</p>
                    </div>
                    <div className="p-5 bg-brand-bg border border-brand-border/50 rounded-2xl text-center relative overflow-hidden group hover:border-brand-primary/20 transition-all">
                      <p className="text-4xl font-bold text-brand-primary mb-1 relative z-10">
                        {job.quantity}
                      </p>
                      <p className="text-xs font-bold text-brand-text-light uppercase tracking-wider relative z-10">เป้าหมาย</p>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="space-y-3 bg-brand-bg/30 p-5 rounded-2xl border border-brand-border/30">
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-brand-text-dark font-medium flex items-center gap-2">
                        <Target className="w-4 h-4 text-brand-primary" />
                        ความคืบหน้าปัจจุบัน
                      </span>
                      <span className="font-bold text-brand-primary bg-brand-primary/10 px-2 py-0.5 rounded-md">
                        {Math.round(progress)}%
                      </span>
                    </div>
                    <Progress value={progress} size="lg" className="h-4 shadow-inner" />
                  </div>
                </div>
              </div>
            </Card>

            {/* Target URL */}
            <Card variant="elevated" padding="lg" className="border-none shadow-lg shadow-brand-primary/5">
              <h2 className="text-lg font-bold text-brand-text-dark mb-4 flex items-center gap-2">
                <div className="p-2 bg-brand-primary/10 rounded-lg">
                  <ExternalLink className="w-5 h-5 text-brand-primary" />
                </div>
                ลิงก์เป้าหมาย
              </h2>

              <div className="p-5 bg-brand-bg/50 border border-brand-border/50 rounded-2xl transition-all hover:bg-brand-bg hover:shadow-inner">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center shadow-sm">
                    <PlatformIcon platform={job.platform as Platform} size="lg" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-brand-text-dark truncate text-lg">
                      {job.targetUrl}
                    </p>
                    <p className="text-sm text-brand-text-light font-medium">
                      แพลตฟอร์ม: {job.platform}
                    </p>
                  </div>
                </div>

                <div className="flex gap-3 mt-6">
                  <a
                    href={job.targetUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1"
                  >
                    <Button variant="primary" className="w-full shadow-md shadow-brand-primary/20">
                      <ExternalLink className="w-4 h-4 mr-2" />
                      เปิดลิงก์
                    </Button>
                  </a>
                </div>
              </div>
            </Card>

            {/* Instructions */}
            {job.instructions && (
              <Card variant="elevated" padding="lg" className="border-none shadow-lg shadow-brand-primary/5">
                <h2 className="text-lg font-bold text-brand-text-dark mb-4 flex items-center gap-2">
                  <div className="p-2 bg-brand-info/10 rounded-lg">
                    <ClipboardList className="w-5 h-5 text-brand-info" />
                  </div>
                  คำแนะนำการทำงาน
                </h2>

                <div className="p-5 bg-brand-info/5 border border-brand-info/10 rounded-2xl">
                  <p className="text-brand-text-dark font-medium leading-relaxed whitespace-pre-wrap">
                    {job.instructions}
                  </p>
                </div>
              </Card>
            )}

            {/* Claims Section */}
            {claims && claims.length > 0 && (
              <Card variant="elevated" padding="lg" className="border-none shadow-lg shadow-brand-primary/5">
                <h2 className="text-lg font-bold text-brand-text-dark mb-4 flex items-center gap-2">
                  <div className="p-2 bg-brand-accent/10 rounded-lg">
                    <Users className="w-5 h-5 text-brand-accent" />
                  </div>
                  Workers ({claims.length})
                </h2>

                <div className="space-y-3">
                  {claims.map((claim) => (
                    <div key={claim.id} className="p-4 bg-brand-bg/30 border border-brand-border/30 rounded-xl">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex items-center gap-3 flex-1">
                          <div className="w-10 h-10 rounded-full bg-brand-secondary flex items-center justify-center text-sm font-bold text-brand-primary">
                            {claim.worker?.displayName.charAt(0) || "W"}
                          </div>
                          <div>
                            <p className="font-bold text-brand-text-dark">
                              @{claim.worker?.displayName || "Worker"}
                            </p>
                            <div className="flex items-center gap-2 text-xs text-brand-text-light">
                              <span>จำนวน: {claim.actualQuantity || claim.quantity}</span>
                              <span>•</span>
                              <span>฿{claim.earnAmount.toFixed(2)}</span>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          {claim.status === "claimed" && (
                            <Badge variant="warning" size="sm">กำลังทำ</Badge>
                          )}
                          {claim.status === "submitted" && (
                            <>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleRejectClaim(claim.id)}
                                disabled={isProcessing}
                                className="border-red-500 text-red-500 hover:bg-red-500/10"
                              >
                                <XCircle className="w-3 h-3 mr-1" />
                                ปฏิเสธ
                              </Button>
                              <Button
                                size="sm"
                                onClick={() => handleApproveClaim(claim.id)}
                                disabled={isProcessing}
                                className="shadow-md shadow-brand-primary/20"
                              >
                                <CheckCircle2 className="w-3 h-3 mr-1" />
                                อนุมัติ
                              </Button>
                            </>
                          )}
                          {claim.status === "approved" && (
                            <Badge variant="success" size="sm">อนุมัติแล้ว</Badge>
                          )}
                          {claim.status === "rejected" && (
                            <Badge variant="error" size="sm">ปฏิเสธแล้ว</Badge>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Financial Info */}
            <Card className="bg-gradient-to-br from-brand-primary to-brand-accent text-white border-none shadow-xl shadow-brand-primary/20 overflow-hidden relative">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2" />
              <div className="p-6 relative z-10">
                <div className="flex items-center gap-2 mb-2 text-white/90 font-medium">
                  <div className="p-1 bg-white/20 rounded-lg backdrop-blur-sm">
                    <DollarSign className="w-4 h-4" />
                  </div>
                  ค่าจ้างทั้งหมด
                </div>
                <p className="text-4xl font-bold mt-2 tracking-tight">
                  ฿{job.totalPayout.toFixed(2)}
                </p>
                <div className="mt-4 pt-4 border-t border-white/20 flex justify-between items-center text-sm">
                  <span className="text-white/80">ราคาต่อหน่วย</span>
                  <span className="px-2 py-1 bg-white/20 rounded-lg text-xs font-semibold backdrop-blur-sm">
                    ฿{job.pricePerUnit}/หน่วย
                  </span>
                </div>
              </div>
            </Card>

            {/* Time Info */}
            <Card variant="elevated" padding="lg" className="border-none shadow-lg shadow-brand-primary/5">
              <h3 className="font-bold text-brand-text-dark mb-4 flex items-center gap-2">
                <div className="p-2 bg-brand-primary/10 rounded-lg">
                  <Clock className="w-5 h-5 text-brand-primary" />
                </div>
                ข้อมูลเวลา
              </h3>

              <div className="space-y-4">
                <div className="flex justify-between items-center text-sm p-3 bg-brand-bg/50 rounded-xl">
                  <span className="text-brand-text-light font-medium">วันที่สร้าง</span>
                  <span className="text-brand-text-dark font-bold">
                    {new Date(job.createdAt).toLocaleDateString("th-TH", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </span>
                </div>
                {job.deadline && (
                  <div className="flex justify-between items-center text-sm p-3 bg-brand-bg/50 rounded-xl">
                    <span className="text-brand-text-light font-medium">กำหนดส่ง</span>
                    <span className="text-brand-text-dark font-bold">
                      {new Date(job.deadline).toLocaleDateString("th-TH", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </span>
                  </div>
                )}
                {job.completedAt && (
                  <div className="flex justify-between items-center text-sm p-3 bg-brand-success/5 border border-brand-success/10 rounded-xl">
                    <span className="text-brand-text-light font-medium">วันที่เสร็จ</span>
                    <span className="text-brand-success font-bold">
                      {new Date(job.completedAt).toLocaleDateString("th-TH", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </span>
                  </div>
                )}
              </div>
            </Card>

            {/* Stats Summary */}
            <Card variant="elevated" padding="lg" className="border-none shadow-lg shadow-brand-primary/5">
              <h3 className="font-bold text-brand-text-dark mb-4 flex items-center gap-2">
                <div className="p-2 bg-brand-info/10 rounded-lg">
                  <Target className="w-5 h-5 text-brand-info" />
                </div>
                สถิติ
              </h3>

              <div className="space-y-3">
                <div className="flex justify-between items-center text-sm p-3 bg-brand-bg/50 rounded-xl">
                  <span className="text-brand-text-light font-medium">Workers ที่รับงาน</span>
                  <span className="text-brand-text-dark font-bold">{claims?.length || 0}</span>
                </div>
                <div className="flex justify-between items-center text-sm p-3 bg-brand-bg/50 rounded-xl">
                  <span className="text-brand-text-light font-medium">กำลังทำงาน</span>
                  <span className="text-brand-text-dark font-bold">{activeClaims.length}</span>
                </div>
                <div className="flex justify-between items-center text-sm p-3 bg-brand-warning/5 border border-brand-warning/10 rounded-xl">
                  <span className="text-brand-text-light font-medium">รอตรวจสอบ</span>
                  <span className="text-brand-warning font-bold">{pendingClaims.length}</span>
                </div>
                <div className="flex justify-between items-center text-sm p-3 bg-brand-success/5 border border-brand-success/10 rounded-xl">
                  <span className="text-brand-text-light font-medium">อนุมัติแล้ว</span>
                  <span className="text-brand-success font-bold">{approvedClaims.length}</span>
                </div>
              </div>
            </Card>
          </div>
        </div>

        {/* Edit Job Modal */}
        <Modal
          isOpen={showEditModal}
          onClose={() => setShowEditModal(false)}
          title="แก้ไขงาน"
        >
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-brand-text-dark mb-2">
                จำนวน (หน่วย)
              </label>
              <Input
                type="number"
                value={editQuantity}
                onChange={(e) => setEditQuantity(Number(e.target.value))}
                min="1"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-brand-text-dark mb-2">
                ราคาต่อหน่วย (฿)
              </label>
              <Input
                type="number"
                value={editPricePerUnit}
                onChange={(e) => setEditPricePerUnit(Number(e.target.value))}
                min="0"
                step="0.01"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-brand-text-dark mb-2">
                คำแนะนำ
              </label>
              <Textarea
                value={editInstructions}
                onChange={(e) => setEditInstructions(e.target.value)}
                rows={4}
                placeholder="คำแนะนำสำหรับ worker..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-brand-text-dark mb-2">
                กำหนดส่ง
              </label>
              <Input
                type="date"
                value={editDeadline}
                onChange={(e) => setEditDeadline(e.target.value)}
              />
            </div>

            <div className="p-4 bg-brand-bg rounded-xl">
              <p className="text-sm text-brand-text-light mb-1">รวมค่าจ้างทั้งหมด</p>
              <p className="text-2xl font-bold text-brand-primary">
                ฿{(editQuantity * editPricePerUnit).toFixed(2)}
              </p>
            </div>

            {/* Content Warning */}
            <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl">
              <div className="flex gap-2">
                <AlertTriangle className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
                <div className="text-sm">
                  <p className="font-medium text-amber-800">คำเตือน: ตรวจสอบเนื้อหาก่อนบันทึก</p>
                  <p className="text-amber-700 text-xs mt-1">
                    ห้ามมอบหมายงานที่เกี่ยวข้องกับการพนัน, เว็บผิดกฎหมาย, โฆษณาหลอกลวง หรือเนื้อหาผู้ใหญ่
                  </p>
                </div>
              </div>
            </div>

            <div className="flex gap-3 justify-end pt-4">
              <Button
                variant="outline"
                onClick={() => setShowEditModal(false)}
                disabled={isProcessing}
              >
                ยกเลิก
              </Button>
              <Button
                onClick={handleEditJob}
                disabled={isProcessing}
                isLoading={isProcessing}
              >
                บันทึก
              </Button>
            </div>
          </div>
        </Modal>

        {/* Share Job Modal */}
        <ShareJobModal
          isOpen={showShareModal}
          onClose={() => setShowShareModal(false)}
          job={job ? {
            id: job.id,
            serviceName: job.serviceName,
            platform: job.platform,
            quantity: job.quantity,
            completedQuantity: job.completedQuantity,
            pricePerUnit: job.pricePerUnit,
            deadline: job.deadline,
            teamName: team?.name,
            targetUrl: job.targetUrl,
          } : null}
          teamId={teamId}
        />

        {/* Cancel Job Modal */}
        <Modal
          isOpen={showCancelModal}
          onClose={() => setShowCancelModal(false)}
          title="ยกเลิกงาน"
        >
          <div className="space-y-4">
            <div className="p-4 bg-brand-warning/5 border border-brand-warning/20 rounded-xl">
              <div className="flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-brand-warning mt-0.5" />
                <div>
                  <p className="font-bold text-brand-text-dark mb-1">
                    ยืนยันการยกเลิกงาน?
                  </p>
                  <p className="text-sm text-brand-text-light">
                    การดำเนินการนี้ไม่สามารถย้อนกลับได้
                  </p>
                </div>
              </div>
            </div>

            {/* Payment info if applicable */}
            {job && (job.status === "in_progress" || job.status === "pending_review") && calculateCancelPayment() > 0 && (
              <div className="p-4 bg-brand-info/5 border border-brand-info/20 rounded-xl">
                <p className="font-bold text-brand-text-dark mb-3">
                  ค่าตอบแทนที่ต้องจ่ายให้ Worker:
                </p>
                <div className="space-y-2">
                  {claims?.filter(c => 
                    (job.status === "in_progress" && c.status === "claimed") ||
                    (job.status === "pending_review" && c.status === "submitted")
                  ).map(claim => (
                    <div key={claim.id} className="flex justify-between items-center text-sm p-2 bg-white rounded-lg">
                      <span className="text-brand-text-dark">
                        @{claim.worker?.displayName || "Worker"}
                        {job.status === "in_progress" && 
                          ` (${claim.actualQuantity || 0}/${claim.quantity} หน่วย)`
                        }
                      </span>
                      <span className="font-bold text-brand-success">
                        ฿{(job.status === "in_progress" 
                          ? (claim.actualQuantity || 0) * job.pricePerUnit
                          : claim.earnAmount
                        ).toFixed(2)}
                      </span>
                    </div>
                  ))}
                  <div className="flex justify-between items-center p-3 bg-brand-success/10 rounded-lg border-t-2 border-brand-success">
                    <span className="font-bold text-brand-text-dark">รวมทั้งหมด</span>
                    <span className="text-xl font-bold text-brand-success">
                      ฿{calculateCancelPayment().toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-brand-text-dark mb-2">
                เหตุผล (ถ้ามี)
              </label>
              <Textarea
                value={cancelReason}
                onChange={(e) => setCancelReason(e.target.value)}
                rows={3}
                placeholder="ระบุเหตุผลในการยกเลิกงาน..."
              />
            </div>

            <div className="flex gap-3 justify-end pt-4">
              <Button
                variant="outline"
                onClick={() => setShowCancelModal(false)}
                disabled={isProcessing}
              >
                ยกเลิก
              </Button>
              <Button
                onClick={handleCancelJob}
                disabled={isProcessing}
                isLoading={isProcessing}
                className="bg-red-600 hover:bg-red-700"
              >
                {calculateCancelPayment() > 0 
                  ? `ยืนยัน - จ่าย ฿${calculateCancelPayment().toFixed(2)}`
                  : "ยืนยันการยกเลิก"
                }
              </Button>
            </div>
          </div>
        </Modal>
      </Section>
    </Container>
  );
}
