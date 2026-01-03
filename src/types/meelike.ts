/**
 * MeeLike API Types
 * 
 * Types for MeeLike API integration.
 * API Docs: https://api-docs.meelike-th.com/
 */

// ===== MEELIKE SERVICE =====
export interface MeeLikeService {
  service: string;      // Service ID จาก MeeLike
  name: string;         // ชื่อบริการ
  type: string;         // ประเภท เช่น "Facebook Likes"
  category: string;     // หมวดหมู่ เช่น "Facebook"
  rate: string;         // ราคาต่อ 1000 หน่วย (บาท)
  min: string;          // จำนวนขั้นต่ำ
  max: string;          // จำนวนสูงสุด
  refill: boolean;      // รองรับ Refill หรือไม่
  cancel: boolean;      // ยกเลิกได้หรือไม่
  description?: string; // รายละเอียดเพิ่มเติม
  dripfeed?: boolean;   // รองรับ Drip-feed หรือไม่
  averageTime?: string; // เวลาเฉลี่ยในการส่งมอบ
}

// ===== MEELIKE API REQUESTS =====
export interface MeeLikeAPIRequest {
  key: string;
  action: "services" | "add" | "status" | "statuses" | "refill" | "refills" | "refill_status" | "refill_statuses" | "cancel" | "balance";
}

export interface MeeLikeAddOrderRequest extends MeeLikeAPIRequest {
  action: "add";
  service: string;
  link: string;
  quantity: string;
  runs?: string;
  interval?: string;
}

export interface MeeLikeOrderStatusRequest extends MeeLikeAPIRequest {
  action: "status";
  order: string;
}

// ===== MEELIKE API RESPONSES =====
export interface MeeLikeAddOrderResponse {
  order: string;        // Order ID
}

export interface MeeLikeOrderStatus {
  charge: string;       // ค่าใช้จ่าย
  start_count: string;  // จำนวนเริ่มต้น
  status: "Pending" | "In progress" | "Completed" | "Partial" | "Canceled" | "Processing";
  remains: string;      // จำนวนที่เหลือ
  currency: string;     // สกุลเงิน
}

export interface MeeLikeBalanceResponse {
  balance: string;      // ยอดเงินคงเหลือ
  currency: string;     // สกุลเงิน
}

// ===== SELLER'S MEELIKE CONFIG =====
export interface SellerMeeLikeConfig {
  id: string;
  sellerId: string;
  apiKey: string;
  apiKeyMasked: string; // แสดงเฉพาะ 4 ตัวท้าย
  isConnected: boolean;
  balance?: number;
  lastSyncAt?: string;
  createdAt: string;
  updatedAt: string;
}
