"use client";

import { useState } from "react";
import { useAuthStore } from "@/lib/store";
import { Card, Button, Input, Textarea, Select, Badge, Avatar } from "@/components/ui";
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
    <div className="space-y-6 animate-fade-in max-w-3xl">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-brand-text-dark flex items-center gap-2">
            <Store className="w-7 h-7 text-brand-primary" />
            ตั้งค่าร้าน
          </h1>
          <p className="text-brand-text-light">
            จัดการข้อมูลและรูปลักษณ์หน้าร้านของคุณ
          </p>
        </div>
        <div className="flex items-center gap-3">
          <a
            href={`/s/${storeData.storeSlug}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            <Button variant="outline" leftIcon={<ExternalLink className="w-4 h-4" />}>
              ดูหน้าร้าน
            </Button>
          </a>
          <Button onClick={handleSave} isLoading={isSaving} leftIcon={<Save className="w-4 h-4" />}>
            บันทึก
          </Button>
        </div>
      </div>

      {/* Store URL */}
      <Card variant="bordered" className="bg-brand-secondary/10">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-brand-text-light">🔗 URL หน้าร้าน</p>
            <p className="font-medium text-brand-text-dark mt-1">{storeUrl}</p>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigator.clipboard.writeText(`https://${storeUrl}`)}
            leftIcon={<Copy className="w-4 h-4" />}
          >
            คัดลอก
          </Button>
        </div>
      </Card>

      {/* Avatar */}
      <Card variant="bordered">
        <h2 className="text-lg font-semibold text-brand-text-dark mb-4">
          รูปโปรไฟล์ร้าน
        </h2>
        <div className="flex items-center gap-6">
          <div className="relative">
            <Avatar fallback={storeData.storeName} size="xl" />
            <button className="absolute bottom-0 right-0 p-2 bg-brand-primary text-white rounded-full shadow-md hover:bg-brand-primary/90 transition-colors">
              <Camera className="w-4 h-4" />
            </button>
          </div>
          <div>
            <p className="text-sm text-brand-text-light">
              อัพโหลดรูปโปรไฟล์ร้านค้า
            </p>
            <p className="text-xs text-brand-text-light mt-1">
              แนะนำ: 200x200 พิกเซล, PNG หรือ JPG
            </p>
          </div>
        </div>
      </Card>

      {/* Store Info */}
      <Card variant="bordered">
        <h2 className="text-lg font-semibold text-brand-text-dark mb-4">
          ข้อมูลร้าน
        </h2>

        <div className="space-y-4">
          <Input
            label="ชื่อร้าน"
            value={storeData.storeName}
            onChange={(e) =>
              setStoreData({ ...storeData, storeName: e.target.value })
            }
            placeholder="JohnBoost"
          />

          <div>
            <label className="block text-sm font-medium text-brand-text-dark mb-1.5">
              URL ร้าน (Slug)
            </label>
            <div className="flex items-center">
              <span className="px-3 py-2 bg-brand-bg border border-r-0 border-brand-border rounded-l-lg text-brand-text-light text-sm">
                seller.meelike.com/s/
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

          <Textarea
            label="คำอธิบายร้าน"
            value={storeData.bio}
            onChange={(e) => setStoreData({ ...storeData, bio: e.target.value })}
            placeholder="บริการปั้มยอด Social Media คุณภาพ ส่งไว จ่ายปลอดภัย"
            rows={3}
          />
        </div>
      </Card>

      {/* Contact */}
      <Card variant="bordered">
        <h2 className="text-lg font-semibold text-brand-text-dark mb-4">
          ช่องทางติดต่อ
        </h2>

        <div className="space-y-4">
          <Input
            label="LINE ID"
            value={storeData.lineId}
            onChange={(e) =>
              setStoreData({ ...storeData, lineId: e.target.value })
            }
            placeholder="@johnboost"
          />
          <Input
            label="เบอร์โทร"
            value={storeData.phone}
            onChange={(e) =>
              setStoreData({ ...storeData, phone: e.target.value })
            }
            placeholder="080-xxx-xxxx"
          />
          <Input
            label="Email"
            type="email"
            value={storeData.email}
            onChange={(e) =>
              setStoreData({ ...storeData, email: e.target.value })
            }
            placeholder="shop@example.com"
          />
        </div>
      </Card>

      {/* Theme */}
      <Card variant="bordered">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-brand-text-dark flex items-center gap-2">
            <Palette className="w-5 h-5" />
            ธีมหน้าร้าน
          </h2>
          <Badge variant="info" className="flex items-center gap-1">
            <Award className="w-3 h-3" />
            Pro สามารถเลือกธีม Custom
          </Badge>
        </div>

        <div className="grid grid-cols-3 sm:grid-cols-5 gap-3">
          {themes.map((theme) => (
            <button
              key={theme.value}
              onClick={() => setSelectedTheme(theme.value)}
              className={`relative p-4 rounded-xl border-2 transition-all ${
                selectedTheme === theme.value
                  ? "border-brand-primary bg-brand-primary/5"
                  : "border-brand-border hover:border-brand-primary/50"
              }`}
            >
              <div
                className="w-8 h-8 rounded-full mx-auto mb-2"
                style={{ backgroundColor: theme.color }}
              />
              <p className="text-xs text-brand-text-dark text-center">
                {theme.label}
              </p>
              {selectedTheme === theme.value && (
                <div className="absolute top-1 right-1 w-5 h-5 bg-brand-primary text-white rounded-full flex items-center justify-center">
                  <Check className="w-3 h-3" />
                </div>
              )}
            </button>
          ))}
        </div>
      </Card>

      {/* Payment Info */}
      <Card variant="bordered">
        <h2 className="text-lg font-semibold text-brand-text-dark mb-4 flex items-center gap-2">
          <CreditCard className="w-5 h-5 text-brand-success" />
          ข้อมูลรับชำระเงิน
        </h2>
        <p className="text-sm text-brand-text-light mb-4">
          ข้อมูลนี้จะแสดงให้ลูกค้าเห็นตอนสั่งซื้อ
        </p>

        <div className="space-y-4">
          <Select
            label="ธนาคาร"
            options={[
              { value: "kbank", label: "ธนาคารกสิกรไทย" },
              { value: "scb", label: "ธนาคารไทยพาณิชย์" },
              { value: "ktb", label: "ธนาคารกรุงไทย" },
              { value: "bbl", label: "ธนาคารกรุงเทพ" },
            ]}
            defaultValue="kbank"
          />
          <Input label="เลขบัญชี" placeholder="xxx-x-xxxxx-x" />
          <Input label="ชื่อบัญชี" placeholder="นาย/นาง/นางสาว ..." />
          <Input label="PromptPay" placeholder="080-xxx-xxxx" />
        </div>
      </Card>

      {/* Save Button */}
      <div className="flex justify-end">
        <Button onClick={handleSave} isLoading={isSaving} leftIcon={<Save className="w-4 h-4" />}>
          บันทึกการเปลี่ยนแปลง
        </Button>
      </div>
    </div>
  );
}

