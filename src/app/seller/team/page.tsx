"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

// This page now redirects to the main dashboard
// Team management is now integrated into /seller
export default function TeamPickerRedirect() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/seller");
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <p className="text-brand-text-light">กำลังโหลด...</p>
    </div>
  );
}
