"use client";

import * as React from "react";
import { Modal, Button, Input, Textarea } from "@/components/ui";
import { PlatformIcon } from "@/components/shared";
import type { Platform } from "@/types";
import {
  Share2,
  Copy,
  Check,
  ExternalLink,
  MessageCircle,
  Send,
  Link2,
  Clock,
  Target,
  DollarSign,
  Users,
  Zap,
  AlertTriangle,
} from "lucide-react";

// LINE Icon component
const LineIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M19.365 9.863c.349 0 .63.285.63.631 0 .345-.281.63-.63.63H17.61v1.125h1.755c.349 0 .63.283.63.63 0 .344-.281.629-.63.629h-2.386c-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.627-.63h2.386c.349 0 .63.285.63.63 0 .349-.281.63-.63.63H17.61v1.125h1.755zm-3.855 3.016c0 .27-.174.51-.432.596-.064.021-.133.031-.199.031-.211 0-.391-.09-.51-.25l-2.443-3.317v2.94c0 .344-.279.629-.631.629-.346 0-.626-.285-.626-.629V8.108c0-.27.173-.51.43-.595.06-.023.136-.033.194-.033.195 0 .375.104.495.254l2.462 3.33V8.108c0-.345.282-.63.63-.63.345 0 .63.285.63.63v4.771zm-5.741 0c0 .344-.282.629-.631.629-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.627-.63.349 0 .631.285.631.63v4.771zm-2.466.629H4.917c-.345 0-.63-.285-.63-.629V8.108c0-.345.285-.63.63-.63.348 0 .63.285.63.63v4.141h1.756c.348 0 .629.283.629.63 0 .344-.282.629-.629.629M24 10.314C24 4.943 18.615.572 12 .572S0 4.943 0 10.314c0 4.811 4.27 8.842 10.035 9.608.391.082.923.258 1.058.59.12.301.079.766.038 1.08l-.164 1.02c-.045.301-.24 1.186 1.049.645 1.291-.539 6.916-4.078 9.436-6.975C23.176 14.393 24 12.458 24 10.314" />
  </svg>
);

// Facebook Icon component
const FacebookIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
  </svg>
);

// Twitter/X Icon component
const TwitterIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
);

interface JobData {
  id: string;
  serviceName: string;
  platform: string;
  quantity: number;
  completedQuantity: number;
  pricePerUnit: number;
  deadline?: string;
  teamName?: string;
  targetUrl?: string;
}

interface ShareJobModalProps {
  isOpen: boolean;
  onClose: () => void;
  job: JobData | null;
  teamId: string;
}

