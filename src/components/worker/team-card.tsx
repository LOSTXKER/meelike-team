"use client";

import Link from "next/link";
import { Card, Badge, Avatar, Button } from "@/components/ui";
import { PlatformIcon } from "@/components/shared";
import { cn } from "@/lib/utils";
import type { Team, Platform } from "@/types";
import {
  Users,
  Star,
  ClipboardList,
  ArrowRight,
} from "lucide-react";

interface TeamCardProps {
  team: Team;
  /** Link destination */
  href?: string;
  /** Show action button */
  showAction?: boolean;
  /** Action button label */
  actionLabel?: string;
  /** On action click */
  onAction?: () => void;
  /** Compact display */
  compact?: boolean;
  /** Additional className */
  className?: string;
}

export function TeamCard({
  team,
  href,
  showAction = true,
  actionLabel = "ดูรายละเอียด",
  onAction,
  compact = false,
  className,
}: TeamCardProps) {
  const linkHref = href || `/work/teams/${team.id}`;

  const content = compact ? (
    <div className="flex items-center gap-3">
      <Avatar fallback={team.name} size="md" className="border-2 border-white shadow-sm" />
      <div className="flex-1 min-w-0">
        <p className="font-bold text-brand-text-dark truncate text-sm">{team.name}</p>
        <div className="flex items-center gap-2 mt-0.5">
          <span className="text-xs text-brand-text-light flex items-center gap-1">
            <Users className="w-3 h-3" />
            {team.memberCount} คน
          </span>
          {team.rating > 0 && (
            <span className="text-xs text-brand-warning flex items-center gap-1">
              <Star className="w-3 h-3 fill-current" />
              {team.rating.toFixed(1)}
            </span>
          )}
        </div>
      </div>
      {showAction && (
        <ArrowRight className="w-4 h-4 text-brand-text-light shrink-0" />
      )}
    </div>
  ) : (
    <>
      {/* Header */}
      <div className="flex items-start gap-4 mb-4">
        <Avatar fallback={team.name} size="xl" className="w-16 h-16 text-xl border-4 border-white shadow-sm" />
        <div className="flex-1 min-w-0">
          <h3 className="font-bold text-brand-text-dark text-lg truncate">{team.name}</h3>
          {team.description && (
            <p className="text-sm text-brand-text-light line-clamp-2 mt-1">{team.description}</p>
          )}
        </div>
      </div>

      {/* Stats */}
      <div className="flex items-center gap-4 mb-4">
        <div className="flex items-center gap-1.5 text-sm text-brand-text-light">
          <Users className="w-4 h-4" />
          <span>{team.memberCount} สมาชิก</span>
        </div>
        {team.rating > 0 && (
          <div className="flex items-center gap-1.5 text-sm text-brand-warning">
            <Star className="w-4 h-4 fill-current" />
            <span>{team.rating.toFixed(1)}</span>
          </div>
        )}
        <div className="flex items-center gap-1.5 text-sm text-brand-text-light">
          <ClipboardList className="w-4 h-4" />
          <span>{team.totalJobsCompleted || 0} งาน</span>
        </div>
      </div>

      {/* Platforms */}
      {team.platforms && team.platforms.length > 0 && (
        <div className="flex items-center gap-2 mb-4">
          {team.platforms.map((platform) => (
            <div
              key={platform}
              className="w-8 h-8 rounded-lg bg-brand-bg flex items-center justify-center border border-brand-border/30"
            >
              <PlatformIcon platform={platform as Platform} size="sm" />
            </div>
          ))}
        </div>
      )}

      {/* Action */}
      {showAction && (
        <Button
          variant="outline"
          size="sm"
          className="w-full"
          onClick={onAction}
          rightIcon={<ArrowRight className="w-4 h-4" />}
        >
          {actionLabel}
        </Button>
      )}
    </>
  );

  const card = (
    <Card
      className={cn(
        "border-none shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer",
        compact ? "p-3" : "p-5",
        className
      )}
    >
      {content}
    </Card>
  );

  if (href !== undefined || !onAction) {
    return <Link href={linkHref}>{card}</Link>;
  }

  return card;
}
