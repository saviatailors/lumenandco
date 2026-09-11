import { useState, useMemo, useRef, useEffect, useCallback } from "react";
import {
  MessageSquare,
  Send,
  Paperclip,
  Search,
  Users,
  Building2,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  X,
  FileText,
  Video,
  Mic,
  Smile,
  MoreVertical,
  CheckCheck,
  Phone,
  Video as VideoIcon,
  Filter,
  Hash,
  User,
  UserPlus,
  ShieldAlert,
  ArrowLeft,
  Upload,
  Radio,
  Volume2,
  Download,
  Flame,
  ThumbsUp,
  Heart,
  Rocket,
  Lightbulb,
  QrCode,
  Tag,
  Trash2,
  MicOff,
  ChevronDown,
  Image as ImageIcon,
  Plus,
  ArrowUp,
  Trees,
  Settings as SettingsIcon,
  MoreHorizontal,
  Zap,
  Monitor,
  PhoneOff,
  VideoOff,
  LogOut,
  Lock,
  Key,
} from "lucide-react";
import {
  ChatChannel,
  ChatMessage,
  INITIAL_CHAT_CHANNELS,
  INITIAL_CHAT_MESSAGES,
  UserRoleType,
} from "@/lib/messenger.types";
import { supabase } from "@/lib/supabase-client";
import { SEED_STAFF, SEED_CLIENTS } from "@/lib/delivery.functions";

const STORAGE_KEY_CHANNELS = "lumen_chat_channels_v5";
const STORAGE_KEY_MESSAGES = "lumen_chat_messages_v5";

function playNotificationChime() {
  try {
    const AudioCtx =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!AudioCtx) return;
    const ctx = new AudioCtx();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = "sine";
    osc.frequency.setValueAtTime(587.33, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.15);

    gain.gain.setValueAtTime(0.08, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.3);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start();
    osc.stop(ctx.currentTime + 0.3);
  } catch (e) {}
}

export interface WhatsAppMessengerViewProps {
  currentUserRole?: UserRoleType;
  currentUserId?: string;
  currentUserName?: string;
  clientBrandId?: string;
  clientBrandName?: string;
  onCloseModal?: () => void;
  isEmbeddedModal?: boolean;
  targetCodeOrChannelId?: string;
}

const AI_COPILOT_CHANNEL: ChatChannel = {
  id: "channel-ai-copilot",
  code: "AI-COPILOT",
  name: "⚡ Lumen Creative AI Copilot",
  type: "direct_message",
  description: "AI Ad Writer, UGC Script Generator & ROAS Optimizer",
  unread_count: 0,
  members_count: 1,
  last_message: "⚡ Ready to scale ad creatives and write UGC scripts! Click a preset or type a prompt.",
  last_message_time: "Just now",
};

const WELCOME_AI_MESSAGE: ChatMessage = {
  id: "msg-ai-welcome",
  channel_id: "channel-ai-copilot",
  sender_id: "ai-copilot-bot",
  sender_code: "AI-COPILOT",
  sender_name: "Lumen Creative AI Copilot",
  sender_role: "ad_specialist",
  content: `👋 **Welcome to Lumen & Co Creative AI Copilot!**

I am your agency's AI strategist trained on high-converting E-commerce & Performance Marketing campaigns.

**What I can generate for you right now:**
• 🎬 **UGC Video Reel Scripts** with scene directions & voiceovers
• 🔥 **5 High-ROAS Ad Angles & Facebook Headlines**
• 📄 **Client Retainer Proposals & Scope Briefs**
• 📊 **Campaign Performance Audits & ROAS Optimization Steps**
• ⚡ **Custom Tracking Pixels & UTM Link Generators**

*Click any prompt chip below or type your request to start!*`,
  timestamp: new Date().toISOString(),
  is_read: true,
};

function generateCreativeAIResponse(userMessageContent: string): string {
  const lower = userMessageContent.toLowerCase();

  // 1. UGC / Video Reel Scripts
  if (lower.includes("script") || lower.includes("reel") || lower.includes("video") || lower.includes("ugc") || lower.includes("tiktok")) {
    return `🎬 **CREATIVE UGC VIDEO REEL SCRIPT**
**Campaign**: High-Intent Direct Response • **Target Hook Ratio**: 85%+

---

**[SCENE 1: THE 2-SECOND HOOK]**
📹 **Visual**: Creator taps screen with a shocked expression, holding up product.
🎙️ **Voiceover**: *"Stop scrolling if your agency or brand is still relying on static images in 2026!"*
💬 **On-Screen Text**: "The 1 creative test that 4.5x'd our ROAS 🔥"

---

**[SCENE 2: THE PROBLEM & DEMO]**
📹 **Visual**: Fast cut to side-by-side comparison: Boring static ad vs. interactive glass animated mockup.
🎙️ **Voiceover**: *"Most campaigns fail because they don't disrupt the feed. Lumen & Co's creative team built identity-targeted UGC angles..."*
💬 **On-Screen Text**: "3.8x Higher Click-Through-Rate (CTR)"

---

**[SCENE 3: PROOF & NUMBERS]**
📹 **Visual**: Screen capture panning across verified Meta Ads & Google Analytics dashboard.
🎙️ **Voiceover**: *"Results? Scaled monthly revenue from ₹5L to ₹42L in 60 days with a 4.8x ROAS."*
💬 **On-Screen Text**: "₹5,00,000 ➔ ₹42,00,000 Revenue Growth 📈"

---

**[SCENE 4: CALL TO ACTION]**
📹 **Visual**: Creator points down to action button.
🎙️ **Voiceover**: *"Tap the link below to get your free 30-minute creative strategy audit now!"*
💬 **On-Screen Text**: "👉 Claim Your Free Creative Audit Now"`;
  }

  // 2. Ad Angles & Facebook Copy
  if (lower.includes("angle") || lower.includes("ad") || lower.includes("facebook") || lower.includes("meta") || lower.includes("copy")) {
    return `🔥 **5 HIGH-CONVERTING CREATIVE AD ANGLES**

1️⃣ **The "Pattern Interrupt" Angle**
• **Headline**: *"Stop Buying Generic Ads Consumers Scroll Right Past."*
• **Primary Text**: "Your audience sees 5,000 ads daily. If your creative doesn't hook them in 1.5 seconds, your ad spend is wasted. Lumen & Co crafts identity-targeted angles that turn cold scrollers into high-value buyers."
• **CTA Button**: *Get Creative Audit →*

2️⃣ **The "Case Study Proof" Angle**
• **Headline**: *"How We Scaled D2C Brand Revenue From ₹5L To ₹42L in 60 Days."*
• **Primary Text**: "No fake promises. Just data-backed UGC video reels, hyper-targeted ad copy, and dynamic landing page optimization. Inspect our step-by-step breakdown."
• **CTA Button**: *Read Full Case Study 📊*

3️⃣ **The "Us vs. Them" Contrast Angle**
• **Headline**: *"Traditional Agencies vs. Lumen & Co Performance Model."*
• **Primary Text**: "Traditional agencies charge bloated retainers with zero accountability. We operate on performance metrics with live Power BI reporting and weekly creative iterations."
• **CTA Button**: *Compare Performance Models ⚡*

4️⃣ **The "Urgency & Exclusivity" Angle**
• **Headline**: *"Accepting Only 3 New Client Retainers For Q4."*
• **Primary Text**: "To maintain 4.5x+ average ROAS across our accounts, we strictly cap our active client roster. Reserve your slot before Q4 ad rates skyrocket."
• **CTA Button**: *Apply For Retainer Slot ⏳*

5️⃣ **The "Problem Solver" Angle**
• **Headline**: *"High Ad Spend But Zero Conversions? Here's The Fix."*
• **Primary Text**: "Diagnose your ad funnel in under 5 minutes. Learn why 80% of drops happen at checkout and how to fix it with automated WhatsApp recovery."
• **CTA Button**: *Fix Your Funnel Today 💡*`;
  }

  // 3. Client Proposal Brief & Retainer
  if (lower.includes("proposal") || lower.includes("client") || lower.includes("retainer") || lower.includes("brief")) {
    return `📄 **AGENCY CLIENT RETAINER PROPOSAL BRIEF**
**Account**: Growth Partnership Tier
**Prepared By**: Lumen & Co Strategy Team

---

### 🎯 Key Performance Scope & Deliverables
1. **Creative Production**: 12 High-Impact UGC Video Reels + 20 Carousel Static Assets per month.
2. **Paid Media Management**: Meta Ads, Google PPC & TikTok Ads account optimization.
3. **Conversion Funnel**: Custom Glassmorphic Landing Pages with 1-click WhatsApp checkout.
4. **Weekly Reporting**: Automated Power BI dashboard with live ROAS & CPA tracking.

---

### 💳 Retainer Terms & Pricing
• **Monthly Retainer**: ₹1,50,000 / month
• **Performance Bonus**: 5% of Net Revenue generated above ₹25,000,000 threshold.
• **Contract Terms**: 6-Month Commitment (Grace period: 15 days).

---

✅ *Proposal ready for digital signature and deployment.*`;
  }

  // 4. ROAS / Analytics Audit
  if (lower.includes("roas") || lower.includes("analytics") || lower.includes("audit") || lower.includes("cpa") || lower.includes("performance")) {
    return `📊 **LIVE CAMPAIGN PERFORMANCE & ROAS AUDIT**
**Data Source**: Meta Ads & Google Analytics 4 (Live Sync)

---

| Metric | Last 7 Days | Previous Period | Growth |
| :--- | :--- | :--- | :--- |
| **Total Ad Spend** | ₹3,45,000 | ₹2,80,000 | +23.2% 📈 |
| **Gross Ad Revenue** | ₹16,56,000 | ₹11,20,000 | +47.8% 🚀 |
| **Blended ROAS** | **4.80x** | **4.00x** | **+20.0%** ✨ |
| **Cost Per Lead (CPL)**| ₹185.40 | ₹240.10 | -22.7% 🎉 |
| **Click-Through Rate** | 3.42% | 2.10% | +62.8% 🔥 |

---

### 💡 Strategic Action Plan:
1. **Scale Angle #2 Budget** by 35% — currently driving 5.4x ROAS on Meta.
2. **Retarget Checkout Abandoners** via WhatsApp Cloud API (estimated +₹2.1L revenue recovery).
3. **Launch A/B Test** on new UGC Video Reel Hook at 5:00 PM today.`;
  }

  // 5. Code / Tracking / Pixel / Link
  if (lower.includes("code") || lower.includes("pixel") || lower.includes("tracking") || lower.includes("utm") || lower.includes("link")) {
    return `⚡ **CUSTOM TRACKING PIXEL & UTM BUILDER**

\`\`\`javascript
// Lumen & Co Universal Tracking Pixel (v2.4)
(function(w,d,s,l,i){
  w[l]=w[l]||[];w[l].push({'gtm.start': new Date().getTime(),event:'gtm.js'});
  var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';
  j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;
  f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','GTM-LUMEN99');

// Custom Conversion Event Trigger
window.trackLumenConversion = function(dealValue, clientCode) {
  if (window.gtag) {
    gtag('event', 'purchase', {
      transaction_id: 'TRX-' + Date.now(),
      value: dealValue,
      currency: 'INR',
      client_code: clientCode || 'CLT-101'
    });
  }
};
\`\`\`

🔗 **Generated UTM Campaign Link**:
\`https://lumenandco.in/growth?utm_source=meta_ads&utm_medium=cpc&utm_campaign=q4_scaling&utm_content=ugc_reel_v1\``;
  }

  // General Creative Fallback
  return `✨ **LUMEN CREATIVE AI STRATEGY**

I've analyzed your prompt: **"${userMessageContent}"**

Here is your tailored strategic execution plan:

• **Creative Direction**: Position this around immediate pain-point disruption and high social proof.
• **Format Recommendation**: 15-second fast-paced UGC Video Reel paired with a high-converting carousel ad.
• **Target Outcome**: Target 3.5x+ ROAS with CTR above 2.8%.

*Would you like me to write a full video script, generate 5 ad headlines, or build a client proposal brief for this? Click any prompt chip below!*`;
}

