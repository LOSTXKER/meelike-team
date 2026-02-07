"use client";

import { useState, useCallback } from "react";
import { Button, Card, Badge } from "@/components/ui";
import { seedAllData } from "@/lib/seed-data";
import { clearAllStorage, STORAGE_KEYS, getStorage, setStorage } from "@/lib/storage";
import { useAuthStore } from "@/lib/store";
import type { Transaction } from "@/lib/api";
import type { KYCLevel, SubscriptionPlan, SellerRank, Seller } from "@/types";
import { DEFAULT_KYC_DATA } from "@/types/kyc";
import {
  Hammer,
  Database,
  Trash2,
  RefreshCw,
  ChevronUp,
  ChevronDown,
  X,
  Package,
  ShoppingBag,
  Users,
  Briefcase,
  DollarSign,
  Globe,
  UserCircle,
  RotateCcw,
  ClipboardList,
  UserCheck,
  Wallet,
  ShieldCheck,
  Shield,
  Crown,
  ArrowLeftRight,
  Timer,
  Plus,
  Minus,
} from "lucide-react";

// Only render in development
const IS_DEV = process.env.NODE_ENV === "development";

// Global mock delay (accessible from storage-helpers)
const DELAY_STORAGE_KEY = "meelike_dev_mock_delay";

