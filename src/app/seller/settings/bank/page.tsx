"use client";

import { useState } from "react";
import { Card, Button, Input, Badge, Select } from "@/components/ui";
import { useToast } from "@/components/ui/toast";
import { useUnsavedChanges } from "@/lib/hooks/useUnsavedChanges";
import {
  Wallet,
  CreditCard,
  CheckCircle,
  AlertCircle,
  Building2,
  Save,
} from "lucide-react";

export default function BankSettingsPage() {
  const toast = useToast();
  const { setDirty, setClean } = useUnsavedChanges();
  const [isSaving, setIsSaving] = useState(false);

  const [bankData, setBankData] = useState({
    bank: "",
    accountNumber: "",
    accountName: "",
    promptpay: "",
    isVerified: false,
  });

  const handleBankChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setBankData({ ...bankData, [e.target.name]: e.target.value });
    setDirty();
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await new Promise((r) => setTimeout(r, 500));
      toast.success("บันทึกข้อมูลบัญชีรับเงินเรียบร้อย");
      setClean();
    } finally {
      setIsSaving(false);
    }
  };

  const bankOptions = [
    { value: "kbank", label: "กสิกรไทย (KBANK)" },
    { value: "scb", label: "ไทยพาณิชย์ (SCB)" },
    { value: "ktb", label: "กรุงไทย (KTB)" },
    { value: "bbl", label: "กรุงเทพ (BBL)" },
    { value: "ttb", label: "ทีทีบี (ttb)" },
    { value: "gsb", label: "ออมสิน (GSB)" },
    { value: "bay", label: "กรุงศรี (BAY)" },
  ];

  return (
    <div className="space-y-6">
      <Card className="border-none shadow-md p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-emerald-100 flex items-center justify-center">
              <Wallet className="w-5 h-5 text-emerald-600" />
            </div>
            <div>
              <h2 className="font-bold text-brand-text-dark">บัญชีรับเงิน</h2>
              <p className="text-xs text-brand-text-light">
                บัญชีธนาคารสำหรับรับเงิน
              </p>
            </div>
          </div>
          {bankData.isVerified ? (
            <Badge variant="success" size="sm">
              <CheckCircle className="w-3 h-3 mr-1" />
              ยืนยันแล้ว
            </Badge>
          ) : (
            <Badge variant="warning" size="sm">
              <AlertCircle className="w-3 h-3 mr-1" />
              รอยืนยัน
            </Badge>
          )}
        </div>

        {bankData.isVerified && (
          <div className="p-4 bg-emerald-50 rounded-xl border border-emerald-100 mb-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-emerald-500 rounded-xl flex items-center justify-center">
                <Building2 className="w-6 h-6 text-white" />
              </div>
              <div className="flex-1">
                <p className="font-bold text-brand-text-dark">
                  {bankOptions.find((b) => b.value === bankData.bank)?.label}
                </p>
                <p className="text-sm text-brand-text-light">
                  {bankData.accountNumber} • {bankData.accountName}
                </p>
              </div>
              <div className="flex items-center gap-2 text-emerald-600">
                <CheckCircle className="w-5 h-5" />
                <span className="text-sm font-medium">ใช้งานอยู่</span>
              </div>
            </div>
          </div>
        )}

        <div className="grid gap-5">
          <div className="grid sm:grid-cols-2 gap-5">
            <Select
              label="ธนาคาร"
              name="bank"
              options={bankOptions}
              value={bankData.bank}
              onChange={handleBankChange}
            />
            <Input
              label="เลขที่บัญชี"
              name="accountNumber"
              value={bankData.accountNumber}
              onChange={handleBankChange}
              placeholder="xxx-x-xxxxx-x"
              leftIcon={<CreditCard className="w-4 h-4" />}
            />
          </div>
          <div className="grid sm:grid-cols-2 gap-5">
            <Input
              label="ชื่อบัญชี"
              name="accountName"
              value={bankData.accountName}
              onChange={handleBankChange}
              placeholder="ระบุชื่อบัญชีภาษาไทย"
            />
            <Input
              label="PromptPay"
              name="promptpay"
              value={bankData.promptpay}
              onChange={handleBankChange}
              placeholder="เบอร์โทร หรือ เลขบัตร ปชช."
            />
          </div>
        </div>

        <div className="mt-4 p-3 bg-amber-50 rounded-xl border border-amber-100">
          <div className="flex items-start gap-2 text-amber-700">
            <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
            <p className="text-xs">
              บัญชีนี้จะใช้สำหรับรับเงินจากลูกค้าและการถอนเงินจากระบบ
              กรุณาตรวจสอบข้อมูลให้ถูกต้อง
            </p>
          </div>
        </div>
      </Card>

      <div className="flex justify-end">
        <Button
          onClick={handleSave}
          isLoading={isSaving}
          leftIcon={<Save className="w-4 h-4" />}
        >
          บันทึก
        </Button>
      </div>
    </div>
  );
}
