"use client";

import { useState } from "react";
import { Card, Button, Input, Badge } from "@/components/ui";
import { PageHeader } from "@/components/shared";
import {
  Users,
  Link as LinkIcon,
  Copy,
  Gift,
  CheckCircle2,
  UserPlus,
  Clipboard,
  Star,
  Share2,
  ArrowRight,
  Sparkles,
} from "lucide-react";

interface ReferralReward {
  milestone: string;
  yourReward: string;
  friendReward: string;
  achieved: boolean;
}

interface ReferredFriend {
  name: string;
  avatar: string;
  status: "registered" | "completed_10" | "completed_50";
  earnedForYou: number;
  joinedAt: string;
}

const referralRewards: ReferralReward[] = [
  { milestone: "เพื่อนสมัคร", yourReward: "฿10", friendReward: "-", achieved: true },
  { milestone: "เพื่อนทำครบ 10 งาน", yourReward: "฿20", friendReward: "฿10", achieved: true },
  { milestone: "เพื่อนทำครบ 50 งาน", yourReward: "฿50", friendReward: "-", achieved: false },
];

const referredFriends: ReferredFriend[] = [
  { name: "แนน", avatar: "แ", status: "completed_50", earnedForYou: 80, joinedAt: "2024-12-15" },
  { name: "โอ๊ต", avatar: "โ", status: "completed_10", earnedForYou: 30, joinedAt: "2024-12-20" },
  { name: "เฟิร์น", avatar: "เ", status: "registered", earnedForYou: 10, joinedAt: "2024-12-28" },
];

