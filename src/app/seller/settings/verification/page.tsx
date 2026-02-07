"use client";

import { useState } from "react";
import { Card, Button, Badge, Input } from "@/components/ui";
import { IDCardUpload, SelfieCapture, FileUpload } from "@/components/shared";
import type { IDCardData } from "@/components/shared";
import { useAuthStore } from "@/lib/store";
import {
  Shield,
  CheckCircle,
  Clock,
  AlertCircle,
  ChevronRight,
  Phone,
  Mail,
  CreditCard,
  Camera,
  Building2,
  FileText,
  ArrowLeft,
  Info,
} from "lucide-react";
import Link from "next/link";
import { DEFAULT_KYC_DATA } from "@/types";
import type { KYCLevel } from "@/types";

type VerificationView = 'overview' | 'verified' | 'business';
type VerificationStep = 'id_card' | 'selfie' | 'review';

const LEVEL_INFO = {
  none: {
    label: 'ยังไม่ยืนยัน',
    color: 'text-brand-text-light',
    bgColor: 'bg-brand-bg',
    limit: 0,
  },
  basic: {
    label: 'Basic',
    color: 'text-blue-600',
    bgColor: 'bg-blue-50',
    limit: 1000,
  },
  verified: {
    label: 'Verified',
    color: 'text-emerald-600',
    bgColor: 'bg-emerald-50',
    limit: 10000,
  },
  business: {
    label: 'Business',
    color: 'text-purple-600',
    bgColor: 'bg-purple-50',
    limit: 999999,
  },
};

