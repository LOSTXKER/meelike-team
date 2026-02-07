"use client";

import { useEffect, useCallback, useState } from "react";

/**
 * Hook that warns users before navigating away with unsaved changes.
 *
 * Usage:
 * ```ts
 * const { setDirty, setClean } = useUnsavedChanges();
 * // call setDirty() when form changes
 * // call setClean() after save
 * ```
 */
export function useUnsavedChanges(enabled = true) {
  const [isDirty, setIsDirty] = useState(false);

  const setDirty = useCallback(() => setIsDirty(true), []);
  const setClean = useCallback(() => setIsDirty(false), []);

  useEffect(() => {
    if (!enabled || !isDirty) return;

    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      e.preventDefault();
      // Modern browsers ignore custom messages but still show the dialog
      e.returnValue = "คุณมีการเปลี่ยนแปลงที่ยังไม่ได้บันทึก ต้องการออกหรือไม่?";
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [enabled, isDirty]);

  return { isDirty, setDirty, setClean };
}
