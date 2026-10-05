"use client"

import * as React from "react"
import { BookOpenIcon, CircleAlertIcon, FileTextIcon, LoaderIcon, UploadIcon, XIcon } from "lucide-react"

import { SetupSection } from "@/components/widget/setup-section"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { formatAgo } from "@/lib/inbox/conversations"
import type { KnowledgeFile } from "@/lib/widget/types"
import { formatFileSize, KNOWLEDGE_FILE_EXTENSIONS, knowledgeFileError } from "@/lib/widget/widget"
import { cn } from "@/lib/utils"

/**
 * Knowledge files the AI answers from: a drop zone and the file list with each
 * file's status (PRD §7.2). Uploading isn't connected yet, so dropped files
 * are checked and listed as Queued.
 */
export function KnowledgeCard({
  files,
  now,
  onAdd,
  onRemove,
  style,
}: {
  files: KnowledgeFile[]
  now: number
  onAdd: (files: File[]) => void
  onRemove: (id: string) => void
  style?: React.CSSProperties
}) {
  const inputRef = React.useRef<HTMLInputElement>(null)
  const [dragging, setDragging] = React.useState(false)
  const [errors, setErrors] = React.useState<string[]>([])

  function accept(list: FileList | null) {
    const incoming = Array.from(list ?? [])
    const problems = incoming.map(knowledgeFileError).filter((e): e is string => e !== null)
    setErrors(problems)
    const valid = incoming.filter((file) => knowledgeFileError(file) === null)
    if (valid.length) onAdd(valid)
  }

  return (
    <SetupSection
      icon={BookOpenIcon}
      title="Knowledge files"
      description="The AI answers only from these. Nothing else."
      done={files.some((file) => file.status === "ready")}
      style={style}
    >
      <div className="flex flex-col gap-4">
        <div
          onDragEnter={(event) => {
            event.preventDefault()
            setDragging(true)
          }}
          onDragOver={(event) => event.preventDefault()}
          onDragLeave={(event) => {
            if (!event.currentTarget.contains(event.relatedTarget as Node)) setDragging(false)
          }}
          onDrop={(event) => {
            event.preventDefault()
            setDragging(false)
            accept(event.dataTransfer.files)
          }}
          className={cn(
            "flex flex-col items-center gap-3 rounded-xl border border-dashed px-6 py-8 text-center transition-colors duration-150",
            dragging ? "border-foreground bg-muted" : "bg-muted/40"
          )}
        >
          <span className="grid size-11 place-items-center rounded-full border bg-background shadow-soft">
            <UploadIcon aria-hidden="true" className="size-5" />
          </span>
          <div className="flex flex-col gap-1">
            <p className="text-sm font-medium">{dragging ? "Drop to add" : "Drag files here"}</p>
            <p className="text-xs text-muted-foreground">PDF, DOCX, Markdown or TXT, up to 10 MB each</p>
          </div>
          <Button type="button" variant="outline" onClick={() => inputRef.current?.click()}>
            Browse files
          </Button>
          <input
            ref={inputRef}
            type="file"
            multiple
            accept={KNOWLEDGE_FILE_EXTENSIONS.join(",")}
            className="sr-only"
            tabIndex={-1}
            aria-hidden="true"
            onChange={(event) => {
              accept(event.target.files)
              event.target.value = ""
            }}
          />
        </div>

        {errors.length > 0 && (
          <ul role="alert" className="flex flex-col gap-1 text-sm text-destructive">
            {errors.map((error, index) => (
              <li key={index}>{error}</li>
            ))}
          </ul>
        )}

        {files.length > 0 && (
          <ul className="flex flex-col divide-y rounded-xl border" aria-label="Knowledge files">
            {files.map((file) => (
              <li key={file.id} className="flex items-center gap-3 px-3.5 py-3">
                <span className="grid size-9 shrink-0 place-items-center rounded-lg bg-muted">
                  <FileTextIcon aria-hidden="true" className="size-4 text-muted-foreground" />
                </span>
                <div className="flex min-w-0 flex-1 flex-col gap-0.5">
                  <span className="truncate text-sm font-medium">{file.name}</span>
                  <span className="truncate text-xs text-muted-foreground">
                    {file.status === "failed" && file.failureReason
                      ? file.failureReason
                      : `${formatFileSize(file.sizeBytes)} · ${formatAgo(file.uploadedAt, now)}`}
                  </span>
                </div>
                <FileStatus status={file.status} />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon-sm"
                  aria-label={`Remove ${file.name}`}
                  onClick={() => onRemove(file.id)}
                >
                  <XIcon />
                </Button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </SetupSection>
  )
}

function FileStatus({ status }: { status: KnowledgeFile["status"] }) {
  switch (status) {
    case "ready":
      return <Badge variant="secondary">Ready</Badge>
    case "processing":
    case "uploading":
      return (
        <Badge className="bg-ai/14 text-ai-foreground">
          <LoaderIcon aria-hidden="true" className="animate-spin motion-reduce:animate-none" />
          {status === "uploading" ? "Uploading" : "Processing"}
        </Badge>
      )
    case "failed":
      return (
        <Badge variant="outline" className="border-destructive/40">
          <CircleAlertIcon aria-hidden="true" className="text-destructive" />
          Failed
        </Badge>
      )
    case "queued":
      return <Badge variant="outline">Queued</Badge>
  }
}
