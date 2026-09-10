import { createFileRoute } from "@tanstack/react-router";
import CrmPage from "@/app/CrmPage";

export const Route = createFileRoute("/sahit")({
  head: () => ({
    meta: [
      { title: "Private CRM — lumen&co" },
      { name: "description", content: "Internal enquiry pipeline for the lumen&co team." },
      { name: "robots", content: "noindex, nofollow" },
      { property: "og:title", content: "Private CRM — lumen&co" },
      { property: "og:description", content: "Internal enquiry pipeline for the lumen&co team." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: CrmPage,
});
