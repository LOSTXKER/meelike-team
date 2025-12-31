"use client";

import { useState } from "react";
import Link from "next/link";
import { Card, Badge, Button, Input } from "@/components/ui";
import { PlatformIcon } from "@/components/shared";
import type { Platform } from "@/types";
import {
  Search,
  Users,
  Briefcase,
  Star,
  Clock,
  TrendingUp,
  ChevronRight,
  Heart,
  MessageCircle,
  Eye,
  Sparkles,
  Zap,
  Flame,
} from "lucide-react";

// Mock Hub Posts
const mockPosts = [
  {
    id: "post-1",
    type: "recruit",
    title: "รับลูกทีมด่วน! ทำงาน Facebook/IG",
    author: {
      name: "JohnBoost Team",
      avatar: "J",
      rating: 4.9,
      verified: true,
      type: "seller",
    },
    description:
      "รับลูกทีมเพิ่ม 10 คน งานเยอะมาก จ่ายไวทุก 2 วัน มีงานให้ทำตลอด รับทั้งมือใหม่และมือเก่า สอนงานให้!",
    platforms: ["facebook", "instagram"],
    payRate: "0.3-1.5 บาท/งาน",
    requirements: ["มีโทรศัพท์", "ออนไลน์ได้ทุกวัน", "รับงานได้วันละ 50+"],
    benefits: ["จ่ายไวทุก 2 วัน", "โบนัสท้ายเดือน", "สอนงานฟรี"],
    memberCount: 45,
    openSlots: 10,
    views: 234,
    interested: 18,
    createdAt: new Date(Date.now() - 3600000).toISOString(),
    isHot: true,
  },
  {
    id: "post-2",
    type: "find-team",
    title: "หาทีมค่ะ ทำงานมา 6 เดือน Rating 4.8",
    author: {
      name: "น้องมิ้นท์",
      avatar: "ม",
      rating: 4.8,
      verified: false,
      type: "worker",
    },
    description:
      "เคยทำงานกับทีมมาก่อน 6 เดือน งาน Facebook/IG/TikTok ได้หมด ทำงานได้วันละ 100+ งาน ต้องการทีมที่จ่ายตรงเวลา",
    platforms: ["facebook", "instagram", "tiktok"],
    experience: "6 เดือน",
    completedJobs: 1250,
    expectedPay: "0.5+ บาท/งาน",
    availability: "ทุกวัน 09:00-22:00",
    views: 156,
    interested: 8,
    createdAt: new Date(Date.now() - 7200000).toISOString(),
  },
  {
    id: "post-3",
    type: "outsource",
    title: "โยนงาน IG Follow 500 คน ด่วน!",
    author: {
      name: "SocialPro",
      avatar: "S",
      rating: 4.7,
      verified: true,
      type: "seller",
    },
    description:
      "มีงาน Follow IG 500 คน ต้องการภายในวันนี้ งานเกินรับไม่ไหว ราคาคุยได้",
    platforms: ["instagram"],
    jobType: "follow",
    quantity: 500,
    budget: "200 บาท",
    deadline: "วันนี้ 20:00",
    views: 89,
    interested: 5,
    createdAt: new Date(Date.now() - 1800000).toISOString(),
    isUrgent: true,
  },
  {
    id: "post-4",
    type: "recruit",
    title: "รับสมาชิกทีมใหม่ งาน TikTok View/Like",
    author: {
      name: "TikTok Master",
      avatar: "T",
      rating: 4.6,
      verified: true,
      type: "seller",
    },
    description:
      "ทีมเปิดใหม่ รับคนเข้าทีม 20 คน เน้นงาน TikTok โดยเฉพาะ ค่าตอบแทนดี มีโบนัส",
    platforms: ["tiktok"],
    payRate: "0.1-0.5 บาท/งาน",
    requirements: ["มี TikTok", "ทำงานได้ทุกวัน"],
    benefits: ["โบนัส Top Worker", "งานเยอะ"],
    memberCount: 12,
    openSlots: 20,
    views: 178,
    interested: 22,
    createdAt: new Date(Date.now() - 14400000).toISOString(),
  },
  {
    id: "post-5",
    type: "find-team",
    title: "มือใหม่หาทีม อยากเรียนรู้งาน",
    author: {
      name: "เบส",
      avatar: "เ",
      rating: 0,
      verified: false,
      type: "worker",
    },
    description:
      "เพิ่งเริ่มต้น อยากหาทีมที่สอนงานให้ ทำงานได้ทั้งวัน มีโทรศัพท์ 2 เครื่อง",
    platforms: ["facebook", "instagram", "tiktok"],
    experience: "มือใหม่",
    availability: "Full-time",
    views: 67,
    interested: 3,
    createdAt: new Date(Date.now() - 28800000).toISOString(),
  },
  {
    id: "post-6",
    type: "outsource",
    title: "รับโยนงาน Comment FB ภาษาไทย",
    author: {
      name: "ร้านค้าออนไลน์",
      avatar: "ร",
      rating: 4.5,
      verified: false,
      type: "seller",
    },
    description:
      "มีงาน Comment Facebook ภาษาไทย 100 comment ต้องการทีมที่มี Worker คุณภาพ",
    platforms: ["facebook"],
    jobType: "comment",
    quantity: 100,
    budget: "300 บาท",
    deadline: "พรุ่งนี้ 18:00",
    views: 45,
    interested: 4,
    createdAt: new Date(Date.now() - 43200000).toISOString(),
  },
];

