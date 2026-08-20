import { NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

export async function DELETE(req: Request) {
    const { tournamentId } = await req.json();

    if (!tournamentId) {
        return NextResponse.json({ error: "tournamentId required" }, { status: 400 });
    }

    const cookieStore = await cookies();

    const anonClient = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        { cookies: { getAll: () => cookieStore.getAll(), setAll: () => {} } }
    );

    const { data: { user } } = await anonClient.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthenticated" }, { status: 401 });

    const adminClient = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!,
        { cookies: { getAll: () => [], setAll: () => {} } }
    );

    await adminClient
        .from("orders")
        .delete()
        .eq("user_id", user.id)
        .eq("tournament_id", tournamentId)
        .eq("status", "PENDING");

    return NextResponse.json({ ok: true });
}
