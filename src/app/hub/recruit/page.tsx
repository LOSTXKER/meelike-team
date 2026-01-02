"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { Card, Button, Skeleton } from "@/components/ui";
import { Container, Section } from "@/components/layout";
import { PageHeader, FilterBar, StatsGridCompact } from "@/components/shared";
import { HubPostCard } from "@/components/hub";
import { useRecruitPosts } from "@/lib/api/hooks";
import type { FilterOption } from "@/components/shared";
import {
  Users,
  Plus,
  Facebook,
  Instagram,
  Music2,
  PlayCircle,
  Heart,
} from "lucide-react";

type PlatformFilter = "all" | "facebook" | "instagram" | "tiktok";

const platformFilters: FilterOption<PlatformFilter>[] = [
  { key: "all", label: "ทั้งหมด" },
  { key: "facebook", label: "Facebook", icon: <Facebook className="w-4 h-4" /> },
  { key: "instagram", label: "Instagram", icon: <Instagram className="w-4 h-4" /> },
  { key: "tiktok", label: "TikTok", icon: <Music2 className="w-4 h-4" /> },
];

export default function RecruitPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterPlatform, setFilterPlatform] = useState<PlatformFilter>("all");

  // Use API hook instead of direct mock data import
  const { data: recruitPosts, isLoading } = useRecruitPosts();

  const filteredPosts = useMemo(() => {
    if (!recruitPosts) return [];
    return recruitPosts.filter((post) => {
      const matchSearch =
        post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchPlatform =
        filterPlatform === "all" || post.platforms.includes(filterPlatform);
      return matchSearch && matchPlatform;
    });
  }, [recruitPosts, searchQuery, filterPlatform]);

  // Stats data
  const stats = useMemo(() => [
    {
      label: "โพสต์รับสมัคร",
      value: recruitPosts?.length || 0,
      icon: Users,
      iconColor: "text-brand-primary",
      iconBgColor: "bg-brand-primary/10",
    },
    {
      label: "ตำแหน่งว่าง",
      value: recruitPosts?.reduce((sum, p) => sum + (p.openSlots || 0), 0) || 0,
      icon: PlayCircle,
      iconColor: "text-brand-success",
      iconBgColor: "bg-brand-success/10",
    },
    {
      label: "ผู้สมัครทั้งหมด",
      value: recruitPosts?.reduce((sum, p) => sum + (p.applicants || 0), 0) || 0,
      icon: Heart,
      iconColor: "text-brand-warning",
      iconBgColor: "bg-brand-warning/10",
    },
  ], [recruitPosts]);

  return (
    <Container size="xl">
      <Section spacing="md">
        {/* Header */}
        <PageHeader
          title="หาลูกทีม"
          description="ประกาศรับสมัคร Worker เข้าทีมของคุณ"
          icon={Users}
          action={
            <Link href="/hub/post/new?type=recruit">
              <Button leftIcon={<Plus className="w-4 h-4" />}>โพสต์หาลูกทีม</Button>
            </Link>
        }
      />

      {/* Stats */}
      {isLoading ? (
        <div className="grid grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-[80px] rounded-xl" />
          ))}
        </div>
      ) : (
        <StatsGridCompact stats={stats} columns={3} />
      )}

      {/* Filters */}
      <FilterBar
        filters={platformFilters}
        activeFilter={filterPlatform}
        onFilterChange={setFilterPlatform}
        searchValue={searchQuery}
        onSearchChange={setSearchQuery}
        searchPlaceholder="ค้นหาทีม..."
      />

      {/* Posts */}
      {isLoading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-[280px] rounded-xl" />
          ))}
        </div>
      ) : (
        <div className="space-y-4">
          {filteredPosts.map((post) => (
            <HubPostCard
              key={post.id}
              post={post}
            />
          ))}
        </div>
      )}

        {!isLoading && filteredPosts.length === 0 && (
          <Card variant="bordered" padding="lg" className="text-center py-12">
            <Users className="w-12 h-12 text-brand-text-light mx-auto mb-4" />
            <p className="text-lg font-bold text-brand-text-dark mb-1">ไม่พบโพสต์ที่ตรงกัน</p>
            <p className="text-brand-text-light">ลองเปลี่ยนตัวกรองหรือคำค้นหา</p>
          </Card>
        )}
      </Section>
    </Container>
  );
}
