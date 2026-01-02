/**
 * Runtime Validators
 * 
 * Functions for validating data at runtime.
 * These are useful for form validation, API responses, etc.
 */

import {
  isNonEmptyString,
  isPositiveNumber,
  isValidDateString,
  isPlatform,
  isServiceType,
} from "./guards";

// ===== VALIDATION RESULT =====

export interface ValidationResult {
  valid: boolean;
  errors: string[];
}

export function createValidationResult(
  valid: boolean,
  errors: string[] = []
): ValidationResult {
  return { valid, errors };
}

// ===== EMAIL & CONTACT VALIDATION =====

export function validateEmail(email: string): ValidationResult {
  const errors: string[] = [];
  
  if (!isNonEmptyString(email)) {
    errors.push("อีเมลต้องไม่เป็นค่าว่าง");
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    errors.push("รูปแบบอีเมลไม่ถูกต้อง");
  }
  
  return createValidationResult(errors.length === 0, errors);
}

export function validatePhone(phone: string): ValidationResult {
  const errors: string[] = [];
  
  if (!isNonEmptyString(phone)) {
    errors.push("เบอร์โทรศัพท์ต้องไม่เป็นค่าว่าง");
  } else {
    // Remove dashes and spaces
    const cleaned = phone.replace(/[-\s]/g, "");
    if (!/^0[0-9]{9}$/.test(cleaned)) {
      errors.push("เบอร์โทรศัพท์ต้องเป็นเลข 10 หลัก และขึ้นต้นด้วย 0");
    }
  }
  
  return createValidationResult(errors.length === 0, errors);
}

export function validateLineId(lineId: string): ValidationResult {
  const errors: string[] = [];
  
  if (!isNonEmptyString(lineId)) {
    errors.push("LINE ID ต้องไม่เป็นค่าว่าง");
  } else if (!/^[@]?[a-zA-Z0-9._-]+$/.test(lineId)) {
    errors.push("LINE ID มีรูปแบบไม่ถูกต้อง");
  }
  
  return createValidationResult(errors.length === 0, errors);
}

// ===== URL VALIDATION =====

export function validateUrl(url: string): ValidationResult {
  const errors: string[] = [];
  
  if (!isNonEmptyString(url)) {
    errors.push("URL ต้องไม่เป็นค่าว่าง");
  } else {
    try {
      new URL(url);
    } catch {
      errors.push("รูปแบบ URL ไม่ถูกต้อง");
    }
  }
  
  return createValidationResult(errors.length === 0, errors);
}

export function validateSocialMediaUrl(url: string, platform?: string): ValidationResult {
  const errors: string[] = [];
  const urlValidation = validateUrl(url);
  
  if (!urlValidation.valid) {
    return urlValidation;
  }
  
  if (platform) {
    const urlObj = new URL(url);
    const domain = urlObj.hostname.toLowerCase();
    
    const platformDomains: Record<string, string[]> = {
      facebook: ["facebook.com", "fb.com", "m.facebook.com"],
      instagram: ["instagram.com", "www.instagram.com"],
      tiktok: ["tiktok.com", "www.tiktok.com", "vt.tiktok.com"],
      youtube: ["youtube.com", "youtu.be", "www.youtube.com"],
      twitter: ["twitter.com", "x.com", "www.twitter.com"],
    };
    
    const validDomains = platformDomains[platform.toLowerCase()];
    if (validDomains && !validDomains.some(d => domain.includes(d))) {
      errors.push(`URL ไม่ใช่ของ ${platform}`);
    }
  }
  
  return createValidationResult(errors.length === 0, errors);
}

// ===== SERVICE VALIDATION =====

export interface ServiceFormData {
  name: string;
  description?: string;
  category: string;
  type: string;
  serviceType: string;
  costPrice: number;
  sellPrice: number;
  minQuantity: number;
  maxQuantity: number;
  estimatedTime?: string;
}

