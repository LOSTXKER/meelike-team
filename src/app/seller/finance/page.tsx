"use client";

import { useState } from "react";
import { Card, Badge, Button, Input, Dialog, Tabs, Modal } from "@/components/ui";
import { Container, Grid, Section, VStack, HStack } from "@/components/layout";
import { PageHeader, EmptyState } from "@/components/shared";
import { useTransactions, useBalance } from "@/lib/api/hooks";
import { api } from "@/lib/api";
import { formatCurrency } from "@/lib/utils";
import {
  Wallet,
  ArrowUpRight,
  ArrowDownRight,
  Plus,
  Search,
  Calendar,
  History,
  QrCode,
  Building2,
  Copy,
  CheckCircle2,
  Upload,
  Download,
  ShieldCheck,
  Clock,
  ChevronRight,
} from "lucide-react";
import { cn } from "@/lib/utils";

const TOPUP_AMOUNTS = [100, 300, 500, 1000, 2000, 5000];

const BANK_INFO = {
  bank: "ธนาคารกสิกรไทย",
  accountNumber: "123-4-56789-0",
  accountName: "บริษัท มีไลค์ จำกัด",
  promptpay: "080-xxx-xxxx",
};

type FilterType = "all" | "income" | "expense" | "topup";

export default function FinancePage() {
  // Use API hooks
  const { data: allTransactions = [], isLoading, refetch: refetchTransactions } = useTransactions();
  const { data: balance = 0, refetch: refetchBalance } = useBalance();

  // Topup Modal State
  const [isTopupModalOpen, setIsTopupModalOpen] = useState(false);
  const [topupAmount, setTopupAmount] = useState<number>(500);
  const [customAmount, setCustomAmount] = useState("");
  const [paymentMethod, setPaymentMethod] = useState<"promptpay" | "bank">("promptpay");
  const [topupStep, setTopupStep] = useState<"amount" | "payment" | "confirm">("amount");
  const [copied, setCopied] = useState(false);

  // Transaction Filter State
  const [searchQuery, setSearchQuery] = useState("");
  const [filter, setFilter] = useState<FilterType>("all");

  // Filter transactions
  const filteredTransactions = (allTransactions || []).filter((txn) => {
    const matchSearch =
      txn.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      txn.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchFilter = filter === "all" || txn.type === filter;
    return matchSearch && matchFilter;
  });

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleTopupSubmit = async () => {
    try {
      const amount = customAmount ? parseInt(customAmount) : topupAmount;
      
      await api.seller.createTopupTransaction({
        amount,
        method: paymentMethod,
        reference: paymentMethod === "promptpay" ? `PP${Date.now()}` : `BANK${Date.now()}`,
      });
      
      await refetchTransactions();
      await refetchBalance();
      
      setTopupStep("confirm");
    } catch (error) {
      console.error("Error creating topup transaction:", error);
      alert("เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง");
    }
  };

  const resetTopup = () => {
    setTopupStep("amount");
    setTopupAmount(500);
    setCustomAmount("");
    setIsTopupModalOpen(false);
  };

  const finalAmount = customAmount ? parseInt(customAmount) : topupAmount;

  return (
    <Container size="xl">
      <Section spacing="md" className="animate-fade-in pb-12">
        {/* Header */}
        <HStack justify="between" align="center" className="flex-col sm:flex-row gap-4">
          <PageHeader
            title="การเงิน"
            description="จัดการยอดเงิน เติมเงิน และดูประวัติธุรกรรม"
            icon={Wallet}
          />
          <Button
            variant="outline"
            className="bg-white"
            leftIcon={<Download className="w-4 h-4" />}
          >
            ส่งออก CSV
          </Button>
        </HStack>

      {/* Balance Card */}
      <Card className="p-6 bg-gradient-to-br from-brand-primary to-brand-primary/80 text-white border-none shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="p-4 bg-white/20 rounded-2xl">
              <Wallet className="w-10 h-10" />
            </div>
            <div>
              <p className="text-white/80 text-sm">ยอดเงินคงเหลือ</p>
              <p className="text-4xl font-bold">{formatCurrency(balance || 0)}</p>
            </div>
          </div>
          <Button
            onClick={() => setIsTopupModalOpen(true)}
            className="bg-white text-brand-primary hover:bg-white/90 shadow-lg"
          >
            <Plus className="w-4 h-4 mr-2" />
            เติมเงิน
          </Button>
        </div>
      </Card>

      {/* Transaction History */}
      <Card className="border-none shadow-lg overflow-hidden">
        {/* Filter Bar */}
        <div className="p-4 border-b border-brand-border/30 bg-brand-bg/30">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div className="flex items-center gap-2">
              <History className="w-5 h-5 text-brand-primary" />
              <h2 className="font-bold text-brand-text-dark">ประวัติธุรกรรม</h2>
              <Badge variant="default" size="sm">{allTransactions?.length || 0} รายการ</Badge>
            </div>

            <div className="flex items-center gap-3 w-full sm:w-auto">
              {/* Filter Tabs */}
              <Tabs
                tabs={[
                  { id: "all", label: "ทั้งหมด" },
                  { id: "income", label: "รายรับ" },
                  { id: "expense", label: "รายจ่าย" },
                  { id: "topup", label: "เติมเงิน" },
                ]}
                activeTab={filter}
                onChange={(id) => setFilter(id as FilterType)}
                variant="pills"
              />

              {/* Search */}
              <div className="relative flex-1 sm:w-48">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-brand-text-light" />
                <input
                  type="text"
                  placeholder="ค้นหา..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 rounded-lg border border-brand-border/50 text-sm focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/20 outline-none"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Transaction List */}
        <div className="divide-y divide-brand-border/30">
          {filteredTransactions.length === 0 ? (
            <EmptyState
              icon={History}
              title="ไม่พบรายการธุรกรรม"
              description="ลองเปลี่ยนคำค้นหาหรือตัวกรอง"
              className="py-12"
            />
          ) : (
            filteredTransactions.map((txn) => (
              <div
                key={txn.id}
                className="p-4 flex items-center justify-between gap-4 hover:bg-brand-bg/30 transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div
                    className={cn(
                      "w-10 h-10 rounded-xl flex items-center justify-center shrink-0",
                      txn.type === "income"
                        ? "bg-green-100 text-green-600"
                        : txn.type === "topup"
                        ? "bg-blue-100 text-blue-600"
                        : "bg-red-100 text-red-600"
                    )}
                  >
                    {txn.type === "income" ? (
                      <ArrowDownRight className="w-5 h-5" />
                    ) : txn.type === "topup" ? (
                      <Plus className="w-5 h-5" />
                    ) : (
                      <ArrowUpRight className="w-5 h-5" />
                    )}
                  </div>
                  <div>
                    <p className="font-medium text-brand-text-dark text-sm">{txn.title}</p>
                    <p className="text-xs text-brand-text-light">{txn.description}</p>
                    <p className="text-xs text-brand-text-light mt-1 flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {new Date(txn.date).toLocaleDateString("th-TH", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  </div>
                </div>

                <div className="text-right">
                  <p
                    className={cn(
                      "text-lg font-bold",
                      txn.amount > 0 ? "text-green-600" : "text-red-600"
                    )}
                  >
                    {txn.amount > 0 ? "+" : ""}
                    {formatCurrency(Math.abs(txn.amount))}
                  </p>
                  <Badge
                    variant={
                      txn.category === "order"
                        ? "success"
                        : txn.category === "payout"
                        ? "warning"
                        : txn.category === "topup"
                        ? "info"
                        : "default"
                    }
                    size="sm"
                  >
                    {txn.category === "order"
                      ? "ออเดอร์"
                      : txn.category === "payout"
                      ? "จ่ายทีม"
                      : txn.category === "topup"
                      ? "เติมเงิน"
                      : "API"}
                  </Badge>
                </div>
              </div>
            ))
          )}
        </div>
      </Card>

      {/* Topup Modal */}
      <Modal
        isOpen={isTopupModalOpen}
        onClose={resetTopup}
        title={
          topupStep === "amount"
            ? "เติมเงินเข้าระบบ"
            : topupStep === "payment"
            ? "ชำระเงิน"
            : "กำลังตรวจสอบ"
        }
        size="md"
      >
        {/* Step 1: Select Amount */}
        {topupStep === "amount" && (
          <div className="space-y-6">
            <div className="text-center p-4 bg-brand-bg/50 rounded-xl">
              <p className="text-sm text-brand-text-light">ยอดเงินปัจจุบัน</p>
              <p className="text-2xl font-bold text-brand-primary">{formatCurrency(balance || 0)}</p>
            </div>

            <div>
              <p className="font-medium text-brand-text-dark mb-3">เลือกจำนวนเงิน</p>
              <div className="grid grid-cols-3 gap-2">
                {TOPUP_AMOUNTS.map((amt) => (
                  <button
                    key={amt}
                    onClick={() => {
                      setTopupAmount(amt);
                      setCustomAmount("");
                    }}
                    className={cn(
                      "p-3 rounded-xl border transition-all text-center",
                      topupAmount === amt && !customAmount
                        ? "border-brand-primary bg-brand-primary text-white"
                        : "border-brand-border/50 hover:border-brand-primary/50"
                    )}
                  >
                    <span className="font-bold">{formatCurrency(amt)}</span>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <p className="text-sm text-brand-text-light mb-2">หรือระบุจำนวนเอง</p>
              <Input
                type="number"
                placeholder="ระบุจำนวนเงิน (฿50 - ฿100,000)"
                value={customAmount}
                onChange={(e) => setCustomAmount(e.target.value)}
                leftIcon={<span className="text-brand-text-light font-bold">฿</span>}
              />
            </div>

            <Button
              onClick={() => setTopupStep("payment")}
              disabled={!finalAmount || finalAmount < 50}
              className="w-full"
            >
              ดำเนินการต่อ <ChevronRight className="w-4 h-4 ml-1" />
            </Button>
          </div>
        )}

        {/* Step 2: Payment */}
        {topupStep === "payment" && (
          <div className="space-y-6">
            {/* Amount Summary */}
            <div className="text-center p-4 bg-brand-primary/5 rounded-xl border border-brand-primary/20">
              <p className="text-sm text-brand-text-light">จำนวนที่ต้องชำระ</p>
              <p className="text-3xl font-bold text-brand-primary">{formatCurrency(finalAmount)}</p>
            </div>

            {/* Payment Method Selection */}
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => setPaymentMethod("promptpay")}
                className={cn(
                  "p-4 rounded-xl border transition-all flex flex-col items-center gap-2",
                  paymentMethod === "promptpay"
                    ? "border-brand-primary bg-brand-primary/5"
                    : "border-brand-border/50 hover:border-brand-primary/50"
                )}
              >
                <QrCode className={cn("w-8 h-8", paymentMethod === "promptpay" ? "text-brand-primary" : "text-brand-text-light")} />
                <span className={cn("font-medium", paymentMethod === "promptpay" ? "text-brand-primary" : "text-brand-text-dark")}>
                  PromptPay
                </span>
              </button>
              <button
                onClick={() => setPaymentMethod("bank")}
                className={cn(
                  "p-4 rounded-xl border transition-all flex flex-col items-center gap-2",
                  paymentMethod === "bank"
                    ? "border-brand-primary bg-brand-primary/5"
                    : "border-brand-border/50 hover:border-brand-primary/50"
                )}
              >
                <Building2 className={cn("w-8 h-8", paymentMethod === "bank" ? "text-brand-primary" : "text-brand-text-light")} />
                <span className={cn("font-medium", paymentMethod === "bank" ? "text-brand-primary" : "text-brand-text-dark")}>
                  โอนเงิน
                </span>
              </button>
            </div>

            {/* Payment Details */}
            <div className="bg-brand-bg/50 rounded-xl p-4">
              {paymentMethod === "promptpay" ? (
                <div className="text-center space-y-3">
                  <div className="bg-white p-4 rounded-xl inline-block">
                    <QrCode className="w-32 h-32 text-brand-text-dark mx-auto" />
                  </div>
                  <div className="flex items-center justify-center gap-2">
                    <span className="font-mono text-lg font-bold">{BANK_INFO.promptpay}</span>
                    <button
                      onClick={() => handleCopy(BANK_INFO.promptpay)}
                      className="p-1.5 hover:bg-brand-bg rounded-lg text-brand-text-light hover:text-brand-primary"
                    >
                      {copied ? <CheckCircle2 className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="flex items-center gap-3 p-3 bg-white rounded-lg">
                    <div className="w-10 h-10 bg-[#00A950] rounded-full flex items-center justify-center text-white text-xs font-bold">
                      K
                    </div>
                    <div>
                      <p className="text-xs text-brand-text-light">{BANK_INFO.bank}</p>
                      <p className="font-medium text-brand-text-dark">{BANK_INFO.accountName}</p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-white rounded-lg">
                    <div>
                      <p className="text-xs text-brand-text-light">เลขที่บัญชี</p>
                      <p className="font-mono font-bold text-brand-text-dark">{BANK_INFO.accountNumber}</p>
                    </div>
                    <button
                      onClick={() => handleCopy(BANK_INFO.accountNumber.replace(/-/g, ""))}
                      className="p-2 hover:bg-brand-bg rounded-lg text-brand-text-light hover:text-brand-primary"
                    >
                      {copied ? <CheckCircle2 className="w-5 h-5 text-green-500" /> : <Copy className="w-5 h-5" />}
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Upload Slip */}
            <div className="border-2 border-dashed border-brand-border rounded-xl p-6 text-center hover:border-brand-primary/50 hover:bg-brand-primary/5 transition-all cursor-pointer">
              <Upload className="w-8 h-8 text-brand-text-light mx-auto mb-2" />
              <p className="font-medium text-brand-text-dark">อัพโหลดหลักฐานการโอน</p>
              <p className="text-xs text-brand-text-light">JPG, PNG ไม่เกิน 5MB</p>
            </div>

            <div className="flex gap-3">
              <Button variant="outline" onClick={() => setTopupStep("amount")} className="flex-1">
                ย้อนกลับ
              </Button>
              <Button onClick={handleTopupSubmit} className="flex-1">
                แจ้งชำระเงิน
              </Button>
            </div>
          </div>
        )}

        {/* Step 3: Confirmation */}
        {topupStep === "confirm" && (
          <div className="text-center space-y-6 py-4">
            <div className="w-20 h-20 bg-amber-100 rounded-full flex items-center justify-center mx-auto">
              <Clock className="w-10 h-10 text-amber-500" />
            </div>

            <div>
              <h3 className="text-xl font-bold text-brand-text-dark mb-2">กำลังตรวจสอบยอดเงิน</h3>
              <p className="text-brand-text-light">
                ระบบได้รับข้อมูลแล้ว เจ้าหน้าที่จะตรวจสอบและปรับยอดเงินให้ภายใน{" "}
                <span className="text-brand-primary font-bold">5-15 นาที</span>
              </p>
            </div>

            <div className="bg-brand-bg/50 rounded-xl p-4">
              <div className="flex justify-between text-sm mb-2">
                <span className="text-brand-text-light">จำนวนเงิน</span>
                <span className="font-bold text-brand-text-dark">{formatCurrency(finalAmount)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-brand-text-light">สถานะ</span>
                <Badge variant="warning">รอตรวจสอบ</Badge>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3 bg-blue-50 rounded-xl text-left">
              <ShieldCheck className="w-5 h-5 text-blue-500 shrink-0 mt-0.5" />
              <p className="text-xs text-brand-text-light">
                การชำระเงินของคุณปลอดภัย 100% หากมีปัญหาสามารถติดต่อ Support ได้ตลอด 24 ชม.
              </p>
            </div>

            <Button onClick={resetTopup} className="w-full">
              เสร็จสิ้น
            </Button>
          </div>
        )}
      </Modal>
      </Section>
    </Container>
  );
}
