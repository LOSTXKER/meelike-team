"use client";

import { useState, useEffect } from "react";
import { Card, Badge, Skeleton } from "@/components/ui";
import { Container, Section } from "@/components/layout";
import { PageHeader } from "@/components/shared";
import {
  Trophy,
  Medal,
  Crown,
  Star,
  TrendingUp,
  Users,
  Flame,
  Gift,
  ChevronUp,
  ChevronDown,
  Minus,
} from "lucide-react";

interface LeaderboardEntry {
  rank: number;
  previousRank: number;
  name: string;
  avatar: string;
  jobsCompleted: number;
  earnings: number;
  streak: number;
  isCurrentUser: boolean;
}

const weeklyLeaderboard: LeaderboardEntry[] = [
  { rank: 1, previousRank: 1, name: "นุ่น", avatar: "น", jobsCompleted: 156, earnings: 1240, streak: 7, isCurrentUser: true },
  { rank: 2, previousRank: 3, name: "มิ้นท์", avatar: "ม", jobsCompleted: 134, earnings: 1080, streak: 5, isCurrentUser: false },
  { rank: 3, previousRank: 2, name: "เบส", avatar: "เ", jobsCompleted: 121, earnings: 980, streak: 4, isCurrentUser: false },
  { rank: 4, previousRank: 5, name: "แบม", avatar: "แ", jobsCompleted: 98, earnings: 780, streak: 3, isCurrentUser: false },
  { rank: 5, previousRank: 4, name: "โอ๊ต", avatar: "โ", jobsCompleted: 87, earnings: 650, streak: 6, isCurrentUser: false },
  { rank: 6, previousRank: 7, name: "เฟิร์น", avatar: "เ", jobsCompleted: 76, earnings: 590, streak: 2, isCurrentUser: false },
  { rank: 7, previousRank: 6, name: "แก้ว", avatar: "แ", jobsCompleted: 72, earnings: 540, streak: 4, isCurrentUser: false },
  { rank: 8, previousRank: 10, name: "บอส", avatar: "บ", jobsCompleted: 65, earnings: 480, streak: 1, isCurrentUser: false },
  { rank: 9, previousRank: 8, name: "เนย", avatar: "เ", jobsCompleted: 58, earnings: 420, streak: 3, isCurrentUser: false },
  { rank: 10, previousRank: 9, name: "แนน", avatar: "แ", jobsCompleted: 52, earnings: 380, streak: 2, isCurrentUser: false },
];

interface WeeklyReward {
  rank: number;
  reward: string;
  iconName: "crown" | "medal";
  color: string;
  bg: string;
}

const weeklyRewards: WeeklyReward[] = [
  { rank: 1, reward: "+฿200", iconName: "crown", color: "text-yellow-500", bg: "bg-yellow-500/10" },
  { rank: 2, reward: "+฿100", iconName: "medal", color: "text-gray-400", bg: "bg-gray-400/10" },
  { rank: 3, reward: "+฿50", iconName: "medal", color: "text-amber-600", bg: "bg-amber-600/10" },
];

