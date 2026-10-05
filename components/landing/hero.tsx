import Link from "next/link";
import type { CSSProperties } from "react";

import { Avatar, AvatarFallback, AvatarGroup } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

import type { hero as heroContent, trust as trustContent } from "./content";

type HeroProps = {
  hero: typeof heroContent;
  trust: typeof trustContent;
};

const delay = (seconds: number): CSSProperties => ({ animationDelay: `${seconds}s` });

// Later avatars tuck under the one before; the middle one lifts highest on hover.
const avatarOffsets = [
  "z-[1] hover:-translate-y-0.5",
  "z-[2] hover:-translate-y-1",
  "z-[4] hover:-translate-y-0.5",
];

export function Hero({ hero, trust }: HeroProps) {
  return (
    <section className="relative z-10 flex w-full max-w-[900px] flex-1 flex-col items-center justify-center text-center">
      <div
        className="mb-[clamp(16px,2.5vh,26px)] flex animate-reveal items-center [--trust-size:clamp(36px,4.5vw,42px)] motion-reduce:animate-none max-[420px]:[--trust-size:34px] [@media(max-height:700px)]:mb-3"
        style={delay(0.05)}
      >
        <AvatarGroup className="space-x-0">
          {trust.marks.map(({ icon: Icon, label }, i) => (
            <Avatar
              key={label}
              title={label}
              className={cn(
                "size-(--trust-size) border border-surface-border bg-surface p-[5px] transition-transform duration-350 after:hidden",
                i > 0 && "-ml-[calc(var(--trust-size)*0.42)]",
                avatarOffsets[i]
              )}
            >
              <AvatarFallback className="bg-white text-[#111]">
                <Icon
                  aria-hidden="true"
                  className="size-[calc(var(--trust-size)*0.4)]"
                  strokeWidth={2}
                />
              </AvatarFallback>
            </Avatar>
          ))}
        </AvatarGroup>
        <Badge
          variant="surface"
          className="z-0 -ml-[calc(var(--trust-size)*0.42)] h-(--trust-size) pl-[calc(var(--trust-size)*0.58)] text-[clamp(12px,1.4vw,13.5px)] max-nav:text-xs"
        >
          {trust.label}
        </Badge>
      </div>

      <h1 className="font-display text-[clamp(32px,6.2vw,80px)] leading-[1.12] font-normal tracking-[-0.02em] text-white [text-shadow:0_2px_24px_rgb(0_0_0/0.35)] max-nav:leading-[1.08] max-[420px]:tracking-[-0.03em]">
        {hero.headline.map((line, i) => (
          <span
            key={line}
            className="block animate-headline overflow-hidden whitespace-nowrap motion-reduce:animate-none"
            style={delay(0.12 + i * 0.18)}
          >
            {line}
          </span>
        ))}
      </h1>

      <p
        className="mt-[clamp(14px,2.2vh,22px)] max-w-[min(500px,92%)] animate-reveal text-[clamp(calc(13.5px+2pt),calc(1.55vw+2pt),calc(16.5px+2pt))] leading-[1.55] text-[#d0d0d0]/80 motion-reduce:animate-none [@media(max-height:700px)]:mt-2.5"
        style={delay(0.28)}
      >
        {hero.subhead}
      </p>

      <Button
        variant="glow"
        size="cta"
        className="mt-[clamp(20px,3.4vh,34px)] animate-reveal-pulse motion-reduce:animate-none [@media(max-height:700px)]:mt-4"
        style={delay(0.4)}
        nativeButton={false}
        render={<Link href={hero.cta.href} />}
      >
        {hero.cta.label}
      </Button>
    </section>
  );
}
