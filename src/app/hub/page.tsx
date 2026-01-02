"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { Card, Button, Skeleton } from "@/components/ui";
import { Container, Section } from "@/components/layout";
import { FilterBar, StatsGrid } from "@/components/shared";
import { HubPostCard } from "@/components/hub";
import { useHubPosts, useHubStats } from "@/lib/api/hooks";
import type { FilterOption } from "@/components/shared";
import {
  Search,
  Users,
  Briefcase,
  TrendingUp,
  ChevronRight,
  Sparkles,
} from "lucide-react";

type PostType = "all" | "recruit" | "find-team" | "outsource";

const filterOptions: FilterOption<PostType>[] = [
  { key: "all", label: "ทั้งหมด" },
  { key: "recruit", label: "หาลูกทีม", icon: <Users className="w-4 h-4" /> },
  { key: "find-team", label: "หาทีม", icon: <Search className="w-4 h-4" /> },
  { key: "outsource", label: "โยนงาน", icon: <Briefcase className="w-4 h-4" /> },
];

const statsConfig = [
  { icon: Users, color: "text-brand-primary", iconBgColor: "bg-brand-primary/10" },
  { icon: Search, color: "text-brand-info", iconBgColor: "bg-brand-info/10" },
  { icon: Briefcase, color: "text-brand-warning", iconBgColor: "bg-brand-warning/10" },
  { icon: TrendingUp, color: "text-brand-success", iconBgColor: "bg-brand-success/10" },
];

export default function HubPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState<PostType>("all");

  // Use API hooks instead of direct mock data imports
  const { data: hubPosts, isLoading: postsLoading } = useHubPosts();
  const { data: hubStats, isLoading: statsLoading } = useHubStats();

  const filteredPosts = useMemo(() => {
    if (!hubPosts) return [];
    
    return hubPosts.filter((post) => {
      const matchSearch =
        post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchType = filterType === "all" || post.type === filterType;
      return matchSearch && matchType;
    });
  }, [hubPosts, searchQuery, filterType]);

  // Map stats with icons
  const stats = useMemo(() => {
    if (!hubStats) return [];
    return hubStats.map((stat, index) => ({
      ...stat,
      icon: statsConfig[index].icon,
      iconColor: statsConfig[index].color,
      iconBgColor: statsConfig[index].iconBgColor,
    }));
  }, [hubStats]);

  return (
    <Container size="xl">
      <Section spacing="lg" className="animate-fade-in">
      {/* Hero Section */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#8C6A54] to-[#6D5E54] p-10 text-white shadow-xl shadow-brand-primary/20">
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-black/10 rounded-full blur-2xl translate-y-1/2 -translate-x-1/2" />
        
        <div className="relative z-10 text-center max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-2 mb-4 px-3 py-1 rounded-full bg-white/10 backdrop-blur-sm border border-white/20">
            <Sparkles className="w-4 h-4 text-[#D4A373]" />
            <span className="text-white/90 text-xs font-medium uppercase tracking-wider">MeeLike ตลาดกลาง</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4 tracking-tight leading-tight">
            ตลาดกลางเชื่อมต่อ<br/>
            <span className="text-[#F4EFEA]">แม่ทีม</span> กับ <span className="text-[#D4A373]">ลูกทีม</span>
          </h1>
          <p className="text-[#E8DED5] text-lg mb-8 font-light">
            พื้นที่สำหรับหาทีมคุณภาพ หาลูกทีมขยัน หรือส่งต่องานเมื่องานล้นมือ
            <br className="hidden sm:block" /> ครบจบในที่เดียว ปลอดภัย มั่นใจได้
          </p>

          {/* Quick Actions */}
          <div className="flex flex-wrap justify-center gap-3">
            <Link href="/hub/recruit">
              <Button size="lg" className="bg-white text-brand-primary hover:bg-[#F4EFEA] border-none shadow-lg shadow-black/10">
                <Users className="w-5 h-5 mr-2" />
                โพสต์หาลูกทีม
              </Button>
            </Link>
            <Link href="/hub/find-team">
              <Button size="lg" variant="outline" className="border-white/30 text-white hover:bg-white/10 backdrop-blur-sm">
                <Search className="w-5 h-5 mr-2" />
                โพสต์หาทีม
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Stats */}
      {statsLoading ? (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-[100px] rounded-xl" />
          ))}
        </div>
      ) : (
        <StatsGrid stats={stats} columns={4} />
      )}

      {/* Filters */}
      <FilterBar
        filters={filterOptions}
        activeFilter={filterType}
        onFilterChange={setFilterType}
        searchValue={searchQuery}
        onSearchChange={setSearchQuery}
        searchPlaceholder="ค้นหาโพสต์, ชื่องาน, หรือชื่อทีม..."
      />

      {/* Posts Grid */}
      {postsLoading ? (
        <div className="grid md:grid-cols-2 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-[280px] rounded-xl" />
          ))}
        </div>
      ) : (
        <div className="grid md:grid-cols-2 gap-6">
          {filteredPosts.map((post) => (
            <HubPostCard
              key={post.id}
              post={post}
            />
          ))}
        </div>
      )}

        {/* Load More */}
        {!postsLoading && filteredPosts.length > 0 && (
          <div className="text-center">
            <Button variant="outline" size="lg">
              โหลดเพิ่มเติม
              <ChevronRight className="w-4 h-4 ml-1" />
            </Button>
          </div>
        )}
      </Section>
    </Container>
  );
}
