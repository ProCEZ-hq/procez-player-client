"use client";

import { useEffect, useState } from "react";
import { Radio, X } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { TactileCard } from "@/components/ui/TactileCard";

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
            .on("postgres_changes", { event: "INSERT", schema: "public", table: "match_broadcasts" }, (payload) => {
                const row = payload.new as BroadcastPayload;
                const tournamentName = nameById.get(row.tournament_id);
                if (!tournamentName) return;
                setBroadcasts((prev) => [{ ...row, tournamentName }, ...prev]);
            })
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
                <TactileCard key={b.id} className="relative">
                    <button
                        onClick={() => dismiss(b.id)}
                        className="absolute top-3 right-3 min-w-12 min-h-12 flex items-center justify-center text-on-surface-variant hover:text-accent transition-colors"
                        aria-label="Dismiss"
                    >
                        <X size={16} />
                    </button>
                    <div className="flex items-center gap-2 text-tertiary-container text-xs uppercase tracking-wide mb-3">
                        <Radio size={14} className="animate-pulse" />
                        Live Match Room — {b.tournamentName}
                    </div>
                    <div className="flex flex-wrap gap-4">
                        <div className="neu-inset bg-surface-container-lowest rounded-xl px-4 py-3">
                            <p className="text-on-surface-variant text-[10px] uppercase tracking-wide">Room ID</p>
                            <p className="font-mono text-lg text-on-surface tracking-wider">{b.room_id}</p>
                        </div>
                        <div className="neu-inset bg-surface-container-lowest rounded-xl px-4 py-3">
                            <p className="text-on-surface-variant text-[10px] uppercase tracking-wide">Password</p>
                            <p className="font-mono text-lg text-on-surface tracking-wider">{b.room_password}</p>
                        </div>
                    </div>
                </TactileCard>
            ))}
        </div>
    );
}