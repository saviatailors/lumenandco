import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import nodemailer from "nodemailer";

// Attempt to load .env.local if available in local Node environment
try {
  if (typeof process !== "undefined" && typeof (process as unknown as { loadEnvFile?: (path: string) => void }).loadEnvFile === "function") {
    (process as unknown as { loadEnvFile: (path: string) => void }).loadEnvFile(".env.local");
  }
} catch {
  // .env.local already loaded or non-existent in production
}

export const sendRealtimeEmail = createServerFn({ method: "POST" })
  .validator((data: { to: string; subject: string; html: string; text?: string }) =>
    z
      .object({
        to: z.string().email("Invalid recipient email address"),
        subject: z.string().min(1, "Subject line is required"),
        html: z.string().min(1, "HTML content is required"),
        text: z.string().optional(),
      })
      .parse(data),
  )
  .handler(async ({ data }) => {
    const fromEmail = process.env["SMTP_USER"] || "sahitsai6@gmail.com";
    const rawPass = process.env["SMTP_PASS"] || process.env["GMAIL_APP_PASSWORD"] || "";
    const smtpPass = rawPass.replace(/\s+/g, "");
    const smtpHost = process.env["SMTP_HOST"] || "smtp.gmail.com";
    const smtpPort = Number(process.env["SMTP_PORT"] || 465);

    if (!smtpPass) {
      console.warn(
        `[Email Dispatcher] SMTP_PASS not set. Logging email payload from ${fromEmail} to ${data.to}.`,
      );
      return {
        success: true,
        mock: true,
        message: `Real-time mail payload queued from ${fromEmail} to ${data.to}. Add GMAIL_APP_PASSWORD / SMTP_PASS in .env to enable direct socket transmission.`,
        details: {
          from: fromEmail,
          to: data.to,
          subject: data.subject,
          timestamp: new Date().toISOString(),
        },
      };
    }

    const transporter = nodemailer.createTransport({
      host: smtpHost,
      port: smtpPort,
      secure: smtpPort === 465,
      auth: {
        user: fromEmail,
        pass: smtpPass,
      },
    });

    try {
      const info = await transporter.sendMail({
        from: `Lumen & Co Agency <${fromEmail}>`,
        to: data.to,
        subject: data.subject,
        text: data.text || data.html.replace(/<[^>]*>?/gm, ""),
        html: data.html,
      });

      return {
        success: true,
        mock: false,
        messageId: info.messageId,
        message: `Real-time email successfully delivered from ${fromEmail} to ${data.to}!`,
      };
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : String(err);
      throw new Error(`Real-time email dispatch failed: ${errorMessage}`);
    }
  });

/**
 * Sends automated confirmation email to client and instant lead alert to team
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
    const fromEmail = process.env["SMTP_USER"] || "sahitsai6@gmail.com";
    const rawPass = process.env["SMTP_PASS"] || process.env["GMAIL_APP_PASSWORD"] || "";
    const smtpPass = rawPass.replace(/\s+/g, "");
    const smtpHost = process.env["SMTP_HOST"] || "smtp.gmail.com";
    const smtpPort = Number(process.env["SMTP_PORT"] || 465);

    if (!smtpPass) {
      return { success: false, reason: "SMTP password not configured" };
    }

    const transporter = nodemailer.createTransport({
      host: smtpHost,
      port: smtpPort,
      secure: smtpPort === 465,
      auth: { user: fromEmail, pass: smtpPass },
    });

    const results = { clientDelivered: false, teamDelivered: false };

    // 1. Send Auto-Confirmation to Client
    try {
      await transporter.sendMail({
        from: `Lumen & Co Agency <${fromEmail}>`,
        to: data.email,
        subject: `✨ Growth Audit Inquiry Received — Lumen & Co`,
        html: `
          <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 28px; background: #ffffff; border: 1px solid #e5e5e5; border-radius: 20px;">
            <div style="text-align: center; margin-bottom: 24px;">
              <h2 style="font-size: 24px; font-weight: 800; color: #111111; margin: 0;">Lumen &amp; Co</h2>
              <p style="color: #ef4d23; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.1em; margin: 4px 0 0 0;">Performance Growth Agency</p>
            </div>
            
            <p style="font-size: 15px; color: #333333; line-height: 1.6;">Hello <strong>${data.name}</strong>,</p>
            
            <p style="font-size: 14px; color: #555555; line-height: 1.6;">
              Thank you for reaching out to <strong>Lumen &amp; Co</strong>. We have successfully received your inquiry regarding <strong>${data.goal || "Growth Audit & Performance Scaling"}</strong>.
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
              Our strategic growth team is reviewing your digital channels and preparing actionable performance insights. Sahit Sai or an account specialist will reach out to you within 24 hours.
            </p>
            
            <div style="margin-top: 28px; padding-top: 20px; border-top: 1px solid #eeeeee; text-align: center; color: #888888; font-size: 12px;">
              <p style="margin: 0;">Lumen &amp; Co Digital Private Limited</p>
              <p style="margin: 4px 0 0 0;">Hyderabad &amp; Visakhapatnam • <a href="https://www.lumenandco.in" style="color: #ef4d23; text-decoration: none;">www.lumenandco.in</a></p>
            </div>
          </div>
        `,
      });
      results.clientDelivered = true;
    } catch (e) {
      console.warn("Client email auto-responder note:", e);
    }

    // 2. Send Instant Alert to You / Admin (sahitsai6@gmail.com)
    try {
      await transporter.sendMail({
        from: `Lumen Lead Alerts <${fromEmail}>`,
        to: fromEmail,
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
      results.teamDelivered = true;
    } catch (e) {
      console.warn("Team email notification alert note:", e);
    }

    return { success: true, results };
  });
