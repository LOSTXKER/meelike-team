/**
 * Generic DataTable Component
 * 
 * Reusable table component with sorting, selection, and custom rendering
 * Supports responsive design with mobile card view
 */

"use client";

import { cn } from "@/lib/utils";
import { ArrowUpDown, ArrowUp, ArrowDown, ChevronRight } from "lucide-react";
import type { ReactNode } from "react";

export interface Column<T> {
  key: keyof T | string;
  label: string;
  align?: "left" | "center" | "right";
  sortable?: boolean;
  width?: string;
  /** Hide this column on mobile */
  hideOnMobile?: boolean;
  /** Show as primary info in mobile card view */
  mobileHero?: boolean;
  render?: (value: any, item: T, index: number) => ReactNode;
}

export interface DataTableProps<T extends { id: string }> {
  data: T[];
  columns: Column<T>[];
  onRowClick?: (item: T) => void;
  selectable?: boolean;
  selectedIds?: Set<string>;
  onSelectToggle?: (id: string) => void;
  onSelectAll?: () => void;
  isAllSelected?: boolean;
  sortConfig?: {
    key: string;
    direction: "asc" | "desc";
  };
  onSort?: (key: string) => void;
  emptyMessage?: string;
  className?: string;
  rowClassName?: (item: T) => string;
  /** Use card layout on mobile instead of table */
  mobileCardView?: boolean;
}

export function DataTable<T extends { id: string }>({
  data,
  columns,
  onRowClick,
  selectable = false,
  selectedIds,
  onSelectToggle,
  onSelectAll,
  isAllSelected = false,
  sortConfig,
  onSort,
  emptyMessage = "ไม่พบข้อมูล",
  className,
  rowClassName,
  mobileCardView = false,
}: DataTableProps<T>) {
  const getSortIcon = (columnKey: string) => {
    if (!sortConfig || sortConfig.key !== columnKey) {
      return (
        <ArrowUpDown className="w-3 h-3 text-brand-text-light/30 opacity-0 group-hover:opacity-50" />
      );
    }
    return sortConfig.direction === "asc" ? (
      <ArrowUp className="w-3 h-3 text-brand-primary" />
    ) : (
      <ArrowDown className="w-3 h-3 text-brand-primary" />
    );
  };

  const getNestedValue = (obj: any, path: string): any => {
    return path.split(".").reduce((current, key) => current?.[key], obj);
  };

  // Filter columns for mobile view
  const visibleColumns = columns.filter(col => !col.hideOnMobile);
  const heroColumn = columns.find(col => col.mobileHero) || columns[0];

  // Empty state
  if (data.length === 0) {
    return (
      <div className="p-12 text-center text-brand-text-light">
        {emptyMessage}
      </div>
    );
  }

  return (
    <>
      {/* Desktop Table View */}
      <div className={cn("hidden md:block overflow-x-auto", className)}>
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-brand-bg/50 border-b border-brand-border/50 text-xs text-brand-text-light uppercase tracking-wider">
              {selectable && (
                <th className="p-4 font-medium w-12">
                  <input
                    type="checkbox"
                    checked={isAllSelected}
                    onChange={onSelectAll}
                    className="w-5 h-5 rounded border-gray-300 text-brand-primary cursor-pointer"
                  />
                </th>
              )}
              {columns.map((column, index) => (
                <th
                  key={index}
                  className={cn(
                    "p-4 font-medium",
                    column.sortable && "cursor-pointer group hover:bg-brand-border/30",
                    column.width
                  )}
                  onClick={() => column.sortable && onSort?.(column.key as string)}
                  style={{ width: column.width }}
                >
                  <div
                    className={cn(
                      "flex items-center gap-2",
                      column.align === "center" && "justify-center",
                      column.align === "right" && "justify-end"
                    )}
                  >
                    {column.label}
                    {column.sortable && getSortIcon(column.key as string)}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-brand-border/30">
            {data.map((item, rowIndex) => (
              <tr
                key={item.id}
                className={cn(
                  "hover:bg-brand-primary/5 transition-colors",
                  onRowClick && "cursor-pointer",
                  selectedIds?.has(item.id) && "bg-brand-primary/10",
                  rowClassName?.(item)
                )}
                onClick={() => onRowClick?.(item)}
              >
                {selectable && (
                  <td className="p-4" onClick={(e) => e.stopPropagation()}>
                    <input
                      type="checkbox"
                      checked={selectedIds?.has(item.id) || false}
                      onChange={() => onSelectToggle?.(item.id)}
                      className="w-5 h-5 rounded border-gray-300 text-brand-primary cursor-pointer"
                    />
                  </td>
                )}
                {columns.map((column, colIndex) => {
                  const value = getNestedValue(item, column.key as string);
                  const rendered = column.render
                    ? column.render(value, item, rowIndex)
                    : value;

                  return (
                    <td
                      key={colIndex}
                      className={cn(
                        "p-4",
                        column.align === "center" && "text-center",
                        column.align === "right" && "text-right"
                      )}
                    >
                      {rendered}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Card View */}
      <div className={cn("md:hidden divide-y divide-brand-border/30", className)}>
        {data.map((item, rowIndex) => {
          const heroValue = getNestedValue(item, heroColumn.key as string);
          const heroRendered = heroColumn.render
            ? heroColumn.render(heroValue, item, rowIndex)
            : heroValue;

          return (
            <div
              key={item.id}
              className={cn(
                "p-4 transition-colors active:bg-brand-primary/5",
                onRowClick && "cursor-pointer",
                selectedIds?.has(item.id) && "bg-brand-primary/10",
                rowClassName?.(item)
              )}
              onClick={() => onRowClick?.(item)}
            >
              <div className="flex items-start gap-3">
                {/* Selection Checkbox */}
                {selectable && (
                  <div 
                    className="pt-1"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <input
                      type="checkbox"
                      checked={selectedIds?.has(item.id) || false}
                      onChange={() => onSelectToggle?.(item.id)}
                      className="w-5 h-5 rounded border-gray-300 text-brand-primary cursor-pointer"
                    />
                  </div>
                )}
                
                {/* Main Content */}
                <div className="flex-1 min-w-0">
                  {/* Hero Content */}
                  <div className="mb-2">
                    {heroRendered}
                  </div>
                  
                  {/* Secondary Info Grid */}
                  <div className="grid grid-cols-2 gap-2">
                    {visibleColumns.slice(1, 5).map((column, colIndex) => {
                      if (column.key === heroColumn.key) return null;
                      const value = getNestedValue(item, column.key as string);
                      const rendered = column.render
                        ? column.render(value, item, rowIndex)
                        : value;

                      return (
                        <div key={colIndex} className="text-xs">
                          <span className="text-brand-text-light">{column.label}: </span>
                          <span className="text-brand-text-dark">{rendered}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Arrow indicator */}
                {onRowClick && (
                  <ChevronRight className="w-5 h-5 text-brand-text-light shrink-0" />
                )}
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
}
