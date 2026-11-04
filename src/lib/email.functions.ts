import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireAuth } from "@/lib/supabase-admin";

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
 * Authenticated Server Function: Real-time custom email dispatch.
 * Guarded by requireAuth middleware to prevent unauthorized spam relay exploitation.
 */
export const sendRealtimeEmail = createServerFn({ method: "POST" })
  .middleware([requireAuth])
  .validator(
    (data: {
      to: string;
      subject: string;
      html: string;
      text?: string;
      from?: string;
      replyTo?: string;
      preferredProvider?: "resend" | "smtp";
      resendApiKey?: string;
      smtpPass?: string;
    }) =>
      z
        .object({
          to: z.string().email("Invalid recipient email address").max(120),
          subject: z.string().min(1, "Subject line is required").max(200),
          html: z.string().min(1, "HTML content is required").max(50000),
          text: z.string().max(20000).optional(),
          from: z.string().max(120).optional(),
          replyTo: z.string().max(120).optional(),
          preferredProvider: z.enum(["resend", "smtp"]).optional(),
          resendApiKey: z.string().max(200).optional(),
          smtpPass: z.string().max(200).optional(),
        })
        .parse(data),
  )
  .handler(async ({ data, context }) => {
    const { sendEmailMessage, isAdminEmail } = await import("./email.server");
    const claims = (context as { claims?: { email?: string } })?.claims;
    const userEmail = claims?.email?.toLowerCase();
    if (!userEmail || !(await isAdminEmail(userEmail))) {
      throw new Error(
        "Unauthorized: Only verified Lumen & Co administrators may dispatch real-time emails.",
      );
    }

    try {
      const result = await sendEmailMessage({
        to: data.to,
        subject: data.subject,
        html: data.html,
        text: data.text,
        from: data.from,
        replyTo: data.replyTo,
        preferredProvider: data.preferredProvider,
        resendApiKey: data.resendApiKey,
        smtpPass: data.smtpPass,
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
 * Public Inbound Server Function: Sends automated confirmation email to client directly from sahitsai6@gmail.com
 * and instant lead alert to team / admin.
 * Includes sliding-window rate limiting, strict length constraints, and HTML encoding.
 */
export const sendLeadAutomationEmails = createServerFn({ method: "POST" })
  .validator(
    (data: {
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
          name: z.string().min(1, "Name is required").max(100, "Name exceeds 100 characters"),
          email: z.string().email("Invalid email address").max(100, "Email exceeds 100 characters"),
          phone: z.string().max(35).optional(),
          company: z.string().max(100).optional(),
          website: z.string().max(200).optional(),
          budget: z.string().max(50).optional(),
          goal: z.string().max(100).optional(),
          message: z.string().max(2000).optional(),
        })
        .parse(data),
  )
  .handler(async ({ data }) => {
    const { sendEmailMessage, getEnvVar, escapeHtml, checkRateLimit } =
      await import("./email.server");
    const cleanEmail = data.email.toLowerCase().trim();

    // Rate limit check: max 4 auto-responses per 10 minutes per recipient address
    if (!checkRateLimit(cleanEmail, 4, 10 * 60 * 1000)) {
      console.warn(`[Lead Automation Abuse Protection] Rate limit triggered for ${cleanEmail}`);
      return {
        success: false,
        reason:
          "Rate limit reached. Please allow a few minutes before submitting additional requests.",
        results: { clientDelivered: false, teamDelivered: false },
      };
    }

    const results = { clientDelivered: false, teamDelivered: false };
    const adminEmail = getEnvVar("SMTP_USER", "sahitsai6@gmail.com");

    const safeName = escapeHtml(data.name);
    const safeCompany = escapeHtml(data.company || "Not specified");
    const safeGoal = escapeHtml(data.goal || "Growth Audit & Performance Scaling");
    const safeBudget = escapeHtml(data.budget || "Discuss on call");
    const safePhone = escapeHtml(data.phone || "Not provided");
    const safeWebsite = escapeHtml(data.website || "Not provided");
    const safeMessage = escapeHtml(data.message || "No custom message");

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
            
            <p style="font-size: 15px; color: #333333; line-height: 1.6;">Hello <strong>${safeName}</strong>,</p>
            
            <p style="font-size: 14px; color: #555555; line-height: 1.6;">
              Thank you for reaching out to <strong>Lumen &amp; Co</strong>. I have personally received your inquiry regarding <strong>${safeGoal}</strong>.
            </p>
            
            <div style="background: #f9f9fb; border-left: 4px solid #ef4d23; padding: 16px; border-radius: 8px; margin: 20px 0;">
              <p style="margin: 0 0 6px 0; font-size: 13px; color: #222222; font-weight: 600;">Inquiry Details Received:</p>
              <ul style="margin: 0; padding-left: 18px; font-size: 13px; color: #555555; line-height: 1.6;">
                <li><strong>Company:</strong> ${safeCompany}</li>
                <li><strong>Target Goal:</strong> ${safeGoal}</li>
                <li><strong>Monthly Budget:</strong> ${safeBudget}</li>
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
        subject: `🔥 New Inbound Website Lead: ${safeName} (${safeCompany})`,
        html: `
          <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; background: #ffffff; border: 1px solid #e0e0e0; border-radius: 16px;">
            <div style="background: #ef4d23; color: white; padding: 12px 16px; border-radius: 12px; margin-bottom: 20px;">
              <h3 style="margin: 0; font-size: 16px;">🔥 High-Priority Website Lead Captured</h3>
              <p style="margin: 4px 0 0 0; font-size: 12px; opacity: 0.9;">New prospect submitted the contact form.</p>
            </div>
            
            <table style="width: 100%; font-size: 13px; line-height: 1.8; color: #333;">
              <tr><td style="width: 120px; font-weight: bold; color: #666;">Prospect Name:</td><td><strong>${safeName}</strong></td></tr>
              <tr><td style="font-weight: bold; color: #666;">Email Address:</td><td><a href="mailto:${data.email}">${cleanEmail}</a></td></tr>
              <tr><td style="font-weight: bold; color: #666;">Phone:</td><td><a href="tel:${safePhone}">${safePhone}</a></td></tr>
              <tr><td style="font-weight: bold; color: #666;">Company:</td><td>${safeCompany}</td></tr>
              <tr><td style="font-weight: bold; color: #666;">Website:</td><td>${data.website ? `<a href="${safeWebsite}">${safeWebsite}</a>` : "Not provided"}</td></tr>
              <tr><td style="font-weight: bold; color: #666;">Budget:</td><td><span style="background: #eef2ff; color: #4338ca; padding: 2px 8px; border-radius: 6px; font-weight: bold;">${safeBudget}</span></td></tr>
              <tr><td style="font-weight: bold; color: #666;">Goal:</td><td>${safeGoal}</td></tr>
              <tr><td style="font-weight: bold; color: #666; vertical-align: top;">Message:</td><td>${safeMessage}</td></tr>
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
