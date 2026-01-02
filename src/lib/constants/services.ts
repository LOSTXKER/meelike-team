import { 
  Facebook, 
  Instagram, 
  Music2, 
  Youtube,
  Heart,
  MessageCircle,
  UserPlus,
  Play,
  Share2,
} from "lucide-react";
import type { Platform, ServiceType } from "@/types";

// Platform configurations with icons
export const PLATFORM_CONFIGS: Record<Platform, {
  label: string;
  icon: typeof Facebook;
  color: string;
  bgColor: string;
}> = {
  facebook: {
    label: "Facebook",
    icon: Facebook,
    color: "text-blue-600",
    bgColor: "bg-blue-50",
  },
  instagram: {
    label: "Instagram",
    icon: Instagram,
    color: "text-pink-600",
    bgColor: "bg-pink-50",
  },
  tiktok: {
    label: "TikTok",
    icon: Music2,
    color: "text-black",
    bgColor: "bg-gray-100",
  },
  youtube: {
    label: "YouTube",
    icon: Youtube,
    color: "text-red-600",
    bgColor: "bg-red-50",
  },
  twitter: {
    label: "Twitter",
    icon: Facebook, // placeholder
    color: "text-sky-500",
    bgColor: "bg-sky-50",
  },
};

// Service type configurations with icons
export const SERVICE_TYPE_CONFIGS: Record<ServiceType, {
  label: string;
  labelTh: string;
  icon: typeof Heart;
  emoji: string;
}> = {
  like: {
    label: "Like",
    labelTh: "ไลค์",
    icon: Heart,
    emoji: "❤️",
  },
  comment: {
    label: "Comment",
    labelTh: "เม้น",
    icon: MessageCircle,
    emoji: "💬",
  },
  follow: {
    label: "Follow",
    labelTh: "ติดตาม",
    icon: UserPlus,
    emoji: "👥",
  },
  view: {
    label: "View",
    labelTh: "วิว",
    icon: Play,
    emoji: "👁️",
  },
  share: {
    label: "Share",
    labelTh: "แชร์",
    icon: Share2,
    emoji: "↗️",
  },
};

// Service mode (Bot/Human) configurations with full details
export const SERVICE_MODE_CONFIGS = {
  bot: {
    label: "งานเว็บ",
    labelEn: "Bot",
    description: "เร็ว ราคาถูก",
    color: "text-blue-600",
    bgColor: "bg-blue-50",
    borderColor: "border-blue-200",
  },
  human: {
    label: "งานกดมือ",
    labelEn: "Human",
    description: "คุณภาพสูง",
    color: "text-green-600",
    bgColor: "bg-green-50",
    borderColor: "border-green-200",
  },
};

// Filter options
export const PLATFORM_FILTER_OPTIONS = [
  { value: "all", label: "ทุกแพลตฟอร์ม" },
  ...Object.entries(PLATFORM_CONFIGS).map(([value, config]) => ({
    value,
    label: config.label,
  })),
];

export const SERVICE_TYPE_FILTER_OPTIONS = [
  { value: "all", label: "ทุกประเภท" },
  ...Object.entries(SERVICE_TYPE_CONFIGS).map(([value, config]) => ({
    value,
    label: config.labelTh,
  })),
];

export const SERVICE_MODE_FILTER_OPTIONS = [
  { value: "all", label: "ทั้งหมด" },
  { value: "bot", label: "งานเว็บ" },
  { value: "human", label: "งานกดมือ" },
];

// Visibility options
export const VISIBILITY_OPTIONS = [
  { value: "true", label: "🌐 แสดงในร้าน" },
  { value: "false", label: "🔒 ซ่อนจากร้าน" },
];
