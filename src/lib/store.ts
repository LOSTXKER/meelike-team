import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type { AuthUser, Seller, Worker } from "@/types";
import { createClient } from "@/lib/supabase/client";

function setAuthCookie(role: string) {
  if (typeof document !== "undefined") {
    document.cookie = `meelike-auth-role=${role}; path=/; max-age=${60 * 60 * 24}; SameSite=Lax`;
  }
}

function clearAuthCookie() {
  if (typeof document !== "undefined") {
    document.cookie = "meelike-auth-role=; path=/; max-age=0";
  }
}

// ===== AUTH STORE =====

interface AuthState {
  user: AuthUser | null;
  isLoading: boolean;
  hasHydrated: boolean;

  login: (email: string, password: string, role: "seller" | "worker" | "admin") => Promise<boolean>;
  loginDemo: (role: "seller" | "worker" | "admin") => Promise<boolean>;
  logout: () => Promise<void>;
  refreshToken: () => boolean;
  setUser: (user: AuthUser | null) => void;
  setHasHydrated: (state: boolean) => void;

  isAuthenticated: () => boolean;
  isSeller: () => boolean;
  isWorker: () => boolean;
  isAdmin: () => boolean;
  getUserId: () => string | null;
  getUserRole: () => "seller" | "worker" | "admin" | null;
  getToken: () => string | null;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      isLoading: false,
      hasHydrated: false,

      login: async (email: string, password: string, role: "seller" | "worker" | "admin") => {
        set({ isLoading: true });

        try {
          const supabase = createClient();
          const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password,
          });

          if (error) {
            console.error("Supabase login error:", error.message);
            set({ isLoading: false });
            return false;
          }

          const session = data.session;
          const supaUser = data.user;

          // Fetch the full user profile from our DB via API
          let seller: Seller | undefined;
          let worker: Worker | undefined;

          try {
            if (role === "seller" || role === "admin") {
              const res = await fetch("/api/seller/subscription", {
                headers: { Authorization: `Bearer ${session.access_token}` },
              });
              if (res.ok) {
                // Seller exists - fetch seller profile
                seller = {
                  id: supaUser.id,
                  userId: supaUser.id,
                  displayName: supaUser.user_metadata?.name ?? email.split("@")[0],
                  name: supaUser.user_metadata?.name ?? email.split("@")[0],
                  slug: email.split("@")[0].toLowerCase(),
                  plan: "free",
                  subscription: "free",
                  sellerRank: "bronze",
                  platformFeePercent: 0,
                  rollingAvgSpend: 0,
                  totalSpentOnWorkers: 0,
                  balance: 0,
                  totalOrders: 0,
                  totalRevenue: 0,
                  rating: 0,
                  ratingCount: 0,
                  isActive: true,
                  isVerified: false,
                  theme: "meelike",
                  createdAt: supaUser.created_at,
                  updatedAt: supaUser.created_at,
                } as Seller;
              }
            }
          } catch {
            // Profile fetch failed, continue with basic user
          }

          const authUser: AuthUser = {
            id: supaUser.id,
            email: supaUser.email ?? email,
            role,
            seller,
            worker,
            isAdmin: role === "admin",
            token: session.access_token,
            refreshToken: session.refresh_token,
            tokenExpiresAt: session.expires_at ? session.expires_at * 1000 : undefined,
          };

          setAuthCookie(role);
          set({ user: authUser, isLoading: false });
          return true;
        } catch (error) {
          console.error("Login error:", error);
          set({ isLoading: false });
          return false;
        }
      },

      loginDemo: async (role: "seller" | "worker" | "admin") => {
        set({ isLoading: true });

        try {
          // Call demo endpoint to ensure user exists
          const demoRes = await fetch("/api/auth/demo", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ role }),
          });

          if (!demoRes.ok) {
            console.error("Demo setup failed");
            set({ isLoading: false });
            return false;
          }

          const { email, password } = await demoRes.json();

          // Now sign in with the demo credentials
          return get().login(email, password, role);
        } catch (error) {
          console.error("Demo login error:", error);
          set({ isLoading: false });
          return false;
        }
      },

      logout: async () => {
        try {
          const supabase = createClient();
          await supabase.auth.signOut();
        } catch {
          // ignore signout errors
        }
        clearAuthCookie();
        set({ user: null, isLoading: false });
      },

      refreshToken: () => {
        // Supabase handles token refresh automatically
        return true;
      },

      setUser: (user) => set({ user }),
      setHasHydrated: (state) => set({ hasHydrated: state }),

      isAuthenticated: () => !!get().user?.token,
      isSeller: () => get().user?.role === "seller",
      isWorker: () => get().user?.role === "worker",
      isAdmin: () => get().user?.role === "admin" || get().user?.isAdmin === true,
      getUserId: () => get().user?.id ?? null,
      getUserRole: () => get().user?.role ?? null,
      getToken: () => get().user?.token ?? null,
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
