"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Users } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { TactileCard } from "@/components/ui/TactileCard";
import { TactileButton } from "@/components/ui/TactileButton";

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
        const { error: rpcError } = await supabase.rpc("join_team", { p_invite_code: trimmed });
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
        <TactileCard>
            <div className="flex items-center gap-2 text-accent text-xs uppercase tracking-wide mb-3">
                <Users size={14} />
                Join a Team
            </div>
            <form onSubmit={handleJoin} className="flex flex-col sm:flex-row gap-3">
                <input
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    placeholder="TRN-VAL-XXXX"
                    className="flex-1 min-h-12 neu-inset bg-surface-container-lowest rounded-lg px-4 outline-none font-mono tracking-wider uppercase text-on-surface placeholder:text-on-surface-variant/50 focus:shadow-[inset_6px_6px_12px_var(--neu-lo),inset_-6px_-6px_12px_var(--neu-hi),0_0_0_1px_var(--accent)]"
                />
                <TactileButton type="submit" variant="accent" loading={loading}>
                    Join
                </TactileButton>
            </form>
            {error && <p className="text-error text-sm neu-inset bg-surface-container-lowest rounded-lg px-3 py-2 mt-3">{error}</p>}
            {success && <p className="text-accent text-sm neu-inset bg-surface-container-lowest rounded-lg px-3 py-2 mt-3">You&apos;ve joined the team!</p>}
        </TactileCard>
    );
}