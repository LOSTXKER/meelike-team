/**
 * Validation utilities
 *
 * Bridges Zod errors with the existing ValidationError class.
 */

import { ZodError, type ZodSchema } from "zod";
import { ValidationError } from "@/lib/errors";

/**
 * Format a ZodError into the shape expected by ValidationError:
 * Record<string, string[]>
 */
export function formatZodErrors(error: ZodError): Record<string, string[]> {
  const fieldErrors: Record<string, string[]> = {};
  for (const issue of error.issues) {
    const path = issue.path.length > 0 ? issue.path.join(".") : "_root";
    if (!fieldErrors[path]) fieldErrors[path] = [];
    fieldErrors[path].push(issue.message);
  }
  return fieldErrors;
}

/**
 * Validate data against a Zod schema.
 * Throws ValidationError (from our error system) on failure.
 */
export function validate<T>(schema: ZodSchema<T>, data: unknown): T {
  const result = schema.safeParse(data);
  if (!result.success) {
    throw new ValidationError(
      "ข้อมูลไม่ถูกต้อง",
      formatZodErrors(result.error)
    );
  }
  return result.data;
}

/**
 * Validate data without throwing -- returns { success, data, error }.
 */
export function safeValidate<T>(
  schema: ZodSchema<T>,
  data: unknown
): { success: true; data: T } | { success: false; error: ValidationError } {
  const result = schema.safeParse(data);
  if (result.success) {
    return { success: true, data: result.data };
  }
  return {
    success: false,
    error: new ValidationError(
      "ข้อมูลไม่ถูกต้อง",
      formatZodErrors(result.error)
    ),
  };
}