export default function LeaderboardPage() {
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => { const t = setTimeout(() => setIsLoading(false), 300); return () => clearTimeout(t); }, []);

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Crown className="w-6 h-6 text-yellow-500 fill-yellow-500" />;
      case 2:
        return <Medal className="w-6 h-6 text-gray-400" />;
      case 3:
        return <Medal className="w-6 h-6 text-amber-600" />;
      default:
        return <span className="text-lg font-bold text-brand-text-light">{rank}</span>;
    }
  };

  const getRankChange = (current: number, previous: number) => {
    const diff = previous - current;
    if (diff > 0) {
      return (
        <span className="flex items-center gap-0.5 text-xs font-bold text-brand-success">
          <ChevronUp className="w-3 h-3" />
          {diff}
        </span>
      );
    } else if (diff < 0) {
      return (
        <span className="flex items-center gap-0.5 text-xs font-bold text-brand-error">
          <ChevronDown className="w-3 h-3" />
          {Math.abs(diff)}
        </span>
      );
    }
    return (
      <span className="text-xs text-brand-text-light">
        <Minus className="w-3 h-3" />
      </span>
    );
  };

  if (isLoading) {
    return (
      <Container size="lg">
        <Section spacing="md" className="animate-fade-in">
          <Skeleton className="h-8 w-48" />
          <div className="grid grid-cols-3 gap-4">
            {[1, 2, 3].map(i => <Skeleton key={i} className="h-24 rounded-xl" />)}
          </div>
          <div className="space-y-3">
            {[1, 2, 3, 4, 5].map(i => <Skeleton key={i} className="h-16 rounded-xl" />)}
          </div>
        </Section>
      </Container>
    );
  }

  return (
    <Container size="lg">
      <Section spacing="md" className="animate-fade-in">
        {/* Header */}
        <PageHeader
          title="Top Workers"
          description="อันดับ Worker ประจำสัปดาห์นี้"
          icon={Trophy}
        />

        {/* Stats Cards */}
        <div className="grid grid-cols-3 gap-4">
        <Card variant="elevated" className="border-none shadow-md text-center p-5">
          <div className="p-3 bg-brand-primary/10 rounded-xl w-fit mx-auto mb-3">
            <Users className="w-6 h-6 text-brand-primary" />
          </div>
          <p className="text-2xl font-bold text-brand-text-dark">1,234</p>
          <p className="text-xs text-brand-text-light font-medium">Workers ทั้งหมด</p>
        </Card>
        <Card variant="elevated" className="border-none shadow-md text-center p-5">
          <div className="p-3 bg-brand-success/10 rounded-xl w-fit mx-auto mb-3">
            <TrendingUp className="w-6 h-6 text-brand-success" />
          </div>
          <p className="text-2xl font-bold text-brand-text-dark">8,456</p>
          <p className="text-xs text-brand-text-light font-medium">งานสัปดาห์นี้</p>
        </Card>
        <Card variant="elevated" className="border-none shadow-md text-center p-5">
          <div className="p-3 bg-brand-warning/10 rounded-xl w-fit mx-auto mb-3">
            <Gift className="w-6 h-6 text-brand-warning" />
          </div>
          <p className="text-2xl font-bold text-brand-text-dark">฿350</p>
          <p className="text-xs text-brand-text-light font-medium">รางวัลรวม</p>
        </Card>
      </div>

      {/* Rewards Info */}
      <Card variant="elevated" className="border-none shadow-lg bg-gradient-to-r from-brand-secondary/30 to-brand-secondary/10">
        <div className="p-5">
          <h3 className="text-lg font-bold text-brand-text-dark mb-4 flex items-center gap-2">
            <Gift className="w-5 h-5 text-brand-accent" />
            รางวัลประจำสัปดาห์
          </h3>
          <div className="grid grid-cols-3 gap-4">
            {weeklyRewards.map((reward) => (
              <div
                key={reward.rank}
                className={`p-4 rounded-xl ${reward.bg} text-center`}
              >
                <div className={`${reward.color} mx-auto mb-2`}>
                  {reward.iconName === "crown" ? <Crown className="w-5 h-5" /> : <Medal className="w-5 h-5" />}
                </div>
                <p className="text-sm font-medium text-brand-text-light">อันดับ {reward.rank}</p>
                <p className={`text-xl font-bold ${reward.color}`}>{reward.reward}</p>
              </div>
            ))}
          </div>
        </div>
      </Card>

      {/* Leaderboard Table */}
      <Card variant="elevated" className="border-none shadow-lg overflow-hidden">
        <div className="p-5 border-b border-brand-border/50">
          <h3 className="text-lg font-bold text-brand-text-dark flex items-center gap-2">
            <Trophy className="w-5 h-5 text-brand-warning" />
            อันดับประจำสัปดาห์
          </h3>
          <p className="text-sm text-brand-text-light mt-1">
            อัปเดตทุกวันจันทร์ 00:00
          </p>
        </div>
        
        <div className="divide-y divide-brand-border/30">
          {weeklyLeaderboard.map((entry) => (
            <div
              key={entry.rank}
              className={`flex items-center gap-4 p-4 transition-colors ${
                entry.isCurrentUser
                  ? "bg-brand-primary/5 border-l-4 border-l-brand-primary"
                  : "hover:bg-brand-bg/30"
              }`}
            >
              {/* Rank */}
              <div className="w-12 h-12 flex items-center justify-center">
                {getRankIcon(entry.rank)}
              </div>

              {/* Avatar */}
              <div className={`w-12 h-12 rounded-full flex items-center justify-center text-xl font-bold ${
                entry.rank === 1
                  ? "bg-gradient-to-br from-yellow-400 to-yellow-600 text-white"
                  : entry.rank === 2
                  ? "bg-gradient-to-br from-gray-300 to-gray-500 text-white"
                  : entry.rank === 3
                  ? "bg-gradient-to-br from-amber-400 to-amber-600 text-white"
                  : "bg-brand-bg text-brand-text-dark"
              }`}>
                {entry.avatar}
              </div>

              {/* Info */}
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-brand-text-dark">
                    {entry.name}
                  </span>
                  {entry.isCurrentUser && (
                    <Badge variant="info" size="sm">คุณ</Badge>
                  )}
                  {entry.streak >= 7 && (
                    <span className="flex items-center gap-1 text-xs font-bold text-orange-500 bg-orange-500/10 px-2 py-0.5 rounded-full">
                      <Flame className="w-3 h-3" />
                      {entry.streak}
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-3 text-sm text-brand-text-light mt-1">
                  <span>{entry.jobsCompleted} งาน</span>
                  <span className="w-1 h-1 rounded-full bg-brand-border" />
                  <span className="text-brand-success font-medium">฿{entry.earnings}</span>
                </div>
              </div>

              {/* Rank Change */}
              <div className="text-right">
                {getRankChange(entry.rank, entry.previousRank)}
              </div>

              {/* Reward Badge for Top 3 */}
              {entry.rank <= 3 && (
                <div className={`px-3 py-1.5 rounded-lg font-bold text-sm ${
                  entry.rank === 1
                    ? "bg-yellow-500/10 text-yellow-600"
                    : entry.rank === 2
                    ? "bg-gray-400/10 text-gray-500"
                    : "bg-amber-500/10 text-amber-600"
                }`}>
                  {weeklyRewards.find(r => r.rank === entry.rank)?.reward}
                </div>
              )}
            </div>
          ))}
        </div>
      </Card>
      </Section>
    </Container>
  );
}
