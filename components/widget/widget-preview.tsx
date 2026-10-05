import { ArrowUpIcon, MessageCircleIcon, XIcon } from "lucide-react"

import { LogoMark } from "@/components/landing/logo"
import { readableTextColor } from "@/lib/widget/widget"

/**
 * What a Visitor sees, drawn on a stand-in website. The widget keeps a fixed
 * width (at most 360px), like the real one, however wide the column is. It
 * uses fixed light colours because it lives on the business's site, not in
 * the dashboard's theme. Decorative: the settings beside it are the real UI.
 */
export function WidgetPreview({
  businessName,
  brandColor,
  greeting,
  domain,
}: {
  businessName: string
  brandColor: string
  greeting: string
  /** The first Allowed domain, shown in the stand-in address bar. */
  domain: string | undefined
}) {
  const onBrand = readableTextColor(brandColor)

  return (
    <div
      aria-hidden="true"
      className="relative flex flex-col items-end gap-3 overflow-hidden rounded-xl border bg-muted/50 bg-[radial-gradient(circle,var(--color-border)_1px,transparent_1px)] bg-size-[16px_16px] p-4 pt-14"
    >
      {/* A stand-in page behind the widget. */}
      <div className="absolute inset-x-4 top-4 flex items-center gap-2">
        <span className="size-2.5 rounded-full bg-foreground/15" />
        <span className="size-2.5 rounded-full bg-foreground/15" />
        <span className="size-2.5 rounded-full bg-foreground/15" />
        <span className="ml-2 h-5 flex-1 rounded-md bg-background/80 px-2 text-[11px] leading-5 text-muted-foreground">
          {domain ?? "your-site.com"}
        </span>
      </div>

      <div className="flex w-full max-w-[360px] flex-col overflow-hidden rounded-2xl bg-white text-[#111] shadow-sheet ring-1 ring-black/5">
        <div className="flex items-center gap-3 px-4 py-3.5" style={{ backgroundColor: brandColor, color: onBrand }}>
          <span className="grid size-9 place-items-center rounded-full bg-current/15 text-sm font-semibold">
            {businessName.trim().charAt(0).toUpperCase() || "?"}
          </span>
          <div className="flex min-w-0 flex-1 flex-col">
            <span className="truncate text-[15px] font-semibold">{businessName}</span>
            <span className="text-xs">The AI answers instantly</span>
          </div>
          <XIcon className="size-4 opacity-70" />
        </div>

        <div className="flex flex-col gap-3 bg-[#fafafa] px-4 py-4 text-[13.5px] leading-snug">
          <AiBubble>{greeting.trim() || "Hi! How can we help?"}</AiBubble>
          <p
            className="max-w-[80%] self-end rounded-2xl rounded-br-sm px-3.5 py-2.5"
            style={{ backgroundColor: brandColor, color: onBrand }}
          >
            Do you ship to Canada?
          </p>
          <AiBubble>We do. Shipping to Canada takes 7–10 business days.</AiBubble>
        </div>

        <div className="flex items-center gap-2 border-t border-black/5 bg-white px-3 py-3">
          <span className="flex-1 rounded-full bg-[#f2f2f2] px-4 py-2 text-[13px] text-[#6b6b6b]">Ask a question…</span>
          <span
            className="grid size-8 place-items-center rounded-full"
            style={{ backgroundColor: brandColor, color: onBrand }}
          >
            <ArrowUpIcon className="size-4" />
          </span>
        </div>
        <p className="flex items-center justify-center gap-1.5 bg-white pb-2.5 text-[10.5px] text-[#6b6b6b]">
          <span className="grid size-3.5 place-items-center rounded-full bg-[#111] text-white">
            <LogoMark className="size-[72%]" />
          </span>
          Powered by MeghasDesk
        </p>
      </div>

      <span
        className="grid size-12 place-items-center rounded-full shadow-soft"
        style={{ backgroundColor: brandColor, color: onBrand }}
      >
        <MessageCircleIcon className="size-5" />
      </span>
    </div>
  )
}

function AiBubble({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex max-w-[85%] flex-col gap-1 self-start">
      <span className="pl-1 text-[11px] font-medium text-[#6b6b6b]">AI</span>
      <p className="rounded-2xl rounded-tl-sm bg-white px-3.5 py-2.5 ring-1 ring-black/6">{children}</p>
    </div>
  )
}
