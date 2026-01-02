"use client";

import { Input, Select, Textarea } from "@/components/ui";
import { VISIBILITY_OPTIONS } from "@/lib/constants/services";
import type { StoreService } from "@/types";

interface ServiceFormProps {
  service?: StoreService | null;
  onSubmit?: (data: Partial<StoreService>) => void;
}

export function ServiceForm({ service, onSubmit }: ServiceFormProps) {
  return (
    <div className="space-y-5">
      {/* Service Name */}
      <Input
        label="ชื่อบริการ"
        name="name"
        placeholder="เช่น ไลค์ Facebook (Bot)"
        defaultValue={service?.name}
        required
      />

      {/* Description */}
      <Textarea
        label="รายละเอียด"
        name="description"
        placeholder="อธิบายบริการของคุณ..."
        defaultValue={service?.description}
        rows={3}
      />

      {/* Platform & Type Row */}
      <div className="grid grid-cols-2 gap-4">
        <Select
          label="แพลตฟอร์ม"
          name="category"
          options={[
            { value: "facebook", label: "🔵 Facebook" },
            { value: "instagram", label: "📸 Instagram" },
            { value: "tiktok", label: "🎵 Tiktok" },
            { value: "youtube", label: "▶️ YouTube" },
          ]}
          defaultValue={service?.category || "facebook"}
        />
        <Select
          label="ประเภท"
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
      </div>

      {/* Service Mode */}
      <Select
        label="รูปแบบบริการ"
        name="serviceType"
        options={[
          { value: "bot", label: "งานเว็บ (เร็ว ราคาถูก)" },
          { value: "human", label: "งานกดมือ (คุณภาพสูง)" },
        ]}
        defaultValue={service?.serviceType || "bot"}
      />

      {/* Visibility */}
      <div>
        <label className="block text-sm font-medium text-brand-text-dark mb-2">
          การแสดงผลในร้าน
        </label>
        <Select
          name="showInStore"
          options={[
            { value: "true", label: "🌐 แสดงในร้าน - ลูกค้าเห็นในหน้าร้านสาธารณะ" },
            { value: "false", label: "👁️‍🗨️ ซ่อนจากร้าน - ไม่แสดงในหน้าร้าน" },
          ]}
          defaultValue={service?.showInStore !== false ? "true" : "false"}
          className="w-full"
        />
        <p className="text-xs text-brand-text-light mt-1.5">
          บริการที่ซ่อนจะไม่แสดงในหน้าร้าน แต่ยังสามารถสร้าง Manual Order ได้
        </p>
      </div>

      {/* Pricing Row */}
      <div className="grid grid-cols-2 gap-4">
        <Input
          label="ต้นทุน (บาท/หน่วย)"
          name="costPrice"
          type="number"
          step="0.01"
          min="0"
          placeholder="0.08"
          defaultValue={service?.costPrice}
        />
        <Input
          label="ราคาขาย (บาท/หน่วย)"
          name="sellPrice"
          type="number"
          step="0.01"
          min="0"
          placeholder="0.15"
          defaultValue={service?.sellPrice}
        />
      </div>

      {/* Quantity Row */}
      <div className="grid grid-cols-2 gap-4">
        <Input
          label="จำนวนขั้นต่ำ"
          name="minQuantity"
          type="number"
          min="1"
          placeholder="100"
          defaultValue={service?.minQuantity}
        />
        <Input
          label="จำนวนสูงสุด"
          name="maxQuantity"
          type="number"
          min="1"
          placeholder="10000"
          defaultValue={service?.maxQuantity}
        />
      </div>

      {/* Estimated Time */}
      <Input
        label="เวลาส่งมอบ"
        name="estimatedTime"
        placeholder="เช่น 24-48 ชั่วโมง, 1-3 วัน"
        defaultValue={service?.estimatedTime}
      />
    </div>
  );
}
