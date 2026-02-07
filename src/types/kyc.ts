/**
 * KYC (Know Your Customer) Types
 * 
 * Types for identity verification system.
 * 4 levels: None, Basic, Verified, Business
 * 
 * Level Requirements:
 * - none: Email verified only (during registration) - Cannot top-up or withdraw
 * - basic: Phone OTP verified - Can top-up only (cannot withdraw)
 * - verified: ID Card + Selfie - Can withdraw up to ฿10,000/day
 * - business: Company registration - Unlimited withdrawal
 */

// ===== KYC LEVELS =====
export type KYCLevel = 'none' | 'basic' | 'verified' | 'business';

// ===== KYC STATUS =====
export type KYCStatus = 'pending' | 'submitted' | 'reviewing' | 'approved' | 'rejected';

// ===== KYC DOCUMENT TYPE =====
export type KYCDocumentType = 'id_card' | 'selfie_with_id' | 'company_cert' | 'tax_cert';

// ===== KYC ACTION TYPE =====
/** Shared action type used by KYC gate, modals, and related components */
export type KYCAction = 'topup' | 'withdraw' | 'create_team' | 'general';

// ===== WITHDRAWAL LIMITS BY LEVEL =====
// Note: Only Verified and above can withdraw
export const WITHDRAWAL_LIMITS: Record<KYCLevel, number> = {
  none: 0,          // Cannot withdraw
  basic: 0,         // Cannot withdraw (must verify ID card first)
  verified: 10000,  // ฿10,000/day
  business: 999999, // Unlimited (effectively)
};

// ===== OCR RESULT =====
export interface OCRResult {
  success: boolean;
  data?: {
    idNumber: string;      // เลข 13 หลัก
    prefix: string;        // คำนำหน้า
    firstName: string;     // ชื่อ
    lastName: string;      // นามสกุล
    birthDate: string;     // วันเกิด (YYYY-MM-DD)
    address?: string;      // ที่อยู่
    issueDate?: string;    // วันออกบัตร
    expiryDate?: string;   // วันหมดอายุ
  };
  confidence: number;      // 0-100
  error?: string;
}

// ===== KYC DOCUMENT =====
export interface KYCDocument {
  id: string;
  type: KYCDocumentType;
  fileUrl: string;
  fileName: string;
  fileSize: number;
  mimeType: string;
  uploadedAt: string;
  ocrResult?: OCRResult;
}

// ===== KYC DATA =====
export interface KYCData {
  level: KYCLevel;
  status: KYCStatus;
  
  // Basic Level - Phone & Email Verification
  phoneVerified: boolean;
  emailVerified: boolean;
  phoneVerifiedAt?: string;
  emailVerifiedAt?: string;
  
  // Verified Level - ID Card
  idCardNumber?: string;         // เลขบัตรประชาชน (13 หลัก)
  idCardPrefix?: string;         // คำนำหน้า (นาย/นาง/นางสาว)
  idCardFirstName?: string;      // ชื่อจริง (จาก OCR)
  idCardLastName?: string;       // นามสกุล (จาก OCR)
  idCardBirthDate?: string;      // วันเกิด (จาก OCR)
  idCardAddress?: string;        // ที่อยู่ (จาก OCR)
  idCardImageUrl?: string;       // รูปบัตรประชาชน
  selfieWithIdUrl?: string;      // Selfie คู่บัตร
  idCardVerifiedAt?: string;
  
  // Business Level
  companyName?: string;          // ชื่อบริษัท
  taxId?: string;                // เลขประจำตัวผู้เสียภาษี
  certDocUrl?: string;           // หนังสือรับรองบริษัท
  businessVerifiedAt?: string;
  
  // Review Information
  reviewedBy?: string;           // Admin ID who reviewed
  reviewedAt?: string;
  rejectionReason?: string;
  
  // Documents
  documents?: KYCDocument[];
  
  // Timestamps
  submittedAt?: string;
  updatedAt?: string;
}

// ===== KYC SUBMISSION REQUEST =====
export interface KYCSubmissionRequest {
  level: 'verified' | 'business';
  
  // For Verified Level
  idCardImage?: File;
  selfieWithId?: File;
  idCardData?: {
    idNumber: string;
    prefix: string;
    firstName: string;
    lastName: string;
    birthDate: string;
    address?: string;
  };
  
  // For Business Level
  companyName?: string;
  taxId?: string;
  certDoc?: File;
}

