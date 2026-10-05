import type { Metadata } from "next"

import { InboxProvider } from "@/components/inbox/inbox-provider"
import { InboxShell } from "@/components/inbox/inbox-shell"
import { getSessionSafe } from "@/lib/auth/server"
import { getInboxData } from "@/lib/inbox/queries"

export const metadata: Metadata = { title: "Inbox · MeghasDesk" }

// The list stays mounted while you move between Conversations; the thread is the page.
export default async function InboxLayout({ children }: LayoutProps<"/dashboard/inbox">) {
  const session = await getSessionSafe()
  const data = await getInboxData(session?.user.name || session?.user.email || "You")

  return (
    <InboxProvider initial={data}>
      <InboxShell>{children}</InboxShell>
    </InboxProvider>
  )
}
