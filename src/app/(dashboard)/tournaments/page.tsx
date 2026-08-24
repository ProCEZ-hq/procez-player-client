import { redis } from "@/lib/upstash/client";
import { TactileCard } from "@/components/ui/TactileCard";
import { TournamentDiscoveryCard } from "@/components/tournaments/TournamentDiscoveryCard";

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

async function getTournaments(): Promise<Tournament[]> {
    const data = await redis.get<Tournament[]>("tournaments:published");
    return data ?? [];
}

export default async function TournamentsPage() {
    const tournaments = await getTournaments();

    return (
        <div className="p-container-padding max-w-6xl mx-auto">
            <h1 className="text-3xl font-extrabold tracking-tight text-on-surface mb-1">Discover Tournaments</h1>
            <p className="text-on-surface-variant mb-8">Live events, ready for registration.</p>

            {tournaments.length === 0 ? (
                <TactileCard>
                    <p className="text-on-surface-variant text-center py-8">No tournaments published yet. Check back soon.</p>
                </TactileCard>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-container-padding">
                    {tournaments.map((t) => (
                        <TournamentDiscoveryCard key={t.id} t={t} />
                    ))}
                </div>
            )}
        </div>
    );
}