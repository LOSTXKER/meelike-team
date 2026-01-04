"use client";

import { Badge, Select } from "@/components/ui";
import { ServiceTypeBadge } from "@/components/shared";
import { PlatformIcon } from "./platform-icon";
import { ServiceTypeIcon } from "./service-type-icon";
import { VISIBILITY_OPTIONS } from "@/lib/constants/services";
import { formatCurrency } from "@/lib/utils";
import { Edit2, Trash2 } from "lucide-react";
import type { StoreService } from "@/types";

interface ServiceRowProps {
  service: StoreService;
  isSelected?: boolean;
  showCheckbox?: boolean;
  onSelect?: (id: string) => void;
  onToggleActive?: (id: string) => void;
  onUpdateVisibility?: (id: string, showInStore: boolean) => void;
  onEdit?: (service: StoreService) => void;
  onDelete?: (id: string) => void;
}

export function ServiceRow({
  service,
  isSelected = false,
  showCheckbox = false,
  onSelect,
  onToggleActive,
  onUpdateVisibility,
  onEdit,
  onDelete,
}: ServiceRowProps) {
  return (
    <tr className={`hover:bg-brand-bg/30 transition-colors ${!service.isActive ? "opacity-60" : ""}`}>
      {/* Checkbox */}
      {showCheckbox && (
        <td className="p-4">
          <input
            type="checkbox"
            checked={isSelected}
            onChange={() => onSelect?.(service.id)}
            className="w-4 h-4 rounded border-gray-300 text-brand-primary focus:ring-brand-primary cursor-pointer"
          />
        </td>
      )}
      
      {/* Service Name */}
      <td className="p-4">
        <div className="flex flex-col">
          <span className={`font-bold text-sm ${service.isActive ? "text-brand-text-dark" : "text-gray-500"}`}>
            {service.name}
          </span>
          <span className="text-xs text-brand-text-light mt-0.5 flex items-center gap-1.5">
            <ServiceTypeBadge type={service.serviceType} size="sm" showIcon={false} />
            {service.minQuantity} - {service.maxQuantity.toLocaleString()}
          </span>
        </div>
      </td>
      
      {/* Platform */}
      <td className="p-4">
        <PlatformIcon platform={service.category} showLabel />
      </td>
      
      {/* Service Type */}
      <td className="p-4 text-center">
        <ServiceTypeIcon type={service.type} useEmoji showLabel />
      </td>
      
      {/* Cost / Worker Rate */}
      <td className="p-4 text-right">
        {service.serviceType === "human" ? (
          <div>
            <span className="text-xs text-purple-500 italic">กรอกตอนสร้าง Job</span>
          </div>
        ) : (
          <span className="text-sm text-brand-text-light font-medium">
            {formatCurrency(service.costPrice || 0)}
          </span>
        )}
      </td>
      
      {/* Sell Price */}
      <td className="p-4 text-right">
        <span className="text-sm font-bold text-brand-text-dark">
          {formatCurrency(service.sellPrice)}
        </span>
      </td>
      
      {/* Profit */}
      <td className="p-4 text-right">
        {service.serviceType === "human" ? (
          <span className="text-xs text-brand-text-light italic">-</span>
        ) : (
          (() => {
            const cost = service.costPrice || 0;
            const profit = service.sellPrice - cost;
            const margin = service.sellPrice > 0 ? (profit / service.sellPrice) * 100 : 0;
            
            return (
              <>
                <div className="text-sm font-medium text-brand-success">
                  +{formatCurrency(profit)}
                </div>
                <div className="text-[10px] text-brand-success/80">
                  {Math.round(margin)}%
                </div>
              </>
            );
          })()
        )}
      </td>
      
      {/* Estimated Time */}
      <td className="p-4 text-center">
        <div className="text-sm text-brand-text-dark whitespace-nowrap">
          {service.estimatedTime || <span className="text-brand-text-light italic">ไม่ระบุ</span>}
        </div>
      </td>
      
      {/* Show In Store Dropdown */}
      <td className="p-4">
        <Select
          value={service.showInStore ? "true" : "false"}
          onChange={(e) => onUpdateVisibility?.(service.id, e.target.value === "true")}
          options={VISIBILITY_OPTIONS}
          className="w-full min-w-[160px] text-sm"
        />
      </td>
      
      {/* Status Toggle */}
      <td className="p-4 text-center">
        <button
          onClick={() => onToggleActive?.(service.id)}
          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-brand-primary/20 ${
            service.isActive ? 'bg-brand-success' : 'bg-gray-200'
          }`}
        >
          <span
            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
              service.isActive ? 'translate-x-6' : 'translate-x-1'
            }`}
          />
        </button>
      </td>
      
      {/* Actions */}
      <td className="p-4 text-center">
        <div className="flex items-center justify-center gap-1">
          <button 
            onClick={() => onEdit?.(service)}
            className="p-2 rounded-lg text-brand-text-light hover:text-brand-primary hover:bg-brand-primary/10 transition-colors"
            title="แก้ไข"
          >
            <Edit2 className="w-4 h-4" />
          </button>
          <button 
            onClick={() => onDelete?.(service.id)}
            className="p-2 rounded-lg text-brand-text-light hover:text-brand-error hover:bg-brand-error/10 transition-colors"
            title="ลบ"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </td>
    </tr>
  );
}
