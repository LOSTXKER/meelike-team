"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Card, Badge, Button, Input, Textarea, Select, Switch } from "@/components/ui";
import { Breadcrumb, PlatformIcon } from "@/components/shared";
import { useSellerTeamById } from "@/lib/api/hooks";
import { api } from "@/lib/api";
import type { Platform, ServiceType } from "@/types";
import {
  ArrowLeft,
  Plus,
  Target,
  DollarSign,
  Calendar,
  FileText,
  Link as LinkIcon,
  Zap,
  AlertTriangle,
  CheckCircle2,
  MessageSquare,
} from "lucide-react";
import { useToast } from "@/components/ui/toast";

const PLATFORMS: { value: Platform; label: string }[] = [
  { value: "facebook", label: "Facebook" },
  { value: "instagram", label: "Instagram" },
  { value: "tiktok", label: "TikTok" },
  { value: "youtube", label: "YouTube" },
  { value: "twitter", label: "Twitter/X" },
];

const SERVICE_TYPES: { value: ServiceType; label: string; icon: string }[] = [
  { value: "like", label: "Like / ถูกใจ", icon: "❤️" },
  { value: "comment", label: "Comment / ความคิดเห็น", icon: "💬" },
  { value: "follow", label: "Follow / ติดตาม", icon: "👤" },
  { value: "share", label: "Share / แชร์", icon: "🔄" },
  { value: "view", label: "View / ยอดวิว", icon: "👁️" },
];

