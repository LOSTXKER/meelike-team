"use client";

import { useState } from "react";
import {
  Flag,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Search,
  Filter,
  Eye,
  ExternalLink,
  User,
  Clock,
  ChevronDown,
  Ban,
  Shield,
  AlertCircle,
} from "lucide-react";
import {
  Card,
  Button,
  Badge,
  Input,
  Dialog,
} from "@/components/ui";
import {
  ContentReport,
  ReportStatus,
  ReportCategory,
  WorkerReportStats,
  REPORT_CATEGORY_LABELS,
  getReporterCredibility,
} from "@/types/report";
import { PROHIBITED_CONTENT } from "@/components/shared/ContentGuidelines";

// Mock reports data
const MOCK_REPORTS: ContentReport[] = [
  {
    id: "report-1",
    reporterId: "worker-123",
    reporterName: "สมชาย ใจดี",
    jobId: "job-001",
    jobTitle: "รีวิวสินค้าบน Facebook",
    targetUrl: "https://suspicious-gambling-site.com/promo",
    sellerId: "seller-456",
    sellerName: "ร้านค้าออนไลน์ ABC",
    teamId: "team-789",
    teamName: "ทีมโปรโมท",
    teamLeaderId: "leader-789",
    teamLeaderName: "หัวหน้าทีมโปรโมท",
    category: "gambling",
    description: "ลิงค์นี้พาไปยังเว็บพนันออนไลน์ มีคาสิโนและสล็อต",
    status: "pending",
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
  },
  {
    id: "report-2",
    reporterId: "worker-456",
    reporterName: "นภา รักสงบ",
    jobId: "job-002",
    jobTitle: "โพสต์โปรโมทร้านค้า Instagram",
    targetUrl: "https://example-shop.com/product",
    sellerId: "seller-789",
    sellerName: "ร้านขายเสื้อผ้า XYZ",
    teamId: "team-101",
    teamName: "ทีมแฟชั่น",
    teamLeaderId: "leader-101",
    teamLeaderName: "หัวหน้าทีมแฟชั่น",
    category: "scam",
    description: "สงสัยว่าเป็นแชร์ลูกโซ่ มีการให้สมัครสมาชิกเพื่อรับส่วนแบ่ง",
    status: "pending",
    createdAt: new Date(Date.now() - 5 * 60 * 60 * 1000), // 5 hours ago
  },
  {
    id: "report-3",
    reporterId: "worker-789",
    reporterName: "วิชัย มุ่งมั่น",
    jobId: "job-003",
    jobTitle: "รีวิว YouTube Channel",
    targetUrl: "https://youtube.com/watch?v=example",
    sellerId: "seller-123",
    sellerName: "ช่องความรู้ไทย",
    teamId: "team-202",
    teamName: "ทีม YouTube",
    teamLeaderId: "leader-202",
    teamLeaderName: "หัวหน้าทีม YouTube",
    category: "other",
    description: "เนื้อหาปกติ แต่รายงานเพื่อทดสอบระบบ",
    status: "dismissed",
    createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000), // 1 day ago
    reviewedAt: new Date(Date.now() - 20 * 60 * 60 * 1000),
    reviewedBy: "admin-001",
    decision: "dismiss",
    reviewNote: "เนื้อหาปกติ ไม่พบการฝ่าฝืน",
  },
  {
    id: "report-4",
    reporterId: "worker-101",
    reporterName: "มานี มีสุข",
    jobId: "job-004",
    jobTitle: "โปรโมทเว็บไซต์สุขภาพ",
    targetUrl: "https://health-scam-site.com",
    sellerId: "seller-999",
    sellerName: "ร้านอาหารเสริม",
    teamId: "team-303",
    teamName: "ทีมสุขภาพ",
    teamLeaderId: "leader-303",
    teamLeaderName: "หัวหน้าทีมสุขภาพ",
    category: "illegal",
    description: "ขายยาลดน้ำหนักที่ไม่ได้รับอนุญาต อ้างว่าเป็น อย.",
    status: "confirmed",
    createdAt: new Date(Date.now() - 48 * 60 * 60 * 1000), // 2 days ago
    reviewedAt: new Date(Date.now() - 44 * 60 * 60 * 1000),
    reviewedBy: "admin-001",
    decision: "confirm",
    reviewNote: "ยืนยันว่าเป็นการขายยาที่ไม่ได้รับอนุญาต ดำเนินการระงับบัญชีแล้ว",
    action: "ระงับบัญชี Seller และ Team Leader ถาวร",
  },
  {
    id: "report-5",
    reporterId: "worker-202",
    reporterName: "ประสิทธิ์ ประสงค์ร้าย",
    jobId: "job-005",
    jobTitle: "รีวิวร้านอาหาร",
    targetUrl: "https://normal-restaurant.com",
    sellerId: "seller-555",
    sellerName: "ร้านอาหารอร่อย",
    teamId: "team-404",
    teamName: "ทีมรีวิวอาหาร",
    teamLeaderId: "leader-404",
    teamLeaderName: "หัวหน้าทีมรีวิวอาหาร",
    category: "gambling",
    description: "ร้านนี้เปิดบ่อนการพนัน",
    status: "false_report",
    createdAt: new Date(Date.now() - 72 * 60 * 60 * 1000), // 3 days ago
    reviewedAt: new Date(Date.now() - 68 * 60 * 60 * 1000),
    reviewedBy: "admin-001",
    decision: "false_report",
    reviewNote: "รายงานเท็จ เนื้อหาร้านอาหารปกติ Worker มีประวัติรายงานเท็จซ้ำซาก",
    action: "แบน Worker จากการรายงาน 30 วัน",
  },
];

