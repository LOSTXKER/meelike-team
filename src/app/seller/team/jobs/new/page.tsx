"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Card, Badge, Button, Input, Select, Textarea } from "@/components/ui";
import { PageHeader, PlatformIcon } from "@/components/shared";
import { useSellerTeams, useSellerOrders } from "@/lib/api/hooks";
import type { Platform, ServiceType, WorkerLevel } from "@/types";
import { formatCurrency } from "@/lib/utils";
import {
  ArrowLeft,
  Users,
  Link as LinkIcon,
  Target,
  Clock,
  DollarSign,
  FileText,
  CheckCircle2,
  AlertCircle,
  ThumbsUp,
  MessageSquare,
  UserPlus,
  Share2,
  Eye,
  Calendar,
  Shield,
  Star,
  UserCheck,
  Sparkles,
} from "lucide-react";

const platforms: { value: Platform; label: string; icon: string }[] = [
  { value: "facebook", label: "Facebook", icon: "📘" },
  { value: "instagram", label: "Instagram", icon: "📸" },
  { value: "tiktok", label: "TikTok", icon: "🎵" },
  { value: "youtube", label: "YouTube", icon: "📺" },
  { value: "twitter", label: "Twitter", icon: "🐦" },
];

const jobTypes: { value: ServiceType; label: string; icon: React.ReactNode }[] = [
  { value: "like", label: "ไลค์", icon: <ThumbsUp className="w-5 h-5" /> },
  { value: "comment", label: "เม้น", icon: <MessageSquare className="w-5 h-5" /> },
  { value: "follow", label: "ฟอลโลว์", icon: <UserPlus className="w-5 h-5" /> },
  { value: "share", label: "แชร์", icon: <Share2 className="w-5 h-5" /> },
  { value: "view", label: "วิว", icon: <Eye className="w-5 h-5" /> },
];

const visibilityOptions = [
  { value: "all_members", label: "ทุกคนในทีม", icon: <Users className="w-4 h-4" /> },
  { value: "level_required", label: "ตามระดับ", icon: <Star className="w-4 h-4" /> },
  { value: "selected", label: "เลือกเฉพาะคน", icon: <UserCheck className="w-4 h-4" /> },
];

const levelOptions: { value: WorkerLevel; label: string }[] = [
  { value: "bronze", label: "🥉 Bronze ขึ้นไป" },
  { value: "silver", label: "🥈 Silver ขึ้นไป" },
  { value: "gold", label: "🥇 Gold ขึ้นไป" },
  { value: "platinum", label: "💎 Platinum ขึ้นไป" },
  { value: "vip", label: "👑 VIP เท่านั้น" },
];

