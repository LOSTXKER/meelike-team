"use client";

import { useState } from "react";
import Link from "next/link";
import { useAuthStore } from "@/lib/store";
import { Card, Button, Input, Textarea, Badge, Avatar, Select, Tabs, Switch } from "@/components/ui";
import { HStack } from "@/components/layout";
import { formatCurrency } from "@/lib/utils";
import type { StoreTheme, StoreService } from "@/types";
import { useSellerServices } from "@/lib/api/hooks";
import { PlatformIcon, ServiceCard } from "@/components/seller";
import { 
  Camera, 
  Save, 
  ExternalLink, 
  Copy, 
  Palette, 
  Check, 
  Store, 
  Eye,
  Star,
  TrendingUp,
  Users,
  Globe,
  ChevronRight,
  Sparkles,
  CheckCircle,
  Package,
  ArrowRight,
  BarChart3,
  GripVertical,
  Crown,
  Zap,
  Image as ImageIcon,
  LayoutGrid,
  Layers,
  Settings,
  Megaphone,
  Clock,
  ThumbsUp,
  MessageSquare,
  MoreHorizontal,
  Code,
  Link as LinkIcon,
  QrCode,
  Shield,
  Eye as EyeIcon,
  Percent,
  Tag,
  Gift,
  AlertCircle,
  Plus,
} from "lucide-react";

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

// Settings sidebar configuration
type SettingSection = "info" | "display" | "links" | "advanced";

