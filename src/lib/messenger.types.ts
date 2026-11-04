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
    description: "Lumen & Co Core Team announcements and updates",
    unread_count: 0,
    members_count: 2,
    last_message: "Welcome to Lumen & Co internal operations hub.",
    last_message_time: "Just now",
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
    timestamp: new Date().toISOString(),
    is_read: true,
  },
];

