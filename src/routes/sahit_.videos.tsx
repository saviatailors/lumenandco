import { createFileRoute } from "@tanstack/react-router";
import VideoLibraryPage from "@/app/VideoLibraryPage";

export const Route = createFileRoute("/sahit_/videos")({
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
