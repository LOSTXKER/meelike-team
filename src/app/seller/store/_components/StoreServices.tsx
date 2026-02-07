import Link from "next/link";
import { Card, Badge, Button } from "@/components/ui";
import { formatCurrency } from "@/lib/utils";
import type { StoreService } from "@/types";
import { PlatformIcon } from "@/components/seller";
import {
  Crown,
  GripVertical,
  Layers,
  Megaphone,
  Package,
  Settings,
  Star,
  AlertCircle,
  Globe,
  ArrowRight,
  Plus,
  CheckCircle,
} from "lucide-react";

interface StoreServicesProps {
  services: StoreService[];
  publicServices: StoreService[];
  featuredServices: string[];
  toggleFeatured: (serviceId: string) => void;
}

export function StoreServices({
  services,
  publicServices,
  featuredServices,
  toggleFeatured,
}: StoreServicesProps) {
  return (
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
  );
}
