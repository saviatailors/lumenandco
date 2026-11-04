import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import nodemailer from "nodemailer";
import fs from "node:fs";
import path from "node:path";

/**
 * Robust environment variable resolver that reads process.env, 
 * parses .env.local dynamically from disk, and provides verified defaults.
 */
function getEnvVar(name: string, fallback: string = ""): string {
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
          if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
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
 * High-reliability real-time email dispatcher.
 * Intelligently routes:
 * - If sender is @gmail.com or preferredProvider is "smtp" -> Uses Gmail SMTP (Google SSL Socket)
 * - If sender is @lumenandco.in or preferredProvider is "resend" -> Uses Resend API
 * - Provides seamless automatic fallback if either service encounters an error.
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
      senderAddress && !senderAddress.includes("@gmail.com")
        ? senderAddress
        : verifiedDomainFrom;

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

export const sendRealtimeEmail = createServerFn({ method: "POST" })
  .validator((data: {
    to: string;
    subject: string;
    html: string;
    text?: string;
    from?: string;
    replyTo?: string;
    preferredProvider?: "resend" | "smtp";
  }) =>
    z
      .object({
        to: z.string().email("Invalid recipient email address"),
        subject: z.string().min(1, "Subject line is required"),
        html: z.string().min(1, "HTML content is required"),
        text: z.string().optional(),
        from: z.string().optional(),
        replyTo: z.string().optional(),
        preferredProvider: z.enum(["resend", "smtp"]).optional(),
      })
      .parse(data),
  )
  .handler(async ({ data }) => {
    try {
      const result = await sendEmailMessage({
        to: data.to,
        subject: data.subject,
        html: data.html,
        text: data.text,
        from: data.from,
        replyTo: data.replyTo,
        preferredProvider: data.preferredProvider,
      });

      return {
        success: true,
        provider: result.provider,
        messageId: result.messageId,
        message: result.message,
      };
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : String(err);
      throw new Error(`Real-time email dispatch failed: ${errorMessage}`);
    }
  });

/**
 * Sends automated confirmation email to client directly from sahitsai6@gmail.com
 * and instant lead alert to team / admin.
 */
export const sendLeadAutomationEmails = createServerFn({ method: "POST" })
  .validator((data: {
    name: string;
    email: string;
    phone?: string;
    company?: string;
    website?: string;
    budget?: string;
    goal?: string;
    message?: string;
  }) =>
    z
      .object({
        name: z.string().min(1),
        email: z.string().email(),
        phone: z.string().optional(),
        company: z.string().optional(),
        website: z.string().optional(),
        budget: z.string().optional(),
        goal: z.string().optional(),
        message: z.string().optional(),
      })
      .parse(data),
  )
  .handler(async ({ data }) => {
    const results = { clientDelivered: false, teamDelivered: false };
    const adminEmail = getEnvVar("SMTP_USER", "sahitsai6@gmail.com");

    // 1. Send Auto-Confirmation to Client DIRECTLY FROM sahitsai6@gmail.com
    try {
      const clientRes = await sendEmailMessage({
        from: `Sahit Sai | Lumen & Co <${adminEmail}>`,
        to: data.email,
        replyTo: adminEmail,
        preferredProvider: "smtp",
        subject: `✨ Growth Audit Inquiry Received — Lumen & Co`,
        html: `
          <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 28px; background: #ffffff; border: 1px solid #e5e5e5; border-radius: 20px;">
            <div style="text-align: center; margin-bottom: 24px;">
              <h2 style="font-size: 24px; font-weight: 800; color: #111111; margin: 0;">Lumen &amp; Co</h2>
              <p style="color: #ef4d23; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.1em; margin: 4px 0 0 0;">Performance Growth Agency</p>
            </div>
            
            <p style="font-size: 15px; color: #333333; line-height: 1.6;">Hello <strong>${data.name}</strong>,</p>
            
            <p style="font-size: 14px; color: #555555; line-height: 1.6;">
              Thank you for reaching out to <strong>Lumen &amp; Co</strong>. I have personally received your inquiry regarding <strong>${data.goal || "Growth Audit & Performance Scaling"}</strong>.
            </p>
            
            <div style="background: #f9f9fb; border-left: 4px solid #ef4d23; padding: 16px; border-radius: 8px; margin: 20px 0;">
              <p style="margin: 0 0 6px 0; font-size: 13px; color: #222222; font-weight: 600;">Inquiry Details Received:</p>
              <ul style="margin: 0; padding-left: 18px; font-size: 13px; color: #555555; line-height: 1.6;">
                <li><strong>Company:</strong> ${data.company || "Not specified"}</li>
                <li><strong>Target Goal:</strong> ${data.goal || "Paid Social / Video Creatives"}</li>
                <li><strong>Monthly Budget:</strong> ${data.budget || "Discuss on call"}</li>
              </ul>
            </div>
            
            <p style="font-size: 14px; color: #555555; line-height: 1.6;">
              Our growth strategists and I are reviewing your brand and digital channels to prepare actionable performance insights. I will personally reach out to you within 24 hours.
            </p>

            <div style="margin-top: 24px; padding: 16px; background: #fafaf9; border-radius: 12px; border: 1px solid #f0f0ee;">
              <p style="margin: 0; font-size: 13px; font-weight: 700; color: #1c1917;">Sahit Sai</p>
              <p style="margin: 2px 0 0 0; font-size: 12px; color: #78716c;">Founder &amp; Growth Partner • Lumen &amp; Co</p>
              <p style="margin: 4px 0 0 0; font-size: 12px; color: #ef4d23;">
                <a href="mailto:${adminEmail}" style="color: #ef4d23; text-decoration: none;">${adminEmail}</a> • 
                <a href="https://www.lumenandco.in" style="color: #ef4d23; text-decoration: none;">www.lumenandco.in</a>
              </p>
            </div>
            
            <div style="margin-top: 28px; padding-top: 20px; border-top: 1px solid #eeeeee; text-align: center; color: #888888; font-size: 12px;">
              <p style="margin: 0;">Lumen &amp; Co Digital Private Limited</p>
              <p style="margin: 4px 0 0 0;">Hyderabad &amp; Visakhapatnam • India</p>
            </div>
          </div>
        `,
      });
      results.clientDelivered = clientRes.success;
    } catch (e) {
      console.warn("Client email auto-responder notice:", e);
    }

    // 2. Send Instant Alert to Admin / Sahit (sahitsai6@gmail.com)
    try {
      const teamRes = await sendEmailMessage({
        from: "Lumen Lead Alerts <hello@lumenandco.in>",
        to: adminEmail,
        replyTo: data.email,
        subject: `🔥 New Inbound Website Lead: ${data.name} (${data.company || "Direct Inquiry"})`,
        html: `
          <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; background: #ffffff; border: 1px solid #e0e0e0; border-radius: 16px;">
            <div style="background: #ef4d23; color: white; padding: 12px 16px; border-radius: 12px; margin-bottom: 20px;">
              <h3 style="margin: 0; font-size: 16px;">🔥 High-Priority Website Lead Captured</h3>
              <p style="margin: 4px 0 0 0; font-size: 12px; opacity: 0.9;">New prospect submitted the contact form.</p>
            </div>
            
            <table style="width: 100%; font-size: 13px; line-height: 1.8; color: #333;">
              <tr><td style="width: 120px; font-weight: bold; color: #666;">Prospect Name:</td><td><strong>${data.name}</strong></td></tr>
              <tr><td style="font-weight: bold; color: #666;">Email Address:</td><td><a href="mailto:${data.email}">${data.email}</a></td></tr>
              <tr><td style="font-weight: bold; color: #666;">Phone:</td><td><a href="tel:${data.phone || ""}">${data.phone || "Not provided"}</a></td></tr>
              <tr><td style="font-weight: bold; color: #666;">Company:</td><td>${data.company || "Not provided"}</td></tr>
              <tr><td style="font-weight: bold; color: #666;">Website:</td><td>${data.website ? `<a href="${data.website}">${data.website}</a>` : "Not provided"}</td></tr>
              <tr><td style="font-weight: bold; color: #666;">Budget:</td><td><span style="background: #eef2ff; color: #4338ca; padding: 2px 8px; border-radius: 6px; font-weight: bold;">${data.budget || "N/A"}</span></td></tr>
              <tr><td style="font-weight: bold; color: #666;">Goal:</td><td>${data.goal || "Growth Audit"}</td></tr>
              <tr><td style="font-weight: bold; color: #666; vertical-align: top;">Message:</td><td>${data.message || "No custom message"}</td></tr>
            </table>
            
            <div style="margin-top: 24px; text-align: center;">
              <a href="https://www.lumenandco.in/sahit" style="display: inline-block; background: #111111; color: #ffffff; padding: 12px 24px; border-radius: 100px; text-decoration: none; font-size: 13px; font-weight: bold;">Open CRM Command Center →</a>
            </div>
          </div>
        `,
      });
      results.teamDelivered = teamRes.success;
    } catch (e) {
      console.warn("Team email notification alert notice:", e);
    }

    return { success: true, results };
  });
