"use client";

import { useState, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Button, Input, Card } from "@/components/ui";
import { useAuthStore } from "@/lib/store";
import { Mail, Lock, User, Store, Phone, Sparkles } from "lucide-react";

function RegisterForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { login, isLoading } = useAuthStore();

  const [role, setRole] = useState<"seller" | "worker">(
    (searchParams.get("role") as "seller" | "worker") || "seller"
  );
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    storeName: "",
    lineId: "",
  });
  const [error, setError] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!formData.name || !formData.email || !formData.password) {
      setError("กรุณากรอกข้อมูลให้ครบถ้วน");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError("รหัสผ่านไม่ตรงกัน");
      return;
    }

    if (role === "seller" && !formData.storeName) {
      setError("กรุณากรอกชื่อร้าน");
      return;
    }

    // Mock registration - just login
    const success = await login(formData.email, formData.password, role);
    if (success) {
      router.push(role === "seller" ? "/seller" : "/work");
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
            สมัครสมาชิก
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
              label="ชื่อ-นามสกุล"
              name="name"
              placeholder="John Doe"
              value={formData.name}
              onChange={handleChange}
              leftIcon={<User className="w-4 h-4" />}
            />

            {role === "seller" && (
              <Input
                label="ชื่อร้าน"
                name="storeName"
                placeholder="JohnBoost"
                value={formData.storeName}
                onChange={handleChange}
                leftIcon={<Store className="w-4 h-4" />}
              />
            )}

            <Input
              label="อีเมล"
              type="email"
              name="email"
              placeholder="your@email.com"
              value={formData.email}
              onChange={handleChange}
              leftIcon={<Mail className="w-4 h-4" />}
            />

            <Input
              label="เบอร์โทร"
              name="phone"
              placeholder="080-xxx-xxxx"
              value={formData.phone}
              onChange={handleChange}
              leftIcon={<Phone className="w-4 h-4" />}
            />

            <Input
              label="LINE ID (ถ้ามี)"
              name="lineId"
              placeholder="@yourlineid"
              value={formData.lineId}
              onChange={handleChange}
            />

            <Input
              label="รหัสผ่าน"
              type="password"
              name="password"
              placeholder="••••••••"
              value={formData.password}
              onChange={handleChange}
              leftIcon={<Lock className="w-4 h-4" />}
            />

            <Input
              label="ยืนยันรหัสผ่าน"
              type="password"
              name="confirmPassword"
              placeholder="••••••••"
              value={formData.confirmPassword}
              onChange={handleChange}
              leftIcon={<Lock className="w-4 h-4" />}
            />

            {error && (
              <div className="p-3 rounded-lg bg-brand-error/10 text-brand-error text-sm">
                {error}
              </div>
            )}

            <Button type="submit" className="w-full" isLoading={isLoading}>
              สมัครสมาชิก
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-brand-text-light">
              มีบัญชีอยู่แล้ว?{" "}
              <Link
                href={`/login?role=${role}`}
                className="text-brand-primary font-medium hover:underline"
              >
                เข้าสู่ระบบ
              </Link>
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
}

export default function RegisterPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-brand-bg flex items-center justify-center">กำลังโหลด...</div>}>
      <RegisterForm />
    </Suspense>
  );
}
