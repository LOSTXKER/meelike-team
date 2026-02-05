"use client";

import { useState } from "react";
import { Card, Button, Badge, Input, Select, Modal } from "@/components/ui";
import { 
  Shield, 
  Search, 
  Filter,
  CheckCircle, 
  XCircle,
  Clock,
  Eye,
  User,
  Building2,
  CreditCard,
  Camera,
  FileText,
  Calendar,
  AlertCircle,
  ChevronLeft,
  ChevronRight,
  Download,
  ExternalLink
} from "lucide-react";
import type { KYCLevel, KYCStatus, KYCPendingItem } from "@/types";

// Mock pending KYC items
const mockPendingItems: KYCPendingItem[] = [
  {
    id: "kyc-001",
    userId: "user-001",
    userType: "seller",
    userName: "สมชาย ใจดี",
    userEmail: "somchai@example.com",
    userPhone: "0812345678",
    currentLevel: "basic",
    requestedLevel: "verified",
    status: "submitted",
    kyc: {
      level: "basic",
      status: "submitted",
      phoneVerified: true,
      emailVerified: true,
      idCardNumber: "1-1234-56789-01-2",
      idCardPrefix: "นาย",
      idCardFirstName: "สมชาย",
      idCardLastName: "ใจดี",
      idCardBirthDate: "1990-05-15",
      idCardImageUrl: "/mock/id-card.jpg",
      selfieWithIdUrl: "/mock/selfie.jpg",
      submittedAt: "2024-01-20T10:30:00Z",
    },
    submittedAt: "2024-01-20T10:30:00Z",
    createdAt: "2024-01-15T08:00:00Z",
  },
  {
    id: "kyc-002",
    userId: "user-002",
    userType: "worker",
    userName: "สมหญิง รักงาน",
    userEmail: "somying@example.com",
    userPhone: "0898765432",
    currentLevel: "basic",
    requestedLevel: "verified",
    status: "submitted",
    kyc: {
      level: "basic",
      status: "submitted",
      phoneVerified: true,
      emailVerified: true,
      idCardNumber: "1-9876-54321-01-2",
      idCardPrefix: "นางสาว",
      idCardFirstName: "สมหญิง",
      idCardLastName: "รักงาน",
      idCardBirthDate: "1995-08-20",
      idCardImageUrl: "/mock/id-card-2.jpg",
      selfieWithIdUrl: "/mock/selfie-2.jpg",
      submittedAt: "2024-01-20T09:15:00Z",
    },
    submittedAt: "2024-01-20T09:15:00Z",
    createdAt: "2024-01-10T14:00:00Z",
  },
  {
    id: "kyc-003",
    userId: "user-003",
    userType: "seller",
    userName: "บริษัท ตัวอย่าง จำกัด",
    userEmail: "contact@example.co.th",
    userPhone: "0821234567",
    currentLevel: "verified",
    requestedLevel: "business",
    status: "reviewing",
    kyc: {
      level: "verified",
      status: "reviewing",
      phoneVerified: true,
      emailVerified: true,
      idCardNumber: "1-5555-66666-01-2",
      idCardVerifiedAt: "2024-01-15T12:00:00Z",
      companyName: "บริษัท ตัวอย่าง จำกัด",
      taxId: "0-1234-56789-00-0",
      certDocUrl: "/mock/company-cert.pdf",
      submittedAt: "2024-01-19T16:45:00Z",
    },
    submittedAt: "2024-01-19T16:45:00Z",
    createdAt: "2024-01-05T10:00:00Z",
  },
];

const statusColors: Record<KYCStatus, { variant: "warning" | "info" | "success" | "error"; label: string }> = {
  pending: { variant: "warning", label: "รอดำเนินการ" },
  submitted: { variant: "info", label: "ส่งแล้ว" },
  reviewing: { variant: "warning", label: "กำลังตรวจสอบ" },
  approved: { variant: "success", label: "อนุมัติแล้ว" },
  rejected: { variant: "error", label: "ถูกปฏิเสธ" },
};

