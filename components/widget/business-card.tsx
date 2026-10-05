"use client"

import { SparklesIcon } from "lucide-react"

import { SetupSection } from "@/components/widget/setup-section"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { DESCRIPTION_MAX } from "@/lib/widget/widget"

/** The Business description: it defines what counts as on-topic for the classifier. */
export function BusinessCard({
  description,
  onChange,
  style,
}: {
  description: string
  onChange: (value: string) => void
  style?: React.CSSProperties
}) {
  return (
    <SetupSection
      icon={SparklesIcon}
      title="What the AI helps with"
      description="Questions outside this get the Decline, so the AI never wanders off-topic."
      done={Boolean(description.trim())}
      style={style}
    >
      <div className="flex flex-col gap-2">
        <div className="flex items-baseline justify-between gap-3">
          <Label htmlFor="business-description">Business description</Label>
          <span className="text-xs text-muted-foreground tabular-nums">
            {description.length}/{DESCRIPTION_MAX}
          </span>
        </div>
        <Textarea
          id="business-description"
          value={description}
          maxLength={DESCRIPTION_MAX}
          rows={4}
          placeholder="What your business does, and what Visitors should be able to ask about."
          onChange={(event) => onChange(event.target.value)}
          className="resize-none"
        />
      </div>
    </SetupSection>
  )
}
