import type { Dispatch, SetStateAction } from "react";
import Link from "next/link";
import { Card, Badge, Input, Textarea, Button, Switch } from "@/components/ui";
import {
  Store,
  Eye as EyeIcon,
  Globe,
  Tag,
  Star,
  Package,
  Code,
  Link as LinkIcon,
  Copy,
  Check,
  QrCode,
  Shield,
  ChevronRight,
  Zap,
  AlertCircle,
  Save,
} from "lucide-react";

// Settings sidebar configuration
export type SettingSection = "info" | "display" | "links" | "advanced";

const settingsSections: { id: SettingSection; label: string; icon: any; desc: string }[] = [
  { id: "info", label: "ข้อมูลร้านค้า", icon: Store, desc: "ชื่อร้าน URL คำอธิบาย" },
  { id: "display", label: "การแสดงผล", icon: EyeIcon, desc: "สาธารณะ ราคา รีวิว" },
  { id: "links", label: "ลิงก์และโค้ด", icon: Code, desc: "URL, QR Code, Embed" },
  { id: "advanced", label: "ขั้นสูง", icon: Shield, desc: "API, Webhook" },
];

interface StoreDataState {
  storeName: string;
  storeSlug: string;
  bio: string;
}

interface StoreSettingsState {
  isPublic: boolean;
  showPricing: boolean;
  showReviews: boolean;
  allowDirectOrder: boolean;
  promoCode: string;
  promoDiscount: number;
  promoEnabled: boolean;
  embedCode: string;
}

interface StoreSettingsProps {
  storeData: StoreDataState;
  setStoreData: (data: StoreDataState) => void;
  storeSettings: StoreSettingsState;
  setStoreSettings: Dispatch<SetStateAction<StoreSettingsState>>;
  storeUrl: string;
  activeSettingSection: SettingSection;
  setActiveSettingSection: (section: SettingSection) => void;
  handleCopy: (text: string, key: string) => void;
  copied: string | null;
  setDirty: () => void;
}