export function DevTools() {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<"data" | "user" | "config">("data");
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  const { user, setUser } = useAuthStore();

  // Mock delay from localStorage
  const [mockDelay, setMockDelay] = useState(() => {
    if (typeof window === "undefined") return 300;
    const stored = localStorage.getItem(DELAY_STORAGE_KEY);
    return stored ? parseInt(stored) : 300;
  });

  // Get data counts
  const getDataCounts = () => {
    return {
      sellers: getStorage(STORAGE_KEYS.SELLERS, []).length,
      services: getStorage(STORAGE_KEYS.SERVICES, []).length,
      orders: getStorage(STORAGE_KEYS.ORDERS, []).length,
      teams: getStorage(STORAGE_KEYS.TEAMS, []).length,
      teamMembers: getStorage(STORAGE_KEYS.TEAM_MEMBERS, []).length,
      teamJobs: getStorage(STORAGE_KEYS.TEAM_JOBS, []).length,
      jobClaims: getStorage(STORAGE_KEYS.JOB_CLAIMS, []).length,
      payouts: getStorage(STORAGE_KEYS.PAYOUTS, []).length,
      transactions: getStorage(STORAGE_KEYS.TRANSACTIONS, []).length,
      hubPosts: getStorage(STORAGE_KEYS.HUB_POSTS, []).length,
      workers: getStorage(STORAGE_KEYS.WORKERS, []).length,
    };
  };

  const [counts, setCounts] = useState(getDataCounts());

  // ===== DATA ACTIONS =====

  const handleSeedAndReload = async () => {
    setIsLoading(true);
    setMessage(null);
    try {
      localStorage.removeItem("meelike-auth");
      seedAllData();
      setMessage({ type: "success", text: "Seed complete. Reloading..." });
      setTimeout(() => {
        window.location.href = "/login";
      }, 500);
    } catch (error) {
      console.error("Error:", error);
      setMessage({ type: "error", text: "Error seeding data" });
      setIsLoading(false);
    }
  };

  const handleSeedData = async () => {
    setIsLoading(true);
    setMessage(null);
    try {
      await new Promise((resolve) => setTimeout(resolve, 500));
      seedAllData();
      setCounts(getDataCounts());
      setMessage({ type: "success", text: "Seed complete! Re-login to apply." });
    } catch (error) {
      console.error("Error seeding data:", error);
      setMessage({ type: "error", text: "Error seeding data" });
    } finally {
      setIsLoading(false);
    }
  };

  const handleClearData = async () => {
    if (!confirm("Clear all data and logout?")) return;
    setIsLoading(true);
    try {
      localStorage.removeItem("meelike-auth");
      clearAllStorage();
      setCounts(getDataCounts());
      setMessage({ type: "success", text: "Cleared. Redirecting..." });
      setTimeout(() => {
        window.location.href = "/login";
      }, 500);
    } catch (error) {
      console.error("Error:", error);
      setMessage({ type: "error", text: "Error clearing data" });
      setIsLoading(false);
    }
  };

  // ===== USER/KYC ACTIONS =====

  const updateSellerField = useCallback(
    (patch: Partial<Seller>) => {
      if (!user?.seller) return;

      // Update in auth store
      const updatedSeller = { ...user.seller, ...patch };
      setUser({ ...user, seller: updatedSeller });

      // Update in localStorage
      const sellers = getStorage<Seller[]>(STORAGE_KEYS.SELLERS, []);
      const idx = sellers.findIndex((s) => s.id === user.seller!.id);
      if (idx !== -1) {
        sellers[idx] = { ...sellers[idx], ...patch };
        setStorage(STORAGE_KEYS.SELLERS, sellers);
      }
    },
    [user, setUser]
  );

  const handleSetKYCLevel = (level: KYCLevel) => {
    if (!user?.seller) return;
    const kyc = user.seller.kyc || { ...DEFAULT_KYC_DATA };
    updateSellerField({
      kyc: {
        ...kyc,
        level,
        status: level === "none" ? "pending" : "approved",
      },
    });
    setMessage({ type: "success", text: `KYC: ${level}` });
  };

  const handleSetPlan = (plan: SubscriptionPlan) => {
    updateSellerField({ plan, subscription: plan });
    setMessage({ type: "success", text: `Plan: ${plan}` });
  };

  const handleSetRank = (rank: SellerRank) => {
    const feeMap: Record<SellerRank, number> = {
      bronze: 15,
      silver: 12,
      gold: 10,
      platinum: 9,
    };
    updateSellerField({
      sellerRank: rank,
      platformFeePercent: feeMap[rank],
    });
    setMessage({ type: "success", text: `Rank: ${rank} (${feeMap[rank]}%)` });
  };

  const handleSwitchRole = (role: "seller" | "worker" | "admin") => {
    localStorage.removeItem("meelike-auth");
    // Switch role by redirecting to login with pre-selected role
    window.location.href = `/login?role=${role}`;
  };

  const handleAdjustBalance = (amount: number) => {
    if (!user?.seller) return;
    const newBalance = Math.max(0, (user.seller.balance || 0) + amount);
    updateSellerField({ balance: newBalance });

    // Also add a transaction record
    const transactions = getStorage<Transaction[]>(STORAGE_KEYS.TRANSACTIONS, []);
    const newTxn: Transaction = {
      id: `txn-dev-${Date.now()}`,
      type: amount > 0 ? "topup" : "expense",
      category: amount > 0 ? "topup" : "fee",
      title: `[DEV] ${amount > 0 ? "+" : ""}${amount.toLocaleString()}`,
      description: "DevTools balance adjustment",
      amount,
      date: new Date().toISOString(),
    };
    transactions.unshift(newTxn);
    setStorage(STORAGE_KEYS.TRANSACTIONS, transactions);

    setMessage({
      type: "success",
      text: `Balance: ${newBalance.toLocaleString()}`,
    });
  };

  // ===== CONFIG ACTIONS =====

  const handleSetDelay = (ms: number) => {
    setMockDelay(ms);
    localStorage.setItem(DELAY_STORAGE_KEY, String(ms));
    setMessage({ type: "success", text: `Mock delay: ${ms}ms` });
  };

  // Don't render in production
  if (!IS_DEV) return null;

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 z-50 w-14 h-14 bg-gradient-to-br from-purple-600 to-purple-800 text-white rounded-full shadow-2xl hover:shadow-purple-500/50 hover:scale-110 transition-all duration-300 flex items-center justify-center group"
        title="Dev Tools"
      >
        <Hammer className="w-6 h-6 group-hover:rotate-12 transition-transform" />
        <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full animate-pulse" />
      </button>
    );
  }

  const currentKYC = user?.seller?.kyc?.level || "none";
  const currentPlan = user?.seller?.plan || "free";
  const currentRank = user?.seller?.sellerRank || "bronze";
  const currentBalance = user?.seller?.balance || 0;
  const currentRole = user?.role || "---";

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <Card className="w-80 shadow-2xl border-2 border-purple-500/20 bg-white max-h-[85vh] flex flex-col">
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-600 to-purple-800 text-white p-3 rounded-t-xl flex-shrink-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Hammer className="w-4 h-4" />
              <h3 className="font-bold text-sm">Dev Tools</h3>
              <Badge className="bg-purple-400 text-purple-900 text-[10px] px-1.5 py-0">
                DEV
              </Badge>
            </div>
            <div className="flex items-center gap-1">
              <button
                onClick={() => setIsMinimized(!isMinimized)}
                className="p-1 hover:bg-white/20 rounded transition-colors"
              >
                {isMinimized ? (
                  <ChevronUp className="w-4 h-4" />
                ) : (
                  <ChevronDown className="w-4 h-4" />
                )}
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1 hover:bg-white/20 rounded transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Quick Info Bar */}
          {!isMinimized && (
            <div className="mt-2 flex items-center gap-2 text-[10px] text-purple-200 flex-wrap">
              <span className="bg-white/10 px-1.5 py-0.5 rounded">{currentRole}</span>
              <span className="bg-white/10 px-1.5 py-0.5 rounded">KYC:{currentKYC}</span>
              <span className="bg-white/10 px-1.5 py-0.5 rounded">{currentPlan}</span>
              <span className="bg-white/10 px-1.5 py-0.5 rounded">{currentRank}</span>
            </div>
          )}
        </div>

        {/* Content */}
        {!isMinimized && (
          <div className="flex-1 overflow-y-auto">
            {/* Tabs */}
            <div className="flex border-b border-gray-200 bg-gray-50 sticky top-0">
              {(["data", "user", "config"] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`flex-1 py-2 text-xs font-medium transition-colors ${
                    activeTab === tab
                      ? "text-purple-700 border-b-2 border-purple-600 bg-white"
                      : "text-gray-500 hover:text-gray-700"
                  }`}
                >
                  {tab === "data" ? "Data" : tab === "user" ? "User" : "Config"}
                </button>
              ))}
            </div>

            {/* Message */}
            {message && (
              <div
                className={`mx-3 mt-2 p-2 rounded text-xs font-medium ${
                  message.type === "success"
                    ? "bg-green-50 text-green-700 border border-green-200"
                    : "bg-red-50 text-red-700 border border-red-200"
                }`}
              >
                {message.text}
              </div>
            )}

            <div className="p-3 space-y-3">
              {/* ===== DATA TAB ===== */}
              {activeTab === "data" && (
                <>
                  {/* Data Counts */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <span>Storage Data</span>
                      <button
                        onClick={() => setCounts(getDataCounts())}
                        className="text-purple-600 hover:text-purple-700"
                      >
                        <RefreshCw className="w-3 h-3" />
                      </button>
                    </div>

                    <div className="space-y-1.5">
                      <p className="text-[10px] font-semibold text-purple-600 uppercase tracking-wider">
                        Seller
                      </p>
                      <div className="grid grid-cols-2 gap-1">
                        <CountItem icon={<UserCircle className="w-3 h-3" />} label="Sellers" count={counts.sellers} />
                        <CountItem icon={<Package className="w-3 h-3" />} label="Services" count={counts.services} />
                        <CountItem icon={<ShoppingBag className="w-3 h-3" />} label="Orders" count={counts.orders} />
                        <CountItem icon={<DollarSign className="w-3 h-3" />} label="Txn" count={counts.transactions} />
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <p className="text-[10px] font-semibold text-amber-600 uppercase tracking-wider">
                        Team
                      </p>
                      <div className="grid grid-cols-2 gap-1">
                        <CountItem icon={<Users className="w-3 h-3" />} label="Teams" count={counts.teams} />
                        <CountItem icon={<UserCheck className="w-3 h-3" />} label="Members" count={counts.teamMembers} />
                        <CountItem icon={<ClipboardList className="w-3 h-3" />} label="Jobs" count={counts.teamJobs} />
                        <CountItem icon={<ShieldCheck className="w-3 h-3" />} label="Claims" count={counts.jobClaims} />
                        <CountItem icon={<Wallet className="w-3 h-3" />} label="Payouts" count={counts.payouts} />
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <p className="text-[10px] font-semibold text-emerald-600 uppercase tracking-wider">
                        Worker & Hub
                      </p>
                      <div className="grid grid-cols-2 gap-1">
                        <CountItem icon={<Briefcase className="w-3 h-3" />} label="Workers" count={counts.workers} />
                        <CountItem icon={<Globe className="w-3 h-3" />} label="Posts" count={counts.hubPosts} />
                      </div>
                    </div>
                  </div>

                  {/* Data Actions */}
                  <div className="space-y-1.5 pt-2 border-t">
                    <Button
                      onClick={handleSeedAndReload}
                      isLoading={isLoading}
                      leftIcon={<RotateCcw className="w-3.5 h-3.5" />}
                      size="sm"
                      className="w-full bg-blue-600 hover:bg-blue-700 text-white text-xs"
                    >
                      Seed & Re-Login
                    </Button>
                    <Button
                      onClick={handleSeedData}
                      isLoading={isLoading}
                      leftIcon={<Database className="w-3.5 h-3.5" />}
                      variant="outline"
                      size="sm"
                      className="w-full text-xs"
                    >
                      Seed Only
                    </Button>
                    <Button
                      onClick={handleClearData}
                      isLoading={isLoading}
                      leftIcon={<Trash2 className="w-3.5 h-3.5" />}
                      variant="outline"
                      size="sm"
                      className="w-full border-red-300 text-red-600 hover:bg-red-50 text-xs"
                    >
                      Clear All & Logout
                    </Button>
                  </div>
                </>
              )}

              {/* ===== USER TAB ===== */}
              {activeTab === "user" && (
                <>
                  {/* Switch Role */}
                  <Section icon={<ArrowLeftRight className="w-3.5 h-3.5" />} title="Switch Role">
                    <div className="flex gap-1">
                      {(["seller", "worker", "admin"] as const).map((role) => (
                        <ToggleBtn
                          key={role}
                          active={currentRole === role}
                          onClick={() => handleSwitchRole(role)}
                        >
                          {role}
                        </ToggleBtn>
                      ))}
                    </div>
                  </Section>

                  {/* KYC Level */}
                  <Section icon={<Shield className="w-3.5 h-3.5" />} title="KYC Level">
                    <div className="grid grid-cols-2 gap-1">
                      {(["none", "basic", "verified", "business"] as KYCLevel[]).map(
                        (level) => (
                          <ToggleBtn
                            key={level}
                            active={currentKYC === level}
                            onClick={() => handleSetKYCLevel(level)}
                          >
                            {level}
                          </ToggleBtn>
                        )
                      )}
                    </div>
                  </Section>

                  {/* Plan */}
                  <Section icon={<Crown className="w-3.5 h-3.5" />} title="Subscription Plan">
                    <div className="grid grid-cols-2 gap-1">
                      {(["free", "basic", "pro", "business"] as SubscriptionPlan[]).map(
                        (plan) => (
                          <ToggleBtn
                            key={plan}
                            active={currentPlan === plan}
                            onClick={() => handleSetPlan(plan)}
                          >
                            {plan}
                          </ToggleBtn>
                        )
                      )}
                    </div>
                  </Section>

                  {/* Seller Rank */}
                  <Section icon={<ShieldCheck className="w-3.5 h-3.5" />} title="Seller Rank">
                    <div className="grid grid-cols-2 gap-1">
                      {(["bronze", "silver", "gold", "platinum"] as SellerRank[]).map(
                        (rank) => (
                          <ToggleBtn
                            key={rank}
                            active={currentRank === rank}
                            onClick={() => handleSetRank(rank)}
                          >
                            {rank}
                          </ToggleBtn>
                        )
                      )}
                    </div>
                  </Section>

                  {/* Balance */}
                  <Section icon={<Wallet className="w-3.5 h-3.5" />} title={`Balance: ${currentBalance.toLocaleString()}`}>
                    <div className="flex gap-1">
                      {[1000, 5000, 10000, 50000].map((amt) => (
                        <button
                          key={amt}
                          onClick={() => handleAdjustBalance(amt)}
                          className="flex-1 flex items-center justify-center gap-0.5 px-1.5 py-1.5 bg-green-50 hover:bg-green-100 text-green-700 rounded text-[10px] font-medium border border-green-200 transition-colors"
                        >
                          <Plus className="w-2.5 h-2.5" />
                          {amt >= 1000 ? `${amt / 1000}k` : amt}
                        </button>
                      ))}
                    </div>
                    <div className="flex gap-1 mt-1">
                      {[1000, 5000, 10000, 50000].map((amt) => (
                        <button
                          key={amt}
                          onClick={() => handleAdjustBalance(-amt)}
                          className="flex-1 flex items-center justify-center gap-0.5 px-1.5 py-1.5 bg-red-50 hover:bg-red-100 text-red-700 rounded text-[10px] font-medium border border-red-200 transition-colors"
                        >
                          <Minus className="w-2.5 h-2.5" />
                          {amt >= 1000 ? `${amt / 1000}k` : amt}
                        </button>
                      ))}
                    </div>
                  </Section>
                </>
              )}

              {/* ===== CONFIG TAB ===== */}
              {activeTab === "config" && (
                <>
                  {/* Mock Delay */}
                  <Section icon={<Timer className="w-3.5 h-3.5" />} title={`Mock Delay: ${mockDelay}ms`}>
                    <input
                      type="range"
                      min={0}
                      max={3000}
                      step={100}
                      value={mockDelay}
                      onChange={(e) => handleSetDelay(parseInt(e.target.value))}
                      className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-purple-600"
                    />
                    <div className="flex justify-between text-[10px] text-gray-400 mt-1">
                      <span>0ms</span>
                      <span>1.5s</span>
                      <span>3s</span>
                    </div>
                    <div className="flex gap-1 mt-2">
                      {[0, 100, 300, 500, 1000, 2000].map((ms) => (
                        <ToggleBtn
                          key={ms}
                          active={mockDelay === ms}
                          onClick={() => handleSetDelay(ms)}
                        >
                          {ms === 0 ? "0" : ms < 1000 ? `${ms}` : `${ms / 1000}s`}
                        </ToggleBtn>
                      ))}
                    </div>
                  </Section>

                  {/* Info */}
                  <div className="text-[10px] text-gray-400 space-y-1 pt-2 border-t">
                    <p>Mock delay affects all API calls via localStorage.</p>
                    <p>Changes to User tab apply immediately to the current session.</p>
                    <p>Seed data resets all storage. Re-login required for role changes.</p>
                  </div>
                </>
              )}
            </div>
          </div>
        )}
      </Card>
    </div>
  );
}

// ===== SUB-COMPONENTS =====

function CountItem({
  icon,
  label,
  count,
}: {
  icon: React.ReactNode;
  label: string;
  count: number;
}) {
  return (
    <div className="flex items-center gap-1.5 px-2 py-1 bg-gray-50 rounded text-[10px]">
      <div className="text-gray-400">{icon}</div>
      <span className="text-gray-500 truncate">{label}</span>
      <span className="ml-auto font-bold text-gray-700">{count}</span>
    </div>
  );
}

function Section({
  icon,
  title,
  children,
}: {
  icon: React.ReactNode;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-1.5">
      <div className="flex items-center gap-1.5 text-xs font-medium text-gray-700">
        <span className="text-purple-500">{icon}</span>
        {title}
      </div>
      {children}
    </div>
  );
}

function ToggleBtn({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className={`flex-1 px-2 py-1.5 rounded text-[10px] font-medium border transition-all ${
        active
          ? "bg-purple-600 text-white border-purple-600 shadow-sm"
          : "bg-white text-gray-600 border-gray-200 hover:border-purple-300 hover:bg-purple-50"
      }`}
    >
      {children}
    </button>
  );
}
