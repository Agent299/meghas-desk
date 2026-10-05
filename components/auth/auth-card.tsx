import Image from "next/image";

import { LogoMark } from "@/components/landing/logo";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

/**
 * The card every auth step sits in (from shadcn's login-04 block). With
 * `cover`, a second column shows the landing still on md+ screens.
 */
export function AuthCard({
  cover = false,
  priority = false,
  children,
}: {
  cover?: boolean;
  /** Preload the cover image; set on the first page people land on. */
  priority?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div className={cn("w-full max-w-sm", cover && "md:max-w-4xl")}>
      <Card className="overflow-hidden p-0">
        <CardContent className={cn("grid p-0", cover && "md:grid-cols-2")}>
          <div className="p-6 md:p-8">{children}</div>
          {cover && (
            <div className="relative hidden min-h-[560px] bg-muted md:block">
              <Image
                src="/auth-cover.jpg"
                alt=""
                fill
                sizes="(min-width: 768px) 448px, 0px"
                priority={priority}
                className="object-cover"
              />
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

/** Logo, title and one line of context at the top of an auth step. */
export function AuthHeader({
  title,
  description,
}: {
  title: string;
  description?: React.ReactNode;
}) {
  return (
    <div className="flex flex-col items-center gap-2 text-center">
      <div className="mb-2 flex size-10 items-center justify-center rounded-full bg-foreground text-background">
        <LogoMark className="size-[72%]" />
      </div>
      <h1 className="text-2xl font-bold">{title}</h1>
      {description && <p className="text-balance text-muted-foreground">{description}</p>}
    </div>
  );
}
