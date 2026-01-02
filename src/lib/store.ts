import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type { AuthUser } from "@/types";
import { mockSeller, mockWorkers } from "./mock-data";

// ===== AUTH STORE =====

interface AuthState {
  user: AuthUser | null;
  isLoading: boolean;
  hasHydrated: boolean;
  
  // Actions
  login: (email: string, password: string, role: "seller" | "worker") => Promise<boolean>;
  logout: () => Promise<void>;
  setUser: (user: AuthUser | null) => void;
  setHasHydrated: (state: boolean) => void;
  
  // Computed values (as functions to always get fresh data)
  isAuthenticated: () => boolean;
  isSeller: () => boolean;
  isWorker: () => boolean;
  getUserId: () => string | null;
  getUserRole: () => "seller" | "worker" | null;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      isLoading: false,
      hasHydrated: false,
      
      // Actions
      login: async (email: string, _password: string, role: "seller" | "worker") => {
        set({ isLoading: true });
        
        try {
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
        } catch (error) {
          set({ isLoading: false });
          console.error("Login error:", error);
          return false;
        }
      },
      
      logout: async () => {
        // Could add API call here to invalidate session
        set({ user: null, isLoading: false });
      },
      
      setUser: (user) => set({ user }),
      setHasHydrated: (state) => set({ hasHydrated: state }),
      
      // Computed values
      isAuthenticated: () => !!get().user,
      isSeller: () => get().user?.role === "seller",
      isWorker: () => get().user?.role === "worker",
      getUserId: () => get().user?.id ?? null,
      getUserRole: () => get().user?.role ?? null,
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

// ===== APP UI STORE =====

interface AppState {
  sidebarOpen: boolean;
  darkMode: boolean;
  
  // Actions
  toggleSidebar: () => void;
  setSidebarOpen: (open: boolean) => void;
  toggleDarkMode: () => void;
  setDarkMode: (enabled: boolean) => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      sidebarOpen: true,
      darkMode: false,
      
      toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
      setSidebarOpen: (open) => set({ sidebarOpen: open }),
      
      toggleDarkMode: () => {
        const newDarkMode = !get().darkMode;
        set({ darkMode: newDarkMode });
        if (typeof document !== "undefined") {
          document.documentElement.classList.toggle("dark", newDarkMode);
        }
      },
      
      setDarkMode: (enabled) => {
        set({ darkMode: enabled });
        if (typeof document !== "undefined") {
          document.documentElement.classList.toggle("dark", enabled);
        }
      },
    }),
    {
      name: "meelike-app",
    }
  )
);

// ===== NOTIFICATION STORE =====

export interface Notification {
  id: string;
  type: "info" | "success" | "warning" | "error";
  title: string;
  message?: string;
  duration?: number;
  createdAt: number;
}

interface NotificationState {
  notifications: Notification[];
  
  // Actions
  addNotification: (notification: Omit<Notification, "id" | "createdAt">) => void;
  removeNotification: (id: string) => void;
  clearAllNotifications: () => void;
}

export const useNotificationStore = create<NotificationState>((set) => ({
  notifications: [],
  
  addNotification: (notification) => {
    const id = Math.random().toString(36).substring(7);
    const newNotification: Notification = {
      ...notification,
      id,
      createdAt: Date.now(),
    };
    
    set((state) => ({
      notifications: [...state.notifications, newNotification],
    }));
    
    // Auto remove after duration
    if (notification.duration !== 0) {
      setTimeout(() => {
        set((state) => ({
          notifications: state.notifications.filter((n) => n.id !== id),
        }));
      }, notification.duration || 5000);
    }
  },
  
  removeNotification: (id) => {
    set((state) => ({
      notifications: state.notifications.filter((n) => n.id !== id),
    }));
  },
  
  clearAllNotifications: () => set({ notifications: [] }),
}));