"use client";

import { useState } from "react";
import { Card, Badge, Skeleton } from "@/components/ui";
import { SegmentedControl } from "@/components/shared";
import { useLeaderboard } from "@/lib/api/hooks/hub";
import type { LeaderboardType, LeaderboardPeriod } from "@/lib/api/hub/leaderboard";
import {
  Trophy,
  Crown,
  Star,
  Users,
  Briefcase,
  ShoppingBag,
} from "lucide-react";
import { cn } from "@/lib/utils";

const typeOptions = [
  { key: "workers" as LeaderboardType, label: "Workers" },
  { key: "sellers" as LeaderboardType, label: "Sellers" },
  { key: "teams" as LeaderboardType, label: "Teams" },
];

const periodOptions: { key: LeaderboardPeriod; label: string }[] = [
  { key: "week", label: "สัปดาห์นี้" },
  { key: "month", label: "เดือนนี้" },
  { key: "all", label: "ตลอดกาล" },
];

const typeIcons: Record<LeaderboardType, typeof Briefcase> = {
  workers: Briefcase,
  sellers: ShoppingBag,
  teams: Users,
};

const typeLabels: Record<LeaderboardType, { score: string; subtitle: string }> = {
  workers: { score: "งาน", subtitle: "อันดับ Worker ที่ทำงานเก่งที่สุด" },
  sellers: { score: "ออเดอร์", subtitle: "อันดับ Seller ที่จัดการออเดอร์มากที่สุด" },
  teams: { score: "งาน", subtitle: "อันดับทีมที่ทำงานสำเร็จมากที่สุด" },
};

const rankColors: Record<number, { bg: string; text: string; ring: string }> = {
  1: { bg: "bg-gradient-to-r from-yellow-50 to-yellow-100/50", text: "text-yellow-700", ring: "ring-yellow-400/50" },
  2: { bg: "bg-gradient-to-r from-gray-50 to-gray-100/50", text: "text-gray-500", ring: "ring-gray-300/50" },
  3: { bg: "bg-gradient-to-r from-amber-50 to-amber-100/50", text: "text-amber-700", ring: "ring-amber-400/50" },
};

const avatarGradients: Record<number, string> = {
  1: "from-yellow-400 to-yellow-600",
  2: "from-gray-300 to-gray-500",
  3: "from-amber-400 to-amber-600",
};

function getLevelBadge(level: string) {
  const config: Record<string, { label: string; color: string }> = {
    bronze: { label: "Bronze", color: "bg-amber-100 text-amber-700" },
    silver: { label: "Silver", color: "bg-gray-100 text-gray-600" },
    gold: { label: "Gold", color: "bg-yellow-100 text-yellow-700" },
    platinum: { label: "Platinum", color: "bg-cyan-100 text-cyan-700" },
    vip: { label: "VIP", color: "bg-purple-100 text-purple-700" },
  };
  const c = config[level] || config.bronze;
  return <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${c.color}`}>{c.label}</span>;
}

function getPlanBadge(plan: string) {
  const config: Record<string, { label: string; color: string }> = {
    free: { label: "Free", color: "bg-gray-100 text-gray-600" },
    starter: { label: "Starter", color: "bg-blue-100 text-blue-700" },
    pro: { label: "Pro", color: "bg-brand-primary/10 text-brand-primary" },
    business: { label: "Business", color: "bg-purple-100 text-purple-700" },
    enterprise: { label: "Enterprise", color: "bg-amber-100 text-amber-700" },
  };
  const c = config[plan] || config.free;
  return <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${c.color}`}>{c.label}</span>;
}

