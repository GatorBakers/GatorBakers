import { describe, it, expect } from "vitest";
import { validateRegInput } from "../../src/utils/validation";

const validInput = {
  email: "test@example.com",
  password: "Password1!",
  first_name: "John",
  last_name: "Doe",
};

describe("validateRegInput", () => {
  // ── Happy path ──────────────────────────────────────────────
  it("returns sanitized data for valid input", () => {
    const result = validateRegInput(validInput);
    expect(result).toEqual({
      sanitized: {
        email: "test@example.com",
        password: "Password1!",
        first_name: "John",
        last_name: "Doe",
      },
    });
  });

  it("trims and lowercases the email", () => {
    const result = validateRegInput({ ...validInput, email: "  Test@Example.COM  " });
    expect("sanitized" in result && result.sanitized.email).toBe("test@example.com");
  });

  it("trims first and last names", () => {
    const result = validateRegInput({ ...validInput, first_name: "  Jane  ", last_name: "  Smith  " });
    expect("sanitized" in result && result.sanitized.first_name).toBe("Jane");
    expect("sanitized" in result && result.sanitized.last_name).toBe("Smith");
  });

  // ── Missing fields ─────────────────────────────────────────
  describe("missing fields", () => {
    it("returns error when email is missing", () => {
      const { email, ...rest } = validInput;
      expect(validateRegInput(rest)).toEqual({ error: "All fields are required." });
    });

    it("returns error when password is missing", () => {
      const { password, ...rest } = validInput;
      expect(validateRegInput(rest)).toEqual({ error: "All fields are required." });
    });

    it("returns error when first_name is missing", () => {
      const { first_name, ...rest } = validInput;
      expect(validateRegInput(rest)).toEqual({ error: "All fields are required." });
    });

    it("returns error when last_name is missing", () => {
      const { last_name, ...rest } = validInput;
      expect(validateRegInput(rest)).toEqual({ error: "All fields are required." });
    });

    it("returns error when all fields are missing", () => {
      expect(validateRegInput({})).toEqual({ error: "All fields are required." });
    });
  });

  // ── Non-string field types ──────────────────────────────────
  describe("non-string field types", () => {
    it("returns error when email is a number", () => {
      expect(validateRegInput({ ...validInput, email: 123 as any })).toEqual({
        error: "All fields are required.",
      });
    });

    it("returns error when password is a number", () => {
      expect(validateRegInput({ ...validInput, password: 456 as any })).toEqual({
        error: "All fields are required.",
      });
    });

    it("returns error when first_name is an array", () => {
      expect(validateRegInput({ ...validInput, first_name: [] as any })).toEqual({
        error: "All fields are required.",
      });
    });

    it("returns error when last_name is an object", () => {
      expect(validateRegInput({ ...validInput, last_name: {} as any })).toEqual({
        error: "All fields are required.",
      });
    });

    it("returns error when fields are booleans", () => {
      expect(validateRegInput({ ...validInput, email: true as any, password: false as any })).toEqual({
        error: "All fields are required.",
      });
    });
  });

  // ── Whitespace-only fields ──────────────────────────────────
  describe("whitespace-only fields", () => {
    it("returns error when email is only whitespace", () => {
      expect(validateRegInput({ ...validInput, email: "   " })).toEqual({
        error: "All fields are required.",
      });
    });

    it("returns error when first_name is only whitespace", () => {
      expect(validateRegInput({ ...validInput, first_name: "   " })).toEqual({
        error: "All fields are required.",
      });
    });

    it("returns error when last_name is only whitespace", () => {
      expect(validateRegInput({ ...validInput, last_name: "   " })).toEqual({
        error: "All fields are required.",
      });
    });
  });

  // ── Email validation ────────────────────────────────────────
  describe("email validation", () => {
    it("rejects email without @", () => {
      const result = validateRegInput({ ...validInput, email: "testexample.com" });
      expect(result).toEqual({ error: "Please enter a valid email address." });
    });

    it("rejects email without domain", () => {
      const result = validateRegInput({ ...validInput, email: "test@" });
      expect(result).toEqual({ error: "Please enter a valid email address." });
    });

    it("rejects email without TLD", () => {
      const result = validateRegInput({ ...validInput, email: "test@example" });
      expect(result).toEqual({ error: "Please enter a valid email address." });
    });

    it("rejects email with special characters in local part", () => {
      const result = validateRegInput({ ...validInput, email: "te!st@example.com" });
      expect(result).toEqual({ error: "Please enter a valid email address." });
    });

    it("accepts email with dots and plus in local part", () => {
      const result = validateRegInput({ ...validInput, email: "john.doe+tag@example.com" });
      expect("sanitized" in result).toBe(true);
    });
  });

  // ── Name validation ─────────────────────────────────────────
  describe("name validation", () => {
    it("rejects first name with numbers", () => {
      const result = validateRegInput({ ...validInput, first_name: "John123" });
      expect(result).toEqual({
        error: "First name can only contain letters, hyphens, apostrophes, periods, and spaces.",
      });
    });

    it("rejects last name with numbers", () => {
      const result = validateRegInput({ ...validInput, last_name: "Doe456" });
      expect(result).toEqual({
        error: "Last name can only contain letters, hyphens, apostrophes, periods, and spaces.",
      });
    });

    it("rejects first name with special characters", () => {
      const result = validateRegInput({ ...validInput, first_name: "John@!" });
      expect(result).toEqual({
        error: "First name can only contain letters, hyphens, apostrophes, periods, and spaces.",
      });
    });

    it("accepts hyphenated names", () => {
      const result = validateRegInput({ ...validInput, first_name: "Mary-Jane", last_name: "O'Connor" });
      expect("sanitized" in result).toBe(true);
    });

    it("accepts names with apostrophes and periods", () => {
      const result = validateRegInput({ ...validInput, first_name: "St. John", last_name: "D'Arcy" });
      expect("sanitized" in result).toBe(true);
    });

    it("accepts unicode/accented names", () => {
      const result = validateRegInput({ ...validInput, first_name: "José", last_name: "Müller" });
      expect("sanitized" in result).toBe(true);
    });
  });

  // ── Password validation ─────────────────────────────────────
  describe("password validation", () => {
    it("rejects password with whitespace", () => {
      const result = validateRegInput({ ...validInput, password: "Pass word1!" });
      expect(result).toEqual({ error: "Password must not contain spaces or whitespace." });
    });

    it("rejects password shorter than 8 characters", () => {
      const result = validateRegInput({ ...validInput, password: "Pa1!" });
      expect(result).toEqual({ error: "Password must be at least 8 characters." });
    });

    it("rejects password without uppercase letter", () => {
      const result = validateRegInput({ ...validInput, password: "password1!" });
      expect(result).toEqual({ error: "Password must include at least one uppercase letter." });
    });

    it("rejects password without lowercase letter", () => {
      const result = validateRegInput({ ...validInput, password: "PASSWORD1!" });
      expect(result).toEqual({ error: "Password must include at least one lowercase letter." });
    });

    it("rejects password without number", () => {
      const result = validateRegInput({ ...validInput, password: "Password!!" });
      expect(result).toEqual({ error: "Password must include at least one number." });
    });

    it("rejects password without special character", () => {
      const result = validateRegInput({ ...validInput, password: "Password11" });
      expect(result).toEqual({ error: "Password must include at least one special character." });
    });

    it("accepts a strong valid password", () => {
      const result = validateRegInput({ ...validInput, password: "Str0ng!Pass" });
      expect("sanitized" in result).toBe(true);
    });
  });
});
