import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: Request) {
    const { searchParams, origin } = new URL(request.url);
    const code = searchParams.get("code");
    const next = searchParams.get("next") ?? "/home";

    // Google/Supabase sends this instead of `code` when the user cancels
    // consent, or when something upstream (e.g. an unlisted redirect URL
    // in the Supabase Dashboard) rejected the request before it reached us.
    const oauthError = searchParams.get("error_description") ?? searchParams.get("error");

    if (oauthError) {
        console.error("auth/callback: provider returned an error:", oauthError);
        return NextResponse.redirect(
            `${origin}/login?error=oauth_denied&reason=${encodeURIComponent(oauthError)}`
        );
    }

    if (code) {
        const supabase = await createClient();
        const { error } = await supabase.auth.exchangeCodeForSession(code);

        if (!error) {
            return NextResponse.redirect(`${origin}${next}`);
        }

        // Logged server-side (visible in Vercel's function logs). The exact
        // message "both auth code and code verifier should be non-empty" is
        // the classic symptom of the PKCE code_verifier cookie not being
        // readable here — usually the Supabase Dashboard redirect allow-list
        // missing this deployment's domain (see note above).
        console.error("auth/callback: exchangeCodeForSession failed:", error.message);
        return NextResponse.redirect(
            `${origin}/login?error=auth_callback_failed&reason=${encodeURIComponent(error.message)}`
        );
    }

    return NextResponse.redirect(`${origin}/login?error=missing_code`);
}