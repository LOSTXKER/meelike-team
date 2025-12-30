"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Card, Badge, Button, Input, Textarea, Select } from "@/components/ui";
import { useAuthStore } from "@/lib/store";
import {
  ArrowLeft,
  Users,
  Search,
  Briefcase,
  Send,
  Plus,
  X,
  AlertCircle,
  CheckCircle2,
  Sparkles,
  Facebook,
  Instagram,
  Music2,
  Youtube,
  Twitter,
} from "lucide-react";

type PostType = "recruit" | "find-team" | "outsource";

const postTypeConfig: Record<PostType, { 
  label: string; 
  icon: React.ReactNode; 
  description: string;
  color: string;
}> = {
  recruit: {
    label: "หาลูกทีม",
    icon: <Users className="w-5 h-5" />,
    description: "ประกาศรับสมัคร Worker เข้าทีมของคุณ",
    color: "bg-brand-primary",
  },
  "find-team": {
    label: "หาทีม",
    icon: <Search className="w-5 h-5" />,
    description: "ประกาศตัวเพื่อหาทีมเข้าร่วม",
    color: "bg-brand-info",
  },
  outsource: {
    label: "โยนงาน",
    icon: <Briefcase className="w-5 h-5" />,
    description: "โพสต์งานที่ต้องการหาทีมอื่นช่วยทำ",
    color: "bg-brand-warning",
  },
};

const platformOptions = [
  { value: "facebook", label: "Facebook", icon: <Facebook className="w-4 h-4" /> },
  { value: "instagram", label: "Instagram", icon: <Instagram className="w-4 h-4" /> },
  { value: "tiktok", label: "TikTok", icon: <Music2 className="w-4 h-4" /> },
  { value: "youtube", label: "YouTube", icon: <Youtube className="w-4 h-4" /> },
  { value: "twitter", label: "Twitter", icon: <Twitter className="w-4 h-4" /> },
];

const jobTypeOptions = [
  { value: "like", label: "ไลค์ (Like)" },
  { value: "comment", label: "เม้น (Comment)" },
  { value: "follow", label: "Follow" },
  { value: "view", label: "View" },
  { value: "share", label: "Share" },
  { value: "subscribe", label: "Subscribe" },
];

