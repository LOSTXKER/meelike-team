"use client";

import { cn } from "@/lib/utils";

interface SkeletonProps {
  className?: string;
}

export function Skeleton({ className }: SkeletonProps) {
  return (
    <div
      className={cn(
        "animate-pulse rounded-lg bg-brand-border/50",
        className
      )}
    />
  );
}

// Pre-built skeleton patterns
export function SkeletonText({ className, lines = 1 }: { className?: string; lines?: number }) {
  return (
    <div className={cn("space-y-2", className)}>
      {Array.from({ length: lines }).map((_, i) => (
        <Skeleton
          key={i}
          className={cn("h-4", i === lines - 1 && lines > 1 ? "w-3/4" : "w-full")}
        />
      ))}
    </div>
  );
}

export function SkeletonAvatar({ size = "md" }: { size?: "sm" | "md" | "lg" | "xl" }) {
  const sizes = {
    sm: "w-8 h-8",
    md: "w-10 h-10",
    lg: "w-12 h-12",
    xl: "w-16 h-16",
  };
  return <Skeleton className={cn("rounded-full", sizes[size])} />;
}

export function SkeletonButton({ className }: SkeletonProps) {
  return <Skeleton className={cn("h-10 w-24 rounded-xl", className)} />;
}

export function SkeletonCard({ className }: SkeletonProps) {
  return (
    <div className={cn("p-6 rounded-2xl bg-brand-surface border border-brand-border/50", className)}>
      <div className="flex items-center gap-4 mb-4">
        <SkeletonAvatar size="lg" />
        <div className="flex-1">
          <Skeleton className="h-5 w-32 mb-2" />
          <Skeleton className="h-4 w-24" />
        </div>
      </div>
      <SkeletonText lines={2} />
    </div>
  );
}

export function SkeletonStatsCard() {
  return (
    <div className="p-5 rounded-2xl bg-brand-surface border border-brand-border/50 shadow-sm">
      <div className="flex items-center gap-4">
        <Skeleton className="w-12 h-12 rounded-xl" />
        <div className="flex-1">
          <Skeleton className="h-7 w-20 mb-2" />
          <Skeleton className="h-4 w-16" />
        </div>
      </div>
    </div>
  );
}

export function SkeletonTable({ rows = 5 }: { rows?: number }) {
  return (
    <div className="rounded-2xl bg-brand-surface border border-brand-border/50 overflow-hidden">
      {/* Header */}
      <div className="p-4 border-b border-brand-border/50 bg-brand-bg/30">
        <div className="flex items-center justify-between">
          <Skeleton className="h-6 w-32" />
          <Skeleton className="h-10 w-64" />
        </div>
      </div>
      {/* Rows */}
      <div className="divide-y divide-brand-border/50">
        {Array.from({ length: rows }).map((_, i) => (
          <div key={i} className="p-4 flex items-center gap-4">
            <Skeleton className="w-12 h-12 rounded-xl" />
            <div className="flex-1">
              <Skeleton className="h-5 w-48 mb-2" />
              <Skeleton className="h-4 w-32" />
            </div>
            <Skeleton className="h-6 w-20 rounded-full" />
            <Skeleton className="h-8 w-8 rounded-lg" />
          </div>
        ))}
      </div>
    </div>
  );
}

export function SkeletonJobCard() {
  return (
    <div className="p-5 rounded-2xl bg-brand-surface border border-brand-border/50 shadow-sm">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-4">
          <Skeleton className="w-12 h-12 rounded-xl" />
          <div>
            <Skeleton className="h-5 w-32 mb-2" />
            <Skeleton className="h-4 w-24" />
          </div>
        </div>
        <Skeleton className="h-6 w-16 rounded-full" />
      </div>
      <Skeleton className="h-2 w-full rounded-full mb-3" />
      <div className="flex items-center justify-between">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-4 w-20" />
      </div>
    </div>
  );
}

export function SkeletonBalanceCard() {
  return (
    <div className="p-6 rounded-2xl bg-gradient-to-br from-brand-primary/20 to-brand-accent/20 border border-brand-border/50">
      <Skeleton className="h-4 w-24 mb-3 bg-brand-border/30" />
      <Skeleton className="h-10 w-40 mb-4 bg-brand-border/30" />
      <div className="grid grid-cols-2 gap-4 pt-4 border-t border-brand-border/30">
        <div>
          <Skeleton className="h-3 w-16 mb-2 bg-brand-border/30" />
          <Skeleton className="h-6 w-24 bg-brand-border/30" />
        </div>
        <div>
          <Skeleton className="h-3 w-16 mb-2 bg-brand-border/30" />
          <Skeleton className="h-6 w-24 bg-brand-border/30" />
        </div>
      </div>
    </div>
  );
}

// Page-level loading skeletons
export function WorkerDashboardSkeleton() {
  return (
    <div className="space-y-6 animate-fade-in">
      {/* Balance Card */}
      <SkeletonBalanceCard />
      
      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <SkeletonStatsCard key={i} />
        ))}
      </div>
      
      {/* Jobs Section */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <Skeleton className="h-6 w-40" />
          <Skeleton className="h-4 w-20" />
        </div>
        <div className="space-y-4">
          {Array.from({ length: 2 }).map((_, i) => (
            <SkeletonJobCard key={i} />
          ))}
        </div>
      </div>
    </div>
  );
}

export function WorkerJobsSkeleton() {
  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <Skeleton className="h-8 w-32 mb-2" />
          <Skeleton className="h-4 w-48" />
        </div>
      </div>
      
      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="p-4 rounded-xl bg-brand-surface border border-brand-border/50 text-center">
            <Skeleton className="h-8 w-12 mx-auto mb-2" />
            <Skeleton className="h-4 w-16 mx-auto" />
          </div>
        ))}
      </div>
      
      {/* Tabs */}
      <Skeleton className="h-12 w-full rounded-xl" />
      
      {/* Jobs List */}
      <div className="space-y-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <SkeletonJobCard key={i} />
        ))}
      </div>
    </div>
  );
}

export function WorkerEarningsSkeleton() {
  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div>
        <Skeleton className="h-8 w-24 mb-2" />
        <Skeleton className="h-4 w-40" />
      </div>
      
      {/* Balance Card */}
      <SkeletonBalanceCard />
      
      {/* Stats */}
      <div className="grid grid-cols-2 gap-4">
        {Array.from({ length: 2 }).map((_, i) => (
          <SkeletonStatsCard key={i} />
        ))}
      </div>
      
      {/* Transactions */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <Skeleton className="h-6 w-32" />
          <Skeleton className="h-4 w-20" />
        </div>
        <SkeletonTable rows={4} />
      </div>
    </div>
  );
}
