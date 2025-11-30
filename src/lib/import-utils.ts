export type SimpleClientRow = {
  name: string;
  phone: string;
  car: string | null;
  revisionDate: string | null; // stored as ISO (YYYY-MM-DD)
};

const HEADERS = {
  name: ["nome", "name"],
  phone: ["telefone", "phone"],
  car: ["carro", "car"],
  revisionDate: ["validade", "revisiondate"],
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
  const get = (key: string) =>
    columnIndexes[key]
      ? String(row.getCell(columnIndexes[key]).value || "").trim()
      : "";

  const name = get("name");
  const phone = get("phone");
  const car = get("car") || null;
  const revisionDate = parseDate(get("revisionDate"));

  if (!name || !phone) return null;

  return { name, phone, car, revisionDate };
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

  // Local PT number (9 digits)
  if (/^\d{9}$/.test(phone)) {
    return defaultCountry + phone;
  }

  // Fallback
  return phone;
}

// const SUPPORTED_CODES = ["+351", "+33", "+41"];

// export function normalizePhone(input: any, defaultCountry = "+351") {
//   if (!input) return "";

//   let phone = String(input).trim();

//   // Remove non-digits & non-plus
//   phone = phone.replace(/[^\d+]/g, "");

//   // 00XX → +XX
//   if (phone.startsWith("00")) {
//     phone = "+" + phone.slice(2);
//   }

//   // Already in + format
//   if (phone.startsWith("+") && /^\+\d+$/.test(phone)) {
//     return phone;
//   }

//   // Missing '+' but starts with known country code
//   for (const code of SUPPORTED_CODES) {
//     const raw = code.slice(1); // "351"
//     if (phone.startsWith(raw)) {
//       return "+" + phone;
//     }
//   }

//   // Local PT number (9 digits)
//   if (/^\d{9}$/.test(phone)) {
//     return defaultCountry + phone;
//   }

//   // Fallback
//   return phone;
// }
