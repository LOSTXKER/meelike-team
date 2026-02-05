"use client";

import { AlertTriangle, Ban, Shield, Scale, FileWarning } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export interface ContentGuidelinesProps {
  variant?: "full" | "compact" | "card";
  showPenalties?: boolean;
  className?: string;
}

// รายการเนื้อหาต้องห้าม
export const PROHIBITED_CONTENT = [
  {
    id: "gambling",
    label: "การพนันออนไลน์ทุกประเภท",
    examples: "คาสิโน, แทงบอล, สล็อต, หวยออนไลน์, บาคาร่า",
    icon: Ban,
  },
  {
    id: "illegal",
    label: "เว็บไซต์หรือบริการผิดกฎหมาย",
    examples: "ยาเสพติด, อาวุธ, สินค้าละเมิดลิขสิทธิ์",
    icon: Scale,
  },
  {
    id: "scam",
    label: "โฆษณาหลอกลวง/Scam",
    examples: "แชร์ลูกโซ่, ลงทุนผลตอบแทนสูงเกินจริง, หลอกให้โอนเงิน",
    icon: FileWarning,
  },
  {
    id: "adult",
    label: "เนื้อหาสำหรับผู้ใหญ่",
    examples: "เนื้อหาลามกอนาจาร, สื่อไม่เหมาะสม",
    icon: Ban,
  },
];

// บทลงโทษ
export const PENALTIES = [
  { severity: "warning", label: "ระงับบัญชีทั้งทีมถาวร" },
  { severity: "critical", label: "ริบเงินค้างถอนทั้งหมด" },
  { severity: "legal", label: "ดำเนินคดีตามกฎหมาย (กรณีร้ายแรง)" },
];

export function ContentGuidelines({
  variant = "full",
  showPenalties = true,
  className = "",
}: ContentGuidelinesProps) {
  if (variant === "compact") {
    return (
      <div className={`flex gap-3 p-4 border border-amber-200 bg-amber-50 rounded-lg ${className}`}>
        <AlertTriangle className="h-5 w-5 text-amber-600 flex-shrink-0 mt-0.5" />
        <div>
          <h4 className="font-semibold text-amber-800">ข้อห้ามสำคัญ</h4>
          <p className="text-sm text-amber-700 mt-1">
            ห้ามรับงานเกี่ยวกับ: การพนัน, เว็บผิดกฎหมาย, โฆษณาหลอกลวง, เนื้อหาผู้ใหญ่
          </p>
          <p className="text-xs text-amber-600 mt-1">
            หากฝ่าฝืนจะถูกระงับบัญชีถาวรและริบเงินค้างถอน
          </p>
        </div>
      </div>
    );
  }

  if (variant === "card") {
    return (
      <Card className={`border-amber-200 bg-gradient-to-br from-amber-50 to-orange-50 ${className}`}>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-amber-800">
            <Shield className="h-5 w-5" />
            กฎและข้อห้ามสำหรับหัวหน้าทีม
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-amber-700">
            ในฐานะหัวหน้าทีม คุณมีหน้าที่คัดกรองงานก่อนกระจายให้สมาชิก 
            และต้องรับผิดชอบร่วมหากสมาชิกในทีมทำผิดกฎ
          </p>
          
          <div className="space-y-2">
            <h4 className="font-semibold text-amber-900 flex items-center gap-2">
              <Ban className="h-4 w-4 text-red-600" />
              งานที่ห้ามรับโดยเด็ดขาด:
            </h4>
            <ul className="text-sm text-amber-800 space-y-1 ml-6">
              {PROHIBITED_CONTENT.map((item) => (
                <li key={item.id} className="list-disc">
                  <span className="font-medium">{item.label}</span>
                  <span className="text-amber-600 text-xs ml-1">({item.examples})</span>
                </li>
              ))}
            </ul>
          </div>

          {showPenalties && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3">
              <h4 className="font-semibold text-red-800 flex items-center gap-2 text-sm">
                <AlertTriangle className="h-4 w-4" />
                บทลงโทษหากฝ่าฝืน:
              </h4>
              <ul className="text-sm text-red-700 mt-2 space-y-1 ml-6">
                {PENALTIES.map((penalty, idx) => (
                  <li key={idx} className="list-disc">{penalty.label}</li>
                ))}
              </ul>
            </div>
          )}
        </CardContent>
      </Card>
    );
  }

  // Full variant
  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header */}
      <div className="text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-amber-100 mb-4">
          <Shield className="h-8 w-8 text-amber-600" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900">กฎและข้อห้ามสำหรับหัวหน้าทีม</h2>
        <p className="text-gray-600 mt-2 max-w-lg mx-auto">
          ในฐานะหัวหน้าทีม คุณมีหน้าที่คัดกรองงานก่อนกระจายให้สมาชิก 
          และต้องรับผิดชอบร่วมหากสมาชิกในทีมทำผิดกฎ
        </p>
      </div>

      {/* Prohibited Content */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2 mb-4">
          <Ban className="h-5 w-5 text-red-600" />
          งานที่ห้ามรับโดยเด็ดขาด
        </h3>
        <div className="grid gap-4 md:grid-cols-2">
          {PROHIBITED_CONTENT.map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.id}
                className="flex items-start gap-3 p-4 bg-red-50 border border-red-100 rounded-lg"
              >
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-red-100 flex items-center justify-center">
                  <Icon className="h-5 w-5 text-red-600" />
                </div>
                <div>
                  <h4 className="font-medium text-red-900">{item.label}</h4>
                  <p className="text-sm text-red-700 mt-1">{item.examples}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Penalties */}
      {showPenalties && (
        <div className="bg-gradient-to-r from-red-50 to-orange-50 rounded-xl border border-red-200 p-6">
          <h3 className="text-lg font-semibold text-red-900 flex items-center gap-2 mb-4">
            <AlertTriangle className="h-5 w-5" />
            บทลงโทษหากฝ่าฝืน
          </h3>
          <div className="space-y-3">
            {PENALTIES.map((penalty, idx) => (
              <div key={idx} className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center text-red-700 font-bold text-sm">
                  {idx + 1}
                </div>
                <span className="text-red-800 font-medium">{penalty.label}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default ContentGuidelines;
