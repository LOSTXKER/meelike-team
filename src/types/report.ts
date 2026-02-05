/**
 * Content Report Types
 * 
 * Types for the content reporting system where Workers can report
 * inappropriate content (gambling, illegal, scam, adult content, etc.)
 */

// Report categories
export type ReportCategory = 
  | 'gambling'      // การพนัน/คาสิโนออนไลน์
  | 'illegal'       // เนื้อหาผิดกฎหมาย
  | 'scam'          // โฆษณาหลอกลวง/Scam
  | 'adult'         // เนื้อหาสำหรับผู้ใหญ่
  | 'other';        // อื่นๆ

// Report status
export type ReportStatus = 
  | 'pending'       // รอตรวจสอบ
  | 'reviewed'      // กำลังตรวจสอบ
  | 'confirmed'     // ยืนยันว่าผิดกฎ
  | 'dismissed'     // ปฏิเสธ (ไม่ผิดกฎ)
  | 'false_report'; // รายงานเท็จ

// Report decision (Admin action)
export type ReportDecision = 
  | 'confirm'       // ยืนยันรายงาน
  | 'dismiss'       // ปฏิเสธรายงาน
  | 'false_report'; // รายงานเท็จ (ลงโทษ Reporter)

// Main Report interface
export interface ContentReport {
  id: string;
  
  // Reporter info
  reporterId: string;        // Worker ID ที่รายงาน
  reporterName?: string;     // ชื่อผู้รายงาน
  
  // Target info
  jobId: string;             // Job ที่ถูกรายงาน
  jobTitle?: string;         // ชื่องาน
  targetUrl?: string;        // URL ของงาน
  
  // Team info
  teamId: string;            // ทีมที่รับงานนี้
  teamName?: string;         // ชื่อทีม
  teamLeaderId: string;      // หัวหน้าทีมที่รับผิดชอบ
  teamLeaderName?: string;   // ชื่อหัวหน้าทีม
  
  // Seller info
  sellerId?: string;         // Seller ที่สร้างงาน
  sellerName?: string;       // ชื่อ Seller
  
  // Report details
  category: ReportCategory;  // ประเภทการรายงาน
  description?: string;      // รายละเอียดเพิ่มเติม
  evidence?: string[];       // หลักฐาน (screenshots, URLs)
  
  // Status
  status: ReportStatus;
  
  // Timestamps
  createdAt: Date;
  reviewedAt?: Date;
  
  // Review info
  reviewedBy?: string;       // Admin ID ที่ตรวจสอบ
  reviewerName?: string;     // ชื่อ Admin
  reviewNote?: string;       // บันทึกจาก Admin
  decision?: ReportDecision; // ผลการตัดสิน
  action?: string;           // การดำเนินการ
}

// Worker report stats
export interface WorkerReportStats {
  totalReports: number;      // รายงานทั้งหมด
  confirmedReports: number;  // รายงานที่ถูกต้อง
  dismissedReports: number;  // รายงานที่ถูกปฏิเสธ
  falseReports: number;      // รายงานเท็จ
  canReport: boolean;        // สามารถรายงานได้หรือไม่
  reportBannedUntil?: Date;  // ถูกแบนรายงานถึงวันที่
}

// Report credibility badge
export type ReporterCredibility = 
  | 'trusted'    // น่าเชื่อถือ (confirmed > 3, false = 0)
  | 'normal'     // ปกติ
  | 'suspicious'; // น่าสงสัย (false > 0)

// Category labels in Thai
export const REPORT_CATEGORY_LABELS: Record<ReportCategory, string> = {
  gambling: 'การพนัน/คาสิโนออนไลน์',
  illegal: 'เนื้อหาผิดกฎหมาย',
  scam: 'โฆษณาหลอกลวง/Scam',
  adult: 'เนื้อหาสำหรับผู้ใหญ่',
  other: 'อื่นๆ',
};

// Status labels in Thai
export const REPORT_STATUS_LABELS: Record<ReportStatus, string> = {
  pending: 'รอตรวจสอบ',
  reviewed: 'กำลังตรวจสอบ',
  confirmed: 'ยืนยันผิดกฎ',
  dismissed: 'ปฏิเสธ',
  false_report: 'รายงานเท็จ',
};

// Helper functions
export function getReporterCredibility(stats: WorkerReportStats): ReporterCredibility {
  if (stats.falseReports > 0) return 'suspicious';
  if (stats.confirmedReports >= 3) return 'trusted';
  return 'normal';
}

export function canWorkerReport(stats: WorkerReportStats): boolean {
  if (!stats.canReport) return false;
  if (stats.reportBannedUntil && new Date() < stats.reportBannedUntil) return false;
  return true;
}

export const DEFAULT_WORKER_REPORT_STATS: WorkerReportStats = {
  totalReports: 0,
  confirmedReports: 0,
  dismissedReports: 0,
  falseReports: 0,
  canReport: true,
};
