import { describe, expect, it } from "vitest";

import { authRedirect, DASHBOARD_PATH, LOGIN_PATH } from "./redirects";

describe("authRedirect", () => {
  it("sends signed-out visitors from the dashboard to /login", () => {
    expect(authRedirect("dashboard", false)).toBe(LOGIN_PATH);
  });

  it("lets signed-in users into the dashboard", () => {
    expect(authRedirect("dashboard", true)).toBeNull();
  });

  it("sends signed-in users away from the auth pages to /dashboard", () => {
    expect(authRedirect("auth", true)).toBe(DASHBOARD_PATH);
  });

  it("lets signed-out visitors use the auth pages", () => {
    expect(authRedirect("auth", false)).toBeNull();
  });
});
