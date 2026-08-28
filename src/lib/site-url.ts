"use client";

/**
 * Resolves the canonical site URL for OAuth redirects. Prefers an explicit
 * NEXT_PUBLIC_SITE_URL when set — useful for forcing OAuth to always land
 * on your canonical production domain — but falls back to
 * window.location.origin, which is already correct for localhost, any
 * Vercel preview URL, and production alike. Deliberately does NOT default
 * to a hardcoded "http://localhost:3000" string: if NEXT_PUBLIC_SITE_URL
 * is ever unset in production, that fallback would silently redirect
 * every real user's OAuth flow to localhost.
 */
export function getSiteUrl(): string {
    const configured = process.env.NEXT_PUBLIC_SITE_URL;
    if (configured) return configured.replace(/\/$/, "");
    return window.location.origin;
}