"use client";

import { useState } from "react";
import Link from "next/link";
import { Card, Badge, Button, Input } from "@/components/ui";
import { PageHeader, PlatformIcon } from "@/components/shared";
import {
  Search,
  Briefcase,
  Star,
  Clock,
  Plus,
  Heart,
  MessageCircle,
  Eye,
  AlertTriangle,
  Target,
  DollarSign,
  CheckCircle2,
  Zap,
  Flame,
  Facebook,
  Instagram,
  Music2,
} from "lucide-react";

// Mock outsource jobs
const outsourceJobs = [
  {
    id: "out-1",
    title: "โยนงาน IG Follow 500 คน ด่วน!",
    author: {
      name: "SocialPro",
      avatar: "S",
      rating: 4.7,
      verified: true,
      totalOutsourced: 25,
    },
    description:
      "มีงาน Follow IG 500 คน ต้องการภายในวันนี้ งานเกินรับไม่ไหว ราคาคุยได้ ต้องการทีมที่มี Worker พร้อมทำทันที",
    platform: "instagram",
    jobType: "follow",
    quantity: 500,
    budget: 200,
    pricePerUnit: 0.4,
    deadline: new Date(Date.now() + 3600000 * 4).toISOString(),
    targetUrl: "https://instagram.com/shop_abc",
    requirements: ["ส่งงานภายในวันนี้", "แอคคุณภาพ", "รายงานความคืบหน้า"],
    views: 89,
    bids: 5,
    createdAt: new Date(Date.now() - 1800000).toISOString(),
    isUrgent: true,
  },
  {
    id: "out-2",
    title: "รับโยนงาน Comment FB ภาษาไทย 100 เม้น",
    author: {
      name: "ร้านค้าออนไลน์",
      avatar: "ร",
      rating: 4.5,
      verified: false,
      totalOutsourced: 8,
    },
    description:
      "มีงาน Comment Facebook ภาษาไทย 100 comment ต้องการทีมที่มี Worker คุณภาพ เม้นต้องหลากหลาย ไม่ซ้ำกัน",
    platform: "facebook",
    jobType: "comment",
    quantity: 100,
    budget: 300,
    pricePerUnit: 3.0,
    deadline: new Date(Date.now() + 3600000 * 24).toISOString(),
    targetUrl: "https://facebook.com/post/xxx",
    requirements: ["เม้นภาษาไทย", "ไม่ซ้ำกัน", "แอคคนไทยจริง"],
    views: 45,
    bids: 4,
    createdAt: new Date(Date.now() - 43200000).toISOString(),
  },
  {
    id: "out-3",
    title: "โยนงาน TikTok View 10,000 View",
    author: {
      name: "TikTok Shop",
      avatar: "T",
      rating: 4.8,
      verified: true,
      totalOutsourced: 42,
    },
    description:
      "ต้องการ View TikTok 10,000 View สำหรับวิดีโอสินค้าใหม่ ส่งงานภายใน 2 วัน ราคาคุยได้",
    platform: "tiktok",
    jobType: "view",
    quantity: 10000,
    budget: 500,
    pricePerUnit: 0.05,
    deadline: new Date(Date.now() + 3600000 * 48).toISOString(),
    targetUrl: "https://tiktok.com/@shop/video/xxx",
    requirements: ["View จริง", "ไม่หลุด", "รายงานทุก 2 ชม."],
    views: 156,
    bids: 8,
    createdAt: new Date(Date.now() - 7200000).toISOString(),
  },
  {
    id: "out-4",
    title: "ด่วน! Like Facebook 2,000 Like",
    author: {
      name: "Marketing Pro",
      avatar: "M",
      rating: 4.6,
      verified: true,
      totalOutsourced: 18,
    },
    description:
      "ต้องการ Like Facebook 2,000 Like ด่วนภายใน 6 ชม. มีงานต่อเนื่องให้ทีมที่ทำได้ดี",
    platform: "facebook",
    jobType: "like",
    quantity: 2000,
    budget: 400,
    pricePerUnit: 0.2,
    deadline: new Date(Date.now() + 3600000 * 6).toISOString(),
    targetUrl: "https://facebook.com/page/post/yyy",
    requirements: ["ส่งงานใน 6 ชม.", "Like คุณภาพ"],
    views: 78,
    bids: 6,
    createdAt: new Date(Date.now() - 3600000).toISOString(),
    isUrgent: true,
  },
  {
    id: "out-5",
    title: "โยนงาน Share Facebook 300 Share",
    author: {
      name: "Event Organizer",
      avatar: "E",
      rating: 4.4,
      verified: false,
      totalOutsourced: 5,
    },
    description:
      "ต้องการ Share โพสต์ Facebook 300 Share สำหรับโปรโมทอีเว้นท์ ส่งงานภายใน 3 วัน",
    platform: "facebook",
    jobType: "share",
    quantity: 300,
    budget: 450,
    pricePerUnit: 1.5,
    deadline: new Date(Date.now() + 3600000 * 72).toISOString(),
    targetUrl: "https://facebook.com/events/xxx",
    requirements: ["Share เป็น Public", "แอคไทยแท้"],
    views: 34,
    bids: 2,
    createdAt: new Date(Date.now() - 86400000).toISOString(),
  },
];

