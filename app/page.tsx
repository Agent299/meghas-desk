import type { Metadata } from "next";

import { BackgroundVideo } from "@/components/landing/background-video";
import { hero, navLinks, signIn, stats, trust } from "@/components/landing/content";
import { Hero } from "@/components/landing/hero";
import { SiteHeader } from "@/components/landing/site-header";
import { Stats } from "@/components/landing/stats";

export const metadata: Metadata = {
  title: "MeghasDesk: answers visitors while you work",
  description:
    "An AI agent that answers your website visitors from your own docs, day and night, and only calls your team in when a person is really needed.",
};

export default function Home() {
  return (
    <main className="relative flex h-dvh flex-col items-center overflow-hidden bg-black px-[clamp(14px,3vw,32px)] py-[clamp(16px,2.4vh,28px)] text-white">
      <BackgroundVideo />
      <SiteHeader links={navLinks} signIn={signIn} />
      <Hero hero={hero} trust={trust} />
      <Stats stats={stats} />
    </main>
  );
}
