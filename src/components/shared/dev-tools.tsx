"use client";

import { useState, useEffect, useRef } from "react";
import { Settings, X, Database, RefreshCw, LogIn, BarChart2, ExternalLink, ChevronDown, ChevronUp, Loader2 } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { useToastStore } from "@/components/ui/toast";
import { cn } from "@/lib/utils";

// ──────────────────────────────────────────────
// TYPES
// ──────────────────────────────────────────────

type DbStats = Record<string, number>;

type QuickLoginRole = "seller" | "worker";

// ──────────────────────────────────────────────
// HELPERS
// ──────────────────────────────────────────────

async function devPost(path: string): Promise<{ ok: boolean; message?: string }> {
  const res = await fetch(path, { method: "POST" });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error ?? `HTTP ${res.status}`);
  return data as { ok: boolean; message?: string };
}

async function devGet(path: string) {
  const res = await fetch(path);
  const data = await res.json();
  if (!res.ok) throw new Error(data.error ?? `HTTP ${res.status}`);
  return data;
}

// ──────────────────────────────────────────────
// SECTION WRAPPER
// ──────────────────────────────────────────────

function Section({
  title,
  children,
  collapsible = false,
}: {
  title: string;
  children: React.ReactNode;
  collapsible?: boolean;
}) {
  const [open, setOpen] = useState(true);
  return (
    <div className="border-t border-white/10 pt-3 mt-3 first:border-t-0 first:pt-0 first:mt-0">
      <button
        className="flex w-full items-center justify-between text-xs font-semibold text-white/50 uppercase tracking-widest mb-2 hover:text-white/70 transition-colors"
        onClick={() => collapsible && setOpen((v) => !v)}
      >
        {title}
        {collapsible && (open ? <ChevronUp size={12} /> : <ChevronDown size={12} />)}
      </button>
      {(!collapsible || open) && children}
    </div>
  );
}

// ──────────────────────────────────────────────
// ACTION BUTTON
// ──────────────────────────────────────────────

function ActionBtn({
  onClick,
  loading,
  children,
  variant = "default",
}: {
  onClick: () => void;
  loading?: boolean;
  children: React.ReactNode;
  variant?: "default" | "danger" | "success";
}) {
  const styles = {
    default: "bg-white/10 hover:bg-white/20 text-white",
    danger: "bg-red-500/20 hover:bg-red-500/30 text-red-300",
    success: "bg-green-500/20 hover:bg-green-500/30 text-green-300",
  };
  return (
    <button
      onClick={onClick}
      disabled={loading}
      className={cn(
        "flex items-center gap-2 w-full px-3 py-2 rounded-lg text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed",
        styles[variant]
      )}
    >
      {loading ? <Loader2 size={14} className="animate-spin flex-shrink-0" /> : null}
      {children}
    </button>
  );
}

// ──────────────────────────────────────────────
// MAIN COMPONENT
// ──────────────────────────────────────────────

export function DevTools() {
  if (process.env.NODE_ENV !== "development") return null;

  return <DevToolsPanel />;
}

