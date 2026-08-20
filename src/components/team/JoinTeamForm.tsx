"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Users } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { GlassCard } from "@/components/ui/GlassCard";
import { NeonButton } from "@/components/ui/NeonButton";

interface JoinTeamFormProps {
    defaultCode?: string;
}

export function JoinTeamForm({ defaultCode = "" }: JoinTeamFormProps) {
    const router = useRouter();
    const supabase = createClient();

    const [code, setCode] = useState(defaultCode);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);

    async function handleJoin(e: React.FormEvent) {
        e.preventDefault();
        setError(null);
        setSuccess(false);

        const trimmed = code.trim().toUpperCase();
        if (!trimmed) {
            setError("Enter a team code.");
            return;
        }

        setLoading(true);

        const {
            data: { user },
        } = await supabase.auth.getUser();

        if (!user) {
            router.push(`/login?next=${encodeURIComponent(`/join?code=${trimmed}`)}`);
            return;
        }

        const { error: rpcError } = await supabase.rpc("join_team", {
            p_invite_code: trimmed,
        });

        setLoading(false);

        if (rpcError) {
            setError(rpcError.message);
            return;
        }

        setSuccess(true);
        setCode("");
        router.refresh();
    }

    return (
        <GlassCard glow="cyan">
            <div className="flex items-center gap-2 text-neon-cyan text-xs uppercase tracking-wide mb-3">
                <Users size={14} />
                Join a Team
            </div>
            <form onSubmit={handleJoin} className="flex flex-col sm:flex-row gap-3">
                <input
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    placeholder="TRN-VAL-XXXX"
                    className="flex-1 rounded-lg bg-white/5 border border-white/10 px-4 py-2.5 outline-none focus:border-neon-cyan/60 font-mono tracking-wider uppercase"
                />
                <NeonButton type="submit" loading={loading}>
                    Join
                </NeonButton>
            </form>
            {error && (
                <p className="text-neon-magenta text-sm border border-neon-magenta/30 bg-neon-magenta/10 rounded-lg px-3 py-2 mt-3">
                    {error}
                </p>
            )}
            {success && (
                <p className="text-neon-lime text-sm border border-neon-lime/30 bg-neon-lime/10 rounded-lg px-3 py-2 mt-3">
                    You&apos;ve joined the team!
                </p>
            )}
        </GlassCard>
    );
}