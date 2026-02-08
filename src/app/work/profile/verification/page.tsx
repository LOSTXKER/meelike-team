"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

/**
 * Redirect: /work/profile/verification -> /work/settings/verification
 * The verification page has been consolidated into the settings section.
 */
export default function WorkerVerificationRedirect() {
  const router = useRouter();
  useEffect(() => {
    router.replace("/work/settings/verification");
  }, [router]);
  return null;
}
