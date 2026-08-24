import { notFound } from "next/navigation";
import { Calendar, Coins, Trophy, Users, Gamepad2 } from "lucide-react";
import { redis } from "@/lib/upstash/client";
import { TactileCard } from "@/components/ui/TactileCard";
import { PaymentCheckout } from "@/components/forms/PaymentCheckout";

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
    if (!tournament) notFound();

    return (
        <div className="p-container-padding max-w-2xl mx-auto">
            <TactileCard className="p-8 rounded-[2rem]">
                <span className="inline-flex items-center gap-1.5 text-[11px] uppercase tracking-wide text-accent bg-surface-container-lowest rounded-full px-3 py-1 neu-inset mb-4">
                    <Gamepad2 size={12} />
                    {tournament.game_name}
                </span>

                <h1 className="text-2xl font-extrabold tracking-tight text-on-surface mb-6">{tournament.name}</h1>

                <div className="grid grid-cols-2 gap-3 mb-8">
                    <div className="neu-inset bg-surface-container-lowest rounded-xl p-4">
                        <p className="flex items-center gap-1.5 text-[10px] uppercase tracking-wide text-on-surface-variant mb-1">
                            <Calendar size={11} /> Starts
                        </p>
                        <p className="font-semibold text-on-surface text-sm">
                            {new Date(tournament.start_date).toLocaleString(undefined, { dateStyle: "medium", timeStyle: "short" })}
                        </p>
                    </div>
                    <div className="neu-inset bg-surface-container-lowest rounded-xl p-4">
                        <p className="flex items-center gap-1.5 text-[10px] uppercase tracking-wide text-on-surface-variant mb-1">
                            <Users size={11} /> Squad Size
                        </p>
                        <p className="font-semibold text-on-surface text-sm">{tournament.team_size} players</p>
                    </div>
                    <div className="neu-inset bg-surface-container-lowest rounded-xl p-4">
                        <p className="flex items-center gap-1.5 text-[10px] uppercase tracking-wide text-on-surface-variant mb-1">
                            <Coins size={11} /> Entry Fee
                        </p>
                        <p className="font-semibold text-on-surface text-sm">{tournament.entry_fee > 0 ? `₹${tournament.entry_fee}` : "Free"}</p>
                    </div>
                    <div className="neu-inset bg-surface-container-lowest rounded-xl p-4">
                        <p className="flex items-center gap-1.5 text-[10px] uppercase tracking-wide text-on-surface-variant mb-1">
                            <Trophy size={11} /> Prize Pool
                        </p>
                        <p className="font-semibold text-tertiary-container text-sm">₹{Number(tournament.prize_pool).toLocaleString()}</p>
                    </div>
                </div>

                <PaymentCheckout tournamentId={tournament.id} tournamentName={tournament.name} entryFee={Number(tournament.entry_fee)} />
            </TactileCard>
        </div>
    );
}