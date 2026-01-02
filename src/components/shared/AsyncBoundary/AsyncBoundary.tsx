/**
 * Async Boundary Component
 * 
 * Handles loading, error, and empty states for async operations
 */

"use client";

import { ReactNode } from "react";
import { AlertCircle, Loader2 } from "lucide-react";
import { Button, Card } from "@/components/ui";
import { LoadingScreen } from "@/components/shared";
import { getErrorMessage } from "@/lib/errors";

interface AsyncBoundaryProps {
  isLoading: boolean;
  error?: Error | null;
  isEmpty?: boolean;
  loadingFallback?: ReactNode;
  errorFallback?: ReactNode;
  emptyFallback?: ReactNode;
  onRetry?: () => void;
  children: ReactNode;
  className?: string;
}

export function AsyncBoundary({
  isLoading,
  error,
  isEmpty = false,
  loadingFallback,
  errorFallback,
  emptyFallback,
  onRetry,
  children,
  className,
}: AsyncBoundaryProps) {
  // Loading state
  if (isLoading) {
    return loadingFallback || <LoadingScreen />;
  }

  // Error state
  if (error) {
    return (
      errorFallback || (
        <ErrorState error={error} onRetry={onRetry} className={className} />
      )
    );
  }

  // Empty state
  if (isEmpty) {
    return (
      emptyFallback || (
        <EmptyState className={className} />
      )
    );
  }

  // Success state - render children
  return <>{children}</>;
}

// ===== ERROR STATE COMPONENT =====

interface ErrorStateProps {
  error: Error;
  onRetry?: () => void;
  className?: string;
}

function ErrorState({ error, onRetry, className }: ErrorStateProps) {
  const errorMessage = getErrorMessage(error);

  return (
    <div className={className}>
      <Card variant="outline" padding="lg" className="text-center">
        <div className="w-16 h-16 rounded-full bg-brand-error/10 flex items-center justify-center mx-auto mb-4">
          <AlertCircle className="w-8 h-8 text-brand-error" />
        </div>
        <h3 className="text-lg font-bold text-brand-text-dark mb-2">
          เกิดข้อผิดพลาด
        </h3>
        <p className="text-brand-text-light mb-4">{errorMessage}</p>
        {onRetry && (
          <Button onClick={onRetry} size="sm">
            ลองอีกครั้ง
          </Button>
        )}
      </Card>
    </div>
  );
}

// ===== EMPTY STATE COMPONENT =====

interface EmptyStateProps {
  className?: string;
}

function EmptyState({ className }: EmptyStateProps) {
  return (
    <div className={className}>
      <Card variant="outline" padding="lg" className="text-center">
        <p className="text-brand-text-light">ไม่พบข้อมูล</p>
      </Card>
    </div>
  );
}

// ===== INLINE LOADING =====

export function InlineLoading({ message = "กำลังโหลด..." }: { message?: string }) {
  return (
    <div className="flex items-center justify-center gap-2 p-4">
      <Loader2 className="w-5 h-5 animate-spin text-brand-primary" />
      <span className="text-sm text-brand-text-light">{message}</span>
    </div>
  );
}

// ===== INLINE ERROR =====

export function InlineError({
  error,
  onRetry,
}: {
  error: Error | string;
  onRetry?: () => void;
}) {
  const message = typeof error === "string" ? error : getErrorMessage(error);

  return (
    <div className="flex items-center justify-between gap-3 p-3 rounded-xl bg-brand-error/10 border border-brand-error/20">
      <div className="flex items-center gap-2">
        <AlertCircle className="w-4 h-4 text-brand-error shrink-0" />
        <span className="text-sm text-brand-error">{message}</span>
      </div>
      {onRetry && (
        <Button variant="ghost" size="sm" onClick={onRetry}>
          ลองอีกครั้ง
        </Button>
      )}
    </div>
  );
}

// ===== SKELETON LOADER =====

export function SkeletonLoader({
  count = 1,
  className,
}: {
  count?: number;
  className?: string;
}) {
  return (
    <div className="space-y-3">
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className={`animate-pulse bg-brand-bg rounded-xl h-20 ${className}`}
        />
      ))}
    </div>
  );
}
