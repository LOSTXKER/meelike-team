"use client";

import { useState } from "react";
import Link from "next/link";
import { Card, Badge, Button, Input } from "@/components/ui";
import {
  Search,
  User,
  Star,
  Clock,
  Plus,
  Heart,
  MessageCircle,
  Eye,
  Briefcase,
  Award,
  Calendar,
  Facebook,
  Instagram,
  Music2,
  Trophy,
  Medal,
  Sparkle,
  UserPlus,
} from "lucide-react";

// Mock find-team posts
const findTeamPosts = [
  {
    id: "find-1",
    title: "หาทีมค่ะ ทำงานมา 6 เดือน Rating 4.8",
    author: {
      name: "น้องมิ้นท์",
      avatar: "ม",
      rating: 4.8,
      level: "Gold",
    },
    description:
      "เคยทำงานกับทีมมาก่อน 6 เดือน งาน Facebook/IG/TikTok ได้หมด ทำงานได้วันละ 100+ งาน ต้องการทีมที่จ่ายตรงเวลา",
    platforms: ["facebook", "instagram", "tiktok"],
    experience: "6 เดือน",
    completedJobs: 1250,
    completionRate: 98.5,
    expectedPay: "0.5+ บาท/งาน",
    availability: "ทุกวัน 09:00-22:00",
    skills: ["ไลค์", "เม้น", "Follow", "View"],
    portfolio: "ทำงานกับ 3 ทีมมาก่อน ผลงานดี",
    views: 156,
    interested: 8,
    createdAt: new Date(Date.now() - 7200000).toISOString(),
    isTopWorker: true,
  },
  {
    id: "find-2",
    title: "Worker มือเก๋า ประสบการณ์ 1 ปี+",
    author: {
      name: "พี่ต้น",
      avatar: "ต",
      rating: 4.9,
      level: "Platinum",
    },
    description:
      "ทำงานมา 1 ปีกว่า เน้นงานคุณภาพ ไม่เคยถูก Reject งาน หาทีมที่มีงานสม่ำเสมอและจ่ายตรงเวลา",
    platforms: ["facebook", "instagram"],
    experience: "1 ปี 3 เดือน",
    completedJobs: 3500,
    completionRate: 99.2,
    expectedPay: "0.8+ บาท/งาน",
    availability: "จันทร์-เสาร์ 10:00-20:00",
    skills: ["ไลค์", "เม้นคุณภาพ", "Follow"],
    portfolio: "เคยเป็น Top Worker ประจำเดือน 5 ครั้ง",
    views: 234,
    interested: 15,
    createdAt: new Date(Date.now() - 14400000).toISOString(),
    isTopWorker: true,
  },
  {
    id: "find-3",
    title: "มือใหม่หาทีม อยากเรียนรู้งาน",
    author: {
      name: "น้องเบส",
      avatar: "เ",
      rating: 0,
      level: "New",
    },
    description:
      "เพิ่งเริ่มต้น อยากหาทีมที่สอนงานให้ ทำงานได้ทั้งวัน มีโทรศัพท์ 2 เครื่อง พร้อมเรียนรู้ทุกอย่าง",
    platforms: ["facebook", "instagram", "tiktok"],
    experience: "มือใหม่",
    completedJobs: 0,
    completionRate: 0,
    expectedPay: "ตามที่ทีมกำหนด",
    availability: "Full-time ทุกวัน",
    skills: ["พร้อมเรียนรู้"],
    portfolio: "มีโทรศัพท์ 2 เครื่อง พร้อมทำงาน",
    views: 67,
    interested: 3,
    createdAt: new Date(Date.now() - 28800000).toISOString(),
  },
  {
    id: "find-4",
    title: "หาทีมงาน TikTok โดยเฉพาะ",
    author: {
      name: "แนน",
      avatar: "แ",
      rating: 4.6,
      level: "Silver",
    },
    description:
      "ถนัดงาน TikTok โดยเฉพาะ View/Like/Follow ทำได้เร็วมาก หาทีมที่เน้นงาน TikTok",
    platforms: ["tiktok"],
    experience: "4 เดือน",
    completedJobs: 850,
    completionRate: 97.5,
    expectedPay: "0.3+ บาท/งาน",
    availability: "ทุกวัน หลัง 17:00",
    skills: ["TikTok View", "TikTok Like", "TikTok Follow"],
    portfolio: "ทำงาน TikTok ได้วันละ 500+",
    views: 98,
    interested: 6,
    createdAt: new Date(Date.now() - 43200000).toISOString(),
  },
  {
    id: "find-5",
    title: "ทำงานพาร์ทไทม์ หาทีมที่ยืดหยุ่น",
    author: {
      name: "อุ้ม",
      avatar: "อ",
      rating: 4.5,
      level: "Bronze",
    },
    description:
      "เป็นนักศึกษา ทำงานพาร์ทไทม์ได้วันละ 3-4 ชม. หาทีมที่เข้าใจและยืดหยุ่นเรื่องเวลา",
    platforms: ["facebook", "instagram"],
    experience: "2 เดือน",
    completedJobs: 320,
    completionRate: 95.0,
    expectedPay: "0.4+ บาท/งาน",
    availability: "จันทร์-ศุกร์ 18:00-22:00, เสาร์-อาทิตย์ เต็มวัน",
    skills: ["ไลค์", "Follow"],
    portfolio: "ทำงานสม่ำเสมอ แม้จะพาร์ทไทม์",
    views: 45,
    interested: 2,
    createdAt: new Date(Date.now() - 86400000).toISOString(),
  },
];

