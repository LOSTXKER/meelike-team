"use client";

import { useState } from "react";
import { useAuthStore } from "@/lib/store";
import { Button, Tabs } from "@/components/ui";
import { HStack } from "@/components/layout";
import type { StoreTheme, StoreService } from "@/types";
import { useSellerServices } from "@/lib/api/hooks";
import { useUnsavedChanges } from "@/lib/hooks/useUnsavedChanges";
import {
  Save,
  Eye,
  Store,
  LayoutGrid,
  Palette,
  Package,
  Star,
  Gift,
  Settings,
} from "lucide-react";

import { StoreOverview } from "./_components/StoreOverview";
import { StoreDecoration } from "./_components/StoreDecoration";
import { StoreServices } from "./_components/StoreServices";
import { StoreReviews } from "./_components/StoreReviews";
import { StorePromotions } from "./_components/StorePromotions";
import { StoreSettings, type SettingSection } from "./_components/StoreSettings";

// Tabs configuration
type TabId = "overview" | "decoration" | "services" | "reviews" | "promotions" | "settings";

const tabs: { id: TabId; label: string; icon: any }[] = [
  { id: "overview", label: "ภาพรวม", icon: LayoutGrid },
  { id: "decoration", label: "ตกแต่ง", icon: Palette },
  { id: "services", label: "บริการ", icon: Package },
  { id: "reviews", label: "รีวิว", icon: Star },
  { id: "promotions", label: "โปรโมชั่น", icon: Gift },
  { id: "settings", label: "ตั้งค่า", icon: Settings },
];

// Theme configurations
const themes: { value: StoreTheme; label: string; color: string; gradient: string }[] = [
  { value: "meelike", label: "MeeLike", color: "#937058", gradient: "from-[#937058] to-[#b89478]" },
  { value: "ocean", label: "Ocean", color: "#2563eb", gradient: "from-blue-500 to-cyan-400" },
  { value: "purple", label: "Purple", color: "#7c3aed", gradient: "from-purple-500 to-pink-500" },
  { value: "dark", label: "Dark", color: "#1f2937", gradient: "from-gray-800 to-gray-600" },
  { value: "sakura", label: "Sakura", color: "#ec4899", gradient: "from-pink-500 to-rose-400" },
  { value: "red", label: "Red", color: "#dc2626", gradient: "from-red-500 to-orange-500" },
  { value: "green", label: "Green", color: "#16a34a", gradient: "from-green-500 to-emerald-400" },
  { value: "orange", label: "Orange", color: "#ea580c", gradient: "from-orange-500 to-amber-400" },
  { value: "minimal", label: "Minimal", color: "#000000", gradient: "from-gray-900 to-gray-700" },
];

// Mock reviews data
const mockReviews = [
  {
    id: "rev-1",
    customerName: "คุณสมชาย",
    avatar: null,
    rating: 5,
    comment: "บริการดีมากครับ ส่งงานไว คุณภาพดี จะกลับมาใช้อีกแน่นอน",
    serviceName: "ไลค์ Facebook (คนไทยจริง)",
    orderId: "ORD-2025-001",
    createdAt: "2025-01-01T10:30:00Z",
    reply: "ขอบคุณมากครับ ยินดีให้บริการครับ 🙏",
    repliedAt: "2025-01-01T11:00:00Z",
  },
  {
    id: "rev-2",
    customerName: "Beauty Shop",
    avatar: null,
    rating: 5,
    comment: "ใช้มาหลายครั้งแล้ว คุณภาพคงที่ตลอด แนะนำเลยค่ะ",
    serviceName: "Follow Instagram (Bot)",
    orderId: "ORD-2025-002",
    createdAt: "2024-12-30T14:20:00Z",
    reply: null,
    repliedAt: null,
  },
  {
    id: "rev-3",
    customerName: "คุณนิด้า",
    avatar: null,
    rating: 4,
    comment: "งานโอเค แต่ส่งช้าไปหน่อย นอกนั้นดีค่ะ",
    serviceName: "เม้น Facebook (คนไทยจริง)",
    orderId: "ORD-2025-003",
    createdAt: "2024-12-28T09:15:00Z",
    reply: "ขอโทษด้วยนะคะ ช่วงนั้นงานเยอะ จะปรับปรุงให้ดีขึ้นค่ะ",
    repliedAt: "2024-12-28T10:00:00Z",
  },
  {
    id: "rev-4",
    customerName: "ร้านกาแฟ",
    avatar: null,
    rating: 5,
    comment: "สั่งมา 3 รอบแล้ว ทุกครั้งงานดีมาก!",
    serviceName: "View TikTok (Bot)",
    orderId: "ORD-2025-004",
    createdAt: "2024-12-25T16:45:00Z",
    reply: null,
    repliedAt: null,
  },
];

