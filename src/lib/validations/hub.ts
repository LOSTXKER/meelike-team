/**
 * Hub Domain Validation Schemas
 */

import { z } from "zod";

// ===== POST =====

export const createPostSchema = z.object({
  type: z.enum(["recruit", "find-team", "outsource"], {
    message: "ประเภทโพสต์ไม่ถูกต้อง",
  }),
  title: z
    .string()
    .min(1, "กรุณากรอกหัวข้อ")
    .max(200, "หัวข้อต้องไม่เกิน 200 ตัวอักษร"),
  description: z
    .string()
    .min(1, "กรุณากรอกรายละเอียด")
    .max(2000, "รายละเอียดต้องไม่เกิน 2000 ตัวอักษร"),
  platforms: z.array(z.string()).min(1, "กรุณาเลือกแพลตฟอร์มอย่างน้อย 1 รายการ"),
  payRate: z
    .union([
      z.string(),
      z.object({
        min: z.number().min(0),
        max: z.number().min(0),
        unit: z.string(),
      }),
    ])
    .optional(),
  requirements: z.array(z.string()).optional(),
  benefits: z.array(z.string()).optional(),
  openSlots: z.number().int().min(1).optional(),
  experience: z.string().optional(),
  expectedPay: z.string().optional(),
  availability: z.string().optional(),
  jobType: z.string().optional(),
  quantity: z.number().int().min(1).optional(),
  budget: z.string().optional(),
  deadline: z.string().optional(),
});

// ===== BID =====

export const createBidSchema = z.object({
  outsourceJobId: z.string().min(1, "กรุณาระบุ Job ID"),
  teamId: z.string().min(1, "กรุณาเลือกทีม"),
  pricePerUnit: z.number().min(0.01, "ราคาต่อหน่วยต้องมากกว่า 0"),
  estimatedDays: z.number().int().min(1, "จำนวนวันต้องมากกว่า 0"),
  message: z.string().max(500, "ข้อความต้องไม่เกิน 500 ตัวอักษร").optional(),
});

// ===== OUTSOURCE =====

export const postOutsourceFromOrderSchema = z.object({
  orderId: z.string().min(1),
  orderItemId: z.string().min(1),
  quantity: z.number().int().min(1, "จำนวนต้องมากกว่า 0"),
  suggestedPricePerUnit: z.number().min(0, "ราคาต้องไม่ติดลบ"),
  deadline: z.string().min(1, "กรุณาระบุเดดไลน์"),
  description: z.string().optional(),
  requirements: z.array(z.string()).optional(),
  isUrgent: z.boolean().optional(),
});

export const postOutsourceDirectSchema = z.object({
  platform: z.string().min(1, "กรุณาเลือกแพลตฟอร์ม"),
  jobType: z.string().min(1, "กรุณาเลือกประเภทงาน"),
  quantity: z.number().int().min(1, "จำนวนต้องมากกว่า 0"),
  suggestedPricePerUnit: z.number().min(0, "ราคาต้องไม่ติดลบ"),
  deadline: z.string().min(1, "กรุณาระบุเดดไลน์"),
  targetUrl: z.string().url("URL ไม่ถูกต้อง"),
  title: z.string().optional(),
  description: z.string().optional(),
  requirements: z.array(z.string()).optional(),
  isUrgent: z.boolean().optional(),
});

// ===== TYPE EXPORTS =====

export type CreatePostInput = z.infer<typeof createPostSchema>;
export type CreateBidInput = z.infer<typeof createBidSchema>;
export type PostOutsourceFromOrderInput = z.infer<typeof postOutsourceFromOrderSchema>;
export type PostOutsourceDirectInput = z.infer<typeof postOutsourceDirectSchema>;
