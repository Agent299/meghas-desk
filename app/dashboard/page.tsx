import type { Metadata } from "next"
import { ZapOffIcon } from "lucide-react"

import { InboxStatsRow } from "@/components/overview/inbox-stats"
import { HomeBanner } from "@/components/widget/home-banner"
import { WidgetSetup } from "@/components/widget/widget-setup"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { getSessionSafe } from "@/lib/auth/server"
import { firstName } from "@/lib/inbox/conversations"
import { getWidgetSettings } from "@/lib/inbox/queries"

export const metadata: Metadata = { title: "Home · MeghasDesk" }

// Home: set up the widget (PRD §4 #1), with the inbox's live counts on top.
// Not an analytics page (PRD §8).
export default async function HomePage() {
  const [session, settings] = await Promise.all([getSessionSafe(), getWidgetSettings()])
  const name = session?.user.name?.trim()

  return (
    <div className="mx-auto flex w-full max-w-[1400px] flex-col gap-3 px-2 pb-3 md:px-3">
      <HomeBanner firstName={name ? firstName(name) : null} />

      {settings.allowanceUsedUp && (
        <Alert variant="destructive" className="border-destructive/40">
          <ZapOffIcon aria-hidden="true" />
          <AlertTitle>Monthly allowance used up</AlertTitle>
          <AlertDescription>
            The AI is paused until next month, so new Visitor messages go straight to Waiting.
          </AlertDescription>
        </Alert>
      )}

      <InboxStatsRow style={{ animationDelay: "0.06s" }} />
      <WidgetSetup initial={settings} />
    </div>
  )
}
