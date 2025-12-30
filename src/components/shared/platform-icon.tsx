"use client";

import { cn } from "@/lib/utils";
import { Facebook, Instagram, Youtube, Twitter, Smartphone, Music2 } from "lucide-react";
import type { Platform } from "@/types";

const platformIcons = {
  facebook: Facebook,
  instagram: Instagram,
  tiktok: Music2,
  youtube: Youtube,
  twitter: Twitter,
} as const;

const platformColors = {
  facebook: "text-blue-600",
  instagram: "text-pink-600",
  tiktok: "text-gray-900",
  youtube: "text-red-600",
  twitter: "text-sky-500",
} as const;

interface PlatformIconProps {
  platform: Platform;
  size?: "sm" | "md" | "lg";
  showColor?: boolean;
  className?: string;
}

const sizeClasses = {
  sm: "w-4 h-4",
  md: "w-5 h-5",
  lg: "w-6 h-6",
};

export function PlatformIcon({ platform, size = "md", showColor = true, className }: PlatformIconProps) {
  const Icon = platformIcons[platform] || Smartphone;
  const colorClass = showColor ? platformColors[platform] || "text-gray-500" : "";
  
  return <Icon className={cn(sizeClasses[size], colorClass, className)} />;
}

