"use client";

import { useState, useCallback } from "react";

interface UseCopyToClipboardOptions {
  /** Success message to show (default: "คัดลอกแล้ว!") */
  successMessage?: string;
  /** Duration to show success state in ms (default: 2000) */
  successDuration?: number;
  /** Use native alert instead of state (default: false) */
  useAlert?: boolean;
}

interface UseCopyToClipboardReturn {
  /** Copy text to clipboard */
  copy: (text: string) => Promise<boolean>;
  /** Whether copy was successful (resets after successDuration) */
  copied: boolean;
  /** Any error that occurred */
  error: Error | null;
  /** Reset the copied state */
  reset: () => void;
}

/**
 * Hook for copying text to clipboard with feedback
 * 
 * @example
 * ```tsx
 * const { copy, copied } = useCopyToClipboard();
 * 
 * <Button onClick={() => copy(inviteLink)}>
 *   {copied ? "คัดลอกแล้ว!" : "คัดลอก"}
 * </Button>
 * ```
 */
export function useCopyToClipboard(
  options: UseCopyToClipboardOptions = {}
): UseCopyToClipboardReturn {
  const {
    successMessage = "คัดลอกแล้ว!",
    successDuration = 2000,
    useAlert = false,
  } = options;

  const [copied, setCopied] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const reset = useCallback(() => {
    setCopied(false);
    setError(null);
  }, []);

  const copy = useCallback(
    async (text: string): Promise<boolean> => {
      if (!navigator?.clipboard) {
        const err = new Error("Clipboard API not available");
        setError(err);
        console.error(err);
        return false;
      }

      try {
        await navigator.clipboard.writeText(text);
        setCopied(true);
        setError(null);

        if (useAlert) {
          alert(successMessage);
        }

        // Reset after duration
        setTimeout(() => {
          setCopied(false);
        }, successDuration);

        return true;
      } catch (err) {
        const error = err instanceof Error ? err : new Error("Failed to copy");
        setError(error);
        console.error("Copy failed:", error);
        return false;
      }
    },
    [successMessage, successDuration, useAlert]
  );

  return { copy, copied, error, reset };
}

/**
 * Simple copy function for one-off use (with alert)
 * 
 * @example
 * ```tsx
 * <Button onClick={() => copyToClipboard(text, "ลิงก์ถูกคัดลอกแล้ว!")}>
 *   คัดลอก
 * </Button>
 * ```
 */
export async function copyToClipboard(
  text: string,
  successMessage = "คัดลอกแล้ว!"
): Promise<boolean> {
  if (!navigator?.clipboard) {
    console.error("Clipboard API not available");
    return false;
  }

  try {
    await navigator.clipboard.writeText(text);
    alert(successMessage);
    return true;
  } catch (err) {
    console.error("Copy failed:", err);
    return false;
  }
}
