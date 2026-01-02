"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Card, Badge, Button, Skeleton } from "@/components/ui";
import { Container, Section } from "@/components/layout";
import { PageHeader, PlatformIcon, FilterBar, StatsGridCompact } from "@/components/shared";
import type { FilterOption } from "@/components/shared";
import { useFindTeamPosts } from "@/lib/api/hooks";
import { getLevelColor } from "@/lib/mock-data/helpers";
import type { Platform } from "@/types";
import {
  Search,
  Plus,
  Heart,
  MessageCircle,
  Eye,
  Award,
  Calendar,
  Trophy,
  Medal,
  Sparkles,
  Star,
  User,
  CheckCircle2,
  ChevronRight,
} from "lucide-react";

type LevelFilter = "all" | "Platinum" | "Gold" | "Silver" | "Bronze" | "New";

const levelFilters: FilterOption<LevelFilter>[] = [
  { key: "all", label: "ทั้งหมด" },
  { key: "Platinum", label: "Platinum", icon: <Trophy className="w-4 h-4 text-purple-500" /> },
  { key: "Gold", label: "Gold", icon: <Medal className="w-4 h-4 text-yellow-500" /> },
  { key: "Silver", label: "Silver", icon: <Medal className="w-4 h-4 text-gray-400" /> },
  { key: "New", label: "มือใหม่", icon: <Sparkles className="w-4 h-4 text-blue-500" /> },
];

