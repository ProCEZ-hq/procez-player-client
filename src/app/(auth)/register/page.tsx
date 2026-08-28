"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { TactileCard } from "@/components/ui/TactileCard";
import { TactileButton } from "@/components/ui/TactileButton";
import { ThemeToggle } from "@/components/theme/ThemeToggle";
import { GoogleIcon } from "@/components/icons/GoogleIcon";
import { getSiteUrl } from "@/lib/site-url";

export default function RegisterPage() {
    const router = useRouter();
    const supabase = createClient();

    const [gamertag, setGamertag] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [googleLoading, setGoogleLoading] = useState(false);

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setError(null);
        setLoading(true);

        const { data, error } = await supabase.auth.signUp({
            email,
            password,
            options: { data: { gamertag } },
        });

        setLoading(false);

        if (error) {
            setError(error.message);
            return;
        }

        if (data.session) {
            router.push("/home");
            router.refresh();
            return;
        }

        setSuccess(true);
    }

    async function handleGoogleLogin() {
        setError(null);
        setGoogleLoading(true);
        const { error } = await supabase.auth.signInWithOAuth({
            provider: "google",
            options: { redirectTo: `${getSiteUrl()}/auth/callback` },
        });
        if (error) {
            setError(error.message);
            setGoogleLoading(false);
        }
    }

    const inputClasses =
        "w-full min-h-12 neu-inset bg-surface-container-lowest rounded-lg px-4 outline-none text-on-surface placeholder:text-on-surface-variant/50 focus:shadow-[inset_6px_6px_12px_var(--neu-lo),inset_-6px_-6px_12px_var(--neu-hi),0_0_0_1px_var(--accent)]";

    return (
        <div className="min-h-screen flex items-center justify-center px-4 bg-background">
            <ThemeToggle className="fixed top-4 right-4 md:top-6 md:right-6" />
            <TactileCard className="w-full max-w-md rounded-[2rem] p-8">
                <div className="w-11 h-11 rounded-full neu-inset flex items-center justify-center text-accent font-extrabold mb-6">
                    P
                </div>
                <h1 className="text-2xl font-extrabold tracking-tight text-on-surface mb-1">
                    Join Pro<span className="text-accent">CEZ</span>
                </h1>
                <p className="text-on-surface-variant text-sm mb-8">Create your competitor ID</p>

                {success ? (
                    <p className="text-accent text-sm neu-inset bg-surface-container-lowest rounded-lg px-4 py-3">
                        Check your inbox to confirm your email before logging in.
                    </p>
                ) : (
                    <>
                        <form onSubmit={handleSubmit} className="space-y-5">
                            <div>
                                <label className="block text-xs uppercase tracking-wide text-on-surface-variant mb-2">
                                    Gamertag
                                </label>
                                <input
                                    type="text"
                                    required
                                    minLength={3}
                                    maxLength={20}
                                    value={gamertag}
                                    onChange={(e) => setGamertag(e.target.value)}
                                    className={inputClasses}
                                    placeholder="ShadowStriker"
                                />
                            </div>

                            <div>
                                <label className="block text-xs uppercase tracking-wide text-on-surface-variant mb-2">
                                    Email
                                </label>
                                <input
                                    type="email"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className={inputClasses}
                                    placeholder="you@procez.gg"
                                />
                            </div>

                            <div>
                                <label className="block text-xs uppercase tracking-wide text-on-surface-variant mb-2">
                                    Password
                                </label>
                                <input
                                    type="password"
                                    required
                                    minLength={6}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className={inputClasses}
                                    placeholder="••••••••"
                                />
                            </div>

                            {error && (
                                <p className="text-error text-sm neu-inset bg-surface-container-lowest rounded-lg px-3 py-2">
                                    {error}
                                </p>
                            )}

                            <TactileButton type="submit" variant="accent" loading={loading} className="w-full">
                                Create Account
                            </TactileButton>
                        </form>

                        <div className="flex items-center gap-4 my-6">
                            <div className="flex-1 h-px bg-outline-variant/40" />
                            <span className="text-xs uppercase tracking-wide text-on-surface-variant">Or</span>
                            <div className="flex-1 h-px bg-outline-variant/40" />
                        </div>

                        <button
                            type="button"
                            onClick={handleGoogleLogin}
                            disabled={googleLoading}
                            className="neu-extruded neu-button w-full min-h-12 rounded-lg bg-surface text-on-surface font-semibold flex items-center justify-center gap-3 disabled:opacity-40 disabled:cursor-not-allowed"
                        >
                            <GoogleIcon className="w-5 h-5" />
                            {googleLoading ? "Redirecting..." : "Continue with Google"}
                        </button>
                    </>
                )}

                <p className="text-sm text-on-surface-variant mt-6 text-center">
                    Already competing?{" "}
                    <Link href="/login" className="text-accent hover:underline">
                        Log in
                    </Link>
                </p>
            </TactileCard>
        </div>
    );
}