const settingsSections: { id: SettingSection; label: string; icon: any; desc: string }[] = [
  { id: "info", label: "ข้อมูลร้านค้า", icon: Store, desc: "ชื่อร้าน URL คำอธิบาย" },
  { id: "display", label: "การแสดงผล", icon: EyeIcon, desc: "สาธารณะ ราคา รีวิว" },
  { id: "links", label: "ลิงก์และโค้ด", icon: Code, desc: "URL, QR Code, Embed" },
  { id: "advanced", label: "ขั้นสูง", icon: Shield, desc: "API, Webhook" },
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

  const handleSave = async () => {
    setIsSaving(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setIsSaving(false);
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

  const storeUrl = `seller.meelike.com/s/${storeData.storeSlug}`;
  const currentTheme = themes.find(t => t.value === selectedTheme) || themes[0];

  // Calculate stats
  const activeServices = services.filter((s: StoreService) => s.isActive);
  const publicServices = services.filter((s: StoreService) => s.isActive && s.showInStore);

  // Store performance stats (from seed data)
  const storeStats = {
    totalSales: seller?.totalRevenue || 0,
    monthlyOrders: seller?.totalOrders || 0,
    rating: seller?.rating || 0,
    ratingCount: seller?.ratingCount || 0,
    visitors: 1250, // TODO: Implement analytics tracking
    conversionRate: 12.5, // TODO: Calculate from analytics
    responseRate: 98, // TODO: Calculate from orders
    avgDeliveryTime: "2.5 ชม.", // TODO: Calculate from completed orders
  };

  // Group services by platform
  const servicesByPlatform = services.reduce((acc: Record<string, StoreService[]>, service: StoreService) => {
    if (!acc[service.category]) {
      acc[service.category] = [];
    }
    acc[service.category].push(service);
    return acc;
  }, {} as Record<string, StoreService[]>);

  // Review stats
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
        {/* ===== OVERVIEW TAB ===== */}
        {activeTab === "overview" && (
          <div className="space-y-6">
            {/* Store Preview Card */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <Card className="overflow-hidden border-none shadow-lg">
                <div className={`h-24 bg-gradient-to-r ${currentTheme.gradient} relative`} />
                <div className="p-5 -mt-12">
                  <div className="flex items-end gap-4 mb-4">
                    <Avatar 
                      fallback={storeData.storeName} 
                      size="lg" 
                      className="w-20 h-20 border-4 border-white shadow-lg"
                    />
                    <div className="pb-1 flex-1">
                      <div className="flex items-center gap-2">
                        <h3 className="font-bold text-brand-text-dark">{storeData.storeName}</h3>
                        <Badge variant="success" size="sm">
                          <CheckCircle className="w-3 h-3 mr-0.5" />
                          Verified
                        </Badge>
                      </div>
                      <div className="flex items-center gap-1 text-amber-500 mt-0.5">
                        <Star className="w-3.5 h-3.5 fill-current" />
                        <span className="text-sm font-medium">{storeStats.rating}</span>
                        <span className="text-brand-text-light text-xs">({storeStats.ratingCount} รีวิว)</span>
                      </div>
                    </div>
                  </div>
                  <p className="text-sm text-brand-text-light mb-4 line-clamp-2">{storeData.bio}</p>
                  <div className="flex items-center gap-2 p-2 bg-brand-bg/50 rounded-lg">
                    <Globe className="w-4 h-4 text-brand-text-light" />
                    <span className="text-sm font-mono text-brand-text-dark flex-1 truncate">{storeUrl}</span>
                    <button 
                      onClick={() => handleCopy(`https://${storeUrl}`, "url")}
                      className="p-1.5 hover:bg-white rounded-lg transition-colors"
                    >
                      {copied === "url" ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4 text-brand-text-light" />}
                    </button>
                  </div>
                </div>
              </Card>

              {/* Quick Stats */}
              <div className="lg:col-span-2 grid grid-cols-2 sm:grid-cols-4 gap-4">
                <Card className="p-4 border-none shadow-md bg-gradient-to-br from-brand-primary/5 to-white">
                  <div className="flex flex-col">
                    <div className="p-2 bg-brand-primary/10 rounded-lg w-fit mb-2">
                      <TrendingUp className="w-5 h-5 text-brand-primary" />
                    </div>
                    <p className="text-xl font-bold text-brand-text-dark">{formatCurrency(storeStats.totalSales)}</p>
                    <p className="text-xs text-brand-text-light">ยอดขายรวม</p>
                  </div>
                </Card>
                
                <Card className="p-4 border-none shadow-md bg-gradient-to-br from-blue-50 to-white">
                  <div className="flex flex-col">
                    <div className="p-2 bg-blue-100 rounded-lg w-fit mb-2">
                      <Package className="w-5 h-5 text-blue-600" />
                    </div>
                    <p className="text-xl font-bold text-brand-text-dark">{storeStats.monthlyOrders}</p>
                    <p className="text-xs text-brand-text-light">ออเดอร์/เดือน</p>
                  </div>
                </Card>
                
                <Card className="p-4 border-none shadow-md bg-gradient-to-br from-amber-50 to-white">
                  <div className="flex flex-col">
                    <div className="p-2 bg-amber-100 rounded-lg w-fit mb-2">
                      <Star className="w-5 h-5 text-amber-600" />
                    </div>
                    <div className="flex items-center gap-1">
                      <p className="text-xl font-bold text-brand-text-dark">{storeStats.rating}</p>
                      <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                    </div>
                    <p className="text-xs text-brand-text-light">คะแนนร้าน</p>
                  </div>
                </Card>
                
                <Card className="p-4 border-none shadow-md bg-gradient-to-br from-green-50 to-white">
                  <div className="flex flex-col">
                    <div className="p-2 bg-green-100 rounded-lg w-fit mb-2">
                      <Users className="w-5 h-5 text-green-600" />
                    </div>
                    <p className="text-xl font-bold text-brand-text-dark">{storeStats.visitors.toLocaleString()}</p>
                    <p className="text-xs text-brand-text-light">ผู้เข้าชม/เดือน</p>
                  </div>
                </Card>

                <Card className="p-4 border-none shadow-md bg-gradient-to-br from-purple-50 to-white">
                  <div className="flex flex-col">
                    <div className="p-2 bg-purple-100 rounded-lg w-fit mb-2">
                      <Zap className="w-5 h-5 text-purple-600" />
                    </div>
                    <p className="text-xl font-bold text-brand-text-dark">{storeStats.conversionRate}%</p>
                    <p className="text-xs text-brand-text-light">Conversion</p>
                  </div>
                </Card>

                <Card className="p-4 border-none shadow-md bg-gradient-to-br from-cyan-50 to-white">
                  <div className="flex flex-col">
                    <div className="p-2 bg-cyan-100 rounded-lg w-fit mb-2">
                      <MessageSquare className="w-5 h-5 text-cyan-600" />
                    </div>
                    <p className="text-xl font-bold text-brand-text-dark">{storeStats.responseRate}%</p>
                    <p className="text-xs text-brand-text-light">ตอบกลับ</p>
                  </div>
                </Card>

                <Card className="p-4 border-none shadow-md bg-gradient-to-br from-rose-50 to-white">
                  <div className="flex flex-col">
                    <div className="p-2 bg-rose-100 rounded-lg w-fit mb-2">
                      <Clock className="w-5 h-5 text-rose-600" />
                    </div>
                    <p className="text-xl font-bold text-brand-text-dark">{storeStats.avgDeliveryTime}</p>
                    <p className="text-xs text-brand-text-light">ส่งงานเฉลี่ย</p>
                  </div>
                </Card>

                <Link href="/seller/analytics" className="contents">
                  <Card className="p-4 border-none shadow-md bg-gradient-to-br from-indigo-50 to-white hover:shadow-lg transition-shadow cursor-pointer group">
                    <div className="flex flex-col h-full justify-between">
                      <div className="p-2 bg-indigo-100 rounded-lg w-fit mb-2 group-hover:scale-110 transition-transform">
                        <BarChart3 className="w-5 h-5 text-indigo-600" />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-indigo-600">ดู Analytics</p>
                        <p className="text-xs text-brand-text-light">สถิติเชิงลึก →</p>
                      </div>
                    </div>
                  </Card>
                </Link>
              </div>
            </div>
          </div>
        )}

        {/* ===== DECORATION TAB ===== */}
        {activeTab === "decoration" && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left: Preview */}
            <div className="space-y-6">
              <Card className="overflow-hidden border-none shadow-lg">
                <div className={`h-28 bg-gradient-to-r ${currentTheme.gradient} relative`}>
                  <button className="absolute top-3 right-3 p-2 bg-black/30 hover:bg-black/50 rounded-lg transition-colors text-white">
                    <ImageIcon className="w-4 h-4" />
                  </button>
                  <div className="absolute bottom-2 left-3 text-white/70 text-xs flex items-center gap-1">
                    <ImageIcon className="w-3 h-3" />
                    คลิกเพื่ออัพโหลดแบนเนอร์
                  </div>
                </div>
                <div className="p-5 -mt-14">
                  <div className="flex items-end gap-4 mb-4">
                    <div className="relative">
                      <Avatar 
                        fallback={storeData.storeName} 
                        size="lg" 
                        className="w-24 h-24 border-4 border-white shadow-lg"
                      />
                      <button className="absolute -bottom-1 -right-1 p-2 bg-brand-primary text-white rounded-full shadow-lg hover:scale-110 transition-transform">
                        <Camera className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                  <h3 className="font-bold text-lg text-brand-text-dark mb-1">{storeData.storeName}</h3>
                  <div className="flex items-center gap-2 mb-3">
                    <div className="flex items-center gap-1 text-amber-500">
                      <Star className="w-4 h-4 fill-current" />
                      <span className="font-medium">{storeStats.rating}</span>
                    </div>
                    <Badge variant="success" size="sm">
                      <CheckCircle className="w-3 h-3 mr-0.5" />
                      Verified
                    </Badge>
                  </div>
                  <p className="text-sm text-brand-text-light line-clamp-3">{storeData.bio}</p>
                </div>
                <div className="px-5 pb-5">
                  <a href={`/s/${storeData.storeSlug}`} target="_blank" rel="noopener noreferrer">
                    <Button variant="outline" size="sm" className="w-full" leftIcon={<ExternalLink className="w-3.5 h-3.5" />}>
                      ดูตัวอย่างหน้าร้าน
                    </Button>
                  </a>
                </div>
              </Card>
            </div>

            {/* Right: Theme Settings */}
            <div className="lg:col-span-2 space-y-6">
              {/* Theme Selection */}
              <Card className="border-none shadow-lg">
                <div className="flex items-center justify-between p-5 border-b border-brand-border/30">
                  <div className="flex items-center gap-2">
                    <Palette className="w-5 h-5 text-brand-primary" />
                    <h2 className="font-bold text-brand-text-dark">ธีมสีร้านค้า</h2>
                  </div>
                  <Badge variant="info" size="sm">
                    <Sparkles className="w-3 h-3 mr-1" />
                    Pro
                  </Badge>
                </div>
                <div className="p-5">
                  <div className="grid grid-cols-3 sm:grid-cols-5 lg:grid-cols-9 gap-3">
                    {themes.map((theme) => (
                      <button
                        key={theme.value}
                        onClick={() => setSelectedTheme(theme.value)}
                        className={`group relative flex flex-col items-center gap-2 p-3 rounded-xl border-2 transition-all ${
                          selectedTheme === theme.value
                            ? "border-brand-primary bg-brand-primary/5"
                            : "border-transparent bg-brand-bg/50 hover:bg-brand-bg"
                        }`}
                      >
                        <div
                          className={`w-10 h-10 rounded-full shadow-sm ring-2 ring-white transition-transform group-hover:scale-110 bg-gradient-to-br ${theme.gradient}`}
                        />
                        <span className={`text-xs font-medium ${
                          selectedTheme === theme.value ? "text-brand-primary" : "text-brand-text-light"
                        }`}>
                          {theme.label}
                        </span>
                        {selectedTheme === theme.value && (
                          <div className="absolute -top-1 -right-1 w-5 h-5 bg-brand-primary text-white rounded-full flex items-center justify-center">
                            <Check className="w-3 h-3" />
                          </div>
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              </Card>

              {/* Logo & Banner Upload */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <Card className="border-none shadow-lg">
                  <div className="p-5 border-b border-brand-border/30">
                    <h3 className="font-medium text-brand-text-dark">โลโก้ร้าน</h3>
                    <p className="text-xs text-brand-text-light mt-0.5">แนะนำขนาด 200x200px</p>
                  </div>
                  <div className="p-5">
                    <div className="flex flex-col items-center gap-3">
                      <Avatar fallback={storeData.storeName} size="xl" className="w-24 h-24" />
                      <Button variant="outline" size="sm" leftIcon={<Camera className="w-4 h-4" />}>
                        เปลี่ยนโลโก้
                      </Button>
                    </div>
                  </div>
                </Card>

                <Card className="border-none shadow-lg">
                  <div className="p-5 border-b border-brand-border/30">
                    <h3 className="font-medium text-brand-text-dark">แบนเนอร์ร้าน</h3>
                    <p className="text-xs text-brand-text-light mt-0.5">แนะนำขนาด 1200x400px</p>
                  </div>
                  <div className="p-5">
                    <div className={`h-24 bg-gradient-to-r ${currentTheme.gradient} rounded-xl relative overflow-hidden group cursor-pointer`}>
                      <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <div className="text-center text-white">
                          <ImageIcon className="w-8 h-8 mx-auto mb-1" />
                          <p className="text-sm font-medium">คลิกเพื่ออัพโหลด</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>
              </div>
            </div>
          </div>
        )}

        {/* ===== SERVICES TAB ===== */}
        {activeTab === "services" && (
          <div className="space-y-6">
            {/* Info Banner */}
            <div className="p-4 bg-blue-50 rounded-xl border border-blue-100">
              <div className="flex items-start gap-3">
                <div className="p-2 bg-blue-100 rounded-lg shrink-0">
                  <AlertCircle className="w-5 h-5 text-blue-600" />
                </div>
                <div className="flex-1">
                  <p className="font-medium text-blue-900 text-sm mb-1">จัดวางบริการในหน้าร้าน</p>
                  <p className="text-xs text-blue-700 mb-2">
                    เลือกบริการที่ต้องการแสดงเป็นบริการเด่นในหน้าแรกร้านค้า (สูงสุด 6 รายการ) และจัดลำดับการแสดงผล
                    <br />
                    <span className="inline-flex items-center gap-1 mt-1">
                      <Globe className="w-3 h-3" />
                      แสดงเฉพาะบริการที่ <strong>แสดงในร้าน</strong> เท่านั้น (บริการที่ซ่อนจะไม่ปรากฏ)
                    </span>
                  </p>
                  <Link href="/seller/services">
                    <Button variant="ghost" size="sm" className="text-blue-600 hover:bg-blue-100 -ml-2" rightIcon={<ArrowRight className="w-3.5 h-3.5" />}>
                      ต้องการเพิ่ม/แก้ไขบริการ? ไปที่หน้าจัดการบริการ
                    </Button>
                  </Link>
                </div>
              </div>
            </div>

            {services.length === 0 ? (
              /* No Services Yet */
              <Card className="border-none shadow-lg">
                <div className="p-12 text-center">
                  <div className="w-20 h-20 bg-brand-bg rounded-full flex items-center justify-center mx-auto mb-4">
                    <Package className="w-10 h-10 text-brand-text-light opacity-50" />
                  </div>
                  <h3 className="font-bold text-lg text-brand-text-dark mb-2">ยังไม่มีบริการในร้าน</h3>
                  <p className="text-sm text-brand-text-light mb-6 max-w-md mx-auto">
                    คุณต้องเพิ่มบริการในหน้าจัดการบริการก่อน จึงจะสามารถนำมาจัดวางในร้านได้
                  </p>
                  <Link href="/seller/services">
                    <Button leftIcon={<Plus className="w-4 h-4" />}>
                      ไปเพิ่มบริการ
                    </Button>
                  </Link>
                </div>
              </Card>
            ) : (
              <>
                {/* Featured Services */}
                <Card className="border-none shadow-lg">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-5 border-b border-brand-border/30">
                    <div className="flex items-center gap-2">
                      <Crown className="w-5 h-5 text-amber-500" />
                      <h2 className="font-bold text-brand-text-dark">บริการเด่น</h2>
                      <Badge variant="default" size="sm">{featuredServices.length}/6</Badge>
                    </div>
                    <p className="text-xs text-brand-text-light flex items-center gap-1.5">
                      <GripVertical className="w-3.5 h-3.5" />
                      แสดงบนหน้าแรกร้านค้า • ลากเพื่อจัดลำดับ
                    </p>
                  </div>
                  <div className="p-5">
                    {featuredServices.length === 0 ? (
                      <div className="text-center py-8">
                        <div className="w-16 h-16 bg-amber-50 rounded-full flex items-center justify-center mx-auto mb-3">
                          <Megaphone className="w-8 h-8 text-amber-400" />
                        </div>
                        <p className="font-medium text-brand-text-dark mb-1">ยังไม่มีบริการเด่น</p>
                        <p className="text-xs text-brand-text-light mb-4">เลือกบริการที่ต้องการแสดงจากด้านล่าง</p>
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                        {featuredServices.map((serviceId, index) => {
                          const service = services.find((s: StoreService) => s.id === serviceId);
                          if (!service) return null;
                          return (
                            <div 
                              key={serviceId}
                              className="group relative flex items-center gap-3 p-3 bg-gradient-to-r from-amber-50 to-white border border-amber-200 rounded-xl hover:shadow-md transition-all"
                            >
                              <div className="p-1.5 bg-white rounded-lg shadow-sm cursor-grab active:cursor-grabbing">
                                <GripVertical className="w-4 h-4 text-amber-600" />
                              </div>
                              <div className="flex items-center gap-2 flex-1 min-w-0">
                                <PlatformIcon platform={service.category} />
                                <div className="min-w-0">
                                  <p className="text-sm font-medium text-brand-text-dark truncate">{service.name}</p>
                                  <p className="text-xs text-brand-text-light">{formatCurrency(service.sellPrice)}/หน่วย</p>
                                </div>
                              </div>
                              <Badge variant="warning" size="sm" className="shrink-0 bg-amber-100 text-amber-700">#{index + 1}</Badge>
                              <button 
                                onClick={() => toggleFeatured(serviceId)}
                                className="absolute -top-2 -right-2 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600 shadow-md"
                                title="ลบออกจากบริการเด่น"
                              >
                                <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                              </button>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                </Card>

                {/* Available Services to Add */}
                <Card className="border-none shadow-lg">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-5 border-b border-brand-border/30">
                    <div className="flex items-center gap-2">
                      <Layers className="w-5 h-5 text-brand-primary" />
                      <h2 className="font-bold text-brand-text-dark">เลือกบริการเพิ่มเติม</h2>
                      <Badge variant="default" size="sm">{publicServices.length} บริการ</Badge>
                    </div>
                    <Link href="/seller/services">
                      <Button variant="outline" size="sm" leftIcon={<Settings className="w-3.5 h-3.5" />}>
                        จัดการบริการ
                      </Button>
                    </Link>
                  </div>
                  
                  <div className="p-5">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                      {publicServices.map((service: StoreService) => {
                        const isFeatured = featuredServices.includes(service.id);
                        const canAdd = featuredServices.length < 6;
                        
                        if (isFeatured) return null; // Don't show featured services here
                        
                        return (
                          <div 
                            key={service.id}
                            className="flex items-center gap-3 p-3 bg-white border border-brand-border/50 rounded-xl hover:border-brand-primary/30 hover:shadow-sm transition-all"
                          >
                            <PlatformIcon platform={service.category} showBackground />
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium text-brand-text-dark truncate">{service.name}</p>
                              <div className="flex items-center gap-2 text-xs text-brand-text-light">
                                <span className="font-medium text-brand-primary">{formatCurrency(service.sellPrice)}</span>
                                <span>•</span>
                                <span>{service.orderCount?.toLocaleString() || 0} ขาย</span>
                              </div>
                            </div>
                            <button
                              onClick={() => canAdd && toggleFeatured(service.id)}
                              disabled={!canAdd}
                              className={`p-2 rounded-lg transition-all ${
                                canAdd
                                  ? 'bg-amber-50 text-amber-600 hover:bg-amber-100'
                                  : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                              }`}
                              title={canAdd ? 'เพิ่มเป็นบริการเด่น' : 'บริการเด่นเต็มแล้ว (สูงสุด 6)'}
                            >
                              <Star className="w-4 h-4" />
                            </button>
                          </div>
                        );
                      })}
                    </div>
                    
                    {publicServices.filter((s: StoreService) => !featuredServices.includes(s.id)).length === 0 && (
                      <div className="text-center py-8 text-brand-text-light">
                        <CheckCircle className="w-12 h-12 mx-auto mb-3 text-green-500 opacity-50" />
                        <p className="font-medium text-brand-text-dark mb-1">เพิ่มบริการเด่นครบแล้ว!</p>
                        <p className="text-xs">บริการที่แสดงในร้านทั้งหมดถูกเลือกเป็นบริการเด่นแล้ว</p>
                      </div>
                    )}
                  </div>
                </Card>
              </>
            )}
          </div>
        )}

        {/* ===== REVIEWS TAB ===== */}
        {activeTab === "reviews" && (
          <div className="space-y-6">
            {/* Review Stats */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <Card className="p-4 border-none shadow-md">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 bg-amber-100 rounded-xl">
                    <Star className="w-5 h-5 text-amber-600" />
                  </div>
                  <div>
                    <div className="flex items-center gap-1">
                      <p className="text-xl font-bold text-brand-text-dark">{reviewStats.avgRating.toFixed(1)}</p>
                      <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
                    </div>
                    <p className="text-xs text-brand-text-light">คะแนนเฉลี่ย</p>
                  </div>
                </div>
              </Card>
              
              <Card className="p-4 border-none shadow-md">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 bg-blue-100 rounded-xl">
                    <MessageSquare className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-xl font-bold text-brand-text-dark">{reviewStats.total}</p>
                    <p className="text-xs text-brand-text-light">รีวิวทั้งหมด</p>
                  </div>
                </div>
              </Card>
              
              <Card className="p-4 border-none shadow-md">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 bg-orange-100 rounded-xl">
                    <Clock className="w-5 h-5 text-orange-600" />
                  </div>
                  <div>
                    <p className="text-xl font-bold text-brand-text-dark">{reviewStats.pending}</p>
                    <p className="text-xs text-brand-text-light">รอตอบกลับ</p>
                  </div>
                </div>
              </Card>
              
              <Card className="p-4 border-none shadow-md">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 bg-green-100 rounded-xl">
                    <ThumbsUp className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <p className="text-xl font-bold text-brand-text-dark">{Math.round((mockReviews.filter(r => r.rating >= 4).length / mockReviews.length) * 100)}%</p>
                    <p className="text-xs text-brand-text-light">รีวิวบวก</p>
                  </div>
                </div>
              </Card>
            </div>

            {/* Reviews List */}
            <Card className="border-none shadow-lg">
              <div className="flex items-center justify-between p-5 border-b border-brand-border/30">
                <h2 className="font-bold text-brand-text-dark">รีวิวจากลูกค้า</h2>
                <Select
                  options={[
                    { value: "all", label: "ทั้งหมด" },
                    { value: "pending", label: "รอตอบกลับ" },
                    { value: "replied", label: "ตอบแล้ว" },
                  ]}
                  defaultValue="all"
                  className="w-40"
                />
              </div>
              <div className="divide-y divide-brand-border/30">
                {mockReviews.map((review) => (
                  <div key={review.id} className="p-5">
                    <div className="flex items-start gap-4">
                      <Avatar fallback={review.customerName} size="md" />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2 mb-1">
                          <div className="flex items-center gap-2">
                            <span className="font-medium text-brand-text-dark">{review.customerName}</span>
                            <div className="flex items-center gap-0.5">
                              {[...Array(5)].map((_, i) => (
                                <Star 
                                  key={i} 
                                  className={`w-3.5 h-3.5 ${i < review.rating ? 'text-amber-500 fill-amber-500' : 'text-gray-200'}`} 
                                />
                              ))}
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-xs text-brand-text-light">
                              {new Date(review.createdAt).toLocaleDateString('th-TH')}
                            </span>
                            <button className="p-1 hover:bg-brand-bg rounded">
                              <MoreHorizontal className="w-4 h-4 text-brand-text-light" />
                            </button>
                          </div>
                        </div>
                        <p className="text-sm text-brand-text-dark mb-2">{review.comment}</p>
                        <div className="flex items-center gap-2 text-xs text-brand-text-light">
                          <Badge variant="default" size="sm">{review.serviceName}</Badge>
                          <span>•</span>
                          <span>{review.orderId}</span>
                        </div>

                        {/* Reply Section */}
                        {review.reply ? (
                          <div className="mt-3 p-3 bg-brand-bg/50 rounded-xl">
                            <div className="flex items-center gap-2 mb-1">
                              <Badge variant="info" size="sm">ตอบกลับ</Badge>
                              <span className="text-xs text-brand-text-light">
                                {new Date(review.repliedAt!).toLocaleDateString('th-TH')}
                              </span>
                            </div>
                            <p className="text-sm text-brand-text-dark">{review.reply}</p>
                          </div>
                        ) : replyingTo === review.id ? (
                          <div className="mt-3 space-y-2">
                            <Textarea
                              placeholder="พิมพ์ข้อความตอบกลับ..."
                              value={replyText}
                              onChange={(e) => setReplyText(e.target.value)}
                              rows={2}
                            />
                            <div className="flex justify-end gap-2">
                              <Button 
                                variant="ghost" 
                                size="sm"
                                onClick={() => { setReplyingTo(null); setReplyText(""); }}
                              >
                                ยกเลิก
                              </Button>
                              <Button size="sm">ส่งตอบกลับ</Button>
                            </div>
                          </div>
                        ) : (
                          <button 
                            onClick={() => setReplyingTo(review.id)}
                            className="mt-2 text-sm text-brand-primary hover:underline"
                          >
                            ตอบกลับ
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        )}

        {/* ===== PROMOTIONS TAB ===== */}
        {activeTab === "promotions" && (
          <div className="space-y-6">
            {/* Promo Code */}
            <Card className="border-none shadow-lg">
              <div className="flex items-center justify-between p-5 border-b border-brand-border/30">
                <div className="flex items-center gap-2">
                  <Gift className="w-5 h-5 text-pink-500" />
                  <h2 className="font-bold text-brand-text-dark">โค้ดส่วนลด</h2>
                </div>
                <button
                  onClick={() => setStoreSettings(prev => ({ ...prev, promoEnabled: !prev.promoEnabled }))}
                  className={`relative w-11 h-6 rounded-full transition-colors ${
                    storeSettings.promoEnabled ? 'bg-brand-success' : 'bg-gray-200'
                  }`}
                >
                  <span
                    className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${
                      storeSettings.promoEnabled ? 'translate-x-5' : ''
                    }`}
                  />
                </button>
              </div>
              <div className={`p-5 space-y-5 ${!storeSettings.promoEnabled ? 'opacity-50 pointer-events-none' : ''}`}>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                  <Input
                    label="รหัสโค้ด"
                    value={storeSettings.promoCode}
                    onChange={(e) => setStoreSettings(prev => ({ ...prev, promoCode: e.target.value.toUpperCase() }))}
                    placeholder="WELCOME10"
                    leftIcon={<Tag className="w-4 h-4" />}
                  />
                  <Input
                    label="ส่วนลด (%)"
                    type="number"
                    value={storeSettings.promoDiscount}
                    onChange={(e) => setStoreSettings(prev => ({ ...prev, promoDiscount: parseInt(e.target.value) || 0 }))}
                    placeholder="10"
                    leftIcon={<Percent className="w-4 h-4" />}
                  />
                  <Input
                    label="ใช้ได้ถึง"
                    type="date"
                    placeholder="กำหนดวันหมดอายุ"
                    leftIcon={<Clock className="w-4 h-4" />}
                  />
                </div>
                {storeSettings.promoEnabled && (
                  <div className="p-4 bg-gradient-to-r from-pink-50 to-purple-50 rounded-xl border border-pink-200">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="p-2 bg-white rounded-lg">
                        <Gift className="w-5 h-5 text-pink-600" />
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-brand-text-dark">
                          โค้ดส่วนลดกำลังใช้งานอยู่
                        </p>
                        <p className="text-sm text-brand-text-light">
                          ลูกค้าใช้โค้ด <code className="bg-pink-100 px-2 py-0.5 rounded font-semibold text-pink-700">{storeSettings.promoCode}</code> ลด {storeSettings.promoDiscount}%
                        </p>
                      </div>
                    </div>
                    <div className="grid grid-cols-3 gap-3 pt-3 border-t border-pink-200">
                      <div className="text-center">
                        <p className="text-xl font-bold text-brand-text-dark">24</p>
                        <p className="text-xs text-brand-text-light">ถูกใช้แล้ว</p>
                      </div>
                      <div className="text-center">
                        <p className="text-xl font-bold text-brand-text-dark">฿1,850</p>
                        <p className="text-xs text-brand-text-light">ส่วนลดทั้งหมด</p>
                      </div>
                      <div className="text-center">
                        <p className="text-xl font-bold text-brand-text-dark">฿18,500</p>
                        <p className="text-xs text-brand-text-light">ยอดขายจากโค้ด</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </Card>

            {/* Flash Sale - Coming Soon */}
            <Card className="border-none shadow-lg opacity-60">
              <div className="flex items-center justify-between p-5 border-b border-brand-border/30">
                <div className="flex items-center gap-2">
                  <Zap className="w-5 h-5 text-orange-500" />
                  <h2 className="font-bold text-brand-text-dark">Flash Sale</h2>
                  <Badge variant="warning" size="sm">เร็วๆ นี้</Badge>
                </div>
              </div>
              <div className="p-5">
                <p className="text-sm text-brand-text-light text-center py-8">
                  กำลังพัฒนาฟีเจอร์ Flash Sale สำหรับลดราคาบริการแบบจำกัดเวลา
                </p>
              </div>
            </Card>

            {/* Bundle Deals - Coming Soon */}
            <Card className="border-none shadow-lg opacity-60">
              <div className="flex items-center justify-between p-5 border-b border-brand-border/30">
                <div className="flex items-center gap-2">
                  <Package className="w-5 h-5 text-blue-500" />
                  <h2 className="font-bold text-brand-text-dark">แพ็คเกจรวม</h2>
                  <Badge variant="warning" size="sm">เร็วๆ นี้</Badge>
                </div>
              </div>
              <div className="p-5">
                <p className="text-sm text-brand-text-light text-center py-8">
                  กำลังพัฒนาฟีเจอร์รวมบริการหลายอย่างขายในราคาพิเศษ
                </p>
              </div>
            </Card>
          </div>
        )}

        {/* ===== SETTINGS TAB ===== */}
        {activeTab === "settings" && (
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
                        onChange={(e) => setStoreData({ ...storeData, storeName: e.target.value })}
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
                            onChange={(checked) => setStoreSettings(prev => ({ ...prev, [item.key]: checked }))}
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
        )}
      </div>
    </div>
  );
}
