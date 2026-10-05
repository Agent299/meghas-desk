"use client"

import * as React from "react"
import { SendIcon } from "lucide-react"

import { useInbox } from "@/components/inbox/inbox-provider"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { canReply } from "@/lib/inbox/conversations"
import type { Conversation } from "@/lib/inbox/types"

/** The reply box. Sending claims the Conversation; Enter sends, Shift+Enter adds a line. */
export function Composer({ conversation }: { conversation: Conversation }) {
  const { act, currentMemberId } = useInbox()
  const [body, setBody] = React.useState("")
  const enabled = canReply(conversation)
  const hintId = `${conversation.id}-reply-hint`

  const hint = !enabled
    ? "This Conversation is Closed. It reopens in AI answering when the Visitor writes again."
    : conversation.state === "human" && conversation.claimedBy === currentMemberId
      ? null
      : conversation.state === "ai_answering"
        ? "Sending a reply claims this Conversation, and the AI stops replying."
        : "Sending a reply claims this Conversation."

  function send() {
    if (!body.trim()) return
    act(conversation.id, { type: "reply", body })
    setBody("")
  }

  return (
    <form
      className="border-t bg-background p-3 lg:px-6"
      onSubmit={(event) => {
        event.preventDefault()
        send()
      }}
    >
      <div className="mx-auto flex max-w-3xl flex-col gap-2">
        <div className="flex items-end gap-2">
          <Textarea
            aria-label="Reply"
            aria-describedby={hint ? hintId : undefined}
            placeholder={enabled ? "Write a reply…" : "Closed"}
            value={body}
            disabled={!enabled}
            rows={1}
            className="max-h-40 min-h-10 resize-none"
            onChange={(event) => setBody(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === "Enter" && !event.shiftKey && !event.nativeEvent.isComposing) {
                event.preventDefault()
                send()
              }
            }}
          />
          <Button type="submit" size="icon" disabled={!enabled || !body.trim()} aria-label="Send reply">
            <SendIcon />
          </Button>
        </div>
        {hint && (
          <p id={hintId} className="text-xs text-muted-foreground">
            {hint}
          </p>
        )}
      </div>
    </form>
  )
}
