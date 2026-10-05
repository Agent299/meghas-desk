import type { Metadata } from "next"

import { InboxShell } from "@/components/inbox/inbox-shell"

export const metadata: Metadata = { title: "Inbox · MeghasDesk" }

// The list stays mounted while you move between Conversations; the thread is the page.
// Conversations come from the InboxProvider in the dashboard layout.
export default function InboxLayout({ children }: LayoutProps<"/dashboard/inbox">) {
  return <InboxShell>{children}</InboxShell>
}
