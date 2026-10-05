import { os } from "@orpc/server";
import * as z from "zod";

export const router = {
  health: os
    .output(z.object({ ok: z.literal(true) }))
    .handler(() => ({ ok: true as const })),
};

export type Router = typeof router;
