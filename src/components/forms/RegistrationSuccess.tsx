"use client";

import { useEffect, useRef, useState } from "react";
import { CheckCircle2, Loader2, Copy } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { TactileCard } from "@/components/ui/TactileCard";

interface RegistrationSuccessProps {
    orderId: string;
    tournamentName: string;
}
type PollState = "polling" | "confirmed" | "timeout";
const POLL_INTERVAL_MS = 3000;
const POLL_TIMEOUT_MS = 2 * 60 * 1000;

export function RegistrationSuccess({ orderId, tournamentName }: RegistrationSuccessProps) {
    const supabase = createClient();
    const [status, setStatus] = useState<PollState>("polling");
    const [teamCode, setTeamCode] = useState<string | null>(null);
    const [copied, setCopied] = useState(false);
    const startedAt = useRef(Date.now());

    useEffect(() => {
        let cancelled = false;
        let timer: ReturnType<typeof setTimeout>;
        async function poll() {
            const { data, error } = await supabase.from("orders").select("status, team_code").eq("id", orderId).single();
            if (cancelled) return;
            if (!error && data?.status === "PAID" && data.team_code) {
                setTeamCode(data.team_code);
                setStatus("confirmed");
                return;
            }
            if (Date.now() - startedAt.current > POLL_TIMEOUT_MS) {
                setStatus("timeout");
                return;
            }
            timer = setTimeout(poll, POLL_INTERVAL_MS);
        }
        poll();
        return () => {
            cancelled = true;
            clearTimeout(timer);
        };
    }, [orderId, supabase]);

    function copyCode() {
        if (!teamCode) return;
        navigator.clipboard.writeText(teamCode);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    }

    if (status === "polling") {
        return (
            <TactileCard className="text-center py-10">
                <Loader2 className="animate-spin mx-auto mb-4 text-accent" size={28} />
                <p className="text-on-surface">Confirming your payment for {tournamentName}...</p>
                <p className="text-on-surface-variant text-sm mt-2">This usually takes a few seconds.</p>
            </TactileCard>
        );
    }

    if (status === "timeout") {
        return (
            <TactileCard className="text-center py-10">
                <p className="text-on-surface">
                    Your payment is still being confirmed. Refresh this page in a minute — your team code will appear here once it&apos;s ready.
                </p>
            </TactileCard>
        );
    }

    return (
        <TactileCard className="text-center py-10">
            <CheckCircle2 className="mx-auto mb-4 text-accent" size={36} />
            <h3 className="text-xl font-extrabold text-on-surface mb-1">You&apos;re registered!</h3>
            <p className="text-on-surface-variant text-sm mb-6">{tournamentName}</p>
            <div className="inline-flex items-center gap-3 neu-inset bg-surface-container-lowest rounded-xl px-5 py-3">
                <span className="font-mono text-lg tracking-wider text-accent">{teamCode}</span>
                <button
                    onClick={copyCode}
                    className="text-on-surface-variant hover:text-accent transition-colors min-w-12 min-h-12 flex items-center justify-center"
                    aria-label="Copy team code"
                >
                    <Copy size={16} />
                </button>
            </div>
            {copied && <p className="text-accent text-xs mt-2">Copied!</p>}
        </TactileCard>
    );
}