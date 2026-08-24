import Link from "next/link";
import { redis } from "@/lib/upstash/client";

interface Tournament {
  id: string; name: string; game_name: string; start_date: string;
  team_size: number; entry_fee: number; prize_pool: number; status: string;
}

export const revalidate = 0;

async function getTournaments(): Promise<Tournament[]> {
  const data = await redis.get<Tournament[]>("tournaments:published");
  return data ?? [];
}

export default async function TournamentsPage() {
  const tournaments = await getTournaments();

  return (
    <div className="max-w-6xl mx-auto">
      <h1 className="text-4xl font-extrabold text-on-surface mb-2 tracking-tight">Discover Tournaments</h1>
      <p className="text-on-surface-variant mb-8">Live events, served from the edge cache for instant loads.</p>

      {tournaments.length === 0 ? (
        <div className="neu-extruded rounded-3xl p-8 bg-surface text-center">
          <p className="text-on-surface-variant py-8">No tournaments published yet. Check back soon.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {tournaments.map((t) => (
            <Link key={t.id} href={`/tournaments/${t.id}`} className="block h-full">
              <div className="neu-extruded rounded-3xl p-6 bg-surface h-full hover:-translate-y-1 transition-transform cursor-pointer">
                <div className="flex items-center gap-2 text-primary text-xs font-semibold uppercase tracking-wider mb-3">
                  <span className="material-symbols-outlined text-sm">sports_esports</span>
                  {t.game_name}
                </div>
                <h2 className="text-xl font-bold text-on-surface mb-4">{t.name}</h2>

                <div className="space-y-2 text-sm text-on-surface-variant">
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-sm text-outline">calendar_today</span>
                    {new Date(t.start_date).toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" })}
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-sm text-outline">payments</span>
                    Entry: {t.entry_fee > 0 ? `₹${t.entry_fee}` : "Free"}
                  </div>
                  <div className="flex items-center gap-2 text-primary font-semibold">
                    <span className="material-symbols-outlined text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>emoji_events</span>
                    Prize Pool: ₹{Number(t.prize_pool).toLocaleString()}
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