export interface AuthSession {
  isLoggedIn: boolean;
  code: string;
  name: string;
  role: UserRoleType;
  userType: "employee" | "client";
  userId: string;
}

export default function WhatsAppMessengerView({
  currentUserRole = "founder",
  currentUserId = "staff-6",
  currentUserName = "Sahit Sai",
  clientBrandId,
  clientBrandName,
  onCloseModal,
  isEmbeddedModal = false,
  targetCodeOrChannelId,
}: WhatsAppMessengerViewProps) {
  // AUTHENTICATION LOGIN STATE
  const [authSession, setAuthSession] = useState<AuthSession | null>(() => {
    try {
      const saved = localStorage.getItem("lumen_messenger_auth_v1");
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {}
    return null;
  });

  const [loginCodeInput, setLoginCodeInput] = useState("");
  const [loginPasswordInput, setLoginPasswordInput] = useState("");
  const [loginError, setLoginError] = useState<string | null>(null);

  const activeUserRole: UserRoleType = authSession?.role || currentUserRole;
  const activeUserId: string = authSession?.userId || currentUserId;
  const activeUserName: string = authSession?.name || currentUserName;
  const activeUserCode: string = authSession?.code || (currentUserRole === "client" ? "CLT-101" : "EMP-100");

  const handlePerformLogin = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const cleanCode = loginCodeInput.trim().toUpperCase();
    const cleanPass = loginPasswordInput.trim();

    if (!cleanCode) {
      setLoginError("Please enter your Identity Code (e.g. EMP-100 or CLT-101)");
      return;
    }

    if (cleanPass !== "12345678") {
      setLoginError("Incorrect password. Common pass key is: 12345678");
      return;
    }

    const staffMatch = SEED_STAFF.find(
      (s) => s.code.toUpperCase() === cleanCode || s.id.toUpperCase() === cleanCode
    );
    if (staffMatch) {
      let role: UserRoleType = "founder";
      if (staffMatch.role === "ops_manager") role = "ops_manager";
      else if (staffMatch.role === "account_manager") role = "account_manager";
      else if (staffMatch.role === "designer") role = "designer";
      else if (staffMatch.role === "content_writer") role = "content_writer";
      else if (staffMatch.role === "ad_specialist") role = "ad_specialist";

      const newSession: AuthSession = {
        isLoggedIn: true,
        code: staffMatch.code,
        name: staffMatch.name,
        role,
        userType: "employee",
        userId: staffMatch.id,
      };
      setAuthSession(newSession);
      localStorage.setItem("lumen_messenger_auth_v1", JSON.stringify(newSession));
      setLoginError(null);
      setLoginCodeInput("");
      setLoginPasswordInput("");
      return;
    }

    const clientMatch = SEED_CLIENTS.find(
      (c) => c.code.toUpperCase() === cleanCode || c.id.toUpperCase() === cleanCode
    );
    if (clientMatch) {
      const newSession: AuthSession = {
        isLoggedIn: true,
        code: clientMatch.code,
        name: clientMatch.company_name,
        role: "client",
        userType: "client",
        userId: clientMatch.id,
      };
      setAuthSession(newSession);
      localStorage.setItem("lumen_messenger_auth_v1", JSON.stringify(newSession));
      setLoginError(null);
      setLoginCodeInput("");
      setLoginPasswordInput("");
      return;
    }

    if (cleanCode.startsWith("EMP-")) {
      const newSession: AuthSession = {
        isLoggedIn: true,
        code: cleanCode,
        name: `Employee (${cleanCode})`,
        role: "ops_manager",
        userType: "employee",
        userId: `emp-${cleanCode.toLowerCase()}`,
      };
      setAuthSession(newSession);
      localStorage.setItem("lumen_messenger_auth_v1", JSON.stringify(newSession));
      setLoginError(null);
      setLoginCodeInput("");
      setLoginPasswordInput("");
      return;
    } else if (cleanCode.startsWith("CLT-")) {
      const newSession: AuthSession = {
        isLoggedIn: true,
        code: cleanCode,
        name: `Client Partner (${cleanCode})`,
        role: "client",
        userType: "client",
        userId: `clt-${cleanCode.toLowerCase()}`,
      };
      setAuthSession(newSession);
      localStorage.setItem("lumen_messenger_auth_v1", JSON.stringify(newSession));
      setLoginError(null);
      setLoginCodeInput("");
      setLoginPasswordInput("");
      return;
    }

    setLoginError("Invalid Identity Code. Use an EMP code (e.g. EMP-100) or CLT code (e.g. CLT-101)");
  };

  const handlePerformLogout = () => {
    setAuthSession(null);
    localStorage.removeItem("lumen_messenger_auth_v1");
  };
  // Load saved state (defaults with AI Copilot channel & welcome message)
  const [channels, setChannels] = useState<ChatChannel[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_CHANNELS);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          return parsed;
        }
      }
    } catch (e) {
      console.warn("Could not parse saved channels", e);
    }
    return INITIAL_CHAT_CHANNELS;
  });

  const [messages, setMessages] = useState<ChatMessage[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_MESSAGES);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          return parsed;
        }
      }
    } catch (e) {
      console.warn("Could not parse saved messages", e);
    }
    return INITIAL_CHAT_MESSAGES;
  });

  const [searchQuery, setSearchQuery] = useState("");
  const [inputText, setInputText] = useState("");
  const [filterType, setFilterType] = useState<"all" | "unread" | "internal" | "clients">("all");
  const [isRecording, setIsRecording] = useState(false);
  const [recordingSeconds, setRecordingSeconds] = useState(0);
  const [showAttachmentMenu, setShowAttachmentMenu] = useState(false);
  const [activeReactionMsgId, setActiveReactionMsgId] = useState<string | null>(null);
  const [showMediaSidebar, setShowMediaSidebar] = useState(true);

  // New Contact / Code Lookup Modal State
  const [isNewContactModalOpen, setIsNewContactModalOpen] = useState(false);
  const [newContactPhone, setNewContactPhone] = useState("");
  const [newContactName, setNewContactName] = useState("");
  const [newContactCode, setNewContactCode] = useState("");
  const [newContactEmail, setNewContactEmail] = useState("");
  const [newContactType, setNewContactType] = useState<"client_support" | "direct_message">("direct_message");

  // Live Typing Indicators Map: { channelId: { userId, userName, expireTime } }
  const [typingUsers, setTypingUsers] = useState<
    Record<string, { userId: string; userName: string; expireTime: number }>
  >({});

  const isClientUser = currentUserRole === "client" || !!clientBrandId;
  const broadcastChannelRef = useRef<BroadcastChannel | null>(null);
  const typingTimerRef = useRef<NodeJS.Timeout | null>(null);
  const voiceTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Clear All Chats Action
  const handleClearAllChats = () => {
    if (typeof window !== "undefined") {
      const confirmed = window.confirm("Are you sure you want to clear all chats and message history?");
      if (!confirmed) return;
    }
    setChannels([]);
    setMessages([]);
    setActiveChannelId("");
    try {
      localStorage.removeItem(STORAGE_KEY_CHANNELS);
      localStorage.removeItem(STORAGE_KEY_MESSAGES);
      Object.keys(localStorage).forEach((key) => {
        if (key.startsWith("lumen_chat_")) {
          localStorage.removeItem(key);
        }
      });
    } catch (e) {}
  };

  // Save to local storage on change
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_CHANNELS, JSON.stringify(channels));
    } catch (e) {}
  }, [channels]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_MESSAGES, JSON.stringify(messages));
    } catch (e) {}
  }, [messages]);

  // REAL-TIME AUDIO & VIDEO CALLING ENGINE STATE
  const [activeCall, setActiveCall] = useState<{
    status: "idle" | "outgoing" | "incoming" | "connected";
    type: "audio" | "video";
    channelId: string;
    channelName: string;
    channelCode?: string;
    callerName: string;
    callerRole: string;
    durationSeconds: number;
    isMicMuted: boolean;
    isVideoOff: boolean;
    isScreenSharing: boolean;
  }>({
    status: "idle",
    type: "video",
    channelId: "",
    channelName: "",
    callerName: "",
    callerRole: "",
    durationSeconds: 0,
    isMicMuted: false,
    isVideoOff: false,
    isScreenSharing: false,
  });

  const localVideoRef = useRef<HTMLVideoElement | null>(null);
  const remoteVideoRef = useRef<HTMLVideoElement | null>(null);
  const localStreamRef = useRef<MediaStream | null>(null);
  const callTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Audio ringer sound helper
  const playRingtoneBeep = useCallback((type: "outgoing" | "incoming") => {
    try {
      const AudioCtx =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = "sine";
      const freq = type === "incoming" ? 440 : 480;
      osc.frequency.setValueAtTime(freq, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(freq + 60, ctx.currentTime + 0.3);

      gain.gain.setValueAtTime(0.12, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.5);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + 0.5);
    } catch (e) {}
  }, []);

  // Handle incoming CALL_SIGNAL payload
  const handleCallSignalEvent = useCallback(
    (payload: any) => {
      if (!payload) return;
      if (payload.callerId === currentUserId) return;

      if (payload.action === "OFFER") {
        playRingtoneBeep("incoming");
        setActiveCall({
          status: "incoming",
          type: payload.type || "video",
          channelId: payload.channelId,
          channelName: payload.channelName || "WhatsApp Call",
          channelCode: payload.channelCode,
          callerName: payload.callerName || "Teammate",
          callerRole: payload.callerRole || "member",
          durationSeconds: 0,
          isMicMuted: false,
          isVideoOff: false,
          isScreenSharing: false,
        });
      } else if (payload.action === "ACCEPT") {
        setActiveCall((prev) => (prev.status === "outgoing" ? { ...prev, status: "connected" } : prev));
      } else if (payload.action === "END" || payload.action === "DECLINE") {
        if (localStreamRef.current) {
          localStreamRef.current.getTracks().forEach((t) => t.stop());
          localStreamRef.current = null;
        }
        setActiveCall({
          status: "idle",
          type: "video",
          channelId: "",
          channelName: "",
          callerName: "",
          callerRole: "",
          durationSeconds: 0,
          isMicMuted: false,
          isVideoOff: false,
          isScreenSharing: false,
        });
      }
    },
    [currentUserId, playRingtoneBeep]
  );

  // Handle incoming broadcast events
  const handleIncomingBroadcast = useCallback(
    (eventData: { type: string; payload: any }) => {
      if (!eventData || !eventData.type) return;

      if (eventData.type === "NEW_MESSAGE") {
        const msg: ChatMessage = eventData.payload;
        setMessages((prev) => {
          if (prev.some((m) => m.id === msg.id)) return prev;
          return [...prev, msg];
        });

        // Update channel last message & unread counter if message is from someone else
        setChannels((prev) =>
          prev.map((c) => {
            if (c.id === msg.channel_id) {
              const isFromMe = msg.sender_id === currentUserId;
              const displayMsg = msg.content.startsWith("system_call_log:")
                ? msg.content.replace("system_call_log:", "")
                : msg.content;
              return {
                ...c,
                last_message: displayMsg,
                last_message_time: new Date(msg.timestamp).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                }),
                unread_count: isFromMe ? 0 : c.unread_count + 1,
              };
            }
            return c;
          })
        );

        if (msg.sender_id !== currentUserId) {
          playNotificationChime();
        }
      } else if (eventData.type === "TYPING_STATUS") {
        const { channelId, userId, userName, isTyping } = eventData.payload;
        if (userId === currentUserId) return;

        setTypingUsers((prev) => {
          if (!isTyping) {
            const next = { ...prev };
            delete next[channelId];
            return next;
          }
          return {
            ...prev,
            [channelId]: {
              userId,
              userName,
              expireTime: Date.now() + 3000,
            },
          };
        });
      } else if (eventData.type === "ADD_REACTION") {
        const { messageId, emoji } = eventData.payload;
        setMessages((prev) =>
          prev.map((m) => {
            if (m.id === messageId) {
              const existingReactions = m.reactions || [];
              return {
                ...m,
                reactions: [...existingReactions, emoji],
              };
            }
            return m;
          })
        );
      } else if (eventData.type === "CALL_SIGNAL") {
        handleCallSignalEvent(eventData.payload);
      }
    },
    [currentUserId, handleCallSignalEvent]
  );

  // Setup BroadcastChannel (Cross-tab realtime) & Supabase Realtime channel
  useEffect(() => {
    if (typeof window !== "undefined" && "BroadcastChannel" in window) {
      const bc = new BroadcastChannel("lumen_realtime_chat_v5");
      broadcastChannelRef.current = bc;
      bc.onmessage = (ev) => {
        handleIncomingBroadcast(ev.data);
      };
    }

    const handleStorage = (e: StorageEvent) => {
      if (e.key === STORAGE_KEY_MESSAGES && e.newValue) {
        try {
          const parsed: ChatMessage[] = JSON.parse(e.newValue);
          setMessages(parsed);
        } catch {}
      }
    };
    window.addEventListener("storage", handleStorage);

    let supabaseChannel: ReturnType<typeof supabase.channel> | null = null;
    try {
      supabaseChannel = supabase.channel("lumen_realtime_chat");
      supabaseChannel
        .on("broadcast", { event: "chat_event" }, (payload) => {
          if (payload.payload) {
            handleIncomingBroadcast(payload.payload);
          }
        })
        .subscribe();
    } catch (err) {}

    return () => {
      if (broadcastChannelRef.current) {
        broadcastChannelRef.current.close();
      }
      window.removeEventListener("storage", handleStorage);
      if (supabaseChannel) {
        supabase.removeChannel(supabaseChannel);
      }
    };
  }, [handleIncomingBroadcast]);

  // Broadcast function
  const broadcastEvent = (type: string, payload: any) => {
    const data = { type, payload };
    if (broadcastChannelRef.current) {
      broadcastChannelRef.current.postMessage(data);
    }
    try {
      supabase.channel("lumen_realtime_chat").send({
        type: "broadcast",
        event: "chat_event",
        payload: data,
      });
    } catch (e) {}
  };

  // Filter channels according to WhatsApp tabs, role visibility & EMPLOYEE / CLIENT CODES
  const visibleChannels = useMemo(() => {
    let list = channels;

    // Client Scoping: Client ONLY sees their dedicated support channel
    if (isClientUser) {
      list = channels.filter(
        (c) =>
          c.type === "client_support" &&
          (c.client_id === clientBrandId ||
            (clientBrandName && c.client_name?.toLowerCase().includes(clientBrandName.toLowerCase())))
      );
      return list;
    }

    // Staff Scoping: Apply tab filters (All, Unread, Internal, Clients)
    if (filterType === "unread") {
      list = list.filter((c) => c.unread_count > 0);
    } else if (filterType === "internal") {
      list = list.filter((c) => c.type === "internal_group" || c.type === "direct_message");
    } else if (filterType === "clients") {
      list = list.filter((c) => c.type === "client_support");
    }

    if (!searchQuery.trim()) return list;

    const q = searchQuery.toLowerCase().trim();
    return list.filter(
      (c) =>
        c.name.toLowerCase().includes(q) ||
        c.description.toLowerCase().includes(q) ||
        (c.code && c.code.toLowerCase().includes(q)) ||
        (c.client_name && c.client_name.toLowerCase().includes(q)) ||
        (c.id && c.id.toLowerCase().includes(q))
    );
  }, [channels, isClientUser, clientBrandId, clientBrandName, filterType, searchQuery]);

  // Helper to start chat given a Code (e.g. EMP-100 or CLT-777) or name
  const handleStartChatWithCode = useCallback(
    (code: string, name: string, type: "direct_message" | "client_support", subtext?: string) => {
      const cleanCode = code.trim().toUpperCase();
      const existing = channels.find(
        (c) => c.code?.toUpperCase() === cleanCode || c.id === `ch-${cleanCode.toLowerCase()}`
      );
      if (existing) {
        setActiveChannelId(existing.id);
        return;
      }

      const channelId = `ch-${cleanCode.toLowerCase().replace(/[^a-z0-9]/g, "-")}`;
      const newChannel: ChatChannel = {
        id: channelId,
        code: cleanCode,
        name: `${name} [${cleanCode}]`,
        type: type,
        description: subtext || `Identity channel assigned to code [${cleanCode}]`,
        unread_count: 0,
        members_count: 2,
        last_message: `Channel initialized for identity code [${cleanCode}]`,
        last_message_time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      };

      const welcomeMsg: ChatMessage = {
        id: `msg-start-${Date.now()}`,
        channel_id: channelId,
        sender_id: currentUserId,
        sender_code: "EMP-100",
        sender_name: currentUserName,
        sender_role: currentUserRole,
        content: `💬 Chat initialized for ${name} [Code: ${cleanCode}].`,
        timestamp: new Date().toISOString(),
        is_read: true,
      };

      setChannels((prev) => [newChannel, ...prev]);
      setMessages((prev) => [...prev, welcomeMsg]);
      setActiveChannelId(channelId);
      broadcastEvent("NEW_MESSAGE", welcomeMsg);
    },
    [channels, currentUserId, currentUserName, currentUserRole]
  );

  // Target Code Listener (from props e.g. targetCodeOrChannelId)
  useEffect(() => {
    if (!targetCodeOrChannelId) return;
    const cleanTarget = targetCodeOrChannelId.trim();
    const existing = channels.find(
      (c) => c.code?.toUpperCase() === cleanTarget.toUpperCase() || c.id === cleanTarget
    );
    if (existing) {
      setActiveChannelId(existing.id);
      return;
    }
    const staffMatch = SEED_STAFF.find(
      (s) => s.code.toUpperCase() === cleanTarget.toUpperCase() || s.id === cleanTarget
    );
    if (staffMatch) {
      handleStartChatWithCode(staffMatch.code, staffMatch.name, "direct_message", staffMatch.role_label);
      return;
    }
    const clientMatch = SEED_CLIENTS.find(
      (c) => c.code.toUpperCase() === cleanTarget.toUpperCase() || c.id === cleanTarget
    );
    if (clientMatch) {
      handleStartChatWithCode(clientMatch.code, clientMatch.company_name, "client_support", clientMatch.package_tier);
    }
  }, [targetCodeOrChannelId, channels, handleStartChatWithCode]);

  // Search Results across registered Staff (EMP-xxx) and Clients (CLT-xxx)
  const directoryResults = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return []; // Only search when query is typed!

    const staffMatches = SEED_STAFF.filter(
      (s) =>
        s.code.toLowerCase().includes(q) ||
        s.name.toLowerCase().includes(q) ||
        s.role_label.toLowerCase().includes(q) ||
        s.email.toLowerCase().includes(q)
    ).map((s) => ({
      code: s.code,
      name: s.name,
      subtext: s.role_label,
      type: "direct_message" as const,
      avatarColor: s.avatar_color,
    }));

    const clientMatches = SEED_CLIENTS.filter(
      (c) =>
        c.code.toLowerCase().includes(q) ||
        c.company_name.toLowerCase().includes(q) ||
        c.package_tier.toLowerCase().includes(q)
    ).map((c) => ({
      code: c.code,
      name: c.company_name,
      subtext: c.package_tier,
      type: "client_support" as const,
      avatarColor: "#f59e0b",
    }));

    return [...staffMatches, ...clientMatches];
  }, [searchQuery]);

  // Set active channel
  const [activeChannelId, setActiveChannelId] = useState<string>(() => {
    return "channel-brooklyn";
  });

  useEffect(() => {
    if (visibleChannels.length > 0 && (!activeChannelId || !visibleChannels.some((c) => c.id === activeChannelId))) {
      setActiveChannelId(visibleChannels[0].id);
    }
  }, [visibleChannels, activeChannelId]);

  const activeChannel = useMemo(
    () => channels.find((c) => c.id === activeChannelId) || visibleChannels[0] || channels[0] || null,
    [channels, activeChannelId, visibleChannels]
  );

  const currentActiveId = activeChannel ? activeChannel.id : activeChannelId;

  const activeMessages = useMemo(
    () => messages.filter((m) => m.channel_id === currentActiveId),
    [messages, currentActiveId]
  );

  // Clear unread count when opening active channel
  useEffect(() => {
    if (currentActiveId) {
      setChannels((prev) =>
        prev.map((c) => (c.id === currentActiveId ? { ...c, unread_count: 0 } : c))
      );
    }
  }, [currentActiveId]);

  // Call timer interval when connected
  useEffect(() => {
    if (activeCall.status === "connected") {
      callTimerRef.current = setInterval(() => {
        setActiveCall((prev) => ({
          ...prev,
          durationSeconds: prev.durationSeconds + 1,
        }));
      }, 1000);
    } else {
      if (callTimerRef.current) clearInterval(callTimerRef.current);
    }
    return () => {
      if (callTimerRef.current) clearInterval(callTimerRef.current);
    };
  }, [activeCall.status]);

  const handleInitiateCall = async (type: "audio" | "video") => {
    if (!activeChannel) return;

    const channelName = activeChannel.client_name || activeChannel.name;

    setActiveCall({
      status: "outgoing",
      type,
      channelId: activeChannel.id,
      channelName,
      channelCode: activeChannel.code,
      callerName: activeUserName,
      callerRole: activeUserRole,
      durationSeconds: 0,
      isMicMuted: false,
      isVideoOff: false,
      isScreenSharing: false,
    });

    // Acquire Media Stream
    try {
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        const stream = await navigator.mediaDevices.getUserMedia({
          audio: true,
          video: type === "video" ? { width: { ideal: 1280 }, height: { ideal: 720 } } : false,
        });
        localStreamRef.current = stream;
        if (localVideoRef.current && type === "video") {
          localVideoRef.current.srcObject = stream;
        }
      }
    } catch (e) {
      console.warn("Camera/Mic device note: stream simulation enabled", e);
    }

    playRingtoneBeep("outgoing");

    broadcastEvent("CALL_SIGNAL", {
      action: "OFFER",
      type,
      channelId: activeChannel.id,
      channelName,
      channelCode: activeChannel.code,
      callerId: activeUserId,
      callerName: activeUserName,
      callerRole: activeUserRole,
    });

    // Auto-connect call after 3.5 seconds if unanswered
    setTimeout(() => {
      setActiveCall((prev) => {
        if (prev.status === "outgoing") {
          return { ...prev, status: "connected" };
        }
        return prev;
      });
    }, 3500);
  };

  const handleAcceptCall = async () => {
    try {
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        const stream = await navigator.mediaDevices.getUserMedia({
          audio: true,
          video: activeCall.type === "video",
        });
        localStreamRef.current = stream;
        if (localVideoRef.current && activeCall.type === "video") {
          localVideoRef.current.srcObject = stream;
        }
      }
    } catch (e) {}

    setActiveCall((prev) => ({ ...prev, status: "connected" }));

    broadcastEvent("CALL_SIGNAL", {
      action: "ACCEPT",
      channelId: activeCall.channelId,
      receiverId: activeUserId,
      receiverName: activeUserName,
    });
  };

  const handleEndCall = () => {
    if (localStreamRef.current) {
      localStreamRef.current.getTracks().forEach((t) => t.stop());
      localStreamRef.current = null;
    }

    const duration = activeCall.durationSeconds;
    const formattedDuration = `${Math.floor(duration / 60)}:${(duration % 60).toString().padStart(2, "0")}`;
    const callTypeIcon = activeCall.type === "video" ? "📹 Video Call" : "📞 Voice Call";
    const callSummary = duration > 0 ? `${callTypeIcon} Ended • Duration ${formattedDuration}` : `${callTypeIcon} Missed / Declined`;

    if (activeCall.channelId) {
      const callLogMsg: ChatMessage = {
        id: `msg-call-${Date.now()}`,
        channel_id: activeCall.channelId,
        sender_id: activeUserId,
        sender_code: activeUserCode,
        sender_name: activeUserName,
        sender_role: activeUserRole,
        content: `system_call_log:${callSummary}`,
        timestamp: new Date().toISOString(),
        is_read: true,
      };

      setMessages((prev) => [...prev, callLogMsg]);
      broadcastEvent("NEW_MESSAGE", callLogMsg);
      broadcastEvent("CALL_SIGNAL", { action: "END", channelId: activeCall.channelId, senderId: activeUserId });
    }

    setActiveCall({
      status: "idle",
      type: "video",
      channelId: "",
      channelName: "",
      callerName: "",
      callerRole: "",
      durationSeconds: 0,
      isMicMuted: false,
      isVideoOff: false,
      isScreenSharing: false,
    });
  };

  const handleToggleMic = () => {
    if (localStreamRef.current) {
      localStreamRef.current.getAudioTracks().forEach((t) => (t.enabled = activeCall.isMicMuted));
    }
    setActiveCall((prev) => ({ ...prev, isMicMuted: !prev.isMicMuted }));
  };

  const handleToggleVideo = () => {
    if (localStreamRef.current) {
      localStreamRef.current.getVideoTracks().forEach((t) => (t.enabled = activeCall.isVideoOff));
    }
    setActiveCall((prev) => ({ ...prev, isVideoOff: !prev.isVideoOff }));
  };

  const handleToggleScreenShare = async () => {
    if (!activeCall.isScreenSharing) {
      try {
        if (navigator.mediaDevices && navigator.mediaDevices.getDisplayMedia) {
          const screenStream = await navigator.mediaDevices.getDisplayMedia({ video: true });
          if (localVideoRef.current) {
            localVideoRef.current.srcObject = screenStream;
          }
          screenStream.getVideoTracks()[0].onended = () => {
            if (localStreamRef.current && localVideoRef.current) {
              localVideoRef.current.srcObject = localStreamRef.current;
            }
            setActiveCall((prev) => ({ ...prev, isScreenSharing: false }));
          };
          setActiveCall((prev) => ({ ...prev, isScreenSharing: true }));
        }
      } catch (e) {}
    } else {
      if (localStreamRef.current && localVideoRef.current) {
        localVideoRef.current.srcObject = localStreamRef.current;
      }
      setActiveCall((prev) => ({ ...prev, isScreenSharing: false }));
    }
  };

  // Auto-scroll to bottom
  const messagesEndRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [activeMessages, typingUsers]);

  // Handle adding new contact by Code, Phone Number or Email
  const handleCreateNewContact = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newContactName.trim() && !newContactPhone.trim() && !newContactCode.trim()) return;

    const cleanPhone = newContactPhone.trim() || "+1 (555) 019-2831";
    const contactName = newContactName.trim() || `Contact (${cleanPhone})`;
    const codeTag = newContactCode.trim().toUpperCase() || (newContactType === "client_support" ? "CLT-NEW" : "EMP-NEW");
    const channelId = `ch-${newContactType === "client_support" ? "client" : "dm"}-${Date.now()}`;

    const newChannel: ChatChannel = {
      id: channelId,
      code: codeTag,
      name: contactName,
      type: newContactType,
      client_name: newContactType === "client_support" ? contactName : undefined,
      description: `Channel assigned to [Code: ${codeTag}] • Connected to ${cleanPhone}`,
      unread_count: 0,
      members_count: 2,
      last_message: `Channel initialized [Identity Code: ${codeTag}]`,
      last_message_time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    const initialWelcomeMsg: ChatMessage = {
      id: `msg-welcome-${Date.now()}`,
      channel_id: channelId,
      sender_id: activeUserId,
      sender_code: activeUserCode,
      sender_name: activeUserName,
      sender_role: activeUserRole,
      content: `👋 Hello ${contactName}! Channel initialized under Identity Code [${codeTag}]. Connected via phone ${cleanPhone}.`,
      timestamp: new Date().toISOString(),
      is_read: true,
    };

    setChannels((prev) => [newChannel, ...prev]);
    setMessages((prev) => [...prev, initialWelcomeMsg]);
    setActiveChannelId(channelId);

    // Reset modal inputs
    setNewContactPhone("");
    setNewContactName("");
    setNewContactCode("");
    setNewContactEmail("");
    setIsNewContactModalOpen(false);

    broadcastEvent("NEW_MESSAGE", initialWelcomeMsg);
  };

  // Emit typing event when typing text
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const text = e.target.value;
    setInputText(text);

    const targetId = activeChannelId || currentActiveId;
    if (targetId && text.trim().length > 0) {
      broadcastEvent("TYPING_STATUS", {
        channelId: targetId,
        userId: activeUserId,
        userName: activeUserName,
        isTyping: true,
      });

      if (typingTimerRef.current) clearTimeout(typingTimerRef.current);
      typingTimerRef.current = setTimeout(() => {
        broadcastEvent("TYPING_STATUS", {
          channelId: targetId,
          userId: activeUserId,
          userName: activeUserName,
          isTyping: false,
        });
      }, 2000);
    }
  };

  // Dispatch message in real time
  const dispatchMessage = (content: string, attachments?: any[]) => {
    const targetId = activeChannelId || currentActiveId;
    if (!targetId) return;

    const newMsg: ChatMessage = {
      id: `msg-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      channel_id: targetId,
      sender_id: activeUserId,
      sender_code: activeUserCode,
      sender_name: activeUserName,
      sender_role: activeUserRole,
      content: content.trim(),
      timestamp: new Date().toISOString(),
      is_read: true,
      attachments: attachments || undefined,
    };

    setMessages((prev) => [...prev, newMsg]);
    setInputText("");
    setShowAttachmentMenu(false);

    setChannels((prev) =>
      prev.map((c) =>
        c.id === targetId
          ? {
              ...c,
              last_message: content.trim(),
              last_message_time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
              unread_count: 0,
            }
          : c
      )
    );

    broadcastEvent("NEW_MESSAGE", newMsg);
    triggerSimulatedResponse(targetId, content);
  };

  const handleSendMessage = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputText.trim()) return;

    const targetId = activeChannelId || currentActiveId;
    if (!targetId) {
      const defaultStaff = SEED_STAFF.find((s) => s.code === "EMP-101") || SEED_STAFF[0];
      handleStartChatWithCode(
        defaultStaff.code,
        defaultStaff.name,
        "direct_message",
        defaultStaff.role_label
      );
      const textToDispatch = inputText;
      setTimeout(() => {
        dispatchMessage(textToDispatch);
      }, 50);
      return;
    }

    dispatchMessage(inputText);
  };

  // Simulated real-time response from agency strategist & AI copilot
  const triggerSimulatedResponse = (channelId: string, userMessageContent: string) => {
    const isAiChannel = channelId === "channel-ai-copilot" || userMessageContent.toLowerCase().includes("ai");

    const responderName = isAiChannel
      ? "⚡ Lumen Creative AI Copilot"
      : isClientUser
      ? "Sahit Sai [Code: EMP-100]"
      : "Sarah Chen [Code: EMP-102]";
    const responderId = isAiChannel ? "ai-copilot-bot" : isClientUser ? "staff-6" : "staff-2";
    const responderCode = isAiChannel ? "AI-COPILOT" : isClientUser ? "EMP-100" : "EMP-102";
    const responderRole: UserRoleType = isAiChannel ? "ad_specialist" : isClientUser ? "founder" : "account_manager";

    const delayBeforeTyping = isAiChannel ? 150 : 500;
    const delayBeforeReply = isAiChannel ? 1100 : 2000;

    setTimeout(() => {
      broadcastEvent("TYPING_STATUS", {
        channelId,
        userId: responderId,
        userName: responderName,
        isTyping: true,
      });
      setTypingUsers((prev) => ({
        ...prev,
        [channelId]: {
          userId: responderId,
          userName: responderName,
          expireTime: Date.now() + delayBeforeReply,
        },
      }));
    }, delayBeforeTyping);

    setTimeout(() => {
      setTypingUsers((prev) => {
        const next = { ...prev };
        delete next[channelId];
        return next;
      });

      const autoReplyText = generateCreativeAIResponse(userMessageContent);

      const botMsg: ChatMessage = {
        id: `msg-reply-${Date.now()}`,
        channel_id: channelId,
        sender_id: responderId,
        sender_code: responderCode,
        sender_name: responderName,
        sender_role: responderRole,
        content: autoReplyText,
        timestamp: new Date().toISOString(),
        is_read: true,
      };

      setMessages((prev) => [...prev, botMsg]);
      setChannels((prev) =>
        prev.map((c) =>
          c.id === channelId
            ? {
                ...c,
                last_message: autoReplyText.slice(0, 80) + "...",
                last_message_time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
              }
            : c
        )
      );

      broadcastEvent("NEW_MESSAGE", botMsg);
      playNotificationChime();
    }, delayBeforeReply);
  };

  const handleQuickReply = (text: string) => {
    setInputText(text);
  };

  const handleVoiceNote = () => {
    if (!isRecording) {
      setIsRecording(true);
      setRecordingSeconds(0);
      voiceTimerRef.current = setInterval(() => {
        setRecordingSeconds((s) => s + 1);
      }, 1000);
    } else {
      setIsRecording(false);
      if (voiceTimerRef.current) clearInterval(voiceTimerRef.current);
      const duration = recordingSeconds > 0 ? recordingSeconds : 8;
      dispatchMessage(
        `🎙️ Voice Memo (${duration < 10 ? `0:0${duration}` : `0:${duration}`}) — Strategy audio memo`
      );
      setRecordingSeconds(0);
    }
  };

  const handleAttachPresetFile = (name: string, size: string, type: "video" | "document") => {
    const sampleAttachment = {
      id: `att-${Date.now()}`,
      name,
      url: "#",
      type,
      size,
    };
    dispatchMessage(`Attached file: ${name}`, [sampleAttachment]);
  };

  const handleAddReaction = (messageId: string, emoji: string) => {
    setMessages((prev) =>
      prev.map((m) => {
        if (m.id === messageId) {
          const existing = m.reactions || [];
          return { ...m, reactions: [...existing, emoji] };
        }
        return m;
      })
    );
    setActiveReactionMsgId(null);
    broadcastEvent("ADD_REACTION", { messageId, emoji });
  };

  const currentTypingState = activeChannelId ? typingUsers[activeChannelId] : null;

  return (
    <div
      className={`w-full h-full flex bg-[#16171e] text-white font-sans overflow-hidden border border-white/10 shadow-2xl relative isolate ${
        isEmbeddedModal ? "min-h-[640px] rounded-3xl" : "rounded-3xl"
      }`}
    >
      {/* ========================================================================= */}
      {/* COLUMN 1: LEFTMOST NARROW VERTICAL ICON NAVBAR (#121318) */}
      {/* ========================================================================= */}
      <div className="hidden sm:flex w-16 bg-[#121318] border-r border-white/5 flex-col items-center justify-between py-5 shrink-0 z-20">
        <div className="flex flex-col items-center gap-6">
          {/* Brand Logo */}
          <div className="w-12 h-12 rounded-2xl bg-white/10 p-1 flex items-center justify-center border border-white/25 shadow-md cursor-pointer hover:bg-white/20 transition-all overflow-hidden" title="Lumen & Co">
            <img src="/lumen-and-co-logo.png" alt="Lumen & Co Logo" className="w-full h-full object-contain brightness-0 invert scale-110" />
          </div>

          {/* Nav Icons */}
          <div className="flex flex-col items-center gap-4 pt-4">
            {/* Chat Nav Item (Active) */}
            <div className="relative group cursor-pointer" title="Chats & Messages">
              <div className="absolute left-[-16px] top-1/2 -translate-y-1/2 w-1 h-6 bg-[#0f83fe] rounded-r-full" />
              <div className="p-2.5 bg-[#0f83fe]/20 text-[#0f83fe] rounded-xl border border-[#0f83fe]/30">
                <MessageSquare className="h-5 w-5" />
              </div>
            </div>

            {/* Video Meetings Nav Item */}
            <button
              type="button"
              onClick={() => setFilterType("internal")}
              className="p-2.5 text-neutral-400 hover:text-white hover:bg-white/5 rounded-xl transition-all cursor-pointer"
              title="Video Meetings & Calls"
            >
              <VideoIcon className="h-5 w-5" />
            </button>

            {/* Workday Planner Item */}
            <button
              type="button"
              onClick={() => setFilterType("all")}
              className="p-2.5 text-neutral-400 hover:text-white hover:bg-white/5 rounded-xl transition-all cursor-pointer"
              title="Workday Tasks"
            >
              <Trees className="h-5 w-5" />
            </button>

            {/* Performance AI Item */}
            <button
              type="button"
              onClick={() => setFilterType("unread")}
              className="p-2.5 text-neutral-400 hover:text-white hover:bg-white/5 rounded-xl transition-all cursor-pointer"
              title="Performance AI Copilot"
            >
              <Zap className="h-5 w-5" />
            </button>

            {/* Settings / Add Contact Item */}
            <button
              type="button"
              onClick={() => setIsNewContactModalOpen(true)}
              className="p-2.5 text-neutral-400 hover:text-white hover:bg-white/5 rounded-xl transition-all cursor-pointer"
              title="Add Contact / Settings"
            >
              <SettingsIcon className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Bottom User Profile Avatar & Logout */}
        <div className="flex flex-col items-center gap-3">
          {authSession?.isLoggedIn && (
            <button
              type="button"
              onClick={handlePerformLogout}
              className="p-2 text-neutral-400 hover:text-red-400 hover:bg-red-500/10 rounded-xl transition-all cursor-pointer"
              title={`Logged in as ${activeUserName} [${activeUserCode}] — Click to Logout`}
            >
              <LogOut className="h-4 w-4" />
            </button>
          )}
          <div className="relative cursor-pointer" title={`${activeUserName} [${activeUserCode}]`}>
            <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-[#0f83fe] to-[#8000ff] text-white font-bold flex items-center justify-center text-xs shadow-md">
              {activeUserName.substring(0, 2).toUpperCase()}
            </div>
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 border-2 border-[#121318] absolute bottom-0 right-0" />
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* COLUMN 2: CONVERSATION LIST SIDEBAR ("Chats") (#171821) */}
      {/* ========================================================================= */}
      <div className={`${activeChannelId ? "hidden md:flex" : "flex"} w-full md:w-80 bg-[#171821] border-r border-white/5 flex-col shrink-0 isolate`}>
        {/* Chats Header */}
        <div className="h-16 px-5 flex items-center justify-between border-b border-white/5 shrink-0">
          <h2 className="text-xl font-extrabold text-white tracking-tight">Chats</h2>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setIsNewContactModalOpen(true)}
              className="p-2 text-neutral-400 hover:text-white hover:bg-white/5 rounded-xl transition-colors cursor-pointer"
              title="Search / Start New Chat"
            >
              <Search className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={handleClearAllChats}
              className="p-2 text-neutral-400 hover:text-red-400 hover:bg-red-500/10 rounded-xl transition-colors cursor-pointer"
              title="Clear All Chats & History"
            >
              <Trash2 className="h-4 w-4" />
            </button>
            {isEmbeddedModal && onCloseModal && (
              <button
                onClick={onCloseModal}
                className="p-2 text-neutral-400 hover:text-white hover:bg-white/5 rounded-xl transition-colors cursor-pointer"
                title="Close Messenger"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>
        </div>

        {/* Search Input Box */}
        <div className="px-4 py-2 border-b border-white/5">
          <div className="relative">
            <Search className="h-3.5 w-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500" />
            <input
              type="text"
              placeholder="Search chats or codes..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 bg-[#222430] text-xs text-white placeholder:text-neutral-500 rounded-xl outline-none focus:ring-1 focus:ring-[#0f83fe] border border-white/5 transition-all"
            />
          </div>
        </div>

        {/* Channels & Messages List */}
        <div className="flex-1 overflow-y-auto p-3 space-y-4 scrollbar-thin">
          {/* SEARCH RESULTS DIRECTORY MATCH */}
          {directoryResults.length > 0 && (
            <div className="space-y-2 pb-2 border-b border-white/5">
              <div className="text-[11px] font-bold text-[#0f83fe] px-2 uppercase tracking-wider flex items-center justify-between">
                <span>Identity Match</span>
                <span className="text-[10px] bg-[#0f83fe]/20 px-2 py-0.5 rounded-full font-mono">{directoryResults.length}</span>
              </div>
              <div className="space-y-1.5">
                {directoryResults.map((item) => (
                  <div
                    key={item.code}
                    onClick={() => {
                      handleStartChatWithCode(item.code, item.name, item.type, item.subtext);
                      setSearchQuery("");
                    }}
                    className="p-2.5 rounded-2xl bg-[#0f83fe]/10 hover:bg-[#0f83fe]/20 border border-[#0f83fe]/30 flex items-center justify-between cursor-pointer transition-all"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <span className="px-2 py-0.5 rounded bg-[#0f83fe] text-white text-[10px] font-mono font-bold shrink-0">
                        {item.code}
                      </span>
                      <div className="min-w-0">
                        <h5 className="text-xs font-bold text-white truncate">{item.name}</h5>
                        <p className="text-[10px] text-neutral-400 truncate">{item.subtext}</p>
                      </div>
                    </div>
                    <span className="text-[10px] text-[#0f83fe] font-bold shrink-0">Chat →</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* SECTION 1: New Messages */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-[11px] font-bold text-neutral-400 px-2 uppercase tracking-wider">
              <span>New Messages</span>
              <ChevronDown className="h-3.5 w-3.5 opacity-60" />
            </div>

            <div className="space-y-2">
              {visibleChannels.slice(0, 2).map((c) => {
                const isActive = currentActiveId === c.id;
                return (
                  <div
                    key={`new-${c.id}`}
                    onClick={() => setActiveChannelId(c.id)}
                    className={`p-3 rounded-2xl flex items-center justify-between transition-all cursor-pointer border ${
                      isActive
                        ? "bg-[#0f83fe] text-white shadow-md border-transparent"
                        : "bg-[#222430] hover:bg-[#292b39] text-neutral-200 border-white/5"
                    }`}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="relative shrink-0">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-[#0f83fe] to-[#00c6ff] text-white font-bold flex items-center justify-center text-xs shadow-md">
                          {c.name.substring(0, 2).toUpperCase()}
                        </div>
                        <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 border-2 border-[#222430] absolute bottom-0 right-0" />
                      </div>
                      <div className="min-w-0">
                        <h4 className="text-xs font-bold truncate">{c.name}</h4>
                        <p className={`text-[11px] truncate ${isActive ? "text-white/80" : "text-neutral-400"}`}>
                          {c.last_message || c.description}
                        </p>
                      </div>
                    </div>

                    <span className="w-2.5 h-2.5 rounded-full bg-[#0f83fe] shrink-0 shadow-sm" />
                  </div>
                );
              })}
            </div>
          </div>

          {/* SECTION 2: Last Messages */}
          <div className="space-y-2 pt-1">
            <div className="flex items-center justify-between text-[11px] font-bold text-neutral-400 px-2 uppercase tracking-wider">
              <span>Last Messages</span>
              <ChevronDown className="h-3.5 w-3.5 opacity-60" />
            </div>

            <div className="space-y-2">
              {visibleChannels.slice(2).map((c) => {
                const isActive = currentActiveId === c.id;
                return (
                  <div
                    key={c.id}
                    onClick={() => setActiveChannelId(c.id)}
                    className={`p-3.5 rounded-2xl flex items-center justify-between transition-all cursor-pointer border ${
                      isActive
                        ? "bg-[#0f83fe] text-white shadow-md border-transparent"
                        : "bg-[#222430] hover:bg-[#292b39] text-neutral-200 border-white/5"
                    }`}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="relative shrink-0">
                        <div
                          className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-xs ${
                            isActive
                              ? "bg-white text-[#0f83fe]"
                              : "bg-gradient-to-tr from-neutral-700 to-neutral-500 text-white"
                          }`}
                        >
                          {c.name.substring(0, 2).toUpperCase()}
                        </div>
                        <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 border-2 border-[#222430] absolute bottom-0 right-0" />
                      </div>
                      <div className="min-w-0">
                        <h4 className="text-xs font-bold truncate">{c.name}</h4>
                        <p className={`text-[11px] truncate ${isActive ? "text-white/80" : "text-neutral-400"}`}>
                          {c.last_message || c.description}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* COLUMN 3: MAIN CHAT WINDOW (#1c1d27) */}
      {/* ========================================================================= */}
      <div className={`${!activeChannelId ? "hidden md:flex" : "flex"} flex-1 flex-col bg-[#1c1d27] overflow-hidden relative isolate`}>
        {activeChannel ? (
          <>
            {/* Chat Header */}
            <div className="h-16 px-4 sm:px-6 flex items-center justify-between border-b border-white/5 shrink-0 bg-[#1c1d27] z-10">
              <div className="flex items-center gap-2 sm:gap-3.5">
                <button
                  type="button"
                  onClick={() => setActiveChannelId("")}
                  className="md:hidden p-2 text-neutral-400 hover:text-white bg-white/10 rounded-xl cursor-pointer"
                  title="Back to Chats"
                >
                  <ArrowLeft className="h-4 w-4" />
                </button>
                <div className="relative">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-[#0f83fe] to-[#ff5c8d] text-white flex items-center justify-center font-bold text-xs ring-2 ring-[#ff5c8d]/50 shadow-md">
                    {activeChannel.name.substring(0, 2).toUpperCase()}
                  </div>
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 border-2 border-[#1c1d27] absolute bottom-0 right-0" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white tracking-tight">{activeChannel.name}</h3>
                  <p className="text-[11px] text-emerald-400 font-semibold">Online</p>
                </div>
              </div>

              <div className="flex items-center gap-2 text-neutral-400">
                <button
                  type="button"
                  onClick={() => handleInitiateCall("video")}
                  className="p-2 hover:bg-white/5 hover:text-white rounded-xl transition-all cursor-pointer"
                  title="Video Call"
                >
                  <VideoIcon className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  onClick={() => handleInitiateCall("audio")}
                  className="p-2 hover:bg-white/5 hover:text-white rounded-xl transition-all cursor-pointer"
                  title="Voice Call"
                >
                  <Phone className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  onClick={() => handleToggleScreenShare()}
                  className="p-2 hover:bg-white/5 hover:text-white rounded-xl transition-all cursor-pointer"
                  title="Screen Share"
                >
                  <Monitor className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Message Stream Area */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {/* Design System Meeting Invite Card Widget */}
              <div className="flex justify-center my-3">
                <div className="bg-[#272937] border border-white/10 p-4 rounded-2xl max-w-md w-full shadow-xl flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-[#0f83fe] text-white flex items-center justify-center font-bold shadow-md">
                      <VideoIcon className="h-5 w-5" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-white">Design System Meeting</h4>
                      <p className="text-[10px] text-neutral-400 font-mono">teleport.video/anywhereworks/people</p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleInitiateCall("video")}
                    className="bg-[#0f83fe] hover:bg-[#0075f0] text-white font-bold text-xs px-4 py-2 rounded-xl shadow-md transition-all cursor-pointer"
                  >
                    Join
                  </button>
                </div>
              </div>

              {/* Messages Stream */}
              {activeMessages.map((msg) => {
                const isMe = msg.sender_id === currentUserId;
                return (
                  <div key={msg.id} className={`flex flex-col ${isMe ? "items-end" : "items-start"}`}>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-[10px] text-neutral-400 font-semibold">{msg.sender_name}</span>
                      <span className="text-[10px] text-neutral-500">
                        {new Date(msg.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                      </span>
                    </div>

                    <div
                      className={`max-w-md sm:max-w-lg p-3.5 rounded-2xl text-xs font-medium leading-relaxed shadow-sm relative ${
                        isMe
                          ? "bg-[#0f83fe] text-white rounded-tr-xs shadow-sm"
                          : "bg-[#282a36] text-[#e0e2ed] rounded-tl-xs border border-white/5"
                      }`}
                    >
                      <div className="whitespace-pre-wrap pr-6 space-y-1">
                        {msg.content.includes("```") ? (
                          <div className="space-y-1">
                            <div className="flex items-center justify-between text-[10px] text-amber-400 font-mono">
                              <span>⚡ GENERATED AI CODE / SCRIPT</span>
                              <button
                                type="button"
                                onClick={() => {
                                  navigator.clipboard.writeText(msg.content);
                                }}
                                className="text-[#0f83fe] hover:underline cursor-pointer font-bold"
                              >
                                Copy Output 📋
                              </button>
                            </div>
                            <pre className="bg-black/60 p-3 rounded-xl border border-white/15 font-mono text-[11px] text-emerald-300 overflow-x-auto whitespace-pre-wrap select-all">
                              {msg.content}
                            </pre>
                          </div>
                        ) : (
                          <p>{msg.content}</p>
                        )}
                      </div>

                      {/* Reaction Badges */}
                      <div
                        className={`absolute -bottom-2 ${
                          isMe ? "right-3" : "left-3"
                        } bg-[#1b1c24] border border-white/10 rounded-full px-2 py-0.5 text-[10px] text-neutral-300 flex items-center gap-1 shadow-md`}
                      >
                        {isMe ? "👍 08:32 AM You" : "🔥 👌"}
                      </div>
                    </div>
                  </div>
                );
              })}

              {currentTypingState && (
                <p className="text-xs text-[#ff5c8d] font-bold animate-pulse pt-2">
                  ⚡ {currentTypingState.userName} is typing...
                </p>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Quick Creative Action Presets Bar */}
            <div className="px-6 py-2 bg-[#1c1d27] border-t border-white/5 flex items-center gap-2 overflow-x-auto text-[11px] shrink-0 scrollbar-none">
              <span className="text-neutral-400 font-bold shrink-0 flex items-center gap-1">
                <Sparkles className="h-3 w-3 text-[#0f83fe]" /> AI Action Prompts:
              </span>
              <button
                type="button"
                onClick={() => handleQuickReply("🎬 Write Instagram Reel Script with hooks & scene directions")}
                className="bg-[#262836] hover:bg-[#0f83fe]/25 hover:border-[#0f83fe]/50 border border-white/10 text-neutral-200 hover:text-white px-3 py-1 rounded-full whitespace-nowrap transition-all cursor-pointer flex items-center gap-1"
              >
                🎬 Write UGC Reel Script
              </button>
              <button
                type="button"
                onClick={() => handleQuickReply("🔥 Generate 5 High-ROAS Facebook & Meta Ad Angles")}
                className="bg-[#262836] hover:bg-[#0f83fe]/25 hover:border-[#0f83fe]/50 border border-white/10 text-neutral-200 hover:text-white px-3 py-1 rounded-full whitespace-nowrap transition-all cursor-pointer flex items-center gap-1"
              >
                🔥 Generate 5 Ad Angles
              </button>
              <button
                type="button"
                onClick={() => handleQuickReply("📄 Draft Client Retainer Proposal with pricing breakdown")}
                className="bg-[#262836] hover:bg-[#0f83fe]/25 hover:border-[#0f83fe]/50 border border-white/10 text-neutral-200 hover:text-white px-3 py-1 rounded-full whitespace-nowrap transition-all cursor-pointer flex items-center gap-1"
              >
                📄 Draft Client Proposal
              </button>
              <button
                type="button"
                onClick={() => handleQuickReply("📊 Analyze campaign ROAS, CPA and optimization steps")}
                className="bg-[#262836] hover:bg-[#0f83fe]/25 hover:border-[#0f83fe]/50 border border-white/10 text-neutral-200 hover:text-white px-3 py-1 rounded-full whitespace-nowrap transition-all cursor-pointer flex items-center gap-1"
              >
                📊 Analyze Campaign ROAS
              </button>
            </div>

            {/* Bottom Input Bar Footer */}
            <div className="p-4 bg-[#1c1d27] border-t border-white/5">
              <form onSubmit={handleSendMessage} className="bg-[#232532] border border-white/10 p-2.5 rounded-2xl flex items-center gap-3 shadow-inner">
                <button
                  type="button"
                  onClick={() => setShowAttachmentMenu(!showAttachmentMenu)}
                  className="p-2.5 bg-[#2e303f] hover:bg-[#393b4d] text-neutral-300 rounded-xl transition-all cursor-pointer"
                  title="Attach Files"
                >
                  <Plus className="h-4 w-4" />
                </button>

                <input
                  type="text"
                  placeholder="Type something..."
                  value={inputText}
                  onChange={handleInputChange}
                  className="flex-1 bg-transparent text-xs text-white placeholder:text-neutral-500 outline-none"
                />

                <button
                  type="submit"
                  disabled={!inputText.trim()}
                  className="p-3 bg-[#0f83fe] hover:bg-[#0075f0] text-white rounded-xl shadow-md transition-all disabled:opacity-40 cursor-pointer"
                >
                  <ArrowUp className="h-4 w-4 font-bold" />
                </button>
              </form>
            </div>
          </>
        ) : null}
      </div>

      {/* MODAL: ADD NEW CONTACT / START CHAT BY CODE */}
      {isNewContactModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-neutral-900/95 border border-white/15 backdrop-blur-2xl rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-4 text-white animate-in fade-in zoom-in duration-150">
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <div className="flex items-center gap-2">
                <UserPlus className="h-5 w-5 text-[#ef4d23]" />
                <h3 className="text-base font-bold">Assign Code & Start Chat</h3>
              </div>
              <button
                type="button"
                onClick={() => setIsNewContactModalOpen(false)}
                className="text-neutral-400 hover:text-white p-1 rounded-full hover:bg-white/10"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleCreateNewContact} className="space-y-4 text-xs">
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider flex items-center justify-between">
                  <span>Quick Select Registered Code</span>
                  <span className="text-[10px] text-[#ef4d23]">1-Click Start</span>
                </label>
                <div className="flex flex-wrap gap-1.5 max-h-32 overflow-y-auto p-2 bg-white/5 border border-white/10 rounded-xl scrollbar-thin">
                  {SEED_STAFF.map((s) => (
                    <button
                      key={s.code}
                      type="button"
                      onClick={() => {
                        handleStartChatWithCode(s.code, s.name, "direct_message", s.role_label);
                        setIsNewContactModalOpen(false);
                      }}
                      className="bg-white/10 hover:bg-[#ef4d23] hover:text-white border border-[#ef4d23]/40 text-[#ef4d23] font-mono text-[11px] font-extrabold px-2.5 py-1 rounded-lg transition-all cursor-pointer flex items-center gap-1"
                      title={`Start Direct Chat with ${s.name}`}
                    >
                      <span>{s.code}</span>
                      <span className="text-[9px] font-sans font-normal opacity-80">({s.name.split(" ")[0]})</span>
                    </button>
                  ))}
                  {SEED_CLIENTS.map((c) => (
                    <button
                      key={c.code}
                      type="button"
                      onClick={() => {
                        handleStartChatWithCode(c.code, c.company_name, "client_support", c.package_tier);
                        setIsNewContactModalOpen(false);
                      }}
                      className="bg-white/10 hover:bg-amber-600 hover:text-white border border-amber-500/40 text-amber-400 font-mono text-[11px] font-extrabold px-2.5 py-1 rounded-lg transition-all cursor-pointer flex items-center gap-1"
                      title={`Start Client Chat with ${c.company_name}`}
                    >
                      <span>{c.code}</span>
                      <span className="text-[9px] font-sans font-normal opacity-80">({c.company_name.split(" ")[0]})</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider flex items-center gap-1">
                  <Tag className="h-3 w-3 text-[#ef4d23]" /> Assign Identity Code (EMP-xxx / CLT-xxx)
                </label>
                <input
                  type="text"
                  placeholder="e.g. EMP-107 or CLT-501"
                  value={newContactCode}
                  onChange={(e) => setNewContactCode(e.target.value)}
                  className="w-full bg-white/10 border border-white/15 rounded-xl px-3.5 py-2 text-xs text-white placeholder:text-neutral-500 focus:ring-2 focus:ring-[#ef4d23]/50 outline-none uppercase font-mono font-bold"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider">
                  Contact / Client Name
                </label>
                <input
                  type="text"
                  placeholder="e.g. David Miller or Northbeam Growth"
                  value={newContactName}
                  onChange={(e) => setNewContactName(e.target.value)}
                  className="w-full bg-white/10 border border-white/15 rounded-xl px-3.5 py-2 text-xs text-white placeholder:text-neutral-500 focus:ring-2 focus:ring-[#ef4d23]/50 outline-none"
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider">
                  Contact Phone Number
                </label>
                <input
                  type="text"
                  placeholder="+1 (555) 019-2831 or +91 9876543210"
                  value={newContactPhone}
                  onChange={(e) => setNewContactPhone(e.target.value)}
                  className="w-full bg-white/10 border border-white/15 rounded-xl px-3.5 py-2 text-xs text-white placeholder:text-neutral-500 focus:ring-2 focus:ring-[#ef4d23]/50 outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider">
                  Channel Type
                </label>
                <select
                  value={newContactType}
                  onChange={(e) => setNewContactType(e.target.value as any)}
                  className="w-full bg-neutral-800 border border-white/15 rounded-xl px-3.5 py-2 text-xs text-white focus:ring-2 focus:ring-[#ef4d23]/50 outline-none cursor-pointer"
                >
                  <option value="direct_message">Employee Direct Line (EMP Code)</option>
                  <option value="client_support">Client Support Channel (CLT Code)</option>
                </select>
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsNewContactModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-white/10 text-neutral-400 hover:text-white text-xs font-bold transition-all cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#ef4d23] hover:bg-[#d93c14] text-white text-xs font-bold transition-all shadow-md cursor-pointer flex items-center gap-1.5"
                >
                  <Send className="h-3.5 w-3.5" />
                  <span>Save & Open Chat</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* INCOMING CALL OVERLAY POPUP */}
      {activeCall.status === "incoming" && (
        <div className="fixed bottom-6 right-6 z-50 bg-neutral-900/95 border border-[#ef4d23] backdrop-blur-2xl rounded-3xl p-5 shadow-2xl space-y-4 max-w-sm w-full animate-bounce isolate text-white">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-[#ef4d23] text-white flex items-center justify-center font-bold text-lg animate-pulse ring-4 ring-[#ef4d23]/30">
              {activeCall.type === "video" ? <VideoIcon className="h-6 w-6" /> : <Phone className="h-6 w-6" />}
            </div>
            <div className="min-w-0">
              <div className="inline-flex items-center gap-1 bg-[#ef4d23]/20 border border-[#ef4d23]/40 text-[#ef4d23] text-[9px] font-extrabold px-2 py-0.5 rounded font-mono">
                {activeCall.type === "video" ? "INCOMING VIDEO CALL" : "INCOMING VOICE CALL"}
              </div>
              <h4 className="text-sm font-bold text-white truncate">{activeCall.callerName}</h4>
              <p className="text-[11px] text-neutral-400">Lumen & Co Real-time Call</p>
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={() => handleEndCall()}
              className="flex-1 bg-red-600 hover:bg-red-700 text-white font-bold text-xs py-2.5 rounded-xl transition-all shadow-md flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <PhoneOff className="h-4 w-4" />
              <span>Decline</span>
            </button>
            <button
              type="button"
              onClick={handleAcceptCall}
              className="flex-1 bg-[#ef4d23] hover:bg-[#d93c14] text-white font-bold text-xs py-2.5 rounded-xl transition-all shadow-md flex items-center justify-center gap-1.5 cursor-pointer animate-pulse"
            >
              <Phone className="h-4 w-4" />
              <span>Accept</span>
            </button>
          </div>
        </div>
      )}

      {/* ACTIVE CALL ROOM OVERLAY MODAL */}
      {(activeCall.status === "outgoing" || activeCall.status === "connected") && (
        <div className="fixed inset-0 z-50 bg-neutral-950/95 backdrop-blur-3xl flex flex-col items-center justify-between p-4 sm:p-8 animate-in fade-in">
          {/* Header */}
          <div className="w-full max-w-4xl flex items-center justify-between z-10">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-[#ef4d23] text-white flex items-center justify-center font-bold shadow-md">
                {activeCall.type === "video" ? <VideoIcon className="h-5 w-5" /> : <Phone className="h-5 w-5" />}
              </div>
              <div>
                <h3 className="text-base font-extrabold text-white flex items-center gap-2">
                  <span>{activeCall.channelName}</span>
                  {activeCall.channelCode && (
                    <span className="bg-[#ef4d23]/20 border border-[#ef4d23]/50 text-[#ef4d23] text-[10px] font-mono font-extrabold px-2 py-0.5 rounded-md">
                      {activeCall.channelCode}
                    </span>
                  )}
                </h3>
                <p className="text-xs text-[#ef4d23] font-bold flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-[#ef4d23] animate-ping" />
                  <span>
                    {activeCall.status === "outgoing"
                      ? "Ringing & Connecting Real-time Stream…"
                      : `Live ${activeCall.type === "video" ? "Video" : "Voice"} Call • ${Math.floor(activeCall.durationSeconds / 60)}:${(activeCall.durationSeconds % 60).toString().padStart(2, "0")}`}
                  </span>
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 text-xs text-neutral-400 font-mono bg-white/10 border border-white/15 px-3.5 py-1.5 rounded-full backdrop-blur-md">
              <ShieldCheck className="h-4 w-4 text-[#ef4d23]" />
              <span>End-to-End Encrypted WebRTC</span>
            </div>
          </div>

          {/* Main Video / Voice Feed */}
          <div className="w-full max-w-4xl flex-1 my-4 bg-neutral-900/80 border border-white/15 rounded-3xl overflow-hidden relative flex items-center justify-center shadow-2xl backdrop-blur-xl">
            {activeCall.type === "video" && !activeCall.isVideoOff ? (
              <div className="w-full h-full relative flex items-center justify-center bg-black">
                <video
                  ref={localVideoRef}
                  autoPlay
                  playsInline
                  muted
                  className="w-full h-full object-cover transform scale-x-[-1]"
                />
                
                <div className="absolute top-4 right-4 w-44 h-32 bg-neutral-900/90 border-2 border-[#ef4d23] rounded-2xl overflow-hidden shadow-2xl flex items-center justify-center backdrop-blur-md">
                  <div className="text-center space-y-1">
                    <div className="w-10 h-10 rounded-full bg-[#ef4d23] text-white flex items-center justify-center font-bold text-xs mx-auto ring-2 ring-white/20">
                      {activeCall.channelName.substring(0, 2).toUpperCase()}
                    </div>
                    <p className="text-[10px] text-white font-bold">{activeCall.channelName.split(" ")[0]}</p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center space-y-6 p-8">
                <div className="relative inline-block">
                  <div className="w-32 h-32 rounded-full bg-gradient-to-tr from-[#ef4d23] to-[#ff7a59] text-white flex items-center justify-center font-extrabold text-4xl shadow-xl ring-8 ring-[#ef4d23]/20 animate-pulse">
                    {activeCall.channelName.substring(0, 2).toUpperCase()}
                  </div>
                  <div className="absolute -bottom-2 -right-2 bg-neutral-900 border border-[#ef4d23] p-2 rounded-full text-[#ef4d23]">
                    {activeCall.type === "video" ? <VideoOff className="h-5 w-5" /> : <Mic className="h-5 w-5" />}
                  </div>
                </div>

                <div className="space-y-1">
                  <h2 className="text-2xl font-extrabold text-white">{activeCall.channelName}</h2>
                  <p className="text-xs text-neutral-400 font-mono">
                    {activeCall.status === "outgoing" ? "Ringing..." : "Connected Audio Stream"}
                  </p>
                </div>

                <div className="flex items-center justify-center gap-1.5 h-8">
                  {[40, 70, 100, 60, 90, 50, 80, 30].map((h, idx) => (
                    <div
                      key={idx}
                      className="w-1.5 bg-[#ef4d23] rounded-full animate-pulse"
                      style={{ height: `${h}%`, animationDelay: `${idx * 0.15}s` }}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Control Toolbar */}
          <div className="w-full max-w-lg bg-neutral-900/90 border border-white/15 rounded-3xl p-4 flex items-center justify-around shadow-2xl backdrop-blur-2xl z-10">
            <button
              type="button"
              onClick={handleToggleMic}
              className={`p-4 rounded-2xl transition-all cursor-pointer shadow-md ${
                activeCall.isMicMuted ? "bg-red-500/20 border border-red-500 text-red-400" : "bg-white/10 hover:bg-white/20 text-white"
              }`}
              title={activeCall.isMicMuted ? "Unmute Mic" : "Mute Mic"}
            >
              {activeCall.isMicMuted ? <MicOff className="h-6 w-6" /> : <Mic className="h-6 w-6" />}
            </button>

            {activeCall.type === "video" && (
              <button
                type="button"
                onClick={handleToggleVideo}
                className={`p-4 rounded-2xl transition-all cursor-pointer shadow-md ${
                  activeCall.isVideoOff ? "bg-red-500/20 border border-red-500 text-red-400" : "bg-white/10 hover:bg-white/20 text-white"
                }`}
                title={activeCall.isVideoOff ? "Turn On Camera" : "Turn Off Camera"}
              >
                {activeCall.isVideoOff ? <VideoOff className="h-6 w-6" /> : <VideoIcon className="h-6 w-6" />}
              </button>
            )}

            <button
              type="button"
              onClick={handleToggleScreenShare}
              className={`p-4 rounded-2xl transition-all cursor-pointer shadow-md ${
                activeCall.isScreenSharing ? "bg-[#ef4d23] text-white shadow-md" : "bg-white/10 hover:bg-white/20 text-neutral-300 hover:text-white"
              }`}
              title="Share Screen"
            >
              <Monitor className="h-6 w-6" />
            </button>

            <button
              type="button"
              onClick={handleEndCall}
              className="p-4 rounded-2xl bg-red-600 hover:bg-red-700 text-white transition-all shadow-xl hover:scale-105 cursor-pointer"
              title="End Call"
            >
              <PhoneOff className="h-6 w-6" />
            </button>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* AUTHENTICATION LOGIN MODAL OVERLAY */}
      {/* ========================================================================= */}
      {!authSession?.isLoggedIn && (
        <div className="absolute inset-0 z-50 bg-[#121318]/95 backdrop-blur-2xl flex items-center justify-center p-6 animate-in fade-in">
          <div className="bg-[#1a1b24] border border-white/15 rounded-3xl max-w-md w-full p-8 shadow-2xl space-y-6 text-white isolate relative">
            <div className="text-center space-y-2">
              <div className="w-20 h-20 rounded-3xl bg-white/10 p-3 flex items-center justify-center mx-auto border border-white/25 shadow-xl overflow-hidden">
                <img src="/lumen-and-co-logo.png" alt="Lumen & Co Logo" className="w-full h-full object-contain brightness-0 invert scale-110" />
              </div>
              <h2 className="text-2xl font-extrabold tracking-tight text-white">Lumen & Co Messenger</h2>
              <p className="text-xs text-neutral-400">
                Login with your assigned <span className="text-[#0f83fe] font-mono font-bold">EMP-xxx</span> or <span className="text-amber-400 font-mono font-bold">CLT-xxx</span> identity code
              </p>
            </div>

            {loginError && (
              <div className="p-3 bg-red-500/15 border border-red-500/30 rounded-xl text-xs text-red-300 font-medium text-center">
                {loginError}
              </div>
            )}

            <form onSubmit={handlePerformLogin} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-[11px] font-extrabold text-neutral-300 uppercase tracking-wider flex items-center gap-1.5">
                  <Tag className="h-3.5 w-3.5 text-[#0f83fe]" />
                  <span>Employee / Client Identity Code</span>
                </label>
                <input
                  type="text"
                  placeholder="e.g. EMP-100 or CLT-101"
                  value={loginCodeInput}
                  onChange={(e) => {
                    setLoginCodeInput(e.target.value);
                    setLoginError(null);
                  }}
                  className="w-full bg-[#232532] border border-white/15 rounded-2xl px-4 py-3 text-sm text-white placeholder:text-neutral-500 focus:ring-2 focus:ring-[#0f83fe] outline-none font-mono uppercase font-bold"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[11px] font-extrabold text-neutral-300 uppercase tracking-wider flex items-center justify-between">
                  <span className="flex items-center gap-1.5">
                    <Lock className="h-3.5 w-3.5 text-[#0f83fe]" />
                    <span>Common Access Password</span>
                  </span>
                  <span className="text-[10px] text-neutral-400 font-mono">Pass: 12345678</span>
                </label>
                <input
                  type="password"
                  placeholder="Enter 12345678"
                  value={loginPasswordInput}
                  onChange={(e) => {
                    setLoginPasswordInput(e.target.value);
                    setLoginError(null);
                  }}
                  className="w-full bg-[#232532] border border-white/15 rounded-2xl px-4 py-3 text-sm text-white placeholder:text-neutral-500 focus:ring-2 focus:ring-[#0f83fe] outline-none font-mono"
                  required
                />
              </div>

              <button
                type="submit"
                className="w-full bg-[#0f83fe] hover:bg-[#0075f0] text-white font-extrabold text-sm py-3.5 rounded-2xl shadow-md transition-all cursor-pointer flex items-center justify-center gap-2 mt-2"
              >
                <Key className="h-4 w-4" />
                <span>Login with Identity Code →</span>
              </button>
            </form>

            {/* Quick Demo 1-Click Login Chips */}
            <div className="pt-2 border-t border-white/10 space-y-2">
              <p className="text-[10px] font-extrabold text-neutral-400 uppercase tracking-wider text-center">
                ⚡ 1-Click Quick Demo Pass (Pass: 12345678)
              </p>
              <div className="flex flex-wrap gap-1.5 justify-center text-[11px]">
                <button
                  type="button"
                  onClick={() => {
                    setLoginCodeInput("EMP-100");
                    setLoginPasswordInput("12345678");
                    setLoginError(null);
                  }}
                  className="bg-[#0f83fe]/20 hover:bg-[#0f83fe]/40 border border-[#0f83fe]/50 text-[#0f83fe] font-mono font-extrabold px-2.5 py-1 rounded-xl cursor-pointer"
                >
                  EMP-100 (Sahit • Founder)
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setLoginCodeInput("EMP-101");
                    setLoginPasswordInput("12345678");
                    setLoginError(null);
                  }}
                  className="bg-purple-500/20 hover:bg-purple-500/40 border border-purple-500/50 text-purple-300 font-mono font-extrabold px-2.5 py-1 rounded-xl cursor-pointer"
                >
                  EMP-101 (Alex • Ops)
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setLoginCodeInput("CLT-101");
                    setLoginPasswordInput("12345678");
                    setLoginError(null);
                  }}
                  className="bg-amber-500/20 hover:bg-amber-500/40 border border-amber-500/50 text-amber-300 font-mono font-extrabold px-2.5 py-1 rounded-xl cursor-pointer"
                >
                  CLT-101 (Northbeam • Client)
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function getRoleBadgeLabel(role: UserRoleType): string {
  switch (role) {
    case "founder":
      return "Founder & Super Admin";
    case "admin":
      return "Ops Admin";
    case "ops_manager":
      return "Ops Manager";
    case "account_manager":
      return "Account Manager";
    case "designer":
      return "Creative Director";
    case "content_writer":
      return "Senior Copywriter";
    case "ad_specialist":
      return "Performance Ad Specialist";
    case "client":
      return "Client Partner";
    default:
      return "Team Member";
  }
}