export default function StorePage() {
  const { user } = useAuthStore();
  const seller = user?.seller;
  const { data: servicesData } = useSellerServices();
  const services = servicesData ?? [];
  const { setDirty, setClean } = useUnsavedChanges();

  const [activeTab, setActiveTab] = useState<TabId>("overview");
  const [activeSettingSection, setActiveSettingSection] = useState<SettingSection>("info");

  const [storeData, setStoreData] = useState({
    storeName: seller?.name || seller?.displayName || "ร้านของฉัน",
    storeSlug: seller?.slug || "my-store",
    bio: seller?.bio || seller?.description || "บริการ Social Media Marketing คุณภาพสูง",
  });

  const [selectedTheme, setSelectedTheme] = useState<StoreTheme>(
    seller?.theme || "meelike"
  );

  const [featuredServices, setFeaturedServices] = useState<string[]>([
    "svc-1", "svc-2", "svc-4"
  ]);

  const [storeSettings, setStoreSettings] = useState({
    isPublic: true,
    showPricing: true,
    showReviews: true,
    allowDirectOrder: true,
    promoCode: "WELCOME10",
    promoDiscount: 10,
    promoEnabled: true,
    embedCode: `<script src="https://seller.meelike.com/embed/johnboost.js"></script>`,
  });

  const [isSaving, setIsSaving] = useState(false);
  const [copied, setCopied] = useState<string | null>(null);
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [replyText, setReplyText] = useState("");

  // Handlers
  const handleSave = async () => {
    setIsSaving(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setClean();
    } finally {
      setIsSaving(false);
    }
  };

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopied(key);
    setTimeout(() => setCopied(null), 2000);
  };

  const toggleFeatured = (serviceId: string) => {
    setFeaturedServices(prev =>
      prev.includes(serviceId)
        ? prev.filter(id => id !== serviceId)
        : [...prev, serviceId]
    );
  };

  // Computed values
  const storeUrl = `seller.meelike.com/s/${storeData.storeSlug}`;
  const currentTheme = themes.find(t => t.value === selectedTheme) || themes[0];
  const publicServices = services.filter((s: StoreService) => s.isActive && s.showInStore);

  const storeStats = {
    totalSales: seller?.totalRevenue || 0,
    monthlyOrders: seller?.totalOrders || 0,
    rating: seller?.rating || 0,
    ratingCount: seller?.ratingCount || 0,
    visitors: 1250,
    conversionRate: 12.5,
    responseRate: 98,
    avgDeliveryTime: "2.5 ชม.",
  };

  const reviewStats = {
    total: mockReviews.length,
    avgRating: mockReviews.reduce((sum, r) => sum + r.rating, 0) / mockReviews.length,
    pending: mockReviews.filter(r => !r.reply).length,
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-brand-text-dark flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-brand-primary/10 flex items-center justify-center">
              <Store className="w-5 h-5 text-brand-primary" />
            </div>
            จัดการร้านค้า
          </h1>
          <p className="text-brand-text-light text-sm mt-1 ml-[52px]">
            ตกแต่งร้าน จัดบริการ ดูรีวิว และตั้งค่าร้านของคุณ
          </p>
        </div>
        <HStack gap={3}>
          <a href={`/s/${storeData.storeSlug}`} target="_blank" rel="noopener noreferrer">
            <Button variant="outline" leftIcon={<Eye className="w-4 h-4" />}>
              ดูหน้าร้าน
            </Button>
          </a>
          <Button
            onClick={handleSave}
            isLoading={isSaving}
            leftIcon={<Save className="w-4 h-4" />}
          >
            บันทึก
          </Button>
        </HStack>
      </div>

      {/* Tabs Navigation */}
      <Tabs
        tabs={tabs.map(tab => ({
          id: tab.id,
          label: tab.label,
          icon: tab.icon,
          count: tab.id === "reviews" && reviewStats.pending > 0 ? reviewStats.pending : undefined
        }))}
        activeTab={activeTab}
        onChange={(id) => setActiveTab(id as TabId)}
        variant="pills"
      />

      {/* Tab Content */}
      <div className="animate-fade-in">
        {activeTab === "overview" && (
          <StoreOverview
            currentTheme={currentTheme}
            storeData={storeData}
            storeUrl={storeUrl}
            storeStats={storeStats}
            handleCopy={handleCopy}
            copied={copied}
          />
        )}

        {activeTab === "decoration" && (
          <StoreDecoration
            currentTheme={currentTheme}
            storeData={storeData}
            storeStats={storeStats}
            selectedTheme={selectedTheme}
            setSelectedTheme={setSelectedTheme}
            themes={themes}
            setDirty={setDirty}
          />
        )}

        {activeTab === "services" && (
          <StoreServices
            services={services}
            publicServices={publicServices}
            featuredServices={featuredServices}
            toggleFeatured={toggleFeatured}
          />
        )}

        {activeTab === "reviews" && (
          <StoreReviews
            reviews={mockReviews}
            reviewStats={reviewStats}
            replyingTo={replyingTo}
            setReplyingTo={setReplyingTo}
            replyText={replyText}
            setReplyText={setReplyText}
          />
        )}

        {activeTab === "promotions" && (
          <StorePromotions
            storeSettings={storeSettings}
            setStoreSettings={setStoreSettings}
            setDirty={setDirty}
          />
        )}

        {activeTab === "settings" && (
          <StoreSettings
            storeData={storeData}
            setStoreData={setStoreData}
            storeSettings={storeSettings}
            setStoreSettings={setStoreSettings}
            storeUrl={storeUrl}
            activeSettingSection={activeSettingSection}
            setActiveSettingSection={setActiveSettingSection}
            handleCopy={handleCopy}
            copied={copied}
            setDirty={setDirty}
          />
        )}
      </div>
    </div>
  );
}
