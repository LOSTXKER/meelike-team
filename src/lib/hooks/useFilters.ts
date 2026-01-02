/**
 * useFilters Hook
 * 
 * Provides filtering functionality for lists
 */

"use client";

import { useState, useCallback, useMemo } from "react";

export type FilterValue = string | number | boolean | null | undefined;
export type FilterConfig<T> = Record<string, (item: T, value: FilterValue) => boolean>;

export interface FiltersResult<T> {
  filters: Record<string, FilterValue>;
  setFilter: (key: string, value: FilterValue) => void;
  resetFilters: () => void;
  filteredItems: T[];
  activeFilterCount: number;
}

/**
 * Hook for managing filter state and applying filters
 * 
 * @template T - Type of items to filter
 * @param items - Array of items to filter
 * @param filterConfig - Configuration object defining how each filter works
 * @param initialFilters - Initial filter values
 * @returns Filter state and methods
 * 
 * @example
 * ```tsx
 * const filterConfig = {
 *   platform: (service, value) => !value || value === 'all' || service.category === value,
 *   type: (service, value) => !value || value === 'all' || service.type === value,
 *   search: (service, value) => !value || service.name.toLowerCase().includes(value.toLowerCase())
 * };
 * 
 * const { filters, setFilter, filteredItems } = useFilters(
 *   services,
 *   filterConfig,
 *   { platform: 'all', type: 'all', search: '' }
 * );
 * ```
 */
export function useFilters<T>(
  items: T[],
  filterConfig: FilterConfig<T>,
  initialFilters: Record<string, FilterValue> = {}
): FiltersResult<T> {
  const [filters, setFilters] = useState<Record<string, FilterValue>>(initialFilters);

  const setFilter = useCallback((key: string, value: FilterValue) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  }, []);

  const resetFilters = useCallback(() => {
    setFilters(initialFilters);
  }, [initialFilters]);

  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      return Object.entries(filters).every(([key, value]) => {
        const filterFn = filterConfig[key];
        if (!filterFn) return true;
        return filterFn(item, value);
      });
    });
  }, [items, filters, filterConfig]);

  const activeFilterCount = useMemo(() => {
    return Object.entries(filters).filter(([key, value]) => {
      const initialValue = initialFilters[key];
      return value !== initialValue && value !== "" && value !== null && value !== undefined;
    }).length;
  }, [filters, initialFilters]);

  return {
    filters,
    setFilter,
    resetFilters,
    filteredItems,
    activeFilterCount,
  };
}
