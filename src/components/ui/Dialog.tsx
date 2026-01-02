"use client";

import * as React from "react";
import { createContext, useContext, useEffect } from "react";
import { cn } from "@/lib/utils";
import { X } from "lucide-react";

interface DialogProps {
  open: boolean;
  onClose: () => void;
  children: React.ReactNode;
  size?: "sm" | "md" | "lg" | "xl" | "full";
}

interface DialogContextValue {
  onClose: () => void;
}

const DialogContext = createContext<DialogContextValue | null>(null);

export const Dialog: React.FC<DialogProps> & {
  Header: typeof DialogHeader;
  Title: typeof DialogTitle;
  Description: typeof DialogDescription;
  Body: typeof DialogBody;
  Footer: typeof DialogFooter;
} = ({
  open,
  onClose,
  children,
  size = "md"
}) => {
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
      
      const handleEscape = (e: KeyboardEvent) => {
        if (e.key === "Escape") onClose();
      };
      document.addEventListener("keydown", handleEscape);
      
      return () => {
        document.body.style.overflow = "unset";
        document.removeEventListener("keydown", handleEscape);
      };
    }
  }, [open, onClose]);
  
  if (!open) return null;
  
  const sizes = {
    sm: "max-w-sm",
    md: "max-w-md",
    lg: "max-w-lg",
    xl: "max-w-xl",
    full: "max-w-4xl",
  };
  
  return (
    <DialogContext.Provider value={{ onClose }}>
      <div className="fixed inset-0 z-modalBackdrop">
        <div
          className="fixed inset-0 bg-black/50 transition-opacity animate-fade-in"
          onClick={onClose}
        />
        
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <div
            className={cn(
              "w-full bg-white rounded-xl shadow-xl z-modal animate-scale-in",
              sizes[size]
            )}
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
          >
            {children}
          </div>
        </div>
      </div>
    </DialogContext.Provider>
  );
};

function DialogHeader({ children, className }: { children: React.ReactNode; className?: string }) {
  const context = useContext(DialogContext);
  if (!context) throw new Error("Dialog.Header must be used within Dialog");
  
  const { onClose } = context;
  
  return (
    <div className={cn("flex items-start justify-between p-6 border-b border-brand-border/30", className)}>
      <div className="flex-1">{children}</div>
      <button
        onClick={onClose}
        className="p-1 rounded-lg text-brand-text-light hover:text-brand-text-dark hover:bg-brand-bg transition-colors"
        aria-label="Close dialog"
      >
        <X className="w-5 h-5" />
      </button>
    </div>
  );
}

function DialogTitle({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <h2 className={cn("text-lg font-semibold text-brand-text-dark", className)}>
      {children}
    </h2>
  );
}

function DialogDescription({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <p className={cn("mt-1 text-sm text-brand-text-light", className)}>
      {children}
    </p>
  );
}

function DialogBody({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={cn("p-6 max-h-[60vh] overflow-y-auto", className)}>
      {children}
    </div>
  );
}

function DialogFooter({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={cn("flex items-center justify-end gap-3 p-6 border-t border-brand-border/30 bg-brand-bg/30", className)}>
      {children}
    </div>
  );
}

Dialog.Header = DialogHeader;
Dialog.Title = DialogTitle;
Dialog.Description = DialogDescription;
Dialog.Body = DialogBody;
Dialog.Footer = DialogFooter;
