"use client";

import { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { EmptyState } from "./empty-state";
import { LucideIcon } from "lucide-react";

export interface DataTableColumn<T> {
  /** Column key - used to access data from row */
  key: keyof T | string;
  /** Column header label */
  header: string;
  /** Custom cell renderer */
  render?: (row: T, index: number) => ReactNode;
  /** Cell alignment */
  align?: "left" | "center" | "right";
  /** Column width class (e.g., "w-24", "min-w-[200px]") */
  width?: string;
  /** Hide column on mobile */
  hideOnMobile?: boolean;
  /** Sortable column */
  sortable?: boolean;
}

interface DataTableProps<T> {
  /** Data to display */
  data: T[];
  /** Column definitions */
  columns: DataTableColumn<T>[];
  /** Unique key for each row */
  keyExtractor: (row: T, index: number) => string;
  /** Table title */
  title?: string;
  /** Show result count */
  showCount?: boolean;
  /** Custom empty state */
  emptyState?: {
    icon?: LucideIcon;
    title: string;
    description?: string;
    action?: ReactNode;
  };
  /** Row click handler */
  onRowClick?: (row: T, index: number) => void;
  /** Custom row class */
  rowClassName?: string | ((row: T, index: number) => string);
  /** Header actions slot */
  headerActions?: ReactNode;
  /** Container class */
  className?: string;
  /** Sticky header */
  stickyHeader?: boolean;
}

export function DataTable<T>({
  data,
  columns,
  keyExtractor,
  title,
  showCount = true,
  emptyState,
  onRowClick,
  rowClassName,
  headerActions,
  className,
  stickyHeader = false,
}: DataTableProps<T>) {
  const getAlignClass = (align?: "left" | "center" | "right") => {
    switch (align) {
      case "center":
        return "text-center";
      case "right":
        return "text-right";
      default:
        return "text-left";
    }
  };

  const getCellValue = (row: T, key: keyof T | string): ReactNode => {
    if (typeof key === "string" && key.includes(".")) {
      // Handle nested keys like "user.name"
      const keys = key.split(".");
      let value: unknown = row;
      for (const k of keys) {
        value = (value as Record<string, unknown>)?.[k];
      }
      return value as ReactNode;
    }
    return row[key as keyof T] as ReactNode;
  };

  const getRowClassName = (row: T, index: number) => {
    if (typeof rowClassName === "function") {
      return rowClassName(row, index);
    }
    return rowClassName || "";
  };

  if (data.length === 0 && emptyState) {
    return (
      <div className={cn("bg-white rounded-2xl shadow-sm border border-brand-border/50 overflow-hidden", className)}>
        {(title || headerActions) && (
          <div className="p-4 border-b border-brand-border/30 bg-brand-bg/30 flex items-center justify-between">
            {title && <h3 className="font-bold text-brand-text-dark">{title}</h3>}
            {headerActions}
          </div>
        )}
        <EmptyState
          icon={emptyState.icon}
          title={emptyState.title}
          description={emptyState.description}
          action={emptyState.action}
          className="py-12"
        />
      </div>
    );
  }

  return (
    <div className={cn("bg-white rounded-2xl shadow-sm border border-brand-border/50 overflow-hidden", className)}>
      {/* Header */}
      {(title || headerActions || showCount) && (
        <div className="p-4 border-b border-brand-border/30 bg-brand-bg/30 flex items-center justify-between">
          <div className="flex items-center gap-3">
            {title && <h3 className="font-bold text-brand-text-dark">{title}</h3>}
            {showCount && (
              <span className="text-xs text-brand-text-light bg-white px-2 py-1 rounded-lg border border-brand-border/30">
                {data.length} รายการ
              </span>
            )}
          </div>
          {headerActions}
        </div>
      )}

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className={cn(stickyHeader && "sticky top-0 z-10")}>
            <tr className="bg-brand-bg/30">
              {columns.map((col, colIndex) => (
                <th
                  key={colIndex}
                  className={cn(
                    "px-6 py-3 text-xs font-semibold text-brand-text-light uppercase tracking-wider border-b border-brand-border/30",
                    getAlignClass(col.align),
                    col.width,
                    col.hideOnMobile && "hidden md:table-cell"
                  )}
                >
                  {col.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-brand-border/30">
            {data.map((row, rowIndex) => (
              <tr
                key={keyExtractor(row, rowIndex)}
                className={cn(
                  "hover:bg-brand-bg/30 transition-colors",
                  onRowClick && "cursor-pointer",
                  getRowClassName(row, rowIndex)
                )}
                onClick={() => onRowClick?.(row, rowIndex)}
              >
                {columns.map((col, colIndex) => (
                  <td
                    key={colIndex}
                    className={cn(
                      "px-6 py-4 text-sm text-brand-text-dark",
                      getAlignClass(col.align),
                      col.width,
                      col.hideOnMobile && "hidden md:table-cell"
                    )}
                  >
                    {col.render ? col.render(row, rowIndex) : getCellValue(row, col.key)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ===== Preset Column Renderers =====

import { Badge, Avatar } from "@/components/ui";
import { Star, Calendar, MoreVertical } from "lucide-react";
import { StatusVariant } from "@/lib/constants/statuses";

/** Avatar + Name cell renderer */
export function renderAvatarCell(
  avatar?: string,
  name?: string,
  subtitle?: string
) {
  return (
    <div className="flex items-center gap-3">
      <Avatar src={avatar} fallback={name} size="sm" />
      <div>
        <p className="font-medium text-brand-text-dark">{name || "-"}</p>
        {subtitle && <p className="text-xs text-brand-text-light">{subtitle}</p>}
      </div>
    </div>
  );
}

/** Badge cell renderer */
export function renderBadgeCell(
  label: string,
  variant: StatusVariant = "default"
) {
  return (
    <Badge variant={variant} size="sm">
      {label}
    </Badge>
  );
}

/** Rating cell renderer */
export function renderRatingCell(rating: number) {
  return (
    <div className="flex items-center gap-1">
      <Star className="w-4 h-4 text-brand-warning fill-brand-warning" />
      <span className="font-medium">{rating.toFixed(1)}</span>
    </div>
  );
}

/** Currency cell renderer */
export function renderCurrencyCell(amount: number, currency = "฿") {
  return (
    <span className="font-semibold text-brand-success">
      {currency}{amount.toLocaleString()}
    </span>
  );
}

/** Date cell renderer */
export function renderDateCell(dateString: string, showTime = false) {
  const date = new Date(dateString);
  const formatted = showTime
    ? date.toLocaleDateString("th-TH", {
        day: "numeric",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      })
    : date.toLocaleDateString("th-TH", {
        day: "numeric",
        month: "short",
        year: "numeric",
      });

  return (
    <span className="flex items-center gap-1 text-brand-text-light">
      <Calendar className="w-3.5 h-3.5" />
      {formatted}
    </span>
  );
}

/** Action button cell renderer */
export function renderActionsCell(onClick: () => void) {
  return (
    <button
      onClick={(e) => {
        e.stopPropagation();
        onClick();
      }}
      className="p-2 hover:bg-brand-bg rounded-lg transition-colors text-brand-text-light hover:text-brand-primary"
    >
      <MoreVertical className="w-5 h-5" />
    </button>
  );
}
