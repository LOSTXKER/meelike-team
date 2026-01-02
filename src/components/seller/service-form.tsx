"use client";

import { useState } from "react";
import { 
  FormField, 
  FormInput, 
  FormSelect, 
  FormTextarea,
  InlineError 
} from "@/components/shared";
import { VISIBILITY_OPTIONS } from "@/lib/constants/services";
import { validateServiceForm } from "@/lib/types/validators";
import type { StoreService, Platform, ServiceType, ServiceMode } from "@/types";

interface ServiceFormProps {
  service?: StoreService | null;
  onSubmit?: (data: Partial<StoreService>) => void;
}

export function ServiceForm({ service, onSubmit }: ServiceFormProps) {
  const [errors, setErrors] = useState<string[]>([]);

  const handleValidation = (e: React.FormEvent) => {
    if (onSubmit) {
      e.preventDefault();
      const formData = new FormData(e.target as HTMLFormElement);
      const data = {
        name: formData.get("name") as string,
        description: formData.get("description") as string,
        category: formData.get("category") as Platform,
        type: formData.get("type") as ServiceType,
        serviceType: formData.get("serviceType") as ServiceMode,
        costPrice: parseFloat(formData.get("costPrice") as string),
        sellPrice: parseFloat(formData.get("sellPrice") as string),
        minQuantity: parseInt(formData.get("minQuantity") as string),
        maxQuantity: parseInt(formData.get("maxQuantity") as string),
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
            name="category"
            options={[
              { value: "facebook", label: "🔵 Facebook" },
              { value: "instagram", label: "📸 Instagram" },
              { value: "tiktok", label: "🎵 Tiktok" },
              { value: "youtube", label: "▶️ YouTube" },
            ]}
            defaultValue={service?.category || "facebook"}
          />
        </FormField>
        <FormField label="ประเภท" required>
          <FormSelect
            name="type"
            options={[
              { value: "like", label: "Like" },
              { value: "comment", label: "Comment" },
              { value: "follow", label: "Follow" },
              { value: "view", label: "View" },
              { value: "share", label: "Share" },
            ]}
            defaultValue={service?.type || "like"}
          />
        </FormField>
      </div>

      {/* Service Mode */}
      <FormField label="รูปแบบบริการ" required>
        <FormSelect
          name="serviceType"
          options={[
            { value: "bot", label: "งานเว็บ (เร็ว ราคาถูก)" },
            { value: "human", label: "งานกดมือ (คุณภาพสูง)" },
          ]}
          defaultValue={service?.serviceType || "bot"}
        />
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

      {/* Pricing Row */}
      <div className="grid grid-cols-2 gap-4">
        <FormField label="ต้นทุน (บาท/หน่วย)" required>
          <FormInput
            name="costPrice"
            type="number"
            step="0.01"
            min="0"
            placeholder="0.08"
            defaultValue={service?.costPrice}
          />
        </FormField>
        <FormField label="ราคาขาย (บาท/หน่วย)" required>
          <FormInput
            name="sellPrice"
            type="number"
            step="0.01"
            min="0"
            placeholder="0.15"
            defaultValue={service?.sellPrice}
          />
        </FormField>
      </div>

      {/* Quantity Row */}
      <div className="grid grid-cols-2 gap-4">
        <FormField label="จำนวนขั้นต่ำ" required>
          <FormInput
            name="minQuantity"
            type="number"
            min="1"
            placeholder="100"
            defaultValue={service?.minQuantity}
          />
        </FormField>
        <FormField label="จำนวนสูงสุด" required>
          <FormInput
            name="maxQuantity"
            type="number"
            min="1"
            placeholder="10000"
            defaultValue={service?.maxQuantity}
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
