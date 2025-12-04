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

const SUPPORTED_CODES = ["+351", "+33", "+41"];

export function normalizePhone(input: any, defaultCountry = "+351") {
  if (!input) return "";

  let phone = String(input).trim();

  // Remove non-digits & non-plus
  phone = phone.replace(/[^\d+]/g, "");

  // 00XX → +XX
  if (phone.startsWith("00")) {
    phone = "+" + phone.slice(2);
  }

  // Already in + format
  if (phone.startsWith("+") && /^\+\d+$/.test(phone)) {
    return phone;
  }

  // Missing '+' but starts with known country code
  for (const code of SUPPORTED_CODES) {
    const raw = code.slice(1); // "351"
    if (phone.startsWith(raw)) {
      return "+" + phone;
    }
  }

  // Detect country by mobile prefix patterns
  // French mobile: 06 or 07 or 09 (9 digits total)
  if (/^0[6-7,9]\d{8}$/.test(phone)) {
    return "+33" + phone.slice(1); // Remove leading 0 and add +33
  }

  // Swiss mobile: 079 or 078 or 077 or 076 (starts with 07X, 9 digits total)
  if (/^07[6-9]\d{7}$/.test(phone)) {
    return "+41" + phone.slice(1); // Remove leading 0 and add +41
  }

  // Portuguese mobile: 91, 92, 93, 96 (9 digits)
  if (/^9[1-3,6]\d{7}$/.test(phone)) {
    return "+351" + phone;
  }

  // Local number (9 digits) - default to Portugal
  if (/^\d{9}$/.test(phone)) {
    return defaultCountry + phone;
  }

  // Fallback
  return phone;
}
