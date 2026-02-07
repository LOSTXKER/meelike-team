"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { ChevronLeft, ChevronRight, MoreHorizontal } from "lucide-react";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  /** Number of items per page */
  pageSize?: number;
  /** Total items count (for display) */
  totalItems?: number;
  className?: string;
}

/**
 * Reusable pagination component with page numbers and prev/next controls.
 */
export function Pagination({
  currentPage,
  totalPages,
  onPageChange,
  pageSize,
  totalItems,
  className,
}: PaginationProps) {
  if (totalPages <= 1) return null;

  // Generate page numbers with ellipsis
  const getPageNumbers = (): (number | "ellipsis")[] => {
    const pages: (number | "ellipsis")[] = [];
    const delta = 1; // How many pages to show around current

    if (totalPages <= 7) {
      // Show all pages
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      // Always show first page
      pages.push(1);

      if (currentPage > delta + 2) {
        pages.push("ellipsis");
      }

      const start = Math.max(2, currentPage - delta);
      const end = Math.min(totalPages - 1, currentPage + delta);

      for (let i = start; i <= end; i++) {
        pages.push(i);
      }

      if (currentPage < totalPages - delta - 1) {
        pages.push("ellipsis");
      }

      // Always show last page
      pages.push(totalPages);
    }

    return pages;
  };

  const pages = getPageNumbers();

  return (
    <div
      className={cn("flex items-center justify-between gap-4", className)}
    >
      {/* Info */}
      {totalItems !== undefined && pageSize !== undefined && (
        <p className="text-sm text-brand-text-light hidden sm:block">
          แสดง {Math.min((currentPage - 1) * pageSize + 1, totalItems)}-
          {Math.min(currentPage * pageSize, totalItems)} จาก {totalItems}{" "}
          รายการ
        </p>
      )}

      {/* Controls */}
      <div className="flex items-center gap-1 ml-auto">
        {/* Previous */}
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage <= 1}
          className={cn(
            "p-2 rounded-lg transition-colors",
            currentPage <= 1
              ? "text-gray-300 cursor-not-allowed"
              : "text-brand-text-light hover:bg-brand-bg hover:text-brand-text-dark"
          )}
          aria-label="หน้าก่อน"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>

        {/* Page Numbers */}
        {pages.map((page, i) => {
          if (page === "ellipsis") {
            return (
              <span
                key={`ellipsis-${i}`}
                className="w-9 h-9 flex items-center justify-center text-brand-text-light"
              >
                <MoreHorizontal className="w-4 h-4" />
              </span>
            );
          }

          const isActive = page === currentPage;
          return (
            <button
              key={page}
              onClick={() => onPageChange(page)}
              className={cn(
                "w-9 h-9 rounded-lg text-sm font-medium transition-colors",
                isActive
                  ? "bg-brand-primary text-white shadow-sm"
                  : "text-brand-text-light hover:bg-brand-bg hover:text-brand-text-dark"
              )}
            >
              {page}
            </button>
          );
        })}

        {/* Next */}
        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage >= totalPages}
          className={cn(
            "p-2 rounded-lg transition-colors",
            currentPage >= totalPages
              ? "text-gray-300 cursor-not-allowed"
              : "text-brand-text-light hover:bg-brand-bg hover:text-brand-text-dark"
          )}
          aria-label="หน้าถัดไป"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}

/**
 * Hook to handle pagination logic.
 */
export function usePagination<T>(items: T[], pageSize = 10) {
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = Math.ceil(items.length / pageSize);

  // Reset to page 1 if items change and current page is out of bounds
  const safePage = Math.min(currentPage, Math.max(1, totalPages));

  const paginatedItems = items.slice(
    (safePage - 1) * pageSize,
    safePage * pageSize
  );

  return {
    currentPage: safePage,
    totalPages,
    totalItems: items.length,
    pageSize,
    paginatedItems,
    setCurrentPage,
  };
}