const levelColors: Record<KYCLevel, { color: string; bg: string; label: string }> = {
  none: { color: "text-gray-600", bg: "bg-gray-50", label: "ไม่มี" },
  basic: { color: "text-blue-600", bg: "bg-blue-50", label: "Basic" },
  verified: { color: "text-emerald-600", bg: "bg-emerald-50", label: "Verified" },
  business: { color: "text-purple-600", bg: "bg-purple-50", label: "Business" },
};

export default function AdminKYCPage() {
  const [items, setItems] = useState(mockPendingItems);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState<KYCStatus | "all">("all");
  const [filterLevel, setFilterLevel] = useState<KYCLevel | "all">("all");
  const [filterUserType, setFilterUserType] = useState<"all" | "seller" | "worker">("all");
  const [selectedItem, setSelectedItem] = useState<KYCPendingItem | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [rejectionReason, setRejectionReason] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);

  // Filter items
  const filteredItems = items.filter(item => {
    const matchesSearch = searchQuery === "" || 
      item.userName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.userEmail.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = filterStatus === "all" || item.status === filterStatus;
    const matchesLevel = filterLevel === "all" || item.requestedLevel === filterLevel;
    const matchesUserType = filterUserType === "all" || item.userType === filterUserType;

    return matchesSearch && matchesStatus && matchesLevel && matchesUserType;
  });

  const handleViewDetail = (item: KYCPendingItem) => {
    setSelectedItem(item);
    setIsModalOpen(true);
    setRejectionReason("");
  };

  const handleApprove = async () => {
    if (!selectedItem) return;
    
    setIsProcessing(true);
    // Mock API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    setItems(items.map(item => 
      item.id === selectedItem.id 
        ? { ...item, status: "approved" as KYCStatus }
        : item
    ));
    
    setIsProcessing(false);
    setIsModalOpen(false);
    setSelectedItem(null);
  };

  const handleReject = async () => {
    if (!selectedItem || !rejectionReason.trim()) {
      alert("กรุณาระบุเหตุผลในการปฏิเสธ");
      return;
    }
    
    setIsProcessing(true);
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    setItems(items.map(item => 
      item.id === selectedItem.id 
        ? { ...item, status: "rejected" as KYCStatus }
        : item
    ));
    
    setIsProcessing(false);
    setIsModalOpen(false);
    setSelectedItem(null);
    setRejectionReason("");
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('th-TH', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-brand-text-dark">ตรวจสอบ KYC</h1>
          <p className="text-brand-text-light">จัดการคำขอยืนยันตัวตน</p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="warning" size="md">
            {items.filter(i => i.status === "submitted" || i.status === "reviewing").length} รอตรวจสอบ
          </Badge>
        </div>
      </div>

      {/* Filters */}
      <Card className="border-none shadow-md p-4">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1">
            <Input
              placeholder="ค้นหาชื่อหรืออีเมล..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              leftIcon={<Search className="w-4 h-4" />}
            />
          </div>
          <div className="flex flex-wrap gap-3">
            <Select
              options={[
                { value: "all", label: "สถานะทั้งหมด" },
                { value: "submitted", label: "ส่งแล้ว" },
                { value: "reviewing", label: "กำลังตรวจสอบ" },
                { value: "approved", label: "อนุมัติแล้ว" },
                { value: "rejected", label: "ถูกปฏิเสธ" },
              ]}
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value as KYCStatus | "all")}
            />
            <Select
              options={[
                { value: "all", label: "ระดับทั้งหมด" },
                { value: "verified", label: "Verified" },
                { value: "business", label: "Business" },
              ]}
              value={filterLevel}
              onChange={(e) => setFilterLevel(e.target.value as KYCLevel | "all")}
            />
            <Select
              options={[
                { value: "all", label: "ผู้ใช้ทั้งหมด" },
                { value: "seller", label: "Seller" },
                { value: "worker", label: "Worker" },
              ]}
              value={filterUserType}
              onChange={(e) => setFilterUserType(e.target.value as "all" | "seller" | "worker")}
            />
          </div>
        </div>
      </Card>

      {/* List */}
      <div className="space-y-4">
        {filteredItems.length === 0 ? (
          <Card className="border-none shadow-md p-8 text-center">
            <Shield className="w-12 h-12 text-brand-text-light mx-auto mb-4" />
            <p className="text-brand-text-light">ไม่พบรายการที่ตรงกับเงื่อนไข</p>
          </Card>
        ) : (
          filteredItems.map((item) => (
            <Card key={item.id} className="border-none shadow-md p-5">
              <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                {/* User Info */}
                <div className="flex items-center gap-4 flex-1">
                  <div className={`w-12 h-12 rounded-xl ${levelColors[item.requestedLevel].bg} flex items-center justify-center`}>
                    {item.requestedLevel === "business" ? (
                      <Building2 className={`w-6 h-6 ${levelColors[item.requestedLevel].color}`} />
                    ) : (
                      <CreditCard className={`w-6 h-6 ${levelColors[item.requestedLevel].color}`} />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="font-semibold text-brand-text-dark">{item.userName}</p>
                      <Badge variant={item.userType === "seller" ? "info" : "default"} size="sm">
                        {item.userType === "seller" ? "Seller" : "Worker"}
                      </Badge>
                    </div>
                    <p className="text-sm text-brand-text-light truncate">{item.userEmail}</p>
                    <p className="text-xs text-brand-text-light mt-1">
                      ขอเลื่อนระดับ: {levelColors[item.currentLevel].label} → {levelColors[item.requestedLevel].label}
                    </p>
                  </div>
                </div>

                {/* Status & Actions */}
                <div className="flex items-center gap-3">
                  <div className="text-right hidden sm:block">
                    <p className="text-xs text-brand-text-light">ส่งเมื่อ</p>
                    <p className="text-sm text-brand-text-dark">{formatDate(item.submittedAt)}</p>
                  </div>
                  <Badge variant={statusColors[item.status].variant}>
                    {statusColors[item.status].label}
                  </Badge>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleViewDetail(item)}
                  >
                    <Eye className="w-4 h-4 mr-1" />
                    ตรวจสอบ
                  </Button>
                </div>
              </div>
            </Card>
          ))
        )}
      </div>

      {/* Detail Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedItem(null);
          setRejectionReason("");
        }}
        title="รายละเอียด KYC"
        size="lg"
      >
        {selectedItem && (
          <div className="space-y-6">
            {/* User Info Header */}
            <div className="flex items-center gap-4 p-4 rounded-lg bg-brand-bg">
              <div className={`w-14 h-14 rounded-xl ${levelColors[selectedItem.requestedLevel].bg} flex items-center justify-center`}>
                {selectedItem.requestedLevel === "business" ? (
                  <Building2 className={`w-7 h-7 ${levelColors[selectedItem.requestedLevel].color}`} />
                ) : (
                  <User className={`w-7 h-7 ${levelColors[selectedItem.requestedLevel].color}`} />
                )}
              </div>
              <div className="flex-1">
                <p className="font-bold text-brand-text-dark text-lg">{selectedItem.userName}</p>
                <p className="text-sm text-brand-text-light">{selectedItem.userEmail}</p>
                <p className="text-sm text-brand-text-light">{selectedItem.userPhone}</p>
              </div>
              <Badge variant={selectedItem.userType === "seller" ? "info" : "default"}>
                {selectedItem.userType === "seller" ? "Seller" : "Worker"}
              </Badge>
            </div>

            {/* Level Change Info */}
            <div className="flex items-center justify-center gap-4 py-4">
              <div className={`px-4 py-2 rounded-lg ${levelColors[selectedItem.currentLevel].bg}`}>
                <p className={`font-semibold ${levelColors[selectedItem.currentLevel].color}`}>
                  {levelColors[selectedItem.currentLevel].label}
                </p>
              </div>
              <ChevronRight className="w-6 h-6 text-brand-text-light" />
              <div className={`px-4 py-2 rounded-lg ${levelColors[selectedItem.requestedLevel].bg}`}>
                <p className={`font-semibold ${levelColors[selectedItem.requestedLevel].color}`}>
                  {levelColors[selectedItem.requestedLevel].label}
                </p>
              </div>
            </div>

            {/* Documents Section - Verified Level */}
            {selectedItem.requestedLevel === "verified" && (
              <>
                {/* ID Card Data */}
                {selectedItem.kyc.idCardNumber && (
                  <div className="p-4 rounded-lg border border-brand-border">
                    <h4 className="font-semibold text-brand-text-dark mb-3 flex items-center gap-2">
                      <CreditCard className="w-5 h-5 text-brand-primary" />
                      ข้อมูลบัตรประชาชน
                    </h4>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-brand-text-light">เลขบัตร</p>
                        <p className="font-medium">{selectedItem.kyc.idCardNumber}</p>
                      </div>
                      <div>
                        <p className="text-brand-text-light">ชื่อ-นามสกุล</p>
                        <p className="font-medium">
                          {selectedItem.kyc.idCardPrefix}{selectedItem.kyc.idCardFirstName} {selectedItem.kyc.idCardLastName}
                        </p>
                      </div>
                      <div>
                        <p className="text-brand-text-light">วันเกิด</p>
                        <p className="font-medium">{selectedItem.kyc.idCardBirthDate}</p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Document Previews */}
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="p-4 rounded-lg border border-brand-border">
                    <h4 className="text-sm font-medium text-brand-text-dark mb-2 flex items-center gap-2">
                      <CreditCard className="w-4 h-4" />
                      รูปบัตรประชาชน
                    </h4>
                    <div className="aspect-[3/2] rounded-lg bg-brand-bg flex items-center justify-center">
                      <div className="text-center">
                        <FileText className="w-8 h-8 text-brand-text-light mx-auto mb-2" />
                        <p className="text-xs text-brand-text-light">id-card.jpg</p>
                        <Button variant="ghost" size="sm" className="mt-2">
                          <ExternalLink className="w-4 h-4 mr-1" />
                          ดูรูป
                        </Button>
                      </div>
                    </div>
                  </div>
                  <div className="p-4 rounded-lg border border-brand-border">
                    <h4 className="text-sm font-medium text-brand-text-dark mb-2 flex items-center gap-2">
                      <Camera className="w-4 h-4" />
                      Selfie คู่บัตร
                    </h4>
                    <div className="aspect-[3/2] rounded-lg bg-brand-bg flex items-center justify-center">
                      <div className="text-center">
                        <Camera className="w-8 h-8 text-brand-text-light mx-auto mb-2" />
                        <p className="text-xs text-brand-text-light">selfie.jpg</p>
                        <Button variant="ghost" size="sm" className="mt-2">
                          <ExternalLink className="w-4 h-4 mr-1" />
                          ดูรูป
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </>
            )}

            {/* Documents Section - Business Level */}
            {selectedItem.requestedLevel === "business" && (
              <>
                <div className="p-4 rounded-lg border border-brand-border">
                  <h4 className="font-semibold text-brand-text-dark mb-3 flex items-center gap-2">
                    <Building2 className="w-5 h-5 text-purple-600" />
                    ข้อมูลนิติบุคคล
                  </h4>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-brand-text-light">ชื่อบริษัท</p>
                      <p className="font-medium">{selectedItem.kyc.companyName}</p>
                    </div>
                    <div>
                      <p className="text-brand-text-light">เลขประจำตัวผู้เสียภาษี</p>
                      <p className="font-medium">{selectedItem.kyc.taxId}</p>
                    </div>
                  </div>
                </div>

                <div className="p-4 rounded-lg border border-brand-border">
                  <h4 className="text-sm font-medium text-brand-text-dark mb-2 flex items-center gap-2">
                    <FileText className="w-4 h-4" />
                    หนังสือรับรองบริษัท
                  </h4>
                  <div className="flex items-center justify-between p-3 rounded-lg bg-brand-bg">
                    <div className="flex items-center gap-3">
                      <FileText className="w-8 h-8 text-red-500" />
                      <div>
                        <p className="text-sm font-medium">company-cert.pdf</p>
                        <p className="text-xs text-brand-text-light">PDF Document</p>
                      </div>
                    </div>
                    <Button variant="ghost" size="sm">
                      <Download className="w-4 h-4 mr-1" />
                      ดาวน์โหลด
                    </Button>
                  </div>
                </div>
              </>
            )}

            {/* Timeline */}
            <div className="p-4 rounded-lg border border-brand-border">
              <h4 className="font-semibold text-brand-text-dark mb-3 flex items-center gap-2">
                <Calendar className="w-5 h-5 text-brand-text-light" />
                ประวัติ
              </h4>
              <div className="space-y-3 text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-brand-text-light">สมัครสมาชิก</span>
                  <span>{formatDate(selectedItem.createdAt)}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-brand-text-light">ส่งเอกสาร KYC</span>
                  <span>{formatDate(selectedItem.submittedAt)}</span>
                </div>
              </div>
            </div>

            {/* Rejection Reason Input */}
            {(selectedItem.status === "submitted" || selectedItem.status === "reviewing") && (
              <div className="p-4 rounded-lg bg-red-50 border border-red-100">
                <h4 className="text-sm font-medium text-red-800 mb-2">เหตุผลในการปฏิเสธ (ถ้ามี)</h4>
                <textarea
                  value={rejectionReason}
                  onChange={(e) => setRejectionReason(e.target.value)}
                  placeholder="ระบุเหตุผล เช่น รูปไม่ชัด, ข้อมูลไม่ตรงกัน..."
                  className="w-full p-3 rounded-lg border border-red-200 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-red-200"
                  rows={3}
                />
              </div>
            )}

            {/* Actions */}
            {(selectedItem.status === "submitted" || selectedItem.status === "reviewing") && (
              <div className="flex gap-3 pt-4 border-t border-brand-border">
                <Button
                  variant="outline"
                  onClick={() => {
                    setIsModalOpen(false);
                    setSelectedItem(null);
                  }}
                  className="flex-1"
                >
                  ยกเลิก
                </Button>
                <Button
                  variant="danger"
                  onClick={handleReject}
                  isLoading={isProcessing}
                  disabled={!rejectionReason.trim()}
                  className="flex-1"
                >
                  <XCircle className="w-4 h-4 mr-1" />
                  ปฏิเสธ
                </Button>
                <Button
                  variant="success"
                  onClick={handleApprove}
                  isLoading={isProcessing}
                  className="flex-1"
                >
                  <CheckCircle className="w-4 h-4 mr-1" />
                  อนุมัติ
                </Button>
              </div>
            )}

            {/* Already Processed */}
            {(selectedItem.status === "approved" || selectedItem.status === "rejected") && (
              <div className={`p-4 rounded-lg ${selectedItem.status === "approved" ? "bg-emerald-50" : "bg-red-50"}`}>
                <div className="flex items-center gap-2">
                  {selectedItem.status === "approved" ? (
                    <>
                      <CheckCircle className="w-5 h-5 text-emerald-600" />
                      <span className="font-medium text-emerald-800">อนุมัติแล้ว</span>
                    </>
                  ) : (
                    <>
                      <XCircle className="w-5 h-5 text-red-600" />
                      <span className="font-medium text-red-800">ถูกปฏิเสธ</span>
                    </>
                  )}
                </div>
              </div>
            )}
          </div>
        )}
      </Modal>
    </div>
  );
}