// ===== KYC REVIEW REQUEST =====
export interface KYCReviewRequest {
  userId: string;
  userType: 'seller' | 'worker';
  action: 'approve' | 'reject';
  rejectionReason?: string;
}

// ===== KYC PENDING ITEM (for admin) =====
export interface KYCPendingItem {
  id: string;
  userId: string;
  userType: 'seller' | 'worker';
  userName: string;
  userEmail: string;
  userPhone?: string;
  currentLevel: KYCLevel;
  requestedLevel: KYCLevel;
  status: KYCStatus;
  kyc: KYCData;
  submittedAt: string;
  createdAt: string;
}

// ===== OTP VERIFICATION =====
export type OTPType = 'phone' | 'email';

export interface OTPRequest {
  type: OTPType;
  destination: string;  // phone number or email
}

export interface OTPVerifyRequest {
  type: OTPType;
  destination: string;
  code: string;
}

export interface OTPResponse {
  success: boolean;
  message: string;
  expiresAt?: string;
  attemptsRemaining?: number;
}

// ===== DEFAULT KYC DATA =====
export const DEFAULT_KYC_DATA: KYCData = {
  level: 'none',
  status: 'pending',
  phoneVerified: false,
  emailVerified: false,
};

// ===== HELPER FUNCTIONS =====
export function getWithdrawalLimit(level: KYCLevel): number {
  return WITHDRAWAL_LIMITS[level];
}

export function canWithdraw(kycLevel: KYCLevel, amount: number, todayWithdrawn: number): boolean {
  const limit = WITHDRAWAL_LIMITS[kycLevel];
  return (todayWithdrawn + amount) <= limit;
}

export function getKYCLevelLabel(level: KYCLevel): string {
  const labels: Record<KYCLevel, string> = {
    none: 'ยังไม่ยืนยัน',
    basic: 'Basic',
    verified: 'Verified',
    business: 'Business',
  };
  return labels[level];
}

export function getKYCStatusLabel(status: KYCStatus): string {
  const labels: Record<KYCStatus, string> = {
    pending: 'รอดำเนินการ',
    submitted: 'ส่งแล้ว รอตรวจสอบ',
    reviewing: 'กำลังตรวจสอบ',
    approved: 'อนุมัติแล้ว',
    rejected: 'ถูกปฏิเสธ',
  };
  return labels[status];
}

/**
 * Check if a KYC level meets the required level
 */
export function meetsKYCRequirement(currentLevel: KYCLevel, requiredLevel: KYCLevel): boolean {
  const levelOrder: KYCLevel[] = ['none', 'basic', 'verified', 'business'];
  return levelOrder.indexOf(currentLevel) >= levelOrder.indexOf(requiredLevel);
}

/**
 * Check if user can top-up (Seller)
 * Requires at least 'basic' level (phone verified)
 */
export function canTopUp(kycLevel: KYCLevel): boolean {
  return meetsKYCRequirement(kycLevel, 'basic');
}

/**
 * Check if user can withdraw (Worker/Seller)
 * Requires at least 'verified' level (ID card + selfie)
 */
export function canWithdrawMoney(kycLevel: KYCLevel): boolean {
  return meetsKYCRequirement(kycLevel, 'verified');
}

/**
 * Check if user can perform financial transactions (top-up/withdraw)
 * Requires at least 'basic' level for top-up
 * @deprecated Use canTopUp() or canWithdrawMoney() instead for clarity
 */
export function canPerformFinancialTransaction(kycLevel: KYCLevel): boolean {
  return meetsKYCRequirement(kycLevel, 'basic');
}

/**
 * Get the next KYC level requirements description
 */
export function getNextLevelRequirements(currentLevel: KYCLevel): string[] {
  switch (currentLevel) {
    case 'none':
      return ['ยืนยันเบอร์โทรผ่าน OTP'];
    case 'basic':
      return ['อัปโหลดรูปบัตรประชาชน', 'ถ่าย Selfie คู่บัตร'];
    case 'verified':
      return ['หนังสือรับรองบริษัท', 'เลขประจำตัวผู้เสียภาษี'];
    case 'business':
      return []; // Already at max level
  }
}

/**
 * Get the next KYC level
 */
export function getNextKYCLevel(currentLevel: KYCLevel): KYCLevel | null {
  const levels: KYCLevel[] = ['none', 'basic', 'verified', 'business'];
  const currentIndex = levels.indexOf(currentLevel);
  if (currentIndex < levels.length - 1) {
    return levels[currentIndex + 1];
  }
  return null;
}
