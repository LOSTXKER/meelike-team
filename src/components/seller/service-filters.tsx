"use client";

import { Select, Input } from "@/components/ui";
import { 
  PLATFORM_FILTER_OPTIONS, 
  SERVICE_TYPE_FILTER_OPTIONS,
} from "@/lib/constants/services";
import { Search, Bot, Users, LayoutGrid, Filter as FilterIcon } from "lucide-react";
import type { ServiceMode } from "@/types";

interface ServiceFiltersProps {
  // Search
  searchQuery: string;
  onSearchChange: (value: string) => void;
  
  // Service Mode Filter (Bot/Human)
  serviceModeFilter: "all" | "bot" | "human";
  onServiceModeChange: (value: "all" | "bot" | "human") => void;
  serviceModeStats?: {
    all: number;
    bot: number;
    human: number;
  };
  
  // Platform Filter
  platformFilter: string;
  onPlatformChange: (value: string) => void;
  
  // Service Type Filter
  serviceTypeFilter: string;
  onServiceTypeChange: (value: string) => void;
  
  className?: string;
}

export function ServiceFilters({
  searchQuery,
  onSearchChange,
  serviceModeFilter,
  onServiceModeChange,
  serviceModeStats,
  platformFilter,
  onPlatformChange,
  serviceTypeFilter,
  onServiceTypeChange,
  className = "",
}: ServiceFiltersProps) {
  const serviceModeOptions: { value: "all" | "bot" | "human"; label: string; icon: typeof LayoutGrid }[] = [
    { value: "all", label: "ทั้งหมด", icon: LayoutGrid },
    { value: "bot", label: "งานเว็บ", icon: Bot },
    { value: "human", label: "งานกดมือ", icon: Users },
  ];

  return (
    <div className={`flex flex-col lg:flex-row gap-4 ${className}`}>
      {/* Service Mode Tabs (Bot/Human) */}
      <div className="flex items-center gap-1 p-1 bg-brand-bg/50 rounded-xl">
        {serviceModeOptions.map((option) => {
          const Icon = option.icon;
          const count = serviceModeStats?.[option.value];
          
          return (
            <button
              key={option.value}
              onClick={() => onServiceModeChange(option.value)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all whitespace-nowrap ${
                serviceModeFilter === option.value
                  ? "bg-white text-brand-primary shadow-sm"
                  : "text-brand-text-light hover:text-brand-text-dark"
              }`}
            >
              <Icon className="w-4 h-4" />
              {option.label}
              {count !== undefined && (
                <span className={`ml-1 text-xs ${
                  serviceModeFilter === option.value
                    ? "text-brand-primary"
                    : "text-brand-text-light"
                }`}>
                  {count}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Platform Filter */}
      <div className="flex items-center gap-2">
        <Select
          options={PLATFORM_FILTER_OPTIONS}
          value={platformFilter}
          onChange={(e) => onPlatformChange(e.target.value)}
          className="w-40"
        />
      </div>

      {/* Service Type Filter */}
      <div className="flex items-center gap-2">
        <Select
          options={SERVICE_TYPE_FILTER_OPTIONS}
          value={serviceTypeFilter}
          onChange={(e) => onServiceTypeChange(e.target.value)}
          className="w-36"
        />
      </div>

      {/* Search */}
      <div className="flex-1 lg:max-w-xs ml-auto">
        <Input
          placeholder="ค้นหาบริการ..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full"
        />
      </div>
    </div>
  );
}
