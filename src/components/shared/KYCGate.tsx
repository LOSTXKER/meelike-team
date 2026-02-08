"use client";

import { useState, useCallback } from "react";
import { KYCRequiredModal } from "./KYCRequiredModal";
import { QuickKYCModal } from "./QuickKYCModal";
import { useAuthStore } from "@/lib/store";
import { meetsKYCRequirement } from "@/types/kyc";
import type { KYCLevel, KYCAction, AuthUser } from "@/types";

export interface KYCGateProps {
  children: React.ReactNode;
  requiredLevel?: KYCLevel;
  action?: KYCAction;
  onKYCComplete?: () => void;
  /** If true, render children but show modal on interaction */
  renderDisabled?: boolean;
}

function getCurrentKYCLevel(user: AuthUser | null): KYCLevel {
  if (user?.worker?.kyc?.level) return user.worker.kyc.level;
  if (user?.seller?.kyc?.level) return user.seller.kyc.level;
  return "none";
}

/**
 * KYCGate - Always uses modal pattern (no redirect-to-page).
 * For basic: shows QuickKYC phone modal inline.
 * For higher: shows KYCRequired modal that directs to verification page.
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
  const userType: "seller" | "worker" =
    user?.role === "worker" ? "worker" : "seller";
  const existingPhone =
    user?.seller?.contactInfo?.phone || user?.worker?.phone || "";

  const handleStartKYC = useCallback(() => {
    setShowRequiredModal(false);
    if (requiredLevel === "basic") {
      // Inline phone verification — no page redirect
      setShowQuickKYCModal(true);
    } else {
      // For verified/business, navigate to verification page
      const verificationUrl =
        userType === "seller"
          ? "/seller/settings/verification"
          : "/work/settings/verification";
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

  // Modals shared by both modes
  const modals = (
    <>
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

  // renderDisabled: render children but intercept clicks
  if (renderDisabled) {
    return (
      <>
        <div
          onClick={(e) => {
            e.stopPropagation();
            e.preventDefault();
            setShowRequiredModal(true);
          }}
          className="[&>*]:pointer-events-none"
        >
          {children}
        </div>
        {modals}
      </>
    );
  }

  // Default: show the modal immediately
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