export default function NewPostPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { isAuthenticated, role, _hasHydrated } = useAuthStore();

  const [postType, setPostType] = useState<PostType | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Common fields
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [platforms, setPlatforms] = useState<string[]>([]);

  // Recruit fields
  const [payRateMin, setPayRateMin] = useState("");
  const [payRateMax, setPayRateMax] = useState("");
  const [openSlots, setOpenSlots] = useState("");
  const [requirements, setRequirements] = useState<string[]>([""]);
  const [benefits, setBenefits] = useState<string[]>([""]);

  // Find-team fields
  const [experience, setExperience] = useState("");
  const [expectedPay, setExpectedPay] = useState("");
  const [availability, setAvailability] = useState("");
  const [skills, setSkills] = useState<string[]>([""]);

  // Outsource fields
  const [jobType, setJobType] = useState("");
  const [quantity, setQuantity] = useState("");
  const [budget, setBudget] = useState("");
  const [deadline, setDeadline] = useState("");
  const [targetUrl, setTargetUrl] = useState("");

  useEffect(() => {
    const type = searchParams.get("type") as PostType;
    if (type && postTypeConfig[type]) {
      setPostType(type);
    }
  }, [searchParams]);

  const handleAddItem = (
    list: string[],
    setList: React.Dispatch<React.SetStateAction<string[]>>
  ) => {
    setList([...list, ""]);
  };

  const handleRemoveItem = (
    index: number,
    list: string[],
    setList: React.Dispatch<React.SetStateAction<string[]>>
  ) => {
    setList(list.filter((_, i) => i !== index));
  };

  const handleUpdateItem = (
    index: number,
    value: string,
    list: string[],
    setList: React.Dispatch<React.SetStateAction<string[]>>
  ) => {
    const newList = [...list];
    newList[index] = value;
    setList(newList);
  };

  const togglePlatform = (platform: string) => {
    if (platforms.includes(platform)) {
      setPlatforms(platforms.filter((p) => p !== platform));
    } else {
      setPlatforms([...platforms, platform]);
    }
  };

  const handleSubmit = async () => {
    if (!title || !description || platforms.length === 0) {
      alert("กรุณากรอกข้อมูลให้ครบ");
      return;
    }

    setIsSubmitting(true);

    // Mock submit
    setTimeout(() => {
      alert("โพสต์สำเร็จ! โพสต์ของคุณจะแสดงใน Hub แล้ว");
      router.push("/hub");
    }, 1000);
  };

  if (!_hasHydrated) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center">
        <div className="animate-pulse text-brand-primary">กำลังโหลด...</div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <Card variant="bordered" padding="lg" className="max-w-md mx-auto text-center">
        <AlertCircle className="w-12 h-12 text-brand-warning mx-auto mb-4" />
        <h2 className="text-xl font-bold text-brand-text-dark mb-2">
          กรุณาเข้าสู่ระบบ
        </h2>
        <p className="text-brand-text-light mb-4">
          คุณต้องเข้าสู่ระบบเพื่อสร้างโพสต์
        </p>
        <Link href="/login">
          <Button>เข้าสู่ระบบ</Button>
        </Link>
      </Card>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link href="/hub">
          <button className="p-2 hover:bg-brand-bg rounded-lg transition-colors">
            <ArrowLeft className="w-5 h-5 text-brand-text-dark" />
          </button>
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-brand-text-dark flex items-center gap-2">
            <Sparkles className="w-6 h-6 text-brand-primary" />
            สร้างโพสต์ใหม่
          </h1>
          <p className="text-brand-text-light">โพสต์ใน MeeLike Hub</p>
        </div>
      </div>

      {/* Post Type Selection */}
      {!postType ? (
        <Card variant="bordered" padding="lg">
          <h2 className="font-semibold text-brand-text-dark mb-4">
            เลือกประเภทโพสต์
          </h2>
          <div className="grid md:grid-cols-3 gap-4">
            {(Object.keys(postTypeConfig) as PostType[]).map((type) => {
              const config = postTypeConfig[type];
              // Check role permissions
              const canPost =
                (type === "recruit" && role === "seller") ||
                (type === "find-team" && role === "worker") ||
                (type === "outsource" && role === "seller");

              return (
                <button
                  key={type}
                  onClick={() => canPost && setPostType(type)}
                  disabled={!canPost}
                  className={`p-6 rounded-xl border-2 text-left transition-all ${
                    canPost
                      ? "border-brand-border hover:border-brand-primary hover:shadow-lg cursor-pointer"
                      : "border-gray-200 opacity-50 cursor-not-allowed"
                  }`}
                >
                  <div
                    className={`w-12 h-12 rounded-lg ${config.color} text-white flex items-center justify-center mb-4`}
                  >
                    {config.icon}
                  </div>
                  <h3 className="font-semibold text-brand-text-dark mb-1">
                    {config.label}
                  </h3>
                  <p className="text-sm text-brand-text-light">
                    {config.description}
                  </p>
                  {!canPost && (
                    <p className="text-xs text-brand-error mt-2">
                      {type === "find-team"
                        ? "สำหรับ Worker เท่านั้น"
                        : "สำหรับ Seller เท่านั้น"}
                    </p>
                  )}
                </button>
              );
            })}
          </div>
        </Card>
      ) : (
        <>
          {/* Post Type Badge */}
          <Card variant="bordered" padding="md" className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div
                className={`w-10 h-10 rounded-lg ${postTypeConfig[postType].color} text-white flex items-center justify-center`}
              >
                {postTypeConfig[postType].icon}
              </div>
              <div>
                <p className="font-medium text-brand-text-dark">
                  {postTypeConfig[postType].label}
                </p>
                <p className="text-sm text-brand-text-light">
                  {postTypeConfig[postType].description}
                </p>
              </div>
            </div>
            <button
              onClick={() => setPostType(null)}
              className="text-brand-text-light hover:text-brand-text-dark"
            >
              เปลี่ยน
            </button>
          </Card>

          {/* Form */}
          <Card variant="bordered" padding="lg">
            <div className="space-y-6">
              {/* Common Fields */}
              <Input
                label="หัวข้อโพสต์ *"
                placeholder="เช่น รับลูกทีมด่วน! งาน Facebook/IG"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />

              <Textarea
                label="รายละเอียด *"
                placeholder="อธิบายรายละเอียดเพิ่มเติม..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={4}
              />

              {/* Platforms */}
              <div>
                <label className="block text-sm font-medium text-brand-text-dark mb-2">
                  แพลตฟอร์ม *
                </label>
                <div className="flex flex-wrap gap-2">
                  {platformOptions.map((p) => (
                    <button
                      key={p.value}
                      type="button"
                      onClick={() => togglePlatform(p.value)}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                        platforms.includes(p.value)
                          ? "bg-brand-primary text-white"
                          : "bg-brand-bg text-brand-text-light hover:text-brand-text-dark"
                      }`}
                    >
                      <span className="mr-1">{p.icon}</span>
                      {p.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Recruit Fields */}
              {postType === "recruit" && (
                <>
                  <div className="grid grid-cols-2 gap-4">
                    <Input
                      label="อัตราค่าจ้าง (ต่ำสุด)"
                      type="number"
                      placeholder="0.3"
                      value={payRateMin}
                      onChange={(e) => setPayRateMin(e.target.value)}
                    />
                    <Input
                      label="อัตราค่าจ้าง (สูงสุด)"
                      type="number"
                      placeholder="1.5"
                      value={payRateMax}
                      onChange={(e) => setPayRateMax(e.target.value)}
                    />
                  </div>

                  <Input
                    label="จำนวนที่รับ"
                    type="number"
                    placeholder="10"
                    value={openSlots}
                    onChange={(e) => setOpenSlots(e.target.value)}
                  />

                  <div>
                    <label className="block text-sm font-medium text-brand-text-dark mb-2">
                      คุณสมบัติที่ต้องการ
                    </label>
                    {requirements.map((req, index) => (
                      <div key={index} className="flex gap-2 mb-2">
                        <Input
                          placeholder="เช่น มีโทรศัพท์, ออนไลน์ได้ทุกวัน"
                          value={req}
                          onChange={(e) =>
                            handleUpdateItem(index, e.target.value, requirements, setRequirements)
                          }
                        />
                        {requirements.length > 1 && (
                          <button
                            type="button"
                            onClick={() => handleRemoveItem(index, requirements, setRequirements)}
                            className="p-2 text-brand-error hover:bg-brand-error/10 rounded-lg"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    ))}
                    <button
                      type="button"
                      onClick={() => handleAddItem(requirements, setRequirements)}
                      className="text-sm text-brand-primary hover:underline flex items-center gap-1"
                    >
                      <Plus className="w-4 h-4" /> เพิ่มคุณสมบัติ
                    </button>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-brand-text-dark mb-2">
                      สิ่งที่จะได้รับ
                    </label>
                    {benefits.map((benefit, index) => (
                      <div key={index} className="flex gap-2 mb-2">
                        <Input
                          placeholder="เช่น จ่ายไวทุก 2 วัน, โบนัส"
                          value={benefit}
                          onChange={(e) =>
                            handleUpdateItem(index, e.target.value, benefits, setBenefits)
                          }
                        />
                        {benefits.length > 1 && (
                          <button
                            type="button"
                            onClick={() => handleRemoveItem(index, benefits, setBenefits)}
                            className="p-2 text-brand-error hover:bg-brand-error/10 rounded-lg"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    ))}
                    <button
                      type="button"
                      onClick={() => handleAddItem(benefits, setBenefits)}
                      className="text-sm text-brand-primary hover:underline flex items-center gap-1"
                    >
                      <Plus className="w-4 h-4" /> เพิ่มสิทธิประโยชน์
                    </button>
                  </div>
                </>
              )}

              {/* Find-team Fields */}
              {postType === "find-team" && (
                <>
                  <div className="grid grid-cols-2 gap-4">
                    <Input
                      label="ประสบการณ์"
                      placeholder="เช่น 6 เดือน, มือใหม่"
                      value={experience}
                      onChange={(e) => setExperience(e.target.value)}
                    />
                    <Input
                      label="ค่าจ้างที่ต้องการ"
                      placeholder="เช่น 0.5+ บาท/งาน"
                      value={expectedPay}
                      onChange={(e) => setExpectedPay(e.target.value)}
                    />
                  </div>

                  <Input
                    label="เวลาที่ทำงานได้"
                    placeholder="เช่น ทุกวัน 09:00-22:00"
                    value={availability}
                    onChange={(e) => setAvailability(e.target.value)}
                  />

                  <div>
                    <label className="block text-sm font-medium text-brand-text-dark mb-2">
                      ทักษะ/ความสามารถ
                    </label>
                    {skills.map((skill, index) => (
                      <div key={index} className="flex gap-2 mb-2">
                        <Input
                          placeholder="เช่น ไลค์, เม้น, Follow"
                          value={skill}
                          onChange={(e) =>
                            handleUpdateItem(index, e.target.value, skills, setSkills)
                          }
                        />
                        {skills.length > 1 && (
                          <button
                            type="button"
                            onClick={() => handleRemoveItem(index, skills, setSkills)}
                            className="p-2 text-brand-error hover:bg-brand-error/10 rounded-lg"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    ))}
                    <button
                      type="button"
                      onClick={() => handleAddItem(skills, setSkills)}
                      className="text-sm text-brand-primary hover:underline flex items-center gap-1"
                    >
                      <Plus className="w-4 h-4" /> เพิ่มทักษะ
                    </button>
                  </div>
                </>
              )}

              {/* Outsource Fields */}
              {postType === "outsource" && (
                <>
                  <Select
                    label="ประเภทงาน *"
                    value={jobType}
                    onChange={(e) => setJobType(e.target.value)}
                    options={[
                      { value: "", label: "-- เลือกประเภทงาน --" },
                      ...jobTypeOptions,
                    ]}
                  />

                  <div className="grid grid-cols-2 gap-4">
                    <Input
                      label="จำนวน *"
                      type="number"
                      placeholder="500"
                      value={quantity}
                      onChange={(e) => setQuantity(e.target.value)}
                    />
                    <Input
                      label="งบประมาณ (บาท) *"
                      type="number"
                      placeholder="200"
                      value={budget}
                      onChange={(e) => setBudget(e.target.value)}
                    />
                  </div>

                  <Input
                    label="URL เป้าหมาย *"
                    placeholder="https://facebook.com/post/xxx"
                    value={targetUrl}
                    onChange={(e) => setTargetUrl(e.target.value)}
                  />

                  <Input
                    label="กำหนดส่งงาน *"
                    type="datetime-local"
                    value={deadline}
                    onChange={(e) => setDeadline(e.target.value)}
                  />
                </>
              )}

              {/* Submit */}
              <div className="flex gap-3 justify-end pt-4 border-t border-brand-border">
                <Link href="/hub">
                  <Button variant="outline">ยกเลิก</Button>
                </Link>
                <Button onClick={handleSubmit} disabled={isSubmitting}>
                  {isSubmitting ? (
                    "กำลังโพสต์..."
                  ) : (
                    <>
                      <Send className="w-4 h-4 mr-2" />
                      โพสต์
                    </>
                  )}
                </Button>
              </div>
            </div>
          </Card>
        </>
      )}
    </div>
  );
}

