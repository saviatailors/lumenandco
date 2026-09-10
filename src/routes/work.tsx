import { createFileRoute } from "@tanstack/react-router";
import WorkPage from "@/app/WorkPage";

export const Route = createFileRoute("/work")({
  head: () => ({
    meta: [
      { title: "Our Work & Services — lumen&co" },
      {
        name: "description",
        content:
          "Case studies and services from lumen&co: paid search, paid social, creative studio, SEO, analytics and PR work for DTC, SaaS and hospitality brands.",
      },
      { property: "og:title", content: "Our Work & Services — lumen&co" },
      {
        property: "og:description",
        content:
          "Real projects with real numbers: 4.4x blended ROAS, 51% lower cost per demo and 164% organic growth.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: WorkPage,
});