const getPlatformIcon = (platform: string) => {
  const iconClass = "w-4 h-4 inline-block";
  switch (platform) {
    case "facebook": return <Facebook className={iconClass} />;
    case "instagram": return <Instagram className={iconClass} />;
    case "tiktok": return <Music2 className={iconClass} />;
    default: return null;
  }
};

const getLevelColor = (level: string) => {
  switch (level) {
    case "Platinum": return "bg-purple-100 text-purple-700";
    case "Gold": return "bg-yellow-100 text-yellow-700";
    case "Silver": return "bg-gray-100 text-gray-700";
    case "Bronze": return "bg-orange-100 text-orange-700";
    default: return "bg-blue-100 text-blue-700";
  }
};

export default function FindTeamPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterLevel, setFilterLevel] = useState("all");

  const filteredPosts = findTeamPosts.filter((post) => {
    const matchSearch =
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchLevel =
      filterLevel === "all" || post.author.level === filterLevel;
    return matchSearch && matchLevel;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-brand-text-dark flex items-center gap-2">
            <Search className="w-7 h-7 text-brand-info" />
            หาทีม
          </h1>
          <p className="text-brand-text-light mt-1">
            Worker ที่กำลังหาทีมเข้าร่วม
          </p>
        </div>
        <Link href="/hub/post/new?type=find-team">
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            โพสต์หาทีม
          </Button>
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        <Card variant="bordered" padding="md" className="text-center">
          <p className="text-2xl font-bold text-brand-info">{findTeamPosts.length}</p>
          <p className="text-sm text-brand-text-light">Worker หาทีม</p>
        </Card>
        <Card variant="bordered" padding="md" className="text-center">
          <p className="text-2xl font-bold text-brand-warning">
            {findTeamPosts.filter((p) => p.isTopWorker).length}
          </p>
          <p className="text-sm text-brand-text-light">Top Worker</p>
        </Card>
        <Card variant="bordered" padding="md" className="text-center">
          <p className="text-2xl font-bold text-brand-success">
            {findTeamPosts.reduce((sum, p) => sum + p.completedJobs, 0).toLocaleString()}
          </p>
          <p className="text-sm text-brand-text-light">งานที่ทำแล้ว</p>
        </Card>
      </div>

      {/* Filters */}
      <Card variant="bordered" padding="md">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <Input
              placeholder="ค้นหา Worker..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              leftIcon={<Search className="w-4 h-4" />}
            />
          </div>
          <div className="flex gap-2 overflow-x-auto">
              {[
                { key: "all", label: "ทั้งหมด" },
                { key: "Platinum", label: "Platinum", icon: <Trophy className="w-4 h-4 text-purple-500" /> },
                { key: "Gold", label: "Gold", icon: <Medal className="w-4 h-4 text-yellow-500" /> },
                { key: "Silver", label: "Silver", icon: <Medal className="w-4 h-4 text-gray-400" /> },
                { key: "New", label: "มือใหม่", icon: <Sparkle className="w-4 h-4 text-blue-500" /> },
              ].map((f) => (
              <button
                key={f.key}
                onClick={() => setFilterLevel(f.key)}
                className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all ${
                  filterLevel === f.key
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
      <div className="grid md:grid-cols-2 gap-4">
        {filteredPosts.map((post) => (
          <Card key={post.id} variant="bordered" padding="lg" className="hover:shadow-lg transition-shadow">
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
                      {getPlatformIcon(platform)}
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
                <Button size="sm">
                  <MessageCircle className="w-4 h-4 mr-1" />
                  ติดต่อ
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}

