import crypto from "crypto";

// Encryption key should be 32 bytes for AES-256
// In production, this MUST be set in environment variables
const ENCRYPTION_KEY =
  process.env.ENCRYPTION_KEY || "default_dev_key_32_bytes!!";

// Ensure the key is exactly 32 bytes
function getEncryptionKey(): Buffer {
  // Create a hash of the key to ensure it's always 32 bytes
  return crypto.createHash("sha256").update(ENCRYPTION_KEY).digest();
}

/**
 * Encrypts sensitive data using AES-256-GCM
 * @param text - The plain text to encrypt
 * @returns The encrypted text in format: iv:authTag:encryptedData (all base64)
 */
export function encrypt(text: string): string {
  if (!text) return text;

  const key = getEncryptionKey();

  // Generate a random initialization vector (IV)
  const iv = crypto.randomBytes(16);

  // Create cipher with AES-256-GCM (authenticated encryption)
  const cipher = crypto.createCipheriv("aes-256-gcm", key, iv);

  // Encrypt the text
  let encrypted = cipher.update(text, "utf8", "base64");
  encrypted += cipher.final("base64");

  // Get the authentication tag
  const authTag = cipher.getAuthTag();

  // Return iv:authTag:encrypted (all base64 encoded)
  return `${iv.toString("base64")}:${authTag.toString("base64")}:${encrypted}`;
}

/**
 * Decrypts data that was encrypted with the encrypt function
 * @param encryptedText - The encrypted text in format: iv:authTag:encryptedData
 * @returns The decrypted plain text
 */
export function decrypt(encryptedText: string): string {
  if (!encryptedText) return encryptedText;

  // Check if the text is actually encrypted (contains colons)
  if (!encryptedText.includes(":")) {
    // Not encrypted, return as-is (for backwards compatibility)
    return encryptedText;
  }

  try {
    const key = getEncryptionKey();

    // Split the encrypted text into its components
    const parts = encryptedText.split(":");
    if (parts.length !== 3) {
      throw new Error("Invalid encrypted data format");
    }

    const iv = Buffer.from(parts[0], "base64");
    const authTag = Buffer.from(parts[1], "base64");
    const encrypted = parts[2];

    // Create decipher
    const decipher = crypto.createDecipheriv("aes-256-gcm", key, iv);
    decipher.setAuthTag(authTag);

    // Decrypt the text
    let decrypted = decipher.update(encrypted, "base64", "utf8");
    decrypted += decipher.final("utf8");

    return decrypted;
  } catch (error) {
    // Silent fallback for backwards compatibility
    // This handles old plain-text tokens or tokens encrypted with a different key
    console.warn("Decryption failed, returning original value (likely plain text)");
    return encryptedText;
  }
}

/**
 * Checks if a string is encrypted (has the encrypted format)
 */
export function isEncrypted(text: string): boolean {
  if (!text) return false;
  // Check if it matches the format: base64:base64:base64
  const parts = text.split(":");
  if (parts.length !== 3) return false;

  // Validate that all parts look like base64 (at least 8 chars each)
  const isBase64 = (str: string) =>
    /^[A-Za-z0-9+/]+=*$/.test(str) && str.length >= 8;
  return parts.every(isBase64);
}
