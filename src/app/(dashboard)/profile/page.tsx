"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { TactileCard } from "@/components/ui/TactileCard";
import { TactileButton } from "@/components/ui/TactileButton";
import { TrophyBadge } from "@/components/ui/TrophyBadge";
import { Upload, User as UserIcon, Trophy } from "lucide-react";

interface GameIds {
    riot_id: string;
    bgmi_uid: string;
    valorant_id: string;
    /** No dedicated `bio` column exists yet, and this phase is scoped to
     *  frontend-only changes — bio persists inside the existing flexible
     *  game_ids JSONB rather than requiring a schema migration. */
    bio: string;
}

interface Badge {
    id: string;
    badge_name: string;
}

const inputBase =
    "w-full neu-inset bg-surface-container-lowest rounded-lg px-4 outline-none text-on-surface placeholder:text-on-surface-variant/50 focus:shadow-[inset_6px_6px_12px_var(--neu-lo),inset_-6px_-6px_12px_var(--neu-hi),0_0_0_1px_var(--accent)]";

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
        bio: "",
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
                router.push("/login?next=/profile");
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
                    bio: profile.game_ids?.bio ?? "",
                });
            }

            const { data: badgeRows } = await supabase
                .from("user_badges")
                .select("id, badge_name")
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

            const { data: publicUrlData } = supabase.storage.from("avatars").getPublicUrl(path);
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
            <div className="min-h-screen flex items-center justify-center text-on-surface-variant">
                Loading profile...
            </div>
        );
    }

    return (
        <form onSubmit={handleSave} className="p-container-padding max-w-6xl mx-auto space-y-container-padding">
            <div>
                <h1 className="text-3xl font-extrabold tracking-tight text-on-surface mb-1">Your Profile</h1>
                <p className="text-on-surface-variant">Identity, gaming IDs, and everything opponents see.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-container-padding items-start">
                {/* Module A — Identity */}
                <TactileCard className="lg:col-span-4 rounded-[2rem] flex flex-col items-center text-center">
                    <div className="relative mb-6 mt-2">
                        <div className="w-28 h-28 rounded-full neu-inset bg-surface-container-lowest flex items-center justify-center overflow-hidden">
                            {avatarUrl ? (
                                // eslint-disable-next-line @next/next/no-img-element
                                <img src={avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
                            ) : (
                                <UserIcon className="text-on-surface-variant/40" size={36} />
                            )}
                        </div>
                        <label className="absolute bottom-0 right-0 w-10 h-10 rounded-full neu-extruded neu-button bg-surface flex items-center justify-center text-accent cursor-pointer">
                            <Upload size={16} />
                            <input
                                type="file"
                                accept="image/png,image/jpeg,image/webp"
                                onChange={handleAvatarChange}
                                className="hidden"
                            />
                        </label>
                    </div>

                    <div className="w-full text-left mb-5">
                        <label className="block text-xs uppercase tracking-wide text-on-surface-variant mb-2">
                            Gamertag
                        </label>
                        <input
                            type="text"
                            required
                            value={gamertag}
                            onChange={(e) => setGamertag(e.target.value)}
                            className={`${inputBase} min-h-12`}
                        />
                    </div>

                    <div className="w-full text-left">
                        <label className="block text-xs uppercase tracking-wide text-on-surface-variant mb-2">
                            Bio / Status
                        </label>
                        <textarea
                            value={gameIds.bio}
                            onChange={(e) => setGameIds({ ...gameIds, bio: e.target.value })}
                            rows={4}
                            maxLength={160}
                            placeholder="Sentinel main. LFT for ranked."
                            className={`${inputBase} min-h-24 py-3 resize-none`}
                        />
                    </div>
                </TactileCard>

                {/* Module B — Game Integrations */}
                <TactileCard className="lg:col-span-8 rounded-[2rem]">
                    <h2 className="text-xs uppercase tracking-widest text-on-surface-variant mb-6">
                        Game Integrations
                    </h2>

                    <div className="space-y-5">
                        <div>
                            <label className="block text-xs uppercase tracking-wide text-on-surface-variant mb-2">
                                Riot ID
                            </label>
                            <input
                                type="text"
                                value={gameIds.riot_id}
                                onChange={(e) => setGameIds({ ...gameIds, riot_id: e.target.value })}
                                placeholder="Player#1234"
                                className={`${inputBase} min-h-12`}
                            />
                        </div>
                        <div>
                            <label className="block text-xs uppercase tracking-wide text-on-surface-variant mb-2">
                                BGMI UID
                            </label>
                            <input
                                type="text"
                                value={gameIds.bgmi_uid}
                                onChange={(e) => setGameIds({ ...gameIds, bgmi_uid: e.target.value })}
                                placeholder="512345678"
                                className={`${inputBase} min-h-12`}
                            />
                        </div>
                        <div>
                            <label className="block text-xs uppercase tracking-wide text-on-surface-variant mb-2">
                                Valorant ID
                            </label>
                            <input
                                type="text"
                                value={gameIds.valorant_id}
                                onChange={(e) => setGameIds({ ...gameIds, valorant_id: e.target.value })}
                                placeholder="Player#5678"
                                className={`${inputBase} min-h-12`}
                            />
                        </div>
                    </div>

                    {error && (
                        <p className="text-error text-sm neu-inset bg-surface-container-lowest rounded-lg px-3 py-2 mt-5">
                            {error}
                        </p>
                    )}
                    {saved && (
                        <p className="text-accent text-sm neu-inset bg-surface-container-lowest rounded-lg px-3 py-2 mt-5">
                            Profile saved.
                        </p>
                    )}

                    <TactileButton type="submit" variant="accent" loading={saving} className="w-full mt-6">
                        Save Profile
                    </TactileButton>
                </TactileCard>
            </div>

            {/* Trophy case — carried over from the previous profile page rather
          than dropped, even though it wasn't one of this phase's two
          named modules. */}
            {badges.length > 0 && (
                <TactileCard className="rounded-[2rem]">
                    <h2 className="text-xs uppercase tracking-widest text-on-surface-variant mb-6">
                        Badges Earned
                    </h2>
                    <div className="grid grid-cols-3 sm:grid-cols-6 gap-6">
                        {badges.map((b) => (
                            <TrophyBadge key={b.id} label={b.badge_name} icon={<Trophy size={18} />} />
                        ))}
                    </div>
                </TactileCard>
            )}
        </form>
    );
}