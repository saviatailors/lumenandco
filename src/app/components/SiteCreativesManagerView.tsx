import { useState, useEffect } from "react";
import {
  Film,
  Image as ImageIcon,
  Building2,
  Plus,
  Trash2,
  Edit3,
  Save,
  Upload,
  Play,
  Pause,
  ArrowUp,
  ArrowDown,
  ExternalLink,
  RotateCcw,
  Volume2,
  VolumeX,
  Search,
  Loader2,
  X,
  Eye,
  Tag,
  Sparkles,
} from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/lib/supabase-client";
import { resolveMediaSrc, DEFAULT_POSTER, VIDEO_BUCKET, STORAGE_PREFIX, DEFAULT_BRAND_NAMES } from "./useSiteMedia";
import { REELS, CREATIVES } from "./HomeSections";

export type SiteMediaItem = {
  id: string;
  kind: "reel" | "creative" | "brand";
  src: string;
  title: string;
  subtitle: string;
  poster: string;
  sort_order: number;
  created_at?: string;
};

export default function SiteCreativesManagerView() {
  const [items, setItems] = useState<SiteMediaItem[]>([]);
  const [resolvedUrls, setResolvedUrls] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"reels" | "creatives" | "brands" | "preview">("reels");
  const [searchQuery, setSearchQuery] = useState("");

  // Modal State for Add / Edit
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<SiteMediaItem | null>(null);
  const [formKind, setFormKind] = useState<"reel" | "creative" | "brand">("reel");
  const [formTitle, setFormTitle] = useState("");
  const [formSubtitle, setFormSubtitle] = useState("");
  const [formSrc, setFormSrc] = useState("");
  const [formPoster, setFormPoster] = useState("");
  const [formSortOrder, setFormSortOrder] = useState(10);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<number | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  // Active playing video preview in card list
  const [playingVideoId, setPlayingVideoId] = useState<string | null>(null);
  const [isMuted, setIsMuted] = useState(true);

  // Load items from Supabase or local cache
  const loadMedia = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("site_media")
        .select("*")
        .order("sort_order", { ascending: true });

      if (error) {
        console.warn("Supabase fetch note:", error);
      }

      if (data && data.length > 0) {
        const sorted = data as SiteMediaItem[];
        setItems(sorted);
        resolveUrls(sorted);
        syncBrandsCache(sorted);
        try {
          localStorage.setItem("lumen_site_media_cache", JSON.stringify(sorted));
        } catch {}
      } else {
        // Check local cache or use defaults
        const cached = localStorage.getItem("lumen_site_media_cache");
        if (cached) {
          const parsed = JSON.parse(cached);
          setItems(parsed);
          resolveUrls(parsed);
          syncBrandsCache(parsed);
        } else {
          setItems([]);
        }
      }
    } catch (err) {
      console.error("Error loading site media:", err);
    } finally {
      setLoading(false);
    }
  };

  const syncBrandsCache = (list: SiteMediaItem[]) => {
    const brandList = list.filter((i) => i.kind === "brand").map((b) => ({
      id: b.id,
      name: b.title,
      logo: b.src || undefined,
      category: b.subtitle || undefined,
      sort_order: b.sort_order,
    }));
    if (brandList.length > 0) {
      try {
        localStorage.setItem("lumen_site_brands_cache", JSON.stringify(brandList));
      } catch {}
    }
  };

  const resolveUrls = async (list: SiteMediaItem[]) => {
    const map: Record<string, string> = {};
    for (const item of list) {
      if (item.kind === "reel") {
        try {
          map[item.id] = await resolveMediaSrc(item.src);
        } catch {
          map[item.id] = item.src;
        }
      } else {
        map[item.id] = item.src;
      }
    }
    setResolvedUrls(map);
  };

  useEffect(() => {
    void loadMedia();
  }, []);

  // Filtered items
  const reels = items.filter((i) => i.kind === "reel");
  const creatives = items.filter((i) => i.kind === "creative");
  const brands = items.filter((i) => i.kind === "brand");

  const currentList =
    activeTab === "reels" ? reels : activeTab === "creatives" ? creatives : brands;

  const filteredList = currentList.filter((item) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      item.title.toLowerCase().includes(q) ||
      item.subtitle.toLowerCase().includes(q) ||
      item.src.toLowerCase().includes(q)
    );
  });

  // Open modal for Create
  const handleOpenCreate = (kind: "reel" | "creative" | "brand") => {
    const list = kind === "reel" ? reels : kind === "creative" ? creatives : brands;
    const maxOrder = list.reduce((max, i) => Math.max(max, i.sort_order), 0);
    setEditingItem(null);
    setFormKind(kind);
    setFormTitle(
      kind === "reel"
        ? "New Performance Reel"
        : kind === "creative"
        ? "New Ad Creative"
        : "Brand Name (e.g. Northbeam)"
    );
    setFormSubtitle(
      kind === "reel"
        ? "1.2M views • 4.5x ROAS"
        : kind === "creative"
        ? "Meta Ad Campaign"
        : "Growth Partner"
    );
    setFormSrc("");
    setFormPoster("");
    setFormSortOrder(maxOrder + 10);
    setIsModalOpen(true);
  };

  // Open modal for Edit
  const handleOpenEdit = (item: SiteMediaItem) => {
    setEditingItem(item);
    setFormKind(item.kind);
    setFormTitle(item.title);
    setFormSubtitle(item.subtitle);
    setFormSrc(item.src);
    setFormPoster(item.poster);
    setFormSortOrder(item.sort_order);
    setIsModalOpen(true);
  };

  // Handle Video / Image File Upload to Supabase Storage
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    setUploadProgress(10);
    try {
      const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, "-").slice(-60);
      const filePath = `${Date.now()}-${safeName}`;

      setUploadProgress(30);

      // Attempt upload to Supabase site-videos bucket
      const { error } = await supabase.storage
        .from(VIDEO_BUCKET)
        .upload(filePath, file, {
          cacheControl: "3600",
          upsert: true,
        });

      if (error) {
        console.warn("Storage upload note, falling back to blob URL:", error);
        const objectUrl = URL.createObjectURL(file);
        setFormSrc(objectUrl);
        toast.info(`Uploaded "${file.name}" locally.`);
      } else {
        const storedPath = `${STORAGE_PREFIX}${filePath}`;
        setFormSrc(storedPath);
        const resolved = await resolveMediaSrc(storedPath);
        setResolvedUrls((prev) => ({ ...prev, [editingItem?.id || "temp"]: resolved }));
        toast.success(`Uploaded "${file.name}" successfully!`);
      }

      setUploadProgress(100);
      if (!formTitle || formTitle.startsWith("New ") || formTitle.startsWith("Brand Name")) {
        setFormTitle(file.name.replace(/\.[^.]+$/, "").slice(0, 80));
      }
    } catch (err) {
      console.error("Upload error:", err);
      toast.error("File upload failed. You can also paste a direct URL link.");
    } finally {
      setIsUploading(false);
      setTimeout(() => setUploadProgress(null), 1000);
    }
  };

  // Save / Update Item
  const handleSaveItem = async () => {
    if (formKind !== "brand" && !formSrc.trim()) {
      toast.error("Please provide a valid video or image URL/file.");
      return;
    }
    if (formKind === "brand" && !formTitle.trim()) {
      toast.error("Please provide a brand name.");
      return;
    }

    setIsSaving(true);
    try {
      const itemData = {
        kind: formKind,
        src: formSrc.trim(),
        title:
          formTitle.trim() ||
          (formKind === "reel" ? "Performance Reel" : formKind === "creative" ? "Brand Creative" : "Brand"),
        subtitle: formSubtitle.trim(),
        poster: formPoster.trim(),
        sort_order: Number(formSortOrder) || 0,
      };

      if (editingItem && editingItem.id) {
        // Update existing
        await supabase
          .from("site_media")
          .update(itemData)
          .eq("id", editingItem.id);

        const updatedList = items.map((i) =>
          i.id === editingItem.id ? { ...i, ...itemData } : i
        );
        setItems(updatedList);
        resolveUrls(updatedList);
        syncBrandsCache(updatedList);
        localStorage.setItem("lumen_site_media_cache", JSON.stringify(updatedList));
        toast.success(`Updated "${itemData.title}"!`);
      } else {
        // Create new item
        const newId = `media-${Date.now()}`;
        const newItem: SiteMediaItem = {
          id: newId,
          ...itemData,
          created_at: new Date().toISOString(),
        };

        const { data } = await supabase
          .from("site_media")
          .insert([itemData])
          .select();

        const createdItem = data && data[0] ? (data[0] as SiteMediaItem) : newItem;
        const updatedList = [...items, createdItem].sort((a, b) => a.sort_order - b.sort_order);
        setItems(updatedList);
        resolveUrls(updatedList);
        syncBrandsCache(updatedList);
        localStorage.setItem("lumen_site_media_cache", JSON.stringify(updatedList));
        toast.success(`Added "${itemData.title}" to public site!`);
      }

      setIsModalOpen(false);
    } catch (err) {
      console.error("Error saving media item:", err);
      toast.error("Failed to save media item.");
    } finally {
      setIsSaving(false);
    }
  };

  // Delete Item
  const handleDeleteItem = async (item: SiteMediaItem) => {
    if (!confirm(`Are you sure you want to remove "${item.title}" from the website?`)) {
      return;
    }

    try {
      if (item.id && !item.id.startsWith("fallback-") && !item.id.startsWith("seed-")) {
        await supabase.from("site_media").delete().eq("id", item.id);
      }

      const updated = items.filter((i) => i.id !== item.id);
      setItems(updated);
      syncBrandsCache(updated);
      localStorage.setItem("lumen_site_media_cache", JSON.stringify(updated));
      toast.success(`Removed "${item.title}" from website.`);
    } catch (err) {
      console.error("Error deleting item:", err);
      toast.error("Could not delete item.");
    }
  };

  // Move Sort Order Up / Down
  const handleMoveOrder = async (index: number, direction: "up" | "down") => {
    const list = [...currentList];
    const targetIndex = direction === "up" ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= list.length) return;

    const currentItem = list[index];
    const targetItem = list[targetIndex];

    const tempOrder = currentItem.sort_order;
    currentItem.sort_order = targetItem.sort_order;
    targetItem.sort_order = tempOrder;

    if (currentItem.sort_order === targetItem.sort_order) {
      if (direction === "up") {
        currentItem.sort_order = Math.max(0, currentItem.sort_order - 10);
      } else {
        currentItem.sort_order = currentItem.sort_order + 10;
      }
    }

    const updatedItems = items.map((i) => {
      if (i.id === currentItem.id) return { ...i, sort_order: currentItem.sort_order };
      if (i.id === targetItem.id) return { ...i, sort_order: targetItem.sort_order };
      return i;
    }).sort((a, b) => a.sort_order - b.sort_order);

    setItems(updatedItems);
    syncBrandsCache(updatedItems);
    localStorage.setItem("lumen_site_media_cache", JSON.stringify(updatedItems));

    try {
      if (currentItem.id && !currentItem.id.startsWith("fallback-")) {
        await supabase.from("site_media").update({ sort_order: currentItem.sort_order }).eq("id", currentItem.id);
      }
      if (targetItem.id && !targetItem.id.startsWith("fallback-")) {
        await supabase.from("site_media").update({ sort_order: targetItem.sort_order }).eq("id", targetItem.id);
      }
    } catch {}

    toast.success("Reordered successfully!");
  };

  // Seed / Populate Default Site Assets
  const handleSeedDefaults = async () => {
    if (!confirm("This will load the official Lumen & Co reels, creatives, and scrolling partner brands into the database. Proceed?")) {
      return;
    }

    setLoading(true);
    try {
      const defaultRows: Omit<SiteMediaItem, "id">[] = [
        ...REELS.map((r, i) => ({
          kind: "reel" as const,
          src: r.src,
          title: r.title,
          subtitle: r.subtitle,
          poster: DEFAULT_POSTER,
          sort_order: (i + 1) * 10,
        })),
        ...CREATIVES.map((src, i) => ({
          kind: "creative" as const,
          src,
          title: `Ad Showcase #${i + 1}`,
          subtitle: "Performance Creative",
          poster: "",
          sort_order: (i + 1) * 10,
        })),
        ...DEFAULT_BRAND_NAMES.map((name, i) => ({
          kind: "brand" as const,
          src: "",
          title: name,
          subtitle: "Growth Partner",
          poster: "",
          sort_order: (i + 1) * 10,
        })),
      ];

      const { data } = await supabase.from("site_media").insert(defaultRows).select();

      let finalItems: SiteMediaItem[];
      if (data && data.length > 0) {
        finalItems = data as SiteMediaItem[];
      } else {
        finalItems = defaultRows.map((r, i) => ({
          id: `seed-${i}-${Date.now()}`,
          ...r,
          created_at: new Date().toISOString(),
        }));
      }

      setItems(finalItems);
      resolveUrls(finalItems);
      syncBrandsCache(finalItems);
      localStorage.setItem("lumen_site_media_cache", JSON.stringify(finalItems));
      toast.success("Loaded default Lumen & Co creatives, reels, and scrolling partner brands!");
    } catch (err) {
      console.error("Seed error:", err);
      toast.error("Could not load default assets.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 pb-12 font-sans">
      {/* ========================================================================= */}
      {/* 1. HERO HEADER BANNER */}
      {/* ========================================================================= */}
      <div className="bg-white/90 backdrop-blur-2xl rounded-3xl p-6 sm:p-7 border border-white/80 shadow-md relative overflow-hidden flex flex-col md:flex-row items-start md:items-center justify-between gap-5">
        <div className="space-y-2 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#ef4d23]/10 border border-[#ef4d23]/20 text-[#ef4d23] text-xs font-bold uppercase tracking-wider">
            <Sparkles className="h-3.5 w-3.5" />
            <span>Public Website Asset Studio</span>
          </div>
          <h1
            className="text-2xl sm:text-3xl font-extrabold text-neutral-900 tracking-tight"
            style={{ fontFamily: "'Instrument Serif', serif", fontStyle: "italic" }}
          >
            Site Creatives, Reels &amp; Scrolling Brands
          </h1>
          <p className="text-xs sm:text-sm text-neutral-500 leading-relaxed">
            Manage public-facing performance reels, creative ad showcases, and the scrolling partner brands strip shown on the Lumen &amp; Co website.
          </p>

          {/* Stat Pills */}
          <div className="flex flex-wrap items-center gap-2 pt-1">
            <span className="px-3 py-1 rounded-full bg-neutral-100 border border-neutral-200 text-xs font-semibold text-neutral-700 flex items-center gap-1.5">
              <Film className="h-3.5 w-3.5 text-[#ef4d23]" />
              <span>{reels.length} Vertical Reels</span>
            </span>
            <span className="px-3 py-1 rounded-full bg-neutral-100 border border-neutral-200 text-xs font-semibold text-neutral-700 flex items-center gap-1.5">
              <ImageIcon className="h-3.5 w-3.5 text-blue-600" />
              <span>{creatives.length} Visual Creatives</span>
            </span>
            <span className="px-3 py-1 rounded-full bg-neutral-100 border border-neutral-200 text-xs font-semibold text-neutral-700 flex items-center gap-1.5">
              <Building2 className="h-3.5 w-3.5 text-purple-600" />
              <span>{brands.length} Scrolling Brands</span>
            </span>
            <span className="px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-xs font-semibold text-emerald-700 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>Live on Website</span>
            </span>
          </div>
        </div>

        {/* Quick Action Buttons */}
        <div className="flex flex-wrap items-center gap-2.5 shrink-0">
          <a
            href="/"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-white hover:bg-neutral-50 border border-neutral-300 text-neutral-700 text-xs font-bold shadow-xs hover:shadow transition-all cursor-pointer"
          >
            <ExternalLink className="h-3.5 w-3.5 text-neutral-500" />
            <span>View Live Site</span>
          </a>

          {items.length === 0 && (
            <button
              type="button"
              onClick={handleSeedDefaults}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-orange-50 hover:bg-orange-100 border border-orange-200 text-[#ef4d23] text-xs font-bold shadow-xs transition-all cursor-pointer"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              <span>Load Default Assets</span>
            </button>
          )}

          <button
            type="button"
            onClick={() =>
              handleOpenCreate(
                activeTab === "brands"
                  ? "brand"
                  : activeTab === "creatives"
                  ? "creative"
                  : "reel"
              )
            }
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-[#ef4d23] hover:bg-[#d93c14] text-white text-xs font-bold shadow-md shadow-[#ef4d23]/25 transition-all cursor-pointer"
          >
            <Plus className="h-4 w-4" />
            <span>
              Add{" "}
              {activeTab === "brands"
                ? "Brand"
                : activeTab === "creatives"
                ? "Creative"
                : "Video Reel"}
            </span>
          </button>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 2. TAB CONTROLS & FILTER BAR */}
      {/* ========================================================================= */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-white/70 backdrop-blur-xl p-2.5 rounded-2xl border border-neutral-200/80 shadow-xs">
        {/* Navigation Tabs */}
        <div className="flex items-center gap-1 bg-neutral-100/80 p-1 rounded-xl overflow-x-auto">
          <button
            type="button"
            onClick={() => setActiveTab("reels")}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-2 cursor-pointer shrink-0 ${
              activeTab === "reels"
                ? "bg-white text-neutral-900 shadow-xs"
                : "text-neutral-500 hover:text-neutral-900"
            }`}
          >
            <Film className="h-3.5 w-3.5 text-[#ef4d23]" />
            <span>Vertical Video Reels</span>
            <span className="px-1.5 py-0.2 rounded-full bg-neutral-200 text-neutral-700 text-[10px]">
              {reels.length}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("creatives")}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-2 cursor-pointer shrink-0 ${
              activeTab === "creatives"
                ? "bg-white text-neutral-900 shadow-xs"
                : "text-neutral-500 hover:text-neutral-900"
            }`}
          >
            <ImageIcon className="h-3.5 w-3.5 text-blue-600" />
            <span>Brand Creatives</span>
            <span className="px-1.5 py-0.2 rounded-full bg-neutral-200 text-neutral-700 text-[10px]">
              {creatives.length}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("brands")}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-2 cursor-pointer shrink-0 ${
              activeTab === "brands"
                ? "bg-white text-neutral-900 shadow-xs"
                : "text-neutral-500 hover:text-neutral-900"
            }`}
          >
            <Building2 className="h-3.5 w-3.5 text-purple-600" />
            <span>Scrolling Partner Brands</span>
            <span className="px-1.5 py-0.2 rounded-full bg-neutral-200 text-neutral-700 text-[10px]">
              {brands.length}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("preview")}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-2 cursor-pointer shrink-0 ${
              activeTab === "preview"
                ? "bg-white text-neutral-900 shadow-xs"
                : "text-neutral-500 hover:text-neutral-900"
            }`}
          >
            <Eye className="h-3.5 w-3.5 text-emerald-600" />
            <span>Live Site Simulation</span>
          </button>
        </div>

        {/* Search Input & Reset Seed Option */}
        {activeTab !== "preview" && (
          <div className="flex items-center gap-2">
            <div className="relative flex-1 sm:w-64">
              <Search className="h-3.5 w-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
              <input
                type="text"
                placeholder={`Search ${activeTab}...`}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-8 pr-3 py-1.5 bg-white text-xs text-neutral-900 placeholder:text-neutral-400 rounded-xl outline-none border border-neutral-200 focus:border-[#ef4d23] transition-all"
              />
            </div>
            {items.length > 0 && (
              <button
                type="button"
                onClick={handleSeedDefaults}
                className="p-2 text-neutral-400 hover:text-neutral-700 hover:bg-neutral-100 rounded-xl transition-colors cursor-pointer"
                title="Restore Default Built-in Assets"
              >
                <RotateCcw className="h-4 w-4" />
              </button>
            )}
          </div>
        )}
      </div>

      {/* ========================================================================= */}
      {/* 3. MAIN CONTENT: REELS GRID */}
      {/* ========================================================================= */}
      {activeTab === "reels" && (
        <div className="space-y-4">
          {loading ? (
            <div className="bg-white/90 rounded-3xl p-12 text-center text-neutral-400 flex flex-col items-center justify-center gap-2">
              <Loader2 className="h-6 w-6 animate-spin text-[#ef4d23]" />
              <p className="text-xs font-semibold">Loading video reels from database…</p>
            </div>
          ) : filteredList.length === 0 ? (
            <div className="bg-white/90 rounded-3xl p-12 text-center space-y-3 border border-neutral-200/80">
              <Film className="h-10 w-10 text-neutral-300 mx-auto" />
              <h3 className="text-base font-bold text-neutral-800">No Video Reels Found</h3>
              <p className="text-xs text-neutral-500 max-w-sm mx-auto">
                No vertical video reels matching your search. Add a new reel or load the agency default assets.
              </p>
              <div className="pt-2 flex justify-center gap-2">
                <button
                  type="button"
                  onClick={handleSeedDefaults}
                  className="px-4 py-2 bg-orange-50 text-[#ef4d23] border border-orange-200 rounded-2xl text-xs font-bold hover:bg-orange-100 transition-all cursor-pointer"
                >
                  Load Default Built-In Reels
                </button>
                <button
                  type="button"
                  onClick={() => handleOpenCreate("reel")}
                  className="px-4 py-2 bg-[#ef4d23] text-white rounded-2xl text-xs font-bold hover:bg-[#d93c14] transition-all cursor-pointer"
                >
                  + Add New Reel
                </button>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {filteredList.map((item, index) => {
                const isPlaying = playingVideoId === item.id;
                const mediaUrl = resolvedUrls[item.id] || item.src;

                return (
                  <div
                    key={item.id}
                    className="bg-white/95 rounded-3xl overflow-hidden border border-neutral-200/90 shadow-sm hover:shadow-md transition-all flex flex-col group"
                  >
                    {/* 9:16 Video Player Container */}
                    <div className="relative aspect-[9/16] bg-neutral-900 overflow-hidden">
                      <video
                        src={mediaUrl}
                        poster={item.poster || DEFAULT_POSTER}
                        muted={isMuted}
                        loop
                        playsInline
                        ref={(el) => {
                          if (el) {
                            if (isPlaying) el.play().catch(() => {});
                            else el.pause();
                          }
                        }}
                        className="w-full h-full object-cover"
                      />

                      {/* Top Overlay Bar */}
                      <div className="absolute top-3 left-3 right-3 flex items-center justify-between z-10">
                        <span className="px-2.5 py-0.5 rounded-full bg-black/60 backdrop-blur-md text-white text-[10px] font-mono font-bold">
                          #{item.sort_order}
                        </span>

                        <div className="flex items-center gap-1.5">
                          <button
                            type="button"
                            onClick={() => setIsMuted(!isMuted)}
                            className="w-7 h-7 rounded-full bg-black/60 backdrop-blur-md text-white flex items-center justify-center hover:bg-black/80 transition-colors cursor-pointer"
                            title={isMuted ? "Unmute" : "Mute"}
                          >
                            {isMuted ? <VolumeX className="h-3.5 w-3.5" /> : <Volume2 className="h-3.5 w-3.5" />}
                          </button>

                          <button
                            type="button"
                            onClick={() => setPlayingVideoId(isPlaying ? null : item.id)}
                            className="w-7 h-7 rounded-full bg-[#ef4d23] text-white flex items-center justify-center hover:scale-105 transition-transform cursor-pointer shadow-md"
                            title={isPlaying ? "Pause Preview" : "Play Preview"}
                          >
                            {isPlaying ? <Pause className="h-3.5 w-3.5 fill-white" /> : <Play className="h-3.5 w-3.5 fill-white ml-0.5" />}
                          </button>
                        </div>
                      </div>

                      {/* Bottom Gradient with Title */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent pointer-events-none" />
                      <div className="absolute bottom-3 left-3 right-3 text-white pointer-events-none">
                        <h4 className="text-xs font-bold leading-tight">{item.title}</h4>
                        {item.subtitle && (
                          <p className="text-[11px] text-white/80 font-medium mt-0.5">{item.subtitle}</p>
                        )}
                      </div>
                    </div>

                    {/* Metadata & Controls Footer */}
                    <div className="p-3.5 bg-white border-t border-neutral-100 flex items-center justify-between gap-2">
                      <div className="flex items-center gap-1">
                        <button
                          type="button"
                          onClick={() => handleMoveOrder(index, "up")}
                          disabled={index === 0}
                          className="p-1 text-neutral-400 hover:text-neutral-800 disabled:opacity-30 hover:bg-neutral-100 rounded-lg cursor-pointer"
                          title="Move Earlier"
                        >
                          <ArrowUp className="h-3.5 w-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleMoveOrder(index, "down")}
                          disabled={index === filteredList.length - 1}
                          className="p-1 text-neutral-400 hover:text-neutral-800 disabled:opacity-30 hover:bg-neutral-100 rounded-lg cursor-pointer"
                          title="Move Later"
                        >
                          <ArrowDown className="h-3.5 w-3.5" />
                        </button>
                      </div>

                      <div className="flex items-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => handleOpenEdit(item)}
                          className="px-2.5 py-1 text-xs font-bold text-neutral-700 hover:text-neutral-900 bg-neutral-100 hover:bg-neutral-200 rounded-xl transition-colors cursor-pointer flex items-center gap-1"
                        >
                          <Edit3 className="h-3 w-3" />
                          <span>Edit</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => handleDeleteItem(item)}
                          className="p-1 text-neutral-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-colors cursor-pointer"
                          title="Remove Reel"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* ========================================================================= */}
      {/* 4. MAIN CONTENT: BRAND CREATIVES GRID */}
      {/* ========================================================================= */}
      {activeTab === "creatives" && (
        <div className="space-y-4">
          {loading ? (
            <div className="bg-white/90 rounded-3xl p-12 text-center text-neutral-400 flex flex-col items-center justify-center gap-2">
              <Loader2 className="h-6 w-6 animate-spin text-[#ef4d23]" />
              <p className="text-xs font-semibold">Loading creatives from database…</p>
            </div>
          ) : filteredList.length === 0 ? (
            <div className="bg-white/90 rounded-3xl p-12 text-center space-y-3 border border-neutral-200/80">
              <ImageIcon className="h-10 w-10 text-neutral-300 mx-auto" />
              <h3 className="text-base font-bold text-neutral-800">No Creatives Found</h3>
              <p className="text-xs text-neutral-500 max-w-sm mx-auto">
                No visual creatives matching your search. Add banner ads, high-ROAS creative images, or load defaults.
              </p>
              <div className="pt-2 flex justify-center gap-2">
                <button
                  type="button"
                  onClick={handleSeedDefaults}
                  className="px-4 py-2 bg-orange-50 text-[#ef4d23] border border-orange-200 rounded-2xl text-xs font-bold hover:bg-orange-100 transition-all cursor-pointer"
                >
                  Load Default Creatives
                </button>
                <button
                  type="button"
                  onClick={() => handleOpenCreate("creative")}
                  className="px-4 py-2 bg-[#ef4d23] text-white rounded-2xl text-xs font-bold hover:bg-[#d93c14] transition-all cursor-pointer"
                >
                  + Add New Creative
                </button>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {filteredList.map((item, index) => {
                const mediaUrl = resolvedUrls[item.id] || item.src;

                return (
                  <div
                    key={item.id}
                    className="bg-white/95 rounded-3xl overflow-hidden border border-neutral-200/90 shadow-sm hover:shadow-md transition-all flex flex-col group"
                  >
                    <div className="relative aspect-[4/5] bg-neutral-100 overflow-hidden">
                      <img
                        src={mediaUrl}
                        alt={item.title}
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                      <div className="absolute top-2.5 left-2.5 z-10">
                        <span className="px-2 py-0.5 rounded-full bg-black/60 backdrop-blur-md text-white text-[10px] font-mono font-bold">
                          #{item.sort_order}
                        </span>
                      </div>
                      <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-transparent to-transparent pointer-events-none" />
                      <div className="absolute bottom-2.5 left-2.5 right-2.5 text-white pointer-events-none">
                        <h4 className="text-xs font-bold truncate">{item.title}</h4>
                        {item.subtitle && (
                          <p className="text-[10px] text-white/80 truncate">{item.subtitle}</p>
                        )}
                      </div>
                    </div>

                    <div className="p-3 bg-white border-t border-neutral-100 flex items-center justify-between gap-1">
                      <div className="flex items-center gap-0.5">
                        <button
                          type="button"
                          onClick={() => handleMoveOrder(index, "up")}
                          disabled={index === 0}
                          className="p-1 text-neutral-400 hover:text-neutral-800 disabled:opacity-30 hover:bg-neutral-100 rounded-lg cursor-pointer"
                          title="Move Earlier"
                        >
                          <ArrowUp className="h-3 w-3" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleMoveOrder(index, "down")}
                          disabled={index === filteredList.length - 1}
                          className="p-1 text-neutral-400 hover:text-neutral-800 disabled:opacity-30 hover:bg-neutral-100 rounded-lg cursor-pointer"
                          title="Move Later"
                        >
                          <ArrowDown className="h-3 w-3" />
                        </button>
                      </div>

                      <div className="flex items-center gap-1">
                        <button
                          type="button"
                          onClick={() => handleOpenEdit(item)}
                          className="p-1.5 text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100 rounded-lg transition-colors cursor-pointer"
                          title="Edit"
                        >
                          <Edit3 className="h-3.5 w-3.5" />
                        </button>

                        <button
                          type="button"
                          onClick={() => handleDeleteItem(item)}
                          className="p-1.5 text-neutral-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                          title="Delete"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* ========================================================================= */}
      {/* 5. MAIN CONTENT: SCROLLING PARTNER BRANDS */}
      {/* ========================================================================= */}
      {activeTab === "brands" && (
        <div className="space-y-6">
          {/* Live Marquee Preview Box */}
          <div className="bg-neutral-900 text-white rounded-3xl p-5 border border-white/10 shadow-lg space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                Live Marquee Ticker Preview ("Trusted by growth teams at")
              </span>
              <span className="text-[11px] text-[#ef4d23] font-bold">
                {brands.length} Brands In Rotation
              </span>
            </div>

            <div className="relative marquee-mask overflow-hidden py-3 bg-white/5 rounded-2xl border border-white/10">
              <div className="flex w-max animate-marquee items-center gap-10 sm:gap-14 px-4">
                {(brands.length > 0 ? [...brands, ...brands] : DEFAULT_BRAND_NAMES.map((n, i) => ({ id: `p-${i}`, title: n, src: "", subtitle: "", sort_order: i * 10, kind: "brand" as const, poster: "" }))).map((b, i) => (
                  <div key={`${b.id || b.title}-${i}`} className="shrink-0 flex items-center gap-2.5">
                    {b.src ? (
                      <img
                        src={b.src}
                        alt={b.title}
                        className="h-6 w-auto max-w-[120px] object-contain opacity-75"
                      />
                    ) : null}
                    <span
                      className="text-neutral-300 font-bold tracking-tight text-lg"
                      style={{ letterSpacing: "-0.02em" }}
                    >
                      {b.title}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Brands Management Cards */}
          {loading ? (
            <div className="bg-white/90 rounded-3xl p-12 text-center text-neutral-400 flex flex-col items-center justify-center gap-2">
              <Loader2 className="h-6 w-6 animate-spin text-[#ef4d23]" />
              <p className="text-xs font-semibold">Loading partner brands from database…</p>
            </div>
          ) : filteredList.length === 0 ? (
            <div className="bg-white/90 rounded-3xl p-12 text-center space-y-3 border border-neutral-200/80">
              <Building2 className="h-10 w-10 text-neutral-300 mx-auto" />
              <h3 className="text-base font-bold text-neutral-800">No Brands Configured In Database</h3>
              <p className="text-xs text-neutral-500 max-w-sm mx-auto">
                The public website is currently using the 9 default built-in brands. Click below to load them into the database so you can edit, add, or replace them.
              </p>
              <div className="pt-2 flex justify-center gap-2">
                <button
                  type="button"
                  onClick={handleSeedDefaults}
                  className="px-4 py-2 bg-orange-50 text-[#ef4d23] border border-orange-200 rounded-2xl text-xs font-bold hover:bg-orange-100 transition-all cursor-pointer"
                >
                  Load 9 Default Partner Brands
                </button>
                <button
                  type="button"
                  onClick={() => handleOpenCreate("brand")}
                  className="px-4 py-2 bg-[#ef4d23] text-white rounded-2xl text-xs font-bold hover:bg-[#d93c14] transition-all cursor-pointer"
                >
                  + Add Partner Brand
                </button>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {filteredList.map((item, index) => (
                <div
                  key={item.id}
                  className="bg-white/95 rounded-3xl p-4 border border-neutral-200/90 shadow-sm hover:shadow-md transition-all flex flex-col justify-between gap-4 group"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="px-2.5 py-0.5 rounded-full bg-neutral-100 border border-neutral-200 text-neutral-600 text-[10px] font-mono font-bold">
                        #{item.sort_order}
                      </span>
                      {item.subtitle && (
                        <span className="px-2 py-0.5 rounded-full bg-purple-50 text-purple-700 border border-purple-200 text-[10px] font-semibold">
                          {item.subtitle}
                        </span>
                      )}
                    </div>

                    {/* Brand Display Visual */}
                    <div className="h-14 bg-neutral-50 rounded-2xl border border-neutral-200/70 flex items-center justify-center p-3">
                      {item.src ? (
                        <img
                          src={item.src}
                          alt={item.title}
                          className="max-h-full max-w-full object-contain"
                        />
                      ) : (
                        <span className="text-neutral-800 font-extrabold text-base tracking-tight truncate">
                          {item.title}
                        </span>
                      )}
                    </div>

                    <div>
                      <h4 className="text-sm font-bold text-neutral-900 truncate">{item.title}</h4>
                      <p className="text-[11px] text-neutral-500">
                        {item.src ? "Logo image uploaded" : "Text brand display"}
                      </p>
                    </div>
                  </div>

                  {/* Actions Footer */}
                  <div className="pt-2 border-t border-neutral-100 flex items-center justify-between gap-1">
                    <div className="flex items-center gap-0.5">
                      <button
                        type="button"
                        onClick={() => handleMoveOrder(index, "up")}
                        disabled={index === 0}
                        className="p-1 text-neutral-400 hover:text-neutral-800 disabled:opacity-30 hover:bg-neutral-100 rounded-lg cursor-pointer"
                        title="Move Earlier in Marquee"
                      >
                        <ArrowUp className="h-3.5 w-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleMoveOrder(index, "down")}
                        disabled={index === filteredList.length - 1}
                        className="p-1 text-neutral-400 hover:text-neutral-800 disabled:opacity-30 hover:bg-neutral-100 rounded-lg cursor-pointer"
                        title="Move Later in Marquee"
                      >
                        <ArrowDown className="h-3.5 w-3.5" />
                      </button>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={() => handleOpenEdit(item)}
                        className="px-2.5 py-1 text-xs font-bold text-neutral-700 hover:text-neutral-900 bg-neutral-100 hover:bg-neutral-200 rounded-xl transition-colors cursor-pointer flex items-center gap-1"
                      >
                        <Edit3 className="h-3 w-3" />
                        <span>Edit</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDeleteItem(item)}
                        className="p-1.5 text-neutral-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-colors cursor-pointer"
                        title="Delete Brand"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ========================================================================= */}
      {/* 6. LIVE SITE PREVIEW SIMULATION TAB */}
      {/* ========================================================================= */}
      {activeTab === "preview" && (
        <div className="bg-[#0c0d12] text-white rounded-3xl p-6 sm:p-8 space-y-8 border border-white/10 shadow-2xl">
          <div className="border-b border-white/10 pb-4 flex items-center justify-between">
            <div>
              <span className="text-[11px] font-bold text-[#ef4d23] uppercase tracking-wider block mb-1">
                Live Simulation
              </span>
              <h3 className="text-xl font-bold text-white">How Clients Experience It On The Website</h3>
            </div>
            <a
              href="/"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white text-xs font-semibold border border-white/20 transition-all"
            >
              <ExternalLink className="h-3.5 w-3.5" />
              <span>Open lumenandco.in</span>
            </a>
          </div>

          {/* Scrolling Brand Logos Marquee */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-400">
              Trusted By Growth Teams At (Live Marquee):
            </h4>
            <div className="relative marquee-mask overflow-hidden py-4 bg-white/5 rounded-2xl border border-white/10">
              <div className="flex w-max animate-marquee items-center gap-10 sm:gap-14 px-4">
                {(brands.length > 0 ? [...brands, ...brands] : DEFAULT_BRAND_NAMES.map((n, i) => ({ id: `p-${i}`, title: n, src: "", subtitle: "", sort_order: i * 10, kind: "brand" as const, poster: "" }))).map((b, i) => (
                  <div key={`${b.id || b.title}-${i}`} className="shrink-0 flex items-center gap-2.5">
                    {b.src ? (
                      <img
                        src={b.src}
                        alt={b.title}
                        className="h-6 w-auto max-w-[120px] object-contain opacity-75"
                      />
                    ) : null}
                    <span
                      className="text-neutral-300 font-bold tracking-tight text-lg"
                      style={{ letterSpacing: "-0.02em" }}
                    >
                      {b.title}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Vertical Video Carousel Strip */}
          <div className="space-y-3 pt-4 border-t border-white/10">
            <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-400">
              Vertical Reel Carousel ("Results we can prove"):
            </h4>
            <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-thin">
              {reels.map((item) => (
                <div key={item.id} className="shrink-0 w-[160px] sm:w-[190px]">
                  <div className="relative aspect-[9/16] rounded-2xl overflow-hidden bg-neutral-900 border border-white/10 shadow-lg">
                    <video
                      src={resolvedUrls[item.id] || item.src}
                      poster={item.poster || DEFAULT_POSTER}
                      muted
                      loop
                      autoPlay
                      playsInline
                      className="absolute inset-0 w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                    <div className="absolute bottom-3 left-3 right-3 text-white">
                      <p className="font-semibold text-xs leading-snug">{item.title}</p>
                      {item.subtitle && <p className="text-[11px] text-white/70">{item.subtitle}</p>}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Creatives Image Strip */}
          <div className="space-y-3 pt-4 border-t border-white/10">
            <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-400">
              Brand Creative Showcase Strip:
            </h4>
            <div className="flex gap-3 overflow-x-auto pb-4 scrollbar-thin">
              {creatives.map((item) => (
                <div key={item.id} className="shrink-0 w-[140px] sm:w-[170px]">
                  <div className="relative aspect-[4/5] rounded-2xl overflow-hidden bg-neutral-800 border border-white/10 shadow-md">
                    <img
                      src={resolvedUrls[item.id] || item.src}
                      alt={item.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
                    <div className="absolute bottom-2 left-2 right-2 text-white text-[11px] font-medium truncate">
                      {item.title}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 7. ADD / EDIT MEDIA MODAL */}
      {/* ========================================================================= */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto animate-in fade-in">
          <div className="bg-white border border-neutral-200/90 rounded-3xl max-w-2xl w-full p-6 sm:p-7 shadow-2xl text-neutral-900 space-y-6 relative isolate">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-neutral-200/80 pb-4">
              <div className="flex items-center gap-2.5">
                <div className="p-2 bg-[#ef4d23]/10 text-[#ef4d23] rounded-xl border border-[#ef4d23]/20">
                  {formKind === "reel" ? (
                    <Film className="h-5 w-5" />
                  ) : formKind === "creative" ? (
                    <ImageIcon className="h-5 w-5" />
                  ) : (
                    <Building2 className="h-5 w-5" />
                  )}
                </div>
                <div>
                  <h3 className="text-base font-bold text-neutral-900">
                    {editingItem
                      ? `Edit ${formKind === "reel" ? "Reel" : formKind === "creative" ? "Creative" : "Partner Brand"}`
                      : `Add New ${formKind === "reel" ? "Vertical Reel" : formKind === "creative" ? "Creative" : "Partner Brand"}`}
                  </h3>
                  <p className="text-xs text-neutral-500">
                    Will appear live on the public website.
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 text-neutral-400 hover:text-neutral-700 hover:bg-neutral-100 rounded-full transition-colors cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Form & Live Preview Split */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
              {/* Left Column: Form Fields */}
              <div className="space-y-4 text-xs">
                {/* Kind Picker */}
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-neutral-500 uppercase tracking-wider block">
                    Asset Kind
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    <button
                      type="button"
                      onClick={() => setFormKind("reel")}
                      className={`p-2 rounded-xl border text-center font-bold transition-all cursor-pointer flex flex-col items-center justify-center gap-1 ${
                        formKind === "reel"
                          ? "bg-orange-50 border-[#ef4d23] text-[#ef4d23]"
                          : "bg-neutral-50 border-neutral-200 text-neutral-700 hover:bg-neutral-100"
                      }`}
                    >
                      <Film className="h-4 w-4" />
                      <span className="text-[11px]">9:16 Reel</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setFormKind("creative")}
                      className={`p-2 rounded-xl border text-center font-bold transition-all cursor-pointer flex flex-col items-center justify-center gap-1 ${
                        formKind === "creative"
                          ? "bg-orange-50 border-[#ef4d23] text-[#ef4d23]"
                          : "bg-neutral-50 border-neutral-200 text-neutral-700 hover:bg-neutral-100"
                      }`}
                    >
                      <ImageIcon className="h-4 w-4" />
                      <span className="text-[11px]">Creative</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setFormKind("brand")}
                      className={`p-2 rounded-xl border text-center font-bold transition-all cursor-pointer flex flex-col items-center justify-center gap-1 ${
                        formKind === "brand"
                          ? "bg-orange-50 border-[#ef4d23] text-[#ef4d23]"
                          : "bg-neutral-50 border-neutral-200 text-neutral-700 hover:bg-neutral-100"
                      }`}
                    >
                      <Building2 className="h-4 w-4" />
                      <span className="text-[11px]">Brand Logo</span>
                    </button>
                  </div>
                </div>

                {/* Title / Name */}
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-neutral-500 uppercase tracking-wider block">
                    {formKind === "brand" ? "Brand Name *" : "Title / Caption *"}
                  </label>
                  <input
                    type="text"
                    value={formTitle}
                    onChange={(e) => setFormTitle(e.target.value)}
                    placeholder={
                      formKind === "brand"
                        ? "e.g. Northbeam, Oakridge International"
                        : formKind === "reel"
                        ? "e.g. Paid Social Reel"
                        : "e.g. Meta ROAS Campaign"
                    }
                    className="w-full px-3.5 py-2 rounded-xl border border-neutral-300 focus:border-[#ef4d23] outline-none text-xs text-neutral-900 bg-white"
                  />
                </div>

                {/* Subtitle / Category */}
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-neutral-500 uppercase tracking-wider block">
                    {formKind === "brand"
                      ? "Industry / Category Tag (optional)"
                      : "Subtitle / Metric (e.g. 1.2M views • 4.8x ROAS)"}
                  </label>
                  <input
                    type="text"
                    value={formSubtitle}
                    onChange={(e) => setFormSubtitle(e.target.value)}
                    placeholder={
                      formKind === "brand"
                        ? "e.g. School Partner, E-commerce, SaaS"
                        : "e.g. 1.2M views • 4.8x ROAS"
                    }
                    className="w-full px-3.5 py-2 rounded-xl border border-neutral-300 focus:border-[#ef4d23] outline-none text-xs text-neutral-900 bg-white"
                  />
                </div>

                {/* Direct File Upload */}
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-neutral-500 uppercase tracking-wider block">
                    Upload {formKind === "reel" ? "Video File (.mp4)" : formKind === "brand" ? "Brand Logo Image (optional)" : "Creative Image"}
                  </label>
                  <label className="border-2 border-dashed border-neutral-300 hover:border-[#ef4d23] bg-neutral-50/80 hover:bg-orange-50/50 rounded-2xl p-4 flex flex-col items-center justify-center gap-1.5 cursor-pointer transition-all">
                    <Upload className="h-5 w-5 text-neutral-400" />
                    <span className="text-xs font-semibold text-neutral-700">
                      {isUploading ? "Uploading to Cloud Storage…" : "Click or drag to upload media"}
                    </span>
                    <span className="text-[10px] text-neutral-400">
                      {formKind === "reel" ? "MP4, WebM up to 50MB" : "PNG, SVG, JPG up to 10MB"}
                    </span>
                    <input
                      type="file"
                      accept={formKind === "reel" ? "video/*" : "image/*"}
                      onChange={handleFileUpload}
                      className="hidden"
                      disabled={isUploading}
                    />
                  </label>
                  {uploadProgress !== null && (
                    <div className="w-full bg-neutral-100 rounded-full h-1.5 overflow-hidden">
                      <div className="bg-[#ef4d23] h-full transition-all duration-300" style={{ width: `${uploadProgress}%` }} />
                    </div>
                  )}
                </div>

                {/* Direct Link Input */}
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-neutral-500 uppercase tracking-wider block">
                    {formKind === "brand" ? "Or Direct Logo Image URL (optional)" : "Or Direct URL Link"}
                  </label>
                  <input
                    type="text"
                    value={formSrc}
                    onChange={(e) => setFormSrc(e.target.value)}
                    placeholder={
                      formKind === "reel"
                        ? "https://.../video.mp4"
                        : "https://.../logo.png"
                    }
                    className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-300 focus:border-[#ef4d23] focus:ring-2 focus:ring-[#ef4d23]/20 outline-none text-xs text-neutral-900 bg-white"
                  />
                </div>

                {/* Poster / Thumbnail URL for Reels */}
                {formKind === "reel" && (
                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-neutral-500 uppercase tracking-wider block">
                      Custom Video Poster / Cover Image URL (optional)
                    </label>
                    <input
                      type="text"
                      value={formPoster}
                      onChange={(e) => setFormPoster(e.target.value)}
                      placeholder="https://.../cover.jpg"
                      className="w-full px-3.5 py-2 rounded-xl border border-neutral-300 focus:border-[#ef4d23] outline-none text-xs text-neutral-900 bg-white"
                    />
                  </div>
                )}

                {/* Sort Order */}
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-neutral-500 uppercase tracking-wider block">
                    Display Sort Order (Lower numbers appear earlier)
                  </label>
                  <input
                    type="number"
                    value={formSortOrder}
                    onChange={(e) => setFormSortOrder(Number(e.target.value) || 0)}
                    className="w-full px-3.5 py-2 rounded-xl border border-neutral-300 focus:border-[#ef4d23] outline-none text-xs text-neutral-900 bg-white"
                  />
                </div>
              </div>

              {/* Right Column: Live Card Preview */}
              <div className="space-y-2">
                <span className="text-[11px] font-bold text-neutral-500 uppercase tracking-wider block text-center">
                  Live Preview
                </span>

                <div className="mx-auto max-w-[220px] rounded-3xl overflow-hidden border border-neutral-200/90 shadow-lg bg-neutral-900 relative">
                  {formKind === "reel" ? (
                    <div className="relative aspect-[9/16] bg-neutral-900">
                      {formSrc ? (
                        <video
                          src={formSrc}
                          poster={formPoster || DEFAULT_POSTER}
                          muted
                          loop
                          autoPlay
                          playsInline
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex flex-col items-center justify-center p-4 text-center text-neutral-500">
                          <Film className="h-8 w-8 mb-2 opacity-40 text-white" />
                          <p className="text-[10px]">Upload a video or paste a link</p>
                        </div>
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent pointer-events-none" />
                      <div className="absolute bottom-3 left-3 right-3 text-white pointer-events-none">
                        <p className="font-bold text-xs leading-snug">{formTitle || "Reel Title"}</p>
                        <p className="text-[10px] text-white/70">{formSubtitle || "Metric subtitle"}</p>
                      </div>
                    </div>
                  ) : formKind === "creative" ? (
                    <div className="relative aspect-[4/5] bg-neutral-100">
                      {formSrc ? (
                        <img src={formSrc} alt="" className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex flex-col items-center justify-center p-4 text-center text-neutral-400">
                          <ImageIcon className="h-8 w-8 mb-2 opacity-40" />
                          <p className="text-[10px]">Add an image link to see preview</p>
                        </div>
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent pointer-events-none" />
                      <div className="absolute bottom-2.5 left-2.5 right-2.5 text-white pointer-events-none">
                        <p className="font-bold text-xs truncate">{formTitle || "Creative Title"}</p>
                        <p className="text-[10px] text-white/70 truncate">{formSubtitle || "Ad Tag"}</p>
                      </div>
                    </div>
                  ) : (
                    /* Brand Preview */
                    <div className="p-6 bg-white text-center space-y-3">
                      <span className="text-[10px] uppercase font-bold text-neutral-400 tracking-wider">
                        Marquee Display
                      </span>
                      <div className="h-16 rounded-2xl bg-neutral-50 border border-neutral-200 flex items-center justify-center p-3">
                        {formSrc ? (
                          <img src={formSrc} alt="" className="max-h-full max-w-full object-contain" />
                        ) : (
                          <span className="text-neutral-800 font-extrabold text-lg tracking-tight">
                            {formTitle || "Brand Name"}
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-neutral-500">
                        {formSubtitle || "Trusted Partner"}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Footer Buttons */}
            <div className="border-t border-neutral-200/80 pt-4 flex items-center justify-end gap-2.5">
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2.5 rounded-2xl bg-neutral-100 hover:bg-neutral-200 text-neutral-700 text-xs font-bold transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSaveItem}
                disabled={isSaving || isUploading}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-[#ef4d23] hover:bg-[#d93c14] text-white text-xs font-bold shadow-md shadow-[#ef4d23]/25 transition-all cursor-pointer disabled:opacity-50"
              >
                {isSaving ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Save className="h-3.5 w-3.5" />}
                <span>{editingItem ? "Save Changes" : "Publish to Site"}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
