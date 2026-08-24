"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { NeonButton } from "@/components/ui/NeonButton";

export default function LoginPage() {
  const router = useRouter();
  const supabase = createClient();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null); setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (error) { setError(error.message); return; }
    router.push("/home"); router.refresh();
  }

  const inputClass = "w-full rounded-xl neu-inset bg-[#e0e5eb] px-4 py-2.5 outline-none focus:ring-2 focus:ring-primary/40 text-on-surface transition-all";
  const labelClass = "block text-xs font-semibold uppercase tracking-wider text-on-surface-variant mb-1";

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-surface">
      <div className="neu-extruded rounded-3xl p-8 w-full max-w-md bg-surface">
        <h1 className="text-4xl font-extrabold text-on-surface mb-1 tracking-tight">ProCEZ</h1>
        <p className="text-on-surface-variant text-base mb-6">Log in to your arena</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className={labelClass}>Email</label>
            <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@procez.gg" className={inputClass} />
          </div>
          <div>
            <label className={labelClass}>Password</label>
            <input type="password" required value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" className={inputClass} />
          </div>
          {error && <p className="text-red-600 text-sm neu-inset rounded-xl px-3 py-2 bg-[#e0e5eb]">{error}</p>}
          <NeonButton type="submit" loading={loading} className="w-full">Enter</NeonButton>
        </form>

        <p className="text-sm text-on-surface-variant mt-6 text-center">
          No account?{" "}
          <Link href="/register" className="text-primary font-semibold hover:underline">Register</Link>
        </p>
      </div>
    </div>
  );
}
