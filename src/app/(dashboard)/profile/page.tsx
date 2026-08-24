"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { NeonButton } from "@/components/ui/NeonButton";
import { RetroBadge } from "@/components/ui/RetroBadge";

interface GameIds { riot_id: string; bgmi_uid: string; valorant_id: string; }
interface Badge { id: string; badge_name: string; awarded_at: string; }

export default function ProfilePage() {
  const supabase = createClient();
  const router = useRouter();

  const [userId, setUserId] = useState<string | null>(null);
  const [gamertag, setGamertag] = useState("");
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [gameIds, setGameIds] = useState<GameIds>({ riot_id: "", bgmi_uid: "", valorant_id: "" });
  const [badges, setBadges] = useState<Badge[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    async function load() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { router.push("/login"); return; }
      setUserId(user.id);

      const { data: profile } = await supabase.from("profiles").select("gamertag, avatar_url, game_ids").eq("id", user.id).single();
      if (profile) {
        setGamertag(profile.gamertag ?? "");
        setAvatarUrl(profile.avatar_url ?? null);
        setGameIds({ riot_id: profile.game_ids?.riot_id ?? "", bgmi_uid: profile.game_ids?.bgmi_uid ?? "", valorant_id: profile.game_ids?.valorant_id ?? "" });
      }

      const { data: badgeRows } = await supabase.from("user_badges").select("id, badge_name, awarded_at").eq("user_id", user.id).order("awarded_at", { ascending: true });
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
    setSaving(true); setError(null); setSaved(false);

    let finalAvatarUrl = avatarUrl;
    if (avatarFile) {
      const ext = avatarFile.name.split(".").pop();
      const path = `${userId}/avatar.${ext}`;
      const { error: uploadError } = await supabase.storage.from("avatars").upload(path, avatarFile, { upsert: true });
      if (uploadError) { setError(uploadError.message); setSaving(false); return; }
      const { data: publicUrlData } = supabase.storage.from("avatars").getPublicUrl(path);
      finalAvatarUrl = `${publicUrlData.publicUrl}?t=${Date.now()}`;
    }

    const { error: updateError } = await supabase.from("profiles").update({ gamertag, avatar_url: finalAvatarUrl, game_ids: gameIds }).eq("id", userId);
    setSaving(false);
    if (updateError) { setError(updateError.message); return; }
    setAvatarUrl(finalAvatarUrl);
    setSaved(true);
  }

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center text-on-surface-variant">Loading profile...</div>;
  }

  const inputClass = "w-full rounded-xl neu-inset bg-[#e0e5eb] px-4 py-2.5 outline-none focus:ring-2 focus:ring-primary/40 text-on-surface transition-all";
  const labelClass = "block text-xs font-semibold uppercase tracking-wider text-on-surface-variant mb-1";

  return (
    <div className="max-w-lg mx-auto">
      <div className="neu-extruded rounded-3xl p-8 bg-surface">
        <h1 className="text-3xl font-extrabold text-on-surface mb-6 tracking-tight">Your Profile</h1>

        <form onSubmit={handleSave} className="space-y-5">
          {/* Avatar */}
          <div className="flex items-center gap-4">
            <div className="w-20 h-20 rounded-full overflow-hidden neu-extruded border-4 border-surface flex items-center justify-center bg-surface-container">
              {avatarUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
              ) : (
                <span className="material-symbols-outlined text-4xl text-on-surface-variant">person</span>
              )}
            </div>
            <label className="cursor-pointer neu-button rounded-xl px-4 py-2 text-sm font-semibold text-primary flex items-center gap-2">
              <span className="material-symbols-outlined text-sm">upload</span>
              Upload Avatar
              <input type="file" accept="image/png,image/jpeg,image/webp" onChange={handleAvatarChange} className="hidden" />
            </label>
          </div>

          <div>
            <label className={labelClass}>Gamertag</label>
            <input type="text" required value={gamertag} onChange={(e) => setGamertag(e.target.value)} className={inputClass} />
          </div>

          <div className="grid grid-cols-1 gap-4">
            {[
              { label: "Riot ID", key: "riot_id" as const, placeholder: "Player#1234" },
              { label: "BGMI UID", key: "bgmi_uid" as const, placeholder: "512345678" },
              { label: "Valorant ID", key: "valorant_id" as const, placeholder: "Player#5678" },
            ].map(({ label, key, placeholder }) => (
              <div key={key}>
                <label className={labelClass}>{label}</label>
                <input type="text" value={gameIds[key]} onChange={(e) => setGameIds({ ...gameIds, [key]: e.target.value })} placeholder={placeholder} className={inputClass} />
              </div>
            ))}
          </div>

          {error && <p className="text-red-600 text-sm neu-inset rounded-xl px-3 py-2 bg-[#e0e5eb]">{error}</p>}
          {saved && <p className="text-green-600 text-sm neu-inset rounded-xl px-3 py-2 bg-[#e0e5eb]">Profile saved.</p>}

          <NeonButton type="submit" loading={saving} className="w-full">Save Profile</NeonButton>
        </form>

        {badges.length > 0 && (
          <div className="mt-8 pt-6 border-t border-surface-container-high">
            <p className="text-xs font-semibold uppercase tracking-wider text-on-surface-variant mb-4">Trophy Tray</p>
            <div className="grid grid-cols-4 gap-4">
              {badges.map((b) => <RetroBadge key={b.id} badgeName={b.badge_name} />)}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
