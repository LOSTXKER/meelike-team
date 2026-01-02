import { tokens } from "./tokens";

export const animations = {
  fadeIn: "animate-fade-in",
  fadeOut: "animate-fade-out",
  slideInLeft: "animate-slide-in-left",
  slideInRight: "animate-slide-in-right",
  slideInUp: "animate-slide-in-up",
  slideInDown: "animate-slide-in-down",
  scaleIn: "animate-scale-in",
  spin: "animate-spin",
} as const;

// Animation utilities
export const createTransition = (
  property: string,
  duration: keyof typeof tokens.transitions = "base"
) => ({
  transition: `${property} ${tokens.transitions[duration]}`,
});

// Export type
export type AnimationKey = keyof typeof animations;
