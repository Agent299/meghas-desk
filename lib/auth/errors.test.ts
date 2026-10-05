import { describe, expect, it } from "vitest";

import { authErrorMessage, isEmailNotVerified, redirectErrorMessage } from "./errors";

describe("authErrorMessage", () => {
  it.each([
    [{ code: "invalid_credentials", status: 401 }, "That email and password don't match."],
    [{ code: "email_not_confirmed", status: 422 }, "Confirm your email to continue."],
    [{ status: 429 }, "Too many attempts. Wait a minute and try again."],
    [{ code: "validation_failed", status: 400, message: "Invalid OTP" }, "That code isn't right. Check it and try again."],
    [{ code: "validation_failed", status: 400, message: "OTP expired" }, "That code has expired. Send a new one."],
    [{ code: "feature_not_supported", status: 403, message: "Too many attempts" }, "Too many wrong codes. Send a new one."],
    [{ code: "weak_password", status: 400, message: "Password does not meet security requirements" }, "Use a password of 8 to 128 characters."],
    [{ code: "user_already_exists", status: 409 }, "An account with this email already exists. Log in instead."],
    [{ status: 500, message: "boom" }, "Something went wrong on our side. Try again in a moment."],
  ])("maps %j", (error, expected) => {
    expect(authErrorMessage(error)).toBe(expected);
  });

  it.each([undefined, null, "oops", 42, {}])("falls back for %j", (error) => {
    expect(authErrorMessage(error)).toBe("Something went wrong. Try again.");
  });
});

describe("isEmailNotVerified", () => {
  it("is true only for email_not_confirmed", () => {
    expect(isEmailNotVerified({ code: "email_not_confirmed" })).toBe(true);
    expect(isEmailNotVerified({ code: "invalid_credentials" })).toBe(false);
    expect(isEmailNotVerified(null)).toBe(false);
    expect(isEmailNotVerified("email_not_confirmed")).toBe(false);
  });
});

describe("redirectErrorMessage", () => {
  it("returns null without a code", () => {
    expect(redirectErrorMessage(null)).toBeNull();
    expect(redirectErrorMessage("")).toBeNull();
  });

  it("explains known codes", () => {
    expect(redirectErrorMessage("account_not_linked")).toMatch(/already has an account/);
    expect(redirectErrorMessage("INVALID_TOKEN")).toMatch(/expired or was already used/);
    expect(redirectErrorMessage("signup_disabled")).toBe("Sign-up is currently closed.");
    expect(redirectErrorMessage("link_incomplete")).toMatch(/didn't finish/);
  });

  it("has a generic message for unknown codes", () => {
    expect(redirectErrorMessage("something_new")).toBe("Sign-in didn't complete. Try again.");
  });
});
