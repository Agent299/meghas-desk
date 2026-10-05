import { CircleCheckIcon, CircleIcon } from "lucide-react"

import { SETUP_STEP_COPY } from "@/components/overview/setup-steps"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import type { SetupStep } from "@/lib/inbox/types"
import { cn } from "@/lib/utils"

export function SetupChecklist({ steps }: { steps: SetupStep[] }) {
  const done = steps.filter((step) => step.done).length
  const nextId = steps.find((step) => !step.done)?.id

  return (
    <Card>
      <CardHeader>
        <CardTitle>{nextId ? "Get your widget answering" : "Your widget is set up"}</CardTitle>
        <CardDescription>
          {done} of {steps.length} steps done
        </CardDescription>
        <div
          role="progressbar"
          aria-label="Setup progress"
          aria-valuemin={0}
          aria-valuemax={steps.length}
          aria-valuenow={done}
          className="mt-2 h-1.5 overflow-hidden rounded-full bg-muted"
        >
          <div className="h-full rounded-full bg-primary" style={{ width: `${(done / steps.length) * 100}%` }} />
        </div>
      </CardHeader>
      <CardContent>
        <ol className="flex flex-col">
          {steps.map((step, index) => {
            const copy = SETUP_STEP_COPY[step.id]
            const isNext = step.id === nextId
            return (
              <li key={step.id} className={cn("flex gap-3 py-3", index > 0 && "border-t")}>
                {step.done ? (
                  <CircleCheckIcon aria-hidden="true" className="mt-0.5 size-5 shrink-0 fill-primary text-primary-foreground" />
                ) : (
                  <CircleIcon aria-hidden="true" className="mt-0.5 size-5 shrink-0 text-muted-foreground" />
                )}
                <div className="flex min-w-0 flex-1 flex-col gap-0.5">
                  <p className={cn("text-sm font-medium", step.done && "text-muted-foreground line-through decoration-muted-foreground/50")}>
                    {copy.title}
                    <span className="sr-only">{step.done ? " (done)" : " (to do)"}</span>
                  </p>
                  <p className="text-sm text-muted-foreground">{copy.description}</p>
                </div>
                {isNext && <Badge variant="outline" className="mt-0.5">Next</Badge>}
              </li>
            )
          })}
        </ol>
      </CardContent>
    </Card>
  )
}
