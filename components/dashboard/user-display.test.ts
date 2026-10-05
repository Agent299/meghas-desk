import { describe, expect, it } from "vitest";

import { getUserDisplay } from "./user-display";

describe("getUserDisplay", () => {
  it("shows the name first, the email second, and initials from first and last name", () => {
    expect(getUserDisplay({ name: "Ada King Lovelace", email: "ada@example.com" })).toEqual({
      primary: "Ada King Lovelace",
      secondary: "ada@example.com",
      initials: "AL",
    });
  });

  it("uses one initial for a single-word name", () => {
    expect(getUserDisplay({ name: "Ada", email: "ada@example.com" }).initials).toBe("A");
  });

  it("falls back to the email when the name is missing", () => {
    expect(getUserDisplay({ name: null, email: "maria.fernandez@example.com" })).toEqual({
      primary: "maria.fernandez@example.com",
      secondary: null,
      initials: "MF",
    });
  });

  it("treats a blank name like a missing one", () => {
    const display = getUserDisplay({ name: "   ", email: "jo@example.com" });
    expect(display.primary).toBe("jo@example.com");
    expect(display.secondary).toBeNull();
    expect(display.initials).toBe("J");
  });
});
