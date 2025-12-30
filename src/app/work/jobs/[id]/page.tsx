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
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/work/jobs">
            <button className="p-2 hover:bg-brand-bg rounded-lg transition-colors">
              <ArrowLeft className="w-5 h-5 text-brand-text-dark" />
            </button>
          </Link>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold text-brand-text-dark">
                {job.serviceName}
              </h1>
              <Badge variant="info">กำลังทำ</Badge>
            </div>
            <p className="text-brand-text-light text-sm">
              จาก {job.teamName}
            </p>
          </div>
        </div>

        <Button onClick={() => setShowSubmitModal(true)}>
          <Upload className="w-4 h-4 mr-2" />
          ส่งงาน
        </Button>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Progress Card */}
          <Card variant="bordered" padding="lg">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-semibold text-brand-text-dark flex items-center gap-2">
                <Target className="w-5 h-5 text-brand-primary" />
                ความคืบหน้า
              </h2>
              <button
                onClick={() => setIsWorking(!isWorking)}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                  isWorking
                    ? "bg-brand-success/10 text-brand-success"
                    : "bg-brand-warning/10 text-brand-warning"
                }`}
              >
                {isWorking ? (
                  <>
                    <Pause className="w-4 h-4" />
                    กำลังทำ
                  </>
                ) : (
                  <>
                    <Play className="w-4 h-4" />
                    หยุดพัก
                  </>
                )}
              </button>
            </div>

            <div className="space-y-4">
              {/* Progress Stats */}
              <div className="grid grid-cols-3 gap-4">
                <div className="p-3 bg-brand-bg rounded-xl text-center">
                  <p className="text-2xl font-bold text-brand-success">
                    {job.completedQuantity}
                  </p>
                  <p className="text-xs text-brand-text-light">เสร็จแล้ว</p>
                </div>
                <div className="p-3 bg-brand-bg rounded-xl text-center">
                  <p className="text-2xl font-bold text-brand-warning">
                    {remainingQuantity}
                  </p>
                  <p className="text-xs text-brand-text-light">เหลืออีก</p>
                </div>
                <div className="p-3 bg-brand-bg rounded-xl text-center">
                  <p className="text-2xl font-bold text-brand-primary">
                    {job.quantity}
                  </p>
                  <p className="text-xs text-brand-text-light">ทั้งหมด</p>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-brand-text-light">
                    ความคืบหน้า
                  </span>
                  <span className="font-semibold text-brand-text-dark">
                    {Math.round(progress)}%
                  </span>
                </div>
                <Progress value={progress} size="lg" />
              </div>

              {/* Update Progress */}
              <div className="flex items-center gap-3 pt-2">
                <input
                  type="number"
                  placeholder="จำนวนที่ทำเพิ่ม"
                  className="flex-1 px-4 py-2 bg-brand-surface border border-brand-border rounded-lg text-brand-text-dark focus:outline-none focus:border-brand-primary"
                />
                <Button variant="secondary">
                  <CheckCircle2 className="w-4 h-4 mr-2" />
                  อัปเดต
                </Button>
              </div>
            </div>
          </Card>

          {/* Target Link */}
          <Card variant="bordered" padding="lg">
            <h2 className="font-semibold text-brand-text-dark mb-4 flex items-center gap-2">
              <ExternalLink className="w-5 h-5 text-brand-primary" />
              ลิงก์งาน
            </h2>

            <div className="p-4 bg-brand-bg rounded-xl">
              <div className="flex items-center gap-3">
                <Facebook className="w-8 h-8 text-blue-500" />
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-brand-text-dark truncate">
                    {job.targetUrl}
                  </p>
                  <p className="text-sm text-brand-text-light">
                    Facebook Post
                  </p>
                </div>
              </div>

              <div className="flex gap-2 mt-4">
                <a
                  href={job.targetUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1"
                >
                  <Button variant="default" className="w-full">
                    <ExternalLink className="w-4 h-4 mr-2" />
                    เปิดลิงก์
                  </Button>
                </a>
                <Button variant="outline" className="flex items-center gap-1">
                  <ClipboardList className="w-4 h-4" />
                  คัดลอก
                </Button>
              </div>
            </div>
          </Card>

          {/* Instructions */}
          <Card variant="bordered" padding="lg">
            <h2 className="font-semibold text-brand-text-dark mb-4 flex items-center gap-2">
              📝 คำแนะนำการทำงาน
            </h2>

            <div className="p-4 bg-brand-info/10 rounded-xl">
              <p className="text-brand-text-dark">{job.instructions}</p>
            </div>

            <div className="mt-4 p-4 bg-brand-warning/10 rounded-xl flex gap-3">
              <AlertCircle className="w-5 h-5 text-brand-warning shrink-0" />
              <div>
                <p className="font-medium text-brand-text-dark">
                  ข้อควรระวัง
                </p>
                <ul className="text-sm text-brand-text-light mt-1 space-y-1">
                  <li>• ห้ามใช้บอทหรือ Auto Like</li>
                  <li>• ใช้แอคที่มีความเคลื่อนไหวเท่านั้น</li>
                  <li>• ถ้าพบปัญหาให้แจ้งทีมทันที</li>
                </ul>
              </div>
            </div>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Earnings */}
          <Card className="bg-gradient-to-br from-brand-success to-green-600 text-white">
            <div className="p-6">
              <p className="text-white/80 text-sm">รายได้จากงานนี้</p>
              <p className="text-3xl font-bold mt-1">
                ฿{job.earnedSoFar.toFixed(2)}
              </p>
              <p className="text-white/60 text-sm mt-2">
                จาก ฿{job.totalEarnings.toFixed(2)} (฿{job.pricePerUnit}/หน่วย)
              </p>
            </div>
          </Card>

          {/* Time Info */}
          <Card variant="bordered" padding="lg">
            <h3 className="font-semibold text-brand-text-dark mb-4 flex items-center gap-2">
              <Clock className="w-5 h-5 text-brand-primary" />
              เวลา
            </h3>

            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-brand-text-light">เริ่มงาน</span>
                <span className="text-brand-text-dark">
                  {new Date(job.startedAt).toLocaleTimeString("th-TH", {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-brand-text-light">กำหนดส่ง</span>
                <span className="text-brand-text-dark">
                  {new Date(job.deadline).toLocaleTimeString("th-TH", {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>
              </div>
              <div className="pt-3 border-t border-brand-border">
                <div className="flex justify-between items-center">
                  <span className="text-brand-text-light text-sm">
                    เหลือเวลา
                  </span>
                  <span className="font-semibold text-brand-warning">
                    {getTimeRemaining()}
                  </span>
                </div>
              </div>
            </div>
          </Card>

          {/* Team Info */}
          <Card variant="bordered" padding="lg">
            <h3 className="font-semibold text-brand-text-dark mb-4 flex items-center gap-2">
              <Users className="w-5 h-5" />
              ทีม
            </h3>

            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-brand-primary/10 rounded-xl flex items-center justify-center text-xl font-bold text-brand-primary">
                {job.teamLogo}
              </div>
              <div>
                <p className="font-medium text-brand-text-dark">
                  {job.teamName}
                </p>
                <p className="text-sm text-brand-text-light flex items-center gap-1">
                  <Star className="w-4 h-4" />
                  4.9 • 1,234 งาน
                </p>
              </div>
            </div>

            <Button variant="outline" className="w-full mt-4" size="sm">
              <MessageSquare className="w-4 h-4 mr-2" />
              ติดต่อทีม
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

