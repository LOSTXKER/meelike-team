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
  Facebook,
  Instagram,
  Music2,
  Youtube,
  CreditCard,
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
    <div className="space-y-8 animate-fade-in max-w-7xl mx-auto pb-12">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/seller/orders">
            <button className="p-2.5 hover:bg-white hover:shadow-sm rounded-xl transition-all border border-transparent hover:border-brand-border/50 text-brand-text-light hover:text-brand-primary">
              <ArrowLeft className="w-5 h-5" />
            </button>
          </Link>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold text-brand-text-dark">
                {order.orderNumber}
              </h1>
              <Badge variant={statusConfig[order.status as OrderStatus].color} className="shadow-sm">
                {statusConfig[order.status as OrderStatus].label}
              </Badge>
            </div>
            <p className="text-brand-text-light flex items-center gap-2 mt-1 text-sm">
              <Clock className="w-4 h-4" />
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

        <div className="flex gap-3">
          {order.status === "pending" && (
            <Button onClick={() => setShowConfirmPayment(true)} className="shadow-lg shadow-brand-primary/20 rounded-xl">
              <CheckCircle2 className="w-4 h-4 mr-2" />
              ยืนยันชำระเงิน
            </Button>
          )}
          {order.status === "processing" && (
            <Button variant="secondary" className="bg-white shadow-sm border border-brand-border/50 hover:bg-brand-bg rounded-xl">
              <RefreshCw className="w-4 h-4 mr-2" />
              อัปเดตสถานะ
            </Button>
          )}
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-8">
          {/* Order Items */}
          <Card variant="elevated" padding="lg" className="border-none shadow-lg shadow-brand-primary/5">
            <h2 className="font-bold text-lg text-brand-text-dark mb-6 flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-brand-primary/10 flex items-center justify-center text-brand-primary">
                <Package className="w-5 h-5" />
              </div>
              รายการสั่งซื้อ <Badge variant="secondary" className="ml-2">{order.items.length}</Badge>
            </h2>

            <div className="space-y-6">
              {order.items.map((item, index) => {
                const service = getServiceInfo(item.serviceId);
                const progress = (item.completedQuantity / item.quantity) * 100;

                return (
                  <div
                    key={index}
                    className="p-6 bg-brand-bg/30 border border-brand-border/50 rounded-2xl space-y-5 hover:border-brand-primary/20 transition-all"
                  >
                    {/* Item Header */}
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-white shadow-sm flex items-center justify-center text-2xl border border-brand-border/20">
                          {service?.platform === "facebook"
                            ? <Facebook className="w-6 h-6 text-[#1877F2]" />
                            : service?.platform === "instagram"
                            ? <Instagram className="w-6 h-6 text-[#E4405F]" />
                            : service?.platform === "tiktok"
                            ? <Music2 className="w-6 h-6 text-black" />
                            : <Youtube className="w-6 h-6 text-[#FF0000]" />}
                        </div>
                        <div>
                          <p className="font-bold text-lg text-brand-text-dark">
                            {service?.name || "บริการ"}
                          </p>
                          <div className="flex items-center gap-2 mt-1.5">
                            <Badge
                              variant={
                                service?.type === "bot" ? "bot" : "human"
                              }
                              size="sm"
                              className="shadow-none border-none"
                            >
                              {service?.type === "bot" ? "Bot Service" : "Real Human"}
                            </Badge>
                            <span className="text-sm font-medium text-brand-text-light px-2 py-0.5 bg-brand-bg rounded-md">
                              จำนวน {item.quantity.toLocaleString()}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-brand-primary text-xl">
                          ฿{(item.subtotal || item.totalPrice || 0).toLocaleString()}
                        </p>
                        <p className="text-sm text-brand-text-light">
                          ฿{item.unitPrice || item.pricePerUnit || 0} / หน่วย
                        </p>
                      </div>
                    </div>

                    {/* Target URL */}
                    {item.targetUrl && (
                      <div className="flex items-center gap-3 p-3 bg-white border border-brand-border/30 rounded-xl shadow-sm group">
                        <div className="p-1.5 bg-brand-bg rounded-lg text-brand-text-light">
                           <ExternalLink className="w-4 h-4" />
                        </div>
                        <a
                          href={item.targetUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm font-medium text-brand-primary hover:underline truncate flex-1 font-mono"
                        >
                          {item.targetUrl}
                        </a>
                        <button
                          onClick={() => handleCopy(item.targetUrl!)}
                          className="p-1.5 hover:bg-brand-bg rounded-lg text-brand-text-light transition-colors"
                          title="Copy URL"
                        >
                          <Copy className="w-4 h-4" />
                        </button>
                      </div>
                    )}

                    {/* Progress */}
                    <div className="space-y-3 p-4 bg-white rounded-xl border border-brand-border/20 shadow-sm">
                      <div className="flex justify-between text-sm items-end">
                        <span className="text-brand-text-light font-medium">
                          ความคืบหน้า
                        </span>
                        <div className="text-right">
                           <span className="font-bold text-brand-text-dark text-lg">
                             {item.completedQuantity.toLocaleString()}
                           </span>
                           <span className="text-brand-text-light mx-1">/</span>
                           <span className="text-brand-text-light">
                             {item.quantity.toLocaleString()}
                           </span>
                           <span className="ml-2 text-xs font-bold text-brand-primary bg-brand-primary/10 px-1.5 py-0.5 rounded">
                             {Math.round(progress)}%
                           </span>
                        </div>
                      </div>
                      <Progress value={progress} className="h-2.5" />
                    </div>

                    {/* Actions for human services */}
                    {service?.type === "human" &&
                      order.status === "processing" && (
                        <div className="flex gap-2 pt-2">
                          <Button
                            variant="outline"
                            size="sm"
                            className="flex-1 bg-white hover:bg-brand-bg border-brand-border/50 h-10 rounded-xl font-medium"
                            onClick={() => {
                              setSelectedItem(index);
                              setShowCreateJobModal(true);
                            }}
                          >
                            <Users className="w-4 h-4 mr-2" />
                            สร้างงานให้ทีม
                          </Button>
                        </div>
                      )}
                  </div>
                );
              })}
            </div>

            {/* Total */}
            <div className="mt-8 pt-6 border-t border-brand-border/50 flex justify-between items-center">
              <span className="font-bold text-brand-text-dark text-lg">
                ยอดรวมทั้งหมด
              </span>
              <span className="text-3xl font-bold text-brand-primary">
                ฿{(order.total || order.totalAmount || 0).toLocaleString()}
              </span>
            </div>
          </Card>

          {/* Activity Log */}
          <Card variant="elevated" padding="lg" className="border-none shadow-lg shadow-brand-primary/5">
            <h2 className="font-bold text-lg text-brand-text-dark mb-6 flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-brand-secondary flex items-center justify-center text-brand-primary">
                 <FileText className="w-5 h-5" />
              </div>
              ประวัติการดำเนินการ
            </h2>

            <div className="relative pl-4 space-y-8 before:absolute before:left-[27px] before:top-4 before:bottom-4 before:w-0.5 before:bg-brand-border/50">
              {[
                {
                  action: "สร้างออเดอร์",
                  time: order.createdAt,
                  user: customerName,
                  icon: <Package className="w-4 h-4" />,
                  color: "bg-brand-primary text-white"
                },
                ...(order.paidAt
                  ? [
                      {
                        action: "ยืนยันการชำระเงิน",
                        time: order.paidAt,
                        user: "ระบบอัตโนมัติ",
                        icon: <CheckCircle2 className="w-4 h-4" />,
                        color: "bg-brand-success text-white"
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
                        color: "bg-brand-info text-white"
                      },
                    ]
                  : []),
              ].map((log, index) => (
                <div key={index} className="flex gap-4 relative">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center shadow-sm shrink-0 z-10 ring-4 ring-white ${log.color || "bg-brand-bg text-brand-text-dark"}`}>
                    {log.icon}
                  </div>
                  <div className="flex-1 bg-brand-bg/20 p-3 rounded-xl border border-brand-border/30">
                    <p className="font-bold text-brand-text-dark text-sm">
                      {log.action}
                    </p>
                    <div className="flex items-center gap-2 text-xs text-brand-text-light mt-1">
                      <span className="font-medium bg-brand-bg px-1.5 py-0.5 rounded">{log.user}</span>
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
          <Card variant="elevated" padding="lg" className="border-none shadow-lg shadow-brand-primary/5">
            <h3 className="font-bold text-brand-text-dark mb-4 flex items-center gap-2">
              <User className="w-5 h-5 text-brand-primary" />
              ข้อมูลลูกค้า
            </h3>

            <div className="space-y-4">
              <div className="flex items-center gap-4 p-3 bg-brand-bg/30 rounded-xl border border-brand-border/30">
                <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-lg font-bold text-brand-primary border border-brand-border shadow-sm">
                  {customerName.charAt(0)}
                </div>
                <div>
                  <p className="font-bold text-brand-text-dark text-lg">
                    {customerName}
                  </p>
                  <Badge variant="secondary" size="sm" className="mt-1">ลูกค้าใหม่</Badge>
                </div>
              </div>

              <div className="space-y-3 pt-4">
                {customerContact && (
                  <>
                    <div className="flex items-center gap-3 text-sm p-2 hover:bg-brand-bg/50 rounded-lg transition-colors">
                      <div className="w-8 h-8 rounded-lg bg-[#06C755] flex items-center justify-center text-white shrink-0">
                         <MessageSquare className="w-4 h-4" />
                      </div>
                      <div className="flex flex-col">
                         <span className="text-xs text-brand-text-light">LINE ID</span>
                         <span className="font-medium text-brand-text-dark">{customerContact}</span>
                      </div>
                    </div>
                  </>
                )}
                <div className="flex items-center gap-3 text-sm p-2 hover:bg-brand-bg/50 rounded-lg transition-colors">
                  <div className="w-8 h-8 rounded-lg bg-brand-primary/10 flex items-center justify-center text-brand-primary shrink-0">
                     <Mail className="w-4 h-4" />
                  </div>
                   <div className="flex flex-col">
                       <span className="text-xs text-brand-text-light">Email</span>
                       <span className="font-medium text-brand-text-dark">customer@example.com</span>
                   </div>
                </div>
              </div>

              <Button variant="outline" className="w-full rounded-xl border-brand-border/50 hover:bg-brand-bg hover:text-brand-primary" size="sm">
                <Send className="w-4 h-4 mr-2" />
                ส่งข้อความ
              </Button>
            </div>
          </Card>

          {/* Payment Info */}
          <Card variant="elevated" padding="lg" className="border-none shadow-lg shadow-brand-primary/5">
            <h3 className="font-bold text-brand-text-dark mb-4 flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-green-100 flex items-center justify-center text-green-600">
                  <CheckCircle2 className="w-5 h-5" />
              </div>
              การชำระเงิน
            </h3>

            <div className="space-y-4">
              <div className="flex justify-between items-center p-3 bg-brand-bg/30 rounded-xl border border-brand-border/30">
                <span className="text-brand-text-light text-sm">สถานะ</span>
                <Badge
                  variant={order.paidAt ? "success" : "warning"}
                  className="shadow-sm"
                >
                  {order.paidAt ? "ชำระแล้ว" : "รอชำระ"}
                </Badge>
              </div>
              
              <div className="space-y-2">
                {order.paidAt && (
                  <div className="flex justify-between text-sm">
                    <span className="text-brand-text-light">ชำระเมื่อ</span>
                    <span className="text-brand-text-dark font-medium">
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
                  <span className="text-brand-text-dark font-medium">PromptPay</span>
                </div>
              </div>

              {paymentProof && (
                <div className="pt-4 border-t border-brand-border/50">
                  <p className="text-sm font-medium text-brand-text-dark mb-3">
                    หลักฐานการโอน
                  </p>
                  <div className="aspect-[4/3] bg-brand-bg rounded-xl flex items-center justify-center border-2 border-dashed border-brand-border/50 hover:border-brand-primary/50 transition-colors cursor-pointer group">
                    <div className="text-center group-hover:scale-105 transition-transform">
                       <FileText className="w-8 h-8 text-brand-text-light mx-auto mb-2" />
                       <span className="text-sm text-brand-text-light">
                         คลิกเพื่อดูรูปภาพ
                       </span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </Card>

          {/* Quick Actions */}
          <Card variant="elevated" padding="lg" className="border-none shadow-lg shadow-brand-primary/5">
            <h3 className="font-bold text-brand-text-dark mb-4">
              ⚡ การดำเนินการ
            </h3>

            <div className="space-y-3">
              <Button variant="outline" className="w-full justify-start rounded-xl border-brand-border/50 hover:bg-brand-bg h-10" size="sm">
                <Copy className="w-4 h-4 mr-2 text-brand-text-light" />
                คัดลอกเลขออเดอร์
              </Button>
              <Button variant="outline" className="w-full justify-start rounded-xl border-brand-border/50 hover:bg-brand-bg h-10" size="sm">
                <FileText className="w-4 h-4 mr-2 text-brand-text-light" />
                ดาวน์โหลดใบเสร็จ
              </Button>
              {order.status !== "cancelled" && order.status !== "completed" && (
                <Button
                  variant="outline"
                  className="w-full justify-start text-brand-error hover:bg-brand-error/5 hover:text-brand-error border-brand-error/20 h-10 rounded-xl"
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

