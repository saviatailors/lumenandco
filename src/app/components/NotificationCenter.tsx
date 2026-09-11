import { useState, useEffect, useCallback } from "react";
import {
  Bell,
  CheckCircle2,
  AlertTriangle,
  MessageSquare,
  UserPlus,
  X,
  Check,
  Radio,
  Sparkles,
} from "lucide-react";

import { NotificationItem } from "@/lib/delivery.functions";
import { supabase } from "@/lib/supabase-client";

export const INITIAL_NOTIFICATIONS: NotificationItem[] = [
  {
    id: "notif-1",
    staff_id: "staff-3",
    type: "revision",
    title: "Client Revision Requested",
    body: "Mark (Northbeam Founder) requested revisions on 'Q4 Performance Video Reel & Hook Cuts'.",
    deliverable_id: "del-101",
    read: false,
    created_at: "2026-09-08T09:12:00Z",
  },
  {
    id: "notif-2",
    staff_id: "staff-3",
    type: "sla_warning",
    title: "SLA Breach Alert (Overdue)",
    body: "Deliverable 'Q4 Performance Video Reel' passed its due date on 2026-09-08.",
    deliverable_id: "del-101",
    read: false,
    created_at: "2026-09-08T10:00:00Z",
  },
  {
    id: "notif-3",
    staff_id: "staff-3",
    type: "comment",
    title: "Mentioned in Internal Comment",
    body: "Sarah Chen tagged you: '@David Miller hook timing is sharp! Sent to client for final approval.'",
    deliverable_id: "del-101",
    read: true,
    created_at: "2026-09-07T15:00:00Z",
  },
  {
    id: "notif-4",
    staff_id: "staff-3",
    type: "assigned",
    title: "New Task Assigned",
    body: "Alex Rivers assigned you to 'Gen AI UGC Ad Concepts (Set 4)'.",
    deliverable_id: "del-102",
    read: true,
    created_at: "2026-09-08T11:00:00Z",
  },
];

const STORAGE_KEY_NOTIFS = "lumen_realtime_notifications_v2";

