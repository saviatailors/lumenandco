export type UserRoleType =
  | "founder"
  | "admin"
  | "ops_manager"
  | "account_manager"
  | "designer"
  | "content_writer"
  | "ad_specialist"
  | "client";

export interface ChatAttachment {
  id: string;
  name: string;
  url: string;
  size: string;
  type: "image" | "pdf" | "video" | "doc";
}

export interface ChatMessage {
  id: string;
  channel_id: string;
  sender_id: string;
  sender_code?: string; // Employee Code e.g. "EMP-100" or Client Code e.g. "CLT-101"
  sender_name: string;
  sender_role: UserRoleType;
  sender_avatar?: string;
  content: string;
  attachments?: ChatAttachment[];
  reactions?: string[];
  timestamp: string;
  is_read: boolean;
}

export interface ChatChannel {
  id: string;
  code?: string; // Unique Individual Employee Code (EMP-xxx) or Client Code (CLT-xxx)
  name: string;
  type: "internal_group" | "direct_message" | "client_support";
  client_id?: string;
  client_name?: string;
  description: string;
  avatar?: string;
  unread_count: number;
  members_count: number;
  last_message?: string;
  last_message_time?: string;
}

export const INITIAL_CHAT_CHANNELS: ChatChannel[] = [
  {
    id: "channel-ai-copilot",
    code: "AI-COPILOT",
    name: "⚡ Lumen Creative AI Copilot",
    type: "direct_message",
    description: "AI Ad Writer, UGC Script Generator & ROAS Optimizer",
    unread_count: 0,
    members_count: 1,
    last_message: "⚡ Ready to scale ad creatives and write UGC scripts! Click a preset or type a prompt.",
    last_message_time: "Just now",
  },
  {
    id: "channel-general",
    code: "INTERNAL",
    name: "📢 #general-announcements",
    type: "internal_group",
    description: "Lumen & Co Core Team announcements, project milestones and updates",
    unread_count: 1,
    members_count: 6,
    last_message: "Q4 Meta ROAS across all institutional clients just crossed 4.8x average! Huge win team 🚀",
    last_message_time: "10:30 AM",
  },
  {
    id: "channel-growth",
    code: "GROWTH",
    name: "🎯 #performance-marketing",
    type: "internal_group",
    description: "Meta Ads, Google PMax scaling, audience signals & CPL optimization",
    unread_count: 2,
    members_count: 4,
    last_message: "Scalable lookalike audience 2% tested for Hyderabad campus admissions with ₹180 CPL.",
    last_message_time: "11:15 AM",
  },
  {
    id: "channel-creatives",
    code: "CREATIVE",
    name: "🎨 #creatives-and-video",
    type: "internal_group",
    description: "High-converting UGC reels, script reviews, motion assets & video drafts",
    unread_count: 0,
    members_count: 5,
    last_message: "New 9:16 campus walkthrough reel rendered in 4K with dynamic motion typography.",
    last_message_time: "Yesterday",
  },
  {
    id: "channel-dm-priya",
    code: "EMP-101",
    name: "Priya Sharma",
    type: "direct_message",
    description: "Sr. Performance Ad Strategist",
    unread_count: 1,
    members_count: 2,
    last_message: "I've reviewed the Google Ads budget allocation for Oakridge. Ready for approval.",
    last_message_time: "12:05 PM",
  },
  {
    id: "channel-dm-vikram",
    code: "EMP-102",
    name: "Vikram Mehta",
    type: "direct_message",
    description: "Creative Director & Video Lead",
    unread_count: 0,
    members_count: 2,
    last_message: "Rendered the color-graded cut of the principal interview. Check the drive link!",
    last_message_time: "Yesterday",
  },
  {
    id: "channel-dm-ananya",
    code: "EMP-103",
    name: "Ananya Rao",
    type: "direct_message",
    description: "Client Success & Operations Lead",
    unread_count: 0,
    members_count: 2,
    last_message: "All 5 client monthly performance reviews have been sent and scheduled.",
    last_message_time: "Oct 28",
  },
  {
    id: "channel-clt-oakridge",
    code: "CLT-101",
    name: "Oakridge International School",
    type: "client_support",
    client_id: "client-1",
    client_name: "Oakridge International School",
    description: "Dedicated Retainer Support • Admissions Campaign",
    unread_count: 0,
    members_count: 4,
    last_message: "Thanks Sahit! The latest parent inquiry numbers for the Gachibowli campus look fantastic.",
    last_message_time: "1:45 PM",
  },
  {
    id: "channel-clt-chirec",
    code: "CLT-102",
    name: "Chirec International School",
    type: "client_support",
    client_id: "client-2",
    client_name: "Chirec International School",
    description: "Dedicated Retainer Support • Growth Retainer",
    unread_count: 0,
    members_count: 4,
    last_message: "We approved the Q4 ad creatives. Please push live as scheduled on Monday.",
    last_message_time: "Oct 27",
  },
  {
    id: "channel-clt-silveroaks",
    code: "CLT-103",
    name: "Silver Oaks International",
    type: "client_support",
    client_id: "client-3",
    client_name: "Silver Oaks International",
    description: "Dedicated Retainer Support • Brand Awareness & Lead Gen",
    unread_count: 0,
    members_count: 4,
    last_message: "Inquiry forms connected to CRM and WhatsApp auto-responder is active.",
    last_message_time: "Oct 26",
  },
];

