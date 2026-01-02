"use client";

import { PLATFORM_CONFIGS } from "@/lib/constants/services";
import type { Platform } from "@/types";

interface PlatformIconProps {
  platform: Platform;
  size?: "sm" | "md" | "lg";
  showLabel?: boolean;
  showBackground?: boolean;
  className?: string;
}

const sizeMap = {
  sm: "w-3.5 h-3.5",
  md: "w-4 h-4",
  lg: "w-5 h-5",
};

const bgSizeMap = {
  sm: "p-1.5",
  md: "p-2",
  lg: "p-2.5",
};

export function PlatformIcon({ 
  platform, 
  size = "md", 
  showLabel = false,
  showBackground = false,
  className = ""
}: PlatformIconProps) {
  const config = PLATFORM_CONFIGS[platform];
  if (!config) return null;

  const Icon = config.icon;
  const iconSize = sizeMap[size];

  if (showBackground) {
    return (
      <div className={`flex items-center gap-2 ${className}`}>
        <div className={`${bgSizeMap[size]} ${config.bgColor} rounded-lg`}>
          <Icon className={`${iconSize} ${config.color}`} />
        </div>
        {showLabel && (
          <span className="text-sm font-medium text-brand-text-dark">{config.label}</span>
        )}
      </div>
    );
  }

  return (
    <div className={`flex items-center gap-1.5 ${className}`}>
      <Icon className={`${iconSize} ${config.color}`} />
      {showLabel && (
        <span className="text-sm text-brand-text-dark">{config.label}</span>
      )}
    </div>
  );
}
