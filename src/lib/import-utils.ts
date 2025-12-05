export type SimpleClientRow = {
  name: string;
  email?: string | null;
  phone: string;
  resource: string | null;
  reminderDate: string | null; // stored as ISO (YYYY-MM-DD)
};

const HEADERS = {
  name: ["nome", "name", "client", "cliente"],
  email: ["email", "e-mail", "mail"],
  phone: ["telefone", "telemóvel", "telemovel", "phone", "mobile"],
  resource: ["recurso", "resource", "carro", "car", "vehicle", "viatura"],
  reminderDate: [
    "data",
    "reminderdate",
    "date",
    "validade",
    "revisiondate",
    "reminder date",
  ],
};

// Normalize header -> canonical key
export function normalizeHeader(header: string) {
  const clean = header.trim().toLowerCase();

  for (const key in HEADERS) {
    if (HEADERS[key as keyof typeof HEADERS].includes(clean)) {
      return key as keyof typeof HEADERS;
    }
  }

  return null;
}

// Parse a date string. Supported formats: DD/MM/YYYY or YYYY-MM-DD
export function parseDate(input: string | null): string | null {
  if (!input) return null;

  const str = input.trim();

  // DD/MM/YYYY (Portugal)
  if (/^\d{2}\/\d{2}\/\d{4}$/.test(str)) {
    const [d, m, y] = str.split("/").map(Number);
    const date = new Date(y, m - 1, d);
    return !isNaN(date.getTime()) ? date.toISOString().split("T")[0] : null;
  }

  // ISO YYYY-MM-DD
  if (/^\d{4}-\d{2}-\d{2}$/.test(str)) {
    return str;
  }

  // Unsupported → Null
  return null;
}

const SUPPORTED_COUNTRY_CODES = ["+351", "+33", "+41", "+44", "+49", "+34"];

// Normalize Excel row
export function normalizeRow(
  row: any,
  columnIndexes: Record<string, number>
): SimpleClientRow | null {
  const get = (key: string) => {
    if (!columnIndexes[key]) return "";
    const cell = row.getCell(columnIndexes[key]);
    const value = cell.value;
    return String(value || "").trim();
  };

  const getDate = (key: string): string | null => {
    if (!columnIndexes[key]) return null;
    const cell = row.getCell(columnIndexes[key]);
    const value = cell.value;

    // If it's already a Date object from Excel
    if (value instanceof Date) {
      return value.toISOString().split("T")[0];
    }

    // If it's a string, parse it
    if (typeof value === "string") {
      return parseDate(value);
    }

    return null;
  };

  const name = get("name");
  const email = get("email") || null;
  const phone = get("phone");
  const resource = get("resource") || null;
  const reminderDate = getDate("reminderDate");

  if (!name || !phone) return null;

  return { name, email, phone, resource, reminderDate };
}

const SUPPORTED_CODES = ["+351", "+33", "+41", "+44", "+49", "+34", "+39", "+1"];

export function normalizePhone(input: any, defaultCountry = "+351") {
  if (!input) return "";

  let phone = String(input).trim();

  // Remove spaces, dashes, parentheses, and other non-digit characters (keep + only)
  phone = phone.replace(/[^\d+]/g, "");

  // Handle 00XX international prefix → +XX
  if (phone.startsWith("00")) {
    phone = "+" + phone.slice(2);
  }

  // Already in E.164 format with +
  if (phone.startsWith("+") && /^\+\d{7,15}$/.test(phone)) {
    return phone;
  }

  // Country-specific patterns with leading 0 (national format)
  // Priority order matters - check most specific patterns first
  // IMPORTANT: Check these BEFORE country code matching to avoid false positives

  // Swiss mobile: 074-079 (10 digits total: 0 + 9 digits)
  // Must check BEFORE French to avoid 07X being matched as French
  if (/^07[4-9]\d{7}$/.test(phone)) {
    return "+41" + phone.slice(1); // Remove leading 0, add +41
  }

  // French mobile: 06, 07, 09 (10 digits total with leading 0)
  if (/^0[6-7,9]\d{8}$/.test(phone)) {
    return "+33" + phone.slice(1); // Remove leading 0, add +33
  }

  // Missing '+' but starts with a known country code (without +)
  // Check for FULL country codes with proper length validation
  // Order matters: Check longer prefixes first (351 before 33)
  if (phone.startsWith("351") && phone.length === 12) {
    return "+" + phone;
  }
  if (phone.startsWith("44") && phone.length === 13) {
    return "+" + phone;
  }
  if (phone.startsWith("49") && phone.length >= 13) {
    return "+" + phone;
  }
  if (phone.startsWith("41") && phone.length === 11) {
    return "+" + phone;
  }
  if (phone.startsWith("39") && phone.length >= 11 && phone.length <= 13) {
    return "+" + phone;
  }
  if (phone.startsWith("34") && phone.length === 11) {
    return "+" + phone;
  }
  if (phone.startsWith("33") && phone.length === 11) {
    return "+" + phone;
  }
  if (phone.startsWith("1") && phone.length === 11) {
    return "+" + phone;
  }

  // UK mobile: 07 (11 digits total with leading 0)
  if (/^07\d{9}$/.test(phone)) {
    return "+44" + phone.slice(1); // Remove leading 0, add +44
  }

  // German mobile: 015, 016, 017 (11-12 digits total with leading 0)
  if (/^0(15|16|17)\d{8,9}$/.test(phone)) {
    return "+49" + phone.slice(1); // Remove leading 0, add +49
  }

  // Italian mobile: 3XX (10 digits total with leading 3, no leading 0)
  if (/^3\d{8,9}$/.test(phone)) {
    return "+39" + phone;
  }

  // Spanish mobile: 6, 7 (9 digits total, no leading 0)
  // Note: This is valid Spanish format, but could be confused with French if Excel drops leading 0
  if (/^[67]\d{8}$/.test(phone)) {
    // Check if it could be French (06/07 with dropped 0) or Spanish
    // Default to French as it's more likely Excel dropped the 0
    return "+33" + phone;
  }

  // Portuguese mobile: 91, 92, 93, 96 (9 digits, no leading 0)
  if (/^9[1-3,6]\d{7}$/.test(phone)) {
    return "+351" + phone;
  }

  // US/Canada: 10 digits (no leading 0 or 1)
  if (/^\d{10}$/.test(phone)) {
    return "+1" + phone;
  }

  // Generic: any 9-digit number without prefix → assume default country
  if (/^\d{9}$/.test(phone)) {
    return defaultCountry + phone;
  }

  // If we can't determine format, return as-is (might need manual correction)
  return phone;
}
