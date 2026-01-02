/**
 * useSort Hook
 * 
 * Provides sorting functionality for lists/tables
 */

"use client";

import { useState, useCallback, useMemo } from "react";

export type SortDirection = "asc" | "desc";

export interface SortConfig<T> {
  key: keyof T | string;
  direction: SortDirection;
}

export interface SortResult<T> {
  sortConfig: SortConfig<T>;
  sortedItems: T[];
  sortBy: (key: keyof T | string) => void;
  setSortDirection: (direction: SortDirection) => void;
  resetSort: () => void;
}

/**
 * Hook for managing sort state and applying sorting
 * 
 * @template T - Type of items to sort
 * @param items - Array of items to sort
 * @param initialSort - Initial sort configuration
 * @param customComparators - Optional custom comparison functions for specific keys
 * @returns Sort state and methods
 * 
 * @example
 * ```tsx
 * const { sortConfig, sortedItems, sortBy } = useSort(
 *   services,
 *   { key: 'name', direction: 'asc' }
 * );
 * 
 * // Sort by column
 * <th onClick={() => sortBy('name')}>
 *   Name {sortConfig.key === 'name' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
 * </th>
 * ```
 */
export function useSort<T>(
  items: T[],
  initialSort: SortConfig<T> = { key: "id" as keyof T, direction: "asc" },
  customComparators?: Partial<Record<keyof T | string, (a: T, b: T) => number>>
): SortResult<T> {
  const [sortConfig, setSortConfig] = useState<SortConfig<T>>(initialSort);

  const sortBy = useCallback(
    (key: keyof T | string) => {
      setSortConfig((current) => ({
        key,
        direction:
          current.key === key && current.direction === "asc" ? "desc" : "asc",
      }));
    },
    []
  );

  const setSortDirection = useCallback((direction: SortDirection) => {
    setSortConfig((current) => ({ ...current, direction }));
  }, []);

  const resetSort = useCallback(() => {
    setSortConfig(initialSort);
  }, [initialSort]);

  const sortedItems = useMemo(() => {
    const sorted = [...items];
    const { key, direction } = sortConfig;

    // Check for custom comparator
    if (customComparators && customComparators[key]) {
      const comparator = customComparators[key]!;
      sorted.sort((a, b) => {
        const result = comparator(a, b);
        return direction === "asc" ? result : -result;
      });
      return sorted;
    }

    // Default comparator
    sorted.sort((a, b) => {
      const aValue = getNestedValue(a, key as string);
      const bValue = getNestedValue(b, key as string);

      if (aValue === bValue) return 0;
      if (aValue == null) return 1;
      if (bValue == null) return -1;

      let comparison = 0;
      if (typeof aValue === "string" && typeof bValue === "string") {
        comparison = aValue.localeCompare(bValue, "th");
      } else if (typeof aValue === "number" && typeof bValue === "number") {
        comparison = aValue - bValue;
      } else if (typeof aValue === "boolean" && typeof bValue === "boolean") {
        comparison = aValue === bValue ? 0 : aValue ? 1 : -1;
      } else {
        comparison = String(aValue).localeCompare(String(bValue), "th");
      }

      return direction === "asc" ? comparison : -comparison;
    });

    return sorted;
  }, [items, sortConfig, customComparators]);

  return {
    sortConfig,
    sortedItems,
    sortBy,
    setSortDirection,
    resetSort,
  };
}

/**
 * Helper function to get nested property value
 * Supports dot notation like 'user.name'
 */
function getNestedValue(obj: any, path: string): any {
  return path.split(".").reduce((current, key) => current?.[key], obj);
}