export default function FindTeamPage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [filterLevel, setFilterLevel] = useState<LevelFilter>("all");

  // Use API hook instead of direct mock data import
  const { data: findTeamPosts, isLoading } = useFindTeamPosts();

  const filteredPosts = useMemo(() => {
    if (!findTeamPosts) return [];
    return findTeamPosts.filter((post) => {
      const matchSearch =
        post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchLevel =
        filterLevel === "all" || post.author.level === filterLevel;
      return matchSearch && matchLevel;
    });
  }, [findTeamPosts, searchQuery, filterLevel]);

  // Stats data
  const stats = useMemo(() => [
    {
      label: "Worker หาทีม",
      value: findTeamPosts?.length || 0,
      icon: User,
      iconColor: "text-brand-info",
      iconBgColor: "bg-brand-info/10",
    },
    {
      label: "Top Worker",
      value: findTeamPosts?.filter((p) => p.isTopWorker).length || 0,
      icon: Trophy,
      iconColor: "text-brand-warning",
      iconBgColor: "bg-brand-warning/10",
    },
    {
      label: "งานที่ทำแล้ว",
      value: (findTeamPosts?.reduce((sum, p) => sum + p.completedJobs, 0) || 0).toLocaleString(),
      icon: CheckCircle2,
      iconColor: "text-brand-success",
      iconBgColor: "bg-brand-success/10",
    },
  ], [findTeamPosts]);

  return (
    <Container size="xl">
      <Section spacing="md">
        {/* Header */}
        <PageHeader
          title="หาทีม"
          description="Worker ที่กำลังหาทีมเข้าร่วม"
          icon={Search}
          iconClassName="text-brand-info"
          action={
            <Link href="/hub/post/new?type=find-team">
              <Button leftIcon={<Plus className="w-4 h-4" />}>โพสต์หาทีม</Button>
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
        filters={levelFilters}
        activeFilter={filterLevel}
        onFilterChange={setFilterLevel}
        searchValue={searchQuery}
        onSearchChange={setSearchQuery}
        searchPlaceholder="ค้นหา Worker..."
      />

      {/* Posts */}
      {isLoading ? (
        <div className="grid md:grid-cols-2 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-[350px] rounded-xl" />
          ))}
        </div>
      ) : (
        <div className="grid md:grid-cols-2 gap-4">
          {filteredPosts.map((post) => (
            <Card 
              key={post.id} 
              variant="hoverable" 
              padding="lg"
              className="cursor-pointer"
              onClick={() => router.push(`/hub/post/${post.id}`)}
            >
              <div className="space-y-4">
                {/* Header */}
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <div className="w-14 h-14 bg-brand-info/10 rounded-full flex items-center justify-center text-xl font-bold text-brand-info">
                        {post.author.avatar}
                      </div>
                      {post.isTopWorker && (
                        <div className="absolute -top-1 -right-1 w-6 h-6 bg-brand-warning rounded-full flex items-center justify-center">
                          <Award className="w-4 h-4 text-white" />
                        </div>
                      )}
                    </div>
                    <div>
                      <p className="font-semibold text-brand-text-dark">
                        {post.author.name}
                      </p>
                      <div className="flex items-center gap-2 text-sm">
                        <span className={`px-2 py-0.5 rounded-full text-xs ${getLevelColor(post.author.level)}`}>
                          {post.author.level}
                        </span>
                        {post.author.rating > 0 && (
                          <span className="flex items-center gap-1 text-brand-text-light">
                            <Star className="w-3 h-3 text-brand-warning" />
                            {post.author.rating}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-brand-success">{post.expectedPay}</p>
                    <p className="text-xs text-brand-text-light">ค่าจ้างที่ต้องการ</p>
                  </div>
                </div>

                {/* Title */}
                <h3 className="font-semibold text-brand-text-dark">
                  {post.title}
                </h3>

                {/* Description */}
                <p className="text-brand-text-light text-sm line-clamp-2">
                  {post.description}
                </p>

                {/* Stats */}
                <div className="grid grid-cols-3 gap-2 text-sm">
                  <div className="p-2 bg-brand-bg rounded text-center">
                    <p className="font-bold text-brand-text-dark">
                      {post.completedJobs.toLocaleString()}
                    </p>
                    <p className="text-xs text-brand-text-light">งานที่ทำ</p>
                  </div>
                  <div className="p-2 bg-brand-bg rounded text-center">
                    <p className="font-bold text-brand-success">
                      {post.completionRate}%
                    </p>
                    <p className="text-xs text-brand-text-light">อัตราสำเร็จ</p>
                  </div>
                  <div className="p-2 bg-brand-bg rounded text-center">
                    <p className="font-bold text-brand-text-dark">
                      {post.experience}
                    </p>
                    <p className="text-xs text-brand-text-light">ประสบการณ์</p>
                  </div>
                </div>

                {/* Platforms & Skills */}
                <div className="space-y-2">
                  <div className="flex flex-wrap gap-1">
                    {post.platforms.map((platform) => (
                      <span
                        key={platform}
                        className="px-2 py-1 bg-brand-primary/10 rounded text-xs text-brand-primary flex items-center gap-1"
                      >
                        <PlatformIcon platform={platform as Platform} className="w-4 h-4" />
                        <span>{platform}</span>
                      </span>
                    ))}
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {post.skills.map((skill) => (
                      <span
                        key={skill}
                        className="px-2 py-1 bg-brand-bg rounded text-xs text-brand-text-light"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Availability */}
                <div className="flex items-center gap-2 text-sm text-brand-text-light">
                  <Calendar className="w-4 h-4" />
                  <span>{post.availability}</span>
                </div>

                {/* Footer */}
                <div className="flex items-center justify-between pt-3 border-t border-brand-border">
                  <div className="flex items-center gap-3 text-sm text-brand-text-light">
                    <span className="flex items-center gap-1">
                      <Eye className="w-4 h-4" />
                      {post.views}
                    </span>
                    <span className="flex items-center gap-1">
                      <Heart className="w-4 h-4" />
                      {post.interested} สนใจ
                    </span>
                  </div>
                  <Button 
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      router.push(`/hub/post/${post.id}?action=contact`);
                    }}
                  >
                    <MessageCircle className="w-4 h-4 mr-1" />
                    ติดต่อ
                    <ChevronRight className="w-3 h-3 ml-1" />
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

        {!isLoading && filteredPosts.length === 0 && (
          <Card variant="bordered" padding="lg" className="text-center py-12">
            <User className="w-12 h-12 text-brand-text-light mx-auto mb-4" />
            <p className="text-lg font-bold text-brand-text-dark mb-1">ไม่พบ Worker ที่ตรงกัน</p>
            <p className="text-brand-text-light">ลองเปลี่ยน Level หรือคำค้นหา</p>
          </Card>
        )}
      </Section>
    </Container>
  );
}
