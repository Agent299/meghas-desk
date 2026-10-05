"use client"

import * as React from "react"
import Link from "next/link"
import { ArrowLeftIcon, PanelRightIcon } from "lucide-react"

import { Composer } from "@/components/inbox/composer"
import { ConversationDetails } from "@/components/inbox/conversation-details"
import { useInbox, useMemberLabel } from "@/components/inbox/inbox-provider"
import { StateBadge } from "@/components/inbox/state-badge"
import { Timeline } from "@/components/inbox/timeline"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { canClaim, canClose, visitorLabel } from "@/lib/inbox/conversations"

/** One Conversation: header actions, the timeline, the reply box, and the details panel. */
export function ConversationView({ conversationId }: { conversationId: string }) {
  const { conversations, currentMemberId, act } = useInbox()
  const memberLabel = useMemberLabel()
  // Inline panel from xl: up (open by default); a sheet below that.
  const [detailsOpen, setDetailsOpen] = React.useState(true)
  const [sheetOpen, setSheetOpen] = React.useState(false)

  const conversation = conversations.find((c) => c.id === conversationId)
  if (!conversation) return null

  const name = visitorLabel(conversation.visitor)
  const claimedBy = conversation.state === "human" ? memberLabel(conversation.claimedBy) : null
  const claimLabel =
    conversation.claimedBy && conversation.claimedBy !== currentMemberId && conversation.state === "human"
      ? "Re-claim"
      : "Claim"

  return (
    <div className="flex min-h-0 flex-1">
      <section aria-label={`Conversation with ${name}`} className="flex min-w-0 flex-1 flex-col">
        <header className="flex min-h-14 shrink-0 flex-wrap items-center gap-x-3 gap-y-2 border-b px-3 py-2 lg:px-6">
          <Button
            variant="ghost"
            size="icon"
            className="-ml-1 lg:hidden"
            nativeButton={false}
            render={<Link href="/dashboard/inbox" aria-label="Back to Conversations" />}
          >
            <ArrowLeftIcon />
          </Button>
          <div className="flex min-w-0 flex-col gap-0.5">
            <h2 className="truncate text-sm font-semibold">{name}</h2>
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <StateBadge state={conversation.state} />
              {claimedBy && <span className="truncate">Claimed by {claimedBy === "You" ? "you" : claimedBy}</span>}
            </div>
          </div>
          <div className="ml-auto flex items-center gap-2">
            {canClaim(conversation, currentMemberId) && (
              <Button variant="outline" size="sm" onClick={() => act(conversation.id, { type: "claim" })}>
                {claimLabel}
              </Button>
            )}
            {canClose(conversation) && (
              <Button size="sm" onClick={() => act(conversation.id, { type: "close" })}>
                Close
              </Button>
            )}
            <Button
              variant="ghost"
              size="icon"
              className="hidden xl:inline-flex"
              aria-label={detailsOpen ? "Hide details" : "Show details"}
              aria-pressed={detailsOpen}
              onClick={() => setDetailsOpen((open) => !open)}
            >
              <PanelRightIcon />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="xl:hidden"
              aria-label="Show details"
              onClick={() => setSheetOpen(true)}
            >
              <PanelRightIcon />
            </Button>
          </div>
        </header>

        <ScrollArea className="min-h-0 flex-1">
          <Timeline conversation={conversation} />
        </ScrollArea>
        <Composer key={conversation.id} conversation={conversation} />
      </section>

      {detailsOpen && (
        <aside aria-label="Details" className="hidden w-72 shrink-0 border-l xl:block">
          <ScrollArea className="h-full">
            <ConversationDetails conversation={conversation} />
          </ScrollArea>
        </aside>
      )}

      <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
        <SheetContent side="right" className="w-80 sm:max-w-sm">
          <SheetHeader>
            <SheetTitle>Details</SheetTitle>
            <SheetDescription className="sr-only">About {name} and this Conversation.</SheetDescription>
          </SheetHeader>
          <ConversationDetails conversation={conversation} />
        </SheetContent>
      </Sheet>
    </div>
  )
}
