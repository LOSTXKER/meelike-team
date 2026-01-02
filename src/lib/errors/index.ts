/**
 * Error Handling Infrastructure
 * 
 * Custom error classes and handling utilities
 */

// ===== API ERROR =====

export class ApiError extends Error {
  constructor(
    public statusCode: number,
    public message: string,
    public data?: any,
    public endpoint?: string
  ) {
    super(message);
    this.name = "ApiError";
    
    // Maintains proper stack trace for where our error was thrown (only available on V8)
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, ApiError);
    }
  }

  /**
   * Check if error is a specific HTTP status code
   */
  is(statusCode: number): boolean {
    return this.statusCode === statusCode;
  }

  /**
   * Check if error is in a status code range
   */
  isInRange(min: number, max: number): boolean {
    return this.statusCode >= min && this.statusCode <= max;
  }

  /**
   * Check if error is a client error (4xx)
   */
  isClientError(): boolean {
    return this.isInRange(400, 499);
  }

  /**
   * Check if error is a server error (5xx)
   */
  isServerError(): boolean {
    return this.isInRange(500, 599);
  }
}

// ===== VALIDATION ERROR =====

export class ValidationError extends Error {
  constructor(
    public message: string,
    public errors: Record<string, string[]>
  ) {
    super(message);
    this.name = "ValidationError";
    
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, ValidationError);
    }
  }

  /**
   * Get errors for a specific field
   */
  getFieldErrors(field: string): string[] {
    return this.errors[field] || [];
  }

  /**
   * Check if a field has errors
   */
  hasFieldError(field: string): boolean {
    return !!this.errors[field] && this.errors[field].length > 0;
  }

  /**
   * Get first error message for a field
   */
  getFirstFieldError(field: string): string | null {
    const errors = this.getFieldErrors(field);
    return errors.length > 0 ? errors[0] : null;
  }

  /**
   * Get all error messages as a flat array
   */
  getAllMessages(): string[] {
    return Object.values(this.errors).flat();
  }
}

// ===== NETWORK ERROR =====

export class NetworkError extends Error {
  constructor(message: string = "เชื่อมต่อเครือข่ายไม่ได้") {
    super(message);
    this.name = "NetworkError";
    
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, NetworkError);
    }
  }
}

// ===== TIMEOUT ERROR =====

export class TimeoutError extends Error {
  constructor(message: string = "หมดเวลาในการเชื่อมต่อ") {
    super(message);
    this.name = "TimeoutError";
    
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, TimeoutError);
    }
  }
}

// ===== AUTH ERROR =====

export class AuthError extends Error {
  constructor(message: string = "ไม่ได้รับอนุญาต") {
    super(message);
    this.name = "AuthError";
    
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, AuthError);
    }
  }
}

// ===== ERROR HANDLERS =====

/**
 * Convert unknown error to a readable message
 */
export function getErrorMessage(error: unknown): string {
  if (error instanceof ApiError) {
    return error.message;
  }
  
  if (error instanceof ValidationError) {
    const messages = error.getAllMessages();
    return messages.length > 0 ? messages[0] : "ข้อมูลไม่ถูกต้อง";
  }
  
  if (error instanceof NetworkError) {
    return "ไม่สามารถเชื่อมต่อเครือข่ายได้ กรุณาตรวจสอบการเชื่อมต่ออินเทอร์เน็ต";
  }
  
  if (error instanceof TimeoutError) {
    return "หมดเวลาในการเชื่อมต่อ กรุณาลองใหม่อีกครั้ง";
  }
  
  if (error instanceof AuthError) {
    return "ไม่ได้รับอนุญาต กรุณาเข้าสู่ระบบใหม่";
  }
  
  if (error instanceof Error) {
    return error.message;
  }
  
  return "เกิดข้อผิดพลาดที่ไม่ทราบสาเหตุ";
}

/**
 * Handle API error and return user-friendly message
 */
export function handleApiError(error: unknown): string {
  if (error instanceof ApiError) {
    // Map common status codes to Thai messages
    switch (error.statusCode) {
      case 400:
        return "ข้อมูลที่ส่งมาไม่ถูกต้อง";
      case 401:
        return "กรุณาเข้าสู่ระบบใหม่";
      case 403:
        return "คุณไม่มีสิทธิ์เข้าถึงข้อมูลนี้";
      case 404:
        return "ไม่พบข้อมูลที่ต้องการ";
      case 409:
        return "ข้อมูลซ้ำ หรือมีการใช้งานอยู่แล้ว";
      case 429:
        return "ส่งคำขอบ่อยเกินไป กรุณารอสักครู่";
      case 500:
        return "เกิดข้อผิดพลาดที่เซิร์ฟเวอร์";
      case 503:
        return "ระบบไม่พร้อมใช้งานชั่วคราว";
      default:
        return error.message || "เกิดข้อผิดพลาดจากเซิร์ฟเวอร์";
    }
  }
  
  return getErrorMessage(error);
}

/**
 * Log error to console in development
 */
export function logError(error: unknown, context?: string): void {
  if (process.env.NODE_ENV === "development") {
    console.error(
      `[Error${context ? ` - ${context}` : ""}]:`,
      error
    );
  }
}

/**
 * Type guard for ApiError
 */
export function isApiError(error: unknown): error is ApiError {
  return error instanceof ApiError;
}

/**
 * Type guard for ValidationError
 */
export function isValidationError(error: unknown): error is ValidationError {
  return error instanceof ValidationError;
}

/**
 * Type guard for NetworkError
 */
export function isNetworkError(error: unknown): error is NetworkError {
  return error instanceof NetworkError;
}
