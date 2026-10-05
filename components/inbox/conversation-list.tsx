"use client"

import Link from "next/link"
import { useSelectedLayoutSegment } from "next/navigation"
import { InboxIcon } from "lucide-react"

import { useInbox, useMemberLabel } from "@/components/inbox/inbox-provider"
import { StateBadge } from "@/components/inbox/state-badge"
import { VisitorAvatar } from "@/components/inbox/visitor-avatar"
import { SampleDataNotice } from "@/components/dashboard/sample-data-notice"
import { Empty, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from "@/components/ui/empty"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  countByView,
  formatRelative,
  INBOX_VIEWS,
  lastActivityAt,
  lastMessage,
  matchesView,
  sortForInbox,
  visitorLabel,
  type InboxView,
} from "@/lib/inbox/conversations"
import type { Conversation } from "@/lib/inbox/types"
import { cn } from "@/lib/utils"

const EMPTY_COPY: Record<InboxView, string> = {
  open: "Every Conversation is Closed.",
  waiting: "No one is waiting for a person.",
  ai_answering: "The AI isn't answering anyone right now.",
  human: "No Conversation is claimed right now.",
  mine: "You haven't claimed any open Conversations.",
  closed: "No Conversations have been Closed yet.",
  all: "Conversations appear here when Visitors write in the widget.",
}

export function ConversationList() {
  const { conversations, currentMemberId, view, setView } = useInbox()
  const selectedId = useSelectedLayoutSegment()
  const counts = countByView(conversations, currentMemberId)
  const visible = sortForInbox(conversations.filter((c) => matchesView(c, view, currentMemberId)))

  return (
    <>
      <div className="flex items-center gap-2 border-b px-3 py-2.5">
        <Select items={INBOX_VIEWS} value={view} onValueChange={(value) => value && setView(value as InboxView)}>
          <SelectTrigger
            aria-label="Show Conversations"
            className="h-9 border-transparent px-2 text-[15px] font-medium shadow-none hover:bg-muted dark:bg-transparent"
          >
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {INBOX_VIEWS.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
                <span className="ml-auto text-xs text-muted-foreground tabular-nums">{counts[option.value]}</span>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <span className="ml-auto pr-1 text-sm text-muted-foreground tabular-nums">
          {counts[view]} {counts[view] === 1 ? "Conversation" : "Conversations"}
        </span>
      </div>

      {visible.length === 0 ? (
        <Empty className="flex-1 border-0">
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <InboxIcon />
            </EmptyMedia>
            <EmptyTitle>Nothing here</EmptyTitle>
            <EmptyDescription>{EMPTY_COPY[view]}</EmptyDescription>
          </EmptyHeader>
        </Empty>
      ) : (
        <ScrollArea className="min-h-0 flex-1">
          <ul className="flex flex-col gap-1 p-2" aria-label="Conversations">
            {visible.map((conversation) => (
              <li key={conversation.id}>
                <ConversationRow conversation={conversation} selected={conversation.id === selectedId} />
              </li>
            ))}
          </ul>
        </ScrollArea>
      )}

      <SampleDataNotice className="border-t px-4 py-2.5">Claims and replies reset when you reload.</SampleDataNotice>
    </>
  )
}

function ConversationRow({ conversation, selected }: { conversation: Conversation; selected: boolean }) {
  const { now } = useInbox()
  const memberLabel = useMemberLabel()
  const waiting = conversation.state === "waiting"
  const last = lastMessage(conversation)
  const author =
    last?.sender.type === "ai"
      ? "AI"
      : last?.sender.type === "member"
        ? memberLabel(last.sender.memberId, { first: true })
        : null
  const claimedBy = conversation.state === "human" ? memberLabel(conversation.claimedBy, { first: true }) : null

  return (
    <Link
      href={`/dashboard/inbox/${conversation.id}`}
      aria-current={selected ? "page" : undefined}
      className={cn(
        "relative flex gap-3 rounded-lg px-3 py-3 outline-none transition-colors duration-150 hover:bg-muted/70 focus-visible:ring-3 focus-visible:ring-ring/50",
        selected && "bg-muted hover:bg-muted",
        // Waiting rows carry an amber bar, so they stand out when scanning a long list.
        waiting && "before:absolute before:inset-y-3 before:left-0 before:w-[3px] before:rounded-full before:bg-waiting"
      )}
    >
      <VisitorAvatar className="mt-0.5" />
      <div className="flex min-w-0 flex-1 flex-col gap-1">
        <div className="flex items-baseline gap-2">
          <span className={cn("truncate text-sm", waiting ? "font-semibold" : "font-medium")}>
            {visitorLabel(conversation.visitor)}
          </span>
          <time
            dateTime={lastActivityAt(conversation)}
            className={cn(
              "ml-auto shrink-0 text-xs tabular-nums",
              waiting ? "font-medium text-foreground" : "text-muted-foreground"
            )}
          >
            {formatRelative(lastActivityAt(conversation), now)}
          </time>
        </div>
        {last && (
          <p className={cn("line-clamp-2 text-[13px] leading-snug", waiting ? "text-foreground" : "text-muted-foreground")}>
            {author && <span className="font-medium text-foreground">{author}: </span>}
            {last.body}
          </p>
        )}
        <div className="mt-0.5 flex items-center gap-1.5 text-xs text-muted-foreground">
          <StateBadge state={conversation.state} />
          {claimedBy && <span className="truncate">{claimedBy}</span>}
        </div>
      </div>
    </Link>
  )
}
