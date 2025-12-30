"use client";

import { useState } from "react";
import Link from "next/link";
import { Card, Badge, Button, Input } from "@/components/ui";
import {
  Search,
  Users,
  Star,
  Clock,
  Filter,
  Plus,
  Heart,
  MessageCircle,
  Eye,
  MapPin,
  DollarSign,
  CheckCircle2,
  Facebook,
  Instagram,
  Music2,
  Youtube,
  Flame,
} from "lucide-react";

// Mock recruit posts
const recruitPosts = [
  {
    id: "recruit-1",
    title: "รับลูกทีมด่วน! ทำงาน Facebook/IG",
    author: {
      name: "JohnBoost Team",
      avatar: "J",
      rating: 4.9,
      verified: true,
      memberCount: 45,
      totalPaid: 125000,
    },
    description:
      "รับลูกทีมเพิ่ม 10 คน งานเยอะมาก จ่ายไวทุก 2 วัน มีงานให้ทำตลอด รับทั้งมือใหม่และมือเก่า สอนงานให้!",
    platforms: ["facebook", "instagram"],
    payRate: { min: 0.3, max: 1.5, unit: "บาท/งาน" },
    requirements: ["มีโทรศัพท์", "ออนไลน์ได้ทุกวัน", "รับงานได้วันละ 50+"],
    benefits: ["จ่ายไวทุก 2 วัน", "โบนัสท้ายเดือน", "สอนงานฟรี", "กลุ่ม Line สำหรับสมาชิก"],
    openSlots: 10,
    applicants: 18,
    views: 234,
    createdAt: new Date(Date.now() - 3600000).toISOString(),
    isHot: true,
  },
  {
    id: "recruit-2",
    title: "รับสมาชิกทีมใหม่ งาน TikTok View/Like",
    author: {
      name: "TikTok Master",
      avatar: "T",
      rating: 4.6,
      verified: true,
      memberCount: 32,
      totalPaid: 85000,
    },
    description:
      "ทีมเปิดใหม่ รับคนเข้าทีม 20 คน เน้นงาน TikTok โดยเฉพาะ ค่าตอบแทนดี มีโบนัส Top Worker ทุกเดือน",
    platforms: ["tiktok"],
    payRate: { min: 0.1, max: 0.5, unit: "บาท/งาน" },
    requirements: ["มี TikTok", "ทำงานได้ทุกวัน", "รับงานได้ 100+/วัน"],
    benefits: ["โบนัส Top Worker", "งานเยอะ", "จ่ายทุก 3 วัน"],
    openSlots: 20,
    applicants: 22,
    views: 178,
    createdAt: new Date(Date.now() - 14400000).toISOString(),
  },
  {
    id: "recruit-3",
    title: "หาทีมงานคอมเม้น Facebook ภาษาไทย",
    author: {
      name: "Comment Pro",
      avatar: "C",
      rating: 4.8,
      verified: true,
      memberCount: 28,
      totalPaid: 95000,
    },
    description:
      "รับคนพิมพ์เร็ว ทำงานคอมเม้น Facebook เนื้อหาภาษาไทย ต้องพิมพ์ถูกต้อง ไม่ผิดสเปล ค่าตอบแทนดี",
    platforms: ["facebook"],
    payRate: { min: 1.0, max: 2.0, unit: "บาท/เม้น" },
    requirements: ["พิมพ์ภาษาไทยถูกต้อง", "ทำงานรวดเร็ว", "มีความรับผิดชอบ"],
    benefits: ["ค่าตอบแทนสูง", "จ่ายทันที", "งานประจำ"],
    openSlots: 15,
    applicants: 12,
    views: 156,
    createdAt: new Date(Date.now() - 28800000).toISOString(),
  },
  {
    id: "recruit-4",
    title: "รับน้องใหม่! สอนงานตั้งแต่เริ่มต้น",
    author: {
      name: "Beginner Friendly Team",
      avatar: "B",
      rating: 4.7,
      verified: false,
      memberCount: 15,
      totalPaid: 45000,
    },
    description:
      "ทีมสำหรับมือใหม่โดยเฉพาะ สอนงานตั้งแต่พื้นฐาน มีพี่เลี้ยงดูแล ค่อยๆ เรียนรู้ไปด้วยกัน",
    platforms: ["facebook", "instagram", "tiktok"],
    payRate: { min: 0.2, max: 0.8, unit: "บาท/งาน" },
    requirements: ["มีใจอยากเรียนรู้", "มีเวลาอย่างน้อย 2-3 ชม./วัน"],
    benefits: ["สอนงานฟรี", "มีพี่เลี้ยง", "เริ่มจากงานง่ายๆ"],
    openSlots: 10,
    applicants: 8,
    views: 89,
    createdAt: new Date(Date.now() - 43200000).toISOString(),
  },
];

const getPlatformIcon = (platform: string) => {
  const iconClass = "w-4 h-4 inline-block";
  switch (platform) {
    case "facebook": return <Facebook className={iconClass} />;
    case "instagram": return <Instagram className={iconClass} />;
    case "tiktok": return <Music2 className={iconClass} />;
    case "youtube": return <Youtube className={iconClass} />;
    default: return null;
  }
};

