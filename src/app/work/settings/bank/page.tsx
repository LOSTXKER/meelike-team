"use client";

import { useState, useEffect } from "react";
import { Card, Button, Input, Badge, Skeleton } from "@/components/ui";
import { VStack } from "@/components/layout";
import { useAuthStore } from "@/lib/store";
import { useUpdateWorkerProfile } from "@/lib/api/hooks";
import { useToast } from "@/components/ui/toast";
import {
  Wallet,
  Building2,
  CreditCard,
  Save,
  CheckCircle2,
  Info,
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
  const toast = useToast();

  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => { const t = setTimeout(() => setIsLoading(false), 300); return () => clearTimeout(t); }, []);

  const [formData, setFormData] = useState({
    bankName: worker?.bankName || "",
    bankAccount: worker?.bankAccount || "",
    bankAccountName: worker?.bankAccountName || "",
    promptPayId: worker?.promptPayId || "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSave = () => {
    updateProfile.mutate(formData, {
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

  const hasBankInfo = formData.bankName && formData.bankAccount;

  return (
    <div className="space-y-6">
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
                    ต้องตั้งค่าบัญชีธนาคารก่อนจึงจะถอนเงินได้
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
            <div>
              <label className="text-sm font-medium text-brand-text-dark mb-1.5 block">ธนาคาร</label>
              <select
                name="bankName"
                value={formData.bankName}
                onChange={handleChange}
                className="w-full px-3 py-2.5 border border-brand-border rounded-xl bg-white text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary"
              >
                <option value="">เลือกธนาคาร</option>
                {BANKS.map((bank) => (
                  <option key={bank.code} value={bank.name}>{bank.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-sm font-medium text-brand-text-dark mb-1.5 block">เลขบัญชี</label>
              <Input
                name="bankAccount"
                value={formData.bankAccount}
                onChange={handleChange}
                placeholder="XXX-X-XXXXX-X"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-brand-text-dark mb-1.5 block">ชื่อบัญชี</label>
              <Input
                name="bankAccountName"
                value={formData.bankAccountName}
                onChange={handleChange}
                placeholder="ชื่อ-นามสกุล ตามบัญชี"
              />
            </div>
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

      {/* Save */}
      <div className="flex justify-end">
        <Button
          onClick={handleSave}
          disabled={updateProfile.isPending}
          className="shadow-md shadow-brand-primary/20"
        >
          <Save className="w-4 h-4 mr-2" />
          {updateProfile.isPending ? "กำลังบันทึก..." : "บันทึกการเปลี่ยนแปลง"}
        </Button>
      </div>
    </div>
  );
}
