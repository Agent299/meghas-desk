"use client"

import * as React from "react"
import { BotIcon, CircleCheckIcon, HandIcon, RotateCcwIcon, UserCheckIcon, ZapOffIcon } from "lucide-react"

import { useInbox, useMemberLabel } from "@/components/inbox/inbox-provider"
import { VisitorAvatar } from "@/components/inbox/visitor-avatar"
import { Badge } from "@/components/ui/badge"
import { formatRelative } from "@/lib/inbox/conversations"
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
    <ol className="mx-auto flex w-full max-w-3xl flex-col gap-4 px-4 py-6 lg:px-6" aria-label="Messages">
      {conversation.timeline.map((item) => (
        <li key={item.id}>
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

  if (message.sender.type === "visitor") {
    return (
      <div className="flex max-w-[85%] items-end gap-2 sm:max-w-[75%]">
        <VisitorAvatar visitor={conversation.visitor} className="size-7" />
        <div className="flex min-w-0 flex-col gap-1">
          <div className="rounded-2xl rounded-bl-md bg-muted px-3.5 py-2.5 text-sm break-words whitespace-pre-wrap">
            {message.body}
          </div>
          <p className="flex gap-1.5 px-1 text-xs text-muted-foreground">
            {time}
            {message.classification === "off_topic" && <span>· Off-topic</span>}
            {message.classification === "wants_human" && <span>· Asked for a person</span>}
          </p>
        </div>
      </div>
    )
  }

  const isAi = message.sender.type === "ai"
  const author = isAi ? "AI" : memberLabel(message.sender.type === "member" ? message.sender.memberId : null, { first: true })

  return (
    <div className="ml-auto flex max-w-[85%] flex-col items-end gap-1 sm:max-w-[75%]">
      <p className="flex items-center gap-1.5 px-1 text-xs font-medium">
        {isAi && <BotIcon aria-hidden="true" className="size-3.5" />}
        {author}
        {message.aiReply === "handoff_offer" && <Badge variant="outline">Handoff offer</Badge>}
        {message.aiReply === "decline" && <Badge variant="outline">Decline</Badge>}
      </p>
      <div
        className={cn(
          "rounded-2xl rounded-br-md px-3.5 py-2.5 text-sm break-words whitespace-pre-wrap",
          isAi ? "border bg-background" : "bg-primary text-primary-foreground"
        )}
      >
        {message.body}
      </div>
      <p className="px-1 text-xs text-muted-foreground">{time}</p>
    </div>
  )
}

function EventLine({ event }: { event: EventItem }) {
  const { now } = useInbox()
  const memberLabel = useMemberLabel()
  const who = memberLabel(event.memberId) ?? "A Team member"

  const { icon: Icon, text } = {
    wants_human: { icon: HandIcon, text: "Visitor asked for a person. Waiting for a Team member." },
    allowance_used_up: { icon: ZapOffIcon, text: "Monthly allowance used up. Moved to Waiting." },
    claimed: { icon: UserCheckIcon, text: `${who} claimed this Conversation.` },
    closed: { icon: CircleCheckIcon, text: `${who} closed this Conversation.` },
    reopened: { icon: RotateCcwIcon, text: "Visitor wrote again. Back to AI answering." },
  }[event.event]

  return (
    <p className="flex items-center justify-center gap-1.5 text-center text-xs text-muted-foreground">
      <Icon aria-hidden="true" className="size-3.5 shrink-0" />
      <span>{text}</span>
      <span aria-hidden="true">·</span>
      <time dateTime={event.at} className="tabular-nums">
        {formatRelative(event.at, now)}
      </time>
    </p>
  )
}
