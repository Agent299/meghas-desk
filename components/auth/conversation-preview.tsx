import type { CSSProperties } from "react";
import { FileTextIcon } from "lucide-react";

import { LogoMark } from "@/components/landing/logo";
import { cn } from "@/lib/utils";

import { sampleConversation as c } from "./content";

const delay = (seconds: number): CSSProperties => ({ animationDelay: `${seconds}s` });

const rise = "animate-reveal motion-reduce:animate-none";

/**
 * A static, illustrative Conversation in brand-surface pills. Decorative: the
 * panel's headline and subhead carry the message for screen readers.
 */
export function ConversationPreview({ className }: { className?: string }) {
  return (
    <div aria-hidden="true" className={cn("flex w-full max-w-[400px] flex-col gap-3 text-left", className)}>
      <VisitorBubble style={delay(0.55)}>{c.visitorQuestion}</VisitorBubble>

      <div className={cn("flex max-w-[88%] flex-col gap-1.5 self-start", rise)} style={delay(0.8)}>
        <div className="flex items-center gap-2 pl-1 text-[12px] text-surface-muted">
          <span className="grid size-5 place-items-center rounded-full bg-white text-black">
            <LogoMark className="size-[72%]" />
          </span>
          AI agent
        </div>
        <div className="rounded-xl rounded-tl-sm border border-surface-border/50 bg-surface/85 px-4 py-3 text-[14px] leading-[1.5] text-surface-foreground shadow-soft backdrop-blur-md">
          {c.aiAnswer}
          <span className="mt-2.5 flex w-fit items-center gap-1.5 rounded-md bg-white/8 px-2.5 py-1 font-mono text-[11px] text-surface-muted">
            <FileTextIcon className="size-3" />
            {c.aiSource}
          </span>
        </div>
      </div>

      <VisitorBubble style={delay(1.05)}>{c.visitorFollowUp}</VisitorBubble>

      <div
        className={cn(
          "mt-1 flex items-center gap-2 self-center rounded-lg border border-surface-border bg-surface px-3.5 py-1.5 text-[12.5px] text-surface-foreground shadow-soft",
          rise
        )}
        style={delay(1.3)}
      >
        <span className="font-display text-[15px] leading-none text-white">&gt;</span>
        {c.waiting}
      </div>
    </div>
  );
}

function VisitorBubble({ style, children }: { style: CSSProperties; children: React.ReactNode }) {
  return (
    <div className={cn("flex max-w-[80%] flex-col items-end gap-1.5 self-end", rise)} style={style}>
      <span className="pr-1 text-[12px] text-surface-muted">Visitor</span>
      <p className="rounded-xl rounded-tr-sm bg-white px-4 py-2.5 text-[14px] leading-[1.45] text-[#111] shadow-soft">
        {children}
      </p>
    </div>
  );
}
