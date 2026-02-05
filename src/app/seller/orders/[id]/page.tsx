"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { Card, Badge, Button, Progress, Dialog, Input, Textarea, Select, Dropdown, Modal } from "@/components/ui";
import { HStack } from "@/components/layout";
import { ContentGuidelines } from "@/components/shared";
import { useSellerOrder, useSellerServices, useSellerTeams } from "@/lib/api/hooks";
import { api } from "@/lib/api";
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
  Split,
  ArrowRightLeft,
  Plus,
  Briefcase,
  Globe,
  AlertTriangle,
} from "lucide-react";
import type { OrderItemJob } from "@/types";

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
  const [showSplitJobModal, setShowSplitJobModal] = useState(false);
  const [showReassignModal, setShowReassignModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState<number | null>(null);
  const [selectedJobForReassign, setSelectedJobForReassign] = useState<OrderItemJob | null>(null);
  
  // Track which items have been dispatched
  const [sentItems, setSentItems] = useState<Record<number, { sent: boolean; loading: boolean }>>({});
  
  // Job creation form
  const [jobQuantity, setJobQuantity] = useState("");
  const [jobPayRate, setJobPayRate] = useState("");
  
  // Split job form
  const [splitQuantity, setSplitQuantity] = useState("");
  const [splitPayRate, setSplitPayRate] = useState("");
  const [splitTeamId, setSplitTeamId] = useState("");
  
  // Reassign job form
  const [reassignTeamId, setReassignTeamId] = useState("");
  const [reassignReason, setReassignReason] = useState("");

  // Post to Hub form
  const [showPostToHubModal, setShowPostToHubModal] = useState(false);
  const [hubQuantity, setHubQuantity] = useState("");
  const [hubSuggestedPrice, setHubSuggestedPrice] = useState("");
  const [hubDeadline, setHubDeadline] = useState("");
  const [hubDescription, setHubDescription] = useState("");
  const [hubIsUrgent, setHubIsUrgent] = useState(false);
  const [isPostingToHub, setIsPostingToHub] = useState(false);

  // Use API hooks
  const { data: orderData, isLoading: isLoadingOrder, refetch } = useSellerOrder(orderId);
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

  const handleConfirmPayment = async () => {
    try {
      await api.seller.confirmPayment(orderId);
      await refetch(); // Refetch order data to update UI
      alert("ยืนยันการชำระเงินเรียบร้อย");
      setShowConfirmPayment(false);
    } catch (error) {
      console.error("Error confirming payment:", error);
      alert("เกิดข้อผิดพลาดในการยืนยันการชำระเงิน");
    }
  };

  const handleSendBot = async () => {
    if (selectedItem === null || !order) return;
    
    const item = order.items[selectedItem];
    
    setSentItems((prev) => ({
      ...prev,
      [selectedItem]: { sent: false, loading: true },
    }));
    setShowSendBotModal(false);
    
    try {
      // Call API to dispatch bot item
      await api.seller.dispatchBotItem(orderId, item.id);
      
      // Refetch order data
      await refetch();
      
      setSentItems((prev) => ({
        ...prev,
        [selectedItem]: { sent: true, loading: false },
      }));
      
      alert("ส่งคำสั่งซื้อไป Bot API เรียบร้อย!");
    } catch (error) {
      console.error("Error dispatching bot item:", error);
      setSentItems((prev) => ({
        ...prev,
        [selectedItem]: { sent: false, loading: false },
      }));
      alert("เกิดข้อผิดพลาดในการส่งคำสั่งซื้อ");
    }
    
    setSelectedItem(null);
  };

  const handleCreateJob = async () => {
    if (selectedItem === null || !order) return;
    
    if (!jobQuantity || !jobPayRate || !selectedTeamId) {
      alert("กรุณากรอกข้อมูลให้ครบถ้วน");
      return;
    }
    
    const selectedTeam = teams?.find((t) => t.id === selectedTeamId);
    const item = order.items[selectedItem];
    
    setSentItems((prev) => ({
      ...prev,
      [selectedItem]: { sent: false, loading: true },
    }));
    setShowCreateJobModal(false);
    
    try {
      // Call API to assign human item to team
      await api.seller.assignHumanItemToTeam(
        orderId,
        item.id,
        selectedTeamId,
        parseInt(jobQuantity),
        parseFloat(jobPayRate)
      );
      
      // Refetch order data
      await refetch();
      
      setSentItems((prev) => ({
        ...prev,
        [selectedItem]: { sent: true, loading: false },
      }));
      
      alert(`มอบหมายงานให้ทีม "${selectedTeam?.name}" เรียบร้อย!`);
    } catch (error) {
      console.error("Error creating job:", error);
      setSentItems((prev) => ({
        ...prev,
        [selectedItem]: { sent: false, loading: false },
      }));
      alert("เกิดข้อผิดพลาดในการมอบหมายงาน");
    }
    
    setJobQuantity("");
    setJobPayRate("");
    setSelectedItem(null);
    setSelectedTeamId("");
  };

  // Handle split job to multiple teams
  const handleSplitJob = async () => {
    if (selectedItem === null || !order) return;
    
    if (!splitQuantity || !splitPayRate || !splitTeamId) {
      alert("กรุณากรอกข้อมูลให้ครบถ้วน");
      return;
    }
    
    const item = order.items[selectedItem];
    const selectedTeam = teams?.find((t) => t.id === splitTeamId);
    
    try {
      await api.seller.splitJobToTeams(
        orderId,
        item.id,
        [{ teamId: splitTeamId, quantity: parseInt(splitQuantity), payRate: parseFloat(splitPayRate) }]
      );
      
      await refetch();
      setShowSplitJobModal(false);
      setSplitQuantity("");
      setSplitPayRate("");
      setSplitTeamId("");
      setSelectedItem(null);
      
      alert(`แบ่งงานไปทีม "${selectedTeam?.name}" เรียบร้อย!`);
    } catch (error: any) {
      console.error("Error splitting job:", error);
      alert(error.message || "เกิดข้อผิดพลาดในการแบ่งงาน");
    }
  };

  // Handle reassign job to another team
  const handleReassignJob = async () => {
    if (!selectedJobForReassign || !reassignTeamId) {
      alert("กรุณาเลือกทีมปลายทาง");
      return;
    }
    
    const selectedTeam = teams?.find((t) => t.id === reassignTeamId);
    
    try {
      await api.seller.reassignJob(selectedJobForReassign.jobId, {
        toTeamId: reassignTeamId,
        reason: reassignReason || undefined,
      });
      
      await refetch();
      setShowReassignModal(false);
      setSelectedJobForReassign(null);
      setReassignTeamId("");
      setReassignReason("");
      
      alert(`โยนงานไปทีม "${selectedTeam?.name}" เรียบร้อย!`);
    } catch (error: any) {
      console.error("Error reassigning job:", error);
      alert(error.message || "เกิดข้อผิดพลาดในการโยนงาน");
    }
  };

  // Get remaining quantity for split
  const getRemainingQuantityForSplit = (itemIndex: number) => {
    const item = order.items[itemIndex];
    const assignedQuantity = item.jobs?.reduce((sum: number, j: OrderItemJob) => sum + j.quantity, 0) || 0;
    return item.quantity - assignedQuantity;
  };

  // Get remaining quantity for Hub posting (excluding completed and assigned)
  const getRemainingQuantityForHub = (itemIndex: number) => {
    const item = order.items[itemIndex];
    const assignedQuantity = item.jobs?.reduce((sum: number, j: OrderItemJob) => 
      j.status !== "cancelled" ? sum + j.quantity : sum, 0) || 0;
    return item.quantity - item.completedQuantity - assignedQuantity;
  };

  // Handle post to Hub
  const handlePostToHub = async () => {
    if (selectedItem === null || !order) return;

    if (!hubQuantity || !hubSuggestedPrice || !hubDeadline) {
      alert("กรุณากรอกข้อมูลให้ครบถ้วน");
      return;
    }

    const item = order.items[selectedItem];
    const qty = parseInt(hubQuantity);
    const maxQty = getRemainingQuantityForHub(selectedItem);

    if (qty > maxQty) {
      alert(`จำนวนที่โพสต์ (${qty}) เกินจำนวนที่เหลือ (${maxQty})`);
      return;
    }

    setIsPostingToHub(true);

    try {
      await api.hub.postOutsourceFromOrder({
        orderId: order.id,
        orderItemId: item.id,
        quantity: qty,
        suggestedPricePerUnit: parseFloat(hubSuggestedPrice),
        deadline: hubDeadline,
        description: hubDescription || undefined,
        isUrgent: hubIsUrgent,
      });

      await refetch();
      setShowPostToHubModal(false);
      resetHubForm();

      alert("โพสต์ลง Hub เรียบร้อย! รอทีมอื่นมา bid");
    } catch (error: any) {
      console.error("Error posting to Hub:", error);
      alert(error.message || "เกิดข้อผิดพลาดในการโพสต์");
    } finally {
      setIsPostingToHub(false);
    }
  };

  const resetHubForm = () => {
    setSelectedItem(null);
    setHubQuantity("");
    setHubSuggestedPrice("");
    setHubDeadline("");
    setHubDescription("");
    setHubIsUrgent(false);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
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
              รายการสั่งซื้อ <Badge variant="default" className="ml-2">{order.items.length}</Badge>
            </h2>

            <div className="space-y-6">
              {order.items.map((item: { id: string; serviceId: string; completedQuantity: number; quantity: number; status: string; serviceName: string; platform: string; type: string; serviceType: string; targetUrl: string; unitPrice: number; subtotal: number; progress: number; jobs?: OrderItemJob[] }, index: number) => {
                const service = getServiceInfo(item.serviceId);
                const progress = (item.completedQuantity / item.quantity) * 100;
                const hasJobs = item.jobs && item.jobs.length > 0;
                const remainingQuantity = getRemainingQuantityForSplit(index);

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

                    {/* Jobs List (for human services with multiple jobs) */}
                    {hasJobs && service?.serviceType === "human" && (
                      <div className="space-y-3 p-4 bg-white rounded-xl border border-brand-border/20 shadow-sm">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Briefcase className="w-4 h-4 text-brand-primary" />
                            <span className="text-sm font-medium text-brand-text-dark">
                              งานที่มอบหมาย ({item.jobs!.length})
                            </span>
                          </div>
                          <div className="flex gap-2">
                            {remainingQuantity > 0 && order.status === "processing" && (
                              <>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => {
                                    setSelectedItem(index);
                                    setSplitQuantity(remainingQuantity.toString());
                                    setShowSplitJobModal(true);
                                  }}
                                  className="text-xs h-7"
                                >
                                  <Plus className="w-3 h-3 mr-1" />
                                  แบ่งงานเพิ่ม
                                </Button>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => {
                                    setSelectedItem(index);
                                    setHubQuantity(getRemainingQuantityForHub(index).toString());
                                    setShowPostToHubModal(true);
                                  }}
                                  className="text-xs h-7 text-brand-accent border-brand-accent/30 hover:bg-brand-accent/5"
                                >
                                  <Globe className="w-3 h-3 mr-1" />
                                  โพสต์ลง Hub
                                </Button>
                              </>
                            )}
                          </div>
                        </div>
                        
                        <div className="space-y-2">
                          {item.jobs!.map((job) => (
                            <div
                              key={job.jobId}
                              className="flex items-center justify-between p-3 bg-brand-bg/50 rounded-lg border border-brand-border/30"
                            >
                              <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-lg bg-brand-primary/10 flex items-center justify-center">
                                  <Users className="w-4 h-4 text-brand-primary" />
                                </div>
                                <div>
                                  <p className="text-sm font-medium text-brand-text-dark">
                                    {job.teamName}
                                  </p>
                                  <p className="text-xs text-brand-text-light">
                                    {job.completedQuantity}/{job.quantity} หน่วย
                                  </p>
                                </div>
                              </div>
                              <div className="flex items-center gap-2">
                                <Badge
                                  variant={
                                    job.status === "completed" ? "success" :
                                    job.status === "cancelled" ? "error" :
                                    job.status === "in_progress" || job.status === "pending_review" ? "info" :
                                    "warning"
                                  }
                                  size="sm"
                                >
                                  {job.status === "completed" ? "เสร็จสิ้น" :
                                   job.status === "cancelled" ? "ยกเลิก" :
                                   job.status === "in_progress" ? "กำลังทำ" :
                                   job.status === "pending_review" ? "รอตรวจ" :
                                   "รอรับงาน"}
                                </Badge>
                                {job.status !== "completed" && job.status !== "cancelled" && (
                                  <Button
                                    size="sm"
                                    variant="ghost"
                                    onClick={() => {
                                      setSelectedJobForReassign(job);
                                      setReassignTeamId("");
                                      setReassignReason("");
                                      setShowReassignModal(true);
                                    }}
                                    className="text-xs h-7 px-2 text-brand-text-light hover:text-brand-primary"
                                    title="โยนงานไปทีมอื่น"
                                  >
                                    <ArrowRightLeft className="w-3 h-3" />
                                  </Button>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

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
                  onClick={async () => {
                    if (confirm("ต้องการยกเลิกออเดอร์นี้หรือไม่?")) {
                      try {
                        await api.seller.cancelOrder(orderId, "ยกเลิกโดย Seller");
                        await refetch();
                        alert("ยกเลิกออเดอร์เรียบร้อย");
                      } catch (error) {
                        console.error("Error cancelling order:", error);
                        alert("เกิดข้อผิดพลาดในการยกเลิกออเดอร์");
                      }
                    }
                  }}
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

              {/* Content Warning */}
              <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl">
                <div className="flex gap-2">
                  <AlertTriangle className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
                  <div className="text-sm">
                    <p className="font-medium text-amber-800">คำเตือน: กรุณาตรวจสอบเนื้อหางานก่อนมอบหมาย</p>
                    <p className="text-amber-700 text-xs mt-1">
                      ห้ามมอบหมายงานที่เกี่ยวข้องกับการพนัน, เว็บผิดกฎหมาย, โฆษณาหลอกลวง หรือเนื้อหาผู้ใหญ่ 
                      หากฝ่าฝืนจะถูกระงับบัญชีถาวรและริบเงินค้างถอน
                    </p>
                  </div>
                </div>
              </div>
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

      {/* Split Job Modal */}
      <Modal
        isOpen={showSplitJobModal}
        onClose={() => {
          setShowSplitJobModal(false);
          setSelectedItem(null);
          setSplitQuantity("");
          setSplitPayRate("");
          setSplitTeamId("");
        }}
        title="แบ่งงานไปทีมอื่น"
      >
        <div className="space-y-4">
          {selectedItem !== null && (
            <>
              <div className="p-4 bg-brand-bg rounded-xl">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-brand-accent to-brand-primary flex items-center justify-center">
                    <Split className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="font-bold text-brand-text-dark">
                      {getServiceInfo(order.items[selectedItem].serviceId)?.name}
                    </p>
                    <p className="text-xs text-brand-text-light">แบ่งงานเพิ่มไปทีมอื่น</p>
                  </div>
                </div>
                <div className="p-2 bg-white rounded-lg text-sm">
                  <p className="text-brand-text-light text-xs">จำนวนที่ยังไม่ได้มอบหมาย</p>
                  <p className="font-bold text-brand-text-dark">
                    {getRemainingQuantityForSplit(selectedItem).toLocaleString()} หน่วย
                  </p>
                </div>
              </div>

              {/* Team Selection */}
              <div>
                <label className="block text-sm font-bold text-brand-text-dark mb-2">
                  เลือกทีมปลายทาง *
                </label>
                <div className="relative">
                  <select
                    value={splitTeamId}
                    onChange={(e) => setSplitTeamId(e.target.value)}
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
              </div>

              <div className="grid grid-cols-2 gap-4">
                <Input
                  label="จำนวนที่แบ่ง *"
                  type="number"
                  placeholder="100"
                  value={splitQuantity}
                  onChange={(e) => setSplitQuantity(e.target.value)}
                  max={getRemainingQuantityForSplit(selectedItem)}
                />
                <Input
                  label="ค่าจ้างต่อหน่วย (฿) *"
                  type="number"
                  step="0.01"
                  placeholder="0.15"
                  value={splitPayRate}
                  onChange={(e) => setSplitPayRate(e.target.value)}
                />
              </div>

              {splitQuantity && splitPayRate && (
                <div className="p-3 bg-brand-success/10 border border-brand-success/30 rounded-xl">
                  <div className="flex justify-between text-sm">
                    <span className="text-brand-text-light">ค่าจ้างรวม</span>
                    <span className="font-bold text-brand-success">
                      ฿{(parseFloat(splitQuantity || "0") * parseFloat(splitPayRate || "0")).toLocaleString()}
                    </span>
                  </div>
                </div>
              )}

              {/* Content Warning */}
              <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl">
                <div className="flex gap-2">
                  <AlertTriangle className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
                  <div className="text-sm">
                    <p className="font-medium text-amber-800">คำเตือน: ตรวจสอบเนื้อหาก่อนแบ่งงาน</p>
                    <p className="text-amber-700 text-xs mt-1">
                      ห้ามแบ่งงานที่เกี่ยวข้องกับการพนัน, เว็บผิดกฎหมาย, โฆษณาหลอกลวง หรือเนื้อหาผู้ใหญ่
                    </p>
                  </div>
                </div>
              </div>
            </>
          )}

          <div className="flex gap-3 justify-end">
            <Button
              variant="outline"
              onClick={() => {
                setShowSplitJobModal(false);
                setSelectedItem(null);
                setSplitQuantity("");
                setSplitPayRate("");
                setSplitTeamId("");
              }}
            >
              ยกเลิก
            </Button>
            <Button 
              onClick={handleSplitJob}
              disabled={!splitQuantity || !splitPayRate || !splitTeamId}
              className="shadow-md shadow-brand-primary/20"
            >
              <Split className="w-4 h-4 mr-2" />
              แบ่งงาน
            </Button>
          </div>
        </div>
      </Modal>

      {/* Reassign Job Modal */}
      <Modal
        isOpen={showReassignModal}
        onClose={() => {
          setShowReassignModal(false);
          setSelectedJobForReassign(null);
          setReassignTeamId("");
          setReassignReason("");
        }}
        title="โยนงานไปทีมอื่น"
      >
        <div className="space-y-4">
          {selectedJobForReassign && (
            <>
              <div className="p-4 bg-brand-bg rounded-xl">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-brand-warning to-brand-accent flex items-center justify-center">
                    <ArrowRightLeft className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="font-bold text-brand-text-dark">
                      โยนงานจากทีม "{selectedJobForReassign.teamName}"
                    </p>
                    <p className="text-xs text-brand-text-light">
                      {selectedJobForReassign.quantity - selectedJobForReassign.completedQuantity} หน่วยที่เหลือจะถูกโยนไปทีมใหม่
                    </p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div className="p-2 bg-white rounded-lg text-sm">
                    <p className="text-brand-text-light text-xs">จำนวนทั้งหมด</p>
                    <p className="font-bold text-brand-text-dark">{selectedJobForReassign.quantity} หน่วย</p>
                  </div>
                  <div className="p-2 bg-white rounded-lg text-sm">
                    <p className="text-brand-text-light text-xs">ทำเสร็จแล้ว</p>
                    <p className="font-bold text-brand-success">{selectedJobForReassign.completedQuantity} หน่วย</p>
                  </div>
                </div>
              </div>

              <div className="p-3 bg-brand-warning/10 border border-brand-warning/30 rounded-xl">
                <div className="flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 text-brand-warning mt-0.5 shrink-0" />
                  <p className="text-sm text-brand-text-dark">
                    งานเดิมจะถูกยกเลิก และสร้างงานใหม่ในทีมที่เลือก ส่วนที่ทำเสร็จแล้วจะยังคงอยู่
                  </p>
                </div>
              </div>

              {/* Team Selection */}
              <div>
                <label className="block text-sm font-bold text-brand-text-dark mb-2">
                  เลือกทีมปลายทาง *
                </label>
                <div className="relative">
                  <select
                    value={reassignTeamId}
                    onChange={(e) => setReassignTeamId(e.target.value)}
                    className="w-full p-3 pl-10 rounded-xl border border-brand-border/50 bg-white focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/20 outline-none appearance-none cursor-pointer font-medium"
                  >
                    <option value="">-- เลือกทีม --</option>
                    {teamOptions
                      .filter(opt => opt.value !== selectedJobForReassign.teamId)
                      .map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                  </select>
                  <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-brand-text-light" />
                  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-brand-text-light pointer-events-none" />
                </div>
              </div>

              <Textarea
                label="เหตุผล (ถ้ามี)"
                placeholder="เช่น ทีมเดิมไม่ว่าง, ต้องการเปลี่ยนทีม..."
                value={reassignReason}
                onChange={(e) => setReassignReason(e.target.value)}
                rows={2}
              />

              {/* Content Warning */}
              <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl">
                <div className="flex gap-2">
                  <AlertTriangle className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
                  <div className="text-sm">
                    <p className="font-medium text-amber-800">คำเตือน: ตรวจสอบเนื้อหาก่อนโยนงาน</p>
                    <p className="text-amber-700 text-xs mt-1">
                      ห้ามโยนงานที่เกี่ยวข้องกับการพนัน, เว็บผิดกฎหมาย, โฆษณาหลอกลวง หรือเนื้อหาผู้ใหญ่
                    </p>
                  </div>
                </div>
              </div>
            </>
          )}

          <div className="flex gap-3 justify-end">
            <Button
              variant="outline"
              onClick={() => {
                setShowReassignModal(false);
                setSelectedJobForReassign(null);
                setReassignTeamId("");
                setReassignReason("");
              }}
            >
              ยกเลิก
            </Button>
            <Button 
              onClick={handleReassignJob}
              disabled={!reassignTeamId}
              className="shadow-md shadow-brand-primary/20"
            >
              <ArrowRightLeft className="w-4 h-4 mr-2" />
              โยนงาน
            </Button>
          </div>
        </div>
      </Modal>

      {/* Post to Hub Modal */}
      <Modal
        isOpen={showPostToHubModal}
        onClose={() => {
          setShowPostToHubModal(false);
          resetHubForm();
        }}
        title="โพสต์ลง Hub"
      >
        <div className="space-y-4">
          {selectedItem !== null && (
            <>
              <div className="p-4 bg-gradient-to-br from-brand-accent/10 to-brand-primary/10 rounded-xl border border-brand-accent/20">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-brand-accent to-brand-primary flex items-center justify-center">
                    <Globe className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="font-bold text-brand-text-dark">
                      {getServiceInfo(order.items[selectedItem].serviceId)?.name}
                    </p>
                    <p className="text-xs text-brand-text-light">โพสต์ไปตลาด Hub ให้ทีมอื่นมา bid</p>
                  </div>
                </div>
                <div className="p-2 bg-white rounded-lg text-sm">
                  <p className="text-brand-text-light text-xs">จำนวนที่สามารถโพสต์ได้</p>
                  <p className="font-bold text-brand-text-dark">
                    {getRemainingQuantityForHub(selectedItem).toLocaleString()} หน่วย
                  </p>
                </div>
              </div>

              <div className="p-3 bg-brand-info/10 border border-brand-info/20 rounded-xl">
                <div className="flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 text-brand-info mt-0.5 shrink-0" />
                  <div className="text-sm text-brand-text-dark">
                    <p className="font-medium text-brand-info mb-1">วิธีการทำงาน</p>
                    <ul className="text-xs text-brand-text-light space-y-1">
                      <li>• งานจะถูกโพสต์ในตลาด Hub</li>
                      <li>• ทีมอื่นๆ จะเห็นและส่ง bid เข้ามา</li>
                      <li>• คุณเลือก bid ที่ต้องการแล้วมอบหมายงาน</li>
                      <li>• ราคาที่ทีม bid = ต้นทุนใหม่ของคุณ</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <Input
                  label="จำนวนที่โพสต์ *"
                  type="number"
                  placeholder="100"
                  value={hubQuantity}
                  onChange={(e) => setHubQuantity(e.target.value)}
                  max={getRemainingQuantityForHub(selectedItem)}
                />
                <Input
                  label="ราคาแนะนำ/หน่วย (฿) *"
                  type="number"
                  step="0.01"
                  placeholder="0.15"
                  value={hubSuggestedPrice}
                  onChange={(e) => setHubSuggestedPrice(e.target.value)}
                />
              </div>

              <Input
                label="กำหนดส่ง *"
                type="date"
                value={hubDeadline}
                onChange={(e) => setHubDeadline(e.target.value)}
              />

              <Textarea
                label="รายละเอียดเพิ่มเติม (ถ้ามี)"
                placeholder="เช่น ต้องการแอคคนจริง, ต้องแคปหลักฐาน..."
                value={hubDescription}
                onChange={(e) => setHubDescription(e.target.value)}
                rows={2}
              />

              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={hubIsUrgent}
                  onChange={(e) => setHubIsUrgent(e.target.checked)}
                  className="w-4 h-4 text-brand-warning rounded focus:ring-brand-warning"
                />
                <span className="text-sm text-brand-text-dark">
                  🔥 งานด่วน (แสดงเป็น Urgent ใน Hub)
                </span>
              </label>

              {hubQuantity && hubSuggestedPrice && (
                <div className="p-3 bg-brand-warning/10 border border-brand-warning/30 rounded-xl">
                  <div className="flex justify-between text-sm">
                    <span className="text-brand-text-light">งบประมาณสูงสุด (ถ้า bid ตามราคาแนะนำ)</span>
                    <span className="font-bold text-brand-warning">
                      ฿{(parseFloat(hubQuantity || "0") * parseFloat(hubSuggestedPrice || "0")).toLocaleString()}
                    </span>
                  </div>
                </div>
              )}

              {/* Content Warning */}
              <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl">
                <div className="flex gap-2">
                  <AlertTriangle className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
                  <div className="text-sm">
                    <p className="font-medium text-amber-800">คำเตือน: กรุณาตรวจสอบเนื้อหาก่อนโพสต์</p>
                    <p className="text-amber-700 text-xs mt-1">
                      ห้ามโพสต์งานที่เกี่ยวข้องกับการพนัน, เว็บผิดกฎหมาย, โฆษณาหลอกลวง หรือเนื้อหาผู้ใหญ่ 
                      การฝ่าฝืนจะถูกระงับบัญชีถาวร
                    </p>
                  </div>
                </div>
              </div>
            </>
          )}

          <div className="flex gap-3 justify-end">
            <Button
              variant="outline"
              onClick={() => {
                setShowPostToHubModal(false);
                resetHubForm();
              }}
              disabled={isPostingToHub}
            >
              ยกเลิก
            </Button>
            <Button 
              onClick={handlePostToHub}
              disabled={!hubQuantity || !hubSuggestedPrice || !hubDeadline || isPostingToHub}
              isLoading={isPostingToHub}
              className="shadow-md shadow-brand-accent/20 bg-gradient-to-r from-brand-accent to-brand-primary"
            >
              <Globe className="w-4 h-4 mr-2" />
              โพสต์ลง Hub
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}

