"use client";

import { PlatformIcon } from "./platform-icon";
import { formatCurrency } from "@/lib/utils";
import { Star, GripVertical } from "lucide-react";
import type { StoreService } from "@/types";

interface ServiceCardProps {
  service: StoreService;
  isFeatured?: boolean;
  featuredIndex?: number;
  canAddToFeatured?: boolean;
  onToggleFeatured?: (serviceId: string) => void;
  onRemoveFromFeatured?: (serviceId: string) => void;
  draggable?: boolean;
  variant?: "featured" | "selectable" | "readonly";
  className?: string;
}

export function ServiceCard({
  service,
  isFeatured = false,
  featuredIndex,
  canAddToFeatured = true,
  onToggleFeatured,
  onRemoveFromFeatured,
  draggable = false,
  variant = "selectable",
  className = "",
}: ServiceCardProps) {
  // Featured variant - for featured services section
  if (variant === "featured" && isFeatured) {
    return (
      <div 
        className={`group relative flex items-center gap-3 p-3 bg-gradient-to-r from-amber-50 to-white border border-amber-200 rounded-xl hover:shadow-md transition-all ${className}`}
      >
        {draggable && (
          <div className="p-1.5 bg-white rounded-lg shadow-sm cursor-grab active:cursor-grabbing">
            <GripVertical className="w-4 h-4 text-amber-600" />
          </div>
        )}
        <div className="flex items-center gap-2 flex-1 min-w-0">
          <PlatformIcon platform={service.category} />
          <div className="min-w-0">
            <p className="text-sm font-medium text-brand-text-dark truncate">{service.name}</p>
            <p className="text-xs text-brand-text-light">{formatCurrency(service.sellPrice)}/หน่วย</p>
          </div>
        </div>
        {featuredIndex !== undefined && (
          <span className="shrink-0 px-2 py-1 text-xs font-medium bg-amber-100 text-amber-700 rounded-lg">
            #{featuredIndex + 1}
          </span>
        )}
        {onRemoveFromFeatured && (
          <button 
            onClick={() => onRemoveFromFeatured(service.id)}
            className="absolute -top-2 -right-2 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600 shadow-md"
            title="ลบออกจากบริการเด่น"
          >
            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>
    );
  }

  // Selectable variant - for selecting services to add to featured
  return (
    <div 
      className={`flex items-center gap-3 p-3 bg-white border border-brand-border/50 rounded-xl hover:border-brand-primary/30 hover:shadow-sm transition-all ${className}`}
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
      {onToggleFeatured && (
        <button
          onClick={() => canAddToFeatured && onToggleFeatured(service.id)}
          disabled={!canAddToFeatured}
          className={`p-2 rounded-lg transition-all ${
            canAddToFeatured
              ? 'bg-amber-50 text-amber-600 hover:bg-amber-100'
              : 'bg-gray-100 text-gray-400 cursor-not-allowed'
          }`}
          title={canAddToFeatured ? 'เพิ่มเป็นบริการเด่น' : 'บริการเด่นเต็มแล้ว (สูงสุด 6)'}
        >
          <Star className="w-4 h-4" />
        </button>
      )}
    </div>
  );
}
