import { encrypt, decrypt, isEncrypted } from "../encryption";

describe("encryption", () => {
  describe("encrypt and decrypt", () => {
    test("should encrypt and decrypt text correctly", () => {
      const originalText = "my-secret-twilio-token-12345";
      const encrypted = encrypt(originalText);
      const decrypted = decrypt(encrypted);

      expect(encrypted).not.toBe(originalText);
      expect(decrypted).toBe(originalText);
    });

    test("should produce different encrypted values for same input (due to random IV)", () => {
      const text = "same-text";
      const encrypted1 = encrypt(text);
      const encrypted2 = encrypt(text);

      // Different encrypted values (because of random IV)
      expect(encrypted1).not.toBe(encrypted2);

      // But both decrypt to the same original
      expect(decrypt(encrypted1)).toBe(text);
      expect(decrypt(encrypted2)).toBe(text);
    });

    test("should handle empty strings", () => {
      expect(encrypt("")).toBe("");
      expect(decrypt("")).toBe("");
    });

    test("should handle special characters and unicode", () => {
      const specialText = "Olá! 你好 🔒 @#$%^&*()";
      const encrypted = encrypt(specialText);
      const decrypted = decrypt(specialText);

      expect(decrypt(encrypted)).toBe(specialText);
    });

    test("should return original text if not encrypted format (backwards compatibility)", () => {
      const plainText = "not-encrypted-token";
      const decrypted = decrypt(plainText);

      expect(decrypted).toBe(plainText);
    });
  });

  describe("isEncrypted", () => {
    test("should detect encrypted text", () => {
      const text = "my-secret";
      const encrypted = encrypt(text);

      expect(isEncrypted(encrypted)).toBe(true);
    });

    test("should detect non-encrypted text", () => {
      expect(isEncrypted("plain-text")).toBe(false);
      expect(isEncrypted("")).toBe(false);
      expect(isEncrypted("only:one:colon")).toBe(false); // Not base64
    });
  });

  describe("encryption format", () => {
    test("should produce format: iv:authTag:encrypted", () => {
      const encrypted = encrypt("test");
      const parts = encrypted.split(":");

      expect(parts.length).toBe(3);
      // All parts should be base64 (alphanumeric + / + = + +)
      parts.forEach((part) => {
        expect(part).toMatch(/^[A-Za-z0-9+/=]+$/);
      });
    });
  });

  describe("real-world Twilio token", () => {
    test("should encrypt and decrypt a realistic Twilio auth token", () => {
      const twilioToken = "abcdef1234567890abcdef1234567890"; // 32 char token
      const encrypted = encrypt(twilioToken);
      const decrypted = decrypt(encrypted);

      expect(encrypted).toContain(":");
      expect(isEncrypted(encrypted)).toBe(true);
      expect(decrypted).toBe(twilioToken);
    });
  });
});
