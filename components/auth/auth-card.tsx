import { Card, CardContent } from "@/components/ui/card";

/**
 * The card every auth step's form sits in. The (auth) layout supplies the
 * logo, theme toggle and brand panel around it.
 */
export function AuthCard({ children }: { children: React.ReactNode }) {
  return (
    <Card
      className="w-full max-w-[420px] animate-reveal p-0 shadow-soft motion-reduce:animate-none"
      style={{ animationDelay: "0.08s" }}
    >
      <CardContent className="p-[clamp(24px,4vw,36px)]">{children}</CardContent>
    </Card>
  );
}

/** Pixel title and one line of context at the top of an auth step. */
export function AuthHeader({
  title,
  description,
}: {
  title: string;
  description?: React.ReactNode;
}) {
  return (
    <div className="flex flex-col items-center gap-2.5 text-center">
      <h1 className="font-display text-[clamp(26px,2.6vw,32px)] leading-[1.15] font-normal tracking-[-0.02em]">
        {title}
      </h1>
      {description && <p className="text-balance text-muted-foreground">{description}</p>}
    </div>
  );
}
