/**
 * useBulkSelection Hook
 * 
 * Provides bulk selection functionality for lists/tables
 * Extracted from services page to make it reusable
 */

"use client";

import { useState, useCallback, useMemo } from "react";

export interface BulkSelectionResult<T extends { id: string }> {
  selectedIds: Set<string>;
  selectedCount: number;
  selectedItems: T[];
  isAllSelected: boolean;
  isSelected: (id: string) => boolean;
  toggleSelection: (id: string) => void;
  toggleSelectAll: () => void;
  clearSelection: () => void;
  selectItems: (ids: string[]) => void;
  deselectItems: (ids: string[]) => void;
}

/**
 * Hook for managing bulk selection state
 * 
 * @template T - Type of items (must have 'id' field)
 * @param items - Array of items to select from
 * @returns Bulk selection state and methods
 * 
 * @example
 * ```tsx
 * const { selectedIds, toggleSelection, toggleSelectAll, clearSelection } = 
 *   useBulkSelection(services);
 * 
 * // Select/deselect individual item
 * <input 
 *   type="checkbox" 
 *   checked={selectedIds.has(item.id)}
 *   onChange={() => toggleSelection(item.id)} 
 * />
 * 
 * // Select/deselect all
 * <input 
 *   type="checkbox"
 *   checked={isAllSelected}
 *   onChange={toggleSelectAll}
 * />
 * ```
 */
export function useBulkSelection<T extends { id: string }>(
  items: T[]
): BulkSelectionResult<T> {
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  const toggleSelection = useCallback((id: string) => {
    setSelectedIds((prev) => {
      const newSelection = new Set(prev);
      if (newSelection.has(id)) {
        newSelection.delete(id);
      } else {
        newSelection.add(id);
      }
      return newSelection;
    });
  }, []);

  const toggleSelectAll = useCallback(() => {
    setSelectedIds((prev) => {
      if (prev.size === items.length && items.length > 0) {
        return new Set();
      } else {
        return new Set(items.map((item) => item.id));
      }
    });
  }, [items]);

  const clearSelection = useCallback(() => {
    setSelectedIds(new Set());
  }, []);

  const selectItems = useCallback((ids: string[]) => {
    setSelectedIds((prev) => {
      const newSelection = new Set(prev);
      ids.forEach((id) => newSelection.add(id));
      return newSelection;
    });
  }, []);

  const deselectItems = useCallback((ids: string[]) => {
    setSelectedIds((prev) => {
      const newSelection = new Set(prev);
      ids.forEach((id) => newSelection.delete(id));
      return newSelection;
    });
  }, []);

  const isSelected = useCallback(
    (id: string) => selectedIds.has(id),
    [selectedIds]
  );

  const selectedItems = useMemo(() => {
    return items.filter((item) => selectedIds.has(item.id));
  }, [items, selectedIds]);

  const isAllSelected = useMemo(() => {
    return selectedIds.size === items.length && items.length > 0;
  }, [selectedIds, items]);

  return {
    selectedIds,
    selectedCount: selectedIds.size,
    selectedItems,
    isAllSelected,
    isSelected,
    toggleSelection,
    toggleSelectAll,
    clearSelection,
    selectItems,
    deselectItems,
  };
}
