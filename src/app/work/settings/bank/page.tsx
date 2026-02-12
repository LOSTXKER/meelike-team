"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { Card, Button, Input, Badge, Skeleton } from "@/components/ui";
import { VStack } from "@/components/layout";
import { useAuthStore } from "@/lib/store";
import { useUpdateWorkerProfile, useVerifyBankAccount } from "@/lib/api/hooks";
import { useToast } from "@/components/ui/toast";
import { canWithdrawMoney, type KYCLevel } from "@/types";
import {
  Building2,
  CreditCard,
  Save,
  CheckCircle2,
  Info,
  Shield,
  AlertTriangle,
  Search,
  XCircle,
  Loader2,
} from "lucide-react";

const BANKS = [
  { code: "kbank", name: "กสิกรไทย" },
  { code: "scb", name: "ไทยพาณิชย์" },
  { code: "bbl", name: "กรุงเทพ" },
  { code: "ktb", name: "กรุงไทย" },
  { code: "bay", name: "กรุงศรีอยุธยา" },
  { code: "tmb", name: "ทหารไทยธนชาต" },
  { code: "gsb", name: "ออมสิน" },
];

export default function WorkerBankSettingsPage() {
  const { user } = useAuthStore();
  const worker = user?.worker;
  const updateProfile = useUpdateWorkerProfile();
  const verifyBank = useVerifyBankAccount();
  const toast = useToast();

  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => { const t = setTimeout(() => setIsLoading(false), 300); return () => clearTimeout(t); }, []);

  // KYC info
  const kycLevel: KYCLevel = worker?.kyc?.level || 'none';
  const hasKYC = canWithdrawMoney(kycLevel);
  const kycFullName = useMemo(() => {
    const kyc = worker?.kyc;
    if (!kyc?.idCardFirstName || !kyc?.idCardLastName) return "";
    const prefix = kyc.idCardPrefix ? `${kyc.idCardPrefix}` : "";
    return `${prefix}${kyc.idCardFirstName} ${kyc.idCardLastName}`.trim();
  }, [worker?.kyc]);

  // Form state
  const [formData, setFormData] = useState({
    bankCode: worker?.bankCode || "",
    bankName: worker?.bankName || "",
    bankAccount: worker?.bankAccount || "",
    bankAccountName: worker?.bankAccountName || "",
    promptPayId: worker?.promptPayId || "",
  });

  // Verification state
  const [verifiedName, setVerifiedName] = useState<string | null>(
    worker?.bankAccountName || null
  );
  const [verifyError, setVerifyError] = useState<string | null>(null);
  const [nameMatchesKYC, setNameMatchesKYC] = useState<boolean | null>(null);

  // Check if verification result matches KYC
  useEffect(() => {
    if (verifiedName && kycFullName) {
      // Normalize both names for comparison (trim, lowercase)
      const normalize = (s: string) => s.trim().replace(/\s+/g, " ").toLowerCase();
      setNameMatchesKYC(normalize(verifiedName) === normalize(kycFullName));
    } else {
      setNameMatchesKYC(null);
    }
  }, [verifiedName, kycFullName]);

  // Reset verification when bank or account number changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    if (name === "bankCode") {
      const selectedBank = BANKS.find(b => b.code === value);
      setFormData(prev => ({ ...prev, bankCode: value, bankName: selectedBank?.name || "" }));
      // Reset verification
      setVerifiedName(null);
      setVerifyError(null);
      setNameMatchesKYC(null);
    } else if (name === "bankAccount") {
      setFormData(prev => ({ ...prev, bankAccount: value }));
      // Reset verification
      setVerifiedName(null);
      setVerifyError(null);
      setNameMatchesKYC(null);
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  // Verify bank account via API
  const handleVerify = () => {
    setVerifyError(null);
    setVerifiedName(null);
    setNameMatchesKYC(null);

    verifyBank.mutate(
      {
        bankCode: formData.bankCode,
        accountNumber: formData.bankAccount,
      },
      {
        onSuccess: (result) => {
          setVerifiedName(result.accountName);
          setFormData(prev => ({ ...prev, bankAccountName: result.accountName }));
        },
        onError: (error) => {
          setVerifyError(error.message || "ไม่สามารถตรวจสอบบัญชีได้ กรุณาลองใหม่");
        },
      }
    );
  };

  // Save profile
  const handleSave = () => {
    if (!verifiedName) {
      toast.error("กรุณาตรวจสอบบัญชีก่อนบันทึก");
      return;
    }
    if (nameMatchesKYC === false) {
      toast.error("ชื่อบัญชีไม่ตรงกับข้อมูล KYC ไม่สามารถบันทึกได้");
      return;
    }

    const saveData = {
      bankCode: formData.bankCode,
      bankName: formData.bankName,
      bankAccount: formData.bankAccount,
      bankAccountName: verifiedName,
      promptPayId: formData.promptPayId,
    };
    updateProfile.mutate(saveData, {
      onSuccess: () => toast.success("บันทึกข้อมูลบัญชีเรียบร้อย"),
      onError: () => toast.error("เกิดข้อผิดพลาด กรุณาลองใหม่"),
    });
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-64 rounded-xl" />
        <Skeleton className="h-48 rounded-xl" />
      </div>
    );
  }

  const hasBankInfo = formData.bankCode && formData.bankAccount && verifiedName;
  const canVerify = formData.bankCode && formData.bankAccount.replace(/[^0-9]/g, "").length >= 10;
  const canSave = verifiedName && nameMatchesKYC !== false;

  return (
    <div className="space-y-6">
      {/* KYC Warning */}
      {!hasKYC && (
        <Card className="border-none shadow-md border-brand-warning/30 bg-brand-warning/5">
          <div className="p-6">
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-6 h-6 text-brand-warning shrink-0 mt-0.5" />
              <div>
                <p className="font-bold text-brand-text-dark">ต้องยืนยันตัวตน (KYC) ก่อน</p>
                <p className="text-sm text-brand-text-light mt-1">
                  ชื่อบัญชีธนาคารต้องตรงกับข้อมูลบัตรประชาชนที่ยืนยันตัวตนแล้ว กรุณายืนยันตัวตนก่อนตั้งค่าบัญชีรับเงิน
                </p>
                <Link
                  href="/work/settings/verification"
                  className="inline-flex items-center gap-1.5 mt-3 px-4 py-2 bg-brand-primary text-white text-sm font-medium rounded-xl hover:bg-brand-primary/90 transition-colors"
                >
                  <Shield className="w-4 h-4" />
                  ยืนยันตัวตนเลย
                </Link>
              </div>
            </div>
          </div>
        </Card>
      )}

      {/* Status */}
      <Card className="border-none shadow-md">
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-brand-text-dark">บัญชีรับเงิน</h2>
            {hasBankInfo ? (
              <Badge variant="success">
                <CheckCircle2 className="w-3 h-3 mr-1" />
                ตั้งค่าแล้ว
              </Badge>
            ) : (
              <Badge variant="warning">ยังไม่ได้ตั้งค่า</Badge>
            )}
          </div>
          {!hasBankInfo && (
            <div className="p-4 bg-brand-warning/10 border border-brand-warning/20 rounded-xl">
              <div className="flex items-start gap-3">
                <Info className="w-5 h-5 text-brand-warning shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium text-brand-text-dark text-sm">กรุณาตั้งค่าบัญชีรับเงิน</p>
                  <p className="text-xs text-brand-text-light mt-1">
                    เลือกธนาคาร กรอกเลขบัญชี แล้วกดตรวจสอบเพื่อยืนยันชื่อบัญชี
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </Card>

      {/* Bank Account */}
      <Card className="border-none shadow-md">
        <div className="p-6">
          <h3 className="font-bold text-brand-text-dark mb-4 flex items-center gap-2">
            <Building2 className="w-5 h-5 text-brand-primary" />
            บัญชีธนาคาร
          </h3>
          <VStack gap={4}>
            {/* Bank Selection */}
            <div>
              <label className="text-sm font-medium text-brand-text-dark mb-1.5 block">ธนาคาร</label>
              <select
                name="bankCode"
                value={formData.bankCode}
                onChange={handleChange}
                className="w-full px-3 py-2.5 border border-brand-border rounded-xl bg-white text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary"
              >
                <option value="">เลือกธนาคาร</option>
                {BANKS.map((bank) => (
                  <option key={bank.code} value={bank.code}>{bank.name}</option>
                ))}
              </select>
            </div>

            {/* Account Number + Verify Button */}
            <div>
              <label className="text-sm font-medium text-brand-text-dark mb-1.5 block">เลขบัญชี</label>
              <div className="flex gap-2">
                <Input
                  name="bankAccount"
                  value={formData.bankAccount}
                  onChange={handleChange}
                  placeholder="กรอกเลขบัญชี 10-15 หลัก"
                  className="flex-1"
                />
                <Button
                  onClick={handleVerify}
                  disabled={!canVerify || verifyBank.isPending}
                  variant="outline"
                  className="shrink-0 border-brand-primary text-brand-primary hover:bg-brand-primary/5"
                >
                  {verifyBank.isPending ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-1.5 animate-spin" />
                      ตรวจสอบ...
                    </>
                  ) : (
                    <>
                      <Search className="w-4 h-4 mr-1.5" />
                      ตรวจสอบบัญชี
                    </>
                  )}
                </Button>
              </div>
              {!canVerify && formData.bankAccount && (
                <p className="text-xs text-brand-text-light mt-1.5">
                  กรุณาเลือกธนาคารและกรอกเลขบัญชีให้ครบ (อย่างน้อย 10 หลัก)
                </p>
              )}
            </div>

            {/* Verification Result */}
            {verifyError && (
              <div className="p-4 bg-brand-error/5 border border-brand-error/20 rounded-xl">
                <div className="flex items-start gap-2">
                  <XCircle className="w-5 h-5 text-brand-error shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-brand-error">ตรวจสอบไม่สำเร็จ</p>
                    <p className="text-xs text-brand-error/80 mt-0.5">{verifyError}</p>
                  </div>
                </div>
              </div>
            )}

            {verifiedName && (
              <div className={`p-4 rounded-xl border ${
                nameMatchesKYC === false
                  ? "bg-brand-error/5 border-brand-error/20"
                  : "bg-brand-success/5 border-brand-success/20"
              }`}>
                <div className="flex items-start gap-3">
                  {nameMatchesKYC === false ? (
                    <XCircle className="w-5 h-5 text-brand-error shrink-0 mt-0.5" />
                  ) : (
                    <CheckCircle2 className="w-5 h-5 text-brand-success shrink-0 mt-0.5" />
                  )}
                  <div className="flex-1">
                    <p className="text-xs text-brand-text-light">ชื่อเจ้าของบัญชี (จากธนาคาร)</p>
                    <p className="text-lg font-bold text-brand-text-dark mt-0.5">{verifiedName}</p>

                    {kycFullName && nameMatchesKYC === true && (
                      <div className="mt-2 flex items-center gap-1.5">
                        <Shield className="w-3.5 h-3.5 text-brand-success" />
                        <p className="text-xs text-brand-success font-medium">
                          ตรงกับข้อมูล KYC ({kycFullName})
                        </p>
                      </div>
                    )}

                    {kycFullName && nameMatchesKYC === false && (
                      <div className="mt-2 space-y-1.5">
                        <div className="flex items-center gap-1.5">
                          <AlertTriangle className="w-3.5 h-3.5 text-brand-error" />
                          <p className="text-xs text-brand-error font-medium">
                            ไม่ตรงกับข้อมูล KYC
                          </p>
                        </div>
                        <div className="p-2 bg-white/60 rounded-lg text-xs text-brand-text-light">
                          <p>ชื่อจาก KYC: <span className="font-medium text-brand-text-dark">{kycFullName}</span></p>
                          <p>ชื่อจากธนาคาร: <span className="font-medium text-brand-text-dark">{verifiedName}</span></p>
                        </div>
                        <p className="text-xs text-brand-error/80">
                          บัญชีธนาคารต้องเป็นชื่อเดียวกับที่ยืนยันตัวตน (KYC) กรุณาใช้บัญชีที่เป็นชื่อของตัวเอง
                        </p>
                      </div>
                    )}

                    {!kycFullName && (
                      <p className="text-xs text-brand-text-light mt-1.5">
                        ตรวจสอบบัญชีสำเร็จ
                      </p>
                    )}
                  </div>
                </div>
              </div>
            )}
          </VStack>
        </div>
      </Card>

      {/* PromptPay */}
      <Card className="border-none shadow-md">
        <div className="p-6">
          <h3 className="font-bold text-brand-text-dark mb-4 flex items-center gap-2">
            <CreditCard className="w-5 h-5 text-brand-success" />
            PromptPay
          </h3>
          <div>
            <label className="text-sm font-medium text-brand-text-dark mb-1.5 block">หมายเลข PromptPay</label>
            <Input
              name="promptPayId"
              value={formData.promptPayId}
              onChange={handleChange}
              placeholder="เบอร์โทรศัพท์หรือเลขบัตรประชาชน"
            />
            <p className="text-xs text-brand-text-light mt-1.5">
              ใช้สำหรับรับเงินผ่าน PromptPay (เร็วกว่าโอนผ่านธนาคาร)
            </p>
          </div>
        </div>
      </Card>

      {/* How it works */}
      <Card className="bg-brand-info/5 border border-brand-info/20">
        <div className="p-5">
          <div className="flex items-start gap-3">
            <Info className="w-5 h-5 text-brand-info shrink-0 mt-0.5" />
            <div className="text-sm">
              <p className="font-bold text-brand-text-dark">ขั้นตอนการตั้งค่าบัญชี</p>
              <ol className="text-brand-text-light mt-2 space-y-1 list-decimal list-inside">
                <li>เลือกธนาคารและกรอกเลขบัญชี</li>
                <li>กดปุ่ม &ldquo;ตรวจสอบบัญชี&rdquo; เพื่อดึงชื่อเจ้าของบัญชีจากธนาคาร</li>
                <li>ระบบจะเช็คว่าชื่อบัญชีตรงกับข้อมูล KYC หรือไม่</li>
                <li>ถ้าตรง → กดบันทึกได้เลย</li>
              </ol>
            </div>
          </div>
        </div>
      </Card>

      {/* Save */}
      <div className="flex justify-end">
        <Button
          onClick={handleSave}
          disabled={updateProfile.isPending || !canSave || !hasKYC}
          className="shadow-md shadow-brand-primary/20"
        >
          <Save className="w-4 h-4 mr-2" />
          {updateProfile.isPending ? "กำลังบันทึก..." : "บันทึกการเปลี่ยนแปลง"}
        </Button>
      </div>
    </div>
  );
}
