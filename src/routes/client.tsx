import { createFileRoute } from "@tanstack/react-router";

import ClientPortalPage from "@/app/ClientPortalPage";

export const Route = createFileRoute("/client")({
  head: () => ({
    meta: [
      { title: "Client sign in | lumen&co" },
      {
        name: "description",
        content:
          "Sign in with your email to track your lumen&co enquiry: your brief, budget, current stage and next steps.",
      },
      { name: "robots", content: "noindex, nofollow" },
      { property: "og:title", content: "Client sign in | lumen&co" },
      {
        property: "og:description",
        content: "Track your enquiry, budget and stage with lumen&co.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: ClientPortalPage,
});
