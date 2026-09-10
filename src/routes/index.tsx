import { createFileRoute } from "@tanstack/react-router";
import App from "@/app/App";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "lumen&co — Shaping Agencies of Tomorrow" },
      {
        name: "description",
        content:
          "lumen&co is the all-in-one platform powering the future of PR agencies: clicks, impressions and video insights in one dashboard.",
      },
      { property: "og:title", content: "lumen&co — Shaping Agencies of Tomorrow" },
      {
        property: "og:description",
        content:
          "The all-in-one software powering the future of PR agencies. Track clicks, impressions and video performance in one place.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: App,
});
