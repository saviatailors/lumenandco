import { useEffect, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { Loader2, Plus, Save, Trash2 } from "lucide-react";

import { listMedia, saveMedia, deleteMedia } from "@/lib/crm.functions";

type Row = {
  id: string;
  kind: "reel" | "creative";
  src: string;
  title: string;
  subtitle: string;
  poster: string;
  sort_order: number;
};

const ORANGE = "#ef4d23";

const blank = (kind: "reel" | "creative", sort: number): Row => ({
  id: "",
  kind,
  src: "",
  title: "",
  subtitle: "",
  poster: "",
  sort_order: sort,
});

export default function MediaManager() {
  const fetchMedia = useServerFn(listMedia);
  const putMedia = useServerFn(saveMedia);
  const dropMedia = useServerFn(deleteMedia);

  const [rows, setRows] = useState<Row[]>([]);
  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [note, setNote] = useState("");

  const load = async () => {
    setLoading(true);
    try {
      const res = await fetchMedia({ data: {} });
      setRows(res.media as Row[]);
    } catch {
      setNote("Could not load the media list.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const patch = (i: number, part: Partial<Row>) =>
    setRows((prev) => prev.map((r, idx) => (idx === i ? { ...r, ...part } : r)));

  const save = async (i: number) => {
    const r = rows[i];
    if (!r || !r.src.trim()) {
      setNote("Add a link before saving.");
      return;
    }
    setBusyId(r.id || `new-${i}`);
    setNote("");
    try {
      await putMedia({
        data: {
          ...(r.id ? { id: r.id } : {}),
          kind: r.kind,
          src: r.src.trim(),
          title: r.title,
          subtitle: r.subtitle,
          poster: r.poster,
          sort_order: r.sort_order,
        },
      });
      setNote("Saved. Refresh the site to see it.");
      await load();
    } catch {
      setNote("That didn't save. Check the link and try again.");
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
      setRows((prev) => prev.filter((_, idx) => idx !== i));
      setNote("Removed.");
    } catch {
      setNote("Could not remove that one.");
    } finally {
      setBusyId(null);
    }
  };

  const addRow = (kind: "reel" | "creative") => {
    const max = rows.filter((r) => r.kind === kind).reduce((m, r) => Math.max(m, r.sort_order), 0);
    setRows((prev) => [...prev, blank(kind, max + 10)]);
  };

  const group = (kind: "reel" | "creative") =>
    rows.map((r, i) => ({ r, i })).filter(({ r }) => r.kind === kind);

  if (loading) {
    return (
      <div className="mt-3 flex items-center gap-2 rounded-3xl bg-white p-10 text-sm text-neutral-500">
        <Loader2 className="h-4 w-4 animate-spin" /> Loading website media…
      </div>
    );
  }

  const field =
    "w-full rounded-xl border border-neutral-200 px-3 py-2 text-sm text-neutral-900 outline-none focus:border-neutral-400";

  const section = (kind: "reel" | "creative", label: string, help: string) => (
    <div className="mt-3 rounded-3xl bg-white p-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2
            className="text-xl text-neutral-900"
            style={{ fontFamily: "'Instrument Serif', serif", fontStyle: "italic" }}
          >
            {label}
          </h2>
          <p className="text-xs text-neutral-500">{help}</p>
        </div>
        <button
          onClick={() => addRow(kind)}
          className="inline-flex items-center gap-2 rounded-full px-4 py-2 text-xs font-semibold text-white"
          style={{ background: ORANGE }}
        >
          <Plus className="h-3.5 w-3.5" /> Add
        </button>
      </div>

      <div className="mt-4 space-y-3">
        {group(kind).length === 0 ? (
          <p className="text-sm text-neutral-500">Nothing here yet — press Add.</p>
        ) : null}
        {group(kind).map(({ r, i }) => (
          <div
            key={r.id || `new-${i}`}
            className="flex flex-col gap-3 rounded-2xl border border-neutral-200 p-3 sm:flex-row sm:items-start"
          >
            <div className="shrink-0">
              {kind === "reel" ? (
                r.src ? (
                  <video
                    src={r.src}
                    muted
                    loop
                    autoPlay
                    playsInline
                    className="h-28 w-[63px] rounded-lg bg-neutral-900 object-cover"
                  />
                ) : (
                  <div className="h-28 w-[63px] rounded-lg bg-neutral-200" />
                )
              ) : r.src ? (
                <img src={r.src} alt="" className="h-28 w-[90px] rounded-lg bg-neutral-200 object-cover" />
              ) : (
                <div className="h-28 w-[90px] rounded-lg bg-neutral-200" />
              )}
            </div>

            <div className="grid flex-1 gap-2 sm:grid-cols-2">
              <input
                className={`${field} sm:col-span-2`}
                placeholder={kind === "reel" ? "Video link (mp4)" : "Image link"}
                value={r.src}
                onChange={(e) => patch(i, { src: e.target.value })}
              />
              <input
                className={field}
                placeholder={kind === "reel" ? "Caption (e.g. Paid social reel)" : "Description (optional)"}
                value={r.title}
                onChange={(e) => patch(i, { title: e.target.value })}
              />
              {kind === "reel" ? (
                <input
                  className={field}
                  placeholder="Second line (e.g. 1.2M views)"
                  value={r.subtitle}
                  onChange={(e) => patch(i, { subtitle: e.target.value })}
                />
              ) : null}
              {kind === "reel" ? (
                <input
                  className={field}
                  placeholder="Cover image link (optional)"
                  value={r.poster}
                  onChange={(e) => patch(i, { poster: e.target.value })}
                />
              ) : null}
              <input
                className={field}
                type="number"
                placeholder="Order"
                value={r.sort_order}
                onChange={(e) => patch(i, { sort_order: Number(e.target.value) || 0 })}
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
  );

  return (
    <div className="pb-10">
      {note ? (
        <p className="mt-3 rounded-2xl bg-white px-4 py-3 text-xs text-neutral-600">{note}</p>
      ) : null}
      {section("reel", "Videos", "The vertical videos in the “Results we can prove” strip, on the home and Work pages.")}
      {section("creative", "Creatives", "The scrolling image strip under the videos.")}
    </div>
  );
}
