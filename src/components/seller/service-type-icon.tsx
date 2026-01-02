"use client";

import { SERVICE_TYPE_CONFIGS } from "@/lib/constants/services";
import type { ServiceType } from "@/types";

interface ServiceTypeIconProps {
  type: ServiceType;
  size?: "sm" | "md" | "lg";
  showLabel?: boolean;
  useEmoji?: boolean;
  className?: string;
}

const sizeMap = {
  sm: "w-3 h-3",
  md: "w-3.5 h-3.5",
  lg: "w-4 h-4",
};

export function ServiceTypeIcon({ 
  type, 
  size = "md", 
  showLabel = false,
  useEmoji = false,
  className = ""
}: ServiceTypeIconProps) {
  const config = SERVICE_TYPE_CONFIGS[type];
  if (!config) return null;

  const Icon = config.icon;
  const iconSize = sizeMap[size];

  return (
    <span className={`inline-flex items-center gap-1 ${className}`}>
      {useEmoji ? (
        <span className="text-sm">{config.emoji}</span>
      ) : (
        <Icon className={iconSize} />
      )}
      {showLabel && (
        <span className="text-sm">{config.labelTh}</span>
      )}
    </span>
  );
}