export default function ReferralPage() {
  const [copied, setCopied] = useState(false);
  const referralCode = "NUNA123";
  const referralLink = `seller.meelike.com/r/${referralCode.toLowerCase()}`;

  const handleCopy = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  const getStatusBadge = (status: ReferredFriend["status"]) => {
    switch (status) {
      case "registered":
        return <Badge variant="default" size="sm">สมัครแล้ว</Badge>;
      case "completed_10":
        return <Badge variant="info" size="sm">ทำครบ 10 งาน</Badge>;
      case "completed_50":
        return <Badge variant="success" size="sm">ทำครบ 50 งาน</Badge>;
    }
  };

  const totalEarned = referredFriends.reduce((sum, f) => sum + f.earnedForYou, 0);
  const totalReferred = referredFriends.length;

  return (
    <div className="space-y-6 animate-fade-in max-w-4xl mx-auto">
      {/* Header */}
      <PageHeader
        title="ชวนเพื่อนมาทำงาน"
        description="รับรางวัลเมื่อเพื่อนสมัครและทำงาน!"
        icon={Users}
      />

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        <Card variant="elevated" className="border-none shadow-md text-center p-5">
          <div className="p-3 bg-brand-primary/10 rounded-xl w-fit mx-auto mb-3">
            <UserPlus className="w-6 h-6 text-brand-primary" />
          </div>
          <p className="text-2xl font-bold text-brand-text-dark">{totalReferred}</p>
          <p className="text-xs text-brand-text-light font-medium">เพื่อนที่ชวนมา</p>
        </Card>
        <Card variant="elevated" className="border-none shadow-md text-center p-5">
          <div className="p-3 bg-brand-success/10 rounded-xl w-fit mx-auto mb-3">
            <Gift className="w-6 h-6 text-brand-success" />
          </div>
          <p className="text-2xl font-bold text-brand-success">฿{totalEarned}</p>
          <p className="text-xs text-brand-text-light font-medium">รายได้จากการชวน</p>
        </Card>
        <Card variant="elevated" className="border-none shadow-md text-center p-5">
          <div className="p-3 bg-brand-warning/10 rounded-xl w-fit mx-auto mb-3">
            <Star className="w-6 h-6 text-brand-warning" />
          </div>
          <p className="text-2xl font-bold text-brand-text-dark">#12</p>
          <p className="text-xs text-brand-text-light font-medium">อันดับ Referrer</p>
        </Card>
      </div>

      {/* Referral Link Card */}
      <Card variant="elevated" className="border-none shadow-lg overflow-hidden">
        <div className="p-6 bg-gradient-to-r from-brand-primary to-brand-accent text-white">
          <div className="flex items-center gap-4">
            <div className="p-4 bg-white/20 rounded-2xl backdrop-blur-sm">
              <LinkIcon className="w-8 h-8" />
            </div>
            <div className="flex-1">
              <h3 className="text-xl font-bold">ลิงก์ชวนเพื่อน</h3>
              <p className="text-white/80 text-sm mt-1">
                แชร์ลิงก์นี้ให้เพื่อนเพื่อรับรางวัล!
              </p>
            </div>
          </div>
        </div>
        
        <div className="p-6 space-y-4">
          {/* Referral Link */}
          <div>
            <label className="block text-sm font-bold text-brand-text-dark mb-2">
              ลิงก์ชวน
            </label>
            <div className="flex gap-2">
              <Input
                value={referralLink}
                readOnly
                className="flex-1 bg-brand-bg/50 font-mono text-sm"
                leftIcon={<LinkIcon className="w-4 h-4" />}
              />
              <Button
                variant={copied ? "primary" : "outline"}
                onClick={() => handleCopy(`https://${referralLink}`)}
                className="shrink-0"
              >
                {copied ? (
                  <>
                    <CheckCircle2 className="w-4 h-4 mr-1.5" />
                    คัดลอกแล้ว!
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4 mr-1.5" />
                    คัดลอก
                  </>
                )}
              </Button>
            </div>
          </div>

          {/* Referral Code */}
          <div>
            <label className="block text-sm font-bold text-brand-text-dark mb-2">
              รหัสชวน
            </label>
            <div className="flex gap-2">
              <Input
                value={referralCode}
                readOnly
                className="flex-1 bg-brand-bg/50 font-mono text-center text-lg tracking-widest font-bold"
              />
              <Button
                variant="outline"
                onClick={() => handleCopy(referralCode)}
                className="shrink-0"
              >
                <Copy className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Share Buttons */}
          <div className="flex gap-3 pt-2">
            <Button className="flex-1 bg-green-500 hover:bg-green-600">
              <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38c1.45.79 3.08 1.21 4.74 1.21 5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.816 9.816 0 0012.04 2zm.01 1.67c2.2 0 4.26.86 5.82 2.42a8.225 8.225 0 012.41 5.83c0 4.54-3.7 8.23-8.24 8.23-1.48 0-2.93-.39-4.19-1.15l-.3-.17-3.12.82.83-3.04-.2-.32a8.188 8.188 0 01-1.26-4.38c.01-4.54 3.7-8.24 8.25-8.24zM8.53 7.33c-.16 0-.43.06-.66.31-.22.25-.87.86-.87 2.07 0 1.22.89 2.39 1 2.56.14.17 1.76 2.67 4.25 3.73.59.27 1.05.42 1.41.53.59.19 1.13.16 1.56.1.48-.07 1.46-.6 1.67-1.18.21-.58.21-1.07.15-1.18-.07-.1-.23-.16-.48-.27-.25-.14-1.47-.74-1.69-.82-.23-.08-.37-.12-.56.12-.16.25-.64.81-.78.97-.15.17-.29.19-.53.07-.26-.13-1.06-.39-2-1.23-.74-.66-1.23-1.47-1.38-1.72-.12-.24-.01-.39.11-.5.11-.11.27-.29.37-.44.13-.14.17-.25.25-.41.08-.17.04-.31-.02-.43-.06-.11-.56-1.35-.77-1.84-.2-.48-.4-.42-.56-.43-.14 0-.3-.01-.47-.01z"/>
              </svg>
              แชร์ LINE
            </Button>
            <Button variant="outline" className="flex-1">
              <Share2 className="w-5 h-5 mr-2" />
              แชร์อื่นๆ
            </Button>
          </div>
        </div>
      </Card>

      {/* Rewards Table */}
      <Card variant="elevated" className="border-none shadow-lg">
        <div className="p-5 border-b border-brand-border/50">
          <h3 className="text-lg font-bold text-brand-text-dark flex items-center gap-2">
            <Gift className="w-5 h-5 text-brand-accent" />
            รางวัล
          </h3>
        </div>
        <div className="divide-y divide-brand-border/30">
          {referralRewards.map((reward, index) => (
            <div
              key={index}
              className={`flex items-center justify-between p-4 ${
                reward.achieved ? "bg-brand-success/5" : ""
              }`}
            >
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                  reward.achieved
                    ? "bg-brand-success text-white"
                    : "bg-brand-bg text-brand-text-light"
                }`}>
                  {reward.achieved ? (
                    <CheckCircle2 className="w-5 h-5" />
                  ) : (
                    <span className="text-sm font-bold">{index + 1}</span>
                  )}
                </div>
                <span className={`font-medium ${
                  reward.achieved ? "text-brand-text-dark" : "text-brand-text-light"
                }`}>
                  {reward.milestone}
                </span>
              </div>
              <div className="flex items-center gap-4 text-sm">
                <div className="text-right">
                  <p className="text-brand-text-light text-xs">คุณได้</p>
                  <p className={`font-bold ${reward.achieved ? "text-brand-success" : "text-brand-text-dark"}`}>
                    {reward.yourReward}
                  </p>
                </div>
                {reward.friendReward !== "-" && (
                  <div className="text-right">
                    <p className="text-brand-text-light text-xs">เพื่อนได้</p>
                    <p className="font-bold text-brand-info">{reward.friendReward}</p>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Referred Friends */}
      <Card variant="elevated" className="border-none shadow-lg">
        <div className="p-5 border-b border-brand-border/50">
          <h3 className="text-lg font-bold text-brand-text-dark flex items-center gap-2">
            <Users className="w-5 h-5 text-brand-primary" />
            เพื่อนที่ชวนมา ({referredFriends.length})
          </h3>
        </div>
        <div className="divide-y divide-brand-border/30">
          {referredFriends.map((friend, index) => (
            <div key={index} className="flex items-center gap-4 p-4 hover:bg-brand-bg/30 transition-colors">
              <div className="w-12 h-12 rounded-full bg-brand-bg flex items-center justify-center text-xl font-bold text-brand-text-dark">
                {friend.avatar}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-brand-text-dark">{friend.name}</span>
                  {getStatusBadge(friend.status)}
                </div>
                <p className="text-sm text-brand-text-light mt-1">
                  เข้าร่วมเมื่อ {new Date(friend.joinedAt).toLocaleDateString("th-TH", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  })}
                </p>
              </div>
              <div className="text-right">
                <p className="font-bold text-brand-success">+฿{friend.earnedForYou}</p>
                <p className="text-xs text-brand-text-light">รายได้จากเพื่อน</p>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Tips */}
      <Card variant="elevated" className="border-none shadow-lg bg-gradient-to-r from-brand-secondary/30 to-transparent">
        <div className="p-5 flex items-start gap-4">
          <div className="p-3 bg-white rounded-xl shadow-sm">
            <Sparkles className="w-6 h-6 text-brand-accent" />
          </div>
          <div>
            <h3 className="font-bold text-brand-text-dark mb-1">
              เคล็ดลับ: ยิ่งชวนเยอะ ยิ่งได้เยอะ!
            </h3>
            <p className="text-sm text-brand-text-light">
              ชวนเพื่อน 10 คน + เพื่อนทำครบ 50 งานทุกคน = ฿800+
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
}