function DevToolsPanel() {
  // Use the store directly so we get stable function references
  const addToast = useToastStore((s) => s.add);
  const [open, setOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState<{ email: string; role?: string } | null>(null);

  // DB Stats
  const [stats, setStats] = useState<DbStats | null>(null);
  const [statsLoading, setStatsLoading] = useState(false);

  // Action loading states
  const [seedLoading, setSeedLoading] = useState(false);
  const [resetLoading, setResetLoading] = useState(false);
  const [loginLoading, setLoginLoading] = useState<QuickLoginRole | null>(null);

  // Keep addToast in a ref so fetchStats doesn't need it as a dep
  const addToastRef = useRef(addToast);
  useEffect(() => { addToastRef.current = addToast; }, [addToast]);

  // Fetch current user from Supabase
  useEffect(() => {
    if (!open) return;
    const supabase = createClient();
    supabase.auth.getUser().then(({ data }) => {
      if (data.user) {
        setCurrentUser({
          email: data.user.email ?? "",
          role: data.user.user_metadata?.role,
        });
      } else {
        setCurrentUser(null);
      }
    });
  }, [open]);

  const fetchStats = async () => {
    setStatsLoading(true);
    try {
      const data = await devGet("/api/dev/stats");
      setStats(data);
    } catch (err) {
      addToastRef.current({ type: "error", message: "ดึง stats ไม่ได้", description: err instanceof Error ? err.message : undefined });
    } finally {
      setStatsLoading(false);
    }
  };

  // Auto-load stats when panel opens — stable dep (open only)
  const fetchStatsRef = useRef(fetchStats);
  useEffect(() => { fetchStatsRef.current = fetchStats; });
  useEffect(() => {
    if (open) fetchStatsRef.current();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  const toast = {
    success: (message: string, description?: string) => addToastRef.current({ type: "success", message, description }),
    error: (message: string, description?: string) => addToastRef.current({ type: "error", message, description }),
  };

  const handleSeed = async () => {
    setSeedLoading(true);
    try {
      await devPost("/api/dev/seed");
      toast.success("Seed สำเร็จ", "เพิ่มข้อมูล demo แล้ว");
      await fetchStats();
    } catch (err) {
      toast.error("Seed ล้มเหลว", err instanceof Error ? err.message : undefined);
    } finally {
      setSeedLoading(false);
    }
  };

  const handleReset = async () => {
    if (!window.confirm("ต้องการลบข้อมูลทั้งหมดและ seed ใหม่หรือไม่?")) return;
    setResetLoading(true);
    try {
      await devPost("/api/dev/reset");
      toast.success("Reset สำเร็จ", "ลบและ seed ข้อมูลใหม่แล้ว");
      await fetchStats();
    } catch (err) {
      toast.error("Reset ล้มเหลว", err instanceof Error ? err.message : undefined);
    } finally {
      setResetLoading(false);
    }
  };

  const handleQuickLogin = async (role: QuickLoginRole) => {
    setLoginLoading(role);
    try {
      const res = await fetch("/api/auth/demo", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role }),
      });
      const loginData = await res.json();
      if (!res.ok) throw new Error(loginData.error ?? "Login failed");

      const supabase = createClient();
      const { error } = await supabase.auth.signInWithPassword({
        email: loginData.email,
        password: loginData.password,
      });
      if (error) throw new Error(error.message);

      toast.success(`เข้าสู่ระบบสำเร็จ (${role})`, "กำลัง redirect...");
      const redirect = role === "seller" ? "/seller" : "/work";
      setTimeout(() => { window.location.href = redirect; }, 800);
    } catch (err) {
      toast.error("Login ล้มเหลว", err instanceof Error ? err.message : undefined);
    } finally {
      setLoginLoading(null);
    }
  };

  const totalRecords = stats
    ? Object.values(stats).reduce((a, b) => a + b, 0)
    : null;

  return (
    <>
      {/* Floating trigger button */}
      <button
        onClick={() => setOpen((v) => !v)}
        className={cn(
          "fixed bottom-20 right-4 z-50 w-11 h-11 rounded-full flex items-center justify-center shadow-lg transition-all",
          open
            ? "bg-white text-gray-900"
            : "bg-brand-600 text-white hover:bg-brand-700"
        )}
        title="DevTools"
      >
        {open ? <X size={18} /> : <Settings size={18} />}
      </button>

      {/* Panel */}
      {open && (
        <div className="fixed bottom-36 right-4 z-50 w-80 max-h-[70vh] overflow-y-auto rounded-2xl bg-gray-900 border border-white/10 shadow-2xl p-4 flex flex-col gap-0">
          {/* Header */}
          <div className="flex items-center gap-2 mb-3">
            <Settings size={14} className="text-brand-400" />
            <span className="text-sm font-bold text-white">DevTools</span>
            <span className="ml-auto text-xs text-white/40 font-mono">development</span>
          </div>

          {/* Current user */}
          <div className="mb-3 px-3 py-2 rounded-lg bg-white/5 text-xs">
            {currentUser ? (
              <span className="text-white/70">
                <span className="text-white font-medium">{currentUser.email}</span>
                {currentUser.role && (
                  <span className="ml-2 px-1.5 py-0.5 rounded bg-brand-600/40 text-brand-300 text-[10px]">
                    {currentUser.role}
                  </span>
                )}
              </span>
            ) : (
              <span className="text-white/40 italic">ยังไม่ได้ login</span>
            )}
          </div>

          {/* Quick Login */}
          <Section title="Quick Login">
            <div className="flex gap-2">
              <ActionBtn
                onClick={() => handleQuickLogin("seller")}
                loading={loginLoading === "seller"}
                variant="success"
              >
                <LogIn size={14} />
                Seller
              </ActionBtn>
              <ActionBtn
                onClick={() => handleQuickLogin("worker")}
                loading={loginLoading === "worker"}
                variant="success"
              >
                <LogIn size={14} />
                Worker
              </ActionBtn>
            </div>
          </Section>

          {/* Data Management */}
          <Section title="Data Management">
            <div className="flex flex-col gap-2">
              <ActionBtn onClick={handleSeed} loading={seedLoading}>
                <Database size={14} />
                Seed My Data
                <span className="ml-auto text-white/30 text-xs">เพิ่มข้อมูล</span>
              </ActionBtn>
              <ActionBtn onClick={handleReset} loading={resetLoading} variant="danger">
                <RefreshCw size={14} />
                Reset All
                <span className="ml-auto text-white/30 text-xs">ล้าง + seed</span>
              </ActionBtn>
            </div>
            <p className="mt-1.5 text-[10px] text-white/30 px-1">
              Seed เพิ่มข้อมูลให้ account ที่ login อยู่ / Reset ลบทั้งหมดแล้ว seed ใหม่
            </p>
          </Section>

          {/* DB Stats */}
          <Section title="DB Stats" collapsible>
            <div className="flex items-center justify-between mb-2">
              {totalRecords !== null && (
                <span className="text-xs text-white/40">
                  รวม{" "}
                  <span className="text-white font-medium">{totalRecords.toLocaleString()}</span>{" "}
                  records
                </span>
              )}
              <button
                onClick={fetchStats}
                disabled={statsLoading}
                className="ml-auto text-white/40 hover:text-white/70 transition-colors disabled:opacity-50"
              >
                <RefreshCw size={12} className={statsLoading ? "animate-spin" : ""} />
              </button>
            </div>
            {statsLoading && !stats ? (
              <div className="flex items-center justify-center py-4">
                <Loader2 size={16} className="animate-spin text-white/40" />
              </div>
            ) : stats ? (
              <div className="grid grid-cols-2 gap-x-3 gap-y-0.5">
                {Object.entries(stats).map(([model, count]) => (
                  <div key={model} className="flex items-center justify-between py-0.5">
                    <span className="text-[11px] text-white/50 truncate">{model}</span>
                    <span
                      className={cn(
                        "text-[11px] font-mono ml-2 flex-shrink-0",
                        count > 0 ? "text-green-400" : "text-white/25"
                      )}
                    >
                      {count}
                    </span>
                  </div>
                ))}
              </div>
            ) : null}
          </Section>

          {/* Prisma Studio */}
          <Section title="Tools">
            <button
              onClick={() => window.open("http://localhost:5555", "_blank")}
              className="flex items-center gap-2 w-full px-3 py-2 rounded-lg text-sm font-medium bg-white/10 hover:bg-white/20 text-white transition-colors"
            >
              <BarChart2 size={14} />
              Prisma Studio
              <ExternalLink size={12} className="ml-auto text-white/30" />
            </button>
            <p className="mt-1.5 text-[10px] text-white/30 px-1">
              รัน <code className="font-mono bg-white/10 px-1 rounded">npx prisma studio</code> ก่อนใช้
            </p>
          </Section>
        </div>
      )}
    </>
  );
}

export default DevTools;
