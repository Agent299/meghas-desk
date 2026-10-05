export type DashboardUser = {
  name: string | null
  email: string
  image?: string | null
}

export type UserDisplay = {
  /** First line: the name, or the email when there is no name. */
  primary: string
  /** Second line: the email, or null when it is already the primary line. */
  secondary: string | null
  /** One or two upper-case letters for the avatar fallback. */
  initials: string
}

function initialsFrom(parts: string[]): string {
  const letters = parts
    .filter(Boolean)
    .map((part) => Array.from(part)[0] ?? "")
    .filter(Boolean)
  const picked =
    letters.length > 1 ? [letters[0], letters[letters.length - 1]] : letters
  return picked.join("").toUpperCase()
}

/** How a Team member is shown in the dashboard: name and email lines plus avatar initials. */
export function getUserDisplay(user: DashboardUser): UserDisplay {
  const name = user.name?.trim() ?? ""
  const email = user.email.trim()

  if (name) {
    return {
      primary: name,
      secondary: email,
      initials: initialsFrom(name.split(/\s+/)) || "?",
    }
  }

  const local = email.split("@")[0] ?? ""
  return {
    primary: email,
    secondary: null,
    initials: initialsFrom(local.split(/[._+-]+/)) || "?",
  }
}
