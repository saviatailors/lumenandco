import nodemailer from "nodemailer";
import fs from "node:fs";
import path from "node:path";
import { requireAuth, isAdminEmail } from "@/lib/supabase-admin";

/**
 * Robust environment variable resolver that reads process.env,
 * parses .env.local dynamically from disk, and provides verified defaults.
 */
export function getEnvVar(name: string, fallback: string = ""): string {
  if (typeof process !== "undefined" && process.env && process.env[name]) {
    return process.env[name]!.trim();
  }

  try {
    const cwd = typeof process !== "undefined" && process.cwd ? process.cwd() : ".";
    const localEnvPath = path.resolve(cwd, ".env.local");
    if (fs.existsSync(localEnvPath)) {
      const content = fs.readFileSync(localEnvPath, "utf-8");
      for (const line of content.split("\n")) {
        const match = line.match(/^\s*([\w.-]+)\s*=\s*(.*)?\s*$/);
        if (match && match[1] === name) {
          let val = (match[2] || "").trim();
          if (
            (val.startsWith('"') && val.endsWith('"')) ||
            (val.startsWith("'") && val.endsWith("'"))
          ) {
            val = val.slice(1, -1);
          }
          if (val) return val.trim();
        }
      }
    }
  } catch {
    // Ignore file read error in edge/browser runtimes
  }

  // Default fallbacks for non-secret configuration
  if (name === "SMTP_USER") return "sahitsai6@gmail.com";
  if (name === "RESEND_FROM_EMAIL") return "Lumen & Co <hello@lumenandco.in>";

  return fallback;
}

/**
 * HTML Entity Encoder to prevent HTML Injection & Content Spoofing in email templates
 */
export function escapeHtml(str?: string): string {
  if (!str) return "";
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

/** In-memory sliding-window rate limiter for public email triggers */
const leadRateLimitStore = new Map<string, { count: number; resetAt: number }>();

export function checkRateLimit(
  key: string,
  maxLimit: number = 4,
  windowMs: number = 10 * 60 * 1000,
): boolean {
  const now = Date.now();
  const item = leadRateLimitStore.get(key);
  if (!item || now > item.resetAt) {
    leadRateLimitStore.set(key, { count: 1, resetAt: now + windowMs });
    return true;
  }
  if (item.count >= maxLimit) {
    return false;
  }
  item.count += 1;
  return true;
}

export interface SendMailOptions {
  to: string | string[];
  subject: string;
  html: string;
  text?: string;
  from?: string;
  replyTo?: string;
  preferredProvider?: "resend" | "smtp";
}

/**
 * High-reliability real-time email dispatcher (server-only).
 */
export async function sendEmailMessage(options: SendMailOptions): Promise<{
  success: boolean;
  provider: "resend" | "smtp";
  messageId: string;
  message: string;
}> {
  const toList = Array.isArray(options.to) ? options.to : [options.to];
  const fromEmail = getEnvVar("SMTP_USER", "sahitsai6@gmail.com");
  const isGmailSender = Boolean(options.from && options.from.includes("@gmail.com"));
  const preferSmtp = options.preferredProvider === "smtp" || isGmailSender;

  const resendApiKey = getEnvVar("RESEND_API_KEY");
  const verifiedDomainFrom = getEnvVar("RESEND_FROM_EMAIL", "Lumen & Co <hello@lumenandco.in>");

  const rawPass = getEnvVar("SMTP_PASS") || getEnvVar("GMAIL_APP_PASSWORD");
  const smtpPass = rawPass.replace(/\s+/g, "");
  const smtpHost = getEnvVar("SMTP_HOST", "smtp.gmail.com");
  const smtpPort = Number(getEnvVar("SMTP_PORT", "465"));

  const errors: string[] = [];

  // 1. Gmail SMTP Dispatcher
  const trySmtp = async (senderAddress?: string) => {
    if (!smtpPass) {
      errors.push("Gmail App Password not found");
      return null;
    }
    try {
      const transporter = nodemailer.createTransport({
        host: smtpHost,
        port: smtpPort,
        secure: smtpPort === 465,
        auth: {
          user: fromEmail,
          pass: smtpPass,
        },
      });

      const finalFrom = senderAddress || options.from || `Sahit Sai | Lumen & Co <${fromEmail}>`;
      const info = await transporter.sendMail({
        from: finalFrom,
        to: options.to,
        subject: options.subject,
        text: options.text || options.html.replace(/<[^>]*>?/gm, ""),
        html: options.html,
        replyTo: options.replyTo || fromEmail,
      });

      return {
        success: true as const,
        provider: "smtp" as const,
        messageId: info.messageId,
        message: `Delivered live via Gmail SMTP (${finalFrom}) to ${toList.join(", ")}`,
      };
    } catch (smtpErr) {
      const msg = smtpErr instanceof Error ? smtpErr.message : String(smtpErr);
      console.warn("[SMTP Notice] Nodemailer failed:", msg);
      errors.push(`SMTP: ${msg}`);
      return null;
    }
  };

  // 2. Resend REST API Dispatcher
  const tryResend = async (senderAddress?: string) => {
    if (!resendApiKey) {
      errors.push("Resend API Key not found");
      return null;
    }
    const resendFrom =
      senderAddress && !senderAddress.includes("@gmail.com") ? senderAddress : verifiedDomainFrom;

    try {
      const response = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${resendApiKey.trim()}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from: resendFrom,
          to: toList,
          subject: options.subject,
          html: options.html,
          text: options.text || options.html.replace(/<[^>]*>?/gm, ""),
          reply_to: options.replyTo || fromEmail,
        }),
      });

      if (response.ok) {
        const json = (await response.json()) as { id?: string };
        return {
          success: true as const,
          provider: "resend" as const,
          messageId: json.id || `resend_${Date.now()}`,
          message: `Delivered live via Resend (${resendFrom}) to ${toList.join(", ")}`,
        };
      } else {
        const errText = await response.text();
        console.warn(`[Resend Notice] HTTP ${response.status}:`, errText);
        errors.push(`Resend HTTP ${response.status}: ${errText}`);
        return null;
      }
    } catch (fetchErr) {
      const msg = fetchErr instanceof Error ? fetchErr.message : String(fetchErr);
      console.warn("[Resend Notice] Connection failed:", msg);
      errors.push(`Resend: ${msg}`);
      return null;
    }
  };

  // Dispatch in prioritized order
  if (preferSmtp) {
    const smtpRes = await trySmtp();
    if (smtpRes) return smtpRes;

    const resendRes = await tryResend();
    if (resendRes) return resendRes;
  } else {
    const resendRes = await tryResend(options.from);
    if (resendRes) return resendRes;

    const smtpRes = await trySmtp();
    if (smtpRes) return smtpRes;
  }

  throw new Error(`Real-time email dispatch failed: ${errors.join(" | ")}`);
}

export { requireAuth, isAdminEmail };