export const INITIAL_CHAT_MESSAGES: ChatMessage[] = [
  // 1. AI Copilot
  {
    id: "msg-ai-1",
    channel_id: "channel-ai-copilot",
    sender_id: "ai-copilot-bot",
    sender_code: "AI-COPILOT",
    sender_name: "⚡ Lumen Creative AI Copilot",
    sender_role: "ad_specialist",
    content: "⚡ Welcome to Lumen Creative AI Copilot!\n\nI can help you craft high-converting Meta Ad angles, generate viral UGC reel scripts, draft institutional client proposals, or calculate ROAS metrics.\n\nClick any of the quick prompt action buttons below or ask me anything directly!",
    timestamp: new Date(Date.now() - 3600000 * 2).toISOString(),
    is_read: true,
  },

  // 2. #general-announcements
  {
    id: "msg-gen-1",
    channel_id: "channel-general",
    sender_id: "staff-6",
    sender_code: "EMP-100",
    sender_name: "Sahit Sai",
    sender_role: "founder",
    content: "Team, quick update on Q4 benchmarks: we have achieved an average blended ROAS of 4.8x across all active retainer clients! Exceptional execution from both performance and creative squads. Let's keep this momentum! 🔥",
    timestamp: new Date(Date.now() - 3600000 * 5).toISOString(),
    reactions: ["🔥", "🚀", "❤️"],
    is_read: true,
  },
  {
    id: "msg-gen-2",
    channel_id: "channel-general",
    sender_id: "staff-1",
    sender_code: "EMP-101",
    sender_name: "Priya Sharma",
    sender_role: "ad_specialist",
    content: "The CPL optimization on Instagram Stories cut cost-per-lead by 28% for our premier schools. Scaling budgets this week!",
    timestamp: new Date(Date.now() - 3600000 * 4).toISOString(),
    reactions: ["👍", "💡"],
    is_read: true,
  },
  {
    id: "msg-gen-3",
    channel_id: "channel-general",
    sender_id: "staff-2",
    sender_code: "EMP-102",
    sender_name: "Vikram Mehta",
    sender_role: "designer",
    content: "Batch 4 of dynamic campus tour UGC video cuts are being uploaded to the Delivery Hub for client sign-off today.",
    timestamp: new Date(Date.now() - 3600000 * 3).toISOString(),
    reactions: ["🚀"],
    is_read: true,
  },

  // 3. #performance-marketing
  {
    id: "msg-perf-1",
    channel_id: "channel-growth",
    sender_id: "staff-1",
    sender_code: "EMP-101",
    sender_name: "Priya Sharma",
    sender_role: "ad_specialist",
    content: "Targeting report: We transitioned top campaigns to Advantage+ audience expansion with high-income parent affinity overlays. Immediate 35% lift in qualified form submissions.",
    timestamp: new Date(Date.now() - 3600000 * 2.5).toISOString(),
    is_read: true,
  },
  {
    id: "msg-perf-2",
    channel_id: "channel-growth",
    sender_id: "staff-6",
    sender_code: "EMP-100",
    sender_name: "Sahit Sai",
    sender_role: "founder",
    content: "Approved. Increase daily spend by 20% on the top 2 performing creative variations. Make sure Google PMax search terms are also synced with the CRM lead tags.",
    timestamp: new Date(Date.now() - 3600000 * 1.5).toISOString(),
    reactions: ["👍"],
    is_read: true,
  },

  // 4. #creatives-and-video
  {
    id: "msg-cr-1",
    channel_id: "channel-creatives",
    sender_id: "staff-2",
    sender_code: "EMP-102",
    sender_name: "Vikram Mehta",
    sender_role: "designer",
    content: "Here is the revised cut for the Admissions Spotlight campaign. Color graded in Rec.709 with subtitle animations suited for silent mobile feeds.",
    attachments: [
      {
        id: "att-cut-1",
        name: "Oakridge_Spotlight_Cut_v2.mp4",
        url: "#",
        size: "24.5 MB",
        type: "video",
      },
    ],
    timestamp: new Date(Date.now() - 3600000 * 24).toISOString(),
    reactions: ["🔥"],
    is_read: true,
  },

  // 5. Priya Sharma DM
  {
    id: "msg-dm-p1",
    channel_id: "channel-dm-priya",
    sender_id: "staff-1",
    sender_code: "EMP-101",
    sender_name: "Priya Sharma",
    sender_role: "ad_specialist",
    content: "Hey Sahit! I've reviewed the Google Ads budget allocation for Oakridge. Ready for your sign-off before we push live tomorrow.",
    timestamp: new Date(Date.now() - 3600000 * 1.2).toISOString(),
    is_read: false,
  },

  // 6. Oakridge Support Channel
  {
    id: "msg-oak-1",
    channel_id: "channel-clt-oakridge",
    sender_id: "client-1",
    sender_code: "CLT-101",
    sender_name: "Dr. K. V. Rao (Oakridge)",
    sender_role: "client",
    content: "Good morning Sahit and team! We reviewed the weekly admissions report in our portal. The caliber of inquiries from the recent Meta campaign has been outstanding.",
    timestamp: new Date(Date.now() - 3600000 * 3).toISOString(),
    reactions: ["❤️"],
    is_read: true,
  },
  {
    id: "msg-oak-2",
    channel_id: "channel-clt-oakridge",
    sender_id: "staff-6",
    sender_code: "EMP-100",
    sender_name: "Sahit Sai",
    sender_role: "founder",
    content: "Thank you Dr. Rao! We are tracking 42 verified parent campus tour bookings this week. Next week's UGC video series will spotlight your IB STEM labs.",
    timestamp: new Date(Date.now() - 3600000 * 2).toISOString(),
    reactions: ["👍", "🔥"],
    is_read: true,
  },
];

