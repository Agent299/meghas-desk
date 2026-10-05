import Image from "next/image"

/**
 * The top of Home: the hero video's still in a black brand panel (as on the
 * auth pages), with a display headline. Black in every theme.
 */
export function HomeBanner({ firstName }: { firstName: string | null }) {
  return (
    <section className="relative isolate flex min-h-[148px] animate-reveal flex-col justify-end overflow-hidden rounded-xl bg-black p-[clamp(20px,3vw,32px)] text-white shadow-soft motion-reduce:animate-none">
      <Image
        src="/auth-cover.jpg"
        alt=""
        fill
        priority
        sizes="(min-width: 1280px) 1200px, 100vw"
        className="-z-10 object-cover object-[50%_70%]"
      />
      <div className="absolute inset-0 -z-10 bg-gradient-to-r from-black/85 via-black/55 to-black/10" />
      <p className="text-sm text-surface-foreground">{firstName ? `Welcome back, ${firstName}` : "Welcome back"}</p>
      <h2 className="mt-1 font-display text-[clamp(26px,3.2vw,40px)] leading-[1.1] font-normal tracking-[-0.02em] [text-shadow:0_2px_24px_rgb(0_0_0/0.35)]">
        Your Widget
      </h2>
      <p className="mt-2 max-w-[460px] text-[14px] leading-[1.55] text-[#d0d0d0]/85">
        Set it up once. The AI answers Visitors from your Knowledge files, and your team steps in when someone asks
        for a person.
      </p>
    </section>
  )
}
