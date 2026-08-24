"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { NeuCard } from "@/components/ui/GlassCard";

interface BroadcastPayload {
  id: string;
  tournament_id: string;
  room_id: string;
  room_password: string;
  created_at: string;
}

interface TournamentLookup { id: string; name: string; }
interface LiveBroadcast extends BroadcastPayload { tournamentName: string; }

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

    return () => { supabase.removeChannel(channel); };
  }, [supabase, tournaments]);

  function dismiss(id: string) { setBroadcasts((prev) => prev.filter((b) => b.id !== id)); }

  if (broadcasts.length === 0) return null;

  return (
    <div className="space-y-3">
      {broadcasts.map((b) => (
        <NeuCard key={b.id} className="relative border-2 border-primary/30">
          <button
            onClick={() => dismiss(b.id)}
            className="absolute top-3 right-3 neu-button w-8 h-8 rounded-full flex items-center justify-center text-on-surface-variant hover:text-primary"
            aria-label="Dismiss"
          >
            <span className="material-symbols-outlined text-sm">close</span>
          </button>

          <div className="flex items-center gap-2 text-primary text-xs font-semibold uppercase tracking-wider mb-3">
            <span className="material-symbols-outlined text-sm animate-pulse">radio</span>
            Live Match Room — {b.tournamentName}
          </div>

          <div className="flex flex-wrap gap-6">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-on-surface-variant">Room ID</p>
              <p className="font-mono text-lg text-on-surface tracking-wider">{b.room_id}</p>
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-on-surface-variant">Password</p>
              <p className="font-mono text-lg text-on-surface tracking-wider">{b.room_password}</p>
            </div>
          </div>
        </NeuCard>
      ))}
    </div>
  );
}
