"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Card, Badge, Button, Input, Modal } from "@/components/ui";
import { PageHeader, EmptyState } from "@/components/shared";
import { useTeamPayouts, useWorkerBalances, useWorkers, useSellerTeams } from "@/lib/api/hooks";
import type { TeamPayout } from "@/types";
import {
  ArrowLeft,
  DollarSign,
  Search,
  Clock,
  CheckCircle2,
  User,
  Wallet,
  Send,
  AlertCircle,
  CreditCard,
  Download,
  LayoutGrid,
  CheckCircle,
  History,
  Building2,
} from "lucide-react";

type FilterStatus = "all" | "pending" | "completed";

export default function TeamPayoutsPage() {
  const searchParams = useSearchParams();
  const teamIdParam = searchParams.get("team");
  
  // Use API hooks
  const { data: teams, isLoading: isLoadingTeams } = useSellerTeams();
  const { data: teamPayoutsData, isLoading: isLoadingPayouts } = useTeamPayouts();
  const { data: workerBalancesData, isLoading: isLoadingBalances } = useWorkerBalances();
  const { data: workersData, isLoading: isLoadingWorkers } = useWorkers();

  const [payouts, setPayouts] = useState<TeamPayout[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState<FilterStatus>("all");
  const [selectedPayout, setSelectedPayout] = useState<TeamPayout | null>(null);
  const [showPayModal, setShowPayModal] = useState(false);
  const [initialized, setInitialized] = useState(false);
  const [selectedTeamId, setSelectedTeamId] = useState(teamIdParam || "all"); // "all" = ทุกทีม
  
  // Current team or "all"
  const currentTeam = useMemo(() => {
    if (selectedTeamId === "all") return null;
    return teams?.find((t) => t.id === selectedTeamId);
  }, [teams, selectedTeamId]);

  // Initialize payouts from API data
  if (teamPayoutsData && !initialized) {
    setPayouts(teamPayoutsData);
    setInitialized(true);
  }

  const workerBalances = workerBalancesData || [];
  const workers = workersData || [];

  // Enrich payouts with team info (mock)
  const payoutsWithTeam = useMemo(() => {
    return payouts.map((payout, index) => {
      // Mock team assignment - in real app would come from payout.teamId
      const teamId = index % 2 === 0 ? "team-1" : "team-2";
      const team = teams?.find(t => t.id === teamId);
      return {
        ...payout,
        teamId,
        teamName: team?.name || "Unknown Team",
      };
    });
  }, [payouts, teams]);

  const filteredPayouts = payoutsWithTeam.filter((payout) => {
    const matchSearch = payout.worker.displayName
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchStatus =
      filterStatus === "all" || payout.status === filterStatus;
    const matchTeam =
      selectedTeamId === "all" || payout.teamId === selectedTeamId;
    return matchSearch && matchStatus && matchTeam;
  });

  const pendingPayouts = payouts.filter((p) => p.status === "pending");
  const totalPending = pendingPayouts.reduce((sum, p) => sum + p.amount, 0);

  const handleProcessPayout = () => {
    if (selectedPayout) {
      setPayouts(
        payouts.map((p) =>
          p.id === selectedPayout.id
            ? {
                ...p,
                status: "completed" as const,
                completedAt: new Date().toISOString(),
                transactionRef: `TXN-${Date.now()}`,
              }
            : p
        )
      );
      setShowPayModal(false);
      setSelectedPayout(null);
      alert(`โอนเงิน ฿${selectedPayout.amount} ให้ @${selectedPayout.worker.displayName} เรียบร้อย!`);
    }
  };

  if (isLoadingTeams || isLoadingPayouts || isLoadingBalances || isLoadingWorkers) {
    return <div className="p-8 text-center text-brand-text-light">กำลังโหลด...</div>;
  }

  return (
    <div className="space-y-8 animate-fade-in max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Link href="/seller/team">
            <button className="p-2.5 hover:bg-white hover:shadow-sm rounded-xl transition-all border border-transparent hover:border-brand-border/50 text-brand-text-light hover:text-brand-primary">
              <ArrowLeft className="w-5 h-5" />
            </button>
          </Link>
          <PageHeader
            title="จ่ายเงินรวม"
            description={selectedTeamId === "all" ? "จัดการการจ่ายเงินของทุกทีม" : `จัดการการจ่ายเงินของทีม ${currentTeam?.name || ""}`}
            icon={DollarSign}
          />
        </div>
        
        {/* Team Filter */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 bg-white px-3 py-2 rounded-xl border border-brand-border/50 shadow-sm">
            <Building2 className="w-4 h-4 text-brand-primary" />
            <select
              value={selectedTeamId}
              onChange={(e) => setSelectedTeamId(e.target.value)}
              className="bg-transparent text-sm font-medium text-brand-text-dark focus:outline-none cursor-pointer min-w-[140px]"
            >
              <option value="all">💰 ทุกทีม</option>
              {teams?.map((team) => (
                <option key={team.id} value={team.id}>
                  {team.name}
                </option>
              ))}
            </select>
          </div>
        </div>

      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card variant="elevated" className="border-none shadow-lg shadow-brand-primary/5 hover:-translate-y-1 transition-transform">
           <div className="flex flex-col items-center justify-center p-2 text-center">
             <div className="w-10 h-10 rounded-xl bg-brand-warning/10 flex items-center justify-center text-brand-warning mb-2">
               <Clock className="w-5 h-5" />
             </div>
             <p className="text-2xl font-bold text-brand-warning">{pendingPayouts.length}</p>
             <p className="text-sm text-brand-text-light">รายการรอจ่าย</p>
           </div>
        </Card>
        <Card variant="elevated" className="border-none shadow-lg shadow-brand-primary/5 hover:-translate-y-1 transition-transform">
           <div className="flex flex-col items-center justify-center p-2 text-center">
             <div className="w-10 h-10 rounded-xl bg-brand-error/10 flex items-center justify-center text-brand-error mb-2">
               <Wallet className="w-5 h-5" />
             </div>
             <p className="text-2xl font-bold text-brand-error">฿{totalPending.toLocaleString()}</p>
             <p className="text-sm text-brand-text-light">ยอดเงินค้างจ่าย</p>
           </div>
        </Card>
        <Card variant="elevated" className="border-none shadow-lg shadow-brand-primary/5 hover:-translate-y-1 transition-transform">
           <div className="flex flex-col items-center justify-center p-2 text-center">
             <div className="w-10 h-10 rounded-xl bg-brand-success/10 flex items-center justify-center text-brand-success mb-2">
               <CheckCircle2 className="w-5 h-5" />
             </div>
             <p className="text-2xl font-bold text-brand-success">
                ฿{payouts
                  .filter((p) => p.status === "completed")
                  .reduce((sum, p) => sum + p.amount, 0)
                  .toLocaleString()}
             </p>
             <p className="text-sm text-brand-text-light">จ่ายแล้ว (รวม)</p>
           </div>
        </Card>
        <Card variant="elevated" className="border-none shadow-lg shadow-brand-primary/5 hover:-translate-y-1 transition-transform">
           <div className="flex flex-col items-center justify-center p-2 text-center">
             <div className="w-10 h-10 rounded-xl bg-brand-primary/10 flex items-center justify-center text-brand-primary mb-2">
               <User className="w-5 h-5" />
             </div>
             <p className="text-2xl font-bold text-brand-primary">{workers.length}</p>
             <p className="text-sm text-brand-text-light">Worker ทั้งหมด</p>
           </div>
        </Card>
      </div>

      {/* Pending Alert - Modern Style */}
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
              onClick={() => {
                if (confirm(`จ่ายเงินทั้งหมด ${pendingPayouts.length} รายการ รวม ฿${totalPending}?`)) {
                  setPayouts(
                    payouts.map((p) =>
                      p.status === "pending"
                        ? {
                            ...p,
                            status: "completed" as const,
                            completedAt: new Date().toISOString(),
                            transactionRef: `TXN-${Date.now()}-${p.id}`,
                          }
                        : p
                    )
                  );
                  alert("จ่ายเงินทั้งหมดเรียบร้อย!");
                }
              }}
              className="bg-[#B06000] hover:bg-[#8F4D00] text-white border-transparent shadow-md shadow-[#B06000]/20 rounded-xl px-6"
            >
              <Send className="w-4 h-4 mr-2" />
              จ่ายเงินทั้งหมด
            </Button>
        </div>
      )}

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left: Worker Balances List */}
        <div className="lg:col-span-1 space-y-4">
           <h3 className="font-bold text-lg text-brand-text-dark flex items-center gap-2">
              <Wallet className="w-5 h-5 text-brand-primary" />
              ยอดเงินสะสม Worker
           </h3>
           <div className="bg-white rounded-2xl border border-brand-border/50 shadow-sm overflow-hidden">
             <div className="max-h-[500px] overflow-y-auto divide-y divide-brand-border/30">
                {workerBalances.map((wb) => (
                    <div
                      key={wb.worker.id}
                      className="flex items-center justify-between p-4 hover:bg-brand-bg/50 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-brand-primary/10 rounded-full flex items-center justify-center text-brand-primary text-sm font-bold border border-brand-primary/20">
                          {wb.worker.displayName.charAt(0)}
                        </div>
                        <div>
                          <p className="font-bold text-sm text-brand-text-dark">@{wb.worker.displayName}</p>
                          <div className="flex items-center gap-1.5 mt-0.5">
                             <Badge variant="success" size="sm" className="px-1.5 py-0 text-[10px] h-4">{wb.worker.level}</Badge>
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-xs text-brand-text-light mb-0.5">ยอดถอนได้</p>
                        <p className="text-base font-bold text-brand-success">฿{wb.availableBalance.toLocaleString()}</p>
                      </div>
                    </div>
                ))}
             </div>
           </div>
        </div>

        {/* Right: Payout History */}
        <div className="lg:col-span-2 space-y-4">
           {/* Filter & Search */}
           <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-4 rounded-2xl shadow-sm border border-brand-border/50">
             <div className="flex items-center gap-3 w-full sm:w-auto overflow-x-auto no-scrollbar">
                <div className="flex gap-1 p-1.5 bg-brand-bg/50 rounded-xl border border-brand-border/30 min-w-max">
                  {[
                    { key: "all", label: "ทั้งหมด", icon: LayoutGrid },
                    { key: "pending", label: "รอจ่าย", icon: Clock },
                    { key: "completed", label: "จ่ายแล้ว", icon: CheckCircle },
                  ].map((f) => (
                    <button
                      key={f.key}
                      onClick={() => setFilterStatus(f.key as FilterStatus)}
                      className={`flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 whitespace-nowrap ${
                        filterStatus === f.key
                          ? "bg-white text-brand-text-dark shadow-sm ring-1 ring-black/5"
                          : "text-brand-text-light hover:text-brand-text-dark opacity-70 hover:opacity-100"
                      }`}
                    >
                      <f.icon className={`w-4 h-4 ${filterStatus === f.key ? "text-brand-primary" : ""}`} />
                      <span>{f.label}</span>
                    </button>
                  ))}
                </div>
             </div>
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

           {/* List */}
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
             <div className="divide-y divide-brand-border/30">
                {filteredPayouts.length === 0 ? (
                    <EmptyState 
                        icon={DollarSign} 
                        title="ไม่พบรายการจ่ายเงิน" 
                        description="ยังไม่มีประวัติการจ่ายเงินในขณะนี้"
                        className="py-12"
                    />
                ) : (
                    filteredPayouts.map((payout) => (
                      <div
                        key={payout.id}
                        className="p-5 hover:bg-brand-bg/30 transition-colors"
                      >
                        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                          <div className="flex items-start gap-4">
                             <div className="w-12 h-12 bg-white border border-brand-border/50 shadow-sm rounded-xl flex items-center justify-center text-brand-primary shrink-0">
                                <DollarSign className="w-6 h-6" />
                             </div>
                             <div>
                                <div className="flex items-center gap-2">
                                   <p className="font-bold text-brand-text-dark text-lg">@{payout.worker.displayName}</p>
                                   {selectedTeamId === "all" && (
                                     <Badge variant="secondary" size="sm" className="gap-1">
                                        <Building2 className="w-3 h-3" />
                                        {payout.teamName}
                                     </Badge>
                                   )}
                                   {payout.status === "completed" && (
                                     <Badge variant="success" size="sm" className="gap-1 border-none bg-brand-success/10 text-brand-success">
                                        <CheckCircle2 className="w-3 h-3" /> จ่ายแล้ว
                                     </Badge>
                                   )}
                                   {payout.status === "pending" && (
                                     <Badge variant="warning" size="sm" className="gap-1 border-none bg-brand-warning/10 text-brand-warning">
                                        <Clock className="w-3 h-3" /> รอจ่าย
                                     </Badge>
                                   )}
                                </div>
                                <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-brand-text-light mt-1">
                                   <span className="flex items-center gap-1.5">
                                      <LayoutGrid className="w-3.5 h-3.5" />
                                      {payout.jobCount} งาน
                                   </span>
                                   <span className="flex items-center gap-1.5">
                                      <CreditCard className="w-3.5 h-3.5" />
                                      {payout.paymentMethod === "promptpay" ? "PromptPay" : payout.bankName}
                                      <span className="font-mono text-xs bg-brand-bg px-1.5 py-0.5 rounded ml-1">{payout.paymentAccount}</span>
                                   </span>
                                </div>
                                {payout.status === "completed" && payout.completedAt && (
                                  <p className="text-xs text-brand-text-light/70 mt-1 font-mono">
                                     Ref: {payout.transactionRef} • {new Date(payout.completedAt).toLocaleDateString("th-TH")}
                                  </p>
                                )}
                             </div>
                          </div>
                          
                          <div className="flex flex-row sm:flex-col items-center sm:items-end justify-between w-full sm:w-auto gap-4">
                             <div className="text-right">
                                <p className="text-sm text-brand-text-light">ยอดโอนสุทธิ</p>
                                <p className="text-2xl font-bold text-brand-success">฿{payout.amount.toLocaleString()}</p>
                             </div>
                             
                             {payout.status === "pending" && (
                               <Button
                                 size="sm"
                                 className="rounded-lg shadow-lg shadow-brand-primary/20 bg-brand-primary hover:bg-brand-primary-dark"
                                 onClick={() => {
                                   setSelectedPayout(payout);
                                   setShowPayModal(true);
                                 }}
                               >
                                 <Send className="w-4 h-4 mr-1.5" />
                                 แจ้งโอนเงิน
                               </Button>
                             )}
                          </div>
                        </div>
                      </div>
                    ))
                )}
             </div>
           </div>
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
