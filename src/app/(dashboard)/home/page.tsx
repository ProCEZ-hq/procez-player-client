import { Users, Trophy } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { GlassCard } from "@/components/ui/GlassCard";
import { NextMatchCountdown } from "@/components/hub/NextMatchCountdown";
import { AnnouncementFeed } from "@/components/hub/AnnouncementFeed";

interface PlayerSummary {
    total_active_teams: number;
    latest_badge: { badge_name: string; awarded_at: string } | null;
    next_tournament: {
        id: string;
        name: string;
        game_name: string;
        start_date: string;
        team_code: string;
    } | null;
}

interface Announcement {
    id: string;
    title: string;
    message: string;
    type: "INFO" | "ALERT" | "MAINTENANCE";
    created_at: string;
}

export default async function HomePage() {
    const supabase = await createClient();

    const {
        data: { user },
    } = await supabase.auth.getUser();

    // Layout already redirects unauthenticated visitors before this renders.
    if (!user) return null;

    const [{ data: summaryData, error: summaryError }, { data: announcements }] = await Promise.all([
        supabase.rpc("get_player_summary", { user_uuid: user.id }),
        supabase
            .from("platform_announcements")
            .select("id, title, message, type, created_at")
            .order("created_at", { ascending: false })
            .limit(3),
    ]);

    if (summaryError) {
        throw new Error(summaryError.message);
    }

    const summary = summaryData as PlayerSummary | null;

    return (
        <div className="px-6 py-10 max-w-5xl mx-auto space-y-6">
            <div>
                <h1 className="text-3xl font-display font-bold text-glow-cyan mb-1">Welcome back</h1>
                <p className="text-white/50">Here&apos;s what&apos;s happening across your tournaments.</p>
            </div>

            <NextMatchCountdown tournament={summary?.next_tournament ?? null} />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <GlassCard glow="cyan">
                    <div className="flex items-center gap-3">
                        <Users className="text-neon-cyan" size={22} />
                        <div>
                            <p className="text-xs uppercase tracking-wide text-white/50">Active Teams</p>
                            <p className="text-2xl font-semibold">{summary?.total_active_teams ?? 0}</p>
                        </div>
                    </div>
                </GlassCard>

                <GlassCard>
                    <div className="flex items-center gap-3">
                        <Trophy className="text-neon-lime" size={22} />
                        <div>
                            <p className="text-xs uppercase tracking-wide text-white/50">Latest Badge</p>
                            <p className="text-lg font-semibold">
                                {summary?.latest_badge?.badge_name ?? "None yet"}
                            </p>
                        </div>
                    </div>
                </GlassCard>
            </div>

            <div>
                <p className="text-white/50 text-xs uppercase tracking-wide mb-3">
                    Platform Announcements
                </p>
                <AnnouncementFeed announcements={(announcements ?? []) as Announcement[]} />
            </div>
        </div>
    );
}