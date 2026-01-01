"use client";

import { Card } from "@/components/ui";
import { Flame, CheckCircle2, Gift, Trophy } from "lucide-react";

interface StreakDay {
  day: string;
  completed: boolean;
  isToday: boolean;
}

interface StreakBonus {
  days: number;
  reward: string;
  achieved: boolean;
}

interface DailyStreakProps {
  currentStreak: number;
  streakDays?: StreakDay[];
  className?: string;
}

const defaultStreakDays: StreakDay[] = [
  { day: "จ", completed: true, isToday: false },
  { day: "อ", completed: true, isToday: false },
  { day: "พ", completed: true, isToday: false },
  { day: "พฤ", completed: true, isToday: false },
  { day: "ศ", completed: true, isToday: false },
  { day: "ส", completed: true, isToday: false },
  { day: "อา", completed: true, isToday: true },
];

const streakBonuses: StreakBonus[] = [
  { days: 3, reward: "+฿5", achieved: true },
  { days: 7, reward: "+฿15", achieved: true },
  { days: 14, reward: "+฿40", achieved: false },
  { days: 30, reward: "+฿100 + Badge", achieved: false },
];

export function DailyStreak({ 
  currentStreak = 7, 
  streakDays = defaultStreakDays,
  className = "" 
}: DailyStreakProps) {
  return (
    <Card variant="elevated" className={`border-none shadow-lg overflow-hidden ${className}`}>
      {/* Header */}
      <div className="p-5 bg-gradient-to-r from-brand-primary to-[#6D5E54] text-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-white/10 rounded-xl backdrop-blur-sm border border-white/20">
              <Flame className="w-6 h-6 text-brand-secondary fill-brand-secondary" />
            </div>
            <div>
              <h3 className="text-lg font-bold">Daily Streak</h3>
              <p className="text-white/80 text-sm">ทำงานต่อเนื่อง</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-4xl font-bold">{currentStreak}</p>
            <p className="text-white/80 text-sm">วันติดต่อกัน</p>
          </div>
        </div>
      </div>

      {/* Calendar View */}
      <div className="p-5">
        <div className="flex justify-between items-center mb-4">
          {streakDays.map((day, index) => (
            <div key={index} className="flex flex-col items-center gap-2">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
                  day.completed
                    ? day.isToday
                      ? "bg-brand-primary text-white shadow-lg shadow-brand-primary/30 ring-2 ring-brand-secondary ring-offset-2"
                      : "bg-brand-success/10 text-brand-success border border-brand-success/20"
                    : "bg-brand-bg border-2 border-brand-border border-dashed text-brand-text-light"
                }`}
              >
                {day.completed ? (
                  <CheckCircle2 className="w-5 h-5" />
                ) : (
                  <span className="w-2 h-2 rounded-full bg-brand-border" />
                )}
              </div>
              <span className={`text-xs font-medium ${
                day.isToday ? "text-brand-primary font-bold" : "text-brand-text-light"
              }`}>
                {day.day}
              </span>
            </div>
          ))}
        </div>

        {/* Today Status */}
        <div className="p-3 bg-brand-success/10 border border-brand-success/20 rounded-xl text-center mb-4">
          <p className="text-sm font-bold text-brand-success flex items-center justify-center gap-2">
            <CheckCircle2 className="w-4 h-4" />
            วันนี้ทำงานแล้ว!
          </p>
        </div>

        {/* Streak Bonuses */}
        <div className="space-y-2">
          <h4 className="text-sm font-bold text-brand-text-dark flex items-center gap-2">
            <Gift className="w-4 h-4 text-brand-accent" />
            Streak Bonus
          </h4>
          <div className="space-y-2">
            {streakBonuses.map((bonus, index) => (
              <div
                key={index}
                className={`flex items-center justify-between p-3 rounded-xl transition-all ${
                  bonus.achieved
                    ? "bg-brand-success/10 border border-brand-success/20"
                    : currentStreak >= bonus.days - 3 && currentStreak < bonus.days
                    ? "bg-brand-warning/10 border border-brand-warning/20"
                    : "bg-brand-bg/50 border border-brand-border/30"
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                    bonus.achieved 
                      ? "bg-brand-success text-white" 
                      : "bg-brand-border/50 text-brand-text-light"
                  }`}>
                    {bonus.achieved ? (
                      <CheckCircle2 className="w-4 h-4" />
                    ) : (
                      <span className="text-xs font-bold">{bonus.days}</span>
                    )}
                  </div>
                  <span className={`font-medium ${
                    bonus.achieved ? "text-brand-text-dark" : "text-brand-text-light"
                  }`}>
                    {bonus.days} วันติดต่อกัน
                  </span>
                </div>
                <span className={`font-bold ${
                  bonus.achieved ? "text-brand-success" : "text-brand-text-light"
                }`}>
                  {bonus.reward}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Card>
  );
}
