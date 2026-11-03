import { createFileRoute, redirect } from "@tanstack/react-router";
import VideoLibraryPage from "@/app/VideoLibraryPage";
import { isAuthorizedEmail } from "@/lib/rbac";

export const Route = createFileRoute("/sahit_/videos")({
  ssr: false,
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
      { title: "Video library — lumen&co" },
      { name: "description", content: "Private video library for the lumen&co team." },
      { name: "robots", content: "noindex, nofollow" },
      { property: "og:title", content: "Video library — lumen&co" },
      { property: "og:description", content: "Private video library for the lumen&co team." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: VideoLibraryPage,
});
