import { createFileRoute } from "@tanstack/react-router";
import DeliveryHubPage from "@/app/DeliveryHubPage";

export const Route = createFileRoute("/delivery")({
  head: () => ({
    meta: [
      { title: "Delivery Hub — lumen&co" },
      { name: "description", content: "Operations and deliverable hub for the lumen&co team." },
      { name: "robots", content: "noindex, nofollow" },
      { property: "og:title", content: "Delivery Hub — lumen&co" },
      { property: "og:description", content: "Operations and deliverable hub for the lumen&co team." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: DeliveryHubPage,
});
