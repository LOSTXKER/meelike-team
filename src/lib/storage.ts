// LocalStorage utilities for prototype

const STORAGE_KEYS = {
  AUTH_USER: "meelike_auth_user",
  SELLERS: "meelike_sellers",
  WORKERS: "meelike_workers",
  TEAMS: "meelike_teams",
  TEAM_MEMBERS: "meelike_team_members",
  TEAM_APPLICATIONS: "meelike_team_applications", // Worker applications to teams
  SERVICES: "meelike_services",
  ORDERS: "meelike_orders",
  TEAM_JOBS: "meelike_team_jobs", // Renamed from JOBS for clarity (งานที่มอบให้ทีม)
  JOB_CLAIMS: "meelike_job_claims", // Worker claims on team jobs
  WORKER_ACCOUNTS: "meelike_worker_accounts",
  PAYOUTS: "meelike_payouts",
  TRANSACTIONS: "meelike_transactions",
  HUB_POSTS: "meelike_hub_posts", // Posts in the marketplace/hub
  TEAM_REVIEWS: "meelike_team_reviews", // Worker reviews of teams
} as const;

export function getStorage<T>(key: string, defaultValue: T): T {
  if (typeof window === "undefined") return defaultValue;
  
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch {
    return defaultValue;
  }
}

export function setStorage<T>(key: string, value: T): void {
  if (typeof window === "undefined") return;
  
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error("Error saving to localStorage:", error);
  }
}

export function removeStorage(key: string): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem(key);
}

export function clearAllStorage(): void {
  if (typeof window === "undefined") return;
  Object.values(STORAGE_KEYS).forEach((key) => {
    localStorage.removeItem(key);
  });
}

export { STORAGE_KEYS };

// ===== HELPER: Get current user from auth store =====
export function getCurrentUserId(): string | null {
  if (typeof window === "undefined") return null;
  
  try {
    const authData = localStorage.getItem("meelike-auth");
    if (!authData) return null;
    
    const parsed = JSON.parse(authData);
    return parsed?.state?.user?.id || null;
  } catch {
    return null;
  }
}

export function getCurrentUserRole(): "seller" | "worker" | null {
  if (typeof window === "undefined") return null;
  
  try {
    const authData = localStorage.getItem("meelike-auth");
    if (!authData) return null;
    
    const parsed = JSON.parse(authData);
    return parsed?.state?.user?.role || null;
  } catch {
    return null;
  }
}

export function getCurrentSellerId(): string | null {
  if (typeof window === "undefined") return null;
  
  try {
    const authData = localStorage.getItem("meelike-auth");
    if (!authData) return null;
    
    const parsed = JSON.parse(authData);
    return parsed?.state?.user?.seller?.id || null;
  } catch {
    return null;
  }
}

export function getCurrentWorkerId(): string | null {
  if (typeof window === "undefined") return null;
  
  try {
    const authData = localStorage.getItem("meelike-auth");
    if (!authData) return null;
    
    const parsed = JSON.parse(authData);
    return parsed?.state?.user?.worker?.id || null;
  } catch {
    return null;
  }
}
