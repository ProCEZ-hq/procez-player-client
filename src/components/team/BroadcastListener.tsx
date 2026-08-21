"use client";

import { useEffect, useState } from "react";
import { Radio, X } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { GlassCard } from "@/components/ui/GlassCard";

interface BroadcastPayload {
    id: string;
    tournament_id: string;
    room_id: string;
    room_password: string;
    created_at: string;
}

interface TournamentLookup {
    id: string;
    name: string;
}

interface LiveBroadcast extends BroadcastPayload {
    tournamentName: string;
}

export function BroadcastListener({ tournaments }: { tournaments: TournamentLookup[] }) {
    const supabase = createClient();
    const [broadcasts, setBroadcasts] = useState<LiveBroadcast[]>([]);

    useEffect(() => {
        if (tournaments.length === 0) return;

        const nameById = new Map(tournaments.map((t) => [t.id, t.name]));

        const channel = supabase
            .channel("schema-db-changes")
            .on(
                "postgres_changes",
                { event: "INSERT", schema: "public", table: "match_broadcasts" },
                (payload) => {
                    const row = payload.new as BroadcastPayload;

                    // RLS already restricts which rows this client receives at all,
                    // but we still only surface it if it matches a tournament this
                    // user's current dashboard view actually knows about.
                    const tournamentName = nameById.get(row.tournament_id);
                    if (!tournamentName) return;

                    setBroadcasts((prev) => [{ ...row, tournamentName }, ...prev]);
                }
            )
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, [supabase, tournaments]);

    function dismiss(id: string) {
        setBroadcasts((prev) => prev.filter((b) => b.id !== id));
    }

    if (broadcasts.length === 0) return null;

    return (
        <div className="space-y-3">
            {broadcasts.map((b) => (
                <GlassCard
                    key={b.id}
                    glow="magenta"
                    className="border-2 border-neon-magenta/60 bg-neon-magenta/[0.07] relative animate-in fade-in slide-in-from-top-2"
                >
                    <button
                        onClick={() => dismiss(b.id)}
                        className="absolute top-3 right-3 text-white/40 hover:text-white transition-colors"
                        aria-label="Dismiss"
                    >
                        <X size={16} />
                    </button>

                    <div className="flex items-center gap-2 text-neon-magenta text-xs uppercase tracking-wide mb-2">
                        <Radio size={14} className="animate-pulse" />
                        Live Match Room — {b.tournamentName}
                    </div>

                    <div className="flex flex-wrap gap-6">
                        <div>
                            <p className="text-white/50 text-xs uppercase tracking-wide">Room ID</p>
                            <p className="font-mono text-lg text-white tracking-wider">{b.room_id}</p>
                        </div>
                        <div>
                            <p className="text-white/50 text-xs uppercase tracking-wide">Password</p>
                            <p className="font-mono text-lg text-white tracking-wider">{b.room_password}</p>
                        </div>
                    </div>
                </GlassCard>
            ))}
        </div>
    );
}