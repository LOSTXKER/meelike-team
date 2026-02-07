/**
 * Seller Services API
 */

import { getCurrentSellerId } from "@/lib/storage";
import { generateId } from "@/lib/utils/helpers";

import {
  delay,
  getServicesFromStorage,
  saveServicesToStorage,
} from "../storage-helpers";

import type { StoreService } from "@/types";

// ===== FUNCTIONS =====

export async function getServices(): Promise<StoreService[]> {
  await delay();
  return getServicesFromStorage();
}

export async function createServices(
  services: Partial<StoreService>[]
): Promise<StoreService[]> {
  await delay();

  const existingServices = getServicesFromStorage();
  const now = new Date().toISOString();
  const sellerId = getCurrentSellerId() || "seller-1";

  const newServices: StoreService[] = services.map((service) => ({
    id: `svc-${generateId()}`,
    sellerId,
    name: service.name || "",
    description: service.description,
    category: service.category || "facebook",
    type: service.type || "like",
    serviceType: service.serviceType || "bot",
    // Bot: ใช้ costPrice, Human: ค่าจ้าง Worker กรอกตอนสร้าง Job
    costPrice:
      service.serviceType === "bot" ? service.costPrice || 0 : undefined,
    // workerRate ไม่ต้องกรอกตอนสร้างบริการ - จะกรอกตอนสร้าง Job
    sellPrice: service.sellPrice || 0,
    minQuantity: service.minQuantity || 100,
    maxQuantity: service.maxQuantity || 10000,
    meelikeServiceId: service.meelikeServiceId,
    estimatedTime: service.estimatedTime,
    isActive: service.isActive ?? true,
    showInStore: service.showInStore ?? true,
    orderCount: 0,
    createdAt: now,
    updatedAt: now,
  }));

  const updatedServices = [...newServices, ...existingServices];
  saveServicesToStorage(updatedServices);

  return newServices;
}

export async function updateService(
  id: string,
  patch: Partial<StoreService>
): Promise<StoreService | null> {
  await delay();

  const services = getServicesFromStorage();
  const serviceIndex = services.findIndex((s) => s.id === id);

  if (serviceIndex === -1) return null;

  const now = new Date().toISOString();
  services[serviceIndex] = {
    ...services[serviceIndex],
    ...patch,
    updatedAt: now,
  };

  saveServicesToStorage(services);
  return services[serviceIndex];
}

export async function deleteService(id: string): Promise<boolean> {
  await delay();

  const services = getServicesFromStorage();
  const filtered = services.filter((s) => s.id !== id);

  if (filtered.length === services.length) return false;

  saveServicesToStorage(filtered);
  return true;
}

export async function bulkUpdateServices(
  ids: string[],
  patch: Partial<StoreService>
): Promise<number> {
  await delay();

  const services = getServicesFromStorage();
  const now = new Date().toISOString();
  let updateCount = 0;

  const updatedServices = services.map((service) => {
    if (ids.includes(service.id)) {
      updateCount++;
      return {
        ...service,
        ...patch,
        updatedAt: now,
      };
    }
    return service;
  });

  saveServicesToStorage(updatedServices);
  return updateCount;
}
