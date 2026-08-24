import { notFound } from "next/navigation";
import { redis } from "@/lib/upstash/client";
import { PaymentCheckout } from "@/components/forms/PaymentCheckout";

interface Tournament {
  id: string; name: string; game_name: string; start_date: string;
  team_size: number; entry_fee: number; prize_pool: number; status: string;
}

export const revalidate = 0;

async function getTournament(id: string): Promise<Tournament | null> {
  return await redis.get<Tournament>(`tournament:${id}`) ?? null;
}

export default async function TournamentDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const tournament = await getTournament(id);
  if (!tournament) notFound();

  return (
    <div className="max-w-2xl mx-auto">
      <div className="neu-extruded rounded-3xl p-8 bg-surface">
        <div className="flex items-center gap-2 text-primary text-xs font-semibold uppercase tracking-wider mb-3">
          <span className="material-symbols-outlined text-sm">sports_esports</span>
          {tournament.game_name}
        </div>

        <h1 className="text-4xl font-extrabold text-on-surface mb-6 tracking-tight">{tournament.name}</h1>

        <div className="grid grid-cols-2 gap-4 mb-8">
          {[
            { icon: "calendar_today", label: new Date(tournament.start_date).toLocaleString(undefined, { dateStyle: "medium", timeStyle: "short" }) },
            { icon: "group", label: `Team Size: ${tournament.team_size}` },
            { icon: "payments", label: `Entry: ${tournament.entry_fee > 0 ? `₹${tournament.entry_fee}` : "Free"}` },
            { icon: "emoji_events", label: `Prize: ₹${Number(tournament.prize_pool).toLocaleString()}`, accent: true },
          ].map(({ icon, label, accent }) => (
            <div key={label} className={`flex items-center gap-2 text-sm ${accent ? "text-primary font-semibold" : "text-on-surface-variant"}`}>
              <span className="material-symbols-outlined text-sm text-outline">{icon}</span>
              {label}
            </div>
          ))}
        </div>

        <PaymentCheckout
          tournamentId={tournament.id}
          tournamentName={tournament.name}
          entryFee={Number(tournament.entry_fee)}
        />
      </div>
    </div>
  );
}
