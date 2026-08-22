import Link from "next/link";
import { Gamepad2, Coins, Trophy, Calendar } from "lucide-react";
import { redis } from "@/lib/upstash/client";
import { GlassCard } from "@/components/ui/GlassCard";

interface Tournament {
    id: string;
    name: string;
    game_name: string;
    start_date: string;
    team_size: number;
    entry_fee: number;
    prize_pool: number;
    status: string;
}

export const revalidate = 0; // always read the live edge cache, never Next's own data cache

async function getTournaments(): Promise<Tournament[]> {
    const data = await redis.get<Tournament[]>("tournaments:published");
    return data ?? [];
}

export default async function TournamentsPage() {
    const tournaments = await getTournaments();

    return (
        <div className="min-h-screen px-6 py-12 max-w-6xl mx-auto">
            <h1 className="text-3xl font-display font-bold text-glow-cyan mb-2">
                Discover Tournaments
            </h1>
            <p className="text-white/50 mb-8">
                Live events, served from the edge cache for instant loads.
            </p>

            {tournaments.length === 0 ? (
                <GlassCard>
                    <p className="text-white/50 text-center py-8">
                        No tournaments published yet. Check back soon.
                    </p>
                </GlassCard>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                    {tournaments.map((t) => (
                        <Link key={t.id} href={`/tournaments/${t.id}`} className="block h-full">
                            <GlassCard
                                glow="cyan"
                                className="h-full hover:-translate-y-1 transition-transform cursor-pointer"
                            >
                                <div className="flex items-center gap-2 text-neon-cyan text-xs uppercase tracking-wide mb-3">
                                    <Gamepad2 size={14} />
                                    {t.game_name}
                                </div>
                                <h2 className="text-lg font-display font-semibold mb-4">{t.name}</h2>

                                <div className="space-y-2 text-sm text-white/70">
                                    <div className="flex items-center gap-2">
                                        <Calendar size={14} className="text-white/40" />
                                        {new Date(t.start_date).toLocaleDateString(undefined, {
                                            month: "short",
                                            day: "numeric",
                                            year: "numeric",
                                        })}
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Coins size={14} className="text-white/40" />
                                        Entry: {t.entry_fee > 0 ? `₹${t.entry_fee}` : "Free"}
                                    </div>
                                    <div className="flex items-center gap-2 text-neon-lime">
                                        <Trophy size={14} />
                                        Prize Pool: ₹{Number(t.prize_pool).toLocaleString()}
                                    </div>
                                </div>
                            </GlassCard>
                        </Link>
                    ))}
                </div>
            )}
        </div>
    );
}