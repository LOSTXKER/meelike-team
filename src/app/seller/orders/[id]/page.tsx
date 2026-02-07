"use client";

import { useState, useMemo } from "react";
import { useParams } from "next/navigation";
import { Button, Card } from "@/components/ui";
import { useSellerOrder, useSellerServices, useSellerTeams } from "@/lib/api/hooks";
import { api } from "@/lib/api";
import { Copy, FileText, XCircle } from "lucide-react";
import type { OrderItemJob } from "@/types";
import { useToast } from "@/components/ui/toast";
import { useConfirm } from "@/components/ui/confirm-dialog";

// Sub-components
import { OrderHeader } from "./_components/OrderHeader";
import { OrderItems } from "./_components/OrderItems";
import { OrderCustomer } from "./_components/OrderCustomer";
import { OrderPayment } from "./_components/OrderPayment";
import { OrderTimeline } from "./_components/OrderTimeline";
import {
  ConfirmPaymentModal,
  SendBotModal,
  CreateJobModal,
  SplitJobModal,
  ReassignJobModal,
} from "./_components/JobAssignmentModal";
import { OutsourceModal } from "./_components/OutsourceModal";

export default function OrderDetailPage() {
  const params = useParams();
  const orderId = params.id as string;
  const toast = useToast();
  const confirm = useConfirm();

  // Modal visibility
  const [showConfirmPayment, setShowConfirmPayment] = useState(false);
  const [showSendBotModal, setShowSendBotModal] = useState(false);
  const [showCreateJobModal, setShowCreateJobModal] = useState(false);
  const [showSplitJobModal, setShowSplitJobModal] = useState(false);
  const [showReassignModal, setShowReassignModal] = useState(false);
  const [showPostToHubModal, setShowPostToHubModal] = useState(false);

  // Selection state
  const [selectedItem, setSelectedItem] = useState<number | null>(null);
  const [selectedJobForReassign, setSelectedJobForReassign] = useState<OrderItemJob | null>(null);
  const [sentItems, setSentItems] = useState<Record<number, { sent: boolean; loading: boolean }>>({});
  const [isPostingToHub, setIsPostingToHub] = useState(false);

  // Initial values for modals
  const [initialJobQty, setInitialJobQty] = useState("");
  const [initialHubQty, setInitialHubQty] = useState("");

  // Data hooks
  const { data: order, isLoading: isLoadingOrder, refetch } = useSellerOrder(orderId);
  const { data: mockServices, isLoading: isLoadingServices } = useSellerServices();
  const { data: teams, isLoading: isLoadingTeams } = useSellerTeams();

  const teamOptions = useMemo(() => {
    if (!teams) return [];
    return teams.map((team) => ({
      value: team.id,
      label: `${team.name} (${team.memberCount} คน)`,
    }));
  }, [teams]);

  const getServiceInfo = (serviceId: string) =>
    mockServices?.find((s: { id: string }) => s.id === serviceId);

  // ===== Loading =====
  if (isLoadingOrder || isLoadingServices || isLoadingTeams || !order) {
    return (
      <div className="p-8 text-center text-brand-text-light">กำลังโหลด...</div>
    );
  }

  const customerName = order.customer?.name || "ลูกค้า";
  const customerContact = order.customer?.contactValue || "";

  // ===== Handlers =====

  const handleConfirmPayment = async () => {
    try {
      await api.seller.confirmPayment(orderId);
      await refetch();
      toast.success("ยืนยันการชำระเงินเรียบร้อย");
      setShowConfirmPayment(false);
    } catch {
      toast.error("เกิดข้อผิดพลาดในการยืนยันการชำระเงิน");
    }
  };

  const handleSendBot = async () => {
    if (selectedItem === null) return;
    const item = order.items[selectedItem];
    setSentItems((p) => ({ ...p, [selectedItem]: { sent: false, loading: true } }));
    setShowSendBotModal(false);
    try {
      await api.seller.dispatchBotItem(orderId, item.id);
      await refetch();
      setSentItems((p) => ({ ...p, [selectedItem]: { sent: true, loading: false } }));
      toast.success("ส่งคำสั่งซื้อไป Bot API เรียบร้อย!");
    } catch {
      setSentItems((p) => ({ ...p, [selectedItem]: { sent: false, loading: false } }));
      toast.error("เกิดข้อผิดพลาดในการส่งคำสั่งซื้อ");
    }
    setSelectedItem(null);
  };

  const handleCreateJob = async (teamId: string, quantity: string, payRate: string) => {
    if (selectedItem === null) return;
    if (!quantity || !payRate || !teamId) {
      toast.warning("กรุณากรอกข้อมูลให้ครบถ้วน");
      return;
    }
    const item = order.items[selectedItem];
    const selectedTeam = teams?.find((t) => t.id === teamId);
    setSentItems((p) => ({ ...p, [selectedItem]: { sent: false, loading: true } }));
    setShowCreateJobModal(false);
    try {
      await api.seller.assignHumanItemToTeam(orderId, item.id, teamId, parseInt(quantity), parseFloat(payRate));
      await refetch();
      setSentItems((p) => ({ ...p, [selectedItem]: { sent: true, loading: false } }));
      toast.success(`มอบหมายงานให้ทีม "${selectedTeam?.name}" เรียบร้อย!`);
    } catch {
      setSentItems((p) => ({ ...p, [selectedItem]: { sent: false, loading: false } }));
      toast.error("เกิดข้อผิดพลาดในการมอบหมายงาน");
    }
    setSelectedItem(null);
  };

  const handleSplitJob = async (teamId: string, quantity: string, payRate: string) => {
    if (selectedItem === null) return;
    if (!quantity || !payRate || !teamId) {
      toast.warning("กรุณากรอกข้อมูลให้ครบถ้วน");
      return;
    }
    const item = order.items[selectedItem];
    const selectedTeam = teams?.find((t) => t.id === teamId);
    try {
      await api.seller.splitJobToTeams(orderId, item.id, [
        { teamId, quantity: parseInt(quantity), payRate: parseFloat(payRate) },
      ]);
      await refetch();
      setShowSplitJobModal(false);
      setSelectedItem(null);
      toast.success(`แบ่งงานไปทีม "${selectedTeam?.name}" เรียบร้อย!`);
    } catch (error: any) {
      toast.error(error.message || "เกิดข้อผิดพลาดในการแบ่งงาน");
    }
  };

  const handleReassignJob = async (teamId: string, reason: string) => {
    if (!selectedJobForReassign || !teamId) {
      toast.warning("กรุณาเลือกทีมปลายทาง");
      return;
    }
    const selectedTeam = teams?.find((t) => t.id === teamId);
    try {
      await api.seller.reassignJob(selectedJobForReassign.jobId, {
        toTeamId: teamId,
        reason: reason || undefined,
      });
      await refetch();
      setShowReassignModal(false);
      setSelectedJobForReassign(null);
      toast.success(`โยนงานไปทีม "${selectedTeam?.name}" เรียบร้อย!`);
    } catch (error: any) {
      toast.error(error.message || "เกิดข้อผิดพลาดในการโยนงาน");
    }
  };

  const handlePostToHub = async (data: {
    quantity: string;
    suggestedPrice: string;
    deadline: string;
    description: string;
    isUrgent: boolean;
  }) => {
    if (selectedItem === null) return;
    const item = order.items[selectedItem];
    const qty = parseInt(data.quantity);
    setIsPostingToHub(true);
    try {
      await api.hub.postOutsourceFromOrder({
        orderId: order.id,
        orderItemId: item.id,
        quantity: qty,
        suggestedPricePerUnit: parseFloat(data.suggestedPrice),
        deadline: data.deadline,
        description: data.description || undefined,
        isUrgent: data.isUrgent,
      });
      await refetch();
      setShowPostToHubModal(false);
      setSelectedItem(null);
      toast.success("โพสต์ลง Hub เรียบร้อย! รอทีมอื่นมา bid");
    } catch (error: any) {
      toast.error(error.message || "เกิดข้อผิดพลาดในการโพสต์");
    } finally {
      setIsPostingToHub(false);
    }
  };

  // ===== Render =====
  return (
    <div className="space-y-6 animate-fade-in">
      <OrderHeader
        order={order}
        onConfirmPayment={() => setShowConfirmPayment(true)}
      />

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-8">
          <OrderItems
            order={order}
            services={mockServices}
            teams={teams}
            sentItems={sentItems}
            onSendBot={(idx) => {
              setSelectedItem(idx);
              setShowSendBotModal(true);
            }}
            onAssignTeam={(idx) => {
              setSelectedItem(idx);
              const item = order.items[idx];
              setInitialJobQty((item.quantity - item.completedQuantity).toString());
              setShowCreateJobModal(true);
            }}
            onSplitJob={(idx, remaining) => {
              setSelectedItem(idx);
              setInitialJobQty(remaining.toString());
              setShowSplitJobModal(true);
            }}
            onPostToHub={(idx, remaining) => {
              setSelectedItem(idx);
              setInitialHubQty(remaining.toString());
              setShowPostToHubModal(true);
            }}
            onReassignJob={(job) => {
              setSelectedJobForReassign(job);
              setShowReassignModal(true);
            }}
          />

          <OrderTimeline order={order} customerName={customerName} />
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <OrderCustomer
            customerName={customerName}
            customerContact={customerContact}
          />
          <OrderPayment order={order} />

          {/* Quick Actions */}
          <Card
            variant="elevated"
            padding="lg"
            className="border-none shadow-lg shadow-brand-primary/5"
          >
            <h3 className="font-bold text-brand-text-dark mb-4">
              การดำเนินการ
            </h3>
            <div className="space-y-3">
              <Button
                variant="outline"
                className="w-full justify-start rounded-xl border-brand-border/50 hover:bg-brand-bg h-10"
                size="sm"
                onClick={() => navigator.clipboard.writeText(order.orderNumber)}
              >
                <Copy className="w-4 h-4 mr-2 text-brand-text-light" />
                คัดลอกเลขออเดอร์
              </Button>
              <Button
                variant="outline"
                className="w-full justify-start rounded-xl border-brand-border/50 hover:bg-brand-bg h-10"
                size="sm"
              >
                <FileText className="w-4 h-4 mr-2 text-brand-text-light" />
                ดาวน์โหลดใบเสร็จ
              </Button>
              {order.status !== "cancelled" && order.status !== "completed" && (
                <Button
                  variant="outline"
                  className="w-full justify-start text-brand-error hover:bg-brand-error/5 hover:text-brand-error border-brand-error/20 h-10 rounded-xl"
                  size="sm"
                  onClick={async () => {
                    if (
                      await confirm({
                        title: "ยืนยัน",
                        message: "ต้องการยกเลิกออเดอร์นี้หรือไม่?",
                        variant: "danger",
                        confirmLabel: "ยกเลิกออเดอร์",
                      })
                    ) {
                      try {
                        await api.seller.cancelOrder(orderId, "ยกเลิกโดย Seller");
                        await refetch();
                        toast.success("ยกเลิกออเดอร์เรียบร้อย");
                      } catch {
                        toast.error("เกิดข้อผิดพลาดในการยกเลิกออเดอร์");
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

      {/* ===== MODALS ===== */}
      <ConfirmPaymentModal
        isOpen={showConfirmPayment}
        onClose={() => setShowConfirmPayment(false)}
        onConfirm={handleConfirmPayment}
        orderNumber={order.orderNumber}
        total={order.total || 0}
      />

      {selectedItem !== null && (
        <>
          <SendBotModal
            isOpen={showSendBotModal}
            onClose={() => {
              setShowSendBotModal(false);
              setSelectedItem(null);
            }}
            onConfirm={handleSendBot}
            serviceName={getServiceInfo(order.items[selectedItem].serviceId)?.name || "บริการ"}
            quantity={order.items[selectedItem].quantity}
            costPrice={getServiceInfo(order.items[selectedItem].serviceId)?.costPrice || 0}
          />

          <CreateJobModal
            isOpen={showCreateJobModal}
            onClose={() => {
              setShowCreateJobModal(false);
              setSelectedItem(null);
            }}
            onSubmit={handleCreateJob}
            serviceName={getServiceInfo(order.items[selectedItem].serviceId)?.name || "บริการ"}
            remainingQuantity={order.items[selectedItem].quantity - order.items[selectedItem].completedQuantity}
            teamOptions={teamOptions}
            initialQuantity={initialJobQty}
          />

          <SplitJobModal
            isOpen={showSplitJobModal}
            onClose={() => {
              setShowSplitJobModal(false);
              setSelectedItem(null);
            }}
            onSubmit={handleSplitJob}
            serviceName={getServiceInfo(order.items[selectedItem].serviceId)?.name || "บริการ"}
            remainingQuantity={
              order.items[selectedItem].quantity -
              (order.items[selectedItem].jobs?.reduce(
                (sum: number, j: OrderItemJob) => sum + j.quantity, 0
              ) || 0)
            }
            teamOptions={teamOptions}
            initialQuantity={initialJobQty}
          />

          <OutsourceModal
            isOpen={showPostToHubModal}
            onClose={() => {
              setShowPostToHubModal(false);
              setSelectedItem(null);
            }}
            onSubmit={handlePostToHub}
            isLoading={isPostingToHub}
            serviceName={getServiceInfo(order.items[selectedItem].serviceId)?.name || "บริการ"}
            maxQuantity={
              order.items[selectedItem].quantity -
              order.items[selectedItem].completedQuantity -
              (order.items[selectedItem].jobs?.reduce(
                (sum: number, j: OrderItemJob) =>
                  j.status !== "cancelled" ? sum + j.quantity : sum,
                0
              ) || 0)
            }
            initialQuantity={initialHubQty}
          />
        </>
      )}

      <ReassignJobModal
        isOpen={showReassignModal}
        onClose={() => {
          setShowReassignModal(false);
          setSelectedJobForReassign(null);
        }}
        onSubmit={handleReassignJob}
        job={selectedJobForReassign}
        teamOptions={teamOptions}
      />
    </div>
  );
}
