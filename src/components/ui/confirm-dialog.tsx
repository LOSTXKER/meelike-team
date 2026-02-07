"use client";

import { create } from "zustand";
import { Dialog } from "./Dialog";
import { Button } from "./button";
import { AlertTriangle, Trash2, HelpCircle } from "lucide-react";

// ===== STORE =====

interface ConfirmOptions {
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  variant?: "danger" | "warning" | "default";
}

interface ConfirmStore {
  isOpen: boolean;
  options: ConfirmOptions | null;
  resolve: ((value: boolean) => void) | null;
  open: (options: ConfirmOptions) => Promise<boolean>;
  close: (result: boolean) => void;
}

export const useConfirmStore = create<ConfirmStore>((set, get) => ({
  isOpen: false,
  options: null,
  resolve: null,
  open: (options) =>
    new Promise<boolean>((resolve) => {
      set({ isOpen: true, options, resolve });
    }),
  close: (result) => {
    const { resolve } = get();
    resolve?.(result);
    set({ isOpen: false, options: null, resolve: null });
  },
}));

// ===== HOOK =====

export function useConfirm() {
  const open = useConfirmStore((s) => s.open);
  return open;
}

// ===== RENDERER =====

const VARIANT_CONFIG = {
  danger: {
    icon: Trash2,
    iconBg: "bg-red-100",
    iconColor: "text-red-600",
    buttonVariant: "danger" as const,
  },
  warning: {
    icon: AlertTriangle,
    iconBg: "bg-amber-100",
    iconColor: "text-amber-600",
    buttonVariant: "warning" as const,
  },
  default: {
    icon: HelpCircle,
    iconBg: "bg-blue-100",
    iconColor: "text-blue-600",
    buttonVariant: "primary" as const,
  },
};

export function ConfirmDialog() {
  const { isOpen, options, close } = useConfirmStore();

  if (!isOpen || !options) return null;

  const config = VARIANT_CONFIG[options.variant || "default"];
  const Icon = config.icon;

  return (
    <Dialog open={isOpen} onClose={() => close(false)} size="sm">
      <Dialog.Body className="pt-6">
        <div className="flex flex-col items-center text-center">
          <div
            className={`w-12 h-12 rounded-full ${config.iconBg} flex items-center justify-center mb-4`}
          >
            <Icon className={`w-6 h-6 ${config.iconColor}`} />
          </div>
          <h3 className="text-lg font-semibold text-brand-text-dark mb-2">
            {options.title}
          </h3>
          <p className="text-sm text-brand-text-light">{options.message}</p>
        </div>
      </Dialog.Body>
      <Dialog.Footer className="justify-center">
        <Button variant="outline" size="sm" onClick={() => close(false)}>
          {options.cancelLabel || "ยกเลิก"}
        </Button>
        <Button
          variant={config.buttonVariant}
          size="sm"
          onClick={() => close(true)}
        >
          {options.confirmLabel || "ยืนยัน"}
        </Button>
      </Dialog.Footer>
    </Dialog>
  );
}
