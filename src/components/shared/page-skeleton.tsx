"use client";

import { Skeleton } from "@/components/ui";
import { cn } from "@/lib/utils";

export type PageSkeletonVariant = "dashboard" | "list" | "detail" | "form" | "cards";

interface PageSkeletonProps {
  variant?: PageSkeletonVariant;
  className?: string;
  /** Number of items for list/cards variant */
  itemCount?: number;
  /** Number of stat cards */
  statsCount?: number;
  /** Show header skeleton */
  showHeader?: boolean;
  /** Show filter bar skeleton */
  showFilter?: boolean;
}

export function PageSkeleton({
  variant = "dashboard",
  className,
  itemCount = 5,
  statsCount = 4,
  showHeader = true,
  showFilter = true,
}: PageSkeletonProps) {
  return (
    <div className={cn("space-y-6 animate-fade-in", className)}>
      {/* Header */}
      {showHeader && (
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
          <div className="space-y-2">
            <Skeleton className="h-8 w-48 rounded-lg" />
            <Skeleton className="h-4 w-64 rounded-lg" />
          </div>
          <Skeleton className="h-10 w-32 rounded-xl" />
        </div>
      )}

      {/* Stats Cards */}
      {(variant === "dashboard" || variant === "list") && (
        <div className={cn("grid gap-4", `grid-cols-2 lg:grid-cols-${statsCount}`)}>
          {Array.from({ length: statsCount }).map((_, i) => (
            <Skeleton key={i} className="h-24 rounded-xl" />
          ))}
        </div>
      )}

      {/* Filter Bar */}
      {showFilter && (variant === "list" || variant === "cards") && (
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 bg-white p-4 rounded-2xl">
          <Skeleton className="h-10 w-80 rounded-xl" />
          <Skeleton className="h-10 w-64 rounded-xl" />
        </div>
      )}

      {/* Content based on variant */}
      {variant === "dashboard" && <DashboardSkeleton />}
      {variant === "list" && <ListSkeleton itemCount={itemCount} />}
      {variant === "detail" && <DetailSkeleton />}
      {variant === "form" && <FormSkeleton />}
      {variant === "cards" && <CardsSkeleton itemCount={itemCount} />}
    </div>
  );
}

function DashboardSkeleton() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Quick Actions */}
      <Skeleton className="h-48 rounded-2xl" />
      {/* Recent Activity */}
      <Skeleton className="h-48 rounded-2xl" />
      {/* Chart or Table */}
      <Skeleton className="h-64 rounded-2xl lg:col-span-2" />
    </div>
  );
}

function ListSkeleton({ itemCount }: { itemCount: number }) {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-brand-border/50 overflow-hidden">
      {/* Table Header */}
      <div className="p-4 border-b border-brand-border/30 bg-brand-bg/30">
        <Skeleton className="h-6 w-32 rounded" />
      </div>
      {/* Table Rows */}
      <div className="divide-y divide-brand-border/30">
        {Array.from({ length: itemCount }).map((_, i) => (
          <div key={i} className="p-4 flex items-center gap-4">
            <Skeleton className="h-10 w-10 rounded-full shrink-0" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-4 w-48 rounded" />
              <Skeleton className="h-3 w-32 rounded" />
            </div>
            <Skeleton className="h-6 w-20 rounded-full" />
            <Skeleton className="h-8 w-8 rounded" />
          </div>
        ))}
      </div>
    </div>
  );
}

function DetailSkeleton() {
  return (
    <div className="space-y-6">
      {/* Main Info Card */}
      <div className="bg-white rounded-2xl shadow-sm border border-brand-border/50 p-6 space-y-4">
        <div className="flex items-start gap-4">
          <Skeleton className="h-16 w-16 rounded-xl shrink-0" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-6 w-48 rounded" />
            <Skeleton className="h-4 w-64 rounded" />
            <Skeleton className="h-4 w-32 rounded" />
          </div>
        </div>
      </div>

      {/* Details Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl shadow-sm border border-brand-border/50 p-6 space-y-4">
          <Skeleton className="h-5 w-32 rounded" />
          <div className="space-y-3">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="flex justify-between">
                <Skeleton className="h-4 w-24 rounded" />
                <Skeleton className="h-4 w-32 rounded" />
              </div>
            ))}
          </div>
        </div>
        <div className="bg-white rounded-2xl shadow-sm border border-brand-border/50 p-6 space-y-4">
          <Skeleton className="h-5 w-32 rounded" />
          <div className="space-y-3">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="flex justify-between">
                <Skeleton className="h-4 w-24 rounded" />
                <Skeleton className="h-4 w-32 rounded" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function FormSkeleton() {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-brand-border/50 p-6 space-y-6">
      {/* Form Fields */}
      {[1, 2, 3].map((i) => (
        <div key={i} className="space-y-2">
          <Skeleton className="h-4 w-24 rounded" />
          <Skeleton className="h-10 w-full rounded-lg" />
        </div>
      ))}

      {/* Two Column Fields */}
      <div className="grid grid-cols-2 gap-4">
        {[1, 2].map((i) => (
          <div key={i} className="space-y-2">
            <Skeleton className="h-4 w-20 rounded" />
            <Skeleton className="h-10 w-full rounded-lg" />
          </div>
        ))}
      </div>

      {/* Textarea */}
      <div className="space-y-2">
        <Skeleton className="h-4 w-24 rounded" />
        <Skeleton className="h-24 w-full rounded-lg" />
      </div>

      {/* Submit Button */}
      <div className="flex justify-end gap-3 pt-4">
        <Skeleton className="h-10 w-24 rounded-xl" />
        <Skeleton className="h-10 w-32 rounded-xl" />
      </div>
    </div>
  );
}

function CardsSkeleton({ itemCount }: { itemCount: number }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {Array.from({ length: itemCount }).map((_, i) => (
        <div
          key={i}
          className="bg-white rounded-2xl shadow-sm border border-brand-border/50 p-4 space-y-3"
        >
          <div className="flex items-center gap-3">
            <Skeleton className="h-12 w-12 rounded-xl shrink-0" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-4 w-32 rounded" />
              <Skeleton className="h-3 w-24 rounded" />
            </div>
          </div>
          <Skeleton className="h-3 w-full rounded" />
          <div className="flex items-center justify-between pt-2">
            <Skeleton className="h-6 w-20 rounded-full" />
            <Skeleton className="h-8 w-24 rounded-lg" />
          </div>
        </div>
      ))}
    </div>
  );
}
