/**
 * Utility Functions
 * 
 * Re-exports all utility functions from organized modules
 * This file maintains backward compatibility while using the new modular structure
 */

import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

// Export all from organized modules
export * from "./utils/format";
export * from "./utils/calculations";
export * from "./utils/helpers";

// Keep cn function here as it's commonly used
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}