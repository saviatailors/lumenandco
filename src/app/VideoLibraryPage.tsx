import { useEffect, useRef, useState } from "react";
import { Link } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { ArrowLeft, Loader2, LogOut, Save, Trash2, Upload } from "lucide-react";

import { supabase } from "@/lib/supabase-client";
import {
  listMedia,
  saveMedia,
  deleteMedia,
  createVideoUpload,
  deleteVideoFile,
} from "@/lib/crm.functions";
import { STORAGE_PREFIX, VIDEO_BUCKET, resolveMediaSrc } from "./components/useSiteMedia";
import AdminGate from "./components/AdminGate";
import { useAdminAuth } from "./components/useAdminAuth";

const ORANGE = "#ef4d23";

type Row = {
  id: string;
  kind: "reel" | "creative";
  src: string;
  title: string;
  subtitle: string;
  poster: string;
  sort_order: number;
};

export default function VideoLibraryPage() {
  const fetchMedia = useServerFn(listMedia);
  const putMedia = useServerFn(saveMedia);
  const dropMedia = useServerFn(deleteMedia);
  const startUpload = useServerFn(createVideoUpload);
  const dropFile = useServerFn(deleteVideoFile);

  const admin = useAdminAuth();
  const [rows, setRows] = useState<Row[]>([]);
  const [previews, setPreviews] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [note, setNote] = useState("");
  const fileRef = useRef<HTMLInputElement | null>(null);

  const load = async () => {
    setLoading(true);
    try {
      const res = await fetchMedia({ data: {} });
      const videos = (res.media as Row[]).filter((r) => r.kind === "reel");
      setRows(videos);
      const pairs = await Promise.all(
        videos.map(async (r) => [r.id, await resolveMediaSrc(r.src)] as const),
      );
      setPreviews(Object.fromEntries(pairs));
      setNote("");
    } catch {
      setNote("We couldn't load your videos. Try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (admin.state === "ready") void load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [admin.state]);

  const patch = (i: number, part: Partial<Row>) =>
    setRows((prev) => prev.map((r, idx) => (idx === i ? { ...r, ...part } : r)));

  const nextOrder = () => rows.reduce((m, r) => Math.max(m, r.sort_order), 0) + 10;

  const onFiles = async (files: FileList | null) => {
    if (!files || !files.length) return;
    setUploading(true);
    setNote("");
    try {
      let order = nextOrder();
      for (const file of Array.from(files)) {
        if (!file.type.startsWith("video/")) {
          setNote(`${file.name} isn't a video file — skipped.`);
          continue;
        }
        const ticket = await startUpload({ data: { filename: file.name } });
        const { error } = await supabase.storage
          .from(VIDEO_BUCKET)
          .uploadToSignedUrl(ticket.path, ticket.token, file, { contentType: file.type });
        if (error) throw new Error(error.message);
        await putMedia({
          data: {
            kind: "reel",
            src: `${STORAGE_PREFIX}${ticket.path}`,
            title: file.name.replace(/\.[^.]+$/, "").slice(0, 120),
            subtitle: "",
            poster: "",
            sort_order: order,
          },
        });
        order += 10;
      }
      await load();
      setNote("Uploaded. It's live on the site.");
    } catch {
      setNote("That upload didn't go through. Try a smaller file (under 100MB).");
    } finally {
      setUploading(false);
      if (fileRef.current) fileRef.current.value = "";
    }
  };

  const save = async (i: number) => {
    const r = rows[i];
    if (!r || !r.src.trim()) {
      setNote("Add a video link or upload a file first.");
      return;
    }
    setBusyId(r.id || `new-${i}`);
    try {
      await putMedia({
        data: {
          ...(r.id ? { id: r.id } : {}),
          kind: "reel",
          src: r.src.trim(),
          title: r.title,
          subtitle: r.subtitle,
          poster: r.poster,
          sort_order: r.sort_order,
        },
      });
      await load();
      setNote("Saved.");
    } catch {
      setNote("That didn't save. Check the details and try again.");
    } finally {
      setBusyId(null);
    }
  };

  const remove = async (i: number) => {
    const r = rows[i];
    if (!r) return;
    if (!r.id) {
      setRows((prev) => prev.filter((_, idx) => idx !== i));
      return;
    }
    setBusyId(r.id);
    try {
      await dropMedia({ data: { id: r.id } });
      if (r.src.startsWith(STORAGE_PREFIX)) {
        await dropFile({ data: { path: r.src.slice(STORAGE_PREFIX.length) } });
      }
      setRows((prev) => prev.filter((_, idx) => idx !== i));
      setNote("Removed from the site.");
    } catch {
      setNote("Could not remove that one.");
    } finally {
      setBusyId(null);
    }
  };

  const field =
    "w-full rounded-xl border border-neutral-200 px-3 py-2 text-sm text-neutral-900 outline-none focus:border-neutral-400";

  if (admin.state !== "ready") {
    return (
      <AdminGate
        state={admin.state}
        email={admin.email}
        error={admin.error}
        onSignIn={() => void admin.signIn()}
        onPasswordSignIn={admin.signInWithPassword}
        onSignOut={() => void admin.signOut()}
        title="Video library"
      />
    );
  }

  return (
    <div className="min-h-screen w-full bg-[#ededed] p-3 sm:p-5" style={{ fontFamily: "Inter, sans-serif" }}>
      <div className="mx-auto max-w-6xl pb-10">
        <header className="flex flex-wrap items-center justify-between gap-3 rounded-3xl bg-white px-5 py-4">
          <div>
            <h1
              className="text-2xl text-neutral-900"
              style={{ fontFamily: "'Instrument Serif', serif", fontStyle: "italic" }}
            >
              Video library
            </h1>
            <p className="text-xs text-neutral-500">{rows.length} videos showing on the site</p>
          </div>
          <div className="flex items-center gap-2">
            <Link
              to="/sahit"
              className="inline-flex items-center gap-2 rounded-full border border-neutral-200 px-3 py-2 text-xs font-medium text-neutral-700 hover:bg-neutral-50"
            >
              <ArrowLeft className="h-3.5 w-3.5" /> Enquiries
            </Link>
            <button
              onClick={() => void admin.signOut()}
              className="inline-flex items-center gap-2 rounded-full border border-neutral-200 px-3 py-2 text-xs font-medium text-neutral-700 hover:bg-neutral-50"
            >
              <LogOut className="h-3.5 w-3.5" /> Sign out
            </button>
            <Link to="/" className="rounded-full px-4 py-2 text-xs font-semibold text-white" style={{ background: ORANGE }}>
              Site
            </Link>
          </div>
        </header>

        <div className="mt-3 rounded-3xl bg-white p-5">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="text-sm font-semibold text-neutral-900">Upload videos</h2>
              <p className="text-xs text-neutral-500">
                Vertical (9:16) clips work best. Up to 100MB each — they appear in the “Results we can
                prove” strip on the home and Work pages.
              </p>
            </div>
            <button
              onClick={() => fileRef.current?.click()}
              disabled={uploading}
              className="inline-flex items-center gap-2 rounded-full px-4 py-2 text-xs font-semibold text-white disabled:opacity-60"
              style={{ background: ORANGE }}
            >
              {uploading ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Upload className="h-3.5 w-3.5" />}
              {uploading ? "Uploading…" : "Choose videos"}
            </button>
            <input
              ref={fileRef}
              type="file"
              accept="video/*"
              multiple
              hidden
              onChange={(e) => void onFiles(e.target.files)}
            />
          </div>
          {note ? <p className="mt-3 text-xs text-neutral-600">{note}</p> : null}
        </div>

        <div className="mt-3 space-y-3">
          {rows.length === 0 ? (
            <p className="rounded-3xl bg-white p-8 text-sm text-neutral-500">
              No videos yet — upload your first clip above.
            </p>
          ) : null}
          {rows.map((r, i) => (
            <div
              key={r.id || `new-${i}`}
              className="flex flex-col gap-3 rounded-3xl bg-white p-4 sm:flex-row sm:items-start"
            >
              <div className="shrink-0">
                {previews[r.id] || (!r.src.startsWith(STORAGE_PREFIX) && r.src) ? (
                  <video
                    src={previews[r.id] || r.src}
                    muted
                    loop
                    autoPlay
                    playsInline
                    poster={r.poster || undefined}
                    className="h-40 w-[90px] rounded-xl bg-neutral-900 object-cover"
                  />
                ) : (
                  <div className="h-40 w-[90px] rounded-xl bg-neutral-200" />
                )}
              </div>

              <div className="grid flex-1 gap-2 sm:grid-cols-2">
                <input
                  className={field}
                  placeholder="Caption (e.g. Paid social reel)"
                  value={r.title}
                  onChange={(e) => patch(i, { title: e.target.value })}
                />
                <input
                  className={field}
                  placeholder="Second line (e.g. 1.2M views)"
                  value={r.subtitle}
                  onChange={(e) => patch(i, { subtitle: e.target.value })}
                />
                <input
                  className={field}
                  placeholder="Cover image link (optional)"
                  value={r.poster}
                  onChange={(e) => patch(i, { poster: e.target.value })}
                />
                <input
                  className={field}
                  type="number"
                  placeholder="Order"
                  value={r.sort_order}
                  onChange={(e) => patch(i, { sort_order: Number(e.target.value) || 0 })}
                />
                <input
                  className={`${field} sm:col-span-2`}
                  placeholder="Video link"
                  value={r.src}
                  onChange={(e) => patch(i, { src: e.target.value })}
                />
              </div>

              <div className="flex gap-2 sm:flex-col">
                <button
                  onClick={() => void save(i)}
                  disabled={busyId === (r.id || `new-${i}`)}
                  className="inline-flex items-center gap-2 rounded-full px-4 py-2 text-xs font-semibold text-white disabled:opacity-60"
                  style={{ background: "#0b0f1a" }}
                >
                  {busyId === (r.id || `new-${i}`) ? (
                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  ) : (
                    <Save className="h-3.5 w-3.5" />
                  )}
                  Save
                </button>
                <button
                  onClick={() => void remove(i)}
                  className="inline-flex items-center gap-2 rounded-full border border-neutral-200 px-4 py-2 text-xs font-medium text-neutral-600 hover:bg-neutral-50"
                >
                  <Trash2 className="h-3.5 w-3.5" /> Remove
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
