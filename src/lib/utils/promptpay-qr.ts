/**
 * PromptPay QR Payload Generator
 *
 * Generates EMVCo-compliant QR payload strings for Thai PromptPay.
 * Compatible with qrcode.react for rendering.
 *
 * Spec reference: https://www.bot.or.th/Thai/PaymentSystems/StandardPS/Documents/EMVCo-Merchant-Presented-QR-Specification.pdf
 */

function pad(value: string, length: number) {
  return value.padStart(length, "0");
}

function crc16(data: string): string {
  let crc = 0xffff;
  for (let i = 0; i < data.length; i++) {
    crc ^= data.charCodeAt(i) << 8;
    for (let j = 0; j < 8; j++) {
      if (crc & 0x8000) {
        crc = (crc << 1) ^ 0x1021;
      } else {
        crc <<= 1;
      }
    }
  }
  return ((crc & 0xffff) >>> 0).toString(16).padStart(4, "0").toUpperCase();
}

function field(id: string, value: string): string {
  return `${id}${pad(value.length.toString(), 2)}${value}`;
}

/**
 * Generates a PromptPay QR payload string.
 *
 * @param promptPayId - Mobile number (10 digits) or national ID (13 digits) or tax ID (13 digits)
 * @param amount - Optional amount in THB (omit for user-entered amount)
 */
export function generatePromptPayPayload(
  promptPayId: string,
  amount?: number
): string {
  const normalized = promptPayId.replace(/[^0-9]/g, "");

  let accountId: string;
  if (normalized.length === 10) {
    // Mobile phone
    accountId = `0066${normalized.substring(1)}`;
  } else if (normalized.length === 13) {
    // National ID or Tax ID
    accountId = normalized;
  } else {
    accountId = normalized;
  }

  // Build merchant account info (tag 29)
  const guid = field("00", "A000000677010111");
  const mobile = field("01", accountId);
  const merchantAccount = field("29", `${guid}${mobile}`);

  // Point of initiation method
  const initiation = amount ? field("01", "12") : field("01", "11");

  // Optional amount field (tag 54)
  const amountField = amount
    ? field("54", amount.toFixed(2))
    : "";

  // Country code and currency
  const countryCode = field("58", "TH");
  const currency = field("53", "764");

  // Assemble without CRC
  const payload = [
    field("00", "01"),    // Payload format indicator
    initiation,
    merchantAccount,
    currency,
    amountField,
    countryCode,
    "6304",              // CRC tag placeholder (value appended after)
  ].join("");

  return payload + crc16(payload);
}

/**
 * Formats a PromptPay ID for display (mask middle digits)
 */
export function maskPromptPayId(id: string): string {
  const clean = id.replace(/[^0-9]/g, "");
  if (clean.length === 10) {
    return `0${clean.substring(1, 3)}xxx${clean.substring(6)}`;
  }
  if (clean.length === 13) {
    return `${clean.substring(0, 3)}-xxxx-xxxxx-${clean.substring(12)}-x`;
  }
  return id;
}
