"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/lib/store";
import type { UserRole } from "@/types";

interface UseRequireAuthOptions {
  requiredRole?: UserRole;
  redirectTo?: string;
  redirectIfWrongRole?: string;
}

export function useRequireAuth(options: UseRequireAuthOptions = {}) {
  const { requiredRole, redirectTo = "/login", redirectIfWrongRole } = options;
  const router = useRouter();
  const { user, hasHydrated, isLoading } = useAuthStore();

  useEffect(() => {
    if (!hasHydrated) return;

    // Not logged in
    if (!user) {
      const loginUrl = requiredRole
        ? `${redirectTo}?role=${requiredRole}`
        : redirectTo;
      router.push(loginUrl);
      return;
    }

    // Wrong role
    if (requiredRole && user.role !== requiredRole && redirectIfWrongRole) {
      router.push(redirectIfWrongRole);
    }
  }, [user, hasHydrated, requiredRole, redirectTo, redirectIfWrongRole, router]);

  const isAuthenticated = hasHydrated && !!user;
  const hasCorrectRole = !requiredRole || user?.role === requiredRole;
  const isReady = hasHydrated && isAuthenticated && hasCorrectRole;

  return {
    user,
    isLoading: !hasHydrated || isLoading,
    isAuthenticated,
    hasCorrectRole,
    isReady,
    seller: user?.seller,
    worker: user?.worker,
  };
}

