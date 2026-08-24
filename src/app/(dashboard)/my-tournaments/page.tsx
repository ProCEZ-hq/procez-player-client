import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { JoinTeamForm } from "@/components/team/JoinTeamForm";
import { TeamCard } from "@/components/team/TeamCard";
import { BroadcastListener } from "@/components/team/BroadcastListener";

interface TeamRow {
    id: string;
    team_code: string;
    leader_id: string;
    tournaments: { id: string; name: string; game_name: string; team_size: number } | null;
    roster_slots: {
        id: string;
        user_id: string;
        joined_at: string;
        profiles: { gamertag: string; avatar_url: string | null } | null;
    }[];
}

export default async function MyTournamentsPage() {
    const supabase = await createClient();
    const {
        data: { user },
    } = await supabase.auth.getUser();
    if (!user) redirect("/login?next=/my-tournaments");

    const { data: teams, error } = await supabase
        .from("teams")
        .select(
            `
      id, team_code, leader_id,
      tournaments ( id, name, game_name, team_size ),
      roster_slots ( id, user_id, joined_at, profiles ( gamertag, avatar_url ) )
    `
        )
        .order("created_at", { ascending: false });

    if (error) throw new Error(error.message);

    const rows = (teams ?? []) as unknown as TeamRow[];
    const tournamentLookup = rows
        .map((t) => t.tournaments)
        .filter((t): t is NonNullable<typeof t> => t !== null)
        .map((t) => ({ id: t.id, name: t.name }));

    return (
        <div className="p-container-padding max-w-4xl mx-auto space-y-container-padding">
            <div>
                <h1 className="text-3xl font-extrabold tracking-tight text-on-surface mb-1">My Teams</h1>
                <p className="text-on-surface-variant">Your roster command deck.</p>
            </div>

            <BroadcastListener tournaments={tournamentLookup} />
            <JoinTeamForm />

            {rows.length === 0 ? (
                <p className="text-on-surface-variant text-center py-8">
                    You&apos;re not on any team yet. Register for a tournament or join one with a team code above.
                </p>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-container-padding">
                    {rows.map((team) => (
                        <TeamCard
                            key={team.id}
                            teamCode={team.team_code}
                            isLeader={team.leader_id === user.id}
                            tournamentName={team.tournaments?.name ?? "Unknown tournament"}
                            gameName={team.tournaments?.game_name ?? ""}
                            teamSize={team.tournaments?.team_size ?? 0}
                            roster={team.roster_slots}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}