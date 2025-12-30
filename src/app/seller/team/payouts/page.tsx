"use client";

import { useState } from "react";
import Link from "next/link";
import { Card, Badge, Button, Input, Modal } from "@/components/ui";
import { PageHeader } from "@/components/shared";
import { mockWorkers, mockTeam } from "@/lib/mock-data";
import {
  ArrowLeft,
  DollarSign,
  Search,
  Filter,
  Clock,
  CheckCircle2,
  User,
  Calendar,
  Wallet,
  Send,
  AlertCircle,
  CreditCard,
  Download,
  Star,
  TrendingUp,
} from "lucide-react";

// Mock payout data
const mockPayouts = [
  {
    id: "payout-1",
    workerId: "worker-1",
    worker: mockWorkers[0],
    amount: 250,
    jobCount: 15,
    status: "pending",
    requestedAt: new Date(Date.now() - 86400000).toISOString(),
    paymentMethod: "promptpay",
    paymentAccount: "0811111111",
  },
  {
    id: "payout-2",
    workerId: "worker-2",
    worker: mockWorkers[1],
    amount: 180,
    jobCount: 12,
    status: "pending",
    requestedAt: new Date(Date.now() - 172800000).toISOString(),
    paymentMethod: "bank",
    bankName: "กรุงไทย",
    paymentAccount: "987-6-54321-0",
    accountName: "นางสาว มิ้นท์ สดใส",
  },
  {
    id: "payout-3",
    workerId: "worker-1",
    worker: mockWorkers[0],
    amount: 450,
    jobCount: 28,
    status: "completed",
    requestedAt: new Date(Date.now() - 604800000).toISOString(),
    completedAt: new Date(Date.now() - 518400000).toISOString(),
    paymentMethod: "promptpay",
    paymentAccount: "0811111111",
    transactionRef: "TXN-20241223-001",
  },
  {
    id: "payout-4",
    workerId: "worker-2",
    worker: mockWorkers[1],
    amount: 320,
    jobCount: 20,
    status: "completed",
    requestedAt: new Date(Date.now() - 1209600000).toISOString(),
    completedAt: new Date(Date.now() - 1123200000).toISOString(),
    paymentMethod: "bank",
    bankName: "กรุงไทย",
    paymentAccount: "987-6-54321-0",
    accountName: "นางสาว มิ้นท์ สดใส",
    transactionRef: "TXN-20241216-002",
  },
  {
    id: "payout-5",
    workerId: "worker-3",
    worker: mockWorkers[2],
    amount: 95,
    jobCount: 8,
    status: "completed",
    requestedAt: new Date(Date.now() - 1814400000).toISOString(),
    completedAt: new Date(Date.now() - 1728000000).toISOString(),
    paymentMethod: "promptpay",
    paymentAccount: "0833333333",
    transactionRef: "TXN-20241209-003",
  },
];

// Worker balances
const workerBalances = mockWorkers.map((worker) => ({
  worker,
  pendingBalance: worker.pendingBalance || 0,
  availableBalance: worker.availableBalance || 0,
  totalEarned: worker.totalEarned || 0,
}));

type FilterStatus = "all" | "pending" | "completed";

