"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronRight, Home } from "lucide-react";
import { cn } from "@/lib/utils";

// Path to label mapping for Seller Center
const PATH_LABELS: Record<string, string> = {
  seller: "Seller Center",
  orders: "ออเดอร์",
  services: "บริการ",
  team: "ทีม",
  store: "ร้านค้า",
  analytics: "Analytics",
  finance: "การเงิน",
  settings: "ตั้งค่า",
  verification: "ยืนยันตัวตน",
  bank: "บัญชีรับเงิน",
  subscription: "จัดการแพ็คเกจ",
  api: "ความปลอดภัย",
  new: "สร้างใหม่",
  members: "สมาชิก",
  jobs: "งาน",
  review: "ตรวจสอบงาน",
  payouts: "จ่ายเงิน",
  outsource: "จ้างงาน",
  privacy: "ความเป็นส่วนตัว",
  notifications: "การแจ้งเตือน",
  danger: "โซนอันตราย",
};

interface BreadcrumbProps {
  className?: string;
  homeHref?: string;
  homeLabel?: string;
}

export function Breadcrumb({ 
  className,
  homeHref = "/seller",
  homeLabel = "หน้าแรก"
}: BreadcrumbProps) {
  const pathname = usePathname();
  
  // Split path and filter empty strings
  const pathSegments = pathname.split("/").filter(Boolean);
  
  // Don't show breadcrumb on home page
  if (pathSegments.length <= 1) {
    return null;
  }

  // Build breadcrumb items
  const breadcrumbItems = pathSegments.map((segment, index) => {
    // Build the href for this segment
    const href = "/" + pathSegments.slice(0, index + 1).join("/");
    
    // Check if this is a dynamic segment (like [id])
    const isDynamic = segment.match(/^[a-f0-9-]{8,}$/i) || segment.match(/^\d+$/);
    
    // Get label
    let label = PATH_LABELS[segment] || segment;
    if (isDynamic) {
      // For dynamic segments, try to get a meaningful label
      // or just show a shortened version
      label = segment.length > 8 ? `#${segment.slice(0, 8)}...` : `#${segment}`;
    }
    
    const isLast = index === pathSegments.length - 1;
    
    return {
      href,
      label,
      isLast,
      isDynamic,
    };
  });

  return (
    <nav 
      aria-label="Breadcrumb" 
      className={cn("flex items-center text-sm", className)}
    >
      <ol className="flex items-center gap-1 flex-wrap">
        {/* Home Link */}
        <li className="flex items-center">
          <Link
            href={homeHref}
            className="flex items-center gap-1.5 text-brand-text-light hover:text-brand-primary transition-colors p-1 -ml-1 rounded-md hover:bg-brand-bg"
          >
            <Home className="w-4 h-4" />
            <span className="hidden sm:inline">{homeLabel}</span>
          </Link>
        </li>

        {/* Path Segments */}
        {breadcrumbItems.slice(1).map((item, index) => (
          <li key={item.href} className="flex items-center">
            <ChevronRight className="w-4 h-4 text-brand-text-light/50 mx-1" />
            {item.isLast ? (
              <span className="font-medium text-brand-text-dark px-1">
                {item.label}
              </span>
            ) : (
              <Link
                href={item.href}
                className="text-brand-text-light hover:text-brand-primary transition-colors p-1 rounded-md hover:bg-brand-bg"
              >
                {item.label}
              </Link>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
