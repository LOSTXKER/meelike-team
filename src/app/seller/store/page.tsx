"use client";

import { useState } from "react";
import { useAuthStore } from "@/lib/store";
import { Card, Button, Input, Textarea, Select, Badge, Avatar } from "@/components/ui";
import { PageHeader } from "@/components/shared";
import type { StoreTheme } from "@/types";
import { Camera, Save, ExternalLink, Copy, Palette, Check, Store, CreditCard, Award } from "lucide-react";

const themes: { value: StoreTheme; label: string; color: string }[] = [
  { value: "meelike", label: "MeeLike", color: "#937058" },
  { value: "ocean", label: "Ocean", color: "#2563eb" },
  { value: "purple", label: "Purple", color: "#7c3aed" },
  { value: "dark", label: "Dark", color: "#1f2937" },
  { value: "sakura", label: "Sakura", color: "#ec4899" },
  { value: "red", label: "Red", color: "#dc2626" },
  { value: "green", label: "Green", color: "#16a34a" },
  { value: "orange", label: "Orange", color: "#ea580c" },
  { value: "minimal", label: "Minimal", color: "#000000" },
];

export default function StoreSettingsPage() {
  const { user } = useAuthStore();
  const seller = user?.seller;

  const [storeData, setStoreData] = useState({
    storeName: seller?.storeName || "",
    storeSlug: seller?.storeSlug || "",
    bio: seller?.bio || "",
    lineId: seller?.lineId || "",
    phone: seller?.phone || "",
    email: seller?.email || "",
  });

  const [selectedTheme, setSelectedTheme] = useState<StoreTheme>(
    seller?.storeTheme || "meelike"
  );

  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    setIsSaving(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setIsSaving(false);
  };

  const storeUrl = `seller.meelike.com/s/${storeData.storeSlug}`;

  return (
    <div className="space-y-8 animate-fade-in max-w-4xl mx-auto pb-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-brand-text-dark flex items-center gap-2">
            <Store className="w-6 h-6 text-brand-primary" />
            ตั้งค่าหน้าร้าน
          </h1>
          <p className="text-brand-text-light mt-1">
            ปรับแต่งข้อมูลร้านค้า ธีมสี และช่องทางการติดต่อของคุณ
          </p>
        </div>
        <div className="flex items-center gap-3">
          <a href={`/s/${storeData.storeSlug}`} target="_blank" rel="noopener noreferrer">
            <Button variant="outline" className="bg-white" leftIcon={<ExternalLink className="w-4 h-4" />}>
              ดูตัวอย่าง
            </Button>
          </a>
          <Button onClick={handleSave} isLoading={isSaving} leftIcon={<Save className="w-4 h-4" />}>
            บันทึก
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Avatar & URL */}
        <div className="space-y-6">
          {/* Avatar Card */}
          <Card variant="elevated" className="text-center p-6 border-none shadow-lg shadow-brand-primary/5">
            <div className="relative inline-block mx-auto mb-4">
              <Avatar 
                fallback={storeData.storeName} 
                size="xl" 
                className="w-32 h-32 text-3xl border-4 border-white shadow-md"
              />
              <button className="absolute bottom-0 right-0 p-2.5 bg-brand-primary text-white rounded-full shadow-lg hover:bg-brand-primary/90 transition-transform hover:scale-105 active:scale-95 border-2 border-white">
                <Camera className="w-4 h-4" />
              </button>
            </div>
            <h3 className="font-semibold text-brand-text-dark mb-1">รูปโปรไฟล์ร้าน</h3>
            <p className="text-xs text-brand-text-light mb-4 px-4">
              แนะนำขนาด 400x400px <br/> ไฟล์ PNG หรือ JPG
            </p>
          </Card>

          {/* Store URL */}
          <Card variant="elevated" className="border-none shadow-lg shadow-brand-primary/5 bg-brand-primary/5">
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-brand-primary font-medium">
                <ExternalLink className="w-4 h-4" />
                URL หน้าร้านของคุณ
              </div>
              <div className="p-3 bg-white/80 rounded-xl border border-brand-primary/10 text-sm font-mono text-brand-text-dark break-all">
                {storeUrl}
              </div>
              <Button
                variant="outline"
                size="sm"
                className="w-full bg-white hover:bg-white/80 border-brand-primary/20 text-brand-primary"
                onClick={() => navigator.clipboard.writeText(`https://${storeUrl}`)}
                leftIcon={<Copy className="w-3 h-3" />}
              >
                คัดลอกลิงก์
              </Button>
            </div>
          </Card>
        </div>

        {/* Right Column: Forms */}
        <div className="lg:col-span-2 space-y-6">
          {/* Basic Info */}
          <Card variant="elevated" className="border-none shadow-lg shadow-brand-primary/5">
            <div className="border-b border-brand-border/50 pb-4 mb-6">
              <h2 className="text-lg font-bold text-brand-text-dark">ข้อมูลทั่วไป</h2>
            </div>
            <div className="space-y-5">
              <div className="grid md:grid-cols-2 gap-5">
                <Input
                  label="ชื่อร้านค้า"
                  value={storeData.storeName}
                  onChange={(e) => setStoreData({ ...storeData, storeName: e.target.value })}
                  placeholder="เช่น JohnBoost Shop"
                />
                <div>
                  <label className="block text-sm font-medium text-brand-text-dark mb-1.5">
                    URL ร้าน (Slug)
                  </label>
                  <div className="flex items-center">
                    <span className="px-3 py-2.5 bg-brand-bg border border-r-0 border-brand-border rounded-l-xl text-brand-text-light text-sm font-medium">
                      /s/
                    </span>
                    <Input
                      value={storeData.storeSlug}
                      onChange={(e) =>
                        setStoreData({
                          ...storeData,
                          storeSlug: e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ""),
                        })
                      }
                      className="rounded-l-none"
                      placeholder="johnboost"
                    />
                  </div>
                </div>
              </div>

              <Textarea
                label="คำอธิบายร้าน"
                value={storeData.bio}
                onChange={(e) => setStoreData({ ...storeData, bio: e.target.value })}
                placeholder="อธิบายสั้นๆ เกี่ยวกับบริการของคุณ..."
                rows={3}
              />
            </div>
          </Card>

          {/* Contact & Payment */}
          <Card variant="elevated" className="border-none shadow-lg shadow-brand-primary/5">
            <div className="border-b border-brand-border/50 pb-4 mb-6">
              <h2 className="text-lg font-bold text-brand-text-dark">ข้อมูลติดต่อ</h2>
            </div>
            <div className="grid md:grid-cols-2 gap-5">
              <Input
                label="LINE ID"
                value={storeData.lineId}
                onChange={(e) => setStoreData({ ...storeData, lineId: e.target.value })}
                placeholder="@yourlineid"
                leftIcon={<span className="text-xs font-bold text-green-500">L</span>}
              />
              <Input
                label="เบอร์โทรศัพท์"
                value={storeData.phone}
                onChange={(e) => setStoreData({ ...storeData, phone: e.target.value })}
                placeholder="08x-xxx-xxxx"
              />
              <Input
                label="อีเมล (สำหรับแจ้งเตือน)"
                type="email"
                value={storeData.email}
                onChange={(e) => setStoreData({ ...storeData, email: e.target.value })}
                placeholder="email@example.com"
                className="md:col-span-2"
              />
            </div>
          </Card>

          {/* Theme Selection */}
          <Card variant="elevated" className="border-none shadow-lg shadow-brand-primary/5">
            <div className="flex items-center justify-between border-b border-brand-border/50 pb-4 mb-6">
              <h2 className="text-lg font-bold text-brand-text-dark flex items-center gap-2">
                <Palette className="w-5 h-5 text-brand-primary" />
                ธีมสีร้านค้า
              </h2>
              <Badge variant="info" className="flex items-center gap-1.5 px-2.5 py-1">
                <Award className="w-3.5 h-3.5" />
                Pro Feature
              </Badge>
            </div>

            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-4">
              {themes.map((theme) => (
                <button
                  key={theme.value}
                  onClick={() => setSelectedTheme(theme.value)}
                  className={`group relative flex flex-col items-center gap-3 p-4 rounded-2xl border-2 transition-all duration-200 ${
                    selectedTheme === theme.value
                      ? "border-brand-primary bg-brand-primary/5 shadow-sm"
                      : "border-transparent bg-brand-bg hover:bg-brand-secondary hover:border-brand-border"
                  }`}
                >
                  <div
                    className="w-10 h-10 rounded-full shadow-sm ring-2 ring-white transition-transform group-hover:scale-110"
                    style={{ backgroundColor: theme.color }}
                  />
                  <span className={`text-xs font-medium ${
                    selectedTheme === theme.value ? "text-brand-primary" : "text-brand-text-light"
                  }`}>
                    {theme.label}
                  </span>
                  {selectedTheme === theme.value && (
                    <div className="absolute top-2 right-2 w-5 h-5 bg-brand-primary text-white rounded-full flex items-center justify-center shadow-sm">
                      <Check className="w-3 h-3" />
                    </div>
                  )}
                </button>
              ))}
            </div>
          </Card>

          {/* Payment Info */}
          <Card variant="elevated" className="border-none shadow-lg shadow-brand-primary/5">
            <div className="border-b border-brand-border/50 pb-4 mb-6">
              <h2 className="text-lg font-bold text-brand-text-dark flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-brand-success" />
                บัญชีรับเงิน
              </h2>
              <p className="text-sm text-brand-text-light mt-1">
                ข้อมูลนี้จะแสดงให้ลูกค้าเห็นในหน้าชำระเงิน
              </p>
            </div>

            <div className="space-y-5">
              <div className="grid md:grid-cols-2 gap-5">
                <Select
                  label="ธนาคาร"
                  options={[
                    { value: "kbank", label: "กสิกรไทย (KBANK)" },
                    { value: "scb", label: "ไทยพาณิชย์ (SCB)" },
                    { value: "ktb", label: "กรุงไทย (KTB)" },
                    { value: "bbl", label: "กรุงเทพ (BBL)" },
                    { value: "ttb", label: "ทีทีบี (ttb)" },
                  ]}
                  defaultValue="kbank"
                />
                <Input label="เลขที่บัญชี" placeholder="xxx-x-xxxxx-x" />
              </div>
              <div className="grid md:grid-cols-2 gap-5">
                <Input label="ชื่อบัญชี" placeholder="ระบุชื่อบัญชีภาษาไทย" />
                <Input label="PromptPay (ถ้ามี)" placeholder="เบอร์โทร หรือ เลขบัตร ปชช." />
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}

