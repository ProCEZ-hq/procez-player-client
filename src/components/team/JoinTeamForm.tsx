"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { NeuCard } from "@/components/ui/GlassCard";
import { NeonButton } from "@/components/ui/NeonButton";

export function JoinTeamForm({ defaultCode = "" }: { defaultCode?: string }) {
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
    if (!trimmed) { setError("Enter a team code."); return; }

    setLoading(true);
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      router.push(`/login?next=${encodeURIComponent(`/join?code=${trimmed}`)}`);
      return;
    }

    const { error: rpcError } = await supabase.rpc("join_team", { p_invite_code: trimmed });
    setLoading(false);

    if (rpcError) { setError(rpcError.message); return; }

    setSuccess(true);
    setCode("");
    router.refresh();
  }

  return (
    <NeuCard>
      <div className="flex items-center gap-2 text-on-surface-variant text-xs font-semibold uppercase tracking-wider mb-3">
        <span className="material-symbols-outlined text-primary">group_add</span>
        Join a Team
      </div>
      <form onSubmit={handleJoin} className="flex flex-col sm:flex-row gap-3">
        <input
          value={code}
          onChange={(e) => setCode(e.target.value)}
          placeholder="TRN-VAL-XXXX"
          className="flex-1 rounded-xl neu-inset bg-[#e0e5eb] px-4 py-2.5 outline-none focus:ring-2 focus:ring-primary/40 font-mono tracking-wider uppercase text-on-surface"
        />
        <NeonButton type="submit" loading={loading}>Join</NeonButton>
      </form>
      {error && (
        <p className="text-red-600 text-sm neu-inset rounded-xl px-3 py-2 mt-3 bg-[#e0e5eb]">{error}</p>
      )}
      {success && (
        <p className="text-green-600 text-sm neu-inset rounded-xl px-3 py-2 mt-3 bg-[#e0e5eb]">
          You&apos;ve joined the team!
        </p>
      )}
    </NeuCard>
  );
}
