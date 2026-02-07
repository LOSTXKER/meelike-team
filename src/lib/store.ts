import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type { AuthUser, Seller, Worker } from "@/types";
import { getStorage, setStorage, STORAGE_KEYS } from "./storage";
import { generateId } from "./utils/helpers";
import {
  createTokenPair,
  refreshAccessToken,
  isTokenExpiringSoon,
  decodeMockJWT,
} from "./auth/jwt";
import { validate } from "./validations/utils";
import { loginSchema } from "./validations/auth";

/** Set a cookie readable by Next.js middleware for route protection */
function setAuthCookie(role: string) {
  if (typeof document !== "undefined") {
    document.cookie = `meelike-auth-role=${role}; path=/; max-age=${60 * 60 * 24}; SameSite=Lax`;
  }
}

// ===== HELPER: Create default data on first login =====

function createDefaultSeller(userId: string, email: string): Seller {
  return {
    id: `seller-${generateId()}`,
    userId,
    displayName: email.split("@")[0],
    name: "My Store",
    slug: email.split("@")[0].toLowerCase(),
    subscription: "free",
    theme: "meelike",
    plan: "free",
    sellerRank: "bronze",
    platformFeePercent: 15,
    rollingAvgSpend: 0,
    totalSpentOnWorkers: 0,
    balance: 0,
    totalOrders: 0,
    totalRevenue: 0,
    rating: 0,
    ratingCount: 0,
    isActive: true,
    isVerified: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
}

function createDefaultWorker(userId: string, email: string): Worker {
  const now = new Date().toISOString();
  return {
    id: `worker-${generateId()}`,
    userId,
    displayName: email.split("@")[0],
    level: "bronze",
    rating: 0,
    ratingCount: 0,
    totalJobs: 0,
    totalJobsCompleted: 0,
    totalEarned: 0,
    completionRate: 100,
    availableBalance: 0,
    pendingBalance: 0,
    isActive: true,
    isBanned: false,
    teamIds: [],
    createdAt: now,
    lastActiveAt: now,
  };
}

// ===== AUTH STORE =====

interface AuthState {
  user: AuthUser | null;
  isLoading: boolean;
  hasHydrated: boolean;
  
  // Actions
  login: (email: string, password: string, role: "seller" | "worker" | "admin") => Promise<boolean>;
  logout: () => Promise<void>;
  refreshToken: () => boolean;
  setUser: (user: AuthUser | null) => void;
  setHasHydrated: (state: boolean) => void;
  
  // Computed values (as functions to always get fresh data)
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
      
      // Actions
      login: async (email: string, password: string, role: "seller" | "worker" | "admin") => {
        set({ isLoading: true });
        
        try {
          // Validate input
          validate(loginSchema, { email, password, role });
          
          // Simulate API call
          await new Promise((resolve) => setTimeout(resolve, 500));
          
          // Admin login
          if (role === "admin") {
            const isValidAdmin = email.toLowerCase().includes("admin") || 
                                 email.toLowerCase() === "admin@meelike.com";
            
            if (!isValidAdmin) {
              set({ isLoading: false });
              return false;
            }
            
            const userId = `admin-${generateId()}`;
            const tokens = createTokenPair({ sub: userId, email, role: "admin" });
            const decoded = decodeMockJWT(tokens.accessToken);
            
            const user: AuthUser = {
              id: userId,
              email,
              role: "admin",
              isAdmin: true,
              token: tokens.accessToken,
              refreshToken: tokens.refreshToken,
              tokenExpiresAt: decoded ? decoded.exp * 1000 : undefined,
            };
            setAuthCookie("admin");
            set({ user, isLoading: false });
            return true;
          }
          
          if (role === "seller") {
            const sellers = getStorage<Seller[]>(STORAGE_KEYS.SELLERS, []);
            
            let seller = sellers.find(s => 
              s.name === email.split("@")[0] || 
              s.displayName === email.split("@")[0]
            );
            
            if (!seller && sellers.length > 0) {
              seller = sellers[0];
            }
            
            if (!seller) {
              const userId = `user-${generateId()}`;
              seller = createDefaultSeller(userId, email);
              sellers.push(seller);
              setStorage(STORAGE_KEYS.SELLERS, sellers);
            }
            
            const tokens = createTokenPair({
              sub: seller.userId,
              email,
              role: "seller",
              sellerId: seller.id,
            });
            const decoded = decodeMockJWT(tokens.accessToken);
            
            const user: AuthUser = {
              id: seller.userId,
              email,
              role: "seller",
              seller,
              token: tokens.accessToken,
              refreshToken: tokens.refreshToken,
              tokenExpiresAt: decoded ? decoded.exp * 1000 : undefined,
            };
            setAuthCookie("seller");
            set({ user, isLoading: false });
            return true;
          } else {
            const workers = getStorage<Worker[]>(STORAGE_KEYS.WORKERS, []);
            
            let worker = workers.find(w => 
              w.displayName === email.split("@")[0]
            );
            
            if (!worker && workers.length > 0) {
              worker = workers[0];
            }
            
            if (!worker) {
              const userId = `user-${generateId()}`;
              worker = createDefaultWorker(userId, email);
              workers.push(worker);
              setStorage(STORAGE_KEYS.WORKERS, workers);
            }
            
            const tokens = createTokenPair({
              sub: worker.userId,
              email,
              role: "worker",
              workerId: worker.id,
            });
            const decoded = decodeMockJWT(tokens.accessToken);
            
            const user: AuthUser = {
              id: worker.userId,
              email,
              role: "worker",
              worker,
              token: tokens.accessToken,
              refreshToken: tokens.refreshToken,
              tokenExpiresAt: decoded ? decoded.exp * 1000 : undefined,
            };
            setAuthCookie("worker");
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
        // Clear the auth cookie used by middleware
        if (typeof document !== "undefined") {
          document.cookie = "meelike-auth-role=; path=/; max-age=0";
        }
        set({ user: null, isLoading: false });
      },
      
      refreshToken: () => {
        const user = get().user;
        if (!user?.refreshToken) return false;
        
        const newAccessToken = refreshAccessToken(user.refreshToken);
        if (!newAccessToken) {
          // Refresh token expired -- force logout
          set({ user: null });
          return false;
        }
        
        const decoded = decodeMockJWT(newAccessToken);
        set({
          user: {
            ...user,
            token: newAccessToken,
            tokenExpiresAt: decoded ? decoded.exp * 1000 : undefined,
          },
        });
        return true;
      },
      
      setUser: (user) => set({ user }),
      setHasHydrated: (state) => set({ hasHydrated: state }),
      
      // Computed values
      isAuthenticated: () => !!get().user?.token,
      isSeller: () => get().user?.role === "seller",
      isWorker: () => get().user?.role === "worker",
      isAdmin: () => get().user?.role === "admin" || get().user?.isAdmin === true,
      getUserId: () => get().user?.id ?? null,
      getUserRole: () => get().user?.role ?? null,
      getToken: () => {
        const user = get().user;
        if (!user?.token) return null;
        
        // Auto-refresh if expiring soon
        if (user.token && isTokenExpiringSoon(user.token)) {
          get().refreshToken();
        }
        
        return get().user?.token ?? null;
      },
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
