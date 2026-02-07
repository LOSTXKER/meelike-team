import { Card, Badge, Avatar, Button } from "@/components/ui";
import type { StoreTheme } from "@/types";
import {
  Camera,
  ExternalLink,
  Palette,
  Check,
  Star,
  Sparkles,
  CheckCircle,
  Image as ImageIcon,
} from "lucide-react";

interface ThemeOption {
  value: StoreTheme;
  label: string;
  color: string;
  gradient: string;
}

interface StoreDecorationProps {
  currentTheme: { gradient: string };
  storeData: { storeName: string; storeSlug: string; bio: string };
  storeStats: { rating: number };
  selectedTheme: StoreTheme;
  setSelectedTheme: (theme: StoreTheme) => void;
  themes: ThemeOption[];
  setDirty: () => void;
}

export function StoreDecoration({
  currentTheme,
  storeData,
  storeStats,
  selectedTheme,
  setSelectedTheme,
  themes,
  setDirty,
}: StoreDecorationProps) {
  return (
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
                  onClick={() => { setSelectedTheme(theme.value); setDirty(); }}
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
  );
}
