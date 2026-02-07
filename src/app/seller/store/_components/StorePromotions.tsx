import type { Dispatch, SetStateAction } from "react";
import { Card, Badge, Input } from "@/components/ui";
import {
  Gift,
  Tag,
  Percent,
  Clock,
  Zap,
  Package,
} from "lucide-react";

export interface StoreSettingsState {
  isPublic: boolean;
  showPricing: boolean;
  showReviews: boolean;
  allowDirectOrder: boolean;
  promoCode: string;
  promoDiscount: number;
  promoEnabled: boolean;
  embedCode: string;
}

interface StorePromotionsProps {
  storeSettings: StoreSettingsState;
  setStoreSettings: Dispatch<SetStateAction<StoreSettingsState>>;
  setDirty: () => void;
}

export function StorePromotions({
  storeSettings,
  setStoreSettings,
  setDirty,
}: StorePromotionsProps) {
  return (
    <div className="space-y-6">
      {/* Promo Code */}
      <Card className="border-none shadow-lg">
        <div className="flex items-center justify-between p-5 border-b border-brand-border/30">
          <div className="flex items-center gap-2">
            <Gift className="w-5 h-5 text-pink-500" />
            <h2 className="font-bold text-brand-text-dark">โค้ดส่วนลด</h2>
          </div>
          <button
            onClick={() => { setStoreSettings(prev => ({ ...prev, promoEnabled: !prev.promoEnabled })); setDirty(); }}
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
              onChange={(e) => { setStoreSettings(prev => ({ ...prev, promoCode: e.target.value.toUpperCase() })); setDirty(); }}
              placeholder="WELCOME10"
              leftIcon={<Tag className="w-4 h-4" />}
            />
            <Input
              label="ส่วนลด (%)"
              type="number"
              value={storeSettings.promoDiscount}
              onChange={(e) => { setStoreSettings(prev => ({ ...prev, promoDiscount: parseInt(e.target.value) || 0 })); setDirty(); }}
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
  );
}
