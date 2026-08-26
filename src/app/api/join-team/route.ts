import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { joinTeamLimiter, getClientIp } from "@/lib/rate-limit";

export async function POST(req: Request) {
    // Rate-limit by IP first, before touching auth or the DB — invite codes
    // are short and guessable, so the attack this defends against is
    // hammering codes, which doesn't require a valid session to attempt.
    const ip = getClientIp(req);
    const { success, reset } = await joinTeamLimiter.limit(ip);

    if (!success) {
        const retryAfterSeconds = Math.max(0, Math.ceil((reset - Date.now()) / 1000));
        return NextResponse.json(
            { error: "Too many attempts. Please wait a moment and try again." },
            { status: 429, headers: { "Retry-After": String(retryAfterSeconds) } }
        );
    }

    const { inviteCode } = await req.json();

    if (!inviteCode || typeof inviteCode !== "string") {
        return NextResponse.json({ error: "inviteCode is required" }, { status: 400 });
    }

    const supabase = await createClient();

    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
        return NextResponse.json({ error: "Authentication required" }, { status: 401 });
    }

    // Uses the caller's own session (cookies), not a service-role client —
    // join_team() is a SECURITY DEFINER RPC that already scopes everything
    // to auth.uid() internally, so this route is a rate-limit chokepoint,
    // not a privilege escalation.
    const { data, error } = await supabase.rpc("join_team", {
        p_invite_code: inviteCode.trim().toUpperCase(),
    });

    if (error) {
        return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json({ success: true, slot: data });
}