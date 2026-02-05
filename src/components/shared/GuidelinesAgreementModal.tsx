"use client";

import { useState } from "react";
import { Shield, CheckCircle2 } from "lucide-react";
import { Dialog, Button, Checkbox } from "@/components/ui";
import { PROHIBITED_CONTENT, PENALTIES } from "./ContentGuidelines";

export interface GuidelinesAgreementModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAccept: () => void;
  title?: string;
  description?: string;
}

export function GuidelinesAgreementModal({
  open,
  onOpenChange,
  onAccept,
  title = "ยืนยันรับทราบกฎและข้อห้าม",
  description = "กรุณาอ่านและยอมรับเงื่อนไขก่อนดำเนินการต่อ",
}: GuidelinesAgreementModalProps) {
  const [agreed, setAgreed] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleClose = () => {
    onOpenChange(false);
    setAgreed(false);
  };

  const handleAccept = async () => {
    if (!agreed) return;
    setIsSubmitting(true);
    try {
      await onAccept();
      onOpenChange(false);
      setAgreed(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onClose={handleClose} size="lg">
      <Dialog.Header>
        <Dialog.Title className="flex items-center gap-2">
          <Shield className="h-5 w-5 text-amber-600" />
          {title}
        </Dialog.Title>
        <Dialog.Description>{description}</Dialog.Description>
      </Dialog.Header>

      <Dialog.Body className="max-h-[50vh]">
        <div className="space-y-4">
          {/* Prohibited Content List */}
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <h4 className="font-semibold text-red-800 mb-3">งานที่ห้ามรับโดยเด็ดขาด:</h4>
            <ul className="space-y-2">
              {PROHIBITED_CONTENT.map((item) => {
                const Icon = item.icon;
                return (
                  <li key={item.id} className="flex items-start gap-2">
                    <Icon className="h-4 w-4 text-red-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <span className="font-medium text-red-800">{item.label}</span>
                      <span className="text-sm text-red-600 ml-1">({item.examples})</span>
                    </div>
                  </li>
                );
              })}
            </ul>
          </div>

          {/* Penalties */}
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
            <h4 className="font-semibold text-amber-800 mb-3">บทลงโทษหากฝ่าฝืน:</h4>
            <ul className="space-y-1">
              {PENALTIES.map((penalty, idx) => (
                <li key={idx} className="flex items-center gap-2 text-amber-700">
                  <span className="w-5 h-5 rounded-full bg-amber-200 flex items-center justify-center text-xs font-bold text-amber-800">
                    {idx + 1}
                  </span>
                  {penalty.label}
                </li>
              ))}
            </ul>
          </div>

          {/* Responsibility Notice */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h4 className="font-semibold text-blue-800 mb-2">ความรับผิดชอบของหัวหน้าทีม:</h4>
            <p className="text-sm text-blue-700">
              ในฐานะหัวหน้าทีม คุณมีหน้าที่คัดกรองงานก่อนกระจายให้สมาชิก 
              และต้องรับผิดชอบร่วมหากสมาชิกในทีมทำผิดกฎ ซึ่งรวมถึงการถูกระงับบัญชีทั้งทีม
            </p>
          </div>

          {/* Agreement Checkbox */}
          <div className="flex items-start gap-3 p-4 bg-gray-50 border border-gray-200 rounded-lg">
            <Checkbox
              checked={agreed}
              onChange={(checked) => setAgreed(checked)}
              className="mt-1"
            />
            <span className="text-sm text-gray-700 cursor-pointer leading-relaxed" onClick={() => setAgreed(!agreed)}>
              ข้าพเจ้าได้อ่านและเข้าใจกฎข้อห้ามทั้งหมดแล้ว และยอมรับที่จะปฏิบัติตามอย่างเคร่งครัด
              หากฝ่าฝืนยินยอมให้ดำเนินการลงโทษตามที่ระบุไว้ทุกประการ
            </span>
          </div>
        </div>
      </Dialog.Body>

      <Dialog.Footer>
        <Button
          variant="outline"
          onClick={handleClose}
          disabled={isSubmitting}
        >
          ยกเลิก
        </Button>
        <Button
          onClick={handleAccept}
          disabled={!agreed || isSubmitting}
          className="bg-amber-600 hover:bg-amber-700"
        >
          {isSubmitting ? (
            <>กำลังบันทึก...</>
          ) : (
            <>
              <CheckCircle2 className="h-4 w-4 mr-2" />
              ยอมรับเงื่อนไข
            </>
          )}
        </Button>
      </Dialog.Footer>
    </Dialog>
  );
}

export default GuidelinesAgreementModal;