export function ShareJobModal({ isOpen, onClose, job, teamId }: ShareJobModalProps) {
  const [copied, setCopied] = React.useState(false);
  const [copiedMessage, setCopiedMessage] = React.useState(false);

  if (!job) return null;

  // Generate share link
  const shareLink = `${typeof window !== 'undefined' ? window.location.origin : 'https://seller.meelike.com'}/work/jobs/preview/${job.id}`;
  
  // Generate share message
  const remainingQuantity = job.quantity - job.completedQuantity;
  const totalEarnings = remainingQuantity * job.pricePerUnit;
  const deadlineText = job.deadline 
    ? new Date(job.deadline).toLocaleString("th-TH", {
        day: "numeric",
        month: "short",
        hour: "2-digit",
        minute: "2-digit",
      })
    : "ไม่กำหนด";

  const shareMessage = `🔥 งานใหม่! ${job.serviceName}

📊 รายละเอียด:
• จำนวน: ${remainingQuantity.toLocaleString()} หน่วย
• ค่าจ้าง: ฿${job.pricePerUnit}/หน่วย
• มูลค่างาน: ฿${totalEarnings.toFixed(2)}
• กำหนดส่ง: ${deadlineText}

👉 จองเลย: ${shareLink}`;

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareLink);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  const handleCopyMessage = async () => {
    try {
      await navigator.clipboard.writeText(shareMessage);
      setCopiedMessage(true);
      setTimeout(() => setCopiedMessage(false), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  const handleShareToLine = () => {
    const encodedMessage = encodeURIComponent(shareMessage);
    window.open(`https://line.me/R/msg/text/?${encodedMessage}`, "_blank");
  };

  const handleShareToFacebook = () => {
    const encodedUrl = encodeURIComponent(shareLink);
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`, "_blank");
  };

  const handleShareToTwitter = () => {
    const encodedText = encodeURIComponent(`🔥 งานใหม่! ${job.serviceName} - ค่าจ้าง ฿${job.pricePerUnit}/หน่วย`);
    const encodedUrl = encodeURIComponent(shareLink);
    window.open(`https://twitter.com/intent/tweet?text=${encodedText}&url=${encodedUrl}`, "_blank");
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="แชร์งานไปกลุ่ม"
      size="lg"
    >
      <div className="space-y-6">
        {/* Job Preview Card */}
        <div className="p-4 bg-gradient-to-br from-brand-bg to-brand-bg/50 rounded-2xl border border-brand-border/50">
          <div className="flex items-start gap-4">
            <div className="w-14 h-14 rounded-2xl bg-white border border-brand-border/50 flex items-center justify-center shadow-sm">
              <PlatformIcon platform={job.platform as Platform} className="w-7 h-7" />
            </div>
            <div className="flex-1">
              <h3 className="font-bold text-lg text-brand-text-dark mb-1">
                {job.serviceName}
              </h3>
              {job.teamName && (
                <p className="text-sm text-brand-text-light flex items-center gap-1.5">
                  <Users className="w-3.5 h-3.5" />
                  {job.teamName}
                </p>
              )}
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-3 gap-3 mt-4">
            <div className="p-3 bg-white rounded-xl text-center border border-brand-border/30">
              <div className="flex items-center justify-center gap-1.5 text-brand-primary mb-1">
                <Target className="w-4 h-4" />
              </div>
              <p className="text-lg font-bold text-brand-text-dark">{remainingQuantity.toLocaleString()}</p>
              <p className="text-xs text-brand-text-light">หน่วย</p>
            </div>
            <div className="p-3 bg-white rounded-xl text-center border border-brand-border/30">
              <div className="flex items-center justify-center gap-1.5 text-brand-success mb-1">
                <DollarSign className="w-4 h-4" />
              </div>
              <p className="text-lg font-bold text-brand-success">฿{job.pricePerUnit}</p>
              <p className="text-xs text-brand-text-light">ต่อหน่วย</p>
            </div>
            <div className="p-3 bg-white rounded-xl text-center border border-brand-border/30">
              <div className="flex items-center justify-center gap-1.5 text-brand-warning mb-1">
                <Clock className="w-4 h-4" />
              </div>
              <p className="text-sm font-bold text-brand-text-dark">{deadlineText.split(" ")[0]}</p>
              <p className="text-xs text-brand-text-light">กำหนดส่ง</p>
            </div>
          </div>
        </div>

        {/* Share Link */}
        <div>
          <label className="text-sm font-bold text-brand-text-dark mb-2 block flex items-center gap-2">
            <Link2 className="w-4 h-4 text-brand-primary" />
            ลิงก์งาน
          </label>
          <div className="flex gap-2">
            <Input
              value={shareLink}
              readOnly
              className="flex-1 bg-brand-bg/50 text-sm font-mono"
            />
            <Button 
              variant={copied ? "secondary" : "outline"} 
              onClick={handleCopyLink}
              className={`min-w-[100px] transition-all ${copied ? "bg-brand-success/10 text-brand-success border-brand-success/30" : ""}`}
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4 mr-1.5" />
                  คัดลอกแล้ว
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4 mr-1.5" />
                  คัดลอก
                </>
              )}
            </Button>
          </div>
        </div>

        {/* Share Message */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-sm font-bold text-brand-text-dark flex items-center gap-2">
              <MessageCircle className="w-4 h-4 text-brand-primary" />
              ข้อความแชร์
            </label>
            <Button 
              variant="ghost" 
              size="sm"
              onClick={handleCopyMessage}
              className={copiedMessage ? "text-brand-success" : "text-brand-text-light"}
            >
              {copiedMessage ? (
                <>
                  <Check className="w-3.5 h-3.5 mr-1" />
                  คัดลอกแล้ว
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5 mr-1" />
                  คัดลอกข้อความ
                </>
              )}
            </Button>
          </div>
          <Textarea
            value={shareMessage}
            readOnly
            rows={8}
            className="bg-brand-bg/30 text-sm font-mono resize-none"
          />
        </div>

        {/* Content Warning */}
        <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl">
          <div className="flex gap-2">
            <AlertTriangle className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
            <div className="text-sm">
              <p className="font-medium text-amber-800">คำเตือน: ในฐานะหัวหน้าทีม</p>
              <p className="text-amber-700 text-xs mt-1">
                คุณมีหน้าที่ตรวจสอบว่าเนื้อหางานไม่เกี่ยวข้องกับการพนัน, เว็บผิดกฎหมาย, โฆษณาหลอกลวง หรือเนื้อหาผู้ใหญ่ 
                หากฝ่าฝืนจะถูกระงับบัญชีและริบเงินค้างถอน
              </p>
            </div>
          </div>
        </div>

        {/* Share Buttons */}
        <div>
          <label className="text-sm font-bold text-brand-text-dark mb-3 block flex items-center gap-2">
            <Share2 className="w-4 h-4 text-brand-primary" />
            แชร์ไปยัง
          </label>
          <div className="grid grid-cols-3 gap-3">
            <Button
              variant="outline"
              onClick={handleShareToLine}
              className="h-14 flex-col gap-1.5 bg-[#00B900]/5 border-[#00B900]/20 text-[#00B900] hover:bg-[#00B900]/10 hover:border-[#00B900]/30"
            >
              <LineIcon className="w-6 h-6" />
              <span className="text-xs font-bold">LINE</span>
            </Button>
            <Button
              variant="outline"
              onClick={handleShareToFacebook}
              className="h-14 flex-col gap-1.5 bg-[#1877F2]/5 border-[#1877F2]/20 text-[#1877F2] hover:bg-[#1877F2]/10 hover:border-[#1877F2]/30"
            >
              <FacebookIcon className="w-6 h-6" />
              <span className="text-xs font-bold">Facebook</span>
            </Button>
            <Button
              variant="outline"
              onClick={handleShareToTwitter}
              className="h-14 flex-col gap-1.5 bg-black/5 border-black/20 text-black hover:bg-black/10 hover:border-black/30"
            >
              <TwitterIcon className="w-5 h-5" />
              <span className="text-xs font-bold">X</span>
            </Button>
          </div>
        </div>

        {/* LINE Messaging API Hint */}
        <div className="p-4 bg-[#00B900]/5 border border-[#00B900]/20 rounded-xl">
          <div className="flex items-start gap-3">
            <div className="p-2 bg-[#00B900]/10 rounded-lg">
              <Zap className="w-5 h-5 text-[#00B900]" />
            </div>
            <div>
              <p className="font-bold text-brand-text-dark text-sm mb-1">
                💡 ส่ง Flex Message อัตโนมัติผ่าน LINE
              </p>
              <p className="text-xs text-brand-text-light">
                เชื่อมต่อ LINE Messaging API เพื่อส่งแจ้งเตือนงานใหม่พร้อมปุ่มจองงาน
              </p>
              <a 
                href={`/seller/team/${teamId}/settings/line`}
                className="text-xs text-[#00B900] font-medium hover:underline inline-flex items-center gap-1 mt-2"
              >
                ตั้งค่า LINE Integration
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3 pt-2">
          <Button
            variant="outline"
            onClick={onClose}
            className="flex-1"
          >
            ปิด
          </Button>
          <Button
            onClick={handleShareToLine}
            className="flex-1 bg-[#00B900] hover:bg-[#00B900]/90 shadow-md shadow-[#00B900]/20"
          >
            <LineIcon className="w-5 h-5 mr-2" />
            แชร์ไป LINE
          </Button>
        </div>
      </div>
    </Modal>
  );
}
