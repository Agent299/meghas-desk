import { CircleAlertIcon, CircleCheckIcon } from "lucide-react";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { cn } from "@/lib/utils";

/**
 * A form-level message on shadcn's Alert. `error` uses the destructive variant
 * and is announced assertively; `success` stays neutral, since destructive is
 * the only hue.
 */
export function FormAlert({
  variant = "error",
  className,
  children,
}: {
  variant?: "error" | "success";
  className?: string;
  children: React.ReactNode;
}) {
  const error = variant === "error";
  const Icon = error ? CircleAlertIcon : CircleCheckIcon;
  return (
    <Alert
      variant={error ? "destructive" : "default"}
      role={error ? "alert" : "status"}
      className={cn(error && "border-destructive/40", className)}
    >
      <Icon aria-hidden="true" />
      <AlertDescription className={error ? undefined : "text-foreground"}>{children}</AlertDescription>
    </Alert>
  );
}
