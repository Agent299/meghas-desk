"use client"

import * as React from "react"
import { CheckIcon, PaletteIcon } from "lucide-react"

import { SetupSection } from "@/components/widget/setup-section"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { BRAND_COLOR_NAMES, BRAND_COLOR_PRESETS, GREETING_MAX, normalizeHex, readableTextColor } from "@/lib/widget/widget"
import { cn } from "@/lib/utils"

/** Brand colour and greeting: the only widget theming in v1 (PRD §8). */
export function AppearanceCard({
  brandColor,
  greeting,
  onBrandColorChange,
  onGreetingChange,
  style,
}: {
  brandColor: string
  greeting: string
  onBrandColorChange: (color: string) => void
  onGreetingChange: (greeting: string) => void
  style?: React.CSSProperties
}) {
  const [hexDraft, setHexDraft] = React.useState(brandColor)
  const [hexError, setHexError] = React.useState<string | null>(null)
  // A swatch or the picker changed the colour: show it in the hex field too.
  const [shownColor, setShownColor] = React.useState(brandColor)
  if (shownColor !== brandColor) {
    setShownColor(brandColor)
    setHexDraft(brandColor)
    setHexError(null)
  }

  function commitHex(value: string) {
    const hex = normalizeHex(value)
    if (!hex) {
      setHexError("Use a hex colour, like #7c3aed.")
      return
    }
    setHexError(null)
    setHexDraft(hex)
    onBrandColorChange(hex)
  }

  function pick(color: string) {
    setHexDraft(color)
    setHexError(null)
    onBrandColorChange(color)
  }

  // A radio group: one Tab stop (the checked swatch, or the first when a custom
  // colour is set), arrow keys move the selection and focus together.
  const swatchRefs = React.useRef<(HTMLButtonElement | null)[]>([])
  const checkedIndex = BRAND_COLOR_PRESETS.findIndex((color) => color === brandColor)
  function onSwatchKey(event: React.KeyboardEvent, index: number) {
    const last = BRAND_COLOR_PRESETS.length - 1
    const next =
      event.key === "ArrowRight" || event.key === "ArrowDown" ? (index === last ? 0 : index + 1)
      : event.key === "ArrowLeft" || event.key === "ArrowUp" ? (index === 0 ? last : index - 1)
      : event.key === "Home" ? 0
      : event.key === "End" ? last
      : null
    if (next === null) return
    event.preventDefault()
    pick(BRAND_COLOR_PRESETS[next])
    swatchRefs.current[next]?.focus()
  }

  return (
    <SetupSection
      icon={PaletteIcon}
      title="Appearance"
      description="Your brand colour and the first thing Visitors read."
      done={Boolean(greeting.trim())}
      style={style}
    >
      <div className="flex flex-col gap-6">
        <fieldset className="flex flex-col gap-3">
          <legend className="mb-3 text-sm font-medium">Brand colour</legend>
          <div className="flex flex-wrap items-center gap-2.5">
            <div role="radiogroup" aria-label="Preset colours" className="flex flex-wrap gap-2">
              {BRAND_COLOR_PRESETS.map((color, index) => {
                const selected = color === brandColor
                return (
                  <button
                    key={color}
                    ref={(node) => {
                      swatchRefs.current[index] = node
                    }}
                    type="button"
                    role="radio"
                    aria-checked={selected}
                    aria-label={`${BRAND_COLOR_NAMES[color]} (${color})`}
                    tabIndex={index === (checkedIndex === -1 ? 0 : checkedIndex) ? 0 : -1}
                    onKeyDown={(event) => onSwatchKey(event, index)}
                    onClick={() => pick(color)}
                    className={cn(
                      "grid size-9 place-items-center rounded-full ring-offset-2 ring-offset-card outline-none transition-[box-shadow,scale] duration-150 active:scale-[0.97] focus-visible:ring-3 focus-visible:ring-ring/50",
                      selected ? "ring-2 ring-foreground" : "ring-1 ring-black/10 dark:ring-white/15"
                    )}
                    style={{ backgroundColor: color, color: readableTextColor(color) }}
                  >
                    {selected && <CheckIcon aria-hidden="true" className="size-4" />}
                  </button>
                )
              })}
            </div>
            <span aria-hidden="true" className="mx-1 h-6 w-px bg-border" />
            <label className="relative grid size-9 cursor-pointer place-items-center overflow-hidden rounded-full ring-1 ring-black/10 ring-offset-2 ring-offset-card has-focus-visible:ring-3 has-focus-visible:ring-ring/50 dark:ring-white/15">
              <span className="sr-only">Pick any colour</span>
              <span
                aria-hidden="true"
                className="absolute inset-0 bg-[conic-gradient(#ef4444,#eab308,#22c55e,#06b6d4,#3b82f6,#a855f7,#ef4444)]"
              />
              <input
                type="color"
                value={brandColor}
                onChange={(event) => pick(event.target.value)}
                className="absolute inset-0 cursor-pointer opacity-0"
              />
            </label>
            <div className="flex items-center gap-2">
              <Label htmlFor="brand-hex" className="sr-only">
                Hex colour
              </Label>
              <Input
                id="brand-hex"
                value={hexDraft}
                spellCheck={false}
                aria-invalid={hexError ? true : undefined}
                aria-describedby={hexError ? "brand-hex-error" : undefined}
                onChange={(event) => setHexDraft(event.target.value)}
                onBlur={(event) => commitHex(event.target.value)}
                onKeyDown={(event) => event.key === "Enter" && commitHex(event.currentTarget.value)}
                className="h-9 w-28 font-mono text-sm"
              />
            </div>
          </div>
          {hexError && (
            <p id="brand-hex-error" className="text-sm text-destructive">
              {hexError}
            </p>
          )}
        </fieldset>

        <div className="flex flex-col gap-2">
          <div className="flex items-baseline justify-between gap-3">
            <Label htmlFor="greeting">Greeting</Label>
            <span className="text-xs text-muted-foreground tabular-nums">
              {greeting.length}/{GREETING_MAX}
            </span>
          </div>
          <Textarea
            id="greeting"
            value={greeting}
            maxLength={GREETING_MAX}
            rows={2}
            placeholder="Hi! How can we help?"
            onChange={(event) => onGreetingChange(event.target.value)}
            className="resize-none"
          />
        </div>
      </div>
    </SetupSection>
  )
}
