import type { Platform, ServiceType, ServiceMode } from "@/types";

export const PLATFORMS: Record<Platform, { label: string; color: string }> = {
  facebook: { label: "Facebook", color: "text-blue-600" },
  instagram: { label: "Instagram", color: "text-pink-600" },
  tiktok: { label: "TikTok", color: "text-gray-900" },
  youtube: { label: "YouTube", color: "text-red-600" },
  twitter: { label: "Twitter", color: "text-sky-500" },
};

export const SERVICE_TYPES: Record<ServiceType, { label: string; labelTh: string }> = {
  like: { label: "Like", labelTh: "ไลค์" },
  comment: { label: "Comment", labelTh: "คอมเมนต์" },
  follow: { label: "Follow", labelTh: "ติดตาม" },
  share: { label: "Share", labelTh: "แชร์" },
  view: { label: "View", labelTh: "ยอดวิว" },
};

export const SERVICE_MODES: Record<ServiceMode, { label: string; labelTh: string; variant: "info" | "success" }> = {
  bot: { label: "Bot", labelTh: "Bot", variant: "info" },
  human: { label: "Human", labelTh: "คนจริง", variant: "success" },
};

export const PLATFORM_LIST = Object.entries(PLATFORMS).map(([value, config]) => ({
  value: value as Platform,
  ...config,
}));

export const SERVICE_TYPE_LIST = Object.entries(SERVICE_TYPES).map(([value, config]) => ({
  value: value as ServiceType,
  ...config,
}));