export default function NewTeamJobPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const orderIdParam = searchParams.get("orderId");
  const teamIdParam = searchParams.get("team");

  const { data: teams, isLoading: teamsLoading } = useSellerTeams();
  const { data: orders, isLoading: ordersLoading } = useSellerOrders();

  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form state
  const [linkToOrder, setLinkToOrder] = useState(!!orderIdParam);
  const [selectedOrderId, setSelectedOrderId] = useState(orderIdParam || "");
  const [selectedTeamId, setSelectedTeamId] = useState(teamIdParam || "");
  
  // Get current team
  const currentTeamId = useMemo(() => {
    if (selectedTeamId) return selectedTeamId;
    if (teams && teams.length > 0) return teams[0].id;
    return "";
  }, [selectedTeamId, teams]);
  
  const currentTeam = useMemo(() => {
    return teams?.find((t) => t.id === currentTeamId);
  }, [teams, currentTeamId]);
  const [selectedPlatform, setSelectedPlatform] = useState<Platform>("facebook");
  const [selectedType, setSelectedType] = useState<ServiceType>("like");
  const [targetUrl, setTargetUrl] = useState("");
  const [quantity, setQuantity] = useState("");
  const [pricePerUnit, setPricePerUnit] = useState("");
  const [deadline, setDeadline] = useState("");
  const [deadlineTime, setDeadlineTime] = useState("18:00");
  const [visibility, setVisibility] = useState("all_members");
  const [minLevel, setMinLevel] = useState<WorkerLevel>("bronze");
  const [requirements, setRequirements] = useState("");
  const [commentTemplates, setCommentTemplates] = useState("");

  // Calculated values
  const totalBudget = useMemo(() => {
    const qty = parseInt(quantity) || 0;
    const price = parseFloat(pricePerUnit) || 0;
    return qty * price;
  }, [quantity, pricePerUnit]);

  // Pending orders for linking
  const pendingOrders = useMemo(() => {
    if (!orders) return [];
    return orders.filter((o) => o.status === "processing" || o.status === "pending");
  }, [orders]);

  const handleSubmit = async () => {
    // Validation
    if (!targetUrl) {
      alert("กรุณาระบุลิงก์เป้าหมาย");
      return;
    }
    if (!quantity || parseInt(quantity) <= 0) {
      alert("กรุณาระบุจำนวนที่ต้องการ");
      return;
    }
    if (!pricePerUnit || parseFloat(pricePerUnit) <= 0) {
      alert("กรุณาระบุค่าจ้างต่อหน่วย");
      return;
    }

    setIsSubmitting(true);

    // Mock create job
    const jobId = `JOB-${Date.now().toString().slice(-6)}`;

    setTimeout(() => {
      alert(
        `สร้างงาน ${jobId} เรียบร้อย!\n` +
          `ประเภท: ${jobTypes.find((j) => j.value === selectedType)?.label}\n` +
          `จำนวน: ${quantity} หน่วย\n` +
          `งบประมาณ: ฿${totalBudget.toLocaleString()}`
      );
      router.push("/seller/team/jobs");
    }, 1000);
  };

  if (teamsLoading || ordersLoading) {
    return <div className="p-8 text-center text-brand-text-light">กำลังโหลด...</div>;
  }

  return (
    <div className="space-y-8 animate-fade-in max-w-7xl mx-auto pb-12">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Link href="/seller/team/jobs">
            <button className="p-2.5 hover:bg-white hover:shadow-sm rounded-xl transition-all border border-transparent hover:border-brand-border/50 text-brand-text-light hover:text-brand-primary">
              <ArrowLeft className="w-5 h-5" />
            </button>
          </Link>
          <PageHeader
            title="สร้างงานใหม่"
            description={`สร้างงานให้ทีม ${currentTeam?.name || ""} รับไปทำ`}
            icon={Users}
          />
        </div>
        
        {/* Team Selector */}
        {teams && teams.length > 1 && (
          <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-xl border border-brand-border/50 shadow-sm">
            <Users className="w-4 h-4 text-brand-primary" />
            <span className="text-sm text-brand-text-light">ทีม:</span>
            <select
              value={currentTeamId}
              onChange={(e) => setSelectedTeamId(e.target.value)}
              className="bg-transparent text-sm font-bold text-brand-text-dark focus:outline-none cursor-pointer"
            >
              {teams?.map((team) => (
                <option key={team.id} value={team.id}>
                  {team.name}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Main Form */}
        <div className="lg:col-span-2 space-y-8">
          {/* Link to Order */}
          <Card variant="elevated" padding="lg" className="border-none shadow-lg shadow-brand-primary/5">
            <h2 className="font-bold text-lg text-brand-text-dark mb-6 flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-brand-primary/10 flex items-center justify-center text-brand-primary">
                <FileText className="w-5 h-5" />
              </div>
              ผูกกับออเดอร์
            </h2>

            <div className="space-y-4">
              <div className="flex gap-4 p-1.5 bg-brand-bg/50 rounded-xl border border-brand-border/30">
                <button
                  onClick={() => setLinkToOrder(false)}
                  className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-lg text-sm font-medium transition-all ${
                    !linkToOrder
                      ? "bg-white text-brand-text-dark shadow-sm ring-1 ring-black/5"
                      : "text-brand-text-light hover:text-brand-text-dark"
                  }`}
                >
                  ไม่ผูก (งานอิสระ)
                </button>
                <button
                  onClick={() => setLinkToOrder(true)}
                  className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-lg text-sm font-medium transition-all ${
                    linkToOrder
                      ? "bg-white text-brand-text-dark shadow-sm ring-1 ring-black/5"
                      : "text-brand-text-light hover:text-brand-text-dark"
                  }`}
                >
                  ผูกกับออเดอร์
                </button>
              </div>

              {linkToOrder && (
                <Select
                  label="เลือกออเดอร์"
                  value={selectedOrderId}
                  onChange={(e) => setSelectedOrderId(e.target.value)}
                  options={[
                    { value: "", label: "-- เลือกออเดอร์ --" },
                    ...pendingOrders.map((o) => ({
                      value: o.id,
                      label: `${o.orderNumber} - ${o.customer.name} (฿${o.total.toLocaleString()})`,
                    })),
                  ]}
                  className="rounded-xl"
                />
              )}

              {!linkToOrder && (
                <div className="p-4 bg-brand-info/5 border border-brand-info/20 rounded-xl">
                  <p className="text-sm text-brand-text-dark flex items-start gap-2">
                    <AlertCircle className="w-5 h-5 text-brand-info shrink-0 mt-0.5" />
                    <span>
                      งานอิสระไม่ผูกกับออเดอร์ใดๆ เหมาะสำหรับงานที่รับมาจากช่องทางอื่น หรือต้องการสร้างงานสำรองไว้
                    </span>
                  </p>
                </div>
              )}
            </div>
          </Card>

          {/* Job Details */}
          <Card variant="elevated" padding="lg" className="border-none shadow-lg shadow-brand-primary/5">
            <h2 className="font-bold text-lg text-brand-text-dark mb-6 flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-brand-secondary flex items-center justify-center text-brand-primary">
                <Target className="w-5 h-5" />
              </div>
              รายละเอียดงาน
            </h2>

            <div className="space-y-6">
              {/* Platform Selection */}
              <div>
                <label className="block text-sm font-bold text-brand-text-dark mb-3">
                  แพลตฟอร์ม
                </label>
                <div className="grid grid-cols-5 gap-3">
                  {platforms.map((platform) => (
                    <button
                      key={platform.value}
                      onClick={() => setSelectedPlatform(platform.value)}
                      className={`p-4 rounded-xl border-2 transition-all flex flex-col items-center gap-2 ${
                        selectedPlatform === platform.value
                          ? "border-brand-primary bg-brand-primary/5 shadow-lg shadow-brand-primary/10"
                          : "border-brand-border hover:border-brand-primary/50 bg-white"
                      }`}
                    >
                      <span className="text-2xl">{platform.icon}</span>
                      <span className="text-xs font-medium text-brand-text-dark">
                        {platform.label}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Job Type Selection */}
              <div>
                <label className="block text-sm font-bold text-brand-text-dark mb-3">
                  ประเภทงาน
                </label>
                <div className="grid grid-cols-5 gap-3">
                  {jobTypes.map((type) => (
                    <button
                      key={type.value}
                      onClick={() => setSelectedType(type.value)}
                      className={`p-4 rounded-xl border-2 transition-all flex flex-col items-center gap-2 ${
                        selectedType === type.value
                          ? "border-brand-primary bg-brand-primary/5 shadow-lg shadow-brand-primary/10"
                          : "border-brand-border hover:border-brand-primary/50 bg-white"
                      }`}
                    >
                      <span
                        className={
                          selectedType === type.value
                            ? "text-brand-primary"
                            : "text-brand-text-light"
                        }
                      >
                        {type.icon}
                      </span>
                      <span className="text-xs font-medium text-brand-text-dark">
                        {type.label}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Target URL */}
              <Input
                label="ลิงก์เป้าหมาย *"
                placeholder="https://facebook.com/post/xxx หรือ https://instagram.com/p/xxx"
                value={targetUrl}
                onChange={(e) => setTargetUrl(e.target.value)}
                leftIcon={<LinkIcon className="w-4 h-4 text-brand-text-light" />}
                className="rounded-xl"
              />

              {/* Quantity & Price */}
              <div className="grid sm:grid-cols-2 gap-5">
                <Input
                  label="จำนวนที่ต้องการ *"
                  type="number"
                  placeholder="500"
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                  leftIcon={<Target className="w-4 h-4 text-brand-text-light" />}
                  className="rounded-xl"
                />
                <Input
                  label="ค่าจ้างต่อหน่วย (บาท) *"
                  type="number"
                  step="0.01"
                  placeholder="0.20"
                  value={pricePerUnit}
                  onChange={(e) => setPricePerUnit(e.target.value)}
                  leftIcon={<DollarSign className="w-4 h-4 text-brand-text-light" />}
                  className="rounded-xl"
                />
              </div>

              {/* Deadline */}
              <div className="grid sm:grid-cols-2 gap-5">
                <Input
                  label="วันที่ปิดรับ"
                  type="date"
                  value={deadline}
                  onChange={(e) => setDeadline(e.target.value)}
                  leftIcon={<Calendar className="w-4 h-4 text-brand-text-light" />}
                  className="rounded-xl"
                />
                <Input
                  label="เวลาปิดรับ"
                  type="time"
                  value={deadlineTime}
                  onChange={(e) => setDeadlineTime(e.target.value)}
                  leftIcon={<Clock className="w-4 h-4 text-brand-text-light" />}
                  className="rounded-xl"
                />
              </div>

              {/* Comment Templates (if comment type) */}
              {selectedType === "comment" && (
                <Textarea
                  label="ข้อความเม้น (บรรทัดละ 1 เม้น)"
                  placeholder="สินค้าดีมากครับ&#10;แนะนำเลยค่ะ&#10;ชอบมากๆ"
                  value={commentTemplates}
                  onChange={(e) => setCommentTemplates(e.target.value)}
                  rows={4}
                  className="rounded-xl font-mono text-sm"
                />
              )}
            </div>
          </Card>

          {/* Visibility & Requirements */}
          <Card variant="elevated" padding="lg" className="border-none shadow-lg shadow-brand-primary/5">
            <h2 className="font-bold text-lg text-brand-text-dark mb-6 flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#E6F4EA] flex items-center justify-center text-[#1E8E3E]">
                <Shield className="w-5 h-5" />
              </div>
              ใครจองงานได้บ้าง
            </h2>

            <div className="space-y-6">
              {/* Visibility */}
              <div>
                <label className="block text-sm font-bold text-brand-text-dark mb-3">
                  กลุ่มที่จองงานได้
                </label>
                <div className="grid sm:grid-cols-3 gap-3">
                  {visibilityOptions.map((option) => (
                    <button
                      key={option.value}
                      onClick={() => setVisibility(option.value)}
                      className={`p-4 rounded-xl border-2 transition-all flex items-center gap-3 ${
                        visibility === option.value
                          ? "border-brand-primary bg-brand-primary/5 shadow-lg shadow-brand-primary/10"
                          : "border-brand-border hover:border-brand-primary/50 bg-white"
                      }`}
                    >
                      <span
                        className={
                          visibility === option.value
                            ? "text-brand-primary"
                            : "text-brand-text-light"
                        }
                      >
                        {option.icon}
                      </span>
                      <span className="text-sm font-medium text-brand-text-dark">
                        {option.label}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Level Required */}
              {visibility === "level_required" && (
                <Select
                  label="ระดับขั้นต่ำ"
                  value={minLevel}
                  onChange={(e) => setMinLevel(e.target.value as WorkerLevel)}
                  options={levelOptions}
                  className="rounded-xl"
                />
              )}

              {/* Requirements */}
              <Textarea
                label="เงื่อนไข/ข้อกำหนด"
                placeholder="• แอคจริงหน้าคน ไม่เอาโปรไฟล์การ์ตูน&#10;• แคปหลักฐานทุกงาน&#10;• ห้ามใช้บอท"
                value={requirements}
                onChange={(e) => setRequirements(e.target.value)}
                rows={4}
                className="rounded-xl"
              />
            </div>
          </Card>
        </div>

        {/* Sidebar - Summary */}
        <div className="lg:col-span-1">
          <div className="sticky top-24 space-y-6">
            {/* Job Summary */}
            <Card variant="elevated" padding="lg" className="border-none shadow-xl shadow-brand-primary/10">
              <h2 className="font-bold text-lg text-brand-text-dark mb-6 flex items-center gap-3">
                <Sparkles className="w-5 h-5 text-brand-warning" />
                สรุปงาน
              </h2>

              <div className="space-y-4">
                {/* Platform & Type */}
                <div className="flex items-center gap-3 p-4 bg-brand-bg/30 rounded-xl border border-brand-border/30">
                  <PlatformIcon platform={selectedPlatform} size="lg" />
                  <div>
                    <p className="font-bold text-brand-text-dark">
                      {platforms.find((p) => p.value === selectedPlatform)?.label}
                    </p>
                    <p className="text-sm text-brand-text-light">
                      {jobTypes.find((t) => t.value === selectedType)?.label}
                    </p>
                  </div>
                </div>

                {/* Stats */}
                <div className="space-y-3 py-4 border-t border-b border-brand-border/50">
                  <div className="flex justify-between text-sm">
                    <span className="text-brand-text-light">จำนวน</span>
                    <span className="font-bold text-brand-text-dark">
                      {quantity ? parseInt(quantity).toLocaleString() : "-"} หน่วย
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-brand-text-light">ค่าจ้าง/หน่วย</span>
                    <span className="font-bold text-brand-text-dark">
                      {pricePerUnit ? `฿${parseFloat(pricePerUnit).toFixed(2)}` : "-"}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-brand-text-light">ผู้จองงานได้</span>
                    <span className="font-bold text-brand-text-dark">
                      {visibilityOptions.find((v) => v.value === visibility)?.label}
                    </span>
                  </div>
                  {deadline && (
                    <div className="flex justify-between text-sm">
                      <span className="text-brand-text-light">ปิดรับ</span>
                      <span className="font-bold text-brand-text-dark">
                        {new Date(deadline).toLocaleDateString("th-TH", {
                          day: "numeric",
                          month: "short",
                        })}{" "}
                        {deadlineTime}
                      </span>
                    </div>
                  )}
                </div>

                {/* Total Budget */}
                <div className="p-4 bg-brand-primary/5 rounded-xl border border-brand-primary/20">
                  <div className="flex justify-between items-center">
                    <span className="text-brand-text-light font-medium">งบประมาณรวม</span>
                    <span className="text-2xl font-bold text-brand-primary">
                      {formatCurrency(totalBudget)}
                    </span>
                  </div>
                  <p className="text-xs text-brand-text-light mt-1">
                    {quantity || 0} x ฿{pricePerUnit || 0}
                  </p>
                </div>

                {/* Submit Button */}
                <Button
                  onClick={handleSubmit}
                  disabled={isSubmitting || !targetUrl || !quantity || !pricePerUnit}
                  className="w-full mt-2 h-12 text-base rounded-xl shadow-lg shadow-brand-primary/20 hover:shadow-xl hover:-translate-y-0.5 transition-all"
                  size="lg"
                >
                  {isSubmitting ? (
                    "กำลังสร้าง..."
                  ) : (
                    <>
                      <CheckCircle2 className="w-5 h-5 mr-2" />
                      สร้างงาน
                    </>
                  )}
                </Button>

                {(!targetUrl || !quantity || !pricePerUnit) && (
                  <p className="text-xs text-center text-brand-error/80 bg-brand-error/5 py-2 rounded-lg">
                    * กรุณากรอกข้อมูลที่จำเป็นให้ครบ
                  </p>
                )}
              </div>
            </Card>

            {/* Tips */}
            <Card variant="bordered" padding="md" className="bg-[#E8F0FE] border border-[#D2E3FC]">
              <div className="flex gap-3">
                <AlertCircle className="w-5 h-5 text-[#1967D2] shrink-0 mt-0.5" />
                <div className="text-sm text-[#1967D2]">
                  <p className="font-bold mb-1">เคล็ดลับ</p>
                  <ul className="space-y-1.5 opacity-90">
                    <li>• ตั้งค่าจ้างให้เหมาะสมกับตลาด</li>
                    <li>• ระบุเงื่อนไขให้ชัดเจน</li>
                    <li>• กำหนด Deadline ที่เหมาะสม</li>
                    <li>• เลือกกลุ่ม Worker ที่เหมาะกับงาน</li>
                  </ul>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
