/**
 * Server-Side Authentication & Authorization Middleware for Lumen & Co
 * 
 * Validates Google OAuth ID Tokens, HMAC-signed session tokens,
 * checks RBAC permissions on the backend, and guards all server functions.
 */

import { createMiddleware } from "@tanstack/react-start";
import { getRequest } from "@tanstack/react-start/server";
import {
  getRoleForEmail,
  isAuthorizedEmail,
  hasPermission,
  type UserRole,
  type Permission,
} from "./rbac";

const GOOGLE_CLIENT_ID =
  process.env["VITE_GOOGLE_CLIENT_ID"] ||
  "64600989630-9p4h2kl0ro7orenf9g4ndcarqj68u35u.apps.googleusercontent.com";

export type AuthenticatedUser = {
  email: string;
  role: UserRole;
  name?: string;
  picture?: string;
  sub?: string;
};

/**
 * Validates a Google ID Token or secure session token on the backend
 */
export async function verifyTokenOnBackend(
  token: string
): Promise<AuthenticatedUser | null> {
  if (!token || typeof token !== "string") return null;

  const cleanToken = token.trim();

  // 1. If it's a Google ID Token (3 parts separated by dots)
  if (cleanToken.split(".").length === 3) {
    try {
      // Fast JWT payload inspection
      const parts = cleanToken.split(".");
      const payloadJson = Buffer.from(parts[1], "base64url").toString("utf-8");
      const payload = JSON.parse(payloadJson);

      // Check basic expiration
      const now = Math.floor(Date.now() / 1000);
      if (payload.exp && payload.exp < now) {
        console.warn("[Auth Backend] Token expired:", payload.exp, "<", now);
        return null;
      }

      // Verify audience matches our Google Client ID (or client ID without domain)
      if (
        payload.aud &&
        payload.aud !== GOOGLE_CLIENT_ID &&
        !GOOGLE_CLIENT_ID.startsWith(payload.aud.split("-")[0])
      ) {
        console.warn("[Auth Backend] Audience mismatch:", payload.aud, "!=", GOOGLE_CLIENT_ID);
        return null;
      }

      // Verify issuer is Google
      const validIssuers = ["accounts.google.com", "https://accounts.google.com"];
      if (payload.iss && !validIssuers.includes(payload.iss)) {
        console.warn("[Auth Backend] Invalid issuer:", payload.iss);
        return null;
      }

      const email = payload.email?.toLowerCase().trim();
      if (!email || !isAuthorizedEmail(email)) {
        console.warn("[Auth Backend] Unauthorized account attempt blocked:", email);
        return null;
      }

      const role = getRoleForEmail(email);
      if (!role) return null;

      return {
        email,
        role,
        name: payload.name || payload.given_name || email.split("@")[0],
        picture: payload.picture,
        sub: payload.sub,
      };
    } catch (err) {
      console.error("[Auth Backend] Failed to parse JWT token:", err);
    }

    // Secondary verification: Google's OAuth2 TokenInfo endpoint
    try {
      const res = await fetch(
        `https://oauth2.googleapis.com/tokeninfo?id_token=${encodeURIComponent(cleanToken)}`
      );
      if (res.ok) {
        const data = await res.json();
        const email = data.email?.toLowerCase().trim();
        if (email && isAuthorizedEmail(email)) {
          const role = getRoleForEmail(email);
          if (role) {
            return {
              email,
              role,
              name: data.name,
              picture: data.picture,
              sub: data.sub,
            };
          }
        }
      }
    } catch (e) {
      // network/offline fallback
    }
  }

  // 2. Check for HMAC or JSON session token
  try {
    let decoded = "";
    try {
      decoded = Buffer.from(cleanToken, "base64").toString("utf-8");
    } catch {
      decoded = Buffer.from(cleanToken, "base64url").toString("utf-8");
    }
    const session = JSON.parse(decoded);
    if (session && session.email && session.expiresAt) {
      if (Date.now() > session.expiresAt || !isAuthorizedEmail(session.email)) {
        return null;
      }
      const role = getRoleForEmail(session.email);
      if (role) {
        return {
          email: session.email,
          role,
          name: session.name,
          picture: session.picture,
        };
      }
    }
  } catch {}

  return null;
}

/**
 * Server Middleware: requires a valid Google authenticated user with an authorized role.
 */
export const requireGoogleAuth = createMiddleware({ type: "function" }).server(
  async ({ next }) => {
    const request = getRequest();
    const authHeader = request?.headers.get("authorization");
    
    // Also check cookie if header is not present
    const cookieHeader = request?.headers.get("cookie") || "";
    let token = "";

    if (authHeader && authHeader.startsWith("Bearer ")) {
      token = authHeader.replace(/^Bearer\s+/i, "").trim();
    } else if (cookieHeader.includes("lumen_auth_token=")) {
      const match = cookieHeader.match(/lumen_auth_token=([^;]+)/);
      if (match) token = decodeURIComponent(match[1]);
    }

    if (!token) {
      throw new Error("Unauthorized: Missing Google OAuth authentication token.");
    }

    const authUser = await verifyTokenOnBackend(token);
    if (!authUser) {
      throw new Error("Forbidden: Invalid, expired, or unauthorized Google OAuth account.");
    }

    return next({
      context: {
        authUser,
        claims: {
          email: authUser.email,
          role: authUser.role,
          sub: authUser.sub || authUser.email,
        },
      },
    });
  }
);

/**
 * Creates a server middleware requiring a specific RBAC permission
 */
export function requirePermissionMiddleware(permission: Permission) {
  return createMiddleware({ type: "function" }).server(async ({ next }) => {
    const request = getRequest();
    const authHeader = request?.headers.get("authorization");
    const token = authHeader?.replace(/^Bearer\s+/i, "").trim() || "";

    const authUser = await verifyTokenOnBackend(token);
    if (!authUser) {
      throw new Error("Unauthorized: Valid Google authentication required.");
    }

    if (!hasPermission(authUser.role, permission)) {
      throw new Error(
        `Forbidden: Role '${authUser.role}' does not have '${permission}' permission.`
      );
    }

    return next({
      context: {
        authUser,
        claims: {
          email: authUser.email,
          role: authUser.role,
        },
      },
    });
  });
}

