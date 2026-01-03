"use client";

import { useState, useMemo } from "react";
import { useParams } from "next/navigation";
import { Card, Badge, Button, Input, Skeleton, Modal } from "@/components/ui";
import { EmptyState, FilterTabs, Breadcrumb, type PayoutFilterStatus } from "@/components/shared";
import { useTeamPayouts, useWorkerBalances, useWorkers, useSellerTeams } from "@/lib/api/hooks";
import { api } from "@/lib/api";
import type { TeamPayout } from "@/types";
import {
  DollarSign,
  Search,
  Clock,
  CheckCircle2,
  Send,
  AlertCircle,
  CreditCard,
  LayoutGrid,
  History,
  Users,
  Wallet,
} from "lucide-react";

export default function TeamPayoutsPage() {
  const params = useParams();
  const teamId = params.id as string;
  
  // Use API hooks
  const { data: teams, isLoading: isLoadingTeams } = useSellerTeams();
  const { data: teamPayoutsData, isLoading: isLoadingPayouts, refetch: refetchPayouts } = useTeamPayouts();
  const { data: workerBalancesData, isLoading: isLoadingBalances } = useWorkerBalances();
  const { data: workersData, isLoading: isLoadingWorkers } = useWorkers();

  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState<PayoutFilterStatus>("all");
  const [selectedPayout, setSelectedPayout] = useState<TeamPayout | null>(null);
  const [showPayModal, setShowPayModal] = useState(false);
  
  const currentTeam = useMemo(() => {
    return teams?.find((t) => t.id === teamId);
  }, [teams, teamId]);

  const workerBalances = workerBalancesData || [];
  const workers = workersData || [];
  // Filter out payouts with missing worker data (corrupted/incomplete)
  const payouts = (teamPayoutsData || []).filter(p => p.worker && p.worker.displayName);

  const filteredPayouts = payouts.filter((payout) => {
    const matchSearch = (payout.worker?.displayName || "")
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchStatus =
      filterStatus === "all" || payout.status === filterStatus;
    return matchSearch && matchStatus;
  });

  const pendingPayouts = payouts.filter((p) => p.status === "pending");
  const totalPending = pendingPayouts.reduce((sum, p) => sum + p.amount, 0);

  const handleProcessPayout = async () => {
    if (!selectedPayout) return;
    
    try {
      await api.seller.processTeamPayout(selectedPayout.id);
      await refetchPayouts();
      setShowPayModal(false);
      setSelectedPayout(null);
      alert(`โอนเงิน ฿${selectedPayout.amount} ให้ @${selectedPayout.worker.displayName} เรียบร้อย!`);
    } catch (error) {
      console.error("Error processing payout:", error);
      alert("เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง");
    }
  };

  if (isLoadingTeams || isLoadingPayouts || isLoadingBalances || isLoadingWorkers) {
    return (
      <div className="space-y-8 animate-fade-in max-w-7xl mx-auto">
        <Skeleton className="h-16 w-full rounded-xl" />
        <div className="grid grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-24 rounded-xl" />
          ))}
        </div>
        <Skeleton className="h-64 rounded-xl" />
      </div>
    );
  }

  const completedAmount = payouts.filter((p) => p.status === "completed").reduce((sum, p) => sum + p.amount, 0);

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Breadcrumb */}
      <Breadcrumb />

      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center">
          <DollarSign className="w-5 h-5 text-emerald-600" />
        </div>
        <div>
          <h1 className="text-xl font-bold text-brand-text-dark">จ่ายเงินลูกทีม</h1>
          <p className="text-sm text-brand-text-light">จัดการการจ่ายเงินของทีม {currentTeam?.name || ""}</p>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-4 border-none shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center">
              <Clock className="w-5 h-5 text-amber-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-brand-text-dark">{pendingPayouts.length}</p>
              <p className="text-xs text-brand-text-light">รายการรอจ่าย</p>
            </div>
          </div>
        </Card>
        <Card className="p-4 border-none shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-red-100 flex items-center justify-center">
              <Wallet className="w-5 h-5 text-red-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-red-600">฿{totalPending.toLocaleString()}</p>
              <p className="text-xs text-brand-text-light">ยอดเงินค้างจ่าย</p>
            </div>
          </div>
        </Card>
        <Card className="p-4 border-none shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center">
              <CheckCircle2 className="w-5 h-5 text-emerald-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-emerald-600">฿{completedAmount.toLocaleString()}</p>
              <p className="text-xs text-brand-text-light">จ่ายไปแล้ว</p>
            </div>
          </div>
        </Card>
        <Card className="p-4 border-none shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center">
              <Users className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-brand-text-dark">{workers.length}</p>
              <p className="text-xs text-brand-text-light">Worker ทั้งหมด</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Pending Alert */}
      {pendingPayouts.length > 0 && (
        <div className="bg-[#FEF7E0] border border-[#FEEFC3] rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-sm animate-pulse-soft">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-[#FFFBF0] rounded-full text-[#B06000]">
                 <AlertCircle className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-bold text-[#B06000] text-lg">มี {pendingPayouts.length} รายการรอจ่ายเงิน</h3>
                <p className="text-[#B06000]/80 text-sm">รวมยอดเงินทั้งหมด ฿{totalPending.toLocaleString()}</p>
              </div>
            </div>
            <Button
              onClick={async () => {
                if (confirm(`จ่ายเงินทั้งหมด ${pendingPayouts.length} รายการ รวม ฿${totalPending}?`)) {
                  try {
                    const count = await api.seller.processAllPendingPayouts();
                    await refetchPayouts();
                    alert(`จ่ายเงิน ${count} รายการเรียบร้อย!`);
                  } catch (error) {
                    console.error("Error processing payouts:", error);
                    alert("เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง");
                  }
                }
              }}
              className="bg-[#B06000] hover:bg-[#8F4D00] text-white border-transparent shadow-md shadow-[#B06000]/20 rounded-xl px-6"
            >
              <Send className="w-4 h-4 mr-2" />
              จ่ายเงินทั้งหมด
            </Button>
        </div>
      )}

      {/* Payout History */}
      <div className="space-y-4">
           {/* Filter & Search */}
           <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-4 rounded-2xl shadow-sm border border-brand-border/50">
             <FilterTabs
               tabs={[
                 { value: "all" as const, label: "ทั้งหมด" },
                 { value: "pending" as const, label: "รอจ่าย" },
                 { value: "completed" as const, label: "จ่ายแล้ว" },
               ]}
               value={filterStatus}
               onChange={setFilterStatus}
               showCount={false}
             />
             <div className="w-full sm:w-auto sm:min-w-[240px]">
                <Input
                  placeholder="ค้นหา..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full border-brand-border/50 bg-brand-bg/50 focus:bg-white !py-2.5 !rounded-xl"
                  leftIcon={<Search className="w-4 h-4 text-brand-text-light" />}
                />
             </div>
           </div>

           {/* Table */}
           <div className="bg-white rounded-2xl shadow-sm border border-brand-border/50 overflow-hidden">
             <div className="p-4 bg-brand-bg/30 border-b border-brand-border/30 flex items-center justify-between">
                <h3 className="font-bold text-brand-text-dark flex items-center gap-2">
                   <History className="w-4 h-4 text-brand-text-light" />
                   ประวัติการจ่ายเงิน
                </h3>
                <span className="text-xs text-brand-text-light bg-white px-2 py-1 rounded-lg border border-brand-border/30">
                   {filteredPayouts.length} รายการ
                </span>
             </div>
             
             {filteredPayouts.length === 0 ? (
                <EmptyState 
                    icon={DollarSign} 
                    title="ไม่พบรายการจ่ายเงิน" 
                    description="ยังไม่มีประวัติการจ่ายเงินในขณะนี้"
                    className="py-12"
                />
             ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-brand-bg/30 border-b border-brand-border/30">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-semibold text-brand-text-light uppercase tracking-wider">Worker</th>
                        <th className="px-6 py-3 text-left text-xs font-semibold text-brand-text-light uppercase tracking-wider">จำนวนงาน</th>
                        <th className="px-6 py-3 text-left text-xs font-semibold text-brand-text-light uppercase tracking-wider">ช่องทางโอน</th>
                        <th className="px-6 py-3 text-right text-xs font-semibold text-brand-text-light uppercase tracking-wider">ยอดเงิน</th>
                        <th className="px-6 py-3 text-center text-xs font-semibold text-brand-text-light uppercase tracking-wider">สถานะ</th>
                        <th className="px-6 py-3 text-right text-xs font-semibold text-brand-text-light uppercase tracking-wider">การดำเนินการ</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-brand-border/30">
                      {filteredPayouts.map((payout) => (
                        <tr key={payout.id} className="hover:bg-brand-bg/30 transition-colors">
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 bg-brand-secondary rounded-full flex items-center justify-center text-sm font-bold text-brand-primary">
                                {payout.worker?.displayName?.charAt(0) || 'U'}
                              </div>
                              <div>
                                <p className="font-bold text-sm text-brand-text-dark">
                                  @{payout.worker?.displayName || 'Unknown Worker'}
                                </p>
                                {payout.status === "completed" && payout.completedAt && (
                                  <p className="text-xs text-brand-text-light">
                                    {new Date(payout.completedAt).toLocaleDateString("th-TH", {
                                      day: "numeric",
                                      month: "short",
                                      year: "numeric"
                                    })}
                                  </p>
                                )}
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <span className="inline-flex items-center gap-1.5 text-sm font-medium text-brand-text-dark">
                              <LayoutGrid className="w-4 h-4 text-brand-text-light" />
                              {payout.jobCount} งาน
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <div className="space-y-1">
                              <p className="text-sm font-medium text-brand-text-dark flex items-center gap-1.5">
                                <CreditCard className="w-4 h-4 text-brand-text-light" />
                                {payout.paymentMethod === "promptpay" ? "PromptPay" : payout.bankName}
                              </p>
                              <p className="text-xs font-mono text-brand-text-light bg-brand-bg/50 px-2 py-0.5 rounded w-fit">
                                {payout.paymentAccount}
                              </p>
                              {payout.status === "completed" && payout.transactionRef && (
                                <p className="text-xs text-brand-text-light/70 font-mono">
                                  Ref: {payout.transactionRef}
                                </p>
                              )}
                            </div>
                          </td>
                          <td className="px-6 py-4 text-right">
                            <div>
                              <p className="text-xl font-bold text-brand-success">
                                ฿{payout.amount.toLocaleString()}
                              </p>
                              <p className="text-xs text-brand-text-light">ยอดโอนสุทธิ</p>
                            </div>
                          </td>
                          <td className="px-6 py-4 text-center">
                            {payout.status === "completed" && (
                              <Badge variant="success" size="sm" className="gap-1">
                                <CheckCircle2 className="w-3 h-3" /> จ่ายแล้ว
                              </Badge>
                            )}
                            {payout.status === "pending" && (
                              <Badge variant="warning" size="sm" className="gap-1">
                                <Clock className="w-3 h-3" /> รอจ่าย
                              </Badge>
                            )}
                          </td>
                          <td className="px-6 py-4 text-right">
                            {payout.status === "pending" && (
                              <Button
                                size="sm"
                                className="rounded-lg shadow-md"
                                onClick={() => {
                                  setSelectedPayout(payout);
                                  setShowPayModal(true);
                                }}
                              >
                                <Send className="w-4 h-4 mr-1.5" />
                                แจ้งโอนเงิน
                              </Button>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
             )}
           </div>
      </div>

      {/* Pay Modal */}
      <Modal
        isOpen={showPayModal}
        onClose={() => {
          setShowPayModal(false);
          setSelectedPayout(null);
        }}
        title="ยืนยันการจ่ายเงิน"
      >
        {selectedPayout && (
          <div className="space-y-6">
            <div className="flex items-center gap-4 p-4 bg-brand-success/5 border border-brand-success/20 rounded-xl">
               <div className="p-3 bg-brand-success/10 rounded-full text-brand-success">
                  <Wallet className="w-6 h-6" />
               </div>
               <div>
                  <h4 className="font-bold text-brand-text-dark">โอนเงินให้ Worker</h4>
                  <p className="text-sm text-brand-text-light">กรุณาตรวจสอบข้อมูลก่อนโอนเงิน</p>
               </div>
            </div>

            <div className="space-y-4 bg-brand-bg/50 p-5 rounded-xl border border-brand-border/30">
               <div className="flex justify-between items-center">
                  <span className="text-brand-text-light text-sm">ผู้รับเงิน</span>
                  <div className="text-right">
                     <p className="font-bold text-brand-text-dark">@{selectedPayout.worker.displayName}</p>
                     <p className="text-xs text-brand-text-light">{selectedPayout.jobCount} งานที่ทำเสร็จ</p>
                  </div>
               </div>
               
               <div className="h-px bg-brand-border/50"></div>
               
               <div>
                  <span className="text-brand-text-light text-sm block mb-1">ช่องทางโอนเงิน</span>
                  <div className="flex items-center gap-3 p-3 bg-white rounded-lg border border-brand-border/30">
                     <CreditCard className="w-5 h-5 text-brand-primary" />
                     <div>
                        <p className="font-medium text-brand-text-dark text-sm">
                           {selectedPayout.paymentMethod === "promptpay" ? "PromptPay" : selectedPayout.bankName}
                        </p>
                        <p className="font-mono text-sm text-brand-text-light">{selectedPayout.paymentAccount}</p>
                        {selectedPayout.accountName && <p className="text-xs text-brand-text-light/70">{selectedPayout.accountName}</p>}
                     </div>
                  </div>
               </div>
               
               <div className="flex justify-between items-end pt-2">
                  <span className="text-brand-text-light">ยอดโอนสุทธิ</span>
                  <span className="text-2xl font-bold text-brand-success">฿{selectedPayout.amount.toLocaleString()}</span>
               </div>
            </div>

            <div className="flex gap-3 justify-end pt-2">
              <Button
                variant="outline"
                onClick={() => {
                  setShowPayModal(false);
                  setSelectedPayout(null);
                }}
                className="flex-1"
              >
                ยกเลิก
              </Button>
              <Button onClick={handleProcessPayout} className="flex-1 bg-brand-success hover:bg-brand-success/90 shadow-lg shadow-brand-success/20 border-transparent">
                <Send className="w-4 h-4 mr-2" />
                ยืนยันโอนเงิน
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
