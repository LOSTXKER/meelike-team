import { useState, useEffect } from "react";

export function useKeyboardNavigation<T>(
  items: T[],
  onSelect: (item: T) => void,
  isActive: boolean = true
) {
  const [activeIndex, setActiveIndex] = useState(0);
  
  useEffect(() => {
    if (!isActive || items.length === 0) return;
    
    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case "ArrowDown":
          e.preventDefault();
          setActiveIndex((prev) => Math.min(prev + 1, items.length - 1));
          break;
        case "ArrowUp":
          e.preventDefault();
          setActiveIndex((prev) => Math.max(prev - 1, 0));
          break;
        case "Enter":
          e.preventDefault();
          onSelect(items[activeIndex]);
          break;
        case "Home":
          e.preventDefault();
          setActiveIndex(0);
          break;
        case "End":
          e.preventDefault();
          setActiveIndex(items.length - 1);
          break;
      }
    };
    
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [items, activeIndex, onSelect, isActive]);
  
  return { activeIndex, setActiveIndex };
}