export function StoreSettings({
  storeData,
  setStoreData,
  storeSettings,
  setStoreSettings,
  storeUrl,
  activeSettingSection,
  setActiveSettingSection,
  handleCopy,
  copied,
  setDirty,
}: StoreSettingsProps) {
  return (
    <div className="flex flex-col lg:flex-row gap-6">
      {/* Sidebar */}
      <div className="lg:w-64 shrink-0">
        <Card className="border-none shadow-lg p-2">
          <div className="space-y-1">
            {settingsSections.map((section) => {
              const SectionIcon = section.icon;
              return (
                <button
                  key={section.id}
                  onClick={() => setActiveSettingSection(section.id)}
                  className={`w-full flex items-center gap-3 p-3 rounded-xl transition-all text-left ${
                    activeSettingSection === section.id
                      ? "bg-brand-primary text-white shadow-md"
                      : "text-brand-text-light hover:bg-brand-bg"
                  }`}
                >
                  <SectionIcon className={`w-4 h-4 ${activeSettingSection === section.id ? "text-white" : "text-brand-text-light"}`} />
                  <div className="flex-1">
                    <p className={`font-medium text-sm ${activeSettingSection === section.id ? "text-white" : "text-brand-text-dark"}`}>
                      {section.label}
                    </p>
                    <p className={`text-xs ${activeSettingSection === section.id ? "text-white/70" : "text-brand-text-light"}`}>
                      {section.desc}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>
        </Card>
      </div>

      {/* Content */}
      <div className="flex-1 space-y-6">
        {/* Store Info Section */}
        {activeSettingSection === "info" && (
          <Card className="border-none shadow-lg">
            <div className="flex items-center gap-2 p-5 border-b border-brand-border/30">
              <Store className="w-5 h-5 text-brand-primary" />
              <h2 className="font-bold text-brand-text-dark">ข้อมูลร้านค้า</h2>
            </div>
            <div className="p-5 space-y-5">
              <div className="grid sm:grid-cols-2 gap-5">
                <Input
                  label="ชื่อร้านค้า"
                  value={storeData.storeName}
                  onChange={(e) => { setStoreData({ ...storeData, storeName: e.target.value }); setDirty(); }}
                  placeholder="เช่น JohnBoost Shop"
                />
                <div>
                  <label className="block text-sm font-medium text-brand-text-dark mb-1.5">
                    URL ร้าน
                  </label>
                  <div className="flex items-center">
                    <span className="px-3 py-2.5 bg-brand-bg border border-r-0 border-brand-border rounded-l-xl text-brand-text-light text-sm font-medium">
                      /s/
                    </span>
                    <Input
                      value={storeData.storeSlug}
                      onChange={(e) => {
                        setStoreData({
                          ...storeData,
                          storeSlug: e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ""),
                        });
                        setDirty();
                      }}
                      className="rounded-l-none"
                      placeholder="johnboost"
                    />
                  </div>
                </div>
              </div>
              <Textarea
                label="คำอธิบายร้าน"
                value={storeData.bio}
                onChange={(e) => { setStoreData({ ...storeData, bio: e.target.value }); setDirty(); }}
                placeholder="อธิบายสั้นๆ เกี่ยวกับบริการของคุณ..."
                rows={4}
              />
              <div className="pt-4 border-t border-brand-border/30">
                <p className="text-xs text-brand-text-light mb-3 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" />
                  ข้อมูลเหล่านี้จะแสดงในหน้าร้านค้าสาธารณะ
                </p>
                <Button size="sm" leftIcon={<Save className="w-4 h-4" />}>
                  บันทึกข้อมูล
                </Button>
              </div>
            </div>
          </Card>
        )}

        {/* Display Section */}
        {activeSettingSection === "display" && (
          <Card className="border-none shadow-lg">
            <div className="flex items-center gap-2 p-5 border-b border-brand-border/30">
              <EyeIcon className="w-5 h-5 text-brand-primary" />
              <h2 className="font-bold text-brand-text-dark">การแสดงผลร้าน</h2>
            </div>
            <div className="p-5 space-y-4">
              {[
                { key: "isPublic" as const, label: "เปิดให้สาธารณะ", desc: "ให้คนอื่นค้นหาและเข้าชมร้านได้", icon: Globe },
                { key: "showPricing" as const, label: "แสดงราคา", desc: "แสดงราคาบริการในหน้าร้าน", icon: Tag },
                { key: "showReviews" as const, label: "แสดงรีวิว", desc: "แสดงรีวิวจากลูกค้าในหน้าร้าน", icon: Star },
                { key: "allowDirectOrder" as const, label: "สั่งซื้อโดยตรง", desc: "ให้ลูกค้าสั่งซื้อผ่านหน้าร้านได้เลย", icon: Package },
              ].map((item) => {
                const Icon = item.icon;
                return (
                  <div key={item.key} className="flex items-center justify-between p-4 bg-brand-bg/30 rounded-xl hover:bg-brand-bg/50 transition-colors">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-white rounded-lg">
                        <Icon className="w-4 h-4 text-brand-text-light" />
                      </div>
                      <div>
                        <p className="font-medium text-brand-text-dark text-sm">{item.label}</p>
                        <p className="text-xs text-brand-text-light">{item.desc}</p>
                      </div>
                    </div>
                    <Switch
                      checked={storeSettings[item.key]}
                      onChange={(checked) => { setStoreSettings(prev => ({ ...prev, [item.key]: checked })); setDirty(); }}
                    />
                  </div>
                );
              })}
            </div>
          </Card>
        )}

        {/* Links Section */}
        {activeSettingSection === "links" && (
          <Card className="border-none shadow-lg">
            <div className="flex items-center gap-2 p-5 border-b border-brand-border/30">
              <Code className="w-5 h-5 text-brand-primary" />
              <h2 className="font-bold text-brand-text-dark">ลิงก์และโค้ดฝังร้าน</h2>
            </div>
            <div className="p-5 space-y-5">
              {/* Store URL */}
              <div>
                <label className="block text-sm font-medium text-brand-text-dark mb-2">
                  <LinkIcon className="w-4 h-4 inline mr-1" />
                  ลิงก์ร้านค้า
                </label>
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                  <div className="flex-1 flex items-center gap-2 p-3 bg-brand-bg/50 rounded-xl border border-brand-border/50">
                    <Globe className="w-4 h-4 text-brand-text-light shrink-0" />
                    <code className="text-sm font-mono text-brand-text-dark flex-1 truncate">https://{storeUrl}</code>
                  </div>
                  <div className="flex gap-2">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleCopy(`https://${storeUrl}`, "storeUrl")}
                      leftIcon={copied === "storeUrl" ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
                    >
                      {copied === "storeUrl" ? "คัดลอกแล้ว" : "คัดลอก"}
                    </Button>
                    <Button variant="outline" size="sm" leftIcon={<QrCode className="w-4 h-4" />}>
                      QR Code
                    </Button>
                  </div>
                </div>
              </div>

              {/* Embed Code */}
              <div>
                <label className="block text-sm font-medium text-brand-text-dark mb-2">
                  <Code className="w-4 h-4 inline mr-1" />
                  โค้ดฝังเว็บไซต์
                  <Badge variant="info" size="sm" className="ml-2">Pro</Badge>
                </label>
                <div className="flex flex-col sm:flex-row items-stretch sm:items-start gap-2">
                  <div className="flex-1 p-3 bg-gray-900 rounded-xl overflow-x-auto">
                    <code className="text-sm font-mono text-green-400 break-all whitespace-pre-wrap">{storeSettings.embedCode}</code>
                  </div>
                  <Button 
                    variant="outline"
                    size="sm"
                    onClick={() => handleCopy(storeSettings.embedCode, "embedCode")}
                    leftIcon={copied === "embedCode" ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
                  >
                    {copied === "embedCode" ? "คัดลอกแล้ว" : "คัดลอก"}
                  </Button>
                </div>
                <p className="text-xs text-brand-text-light mt-2">
                  วางโค้ดนี้ในเว็บไซต์ของคุณเพื่อแสดงปุ่มสั่งซื้อบริการ
                </p>
              </div>
            </div>
          </Card>
        )}

        {/* Advanced Section */}
        {activeSettingSection === "advanced" && (
          <Card className="border-none shadow-lg">
            <div className="flex items-center gap-2 p-5 border-b border-brand-border/30">
              <Shield className="w-5 h-5 text-brand-primary" />
              <h2 className="font-bold text-brand-text-dark">การตั้งค่าขั้นสูง</h2>
            </div>
            <div className="p-5 space-y-4">
              {/* API Integration */}
              <div className="p-4 bg-brand-bg/50 rounded-xl border border-brand-border/50 hover:border-brand-primary/30 transition-colors">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-brand-primary/10 rounded-lg">
                      <Shield className="w-5 h-5 text-brand-primary" />
                    </div>
                    <div>
                      <p className="font-medium text-brand-text-dark">API Integration</p>
                      <p className="text-xs text-brand-text-light">เชื่อมต่อระบบอัตโนมัติกับเว็บไซต์ของคุณ</p>
                    </div>
                  </div>
                  <Link href="/seller/settings/api">
                    <Button variant="ghost" size="sm" rightIcon={<ChevronRight className="w-4 h-4" />}>
                      ตั้งค่า API
                    </Button>
                  </Link>
                </div>
              </div>

              {/* Webhook */}
              <div className="p-4 bg-brand-bg/50 rounded-xl border border-brand-border/50 opacity-60">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-purple-100 rounded-lg">
                      <Zap className="w-5 h-5 text-purple-600" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="font-medium text-brand-text-dark">Webhook</p>
                        <Badge variant="warning" size="sm">เร็วๆ นี้</Badge>
                      </div>
                      <p className="text-xs text-brand-text-light">รับแจ้งเตือนอัตโนมัติผ่าน Webhook</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Custom Domain */}
              <div className="p-4 bg-brand-bg/50 rounded-xl border border-brand-border/50 opacity-60">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <Globe className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="font-medium text-brand-text-dark">Custom Domain</p>
                        <Badge variant="info" size="sm">Business</Badge>
                      </div>
                      <p className="text-xs text-brand-text-light">ใช้โดเมนของคุณเอง เช่น shop.yourdomain.com</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
}
