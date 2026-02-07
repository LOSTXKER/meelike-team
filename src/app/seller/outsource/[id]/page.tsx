"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { Card, Badge, Button, Textarea } from "@/components/ui";
import { Dialog } from "@/components/ui/Dialog";
import { Container, Section, HStack, VStack } from "@/components/layout";
import { PageHeader, PlatformIcon, EmptyState, PageSkeleton } from "@/components/shared";
import { useToast } from "@/components/ui/toast";
import { useConfirm } from "@/components/ui/confirm-dialog";
import { api } from "@/lib/api";
import type { OutsourceJob, OutsourceBid, Platform } from "@/types";
import {
  ArrowLeft,
  Globe,
  Eye,
  MessageCircle,
  Clock,
  DollarSign,
  Zap,
  CheckCircle2,
  XCircle,
  Star,
  Users,
  ExternalLink,
  AlertCircle,
  Briefcase,
  Ban,
} from "lucide-react";

const statusConfig = {
  open: { label: "เปิดรับ bid", color: "warning" as const },
  in_progress: { label: "กำลังทำ", color: "info" as const },
  completed: { label: "เสร็จสิ้น", color: "success" as const },
  cancelled: { label: "ยกเลิก", color: "error" as const },
};

const bidStatusConfig = {
  pending: { label: "รอพิจารณา", color: "warning" as const },
  accepted: { label: "รับแล้ว", color: "success" as const },
  rejected: { label: "ปฏิเสธ", color: "error" as const },
  withdrawn: { label: "ถอน bid", color: "default" as const },
};

