import { Users } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { NextMatchCountdown } from "@/components/hub/NextMatchCountdown";
import { AnnouncementFeed } from "@/components/hub/AnnouncementFeed";
import { RetroBadge } from "@/components/ui/RetroBadge";

interface PlayerSummary {
  total_active_teams: number;
  latest_badge: { badge_name: string; awarded_at: string } | null;
  next_tournament: {
    id: string; name: string; game_name: string; start_date: string; team_code: string;
  } | null;
}

interface Announcement {
  id: string; title: string; message: string;
  type: "INFO" | "ALERT" | "MAINTENANCE"; created_at: string;
}

export default async function HomePage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  const [{ data: summaryData, error: summaryError }, { data: announcements }] = await Promise.all([
    supabase.rpc("get_player_summary", { user_uuid: user.id }),
    supabase.from("platform_announcements")
      .select("id, title, message, type, created_at")
      .order("created_at", { ascending: false })
      .limit(3),
  ]);

  if (summaryError) throw new Error(summaryError.message);
  const summary = summaryData as PlayerSummary | null;

  return (
    <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8">
      {/* Center column */}
      <div className="lg:col-span-8 flex flex-col gap-8">
        <NextMatchCountdown tournament={summary?.next_tournament ?? null} />

        {/* Performance metrics */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Win Rate Dial */}
          <div className="neu-extruded rounded-3xl p-6 flex flex-col items-center justify-center bg-surface relative overflow-hidden">
            <h3 className="text-xl font-semibold text-on-surface-variant mb-6 absolute top-6 left-6">Win Rate</h3>
            <div className="relative w-48 h-48 rounded-full neu-extruded flex items-center justify-center mt-8">
              <div className="absolute inset-2 rounded-full neu-inset" />
              <div
                className="absolute inset-4 rounded-full opacity-80"
                style={{ background: "conic-gradient(#4f46e5 0%, #4f46e5 68%, transparent 68%, transparent 100%)" }}
              />
              <div className="absolute inset-6 rounded-full bg-surface neu-extruded flex items-center justify-center z-10">
                <span className="text-5xl font-extrabold text-on-surface">68<span className="text-2xl">%</span></span>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-8">
            {/* Tournaments tile */}
            <div className="neu-extruded rounded-3xl p-6 bg-surface flex-1 flex flex-col justify-center">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-semibold text-on-surface-variant">Tournaments</h3>
                <span className="material-symbols-outlined text-primary p-2 neu-inset rounded-full" style={{ fontVariationSettings: "'FILL' 1" }}>emoji_events</span>
              </div>
              <div className="flex justify-between items-end">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-on-surface-variant mb-1">Active Teams</p>
                  <p className="text-3xl font-bold text-on-surface">{summary?.total_active_teams ?? 0}</p>
                </div>
                <div className="w-px h-12 neu-inset" />
                <div className="text-right">
                  <p className="text-xs font-semibold uppercase tracking-wider text-on-surface-variant mb-1">Badge</p>
                  <p className="text-xl font-bold text-primary">{summary?.latest_badge ? "✓" : "—"}</p>
                </div>
              </div>
            </div>

            {/* XP Progress */}
            <div className="neu-extruded rounded-3xl p-6 bg-surface">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-semibold text-on-surface-variant">XP Progress</h3>
                <span className="text-xs font-bold text-primary">Lvl 42</span>
              </div>
              <div className="h-6 w-full neu-inset rounded-full overflow-hidden p-1 bg-[#e0e5eb]">
                <div className="h-full bg-primary rounded-full progress-fill shadow-[inset_0px_-2px_4px_rgba(0,0,0,0.2)]" />
              </div>
              <div className="flex justify-between mt-2 text-xs font-semibold text-on-surface-variant">
                <span>8,450 XP</span>
                <span>10,000 XP</span>
              </div>
            </div>
          </div>
        </section>

        {/* Trophy Tray */}
        {summary?.latest_badge && (
          <section className="neu-extruded rounded-3xl p-6 bg-surface">
            <h3 className="text-xl font-semibold text-on-surface-variant mb-6">Trophy Tray</h3>
            <div className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-6 gap-6">
              <RetroBadge badgeName={summary.latest_badge.badge_name} />
              {[...Array(5)].map((_, i) => (
                <div key={i} className="flex flex-col items-center gap-2">
                  <div className="w-16 h-16 rounded-full neu-inset flex items-center justify-center text-on-surface-variant/30">
                    <span className="material-symbols-outlined">lock</span>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Announcements */}
        <section className="neu-extruded rounded-3xl p-6 bg-surface">
          <h3 className="text-xl font-semibold text-on-surface-variant mb-4">Platform Announcements</h3>
          <AnnouncementFeed announcements={(announcements ?? []) as Announcement[]} />
        </section>
      </div>

      {/* Right profile panel */}
      <div className="lg:col-span-4">
        <section className="neu-extruded rounded-3xl p-6 bg-surface sticky top-20 flex flex-col">
          <div className="flex flex-col items-center text-center mb-8">
            <div className="w-32 h-32 rounded-full overflow-hidden neu-extruded border-4 border-surface mb-6 p-2">
              <div className="w-full h-full rounded-full overflow-hidden neu-inset flex items-center justify-center bg-surface-container">
                <span className="material-symbols-outlined text-5xl text-on-surface-variant">person</span>
              </div>
            </div>
            <h2 className="text-3xl font-bold text-on-surface mb-1">Player</h2>
            <p className="text-xl font-semibold text-primary mb-4">Competitor</p>
            <div className="flex gap-4">
              <button className="neu-button w-10 h-10 rounded-full flex items-center justify-center text-on-surface-variant hover:text-primary">
                <span className="material-symbols-outlined">mail</span>
              </button>
              <button className="neu-button w-10 h-10 rounded-full flex items-center justify-center text-on-surface-variant hover:text-primary">
                <span className="material-symbols-outlined">share</span>
              </button>
            </div>
          </div>

          <div className="flex flex-col gap-4">
            <div className="neu-inset rounded-2xl p-4 bg-[#e0e5eb]">
              <p className="text-xs font-semibold uppercase tracking-wider text-on-surface-variant mb-1">Active Teams</p>
              <p className="text-xl font-bold text-on-surface">{summary?.total_active_teams ?? 0}</p>
            </div>
            <div className="neu-inset rounded-2xl p-4 bg-[#e0e5eb]">
              <p className="text-xs font-semibold uppercase tracking-wider text-on-surface-variant mb-1">Latest Badge</p>
              <p className="text-xl font-bold text-on-surface">{summary?.latest_badge?.badge_name ?? "None yet"}</p>
            </div>
            <div className="neu-inset rounded-2xl p-4 bg-[#e0e5eb]">
              <p className="text-xs font-semibold uppercase tracking-wider text-on-surface-variant mb-1">Status</p>
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>verified</span>
                <p className="text-xl font-bold text-on-surface">Active</p>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
