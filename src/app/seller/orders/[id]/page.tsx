"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { Card, Badge, Button, Progress, Dialog, Input, Textarea, Select, Dropdown, Modal } from "@/components/ui";
import { Container, Grid, Section, VStack, HStack } from "@/components/layout";
import { useSellerOrder, useSellerServices, useSellerTeams } from "@/lib/api/hooks";
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
  Zap,
  Play,
  Loader2,
  ChevronDown,
  Building2,
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
  const [showSendBotModal, setShowSendBotModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState<number | null>(null);
  
  // Track which items have been dispatched
  const [sentItems, setSentItems] = useState<Record<number, { sent: boolean; loading: boolean }>>({});
  
  // Job creation form
  const [jobQuantity, setJobQuantity] = useState("");
  const [jobPayRate, setJobPayRate] = useState("");

  // Use API hooks
  const { data: orderData, isLoading: isLoadingOrder } = useSellerOrder(orderId);
  const { data: mockServices, isLoading: isLoadingServices } = useSellerServices();
  const { data: teams, isLoading: isLoadingTeams } = useSellerTeams();
  
  const order = orderData;
  
  // Team selection for job assignment
  const [selectedTeamId, setSelectedTeamId] = useState<string>("");

  const getServiceInfo = (serviceId: string) => {
    return mockServices?.find((s: { id: string }) => s.id === serviceId);
  };

  // Team options for select
  const teamOptions = useMemo(() => {
    if (!teams) return [];
    return teams.map((team) => ({
      value: team.id,
      label: `${team.name} (${team.memberCount} คน)`,
    }));
  }, [teams]);

  if (isLoadingOrder || isLoadingServices || isLoadingTeams || !order) {
    return <div className="p-8 text-center text-brand-text-light">กำลังโหลด...</div>;
  }

  // Helper for customer data (must be after loading check)
  const customerName = order.customer?.name || "ลูกค้า";
  const customerContact = order.customer?.contactValue || "";
  const paymentProof = order.paymentProof;

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const handleConfirmPayment = () => {
    alert("ยืนยันการชำระเงินเรียบร้อย");
    setShowConfirmPayment(false);
  };

  const handleSendBot = async () => {
    if (selectedItem === null) return;
    
    setSentItems((prev) => ({
      ...prev,
      [selectedItem]: { sent: false, loading: true },
    }));
    setShowSendBotModal(false);
    
    // Mock API call
    await new Promise((resolve) => setTimeout(resolve, 1500));
    
    setSentItems((prev) => ({
      ...prev,
      [selectedItem]: { sent: true, loading: false },
    }));
    
    setSelectedItem(null);
  };

  const handleCreateJob = async () => {
    if (selectedItem === null) return;
    
    if (!jobQuantity || !jobPayRate || !selectedTeamId) {
      alert("กรุณากรอกข้อมูลให้ครบถ้วน");
      return;
    }
    
    const selectedTeam = teams?.find((t) => t.id === selectedTeamId);
    
    setSentItems((prev) => ({
      ...prev,
      [selectedItem]: { sent: false, loading: true },
    }));
    setShowCreateJobModal(false);
    
    // Mock API call
    await new Promise((resolve) => setTimeout(resolve, 1500));
    
    setSentItems((prev) => ({
      ...prev,
      [selectedItem]: { sent: true, loading: false },
    }));
    
    alert(`มอบหมายงานให้ทีม "${selectedTeam?.name}" เรียบร้อย!`);
    
    setJobQuantity("");
    setJobPayRate("");
    setSelectedItem(null);
    setSelectedTeamId("");
  };

  return (
    <Container size="xl">
      <Section spacing="lg" className="animate-fade-in pb-12">
        {/* Header */}
        <HStack justify="between" align="center">
          <HStack gap={4} align="center">
            <Link href="/seller/orders">
              <button className="p-2.5 hover:bg-white hover:shadow-sm rounded-xl transition-all border border-transparent hover:border-brand-border/50 text-brand-text-light hover:text-brand-primary">
                <ArrowLeft className="w-5 h-5" />
              </button>
            </Link>
            <VStack gap={0}>
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
            </VStack>
          </HStack>

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
        </HStack>

        <div className="grid lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-8">
          {/* Order Items */}
          <Card variant="elevated" padding="lg" className="border-none shadow-lg shadow-brand-primary/5">
            <h2 className="font-bold text-lg text-brand-text-dark mb-6 flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-brand-primary/10 flex items-center justify-center text-brand-primary">
                <Package className="w-5 h-5" />
              </div>
              รายการสั่งซื้อ <Badge variant="default" className="ml-2">{order.items.length}</Badge>
            </h2>

            <div className="space-y-6">
              {order.items.map((item: { serviceId: string; completedQuantity: number; quantity: number; status: string; serviceName: string; platform: string; type: string; serviceType: string; targetUrl: string; unitPrice: number; subtotal: number; progress: number }, index: number) => {
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
                          {service?.category === "facebook"
                            ? <Facebook className="w-6 h-6 text-[#1877F2]" />
                            : service?.category === "instagram"
                            ? <Instagram className="w-6 h-6 text-[#E4405F]" />
                            : service?.category === "tiktok"
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
                                service?.serviceType === "bot" ? "bot" : "human"
                              }
                              size="sm"
                              className="shadow-none border-none"
                            >
                              {service?.serviceType === "bot" ? "Bot Service" : "Real Human"}
                            </Badge>
                            <span className="text-sm font-medium text-brand-text-light px-2 py-0.5 bg-brand-bg rounded-md">
                              จำนวน {item.quantity.toLocaleString()}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-brand-primary text-xl">
                          ฿{(item.subtotal || 0).toLocaleString()}
                        </p>
                        <p className="text-sm text-brand-text-light">
                          ฿{item.unitPrice || 0} / หน่วย
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

                    {/* Actions - Manual dispatch */}
                    {order.status === "processing" && (
                      <div className="pt-3 border-t border-brand-border/30">
                        {sentItems[index]?.sent ? (
                          // Already sent
                          <div className="flex items-center gap-2 p-3 bg-brand-success/10 border border-brand-success/30 rounded-xl">
                            <CheckCircle2 className="w-5 h-5 text-brand-success" />
                            <span className="text-sm font-medium text-brand-success">
                              {service?.serviceType === "bot" ? "ส่ง API แล้ว" : "มอบหมายงานแล้ว"}
                            </span>
                          </div>
                        ) : sentItems[index]?.loading ? (
                          // Loading
                          <div className="flex items-center gap-2 p-3 bg-brand-info/10 border border-brand-info/30 rounded-xl">
                            <Loader2 className="w-5 h-5 text-brand-info animate-spin" />
                            <span className="text-sm font-medium text-brand-info">
                              กำลังส่ง...
                            </span>
                          </div>
                        ) : (
                          // Not sent yet - show action button
                          <div className="flex gap-2">
                            {service?.serviceType === "bot" ? (
                              <Button
                                variant="primary"
                                size="sm"
                                className="flex-1 h-11 rounded-xl font-medium shadow-md shadow-brand-primary/20"
                                onClick={() => {
                                  setSelectedItem(index);
                                  setShowSendBotModal(true);
                                }}
                              >
                                <Zap className="w-4 h-4 mr-2" />
                                ส่ง Bot API
                              </Button>
                            ) : (
                          <Button
                                variant="primary"
                            size="sm"
                                className="flex-1 h-11 rounded-xl font-medium shadow-md shadow-brand-primary/20 bg-gradient-to-r from-brand-primary to-brand-primary/80"
                            onClick={() => {
                              setSelectedItem(index);
                                  setJobQuantity((item.quantity - item.completedQuantity).toString());
                              setShowCreateJobModal(true);
                            }}
                          >
                            <Users className="w-4 h-4 mr-2" />
                                มอบหมายงานให้ทีม
                          </Button>
                            )}
                          </div>
                        )}
                      </div>
                    )}
                    
                    {/* Pending payment notice */}
                    {order.status === "pending" && (
                      <div className="pt-3 border-t border-brand-border/30">
                        <div className="flex items-center gap-2 p-3 bg-brand-warning/10 border border-brand-warning/30 rounded-xl">
                          <AlertCircle className="w-5 h-5 text-brand-warning" />
                          <span className="text-sm font-medium text-brand-warning">
                            รอยืนยันชำระเงินก่อนส่งคำสั่งซื้อ
                          </span>
                        </div>
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
                ฿{(order.total || 0).toLocaleString()}
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
                  <Badge variant="default" size="sm" className="mt-1">ลูกค้าใหม่</Badge>
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
                ฿{(order.total || 0).toLocaleString()}
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

      {/* Send Bot API Modal */}
      <Modal
        isOpen={showSendBotModal}
        onClose={() => {
          setShowSendBotModal(false);
          setSelectedItem(null);
        }}
        title="ส่งคำสั่งซื้อไป Bot API"
      >
        <div className="space-y-4">
          {selectedItem !== null && (
            <>
              <div className="p-4 bg-brand-bg rounded-xl">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-lg bg-brand-primary/10 flex items-center justify-center">
                    <Zap className="w-5 h-5 text-brand-primary" />
                  </div>
                  <div>
                    <p className="font-bold text-brand-text-dark">
                      {getServiceInfo(order.items[selectedItem].serviceId)?.name}
                    </p>
                    <p className="text-xs text-brand-text-light">Bot Service</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div className="p-2 bg-white rounded-lg">
                    <p className="text-brand-text-light text-xs">จำนวน</p>
                    <p className="font-bold text-brand-text-dark">
                      {order.items[selectedItem].quantity.toLocaleString()} หน่วย
                    </p>
                  </div>
                  <div className="p-2 bg-white rounded-lg">
                    <p className="text-brand-text-light text-xs">ต้นทุน</p>
                    <p className="font-bold text-brand-primary">
                      ฿{((order.items[selectedItem].quantity * (getServiceInfo(order.items[selectedItem].serviceId)?.costPrice || 0))).toLocaleString()}
                    </p>
                  </div>
                </div>
              </div>

              <div className="p-4 bg-brand-warning/10 rounded-xl border border-brand-warning/30 flex gap-3">
                <AlertCircle className="w-5 h-5 text-brand-warning shrink-0" />
                <div className="text-sm text-brand-text-dark">
                  <p className="font-medium text-brand-warning mb-1">ยืนยันการส่ง?</p>
                  <p className="text-brand-text-light">
                    เมื่อส่งแล้วจะหักเครดิตจาก MeeLike API ทันที และไม่สามารถยกเลิกได้
                  </p>
                </div>
              </div>
            </>
          )}

          <div className="flex gap-3 justify-end">
            <Button
              variant="outline"
              onClick={() => {
                setShowSendBotModal(false);
                setSelectedItem(null);
              }}
            >
              ยกเลิก
            </Button>
            <Button onClick={handleSendBot} className="shadow-md shadow-brand-primary/20">
              <Zap className="w-4 h-4 mr-2" />
              ยืนยัน ส่ง Bot API
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
          setJobQuantity("");
          setJobPayRate("");
        }}
        title="มอบหมายงานให้ทีม"
      >
        <div className="space-y-4">
          {selectedItem !== null && (
            <>
              <div className="p-4 bg-brand-bg rounded-xl">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-brand-primary to-brand-primary/70 flex items-center justify-center">
                    <Users className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="font-bold text-brand-text-dark">
                  {getServiceInfo(order.items[selectedItem].serviceId)?.name}
                </p>
                    <p className="text-xs text-brand-text-light">Real Human Service</p>
                  </div>
                </div>
                <div className="p-2 bg-white rounded-lg text-sm">
                  <p className="text-brand-text-light text-xs">จำนวนที่ต้องทำ</p>
                  <p className="font-bold text-brand-text-dark">
                  {(
                    order.items[selectedItem].quantity -
                    order.items[selectedItem].completedQuantity
                  ).toLocaleString()}{" "}
                  หน่วย
                </p>
                </div>
              </div>

              {/* Team Selection */}
              <div>
                <label className="block text-sm font-bold text-brand-text-dark mb-2">
                  เลือกทีมที่จะมอบหมาย *
                </label>
                <div className="relative">
                  <select
                    value={selectedTeamId}
                    onChange={(e) => setSelectedTeamId(e.target.value)}
                    className="w-full p-3 pl-10 rounded-xl border border-brand-border/50 bg-white focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/20 outline-none appearance-none cursor-pointer font-medium"
                  >
                    <option value="">-- เลือกทีม --</option>
                    {teamOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                </select>
                  <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-brand-text-light" />
                  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-brand-text-light pointer-events-none" />
                </div>
                {teams && teams.length > 1 && (
                  <p className="text-xs text-brand-text-light mt-1.5">
                    💡 คุณมี {teams.length} ทีม เลือกทีมที่เหมาะกับงานนี้
                  </p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <Input
                  label="จำนวนที่มอบหมาย *"
                  type="number"
                  placeholder="100"
                  value={jobQuantity}
                  onChange={(e) => setJobQuantity(e.target.value)}
                />
                <Input
                  label="ค่าจ้างต่อหน่วย (฿) *"
                  type="number"
                  step="0.01"
                  placeholder="0.15"
                  value={jobPayRate}
                  onChange={(e) => setJobPayRate(e.target.value)}
                />
              </div>

              {jobQuantity && jobPayRate && (
                <div className="p-3 bg-brand-success/10 border border-brand-success/30 rounded-xl">
                  <div className="flex justify-between text-sm">
                    <span className="text-brand-text-light">ค่าจ้างรวม</span>
                    <span className="font-bold text-brand-success">
                      ฿{(parseFloat(jobQuantity || "0") * parseFloat(jobPayRate || "0")).toLocaleString()}
                    </span>
                  </div>
                </div>
              )}

              <Textarea 
                label="เงื่อนไข/ข้อกำหนด (ถ้ามี)" 
                placeholder="เช่น ต้องเป็นแอคจริงหน้าคน, แคปหลักฐานทุกงาน..." 
                rows={2}
              />
            </>
          )}

          <div className="flex gap-3 justify-end">
            <Button
              variant="outline"
              onClick={() => {
                setShowCreateJobModal(false);
                setSelectedItem(null);
                setJobQuantity("");
                setJobPayRate("");
                setSelectedTeamId("");
              }}
            >
              ยกเลิก
            </Button>
            <Button 
              onClick={handleCreateJob}
              disabled={!jobQuantity || !jobPayRate || !selectedTeamId}
              className="shadow-md shadow-brand-primary/20"
            >
              <Users className="w-4 h-4 mr-2" />
              มอบหมายงาน
            </Button>
          </div>
        </div>
      </Modal>
      </Section>
    </Container>
  );
}

