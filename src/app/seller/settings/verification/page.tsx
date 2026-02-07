"use client";

import { useState } from "react";
import { Card, Button, Badge, Input } from "@/components/ui";
import { IDCardUpload, SelfieCapture, FileUpload, QuickKYCModal } from "@/components/shared";
import type { IDCardData } from "@/components/shared";
import { useAuthStore } from "@/lib/store";
import { useToast } from "@/components/ui/toast";
import {
  Shield,
  CheckCircle,
  Check,
  Clock,
  Phone,
  CreditCard,
  Camera,
  Building2,
  FileText,
  ArrowLeft,
  ArrowRight,
  Info,
  Lock,
  Sparkles,
} from "lucide-react";
import Link from "next/link";
import { DEFAULT_KYC_DATA } from "@/types";
import type { KYCLevel } from "@/types";

// ===== TYPES =====

type VerificationView = "overview" | "verified" | "business";
type VerificationStep = "id_card" | "selfie" | "review";

interface StepConfig {
  level: KYCLevel;
  label: string;
  tagline: string;
  icon: React.ElementType;
  color: string;
  bgColor: string;
  borderColor: string;
  withdrawLimit: string;
  benefits: string[];
  requirements: string[];
}

// ===== CONSTANTS =====

const STEPS: StepConfig[] = [
  {
    level: "basic",
    label: "Basic",
    tagline: "ยืนยันเบอร์โทร",
    icon: Phone,
    color: "text-blue-600",
    bgColor: "bg-blue-50",
    borderColor: "border-blue-200",
    withdrawLimit: "฿1,000/วัน",
    benefits: ["เติมเงินได้", "รับออเดอร์ได้"],
    requirements: ["ยืนยันเบอร์โทรผ่าน OTP"],
  },
  {
    level: "verified",
    label: "Verified",
    tagline: "ยืนยันตัวตน",
    icon: CreditCard,
    color: "text-emerald-600",
    bgColor: "bg-emerald-50",
    borderColor: "border-emerald-200",
    withdrawLimit: "฿10,000/วัน",
    benefits: ["ถอนเงินได้", "สร้างทีมได้", "โพสต์งานใน Hub"],
    requirements: ["อัปโหลดบัตรประชาชน", "ถ่าย Selfie คู่บัตร"],
  },
  {
    level: "business",
    label: "Business",
    tagline: "นิติบุคคล",
    icon: Building2,
    color: "text-purple-600",
    bgColor: "bg-purple-50",
    borderColor: "border-purple-200",
    withdrawLimit: "ไม่จำกัด",
    benefits: ["วงเงินถอนไม่จำกัด", "ออกใบกำกับภาษี", "API สำหรับธุรกิจ"],
    requirements: [
      "ผ่าน Verified แล้ว",
      "หนังสือรับรองนิติบุคคล",
      "เลขประจำตัวผู้เสียภาษี",
    ],
  },
];

const LEVEL_ORDER: KYCLevel[] = ["none", "basic", "verified", "business"];

function getLevelIndex(level: KYCLevel): number {
  return LEVEL_ORDER.indexOf(level);
}

// ===== STEP STATUS HELPERS =====

type StepStatus = "completed" | "current" | "available" | "locked";

function getStepStatus(
  stepLevel: KYCLevel,
  currentLevel: KYCLevel
): StepStatus {
  const stepIdx = getLevelIndex(stepLevel);
  const currentIdx = getLevelIndex(currentLevel);

  if (stepIdx <= currentIdx) return "completed";
  if (stepIdx === currentIdx + 1) return "available";
  return "locked";
}

// ===== MAIN PAGE =====

