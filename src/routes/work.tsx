import { createFileRoute } from "@tanstack/react-router";
import WorkPage from "@/app/WorkPage";
import { buildSeoMeta } from "@/lib/seo";

export const Route = createFileRoute("/work")({
  head: () =>
    buildSeoMeta({
      title: "Case Studies & Client Results | Lumen & Co",
      description:
        "Real case studies: 4.4x blended ROAS, 51% lower demo costs and 164% organic growth for DTC, SaaS and clinics in India and the US.",
      canonicalPath: "/work/",
      keywords: [
        "digital marketing case studies",
        "performance marketing results",
        "e-commerce ROAS case study",
        "video editing portfolio",
        "med spa marketing results",
      ],
      breadcrumbs: [
        { name: "Home", item: "/" },
        { name: "Work", item: "/work/" },
      ],
    }),
  component: WorkPage,
});
