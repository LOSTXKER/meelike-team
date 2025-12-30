// LocalStorage utilities for prototype

const STORAGE_KEYS = {
  AUTH_USER: "meelike_auth_user",
  SELLERS: "meelike_sellers",
  WORKERS: "meelike_workers",
  TEAMS: "meelike_teams",
  TEAM_MEMBERS: "meelike_team_members",
  SERVICES: "meelike_services",
  ORDERS: "meelike_orders",
  JOBS: "meelike_jobs",
  JOB_CLAIMS: "meelike_job_claims",
  WORKER_ACCOUNTS: "meelike_worker_accounts",
  PAYOUTS: "meelike_payouts",
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


