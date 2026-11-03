import { createFileRoute, redirect } from "@tanstack/react-router";
import DeliveryHubPage from "@/app/DeliveryHubPage";
import { isAuthorizedEmail } from "@/lib/rbac";

export const Route = createFileRoute("/delivery")({
  beforeLoad: () => {
    if (typeof window !== "undefined") {
      const isAuth = localStorage.getItem("lumen_admin_auth_v2") === "true";
      const stored = localStorage.getItem("lumen_admin_user_v2");
      let authorized = false;
      if (isAuth && stored) {
        try {
          const user = JSON.parse(stored);
          if (isAuthorizedEmail(user?.email)) {
            authorized = true;
          }
        } catch {}
      }
      if (!authorized) {
        throw redirect({
          to: "/sahit/",
        });
      }
    }
  },
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
