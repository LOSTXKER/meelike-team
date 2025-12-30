"use client";

import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";

interface LoadingScreenProps {
  message?: string;
  className?: string;
  fullScreen?: boolean;
}

export function LoadingScreen({
  message = "กำลังโหลด...",
  className,
  fullScreen = true,
}: LoadingScreenProps) {
  return (
    <div
      className={cn(
        "flex items-center justify-center bg-brand-bg",
        fullScreen && "min-h-screen",
        className
      )}
    >
      <div className="flex flex-col items-center gap-3">
        <Loader2 className="w-8 h-8 text-brand-primary animate-spin" />
        <p className="text-brand-text-light animate-pulse">{message}</p>
      </div>
    </div>
  );
}

