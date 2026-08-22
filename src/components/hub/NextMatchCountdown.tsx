"use client";

import { useEffect, useState } from "react";
import { Calendar, Trophy } from "lucide-react";
import { GlassCard } from "@/components/ui/GlassCard";

interface NextTournament {
    id: string;
    name: string;
    game_name: string;
    start_date: string;
    team_code: string;
}

function getTimeParts(msRemaining: number) {
    const clamped = Math.max(msRemaining, 0);
    const days = Math.floor(clamped / (1000 * 60 * 60 * 24));
    const hours = Math.floor((clamped / (1000 * 60 * 60)) % 24);
    const minutes = Math.floor((clamped / (1000 * 60)) % 60);
    const seconds = Math.floor((clamped / 1000) % 60);
    return { days, hours, minutes, seconds };
}

export function NextMatchCountdown({ tournament }: { tournament: NextTournament | null }) {
    const [now, setNow] = useState(() => Date.now());

    useEffect(() => {
        if (!tournament) return;
        const interval = setInterval(() => setNow(Date.now()), 1000);
        return () => clearInterval(interval);
    }, [tournament]);

    if (!tournament) {
        return (
            <GlassCard glow="cyan">
                <div className="flex items-center gap-2 text-neon-cyan text-xs uppercase tracking-wide mb-2">
                    <Calendar size={14} />
                    Next Match
                </div>
                <p className="text-white/50 text-sm">
                    No upcoming matches yet. Join or register for a tournament to see your countdown here.
                </p>
            </GlassCard>
        );
    }

    const target = new Date(tournament.start_date).getTime();
    const { days, hours, minutes, seconds } = getTimeParts(target - now);

    return (
        <GlassCard glow="magenta">
            <div className="flex items-center gap-2 text-neon-magenta text-xs uppercase tracking-wide mb-2">
                <Calendar size={14} />
                Next Match
            </div>
            <h2 className="text-xl font-display font-semibold mb-1">{tournament.name}</h2>
            <p className="text-white/50 text-sm mb-5">{tournament.game_name}</p>

            <div className="grid grid-cols-4 gap-2 mb-4">
                {[
                    { value: days, label: "Days" },
                    { value: hours, label: "Hrs" },
                    { value: minutes, label: "Min" },
                    { value: seconds, label: "Sec" },
                ].map((unit) => (
                    <div
                        key={unit.label}
                        className="text-center rounded-lg bg-white/5 border border-white/10 py-3"
                    >
                        <p className="text-2xl font-display font-bold text-neon-cyan tabular-nums">
                            {String(unit.value).padStart(2, "0")}
                        </p>
                        <p className="text-[10px] uppercase tracking-wide text-white/40">{unit.label}</p>
                    </div>
                ))}
            </div>

            <div className="flex items-center gap-2 text-sm text-neon-lime">
                <Trophy size={14} />
                Your team code: <span className="font-mono">{tournament.team_code}</span>
            </div>
        </GlassCard>
    );
}