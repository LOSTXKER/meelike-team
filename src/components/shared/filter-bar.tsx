"use client";

import { cn } from "@/lib/utils";
import { Search } from "lucide-react";
import { type ReactNode } from "react";

export interface FilterOption<T extends string = string> {
  key: T;
  label: string;
  icon?: ReactNode;
  count?: number;
  color?: "default" | "warning" | "success" | "error" | "info";
}

interface FilterBarProps<T extends string = string> {
  filters: FilterOption<T>[];
  activeFilter: T;
  onFilterChange: (filter: T) => void;
  searchValue?: string;
  onSearchChange?: (value: string) => void;
  searchPlaceholder?: string;
  className?: string;
  showSearch?: boolean;
}

export function FilterBar<T extends string = string>({
  filters,
  activeFilter,
  onFilterChange,
  searchValue = "",
  onSearchChange,
  searchPlaceholder = "ค้นหา...",
  className,
  showSearch = true,
}: FilterBarProps<T>) {
  const getColorClasses = (color: FilterOption["color"], isActive: boolean) => {
    if (isActive) {
      switch (color) {
        case "warning":
          return "bg-brand-warning text-white border-brand-warning";
        case "success":
          return "bg-brand-success text-white border-brand-success";
        case "error":
          return "bg-brand-error text-white border-brand-error";
        case "info":
          return "bg-brand-info text-white border-brand-info";
        default:
          return "bg-brand-primary text-white border-brand-primary";
      }
    }
    return "bg-white text-brand-text-light border-brand-border hover:border-brand-primary/50 hover:text-brand-text-dark";
  };

  return (
    <div
      className={cn(
        "flex items-center gap-4 p-1.5 bg-brand-bg/50 rounded-2xl border border-brand-border/50",
        className
      )}
    >
      {/* Filter Pills */}
      <div className="flex gap-1 overflow-x-auto no-scrollbar">
        <div className="flex gap-1 min-w-max">
          {filters.map((filter) => (
            <button
              key={filter.key}
              onClick={() => onFilterChange(filter.key)}
              className={cn(
                "flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-all duration-200 border shadow-sm",
                getColorClasses(filter.color, activeFilter === filter.key),
                activeFilter === filter.key && "shadow-md"
              )}
            >
              {filter.icon}
              <span>{filter.label}</span>
              {filter.count !== undefined && (
                <span
                  className={cn(
                    "px-1.5 py-0.5 rounded-md text-xs font-bold",
                    activeFilter === filter.key
                      ? "bg-white/20"
                      : "bg-brand-bg"
                  )}
                >
                  {filter.count}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Search */}
      {showSearch && onSearchChange && (
        <div className="relative flex-1 min-w-[200px] max-w-xs ml-auto">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-brand-text-light" />
          <input
            type="text"
            placeholder={searchPlaceholder}
            value={searchValue}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-white border border-brand-border/50 rounded-xl text-sm text-brand-text-dark placeholder:text-brand-text-light focus:outline-none focus:ring-2 focus:ring-brand-primary/10 focus:border-brand-primary transition-all shadow-sm"
          />
        </div>
      )}
    </div>
  );
}

// Segmented Control variant (for tabs)
interface SegmentedControlProps<T extends string = string> {
  options: FilterOption<T>[];
  activeOption: T;
  onChange: (option: T) => void;
  className?: string;
}

export function SegmentedControl<T extends string = string>({
  options,
  activeOption,
  onChange,
  className,
}: SegmentedControlProps<T>) {
  return (
    <div
      className={cn(
        "flex rounded-xl bg-brand-bg p-1 border border-brand-border",
        className
      )}
    >
      {options.map((option) => (
        <button
          key={option.key}
          onClick={() => onChange(option.key)}
          className={cn(
            "flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg font-medium transition-all",
            activeOption === option.key
              ? "bg-brand-surface text-brand-primary shadow-sm"
              : "text-brand-text-light hover:text-brand-text-dark"
          )}
        >
          {option.icon}
          <span className="hidden sm:inline">{option.label}</span>
          {option.count !== undefined && (
            <span
              className={cn(
                "px-1.5 py-0.5 rounded-md text-xs font-bold",
                activeOption === option.key
                  ? "bg-brand-primary/10 text-brand-primary"
                  : "bg-brand-border/50"
              )}
            >
              {option.count}
            </span>
          )}
        </button>
      ))}
    </div>
  );
}
