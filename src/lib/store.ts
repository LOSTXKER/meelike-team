import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type { AuthUser } from "@/types";
import { mockSeller, mockWorkers } from "./mock-data";

interface AuthState {
  user: AuthUser | null;
  isLoading: boolean;
  hasHydrated: boolean;
  login: (email: string, password: string, role: "seller" | "worker") => Promise<boolean>;
  logout: () => void;
  setUser: (user: AuthUser | null) => void;
  setHasHydrated: (state: boolean) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isLoading: false,
      hasHydrated: false,
      login: async (email: string, _password: string, role: "seller" | "worker") => {
        set({ isLoading: true });
        
        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 500));
        
        if (role === "seller") {
          const user: AuthUser = {
            id: mockSeller.userId,
            email,
            role: "seller",
            seller: mockSeller,
          };
          set({ user, isLoading: false });
          return true;
        } else {
          const worker = mockWorkers[0];
          const user: AuthUser = {
            id: worker.userId,
            email,
            role: "worker",
            worker,
          };
          set({ user, isLoading: false });
          return true;
        }
      },
      logout: () => {
        set({ user: null });
      },
      setUser: (user) => set({ user }),
      setHasHydrated: (state) => set({ hasHydrated: state }),
    }),
    {
      name: "meelike-auth",
      storage: createJSONStorage(() => localStorage),
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true);
      },
    }
  )
);

interface AppState {
  sidebarOpen: boolean;
  darkMode: boolean;
  toggleSidebar: () => void;
  toggleDarkMode: () => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      sidebarOpen: true,
      darkMode: false,
      toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
      toggleDarkMode: () => {
        set((state) => {
          const newDarkMode = !state.darkMode;
          if (typeof document !== "undefined") {
            document.documentElement.classList.toggle("dark", newDarkMode);
          }
          return { darkMode: newDarkMode };
        });
      },
    }),
    {
      name: "meelike-app",
    }
  )
);

