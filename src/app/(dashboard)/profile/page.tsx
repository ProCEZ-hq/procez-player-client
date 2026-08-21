"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { GlassCard } from "@/components/ui/GlassCard";
import { NeonButton } from "@/components/ui/NeonButton";
import { Upload, User } from "lucide-react";
import { RetroBadge } from "@/components/ui/RetroBadge";

interface GameIds {
    riot_id: string;
    bgmi_uid: string;
    valorant_id: string;
}

interface Badge {
    id: string;
    badge_name: string;
    awarded_at: string;
}

export default function ProfilePage() {
    const supabase = createClient();
    const router = useRouter();

    const [userId, setUserId] = useState<string | null>(null);
    const [gamertag, setGamertag] = useState("");
    const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
    const [avatarFile, setAvatarFile] = useState<File | null>(null);
    const [gameIds, setGameIds] = useState<GameIds>({
        riot_id: "",
        bgmi_uid: "",
        valorant_id: "",
    });
    const [badges, setBadges] = useState<Badge[]>([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [saved, setSaved] = useState(false);

    useEffect(() => {
        async function load() {
            const {
                data: { user },
            } = await supabase.auth.getUser();

            if (!user) {
                router.push("/login");
                return;
            }

            setUserId(user.id);

            const { data: profile } = await supabase
                .from("profiles")
                .select("gamertag, avatar_url, game_ids")
                .eq("id", user.id)
                .single();

            if (profile) {
                setGamertag(profile.gamertag ?? "");
                setAvatarUrl(profile.avatar_url ?? null);
                setGameIds({
                    riot_id: profile.game_ids?.riot_id ?? "",
                    bgmi_uid: profile.game_ids?.bgmi_uid ?? "",
                    valorant_id: profile.game_ids?.valorant_id ?? "",
                });
            }

            const { data: badgeRows } = await supabase
                .from("user_badges")
                .select("id, badge_name, awarded_at")
                .eq("user_id", user.id)
                .order("awarded_at", { ascending: true });
                    
            setBadges(badgeRows ?? []);


            setLoading(false);
        }

        load();
    }, [router, supabase]);

    function handleAvatarChange(e: React.ChangeEvent<HTMLInputElement>) {
        const file = e.target.files?.[0];
        if (!file) return;
        setAvatarFile(file);
        setAvatarUrl(URL.createObjectURL(file));
    }

    async function handleSave(e: React.FormEvent) {
        e.preventDefault();
        if (!userId) return;

        setSaving(true);
        setError(null);
        setSaved(false);

        let finalAvatarUrl = avatarUrl;

        if (avatarFile) {
            const ext = avatarFile.name.split(".").pop();
            const path = `${userId}/avatar.${ext}`;

            const { error: uploadError } = await supabase.storage
                .from("avatars")
                .upload(path, avatarFile, { upsert: true });

            if (uploadError) {
                setError(uploadError.message);
                setSaving(false);
                return;
            }

            const { data: publicUrlData } = supabase.storage
                .from("avatars")
                .getPublicUrl(path);

            finalAvatarUrl = `${publicUrlData.publicUrl}?t=${Date.now()}`;
        }

        const { error: updateError } = await supabase
            .from("profiles")
            .update({
                gamertag,
                avatar_url: finalAvatarUrl,
                game_ids: gameIds,
            })
            .eq("id", userId);

        setSaving(false);

        if (updateError) {
            setError(updateError.message);
            return;
        }

        setAvatarUrl(finalAvatarUrl);
        setSaved(true);
    }

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center text-white/50">
                Loading profile...
            </div>
        );
    }

    return (
        <div className="min-h-screen flex items-center justify-center px-4 py-12">
            <GlassCard glow="cyan" className="w-full max-w-lg">
                <h1 className="text-2xl font-display font-bold text-glow-cyan mb-6">
                    Set Up Your Profile
                </h1>

                <form onSubmit={handleSave} className="space-y-5">
                    <div className="flex items-center gap-4">
                        <div className="w-20 h-20 rounded-full overflow-hidden border-2 border-neon-cyan/40 bg-white/5 flex items-center justify-center">
                            {avatarUrl ? (
                                // eslint-disable-next-line @next/next/no-img-element
                                <img src={avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
                            ) : (
                                <User className="text-white/30" size={32} />
                            )}
                        </div>
                        <label className="cursor-pointer inline-flex items-center gap-2 text-sm text-neon-cyan border border-neon-cyan/30 rounded-lg px-4 py-2 hover:bg-neon-cyan/10 transition-colors">
                            <Upload size={16} />
                            Upload Avatar
                            <input
                                type="file"
                                accept="image/png,image/jpeg,image/webp"
                                onChange={handleAvatarChange}
                                className="hidden"
                            />
                        </label>
                    </div>

                    <div>
                        <label className="block text-xs uppercase tracking-wide text-white/60 mb-1">
                            Gamertag
                        </label>
                        <input
                            type="text"
                            required
                            value={gamertag}
                            onChange={(e) => setGamertag(e.target.value)}
                            className="w-full rounded-lg bg-white/5 border border-white/10 px-4 py-2.5 outline-none focus:border-neon-cyan/60 transition-colors"
                        />
                    </div>

                    <div className="grid grid-cols-1 gap-4">
                        <div>
                            <label className="block text-xs uppercase tracking-wide text-white/60 mb-1">
                                Riot ID
                            </label>
                            <input
                                type="text"
                                value={gameIds.riot_id}
                                onChange={(e) => setGameIds({ ...gameIds, riot_id: e.target.value })}
                                placeholder="Player#1234"
                                className="w-full rounded-lg bg-white/5 border border-white/10 px-4 py-2.5 outline-none focus:border-neon-cyan/60 transition-colors"
                            />
                        </div>
                        <div>
                            <label className="block text-xs uppercase tracking-wide text-white/60 mb-1">
                                BGMI UID
                            </label>
                            <input
                                type="text"
                                value={gameIds.bgmi_uid}
                                onChange={(e) => setGameIds({ ...gameIds, bgmi_uid: e.target.value })}
                                placeholder="512345678"
                                className="w-full rounded-lg bg-white/5 border border-white/10 px-4 py-2.5 outline-none focus:border-neon-cyan/60 transition-colors"
                            />
                        </div>
                        <div>
                            <label className="block text-xs uppercase tracking-wide text-white/60 mb-1">
                                Valorant ID
                            </label>
                            <input
                                type="text"
                                value={gameIds.valorant_id}
                                onChange={(e) => setGameIds({ ...gameIds, valorant_id: e.target.value })}
                                placeholder="Player#5678"
                                className="w-full rounded-lg bg-white/5 border border-white/10 px-4 py-2.5 outline-none focus:border-neon-cyan/60 transition-colors"
                            />
                        </div>
                    </div>

                    {error && (
                        <p className="text-neon-magenta text-sm border border-neon-magenta/30 bg-neon-magenta/10 rounded-lg px-3 py-2">
                            {error}
                        </p>
                    )}
                    {saved && (
                        <p className="text-neon-lime text-sm border border-neon-lime/30 bg-neon-lime/10 rounded-lg px-3 py-2">
                            Profile saved.
                        </p>
                    )}

                    <NeonButton type="submit" loading={saving} className="w-full">
                        Save Profile
                    </NeonButton>
                </form>

                {badges.length > 0 && (
                    <div className="mt-8 pt-6 border-t border-white/10">
                    <p className="text-xs uppercase tracking-wide text-white/50 mb-3">
                        Badges Earned
                    </p>
                    <div className="flex flex-wrap gap-3">
                        {badges.map((b) => (
                        <RetroBadge key={b.id} badgeName={b.badge_name} />
                        ))}
                    </div>
                    </div>
                )}
            </GlassCard>
        </div>
    );
}