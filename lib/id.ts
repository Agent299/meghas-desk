/**
 * A random id for things created in the browser. `crypto.randomUUID` only
 * exists on secure origins (https, localhost), so a dev server opened over the
 * LAN falls back to a random string.
 */
export function randomId(): string {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") return crypto.randomUUID()
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`
}
