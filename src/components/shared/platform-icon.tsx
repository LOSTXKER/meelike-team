"use client";

import { cn } from "@/lib/utils";
import { PLATFORM_CONFIGS } from "@/lib/constants/services";
import { Smartphone } from "lucide-react";
import type { Platform } from "@/types";

interface PlatformIconProps {
  platform: Platform;
  size?: "sm" | "md" | "lg";
  showColor?: boolean;
  showLabel?: boolean;
  showBackground?: boolean;
  className?: string;
}

const sizeClasses = {
  sm: "w-3.5 h-3.5",
  md: "w-4 h-4",
  lg: "w-5 h-5",
};

const bgSizeClasses = {
  sm: "p-1.5",
  md: "p-2",
  lg: "p-2.5",
};

export function PlatformIcon({ 
  platform, 
  size = "md", 
  showColor = true, 
  showLabel = false,
  showBackground = false,
  className = ""
}: PlatformIconProps) {
  const config = PLATFORM_CONFIGS[platform];
  
  // Fallback for unknown platforms
  if (!config) {
    return <Smartphone className={cn(sizeClasses[size], "text-gray-500", className)} />;
  }

  const Icon = config.icon;
  const iconSize = sizeClasses[size];
  const colorClass = showColor ? config.color : "text-brand-text-dark";

  // With background variant
  if (showBackground) {
    return (
      <span className={cn("inline-flex items-center gap-2", className)}>
        <span className={cn(bgSizeClasses[size], config.bgColor, "rounded-lg inline-flex")}>
          <Icon className={cn(iconSize, config.color)} />
        </span>
        {showLabel && (
          <span className="text-sm font-medium text-brand-text-dark">{config.label}</span>
        )}
      </span>
    );
  }

  // Default variant (use span for inline compatibility)
  return (
    <span className={cn("inline-flex items-center gap-1.5", className)}>
      <Icon className={cn(iconSize, colorClass)} />
      {showLabel && (
        <span className="text-sm text-brand-text-dark">{config.label}</span>
      )}
    </span>
  );
}