export default function OutsourceDetailPage() {
  const params = useParams();
  const router = useRouter();
  const jobId = params.id as string;

  const toast = useToast();
  const confirm = useConfirm();
  const [job, setJob] = useState<OutsourceJob | null>(null);
  const [bids, setBids] = useState<OutsourceBid[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);

  const loadData = async () => {
    try {
      const [jobData, bidsData] = await Promise.all([
        api.hub.getOutsourceJobById(jobId),
        api.hub.getOutsourceBids(jobId),
      ]);
      setJob(jobData);
      setBids(bidsData);
    } catch (error) {
      console.error("Error loading data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [jobId]);

  const handleAcceptBid = async (bidId: string) => {
    if (!await confirm({ title: "ยืนยัน", message: "ยืนยันรับ bid นี้? งานจะถูกมอบหมายให้ทีมนี้ทันที", variant: "warning" })) return;

    setIsProcessing(true);
    try {
      await api.hub.acceptBid(bidId);
      toast.success("รับ bid เรียบร้อย! งานถูกมอบหมายให้ทีมแล้ว");
      await loadData();
    } catch (error: any) {
      console.error("Error accepting bid:", error);
      toast.error(error.message || "เกิดข้อผิดพลาด");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleRejectBid = async (bidId: string) => {
    if (!await confirm({ title: "ยืนยัน", message: "ยืนยันปฏิเสธ bid นี้?", variant: "danger", confirmLabel: "ปฏิเสธ" })) return;

    setIsProcessing(true);
    try {
      await api.hub.rejectBid(bidId);
      await loadData();
    } catch (error: any) {
      console.error("Error rejecting bid:", error);
      toast.error(error.message || "เกิดข้อผิดพลาด");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleCancelJob = async () => {
    setIsProcessing(true);
    try {
      await api.hub.cancelOutsourceJob(jobId);
      toast.success("ยกเลิกงานเรียบร้อย");
      setShowCancelModal(false);
      router.push("/seller/outsource");
    } catch (error: any) {
      console.error("Error cancelling job:", error);
      toast.error(error.message || "เกิดข้อผิดพลาด");
    } finally {
      setIsProcessing(false);
    }
  };

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

  if (isLoading) {
    return <PageSkeleton variant="detail" className="max-w-5xl mx-auto" />;
  }

  if (!job) {
    return (
      <Container size="xl">
        <Section spacing="lg">
          <EmptyState
            icon={Globe}
            title="ไม่พบงานนี้"
            description="งานอาจถูกลบหรือไม่มีอยู่ในระบบ"
          />
          <div className="text-center mt-6">
            <Link href="/seller/outsource">
              <Button>กลับไปหน้างานทั้งหมด</Button>
            </Link>
          </div>
        </Section>
      </Container>
    );
  }

  const pendingBids = bids.filter(b => b.status === "pending");
  const acceptedBid = bids.find(b => b.status === "accepted");

  return (
    <Container size="xl">
      <Section spacing="lg" className="animate-fade-in">
        {/* Header */}
        <HStack justify="between" align="start" className="flex-col md:flex-row gap-4">
          <HStack gap={4} align="center">
            <Link href="/seller/outsource">
              <button className="p-3 hover:bg-white bg-white/60 backdrop-blur-sm border border-brand-border/50 rounded-xl transition-all shadow-sm group">
                <ArrowLeft className="w-5 h-5 text-brand-text-dark group-hover:text-brand-primary" />
              </button>
            </Link>
            <VStack gap={2}>
              <HStack gap={3} align="center">
                <h1 className="text-2xl font-bold text-brand-text-dark">
                  {job.title}
                </h1>
                <Badge variant={statusConfig[job.status].color}>
                  {statusConfig[job.status].label}
                </Badge>
                {job.isUrgent && (
                  <Badge variant="error">
                    <Zap className="w-3 h-3 mr-1" />
                    ด่วน
                  </Badge>
                )}
              </HStack>
              <div className="flex items-center gap-3 text-sm text-brand-text-light">
                <span className="flex items-center gap-1">
                  <Eye className="w-4 h-4" />
                  {job.views} เข้าชม
                </span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  {getTimeRemaining(job.deadline)}
                </span>
              </div>
            </VStack>
          </HStack>

          {job.status === "open" && (
            <Button
              variant="outline"
              onClick={() => setShowCancelModal(true)}
              className="border-red-300 text-red-600 hover:bg-red-50"
            >
              <Ban className="w-4 h-4 mr-2" />
              ยกเลิกงาน
            </Button>
          )}
        </HStack>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Job Info Card */}
            <Card variant="elevated" padding="lg" className="border-none shadow-lg">
              <h2 className="text-lg font-bold text-brand-text-dark mb-4 flex items-center gap-2">
                <div className="p-2 bg-brand-accent/10 rounded-lg">
                  <Globe className="w-5 h-5 text-brand-accent" />
                </div>
                รายละเอียดงาน
              </h2>

              <div className="space-y-4">
                <p className="text-brand-text-light">{job.description}</p>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  <div className="p-3 bg-brand-bg rounded-xl">
                    <p className="text-xs text-brand-text-light">Platform</p>
                    <p className="font-bold text-brand-text-dark flex items-center gap-1 mt-1">
                      <PlatformIcon platform={job.platform as Platform} className="w-4 h-4" />
                      {job.platform}
                    </p>
                  </div>
                  <div className="p-3 bg-brand-bg rounded-xl">
                    <p className="text-xs text-brand-text-light">จำนวน</p>
                    <p className="font-bold text-brand-text-dark mt-1">
                      {job.quantity.toLocaleString()}
                    </p>
                  </div>
                  <div className="p-3 bg-brand-bg rounded-xl">
                    <p className="text-xs text-brand-text-light">ราคาแนะนำ</p>
                    <p className="font-bold text-brand-text-dark mt-1">
                      ฿{job.suggestedPricePerUnit}/หน่วย
                    </p>
                  </div>
                  <div className="p-3 bg-brand-success/10 rounded-xl">
                    <p className="text-xs text-brand-text-light">งบประมาณ</p>
                    <p className="font-bold text-brand-success mt-1">
                      ฿{job.budget.toLocaleString()}
                    </p>
                  </div>
                </div>

                {/* Target URL */}
                <div className="p-4 bg-brand-bg/50 rounded-xl">
                  <p className="text-xs text-brand-text-light mb-1">URL เป้าหมาย</p>
                  <a
                    href={job.targetUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-brand-primary hover:underline font-mono text-sm flex items-center gap-2"
                  >
                    {job.targetUrl}
                    <ExternalLink className="w-4 h-4" />
                  </a>
                </div>
              </div>
            </Card>

            {/* Bids Section */}
            <Card variant="elevated" padding="lg" className="border-none shadow-lg">
              <h2 className="text-lg font-bold text-brand-text-dark mb-4 flex items-center gap-2">
                <div className="p-2 bg-brand-warning/10 rounded-lg">
                  <MessageCircle className="w-5 h-5 text-brand-warning" />
                </div>
                Bids ({bids.length})
              </h2>

              {bids.length === 0 ? (
                <div className="text-center py-8">
                  <MessageCircle className="w-12 h-12 text-brand-text-light/30 mx-auto mb-3" />
                  <p className="text-brand-text-light">ยังไม่มีทีมส่ง bid เข้ามา</p>
                  <p className="text-sm text-brand-text-light/70 mt-1">
                    รอทีมอื่นๆ เห็นงานและเสนอราคา
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {/* Accepted Bid - Show First */}
                  {acceptedBid && (
                    <div className="p-4 bg-brand-success/10 border-2 border-brand-success rounded-xl">
                      <div className="flex items-center gap-2 mb-3">
                        <CheckCircle2 className="w-5 h-5 text-brand-success" />
                        <span className="font-bold text-brand-success">Bid ที่รับแล้ว</span>
                      </div>
                      <BidCard bid={acceptedBid} isAccepted />
                    </div>
                  )}

                  {/* Pending Bids */}
                  {pendingBids.length > 0 && (
                    <div className="space-y-3">
                      {job.status === "open" && (
                        <p className="text-sm font-medium text-brand-text-dark">
                          รอพิจารณา ({pendingBids.length})
                        </p>
                      )}
                      {pendingBids.map((bid) => (
                        <BidCard
                          key={bid.id}
                          bid={bid}
                          onAccept={() => handleAcceptBid(bid.id)}
                          onReject={() => handleRejectBid(bid.id)}
                          disabled={isProcessing || job.status !== "open"}
                        />
                      ))}
                    </div>
                  )}

                  {/* Rejected Bids */}
                  {bids.filter(b => b.status === "rejected").length > 0 && (
                    <div className="pt-4 border-t border-brand-border/50">
                      <p className="text-sm text-brand-text-light mb-2">ปฏิเสธแล้ว</p>
                      {bids.filter(b => b.status === "rejected").map((bid) => (
                        <BidCard key={bid.id} bid={bid} isRejected />
                      ))}
                    </div>
                  )}
                </div>
              )}
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Link to Order */}
            {job.orderId && (
              <Card variant="elevated" padding="lg" className="border-none shadow-lg">
                <h3 className="font-bold text-brand-text-dark mb-3 flex items-center gap-2">
                  <Briefcase className="w-4 h-4 text-brand-primary" />
                  ออเดอร์ที่เกี่ยวข้อง
                </h3>
                <Link href={`/seller/orders/${job.orderId}`}>
                  <Button variant="outline" className="w-full">
                    ดูออเดอร์
                    <ExternalLink className="w-4 h-4 ml-2" />
                  </Button>
                </Link>
              </Card>
            )}

            {/* Tips */}
            <Card variant="bordered" padding="md" className="bg-brand-info/5 border-brand-info/20">
              <div className="flex gap-3">
                <AlertCircle className="w-5 h-5 text-brand-info shrink-0 mt-0.5" />
                <div className="text-sm text-brand-text-dark">
                  <p className="font-medium text-brand-info mb-2">วิธีเลือก Bid</p>
                  <ul className="space-y-1 text-brand-text-light text-xs">
                    <li>• ดูราคาที่ทีมเสนอ (ยิ่งต่ำยิ่งดี)</li>
                    <li>• ดู rating และประสบการณ์ของทีม</li>
                    <li>• ดูระยะเวลาที่ทีมเสนอ</li>
                    <li>• เมื่อรับ bid งานจะถูกมอบหมายทันที</li>
                  </ul>
                </div>
              </div>
            </Card>
          </div>
        </div>

        {/* Cancel Modal */}
        <Dialog
          open={showCancelModal}
          onClose={() => setShowCancelModal(false)}
        >
          <Dialog.Header>
            <Dialog.Title>ยกเลิกงาน</Dialog.Title>
          </Dialog.Header>
          <Dialog.Body>
            <div className="p-4 bg-brand-warning/10 border border-brand-warning/20 rounded-xl">
              <div className="flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-brand-warning mt-0.5" />
                <div>
                  <p className="font-bold text-brand-text-dark">ยืนยันการยกเลิกงาน?</p>
                  <p className="text-sm text-brand-text-light mt-1">
                    งานจะถูกลบออกจาก Hub และทีมที่ส่ง bid ไว้จะได้รับแจ้งเตือน
                  </p>
                </div>
              </div>
            </div>
          </Dialog.Body>
          <Dialog.Footer>
            <Button variant="outline" onClick={() => setShowCancelModal(false)}>
              ยกเลิก
            </Button>
            <Button
              onClick={handleCancelJob}
              disabled={isProcessing}
              isLoading={isProcessing}
              className="bg-red-600 hover:bg-red-700"
            >
              ยืนยันยกเลิก
            </Button>
          </Dialog.Footer>
        </Dialog>
      </Section>
    </Container>
  );
}

// Bid Card Component
function BidCard({
  bid,
  onAccept,
  onReject,
  disabled,
  isAccepted,
  isRejected,
}: {
  bid: OutsourceBid;
  onAccept?: () => void;
  onReject?: () => void;
  disabled?: boolean;
  isAccepted?: boolean;
  isRejected?: boolean;
}) {
  return (
    <div className={`p-4 rounded-xl border ${
      isAccepted ? "bg-brand-success/5 border-brand-success/30" :
      isRejected ? "bg-brand-bg/50 border-brand-border/30 opacity-60" :
      "bg-white border-brand-border/50"
    }`}>
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-brand-primary/10 flex items-center justify-center text-brand-primary font-bold">
            {bid.team.name.charAt(0)}
          </div>
          <div>
            <p className="font-bold text-brand-text-dark">{bid.team.name}</p>
            <div className="flex items-center gap-2 text-xs text-brand-text-light">
              <span className="flex items-center gap-1">
                <Star className="w-3 h-3 text-brand-warning" />
                {bid.team.rating.toFixed(1)}
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <Users className="w-3 h-3" />
                {bid.team.memberCount} คน
              </span>
              <span>•</span>
              <span>{bid.team.completedJobs} งานเสร็จ</span>
            </div>
          </div>
        </div>

        <div className="text-right">
          <p className="text-xl font-bold text-brand-success">
            ฿{bid.pricePerUnit}/หน่วย
          </p>
          <p className="text-xs text-brand-text-light">
            รวม ฿{bid.totalPrice.toLocaleString()}
          </p>
        </div>
      </div>

      {bid.message && (
        <p className="text-sm text-brand-text-light mt-3 p-2 bg-brand-bg/50 rounded-lg">
          "{bid.message}"
        </p>
      )}

      <div className="flex items-center justify-between mt-3 pt-3 border-t border-brand-border/30">
        <div className="flex items-center gap-3 text-xs text-brand-text-light">
          <span className="flex items-center gap-1">
            <Clock className="w-3 h-3" />
            ส่งงานใน {bid.estimatedDays} วัน
          </span>
          <span>•</span>
          <span>
            {new Date(bid.createdAt).toLocaleDateString("th-TH", {
              day: "numeric",
              month: "short",
              hour: "2-digit",
              minute: "2-digit",
            })}
          </span>
        </div>

        {!isAccepted && !isRejected && onAccept && onReject && (
          <div className="flex gap-2">
            <Button
              size="sm"
              variant="outline"
              onClick={onReject}
              disabled={disabled}
              className="border-red-300 text-red-600 hover:bg-red-50"
            >
              <XCircle className="w-3 h-3 mr-1" />
              ปฏิเสธ
            </Button>
            <Button
              size="sm"
              onClick={onAccept}
              disabled={disabled}
              className="shadow-md shadow-brand-primary/20"
            >
              <CheckCircle2 className="w-3 h-3 mr-1" />
              รับ Bid
            </Button>
          </div>
        )}

        {isAccepted && (
          <Badge variant="success" size="sm">
            <CheckCircle2 className="w-3 h-3 mr-1" />
            รับแล้ว
          </Badge>
        )}
      </div>
    </div>
  );
}
