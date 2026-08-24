"use client";

import { useEffect, useRef, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { NeuCard } from "@/components/ui/GlassCard";

interface RegistrationSuccessProps { orderId: string; tournamentName: string; }
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
      if (!error && data?.status === "PAID" && data.team_code) { setTeamCode(data.team_code); setStatus("confirmed"); return; }
      if (Date.now() - startedAt.current > POLL_TIMEOUT_MS) { setStatus("timeout"); return; }
      timer = setTimeout(poll, POLL_INTERVAL_MS);
    }

    poll();
    return () => { cancelled = true; clearTimeout(timer); };
  }, [orderId, supabase]);

  function copyCode() {
    if (!teamCode) return;
    navigator.clipboard.writeText(teamCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  if (status === "polling") {
    return (
      <NeuCard className="text-center py-10">
        <span className="material-symbols-outlined text-primary text-5xl animate-spin block mx-auto mb-4">progress_activity</span>
        <p className="text-on-surface-variant">Confirming your payment for {tournamentName}...</p>
        <p className="text-outline text-sm mt-2">This usually takes a few seconds.</p>
      </NeuCard>
    );
  }

  if (status === "timeout") {
    return (
      <NeuCard className="text-center py-10">
        <p className="text-on-surface-variant">
          Your payment is still being confirmed. Refresh this page in a minute — your team code will appear once it&apos;s ready.
        </p>
      </NeuCard>
    );
  }

  return (
    <NeuCard className="text-center py-10">
      <span className="material-symbols-outlined text-5xl text-primary block mx-auto mb-4" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
      <h3 className="text-2xl font-bold text-on-surface mb-1">You&apos;re registered!</h3>
      <p className="text-on-surface-variant text-sm mb-6">{tournamentName}</p>
      <div className="inline-flex items-center gap-3 neu-inset rounded-xl px-5 py-3 bg-[#e0e5eb]">
        <span className="font-mono text-lg tracking-wider text-primary">{teamCode}</span>
        <button onClick={copyCode} className="neu-button w-8 h-8 rounded-full flex items-center justify-center text-on-surface-variant hover:text-primary" aria-label="Copy team code">
          <span className="material-symbols-outlined text-sm">content_copy</span>
        </button>
      </div>
      {copied && <p className="text-green-600 text-xs mt-2">Copied!</p>}
    </NeuCard>
  );
}
