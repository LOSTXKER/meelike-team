/**
 * Formatting Utilities
 * 
 * Functions for formatting data for display
 */

// ===== CURRENCY FORMATTING =====

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("th-TH", {
    style: "currency",
    currency: "THB",
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(amount);
}

export function formatNumber(num: number, decimals?: number): string {
  return new Intl.NumberFormat("th-TH", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(num);
}

export function formatPercentage(value: number, decimals: number = 1): string {
  return new Intl.NumberFormat("th-TH", {
    style: "percent",
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(value / 100);
}

// ===== DATE FORMATTING =====

export function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString("th-TH", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export function formatDateTime(dateString: string): string {
  return new Date(dateString).toLocaleString("th-TH", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function formatTime(dateString: string): string {
  return new Date(dateString).toLocaleTimeString("th-TH", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function formatTimeAgo(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (seconds < 60) return "เมื่อสักครู่";
  if (seconds < 3600) return `${Math.floor(seconds / 60)} นาทีที่แล้ว`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)} ชั่วโมงที่แล้ว`;
  if (seconds < 604800) return `${Math.floor(seconds / 86400)} วันที่แล้ว`;
  if (seconds < 2592000) return `${Math.floor(seconds / 604800)} สัปดาห์ที่แล้ว`;
  if (seconds < 31536000) return `${Math.floor(seconds / 2592000)} เดือนที่แล้ว`;
  return `${Math.floor(seconds / 31536000)} ปีที่แล้ว`;
}

export function formatDuration(seconds: number): string {
  if (seconds < 60) return `${seconds} วินาที`;
  if (seconds < 3600) return `${Math.floor(seconds / 60)} นาที`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)} ชั่วโมง`;
  return `${Math.floor(seconds / 86400)} วัน`;
}

// ===== TEXT FORMATTING =====

export function formatPhone(phone: string): string {
  // Format as XXX-XXX-XXXX
  const cleaned = phone.replace(/\D/g, "");
  if (cleaned.length === 10) {
    return `${cleaned.slice(0, 3)}-${cleaned.slice(3, 6)}-${cleaned.slice(6)}`;
  }
  return phone;
}

export function formatPromptPay(number: string): string {
  const cleaned = number.replace(/\D/g, "");
  // Format phone number style
  if (cleaned.length === 10) {
    return formatPhone(cleaned);
  }
  // Format ID card style (X-XXXX-XXXXX-XX-X)
  if (cleaned.length === 13) {
    return `${cleaned.slice(0, 1)}-${cleaned.slice(1, 5)}-${cleaned.slice(5, 10)}-${cleaned.slice(10, 12)}-${cleaned.slice(12)}`;
  }
  return number;
}

export function truncate(text: string, maxLength: number, suffix: string = "..."): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength - suffix.length) + suffix;
}

export function capitalize(text: string): string {
  return text.charAt(0).toUpperCase() + text.slice(1);
}

export function capitalizeWords(text: string): string {
  return text.split(" ").map(capitalize).join(" ");
}

// ===== FILE SIZE FORMATTING =====

export function formatFileSize(bytes: number): string {
  if (bytes === 0) return "0 Bytes";
  
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB", "TB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return Math.round(bytes / Math.pow(k, i) * 100) / 100 + " " + sizes[i];
}

// ===== COMPACT NUMBER FORMATTING =====

export function formatCompactNumber(num: number): string {
  if (num < 1000) return num.toString();
  if (num < 1000000) return (num / 1000).toFixed(1) + "K";
  if (num < 1000000000) return (num / 1000000).toFixed(1) + "M";
  return (num / 1000000000).toFixed(1) + "B";
}

// ===== FORMATTER OBJECT =====

export const formatters = {
  currency: formatCurrency,
  number: formatNumber,
  percentage: formatPercentage,
  date: formatDate,
  dateTime: formatDateTime,
  time: formatTime,
  timeAgo: formatTimeAgo,
  duration: formatDuration,
  phone: formatPhone,
  promptPay: formatPromptPay,
  truncate,
  capitalize,
  capitalizeWords,
  fileSize: formatFileSize,
  compactNumber: formatCompactNumber,
} as const;
