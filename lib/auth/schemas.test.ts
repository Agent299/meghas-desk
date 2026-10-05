import { describe, expect, it } from "vitest";

import {
  forgotPasswordSchema,
  loginMagicLinkSchema,
  loginSchema,
  otpSchema,
  resetPasswordSchema,
  signupMagicLinkSchema,
  signupSchema,
  validate,
} from "./schemas";

describe("loginSchema", () => {
  it("accepts an email and a password of at least 8 characters", () => {
    expect(validate(loginSchema, { email: " a@example.com ", password: "12345678" })).toEqual({
      data: { email: "a@example.com", password: "12345678" },
      errors: null,
    });
  });

  it("rejects a password shorter than 8 characters", () => {
    expect(validate(loginSchema, { email: "a@example.com", password: "1234567" }).errors).toEqual({
      password: "Passwords are at least 8 characters.",
    });
  });

  it("reports each missing field", () => {
    expect(validate(loginSchema, { email: "", password: "" }).errors).toEqual({
      email: "Enter your email.",
      password: "Enter your password.",
    });
  });

  it("rejects a malformed email", () => {
    expect(validate(loginSchema, { email: "nope", password: "12345678" }).errors).toEqual({
      email: "Enter a valid email address.",
    });
  });
});

describe("signupSchema", () => {
  const valid = {
    name: "Ada",
    email: "ada@example.com",
    password: "longenough",
    confirmPassword: "longenough",
  };

  it("asks for a password when it is empty, before checking its length", () => {
    expect(validate(signupSchema, { ...valid, password: "", confirmPassword: "" }).errors?.password).toBe(
      "Enter a password.",
    );
  });

  it("accepts a password of exactly 8 characters", () => {
    expect(validate(signupSchema, { ...valid, password: "12345678", confirmPassword: "12345678" }).errors).toBeNull();
  });

  it("accepts a complete form", () => {
    expect(signupSchema.safeParse(valid).success).toBe(true);
  });

  it("requires a name", () => {
    expect(validate(signupSchema, { ...valid, name: "  " }).errors).toEqual({
      name: "Enter your name.",
    });
  });

  it("requires at least 8 password characters", () => {
    expect(
      validate(signupSchema, { ...valid, password: "short", confirmPassword: "short" }).errors,
    ).toEqual({ password: "Use at least 8 characters." });
  });

  it("requires the confirmation to match", () => {
    expect(validate(signupSchema, { ...valid, confirmPassword: "different1" }).errors).toEqual({
      confirmPassword: "Passwords don't match.",
    });
  });

  it("rejects an invalid email", () => {
    expect(validate(signupSchema, { ...valid, email: "ada@" }).errors).toEqual({
      email: "Enter a valid email address.",
    });
  });
});

describe("magic-link schemas", () => {
  it("login needs only an email", () => {
    expect(loginMagicLinkSchema.safeParse({ email: "a@example.com" }).success).toBe(true);
    expect(validate(loginMagicLinkSchema, { email: "" }).errors).toEqual({
      email: "Enter your email.",
    });
  });

  it("signup needs a name and an email", () => {
    expect(
      signupMagicLinkSchema.safeParse({ name: "Ada", email: "a@example.com" }).success,
    ).toBe(true);
    expect(validate(signupMagicLinkSchema, { name: "", email: "bad" }).errors).toEqual({
      name: "Enter your name.",
      email: "Enter a valid email address.",
    });
  });
});

describe("otpSchema", () => {
  it("accepts exactly six digits", () => {
    expect(otpSchema.safeParse("012345").success).toBe(true);
    expect(otpSchema.safeParse(" 123456 ").data).toBe("123456");
  });

  it.each(["", "12345", "1234567", "12a456", "12 456"])("rejects %j", (value) => {
    expect(otpSchema.safeParse(value).success).toBe(false);
  });
});

describe("forgotPasswordSchema", () => {
  it("accepts a valid email and rejects others", () => {
    expect(forgotPasswordSchema.safeParse({ email: "a@example.com" }).success).toBe(true);
    expect(forgotPasswordSchema.safeParse({ email: "a" }).success).toBe(false);
  });
});

describe("resetPasswordSchema", () => {
  const valid = { otp: "123456", password: "newpassword", confirmPassword: "newpassword" };

  it("accepts a code and matching passwords", () => {
    expect(resetPasswordSchema.safeParse(valid).success).toBe(true);
  });

  it("rejects a bad code, a short password and a mismatch", () => {
    expect(validate(resetPasswordSchema, { ...valid, otp: "12" }).errors).toEqual({
      otp: "Enter the 6-digit code from the email.",
    });
    expect(
      validate(resetPasswordSchema, { ...valid, password: "short", confirmPassword: "short" })
        .errors,
    ).toEqual({ password: "Use at least 8 characters." });
    expect(validate(resetPasswordSchema, { ...valid, confirmPassword: "nope" }).errors).toEqual({
      confirmPassword: "Passwords don't match.",
    });
  });
});
