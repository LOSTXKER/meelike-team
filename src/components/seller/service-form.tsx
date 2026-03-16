"use client";

import { useState, useEffect } from "react";
import { 
  FormField, 
  FormInput, 
  FormSelect, 
  FormTextarea,
  InlineError 
} from "@/components/shared";
import { Card, Badge } from "@/components/ui";
import { VISIBILITY_OPTIONS } from "@/lib/constants/services";
import { validateServiceForm } from "@/lib/types/validators";
import type { StoreService, Platform, ServiceType, ServiceMode } from "@/types";
import { Bot, Users, DollarSign, Calculator, AlertCircle, Info } from "lucide-react";

interface ServiceFormProps {
  service?: StoreService | null;
  onSubmit?: (data: Partial<StoreService>) => void;
}

export function ServiceForm({ service, onSubmit }: ServiceFormProps) {
  const [errors, setErrors] = useState<string[]>([]);
  const [serviceMode, setServiceMode] = useState<ServiceMode>(service?.mode || "bot");
  const [costPrice, setCostPrice] = useState<number>(service?.costPrice || 0);
  const [sellPrice, setSellPrice] = useState<number>(service?.sellPrice || 0);

  // Calculate profit margin (only for bot services)
  const profitPerUnit = sellPrice - costPrice;
  const profitMargin = sellPrice > 0 ? ((profitPerUnit / sellPrice) * 100) : 0;

  const handleValidation = (e: React.FormEvent) => {
    if (onSubmit) {
      e.preventDefault();
      const formData = new FormData(e.target as HTMLFormElement);
      
      // For human services, costPrice is 0 (will be set per job)
      const finalCostPrice = serviceMode === "human" 
        ? 0 
        : parseFloat(formData.get("costPrice") as string);

      const data = {
        name: formData.get("name") as string,
        description: formData.get("description") as string,
        platform: formData.get("platform") as Platform,
        serviceType: formData.get("serviceType") as ServiceType,
        mode: serviceMode,
        costPrice: finalCostPrice,
        sellPrice: parseFloat(formData.get("sellPrice") as string),
        minQty: parseInt(formData.get("minQty") as string),
        maxQty: parseInt(formData.get("maxQty") as string),
        estimatedTime: formData.get("estimatedTime") as string,
      };

      const validation = validateServiceForm(data);
      if (!validation.valid) {
        setErrors(validation.errors);
        return;
      }

      setErrors([]);
      onSubmit(data);
    }
  };

  return (
    <form className="space-y-5" onSubmit={handleValidation}>
      {errors.length > 0 && (
        <InlineError error={errors[0]} />
      )}

      {/* Service Name */}
      <FormField label="ชื่อบริการ" required>
        <FormInput
          name="name"
          placeholder="เช่น ไลค์ Facebook (Bot)"
          defaultValue={service?.name}
        />
      </FormField>

      {/* Description */}
      <FormField label="รายละเอียด">
        <FormTextarea
          name="description"
          placeholder="อธิบายบริการของคุณ..."
          defaultValue={service?.description}
          rows={3}
          maxCharacters={500}
          showCharCount
        />
      </FormField>

      {/* Platform & Type Row */}
      <div className="grid grid-cols-2 gap-4">
        <FormField label="แพลตฟอร์ม" required>
          <FormSelect
            name="platform"
            options={[
              { value: "facebook", label: "🔵 Facebook" },
              { value: "instagram", label: "📸 Instagram" },
              { value: "tiktok", label: "🎵 Tiktok" },
              { value: "youtube", label: "▶️ YouTube" },
            ]}
            defaultValue={service?.platform || "facebook"}
          />
        </FormField>
        <FormField label="ประเภท" required>
          <FormSelect
            name="serviceType"
            options={[
              { value: "like", label: "Like" },
              { value: "comment", label: "Comment" },
              { value: "follow", label: "Follow" },
              { value: "view", label: "View" },
              { value: "share", label: "Share" },
            ]}
            defaultValue={service?.serviceType || "like"}
          />
        </FormField>
      </div>

      {/* Service Mode */}
      <FormField label="รูปแบบบริการ" required>
        <div className="grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={() => setServiceMode("bot")}
            className={`p-4 rounded-xl border-2 transition-all text-left ${
              serviceMode === "bot"
                ? "border-brand-primary bg-brand-primary/5"
                : "border-brand-border/50 hover:border-brand-border"
            }`}
          >
            <div className="flex items-center gap-3 mb-2">
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                serviceMode === "bot" ? "bg-brand-primary/10" : "bg-brand-bg"
              }`}>
                <Bot className={`w-5 h-5 ${serviceMode === "bot" ? "text-brand-primary" : "text-brand-text-light"}`} />
              </div>
              <div>
                <p className={`font-bold ${serviceMode === "bot" ? "text-brand-primary" : "text-brand-text-dark"}`}>
                  งานเว็บ (Bot)
                </p>
                <p className="text-xs text-brand-text-light">เร็ว, ราคาถูก</p>
              </div>
            </div>
            <p className="text-xs text-brand-text-light">
              ใช้ API Provider ส่งงานอัตโนมัติ
            </p>
          </button>

          <button
            type="button"
            onClick={() => setServiceMode("human")}
            className={`p-4 rounded-xl border-2 transition-all text-left ${
              serviceMode === "human"
                ? "border-brand-success bg-brand-success/5"
                : "border-brand-border/50 hover:border-brand-border"
            }`}
          >
            <div className="flex items-center gap-3 mb-2">
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                serviceMode === "human" ? "bg-brand-success/10" : "bg-brand-bg"
              }`}>
                <Users className={`w-5 h-5 ${serviceMode === "human" ? "text-brand-success" : "text-brand-text-light"}`} />
              </div>
              <div>
                <p className={`font-bold ${serviceMode === "human" ? "text-brand-success" : "text-brand-text-dark"}`}>
                  งานกดมือ (Human)
                </p>
                <p className="text-xs text-brand-text-light">คุณภาพสูง</p>
              </div>
            </div>
            <p className="text-xs text-brand-text-light">
              Worker ทำงานจริง ไม่หลุด
            </p>
          </button>
        </div>
        <input type="hidden" name="mode" value={serviceMode} />
      </FormField>

      {/* Visibility */}
      <FormField 
        label="การแสดงผลในร้าน"
        description="บริการที่ซ่อนจะไม่แสดงในหน้าร้าน แต่ยังสามารถสร้าง Manual Order ได้"
      >
        <FormSelect
          name="showInStore"
          options={[
            { value: "true", label: "🌐 แสดงในร้าน - ลูกค้าเห็นในหน้าร้านสาธารณะ" },
            { value: "false", label: "👁️‍🗨️ ซ่อนจากร้าน - ไม่แสดงในหน้าร้าน" },
          ]}
          defaultValue={service?.showInStore !== false ? "true" : "false"}
        />
      </FormField>

      {/* Pricing Section - Different UI based on service mode */}
      {serviceMode === "bot" ? (
        /* Bot Service - Direct cost input */
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-sm font-bold text-brand-text-dark">
            <DollarSign className="w-4 h-4 text-brand-primary" />
            ราคาบริการ (งานเว็บ)
          </div>
          <div className="grid grid-cols-2 gap-4">
            <FormField label="ต้นทุน API (บาท/หน่วย)" required>
              <FormInput
                name="costPrice"
                type="number"
                step="0.01"
                min="0"
                placeholder="0.08"
                value={costPrice || ""}
                onChange={(e) => setCostPrice(parseFloat(e.target.value) || 0)}
              />
              <p className="text-xs text-brand-text-light mt-1">
                ราคาจาก MeeLike หรือ Provider อื่น
              </p>
            </FormField>
            <FormField label="ราคาขาย (บาท/หน่วย)" required>
              <FormInput
                name="sellPrice"
                type="number"
                step="0.01"
                min="0"
                placeholder="0.15"
                value={sellPrice || ""}
                onChange={(e) => setSellPrice(parseFloat(e.target.value) || 0)}
              />
            </FormField>
          </div>
          
          {/* Profit Calculator - Only for Bot */}
          {sellPrice > 0 && costPrice > 0 && (
            <Card className={`p-4 border-none ${profitMargin >= 30 ? "bg-brand-success/5" : profitMargin >= 10 ? "bg-brand-warning/5" : "bg-brand-error/5"}`}>
              <div className="flex items-center gap-2 mb-3">
                <Calculator className="w-4 h-4 text-brand-text-light" />
                <span className="text-sm font-bold text-brand-text-dark">คำนวณกำไร</span>
              </div>
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <p className="text-xs text-brand-text-light mb-1">ต้นทุน</p>
                  <p className="text-lg font-bold text-brand-text-dark">
                    ฿{costPrice.toFixed(2)}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-brand-text-light mb-1">กำไร/หน่วย</p>
                  <p className={`text-lg font-bold ${profitPerUnit >= 0 ? "text-brand-success" : "text-brand-error"}`}>
                    ฿{profitPerUnit.toFixed(2)}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-brand-text-light mb-1">Margin</p>
                  <p className={`text-lg font-bold ${
                    profitMargin >= 30 ? "text-brand-success" : 
                    profitMargin >= 10 ? "text-brand-warning" : "text-brand-error"
                  }`}>
                    {profitMargin.toFixed(0)}%
                  </p>
                </div>
              </div>
              {profitMargin < 10 && (
                <div className="flex items-center gap-2 mt-3 p-2 bg-brand-error/10 rounded-lg">
                  <AlertCircle className="w-4 h-4 text-brand-error" />
                  <span className="text-xs text-brand-error font-medium">
                    Margin ต่ำเกินไป! แนะนำให้ปรับราคาขาย
                  </span>
                </div>
              )}
            </Card>
          )}
        </div>
      ) : (
        /* Human Service - Only sell price, no cost input */
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-sm font-bold text-brand-text-dark">
            <Users className="w-4 h-4 text-brand-success" />
            ราคาบริการ (งานกดมือ)
          </div>
          
          {/* Info about worker rate */}
          <div className="p-4 bg-brand-info/5 border border-brand-info/20 rounded-xl">
            <div className="flex items-start gap-3">
              <Info className="w-5 h-5 text-brand-info shrink-0 mt-0.5" />
              <div>
                <p className="font-bold text-brand-text-dark text-sm mb-1">
                  ค่าจ้าง Worker จะกรอกตอนสร้างงาน
                </p>
                <p className="text-xs text-brand-text-light">
                  ไม่ต้องกรอกต้นทุนตรงนี้ เพราะค่าจ้าง Worker จะกำหนดตอนสร้าง Job ให้ทีม
                  ซึ่งอาจต่างกันในแต่ละงาน
                </p>
              </div>
            </div>
          </div>

          <FormField label="ราคาขายลูกค้า (บาท/หน่วย)" required>
            <FormInput
              name="sellPrice"
              type="number"
              step="0.01"
              min="0"
              placeholder="0.40"
              value={sellPrice || ""}
              onChange={(e) => setSellPrice(parseFloat(e.target.value) || 0)}
            />
            <p className="text-xs text-brand-text-light mt-1">
              ราคาที่ขายให้ลูกค้า (กำไรจะคำนวณตอนสร้างงาน)
            </p>
          </FormField>
          
          {/* Hidden field for costPrice (set to 0 for human services) */}
          <input type="hidden" name="costPrice" value="0" />
        </div>
      )}

      {/* Quantity Row */}
      <div className="grid grid-cols-2 gap-4">
        <FormField label="จำนวนขั้นต่ำ" required>
          <FormInput
            name="minQty"
            type="number"
            min="1"
            placeholder="100"
            defaultValue={service?.minQty}
          />
        </FormField>
        <FormField label="จำนวนสูงสุด" required>
          <FormInput
            name="maxQty"
            type="number"
            min="1"
            placeholder="10000"
            defaultValue={service?.maxQty}
          />
        </FormField>
      </div>

      {/* Estimated Time */}
      <FormField 
        label="เวลาส่งมอบ"
        description="เช่น 24-48 ชั่วโมง, 1-3 วัน"
      >
        <FormInput
          name="estimatedTime"
          placeholder="เช่น 24-48 ชั่วโมง, 1-3 วัน"
          defaultValue={service?.estimatedTime}
        />
      </FormField>
    </form>
  );
}
