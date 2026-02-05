"use client";

import { useState } from "react";
import { AlertTriangle, Flag, Send, Ban, Scale, FileWarning, HelpCircle } from "lucide-react";
import { Dialog, Button, Textarea } from "@/components/ui";
import type { ReportCategory } from "@/types/report";

export interface ReportContentModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: { category: ReportCategory; description: string }) => Promise<void>;
  jobTitle?: string;
  jobUrl?: string;
}

const REPORT_CATEGORIES: { id: ReportCategory; label: string; icon: React.ElementType; description: string }[] = [
  {
    id: "gambling",
    label: "การพนัน/คาสิโนออนไลน์",
    icon: Ban,
    description: "คาสิโน, แทงบอล, สล็อต, หวยออนไลน์, บาคาร่า",
  },
  {
    id: "illegal",
    label: "เนื้อหาผิดกฎหมาย",
    icon: Scale,
    description: "ยาเสพติด, อาวุธ, สินค้าผิดกฎหมาย",
  },
  {
    id: "scam",
    label: "โฆษณาหลอกลวง/Scam",
    icon: FileWarning,
    description: "แชร์ลูกโซ่, ลงทุนผลตอบแทนสูงเกินจริง, หลอกให้โอนเงิน",
  },
  {
    id: "adult",
    label: "เนื้อหาสำหรับผู้ใหญ่",
    icon: Ban,
    description: "เนื้อหาลามกอนาจาร, สื่อไม่เหมาะสม",
  },
  {
    id: "other",
    label: "อื่นๆ",
    icon: HelpCircle,
    description: "เนื้อหาที่ไม่เหมาะสมอื่นๆ",
  },
];

export function ReportContentModal({
  open,
  onOpenChange,
  onSubmit,
  jobTitle,
  jobUrl,
}: ReportContentModalProps) {
  const [selectedCategory, setSelectedCategory] = useState<ReportCategory | null>(null);
  const [description, setDescription] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async () => {
    if (!selectedCategory) {
      setError("กรุณาเลือกประเภทการรายงาน");
      return;
    }

    setError(null);
    setIsSubmitting(true);

    try {
      await onSubmit({
        category: selectedCategory,
        description: description.trim(),
      });
      
      // Reset form
      setSelectedCategory(null);
      setDescription("");
      onOpenChange(false);
    } catch (err) {
      setError("เกิดข้อผิดพลาดในการส่งรายงาน กรุณาลองใหม่อีกครั้ง");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setSelectedCategory(null);
    setDescription("");
    setError(null);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onClose={handleClose} size="md">
      <Dialog.Header>
        <Dialog.Title className="flex items-center gap-2 text-red-600">
          <Flag className="h-5 w-5" />
          รายงานเนื้อหาไม่เหมาะสม
        </Dialog.Title>
        <Dialog.Description>
          {jobTitle ? (
            <>รายงานงาน: <span className="font-medium text-gray-700">{jobTitle}</span></>
          ) : (
            "รายงานเนื้อหาที่คุณเห็นว่าไม่เหมาะสมหรือผิดกฎ"
          )}
        </Dialog.Description>
      </Dialog.Header>

      <Dialog.Body>
        <div className="space-y-4">
          {/* Warning Alert */}
          <div className="flex gap-3 p-3 border border-amber-200 bg-amber-50 rounded-lg">
            <AlertTriangle className="h-4 w-4 text-amber-600 flex-shrink-0 mt-0.5" />
            <p className="text-amber-700 text-sm">
              <strong>คำเตือน:</strong> การรายงานเท็จซ้ำหลายครั้งอาจทำให้บัญชีของคุณถูกระงับ 
              กรุณารายงานเฉพาะเนื้อหาที่คุณมั่นใจว่าผิดกฎจริงๆ
            </p>
          </div>

          {/* Job URL Display */}
          {jobUrl && (
            <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
              <span className="text-xs text-gray-500 mb-1 block">URL ที่รายงาน</span>
              <p className="text-sm text-gray-700 break-all">{jobUrl}</p>
            </div>
          )}

          {/* Category Selection */}
          <div>
            <span className="text-sm font-medium text-gray-700 mb-2 block">
              ประเภทการรายงาน <span className="text-red-500">*</span>
            </span>
            <div className="space-y-2">
              {REPORT_CATEGORIES.map((category) => {
                const Icon = category.icon;
                const isSelected = selectedCategory === category.id;
                return (
                  <button
                    key={category.id}
                    type="button"
                    onClick={() => setSelectedCategory(category.id)}
                    className={`w-full flex items-start gap-3 p-3 rounded-lg border-2 text-left transition-colors ${
                      isSelected
                        ? "border-red-500 bg-red-50"
                        : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                    }`}
                  >
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                      isSelected ? "bg-red-100" : "bg-gray-100"
                    }`}>
                      <Icon className={`h-4 w-4 ${isSelected ? "text-red-600" : "text-gray-500"}`} />
                    </div>
                    <div>
                      <p className={`font-medium text-sm ${isSelected ? "text-red-700" : "text-gray-700"}`}>
                        {category.label}
                      </p>
                      <p className="text-xs text-gray-500">{category.description}</p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Description */}
          <div>
            <span className="text-sm font-medium text-gray-700 mb-2 block">
              รายละเอียดเพิ่มเติม (ไม่บังคับ)
            </span>
            <Textarea
              placeholder="อธิบายเพิ่มเติมว่าทำไมคุณถึงคิดว่าเนื้อหานี้ไม่เหมาะสม..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              className="resize-none"
            />
          </div>

          {/* Error */}
          {error && (
            <div className="flex gap-3 p-3 border border-red-200 bg-red-50 rounded-lg">
              <AlertTriangle className="h-4 w-4 text-red-600 flex-shrink-0 mt-0.5" />
              <p className="text-red-700 text-sm">{error}</p>
            </div>
          )}
        </div>
      </Dialog.Body>

      <Dialog.Footer>
        <Button variant="outline" onClick={handleClose} disabled={isSubmitting}>
          ยกเลิก
        </Button>
        <Button
          onClick={handleSubmit}
          disabled={!selectedCategory || isSubmitting}
          className="bg-red-600 hover:bg-red-700"
        >
          {isSubmitting ? (
            <>กำลังส่ง...</>
          ) : (
            <>
              <Send className="h-4 w-4 mr-2" />
              ส่งรายงาน
            </>
          )}
        </Button>
      </Dialog.Footer>
    </Dialog>
  );
}

export default ReportContentModal;
