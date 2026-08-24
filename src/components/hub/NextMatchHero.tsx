"use client";

import { useEffect, useState } from "react";
import { Radar, Trophy } from "lucide-react";
import { TactileCard } from "@/components/ui/TactileCard";
import { TactileButton } from "@/components/ui/TactileButton";

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

export function NextMatchHero({ tournament }: { tournament: NextTournament | null }) {
    const [now, setNow] = useState(() => Date.now());

    useEffect(() => {
        if (!tournament) return;
        const interval = setInterval(() => setNow(Date.now()), 1000);
        return () => clearInterval(interval);
    }, [tournament]);

    if (!tournament) {
        return (
            <TactileCard className="p-8 rounded-[2rem]">
                <h2 className="text-xs uppercase tracking-widest text-on-surface-variant mb-4">Next Match</h2>
                <p className="text-on-surface-variant">
                    No upcoming matches yet. Join or register for a tournament to see your countdown here.
                </p>
            </TactileCard>
        );
    }

    const target = new Date(tournament.start_date).getTime();
    const { days, hours, minutes, seconds } = getTimeParts(target - now);
    const pad = (n: number) => String(n).padStart(2, "0");

    return (
        <TactileCard className="p-8 rounded-[2rem]">
            <h2 className="text-xs uppercase tracking-widest text-on-surface-variant mb-6">Next Match</h2>
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
                <div className="flex-1">
                    <div className="flex items-center gap-4 mb-4">
                        <div className="w-16 h-16 rounded-2xl neu-inset bg-surface-container-lowest flex items-center justify-center shrink-0">
                            <Radar className="text-accent" size={28} />
                        </div>
                        <div>
                            <h3 className="text-2xl font-bold text-on-surface">{tournament.name}</h3>
                            <p className="text-on-surface-variant mt-1">{tournament.game_name}</p>
                        </div>
                    </div>

                    {/* Digital Countdown Capsule — inset display per DESIGN.md */}
                    <div className="inline-flex items-center gap-3 bg-surface-container-lowest rounded-full px-6 py-3 neu-inset">
                        <span className="w-2 h-2 rounded-full bg-error animate-pulse" />
                        <span className="font-mono text-lg tracking-wider text-error tabular-nums">
                            {days > 0 ? `${days}D ` : ""}
                            {pad(hours)}:{pad(minutes)}:{pad(seconds)}
                        </span>
                    </div>
                </div>

                <TactileButton variant="accent" className="shrink-0">
                    <Trophy size={16} />
                    {tournament.team_code}
                </TactileButton>
            </div>
        </TactileCard>
    );
}