export default function CreateJobPage() {
  const params = useParams();
  const router = useRouter();
  const teamId = params.id as string;

  const toast = useToast();

  const { data: team, isLoading: isLoadingTeam } = useSellerTeamById(teamId);

  // Form state
  const [title, setTitle] = useState("");
  const [platform, setPlatform] = useState<Platform>("facebook");
  const [serviceType, setServiceType] = useState<ServiceType>("like");
  const [targetUrl, setTargetUrl] = useState("");
  const [quantity, setQuantity] = useState("");
  const [pricePerUnit, setPricePerUnit] = useState("");
  const [instructions, setInstructions] = useState("");
  const [commentTemplates, setCommentTemplates] = useState("");
  const [deadline, setDeadline] = useState("");
  const [isUrgent, setIsUrgent] = useState(false);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Calculate total payout
  const totalPayout = (parseFloat(quantity) || 0) * (parseFloat(pricePerUnit) || 0);

  // Validation
  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!targetUrl.trim()) {
      newErrors.targetUrl = "กรุณาใส่ลิงก์เป้าหมาย";
    } else if (!targetUrl.startsWith("http")) {
      newErrors.targetUrl = "ลิงก์ต้องเริ่มต้นด้วย http:// หรือ https://";
    }

    if (!quantity || parseInt(quantity) < 1) {
      newErrors.quantity = "กรุณาใส่จำนวนอย่างน้อย 1";
    }

    if (!pricePerUnit || parseFloat(pricePerUnit) <= 0) {
      newErrors.pricePerUnit = "กรุณาใส่ค่าจ้างต่อหน่วย";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setIsSubmitting(true);
    try {
      const newJob = await api.seller.createStandaloneJob(teamId, {
        title: title.trim() || undefined,
        platform,
        serviceType,
        targetUrl: targetUrl.trim(),
        quantity: parseInt(quantity),
        pricePerUnit: parseFloat(pricePerUnit),
        instructions: instructions.trim() || undefined,
        commentTemplates: serviceType === "comment" && commentTemplates.trim()
          ? commentTemplates.split("\n").filter(t => t.trim())
          : undefined,
        deadline: deadline || undefined,
        isUrgent,
      });

      toast.success("สร้างงานเรียบร้อยแล้ว!");
      router.push(`/seller/team/${teamId}/jobs/${newJob.id}`);
    } catch (error) {
      console.error("Error creating job:", error);
      toast.error("เกิดข้อผิดพลาดในการสร้างงาน");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoadingTeam) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Breadcrumb */}
      <Breadcrumb />

      {/* Header */}
      <div className="flex items-center gap-4">
        <Link href={`/seller/team/${teamId}/jobs`}>
          <Button variant="ghost" size="sm" className="gap-2">
            <ArrowLeft className="w-4 h-4" />
            กลับ
          </Button>
        </Link>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-brand-primary to-brand-accent flex items-center justify-center">
            <Plus className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-brand-text-dark">สร้างงานใหม่</h1>
            <p className="text-sm text-brand-text-light">
              สำหรับทีม {team?.name || "..."}
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Form */}
        <div className="lg:col-span-2 space-y-6">
          {/* Basic Info */}
          <Card className="p-6">
            <h2 className="text-lg font-bold text-brand-text-dark mb-4 flex items-center gap-2">
              <FileText className="w-5 h-5 text-brand-primary" />
              ข้อมูลพื้นฐาน
            </h2>

            <div className="space-y-4">
              {/* Title (Optional) */}
              <Input
                label="ชื่องาน (ไม่บังคับ)"
                placeholder="เช่น เพิ่มยอดไลค์โพสต์โปรโมท"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />

              {/* Platform & Service Type */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-brand-text-dark mb-2">
                    แพลตฟอร์ม *
                  </label>
                  <div className="relative">
                    <select
                      value={platform}
                      onChange={(e) => setPlatform(e.target.value as Platform)}
                      className="w-full p-3 pl-10 rounded-xl border border-brand-border/50 bg-white focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/20 outline-none appearance-none cursor-pointer font-medium"
                    >
                      {PLATFORMS.map((p) => (
                        <option key={p.value} value={p.value}>
                          {p.label}
                        </option>
                      ))}
                    </select>
                    <div className="absolute left-3 top-1/2 -translate-y-1/2">
                      <PlatformIcon platform={platform} size="sm" />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-brand-text-dark mb-2">
                    ประเภทบริการ *
                  </label>
                  <select
                    value={serviceType}
                    onChange={(e) => setServiceType(e.target.value as ServiceType)}
                    className="w-full p-3 rounded-xl border border-brand-border/50 bg-white focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/20 outline-none appearance-none cursor-pointer font-medium"
                  >
                    {SERVICE_TYPES.map((s) => (
                      <option key={s.value} value={s.value}>
                        {s.icon} {s.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Target URL */}
              <div>
                <Input
                  label="ลิงก์เป้าหมาย *"
                  placeholder="https://www.facebook.com/..."
                  value={targetUrl}
                  onChange={(e) => setTargetUrl(e.target.value)}
                  error={errors.targetUrl}
                  leftIcon={<LinkIcon className="w-4 h-4" />}
                />
              </div>
            </div>
          </Card>

          {/* Quantity & Pricing */}
          <Card className="p-6">
            <h2 className="text-lg font-bold text-brand-text-dark mb-4 flex items-center gap-2">
              <Target className="w-5 h-5 text-brand-primary" />
              จำนวนและค่าจ้าง
            </h2>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <Input
                  label="จำนวน (หน่วย) *"
                  type="number"
                  min="1"
                  placeholder="1000"
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                  error={errors.quantity}
                  leftIcon={<Target className="w-4 h-4" />}
                />

                <Input
                  label="ค่าจ้างต่อหน่วย (฿) *"
                  type="number"
                  min="0.01"
                  step="0.01"
                  placeholder="0.15"
                  value={pricePerUnit}
                  onChange={(e) => setPricePerUnit(e.target.value)}
                  error={errors.pricePerUnit}
                  leftIcon={<DollarSign className="w-4 h-4" />}
                />
              </div>

              {/* Total Payout Preview */}
              {quantity && pricePerUnit && (
                <div className="p-4 bg-gradient-to-r from-brand-success/10 to-brand-primary/10 rounded-xl border border-brand-success/20">
                  <div className="flex justify-between items-center">
                    <span className="text-brand-text-light font-medium">ค่าจ้างรวมทั้งหมด</span>
                    <span className="text-2xl font-bold text-brand-success">
                      ฿{totalPayout.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                    </span>
                  </div>
                </div>
              )}
            </div>
          </Card>

          {/* Instructions & Options */}
          <Card className="p-6">
            <h2 className="text-lg font-bold text-brand-text-dark mb-4 flex items-center gap-2">
              <MessageSquare className="w-5 h-5 text-brand-primary" />
              คำแนะนำและตัวเลือกเพิ่มเติม
            </h2>

            <div className="space-y-4">
              <Textarea
                label="คำแนะนำสำหรับ Worker"
                placeholder="เช่น ต้องเป็นแอคคนจริงหน้าคน, แคปหลักฐานทุกงาน..."
                value={instructions}
                onChange={(e) => setInstructions(e.target.value)}
                rows={3}
              />

              {/* Comment Templates (only for comment type) */}
              {serviceType === "comment" && (
                <Textarea
                  label="ตัวอย่างความคิดเห็น (แต่ละบรรทัดคือ 1 ตัวอย่าง)"
                  placeholder={"สินค้าดีมากครับ\nราคาถูกมาก คุ้มค่ามาก\nส่งไวมาก ประทับใจครับ"}
                  value={commentTemplates}
                  onChange={(e) => setCommentTemplates(e.target.value)}
                  rows={4}
                />
              )}

              {/* Deadline & Urgent */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-brand-text-dark mb-2">
                    กำหนดส่ง (ไม่บังคับ)
                  </label>
                  <Input
                    type="date"
                    value={deadline}
                    onChange={(e) => setDeadline(e.target.value)}
                    leftIcon={<Calendar className="w-4 h-4" />}
                  />
                </div>

                <div className="flex items-end pb-2">
                  <div className="flex items-center gap-3">
                    <Switch checked={isUrgent} onChange={setIsUrgent} />
                    <div className="flex items-center gap-2">
                      <Zap className="w-4 h-4 text-brand-warning" />
                      <span className="text-sm font-medium text-brand-text-dark">งานด่วน</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Card>

          {/* Content Warning */}
          <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl">
            <div className="flex gap-3">
              <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-bold text-amber-800">คำเตือน: กรุณาตรวจสอบเนื้อหาก่อนสร้างงาน</p>
                <p className="text-amber-700 text-sm mt-1">
                  ห้ามสร้างงานที่เกี่ยวข้องกับ:
                </p>
                <ul className="text-amber-700 text-sm mt-1 ml-4 list-disc space-y-0.5">
                  <li>เว็บพนัน, คาสิโนออนไลน์</li>
                  <li>เว็บผิดกฎหมาย, แอปเถื่อน</li>
                  <li>โฆษณาหลอกลวง, สแกม</li>
                  <li>เนื้อหาผู้ใหญ่, สื่อลามก</li>
                </ul>
                <p className="text-amber-800 text-sm mt-2 font-medium">
                  หากฝ่าฝืนจะถูกระงับบัญชีถาวรและริบเงินค้างถอนทั้งหมด
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar - Preview */}
        <div className="lg:col-span-1">
          <div className="sticky top-4 space-y-4">
            {/* Job Preview Card */}
            <Card className="p-6">
              <h3 className="font-bold text-brand-text-dark mb-4 flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-brand-primary" />
                ตัวอย่างงาน
              </h3>

              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <PlatformIcon platform={platform} size="md" />
                  <div>
                    <p className="font-medium text-brand-text-dark">
                      {title || `${PLATFORMS.find(p => p.value === platform)?.label} ${SERVICE_TYPES.find(s => s.value === serviceType)?.label.split(" / ")[0]}`}
                    </p>
                    <p className="text-xs text-brand-text-light">
                      {SERVICE_TYPES.find(s => s.value === serviceType)?.icon} {SERVICE_TYPES.find(s => s.value === serviceType)?.label}
                    </p>
                  </div>
                </div>

                {targetUrl && (
                  <div className="p-2 bg-brand-bg rounded-lg">
                    <p className="text-xs text-brand-text-light truncate">{targetUrl}</p>
                  </div>
                )}

                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div className="p-2 bg-brand-bg rounded-lg">
                    <p className="text-brand-text-light text-xs">จำนวน</p>
                    <p className="font-bold text-brand-text-dark">
                      {quantity ? parseInt(quantity).toLocaleString() : "-"}
                    </p>
                  </div>
                  <div className="p-2 bg-brand-bg rounded-lg">
                    <p className="text-brand-text-light text-xs">ค่าจ้าง/หน่วย</p>
                    <p className="font-bold text-brand-text-dark">
                      {pricePerUnit ? `฿${parseFloat(pricePerUnit).toFixed(2)}` : "-"}
                    </p>
                  </div>
                </div>

                {isUrgent && (
                  <Badge variant="warning" className="gap-1">
                    <Zap className="w-3 h-3" />
                    งานด่วน
                  </Badge>
                )}

                {deadline && (
                  <div className="flex items-center gap-2 text-sm text-brand-text-light">
                    <Calendar className="w-4 h-4" />
                    <span>กำหนดส่ง: {new Date(deadline).toLocaleDateString("th-TH")}</span>
                  </div>
                )}
              </div>
            </Card>

            {/* Action Buttons */}
            <div className="space-y-3">
              <Button
                onClick={handleSubmit}
                disabled={isSubmitting || !targetUrl || !quantity || !pricePerUnit}
                isLoading={isSubmitting}
                className="w-full shadow-md shadow-brand-primary/20"
              >
                <Plus className="w-4 h-4 mr-2" />
                สร้างงาน
              </Button>

              <Link href={`/seller/team/${teamId}/jobs`} className="block">
                <Button variant="outline" className="w-full">
                  ยกเลิก
                </Button>
              </Link>
            </div>

            {/* Total Summary */}
            {quantity && pricePerUnit && (
              <Card className="p-4 bg-gradient-to-br from-brand-primary/5 to-brand-accent/5 border-brand-primary/20">
                <div className="text-center">
                  <p className="text-sm text-brand-text-light">ค่าจ้างรวม</p>
                  <p className="text-3xl font-bold text-brand-primary">
                    ฿{totalPayout.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                  </p>
                  <p className="text-xs text-brand-text-light mt-1">
                    {parseInt(quantity).toLocaleString()} หน่วย × ฿{parseFloat(pricePerUnit).toFixed(2)}
                  </p>
                </div>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
