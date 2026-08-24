import Link from "next/link";
import { Gamepad2, Coins, Trophy, Users } from "lucide-react";
import { TactileCard } from "@/components/ui/TactileCard";

interface Tournament {
    id: string;
    name: string;
    game_name: string;
    start_date: string;
    team_size: number;
    entry_fee: number;
    prize_pool: number;
}

export function TournamentDiscoveryCard({ t }: { t: Tournament }) {
    return (
        <Link href={`/tournaments/${t.id}`} className="block h-full">
            <TactileCard className="h-full flex flex-col hover:-translate-y-1 transition-transform duration-150">
                <div className="flex items-center justify-between mb-4">
                    <span className="inline-flex items-center gap-1.5 text-[11px] uppercase tracking-wide text-accent bg-surface-container-lowest rounded-full px-3 py-1 neu-inset">
                        <Gamepad2 size={12} />
                        {t.game_name}
                    </span>
                    <span className="inline-flex items-center gap-1 text-[11px] text-on-surface-variant">
                        <Users size={12} />
                        {t.team_size}-player squads
                    </span>
                </div>

                <h3 className="font-bold text-lg text-on-surface mb-4">{t.name}</h3>

                <p className="text-xs text-on-surface-variant mb-4">
                    Starts {new Date(t.start_date).toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" })}
                </p>

                <div className="grid grid-cols-2 gap-3 mt-auto">
                    <div className="neu-inset bg-surface-container-lowest rounded-xl p-3">
                        <p className="flex items-center gap-1.5 text-[10px] uppercase tracking-wide text-on-surface-variant mb-1">
                            <Coins size={11} /> Entry
                        </p>
                        <p className="font-bold text-on-surface">{t.entry_fee > 0 ? `₹${t.entry_fee}` : "Free"}</p>
                    </div>
                    <div className="neu-inset bg-surface-container-lowest rounded-xl p-3">
                        <p className="flex items-center gap-1.5 text-[10px] uppercase tracking-wide text-on-surface-variant mb-1">
                            <Trophy size={11} /> Prize
                        </p>
                        <p className="font-bold text-tertiary-container">₹{Number(t.prize_pool).toLocaleString()}</p>
                    </div>
                </div>
            </TactileCard>
        </Link>
    );
}