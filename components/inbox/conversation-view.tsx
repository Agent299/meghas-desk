"use client"

import * as React from "react"
import Link from "next/link"
import { ArrowLeftIcon, PanelRightIcon } from "lucide-react"

import { Composer } from "@/components/inbox/composer"
import { ConversationDetails } from "@/components/inbox/conversation-details"
import { useInbox, useMemberLabel } from "@/components/inbox/inbox-provider"
import { paneClassName } from "@/components/inbox/pane"
import { StateBadge } from "@/components/inbox/state-badge"
import { Timeline } from "@/components/inbox/timeline"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { canClaim, canClose, visitorLabel } from "@/lib/inbox/conversations"
import { cn } from "@/lib/utils"

/** One Conversation: header actions, the timeline, the reply box, and the details card. */
export function ConversationView({ conversationId }: { conversationId: string }) {
  const { conversations, currentMemberId, act } = useInbox()
  const memberLabel = useMemberLabel()
  // Inline card from 1400px up (open by default), so the thread keeps room to read; a sheet below that.
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
    <>
      <section aria-label={`Conversation with ${name}`} className={cn(paneClassName, "min-w-0 flex-1")}>
        <header className="flex shrink-0 flex-wrap items-center gap-x-3 gap-y-2 border-b px-3 py-3 lg:px-5">
          <Button
            variant="ghost"
            size="icon"
            className="-ml-1 lg:hidden"
            nativeButton={false}
            render={<Link href="/dashboard/inbox" aria-label="Back to Conversations" />}
          >
            <ArrowLeftIcon />
          </Button>
          <div className="flex min-w-0 flex-col gap-1">
            <h2 className="truncate font-display text-xl leading-tight font-normal tracking-[-0.02em]">{name}</h2>
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <StateBadge state={conversation.state} />
              {claimedBy && <span className="truncate">Claimed by {claimedBy === "You" ? "you" : claimedBy}</span>}
            </div>
          </div>
          <div className="ml-auto flex items-center gap-2">
            {canClaim(conversation, currentMemberId) && (
              <Button variant="outline" onClick={() => act(conversation.id, { type: "claim" })}>
                {claimLabel}
              </Button>
            )}
            {canClose(conversation) && (
              <Button onClick={() => act(conversation.id, { type: "close" })}>Close</Button>
            )}
            <Button
              variant="ghost"
              size="icon"
              className="hidden min-[1400px]:inline-flex"
              aria-label={detailsOpen ? "Hide details" : "Show details"}
              aria-pressed={detailsOpen}
              onClick={() => setDetailsOpen((open) => !open)}
            >
              <PanelRightIcon />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="min-[1400px]:hidden"
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
        <aside aria-label="Details" className={cn(paneClassName, "hidden w-72 shrink-0 min-[1400px]:flex")}>
          <ScrollArea className="min-h-0 flex-1">
            <ConversationDetails conversation={conversation} />
          </ScrollArea>
        </aside>
      )}

      <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
        <SheetContent side="right" className="w-80 sm:max-w-sm">
          <SheetHeader className="sr-only">
            <SheetTitle>Details</SheetTitle>
            <SheetDescription>About {name} and this Conversation.</SheetDescription>
          </SheetHeader>
          <ConversationDetails conversation={conversation} />
        </SheetContent>
      </Sheet>
    </>
  )
}
