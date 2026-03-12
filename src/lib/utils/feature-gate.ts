import {
  OVERAGE_FEE,
  PLANS,
  canUseFeature as planCanUseFeature,
  getOrderQuota,
  isPlanAtLeast,
  type PlanFeatures,
  type SubscriptionPlan,
} from "@/lib/constants/plans";

export { getOrderQuota, isPlanAtLeast };

export function hasFeature(
  plan: SubscriptionPlan,
  feature: keyof PlanFeatures
): boolean {
  return planCanUseFeature(plan, feature);
}

export function isOverQuota(
  plan: SubscriptionPlan,
  usedOrders: number
): boolean {
  const quota = getOrderQuota(plan);
  if (quota === Infinity) return false;
  return usedOrders >= quota;
}

export function getOverageFee(overageOrders: number): number {
  return overageOrders * OVERAGE_FEE;
}

export function getQuotaPercent(
  plan: SubscriptionPlan,
  usedOrders: number
): number {
  const quota = getOrderQuota(plan);
  if (quota === Infinity) return 0;
  return Math.min(100, Math.round((usedOrders / quota) * 100));
}

export function getRemainingQuota(
  plan: SubscriptionPlan,
  usedOrders: number
): number {
  const quota = getOrderQuota(plan);
  if (quota === Infinity) return Infinity;
  return Math.max(0, quota - usedOrders);
}

export function canCreateOrder(
  plan: SubscriptionPlan,
  usedOrders: number,
  hasUnpaidOverageBill: boolean
): { allowed: boolean; isOverage: boolean; reason?: string } {
  if (hasUnpaidOverageBill) {
    return {
      allowed: false,
      isOverage: false,
      reason: "มีค่าธรรมเนียม overage ที่ยังค้างชำระ กรุณาชำระก่อนสร้างออเดอร์ใหม่",
    };
  }

  const quota = getOrderQuota(plan);
  if (quota === Infinity) {
    return { allowed: true, isOverage: false };
  }

  if (usedOrders < quota) {
    return { allowed: true, isOverage: false };
  }

  return {
    allowed: true,
    isOverage: true,
    reason: `เกินโควต้า — จะถูกเรียกเก็บ ฿${OVERAGE_FEE}/ออเดอร์`,
  };
}

export function getPlanDisplayName(plan: SubscriptionPlan): string {
  return PLANS[plan].name;
}

export function getPlanPrice(plan: SubscriptionPlan): number {
  return PLANS[plan].price;
}
