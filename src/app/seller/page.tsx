"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuthStore } from "@/lib/store";
import { useToast } from "@/components/ui/toast";
import type { SellerRank } from "@/types";
import {
  Card,
  Badge,
  Button,
  Skeleton,
  Dialog,
} from "@/components/ui";
import { VStack } from "@/components/layout";
import {
  PlanBadge,

  ContentGuidelines,
} from "@/components/shared";
import { Checkbox } from "@/components/ui";

import { formatCurrency } from "@/lib/utils";
import { RANKS, RANK_ORDER } from "@/lib/constants/plans";
import {
  useSellerStats,
  useSellerOrders,
  useSellerTeams,
} from "@/lib/api/hooks";
import {
  DollarSign,
  ShoppingBag,
  Users,
  Star,
  ArrowRight,
  Wallet,
  Plus,
  Building2,
  Trophy,
  Briefcase,
  Check,
  Lock,
  TrendingUp,
} from "lucide-react";

export default function SellerDashboard() {
  const router = useRouter();
  const { user } = useAuthStore();
  const toast = useToast();
  const seller = user?.seller;

  const [isCreateTeamModalOpen, setIsCreateTeamModalOpen] = useState(false);
  const [isRankBenefitsOpen, setIsRankBenefitsOpen] = useState(false);
  const [newTeamName, setNewTeamName] = useState("");
  const [newTeamDescription, setNewTeamDescription] = useState("");
  const [guidelinesAccepted, setGuidelinesAccepted] = useState(false);

  const { data: stats, isLoading: statsLoading } = useSellerStats();
  const { data: orders } = useSellerOrders();
  const { data: teams, isLoading: teamsLoading } = useSellerTeams();

  const pendingOrdersCount =
    orders?.filter(
      (o: { status: string }) =>
        o.status === "pending" || o.status === "processing"
    ).length || 0;

  const handleCreateTeam = () => {
    if (!newTeamName.trim()) {
      toast.warning("กรุณาใส่ชื่อทีม");
      return;
    }
    if (!guidelinesAccepted) {
      toast.warning("กรุณายอมรับกฎและข้อห้ามก่อนสร้างทีม");
      return;
    }
    toast.success(`สร้างทีม "${newTeamName}" สำเร็จ!`);
    setIsCreateTeamModalOpen(false);
    setNewTeamName("");
    setNewTeamDescription("");
    setGuidelinesAccepted(false);
  };


  // Rank data
  const currentRank: SellerRank = seller?.sellerRank || "bronze";
  const currentRankConfig = RANKS[currentRank];
  const currentRankIndex = RANK_ORDER.indexOf(currentRank);
  const nextRank = currentRankIndex < RANK_ORDER.length - 1 ? RANK_ORDER[currentRankIndex + 1] : null;
  const nextRankConfig = nextRank ? RANKS[nextRank] : null;
  const rollingAvg = seller?.rollingAvgSpend || 0;
  const rankProgress = nextRankConfig
    ? Math.min(100, Math.round(((rollingAvg - currentRankConfig.minSpend) / (nextRankConfig.minSpend - currentRankConfig.minSpend)) * 100))
    : 100;
  const amountToNextRank = nextRankConfig ? Math.max(0, nextRankConfig.minSpend - rollingAvg) : 0;

  const teamColors = [
    "from-brand-primary to-brand-primary/70",
    "from-blue-500 to-blue-600",
    "from-purple-500 to-purple-600",
    "from-emerald-500 to-emerald-600",
  ];

  return (
    <div className="space-y-6 animate-fade-in">

      {/* ===== WELCOME HEADER ===== */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <h1 className="text-2xl font-bold text-brand-text-dark">
              สวัสดี, {seller?.displayName}
            </h1>
            <PlanBadge
              plan={seller?.plan || "free"}
              expiresAt={seller?.planExpiresAt}
            />
          </div>
          <p className="text-brand-text-light text-sm">
            ภาพรวมร้านค้าของคุณวันนี้
          </p>
        </div>
        <Link href="/seller/orders/new">
          <Button leftIcon={<Plus className="w-4 h-4" />}>สร้างออเดอร์</Button>
        </Link>
      </div>

      {/* ===== MAIN 2-COLUMN LAYOUT ===== */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* ========== LEFT COLUMN (2/3) ========== */}
        <div className="lg:col-span-2 space-y-6">

          {/* --- Stats Row (3 cards) --- */}
          {statsLoading ? (
            <div className="grid grid-cols-3 gap-3">
              {[1, 2, 3].map((i) => (
                <Card key={i} className="p-4 border-none shadow-sm">
                  <Skeleton className="h-4 w-16 mb-2" />
                  <Skeleton className="h-7 w-20" />
                </Card>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-3 gap-3">
              <Link href="/seller/finance" className="group">
                <Card className="p-4 border-none shadow-sm hover:shadow-md hover:border-brand-primary/20 transition-all h-full cursor-pointer relative overflow-hidden">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2 text-brand-text-light text-xs">
                      <div className="w-7 h-7 rounded-lg bg-emerald-100 flex items-center justify-center">
                        <DollarSign className="w-3.5 h-3.5 text-emerald-600" />
                      </div>
                      <span>รายได้เดือนนี้</span>
                    </div>
                    <ArrowRight className="w-3.5 h-3.5 text-brand-text-light/0 group-hover:text-brand-primary transition-all group-hover:translate-x-0 -translate-x-1" />
                  </div>
                  <p className="text-xl font-bold text-brand-text-dark group-hover:text-brand-primary transition-colors">
                    {formatCurrency(stats?.monthRevenue || 0)}
                  </p>
                  <p className="text-xs text-brand-text-light mt-1">เดือนนี้</p>
                </Card>
              </Link>

              <Link href="/seller/orders?status=pending" className="group">
                <Card className="p-4 border-none shadow-sm hover:shadow-md hover:border-brand-primary/20 transition-all h-full cursor-pointer relative overflow-hidden">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2 text-brand-text-light text-xs">
                      <div className="w-7 h-7 rounded-lg bg-amber-100 flex items-center justify-center">
                        <ShoppingBag className="w-3.5 h-3.5 text-amber-600" />
                      </div>
                      <span>รอดำเนินการ</span>
                    </div>
                    <ArrowRight className="w-3.5 h-3.5 text-brand-text-light/0 group-hover:text-brand-primary transition-all group-hover:translate-x-0 -translate-x-1" />
                  </div>
                  <p className="text-xl font-bold text-brand-text-dark group-hover:text-brand-primary transition-colors">
                    {pendingOrdersCount}
                  </p>
                  <p className="text-xs text-brand-text-light mt-1">ออเดอร์</p>
                </Card>
              </Link>

              <Link href="/seller/finance" className="group">
                <Card className="p-4 border-none shadow-sm hover:shadow-md hover:border-brand-primary/20 transition-all h-full cursor-pointer relative overflow-hidden">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2 text-brand-text-light text-xs">
                      <div className="w-7 h-7 rounded-lg bg-blue-100 flex items-center justify-center">
                        <Wallet className="w-3.5 h-3.5 text-blue-600" />
                      </div>
                      <span>ยอดเงิน</span>
                    </div>
                    <ArrowRight className="w-3.5 h-3.5 text-brand-text-light/0 group-hover:text-brand-primary transition-all group-hover:translate-x-0 -translate-x-1" />
                  </div>
                  <p className="text-xl font-bold text-brand-text-dark group-hover:text-brand-primary transition-colors">
                    {formatCurrency(seller?.balance || 0)}
                  </p>
                  <p className="text-xs text-brand-text-light mt-1">คงเหลือ</p>
                </Card>
              </Link>
            </div>
          )}

          {/* --- Teams Section --- */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-brand-primary/10 flex items-center justify-center">
                  <Building2 className="w-4 h-4 text-brand-primary" />
                </div>
                <h2 className="font-bold text-brand-text-dark">ทีมของคุณ</h2>
                {teams && teams.length > 0 && (
                  <Badge variant="default" size="sm">{teams.length} ทีม</Badge>
                )}
              </div>
              {teams && teams.length > 0 && (
                <Link href="/seller/team">
                  <Button variant="ghost" size="sm">
                    จัดการทั้งหมด <ArrowRight className="w-4 h-4 ml-1" />
                  </Button>
                </Link>
              )}
            </div>

            {teamsLoading ? (
              <div className="grid grid-cols-2 gap-3">
                {[1, 2].map((i) => (
                  <Card key={i} className="p-4 border-none shadow-sm">
                    <Skeleton className="w-10 h-10 rounded-xl mb-3" />
                    <Skeleton className="h-4 w-24 mb-2" />
                    <Skeleton className="h-3 w-32" />
                  </Card>
                ))}
              </div>
            ) : teams && teams.length > 0 ? (
              <div className="grid grid-cols-2 gap-3">
                {teams.slice(0, 3).map((team, index) => (
                  <Link key={team.id} href={`/seller/team/${team.id}`}>
                    <Card className="p-4 border-none shadow-sm hover:shadow-md transition-all h-full group">
                      <div className="flex items-start gap-3 mb-3">
                        <div
                          className={`w-10 h-10 rounded-xl bg-gradient-to-br ${teamColors[index % teamColors.length]} flex items-center justify-center text-white font-bold text-sm shadow-sm shrink-0`}
                        >
                          {team.name.charAt(0)}
                        </div>
                        <div className="min-w-0">
                          <p className="font-bold text-sm text-brand-text-dark group-hover:text-brand-primary transition-colors truncate">
                            {team.name}
                          </p>
                          {team.description && (
                            <p className="text-[11px] text-brand-text-light truncate">{team.description}</p>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-3 text-xs text-brand-text-light">
                        <span className="flex items-center gap-1">
                          <Users className="w-3.5 h-3.5" />
                          {team.memberCount}
                        </span>
                        <span className="flex items-center gap-1">
                          <Briefcase className="w-3.5 h-3.5" />
                          {team.activeJobCount}
                        </span>
                        <span className="flex items-center gap-1">
                          <Star className="w-3.5 h-3.5 text-amber-500" />
                          {team.rating.toFixed(1)}
                        </span>
                      </div>
                    </Card>
                  </Link>
                ))}

                <button
                  onClick={() => setIsCreateTeamModalOpen(true)}
                  className="flex flex-col items-center justify-center gap-2 p-4 rounded-2xl border-2 border-dashed border-brand-border/50 hover:border-brand-primary hover:bg-brand-primary/5 transition-all text-brand-text-light hover:text-brand-primary min-h-[110px] cursor-pointer"
                >
                  <div className="w-10 h-10 rounded-xl bg-brand-bg flex items-center justify-center">
                    <Plus className="w-5 h-5" />
                  </div>
                  <span className="text-xs font-medium">สร้างทีมใหม่</span>
                </button>
              </div>
            ) : (
              <Card className="border-none shadow-md p-8">
                <div className="flex flex-col items-center text-center max-w-md mx-auto">
                  <div className="w-16 h-16 rounded-2xl bg-brand-primary/10 flex items-center justify-center mb-4">
                    <Building2 className="w-8 h-8 text-brand-primary" />
                  </div>
                  <h3 className="text-lg font-bold text-brand-text-dark mb-2">
                    สร้างทีมเพื่อเริ่มต้น
                  </h3>
                  <p className="text-sm text-brand-text-light mb-5 leading-relaxed">
                    ทีมคือหัวใจของ MeeLike -- สร้างทีม มอบหมายงาน และบริหาร Worker ได้ที่นี่
                  </p>
                  <Button
                    onClick={() => setIsCreateTeamModalOpen(true)}
                    leftIcon={<Plus className="w-4 h-4" />}
                  >
                    สร้างทีมแรก
                  </Button>
                </div>
              </Card>
            )}
          </div>

        </div>

        {/* ========== RIGHT COLUMN (1/3) ========== */}
        <div className="space-y-6">
          {/* Seller Rank Card — Redesigned */}
          <Card className="border-none shadow-md overflow-hidden">
            {/* === Current Rank Hero === */}
            <div
              className="relative px-5 pt-5 pb-4"
              style={{
                background: `linear-gradient(135deg, ${currentRankConfig.color}20, ${currentRankConfig.color}08)`,
              }}
            >
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-[11px] font-medium text-brand-text-light uppercase tracking-wider mb-1">
                    Seller Rank ของคุณ
                  </p>
                  <div className="flex items-center gap-2">
                    <span className="text-3xl">{currentRankConfig.icon}</span>
                    <div>
                      <h3 className="text-xl font-bold text-brand-text-dark leading-tight">
                        {currentRankConfig.name}
                      </h3>
                      <p className="text-xs text-brand-text-light">
                        ค่าธรรมเนียม{" "}
                        <span className="font-bold text-brand-primary">
                          {currentRankConfig.feePercent}%
                        </span>
                      </p>
                    </div>
                  </div>
                </div>
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center"
                  style={{ backgroundColor: `${currentRankConfig.color}25` }}
                >
                  <Trophy className="w-5 h-5" style={{ color: currentRankConfig.color }} />
                </div>
              </div>
            </div>

            <div className="px-5 pb-5">
              {/* === Progress to next rank === */}
              {nextRankConfig ? (
                <div className="py-4 border-b border-brand-border/30">
                  <div className="flex items-center gap-2 mb-2.5">
                    <TrendingUp className="w-3.5 h-3.5 text-brand-primary" />
                    <p className="text-xs font-semibold text-brand-text-dark">
                      อัปเกรดเป็น {nextRankConfig.name} {nextRankConfig.icon}
                    </p>
                  </div>
                  <div className="relative">
                    <div className="flex items-center justify-between text-[11px] mb-1.5">
                      <span className="text-brand-text-light">
                        {formatCurrency(rollingAvg)}/เดือน
                      </span>
                      <span className="text-brand-text-light">
                        {formatCurrency(nextRankConfig.minSpend)}/เดือน
                      </span>
                    </div>
                    <div className="h-2.5 rounded-full bg-gray-100 overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-500"
                        style={{
                          width: `${rankProgress}%`,
                          background: `linear-gradient(90deg, ${currentRankConfig.color}, ${nextRankConfig.color})`,
                        }}
                      />
                    </div>
                    <p className="text-[11px] mt-2 text-brand-text-light">
                      เพิ่มยอดจ้างเฉลี่ยอีก{" "}
                      <span className="font-bold text-brand-primary">
                        {formatCurrency(amountToNextRank)}
                      </span>
                      {" "}→ fee ลดจาก {currentRankConfig.feePercent}% เหลือ{" "}
                      <span className="font-bold text-green-600">
                        {nextRankConfig.feePercent}%
                      </span>
                    </p>
                  </div>
                </div>
              ) : (
                <div className="py-4 border-b border-brand-border/30">
                  <div className="flex items-center gap-2 p-3 rounded-xl bg-gradient-to-r from-amber-50 to-yellow-50 border border-amber-200/50">
                    <span className="text-lg">🏆</span>
                    <div>
                      <p className="text-xs font-bold text-amber-800">ระดับสูงสุดแล้ว!</p>
                      <p className="text-[11px] text-amber-600">
                        คุณได้รับค่าธรรมเนียมต่ำสุด {currentRankConfig.feePercent}%
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* === View All Benefits Link === */}
              <button
                onClick={() => setIsRankBenefitsOpen(true)}
                className="w-full pt-3 flex items-center justify-center gap-1.5 text-xs font-medium text-brand-primary hover:text-brand-primary/80 transition-colors cursor-pointer"
              >
                ดูสิทธิประโยชน์แต่ละระดับ
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </Card>

        </div>
      </div>

      {/* ===== RANK BENEFITS DIALOG ===== */}
      <Dialog
        open={isRankBenefitsOpen}
        onClose={() => setIsRankBenefitsOpen(false)}
        size="md"
      >
        <Dialog.Header>
          <Dialog.Title>
            <div className="flex items-center gap-2">
              <Trophy className="w-5 h-5 text-amber-500" />
              สิทธิประโยชน์ Seller Rank
            </div>
          </Dialog.Title>
          <Dialog.Description>
            ยิ่งยอดจ้างเฉลี่ยต่อเดือนสูงขึ้น ค่าธรรมเนียมยิ่งลดลง
          </Dialog.Description>
        </Dialog.Header>

        <Dialog.Body>
          <div className="space-y-3">
            {RANK_ORDER.map((rank, i) => {
              const config = RANKS[rank];
              const isCurrent = rank === currentRank;
              const isUnlocked = i <= currentRankIndex;

              return (
                <div
                  key={rank}
                  className={`relative rounded-xl border-2 overflow-hidden transition-all ${
                    isCurrent
                      ? "border-brand-primary/40 shadow-md"
                      : isUnlocked
                        ? "border-brand-border/30 opacity-75"
                        : "border-dashed border-gray-200 opacity-50"
                  }`}
                >
                  {/* Current rank indicator ribbon */}
                  {isCurrent && (
                    <div className="absolute top-0 right-0 bg-brand-primary text-white text-[10px] font-bold px-3 py-0.5 rounded-bl-lg">
                      ปัจจุบัน
                    </div>
                  )}

                  {/* Header row */}
                  <div
                    className="px-4 py-3 flex items-center gap-3"
                    style={{
                      background: isCurrent
                        ? `linear-gradient(135deg, ${config.color}18, ${config.color}08)`
                        : undefined,
                    }}
                  >
                    <span className="text-2xl">{config.icon}</span>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <h4 className="font-bold text-brand-text-dark">
                          {config.name}
                        </h4>
                        <span
                          className="text-xs font-bold px-2 py-0.5 rounded-full"
                          style={{
                            backgroundColor: `${config.color}20`,
                            color: config.color === "#E5E4E2" ? "#71717a" : config.color,
                          }}
                        >
                          fee {config.feePercent}%
                        </span>
                      </div>
                      <p className="text-[11px] text-brand-text-light">
                        {i === 0
                          ? "สำหรับทุกคนที่เริ่มต้น"
                          : `ยอดจ้างเฉลี่ย ≥ ${formatCurrency(config.minSpend)}/เดือน`}
                      </p>
                    </div>
                    {/* Status icon */}
                    <div className="shrink-0">
                      {isUnlocked ? (
                        <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center">
                          <Check className="w-3.5 h-3.5 text-green-600" />
                        </div>
                      ) : (
                        <div className="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center">
                          <Lock className="w-3 h-3 text-gray-400" />
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Benefits list */}
                  <div className="px-4 pb-3 pt-0">
                    <div className="flex flex-wrap gap-x-4 gap-y-1">
                      {config.benefits.map((benefit, bi) => (
                        <span
                          key={bi}
                          className={`flex items-center gap-1.5 text-xs ${
                            isUnlocked ? "text-brand-text-dark/80" : "text-brand-text-light/60"
                          }`}
                        >
                          <Check
                            className={`w-3 h-3 shrink-0 ${
                              isUnlocked ? "text-green-500" : "text-gray-300"
                            }`}
                          />
                          {benefit}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </Dialog.Body>

        <Dialog.Footer>
          <Button onClick={() => setIsRankBenefitsOpen(false)}>
            เข้าใจแล้ว
          </Button>
        </Dialog.Footer>
      </Dialog>

      {/* ===== CREATE TEAM DIALOG ===== */}
      <Dialog
        open={isCreateTeamModalOpen}
        onClose={() => setIsCreateTeamModalOpen(false)}
        size="sm"
      >
        <Dialog.Header>
          <Dialog.Title>สร้างทีมใหม่</Dialog.Title>
          <Dialog.Description>สร้างทีมเพื่อบริหารจัดการ Worker</Dialog.Description>
        </Dialog.Header>

        <Dialog.Body>
          <VStack gap={4}>
            <div>
              <label className="block text-sm font-medium text-brand-text-dark mb-1.5">
                ชื่อทีม <span className="text-brand-error">*</span>
              </label>
              <input
                type="text"
                placeholder="เช่น TikTok Team"
                value={newTeamName}
                onChange={(e) => setNewTeamName(e.target.value)}
                className="w-full p-3 rounded-xl border border-brand-border/50 focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/20 outline-none text-sm"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-brand-text-dark mb-1.5">
                คำอธิบาย
              </label>
              <textarea
                className="w-full p-3 rounded-xl border border-brand-border/50 focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/20 outline-none resize-none text-sm"
                rows={2}
                placeholder="ทีมเฉพาะทาง TikTok"
                value={newTeamDescription}
                onChange={(e) => setNewTeamDescription(e.target.value)}
              />
            </div>

            <div className="border-t border-brand-border/50 pt-4">
              <ContentGuidelines variant="compact" />
            </div>

            <div className="flex items-start gap-3 p-4 bg-amber-50 border border-amber-200 rounded-lg">
              <Checkbox
                checked={guidelinesAccepted}
                onChange={(checked) => setGuidelinesAccepted(checked)}
                className="mt-1"
              />
              <span
                className="text-sm text-amber-800 cursor-pointer leading-relaxed"
                onClick={() => setGuidelinesAccepted(!guidelinesAccepted)}
              >
                ข้าพเจ้าได้อ่านและยอมรับกฎข้อห้ามข้างต้น
                และเข้าใจว่าในฐานะหัวหน้าทีม
                ข้าพเจ้าต้องรับผิดชอบร่วมหากสมาชิกในทีมทำผิดกฎ
              </span>
            </div>
          </VStack>
        </Dialog.Body>

        <Dialog.Footer>
          <Button
            variant="outline"
            onClick={() => setIsCreateTeamModalOpen(false)}
          >
            ยกเลิก
          </Button>
          <Button onClick={handleCreateTeam} disabled={!guidelinesAccepted}>
            สร้างทีม
          </Button>
        </Dialog.Footer>
      </Dialog>
    </div>
  );
}
