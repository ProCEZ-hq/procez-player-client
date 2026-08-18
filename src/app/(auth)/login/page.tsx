"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { GlassCard } from "@/components/ui/GlassCard";
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
        setError(null);
        setLoading(true);

        const { error } = await supabase.auth.signInWithPassword({
            email,
            password,
        });

        setLoading(false);

        if (error) {
            setError(error.message);
            return;
        }

        router.push("/profile");
        router.refresh();
    }

    return (
        <div className="min-h-screen flex items-center justify-center px-4">
            <GlassCard glow="cyan" className="w-full max-w-md">
                <h1 className="text-2xl font-display font-bold text-glow-cyan mb-1">
                    ProCEZ
                </h1>
                <p className="text-white/50 text-sm mb-6">Log in to your arena</p>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-xs uppercase tracking-wide text-white/60 mb-1">
                            Email
                        </label>
                        <input
                            type="email"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full rounded-lg bg-white/5 border border-white/10 px-4 py-2.5 outline-none focus:border-neon-cyan/60 transition-colors"
                            placeholder="you@procez.gg"
                        />
                    </div>

                    <div>
                        <label className="block text-xs uppercase tracking-wide text-white/60 mb-1">
                            Password
                        </label>
                        <input
                            type="password"
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full rounded-lg bg-white/5 border border-white/10 px-4 py-2.5 outline-none focus:border-neon-cyan/60 transition-colors"
                            placeholder="••••••••"
                        />
                    </div>

                    {error && (
                        <p className="text-neon-magenta text-sm border border-neon-magenta/30 bg-neon-magenta/10 rounded-lg px-3 py-2">
                            {error}
                        </p>
                    )}

                    <NeonButton type="submit" loading={loading} className="w-full">
                        Enter
                    </NeonButton>
                </form>

                <p className="text-sm text-white/50 mt-6 text-center">
                    No account?{" "}
                    <Link href="/register" className="text-neon-cyan hover:underline">
                        Register
                    </Link>
                </p>
            </GlassCard>
        </div>
    );
}