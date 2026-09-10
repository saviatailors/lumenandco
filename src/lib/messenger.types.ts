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

export const INITIAL_CHAT_CHANNELS: ChatChannel[] = [];
export const INITIAL_CHAT_MESSAGES: ChatMessage[] = [];

