"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

/**
 * Redirect: /work/profile -> /work/settings
 * The profile page has been consolidated into the settings section.
 */
export default function WorkerProfileRedirect() {
  const router = useRouter();
  useEffect(() => {
    router.replace("/work/settings");
  }, [router]);
  return null;
}