export function validateServiceForm(data: ServiceFormData): ValidationResult {
  const errors: string[] = [];
  
  // Name validation
  if (!isNonEmptyString(data.name)) {
    errors.push("ชื่อบริการต้องไม่เป็นค่าว่าง");
  } else if (data.name.length < 3) {
    errors.push("ชื่อบริการต้องมีอย่างน้อย 3 ตัวอักษร");
  } else if (data.name.length > 100) {
    errors.push("ชื่อบริการต้องไม่เกิน 100 ตัวอักษร");
  }
  
  // Platform validation
  if (!isPlatform(data.category)) {
    errors.push("กรุณาเลือกแพลตฟอร์ม");
  }
  
  // Service type validation
  if (!isServiceType(data.type)) {
    errors.push("กรุณาเลือกประเภทบริการ");
  }
  
  // Service mode validation
  if (data.serviceType !== "bot" && data.serviceType !== "human") {
    errors.push("กรุณาเลือกรูปแบบบริการ");
  }
  
  // Price validation
  if (!isPositiveNumber(data.costPrice)) {
    errors.push("ต้นทุนต้องเป็นตัวเลขที่มากกว่า 0");
  }
  
  if (!isPositiveNumber(data.sellPrice)) {
    errors.push("ราคาขายต้องเป็นตัวเลขที่มากกว่า 0");
  }
  
  if (data.sellPrice <= data.costPrice) {
    errors.push("ราคาขายต้องมากกว่าต้นทุน");
  }
  
  // Quantity validation
  if (!isPositiveNumber(data.minQuantity)) {
    errors.push("จำนวนขั้นต่ำต้องเป็นตัวเลขที่มากกว่า 0");
  }
  
  if (!isPositiveNumber(data.maxQuantity)) {
    errors.push("จำนวนสูงสุดต้องเป็นตัวเลขที่มากกว่า 0");
  }
  
  if (data.maxQuantity < data.minQuantity) {
    errors.push("จำนวนสูงสุดต้องมากกว่าหรือเท่ากับจำนวนขั้นต่ำ");
  }
  
  return createValidationResult(errors.length === 0, errors);
}

// ===== ORDER VALIDATION =====

export interface OrderFormData {
  customerName: string;
  contactType: string;
  contactValue: string;
  items: Array<{
    serviceId: string;
    quantity: number;
    targetUrl: string;
  }>;
}

export function validateOrderForm(data: OrderFormData): ValidationResult {
  const errors: string[] = [];
  
  // Customer validation
  if (!isNonEmptyString(data.customerName)) {
    errors.push("ชื่อลูกค้าต้องไม่เป็นค่าว่าง");
  }
  
  // Contact validation
  if (!data.contactType || !data.contactValue) {
    errors.push("กรุณาระบุช่องทางติดต่อ");
  } else {
    switch (data.contactType) {
      case "email":
        const emailValidation = validateEmail(data.contactValue);
        if (!emailValidation.valid) {
          errors.push(...emailValidation.errors);
        }
        break;
      case "phone":
        const phoneValidation = validatePhone(data.contactValue);
        if (!phoneValidation.valid) {
          errors.push(...phoneValidation.errors);
        }
        break;
      case "line":
        const lineValidation = validateLineId(data.contactValue);
        if (!lineValidation.valid) {
          errors.push(...lineValidation.errors);
        }
        break;
    }
  }
  
  // Items validation
  if (!Array.isArray(data.items) || data.items.length === 0) {
    errors.push("ต้องมีอย่างน้อย 1 รายการสินค้า");
  } else {
    data.items.forEach((item, index) => {
      if (!item.serviceId) {
        errors.push(`รายการที่ ${index + 1}: กรุณาเลือกบริการ`);
      }
      if (!isPositiveNumber(item.quantity)) {
        errors.push(`รายการที่ ${index + 1}: จำนวนต้องมากกว่า 0`);
      }
      const urlValidation = validateUrl(item.targetUrl);
      if (!urlValidation.valid) {
        errors.push(`รายการที่ ${index + 1}: URL ไม่ถูกต้อง`);
      }
    });
  }
  
  return createValidationResult(errors.length === 0, errors);
}

// ===== TEAM VALIDATION =====

