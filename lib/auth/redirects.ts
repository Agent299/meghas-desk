// Where a request should be sent, given which area it's for and whether there
// is a signed-in user. Used by the server layouts; proxy.ts is the first,
// optimistic gate in front of the dashboard.

export type AuthArea = "dashboard" | "auth";

export const LOGIN_PATH = "/login";
export const DASHBOARD_PATH = "/dashboard";

export function authRedirect(area: AuthArea, signedIn: boolean): string | null {
  if (area === "dashboard" && !signedIn) return LOGIN_PATH;
  if (area === "auth" && signedIn) return DASHBOARD_PATH;
  return null;
}
