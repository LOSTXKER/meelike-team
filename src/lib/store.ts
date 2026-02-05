import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type { AuthUser, Seller, Worker } from "@/types";
import { getStorage, setStorage, STORAGE_KEYS } from "./storage";
import { generateId } from "./utils/helpers";

// ===== HELPER: Create default data on first login =====

function createDefaultSeller(userId: string, email: string): Seller {
  return {
    id: `seller-${generateId()}`,
    userId,
    displayName: email.split("@")[0],
    name: email.split("@")[0],
    slug: email.split("@")[0].toLowerCase(),
    subscription: "free",
    theme: "meelike",
    storeName: "My Store",
    storeSlug: `store-${generateId()}`,
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
    storeTheme: "meelike",
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
  setUser: (user: AuthUser | null) => void;
  setHasHydrated: (state: boolean) => void;
  
  // Computed values (as functions to always get fresh data)
  isAuthenticated: () => boolean;
  isSeller: () => boolean;
  isWorker: () => boolean;
  isAdmin: () => boolean;
  getUserId: () => string | null;
  getUserRole: () => "seller" | "worker" | "admin" | null;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      isLoading: false,
      hasHydrated: false,
      
      // Actions
      login: async (email: string, _password: string, role: "seller" | "worker" | "admin") => {
        set({ isLoading: true });
        
        try {
          // Simulate API call
          await new Promise((resolve) => setTimeout(resolve, 500));
          
          // Admin login
          if (role === "admin") {
            // For demo, accept any email with "admin" in it or admin@meelike.com
            const isValidAdmin = email.toLowerCase().includes("admin") || 
                                 email.toLowerCase() === "admin@meelike.com";
            
            if (!isValidAdmin) {
              set({ isLoading: false });
              return false;
            }
            
            const user: AuthUser = {
              id: `admin-${generateId()}`,
              email,
              role: "admin",
              isAdmin: true,
            };
            set({ user, isLoading: false });
            return true;
          }
          
          if (role === "seller") {
            // Get sellers from storage (including seeded data)
            const sellers = getStorage<Seller[]>(STORAGE_KEYS.SELLERS, []);
            
            // Try to find existing seller (from seed data or previous login)
            // Priority: 1) match by email name, 2) use first seller if exists, 3) create new
            let seller = sellers.find(s => 
              s.name === email.split("@")[0] || 
              s.displayName === email.split("@")[0]
            );
            
            // If no match by name, use first seller from seed data
            if (!seller && sellers.length > 0) {
              seller = sellers[0];
            }
            
            // If still no seller, create new one
            if (!seller) {
              const userId = `user-${generateId()}`;
              seller = createDefaultSeller(userId, email);
              sellers.push(seller);
              setStorage(STORAGE_KEYS.SELLERS, sellers);
            }
            
            const user: AuthUser = {
              id: seller.userId,
              email,
              role: "seller",
              seller,
            };
            set({ user, isLoading: false });
            return true;
          } else {
            // Get workers from storage (including seeded data)
            const workers = getStorage<Worker[]>(STORAGE_KEYS.WORKERS, []);
            
            // Try to find existing worker
            let worker = workers.find(w => 
              w.displayName === email.split("@")[0]
            );
            
            // If no match, use first worker from seed data
            if (!worker && workers.length > 0) {
              worker = workers[0];
            }
            
            // If still no worker, create new one
            if (!worker) {
              const userId = `user-${generateId()}`;
              worker = createDefaultWorker(userId, email);
              workers.push(worker);
              setStorage(STORAGE_KEYS.WORKERS, workers);
            }
            
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
      isAdmin: () => get().user?.role === "admin" || get().user?.isAdmin === true,
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
