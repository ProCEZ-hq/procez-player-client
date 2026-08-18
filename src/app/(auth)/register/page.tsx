"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { GlassCard } from "@/components/ui/GlassCard";
import { NeonButton } from "@/components/ui/NeonButton";

export default function RegisterPage() {
    const router = useRouter();
    const supabase = createClient();

    const [gamertag, setGamertag] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setError(null);
        setLoading(true);

        const { data, error } = await supabase.auth.signUp({
            email,
            password,
            options: {
                data: { gamertag },
            },
        });

        setLoading(false);

        if (error) {
            setError(error.message);
            return;
        }

        if (data.session) {
            router.push("/profile");
            router.refresh();
            return;
        }

        // Email confirmation flow enabled
        setSuccess(true);
    }

    return (
        <div className="min-h-screen flex items-center justify-center px-4">
            <GlassCard glow="magenta" className="w-full max-w-md">
                <h1 className="text-2xl font-display font-bold text-glow-magenta mb-1">
                    Join ProCEZ
                </h1>
                <p className="text-white/50 text-sm mb-6">Create your competitor ID</p>

                {success ? (
                    <p className="text-neon-lime text-sm border border-neon-lime/30 bg-neon-lime/10 rounded-lg px-4 py-3">
                        Check your inbox to confirm your email before logging in.
                    </p>
                ) : (
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-xs uppercase tracking-wide text-white/60 mb-1">
                                Gamertag
                            </label>
                            <input
                                type="text"
                                required
                                minLength={3}
                                maxLength={20}
                                value={gamertag}
                                onChange={(e) => setGamertag(e.target.value)}
                                className="w-full rounded-lg bg-white/5 border border-white/10 px-4 py-2.5 outline-none focus:border-neon-magenta/60 transition-colors"
                                placeholder="ShadowStriker"
                            />
                        </div>

                        <div>
                            <label className="block text-xs uppercase tracking-wide text-white/60 mb-1">
                                Email
                            </label>
                            <input
                                type="email"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full rounded-lg bg-white/5 border border-white/10 px-4 py-2.5 outline-none focus:border-neon-magenta/60 transition-colors"
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
                                minLength={6}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full rounded-lg bg-white/5 border border-white/10 px-4 py-2.5 outline-none focus:border-neon-magenta/60 transition-colors"
                                placeholder="••••••••"
                            />
                        </div>

                        {error && (
                            <p className="text-neon-magenta text-sm border border-neon-magenta/30 bg-neon-magenta/10 rounded-lg px-3 py-2">
                                {error}
                            </p>
                        )}

                        <NeonButton type="submit" variant="magenta" loading={loading} className="w-full">
                            Create Account
                        </NeonButton>
                    </form>
                )}

                <p className="text-sm text-white/50 mt-6 text-center">
                    Already competing?{" "}
                    <Link href="/login" className="text-neon-magenta hover:underline">
                        Log in
                    </Link>
                </p>
            </GlassCard>
        </div>
    );
}