export default function RecruitPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterPlatform, setFilterPlatform] = useState("all");

  const filteredPosts = recruitPosts.filter((post) => {
    const matchSearch =
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchPlatform =
      filterPlatform === "all" || post.platforms.includes(filterPlatform);
    return matchSearch && matchPlatform;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-brand-text-dark flex items-center gap-2">
            <Users className="w-7 h-7 text-brand-primary" />
            🔍 หาลูกทีม
          </h1>
          <p className="text-brand-text-light mt-1">
            ประกาศรับสมัคร Worker เข้าทีมของคุณ
          </p>
        </div>
        <Link href="/hub/post/new?type=recruit">
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            โพสต์หาลูกทีม
          </Button>
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        <Card variant="bordered" padding="md" className="text-center">
          <p className="text-2xl font-bold text-brand-primary">{recruitPosts.length}</p>
          <p className="text-sm text-brand-text-light">โพสต์รับสมัคร</p>
        </Card>
        <Card variant="bordered" padding="md" className="text-center">
          <p className="text-2xl font-bold text-brand-success">
            {recruitPosts.reduce((sum, p) => sum + p.openSlots, 0)}
          </p>
          <p className="text-sm text-brand-text-light">ตำแหน่งว่าง</p>
        </Card>
        <Card variant="bordered" padding="md" className="text-center">
          <p className="text-2xl font-bold text-brand-warning">
            {recruitPosts.reduce((sum, p) => sum + p.applicants, 0)}
          </p>
          <p className="text-sm text-brand-text-light">ผู้สมัครทั้งหมด</p>
        </Card>
      </div>

      {/* Filters */}
      <Card variant="bordered" padding="md">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <Input
              placeholder="ค้นหาทีม..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              leftIcon={<Search className="w-4 h-4" />}
            />
          </div>
          <div className="flex gap-2 overflow-x-auto">
              {[
                { key: "all", label: "ทั้งหมด" },
                { key: "facebook", label: "Facebook", icon: <Facebook className="w-4 h-4" /> },
                { key: "instagram", label: "Instagram", icon: <Instagram className="w-4 h-4" /> },
                { key: "tiktok", label: "TikTok", icon: <Music2 className="w-4 h-4" /> },
              ].map((f) => (
              <button
                key={f.key}
                onClick={() => setFilterPlatform(f.key)}
                className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all ${
                  filterPlatform === f.key
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

      {/* Posts */}
      <div className="space-y-4">
        {filteredPosts.map((post) => (
          <Card key={post.id} variant="bordered" padding="lg" className="hover:shadow-lg transition-shadow">
            <div className="space-y-4">
              {/* Header */}
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 bg-brand-primary/10 rounded-full flex items-center justify-center text-xl font-bold text-brand-primary">
                    {post.author.avatar}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold text-brand-text-dark text-lg">
                        {post.title}
                      </h3>
                      {post.isHot && (
                        <Badge variant="error" size="sm">
                          <Flame className="w-3 h-3 mr-1" />
                          Hot
                        </Badge>
                      )}
                    </div>
                    <div className="flex items-center gap-3 text-sm text-brand-text-light mt-1">
                      <span className="flex items-center gap-1">
                        {post.author.name}
                        {post.author.verified && (
                          <CheckCircle2 className="w-4 h-4 text-brand-success" />
                        )}
                      </span>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <Star className="w-3 h-3 text-brand-warning" />
                        {post.author.rating}
                      </span>
                      <span>•</span>
                      <span>{post.author.memberCount} สมาชิก</span>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-xl font-bold text-brand-success">
                    {post.payRate.min}-{post.payRate.max}
                  </p>
                  <p className="text-sm text-brand-text-light">{post.payRate.unit}</p>
                </div>
              </div>

              {/* Description */}
              <p className="text-brand-text-light">{post.description}</p>

              {/* Platforms */}
              <div className="flex items-center gap-2">
                {post.platforms.map((platform) => (
                  <span
                    key={platform}
                    className="px-3 py-1 bg-brand-bg rounded-full text-sm flex items-center gap-1"
                  >
                    {getPlatformIcon(platform)}
                    <span>{platform}</span>
                  </span>
                ))}
              </div>

              {/* Requirements & Benefits */}
              <div className="grid md:grid-cols-2 gap-4">
                <div className="p-3 bg-brand-bg rounded-lg">
                  <p className="font-medium text-brand-text-dark mb-2 flex items-center gap-1">
                    <ClipboardList className="w-4 h-4" />
                    คุณสมบัติ
                  </p>
                  <ul className="space-y-1 text-sm text-brand-text-light">
                    {post.requirements.map((req, i) => (
                      <li key={i}>• {req}</li>
                    ))}
                  </ul>
                </div>
                <div className="p-3 bg-brand-success/10 rounded-lg">
                  <p className="font-medium text-brand-text-dark mb-2">🎁 สิ่งที่จะได้รับ</p>
                  <ul className="space-y-1 text-sm text-brand-text-light">
                    {post.benefits.map((benefit, i) => (
                      <li key={i}>✓ {benefit}</li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Footer */}
              <div className="flex items-center justify-between pt-4 border-t border-brand-border">
                <div className="flex items-center gap-4 text-sm text-brand-text-light">
                  <span className="flex items-center gap-1">
                    <Users className="w-4 h-4" />
                    รับเพิ่ม {post.openSlots} คน
                  </span>
                  <span className="flex items-center gap-1">
                    <Heart className="w-4 h-4" />
                    {post.applicants} สมัครแล้ว
                  </span>
                  <span className="flex items-center gap-1">
                    <Eye className="w-4 h-4" />
                    {post.views}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    {new Date(post.createdAt).toLocaleDateString("th-TH", {
                      day: "numeric",
                      month: "short",
                    })}
                  </span>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    ดูรายละเอียด
                  </Button>
                  <Button size="sm">
                    <MessageCircle className="w-4 h-4 mr-1" />
                    สมัครเข้าทีม
                  </Button>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}

