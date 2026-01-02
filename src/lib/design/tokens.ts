export const tokens = {
  // Spacing scale (4px base)
  space: {
    0: "0",
    1: "0.25rem",    // 4px
    2: "0.5rem",     // 8px
    3: "0.75rem",    // 12px
    4: "1rem",       // 16px
    5: "1.25rem",    // 20px
    6: "1.5rem",     // 24px
    8: "2rem",       // 32px
    10: "2.5rem",    // 40px
    12: "3rem",      // 48px
    16: "4rem",      // 64px
  },
  
  // Border radius
  radii: {
    none: "0",
    sm: "0.375rem",   // 6px
    md: "0.5rem",     // 8px
    lg: "0.75rem",    // 12px
    xl: "1rem",       // 16px
    "2xl": "1.5rem",  // 24px
    full: "9999px",
  },
  
  // Shadows
  shadows: {
    none: "none",
    sm: "var(--shadow-sm)",
    md: "var(--shadow)",
    lg: "var(--shadow-md)",
    xl: "var(--shadow-lg)",
  },
  
  // Transitions
  transitions: {
    fast: "150ms cubic-bezier(0.4, 0, 0.2, 1)",
    base: "200ms cubic-bezier(0.4, 0, 0.2, 1)",
    slow: "300ms cubic-bezier(0.4, 0, 0.2, 1)",
  },
  
  // Z-index layers
  zIndices: {
    base: 0,
    dropdown: 1000,
    sticky: 1100,
    fixed: 1200,
    modalBackdrop: 1300,
    modal: 1400,
    popover: 1500,
    tooltip: 1600,
  }
} as const;

// Export types for TypeScript
export type SpaceKey = keyof typeof tokens.space;
export type RadiiKey = keyof typeof tokens.radii;
export type ShadowKey = keyof typeof tokens.shadows;
export type TransitionKey = keyof typeof tokens.transitions;
export type ZIndexKey = keyof typeof tokens.zIndices;
