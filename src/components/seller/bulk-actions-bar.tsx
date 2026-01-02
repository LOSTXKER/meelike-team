"use client";

import { Button } from "@/components/ui";
import { X, Globe, EyeOff, ToggleLeft, Trash2 } from "lucide-react";

export type BulkAction = "show" | "hide" | "toggle" | "delete";

interface BulkActionsBarProps {
  selectedCount: number;
  onAction: (action: BulkAction) => void;
  onClear: () => void;
  className?: string;
}

export function BulkActionsBar({ 
  selectedCount, 
  onAction, 
  onClear,
  className = "" 
}: BulkActionsBarProps) {
  if (selectedCount === 0) return null;

  return (
    <div className={`sticky bottom-4 mx-auto w-fit animate-fade-in z-40 ${className}`}>
      <div className="flex items-center gap-3 px-5 py-3 bg-brand-primary text-white rounded-2xl shadow-xl">
        <button 
          onClick={onClear}
          className="p-1.5 hover:bg-white/20 rounded-lg transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
        <span className="font-medium">
          เลือก {selectedCount} รายการ
        </span>
        <div className="w-px h-6 bg-white/30" />
        <div className="flex items-center gap-2">
          <Button 
            variant="ghost" 
            size="sm" 
            className="text-white hover:bg-white/20 border-white/30"
            leftIcon={<Globe className="w-3.5 h-3.5" />}
            onClick={() => onAction("show")}
          >
            แสดงในร้าน
          </Button>
          <Button 
            variant="ghost" 
            size="sm" 
            className="text-white hover:bg-white/20 border-white/30"
            leftIcon={<EyeOff className="w-3.5 h-3.5" />}
            onClick={() => onAction("hide")}
          >
            ซ่อนจากร้าน
          </Button>
          <Button 
            variant="ghost" 
            size="sm" 
            className="text-white hover:bg-white/20 border-white/30"
            leftIcon={<ToggleLeft className="w-3.5 h-3.5" />}
            onClick={() => onAction("toggle")}
          >
            เปิด/ปิด
          </Button>
          <Button 
            variant="ghost" 
            size="sm" 
            className="text-white hover:bg-red-500 border-white/30"
            leftIcon={<Trash2 className="w-3.5 h-3.5" />}
            onClick={() => onAction("delete")}
          >
            ลบ
          </Button>
        </div>
      </div>
    </div>
  );
}