const getJobTypeLabel = (type: string) => {
  switch (type) {
    case "like": return "ไลค์";
    case "comment": return "เม้น";
    case "follow": return "Follow";
    case "view": return "View";
    case "share": return "Share";
    default: return type;
  }
};

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
  const [filterPlatform, setFilterPlatform] = useState("all");

  const filteredJobs = outsourceJobs.filter((job) => {
    const matchSearch =
      job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchPlatform =
      filterPlatform === "all" || job.platform === filterPlatform;
    return matchSearch && matchPlatform;
  });

  const totalBudget = outsourceJobs.reduce((sum, j) => sum + j.budget, 0);

  return (
    <div className="space-y-6">
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
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card variant="bordered" padding="md" className="text-center">
          <p className="text-2xl font-bold text-brand-warning">{outsourceJobs.length}</p>
          <p className="text-sm text-brand-text-light">งานรอโยน</p>
        </Card>
        <Card variant="bordered" padding="md" className="text-center">
          <p className="text-2xl font-bold text-brand-error">
            {outsourceJobs.filter((j) => j.isUrgent).length}
          </p>
          <p className="text-sm text-brand-text-light">งานด่วน</p>
        </Card>
        <Card variant="bordered" padding="md" className="text-center">
          <p className="text-2xl font-bold text-brand-success">
            ฿{totalBudget.toLocaleString()}
          </p>
          <p className="text-sm text-brand-text-light">มูลค่ารวม</p>
        </Card>
        <Card variant="bordered" padding="md" className="text-center">
          <p className="text-2xl font-bold text-brand-info">
            {outsourceJobs.reduce((sum, j) => sum + j.bids, 0)}
          </p>
          <p className="text-sm text-brand-text-light">เสนอราคาทั้งหมด</p>
        </Card>
      </div>

      {/* Alert for Urgent Jobs */}
      {outsourceJobs.filter((j) => j.isUrgent).length > 0 && (
        <Card variant="bordered" padding="md" className="bg-brand-error/5 border-brand-error">
          <div className="flex items-center gap-3">
            <Zap className="w-5 h-5 text-brand-error" />
            <div>
              <p className="font-medium text-brand-text-dark">
                มี {outsourceJobs.filter((j) => j.isUrgent).length} งานด่วน!
              </p>
              <p className="text-sm text-brand-text-light">
                งานเหล่านี้ต้องการส่งภายในไม่กี่ชั่วโมง
              </p>
            </div>
          </div>
        </Card>
      )}

      {/* Filters */}
      <Card variant="bordered" padding="md">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <Input
              placeholder="ค้นหางาน..."
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

      {/* Jobs List */}
      <div className="space-y-4">
        {filteredJobs.map((job) => (
          <Card key={job.id} variant="bordered" padding="lg" className="hover:shadow-lg transition-shadow">
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
                    (฿{job.pricePerUnit}/{getJobTypeLabel(job.jobType)})
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
                    <PlatformIcon platform={job.platform} className="w-4 h-4" />
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
                    {job.bids} เสนอราคา
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
                    เสนอรับงาน
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

