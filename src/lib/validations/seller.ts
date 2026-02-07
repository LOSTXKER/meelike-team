/**
 * Seller Domain Validation Schemas
 */

import { z } from "zod";

// ===== ORDER =====

const orderCustomerSchema = z.object({
  name: z.string().min(1, "กรุณากรอกชื่อลูกค้า"),
  contactType: z.enum(["line", "facebook", "phone", "email"], {
    message: "ช่องทางติดต่อไม่ถูกต้อง",
  }),
  contactValue: z.string().min(1, "กรุณากรอกข้อมูลช่องทางติดต่อ"),
  note: z.string().optional(),
});

const orderItemSchema = z.object({
  serviceId: z.string().min(1, "กรุณาเลือกบริการ"),
  serviceName: z.string().min(1),
  serviceType: z.enum(["bot", "human"]),
  platform: z.string().min(1, "กรุณาเลือกแพลตฟอร์ม"),
  type: z.string().min(1),
  targetUrl: z.string().url("URL ไม่ถูกต้อง"),
  quantity: z.number().int().min(1, "จำนวนต้องมากกว่า 0"),
  unitPrice: z.number().min(0, "ราคาต้องไม่ติดลบ"),
  costPerUnit: z.number().min(0, "ต้นทุนต้องไม่ติดลบ"),
  commentTemplates: z.array(z.string()).optional(),
});

export const createOrderSchema = z.object({
  customer: orderCustomerSchema,
  items: z.array(orderItemSchema).min(1, "ต้องมีอย่างน้อย 1 รายการ"),
  discount: z.number().min(0).optional(),
  autoCreateJobs: z.boolean().optional(),
  jobConfig: z
    .object({
      teamId: z.string().min(1),
      payRate: z.number().min(0),
      splitToTeams: z
        .array(
          z.object({
            teamId: z.string().min(1),
            quantity: z.number().int().min(1),
            payRate: z.number().min(0).optional(),
          })
        )
        .optional(),
    })
    .optional(),
});

// ===== SERVICE =====

export const createServiceSchema = z.object({
  name: z.string().min(1, "กรุณากรอกชื่อบริการ"),
  description: z.string().optional(),
  category: z.string().min(1, "กรุณาเลือกหมวดหมู่"),
  type: z.string().min(1, "กรุณาเลือกประเภท"),
  platform: z.string().min(1, "กรุณาเลือกแพลตฟอร์ม"),
  price: z.number().min(0, "ราคาต้องไม่ติดลบ"),
  minQuantity: z.number().int().min(1).optional(),
  maxQuantity: z.number().int().min(1).optional(),
  isActive: z.boolean().optional(),
  showInStore: z.boolean().optional(),
});

export const updateServiceSchema = createServiceSchema.partial();

// ===== TEAM =====

export const createTeamSchema = z.object({
  name: z
    .string()
    .min(1, "กรุณากรอกชื่อทีม")
    .max(100, "ชื่อทีมต้องไม่เกิน 100 ตัวอักษร"),
  description: z.string().max(500, "คำอธิบายต้องไม่เกิน 500 ตัวอักษร").optional(),
});

// ===== JOB =====

export const createStandaloneJobSchema = z.object({
  title: z.string().optional(),
  platform: z.enum(["facebook", "instagram", "tiktok", "youtube", "twitter"], {
    message: "แพลตฟอร์มไม่ถูกต้อง",
  }),
  serviceType: z.enum(["like", "comment", "follow", "share", "view"], {
    message: "ประเภทบริการไม่ถูกต้อง",
  }),
  targetUrl: z.string().url("URL ไม่ถูกต้อง"),
  quantity: z.number().int().min(1, "จำนวนต้องมากกว่า 0"),
  pricePerUnit: z.number().min(0, "ราคาต่อหน่วยต้องไม่ติดลบ"),
  instructions: z.string().optional(),
  commentTemplates: z.array(z.string()).optional(),
  deadline: z.string().optional(),
  isUrgent: z.boolean().optional(),
});

export const updateTeamJobSchema = z.object({
  quantity: z.number().int().min(1).optional(),
  pricePerUnit: z.number().min(0).optional(),
  instructions: z.string().optional(),
  deadline: z.string().optional(),
});

// ===== FINANCE =====

export const createTopupSchema = z.object({
  amount: z
    .number()
    .min(1, "จำนวนเงินต้องมากกว่า 0")
    .max(1_000_000, "จำนวนเงินต้องไม่เกิน 1,000,000"),
  method: z.enum(["promptpay", "bank"], {
    message: "วิธีชำระเงินไม่ถูกต้อง",
  }),
  reference: z.string().optional(),
});

// ===== TYPE EXPORTS =====

export type CreateOrderInput = z.infer<typeof createOrderSchema>;
export type CreateServiceInput = z.infer<typeof createServiceSchema>;
export type UpdateServiceInput = z.infer<typeof updateServiceSchema>;
export type CreateTeamInput = z.infer<typeof createTeamSchema>;
export type CreateStandaloneJobInput = z.infer<typeof createStandaloneJobSchema>;
export type UpdateTeamJobInput = z.infer<typeof updateTeamJobSchema>;
export type CreateTopupInput = z.infer<typeof createTopupSchema>;
