"use client"

import * as React from "react"

import { AiMark } from "@/components/inbox/ai-mark"
import { useInbox, useMemberLabel } from "@/components/inbox/inbox-provider"
import { Badge } from "@/components/ui/badge"
import { formatRelative, visitorLabel } from "@/lib/inbox/conversations"
import type { Conversation, EventItem, MessageItem } from "@/lib/inbox/types"
import { cn } from "@/lib/utils"

/** Every message and state change in a Conversation, oldest first; scrolls to the newest. */
export function Timeline({ conversation }: { conversation: Conversation }) {
  const endRef = React.useRef<HTMLLIElement>(null)
  const count = conversation.timeline.length

  React.useEffect(() => {
    endRef.current?.scrollIntoView({ block: "end" })
  }, [conversation.id, count])

  return (
    <ol className="mx-auto flex w-full max-w-3xl flex-col gap-5 px-4 py-6 lg:px-8" aria-label="Messages">
      {conversation.timeline.map((item) => (
        <li key={item.id} className="flex flex-col">
          {item.kind === "message" ? (
            <Message message={item} conversation={conversation} />
          ) : (
            <EventLine event={item} />
          )}
        </li>
      ))}
      <li ref={endRef} aria-hidden="true" />
    </ol>
  )
}

function Message({ message, conversation }: { message: MessageItem; conversation: Conversation }) {
  const { now } = useInbox()
  const memberLabel = useMemberLabel()
  const time = (
    <time dateTime={message.sentAt} className="tabular-nums">
      {formatRelative(message.sentAt, now)}
    </time>
  )

  // Visitors on the left; the AI agent and Team members answer from the right.
  if (message.sender.type === "visitor") {
    return (
      <div className="flex max-w-[85%] flex-col items-start gap-1.5 self-start sm:max-w-[72%]">
        <span className="pl-1 text-xs text-muted-foreground">{visitorLabel(conversation.visitor)}</span>
        <p className="rounded-xl rounded-tl-sm bg-muted px-4 py-2.5 text-sm leading-relaxed break-words whitespace-pre-wrap">
          {message.body}
        </p>
        <p className="flex gap-1.5 pl-1 text-xs text-muted-foreground">
          {time}
          {message.classification === "off_topic" && <span>· Off-topic</span>}
          {message.classification === "wants_human" && <span>· Asked for a person</span>}
        </p>
      </div>
    )
  }

  const isAi = message.sender.type === "ai"
  const author = isAi
    ? "AI agent"
    : memberLabel(message.sender.type === "member" ? message.sender.memberId : null, { first: true })

  return (
    <div className="flex max-w-[85%] flex-col items-end gap-1.5 self-end sm:max-w-[72%]">
      <span className="flex items-center gap-2 pr-1 text-xs text-muted-foreground">
        {isAi && <AiMark />}
        {author}
        {message.aiReply === "handoff_offer" && <Badge variant="outline">Handoff offer</Badge>}
        {message.aiReply === "decline" && <Badge variant="outline">Decline</Badge>}
      </span>
      <p
        className={cn(
          "rounded-xl rounded-tr-sm px-4 py-2.5 text-sm leading-relaxed break-words whitespace-pre-wrap",
          isAi ? "border border-ai/25 bg-background shadow-soft" : "bg-foreground text-background"
        )}
      >
        {message.body}
      </p>
      <p className="pr-1 text-xs text-muted-foreground">{time}</p>
    </div>
  )
}

/** State changes as a small centred pill, like "Waiting for your team" on the auth panel. */
function EventLine({ event }: { event: EventItem }) {
  const { now } = useInbox()
  const memberLabel = useMemberLabel()
  const who = memberLabel(event.memberId) ?? "A Team member"

  const text = {
    wants_human: "Visitor asked for a person. Waiting for your team",
    allowance_used_up: "Monthly allowance used up. Moved to Waiting",
    claimed: `${who} claimed this Conversation`,
    closed: `${who} closed this Conversation`,
    reopened: "Visitor wrote again. Back to AI answering",
  }[event.event]

  // The glyph takes the colour of the state the event moves to.
  const tone = {
    wants_human: "text-waiting",
    allowance_used_up: "text-waiting",
    claimed: "text-human",
    closed: "text-muted-foreground",
    reopened: "text-ai",
  }[event.event]

  return (
    <p className="flex max-w-full items-center gap-2 self-center rounded-lg border bg-background px-3 py-1.5 text-center text-xs text-muted-foreground">
      <span aria-hidden="true" className={cn("font-display text-sm leading-none", tone)}>
        &gt;
      </span>
      <span>{text}</span>
      <span aria-hidden="true">·</span>
      <time dateTime={event.at} className="shrink-0 tabular-nums">
        {formatRelative(event.at, now)}
      </time>
    </p>
  )
}
