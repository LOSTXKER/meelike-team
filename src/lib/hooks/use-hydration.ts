"use client";

import { useSyncExternalStore } from "react";

const emptySubscribe = () => () => {};

/**
 * Hook to detect if the component has been hydrated on the client.
 * Useful for avoiding hydration mismatches with client-only features.
 * 
 * @example
 * ```tsx
 * const hydrated = useHydration();
 * if (!hydrated) return <Skeleton />;
 * return <ClientOnlyComponent />;
 * ```
 */
export function useHydration() {
  return useSyncExternalStore(
    emptySubscribe,
    () => true,  // Client: always true
    () => false  // Server: always false
  );
}
