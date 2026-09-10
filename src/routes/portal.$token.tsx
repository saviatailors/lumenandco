import { createFileRoute } from "@tanstack/react-router";

import PortalPage from "@/app/PortalPage";

export const Route = createFileRoute("/portal/$token")({
  head: () => ({
    meta: [
      { title: "Client portal | lumen&co" },
      {
        name: "description",
        content:
          "Track your lumen&co enquiry: your brief, budget, current stage and the next steps from your strategist.",
      },
      { name: "robots", content: "noindex, nofollow" },
      { property: "og:title", content: "Client portal | lumen&co" },
      {
        property: "og:description",
        content: "Your enquiry, budget and next steps with lumen&co.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: PortalPage,
});
