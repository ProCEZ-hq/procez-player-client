import "server-only";
import { Ratelimit } from "@upstash/ratelimit";
import { redis } from "@/lib/upstash/client";

/**
 * 5 checkout attempts per minute, keyed by user id (this endpoint already
 * requires auth before the limiter runs, so a precise per-user key is more
 * useful here than IP — it won't collateral-block other real users on the
 * same network, e.g. a college wifi or office NAT).
 */
export const createOrderLimiter = new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(5, "1 m"),
    prefix: "ratelimit:create-order",
    analytics: true,
});

/**
 * 10 join attempts per minute, keyed by IP address. Team codes are short
 * and guessable, and the threat model here is brute-forcing a code before
 * we even know who's asking — so this is checked before authentication,
 * and IP is the only identifier available at that point.
 */
export const joinTeamLimiter = new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(10, "1 m"),
    prefix: "ratelimit:join-team",
    analytics: true,
});

export function getClientIp(request: Request): string {
    const forwardedFor = request.headers.get("x-forwarded-for");
    if (forwardedFor) return forwardedFor.split(",")[0].trim();

    const realIp = request.headers.get("x-real-ip");
    if (realIp) return realIp;

    // Local dev has no proxy setting either header — falls back to one
    // shared bucket, which is fine since it's never internet-facing.
    return "unknown";
}