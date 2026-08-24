import { createClient } from "@/lib/supabase/server";
import { NextMatchHero } from "@/components/hub/NextMatchHero";
import { PerformanceGrid } from "@/components/hub/PerformanceGrid";
import { TrophyCase } from "@/components/hub/TrophyCase";
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

interface Badge {
    id: string;
    badge_name: string;
}

const TOTAL_BADGE_SLOTS = 6;

export default async function HomePage() {
    const supabase = await createClient();

    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!user) return null;

    const [
        { data: summaryData, error: summaryError },
        { data: announcements },
        { data: badges },
    ] = await Promise.all([
        supabase.rpc("get_player_summary", { user_uuid: user.id }),
        supabase
            .from("platform_announcements")
            .select("id, title, message, type, created_at")
            .order("created_at", { ascending: false })
            .limit(3),
        supabase
            .from("user_badges")
            .select("id, badge_name")
            .eq("user_id", user.id)
            .order("awarded_at", { ascending: true }),
    ]);

    if (summaryError) throw new Error(summaryError.message);

    const summary = summaryData as PlayerSummary | null;
    const badgeList = (badges ?? []) as Badge[];

    return (
        <div className="p-container-padding max-w-5xl mx-auto space-y-container-padding">
            <div>
                <h1 className="text-3xl font-extrabold tracking-tight text-on-surface mb-1">Welcome back</h1>
                <p className="text-on-surface-variant">Here&apos;s what&apos;s happening across your tournaments.</p>
            </div>

            <NextMatchHero tournament={summary?.next_tournament ?? null} />

            <PerformanceGrid
                activeTeams={summary?.total_active_teams ?? 0}
                badgesEarned={badgeList.length}
                totalBadgeSlots={TOTAL_BADGE_SLOTS}
            />

            <TrophyCase badges={badgeList} />

            <div>
                <p className="text-on-surface-variant text-xs uppercase tracking-widest mb-4">Platform Announcements</p>
                <AnnouncementFeed announcements={(announcements ?? []) as Announcement[]} />
            </div>
        </div>
    );
}