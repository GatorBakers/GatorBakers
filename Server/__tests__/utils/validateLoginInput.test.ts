import { describe, it, expect } from "vitest";
import { validateLoginInput } from "../../src/utils/validation";

const validInput = {
  email: "test@example.com",
  password: "Password1!",
};

describe("validateLoginInput", () => {
  // ── Happy path ──────────────────────────────────────────────
  it("returns sanitized data for valid input", () => {
    const result = validateLoginInput(validInput);
    expect(result).toEqual({
      sanitized: {
        email: "test@example.com",
        password: "Password1!",
      },
    });
  });

  it("trims and lowercases the email", () => {
    const result = validateLoginInput({ ...validInput, email: "  Test@Example.COM  " });
    expect("sanitized" in result && result.sanitized.email).toBe("test@example.com");
  });

  it("does not trim the password", () => {
    const result = validateLoginInput({ ...validInput, password: "  Password1!  " });
    expect("sanitized" in result && result.sanitized.password).toBe("  Password1!  ");
  });

  // ── Missing fields ─────────────────────────────────────────
  describe("missing fields", () => {
    it("returns error when email is missing", () => {
      const { email, ...rest } = validInput;
      expect(validateLoginInput(rest)).toEqual({ error: "Email and password are required." });
    });

    it("returns error when password is missing", () => {
      const { password, ...rest } = validInput;
      expect(validateLoginInput(rest)).toEqual({ error: "Email and password are required." });
    });

    it("returns error when both fields are missing", () => {
      expect(validateLoginInput({})).toEqual({ error: "Email and password are required." });
    });
  });

  // ── Empty / whitespace-only fields ─────────────────────────
  describe("empty or whitespace-only fields", () => {
    it("returns error when email is empty string", () => {
      expect(validateLoginInput({ ...validInput, email: "" })).toEqual({
        error: "Email and password are required.",
      });
    });

    it("returns error when email is whitespace-only", () => {
      expect(validateLoginInput({ ...validInput, email: "   " })).toEqual({
        error: "Email and password are required.",
      });
    });

    it("returns error when password is empty string", () => {
      expect(validateLoginInput({ ...validInput, password: "" })).toEqual({
        error: "Email and password are required.",
      });
    });
  });

  // ── Invalid email format ───────────────────────────────────
  describe("invalid email format", () => {
    it("returns error for email without @", () => {
      expect(validateLoginInput({ ...validInput, email: "testexample.com" })).toEqual({
        error: "Please enter a valid email address.",
      });
    });

    it("returns error for email without domain", () => {
      expect(validateLoginInput({ ...validInput, email: "test@" })).toEqual({
        error: "Please enter a valid email address.",
      });
    });

    it("returns error for email without TLD", () => {
      expect(validateLoginInput({ ...validInput, email: "test@example" })).toEqual({
        error: "Please enter a valid email address.",
      });
    });
  });

  // ── Non-string types ───────────────────────────────────────
  describe("non-string types", () => {
    it("returns error when email is a number", () => {
      expect(validateLoginInput({ email: 123 as unknown as string, password: "Password1!" })).toEqual({
        error: "Email and password are required.",
      });
    });

    it("returns error when password is a number", () => {
      expect(validateLoginInput({ email: "test@example.com", password: 123 as unknown as string })).toEqual({
        error: "Email and password are required.",
      });
    });

    it("returns error when email is null", () => {
      expect(validateLoginInput({ email: null as unknown as string, password: "Password1!" })).toEqual({
        error: "Email and password are required.",
      });
    });
  });
});
