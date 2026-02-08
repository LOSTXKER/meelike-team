"use client";

/**
 * Social Media Accounts Settings Page
 *
 * This page redirects to the main accounts page.
 * It exists so the settings sidebar has a proper route.
 */

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function WorkerAccountsSettingsPage() {
  const router = useRouter();
  useEffect(() => {
    router.replace("/work/accounts");
  }, [router]);

  return null;
}
