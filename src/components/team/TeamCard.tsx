"use client";

import { useState } from "react";
import { NeuCard } from "@/components/ui/GlassCard";

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

  return (
    <NeuCard>
      <div className="flex items-start justify-between mb-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-on-surface-variant">{gameName}</p>
          <h3 className="text-xl font-bold text-on-surface">{tournamentName}</h3>
        </div>
        {isLeader && (
          <span className="inline-flex items-center gap-1 text-xs font-semibold text-primary neu-inset rounded-full px-3 py-1">
            <span className="material-symbols-outlined text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>crown</span>
            Leader
          </span>
        )}
      </div>

      {isLeader && (
        <div className="flex items-center gap-2 mb-4">
          <span className="font-mono text-sm text-primary neu-inset rounded-lg px-3 py-2 flex-1 truncate bg-[#e0e5eb]">
            {teamCode}
          </span>
          <button
            onClick={copyInviteLink}
            className="neu-button text-xs px-3 py-2 rounded-lg text-primary flex items-center gap-1.5 whitespace-nowrap"
          >
            <span className="material-symbols-outlined text-sm">content_copy</span>
            {copied ? "Copied!" : "Copy Link"}
          </button>
        </div>
      )}

      <div>
        <p className="text-xs font-semibold uppercase tracking-wider text-on-surface-variant mb-2">
          Roster ({roster.length}/{teamSize})
        </p>
        <ul className="space-y-1.5">
          {roster.map((member) => (
            <li key={member.id} className="flex items-center gap-2 text-sm text-on-surface-variant neu-inset rounded-lg px-3 py-1.5 bg-[#e0e5eb]">
              <span className="material-symbols-outlined text-sm text-outline">person</span>
              {member.profiles?.gamertag ?? "Unknown player"}
            </li>
          ))}
        </ul>
      </div>
    </NeuCard>
  );
}
