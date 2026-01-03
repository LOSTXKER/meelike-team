"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Card, Badge, Button } from "@/components/ui";
import { PlatformIcon } from "@/components/shared";
import type { Platform, HubPost } from "@/types";
import {
  Star,
  Clock,
  Heart,
  MessageCircle,
  Eye,
  Flame,
  Zap,
  Users,
  CheckCircle2,
  ClipboardList,
} from "lucide-react";

const postTypeConfig: Record<string, { label: string; color: "info" | "success" | "warning" }> = {
  recruit: { label: "หาลูกทีม", color: "info" },
  "find-team": { label: "หาทีม", color: "success" },
  outsource: { label: "โยนงาน", color: "warning" },
};

interface HubPostCardProps {
  post: HubPost;
  variant?: "default" | "compact";
  onContact?: () => void;
  onViewDetails?: () => void;
}

export function HubPostCard({
  post,
  variant = "default",
  onContact,
  onViewDetails,
}: HubPostCardProps) {
  const router = useRouter();
  const config = postTypeConfig[post.type];

  const handleViewDetails = () => {
    router.push(`/hub/post/${post.id}`);
  };

  const handleContact = () => {
    // For now, redirect to post detail with contact intent
    router.push(`/hub/post/${post.id}?action=contact`);
  };

  const formatPayRate = (payRate: HubPost["payRate"]) => {
    if (!payRate) return null;
    if (typeof payRate === "string") return payRate;
    return `${payRate.min}-${payRate.max} ${payRate.unit}`;
  };

  if (variant === "compact") {
    return (
      <Card
        variant="bordered"
        padding="md"
        className="hover:shadow-lg transition-shadow cursor-pointer"
        onClick={handleViewDetails}
      >
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-3 min-w-0">
            <div
              className={`w-12 h-12 rounded-xl flex items-center justify-center text-lg font-bold flex-shrink-0 ${
                post.author.type === "seller"
                  ? "bg-brand-primary text-white"
                  : "bg-brand-secondary text-brand-text-dark border border-brand-border"
              }`}
            >
              {post.author.avatar}
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <h3 className="font-semibold text-brand-text-dark truncate">
                  {post.title}
                </h3>
                {post.isHot && (
                  <Badge variant="error" size="sm">
                    <Flame className="w-3 h-3" />
                  </Badge>
                )}
              </div>
              <div className="flex items-center gap-2 text-xs text-brand-text-light mt-0.5">
                <span>{post.author.name}</span>
                {post.author.verified && (
                  <CheckCircle2 className="w-3 h-3 text-brand-success" />
                )}
                <span>•</span>
                <span className="flex items-center gap-0.5">
                  <Star className="w-3 h-3 text-brand-warning" />
                  {post.author.rating || "New"}
                </span>
              </div>
            </div>
          </div>
          <Badge variant={config.color} size="sm">
            {config.label}
          </Badge>
        </div>
      </Card>
    );
  }

  return (
    <Card
      variant="elevated"
      padding="lg"
      className="group hover:border-brand-primary/30 transition-all duration-300 cursor-pointer border border-transparent shadow-sm hover:shadow-lg"
      onClick={handleViewDetails}
    >
      <div className="space-y-5">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-4">
            <div
              className={`w-14 h-14 rounded-2xl flex items-center justify-center text-xl font-bold shadow-sm ${
                post.author.type === "seller"
                  ? "bg-brand-primary text-white"
                  : "bg-brand-secondary text-brand-text-dark border border-brand-border"
              }`}
            >
              {post.author.avatar}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <p className="font-bold text-brand-text-dark text-lg group-hover:text-brand-primary transition-colors">
                  {post.author.name}
                </p>
                {post.author.verified && (
                  <Badge variant="success" size="sm" className="px-1.5 py-0.5 text-[10px]">
                    ✓
                  </Badge>
                )}
              </div>
              <div className="flex items-center gap-3 text-xs font-medium text-brand-text-light mt-0.5">
                <span className="flex items-center gap-1 bg-brand-warning/10 text-brand-warning px-1.5 py-0.5 rounded">
                  <Star className="w-3 h-3 fill-current" />
                  {post.author.rating || "New"}
                </span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {new Date(post.createdAt).toLocaleDateString("th-TH", {
                    day: "numeric",
                    month: "short",
                  })}
                </span>
                {post.author.memberCount && (
                  <>
                    <span>•</span>
                    <span>{post.author.memberCount} สมาชิก</span>
                  </>
                )}
              </div>
            </div>
          </div>
          <div className="flex flex-col items-end gap-2">
            <Badge variant={config.color} className="shadow-sm">
              {config.label}
            </Badge>
            <div className="flex gap-1">
              {post.isHot && (
                <Badge variant="error" size="sm" className="px-1.5">
                  <Flame className="w-3 h-3" />
                </Badge>
              )}
              {post.isUrgent && (
                <Badge variant="error" size="sm" className="px-1.5">
                  <Zap className="w-3 h-3" />
                </Badge>
              )}
            </div>
          </div>
        </div>

        {/* Title & Description */}
        <div>
          <h3 className="font-bold text-brand-text-dark text-xl mb-2 line-clamp-1">
            {post.title}
          </h3>
          <p className="text-brand-text-light text-sm leading-relaxed line-clamp-2">
            {post.description}
          </p>
        </div>

        {/* Platforms */}
        <div className="flex flex-wrap items-center gap-2">
          {post.platforms.map((platform) => (
            <span
              key={platform}
              className="px-3 py-1.5 bg-brand-bg border border-brand-border/50 rounded-lg text-xs font-medium text-brand-text-dark flex items-center gap-1.5"
            >
              <PlatformIcon platform={platform as Platform} className="w-3.5 h-3.5" />
              <span className="capitalize">{platform}</span>
            </span>
          ))}
        </div>

        {/* Post Type Specific Info */}
        <div className="bg-brand-bg/50 rounded-xl p-4 border border-brand-border/30">
          {post.type === "recruit" && (
            <div className="grid grid-cols-2 gap-4">
              <div>
                <span className="text-xs text-brand-text-light block mb-1">อัตราค่าจ้าง</span>
                <span className="font-bold text-brand-success text-base">
                  {formatPayRate(post.payRate)}
                </span>
              </div>
              <div>
                <span className="text-xs text-brand-text-light block mb-1">รับเพิ่ม</span>
                <span className="font-bold text-brand-primary text-base">
                  {post.openSlots} คน
                </span>
              </div>
            </div>
          )}

          {post.type === "find-team" && (
            <div className="grid grid-cols-2 gap-4">
              <div>
                <span className="text-xs text-brand-text-light block mb-1">ประสบการณ์</span>
                <span className="font-bold text-brand-text-dark text-base">
                  {post.experience}
                </span>
              </div>
              <div>
                <span className="text-xs text-brand-text-light block mb-1">ค่าจ้างที่ต้องการ</span>
                <span className="font-bold text-brand-success text-base">
                  {post.expectedPay}
                </span>
              </div>
            </div>
          )}

          {post.type === "outsource" && (
            <div className="grid grid-cols-2 gap-4">
              <div>
                <span className="text-xs text-brand-text-light block mb-1">งบประมาณ</span>
                <span className="font-bold text-brand-success text-base">
                  {post.budget}
                </span>
              </div>
              <div>
                <span className="text-xs text-brand-text-light block mb-1">กำหนดส่ง</span>
                <span className="font-bold text-brand-error text-base">
                  {post.deadline}
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Requirements & Benefits for recruit (detailed variant) */}
        {post.type === "recruit" && post.requirements && post.benefits && (
          <div className="grid md:grid-cols-2 gap-4">
            <div className="p-3 bg-brand-bg rounded-lg">
              <p className="font-medium text-brand-text-dark mb-2 flex items-center gap-1">
                <ClipboardList className="w-4 h-4" />
                คุณสมบัติ
              </p>
              <ul className="space-y-1 text-sm text-brand-text-light">
                {post.requirements.slice(0, 3).map((req, i) => (
                  <li key={i}>• {req}</li>
                ))}
              </ul>
            </div>
            <div className="p-3 bg-brand-success/10 rounded-lg">
              <p className="font-medium text-brand-text-dark mb-2">สิ่งที่จะได้รับ</p>
              <ul className="space-y-1 text-sm text-brand-text-light">
                {post.benefits.slice(0, 3).map((benefit, i) => (
                  <li key={i}>✓ {benefit}</li>
                ))}
              </ul>
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="flex items-center justify-between pt-2">
          <div className="flex items-center gap-4 text-xs font-medium text-brand-text-light">
            <span className="flex items-center gap-1.5">
              <Eye className="w-4 h-4" />
              {post.views}
            </span>
            <span className="flex items-center gap-1.5">
              <Heart className="w-4 h-4" />
              {post.interested} สนใจ
            </span>
            {post.applicants !== undefined && (
              <span className="flex items-center gap-1.5">
                <Users className="w-4 h-4" />
                {post.applicants} สมัคร
              </span>
            )}
          </div>
          <div className="flex gap-2" onClick={(e) => e.stopPropagation()}>
            <Button variant="outline" size="sm" onClick={handleViewDetails}>
              ดูรายละเอียด
            </Button>
            <Button size="sm" className="rounded-lg font-semibold shadow-sm shadow-brand-primary/20" onClick={handleContact}>
              <MessageCircle className="w-4 h-4 mr-1.5" />
              {post.type === "recruit" ? "สมัครเข้าทีม" : "ติดต่อทันที"}
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
}
