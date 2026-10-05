import { defineConfig } from "@neon/config/v1";

// Declares which Neon services each branch has. Auth settings (sign-in methods,
// magic link, trusted domains) are configured with `neon neon-auth`, not here.
export default defineConfig({
  auth: true,
  dataApi: true,
  buckets: {
    uploads: { access: "private" },
  },
  // Functions and the AI Gateway come later. Declaring a function makes
  // `neon config apply` deploy it.
  // aiGateway: true, // needs a paid Neon plan
});
