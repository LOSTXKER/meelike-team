/**
 * Types Index
 * 
 * Re-exports all types from domain-specific files for backward compatibility.
 * Import types from '@/types' to use them throughout the app.
 */

// ===== COMMON TYPES =====
export type {
  SubscriptionPlan,
  SellerRank,
  ContactInfo,
  StoreContactInfo,
  Platform,
  ServiceType,
  ServiceMode,
  StoreTheme,
  StoreThemeConfig,
} from "./common";

// ===== SELLER TYPES =====
export type {
  Store,
  StoreRole,
  StorePermission,
  StoreUser,
  Seller,
  StoreService,
} from "./seller";

// ===== WORKER TYPES =====
export type {
  WorkerLevel,
  Worker,
  WorkerAccount,
  WorkerJob,
  WorkerBankAccount,
  Payout,
} from "./worker";

// ===== TEAM TYPES =====
export type {
  TeamRole,
  TeamPermission,
  AssistantConfig,
  Team,
  TeamReviewTag,
  TeamReview,
  TeamMember,
  TeamJoinRequest,
  TeamPayout,
} from "./team";

// ===== ORDER TYPES =====
export type {
  Order,
  OrderItem,
  OrderItemJob,
  OrderTimeline,
} from "./order";

// ===== JOB TYPES =====
export type {
  Job,
  TeamJob,  // Legacy alias for backward compatibility
  JobClaim,
} from "./job";

// ===== HUB TYPES =====
export type {
  HubPost,
  FindTeamPost,
  OutsourceJob,
  OutsourceBid,
} from "./hub";

// ===== AUTH TYPES =====
export type {
  UserRole,
  AuthUser,
} from "./auth";

// ===== MEELIKE API TYPES =====
export type {
  MeeLikeService,
  MeeLikeAPIRequest,
  MeeLikeAddOrderRequest,
  MeeLikeOrderStatusRequest,
  MeeLikeAddOrderResponse,
  MeeLikeOrderStatus,
  MeeLikeBalanceResponse,
  SellerMeeLikeConfig,
} from "./meelike";

// ===== KYC TYPES =====
export type {
  KYCLevel,
  KYCStatus,
  KYCDocumentType,
  OCRResult,
  KYCDocument,
  KYCData,
  KYCSubmissionRequest,
  KYCReviewRequest,
  KYCPendingItem,
  OTPType,
  OTPRequest,
  OTPVerifyRequest,
  OTPResponse,
} from "./kyc";

export {
  WITHDRAWAL_LIMITS,
  DEFAULT_KYC_DATA,
  getWithdrawalLimit,
  canWithdraw,
  getKYCLevelLabel,
  getKYCStatusLabel,
  meetsKYCRequirement,
  canPerformFinancialTransaction,
  canTopUp,
  canWithdrawMoney,
  getNextLevelRequirements,
  getNextKYCLevel,
} from "./kyc";
