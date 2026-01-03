"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { Card, Badge, Button, Skeleton } from "@/components/ui";
import { Container, Section } from "@/components/layout";
import { PageHeader, PlatformIcon, FilterBar, StatsGrid } from "@/components/shared";
import type { FilterOption } from "@/components/shared";
import { useOutsourceJobs } from "@/lib/api/hooks";
import { getJobTypeLabel } from "@/lib/utils";
import type { Platform } from "@/types";
import {
  Briefcase,
  Star,
  Clock,
  Plus,
  MessageCircle,
  Eye,
  DollarSign,
  CheckCircle2,
  Zap,
  Facebook,
  Instagram,
  Music2,
} from "lucide-react";

type PlatformFilter = "all" | "facebook" | "instagram" | "tiktok";

const platformFilters: FilterOption<PlatformFilter>[] = [
  { key: "all", label: "ทั้งหมด" },
  { key: "facebook", label: "Facebook", icon: <Facebook className="w-4 h-4" /> },
  { key: "instagram", label: "Instagram", icon: <Instagram className="w-4 h-4" /> },
  { key: "tiktok", label: "TikTok", icon: <Music2 className="w-4 h-4" /> },
];

const getTimeRemaining = (deadline: string) => {
  const now = new Date();
  const end = new Date(deadline);
  const diff = end.getTime() - now.getTime();
  
  if (diff <= 0) return "หมดเวลา";
  
  const hours = Math.floor(diff / (1000 * 60 * 60));
  const days = Math.floor(hours / 24);
  
  if (days > 0) return `${days} วัน`;
  return `${hours} ชม.`;
};

