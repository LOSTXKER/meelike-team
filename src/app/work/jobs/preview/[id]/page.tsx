"use client";

import { useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { Card, Badge, Button } from "@/components/ui";
import { Container, Section, HStack, VStack } from "@/components/layout";
import { PlatformIcon, ServiceTypeBadge, EmptyState, PageSkeleton } from "@/components/shared";
import { useTeamJobPreview } from "@/lib/api/hooks";
import { api } from "@/lib/api";
import type { Platform, ServiceMode } from "@/types";
import {
  ArrowLeft,
  ExternalLink,
  Clock,
  Target,
  DollarSign,
  AlertCircle,
  ClipboardList,
  Users,
  Star,
  Briefcase,
  CheckCircle2,
} from "lucide-react";

export default function WorkerJobPreviewPage() {
  const params = useParams();
  const router = useRouter();
  const jobId = params.id as string;

  const [isClaiming, setIsClaiming] = useState(false);
  const { data: previewData, isLoading, refetch } = useTeamJobPreview(jobId);

  const job = previewData?.teamJob;
  const team = previewData?.team;
  const existingClaim = previewData?.existingClaim;

  const handleClaimJob = async () => {
    if (!job) return;

    const quantityStr = prompt(`จำนวนที่ต้องการจอง (เหลือ ${job.quantity - job.completedQuantity}):`);
    if (!quantityStr) return;

    const quantity = parseInt(quantityStr, 10);
    if (isNaN(quantity) || quantity <= 0) {
      alert("กรุณาระบุจำนวนที่ถูกต้อง");
      return;
    }

    if (quantity > job.quantity - job.completedQuantity) {
      alert("จำนวนเกินที่เหลืออยู่");
      return;
    }

    setIsClaiming(true);
    try {
      const claim = await api.worker.claimTeamJob(job.id, quantity);
      await refetch();
      alert(`จองงานสำเร็จ! คุณจะได้รับ ฿${claim.earnAmount.toFixed(2)}`);
      
      // Redirect to the claim detail page
      router.push(`/work/jobs/${claim.id}`);
    } catch (error) {
      console.error("Error claiming job:", error);
      alert("เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง");
    } finally {
      setIsClaiming(false);
    }
  };

  if (isLoading) {
    return <PageSkeleton variant="detail" className="max-w-7xl mx-auto" />;
  }

  if (!job) {
    return (
      <Container size="xl">
        <Section spacing="lg">
          <EmptyState
            icon={Briefcase}
            title="ไม่พบงานนี้"
            description="งานอาจถูกลบหรือไม่มีอยู่ในระบบ"
          />
          <div className="text-center mt-6">
            <Link href="/work/teams">
              <Button>กลับไปหน้าทีม</Button>
            </Link>
          </div>
        </Section>
      </Container>
    );
  }

  const remainingQuantity = job.quantity - job.completedQuantity;
  const totalEarnings = remainingQuantity * job.pricePerUnit;

  return (
    <Container size="xl">
      <Section spacing="lg" className="animate-fade-in">
        {/* Header */}
        <HStack justify="between" align="center" className="flex-col md:flex-row gap-4">
          <HStack gap={4} align="center">
            <button
              onClick={() => router.back()}
              className="p-3 hover:bg-white bg-white/60 backdrop-blur-sm border border-brand-border/50 rounded-xl transition-all shadow-sm group"
            >
              <ArrowLeft className="w-5 h-5 text-brand-text-dark group-hover:text-brand-primary" />
            </button>
            <VStack gap={2}>
              <HStack gap={3} align="center">
                <h1 className="text-3xl font-bold text-brand-text-dark tracking-tight">
                  {job.serviceName}
                </h1>
                {existingClaim ? (
                  <Badge variant="success" className="text-sm px-2.5 py-0.5 shadow-sm">
                    <CheckCircle2 className="w-3 h-3 mr-1" />
                    จองแล้ว
                  </Badge>
                ) : remainingQuantity > 0 ? (
                  <Badge variant="default" className="text-sm px-2.5 py-0.5 shadow-sm bg-brand-bg text-brand-text-dark">
                    เปิดรับ
                  </Badge>
                ) : (
                  <Badge variant="default" className="text-sm px-2.5 py-0.5 shadow-sm bg-brand-text-light/10 text-brand-text-light">
                    เต็มแล้ว
                  </Badge>
                )}
              </HStack>
              <div className="flex items-center gap-3 mt-2">
                {team && (
                  <Badge variant="default" className="bg-brand-bg text-brand-text-dark border-brand-border/50 font-medium px-3 py-1">
                    <Users className="w-3.5 h-3.5 mr-1.5 text-brand-text-light" />
                    {team.name}
                  </Badge>
                )}
                <ServiceTypeBadge type={job.platform as ServiceMode} />
              </div>
            </VStack>
          </HStack>

          {existingClaim ? (
            <Link href={`/work/jobs/${existingClaim.id}`}>
              <Button size="lg" variant="secondary" className="shadow-lg px-8">
                <Briefcase className="w-5 h-5 mr-2" />
                ไปหน้างานของฉัน
              </Button>
            </Link>
          ) : remainingQuantity > 0 ? (
            <Button
              size="lg"
              onClick={handleClaimJob}
              disabled={isClaiming}
              isLoading={isClaiming}
              className="shadow-lg shadow-brand-primary/20 px-8"
            >
              <CheckCircle2 className="w-5 h-5 mr-2" />
              จองงาน
            </Button>
          ) : (
            <Badge variant="default" className="px-6 py-3 text-base bg-brand-text-light/10 text-brand-text-light">
              งานเต็มแล้ว
            </Badge>
          )}
        </HStack>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Job Info Card */}
            <Card variant="elevated" padding="lg" className="border-none shadow-xl shadow-brand-primary/5 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-brand-primary/5 rounded-full blur-3xl -mr-32 -mt-32" />
              <div className="relative">
                <div className="flex items-center justify-between mb-8">
                  <h2 className="text-xl font-bold text-brand-text-dark flex items-center gap-3">
                    <div className="p-2.5 bg-brand-primary/10 rounded-xl">
                      <Target className="w-6 h-6 text-brand-primary" />
                    </div>
                    รายละเอียดงาน
                  </h2>
                </div>

                <div className="space-y-6">
                  {/* Stats */}
                  <div className="grid grid-cols-3 gap-4">
                    <div className="p-5 bg-brand-bg border border-brand-border/50 rounded-2xl text-center">
                      <p className="text-3xl font-bold text-brand-primary mb-1">
                        {job.quantity}
                      </p>
                      <p className="text-xs font-bold text-brand-text-light uppercase tracking-wider">เป้าหมาย</p>
                    </div>
                    <div className="p-5 bg-brand-success/5 border border-brand-success/10 rounded-2xl text-center">
                      <p className="text-3xl font-bold text-brand-success mb-1">
                        {job.completedQuantity}
                      </p>
                      <p className="text-xs font-bold text-brand-text-light uppercase tracking-wider">ทำแล้ว</p>
                    </div>
                    <div className="p-5 bg-brand-warning/5 border border-brand-warning/10 rounded-2xl text-center">
                      <p className="text-3xl font-bold text-brand-warning mb-1">
                        {remainingQuantity}
                      </p>
                      <p className="text-xs font-bold text-brand-text-light uppercase tracking-wider">เหลืออีก</p>
                    </div>
                  </div>

                  {/* Order Info */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 bg-brand-bg/50 rounded-xl">
                      <p className="text-xs text-brand-text-light font-medium mb-1">เลขออเดอร์</p>
                      <p className="text-brand-text-dark font-bold">{job.orderNumber}</p>
                    </div>
                    {job.deadline && (
                      <div className="p-4 bg-brand-bg/50 rounded-xl">
                        <p className="text-xs text-brand-text-light font-medium mb-1">กำหนดส่ง</p>
                        <p className="text-brand-text-dark font-bold">
                          {new Date(job.deadline).toLocaleDateString("th-TH", {
                            day: "numeric",
                            month: "short",
                          })}
                        </p>
                      </div>
                    )}
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
                    <Button variant="outline" className="w-full bg-white shadow-sm border-brand-border/50">
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

                <div className="p-5 bg-brand-info/5 border border-brand-info/10 rounded-2xl mb-4">
                  <p className="text-brand-text-dark font-medium leading-relaxed whitespace-pre-wrap">
                    {job.instructions}
                  </p>
                </div>

                <div className="p-5 bg-brand-warning/5 border border-brand-warning/10 rounded-2xl flex gap-4">
                  <div className="p-2 bg-white rounded-full shadow-sm h-fit">
                    <AlertCircle className="w-6 h-6 text-brand-warning shrink-0" />
                  </div>
                  <div>
                    <p className="font-bold text-brand-text-dark text-lg mb-2">
                      ข้อควรระวัง
                    </p>
                    <ul className="text-sm text-brand-text-dark/80 space-y-2 font-medium">
                      <li className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-brand-warning" /> 
                        ห้ามใช้บอทหรือ Auto Like เด็ดขาด
                      </li>
                      <li className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-brand-warning" /> 
                        ใช้บัญชีที่มีความเคลื่อนไหว มีรูปโปรไฟล์จริง
                      </li>
                      <li className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-brand-warning" /> 
                        หากพบลิงก์เสีย ให้แจ้งทีมทันที
                      </li>
                    </ul>
                  </div>
                </div>
              </Card>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Earnings */}
            <Card className="bg-gradient-to-br from-brand-success to-[#1E8E3E] text-white border-none shadow-xl shadow-brand-success/20 overflow-hidden relative">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2" />
              <div className="p-6 relative z-10">
                <div className="flex items-center gap-2 mb-2 text-white/90 font-medium">
                  <div className="p-1 bg-white/20 rounded-lg backdrop-blur-sm">
                    <DollarSign className="w-4 h-4" />
                  </div>
                  รายได้ที่จะได้รับ
                </div>
                <p className="text-4xl font-bold mt-2 tracking-tight">
                  ฿{totalEarnings.toFixed(2)}
                </p>
                <div className="mt-4 pt-4 border-t border-white/20 flex justify-between items-center text-sm">
                  <span className="text-white/80">ราคาต่อหน่วย</span>
                  <span className="px-2 py-1 bg-white/20 rounded-lg text-xs font-semibold backdrop-blur-sm">
                    ฿{job.pricePerUnit}/หน่วย
                  </span>
                </div>
              </div>
            </Card>

            {/* Team Info */}
            {team && (
              <Card variant="elevated" padding="lg" className="border-none shadow-lg shadow-brand-primary/5">
                <h3 className="font-bold text-brand-text-dark mb-4 flex items-center gap-2">
                  <div className="p-2 bg-brand-accent/10 rounded-lg">
                    <Users className="w-5 h-5 text-brand-accent" />
                  </div>
                  เกี่ยวกับทีม
                </h3>

                <div className="flex items-center gap-4 mb-6">
                  <div className="w-16 h-16 bg-gradient-to-br from-brand-primary to-brand-accent rounded-2xl flex items-center justify-center text-2xl font-bold text-white shadow-lg shadow-brand-primary/20">
                    {team.name.charAt(0)}
                  </div>
                  <div>
                    <p className="font-bold text-brand-text-dark text-xl mb-1">
                      {team.name}
                    </p>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold px-2 py-0.5 bg-brand-warning/10 text-brand-warning rounded-md flex items-center gap-1">
                        <Star className="w-3 h-3 fill-brand-warning" /> 
                        {team.rating.toFixed(1)}
                      </span>
                      <span className="text-xs text-brand-text-light font-medium flex items-center gap-1">
                        <span className="w-1 h-1 rounded-full bg-brand-border" />
                        {team.totalJobsCompleted} งาน
                      </span>
                    </div>
                  </div>
                </div>

                {team.description && (
                  <p className="text-sm text-brand-text-light mb-4 leading-relaxed">
                    {team.description}
                  </p>
                )}

                <Link href={`/work/teams/${team.id}`}>
                  <Button variant="outline" className="w-full shadow-sm bg-white hover:bg-brand-bg/50 border-brand-border/50 h-12 text-base font-medium" size="lg">
                    <Users className="w-5 h-5 mr-2 text-brand-primary" />
                    ดูข้อมูลทีม
                  </Button>
                </Link>
              </Card>
            )}

            {/* Status Info */}
            {existingClaim && (
              <Card variant="elevated" padding="lg" className="border-none shadow-lg shadow-brand-success/5 bg-brand-success/5">
                <div className="text-center space-y-3">
                  <div className="w-16 h-16 bg-brand-success rounded-full flex items-center justify-center mx-auto">
                    <CheckCircle2 className="w-8 h-8 text-white" />
                  </div>
                  <div>
                    <p className="font-bold text-brand-text-dark text-lg mb-1">
                      คุณจองงานนี้แล้ว
                    </p>
                    <p className="text-sm text-brand-text-light">
                      จำนวน: {existingClaim.quantity} หน่วย
                    </p>
                    <p className="text-sm text-brand-text-light">
                      รายได้: ฿{existingClaim.earnAmount.toFixed(2)}
                    </p>
                  </div>
                  <Link href={`/work/jobs/${existingClaim.id}`}>
                    <Button className="w-full shadow-md shadow-brand-primary/20 mt-2">
                      <Briefcase className="w-4 h-4 mr-2" />
                      ไปหน้างานของฉัน
                    </Button>
                  </Link>
                </div>
              </Card>
            )}

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
                  <span className="text-brand-text-light font-medium">วันที่เปิดรับ</span>
                  <span className="text-brand-text-dark font-bold">
                    {new Date(job.createdAt).toLocaleDateString("th-TH", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </span>
                </div>
                {job.deadline && (
                  <div className="flex justify-between items-center text-sm p-3 bg-brand-warning/5 border border-brand-warning/10 rounded-xl">
                    <span className="text-brand-text-light font-medium">กำหนดส่ง</span>
                    <span className="text-brand-warning font-bold">
                      {new Date(job.deadline).toLocaleDateString("th-TH", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </span>
                  </div>
                )}
              </div>
            </Card>
          </div>
        </div>
      </Section>
    </Container>
  );
}
