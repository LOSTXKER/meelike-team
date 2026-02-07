/**
 * Auth Validation Schemas
 */

import { z } from "zod";

export const loginSchema = z.object({
  email: z
    .string()
    .min(1, "กรุณากรอกอีเมล")
    .email("รูปแบบอีเมลไม่ถูกต้อง"),
  password: z
    .string()
    .min(1, "กรุณากรอกรหัสผ่าน"),
  role: z.enum(["seller", "worker", "admin"], {
    message: "บทบาทไม่ถูกต้อง",
  }),
});

export const registerSchema = loginSchema
  .extend({
    confirmPassword: z.string().min(1, "กรุณายืนยันรหัสผ่าน"),
    displayName: z
      .string()
      .min(1, "กรุณากรอกชื่อที่แสดง")
      .max(50, "ชื่อต้องไม่เกิน 50 ตัวอักษร"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "รหัสผ่านไม่ตรงกัน",
    path: ["confirmPassword"],
  });

export type LoginInput = z.infer<typeof loginSchema>;
export type RegisterInput = z.infer<typeof registerSchema>;