export default function OutsourcePage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterPlatform, setFilterPlatform] = useState<PlatformFilter>("all");

  // Use API hook instead of direct mock data import
  const { data: outsourceJobs, isLoading } = useOutsourceJobs();

  const filteredJobs = useMemo(() => {
    if (!outsourceJobs) return [];
    return outsourceJobs.filter((job) => {
      const matchSearch =
        job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        job.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchPlatform =
        filterPlatform === "all" || job.platform === filterPlatform;
      return matchSearch && matchPlatform;
    });
  }, [outsourceJobs, searchQuery, filterPlatform]);

  const totalBudget = outsourceJobs?.reduce((sum, j) => sum + j.budget, 0) || 0;
  const urgentCount = outsourceJobs?.filter((j) => j.isUrgent).length || 0;

  // Stats data
  const stats = useMemo(() => [
    {
      label: "งานรอโยน",
      value: outsourceJobs?.length || 0,
      icon: Briefcase,
      iconColor: "text-brand-warning",
      iconBgColor: "bg-brand-warning/10",
    },
    {
      label: "งานด่วน",
      value: urgentCount,
      icon: Zap,
      iconColor: "text-brand-error",
      iconBgColor: "bg-brand-error/10",
    },
    {
      label: "มูลค่ารวม",
      value: `฿${totalBudget.toLocaleString()}`,
      icon: DollarSign,
      iconColor: "text-brand-success",
      iconBgColor: "bg-brand-success/10",
    },
    {
      label: "เสนอราคาทั้งหมด",
      value: outsourceJobs?.reduce((sum, j) => sum + j.bidsCount, 0) || 0,
      icon: MessageCircle,
      iconColor: "text-brand-info",
      iconBgColor: "bg-brand-info/10",
    },
  ], [outsourceJobs, totalBudget, urgentCount]);

  return (
    <Container size="xl">
      <Section spacing="md">
        {/* Header */}
        <PageHeader
          title="โยนงาน"
          description="งานที่แม่ทีมต้องการโยนให้ทีมอื่นช่วยทำ"
          icon={Briefcase}
          iconClassName="text-brand-warning"
          action={
            <Link href="/hub/post/new?type=outsource">
              <Button leftIcon={<Plus className="w-4 h-4" />}>โพสต์โยนงาน</Button>
          </Link>
        }
      />

      {/* Stats */}
      {isLoading ? (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-[100px] rounded-xl" />
          ))}
        </div>
      ) : (
        <StatsGrid stats={stats} columns={4} />
      )}

      {/* Alert for Urgent Jobs */}
      {!isLoading && urgentCount > 0 && (
        <Card variant="bordered" padding="md" className="bg-brand-error/5 border-brand-error">
          <div className="flex items-center gap-3">
            <Zap className="w-5 h-5 text-brand-error" />
            <div>
              <p className="font-medium text-brand-text-dark">
                มี {urgentCount} งานด่วน!
              </p>
              <p className="text-sm text-brand-text-light">
                งานเหล่านี้ต้องการส่งภายในไม่กี่ชั่วโมง
              </p>
            </div>
          </div>
        </Card>
      )}

      {/* Filters */}
      <FilterBar
        filters={platformFilters}
        activeFilter={filterPlatform}
        onFilterChange={setFilterPlatform}
        searchValue={searchQuery}
        onSearchChange={setSearchQuery}
        searchPlaceholder="ค้นหางาน..."
      />

      {/* Jobs List */}
      {isLoading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-[320px] rounded-xl" />
          ))}
        </div>
      ) : (
        <div className="space-y-4">
          {filteredJobs.map((job) => (
            <Card key={job.id} variant="hoverable" padding="lg">
              <div className="space-y-4">
                {/* Header */}
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-brand-warning/10 rounded-lg flex items-center justify-center text-lg font-bold text-brand-warning">
                      {job.author.avatar}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold text-brand-text-dark text-lg">
                          {job.title}
                        </h3>
                        {job.isUrgent && (
                          <Badge variant="error" size="sm">
                            <Zap className="w-3 h-3 mr-1" />
                            ด่วน
                          </Badge>
                        )}
                      </div>
                      <div className="flex items-center gap-3 text-sm text-brand-text-light mt-1">
                        <span className="flex items-center gap-1">
                          {job.author.name}
                          {job.author.verified && (
                            <CheckCircle2 className="w-4 h-4 text-brand-success" />
                          )}
                        </span>
                        <span>•</span>
                        <span className="flex items-center gap-1">
                          <Star className="w-3 h-3 text-brand-warning" />
                          {job.author.rating}
                        </span>
                        <span>•</span>
                        <span>โยนงานแล้ว {job.author.totalOutsourced} ครั้ง</span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-brand-success">
                      ฿{job.budget.toLocaleString()}
                    </p>
                    <p className="text-xs text-brand-text-light">
                      (฿{job.suggestedPricePerUnit}/{getJobTypeLabel(job.jobType)})
                    </p>
                  </div>
                </div>

                {/* Description */}
                <p className="text-brand-text-light">{job.description}</p>

                {/* Job Details */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  <div className="p-3 bg-brand-bg rounded-lg">
                    <p className="text-xs text-brand-text-light">Platform</p>
                    <p className="font-medium text-brand-text-dark flex items-center gap-1">
                      <PlatformIcon platform={job.platform as Platform} className="w-4 h-4" />
                      <span>{job.platform}</span>
                    </p>
                  </div>
                  <div className="p-3 bg-brand-bg rounded-lg">
                    <p className="text-xs text-brand-text-light">ประเภทงาน</p>
                    <p className="font-medium text-brand-text-dark">
                      {getJobTypeLabel(job.jobType)}
                    </p>
                  </div>
                  <div className="p-3 bg-brand-bg rounded-lg">
                    <p className="text-xs text-brand-text-light">จำนวน</p>
                    <p className="font-medium text-brand-text-dark">
                      {job.quantity.toLocaleString()}
                    </p>
                  </div>
                  <div className={`p-3 rounded-lg ${
                    getTimeRemaining(job.deadline).includes("ชม") 
                      ? "bg-brand-error/10" 
                      : "bg-brand-bg"
                  }`}>
                    <p className="text-xs text-brand-text-light">กำหนดส่ง</p>
                    <p className={`font-medium ${
                      getTimeRemaining(job.deadline).includes("ชม")
                        ? "text-brand-error"
                        : "text-brand-text-dark"
                    }`}>
                      <Clock className="w-3 h-3 inline mr-1" />
                      {getTimeRemaining(job.deadline)}
                    </p>
                  </div>
                </div>

                {/* Requirements */}
                <div className="flex flex-wrap gap-2">
                  {job.requirements.map((req, i) => (
                    <span
                      key={i}
                      className="px-2 py-1 bg-brand-info/10 text-brand-info rounded text-xs"
                    >
                      ✓ {req}
                    </span>
                  ))}
                </div>

                {/* Footer */}
                <div className="flex items-center justify-between pt-4 border-t border-brand-border">
                  <div className="flex items-center gap-4 text-sm text-brand-text-light">
                    <span className="flex items-center gap-1">
                      <Eye className="w-4 h-4" />
                      {job.views} เข้าชม
                    </span>
                    <span className="flex items-center gap-1">
                      <MessageCircle className="w-4 h-4" />
                      {job.bidsCount} เสนอราคา
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      {new Date(job.createdAt).toLocaleDateString("th-TH", {
                        day: "numeric",
                        month: "short",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">
                      ดูรายละเอียด
                    </Button>
                    <Button size="sm">
                      <DollarSign className="w-4 h-4 mr-1" />
                      เสนอจองงาน
                    </Button>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

        {!isLoading && filteredJobs.length === 0 && (
          <Card variant="bordered" padding="lg" className="text-center py-12">
            <Briefcase className="w-12 h-12 text-brand-text-light mx-auto mb-4" />
            <p className="text-lg font-bold text-brand-text-dark mb-1">ไม่พบงานที่ตรงกัน</p>
            <p className="text-brand-text-light">ลองเปลี่ยน Platform หรือคำค้นหา</p>
          </Card>
        )}
      </Section>
    </Container>
  );
}
