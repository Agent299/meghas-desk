import type { Metadata } from "next"
import { ZapOffIcon } from "lucide-react"

import { SampleDataNotice } from "@/components/dashboard/sample-data-notice"
import { NeedsAttention } from "@/components/overview/needs-attention"
import { SetupChecklist } from "@/components/overview/setup-checklist"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { getSessionSafe } from "@/lib/auth/server"
import { firstName } from "@/lib/inbox/conversations"
import { getInboxData, getWorkspaceOverview } from "@/lib/inbox/queries"

export const metadata: Metadata = { title: "Overview · MeghasDesk" }

// Not an analytics page (PRD §8): what to set up next, and who needs a person.
export default async function OverviewPage() {
  const session = await getSessionSafe()
  const name = session?.user.name?.trim()
  const [overview, inbox] = await Promise.all([getWorkspaceOverview(), getInboxData(name || "You")])

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-6 p-4 lg:p-6">
      <div className="flex flex-col gap-2">
        <h2 className="text-2xl font-semibold tracking-tight">{name ? `Welcome, ${firstName(name)}` : "Welcome"}</h2>
        <p className="text-sm text-muted-foreground">
          The AI answers your Visitors from your Knowledge files. You step in when someone asks for a person.
        </p>
        <SampleDataNotice>Your real setup and Conversations appear here once your Workspace is live.</SampleDataNotice>
      </div>

      {overview.allowanceUsedUp && (
        <Alert variant="destructive" className="border-destructive/40">
          <ZapOffIcon aria-hidden="true" />
          <AlertTitle>Monthly allowance used up</AlertTitle>
          <AlertDescription>
            The AI is paused until next month, so new Visitor messages go straight to Waiting.
          </AlertDescription>
        </Alert>
      )}

      <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,24rem)]">
        <SetupChecklist steps={overview.setup} />
        <NeedsAttention conversations={inbox.conversations} now={inbox.now} />
      </div>
    </div>
  )
}