// Mock worker stats
const MOCK_WORKER_STATS: Record<string, WorkerReportStats> = {
  "worker-123": {
    totalReports: 5,
    confirmedReports: 3,
    dismissedReports: 1,
    falseReports: 1,
    canReport: true,
    reportBannedUntil: undefined,
  },
  "worker-456": {
    totalReports: 2,
    confirmedReports: 1,
    dismissedReports: 1,
    falseReports: 0,
    canReport: true,
    reportBannedUntil: undefined,
  },
  "worker-789": {
    totalReports: 10,
    confirmedReports: 1,
    dismissedReports: 5,
    falseReports: 4,
    canReport: true,
    reportBannedUntil: undefined,
  },
  "worker-101": {
    totalReports: 8,
    confirmedReports: 7,
    dismissedReports: 1,
    falseReports: 0,
    canReport: true,
    reportBannedUntil: undefined,
  },
  "worker-202": {
    totalReports: 12,
    confirmedReports: 0,
    dismissedReports: 5,
    falseReports: 7,
    canReport: false,
    reportBannedUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
  },
};

const STATUS_CONFIG: Record<ReportStatus, { label: string; color: string; icon: React.ElementType }> = {
  pending: { label: "รอตรวจสอบ", color: "bg-amber-100 text-amber-700", icon: Clock },
  reviewed: { label: "กำลังตรวจสอบ", color: "bg-blue-100 text-blue-700", icon: Eye },
  confirmed: { label: "ยืนยันฝ่าฝืน", color: "bg-red-100 text-red-700", icon: CheckCircle2 },
  dismissed: { label: "ยกเลิก", color: "bg-gray-100 text-gray-700", icon: XCircle },
  false_report: { label: "รายงานเท็จ", color: "bg-purple-100 text-purple-700", icon: Ban },
};

const CREDIBILITY_CONFIG = {
  trusted: { label: "น่าเชื่อถือสูง", color: "text-green-600 bg-green-50", icon: Shield },
  normal: { label: "ปกติ", color: "text-blue-600 bg-blue-50", icon: CheckCircle2 },
  suspicious: { label: "น่าสงสัย", color: "text-red-600 bg-red-50", icon: AlertTriangle },
};

