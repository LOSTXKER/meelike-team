"use client";

import { useState } from "react";
import { Info, AlertTriangle, Lightbulb, ChevronDown, ChevronUp } from "lucide-react";

interface ContextualHelpProps {
  type?: "info" | "warning" | "tip";
  title?: string;
  content: string | React.ReactNode;
  collapsible?: boolean;
  defaultOpen?: boolean;
  className?: string;
}

export function ContextualHelp({
  type = "info",
  title,
  content,
  collapsible = false,
  defaultOpen = true,
  className = "",
}: ContextualHelpProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  const typeConfig = {
    info: {
      icon: Info,
      bgColor: "bg-brand-info/5",
      borderColor: "border-brand-info/20",
      iconColor: "text-brand-info",
      textColor: "text-brand-text-dark",
    },
    warning: {
      icon: AlertTriangle,
      bgColor: "bg-brand-warning/5",
      borderColor: "border-brand-warning/20",
      iconColor: "text-brand-warning",
      textColor: "text-brand-text-dark",
    },
    tip: {
      icon: Lightbulb,
      bgColor: "bg-brand-success/5",
      borderColor: "border-brand-success/20",
      iconColor: "text-brand-success",
      textColor: "text-brand-text-dark",
    },
  };

  const config = typeConfig[type];
  const Icon = config.icon;

  return (
    <div
      className={`
        ${config.bgColor} ${config.borderColor}
        border rounded-xl p-4 animate-fade-in
        ${className}
      `}
    >
      <div className="flex items-start gap-3">
        {/* Icon */}
        <div className={`${config.iconColor} flex-shrink-0 mt-0.5`}>
          <Icon className="w-5 h-5" />
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          {/* Header */}
          {(title || collapsible) && (
            <div
              className={`
                flex items-center justify-between gap-2 mb-2
                ${collapsible ? "cursor-pointer" : ""}
              `}
              onClick={() => collapsible && setIsOpen(!isOpen)}
            >
              {title && (
                <h4 className={`font-bold ${config.textColor}`}>
                  {title}
                </h4>
              )}
              {collapsible && (
                <button
                  className={`${config.iconColor} hover:opacity-70 transition-opacity`}
                  aria-label={isOpen ? "ซ่อน" : "แสดง"}
                >
                  {isOpen ? (
                    <ChevronUp className="w-4 h-4" />
                  ) : (
                    <ChevronDown className="w-4 h-4" />
                  )}
                </button>
              )}
            </div>
          )}

          {/* Body */}
          {(!collapsible || isOpen) && (
            <div className="text-sm text-brand-text-light leading-relaxed">
              {typeof content === "string" ? (
                <p>{content}</p>
              ) : (
                content
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
