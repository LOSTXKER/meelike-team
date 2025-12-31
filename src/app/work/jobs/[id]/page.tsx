"use client";

import { useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { Card, Badge, Button, Progress, Modal, Textarea } from "@/components/ui";
import {
  ArrowLeft,
  ExternalLink,
  Clock,
  Target,
  CheckCircle2,
  Upload,
  MessageSquare,
  AlertCircle,
  Play,
  Pause,
  Send,
  Image as ImageIcon,
  Users,
  Facebook,
  ClipboardList,
  Star,
  DollarSign,
} from "lucide-react";

export default function JobDetailPage() {
  const params = useParams();
  const jobId = params.id as string;

  const [showSubmitModal, setShowSubmitModal] = useState(false);
  const [submitNote, setSubmitNote] = useState("");
  const [isWorking, setIsWorking] = useState(true);

  // Mock job data
  const job = {
    id: jobId,
    teamName: "JohnBoost Team",
    teamLogo: "J",
    serviceName: "ไลค์ Facebook",
    serviceType: "human",
    platform: "facebook",
    targetUrl: "https://facebook.com/photo.php?fbid=123456789",
    quantity: 100,
    completedQuantity: 65,
    pricePerUnit: 0.2,
    totalEarnings: 20,
    earnedSoFar: 13,
    deadline: new Date(Date.now() + 3600000 * 2).toISOString(),
    startedAt: new Date(Date.now() - 3600000).toISOString(),
    instructions: "กดไลค์โพสต์ตามลิงก์ ใช้แอคคุณภาพเท่านั้น ห้ามใช้บอท",
    status: "in_progress",
  };

  const progress = (job.completedQuantity / job.quantity) * 100;
  const remainingQuantity = job.quantity - job.completedQuantity;

  const getTimeRemaining = () => {
    const diff = new Date(job.deadline).getTime() - Date.now();
    const hours = Math.floor(diff / 3600000);
    const minutes = Math.floor((diff % 3600000) / 60000);
    return `${hours} ชั่วโมง ${minutes} นาที`;
  };

  const handleSubmit = () => {
    alert("ส่งงานเรียบร้อย! รอ Seller ตรวจสอบ");
    setShowSubmitModal(false);
  };

  return (
    <div className="space-y-8 animate-fade-in max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Link href="/work/jobs">
            <button className="p-3 hover:bg-white bg-white/60 backdrop-blur-sm border border-brand-border/50 rounded-xl transition-all shadow-sm group">
              <ArrowLeft className="w-5 h-5 text-brand-text-dark group-hover:text-brand-primary" />
            </button>
          </Link>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-3xl font-bold text-brand-text-dark tracking-tight">
                {job.serviceName}
              </h1>
              <Badge variant="warning" className="text-sm px-2.5 py-0.5 shadow-sm animate-pulse">
                <Clock className="w-3 h-3 mr-1" />
                กำลังทำ
              </Badge>
            </div>
            <div className="flex items-center gap-3 mt-2">
              <Badge variant="secondary" className="bg-brand-bg text-brand-text-dark border-brand-border/50 font-medium px-3 py-1">
                <Users className="w-3.5 h-3.5 mr-1.5 text-brand-text-light" />
                {job.teamName}
              </Badge>
              <Badge variant="success" size="sm" className="px-3 py-1">
                <DollarSign className="w-3.5 h-3.5 mr-1" />
                จ่ายไว
              </Badge>
            </div>
          </div>
        </div>

        <Button onClick={() => setShowSubmitModal(true)} size="lg" className="shadow-lg shadow-brand-primary/20 px-8">
          <Upload className="w-5 h-5 mr-2" />
          ส่งงานทันที
        </Button>
      </div>

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
                <button
                  onClick={() => setIsWorking(!isWorking)}
                  className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold transition-all shadow-sm ${
                    isWorking
                      ? "bg-brand-success/10 text-brand-success border border-brand-success/20 hover:bg-brand-success/20"
                      : "bg-brand-warning/10 text-brand-warning border border-brand-warning/20 hover:bg-brand-warning/20"
                  }`}
                >
                  {isWorking ? (
                    <>
                      <Pause className="w-4 h-4 fill-current" />
                      กำลังทำงาน
                    </>
                  ) : (
                    <>
                      <Play className="w-4 h-4 fill-current" />
                      หยุดพัก
                    </>
                  )}
                </button>
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

                {/* Update Progress */}
                <div className="flex items-center gap-4 pt-2">
                  <div className="relative flex-1">
                    <input
                      type="number"
                      placeholder="ระบุจำนวนที่ทำเพิ่ม..."
                      className="w-full pl-5 pr-4 py-4 bg-white border border-brand-border rounded-xl text-lg text-brand-text-dark focus:outline-none focus:ring-4 focus:ring-brand-primary/10 focus:border-brand-primary transition-all shadow-sm placeholder:text-brand-text-light/50"
                    />
                  </div>
                  <Button size="lg" variant="secondary" className="shadow-md border-brand-border/50 h-[60px] px-8 text-base">
                    <CheckCircle2 className="w-6 h-6 mr-2 text-brand-success" />
                    อัปเดต
                  </Button>
                </div>
              </div>
            </div>
          </Card>

          {/* Target Link */}
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
                  <Facebook className="w-7 h-7 text-[#1877F2]" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-brand-text-dark truncate text-lg">
                    {job.targetUrl}
                  </p>
                  <p className="text-sm text-brand-text-light font-medium">
                    ประเภท: Facebook Post
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
                  <Button variant="default" className="w-full shadow-md shadow-brand-primary/20">
                    <ExternalLink className="w-4 h-4 mr-2" />
                    เปิดลิงก์ทำงาน
                  </Button>
                </a>
                <Button variant="outline" className="flex items-center gap-2 bg-white shadow-sm border-brand-border/50">
                  <ClipboardList className="w-4 h-4" />
                  คัดลอก
                </Button>
              </div>
            </div>
          </Card>

          {/* Instructions */}
          <Card variant="elevated" padding="lg" className="border-none shadow-lg shadow-brand-primary/5">
            <h2 className="text-lg font-bold text-brand-text-dark mb-4 flex items-center gap-2">
              <div className="p-2 bg-brand-info/10 rounded-lg">
                <ClipboardList className="w-5 h-5 text-brand-info" />
              </div>
              คำแนะนำการทำงาน
            </h2>

            <div className="p-5 bg-brand-info/5 border border-brand-info/10 rounded-2xl mb-4">
              <p className="text-brand-text-dark font-medium leading-relaxed">{job.instructions}</p>
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
                  <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-brand-warning" /> ห้ามใช้บอทหรือ Auto Like เด็ดขาด</li>
                  <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-brand-warning" /> ใช้บัญชีที่มีความเคลื่อนไหว มีรูปโปรไฟล์จริง</li>
                  <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-brand-warning" /> หากพบลิงก์เสีย ให้แจ้งทีมทันที</li>
                </ul>
              </div>
            </div>
          </Card>
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
                รายได้จากงานนี้
              </div>
              <p className="text-4xl font-bold mt-2 tracking-tight">
                ฿{job.earnedSoFar.toFixed(2)}
              </p>
              <div className="mt-4 pt-4 border-t border-white/20 flex justify-between items-center text-sm">
                <span className="text-white/80">ทั้งหมด ฿{job.totalEarnings.toFixed(2)}</span>
                <span className="px-2 py-1 bg-white/20 rounded-lg text-xs font-semibold backdrop-blur-sm">฿{job.pricePerUnit}/หน่วย</span>
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
                <span className="text-brand-text-light font-medium">เริ่มงาน</span>
                <span className="text-brand-text-dark font-bold">
                  {new Date(job.startedAt).toLocaleTimeString("th-TH", {
                    hour: "2-digit",
                    minute: "2-digit",
                  })} น.
                </span>
              </div>
              <div className="flex justify-between items-center text-sm p-3 bg-brand-bg/50 rounded-xl">
                <span className="text-brand-text-light font-medium">กำหนดส่ง</span>
                <span className="text-brand-text-dark font-bold">
                  {new Date(job.deadline).toLocaleTimeString("th-TH", {
                    hour: "2-digit",
                    minute: "2-digit",
                  })} น.
                </span>
              </div>
              <div className="pt-4 border-t border-brand-border/50">
                <div className="flex justify-between items-center">
                  <span className="text-brand-text-light text-sm font-medium">
                    เหลือเวลา
                  </span>
                  <Badge variant="warning" className="text-sm px-3 py-1 shadow-sm">
                    <Clock className="w-3.5 h-3.5 mr-1.5" />
                    {getTimeRemaining()}
                  </Badge>
                </div>
              </div>
            </div>
          </Card>

          {/* Team Info */}
          <Card variant="elevated" padding="lg" className="border-none shadow-lg shadow-brand-primary/5">
            <h3 className="font-bold text-brand-text-dark mb-4 flex items-center gap-2">
              <div className="p-2 bg-brand-accent/10 rounded-lg">
                <Users className="w-5 h-5 text-brand-accent" />
              </div>
              เกี่ยวกับทีม
            </h3>

            <div className="flex items-center gap-4 mb-6">
              <div className="w-16 h-16 bg-gradient-to-br from-brand-primary to-brand-accent rounded-2xl flex items-center justify-center text-2xl font-bold text-white shadow-lg shadow-brand-primary/20">
                {job.teamLogo}
              </div>
              <div>
                <p className="font-bold text-brand-text-dark text-xl mb-1">
                  {job.teamName}
                </p>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold px-2 py-0.5 bg-brand-warning/10 text-brand-warning rounded-md flex items-center gap-1">
                    <Star className="w-3 h-3 fill-brand-warning" /> 4.9
                  </span>
                  <span className="text-xs text-brand-text-light font-medium flex items-center gap-1">
                    <span className="w-1 h-1 rounded-full bg-brand-border" />
                    1,234 งาน
                  </span>
                </div>
              </div>
            </div>

            <Button variant="outline" className="w-full shadow-sm bg-white hover:bg-brand-bg/50 border-brand-border/50 h-12 text-base font-medium" size="lg">
              <MessageSquare className="w-5 h-5 mr-2 text-brand-primary" />
              ติดต่อทีมงาน
            </Button>
          </Card>
        </div>
      </div>

      {/* Submit Modal */}
      <Modal
        isOpen={showSubmitModal}
        onClose={() => setShowSubmitModal(false)}
        title="ส่งงาน"
      >
        <div className="space-y-4">
          <div className="p-4 bg-brand-bg rounded-lg">
            <div className="flex justify-between mb-2">
              <span className="text-brand-text-light">งาน</span>
              <span className="font-medium text-brand-text-dark">
                {job.serviceName}
              </span>
            </div>
            <div className="flex justify-between mb-2">
              <span className="text-brand-text-light">จำนวนที่ทำ</span>
              <span className="font-medium text-brand-text-dark">
                {job.completedQuantity}/{job.quantity}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-brand-text-light">รายได้</span>
              <span className="font-bold text-brand-success">
                ฿{job.earnedSoFar.toFixed(2)}
              </span>
            </div>
          </div>

          {/* Proof Upload */}
          <div>
            <label className="block text-sm font-medium text-brand-text-dark mb-2">
              แนบหลักฐาน (ถ้ามี)
            </label>
            <div className="border-2 border-dashed border-brand-border rounded-xl p-6 text-center hover:border-brand-primary/50 transition-colors cursor-pointer">
              <ImageIcon className="w-8 h-8 text-brand-text-light mx-auto mb-2" />
              <p className="text-sm text-brand-text-dark">
                คลิกหรือลากไฟล์มาวาง
              </p>
              <p className="text-xs text-brand-text-light mt-1">
                PNG, JPG ขนาดไม่เกิน 5MB
              </p>
            </div>
          </div>

          <Textarea
            label="หมายเหตุ (ถ้ามี)"
            placeholder="รายละเอียดเพิ่มเติม..."
            value={submitNote}
            onChange={(e) => setSubmitNote(e.target.value)}
          />

          <div className="flex gap-3 justify-end">
            <Button variant="outline" onClick={() => setShowSubmitModal(false)}>
              ยกเลิก
            </Button>
            <Button onClick={handleSubmit}>
              <Send className="w-4 h-4 mr-2" />
              ส่งงาน
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}

