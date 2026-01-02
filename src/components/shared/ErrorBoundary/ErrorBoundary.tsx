/**
 * Error Boundary Component
 * 
 * Catches JavaScript errors in child components and displays fallback UI
 */

"use client";

import React, { Component, ReactNode } from "react";
import { AlertTriangle, RefreshCcw, Home } from "lucide-react";
import { Button } from "@/components/ui";
import { logError } from "@/lib/errors";

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: React.ErrorInfo) => void;
  showDetails?: boolean;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
  errorInfo: React.ErrorInfo | null;
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    };
  }

  static getDerivedStateFromError(error: Error): Partial<ErrorBoundaryState> {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo): void {
    this.setState({ errorInfo });
    
    // Log error
    logError(error, "ErrorBoundary");
    
    // Call custom error handler if provided
    this.props.onError?.(error, errorInfo);
  }

  handleReset = (): void => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
    });
  };

  render(): ReactNode {
    if (this.state.hasError) {
      // Use custom fallback if provided
      if (this.props.fallback) {
        return this.props.fallback;
      }

      // Default fallback UI
      return (
        <ErrorFallback
          error={this.state.error}
          errorInfo={this.state.errorInfo}
          onReset={this.handleReset}
          showDetails={this.props.showDetails}
        />
      );
    }

    return this.props.children;
  }
}

// ===== ERROR FALLBACK COMPONENT =====

interface ErrorFallbackProps {
  error: Error | null;
  errorInfo: React.ErrorInfo | null;
  onReset?: () => void;
  showDetails?: boolean;
}

export function ErrorFallback({
  error,
  errorInfo,
  onReset,
  showDetails = process.env.NODE_ENV === "development",
}: ErrorFallbackProps) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-brand-bg p-4">
      <div className="max-w-2xl w-full">
        <div className="bg-white rounded-2xl shadow-xl p-8 border border-brand-error/20">
          {/* Icon */}
          <div className="w-16 h-16 rounded-full bg-brand-error/10 flex items-center justify-center mx-auto mb-4">
            <AlertTriangle className="w-8 h-8 text-brand-error" />
          </div>

          {/* Title */}
          <h1 className="text-2xl font-bold text-center text-brand-text-dark mb-2">
            เกิดข้อผิดพลาด
          </h1>

          {/* Message */}
          <p className="text-center text-brand-text-light mb-6">
            ขออภัย เกิดข้อผิดพลาดบางอย่างที่ไม่คาดคิด กรุณาลองใหม่อีกครั้ง
          </p>

          {/* Error Details (Development only) */}
          {showDetails && error && (
            <div className="mb-6 p-4 bg-brand-error/5 rounded-xl border border-brand-error/20">
              <p className="text-sm font-mono text-brand-error break-all">
                {error.toString()}
              </p>
              {errorInfo && (
                <details className="mt-2">
                  <summary className="text-xs text-brand-text-light cursor-pointer hover:text-brand-text-dark">
                    Stack Trace
                  </summary>
                  <pre className="mt-2 text-xs text-brand-text-light overflow-auto p-2 bg-brand-bg rounded">
                    {errorInfo.componentStack}
                  </pre>
                </details>
              )}
            </div>
          )}

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            {onReset && (
              <Button
                onClick={onReset}
                leftIcon={<RefreshCcw className="w-4 h-4" />}
              >
                ลองอีกครั้ง
              </Button>
            )}
            <Button
              variant="outline"
              onClick={() => (window.location.href = "/")}
              leftIcon={<Home className="w-4 h-4" />}
            >
              กลับหน้าหลัก
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
