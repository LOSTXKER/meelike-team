"use client";

import { Card } from "@/components/ui";
import { Crown, Medal, Star, Gem, Award, Check, Trophy } from "lucide-react";

interface LevelBenefit {
  level: string;
  icon: React.ReactNode;
  color: string;
  bgColor: string;
  jobsRequired: string;
  badge: string;
  hubVisibility: string;
  trustLabel: string;
  leaderboard: boolean;
}

const levelBenefits: LevelBenefit[] = [
  {
    level: "Bronze",
    icon: <Medal className="w-5 h-5" />,
    color: "text-amber-600",
    bgColor: "bg-amber-100",
    jobsRequired: "0–50",
    badge: "Bronze Worker",
    hubVisibility: "—",
    trustLabel: "ใหม่",
    leaderboard: false,
  },
  {
    level: "Silver",
    icon: <Medal className="w-5 h-5" />,
    color: "text-gray-500",
    bgColor: "bg-gray-100",
    jobsRequired: "51–200",
    badge: "Silver Worker",
    hubVisibility: "แสดงใน Hub",
    trustLabel: "น่าเชื่อถือ",
    leaderboard: true,
  },
  {
    level: "Gold",
    icon: <Star className="w-5 h-5" />,
    color: "text-yellow-500",
    bgColor: "bg-yellow-100",
    jobsRequired: "201–500",
    badge: "Trusted Worker",
    hubVisibility: "Trusted Worker",
    trustLabel: "Trusted",
    leaderboard: true,
  },
  {
    level: "Platinum",
    icon: <Gem className="w-5 h-5" />,
    color: "text-cyan-500",
    bgColor: "bg-cyan-100",
    jobsRequired: "501–1K",
    badge: "Expert Worker",
    hubVisibility: "Expert Worker",
    trustLabel: "Expert",
    leaderboard: true,
  },
  {
    level: "VIP",
    icon: <Crown className="w-5 h-5" />,
    color: "text-purple-500",
    bgColor: "bg-purple-100",
    jobsRequired: "1K+",
    badge: "Top Worker",
    hubVisibility: "Top Worker (หน้าแรก)",
    trustLabel: "Top",
    leaderboard: true,
  },
];

interface LevelBenefitsTableProps {
  currentLevel?: string;
  className?: string;
}

export function LevelBenefitsTable({ currentLevel = "bronze", className = "" }: LevelBenefitsTableProps) {
  return (
    <Card variant="elevated" className={`border-none shadow-lg overflow-hidden ${className}`}>
      <div className="p-5 border-b border-brand-border/50">
        <h3 className="text-lg font-bold text-brand-text-dark flex items-center gap-2">
          <Award className="w-5 h-5 text-brand-primary" />
          ระดับและสิทธิประโยชน์
        </h3>
        <p className="text-sm text-brand-text-light mt-1">
          ทำงานมากขึ้น รับ badge และการยอมรับในชุมชนมากขึ้น!
        </p>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-brand-bg/50">
              <th className="text-left text-xs font-bold text-brand-text-light uppercase tracking-wider p-4">
                Level
              </th>
              <th className="text-center text-xs font-bold text-brand-text-light uppercase tracking-wider p-4">
                งานสำเร็จ
              </th>
              <th className="text-center text-xs font-bold text-brand-text-light uppercase tracking-wider p-4">
                Badge
              </th>
              <th className="text-center text-xs font-bold text-brand-text-light uppercase tracking-wider p-4">
                Hub
              </th>
              <th className="text-center text-xs font-bold text-brand-text-light uppercase tracking-wider p-4">
                Leaderboard
              </th>
            </tr>
          </thead>
          <tbody>
            {levelBenefits.map((benefit) => {
              const isCurrentLevel = benefit.level.toLowerCase() === currentLevel.toLowerCase();
              return (
                <tr
                  key={benefit.level}
                  className={`border-t border-brand-border/30 transition-colors ${
                    isCurrentLevel
                      ? "bg-brand-primary/5 border-l-4 border-l-brand-primary"
                      : "hover:bg-brand-bg/30"
                  }`}
                >
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-lg ${benefit.bgColor} ${benefit.color}`}>
                        {benefit.icon}
                      </div>
                      <div>
                        <span className={`font-bold ${benefit.color}`}>
                          {benefit.level}
                        </span>
                        {isCurrentLevel && (
                          <span className="ml-2 text-xs bg-brand-primary text-white px-2 py-0.5 rounded-full">
                            ปัจจุบัน
                          </span>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="p-4 text-center">
                    <span className="font-medium text-brand-text-dark">
                      {benefit.jobsRequired}
                    </span>
                  </td>
                  <td className="p-4 text-center">
                    <span className={`text-xs font-semibold px-2 py-1 rounded-full ${benefit.bgColor} ${benefit.color}`}>
                      {benefit.badge}
                    </span>
                  </td>
                  <td className="p-4 text-center">
                    {benefit.hubVisibility === "—" ? (
                      <span className="text-brand-text-light text-sm">—</span>
                    ) : (
                      <span className={`text-xs font-medium ${benefit.color}`}>
                        {benefit.hubVisibility}
                      </span>
                    )}
                  </td>
                  <td className="p-4 text-center">
                    {benefit.leaderboard ? (
                      <span className="inline-flex items-center gap-1 text-brand-success font-bold">
                        <Trophy className="w-4 h-4" />
                        <Check className="w-3.5 h-3.5" />
                      </span>
                    ) : (
                      <span className="text-brand-text-light text-sm">—</span>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </Card>
  );
}
