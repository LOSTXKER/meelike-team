/**
 * Shared Components Barrel Export
 *
 * Organized by domain sub-barrels for cleaner imports.
 * Import from "@/components/shared" as before, or from specific sub-barrels:
 *
 *   import { FormField } from "@/components/shared/forms";
 */

// ===== Layout =====
export * from "./layout";

// ===== Feedback & Error Handling =====
export * from "./feedback";

// ===== Badges =====
export * from "./badges";

// ===== Stats =====
export * from "./stats";

// ===== Tables =====
export * from "./tables";

// ===== Forms =====
export * from "./forms";

// ===== Modals =====
export * from "./modals";


// ===== OTP =====
export { OTPInput } from "./OTPInput";

// ===== Help System =====
export * from "./help";

// ===== Filters =====
export { FilterBar, SegmentedControl } from "./filter-bar";
export { FilterTabs, memberStatusTabs, jobStatusTabs, payoutStatusTabs } from "./filter-tabs";
export type { FilterOption } from "./filter-bar";
export type { FilterTab, MemberStatus, JobFilterStatus, PayoutFilterStatus } from "./filter-tabs";

// ===== Cards =====
export { InfoCard } from "./InfoCard";
export { QuickActionCard } from "./QuickActionCard";

// ===== Gamification =====
export { LevelBenefitsTable } from "./level-benefits-table";
export { DailyStreak } from "./daily-streak";

// ===== Dev Tools =====
export { DevTools } from "./dev-tools";
