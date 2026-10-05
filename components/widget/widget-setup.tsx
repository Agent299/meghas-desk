"use client"

import * as React from "react"

import { SampleDataNotice } from "@/components/dashboard/sample-data-notice"
import { useInbox } from "@/components/inbox/inbox-provider"
import { AppearanceCard } from "@/components/widget/appearance-card"
import { BusinessCard } from "@/components/widget/business-card"
import { InstallCard } from "@/components/widget/install-card"
import { KnowledgeCard } from "@/components/widget/knowledge-card"
import { WidgetPreview } from "@/components/widget/widget-preview"
import { randomId } from "@/lib/id"
import type { KnowledgeFile, WidgetSettings } from "@/lib/widget/types"

const delay = (seconds: number): React.CSSProperties => ({ animationDelay: `${seconds}s` })

/**
 * Settings on the left, the live preview on the right. The preview column has
 * a fixed width (the widget never grows), so the settings column takes the
 * rest. Below lg the preview follows the settings.
 */
export function WidgetSetup({ initial }: { initial: WidgetSettings }) {
  const { now } = useInbox()
  const [brandColor, setBrandColor] = React.useState(initial.brandColor)
  const [greeting, setGreeting] = React.useState(initial.greeting)
  const [description, setDescription] = React.useState(initial.businessDescription)
  const [domains, setDomains] = React.useState(initial.allowedDomains)
  const [files, setFiles] = React.useState<KnowledgeFile[]>(initial.knowledgeFiles)

  function addFiles(added: File[]) {
    const at = new Date().toISOString()
    setFiles((current) => [
      ...added.map((file) => ({
        id: randomId(),
        name: file.name,
        sizeBytes: file.size,
        status: "queued" as const,
        uploadedAt: at,
      })),
      ...current,
    ])
  }

  return (
    <div className="grid items-start gap-3 lg:grid-cols-[minmax(0,1fr)_340px] xl:grid-cols-[minmax(0,1fr)_400px]">
      <div className="flex min-w-0 flex-col gap-3">
        <AppearanceCard
          brandColor={brandColor}
          greeting={greeting}
          onBrandColorChange={setBrandColor}
          onGreetingChange={setGreeting}
          style={delay(0.12)}
        />
        <BusinessCard description={description} onChange={setDescription} style={delay(0.18)} />
        <KnowledgeCard
          files={files}
          now={now}
          onAdd={addFiles}
          onRemove={(id) => setFiles((current) => current.filter((file) => file.id !== id))}
          style={delay(0.24)}
        />
        <InstallCard
          workspaceSlug={initial.workspaceSlug}
          domains={domains}
          onAddDomain={(domain) => setDomains((current) => [...current, domain])}
          onRemoveDomain={(domain) => setDomains((current) => current.filter((d) => d !== domain))}
          style={delay(0.3)}
        />
        <SampleDataNotice className="px-1 text-foreground/70">Changes here aren&apos;t saved yet: they reset when you leave this page.</SampleDataNotice>
      </div>

      <aside
        aria-label="Widget preview"
        className="flex animate-reveal flex-col gap-3 rounded-xl border bg-card p-3 shadow-soft motion-reduce:animate-none lg:sticky lg:top-0"
        style={delay(0.2)}
      >
        <div className="flex items-center justify-between px-1 pt-1">
          <h3 className="text-sm font-medium">Live preview</h3>
          <span className="text-xs text-muted-foreground">Updates as you type</span>
        </div>
        <WidgetPreview businessName={initial.businessName} brandColor={brandColor} greeting={greeting} domain={domains[0]} />
      </aside>
    </div>
  )
}
