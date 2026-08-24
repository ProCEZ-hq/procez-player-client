"use client";

import { useState } from "react";
import { Copy, Crown, User } from "lucide-react";
import { TactileCard } from "@/components/ui/TactileCard";

interface RosterMember {
    id: string;
    user_id: string;
    joined_at: string;
    profiles: { gamertag: string; avatar_url: string | null } | null;
}
interface TeamCardProps {
    teamCode: string;
    isLeader: boolean;
    tournamentName: string;
    gameName: string;
    teamSize: number;
    roster: RosterMember[];
}

export function TeamCard({ teamCode, isLeader, tournamentName, gameName, teamSize, roster }: TeamCardProps) {
    const [copied, setCopied] = useState(false);

    function copyInviteLink() {
        const link = `${window.location.origin}/join?code=${encodeURIComponent(teamCode)}`;
        navigator.clipboard.writeText(link);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    }

    const emptySlots = Math.max(teamSize - roster.length, 0);

    return (
        <TactileCard>
            <div className="flex items-start justify-between mb-4">
                <div>
                    <p className="text-[11px] uppercase tracking-wide text-on-surface-variant">{gameName}</p>
                    <h3 className="text-lg font-extrabold tracking-tight text-on-surface">{tournamentName}</h3>
                </div>
                {isLeader && (
                    <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-tertiary-container neu-inset bg-surface-container-lowest rounded-full px-2.5 py-1 shrink-0">
                        <Crown size={12} />
                        Leader
                    </span>
                )}
            </div>

            {isLeader && (
                <div className="flex items-center gap-2 mb-5">
                    <span className="font-mono text-sm tracking-wider text-accent neu-inset bg-surface-container-lowest rounded-lg px-3 py-2.5 flex-1 truncate">
                        {teamCode}
                    </span>
                    <button
                        onClick={copyInviteLink}
                        className="neu-extruded neu-button min-h-12 min-w-12 px-3 rounded-lg bg-surface text-accent inline-flex items-center gap-1.5 whitespace-nowrap text-xs"
                    >
                        <Copy size={14} />
                        {copied ? "Copied!" : "Copy"}
                    </button>
                </div>
            )}

            <p className="text-[11px] uppercase tracking-wide text-on-surface-variant mb-2">
                Roster ({roster.length}/{teamSize})
            </p>
            <div className="grid grid-cols-1 gap-2">
                {roster.map((member) => (
                    <div key={member.id} className="flex items-center gap-2 text-sm text-on-surface neu-inset bg-surface-container-lowest rounded-lg px-3 py-2.5">
                        <User size={14} className="text-on-surface-variant shrink-0" />
                        <span className="truncate">{member.profiles?.gamertag ?? "Unknown player"}</span>
                    </div>
                ))}
                {Array.from({ length: emptySlots }).map((_, i) => (
                    <div key={`open-${i}`} className="flex items-center gap-2 text-sm text-on-surface-variant/50 neu-inset bg-surface-container-lowest rounded-lg px-3 py-2.5">
                        <User size={14} className="shrink-0" />
                        <span>Open slot</span>
                    </div>
                ))}
            </div>
        </TactileCard>
    );
}