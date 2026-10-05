"use client"

import * as React from "react"
import { CheckIcon, CodeIcon, CopyIcon, PlusIcon, XIcon } from "lucide-react"

import { SetupSection } from "@/components/widget/setup-section"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { normalizeDomain, snippetLines } from "@/lib/widget/widget"

/** Where the widget may answer (Allowed domains) and the snippet that installs it. */
export function InstallCard({
  workspaceSlug,
  domains,
  onAddDomain,
  onRemoveDomain,
  style,
}: {
  workspaceSlug: string
  domains: string[]
  onAddDomain: (domain: string) => void
  onRemoveDomain: (domain: string) => void
  style?: React.CSSProperties
}) {
  const [draft, setDraft] = React.useState("")
  const [error, setError] = React.useState<string | null>(null)

  function add(event: React.FormEvent) {
    event.preventDefault()
    const result = normalizeDomain(draft)
    if ("error" in result) return setError(result.error)
    if (domains.includes(result.domain)) return setError(`${result.domain} is already allowed.`)
    setError(null)
    setDraft("")
    onAddDomain(result.domain)
  }

  return (
    <SetupSection
      icon={CodeIcon}
      title="Install the widget"
      description="Add your website, then paste the snippet just before </body>."
      done={domains.length > 0}
      style={style}
    >
      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-3">
          <Label htmlFor="allowed-domain">Allowed domains</Label>
          {domains.length > 0 && (
            <ul className="flex flex-wrap gap-2" aria-label="Allowed domains">
              {domains.map((domain) => (
                <li
                  key={domain}
                  className="flex h-8 items-center gap-1 rounded-lg border bg-muted/50 pr-1 pl-3 font-mono text-[13px]"
                >
                  {domain}
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon-xs"
                    aria-label={`Remove ${domain}`}
                    onClick={() => onRemoveDomain(domain)}
                  >
                    <XIcon />
                  </Button>
                </li>
              ))}
            </ul>
          )}
          <form onSubmit={add} className="flex gap-2" noValidate>
            <Input
              id="allowed-domain"
              value={draft}
              placeholder="shop.example.com"
              autoComplete="off"
              spellCheck={false}
              aria-invalid={error ? true : undefined}
              aria-describedby="allowed-domain-help"
              onChange={(event) => {
                setDraft(event.target.value)
                setError(null)
              }}
              className="h-10"
            />
            <Button type="submit" variant="outline" className="h-10">
              <PlusIcon data-icon="inline-start" />
              Add
            </Button>
          </form>
          <p id="allowed-domain-help" className={error ? "text-sm text-destructive" : "text-xs text-muted-foreground"}>
            {error ?? "The widget refuses to answer anywhere else. localhost always works for testing."}
          </p>
        </div>

        <Snippet lines={snippetLines(workspaceSlug)} />
      </div>
    </SetupSection>
  )
}

/** The snippet in a black code panel (a brand surface: black in every theme), highlighted by token. */
function Snippet({ lines }: { lines: string[] }) {
  const [copied, setCopied] = React.useState(false)
  const [copyFailed, setCopyFailed] = React.useState(false)
  const timer = React.useRef<number | undefined>(undefined)
  React.useEffect(() => () => window.clearTimeout(timer.current), [])

  async function copy() {
    try {
      await navigator.clipboard.writeText(lines.join("\n"))
      setCopyFailed(false)
      setCopied(true)
      window.clearTimeout(timer.current)
      timer.current = window.setTimeout(() => setCopied(false), 2000)
    } catch {
      setCopyFailed(true)
    }
  }

  return (
    <div className="flex flex-col gap-2">
      <div className="overflow-hidden rounded-xl bg-black text-white shadow-soft ring-1 ring-black/10 dark:ring-white/10">
        <div className="flex items-center gap-2 border-b border-white/10 py-2 pr-2 pl-4">
          <span className="text-xs text-surface-muted">index.html</span>
          <Button
            type="button"
            variant="surface"
            size="sm"
            onClick={copy}
            className="ml-auto h-8 rounded-lg px-3 text-xs"
          >
            {copied ? <CheckIcon data-icon="inline-start" /> : <CopyIcon data-icon="inline-start" />}
            {copied ? "Copied" : "Copy"}
          </Button>
        </div>
        <span role="status" className="sr-only">
          {copied ? "Snippet copied" : ""}
        </span>
        <pre className="overflow-x-auto py-4 font-mono text-[13px] leading-6">
          <code className="grid">
            {lines.map((line, index) => (
              <span key={index} className="grid grid-cols-[2.5rem_1fr] pr-4">
                <span aria-hidden="true" className="pr-4 text-right text-white/30 select-none">
                  {index + 1}
                </span>
                <span>
                  <Highlighted line={line} />
                </span>
              </span>
            ))}
          </code>
        </pre>
      </div>
      {copyFailed && (
        <p role="alert" className="text-sm text-destructive">
          Couldn&apos;t copy. Select the snippet and copy it by hand.
        </p>
      )}
    </div>
  )
}

/** Tags white, attribute names violet, values amber, punctuation grey. */
function Highlighted({ line }: { line: string }) {
  const parts = line.split(/(<\/?script|>|\s[a-z-]+(?==)|="[^"]*"|\sasync)/).filter(Boolean)
  return parts.map((part, i) => {
    if (/^<\/?script$/.test(part) || part === ">") return <span key={i} className="text-white">{part}</span>
    if (/^="/.test(part))
      return (
        <span key={i}>
          <span className="text-white/55">=</span>
          <span className="text-[#fcd9a0]">{part.slice(1)}</span>
        </span>
      )
    if (/^\s[a-z-]+$/.test(part)) return <span key={i} className="text-[#c9b8ff]">{part}</span>
    return <span key={i} className="text-white/60">{part}</span>
  })
}
