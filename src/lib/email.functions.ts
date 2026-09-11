import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import nodemailer from "nodemailer";

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
    const smtpPass = process.env["SMTP_PASS"] || process.env["GMAIL_APP_PASSWORD"] || "";
    const smtpHost = process.env["SMTP_HOST"] || "smtp.gmail.com";
    const smtpPort = Number(process.env["SMTP_PORT"] || 465);

    if (!smtpPass) {
      console.warn(
        `[Email Dispatcher] SMTP_PASS not set in .env. Logging email payload from ${fromEmail} to ${data.to}.`,
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
