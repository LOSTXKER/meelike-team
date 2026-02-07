/**
 * API Client
 * 
 * Centralized HTTP client with error handling and mock mode support
 */

import {
  ApiError,
  NetworkError,
  TimeoutError,
  AuthError,
  logError,
} from "@/lib/errors";

// ===== TYPES =====

export interface ApiResponse<T> {
  data: T | null;
  error: Error | null;
  status?: number;
}

export interface RequestConfig extends RequestInit {
  timeout?: number;
  skipAuth?: boolean;
}

export interface ApiClientConfig {
  baseURL: string;
  timeout?: number;
  onAuthError?: () => void;
}

// ===== API CLIENT CLASS =====

export class ApiClient {
  private baseURL: string;
  private timeout: number;
  private onAuthError?: () => void;

  constructor(config: ApiClientConfig) {
    this.baseURL = config.baseURL;
    this.timeout = config.timeout || 30000; // 30 seconds default
    this.onAuthError = config.onAuthError;
  }

  /**
   * Make an HTTP request.
   * In development, MSW service worker intercepts these and routes to mock handlers.
   * In production, these go to the real backend.
   */
  async request<T>(
    endpoint: string,
    config: RequestConfig = {}
  ): Promise<ApiResponse<T>> {
    const {
      timeout = this.timeout,
      skipAuth = false,
      ...fetchConfig
    } = config;

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), timeout);

      // Build headers
      const headers = new Headers(fetchConfig.headers);
      if (!headers.has("Content-Type")) {
        headers.set("Content-Type", "application/json");
      }

      // Add auth token if not skipped
      if (!skipAuth) {
        const token = this.getAuthToken();
        if (token) {
          headers.set("Authorization", `Bearer ${token}`);
        }
      }

      // Make request
      const response = await fetch(`${this.baseURL}${endpoint}`, {
        ...fetchConfig,
        headers,
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      // Handle response
      if (!response.ok) {
        return await this.handleErrorResponse<T>(response, endpoint);
      }

      // Parse success response
      const data = await this.parseResponse<T>(response);
      return { data, error: null, status: response.status };
    } catch (error) {
      return this.handleRequestError<T>(error, endpoint);
    }
  }

  /**
   * GET request
   */
  async get<T>(endpoint: string, config?: RequestConfig): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      ...config,
      method: "GET",
    });
  }

  /**
   * POST request
   */
  async post<T>(
    endpoint: string,
    body?: any,
    config?: RequestConfig
  ): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      ...config,
      method: "POST",
      body: body ? JSON.stringify(body) : undefined,
    });
  }

  /**
   * PUT request
   */
  async put<T>(
    endpoint: string,
    body?: any,
    config?: RequestConfig
  ): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      ...config,
      method: "PUT",
      body: body ? JSON.stringify(body) : undefined,
    });
  }

  /**
   * PATCH request
   */
  async patch<T>(
    endpoint: string,
    body?: any,
    config?: RequestConfig
  ): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      ...config,
      method: "PATCH",
      body: body ? JSON.stringify(body) : undefined,
    });
  }

  /**
   * DELETE request
   */
  async delete<T>(endpoint: string, config?: RequestConfig): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      ...config,
      method: "DELETE",
    });
  }

  // ===== PRIVATE METHODS =====

  /**
   * Parse response body
   */
  private async parseResponse<T>(response: Response): Promise<T> {
    const contentType = response.headers.get("Content-Type");
    
    if (contentType?.includes("application/json")) {
      return await response.json();
    }
    
    if (contentType?.includes("text/")) {
      return (await response.text()) as unknown as T;
    }
    
    return (await response.blob()) as unknown as T;
  }

  /**
   * Handle error responses from server
   */
  private async handleErrorResponse<T>(
    response: Response,
    endpoint: string
  ): Promise<ApiResponse<T>> {
    let errorData: any;
    
    try {
      errorData = await response.json();
    } catch {
      errorData = { message: response.statusText };
    }

    const error = new ApiError(
      response.status,
      errorData.message || `HTTP ${response.status}`,
      errorData,
      endpoint
    );

    // Handle auth errors
    if (response.status === 401) {
      this.onAuthError?.();
    }

    logError(error, endpoint);
    return { data: null, error, status: response.status };
  }

  /**
   * Handle request errors (network, timeout, etc.)
   */
  private handleRequestError<T>(
    error: unknown,
    endpoint: string
  ): ApiResponse<T> {
    let processedError: Error;

    if (error instanceof Error) {
      if (error.name === "AbortError") {
        processedError = new TimeoutError();
      } else if (error.message.includes("Failed to fetch")) {
        processedError = new NetworkError();
      } else {
        processedError = error;
      }
    } else {
      processedError = new Error("เกิดข้อผิดพลาดที่ไม่ทราบสาเหตุ");
    }

    logError(processedError, endpoint);
    return { data: null, error: processedError };
  }

  /**
   * Get auth token from storage (reads JWT from Zustand persisted state)
   */
  private getAuthToken(): string | null {
    if (typeof window === "undefined") return null;

    try {
      const authData = localStorage.getItem("meelike-auth");
      if (!authData) return null;

      const parsed = JSON.parse(authData);
      const token = parsed?.state?.user?.token;
      return token || null;
    } catch {
      return null;
    }
  }
}

// ===== DEFAULT CLIENT INSTANCE =====

export const apiClient = new ApiClient({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "/api",
  timeout: 30000,
  onAuthError: () => {
    if (typeof window !== "undefined") {
      window.location.href = "/login";
    }
  },
});
