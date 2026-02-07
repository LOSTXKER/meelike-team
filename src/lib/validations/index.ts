/**
 * Validation Schemas & Utilities
 *
 * Central export for all Zod schemas, utilities, and inferred types.
 *
 * Usage:
 * ```ts
 * import { validate, createOrderSchema } from "@/lib/validations";
 *
 * // Throws ValidationError on invalid data
 * const order = validate(createOrderSchema, rawPayload);
 *
 * // Or safe (no throw)
 * const result = safeValidate(createOrderSchema, rawPayload);
 * if (!result.success) console.log(result.error.errors);
 * ```
 */

// Utilities
export { validate, safeValidate, formatZodErrors } from "./utils";

// Auth schemas
export { loginSchema, registerSchema } from "./auth";
export type { LoginInput, RegisterInput } from "./auth";

// Seller schemas
export {
  createOrderSchema,
  createServiceSchema,
  updateServiceSchema,
  createTeamSchema,
  createStandaloneJobSchema,
  updateTeamJobSchema,
  createTopupSchema,
} from "./seller";
export type {
  CreateOrderInput,
  CreateServiceInput,
  UpdateServiceInput,
  CreateTeamInput,
  CreateStandaloneJobInput,
  UpdateTeamJobInput,
  CreateTopupInput,
} from "./seller";

// Hub schemas
export {
  createPostSchema,
  createBidSchema,
  postOutsourceFromOrderSchema,
  postOutsourceDirectSchema,
} from "./hub";
export type {
  CreatePostInput,
  CreateBidInput,
  PostOutsourceFromOrderInput,
  PostOutsourceDirectInput,
} from "./hub";