const stats = [
  { label: "โพสต์หาลูกทีม", value: 156, icon: Users, color: "text-brand-primary" },
  { label: "โพสต์หาทีม", value: 89, icon: Search, color: "text-brand-info" },
  { label: "งานรอโยน", value: 34, icon: Briefcase, color: "text-brand-warning" },
  { label: "จับคู่สำเร็จ", value: 1250, icon: TrendingUp, color: "text-brand-success" },
];

type PostType = "all" | "recruit" | "find-team" | "outsource";

const postTypeConfig: Record<string, { label: string; color: "info" | "success" | "warning" }> = {
  recruit: { label: "หาลูกทีม", color: "info" },
  "find-team": { label: "หาทีม", color: "success" },
  outsource: { label: "โยนงาน", color: "warning" },
};

export default function HubPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState<PostType>("all");

  const filteredPosts = mockPosts.filter((post) => {
    const matchSearch =
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchType = filterType === "all" || post.type === filterType;
    return matchSearch && matchType;
  });

  return (
    <div className="space-y-10 animate-fade-in">
      {/* Hero Section */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#8C6A54] to-[#6D5E54] p-10 text-white shadow-xl shadow-brand-primary/20">
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-black/10 rounded-full blur-2xl translate-y-1/2 -translate-x-1/2" />
        
        <div className="relative z-10 text-center max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-2 mb-4 px-3 py-1 rounded-full bg-white/10 backdrop-blur-sm border border-white/20">
            <Sparkles className="w-4 h-4 text-[#D4A373]" />
            <span className="text-white/90 text-xs font-medium uppercase tracking-wider">MeeLike Hub Center</span>
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
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
        {stats.map((stat) => (
          <Card key={stat.label} variant="elevated" padding="md" className="border-none shadow-lg shadow-brand-primary/5 hover:-translate-y-1 transition-transform">
            <div className="flex items-center gap-4">
              <div className={`p-3 rounded-xl bg-brand-bg ${stat.color.replace('text-', 'bg-').replace('primary', 'primary/10').replace('info', 'info/10').replace('warning', 'warning/10').replace('success', 'success/10')} ${stat.color}`}>
                <stat.icon className="w-6 h-6" />
              </div>
              <div>
                <p className="text-3xl font-bold text-brand-text-dark leading-none">
                  {stat.value.toLocaleString()}
                </p>
                <p className="text-sm font-medium text-brand-text-light mt-1">{stat.label}</p>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Search & Filters */}
      <div className="flex flex-col md:flex-row gap-4 items-center">
        <div className="relative flex-1 w-full group">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-brand-text-light group-focus-within:text-brand-primary transition-colors" />
          </div>
          <input
            type="text"
            className="block w-full pl-11 pr-4 py-3 bg-white border-none rounded-2xl text-brand-text-dark placeholder:text-brand-text-light/50 focus:ring-2 focus:ring-brand-primary/20 shadow-sm transition-all"
            placeholder="ค้นหาโพสต์, ชื่องาน, หรือชื่อทีม..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0 w-full md:w-auto no-scrollbar">
          {[
            { key: "all", label: "ทั้งหมด" },
            { key: "recruit", label: "หาลูกทีม", icon: <Users className="w-4 h-4" /> },
            { key: "find-team", label: "หาทีม", icon: <Search className="w-4 h-4" /> },
            { key: "outsource", label: "โยนงาน", icon: <Briefcase className="w-4 h-4" /> },
          ].map((f) => (
            <button
              key={f.key}
              onClick={() => setFilterType(f.key as PostType)}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-medium whitespace-nowrap transition-all duration-200 border ${
                filterType === f.key
                  ? "bg-brand-primary text-white border-brand-primary shadow-md shadow-brand-primary/20"
                  : "bg-white text-brand-text-light border-brand-border hover:border-brand-primary/50 hover:text-brand-text-dark"
              }`}
            >
              {f.icon}
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* Posts Grid */}
      <div className="grid md:grid-cols-2 gap-6">
        {filteredPosts.map((post) => (
          <Card
            key={post.id}
            variant="elevated"
            padding="lg"
            className="group hover:border-brand-primary/30 transition-all duration-300 cursor-pointer border border-transparent shadow-sm hover:shadow-lg"
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
                        <Badge variant="success" size="sm" className="px-1.5 py-0.5 text-[10px]">✓</Badge>
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
                    </div>
                  </div>
                </div>
                <div className="flex flex-col items-end gap-2">
                  <Badge variant={postTypeConfig[post.type].color} className="shadow-sm">
                    {postTypeConfig[post.type].label}
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

              {/* Post Type Specific Info (Highlighted Box) */}
              <div className="bg-brand-bg/50 rounded-xl p-4 border border-brand-border/30">
                {post.type === "recruit" && (
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <span className="text-xs text-brand-text-light block mb-1">อัตราค่าจ้าง</span>
                      <span className="font-bold text-brand-success text-base">
                        {post.payRate}
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
                </div>
                <Button size="sm" className="rounded-lg font-semibold shadow-sm shadow-brand-primary/20">
                  <MessageCircle className="w-4 h-4 mr-1.5" />
                  ติดต่อทันที
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Load More */}
      <div className="text-center">
        <Button variant="outline" size="lg">
          โหลดเพิ่มเติม
          <ChevronRight className="w-4 h-4 ml-1" />
        </Button>
      </div>
    </div>
  );
}

