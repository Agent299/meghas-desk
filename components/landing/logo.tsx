import { cn } from "@/lib/utils";

/** The MeghasDesk mark: a speech bubble built from a dot grid. */
export function LogoMark({ className }: { className?: string }) {
  const dots: [number, number][] = [];
  for (let y = 0; y < 5; y++) {
    for (let x = 0; x < 6; x++) {
      // Round off the bubble's corners
      const corner = (x === 0 || x === 5) && (y === 0 || y === 4);
      if (!corner) dots.push([x, y]);
    }
  }

  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
      className={cn("size-full", className)}
      fill="currentColor"
    >
      {dots.map(([x, y]) => (
        <circle key={`${x}-${y}`} cx={4 + x * 3.2} cy={3.5 + y * 3.2} r={1.15} />
      ))}
      {/* Tail */}
      <circle cx={7.2} cy={19.5} r={1.15} />
      <circle cx={5.4} cy={21.6} r={1.15} />
    </svg>
  );
}
