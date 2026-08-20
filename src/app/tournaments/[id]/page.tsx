import { notFound } from "next/navigation";
import { Calendar, Coins, Trophy, Users, Gamepad2 } from "lucide-react";
import { redis } from "@/lib/upstash/client";
import { GlassCard } from "@/components/ui/GlassCard";
import { NeonButton } from "@/components/ui/NeonButton";

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

export const revalidate = 0;

async function getTournament(id: string): Promise<Tournament | null> {
    const data = await redis.get<Tournament>(`tournament:${id}`);
    return data ?? null;
}

export default async function TournamentDetailPage({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const { id } = await params;
    const tournament = await getTournament(id);

    if (!tournament) {
        notFound();
    }

    return (
        <div className="min-h-screen px-6 py-12 max-w-2xl mx-auto">
            <GlassCard glow="magenta">
                <div className="flex items-center gap-2 text-neon-magenta text-xs uppercase tracking-wide mb-3">
                    <Gamepad2 size={14} />
                    {tournament.game_name}
                </div>

                <h1 className="text-2xl font-display font-bold mb-6">{tournament.name}</h1>

                <div className="grid grid-cols-2 gap-4 mb-8">
                    <div className="flex items-center gap-2 text-white/70 text-sm">
                        <Calendar size={16} className="text-white/40" />
                        {new Date(tournament.start_date).toLocaleString(undefined, {
                            dateStyle: "medium",
                            timeStyle: "short",
                        })}
                    </div>
                    <div className="flex items-center gap-2 text-white/70 text-sm">
                        <Users size={16} className="text-white/40" />
                        Team Size: {tournament.team_size}
                    </div>
                    <div className="flex items-center gap-2 text-white/70 text-sm">
                        <Coins size={16} className="text-white/40" />
                        Entry Fee: {tournament.entry_fee > 0 ? `₹${tournament.entry_fee}` : "Free"}
                    </div>
                    <div className="flex items-center gap-2 text-neon-lime text-sm">
                        <Trophy size={16} />
                        Prize Pool: ₹{Number(tournament.prize_pool).toLocaleString()}
                    </div>
                </div>

                <NeonButton variant="magenta" className="w-full">
                    Register &amp; Pay
                </NeonButton>
            </GlassCard>
        </div>
    );
}