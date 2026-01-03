/**
 * API Abstraction Layer
 * 
 * This module provides a unified interface for data fetching.
 * Currently uses mock data, but can be easily switched to real API calls.
 * 
 * Usage:
 * ```ts
 * import { api } from '@/lib/api';
 * 
 * const stats = await api.seller.getStats();
 * const orders = await api.seller.getOrders();
 * ```
 */

// Re-export domain APIs
export { sellerApi } from "./seller";
export { workerApi } from "./worker";
export { hubApi } from "./hub";
export { teamApi } from "./team";

// Re-export types from storage-helpers
export type { Transaction, TeamApplication } from "./storage-helpers";

// Import for combined api object
import { sellerApi } from "./seller";
import { workerApi } from "./worker";
import { hubApi } from "./hub";
import { teamApi } from "./team";

// ===== COMBINED API OBJECT =====
export const api = {
  seller: sellerApi,
  worker: workerApi,
  hub: hubApi,
  team: teamApi,
};

export default api;
