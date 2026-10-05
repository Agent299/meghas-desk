"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

import type { NavLink } from "./content";
import { LogoMark } from "./logo";

type SiteHeaderProps = {
  links: NavLink[];
  signIn: { label: string; href: string };
};

// Three 3px dots under the active link
const activeDots =
  "after:absolute after:left-1/2 after:size-[3px] after:-translate-x-1/2 after:rounded-full after:bg-black after:shadow-[-5px_0_0_#000,5px_0_0_#000]";

export function SiteHeader({ links, signIn }: SiteHeaderProps) {
  const [open, setOpen] = useState(false);

  // The sheet is mobile-only; close it if the viewport grows past the breakpoint.
  useEffect(() => {
    const query = window.matchMedia("(min-width: 721px)");
    const close = () => query.matches && setOpen(false);
    query.addEventListener("change", close);
    return () => query.removeEventListener("change", close);
  }, []);

  return (
    <header
      className={cn(
        "relative flex w-full max-w-[720px] shrink-0 animate-slide-down items-center justify-between gap-[clamp(18px,2.8vw,28px)] motion-reduce:animate-none nav:justify-center",
        open ? "z-[60]" : "z-10"
      )}
    >
      <Link
        href="/"
        aria-label="MeghasDesk home"
        className="grid size-12 shrink-0 place-items-center rounded-full bg-white text-black shadow-soft transition-transform duration-300 hover:scale-104 nav:size-[clamp(40px,4.4vw,46px)]"
      >
        <LogoMark className="size-[72%]" />
      </Link>

      <nav
        aria-label="Main"
        className="hidden h-[clamp(44px,5.2vw,48px)] max-w-[430px] flex-1 items-center justify-around rounded-full bg-pill px-2 py-1 shadow-soft nav:flex"
      >
        {links.map((link) => (
          <Link
            key={link.label}
            href={link.href}
            aria-current={link.active ? "page" : undefined}
            className={cn(
              "relative px-2 py-2 text-[clamp(13px,1.4vw,15px)] font-medium tracking-[-0.01em] text-pill-foreground opacity-50 transition-opacity hover:opacity-75",
              link.active && cn("opacity-100 hover:opacity-100 after:bottom-[5px]", activeDots)
            )}
          >
            {link.label}
          </Link>
        ))}
      </nav>

      <Button
        variant="surface"
        size="pill"
        className="hidden nav:inline-flex"
        nativeButton={false}
        render={<Link href={signIn.href} />}
      >
        {signIn.label}
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger
          render={
            <Button
              variant="surface"
              size="icon-pill"
              aria-label={open ? "Close menu" : "Open menu"}
              className="flex-col gap-[5px] hover:translate-y-0 aria-expanded:bg-white nav:hidden"
            />
          }
        >
          <span className="h-[1.5px] w-[18px] rounded-full bg-white transition-transform duration-300 group-aria-expanded/button:translate-y-[6.5px] group-aria-expanded/button:rotate-45 group-aria-expanded/button:bg-black" />
          <span className="h-[1.5px] w-[18px] rounded-full bg-white transition-opacity duration-200 group-aria-expanded/button:opacity-0" />
          <span className="h-[1.5px] w-[18px] rounded-full bg-white transition-transform duration-300 group-aria-expanded/button:-translate-y-[6.5px] group-aria-expanded/button:-rotate-45 group-aria-expanded/button:bg-black" />
        </DialogTrigger>

        <DialogContent
          showCloseButton={false}
          overlayClassName="bg-black/62 backdrop-blur-[6px] duration-300"
          className="top-[calc(clamp(16px,2.4vh,28px)+60px)] w-[calc(100%-28px)] max-w-[420px] translate-y-0 gap-1 rounded-[28px] bg-white px-[18px] pt-[22px] pb-5 text-black shadow-sheet ring-0 duration-300 data-open:slide-in-from-top-3 sm:max-w-[420px]"
        >
          <DialogTitle className="sr-only">Menu</DialogTitle>
          <nav aria-label="Main" className="flex flex-col">
            {links.map((link, i) => (
              <Link
                key={link.label}
                href={link.href}
                onClick={() => setOpen(false)}
                aria-current={link.active ? "page" : undefined}
                style={{ animationDelay: `${0.06 + i * 0.05}s` }}
                className={cn(
                  "relative animate-link-in rounded-2xl px-4 py-3.5 text-center text-base font-medium tracking-[-0.01em] text-pill-foreground opacity-60 transition-opacity hover:opacity-90 motion-reduce:animate-none",
                  link.active && cn("opacity-100 after:bottom-2", activeDots)
                )}
              >
                {link.label}
              </Link>
            ))}
          </nav>
          <Button
            variant="surface"
            size="pill"
            className="mt-2 w-full animate-link-in motion-reduce:animate-none"
            style={{ animationDelay: `${0.06 + links.length * 0.05}s` }}
            nativeButton={false}
            render={<Link href={signIn.href} onClick={() => setOpen(false)} />}
          >
            {signIn.label}
          </Button>
        </DialogContent>
      </Dialog>
    </header>
  );
}
