import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

const RAZORPAY_KEY_ID = process.env.RAZORPAY_KEY_ID!;
const RAZORPAY_KEY_SECRET = process.env.RAZORPAY_KEY_SECRET!;

export async function POST(req: Request) {
    const { tournamentId } = await req.json();

    if (!tournamentId || typeof tournamentId !== "string") {
        return NextResponse.json({ error: "tournamentId is required" }, { status: 400 });
    }

    const supabase = await createClient();

    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
        return NextResponse.json({ error: "Authentication required" }, { status: 401 });
    }

    // Read the tournament straight from Supabase (not Redis) — checkout needs
    // the authoritative, current entry_fee, not the discovery cache snapshot.
    const { data: tournament, error: tournamentError } = await supabase
        .from("tournaments")
        .select("id, name, game_name, entry_fee, status")
        .eq("id", tournamentId)
        .eq("status", "PUBLISHED")
        .single();

    if (tournamentError || !tournament) {
        return NextResponse.json(
            { error: "Tournament not found or not open for registration" },
            { status: 404 }
        );
    }

    const amountPaise = Math.round(Number(tournament.entry_fee) * 100);

    if (amountPaise <= 0) {
        return NextResponse.json(
            { error: "This tournament does not require payment" },
            { status: 400 }
        );
    }

    // 1. Create the order on Razorpay's side.
    const razorpayRes = await fetch("https://api.razorpay.com/v1/orders", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization:
                "Basic " + Buffer.from(`${RAZORPAY_KEY_ID}:${RAZORPAY_KEY_SECRET}`).toString("base64"),
        },
        body: JSON.stringify({
            amount: amountPaise,
            currency: "INR",
            receipt: `tour_${tournament.id.slice(0, 8)}_${Date.now()}`,
            notes: {
                tournament_id: tournament.id,
                user_id: user.id,
            },
        }),
    });

    if (!razorpayRes.ok) {
        const errBody = await razorpayRes.text();
        console.error("Razorpay order creation failed:", errBody);
        return NextResponse.json({ error: "Payment provider error" }, { status: 502 });
    }

    const razorpayOrder = await razorpayRes.json();

    // 2. Record a PENDING order via the security-definer RPC — runs with the
    // caller's own session (cookies), so RLS still governs everything this
    // insert can touch. No service-role key needed in this app.
    const { data: order, error: rpcError } = await supabase.rpc("create_pending_order", {
        p_tournament_id: tournament.id,
        p_razorpay_order_id: razorpayOrder.id,
    });

    if (rpcError) {
        console.error("create_pending_order RPC failed:", rpcError);

        if (rpcError.code === "23505") {
            return NextResponse.json(
                { error: "You already have an active registration for this tournament" },
                { status: 409 }
            );
        }

        return NextResponse.json({ error: "Could not create order" }, { status: 500 });
    }

    return NextResponse.json({
        orderId: (order as any).id,
        razorpayOrderId: razorpayOrder.id,
        amount: amountPaise,
        currency: "INR",
        keyId: RAZORPAY_KEY_ID,
        tournamentName: tournament.name,
        userEmail: user.email,
    });
}