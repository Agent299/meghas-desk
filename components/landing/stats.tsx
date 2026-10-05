"use client";

import { useEffect, useRef } from "react";

import type { Stat } from "./content";

const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3);

function format(value: number, stat: Stat) {
  return `${value.toFixed(stat.decimals)}${stat.suffix}`;
}

export function Stats({ stats }: { stats: Stat[] }) {
  const listRef = useRef<HTMLDListElement>(null);
  const valueRefs = useRef<(HTMLElement | null)[]>([]);

  useEffect(() => {
    const list = listRef.current;
    if (!list) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const frames: number[] = [];
    const timers: number[] = [];

    // Start every counter at zero, then count up once the row is on screen.
    stats.forEach((stat, i) => {
      const el = valueRefs.current[i];
      if (el) el.textContent = format(0, stat);
    });

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        observer.disconnect();
        stats.forEach((stat, i) => {
          const el = valueRefs.current[i];
          if (!el) return;
          const duration = 1500 + i * 80;
          timers.push(
            window.setTimeout(() => {
              const start = performance.now();
              const tick = (now: number) => {
                const t = Math.min((now - start) / duration, 1);
                el.textContent = format(stat.target * easeOutCubic(t), stat);
                if (t < 1) frames.push(requestAnimationFrame(tick));
              };
              frames.push(requestAnimationFrame(tick));
            }, 480 + i * 90)
          );
        });
      },
      { threshold: 0.25 }
    );
    observer.observe(list);

    return () => {
      observer.disconnect();
      timers.forEach(clearTimeout);
      frames.forEach(cancelAnimationFrame);
    };
  }, [stats]);

  return (
    <dl
      ref={listRef}
      className="relative z-10 grid w-full max-w-[920px] shrink-0 grid-cols-2 gap-x-4 gap-y-[clamp(14px,2.4vh,22px)] nav:grid-cols-4"
    >
      {stats.map((stat, i) => (
        <div
          key={stat.label}
          className="flex animate-reveal flex-col items-center gap-1 text-center motion-reduce:animate-none"
          style={{ animationDelay: `${0.5 + i * 0.08}s` }}
        >
          <span
            aria-hidden="true"
            className="font-display text-[clamp(22px,3vw,33px)] leading-none text-white"
          >
            {stat.icon}
          </span>
          {/* dt comes before dd for valid markup; `order-last` puts the label under the value */}
          <dt className="order-last text-[clamp(11px,1.2vw,12.5px)] text-surface-muted">
            {stat.label}
          </dt>
          <dd
            ref={(el) => {
              valueRefs.current[i] = el;
            }}
            className="mt-1 text-[clamp(18px,2.2vw,26px)] font-medium tracking-[-0.025em] text-white tabular-nums"
          >
            {format(stat.target, stat)}
          </dd>
        </div>
      ))}
    </dl>
  );
}
