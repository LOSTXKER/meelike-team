"use client";

import { useState, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Button, Input, Card } from "@/components/ui";
import { useAuthStore } from "@/lib/store";
import { Mail, Lock, Store, User, Sparkles } from "lucide-react";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { login, isLoading } = useAuthStore();

  const [role, setRole] = useState<"seller" | "worker">(
    (searchParams.get("role") as "seller" | "worker") || "seller"
  );
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!email || !password) {
      setError("กรุณากรอกข้อมูลให้ครบถ้วน");
      return;
    }

    const success = await login(email, password, role);
    if (success) {
      router.push(role === "seller" ? "/seller" : "/work");
    } else {
      setError("อีเมลหรือรหัสผ่านไม่ถูกต้อง");
    }
  };

  return (
    <div className="min-h-screen bg-brand-bg flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2">
            <Sparkles className="w-10 h-10 text-brand-primary" />
            <span className="text-2xl font-bold text-brand-text-dark">
              MeeLike Seller
            </span>
          </Link>
        </div>

        <Card variant="bordered" padding="lg">
          <h1 className="text-2xl font-bold text-brand-text-dark text-center mb-6">
            เข้าสู่ระบบ
          </h1>

          {/* Role Toggle */}
          <div className="flex rounded-lg bg-brand-bg p-1 mb-6">
            <button
              type="button"
              onClick={() => setRole("seller")}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg font-medium transition-all ${
                role === "seller"
                  ? "bg-brand-surface text-brand-primary shadow-sm"
                  : "text-brand-text-light hover:text-brand-text-dark"
              }`}
            >
              <Store className="w-4 h-4" />
              Seller
            </button>
            <button
              type="button"
              onClick={() => setRole("worker")}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg font-medium transition-all ${
                role === "worker"
                  ? "bg-brand-surface text-brand-primary shadow-sm"
                  : "text-brand-text-light hover:text-brand-text-dark"
              }`}
            >
              <User className="w-4 h-4" />
              Worker
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="อีเมล"
              type="email"
              placeholder="your@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              leftIcon={<Mail className="w-4 h-4" />}
            />

            <Input
              label="รหัสผ่าน"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              leftIcon={<Lock className="w-4 h-4" />}
            />

            {error && (
              <div className="p-3 rounded-lg bg-brand-error/10 text-brand-error text-sm">
                {error}
              </div>
            )}

            <Button type="submit" className="w-full" isLoading={isLoading}>
              เข้าสู่ระบบ
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-brand-text-light">
              ยังไม่มีบัญชี?{" "}
              <Link
                href={`/register?role=${role}`}
                className="text-brand-primary font-medium hover:underline"
              >
                สมัครสมาชิก
              </Link>
            </p>
          </div>

          {/* Quick Demo Login */}
          <div className="mt-6 p-4 rounded-lg bg-brand-secondary/10 border border-brand-secondary/30">
            <p className="text-sm font-medium text-brand-text-dark mb-2">
              🎮 ทดลองใช้งาน (Demo)
            </p>
            <p className="text-xs text-brand-text-light mb-3">
              คลิกปุ่มด้านล่างเพื่อเข้าสู่ระบบแบบรวดเร็ว
            </p>
            <Button
              type="button"
              variant="secondary"
              size="sm"
              className="w-full"
              onClick={async () => {
                const success = await login("demo@meelike.com", "demo", role);
                if (success) {
                  router.push(role === "seller" ? "/seller" : "/work");
                }
              }}
            >
              เข้าสู่ระบบ Demo ({role === "seller" ? "Seller" : "Worker"})
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-brand-bg flex items-center justify-center">กำลังโหลด...</div>}>
      <LoginForm />
    </Suspense>
  );
}
