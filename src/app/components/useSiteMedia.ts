import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase-client";

export type MediaItem = {
  id: string;
  kind: "reel" | "creative";
  src: string;
  title: string;
  subtitle: string;
  poster: string;
  sort_order: number;
};

export const DEFAULT_POSTER =
  "https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=400&h=700&fit=crop";

export const VIDEO_BUCKET = "site-videos";
export const STORAGE_PREFIX = `${VIDEO_BUCKET}:`;

/** Turns a stored library reference into a playable link (plain links pass through). */
export async function resolveMediaSrc(src: string) {
  if (!src.startsWith(STORAGE_PREFIX)) return src;
  const path = src.slice(STORAGE_PREFIX.length);
  const { data } = await supabase.storage.from(VIDEO_BUCKET).createSignedUrl(path, 60 * 60 * 24 * 7);
  return data?.signedUrl ?? "";
}

async function resolveAll(items: MediaItem[]) {
  return Promise.all(
    items.map(async (item) => ({ ...item, src: await resolveMediaSrc(item.src) })),
  );
}

/**
 * Reads the reels + creatives that are managed from the private dashboard.
 * Falls back to the passed-in defaults until the list arrives (or if it is empty).
 */
export function useSiteMedia(
  kind: "reel" | "creative",
  fallback: { src: string; title?: string; subtitle?: string; poster?: string }[],
) {
  const [items, setItems] = useState<MediaItem[] | null>(null);

  useEffect(() => {
    let alive = true;
    void supabase
      .from("site_media")
      .select("id,kind,src,title,subtitle,poster,sort_order")
      .eq("kind", kind)
      .order("sort_order", { ascending: true })
      .then(async ({ data }) => {
        if (!data || !data.length) return;
        const resolved = await resolveAll(data as MediaItem[]);
        if (alive) setItems(resolved.filter((i) => i.src));
      });
    return () => {
      alive = false;
    };
  }, [kind]);

  if (items) return items;
  return fallback.map((f, i) => ({
    id: `fallback-${i}`,
    kind,
    src: f.src,
    title: f.title ?? "",
    subtitle: f.subtitle ?? "",
    poster: f.poster ?? "",
    sort_order: i,
  })) as MediaItem[];
}
