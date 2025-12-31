"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { Card, Badge, Button, Input, Progress } from "@/components/ui";
import { mockOrders, mockServices } from "@/lib/mock-data";
import {
  ArrowLeft,
  Search,
  Package,
  Clock,
  CheckCircle2,
  XCircle,
  Loader2,
  Copy,
  MessageCircle,
  ExternalLink,
  ClipboardList,
  Facebook,
  Instagram,
  Music2,
  Youtube,
} from "lucide-react";

type OrderStatus = "pending" | "processing" | "completed" | "cancelled";

const statusConfig: Record<
  OrderStatus,
  { label: string; color: "warning" | "info" | "success" | "error"; icon: React.ReactNode }
> = {
  pending: {
    label: "รอชำระเงิน",
    color: "warning",
    icon: <Clock className="w-5 h-5" />,
  },
  processing: {
    label: "กำลังดำเนินการ",
    color: "info",
    icon: <Loader2 className="w-5 h-5 animate-spin" />,
  },
  completed: {
    label: "เสร็จสิ้น",
    color: "success",
    icon: <CheckCircle2 className="w-5 h-5" />,
  },
  cancelled: {
    label: "ยกเลิก",
    color: "error",
    icon: <XCircle className="w-5 h-5" />,
  },
};

export default function OrderStatusPage() {
  const params = useParams();
  const slug = params.slug as string;
  
  const [orderId, setOrderId] = useState("");
  const [searchId, setSearchId] = useState("");
  const [order, setOrder] = useState<typeof mockOrders[0] | null>(null);
  const [loading, setLoading] = useState(false);
  const [notFound, setNotFound] = useState(false);

  // Auto search from URL params
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const orderParam = urlParams.get("order");
    if (orderParam) {
      setOrderId(orderParam);
      handleSearch(orderParam);
    }
  }, []);

  const handleSearch = async (id?: string) => {
    const searchValue = id || orderId;
    if (!searchValue.trim()) return;

    setLoading(true);
    setNotFound(false);
    
    // Simulate API delay
    await new Promise((r) => setTimeout(r, 800));

    // Mock search - find order by ID
    const found = mockOrders.find(
      (o) => o.id.toLowerCase().includes(searchValue.toLowerCase()) ||
             o.orderNumber.toLowerCase().includes(searchValue.toLowerCase())
    );

    if (found) {
      setOrder(found);
      setSearchId(searchValue);
    } else {
      setOrder(null);
      setNotFound(true);
    }
    setLoading(false);
  };

  const copyOrderId = () => {
    if (order) {
      navigator.clipboard.writeText(order.orderNumber);
    }
  };

  const getServiceInfo = (serviceId: string) => {
    return mockServices.find((s) => s.id === serviceId);
  };

  return (
    <div className="min-h-screen bg-brand-bg">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-brand-surface border-b border-brand-border">
        <div className="max-w-2xl mx-auto px-4 h-14 flex items-center gap-3">
          <Link href={`/s/${slug}`}>
            <button className="p-2 -ml-2 hover:bg-brand-bg rounded-lg transition-colors">
              <ArrowLeft className="w-5 h-5 text-brand-text-dark" />
            </button>
          </Link>
          <h1 className="text-lg font-bold text-brand-text-dark flex items-center gap-2">
            <Package className="w-5 h-5" />
            ตรวจสอบสถานะออเดอร์
          </h1>
        </div>
      </header>

      <main className="max-w-2xl mx-auto p-4 space-y-6">
        {/* Search Box */}
        <Card variant="bordered" padding="lg">
          <div className="space-y-4">
            <div>
              <h2 className="font-semibold text-brand-text-dark mb-1">
                ค้นหาออเดอร์
              </h2>
              <p className="text-sm text-brand-text-light">
                กรอกเลขออเดอร์เพื่อตรวจสอบสถานะ
              </p>
            </div>

            <div className="flex gap-2">
              <Input
                placeholder="เช่น ORD-2024-001"
                value={orderId}
                onChange={(e) => setOrderId(e.target.value)}
                leftIcon={<Search className="w-4 h-4" />}
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              />
              <Button
                onClick={() => handleSearch()}
                isLoading={loading}
                className="shrink-0"
              >
                ค้นหา
              </Button>
            </div>
          </div>
        </Card>

        {/* Not Found */}
        {notFound && (
          <Card variant="bordered" padding="lg" className="text-center">
            <div className="py-8 space-y-3">
              <div className="w-16 h-16 bg-brand-error/10 rounded-full flex items-center justify-center mx-auto">
                <XCircle className="w-8 h-8 text-brand-error" />
              </div>
              <h3 className="font-semibold text-brand-text-dark">
                ไม่พบออเดอร์
              </h3>
              <p className="text-sm text-brand-text-light">
                กรุณาตรวจสอบเลขออเดอร์อีกครั้ง
              </p>
            </div>
          </Card>
        )}

        {/* Order Detail */}
        {order && (
          <div className="space-y-4">
            {/* Order Header */}
            <Card variant="bordered" padding="lg">
              <div className="space-y-4">
                {/* Order ID & Status */}
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-lg text-brand-text-dark">
                        {order.orderNumber}
                      </span>
                      <button
                        onClick={copyOrderId}
                        className="p-1 hover:bg-brand-bg rounded transition-colors"
                        title="คัดลอก"
                      >
                        <Copy className="w-4 h-4 text-brand-text-light" />
                      </button>
                    </div>
                    <p className="text-sm text-brand-text-light mt-1">
                      สั่งเมื่อ {new Date(order.createdAt).toLocaleDateString("th-TH", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  </div>
                  <Badge variant={statusConfig[order.status as OrderStatus].color}>
                    <span className="flex items-center gap-1.5">
                      {statusConfig[order.status as OrderStatus].icon}
                      {statusConfig[order.status as OrderStatus].label}
                    </span>
                  </Badge>
                </div>

                {/* Progress */}
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-brand-text-light">ความคืบหน้า</span>
                    <span className="font-medium text-brand-text-dark">
                      {order.status === "completed" ? 100 : order.status === "cancelled" ? 0 : 65}%
                    </span>
                  </div>
                  <Progress 
                    value={order.status === "completed" ? 100 : order.status === "cancelled" ? 0 : 65} 
                  />
                </div>
              </div>
            </Card>

            {/* Order Items */}
            <Card variant="bordered" padding="lg">
              <h3 className="font-semibold text-brand-text-dark mb-4 flex items-center gap-2">
                <ClipboardList className="w-5 h-5 text-brand-primary" />
                รายการสั่งซื้อ
              </h3>
              <div className="space-y-4">
                {order.items.map((item, index) => {
                  const service = getServiceInfo(item.serviceId);
                  const itemProgress = item.completedQuantity / item.quantity * 100;
                  
                  return (
                    <div
                      key={index}
                      className="p-4 bg-brand-bg rounded-xl space-y-3"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 rounded-lg bg-brand-bg flex items-center justify-center">
                            {service?.category === "facebook" ? <Facebook className="w-6 h-6 text-blue-500" /> :
                             service?.category === "instagram" ? <Instagram className="w-6 h-6 text-pink-500" /> :
                             service?.category === "tiktok" ? <Music2 className="w-6 h-6 text-gray-800" /> : <Youtube className="w-6 h-6 text-red-500" />}
                          </div>
                          <div>
                            <p className="font-medium text-brand-text-dark">
                              {service?.name || "บริการ"}
                            </p>
                            <Badge
                              variant={service?.serviceType === "bot" ? "info" : "success"}
                              size="sm"
                            >
                              {service?.serviceType === "bot" ? "Bot" : "คนจริง"}
                            </Badge>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold text-brand-primary">
                            ฿{(item.subtotal || 0).toLocaleString()}
                          </p>
                        </div>
                      </div>

                      {/* Item Progress */}
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-brand-text-light">
                            {item.completedQuantity.toLocaleString()} / {item.quantity.toLocaleString()}
                          </span>
                          <span className="font-medium text-brand-text-dark">
                            {Math.round(itemProgress)}%
                          </span>
                        </div>
                        <Progress value={itemProgress} size="sm" />
                      </div>

                      {/* Target Link */}
                      {item.targetUrl && (
                        <a
                          href={item.targetUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-2 text-sm text-brand-primary hover:underline"
                        >
                          <ExternalLink className="w-4 h-4" />
                          ดูลิงก์เป้าหมาย
                        </a>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Total */}
              <div className="mt-4 pt-4 border-t border-brand-border">
                <div className="flex justify-between">
                  <span className="font-semibold text-brand-text-dark">
                    รวมทั้งหมด
                  </span>
                  <span className="text-xl font-bold text-brand-primary">
                    ฿{order.total.toLocaleString()}
                  </span>
                </div>
              </div>
            </Card>

            {/* Timeline */}
            <Card variant="bordered" padding="lg">
              <h3 className="font-semibold text-brand-text-dark mb-4">
                📜 ประวัติการดำเนินการ
              </h3>
              <div className="space-y-4">
                {[
                  {
                    time: order.createdAt,
                    title: "สร้างออเดอร์",
                    desc: "ลูกค้าสั่งซื้อบริการ",
                    done: true,
                  },
                  {
                    time: order.paidAt || "",
                    title: "ชำระเงินแล้ว",
                    desc: "ยืนยันการชำระเงิน",
                    done: !!order.paidAt,
                  },
                  {
                    time: "",
                    title: "กำลังดำเนินการ",
                    desc: "เริ่มส่งมอบบริการ",
                    done: order.status === "processing" || order.status === "completed",
                  },
                  {
                    time: "",
                    title: "เสร็จสิ้น",
                    desc: "ส่งมอบบริการครบถ้วน",
                    done: order.status === "completed",
                  },
                ].map((step, index) => (
                  <div key={index} className="flex gap-4">
                    <div className="flex flex-col items-center">
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center ${
                          step.done
                            ? "bg-brand-success text-white"
                            : "bg-brand-bg text-brand-text-light"
                        }`}
                      >
                        {step.done ? (
                          <CheckCircle2 className="w-4 h-4" />
                        ) : (
                          <span className="text-sm">{index + 1}</span>
                        )}
                      </div>
                      {index < 3 && (
                        <div
                          className={`w-0.5 h-8 ${
                            step.done ? "bg-brand-success" : "bg-brand-border"
                          }`}
                        />
                      )}
                    </div>
                    <div className="flex-1 pb-4">
                      <p
                        className={`font-medium ${
                          step.done ? "text-brand-text-dark" : "text-brand-text-light"
                        }`}
                      >
                        {step.title}
                      </p>
                      <p className="text-sm text-brand-text-light">{step.desc}</p>
                      {step.time && (
                        <p className="text-xs text-brand-text-light mt-1">
                          {new Date(step.time).toLocaleDateString("th-TH", {
                            day: "numeric",
                            month: "short",
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            {/* Contact */}
            <Card variant="bordered" padding="lg">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold text-brand-text-dark flex items-center gap-1">
                    <MessageCircle className="w-4 h-4" />
                    ต้องการความช่วยเหลือ?
                  </h3>
                  <p className="text-sm text-brand-text-light">
                    ติดต่อร้านค้าได้ทาง LINE
                  </p>
                </div>
                <Button variant="secondary" size="sm">
                  <MessageCircle className="w-4 h-4 mr-2" />
                  ติดต่อร้าน
                </Button>
              </div>
            </Card>
          </div>
        )}

        {/* Help Text when no search */}
        {!order && !notFound && !loading && (
          <Card variant="bordered" padding="lg" className="text-center">
            <div className="py-8 space-y-3">
              <div className="w-16 h-16 bg-brand-primary/10 rounded-full flex items-center justify-center mx-auto">
                <Package className="w-8 h-8 text-brand-primary" />
              </div>
              <h3 className="font-semibold text-brand-text-dark">
                ตรวจสอบสถานะออเดอร์
              </h3>
              <p className="text-sm text-brand-text-light max-w-xs mx-auto">
                กรอกเลขออเดอร์ที่ได้รับจากการสั่งซื้อเพื่อตรวจสอบความคืบหน้า
              </p>
            </div>
          </Card>
        )}
      </main>
    </div>
  );
}