export default function TeamPayoutsPage() {
  const [payouts, setPayouts] = useState(mockPayouts);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState<FilterStatus>("all");
  const [selectedPayout, setSelectedPayout] = useState<typeof mockPayouts[0] | null>(null);
  const [showPayModal, setShowPayModal] = useState(false);

  const filteredPayouts = payouts.filter((payout) => {
    const matchSearch = payout.worker.displayName
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchStatus =
      filterStatus === "all" || payout.status === filterStatus;
    return matchSearch && matchStatus;
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
                status: "completed",
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

  return (
    <div className="space-y-6">
      {/* Header */}
      <PageHeader
        title="จ่ายเงินทีม"
        description="จัดการการจ่ายเงินให้ Worker"
        icon={DollarSign}
        actions={
          <Link href="/seller/team">
            <Button variant="outline" size="sm">
              <ArrowLeft className="w-4 h-4 mr-2" />
              กลับ
            </Button>
          </Link>
        }
      />

      {/* Summary Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card variant="bordered" padding="md">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-brand-warning/10 rounded-lg flex items-center justify-center">
              <Clock className="w-5 h-5 text-brand-warning" />
            </div>
            <div>
              <p className="text-sm text-brand-text-light">รอจ่าย</p>
              <p className="text-xl font-bold text-brand-warning">
                {pendingPayouts.length}
              </p>
            </div>
          </div>
        </Card>
        <Card variant="bordered" padding="md">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-brand-error/10 rounded-lg flex items-center justify-center">
              <Wallet className="w-5 h-5 text-brand-error" />
            </div>
            <div>
              <p className="text-sm text-brand-text-light">ยอดค้างจ่าย</p>
              <p className="text-xl font-bold text-brand-error">
                ฿{totalPending.toLocaleString()}
              </p>
            </div>
          </div>
        </Card>
        <Card variant="bordered" padding="md">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-brand-success/10 rounded-lg flex items-center justify-center">
              <CheckCircle2 className="w-5 h-5 text-brand-success" />
            </div>
            <div>
              <p className="text-sm text-brand-text-light">จ่ายแล้ว (เดือนนี้)</p>
              <p className="text-xl font-bold text-brand-success">
                ฿{payouts
                  .filter((p) => p.status === "completed")
                  .reduce((sum, p) => sum + p.amount, 0)
                  .toLocaleString()}
              </p>
            </div>
          </div>
        </Card>
        <Card variant="bordered" padding="md">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-brand-primary/10 rounded-lg flex items-center justify-center">
              <User className="w-5 h-5 text-brand-primary" />
            </div>
            <div>
              <p className="text-sm text-brand-text-light">Worker ทั้งหมด</p>
              <p className="text-xl font-bold text-brand-primary">
                {mockWorkers.length}
              </p>
            </div>
          </div>
        </Card>
      </div>

      {/* Pending Alert */}
      {pendingPayouts.length > 0 && (
        <Card variant="bordered" padding="md" className="bg-brand-warning/5 border-brand-warning">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <AlertCircle className="w-5 h-5 text-brand-warning" />
              <div>
                <p className="font-medium text-brand-text-dark">
                  มี {pendingPayouts.length} รายการรอจ่ายเงิน
                </p>
                <p className="text-sm text-brand-text-light">
                  รวม ฿{totalPending.toLocaleString()}
                </p>
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
                            status: "completed",
                            completedAt: new Date().toISOString(),
                            transactionRef: `TXN-${Date.now()}-${p.id}`,
                          }
                        : p
                    )
                  );
                  alert("จ่ายเงินทั้งหมดเรียบร้อย!");
                }
              }}
            >
              <Send className="w-4 h-4 mr-2" />
              จ่ายทั้งหมด
            </Button>
          </div>
        </Card>
      )}

      {/* Worker Balances */}
      <Card variant="bordered" padding="lg">
        <h2 className="font-semibold text-brand-text-dark mb-4">
          ยอดเงินสะสม Worker
        </h2>
        <div className="space-y-3">
          {workerBalances.map((wb) => (
            <div
              key={wb.worker.id}
              className="flex items-center justify-between p-3 bg-brand-bg rounded-lg"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-brand-primary/10 rounded-full flex items-center justify-center">
                  <User className="w-5 h-5 text-brand-primary" />
                </div>
                <div>
                  <p className="font-medium text-brand-text-dark">
                    @{wb.worker.displayName}
                  </p>
                  <div className="flex items-center gap-2 text-sm text-brand-text-light">
                    <span className="flex items-center gap-1">
                      <Star className="w-3 h-3 text-brand-warning" />
                      {wb.worker.rating}
                    </span>
                    <span>•</span>
                    <Badge variant="success" size="sm">
                      {wb.worker.level}
                    </Badge>
                  </div>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm text-brand-text-light">ยอดถอนได้</p>
                <p className="text-lg font-bold text-brand-success">
                  ฿{wb.availableBalance.toLocaleString()}
                </p>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Filters */}
      <Card variant="bordered" padding="md">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <Input
              placeholder="ค้นหา Worker..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              leftIcon={<Search className="w-4 h-4" />}
            />
          </div>
          <div className="flex gap-2">
            {[
              { key: "all", label: "ทั้งหมด" },
              { key: "pending", label: "รอจ่าย" },
              { key: "completed", label: "จ่ายแล้ว" },
            ].map((f) => (
              <button
                key={f.key}
                onClick={() => setFilterStatus(f.key as FilterStatus)}
                className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all ${
                  filterStatus === f.key
                    ? "bg-brand-primary text-white"
                    : "bg-brand-bg text-brand-text-light hover:text-brand-text-dark"
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>
      </Card>

      {/* Payouts List */}
      <Card variant="bordered">
        <div className="p-4 border-b border-brand-border">
          <h3 className="font-semibold text-brand-text-dark">
            ประวัติการจ่ายเงิน
          </h3>
        </div>
        <div className="divide-y divide-brand-border">
          {filteredPayouts.length === 0 ? (
            <div className="p-8 text-center">
              <DollarSign className="w-12 h-12 text-brand-text-light mx-auto mb-3" />
              <p className="text-brand-text-light">ไม่พบรายการ</p>
            </div>
          ) : (
            filteredPayouts.map((payout) => (
              <div
                key={payout.id}
                className="p-4 hover:bg-brand-bg/50 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-brand-primary/10 rounded-full flex items-center justify-center">
                      <User className="w-6 h-6 text-brand-primary" />
                    </div>
                    <div>
                      <p className="font-semibold text-brand-text-dark">
                        @{payout.worker.displayName}
                      </p>
                      <div className="flex items-center gap-3 text-sm text-brand-text-light">
                        <span>{payout.jobCount} งาน</span>
                        <span>•</span>
                        <span className="flex items-center gap-1">
                          {payout.paymentMethod === "promptpay" ? (
                            <>
                              <CreditCard className="w-3 h-3" />
                              PromptPay {payout.paymentAccount}
                            </>
                          ) : (
                            <>
                              <CreditCard className="w-3 h-3" />
                              {payout.bankName} {payout.paymentAccount}
                            </>
                          )}
                        </span>
                      </div>
                      {payout.status === "completed" && payout.transactionRef && (
                        <p className="text-xs text-brand-text-light mt-1">
                          Ref: {payout.transactionRef}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="text-right space-y-2">
                    <p className="text-xl font-bold text-brand-success">
                      ฿{payout.amount.toLocaleString()}
                    </p>
                    {payout.status === "pending" ? (
                      <Button
                        size="sm"
                        onClick={() => {
                          setSelectedPayout(payout);
                          setShowPayModal(true);
                        }}
                      >
                        <Send className="w-4 h-4 mr-1" />
                        จ่ายเงิน
                      </Button>
                    ) : (
                      <Badge variant="success" size="sm">
                        <CheckCircle2 className="w-3 h-3 mr-1" />
                        จ่ายแล้ว
                      </Badge>
                    )}
                    <p className="text-xs text-brand-text-light">
                      {payout.status === "completed" && payout.completedAt
                        ? new Date(payout.completedAt).toLocaleDateString("th-TH", {
                            day: "numeric",
                            month: "short",
                            year: "2-digit",
                          })
                        : new Date(payout.requestedAt).toLocaleDateString("th-TH", {
                            day: "numeric",
                            month: "short",
                            year: "2-digit",
                          })}
                    </p>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </Card>

      {/* Export Button */}
      <div className="flex justify-end">
        <Button variant="outline">
          <Download className="w-4 h-4 mr-2" />
          ส่งออกรายงาน
        </Button>
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
          <div className="space-y-4">
            <div className="p-4 bg-brand-success/10 rounded-lg space-y-3">
              <div className="flex justify-between">
                <span className="text-brand-text-light">Worker</span>
                <span className="font-medium text-brand-text-dark">
                  @{selectedPayout.worker.displayName}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-brand-text-light">จำนวนงาน</span>
                <span className="text-brand-text-dark">{selectedPayout.jobCount} งาน</span>
              </div>
              <div className="flex justify-between">
                <span className="text-brand-text-light">ช่องทาง</span>
                <span className="text-brand-text-dark">
                  {selectedPayout.paymentMethod === "promptpay"
                    ? `PromptPay ${selectedPayout.paymentAccount}`
                    : `${selectedPayout.bankName} ${selectedPayout.paymentAccount}`}
                </span>
              </div>
              <div className="flex justify-between pt-2 border-t border-brand-border">
                <span className="text-brand-text-light">ยอดโอน</span>
                <span className="text-xl font-bold text-brand-success">
                  ฿{selectedPayout.amount.toLocaleString()}
                </span>
              </div>
            </div>

            <p className="text-sm text-brand-text-light">
              กรุณาตรวจสอบข้อมูลก่อนดำเนินการจ่ายเงิน
            </p>

            <div className="flex gap-3 justify-end">
              <Button
                variant="outline"
                onClick={() => {
                  setShowPayModal(false);
                  setSelectedPayout(null);
                }}
              >
                ยกเลิก
              </Button>
              <Button onClick={handleProcessPayout}>
                <Send className="w-4 h-4 mr-2" />
                ยืนยันจ่ายเงิน
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}


