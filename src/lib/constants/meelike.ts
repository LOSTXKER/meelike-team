/**
 * MeeLike API Constants
 * 
 * Constants for MeeLike service integration.
 * This would typically come from a real API, but for demo purposes
 * we define empty arrays that can be populated from the API.
 */

import type { MeeLikeService } from "@/types";

// MeeLike service categories - formatted for Select component
export const meeLikeCategories = [
  { value: "facebook", label: "Facebook" },
  { value: "instagram", label: "Instagram" },
  { value: "tiktok", label: "TikTok" },
  { value: "youtube", label: "YouTube" },
  { value: "twitter", label: "Twitter/X" },
];

// Mock MeeLike services - empty by default
// In production, these would be fetched from the MeeLike API
export const mockMeeLikeServices: MeeLikeService[] = [];

// Helper function to get rate per unit from service or rate value
export function getMeeLikeRatePerUnit(serviceOrRate: MeeLikeService | string | number | null | undefined): number {
  if (!serviceOrRate) return 0;
  
  // If it's a number (rate), divide by 1000
  if (typeof serviceOrRate === 'number') {
    return serviceOrRate / 1000;
  }
  
  // If it's a string (rate as string), parse and divide by 1000
  if (typeof serviceOrRate === 'string') {
    const parsed = parseFloat(serviceOrRate);
    return isNaN(parsed) ? 0 : parsed / 1000;
  }
  
  // If it's a MeeLikeService object
  const rate = typeof serviceOrRate.rate === 'number' ? serviceOrRate.rate : 0;
  return rate / 1000;
}

// Helper to convert MeeLike service to store service format
export function convertMeeLikeToStoreService(
  meeLikeService: MeeLikeService,
  sellerId: string,
  markup: number = 50 // Default 50% markup
): Partial<import("@/types").StoreService> {
  const costPrice = getMeeLikeRatePerUnit(meeLikeService);
  const sellPrice = costPrice * (1 + markup / 100);
  
  const minQty = typeof meeLikeService.min === 'number' ? meeLikeService.min : 100;
  const maxQty = typeof meeLikeService.max === 'number' ? meeLikeService.max : 10000;
  
  return {
    sellerId,
    name: meeLikeService.name,
    description: meeLikeService.name,
    category: meeLikeService.category as import("@/types").Platform,
    type: meeLikeService.type as import("@/types").ServiceType,
    serviceType: "bot",
    costPrice,
    sellPrice,
    minQuantity: minQty,
    maxQuantity: maxQty,
    meelikeServiceId: meeLikeService.service,
    isActive: true,
    showInStore: true,
  };
}
