"use client";

import { usePathname } from "next/navigation";
import type { CSSProperties } from "react";

import { trust } from "@/components/landing/content";
import { BackgroundVideo } from "@/components/landing/background-video";
import { Badge } from "@/components/ui/badge";

import { fallbackPanelCopy, panelCopy } from "./content";
import { ConversationPreview } from "./conversation-preview";

const delay = (seconds: number): CSSProperties => ({ animationDelay: `${seconds}s` });

/**
 * The brand half of every auth page: the hero video, a pixel headline for the
 * current step and a sample Conversation. Below lg it shrinks to a banner with
 * the headline only. It lives in the (auth) layout, so the video keeps playing
 * while people move between steps. Fixed brand colours: like the landing page,
 * it stays black in every theme.
 */
export function AuthPanel() {
  const pathname = usePathname();
  const copy = panelCopy[pathname] ?? fallbackPanelCopy;

  return (
    <aside className="relative order-2 flex h-[clamp(136px,22vh,180px)] overflow-hidden rounded-xl bg-black text-white lg:sticky lg:top-3 lg:order-none lg:h-[calc(100svh-1.5rem)]">
      <BackgroundVideo poster="/auth-cover.jpg" />
      {/* Scrims: one behind the headline (as on the landing hero), one under the Conversation. */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_42%_at_50%_26%,rgb(0_0_0/0.6),transparent_75%)] max-lg:bg-black/35" />
      <div className="absolute inset-0 hidden bg-gradient-to-b from-transparent via-black/20 to-black/80 lg:block" />

      <div className="relative z-10 flex w-full flex-col items-center justify-center px-[clamp(20px,4vw,56px)] text-center lg:justify-start lg:py-[clamp(28px,5vh,56px)]">
        <Badge
          variant="surface"
          className="hidden h-9 animate-slide-down px-4 text-[13px] motion-reduce:animate-none lg:inline-flex"
        >
          {trust.label}
        </Badge>

        {/* Keyed by route so the headline replays when the step changes. */}
        <div key={pathname} className="flex flex-col items-center lg:mt-[clamp(28px,7vh,72px)]">
          <h2 className="font-display text-[clamp(24px,7vw,30px)] leading-[1.12] font-normal tracking-[-0.02em] text-white [text-shadow:0_2px_24px_rgb(0_0_0/0.35)] max-[420px]:tracking-[-0.03em] lg:text-[clamp(30px,3.5vw,52px)]">
            {copy.headline.map((line, i) => (
              <span
                key={line}
                className="block animate-headline whitespace-nowrap motion-reduce:animate-none"
                style={delay(0.1 + i * 0.18)}
              >
                {line}
              </span>
            ))}
          </h2>
          <p
            className="mt-4 hidden max-w-[440px] animate-reveal text-[clamp(14px,1.15vw,16px)] leading-[1.55] text-[#d0d0d0]/80 motion-reduce:animate-none lg:block"
            style={delay(0.3)}
          >
            {copy.subhead}
          </p>
        </div>

        <ConversationPreview className="mt-auto hidden pt-10 lg:flex" />
      </div>
    </aside>
  );
}