export default function NotificationCenter({
  isOpen,
  onClose,
  onOpenChange,
  notifications: initialPropNotifications,
  onMarkRead: parentMarkRead = () => { },
  onMarkAllRead: parentMarkAllRead = () => { },
  onSelectDeliverable = () => { },
}: {
  isOpen?: boolean;
  onClose?: () => void;
  onOpenChange?: (open: boolean) => void;
  notifications?: NotificationItem[];
  onMarkRead?: (id: string) => void;
  onMarkAllRead?: () => void;
  onSelectDeliverable?: (deliverableId: string) => void;
}) {
  const [internalOpen, setInternalOpen] = useState(false);
  const [items, setItems] = useState<NotificationItem[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_NOTIFS);
      if (saved) return JSON.parse(saved);
    } catch { }
    return initialPropNotifications || INITIAL_NOTIFICATIONS;
  });

  const open = isOpen !== undefined ? isOpen : internalOpen;
  const setOpen = (val: boolean) => {
    setInternalOpen(val);
    if (onOpenChange) onOpenChange(val);
    if (!val && onClose) onClose();
  };

  // Sync to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_NOTIFS, JSON.stringify(items));
    } catch { }
  }, [items]);

  // Real-time listener for Chat events & System alerts
  useEffect(() => {
    // 1. Listen to BroadcastChannel for instant cross-tab chat & notification alerts
    let chatBc: BroadcastChannel | null = null;
    let notifBc: BroadcastChannel | null = null;

    if (typeof window !== "undefined" && "BroadcastChannel" in window) {
      chatBc = new BroadcastChannel("lumen_realtime_chat_v2");
      notifBc = new BroadcastChannel("lumen_realtime_notifs_v1");

      chatBc.onmessage = (ev) => {
        if (ev.data?.type === "NEW_MESSAGE") {
          const msg = ev.data.payload;
          const newNotif: NotificationItem = {
            id: `notif-chat-${Date.now()}`,
            staff_id: "staff-3",
            type: "comment",
            title: `💬 New Message from ${msg.sender_name}`,
            body: msg.content,
            deliverable_id: "del-101",
            read: false,
            created_at: new Date().toISOString(),
          };
          setItems((prev) => [newNotif, ...prev]);
        }
      };

      notifBc.onmessage = (ev) => {
        if (ev.data?.type === "NEW_NOTIFICATION") {
          setItems((prev) => [ev.data.payload, ...prev]);
        }
      };
    }

    // 2. Supabase Realtime channel listener
    let supabaseChannel: ReturnType<typeof supabase.channel> | null = null;
    try {
      supabaseChannel = supabase.channel("lumen_realtime_notifs");
      supabaseChannel
        .on("broadcast", { event: "new_notification" }, (payload) => {
          if (payload.payload) {
            setItems((prev) => [payload.payload, ...prev]);
          }
        })
        .subscribe();
    } catch { }

    return () => {
      if (chatBc) chatBc.close();
      if (notifBc) notifBc.close();
      if (supabaseChannel) supabase.removeChannel(supabaseChannel);
    };
  }, []);

  const handleMarkRead = (id: string) => {
    setItems((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));
    parentMarkRead(id);
  };

  const handleMarkAllRead = () => {
    setItems((prev) => prev.map((n) => ({ ...n, read: true })));
    parentMarkAllRead();
  };

  const unreadCount = items.filter((n) => !n.read).length;

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="p-2 bg-white/10 hover:bg-white/20 backdrop-blur-md rounded-full text-white border border-white/20 transition-all relative cursor-pointer group"
        aria-label="Notification center"
        title="Real-Time Notifications"
      >
        <Bell className="h-4 w-4 group-hover:scale-110 transition-transform" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-[#ef4d23] text-white text-[9px] font-extrabold px-1.5 py-0.2 rounded-full border border-white/40 shadow-md animate-pulse">
            {unreadCount}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-2 w-80 sm:w-96 bg-white/95 backdrop-blur-3xl text-slate-900 rounded-3xl shadow-2xl border border-white/90 z-50 p-4 space-y-3 animate-in fade-in slide-in-from-top-2">
          <div className="flex items-center justify-between border-b border-slate-200/80 pb-3">
            <div className="flex items-center gap-2">
              <Bell className="h-4 w-4 text-[#ef4d23]" />
              <h4 className="text-sm font-extrabold text-slate-900 flex items-center gap-1.5">
                <span>Notifications</span>
                <span className="flex items-center gap-1 text-[10px] text-emerald-700 font-extrabold bg-emerald-500/15 px-2 py-0.5 rounded-full border border-emerald-500/30">
                  <Radio className="h-2.5 w-2.5 animate-spin" /> Live Realtime
                </span>
              </h4>
            </div>

            <div className="flex items-center gap-2 text-xs">
              {unreadCount > 0 && (
                <button
                  onClick={handleMarkAllRead}
                  className="text-slate-600 hover:text-slate-900 font-bold underline text-[11px] transition-colors cursor-pointer"
                >
                  Mark all read
                </button>
              )}
              <button
                onClick={() => setOpen(false)}
                className="text-slate-500 hover:text-slate-900 p-1 rounded-full hover:bg-slate-100 transition-colors cursor-pointer"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>

          <div className="space-y-2 max-h-80 overflow-y-auto pr-1">
            {items.length === 0 ? (
              <p className="text-xs text-slate-500 font-medium text-center py-6">No notifications right now.</p>
            ) : (
              items.map((n) => (
                <div
                  key={n.id}
                  onClick={() => {
                    handleMarkRead(n.id);
                    onSelectDeliverable(n.deliverable_id);
                    setOpen(false);
                  }}
                  className={`p-3 rounded-2xl border text-xs space-y-1 cursor-pointer transition-all ${
                    !n.read
                      ? "bg-orange-50/90 border-[#ef4d23]/40 shadow-sm text-slate-900 ring-1 ring-[#ef4d23]/20"
                      : "bg-slate-50/90 border-slate-200/80 hover:bg-slate-100/90 text-slate-900"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-extrabold text-slate-900 flex items-center gap-1.5">
                      {n.type === "sla_warning" ? (
                        <AlertTriangle className="h-3.5 w-3.5 text-red-600 shrink-0" />
                      ) : n.type === "revision" ? (
                        <AlertTriangle className="h-3.5 w-3.5 text-amber-600 shrink-0" />
                      ) : n.type === "comment" ? (
                        <MessageSquare className="h-3.5 w-3.5 text-sky-600 shrink-0" />
                      ) : (
                        <UserPlus className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
                      )}
                      {n.title}
                    </span>
                    <span className="text-[10px] font-bold text-slate-500">
                      {new Date(n.created_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-600 font-semibold leading-snug">{n.body}</p>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
