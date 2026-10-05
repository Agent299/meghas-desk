"use client"

import * as React from "react"
import { ArrowUpIcon } from "lucide-react"

import { useInbox } from "@/components/inbox/inbox-provider"
import { Button } from "@/components/ui/button"
import { canReply } from "@/lib/inbox/conversations"
import type { Conversation } from "@/lib/inbox/types"
import { cn } from "@/lib/utils"

/** The reply box. Sending claims the Conversation; Enter sends, Shift+Enter adds a line. */
export function Composer({ conversation }: { conversation: Conversation }) {
  const { act, currentMemberId } = useInbox()
  const [body, setBody] = React.useState("")
  const enabled = canReply(conversation)
  const hintId = `${conversation.id}-reply-hint`

  const hint = !enabled
    ? "Closed. It reopens in AI answering when the Visitor writes again."
    : conversation.state === "human" && conversation.claimedBy === currentMemberId
      ? "Enter to send · Shift + Enter for a new line"
      : conversation.state === "ai_answering"
        ? "Sending claims this Conversation, and the AI stops replying."
        : "Sending claims this Conversation."

  function send() {
    if (!body.trim()) return
    act(conversation.id, { type: "reply", body })
    setBody("")
  }

  return (
    <form
      className="shrink-0 p-3 pt-0 lg:px-8 lg:pb-5"
      onSubmit={(event) => {
        event.preventDefault()
        send()
      }}
    >
      <div
        className={cn(
          "mx-auto flex max-w-3xl flex-col rounded-xl border bg-background shadow-soft transition-[border-color,box-shadow] duration-150 focus-within:border-ring focus-within:ring-3 focus-within:ring-ring/30",
          !enabled && "bg-muted/50"
        )}
      >
        <textarea
          aria-label="Reply"
          aria-describedby={hintId}
          placeholder={enabled ? "Write a reply…" : "This Conversation is Closed"}
          value={body}
          disabled={!enabled}
          rows={2}
          className="field-sizing-content max-h-48 min-h-16 w-full resize-none bg-transparent px-4 pt-3 text-base outline-none md:text-sm placeholder:text-muted-foreground disabled:cursor-not-allowed"
          onChange={(event) => setBody(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === "Enter" && !event.shiftKey && !event.nativeEvent.isComposing) {
              event.preventDefault()
              send()
            }
          }}
        />
        <div className="flex items-center gap-3 px-3 pb-3 pl-4">
          <p id={hintId} className="min-w-0 flex-1 text-xs text-muted-foreground">
            {hint}
          </p>
          <Button type="submit" disabled={!enabled || !body.trim()}>
            Send
            <ArrowUpIcon data-icon="inline-end" />
          </Button>
        </div>
      </div>
    </form>
  )
}
