"use client";

import { useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { Card, Badge, Button, Progress, Modal, Input, Textarea } from "@/components/ui";
import { mockOrders, mockServices } from "@/lib/mock-data";
import {
  ArrowLeft,
  Package,
  User,
  Phone,
  Mail,
  MessageSquare,
  Clock,
  CheckCircle2,
  XCircle,
  ExternalLink,
  Copy,
  Send,
  Users,
  RefreshCw,
  AlertCircle,
  FileText,
} from "lucide-react";

type OrderStatus = "pending" | "processing" | "completed" | "cancelled";

const statusConfig: Record<
  OrderStatus,
  { label: string; color: "warning" | "info" | "success" | "error" }
> = {
  pending: { label: "รอชำระเงิน", color: "warning" },
  processing: { label: "กำลังดำเนินการ", color: "info" },
  completed: { label: "เสร็จสิ้น", color: "success" },
  cancelled: { label: "ยกเลิก", color: "error" },
};

export default function OrderDetailPage() {
  const params = useParams();
  const orderId = params.id as string;

  const [showCreateJobModal, setShowCreateJobModal] = useState(false);
  const [showConfirmPayment, setShowConfirmPayment] = useState(false);
  const [selectedItem, setSelectedItem] = useState<number | null>(null);

  // Mock find order
  const order = mockOrders.find((o) => o.id === orderId) || mockOrders[0];

  // Helper for customer data (mock data uses customer object)
  const customerName = order.customer?.name || order.buyerName || "ลูกค้า";
  const customerContact = order.customer?.contactValue || order.buyerContact || "";
  const paymentProof = order.paymentProof || order.paymentProofUrl;

  const getServiceInfo = (serviceId: string) => {
    return mockServices.find((s) => s.id === serviceId);
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const handleConfirmPayment = () => {
    alert("ยืนยันการชำระเงินเรียบร้อย");
    setShowConfirmPayment(false);
  };

  const handleCreateJob = () => {
    alert("สร้างงานให้ทีมเรียบร้อย");
    setShowCreateJobModal(false);
    setSelectedItem(null);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/seller/orders">
            <button className="p-2 hover:bg-brand-bg rounded-lg transition-colors">
              <ArrowLeft className="w-5 h-5 text-brand-text-dark" />
            </button>
          </Link>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold text-brand-text-dark">
                {order.orderNumber}
              </h1>
              <Badge variant={statusConfig[order.status as OrderStatus].color}>
                {statusConfig[order.status as OrderStatus].label}
              </Badge>
            </div>
            <p className="text-brand-text-light">
              สั่งเมื่อ{" "}
              {new Date(order.createdAt).toLocaleDateString("th-TH", {
                day: "numeric",
                month: "long",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              })}
            </p>
          </div>
        </div>

        <div className="flex gap-2">
          {order.status === "pending" && (
            <Button onClick={() => setShowConfirmPayment(true)}>
              <CheckCircle2 className="w-4 h-4 mr-2" />
              ยืนยันชำระเงิน
            </Button>
          )}
          {order.status === "processing" && (
            <Button variant="secondary">
              <RefreshCw className="w-4 h-4 mr-2" />
              อัปเดตสถานะ
            </Button>
          )}
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Order Items */}
          <Card variant="bordered" padding="lg">
            <h2 className="font-semibold text-brand-text-dark mb-4 flex items-center gap-2">
              <Package className="w-5 h-5 text-brand-primary" />
              รายการสั่งซื้อ ({order.items.length})
            </h2>

            <div className="space-y-4">
              {order.items.map((item, index) => {
                const service = getServiceInfo(item.serviceId);
                const progress = (item.completedQuantity / item.quantity) * 100;

                return (
                  <div
                    key={index}
                    className="p-4 bg-brand-bg rounded-xl space-y-4"
                  >
                    {/* Item Header */}
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className="text-3xl">
                          {service?.platform === "facebook"
                            ? <Facebook className="w-4 h-4" />
                            : service?.platform === "instagram"
                            ? <Instagram className="w-4 h-4" />
                            : service?.platform === "tiktok"
                            ? <Music2 className="w-4 h-4" />
                            : <Youtube className="w-4 h-4" />}
                        </div>
                        <div>
                          <p className="font-semibold text-brand-text-dark">
                            {service?.name || "บริการ"}
                          </p>
                          <div className="flex items-center gap-2 mt-1">
                            <Badge
                              variant={
                                service?.type === "bot" ? "info" : "success"
                              }
                              size="sm"
                            >
                              {service?.type === "bot" ? "Bot" : "คนจริง"}
                            </Badge>
                            <span className="text-sm text-brand-text-light">
                              x{item.quantity.toLocaleString()}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-brand-primary text-lg">
                          ฿{(item.subtotal || item.totalPrice || 0).toLocaleString()}
                        </p>
                        <p className="text-xs text-brand-text-light">
                          ฿{item.unitPrice || item.pricePerUnit || 0}/หน่วย
                        </p>
                      </div>
                    </div>

                    {/* Target URL */}
                    {item.targetUrl && (
                      <div className="flex items-center gap-2 p-2 bg-brand-surface rounded-lg">
                        <ExternalLink className="w-4 h-4 text-brand-text-light shrink-0" />
                        <a
                          href={item.targetUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm text-brand-primary hover:underline truncate flex-1"
                        >
                          {item.targetUrl}
                        </a>
                        <button
                          onClick={() => handleCopy(item.targetUrl!)}
                          className="p-1 hover:bg-brand-bg rounded"
                        >
                          <Copy className="w-4 h-4 text-brand-text-light" />
                        </button>
                      </div>
                    )}

                    {/* Progress */}
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-brand-text-light">
                          ความคืบหน้า
                        </span>
                        <span className="font-medium text-brand-text-dark">
                          {item.completedQuantity.toLocaleString()}/
                          {item.quantity.toLocaleString()} ({Math.round(progress)}
                          %)
                        </span>
                      </div>
                      <Progress value={progress} />
                    </div>

                    {/* Actions for human services */}
                    {service?.type === "human" &&
                      order.status === "processing" && (
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            className="flex-1"
                            onClick={() => {
                              setSelectedItem(index);
                              setShowCreateJobModal(true);
                            }}
                          >
                            <Users className="w-4 h-4 mr-1" />
                            สร้างงานให้ทีม
                          </Button>
                        </div>
                      )}
                  </div>
                );
              })}
            </div>

            {/* Total */}
            <div className="mt-6 pt-4 border-t border-brand-border flex justify-between items-center">
              <span className="font-semibold text-brand-text-dark">
                รวมทั้งหมด
              </span>
              <span className="text-2xl font-bold text-brand-primary">
                ฿{(order.total || order.totalAmount || 0).toLocaleString()}
              </span>
            </div>
          </Card>

          {/* Activity Log */}
          <Card variant="bordered" padding="lg">
            <h2 className="font-semibold text-brand-text-dark mb-4 flex items-center gap-2">
              <FileText className="w-5 h-5 text-brand-primary" />
              ประวัติการดำเนินการ
            </h2>

            <div className="space-y-4">
              {[
                {
                  action: "สร้างออเดอร์",
                  time: order.createdAt,
                  user: customerName,
                  icon: <Package className="w-4 h-4" />,
                },
                ...(order.paidAt
                  ? [
                      {
                        action: "ยืนยันการชำระเงิน",
                        time: order.paidAt,
                        user: "ระบบอัตโนมัติ",
                        icon: <CheckCircle2 className="w-4 h-4" />,
                      },
                    ]
                  : []),
                ...(order.status === "processing"
                  ? [
                      {
                        action: "เริ่มดำเนินการ",
                        time: new Date().toISOString(),
                        user: "Seller",
                        icon: <RefreshCw className="w-4 h-4" />,
                      },
                    ]
                  : []),
              ].map((log, index) => (
                <div key={index} className="flex gap-4">
                  <div className="w-8 h-8 bg-brand-primary/10 rounded-full flex items-center justify-center text-brand-primary shrink-0">
                    {log.icon}
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-brand-text-dark">
                      {log.action}
                    </p>
                    <div className="flex items-center gap-2 text-sm text-brand-text-light">
                      <span>{log.user}</span>
                      <span>•</span>
                      <span>
                        {new Date(log.time).toLocaleDateString("th-TH", {
                          day: "numeric",
                          month: "short",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Customer Info */}
          <Card variant="bordered" padding="lg">
            <h3 className="font-semibold text-brand-text-dark mb-4 flex items-center gap-2">
              <User className="w-5 h-5 text-brand-primary" />
              ข้อมูลลูกค้า
            </h3>

            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-brand-primary/10 rounded-full flex items-center justify-center text-lg font-semibold text-brand-primary">
                  {customerName.charAt(0)}
                </div>
                <div>
                  <p className="font-medium text-brand-text-dark">
                    {customerName}
                  </p>
                  <p className="text-sm text-brand-text-light">ลูกค้าใหม่</p>
                </div>
              </div>

              <div className="space-y-3 pt-3 border-t border-brand-border">
                {customerContact && (
                  <>
                    <div className="flex items-center gap-3 text-sm">
                      <MessageSquare className="w-4 h-4 text-brand-text-light" />
                      <span className="text-brand-text-dark">
                        {order.customer?.contactType || "LINE"}: {customerContact}
                      </span>
                    </div>
                  </>
                )}
                <div className="flex items-center gap-3 text-sm">
                  <Mail className="w-4 h-4 text-brand-text-light" />
                  <span className="text-brand-text-dark">
                    customer@example.com
                  </span>
                </div>
              </div>

              <Button variant="outline" className="w-full" size="sm">
                <Send className="w-4 h-4 mr-2" />
                ส่งข้อความ
              </Button>
            </div>
          </Card>

          {/* Payment Info */}
          <Card variant="bordered" padding="lg">
            <h3 className="font-semibold text-brand-text-dark mb-4 flex items-center gap-2">
              <CreditCard className="w-5 h-5 text-brand-success" />
              การชำระเงิน
            </h3>

            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-brand-text-light">สถานะ</span>
                <Badge
                  variant={order.paidAt ? "success" : "warning"}
                  size="sm"
                >
                  {order.paidAt ? "ชำระแล้ว" : "รอชำระ"}
                </Badge>
              </div>
              {order.paidAt && (
                <div className="flex justify-between text-sm">
                  <span className="text-brand-text-light">ชำระเมื่อ</span>
                  <span className="text-brand-text-dark">
                    {new Date(order.paidAt).toLocaleDateString("th-TH", {
                      day: "numeric",
                      month: "short",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                </div>
              )}
              <div className="flex justify-between text-sm">
                <span className="text-brand-text-light">ช่องทาง</span>
                <span className="text-brand-text-dark">PromptPay</span>
              </div>

              {paymentProof && (
                <div className="pt-3 border-t border-brand-border">
                  <p className="text-sm text-brand-text-light mb-2">
                    หลักฐานการโอน
                  </p>
                  <div className="aspect-[4/3] bg-brand-bg rounded-lg flex items-center justify-center">
                    <span className="text-sm text-brand-text-light">
                      ไฟล์แนบ
                    </span>
                  </div>
                </div>
              )}
            </div>
          </Card>

          {/* Quick Actions */}
          <Card variant="bordered" padding="lg">
            <h3 className="font-semibold text-brand-text-dark mb-4">
              ⚡ การดำเนินการ
            </h3>

            <div className="space-y-2">
              <Button variant="outline" className="w-full justify-start" size="sm">
                <Copy className="w-4 h-4 mr-2" />
                คัดลอกเลขออเดอร์
              </Button>
              <Button variant="outline" className="w-full justify-start" size="sm">
                <FileText className="w-4 h-4 mr-2" />
                ดาวน์โหลดใบเสร็จ
              </Button>
              {order.status !== "cancelled" && order.status !== "completed" && (
                <Button
                  variant="outline"
                  className="w-full justify-start text-brand-error hover:bg-brand-error/10"
                  size="sm"
                >
                  <XCircle className="w-4 h-4 mr-2" />
                  ยกเลิกออเดอร์
                </Button>
              )}
            </div>
          </Card>
        </div>
      </div>

      {/* Confirm Payment Modal */}
      <Modal
        isOpen={showConfirmPayment}
        onClose={() => setShowConfirmPayment(false)}
        title="ยืนยันการชำระเงิน"
      >
        <div className="space-y-4">
          <div className="p-4 bg-brand-bg rounded-lg">
            <div className="flex justify-between mb-2">
              <span className="text-brand-text-light">ออเดอร์</span>
              <span className="font-medium text-brand-text-dark">
                {order.orderNumber}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-brand-text-light">จำนวนเงิน</span>
              <span className="font-bold text-brand-primary">
                ฿{(order.total || order.totalAmount || 0).toLocaleString()}
              </span>
            </div>
          </div>

          <div className="p-4 bg-brand-warning/10 rounded-lg flex gap-3">
            <AlertCircle className="w-5 h-5 text-brand-warning shrink-0" />
            <p className="text-sm text-brand-text-dark">
              กรุณาตรวจสอบหลักฐานการโอนเงินก่อนยืนยัน
              เมื่อยืนยันแล้วจะไม่สามารถยกเลิกได้
            </p>
          </div>

          <div className="flex gap-3 justify-end">
            <Button variant="outline" onClick={() => setShowConfirmPayment(false)}>
              ยกเลิก
            </Button>
            <Button onClick={handleConfirmPayment}>
              <CheckCircle2 className="w-4 h-4 mr-2" />
              ยืนยันการชำระเงิน
            </Button>
          </div>
        </div>
      </Modal>

      {/* Create Job Modal */}
      <Modal
        isOpen={showCreateJobModal}
        onClose={() => {
          setShowCreateJobModal(false);
          setSelectedItem(null);
        }}
        title="สร้างงานให้ทีม"
      >
        <div className="space-y-4">
          {selectedItem !== null && (
            <>
              <div className="p-4 bg-brand-bg rounded-lg">
                <p className="font-medium text-brand-text-dark">
                  {getServiceInfo(order.items[selectedItem].serviceId)?.name}
                </p>
                <p className="text-sm text-brand-text-light mt-1">
                  จำนวนที่เหลือ:{" "}
                  {(
                    order.items[selectedItem].quantity -
                    order.items[selectedItem].completedQuantity
                  ).toLocaleString()}{" "}
                  หน่วย
                </p>
              </div>

              <Input
                label="จำนวนที่ต้องการมอบหมาย"
                type="number"
                placeholder="100"
              />

              <div>
                <label className="block text-sm font-medium text-brand-text-dark mb-1.5">
                  เลือกทีม
                </label>
                <select className="w-full bg-brand-surface border border-brand-border rounded-lg px-3 py-2 text-brand-text-dark focus:outline-none focus:border-brand-primary">
                  <option>ทีม JohnBoost Main</option>
                  <option>ทีม Facebook Expert</option>
                  <option>ทีม Pro Workers</option>
                </select>
              </div>

              <Textarea label="หมายเหตุ (ถ้ามี)" placeholder="รายละเอียดเพิ่มเติม..." />
            </>
          )}

          <div className="flex gap-3 justify-end">
            <Button
              variant="outline"
              onClick={() => {
                setShowCreateJobModal(false);
                setSelectedItem(null);
              }}
            >
              ยกเลิก
            </Button>
            <Button onClick={handleCreateJob}>
              <Users className="w-4 h-4 mr-2" />
              สร้างงาน
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}