export default function VerificationPage() {
  const { user } = useAuthStore();
  const [view, setView] = useState<VerificationView>('overview');
  const [verificationStep, setVerificationStep] = useState<VerificationStep>('id_card');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Form data for Verified level
  const [idCardData, setIdCardData] = useState<IDCardData | null>(null);
  const [idCardFile, setIdCardFile] = useState<File | null>(null);
  const [selfieFile, setSelfieFile] = useState<File | null>(null);
  
  // Form data for Business level
  const [businessData, setBusinessData] = useState({
    companyName: '',
    taxId: '',
  });
  const [certFile, setCertFile] = useState<File | null>(null);

  const kyc = user?.seller?.kyc || DEFAULT_KYC_DATA;
  const currentLevel = kyc.level;
  const levelInfo = LEVEL_INFO[currentLevel];

  const handleIdCardConfirmed = (data: IDCardData, file: File) => {
    setIdCardData(data);
    setIdCardFile(file);
    setVerificationStep('selfie');
  };

  const handleSelfieCapture = (file: File) => {
    setSelfieFile(file);
    setVerificationStep('review');
  };

  const handleSubmitVerified = async () => {
    setIsSubmitting(true);
    // Mock submission
    await new Promise(resolve => setTimeout(resolve, 2000));
    setIsSubmitting(false);
    alert('ส่งเอกสารเรียบร้อย! กรุณารอการตรวจสอบ 1-3 วันทำการ');
    setView('overview');
  };

  const handleSubmitBusiness = async () => {
    if (!businessData.companyName || !businessData.taxId || !certFile) {
      alert('กรุณากรอกข้อมูลให้ครบถ้วน');
      return;
    }
    
    setIsSubmitting(true);
    await new Promise(resolve => setTimeout(resolve, 2000));
    setIsSubmitting(false);
    alert('ส่งเอกสารเรียบร้อย! กรุณารอการตรวจสอบ 3-5 วันทำการ');
    setView('overview');
  };

  // Overview View
  if (view === 'overview') {
    return (
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Link href="/seller/settings" className="text-brand-text-light hover:text-brand-text-dark">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-xl font-bold text-brand-text-dark">ยืนยันตัวตน (KYC)</h1>
            <p className="text-sm text-brand-text-light">ยืนยันตัวตนเพื่อเพิ่มวงเงินการถอน</p>
          </div>
        </div>

        {/* Current Level Card */}
        <Card className="border-none shadow-md p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <div className={`w-14 h-14 rounded-xl ${levelInfo.bgColor} flex items-center justify-center`}>
                <Shield className={`w-7 h-7 ${levelInfo.color}`} />
              </div>
              <div>
                <p className="text-sm text-brand-text-light">ระดับปัจจุบัน</p>
                <p className={`text-xl font-bold ${levelInfo.color}`}>{levelInfo.label}</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm text-brand-text-light">วงเงินถอน/วัน</p>
              <p className="text-xl font-bold text-brand-text-dark">
                {levelInfo.limit === 999999 ? 'ไม่จำกัด' : `฿${levelInfo.limit.toLocaleString()}`}
              </p>
            </div>
          </div>

          {/* Verified Items */}
          {kyc.phoneVerified && (
            <div className="flex items-center gap-3 p-3 rounded-lg bg-brand-success/5 border border-brand-success/20 mb-3">
              <CheckCircle className="w-5 h-5 text-brand-success" />
              <div className="flex-1">
                <p className="text-sm font-medium text-brand-text-dark">เบอร์โทรยืนยันแล้ว</p>
              </div>
              <Badge variant="success" size="sm">ผ่าน</Badge>
            </div>
          )}
          {kyc.emailVerified && (
            <div className="flex items-center gap-3 p-3 rounded-lg bg-brand-success/5 border border-brand-success/20">
              <CheckCircle className="w-5 h-5 text-brand-success" />
              <div className="flex-1">
                <p className="text-sm font-medium text-brand-text-dark">อีเมลยืนยันแล้ว</p>
              </div>
              <Badge variant="success" size="sm">ผ่าน</Badge>
            </div>
          )}
        </Card>

        {/* Upgrade Options */}
        <div className="space-y-4">
          <h2 className="font-semibold text-brand-text-dark">อัปเกรดระดับ KYC</h2>

          {/* Verified Level */}
          <Card 
            className={`border shadow-sm p-5 cursor-pointer transition-all hover:shadow-md ${
              currentLevel === 'verified' || currentLevel === 'business' 
                ? 'border-brand-success/30 bg-brand-success/5' 
                : 'border-brand-border hover:border-brand-primary'
            }`}
            onClick={() => currentLevel === 'basic' && setView('verified')}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className={`w-12 h-12 rounded-xl ${(currentLevel === 'verified' || currentLevel === 'business') ? 'bg-brand-success/10' : 'bg-emerald-50'} flex items-center justify-center`}>
                  {(currentLevel === 'verified' || currentLevel === 'business') ? (
                    <CheckCircle className="w-6 h-6 text-brand-success" />
                  ) : (
                    <CreditCard className="w-6 h-6 text-emerald-600" />
                  )}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <p className="font-semibold text-brand-text-dark">Verified</p>
                    {(currentLevel === 'verified' || currentLevel === 'business') && (
                      <Badge variant="success" size="sm">ผ่านแล้ว</Badge>
                    )}
                  </div>
                  <p className="text-sm text-brand-text-light">บัตรประชาชน + Selfie คู่บัตร</p>
                  <p className="text-sm font-medium text-emerald-600">วงเงินถอน ฿10,000/วัน</p>
                </div>
              </div>
              {currentLevel === 'basic' && (
                <ChevronRight className="w-5 h-5 text-brand-text-light" />
              )}
            </div>
          </Card>

          {/* Business Level */}
          <Card 
            className={`border shadow-sm p-5 transition-all ${
              currentLevel === 'business' 
                ? 'border-brand-success/30 bg-brand-success/5 cursor-default' 
                : currentLevel === 'verified'
                  ? 'border-brand-border hover:border-brand-primary hover:shadow-md cursor-pointer'
                  : 'border-brand-border bg-brand-bg/50 cursor-not-allowed opacity-60'
            }`}
            onClick={() => currentLevel === 'verified' && setView('business')}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className={`w-12 h-12 rounded-xl ${currentLevel === 'business' ? 'bg-brand-success/10' : 'bg-purple-50'} flex items-center justify-center`}>
                  {currentLevel === 'business' ? (
                    <CheckCircle className="w-6 h-6 text-brand-success" />
                  ) : (
                    <Building2 className="w-6 h-6 text-purple-600" />
                  )}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <p className="font-semibold text-brand-text-dark">Business</p>
                    {currentLevel === 'business' && (
                      <Badge variant="success" size="sm">ผ่านแล้ว</Badge>
                    )}
                    {currentLevel === 'basic' && (
                      <Badge variant="default" size="sm">ต้องผ่าน Verified ก่อน</Badge>
                    )}
                  </div>
                  <p className="text-sm text-brand-text-light">หนังสือรับรองบริษัท</p>
                  <p className="text-sm font-medium text-purple-600">วงเงินถอนไม่จำกัด</p>
                </div>
              </div>
              {currentLevel === 'verified' && (
                <ChevronRight className="w-5 h-5 text-brand-text-light" />
              )}
            </div>
          </Card>
        </div>

        {/* Info Box */}
        <div className="p-4 rounded-xl bg-blue-50 border border-blue-100">
          <div className="flex items-start gap-3">
            <Info className="w-5 h-5 text-blue-600 mt-0.5" />
            <div className="text-sm text-blue-800">
              <p className="font-medium mb-1">ทำไมต้องยืนยันตัวตน?</p>
              <ul className="list-disc list-inside space-y-1 text-blue-700">
                <li>ป้องกันการฉ้อโกงและรักษาความปลอดภัย</li>
                <li>เพิ่มวงเงินการถอนต่อวัน</li>
                <li>สร้างความน่าเชื่อถือให้ร้านค้า</li>
                <li>ปฏิบัติตามกฎหมาย PDPA และ AML</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Verified Verification View
  if (view === 'verified') {
    return (
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <button 
            onClick={() => {
              setView('overview');
              setVerificationStep('id_card');
              setIdCardData(null);
              setIdCardFile(null);
              setSelfieFile(null);
            }} 
            className="text-brand-text-light hover:text-brand-text-dark"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-xl font-bold text-brand-text-dark">ยืนยันระดับ Verified</h1>
            <p className="text-sm text-brand-text-light">อัปโหลดบัตรประชาชนและ Selfie</p>
          </div>
        </div>

        {/* Step Indicator */}
        <div className="flex items-center justify-center gap-2 mb-6">
          {['id_card', 'selfie', 'review'].map((s, i) => {
            const steps: VerificationStep[] = ['id_card', 'selfie', 'review'];
            const currentIdx = steps.indexOf(verificationStep);
            const isActive = s === verificationStep;
            const isCompleted = steps.indexOf(s as VerificationStep) < currentIdx;
            
            return (
              <div key={s} className="flex items-center">
                <div
                  className={`
                    w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium
                    ${isCompleted ? "bg-brand-success text-white" : ""}
                    ${isActive ? "bg-brand-primary text-white" : ""}
                    ${!isActive && !isCompleted ? "bg-brand-bg text-brand-text-light" : ""}
                  `}
                >
                  {isCompleted ? <CheckCircle className="w-5 h-5" /> : i + 1}
                </div>
                {i < 2 && (
                  <div 
                    className={`w-12 h-1 mx-1 rounded ${
                      steps.indexOf(s as VerificationStep) < currentIdx ? "bg-brand-success" : "bg-brand-bg"
                    }`}
                  />
                )}
              </div>
            );
          })}
        </div>

        {/* Step Content */}
        <Card className="border-none shadow-md p-6">
          {/* Step 1: ID Card */}
          {verificationStep === 'id_card' && (
            <>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-lg bg-brand-primary/10 flex items-center justify-center">
                  <CreditCard className="w-5 h-5 text-brand-primary" />
                </div>
                <div>
                  <h2 className="font-bold text-brand-text-dark">ขั้นตอนที่ 1: บัตรประชาชน</h2>
                  <p className="text-xs text-brand-text-light">อัปโหลดรูปบัตรประชาชนด้านหน้า</p>
                </div>
              </div>

              <IDCardUpload
                onDataConfirmed={handleIdCardConfirmed}
              />
            </>
          )}

          {/* Step 2: Selfie */}
          {verificationStep === 'selfie' && (
            <>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-lg bg-brand-primary/10 flex items-center justify-center">
                  <Camera className="w-5 h-5 text-brand-primary" />
                </div>
                <div>
                  <h2 className="font-bold text-brand-text-dark">ขั้นตอนที่ 2: Selfie คู่บัตร</h2>
                  <p className="text-xs text-brand-text-light">ถ่ายรูปหน้าพร้อมถือบัตรประชาชน</p>
                </div>
              </div>

              <SelfieCapture
                onCapture={handleSelfieCapture}
                withIdCard={true}
              />
            </>
          )}

          {/* Step 3: Review */}
          {verificationStep === 'review' && (
            <>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-lg bg-brand-success/10 flex items-center justify-center">
                  <CheckCircle className="w-5 h-5 text-brand-success" />
                </div>
                <div>
                  <h2 className="font-bold text-brand-text-dark">ตรวจสอบและยืนยัน</h2>
                  <p className="text-xs text-brand-text-light">ตรวจสอบข้อมูลก่อนส่งยืนยัน</p>
                </div>
              </div>

              {/* Summary */}
              <div className="space-y-4">
                {/* ID Card Info */}
                {idCardData && (
                  <div className="p-4 rounded-lg border border-brand-border">
                    <p className="text-sm font-medium text-brand-text-dark mb-3">ข้อมูลจากบัตรประชาชน</p>
                    <div className="grid grid-cols-2 gap-3 text-sm">
                      <div>
                        <p className="text-brand-text-light">เลขบัตร</p>
                        <p className="font-medium">{idCardData.idNumber}</p>
                      </div>
                      <div>
                        <p className="text-brand-text-light">ชื่อ-นามสกุล</p>
                        <p className="font-medium">{idCardData.prefix}{idCardData.firstName} {idCardData.lastName}</p>
                      </div>
                      <div>
                        <p className="text-brand-text-light">วันเกิด</p>
                        <p className="font-medium">{idCardData.birthDate}</p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Uploaded Files */}
                <div className="grid sm:grid-cols-2 gap-4">
                  {idCardFile && (
                    <div className="p-3 rounded-lg border border-brand-border">
                      <p className="text-xs text-brand-text-light mb-2">รูปบัตรประชาชน</p>
                      <div className="flex items-center gap-2">
                        <FileText className="w-8 h-8 text-brand-primary" />
                        <div className="text-sm truncate">{idCardFile.name}</div>
                      </div>
                    </div>
                  )}
                  {selfieFile && (
                    <div className="p-3 rounded-lg border border-brand-border">
                      <p className="text-xs text-brand-text-light mb-2">Selfie คู่บัตร</p>
                      <div className="flex items-center gap-2">
                        <Camera className="w-8 h-8 text-brand-primary" />
                        <div className="text-sm truncate">{selfieFile.name}</div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Consent */}
                <div className="p-4 rounded-lg bg-amber-50 border border-amber-100">
                  <p className="text-sm text-amber-800">
                    เมื่อกดยืนยัน คุณยินยอมให้ MeeLike เก็บรวบรวม ใช้ และเปิดเผยข้อมูลส่วนบุคคลของคุณ
                    ตาม พ.ร.บ. คุ้มครองข้อมูลส่วนบุคคล (PDPA) เพื่อวัตถุประสงค์ในการยืนยันตัวตน
                  </p>
                </div>

                {/* Actions */}
                <div className="flex gap-3">
                  <Button
                    variant="outline"
                    onClick={() => setVerificationStep('id_card')}
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

  // Business Verification View
  if (view === 'business') {
    return (
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <button 
            onClick={() => {
              setView('overview');
              setBusinessData({ companyName: '', taxId: '' });
              setCertFile(null);
            }} 
            className="text-brand-text-light hover:text-brand-text-dark"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-xl font-bold text-brand-text-dark">ยืนยันระดับ Business</h1>
            <p className="text-sm text-brand-text-light">สำหรับนิติบุคคล/บริษัท</p>
          </div>
        </div>

        <Card className="border-none shadow-md p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center">
              <Building2 className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <h2 className="font-bold text-brand-text-dark">ข้อมูลนิติบุคคล</h2>
              <p className="text-xs text-brand-text-light">กรอกข้อมูลและอัปโหลดเอกสาร</p>
            </div>
          </div>

          <div className="space-y-5">
            <Input
              label="ชื่อบริษัท / ห้างหุ้นส่วน"
              value={businessData.companyName}
              onChange={(e) => setBusinessData({ ...businessData, companyName: e.target.value })}
              placeholder="บริษัท ตัวอย่าง จำกัด"
              leftIcon={<Building2 className="w-4 h-4" />}
            />

            <Input
              label="เลขประจำตัวผู้เสียภาษี"
              value={businessData.taxId}
              onChange={(e) => setBusinessData({ ...businessData, taxId: e.target.value })}
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

            {/* Info */}
            <div className="p-4 rounded-lg bg-purple-50 border border-purple-100">
              <p className="text-sm font-medium text-purple-800 mb-2">เอกสารที่ใช้ได้:</p>
              <ul className="text-sm text-purple-700 list-disc list-inside space-y-1">
                <li>หนังสือรับรองนิติบุคคล (DBD) ไม่เกิน 6 เดือน</li>
                <li>ใบทะเบียนภาษีมูลค่าเพิ่ม (ภพ.20)</li>
                <li>สำเนาบัตรประชาชนกรรมการผู้มีอำนาจลงนาม</li>
              </ul>
            </div>

            {/* Actions */}
            <div className="flex gap-3 pt-4">
              <Button
                variant="outline"
                onClick={() => setView('overview')}
                className="flex-1"
              >
                ยกเลิก
              </Button>
              <Button
                variant="primary"
                onClick={handleSubmitBusiness}
                isLoading={isSubmitting}
                className="flex-1"
                disabled={!businessData.companyName || !businessData.taxId || !certFile}
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
