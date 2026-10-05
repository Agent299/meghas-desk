import { auth } from "@/lib/auth/server";

// Optimistic gate for the dashboard. Neon's middleware also completes
// magic-link and Google sign-ins that land on a protected page. Server-side
// session checks in app/dashboard/layout.tsx back this up.
export default auth.middleware({ loginUrl: "/login" });

export const config = {
  // Only protected routes. Neon's middleware treats every matched path except
  // its own /auth/* list as protected, so public pages must stay out of here.
  matcher: ["/dashboard", "/dashboard/:path*"],
};