export default function AdminReportsPage() {
  const [reports, setReports] = useState<ContentReport[]>(MOCK_REPORTS);
  const [filterStatus, setFilterStatus] = useState<ReportStatus | "all">("all");
  const [filterCategory, setFilterCategory] = useState<ReportCategory | "all">("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedReport, setSelectedReport] = useState<ContentReport | null>(null);
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [reviewNote, setReviewNote] = useState("");
  const [actionTaken, setActionTaken] = useState("");

  // Filter reports
  const filteredReports = reports.filter((report) => {
    if (filterStatus !== "all" && report.status !== filterStatus) return false;
    if (filterCategory !== "all" && report.category !== filterCategory) return false;
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      return (
        report.jobTitle?.toLowerCase().includes(query) ||
        report.sellerName?.toLowerCase().includes(query) ||
        report.reporterName?.toLowerCase().includes(query) ||
        report.teamName?.toLowerCase().includes(query)
      );
    }
    return true;
  });

  // Stats
  const pendingCount = reports.filter((r) => r.status === "pending").length;
  const confirmedCount = reports.filter((r) => r.status === "confirmed").length;
  const falseReportCount = reports.filter((r) => r.status === "false_report").length;

  const handleReviewClick = (report: ContentReport) => {
    setSelectedReport(report);
    setReviewNote("");
    setActionTaken("");
    setIsReviewModalOpen(true);
  };

  const handleDecision = (decision: "confirm" | "dismiss" | "false_report") => {
    if (!selectedReport) return;

    // Map decision to status
    const statusMap: Record<"confirm" | "dismiss" | "false_report", "confirmed" | "dismissed" | "false_report"> = {
      confirm: "confirmed",
      dismiss: "dismissed",
      false_report: "false_report",
    };

    const updatedReport: ContentReport = {
      ...selectedReport,
      status: statusMap[decision],
      decision,
      reviewNote: reviewNote,
      action: actionTaken || undefined,
      reviewedAt: new Date(),
      reviewedBy: "admin-current",
    };

    setReports((prev) =>
      prev.map((r) => (r.id === selectedReport.id ? updatedReport : r))
    );
    setIsReviewModalOpen(false);
    setSelectedReport(null);

    // Show success message
    const messages = {
      confirm: "ยืนยันการฝ่าฝืนเรียบร้อย",
      dismiss: "ยกเลิกรายงานเรียบร้อย",
      false_report: "บันทึกรายงานเท็จเรียบร้อย Worker จะถูกบันทึกประวัติ",
    };
    alert(messages[decision]);
  };

  const formatTimeAgo = (dateInput: Date | string) => {
    const date = typeof dateInput === 'string' ? new Date(dateInput) : dateInput;
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(hours / 24);

    if (days > 0) return `${days} วันที่แล้ว`;
    if (hours > 0) return `${hours} ชั่วโมงที่แล้ว`;
    return "เมื่อสักครู่";
  };

  const getWorkerCredibility = (workerId: string) => {
    const stats = MOCK_WORKER_STATS[workerId];
    if (!stats) return { credibility: "normal" as const, stats: null };
    return { credibility: getReporterCredibility(stats), stats };
  };

  const getCategoryIcon = (category: ReportCategory) => {
    const item = PROHIBITED_CONTENT.find((p) => p.id === category);
    return item?.icon || Flag;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-brand-text-dark">Content Reports</h1>
          <p className="text-brand-text-light mt-1">
            ตรวจสอบและจัดการรายงานเนื้อหาไม่เหมาะสมจาก Workers
          </p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-4 border-l-4 border-l-amber-500">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-amber-100 rounded-lg">
              <Clock className="w-5 h-5 text-amber-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-brand-text-dark">{pendingCount}</p>
              <p className="text-sm text-brand-text-light">รอตรวจสอบ</p>
            </div>
          </div>
        </Card>
        <Card className="p-4 border-l-4 border-l-red-500">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-red-100 rounded-lg">
              <CheckCircle2 className="w-5 h-5 text-red-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-brand-text-dark">{confirmedCount}</p>
              <p className="text-sm text-brand-text-light">ยืนยันฝ่าฝืน</p>
            </div>
          </div>
        </Card>
        <Card className="p-4 border-l-4 border-l-purple-500">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-purple-100 rounded-lg">
              <Ban className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-brand-text-dark">{falseReportCount}</p>
              <p className="text-sm text-brand-text-light">รายงานเท็จ</p>
            </div>
          </div>
        </Card>
        <Card className="p-4 border-l-4 border-l-green-500">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-100 rounded-lg">
              <Shield className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-brand-text-dark">{reports.length}</p>
              <p className="text-sm text-brand-text-light">รายงานทั้งหมด</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Filters */}
      <Card className="p-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-brand-text-light" />
              <Input
                placeholder="ค้นหาชื่องาน, ร้านค้า, ผู้รายงาน..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
          <div className="flex gap-2">
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value as ReportStatus | "all")}
              className="px-4 py-2 border border-brand-border rounded-lg bg-white text-brand-text-dark text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary"
            >
              <option value="all">สถานะทั้งหมด</option>
              <option value="pending">รอตรวจสอบ</option>
              <option value="confirmed">ยืนยันฝ่าฝืน</option>
              <option value="dismissed">ยกเลิก</option>
              <option value="false_report">รายงานเท็จ</option>
            </select>
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value as ReportCategory | "all")}
              className="px-4 py-2 border border-brand-border rounded-lg bg-white text-brand-text-dark text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary"
            >
              <option value="all">ประเภททั้งหมด</option>
              <option value="gambling">การพนัน</option>
              <option value="illegal">ผิดกฎหมาย</option>
              <option value="scam">หลอกลวง</option>
              <option value="adult">เนื้อหาผู้ใหญ่</option>
              <option value="other">อื่นๆ</option>
            </select>
          </div>
        </div>
      </Card>

      {/* Reports List */}
      <div className="space-y-4">
        {filteredReports.length === 0 ? (
          <Card className="p-12 text-center">
            <Flag className="w-12 h-12 text-brand-text-light mx-auto mb-4 opacity-50" />
            <p className="text-brand-text-light">ไม่พบรายงานที่ตรงกับเงื่อนไข</p>
          </Card>
        ) : (
          filteredReports.map((report) => {
            const StatusIcon = STATUS_CONFIG[report.status].icon;
            const CategoryIcon = getCategoryIcon(report.category);
            const { credibility, stats } = getWorkerCredibility(report.reporterId);
            const credConfig = CREDIBILITY_CONFIG[credibility];
            const CredIcon = credConfig.icon;

            return (
              <Card key={report.id} className="p-5 hover:shadow-md transition-shadow">
                <div className="flex flex-col lg:flex-row lg:items-start gap-4">
                  {/* Report Info */}
                  <div className="flex-1 space-y-3">
                    <div className="flex items-start gap-3">
                      <div className={`p-2 rounded-lg ${
                        report.category === "gambling" ? "bg-red-100" :
                        report.category === "illegal" ? "bg-orange-100" :
                        report.category === "scam" ? "bg-amber-100" :
                        report.category === "adult" ? "bg-pink-100" :
                        "bg-gray-100"
                      }`}>
                        <CategoryIcon className={`w-5 h-5 ${
                          report.category === "gambling" ? "text-red-600" :
                          report.category === "illegal" ? "text-orange-600" :
                          report.category === "scam" ? "text-amber-600" :
                          report.category === "adult" ? "text-pink-600" :
                          "text-gray-600"
                        }`} />
                      </div>
                      <div>
                        <h3 className="font-semibold text-brand-text-dark">{report.jobTitle}</h3>
                        <div className="flex flex-wrap items-center gap-2 mt-1">
                          <Badge className={STATUS_CONFIG[report.status].color}>
                            <StatusIcon className="w-3 h-3 mr-1" />
                            {STATUS_CONFIG[report.status].label}
                          </Badge>
                          <Badge variant="outline" size="sm">
                            {REPORT_CATEGORY_LABELS[report.category]}
                          </Badge>
                        </div>
                      </div>
                    </div>

                    <p className="text-sm text-brand-text-light bg-brand-bg/50 p-3 rounded-lg">
                      &ldquo;{report.description}&rdquo;
                    </p>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
                      <div>
                        <p className="text-brand-text-light">ร้านค้า</p>
                        <p className="font-medium text-brand-text-dark">{report.sellerName}</p>
                      </div>
                      <div>
                        <p className="text-brand-text-light">ทีม</p>
                        <p className="font-medium text-brand-text-dark">{report.teamName}</p>
                      </div>
                      <div>
                        <p className="text-brand-text-light">รายงานโดย</p>
                        <p className="font-medium text-brand-text-dark">{report.reporterName}</p>
                      </div>
                      <div>
                        <p className="text-brand-text-light">เมื่อ</p>
                        <p className="font-medium text-brand-text-dark">{formatTimeAgo(report.createdAt)}</p>
                      </div>
                    </div>

                    {/* Reporter Credibility */}
                    {stats && (
                      <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm ${credConfig.color}`}>
                        <CredIcon className="w-4 h-4" />
                        <span className="font-medium">{credConfig.label}</span>
                        <span className="text-xs opacity-75">
                          ({stats.confirmedReports} ยืนยัน / {stats.falseReports} เท็จ จาก {stats.totalReports} รายงาน)
                        </span>
                      </div>
                    )}

                    {/* Decision Info (if already reviewed) */}
                    {report.decision && (
                      <div className="border-t border-brand-border/50 pt-3 mt-3">
                        <p className="text-sm text-brand-text-light">
                          <span className="font-medium">หมายเหตุ:</span> {report.reviewNote}
                        </p>
                        {report.action && (
                          <p className="text-sm text-red-600 mt-1">
                            <span className="font-medium">การดำเนินการ:</span> {report.action}
                          </p>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex flex-col gap-2 lg:w-48">
                    {report.targetUrl && (
                      <a
                        href={report.targetUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-center gap-2 px-4 py-2 text-sm border border-brand-border rounded-lg hover:bg-brand-bg transition-colors"
                      >
                        <ExternalLink className="w-4 h-4" />
                        ดู URL ต้นทาง
                      </a>
                    )}
                    {report.status === "pending" && (
                      <Button
                        onClick={() => handleReviewClick(report)}
                        className="w-full"
                      >
                        <Eye className="w-4 h-4 mr-2" />
                        ตรวจสอบ
                      </Button>
                    )}
                  </div>
                </div>
              </Card>
            );
          })
        )}
      </div>

      {/* Review Modal */}
      <Dialog
        open={isReviewModalOpen}
        onClose={() => setIsReviewModalOpen(false)}
        size="lg"
      >
        <Dialog.Header>
          <Dialog.Title>ตรวจสอบรายงาน</Dialog.Title>
          {selectedReport && (
            <Dialog.Description>รายงานเกี่ยวกับ: {selectedReport.jobTitle}</Dialog.Description>
          )}
        </Dialog.Header>
        {selectedReport && (() => {
          const CategoryIcon = getCategoryIcon(selectedReport.category);
          const { credibility, stats } = getWorkerCredibility(selectedReport.reporterId);
          const credConfig = CREDIBILITY_CONFIG[credibility];
          const CredIcon = credConfig.icon;

          return (
            <>
              <Dialog.Body>
                <div className="space-y-4">
                  {/* Report Details */}
                  <div className="p-4 bg-brand-bg/50 rounded-lg space-y-3">
                    <div className="flex items-center gap-2">
                      <CategoryIcon className="w-5 h-5 text-brand-primary" />
                      <span className="font-medium">{REPORT_CATEGORY_LABELS[selectedReport.category]}</span>
                    </div>
                    <p className="text-sm text-brand-text-dark">
                      &ldquo;{selectedReport.description}&rdquo;
                    </p>
                    {selectedReport.targetUrl && (
                      <a
                        href={selectedReport.targetUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-sm text-brand-primary hover:underline"
                      >
                        <ExternalLink className="w-4 h-4" />
                        {selectedReport.targetUrl}
                      </a>
                    )}
                  </div>

                  {/* Reporter Info with Credibility */}
                  <div className="p-4 border border-brand-border rounded-lg">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <User className="w-5 h-5 text-brand-text-light" />
                        <span className="font-medium">{selectedReport.reporterName}</span>
                      </div>
                      {stats && (
                        <div className={`flex items-center gap-1.5 px-2 py-1 rounded text-xs ${credConfig.color}`}>
                          <CredIcon className="w-3 h-3" />
                          {credConfig.label}
                        </div>
                      )}
                    </div>
                    {stats && (
                      <div className="mt-2 text-sm text-brand-text-light">
                        ประวัติรายงาน: {stats.confirmedReports} ยืนยัน, {stats.dismissedReports} ยกเลิก, {stats.falseReports} เท็จ
                      </div>
                    )}
                    {credibility === "suspicious" && (
                      <div className="mt-2 p-2 bg-red-50 text-red-700 text-sm rounded flex items-center gap-2">
                        <AlertTriangle className="w-4 h-4" />
                        ผู้รายงานมีประวัติรายงานเท็จ ควรพิจารณาอย่างระมัดระวัง
                      </div>
                    )}
                  </div>

                  {/* Seller/Team Info */}
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-brand-text-light">ร้านค้า</p>
                      <p className="font-medium">{selectedReport.sellerName}</p>
                    </div>
                    <div>
                      <p className="text-brand-text-light">ทีม</p>
                      <p className="font-medium">{selectedReport.teamName}</p>
                    </div>
                  </div>

                  {/* Review Form */}
                  <div>
                    <label className="block text-sm font-medium text-brand-text-dark mb-2">
                      หมายเหตุการตรวจสอบ
                    </label>
                    <textarea
                      value={reviewNote}
                      onChange={(e) => setReviewNote(e.target.value)}
                      placeholder="อธิบายผลการตรวจสอบ..."
                      rows={3}
                      className="w-full px-3 py-2 border border-brand-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-brand-text-dark mb-2">
                      การดำเนินการ (ถ้ามี)
                    </label>
                    <Input
                      value={actionTaken}
                      onChange={(e) => setActionTaken(e.target.value)}
                      placeholder="เช่น ระงับบัญชี, แบน Worker..."
                    />
                  </div>
                </div>
              </Dialog.Body>
              <Dialog.Footer>
                <div className="flex flex-col sm:flex-row gap-2 w-full">
                  <Button
                    variant="outline"
                    onClick={() => setIsReviewModalOpen(false)}
                    className="sm:flex-1"
                  >
                    ยกเลิก
                  </Button>
                  <Button
                    variant="outline"
                    className="sm:flex-1 border-gray-300 text-gray-700 hover:bg-gray-50"
                    onClick={() => handleDecision("dismiss")}
                  >
                    <XCircle className="w-4 h-4 mr-1" />
                    ยกเลิกรายงาน
                  </Button>
                  <Button
                    variant="outline"
                    className="sm:flex-1 border-purple-300 text-purple-700 hover:bg-purple-50"
                    onClick={() => handleDecision("false_report")}
                  >
                    <Ban className="w-4 h-4 mr-1" />
                    รายงานเท็จ
                  </Button>
                  <Button
                    className="sm:flex-1 bg-red-600 hover:bg-red-700"
                    onClick={() => handleDecision("confirm")}
                  >
                    <CheckCircle2 className="w-4 h-4 mr-1" />
                    ยืนยันฝ่าฝืน
                  </Button>
                </div>
              </Dialog.Footer>
            </>
          );
        })()}
      </Dialog>
    </div>
  );
}