export default function VerificationPage() {
  const { user } = useAuthStore();
  const toast = useToast();
  const [view, setView] = useState<VerificationView>("overview");
  const [verificationStep, setVerificationStep] =
    useState<VerificationStep>("id_card");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // QuickKYC phone modal state
  const [showQuickKYC, setShowQuickKYC] = useState(false);

  // Form data for Verified level
  const [idCardData, setIdCardData] = useState<IDCardData | null>(null);
  const [idCardFile, setIdCardFile] = useState<File | null>(null);
  const [selfieFile, setSelfieFile] = useState<File | null>(null);

  // Form data for Business level
  const [businessData, setBusinessData] = useState({
    companyName: "",
    taxId: "",
  });
  const [certFile, setCertFile] = useState<File | null>(null);

  const kyc = user?.seller?.kyc || DEFAULT_KYC_DATA;
  const currentLevel = kyc.level;

  // ===== Handlers =====

  const handleIdCardConfirmed = (data: IDCardData, file: File) => {
    setIdCardData(data);
    setIdCardFile(file);
    setVerificationStep("selfie");
  };

  const handleSelfieCapture = (file: File) => {
    setSelfieFile(file);
    setVerificationStep("review");
  };

  const handleSubmitVerified = async () => {
    setIsSubmitting(true);
    await new Promise((resolve) => setTimeout(resolve, 2000));
    setIsSubmitting(false);
    toast.success("ส่งเอกสารเรียบร้อย! กรุณารอการตรวจสอบ 1-3 วันทำการ");
    setView("overview");
  };

  const handleSubmitBusiness = async () => {
    if (!businessData.companyName || !businessData.taxId || !certFile) {
      toast.warning("กรุณากรอกข้อมูลให้ครบถ้วน");
      return;
    }
    setIsSubmitting(true);
    await new Promise((resolve) => setTimeout(resolve, 2000));
    setIsSubmitting(false);
    toast.success("ส่งเอกสารเรียบร้อย! กรุณารอการตรวจสอบ 3-5 วันทำการ");
    setView("overview");
  };

  const handleQuickKYCSuccess = () => {
    toast.success("ยืนยันเบอร์โทรสำเร็จ! คุณผ่าน Basic แล้ว");
    setShowQuickKYC(false);
  };

  const handleStepAction = (step: StepConfig, status: StepStatus) => {
    if (status === "locked" || status === "completed") return;
    if (step.level === "basic") {
      setShowQuickKYC(true);
    } else if (step.level === "verified") {
      setView("verified");
    } else if (step.level === "business") {
      setView("business");
    }
  };

  // ===== OVERVIEW =====

  if (view === "overview") {
    const currentLevelLabel =
      currentLevel === "none"
        ? "ยังไม่ยืนยัน"
        : currentLevel.charAt(0).toUpperCase() + currentLevel.slice(1);

    // Find the next available step
    const nextStep = STEPS.find(
      (s) => getStepStatus(s.level, currentLevel) === "available"
    );

    // Feature comparison data - shows what each level unlocks
    const FEATURE_ROWS: {
      label: string;
      icon: React.ElementType;
      none: string | boolean;
      basic: string | boolean;
      verified: string | boolean;
      business: string | boolean;
    }[] = [
      {
        label: "วงเงินถอน/วัน",
        icon: Sparkles,
        none: "฿0",
        basic: "฿1,000",
        verified: "฿10,000",
        business: "ไม่จำกัด",
      },
      { label: "เติมเงิน", icon: Sparkles, none: false, basic: true, verified: true, business: true },
      { label: "รับออเดอร์", icon: Sparkles, none: false, basic: true, verified: true, business: true },
      { label: "ถอนเงิน", icon: Sparkles, none: false, basic: false, verified: true, business: true },
      { label: "สร้างทีม", icon: Sparkles, none: false, basic: false, verified: true, business: true },
      { label: "โพสต์งานใน Hub", icon: Sparkles, none: false, basic: false, verified: true, business: true },
      { label: "ออกใบกำกับภาษี", icon: Sparkles, none: false, basic: false, verified: false, business: true },
      { label: "API สำหรับธุรกิจ", icon: Sparkles, none: false, basic: false, verified: false, business: true },
    ];

    return (
      <div className="space-y-6 animate-fade-in">
        {/* Header */}
        <div>
          <h1 className="text-xl font-bold text-brand-text-dark">
            ยืนยันตัวตน (KYC)
          </h1>
          <p className="text-sm text-brand-text-light mt-0.5">
            ยืนยันตัวตนเพื่อปลดล็อกฟีเจอร์การใช้งาน
          </p>
        </div>

        {/* ===== Value Proposition Hero ===== */}
        {currentLevel !== "business" && nextStep && (
          <Card className="border-none shadow-lg overflow-hidden bg-gradient-to-br from-brand-primary/5 via-white to-brand-primary/[0.02]">
            <div className="p-5 sm:p-6">
              {/* What you can't do yet */}
              <div className="flex items-start gap-3 mb-5">
                <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center shrink-0">
                  <Shield className="w-5 h-5 text-amber-600" />
                </div>
                <div>
                  <p className="font-bold text-brand-text-dark text-base">
                    {currentLevel === "none"
                      ? "คุณยังใช้งานได้จำกัด"
                      : currentLevel === "basic"
                        ? "ปลดล็อกฟีเจอร์เพิ่มเติม"
                        : "อัปเกรดเป็น Business"}
                  </p>
                  <p className="text-sm text-brand-text-light mt-0.5">
                    {currentLevel === "none"
                      ? "ยืนยันเบอร์โทรเพื่อเริ่มรับออเดอร์และเติมเงิน"
                      : currentLevel === "basic"
                        ? "ยืนยันตัวตนเพื่อถอนเงิน สร้างทีม และโพสต์งาน"
                        : "อัปเกรดเป็นนิติบุคคลเพื่อวงเงินไม่จำกัด"}
                  </p>
                </div>
              </div>

              {/* Locked features preview */}
              <div className="bg-white/80 rounded-xl border border-brand-border/50 p-4 mb-5">
                <p className="text-xs font-semibold text-brand-text-light uppercase tracking-wider mb-3">
                  สิ่งที่คุณจะได้เมื่อยืนยัน {nextStep.label}
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {nextStep.benefits.map((b) => (
                    <div
                      key={b}
                      className="flex items-center gap-2.5 p-2.5 rounded-lg bg-brand-success/5 border border-brand-success/10"
                    >
                      <div className="w-6 h-6 rounded-full bg-brand-success/15 flex items-center justify-center shrink-0">
                        <Check className="w-3.5 h-3.5 text-brand-success" />
                      </div>
                      <span className="text-sm font-medium text-brand-text-dark">
                        {b}
                      </span>
                    </div>
                  ))}
                  <div className="flex items-center gap-2.5 p-2.5 rounded-lg bg-brand-primary/5 border border-brand-primary/10">
                    <div className="w-6 h-6 rounded-full bg-brand-primary/15 flex items-center justify-center shrink-0">
                      <ArrowRight className="w-3.5 h-3.5 text-brand-primary" />
                    </div>
                    <span className="text-sm font-medium text-brand-primary">
                      วงเงินถอนเพิ่มเป็น {nextStep.withdrawLimit}
                    </span>
                  </div>
                </div>
              </div>

              {/* CTA */}
              <Button
                size="lg"
                className="w-full text-base"
                onClick={() => handleStepAction(nextStep, "available")}
              >
                <Sparkles className="w-5 h-5 mr-2" />
                {nextStep.level === "basic"
                  ? "ยืนยันเบอร์โทร — ใช้เวลา 1 นาที"
                  : nextStep.level === "verified"
                    ? "เริ่มยืนยันตัวตน — ใช้เวลา 5 นาที"
                    : "อัปเกรดเป็น Business"}
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>

              {/* Requirements hint */}
              <div className="flex items-center justify-center gap-4 mt-3">
                {nextStep.requirements.map((r, idx) => (
                  <span
                    key={idx}
                    className="text-xs text-brand-text-light flex items-center gap-1"
                  >
                    <span className="w-4 h-4 rounded-full bg-gray-100 inline-flex items-center justify-center text-[10px] font-medium text-gray-500">
                      {idx + 1}
                    </span>
                    {r}
                  </span>
                ))}
              </div>
            </div>
          </Card>
        )}

        {/* All verified badge */}
        {currentLevel === "business" && (
          <Card className="border-brand-success/30 bg-brand-success/5 shadow-md">
            <div className="p-5 flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-brand-success/15 flex items-center justify-center">
                <CheckCircle className="w-8 h-8 text-brand-success" />
              </div>
              <div>
                <p className="text-lg font-bold text-brand-success">
                  ยืนยันครบทุกระดับแล้ว!
                </p>
                <p className="text-sm text-brand-text-light">
                  คุณสามารถใช้งานฟีเจอร์ทั้งหมดได้อย่างเต็มที่
                </p>
              </div>
            </div>
          </Card>
        )}

        {/* ===== Progress Steps ===== */}
        <Card className="border-none shadow-sm overflow-hidden">
          <div className="p-4 border-b border-brand-border/50">
            <p className="font-semibold text-brand-text-dark text-sm">
              ระดับการยืนยัน
            </p>
          </div>
          <div className="divide-y divide-brand-border/30">
            {STEPS.map((step, idx) => {
              const status = getStepStatus(step.level, currentLevel);
              const Icon = step.icon;

              return (
                <div
                  key={step.level}
                  className={`p-4 flex items-center gap-3 transition-colors ${
                    status === "available"
                      ? "bg-brand-primary/[0.03]"
                      : ""
                  }`}
                >
                  {/* Step number / check */}
                  <div
                    className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 text-sm font-bold ${
                      status === "completed"
                        ? "bg-brand-success text-white"
                        : status === "available"
                          ? "bg-brand-primary text-white"
                          : "bg-gray-100 text-gray-400"
                    }`}
                  >
                    {status === "completed" ? (
                      <Check className="w-4 h-4" />
                    ) : (
                      idx + 1
                    )}
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span
                        className={`font-semibold text-sm ${
                          status === "locked"
                            ? "text-brand-text-light/60"
                            : "text-brand-text-dark"
                        }`}
                      >
                        {step.label}
                      </span>
                      {status === "completed" && (
                        <Badge variant="success" size="sm">
                          ผ่านแล้ว
                        </Badge>
                      )}
                      {status === "available" && (
                        <Badge variant="warning" size="sm">
                          ถัดไป
                        </Badge>
                      )}
                    </div>
                    <p
                      className={`text-xs mt-0.5 ${
                        status === "locked"
                          ? "text-brand-text-light/40"
                          : "text-brand-text-light"
                      }`}
                    >
                      {step.tagline} — วงเงินถอน {step.withdrawLimit}
                    </p>
                  </div>

                  {/* Action */}
                  {status === "available" && (
                    <Button
                      size="sm"
                      onClick={() => handleStepAction(step, status)}
                    >
                      ยืนยัน
                      <ArrowRight className="w-3.5 h-3.5 ml-1" />
                    </Button>
                  )}
                  {status === "locked" && (
                    <Lock className="w-4 h-4 text-gray-300 shrink-0" />
                  )}
                  {status === "completed" && (
                    <CheckCircle className="w-5 h-5 text-brand-success shrink-0" />
                  )}
                </div>
              );
            })}
          </div>
        </Card>

        {/* ===== Feature Comparison Table ===== */}
        <Card className="border-none shadow-sm overflow-hidden">
          <div className="p-4 border-b border-brand-border/50">
            <p className="font-semibold text-brand-text-dark text-sm">
              เปรียบเทียบสิทธิประโยชน์แต่ละระดับ
            </p>
            <p className="text-xs text-brand-text-light mt-0.5">
              ยิ่งยืนยันมาก ยิ่งใช้งานได้มาก
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              {/* Header */}
              <thead>
                <tr className="border-b border-brand-border/30">
                  <th className="text-left p-3 pl-4 font-medium text-brand-text-light text-xs min-w-[140px]">
                    ฟีเจอร์
                  </th>
                  {(["none", "basic", "verified", "business"] as const).map(
                    (level) => {
                      const isCurrentLevel = level === currentLevel;
                      return (
                        <th
                          key={level}
                          className={`text-center p-3 text-xs font-semibold min-w-[80px] ${
                            isCurrentLevel
                              ? "text-brand-primary bg-brand-primary/5"
                              : "text-brand-text-light"
                          }`}
                        >
                          <div>
                            {level === "none"
                              ? "ไม่ยืนยัน"
                              : level.charAt(0).toUpperCase() + level.slice(1)}
                          </div>
                          {isCurrentLevel && (
                            <span className="text-[10px] font-normal text-brand-primary">
                              (ปัจจุบัน)
                            </span>
                          )}
                        </th>
                      );
                    }
                  )}
                </tr>
              </thead>
              <tbody>
                {FEATURE_ROWS.map((row, idx) => (
                  <tr
                    key={row.label}
                    className={
                      idx < FEATURE_ROWS.length - 1
                        ? "border-b border-brand-border/20"
                        : ""
                    }
                  >
                    <td className="p-3 pl-4 text-brand-text-dark font-medium text-xs">
                      {row.label}
                    </td>
                    {(["none", "basic", "verified", "business"] as const).map(
                      (level) => {
                        const val = row[level];
                        const isCurrentLevel = level === currentLevel;
                        return (
                          <td
                            key={level}
                            className={`text-center p-3 ${
                              isCurrentLevel ? "bg-brand-primary/5" : ""
                            }`}
                          >
                            {typeof val === "boolean" ? (
                              val ? (
                                <Check className="w-4 h-4 text-brand-success mx-auto" />
                              ) : (
                                <span className="text-gray-300">—</span>
                              )
                            ) : (
                              <span className="text-xs font-semibold text-brand-text-dark">
                                {val}
                              </span>
                            )}
                          </td>
                        );
                      }
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>

        {/* ===== Trust Signals ===== */}
        <div className="grid sm:grid-cols-3 gap-3">
          {[
            {
              icon: Shield,
              title: "ปลอดภัย",
              desc: "ข้อมูลเข้ารหัสและเก็บตาม PDPA",
              color: "text-blue-600",
              bg: "bg-blue-50",
            },
            {
              icon: Clock,
              title: "รวดเร็ว",
              desc: "Basic ใช้เวลา 1 นาที, Verified 5 นาที",
              color: "text-emerald-600",
              bg: "bg-emerald-50",
            },
            {
              icon: CheckCircle,
              title: "น่าเชื่อถือ",
              desc: "ลูกค้าเห็นแบดจ์ยืนยันที่ร้านคุณ",
              color: "text-purple-600",
              bg: "bg-purple-50",
            },
          ].map((item) => (
            <Card
              key={item.title}
              className="border-none shadow-sm p-4 text-center"
            >
              <div
                className={`w-10 h-10 rounded-xl ${item.bg} flex items-center justify-center mx-auto mb-2.5`}
              >
                <item.icon className={`w-5 h-5 ${item.color}`} />
              </div>
              <p className="font-semibold text-brand-text-dark text-sm">
                {item.title}
              </p>
              <p className="text-xs text-brand-text-light mt-0.5">
                {item.desc}
              </p>
            </Card>
          ))}
        </div>

        {/* QuickKYC Phone Modal */}
        <QuickKYCModal
          isOpen={showQuickKYC}
          onClose={() => setShowQuickKYC(false)}
          onSuccess={handleQuickKYCSuccess}
          existingPhone={user?.seller?.contactInfo?.phone || ""}
          action="general"
        />
      </div>
    );
  }

  // ===== VERIFIED VERIFICATION VIEW =====

  if (view === "verified") {
    return (
      <div className="space-y-6 animate-fade-in">
        {/* Header */}
        <div className="flex items-center gap-4">
          <button
            onClick={() => {
              setView("overview");
              setVerificationStep("id_card");
              setIdCardData(null);
              setIdCardFile(null);
              setSelfieFile(null);
            }}
            className="text-brand-text-light hover:text-brand-text-dark transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-xl font-bold text-brand-text-dark">
              ยืนยันระดับ Verified
            </h1>
            <p className="text-sm text-brand-text-light">
              อัปโหลดบัตรประชาชนและ Selfie
            </p>
          </div>
        </div>

        {/* Step Indicator */}
        <div className="flex items-center justify-center gap-2 mb-6">
          {(["id_card", "selfie", "review"] as VerificationStep[]).map(
            (s, i) => {
              const steps: VerificationStep[] = [
                "id_card",
                "selfie",
                "review",
              ];
              const currentIdx = steps.indexOf(verificationStep);
              const isActive = s === verificationStep;
              const isCompleted = steps.indexOf(s) < currentIdx;

              return (
                <div key={s} className="flex items-center">
                  <div
                    className={`
                      w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium transition-all
                      ${isCompleted ? "bg-brand-success text-white" : ""}
                      ${isActive ? "bg-brand-primary text-white" : ""}
                      ${!isActive && !isCompleted ? "bg-brand-bg text-brand-text-light" : ""}
                    `}
                  >
                    {isCompleted ? (
                      <CheckCircle className="w-5 h-5" />
                    ) : (
                      i + 1
                    )}
                  </div>
                  {i < 2 && (
                    <div
                      className={`w-12 h-1 mx-1 rounded transition-all ${
                        steps.indexOf(s) < currentIdx
                          ? "bg-brand-success"
                          : "bg-brand-bg"
                      }`}
                    />
                  )}
                </div>
              );
            }
          )}
        </div>

        {/* Step Content */}
        <Card className="border-none shadow-md p-6">
          {verificationStep === "id_card" && (
            <>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-lg bg-brand-primary/10 flex items-center justify-center">
                  <CreditCard className="w-5 h-5 text-brand-primary" />
                </div>
                <div>
                  <h2 className="font-bold text-brand-text-dark">
                    ขั้นตอนที่ 1: บัตรประชาชน
                  </h2>
                  <p className="text-xs text-brand-text-light">
                    อัปโหลดรูปบัตรประชาชนด้านหน้า
                  </p>
                </div>
              </div>
              <IDCardUpload onDataConfirmed={handleIdCardConfirmed} />
            </>
          )}

          {verificationStep === "selfie" && (
            <>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-lg bg-brand-primary/10 flex items-center justify-center">
                  <Camera className="w-5 h-5 text-brand-primary" />
                </div>
                <div>
                  <h2 className="font-bold text-brand-text-dark">
                    ขั้นตอนที่ 2: Selfie คู่บัตร
                  </h2>
                  <p className="text-xs text-brand-text-light">
                    ถ่ายรูปหน้าพร้อมถือบัตรประชาชน
                  </p>
                </div>
              </div>
              <SelfieCapture onCapture={handleSelfieCapture} withIdCard />
            </>
          )}

          {verificationStep === "review" && (
            <>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-lg bg-brand-success/10 flex items-center justify-center">
                  <CheckCircle className="w-5 h-5 text-brand-success" />
                </div>
                <div>
                  <h2 className="font-bold text-brand-text-dark">
                    ตรวจสอบและยืนยัน
                  </h2>
                  <p className="text-xs text-brand-text-light">
                    ตรวจสอบข้อมูลก่อนส่งยืนยัน
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                {idCardData && (
                  <div className="p-4 rounded-lg border border-brand-border">
                    <p className="text-sm font-medium text-brand-text-dark mb-3">
                      ข้อมูลจากบัตรประชาชน
                    </p>
                    <div className="grid grid-cols-2 gap-3 text-sm">
                      <div>
                        <p className="text-brand-text-light">เลขบัตร</p>
                        <p className="font-medium">{idCardData.idNumber}</p>
                      </div>
                      <div>
                        <p className="text-brand-text-light">ชื่อ-นามสกุล</p>
                        <p className="font-medium">
                          {idCardData.prefix}
                          {idCardData.firstName} {idCardData.lastName}
                        </p>
                      </div>
                      <div>
                        <p className="text-brand-text-light">วันเกิด</p>
                        <p className="font-medium">{idCardData.birthDate}</p>
                      </div>
                    </div>
                  </div>
                )}

                <div className="grid sm:grid-cols-2 gap-4">
                  {idCardFile && (
                    <div className="p-3 rounded-lg border border-brand-border">
                      <p className="text-xs text-brand-text-light mb-2">
                        รูปบัตรประชาชน
                      </p>
                      <div className="flex items-center gap-2">
                        <FileText className="w-8 h-8 text-brand-primary" />
                        <div className="text-sm truncate">{idCardFile.name}</div>
                      </div>
                    </div>
                  )}
                  {selfieFile && (
                    <div className="p-3 rounded-lg border border-brand-border">
                      <p className="text-xs text-brand-text-light mb-2">
                        Selfie คู่บัตร
                      </p>
                      <div className="flex items-center gap-2">
                        <Camera className="w-8 h-8 text-brand-primary" />
                        <div className="text-sm truncate">{selfieFile.name}</div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Submission tracking preview */}
                <div className="p-4 rounded-lg bg-blue-50 border border-blue-100">
                  <div className="flex items-center gap-2 mb-1">
                    <Clock className="w-4 h-4 text-blue-600" />
                    <p className="text-sm font-medium text-blue-800">
                      หลังส่งเอกสาร
                    </p>
                  </div>
                  <p className="text-xs text-blue-700">
                    รอตรวจสอบประมาณ 1-3 วันทำการ
                    คุณจะได้รับการแจ้งเตือนเมื่อผ่านการยืนยัน
                  </p>
                </div>

                <div className="p-4 rounded-lg bg-amber-50 border border-amber-100">
                  <p className="text-sm text-amber-800">
                    เมื่อกดยืนยัน คุณยินยอมให้ MeeLike เก็บรวบรวม ใช้
                    และเปิดเผยข้อมูลส่วนบุคคลของคุณ ตาม พ.ร.บ.
                    คุ้มครองข้อมูลส่วนบุคคล (PDPA)
                    เพื่อวัตถุประสงค์ในการยืนยันตัวตน
                  </p>
                </div>

                <div className="flex gap-3">
                  <Button
                    variant="outline"
                    onClick={() => setVerificationStep("id_card")}
                    className="flex-1"
                  >
                    แก้ไขข้อมูล
                  </Button>
                  <Button
                    variant="primary"
                    onClick={handleSubmitVerified}
                    isLoading={isSubmitting}
                    className="flex-1"
                  >
                    ยืนยันและส่งตรวจสอบ
                  </Button>
                </div>
              </div>
            </>
          )}
        </Card>
      </div>
    );
  }

  // ===== BUSINESS VERIFICATION VIEW =====

  if (view === "business") {
    return (
      <div className="space-y-6 animate-fade-in">
        <div className="flex items-center gap-4">
          <button
            onClick={() => {
              setView("overview");
              setBusinessData({ companyName: "", taxId: "" });
              setCertFile(null);
            }}
            className="text-brand-text-light hover:text-brand-text-dark transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-xl font-bold text-brand-text-dark">
              ยืนยันระดับ Business
            </h1>
            <p className="text-sm text-brand-text-light">
              สำหรับนิติบุคคล/บริษัท
            </p>
          </div>
        </div>

        <Card className="border-none shadow-md p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center">
              <Building2 className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <h2 className="font-bold text-brand-text-dark">
                ข้อมูลนิติบุคคล
              </h2>
              <p className="text-xs text-brand-text-light">
                กรอกข้อมูลและอัปโหลดเอกสาร
              </p>
            </div>
          </div>

          <div className="space-y-5">
            <Input
              label="ชื่อบริษัท / ห้างหุ้นส่วน"
              value={businessData.companyName}
              onChange={(e) =>
                setBusinessData({
                  ...businessData,
                  companyName: e.target.value,
                })
              }
              placeholder="บริษัท ตัวอย่าง จำกัด"
              leftIcon={<Building2 className="w-4 h-4" />}
            />

            <Input
              label="เลขประจำตัวผู้เสียภาษี"
              value={businessData.taxId}
              onChange={(e) =>
                setBusinessData({ ...businessData, taxId: e.target.value })
              }
              placeholder="0-0000-00000-00-0"
              leftIcon={<FileText className="w-4 h-4" />}
              hint="เลข 13 หลัก"
            />

            <FileUpload
              label="หนังสือรับรองบริษัท"
              accept=".pdf,image/*"
              maxSize={10}
              onUpload={(files) => setCertFile(files[0])}
              hint="PDF หรือรูปภาพ (ไม่เกิน 6 เดือน)"
              required
            />

            <div className="p-4 rounded-lg bg-purple-50 border border-purple-100">
              <p className="text-sm font-medium text-purple-800 mb-2">
                เอกสารที่ใช้ได้:
              </p>
              <ul className="text-sm text-purple-700 list-disc list-inside space-y-1">
                <li>หนังสือรับรองนิติบุคคล (DBD) ไม่เกิน 6 เดือน</li>
                <li>ใบทะเบียนภาษีมูลค่าเพิ่ม (ภพ.20)</li>
                <li>สำเนาบัตรประชาชนกรรมการผู้มีอำนาจลงนาม</li>
              </ul>
            </div>

            <div className="flex gap-3 pt-4">
              <Button
                variant="outline"
                onClick={() => setView("overview")}
                className="flex-1"
              >
                ยกเลิก
              </Button>
              <Button
                variant="primary"
                onClick={handleSubmitBusiness}
                isLoading={isSubmitting}
                className="flex-1"
                disabled={
                  !businessData.companyName ||
                  !businessData.taxId ||
                  !certFile
                }
              >
                ส่งตรวจสอบ
              </Button>
            </div>
          </div>
        </Card>
      </div>
    );
  }

  return null;
}
