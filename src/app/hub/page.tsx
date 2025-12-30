"use client";

import { useState } from "react";
import Link from "next/link";
import { Card, Badge, Button, Input } from "@/components/ui";
import {
  Search,
  Users,
  Briefcase,
  Star,
  MapPin,
  Clock,
  TrendingUp,
  Filter,
  ChevronRight,
  Heart,
  MessageCircle,
  Eye,
  Sparkles,
  Facebook,
  Instagram,
  Music2,
  Youtube,
  Twitter,
  Globe,
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

const getPlatformIcon = (platform: string) => {
  const iconClass = "w-4 h-4 inline-block";
  switch (platform) {
    case "facebook": 
      return <Facebook className={iconClass} />;
    case "instagram": 
      return <Instagram className={iconClass} />;
    case "tiktok": 
      return <Music2 className={iconClass} />;
    case "youtube": 
      return <Youtube className={iconClass} />;
    case "twitter":
      return <Twitter className={iconClass} />;
    default: 
      return <Globe className={iconClass} />;
  }
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
    <div className="space-y-8">
      {/* Hero Section */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-brand-primary to-brand-primary-dark p-8 text-white">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/10 rounded-full translate-y-1/2 -translate-x-1/2" />
        
        <div className="relative">
          <div className="flex items-center gap-2 mb-2">
            <Sparkles className="w-6 h-6" />
            <span className="text-white/80 text-sm">MeeLike Hub</span>
          </div>
          <h1 className="text-3xl font-bold mb-2">
            ตลาดกลางเชื่อมต่อแม่ทีมกับลูกทีม
          </h1>
          <p className="text-white/80 max-w-xl">
            ค้นหาทีมที่ใช่ หรือหาลูกทีมคุณภาพ พร้อมระบบโยนงานเมื่องานเกินรับไหว
          </p>

          {/* Quick Actions */}
          <div className="flex flex-wrap gap-3 mt-6">
            <Link href="/hub/recruit">
              <Button variant="secondary" className="bg-white text-brand-primary hover:bg-white/90">
                <Users className="w-4 h-4 mr-2" />
                โพสต์หาลูกทีม
              </Button>
            </Link>
            <Link href="/hub/find-team">
              <Button variant="outline" className="border-white text-white hover:bg-white/10">
                <Search className="w-4 h-4 mr-2" />
                โพสต์หาทีม
              </Button>
            </Link>
            <Link href="/hub/outsource">
              <Button variant="outline" className="border-white text-white hover:bg-white/10">
                <Briefcase className="w-4 h-4 mr-2" />
                โยนงาน
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <Card key={stat.label} variant="bordered" padding="md">
            <div className="flex items-center gap-3">
              <div className={`p-2 rounded-lg bg-brand-bg ${stat.color}`}>
                <stat.icon className="w-5 h-5" />
              </div>
              <div>
                <p className="text-2xl font-bold text-brand-text-dark">
                  {stat.value.toLocaleString()}
                </p>
                <p className="text-sm text-brand-text-light">{stat.label}</p>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Search & Filters */}
      <Card variant="bordered" padding="md">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <Input
              placeholder="ค้นหาโพสต์..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              leftIcon={<Search className="w-4 h-4" />}
            />
          </div>
          <div className="flex gap-2 overflow-x-auto">
            {[
              { key: "all", label: "ทั้งหมด" },
              { key: "recruit", label: "หาลูกทีม", icon: <Users className="w-4 h-4" /> },
              { key: "find-team", label: "หาทีม", icon: <Search className="w-4 h-4" /> },
              { key: "outsource", label: "โยนงาน", icon: <Briefcase className="w-4 h-4" /> },
            ].map((f) => (
              <button
                key={f.key}
                onClick={() => setFilterType(f.key as PostType)}
                className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all ${
                  filterType === f.key
                    ? "bg-brand-primary text-white"
                    : "bg-brand-bg text-brand-text-light hover:text-brand-text-dark"
                }`}
              >
                {f.icon && <span className="mr-1">{f.icon}</span>}
                {f.label}
              </button>
            ))}
          </div>
        </div>
      </Card>

      {/* Posts Grid */}
      <div className="grid md:grid-cols-2 gap-4">
        {filteredPosts.map((post) => (
          <Card
            key={post.id}
            variant="bordered"
            padding="lg"
            className="hover:shadow-lg transition-shadow cursor-pointer group"
          >
            <div className="space-y-4">
              {/* Header */}
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div
                    className={`w-12 h-12 rounded-full flex items-center justify-center text-lg font-bold ${
                      post.author.type === "seller"
                        ? "bg-brand-primary/10 text-brand-primary"
                        : "bg-brand-info/10 text-brand-info"
                    }`}
                  >
                    {post.author.avatar}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="font-medium text-brand-text-dark">
                        {post.author.name}
                      </p>
                      {post.author.verified && (
                        <Badge variant="success" size="sm">✓ ยืนยัน</Badge>
                      )}
                    </div>
                    <div className="flex items-center gap-2 text-sm text-brand-text-light">
                      <Star className="w-3 h-3 text-brand-warning" />
                      <span>{post.author.rating || "ใหม่"}</span>
                      <span>•</span>
                      <Clock className="w-3 h-3" />
                      <span>
                        {new Date(post.createdAt).toLocaleDateString("th-TH", {
                          day: "numeric",
                          month: "short",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex flex-col items-end gap-1">
                  <Badge variant={postTypeConfig[post.type].color} size="sm">
                    {postTypeConfig[post.type].label}
                  </Badge>
                  {post.isHot && (
                    <Badge variant="error" size="sm">
                      <Flame className="w-3 h-3 mr-1" />
                      Hot
                    </Badge>
                  )}
                  {post.isUrgent && (
                    <Badge variant="error" size="sm">
                      <Zap className="w-3 h-3 mr-1" />
                      ด่วน
                    </Badge>
                  )}
                </div>
              </div>

              {/* Title & Description */}
              <div>
                <h3 className="font-semibold text-brand-text-dark text-lg group-hover:text-brand-primary transition-colors">
                  {post.title}
                </h3>
                <p className="text-brand-text-light text-sm mt-1 line-clamp-2">
                  {post.description}
                </p>
              </div>

              {/* Platforms */}
              <div className="flex items-center gap-2">
                {post.platforms.map((platform) => (
                  <span
                    key={platform}
                    className="px-2 py-1 bg-brand-bg rounded text-sm flex items-center gap-1"
                  >
                    {getPlatformIcon(platform)}
                    <span>{platform}</span>
                  </span>
                ))}
              </div>

              {/* Post Type Specific Info */}
              {post.type === "recruit" && (
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div className="p-2 bg-brand-bg rounded">
                    <span className="text-brand-text-light">อัตราค่าจ้าง:</span>
                    <span className="ml-1 font-medium text-brand-success">
                      {post.payRate}
                    </span>
                  </div>
                  <div className="p-2 bg-brand-bg rounded">
                    <span className="text-brand-text-light">รับเพิ่ม:</span>
                    <span className="ml-1 font-medium text-brand-primary">
                      {post.openSlots} คน
                    </span>
                  </div>
                </div>
              )}

              {post.type === "find-team" && (
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div className="p-2 bg-brand-bg rounded">
                    <span className="text-brand-text-light">ประสบการณ์:</span>
                    <span className="ml-1 font-medium">{post.experience}</span>
                  </div>
                  <div className="p-2 bg-brand-bg rounded">
                    <span className="text-brand-text-light">ค่าจ้างที่ต้องการ:</span>
                    <span className="ml-1 font-medium text-brand-success">
                      {post.expectedPay}
                    </span>
                  </div>
                </div>
              )}

              {post.type === "outsource" && (
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div className="p-2 bg-brand-bg rounded">
                    <span className="text-brand-text-light">งบประมาณ:</span>
                    <span className="ml-1 font-medium text-brand-success">
                      {post.budget}
                    </span>
                  </div>
                  <div className="p-2 bg-brand-bg rounded">
                    <span className="text-brand-text-light">กำหนดส่ง:</span>
                    <span className="ml-1 font-medium text-brand-error">
                      {post.deadline}
                    </span>
                  </div>
                </div>
              )}

              {/* Footer */}
              <div className="flex items-center justify-between pt-3 border-t border-brand-border">
                <div className="flex items-center gap-4 text-sm text-brand-text-light">
                  <span className="flex items-center gap-1">
                    <Eye className="w-4 h-4" />
                    {post.views}
                  </span>
                  <span className="flex items-center gap-1">
                    <Heart className="w-4 h-4" />
                    {post.interested} สนใจ
                  </span>
                </div>
                <Button size="sm" variant="outline">
                  <MessageCircle className="w-4 h-4 mr-1" />
                  ติดต่อ
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