export interface TeamFormData {
  name: string;
  description?: string;
  requireApproval: boolean;
  isPublic: boolean;
}

export function validateTeamForm(data: TeamFormData): ValidationResult {
  const errors: string[] = [];
  
  if (!isNonEmptyString(data.name)) {
    errors.push("ชื่อทีมต้องไม่เป็นค่าว่าง");
  } else if (data.name.length < 3) {
    errors.push("ชื่อทีมต้องมีอย่างน้อย 3 ตัวอักษร");
  } else if (data.name.length > 50) {
    errors.push("ชื่อทีมต้องไม่เกิน 50 ตัวอักษร");
  }
  
  if (data.description && data.description.length > 500) {
    errors.push("คำอธิบายต้องไม่เกิน 500 ตัวอักษร");
  }
  
  return createValidationResult(errors.length === 0, errors);
}

// ===== WITHDRAWAL VALIDATION =====

export interface WithdrawalFormData {
  amount: number;
  method: "promptpay" | "bank_transfer";
  accountNumber?: string;
  bankCode?: string;
  accountName?: string;
}

export function validateWithdrawalForm(
  data: WithdrawalFormData,
  availableBalance: number,
  minWithdrawal: number = 100
): ValidationResult {
  const errors: string[] = [];
  
  if (!isPositiveNumber(data.amount)) {
    errors.push("จำนวนเงินต้องมากกว่า 0");
  } else {
    if (data.amount < minWithdrawal) {
      errors.push(`จำนวนเงินขั้นต่ำในการถอน ${minWithdrawal} บาท`);
    }
    if (data.amount > availableBalance) {
      errors.push("จำนวนเงินที่ถอนมากกว่ายอดเงินคงเหลือ");
    }
  }
  
  if (data.method === "bank_transfer") {
    if (!isNonEmptyString(data.bankCode)) {
      errors.push("กรุณาเลือกธนาคาร");
    }
    if (!isNonEmptyString(data.accountNumber)) {
      errors.push("กรุณาระบุเลขบัญชี");
    } else if (!/^[0-9]{10,12}$/.test(data.accountNumber)) {
      errors.push("เลขบัญชีต้องเป็นตัวเลข 10-12 หลัก");
    }
    if (!isNonEmptyString(data.accountName)) {
      errors.push("กรุณาระบุชื่อบัญชี");
    }
  } else if (data.method === "promptpay") {
    if (!isNonEmptyString(data.accountNumber)) {
      errors.push("กรุณาระบุเบอร์พร้อมเพย์");
    } else {
      const cleaned = data.accountNumber.replace(/[-\s]/g, "");
      if (!/^[0-9]{10,13}$/.test(cleaned)) {
        errors.push("เบอร์พร้อมเพย์ไม่ถูกต้อง");
      }
    }
  }
  
  return createValidationResult(errors.length === 0, errors);
}

// ===== GENERIC VALIDATORS =====

export function validateRequired(value: unknown, fieldName: string): ValidationResult {
  if (value === null || value === undefined || value === "") {
    return createValidationResult(false, [`${fieldName}ต้องไม่เป็นค่าว่าง`]);
  }
  return createValidationResult(true);
}

export function validateMinLength(
  value: string,
  minLength: number,
  fieldName: string
): ValidationResult {
  if (value.length < minLength) {
    return createValidationResult(false, [
      `${fieldName}ต้องมีอย่างน้อย ${minLength} ตัวอักษร`,
    ]);
  }
  return createValidationResult(true);
}

export function validateMaxLength(
  value: string,
  maxLength: number,
  fieldName: string
): ValidationResult {
  if (value.length > maxLength) {
    return createValidationResult(false, [
      `${fieldName}ต้องไม่เกิน ${maxLength} ตัวอักษร`,
    ]);
  }
  return createValidationResult(true);
}

export function validateRange(
  value: number,
  min: number,
  max: number,
  fieldName: string
): ValidationResult {
  if (value < min || value > max) {
    return createValidationResult(false, [
      `${fieldName}ต้องอยู่ระหว่าง ${min} ถึง ${max}`,
    ]);
  }
  return createValidationResult(true);
}
