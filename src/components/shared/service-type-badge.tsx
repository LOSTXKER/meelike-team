"use client";

import { Badge } from "@/components/ui";
import { Bot, Users } from "lucide-react";
import type { ServiceMode } from "@/types";

interface ServiceTypeBadgeProps {
  type: ServiceMode;
  size?: "sm" | "md";
  showIcon?: boolean;
}

export function ServiceTypeBadge({ type, size = "sm", showIcon = true }: ServiceTypeBadgeProps) {
  const isBot = type === "bot";
  
  return (
    <Badge variant={isBot ? "bot" : "human"} size={size}>
      {showIcon && (
        isBot 
          ? <Bot className="w-3 h-3 mr-1" /> 
          : <Users className="w-3 h-3 mr-1" />
      )}
      {isBot ? "Bot" : "คนจริง"}
    </Badge>
  );
}

