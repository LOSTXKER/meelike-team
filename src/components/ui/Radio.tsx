"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

interface RadioOption {
  value: string;
  label: string;
  description?: string;
}

interface RadioGroupProps {
  value: string;
  onChange: (value: string) => void;
  options: RadioOption[];
  name: string;
  className?: string;
}

export const RadioGroup: React.FC<RadioGroupProps> = ({
  value,
  onChange,
  options,
  name,
  className
}) => {
  return (
    <div className={cn("space-y-3", className)}>
      {options.map((option) => (
        <label
          key={option.value}
          className="flex items-start gap-3 p-3 rounded-lg border border-brand-border/50 cursor-pointer hover:bg-brand-bg/30 transition-colors has-[:checked]:border-brand-primary has-[:checked]:bg-brand-primary/5"
        >
          <input
            type="radio"
            name={name}
            value={option.value}
            checked={value === option.value}
            onChange={(e) => onChange(e.target.value)}
            className="mt-0.5 w-4 h-4 border-gray-300 text-brand-primary focus:ring-2 focus:ring-brand-primary focus:ring-offset-2 cursor-pointer"
          />
          <div className="flex-1">
            <span className="text-sm font-medium text-brand-text-dark">{option.label}</span>
            {option.description && (
              <p className="text-xs text-brand-text-light mt-0.5">{option.description}</p>
            )}
          </div>
        </label>
      ))}
    </div>
  );
};