function RankBadge({ rank }: { rank: number }) {
  if (rank === 1) return <Crown className="w-5 h-5 text-yellow-500 fill-yellow-500" />;
  if (rank <= 3) {
    const colors = rank === 2 ? "from-gray-300 to-gray-500" : "from-amber-400 to-amber-600";
    return (
      <div className={`w-6 h-6 rounded-full bg-gradient-to-br ${colors} flex items-center justify-center text-white text-xs font-bold`}>
        {rank}
      </div>
    );
  }
  return <span className="text-sm font-bold text-brand-text-light w-6 text-center">{rank}</span>;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function EntryMeta({ entry, type }: { entry: any; type: LeaderboardType }) {
  if (type === "workers") {
    return (
      <div className="flex items-center gap-2 flex-wrap">
        {getLevelBadge(entry.level)}
        {entry.rating > 0 && (
          <span className="flex items-center gap-0.5 text-xs text-brand-text-light">
            <Star className="w-3 h-3 text-yellow-500 fill-yellow-500" />
            {entry.rating.toFixed(1)}
          </span>
        )}
        {entry.completionRate > 0 && (
          <span className="text-xs text-brand-text-light">{entry.completionRate}%</span>
        )}
      </div>
    );
  }
  if (type === "sellers") {
    return (
      <div className="flex items-center gap-2 flex-wrap">
        {getPlanBadge(entry.plan)}
        <span className="flex items-center gap-0.5 text-xs text-brand-text-light">
          <Users className="w-3 h-3" /> {entry.teamCount} ทีม
        </span>
      </div>
    );
  }
  return (
    <div className="flex items-center gap-2 flex-wrap">
      <span className="flex items-center gap-0.5 text-xs text-brand-text-light">
        <Users className="w-3 h-3" /> {entry.memberCount} คน
      </span>
      {entry.rating > 0 && (
        <span className="flex items-center gap-0.5 text-xs text-brand-text-light">
          <Star className="w-3 h-3 text-yellow-500 fill-yellow-500" />
          {entry.rating.toFixed(1)}
        </span>
      )}
    </div>
  );
}

export default function LeaderboardPage() {
  const [type, setType] = useState<LeaderboardType>("workers");
  const [period, setPeriod] = useState<LeaderboardPeriod>("all");
  const { data, isLoading } = useLeaderboard(type, period);

  const entries = data?.entries || [];
  const labels = typeLabels[type];
  const TypeIcon = typeIcons[type];

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="p-2.5 bg-brand-warning/10 rounded-xl">
          <Trophy className="w-6 h-6 text-brand-warning" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-brand-text-dark">Leaderboard</h1>
          <p className="text-sm text-brand-text-light">{labels.subtitle}</p>
        </div>
      </div>

      {/* Type Tabs */}
      <SegmentedControl options={typeOptions} activeOption={type} onChange={setType} />

      {/* Period Filter */}
      <div className="flex gap-2">
        {periodOptions.map((opt) => (
          <button
            key={opt.key}
            onClick={() => setPeriod(opt.key)}
            className={cn(
              "px-4 py-1.5 rounded-full text-sm font-medium transition-all",
              period === opt.key
                ? "bg-brand-primary text-white shadow-sm"
                : "bg-brand-bg text-brand-text-light hover:text-brand-text-dark hover:bg-brand-surface border border-brand-border/50"
            )}
          >
            {opt.label}
          </button>
        ))}
      </div>

      {/* Loading */}
      {isLoading && (
        <Card variant="elevated" className="border-none shadow-md divide-y divide-brand-border/30">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="flex items-center gap-3 p-4">
              <Skeleton className="w-6 h-6 rounded-full" />
              <Skeleton className="w-10 h-10 rounded-full" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-3 w-20" />
              </div>
              <Skeleton className="h-5 w-12" />
            </div>
          ))}
        </Card>
      )}

      {/* Empty State */}
      {!isLoading && entries.length === 0 && (
        <Card variant="elevated" className="border-none shadow-md text-center py-16">
          <div className="p-4 bg-brand-bg rounded-full w-fit mx-auto mb-4">
            <TypeIcon className="w-8 h-8 text-brand-text-light" />
          </div>
          <p className="text-brand-text-light font-medium">ยังไม่มีข้อมูลสำหรับช่วงเวลานี้</p>
        </Card>
      )}

      {/* Leaderboard List */}
      {!isLoading && entries.length > 0 && (
        <>
          {/* List */}
          <Card variant="elevated" className="border-none shadow-lg overflow-hidden">
            <div className="divide-y divide-brand-border/30">
              {entries.map((entry) => {
                const e = entry as { id: string; rank: number; name: string; score: number };
                const isTop3 = e.rank <= 3;
                const rc = rankColors[e.rank];

                return (
                  <div
                    key={e.id}
                    className={cn(
                      "flex items-center gap-3 px-4 py-3.5 transition-colors hover:bg-brand-bg/30",
                      isTop3 && rc?.bg,
                      isTop3 && "ring-1 ring-inset",
                      isTop3 && rc?.ring
                    )}
                  >
                    {/* Rank */}
                    <div className="w-8 flex items-center justify-center shrink-0">
                      <RankBadge rank={e.rank} />
                    </div>

                    {/* Avatar */}
                    <div
                      className={cn(
                        "w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm shrink-0",
                        isTop3
                          ? `bg-gradient-to-br ${avatarGradients[e.rank]} text-white shadow-md`
                          : "bg-brand-bg text-brand-text-dark border border-brand-border/50"
                      )}
                    >
                      {e.name.charAt(0).toUpperCase()}
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <p className={cn(
                        "font-bold text-sm truncate",
                        isTop3 ? "text-brand-text-dark" : "text-brand-text-dark"
                      )}>
                        {e.name}
                      </p>
                      <EntryMeta entry={entry} type={type} />
                    </div>

                    {/* Score */}
                    <div className="text-right shrink-0">
                      <p className={cn(
                        "font-bold tabular-nums",
                        isTop3 ? "text-base text-brand-primary" : "text-sm text-brand-text-dark"
                      )}>
                        {e.score.toLocaleString()}
                      </p>
                      <p className="text-[10px] text-brand-text-light">{labels.score}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </Card>
        </>
      )}
    </div>
  );
}
