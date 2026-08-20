"use client";

import { useState } from "react";
import { Copy, Crown, User } from "lucide-react";
import { GlassCard } from "@/components/ui/GlassCard";

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

export function TeamCard({
    teamCode,
    isLeader,
    tournamentName,
    gameName,
    teamSize,
    roster,
}: TeamCardProps) {
    const [copied, setCopied] = useState(false);

    function copyInviteLink() {
        const link = `${window.location.origin}/join?code=${encodeURIComponent(teamCode)}`;
        navigator.clipboard.writeText(link);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    }

    return (
        <GlassCard glow={isLeader ? "magenta" : "cyan"}>
            <div className="flex items-start justify-between mb-4">
                <div>
                    <p className="text-xs uppercase tracking-wide text-white/50">{gameName}</p>
                    <h3 className="text-lg font-display font-semibold">{tournamentName}</h3>
                </div>
                {isLeader && (
                    <span className="inline-flex items-center gap-1 text-xs text-neon-magenta border border-neon-magenta/30 rounded-full px-2.5 py-1">
                        <Crown size={12} />
                        Leader
                    </span>
                )}
            </div>

            {isLeader && (
                <div className="flex items-center gap-2 mb-4">
                    <span className="font-mono text-sm tracking-wider text-neon-cyan bg-white/5 border border-white/10 rounded-lg px-3 py-2 flex-1 truncate">
                        {teamCode}
                    </span>
                    <button
                        onClick={copyInviteLink}
                        className="text-xs px-3 py-2 rounded-lg border border-neon-cyan/30 text-neon-cyan hover:bg-neon-cyan/10 transition-colors inline-flex items-center gap-1.5 whitespace-nowrap"
                    >
                        <Copy size={14} />
                        {copied ? "Copied!" : "Copy Invite Link"}
                    </button>
                </div>
            )}

            <div>
                <p className="text-xs uppercase tracking-wide text-white/40 mb-2">
                    Roster ({roster.length}/{teamSize})
                </p>
                <ul className="space-y-1.5">
                    {roster.map((member) => (
                        <li
                            key={member.id}
                            className="flex items-center gap-2 text-sm text-white/70 bg-white/[0.03] rounded-lg px-3 py-1.5"
                        >
                            <User size={14} className="text-white/30" />
                            {member.profiles?.gamertag ?? "Unknown player"}
                        </li>
                    ))}
                </ul>
            </div>
        </GlassCard>
    );
}