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
    // Find the current step config for the hero card
    const currentStepConfig = STEPS.find(
      (s) => s.level === currentLevel
    );
    const currentWithdrawLimit =
      currentLevel === "none"
        ? "฿0"
        : currentLevel === "basic"
          ? "฿1,000"
          : currentLevel === "verified"
            ? "฿10,000"
            : "ไม่จำกัด";
    const currentLevelLabel =
      currentLevel === "none"
        ? "ยังไม่ยืนยัน"
        : currentLevel.charAt(0).toUpperCase() + currentLevel.slice(1);

    return (
      <div className="space-y-6 animate-fade-in">
        {/* Header */}
        <div className="flex items-center gap-4">
          <div className="flex-1">
            <h1 className="text-xl font-bold text-brand-text-dark">
              ยืนยันตัวตน (KYC)
            </h1>
            <p className="text-sm text-brand-text-light">
              ยืนยันตัวตนเพิ่มเติมเพื่อปลดล็อกฟีเจอร์และวงเงิน
            </p>
          </div>
          <Badge
            variant={
              currentLevel === "business"
                ? "success"
                : currentLevel === "none"
                  ? "warning"
                  : "info"
            }
            className="text-sm"
          >
            {currentLevelLabel}
          </Badge>
        </div>

        {/* ===== Hero Status Card ===== */}
        <Card className="border-none shadow-md overflow-hidden">
          <div
            className="p-5"
            style={{
              background: currentStepConfig
                ? `linear-gradient(135deg, ${currentStepConfig.bgColor === "bg-blue-50" ? "#eff6ff" : currentStepConfig.bgColor === "bg-emerald-50" ? "#ecfdf5" : currentStepConfig.bgColor === "bg-purple-50" ? "#faf5ff" : "#f9fafb"}15, white)`
                : undefined,
            }}
          >
            <div className="flex items-center gap-4">
              <div
                className={`w-14 h-14 rounded-2xl flex items-center justify-center ${
                  currentStepConfig
                    ? `${currentStepConfig.bgColor} ${currentStepConfig.color}`
                    : "bg-gray-100 text-gray-400"
                }`}
              >
                {currentStepConfig ? (
                  <currentStepConfig.icon className="w-7 h-7" />
                ) : (
                  <Shield className="w-7 h-7" />
                )}
              </div>
              <div className="flex-1">
                <p className="text-[11px] font-medium text-brand-text-light uppercase tracking-wider">
                  ระดับปัจจุบัน
                </p>
                <p className="text-xl font-bold text-brand-text-dark">
                  {currentLevelLabel}
                </p>
              </div>
              <div className="text-right">
                <p className="text-[11px] font-medium text-brand-text-light uppercase tracking-wider">
                  วงเงินถอน/วัน
                </p>
                <p className="text-xl font-bold text-brand-text-dark">
                  {currentWithdrawLimit}
                </p>
              </div>
            </div>
          </div>
          {/* Segmented progress bar with level labels */}
          <div className="px-5 pb-4 pt-2">
            <div className="flex gap-1.5">
              {STEPS.map((step) => {
                const status = getStepStatus(step.level, currentLevel);
                return (
                  <div key={step.level} className="flex-1">
                    <div
                      className={`h-2 rounded-full transition-all duration-500 ${
                        status === "completed"
                          ? "bg-brand-success"
                          : status === "available"
                            ? "bg-brand-primary/30 animate-pulse"
                            : "bg-gray-100"
                      }`}
                    />
                    <p
                      className={`text-[10px] mt-1 text-center font-medium ${
                        status === "completed"
                          ? "text-brand-success"
                          : status === "available"
                            ? "text-brand-primary"
                            : "text-brand-text-light/50"
                      }`}
                    >
                      {step.label}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </Card>

        {/* ===== Level Cards (always expanded, no accordion) ===== */}
        <div className="space-y-4">
          {STEPS.map((step) => {
            const status = getStepStatus(step.level, currentLevel);
            const Icon = step.icon;

            return (
              <Card
                key={step.level}
                className={`overflow-hidden transition-all ${
                  status === "completed"
                    ? "border-brand-success/30 bg-brand-success/[0.02]"
                    : status === "available"
                      ? `border-2 ${step.borderColor} shadow-md`
                      : "border-dashed border-gray-200 opacity-60"
                }`}
              >
                {/* Card header row */}
                <div className="p-4 flex items-center gap-3">
                  {/* Icon */}
                  <div
                    className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 ${
                      status === "completed"
                        ? "bg-brand-success/10 text-brand-success"
                        : status === "available"
                          ? `${step.bgColor} ${step.color}`
                          : "bg-gray-100 text-gray-400"
                    }`}
                  >
                    {status === "completed" ? (
                      <CheckCircle className="w-5 h-5" />
                    ) : status === "locked" ? (
                      <Lock className="w-5 h-5" />
                    ) : (
                      <Icon className="w-5 h-5" />
                    )}
                  </div>

                  {/* Title + tagline */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-brand-text-dark">
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
                      {status === "locked" && (
                        <Badge variant="default" size="sm">
                          ล็อก
                        </Badge>
                      )}
                    </div>
                    <p className="text-xs text-brand-text-light mt-0.5">
                      {step.tagline}
                    </p>
                  </div>

                  {/* Withdraw limit */}
                  <div className="text-right shrink-0">
                    <p className="text-[10px] text-brand-text-light">วงเงินถอน</p>
                    <p className="text-sm font-bold text-brand-text-dark">
                      {step.withdrawLimit}
                    </p>
                  </div>
                </div>

                {/* Benefits + Requirements */}
                <div className="px-4 pb-4 space-y-3">
                  {/* Benefits as pill tags */}
                  <div className="flex flex-wrap gap-1.5">
                    {step.benefits.map((b) => (
                      <span
                        key={b}
                        className={`inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded-full ${
                          status === "completed"
                            ? "bg-brand-success/10 text-brand-success"
                            : status === "available"
                              ? `${step.bgColor} ${step.color}`
                              : "bg-gray-50 text-brand-text-light/70"
                        }`}
                      >
                        <Check className="w-3 h-3" />
                        {b}
                      </span>
                    ))}
                  </div>

                  {/* Requirements */}
                  {status !== "completed" && (
                    <div className="flex flex-wrap gap-x-4 gap-y-1">
                      {step.requirements.map((r, idx) => (
                        <span
                          key={idx}
                          className="flex items-center gap-1.5 text-xs text-brand-text-light"
                        >
                          <span className="w-4 h-4 rounded-full bg-gray-100 flex items-center justify-center text-[10px] font-medium text-gray-500 shrink-0">
                            {idx + 1}
                          </span>
                          {r}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* CTA for available step */}
                  {status === "available" && (
                    <Button
                      className="w-full"
                      onClick={() => handleStepAction(step, status)}
                    >
                      <Sparkles className="w-4 h-4 mr-1.5" />
                      {step.level === "basic"
                        ? "ยืนยันเบอร์โทร"
                        : step.level === "verified"
                          ? "เริ่มยืนยันตัวตน"
                          : "อัปเกรด Business"}
                      <ArrowRight className="w-4 h-4 ml-1.5" />
                    </Button>
                  )}
                </div>
              </Card>
            );
          })}
        </div>

        {/* ===== Info Section ===== */}
        <Card className="border-none shadow-sm bg-gradient-to-r from-blue-50/80 to-indigo-50/50 p-4">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center shrink-0">
              <Info className="w-4 h-4 text-blue-600" />
            </div>
            <div>
              <p className="text-sm font-semibold text-brand-text-dark mb-1.5">
                ทำไมต้องยืนยันตัวตน?
              </p>
              <div className="flex flex-wrap gap-x-4 gap-y-1">
                {[
                  "ป้องกันการฉ้อโกง",
                  "เพิ่มวงเงินถอน",
                  "สร้างความน่าเชื่อถือ",
                  "ปฏิบัติตาม PDPA/AML",
                ].map((reason) => (
                  <span
                    key={reason}
                    className="flex items-center gap-1 text-xs text-blue-700"
                  >
                    <Check className="w-3 h-3 text-blue-500" />
                    {reason}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </Card>

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
