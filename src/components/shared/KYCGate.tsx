"use client";

import { useState, useCallback } from "react";
import { KYCRequiredModal } from "./KYCRequiredModal";
import { QuickKYCModal } from "./QuickKYCModal";
import { useAuthStore } from "@/lib/store";
import type { KYCLevel } from "@/types";

export interface KYCGateProps {
  children: React.ReactNode;
  requiredLevel?: KYCLevel;
  action?: "topup" | "withdraw" | "general";
  onKYCComplete?: () => void;
  // If true, render children but show modal on interaction
  renderDisabled?: boolean;
}

// Helper to get current KYC level from user
function getCurrentKYCLevel(user: ReturnType<typeof useAuthStore>["user"]): KYCLevel {
  // Check worker KYC
  if (user?.worker?.kyc?.level) {
    return user.worker.kyc.level;
  }
  // Check seller KYC
  if (user?.seller?.kyc?.level) {
    return user.seller.kyc.level;
  }
  // Default: none (user only verified email during registration)
  return "none";
}

// Helper to check if KYC level meets requirement
function meetsKYCRequirement(currentLevel: KYCLevel, requiredLevel: KYCLevel): boolean {
  const levelOrder: KYCLevel[] = ["none", "basic", "verified", "business"];
  return levelOrder.indexOf(currentLevel) >= levelOrder.indexOf(requiredLevel);
}

/**
 * KYCGate - A wrapper component that checks KYC level before allowing actions
 * 
 * Usage:
 * ```tsx
 * <KYCGate requiredLevel="basic" action="withdraw">
 *   <Button onClick={handleWithdraw}>ถอนเงิน</Button>
 * </KYCGate>
 * ```
 */
export function KYCGate({
  children,
  requiredLevel = "basic",
  action = "general",
  onKYCComplete,
  renderDisabled = false,
}: KYCGateProps) {
  const { user } = useAuthStore();
  const [showRequiredModal, setShowRequiredModal] = useState(false);
  const [showQuickKYCModal, setShowQuickKYCModal] = useState(false);

  const currentLevel = getCurrentKYCLevel(user);
  const hasRequiredLevel = meetsKYCRequirement(currentLevel, requiredLevel);
  const userType = user?.role || "seller";
  const existingPhone = user?.seller?.phone || user?.worker?.phone || "";

  const handleStartKYC = useCallback(() => {
    setShowRequiredModal(false);
    // For basic level, show quick KYC modal (phone verification)
    if (requiredLevel === "basic") {
      setShowQuickKYCModal(true);
    } else {
      // For higher levels, redirect to verification page
      const verificationUrl = userType === "seller" 
        ? "/seller/settings/verification" 
        : "/work/profile/verification";
      window.location.href = verificationUrl;
    }
  }, [requiredLevel, userType]);

  const handleKYCSuccess = useCallback(() => {
    setShowQuickKYCModal(false);
    onKYCComplete?.();
  }, [onKYCComplete]);

  // If user has required level, just render children
  if (hasRequiredLevel) {
    return <>{children}</>;
  }

  // If renderDisabled is true, render children but intercept clicks
  if (renderDisabled) {
    return (
      <>
        <div onClick={() => setShowRequiredModal(true)}>
          {children}
        </div>

        <KYCRequiredModal
          isOpen={showRequiredModal}
          onClose={() => setShowRequiredModal(false)}
          onStartKYC={handleStartKYC}
          requiredLevel={requiredLevel}
          currentLevel={currentLevel}
          action={action}
          userType={userType}
        />

        <QuickKYCModal
          isOpen={showQuickKYCModal}
          onClose={() => setShowQuickKYCModal(false)}
          onSuccess={handleKYCSuccess}
          existingPhone={existingPhone}
          action={action}
        />
      </>
    );
  }

  // Default: Show KYC required modal instead of children
  return (
    <>
      <KYCRequiredModal
        isOpen={true}
        onClose={() => window.history.back()}
        onStartKYC={handleStartKYC}
        requiredLevel={requiredLevel}
        currentLevel={currentLevel}
        action={action}
        userType={userType}
      />

      <QuickKYCModal
        isOpen={showQuickKYCModal}
        onClose={() => setShowQuickKYCModal(false)}
        onSuccess={handleKYCSuccess}
        existingPhone={existingPhone}
        action={action}
      />
    </>
  );
}

/**
 * useKYCGate - Hook version for more flexible usage
 */
export function useKYCGate(requiredLevel: KYCLevel = "basic") {
  const { user } = useAuthStore();
  const [showModal, setShowModal] = useState(false);
  const [showQuickKYC, setShowQuickKYC] = useState(false);

  const currentLevel = getCurrentKYCLevel(user);
  const hasRequiredLevel = meetsKYCRequirement(currentLevel, requiredLevel);

  const checkKYC = useCallback(() => {
    if (!hasRequiredLevel) {
      setShowModal(true);
      return false;
    }
    return true;
  }, [hasRequiredLevel]);

  const startKYC = useCallback(() => {
    setShowModal(false);
    if (requiredLevel === "basic") {
      setShowQuickKYC(true);
    }
  }, [requiredLevel]);

  return {
    hasRequiredLevel,
    currentLevel,
    checkKYC,
    showModal,
    setShowModal,
    showQuickKYC,
    setShowQuickKYC,
    startKYC,
  };
}

export default KYCGate;
