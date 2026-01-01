"use client";

import { Card } from "@/components/ui";
import { Crown, Medal, Award, Star, Gem, Check, X } from "lucide-react";

interface LevelBenefit {
  level: string;
  icon: React.ReactNode;
  color: string;
  bgColor: string;
  jobsRequired: string;
  withdrawFee: string;
  minWithdraw: string;
  expressWithdraw: string;
  bonus: string;
}

const levelBenefits: LevelBenefit[] = [
  {
    level: "Bronze",
    icon: <Medal className="w-5 h-5" />,
    color: "text-amber-600",
    bgColor: "bg-amber-100",
    jobsRequired: "0-50",
    withdrawFee: "3%",
    minWithdraw: "฿100",
    expressWithdraw: "+฿15",
    bonus: "-",
  },
  {
    level: "Silver",
    icon: <Medal className="w-5 h-5" />,
    color: "text-gray-500",
    bgColor: "bg-gray-100",
    jobsRequired: "51-200",
    withdrawFee: "2.5%",
    minWithdraw: "฿80",
    expressWithdraw: "+฿10",
    bonus: "-",
  },
  {
    level: "Gold",
    icon: <Star className="w-5 h-5" />,
    color: "text-yellow-500",
    bgColor: "bg-yellow-100",
    jobsRequired: "201-500",
    withdrawFee: "2%",
    minWithdraw: "฿50",
    expressWithdraw: "ฟรี",
    bonus: "+5%",
  },
  {
    level: "Platinum",
    icon: <Gem className="w-5 h-5" />,
    color: "text-cyan-500",
    bgColor: "bg-cyan-100",
    jobsRequired: "501-1K",
    withdrawFee: "1.5%",
    minWithdraw: "฿30",
    expressWithdraw: "ฟรี",
    bonus: "+10%",
  },
  {
    level: "VIP",
    icon: <Crown className="w-5 h-5" />,
    color: "text-purple-500",
    bgColor: "bg-purple-100",
    jobsRequired: "1K+",
    withdrawFee: "1%",
    minWithdraw: "฿0",
    expressWithdraw: "ฟรี",
    bonus: "+15%",
  },
];

interface LevelBenefitsTableProps {
  currentLevel?: string;
  className?: string;
}

export function LevelBenefitsTable({ currentLevel = "gold", className = "" }: LevelBenefitsTableProps) {
  return (
    <Card variant="elevated" className={`border-none shadow-lg overflow-hidden ${className}`}>
      <div className="p-5 border-b border-brand-border/50">
        <h3 className="text-lg font-bold text-brand-text-dark flex items-center gap-2">
          <Award className="w-5 h-5 text-brand-primary" />
          ระดับและสิทธิประโยชน์
        </h3>
        <p className="text-sm text-brand-text-light mt-1">
          ทำงานมากขึ้น รับสิทธิพิเศษมากขึ้น!
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
                ค่าถอน
              </th>
              <th className="text-center text-xs font-bold text-brand-text-light uppercase tracking-wider p-4">
                ถอนขั้นต่ำ
              </th>
              <th className="text-center text-xs font-bold text-brand-text-light uppercase tracking-wider p-4">
                ถอนด่วน
              </th>
              <th className="text-center text-xs font-bold text-brand-text-light uppercase tracking-wider p-4">
                Bonus
              </th>
            </tr>
          </thead>
          <tbody>
            {levelBenefits.map((benefit, index) => {
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
                    <span className={`font-bold ${
                      parseFloat(benefit.withdrawFee) <= 2 ? "text-brand-success" : "text-brand-text-dark"
                    }`}>
                      {benefit.withdrawFee}
                    </span>
                  </td>
                  <td className="p-4 text-center">
                    <span className="font-medium text-brand-text-dark">
                      {benefit.minWithdraw}
                    </span>
                  </td>
                  <td className="p-4 text-center">
                    {benefit.expressWithdraw === "ฟรี" ? (
                      <span className="inline-flex items-center gap-1 text-brand-success font-bold">
                        <Check className="w-4 h-4" />
                        ฟรี
                      </span>
                    ) : (
                      <span className="text-brand-text-light font-medium">
                        {benefit.expressWithdraw}
                      </span>
                    )}
                  </td>
                  <td className="p-4 text-center">
                    {benefit.bonus === "-" ? (
                      <span className="text-brand-text-light">-</span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-brand-success font-bold bg-brand-success/10 px-2 py-0.5 rounded-lg">
                        {benefit.bonus}
                      </span>
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
