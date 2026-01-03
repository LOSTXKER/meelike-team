"use client";

import { useState } from "react";
import { Button, Card, Badge, Modal } from "@/components/ui";
import { seedAllData } from "@/lib/seed-data";
import { clearAllStorage, STORAGE_KEYS, getStorage } from "@/lib/storage";
import {
  Hammer,
  Database,
  Trash2,
  RefreshCw,
  ChevronUp,
  ChevronDown,
  X,
  Check,
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
} from "lucide-react";

export function DevTools() {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(
    null
  );

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

  const handleSeedData = async () => {
    setIsLoading(true);
    setMessage(null);

    try {
      await new Promise((resolve) => setTimeout(resolve, 500)); // Simulate delay
      seedAllData();
      setCounts(getDataCounts());
      setMessage({ type: "success", text: "✅ สร้างข้อมูลสำเร็จ! กรุณา Logout แล้ว Login ใหม่" });
    } catch (error) {
      console.error("Error seeding data:", error);
      setMessage({ type: "error", text: "❌ เกิดข้อผิดพลาด กรุณาลองใหม่" });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSeedAndReload = async () => {
    setIsLoading(true);
    setMessage(null);

    try {
      // Clear auth first
      localStorage.removeItem("meelike-auth");
      
      // Seed new data
      seedAllData();
      
      setMessage({ type: "success", text: "✅ กำลัง Reload..." });
      
      // Reload page to apply
      setTimeout(() => {
        window.location.href = "/login";
      }, 500);
    } catch (error) {
      console.error("Error:", error);
      setMessage({ type: "error", text: "❌ เกิดข้อผิดพลาด" });
      setIsLoading(false);
    }
  };

  const handleClearData = async () => {
    if (!confirm("⚠️ คุณแน่ใจหรือไม่ว่าต้องการลบข้อมูลทั้งหมด?\n\nจะถูก Logout และกลับไปหน้า Login")) {
      return;
    }

    setIsLoading(true);
    setMessage(null);

    try {
      await new Promise((resolve) => setTimeout(resolve, 300));
      
      // Clear auth storage
      localStorage.removeItem("meelike-auth");
      
      // Clear all data storage
      clearAllStorage();
      
      setCounts(getDataCounts());
      setMessage({ type: "success", text: "✅ ลบข้อมูลสำเร็จ! กำลัง Redirect..." });
      
      // Redirect to login
      setTimeout(() => {
        window.location.href = "/login";
      }, 500);
    } catch (error) {
      console.error("Error clearing data:", error);
      setMessage({ type: "error", text: "❌ เกิดข้อผิดพลาด กรุณาลองใหม่" });
      setIsLoading(false);
    }
  };

  const handleRefreshCounts = () => {
    setCounts(getDataCounts());
    setMessage({ type: "success", text: "🔄 อัปเดตจำนวนข้อมูลแล้ว" });
  };

  if (!isOpen) {
    // Floating Button - Minimized
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

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <Card className="w-80 shadow-2xl border-2 border-purple-500/20 bg-white">
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-600 to-purple-800 text-white p-4 rounded-t-xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Hammer className="w-5 h-5" />
              <h3 className="font-bold">Dev Tools</h3>
              <Badge className="bg-purple-400 text-purple-900 text-xs">DEV</Badge>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsMinimized(!isMinimized)}
                className="p-1 hover:bg-white/20 rounded-lg transition-colors"
              >
                {isMinimized ? (
                  <ChevronUp className="w-4 h-4" />
                ) : (
                  <ChevronDown className="w-4 h-4" />
                )}
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1 hover:bg-white/20 rounded-lg transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Content */}
        {!isMinimized && (
          <div className="p-4 space-y-4">
            {/* Message */}
            {message && (
              <div
                className={`p-3 rounded-lg text-sm font-medium animate-fade-in ${
                  message.type === "success"
                    ? "bg-green-50 text-green-800 border border-green-200"
                    : "bg-red-50 text-red-800 border border-red-200"
                }`}
              >
                {message.text}
              </div>
            )}

            {/* Data Counts */}
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs text-brand-text-light">
                <span>ข้อมูลในระบบ</span>
                <button
                  onClick={handleRefreshCounts}
                  className="text-brand-primary hover:text-brand-primary-dark"
                  title="รีเฟรช"
                >
                  <RefreshCw className="w-3 h-3" />
                </button>
              </div>
              
              {/* Seller Section */}
              <div className="space-y-1.5">
                <p className="text-[10px] font-semibold text-brand-primary uppercase tracking-wider">📦 Seller</p>
                <div className="grid grid-cols-2 gap-1.5">
                  <DataCountItem icon={<UserCircle className="w-3 h-3" />} label="Sellers" count={counts.sellers} />
                  <DataCountItem icon={<Package className="w-3 h-3" />} label="Services" count={counts.services} />
                  <DataCountItem icon={<ShoppingBag className="w-3 h-3" />} label="Orders" count={counts.orders} />
                  <DataCountItem icon={<DollarSign className="w-3 h-3" />} label="Transactions" count={counts.transactions} />
                </div>
              </div>
              
              {/* Team Section */}
              <div className="space-y-1.5">
                <p className="text-[10px] font-semibold text-amber-600 uppercase tracking-wider">👥 Team</p>
                <div className="grid grid-cols-2 gap-1.5">
                  <DataCountItem icon={<Users className="w-3 h-3" />} label="Teams" count={counts.teams} />
                  <DataCountItem icon={<UserCheck className="w-3 h-3" />} label="Members" count={counts.teamMembers} />
                  <DataCountItem icon={<ClipboardList className="w-3 h-3" />} label="Jobs" count={counts.teamJobs} />
                  <DataCountItem icon={<ShieldCheck className="w-3 h-3" />} label="Claims" count={counts.jobClaims} />
                  <DataCountItem icon={<Wallet className="w-3 h-3" />} label="Payouts" count={counts.payouts} />
                </div>
              </div>
              
              {/* Worker/Hub Section */}
              <div className="space-y-1.5">
                <p className="text-[10px] font-semibold text-emerald-600 uppercase tracking-wider">🌐 Worker & Hub</p>
                <div className="grid grid-cols-2 gap-1.5">
                  <DataCountItem icon={<Briefcase className="w-3 h-3" />} label="Workers" count={counts.workers} />
                  <DataCountItem icon={<Globe className="w-3 h-3" />} label="Hub Posts" count={counts.hubPosts} />
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="space-y-2 pt-2 border-t border-brand-border/30">
              <Button
                onClick={handleSeedAndReload}
                isLoading={isLoading}
                leftIcon={<RotateCcw className="w-4 h-4" />}
                className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white shadow-md"
              >
                🚀 Seed & Re-Login
              </Button>

              <Button
                onClick={handleSeedData}
                isLoading={isLoading}
                leftIcon={<Database className="w-4 h-4" />}
                variant="outline"
                className="w-full border-green-300 text-green-600 hover:bg-green-50 hover:border-green-400"
              >
                Seed Only
              </Button>

              <Button
                onClick={handleClearData}
                isLoading={isLoading}
                leftIcon={<Trash2 className="w-4 h-4" />}
                variant="outline"
                className="w-full border-red-300 text-red-600 hover:bg-red-50 hover:border-red-400"
              >
                Clear All & Logout
              </Button>
            </div>

            {/* Info */}
            <p className="text-xs text-brand-text-light text-center pt-2 border-t border-brand-border/30">
              🚀 Development Tools Only
            </p>
          </div>
        )}
      </Card>
    </div>
  );
}

interface DataCountItemProps {
  icon: React.ReactNode;
  label: string;
  count: number;
}

function DataCountItem({ icon, label, count }: DataCountItemProps) {
  return (
    <div className="flex items-center gap-2 px-2 py-1.5 bg-brand-bg rounded-lg">
      <div className="text-brand-text-light">{icon}</div>
      <div className="flex-1 min-w-0">
        <p className="text-[10px] text-brand-text-light truncate">{label}</p>
        <p className="text-sm font-bold text-brand-text-dark">{count}</p>
      </div>
    </div>
  );
}
