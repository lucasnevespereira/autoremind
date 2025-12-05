import { normalizePhone } from "../import-utils";

describe("normalizePhone", () => {
  describe("Already formatted with +", () => {
    test("should keep valid E.164 format unchanged", () => {
      expect(normalizePhone("+351912345678")).toBe("+351912345678");
      expect(normalizePhone("+33612345678")).toBe("+33612345678");
      expect(normalizePhone("+41791234567")).toBe("+41791234567");
      expect(normalizePhone("+393201234567")).toBe("+393201234567");
    });
  });

  describe("International prefix 00XX", () => {
    test("should convert 00XX to +XX", () => {
      expect(normalizePhone("00351912345678")).toBe("+351912345678");
      expect(normalizePhone("0033612345678")).toBe("+33612345678");
      expect(normalizePhone("0041791234567")).toBe("+41791234567");
    });
  });

  describe("Missing + but has country code", () => {
    test("should add + to numbers starting with country code", () => {
      expect(normalizePhone("351912345678")).toBe("+351912345678");
      expect(normalizePhone("33612345678")).toBe("+33612345678");
      expect(normalizePhone("41791234567")).toBe("+41791234567");
      expect(normalizePhone("39320123456")).toBe("+39320123456");
    });
  });

  describe("France (+33)", () => {
    test("should handle French mobile with leading 0 (06, 07, 09)", () => {
      expect(normalizePhone("0612345678")).toBe("+33612345678");
      expect(normalizePhone("0712345678")).toBe("+33712345678");
      expect(normalizePhone("0912345678")).toBe("+33912345678");
    });

    test("should handle French mobile with dropped leading 0 (Excel issue)", () => {
      expect(normalizePhone("612345678")).toBe("+33612345678");
      expect(normalizePhone("712345678")).toBe("+33712345678");
    });
  });

  describe("Portugal (+351)", () => {
    test("should handle Portuguese mobile (91, 92, 93, 96)", () => {
      expect(normalizePhone("912345678")).toBe("+351912345678");
      expect(normalizePhone("921234567")).toBe("+351921234567");
      expect(normalizePhone("931234567")).toBe("+351931234567");
      expect(normalizePhone("961234567")).toBe("+351961234567");
    });
  });

  describe("Spain (+34)", () => {
    test("should handle Spanish mobile (6, 7) - but defaults to French due to Excel ambiguity", () => {
      // Note: 9-digit numbers starting with 6/7 are treated as French with dropped 0
      expect(normalizePhone("612345678")).toBe("+33612345678");
      expect(normalizePhone("712345678")).toBe("+33712345678");
    });
  });

  describe("Switzerland (+41)", () => {
    test("should handle Swiss mobile with leading 0 (07, 08)", () => {
      expect(normalizePhone("0791234567")).toBe("+41791234567");
      expect(normalizePhone("0781234567")).toBe("+41781234567");
      expect(normalizePhone("0761234567")).toBe("+41761234567");
    });
  });

  describe("Italy (+39)", () => {
    test("should handle Italian mobile starting with 3", () => {
      expect(normalizePhone("3201234567")).toBe("+393201234567");
      expect(normalizePhone("3331234567")).toBe("+393331234567");
      expect(normalizePhone("3401234567")).toBe("+393401234567");
    });
  });

  describe("Germany (+49)", () => {
    test("should handle German mobile with leading 0 (015, 016, 017)", () => {
      expect(normalizePhone("01512345678")).toBe("+491512345678");
      expect(normalizePhone("01612345678")).toBe("+491612345678");
      expect(normalizePhone("01712345678")).toBe("+491712345678");
    });
  });

  describe("United States / Canada (+1)", () => {
    test("should handle US/Canada 10-digit numbers", () => {
      expect(normalizePhone("2025551234")).toBe("+12025551234");
      expect(normalizePhone("4165551234")).toBe("+14165551234");
    });
  });

  describe("UK (+44)", () => {
    test("should handle UK mobile with leading 0 (07)", () => {
      expect(normalizePhone("07912345678")).toBe("+447912345678");
      expect(normalizePhone("07812345678")).toBe("+447812345678");
    });
  });

  describe("Edge cases", () => {
    test("should handle numbers with spaces and dashes", () => {
      expect(normalizePhone("06 12 34 56 78")).toBe("+33612345678");
      expect(normalizePhone("912-345-678")).toBe("+351912345678");
      expect(normalizePhone("+351 912 345 678")).toBe("+351912345678");
    });

    test("should handle numbers with parentheses", () => {
      expect(normalizePhone("(202) 555-1234")).toBe("+12025551234");
    });

    test("should return empty string for null/empty input", () => {
      expect(normalizePhone("")).toBe("");
      expect(normalizePhone(null)).toBe("");
      expect(normalizePhone(undefined)).toBe("");
    });

    test("should handle 9-digit generic numbers with default country", () => {
      // Any 9-digit number that doesn't match patterns defaults to Portugal (+351)
      expect(normalizePhone("123456789")).toBe("+351123456789");
      expect(normalizePhone("812345678")).toBe("+351812345678");
    });
  });

  describe("Excel dropped zeros", () => {
    test("should handle Excel dropping leading zeros correctly", () => {
      // French: 0619175939 → 619175939 (Excel drops the 0)
      expect(normalizePhone("619175939")).toBe("+33619175939");

      // Swiss: 0791234567 stays as string "0791234567" if formatted as Text
      expect(normalizePhone("0791234567")).toBe("+41791234567");

      // German: 01512345678 stays if formatted as Text
      expect(normalizePhone("01512345678")).toBe("+491512345678");
    });
  });
});
